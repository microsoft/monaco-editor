import * as monaco from 'monaco-editor-core';
import {
    capabilities,
    CodeAction,
    CodeActionRegistrationOptions,
    Command,
    Diagnostic,
    DiagnosticTag,
    WorkspaceEdit,
} from '../../../src/types';
import { Disposable } from '../../utils';
import { LspConnection } from '../LspConnection';
import {
    lspCodeActionKindToMonacoCodeActionKind,
    toLspCodeActionTriggerKind,
    toLspDiagnosticSeverity,
    toLspDiagnosticTag,
    toMonacoCodeActionKind,
    toMonacoCommand,
    toMonacoLanguageSelector,
} from './common';

export class LspCodeActionFeature extends Disposable {
    constructor(
        private readonly _connection: LspConnection,
    ) {
        super();

        this._register(this._connection.capabilities.addStaticClientCapabilities({
            textDocument: {
                codeAction: {
                    dynamicRegistration: true,
                    codeActionLiteralSupport: {
                        codeActionKind: {
                            valueSet: Array.from(lspCodeActionKindToMonacoCodeActionKind.keys()),
                        }
                    },
                    isPreferredSupport: true,
                    disabledSupport: true,
                    dataSupport: true,
                    resolveSupport: {
                        properties: ['edit'],
                    },
                }
            }
        }));

        this._register(this._connection.capabilities.registerCapabilityHandler(capabilities.textDocumentCodeAction, true, capability => {
            return monaco.languages.registerCodeActionProvider(
                toMonacoLanguageSelector(capability.documentSelector),
                new LspCodeActionProvider(this._connection, capability),
            );
        }));
    }
}

interface ExtendedCodeAction extends monaco.languages.CodeAction {
    _lspAction?: CodeAction;
}

class LspCodeActionProvider implements monaco.languages.CodeActionProvider {
    public readonly resolveCodeAction;

    constructor(
        private readonly _client: LspConnection,
        private readonly _capabilities: CodeActionRegistrationOptions,
    ) {
        if (_capabilities.resolveProvider) {
            this.resolveCodeAction = async (codeAction: ExtendedCodeAction, token: monaco.CancellationToken): Promise<ExtendedCodeAction> => {
                if (codeAction._lspAction) {
                    const resolved = await this._client.server.codeActionResolve(codeAction._lspAction);
                    if (resolved.edit) {
                        codeAction.edit = toMonacoWorkspaceEdit(resolved.edit, this._client);
                    }
                    if (resolved.command) {
                        codeAction.command = toMonacoCommand(resolved.command);
                    }
                }
                return codeAction;
            };
        }
    }

    async provideCodeActions(
        model: monaco.editor.ITextModel,
        range: monaco.Range,
        context: monaco.languages.CodeActionContext,
        token: monaco.CancellationToken
    ): Promise<monaco.languages.CodeActionList | null> {
        const translated = this._client.bridge.translate(model, range.getStartPosition());
        const cachedDiagnostics = this._client.diagnosticsCache.get(model.uri.toString());

        const result = await this._client.server.textDocumentCodeAction({
            textDocument: translated.textDocument,
            range: this._client.bridge.translateRange(model, range),
            context: {
                diagnostics: context.markers.map(marker =>
                    toLspDiagnosticForCodeAction(marker, model, this._client, cachedDiagnostics),
                ),
                triggerKind: toLspCodeActionTriggerKind(context.trigger),
            },
        });

        if (!result) {
            return null;
        }

        const actions = Array.isArray(result) ? result : [result];

        return {
            actions: actions.map(action => {
                if ('title' in action && !('kind' in action)) {
                    // Command
                    const cmd = action as Command;
                    const monacoAction: ExtendedCodeAction = {
                        title: cmd.title,
                        command: toMonacoCommand(cmd),
                    };
                    return monacoAction;
                } else {
                    // CodeAction
                    const codeAction = action as CodeAction;
                    const monacoAction: ExtendedCodeAction = {
                        title: codeAction.title,
                        kind: toMonacoCodeActionKind(codeAction.kind),
                        isPreferred: codeAction.isPreferred,
                        disabled: codeAction.disabled?.reason,
                        edit: codeAction.edit ? toMonacoWorkspaceEdit(codeAction.edit, this._client) : undefined,
                        command: toMonacoCommand(codeAction.command),
                        _lspAction: codeAction,
                    };
                    return monacoAction;
                }
            }),
            dispose: () => { },
        };
    }
}

/**
 * Build the `Diagnostic` we send to the server as part of
 * `textDocument/codeAction#context.diagnostics`.
 *
 * Servers (notably `ruff server`) require fields that don't survive the
 * round-trip through Monaco's `IMarker` — specifically `data`, which the LSP
 * spec mandates be round-tripped. We look up the original `Diagnostic` in
 * `DiagnosticsCache` by URI + range + message and forward it verbatim. For
 * markers that didn't come from this LSP session (e.g. set under a different
 * owner by another extension), we synthesize a Diagnostic that still passes
 * through `code` / `source` / `tags` / `relatedInformation` from `IMarker`.
 */
function toLspDiagnosticForCodeAction(
    marker: monaco.editor.IMarkerData,
    model: monaco.editor.ITextModel,
    client: LspConnection,
    cached: readonly Diagnostic[] | undefined,
): Diagnostic {
    const lspRange = client.bridge.translateRange(model, monaco.Range.lift(marker));
    const original = cached?.find(d =>
        d.range.start.line === lspRange.start.line &&
        d.range.start.character === lspRange.start.character &&
        d.range.end.line === lspRange.end.line &&
        d.range.end.character === lspRange.end.character &&
        d.message === marker.message
    );
    if (original) {
        return original;
    }
    const markerCode = marker.code;
    const code =
        markerCode === undefined
            ? undefined
            : typeof markerCode === 'string'
                ? markerCode
                : markerCode.value;
    return {
        range: lspRange,
        message: marker.message,
        severity: toLspDiagnosticSeverity(marker.severity),
        code,
        source: marker.source,
        tags: marker.tags?.map(tag => toLspDiagnosticTag(tag)).filter((tag): tag is DiagnosticTag => tag !== undefined),
    };
}

function toMonacoWorkspaceEdit(
    edit: WorkspaceEdit,
    client: LspConnection
): monaco.languages.WorkspaceEdit {
    const edits: monaco.languages.IWorkspaceTextEdit[] = [];

    if (edit.changes) {
        for (const uri in edit.changes) {
            const textEdits = edit.changes[uri];
            for (const textEdit of textEdits) {
                const translated = client.bridge.translateBackRange({ uri }, textEdit.range);
                edits.push({
                    resource: translated.textModel.uri,
                    versionId: undefined,
                    textEdit: {
                        range: translated.range,
                        text: textEdit.newText,
                    },
                });
            }
        }
    }

    if (edit.documentChanges) {
        for (const change of edit.documentChanges) {
            if ('textDocument' in change) {
                const uri = change.textDocument.uri;
                for (const textEdit of change.edits) {
                    const translated = client.bridge.translateBackRange({ uri }, textEdit.range);
                    edits.push({
                        resource: translated.textModel.uri,
                        versionId: change.textDocument.version ?? undefined,
                        textEdit: {
                            range: translated.range,
                            text: textEdit.newText,
                        },
                    });
                }
            }
        }
    }

    return { edits };
}
