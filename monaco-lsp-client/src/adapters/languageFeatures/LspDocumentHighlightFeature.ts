import * as monaco from 'monaco-editor-core';
import { capabilities, DocumentHighlightRegistrationOptions } from '../../../src/types';
import { Disposable } from '../../utils';
import { LspConnection } from '../LspConnection';
import { toMonacoLanguageSelector } from './common';
import { toMonacoDocumentHighlightKind } from './common';

export class LspDocumentHighlightFeature extends Disposable {
    constructor(
        private readonly _connection: LspConnection,
    ) {
        super();

        this._register(this._connection.capabilities.addStaticClientCapabilities({
            textDocument: {
                documentHighlight: {
                    dynamicRegistration: true,
                }
            }
        }));

        this._register(this._connection.capabilities.registerCapabilityHandler(capabilities.textDocumentDocumentHighlight, true, capability => {
            return monaco.languages.registerDocumentHighlightProvider(
                toMonacoLanguageSelector(capability.documentSelector),
                new LspDocumentHighlightProvider(this._connection, capability),
            );
        }));
    }
}

class LspDocumentHighlightProvider implements monaco.languages.DocumentHighlightProvider {
    constructor(
        private readonly _client: LspConnection,
        private readonly _capabilities: DocumentHighlightRegistrationOptions,
    ) { }

    async provideDocumentHighlights(
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        token: monaco.CancellationToken
    ): Promise<monaco.languages.DocumentHighlight[] | null> {
        const translated = this._client.bridge.translate(model, position);

        const result = await this._client.server.textDocumentDocumentHighlight({
            textDocument: translated.textDocument,
            position: translated.position,
        });

        if (!result) {
            return null;
        }

        return result.map(highlight => ({
            range: this._client.bridge.translateBackRange(translated.textDocument, highlight.range).range,
            kind: toMonacoDocumentHighlightKind(highlight.kind),
        }));
    }
}
