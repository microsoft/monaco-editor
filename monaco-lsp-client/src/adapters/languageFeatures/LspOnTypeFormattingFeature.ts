import * as monaco from 'monaco-editor-core';
import { capabilities, DocumentOnTypeFormattingRegistrationOptions } from '../../../src/types';
import { Disposable } from '../../utils';
import { LspConnection } from '../LspConnection';
import { toMonacoLanguageSelector } from './common';

export class LspOnTypeFormattingFeature extends Disposable {
    constructor(
        private readonly _connection: LspConnection,
    ) {
        super();

        this._register(this._connection.capabilities.addStaticClientCapabilities({
            textDocument: {
                onTypeFormatting: {
                    dynamicRegistration: true,
                }
            }
        }));

        this._register(this._connection.capabilities.registerCapabilityHandler(capabilities.textDocumentOnTypeFormatting, true, capability => {
            return monaco.languages.registerOnTypeFormattingEditProvider(
                toMonacoLanguageSelector(capability.documentSelector),
                new LspOnTypeFormattingProvider(this._connection, capability),
            );
        }));
    }
}

class LspOnTypeFormattingProvider implements monaco.languages.OnTypeFormattingEditProvider {
    public readonly autoFormatTriggerCharacters: string[];

    constructor(
        private readonly _client: LspConnection,
        private readonly _capabilities: DocumentOnTypeFormattingRegistrationOptions,
    ) {
        this.autoFormatTriggerCharacters = [
            _capabilities.firstTriggerCharacter,
            ...(_capabilities.moreTriggerCharacter || [])
        ];
    }

    async provideOnTypeFormattingEdits(
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        ch: string,
        options: monaco.languages.FormattingOptions,
        token: monaco.CancellationToken
    ): Promise<monaco.languages.TextEdit[] | null> {
        const translated = this._client.bridge.translate(model, position);

        const result = await this._client.server.textDocumentOnTypeFormatting({
            textDocument: translated.textDocument,
            position: translated.position,
            ch,
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
