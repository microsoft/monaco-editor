import * as monaco from 'monaco-editor-core';
import { capabilities, DocumentRangeFormattingRegistrationOptions } from '../../../src/types';
import { Disposable } from '../../utils';
import { LspConnection } from '../LspConnection';
import { toMonacoLanguageSelector } from './common';

export class LspRangeFormattingFeature extends Disposable {
    constructor(
        private readonly _connection: LspConnection,
    ) {
        super();

        this._register(this._connection.capabilities.addStaticClientCapabilities({
            textDocument: {
                rangeFormatting: {
                    dynamicRegistration: true,
                }
            }
        }));

        this._register(this._connection.capabilities.registerCapabilityHandler(capabilities.textDocumentRangeFormatting, true, capability => {
            return monaco.languages.registerDocumentRangeFormattingEditProvider(
                toMonacoLanguageSelector(capability.documentSelector),
                new LspDocumentRangeFormattingProvider(this._connection, capability),
            );
        }));
    }
}

class LspDocumentRangeFormattingProvider implements monaco.languages.DocumentRangeFormattingEditProvider {
    constructor(
        private readonly _client: LspConnection,
        private readonly _capabilities: DocumentRangeFormattingRegistrationOptions,
    ) { }

    async provideDocumentRangeFormattingEdits(
        model: monaco.editor.ITextModel,
        range: monaco.Range,
        options: monaco.languages.FormattingOptions,
        token: monaco.CancellationToken
    ): Promise<monaco.languages.TextEdit[] | null> {
        const translated = this._client.bridge.translate(model, range.getStartPosition());

        const result = await this._client.server.textDocumentRangeFormatting({
            textDocument: translated.textDocument,
            range: this._client.bridge.translateRange(model, range),
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
