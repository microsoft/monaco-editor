import * as monaco from 'monaco-editor-core';
import { capabilities, ReferenceRegistrationOptions } from '../../../src/types';
import { Disposable } from '../../utils';
import { LspConnection } from '../LspConnection';
import { toMonacoLanguageSelector } from './common';

export class LspReferencesFeature extends Disposable {
    constructor(
        private readonly _connection: LspConnection,
    ) {
        super();

        this._register(this._connection.capabilities.addStaticClientCapabilities({
            textDocument: {
                references: {
                    dynamicRegistration: true,
                }
            }
        }));

        this._register(this._connection.capabilities.registerCapabilityHandler(capabilities.textDocumentReferences, true, capability => {
            return monaco.languages.registerReferenceProvider(
                toMonacoLanguageSelector(capability.documentSelector),
                new LspReferenceProvider(this._connection, capability),
            );
        }));
    }
}

class LspReferenceProvider implements monaco.languages.ReferenceProvider {
    constructor(
        private readonly _client: LspConnection,
        private readonly _capabilities: ReferenceRegistrationOptions,
    ) { }

    async provideReferences(
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        context: monaco.languages.ReferenceContext,
        token: monaco.CancellationToken
    ): Promise<monaco.languages.Location[] | null> {
        const translated = this._client.bridge.translate(model, position);

        const result = await this._client.server.textDocumentReferences({
            textDocument: translated.textDocument,
            position: translated.position,
            context: {
                includeDeclaration: context.includeDeclaration,
            },
        });

        if (!result) {
            return null;
        }

        return result.map(loc => {
            const translated = this._client.bridge.translateBackRange({ uri: loc.uri }, loc.range);
            return {
                uri: translated.textModel.uri,
                range: translated.range,
            };
        });
    }
}
