import * as monaco from 'monaco-editor-core';
import { capabilities, DocumentFormattingRegistrationOptions } from '../../../src/types';
import { Disposable } from '../../utils';
import { LspConnection } from '../LspConnection';
import { toMonacoLanguageSelector } from './common';

export class LspFormattingFeature extends Disposable {
    constructor(
        private readonly _connection: LspConnection,
    ) {
        super();

        this._register(this._connection.capabilities.addStaticClientCapabilities({
            textDocument: {
                formatting: {
                    dynamicRegistration: true,
                }
            }
        }));

        this._register(this._connection.capabilities.registerCapabilityHandler(capabilities.textDocumentFormatting, true, capability => {
            return monaco.languages.registerDocumentFormattingEditProvider(
                toMonacoLanguageSelector(capability.documentSelector),
                new LspDocumentFormattingProvider(this._connection, capability),
            );
        }));
    }
}

class LspDocumentFormattingProvider implements monaco.languages.DocumentFormattingEditProvider {
    constructor(
        private readonly _client: LspConnection,
        private readonly _capabilities: DocumentFormattingRegistrationOptions,
    ) { }

    async provideDocumentFormattingEdits(
        model: monaco.editor.ITextModel,
        options: monaco.languages.FormattingOptions,
        token: monaco.CancellationToken
    ): Promise<monaco.languages.TextEdit[] | null> {
        const translated = this._client.bridge.translate(model, new monaco.Position(1, 1));

        const result = await this._client.server.textDocumentFormatting({
            textDocument: translated.textDocument,
            options: {
                tabSize: options.tabSize,
                insertSpaces: options.insertSpaces,
            },
        });

        if (!result) {
            return null;
        }

        return result.map(edit => ({
            range: this._client.bridge.translateBackRange(translated.textDocument, edit.range).range,
            text: edit.newText,
        }));
    }
}
