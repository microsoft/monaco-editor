import * as monaco from 'monaco-editor-core';
import { capabilities, SignatureHelpRegistrationOptions, MarkupContent, MarkupKind } from '../../../src/types';
import { Disposable } from '../../utils';
import { LspConnection } from '../LspConnection';
import { toMonacoLanguageSelector } from './common';
import { toLspSignatureHelpTriggerKind } from './common';

export class LspSignatureHelpFeature extends Disposable {
    constructor(
        private readonly _connection: LspConnection,
    ) {
        super();

        this._register(this._connection.capabilities.addStaticClientCapabilities({
            textDocument: {
                signatureHelp: {
                    dynamicRegistration: true,
                    contextSupport: true,
                    signatureInformation: {
                        documentationFormat: [MarkupKind.Markdown, MarkupKind.PlainText],
                        parameterInformation: {
                            labelOffsetSupport: true,
                        },
                        activeParameterSupport: true,
                    }
                }
            }
        }));

        this._register(this._connection.capabilities.registerCapabilityHandler(capabilities.textDocumentSignatureHelp, true, capability => {
            return monaco.languages.registerSignatureHelpProvider(
                toMonacoLanguageSelector(capability.documentSelector),
                new LspSignatureHelpProvider(this._connection, capability),
            );
        }));
    }
}

class LspSignatureHelpProvider implements monaco.languages.SignatureHelpProvider {
    public readonly signatureHelpTriggerCharacters?: readonly string[];
    public readonly signatureHelpRetriggerCharacters?: readonly string[];

    constructor(
        private readonly _client: LspConnection,
        private readonly _capabilities: SignatureHelpRegistrationOptions,
    ) {
        this.signatureHelpTriggerCharacters = _capabilities.triggerCharacters;
        this.signatureHelpRetriggerCharacters = _capabilities.retriggerCharacters;
    }

    async provideSignatureHelp(
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        token: monaco.CancellationToken,
        context: monaco.languages.SignatureHelpContext
    ): Promise<monaco.languages.SignatureHelpResult | null> {
        const translated = this._client.bridge.translate(model, position);

        const result = await this._client.server.textDocumentSignatureHelp({
            textDocument: translated.textDocument,
            position: translated.position,
            context: {
                triggerKind: toLspSignatureHelpTriggerKind(context.triggerKind),
                triggerCharacter: context.triggerCharacter,
                isRetrigger: context.isRetrigger,
            },
        });

        if (!result) {
            return null;
        }

        return {
            value: {
                signatures: result.signatures.map(sig => ({
                    label: sig.label,
                    documentation: toMonacoDocumentation(sig.documentation),
                    parameters: sig.parameters?.map(param => ({
                        label: param.label,
                        documentation: toMonacoDocumentation(param.documentation),
                    })) || [],
                    activeParameter: sig.activeParameter,
                })),
                activeSignature: result.activeSignature || 0,
                activeParameter: result.activeParameter || 0,
            },
            dispose: () => { },
        };
    }
}

function toMonacoDocumentation(
    doc: string | MarkupContent | undefined
): string | monaco.IMarkdownString | undefined {
    if (!doc) return undefined;
    if (typeof doc === 'string') return doc;
    return {
        value: doc.value,
        isTrusted: true,
    };
}
