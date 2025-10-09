import * as monaco from 'monaco-editor-core';
import { capabilities, InlayHintRegistrationOptions, InlayHint, MarkupContent, api } from '../../../src/types';
import { Disposable } from '../../utils';
import { LspConnection } from '../LspConnection';
import { toMonacoLanguageSelector } from './common';
import { assertTargetTextModel } from '../ITextModelBridge';
import { toMonacoCommand, toMonacoInlayHintKind } from './common';

export class LspInlayHintsFeature extends Disposable {
    private readonly _providers = new Set<LspInlayHintsProvider>();

    constructor(
        private readonly _connection: LspConnection,
    ) {
        super();

        this._register(this._connection.capabilities.addStaticClientCapabilities({
            textDocument: {
                inlayHint: {
                    dynamicRegistration: true,
                    resolveSupport: {
                        properties: ['tooltip', 'textEdits', 'label.tooltip', 'label.location', 'label.command'],
                    },
                }
            },
            workspace: {
                inlayHint: {
                    refreshSupport: true,
                }
            }
        }));

        this._register(this._connection.connection.registerRequestHandler(api.client.workspaceInlayHintRefresh, async () => {
            // Fire onDidChangeInlayHints for all providers
            for (const provider of this._providers) {
                provider.refresh();
            }
            return { ok: null };
        }));

        this._register(this._connection.capabilities.registerCapabilityHandler(capabilities.textDocumentInlayHint, true, capability => {
            const provider = new LspInlayHintsProvider(this._connection, capability);
            this._providers.add(provider);

            const disposable = monaco.languages.registerInlayHintsProvider(
                toMonacoLanguageSelector(capability.documentSelector),
                provider,
            );

            return {
                dispose: () => {
                    this._providers.delete(provider);
                    disposable.dispose();
                }
            };
        }));
    }
}

interface ExtendedInlayHint extends monaco.languages.InlayHint {
    _lspInlayHint: InlayHint;
    _targetUri: string;
}

class LspInlayHintsProvider implements monaco.languages.InlayHintsProvider {
    private readonly _onDidChangeInlayHints = new monaco.Emitter<void>();
    public readonly onDidChangeInlayHints = this._onDidChangeInlayHints.event;

    public readonly resolveInlayHint;

    constructor(
        private readonly _client: LspConnection,
        private readonly _capabilities: InlayHintRegistrationOptions,
    ) {
        if (_capabilities.resolveProvider) {
            this.resolveInlayHint = async (hint: ExtendedInlayHint, token: monaco.CancellationToken): Promise<monaco.languages.InlayHint> => {

                const resolved = await this._client.server.inlayHintResolve(hint._lspInlayHint);

                if (resolved.tooltip) {
                    hint.tooltip = toMonacoTooltip(resolved.tooltip);
                }

                if (resolved.label !== hint._lspInlayHint.label) {
                    hint.label = toLspInlayHintLabel(resolved.label);
                }

                if (resolved.textEdits) {
                    hint.textEdits = resolved.textEdits.map(edit => {
                        const translated = this._client.bridge.translateBackRange(
                            { uri: hint._targetUri },
                            edit.range
                        );
                        return {
                            range: translated.range,
                            text: edit.newText,
                        };
                    });
                }

                return hint;
            };
        }
    }

    public refresh(): void {
        this._onDidChangeInlayHints.fire();
    }

    async provideInlayHints(
        model: monaco.editor.ITextModel,
        range: monaco.Range,
        token: monaco.CancellationToken
    ): Promise<monaco.languages.InlayHintList | null> {
        const translated = this._client.bridge.translate(model, range.getStartPosition());

        const result = await retryOnContentModified(async () =>
            await this._client.server.textDocumentInlayHint({
                textDocument: translated.textDocument,
                range: this._client.bridge.translateRange(model, range),
            })
        );

        if (!result) {
            return null;
        }

        return {
            hints: result.map(hint => {
                const monacoHint: ExtendedInlayHint = {
                    label: toLspInlayHintLabel(hint.label),
                    position: assertTargetTextModel(
                        this._client.bridge.translateBack(translated.textDocument, hint.position),
                        model
                    ).position,
                    kind: toMonacoInlayHintKind(hint.kind),
                    tooltip: toMonacoTooltip(hint.tooltip),
                    paddingLeft: hint.paddingLeft,
                    paddingRight: hint.paddingRight,
                    textEdits: hint.textEdits?.map(edit => ({
                        range: assertTargetTextModel(
                            this._client.bridge.translateBackRange(translated.textDocument, edit.range),
                            model
                        ).range,
                        text: edit.newText,
                    })),
                    _lspInlayHint: hint,
                    _targetUri: translated.textDocument.uri,
                };
                return monacoHint;
            }),
            dispose: () => { },
        };
    }
}

async function retryOnContentModified<T>(cb: () => Promise<T>): Promise<T> {
    const nRetries = 3;
    for (let triesLeft = nRetries; ; triesLeft--) {
        try {
            return await cb();
        } catch (e: any) {
            if (e.message === 'content modified' && triesLeft > 0) {
                continue;
            }
            throw e;
        }
    }
}

function toLspInlayHintLabel(label: string | any[]): string | monaco.languages.InlayHintLabelPart[] {
    if (typeof label === 'string') {
        return label;
    }

    return label.map(part => {
        const monacoLabelPart: monaco.languages.InlayHintLabelPart = {
            label: part.value,
            tooltip: toMonacoTooltip(part.tooltip),
            command: toMonacoCommand(part.command),
        };

        if (part.location) {
            monacoLabelPart.location = {
                uri: monaco.Uri.parse(part.location.uri),
                range: new monaco.Range(
                    part.location.range.start.line + 1,
                    part.location.range.start.character + 1,
                    part.location.range.end.line + 1,
                    part.location.range.end.character + 1
                ),
            };
        }

        return monacoLabelPart;
    });
}

function toMonacoTooltip(tooltip: string | MarkupContent | undefined): string | monaco.IMarkdownString | undefined {
    if (!tooltip) {
        return undefined;
    }

    if (typeof tooltip === 'string') {
        return tooltip;
    }

    return {
        value: tooltip.value,
        isTrusted: true,
    };
}
