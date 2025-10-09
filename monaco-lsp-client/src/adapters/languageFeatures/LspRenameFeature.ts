import * as monaco from 'monaco-editor-core';
import { capabilities, RenameRegistrationOptions } from '../../../src/types';
import { Disposable } from '../../utils';
import { LspConnection } from '../LspConnection';
import { toMonacoLanguageSelector } from './common';

export class LspRenameFeature extends Disposable {
    constructor(
        private readonly _connection: LspConnection,
    ) {
        super();

        this._register(this._connection.capabilities.addStaticClientCapabilities({
            textDocument: {
                rename: {
                    dynamicRegistration: true,
                    prepareSupport: true,
                }
            }
        }));

        this._register(this._connection.capabilities.registerCapabilityHandler(capabilities.textDocumentRename, true, capability => {
            return monaco.languages.registerRenameProvider(
                toMonacoLanguageSelector(capability.documentSelector),
                new LspRenameProvider(this._connection, capability),
            );
        }));
    }
}

class LspRenameProvider implements monaco.languages.RenameProvider {
    constructor(
        private readonly _client: LspConnection,
        private readonly _capabilities: RenameRegistrationOptions,
    ) { }

    async provideRenameEdits(
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        newName: string,
        token: monaco.CancellationToken
    ): Promise<monaco.languages.WorkspaceEdit | null> {
        const translated = this._client.bridge.translate(model, position);

        const result = await this._client.server.textDocumentRename({
            textDocument: translated.textDocument,
            position: translated.position,
            newName,
        });

        if (!result) {
            return null;
        }

        return toMonacoWorkspaceEdit(result, this._client);
    }

    async resolveRenameLocation(
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        token: monaco.CancellationToken
    ): Promise<monaco.languages.RenameLocation | null> {
        if (!this._capabilities.prepareProvider) {
            return null;
        }

        const translated = this._client.bridge.translate(model, position);

        const result = await this._client.server.textDocumentPrepareRename({
            textDocument: translated.textDocument,
            position: translated.position,
        });

        if (!result) {
            return null;
        }

        if ('range' in result && 'placeholder' in result) {
            return {
                range: this._client.bridge.translateBackRange(translated.textDocument, result.range).range,
                text: result.placeholder,
            };
        } else if ('defaultBehavior' in result) {
            return null;
        } else if ('start' in result && 'end' in result) {
            const range = this._client.bridge.translateBackRange(translated.textDocument, result).range;
            return {
                range,
                text: model.getValueInRange(range),
            };
        }

        return null;
    }
}

function toMonacoWorkspaceEdit(
    edit: any,
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
                // TextDocumentEdit
                const uri = change.textDocument.uri;
                for (const textEdit of change.edits) {
                    const translated = client.bridge.translateBackRange({ uri }, textEdit.range);
                    edits.push({
                        resource: translated.textModel.uri,
                        versionId: change.textDocument.version,
                        textEdit: {
                            range: translated.range,
                            text: textEdit.newText,
                        },
                    });
                }
            }
            // TODO: Handle CreateFile, RenameFile, DeleteFile
        }
    }

    return { edits };
}
