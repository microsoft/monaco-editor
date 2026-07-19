import * as monaco from 'monaco-editor-core';
import { capabilities, TypeDefinitionRegistrationOptions } from '../../../src/types';
import { Disposable } from '../../utils';
import { LspConnection } from '../LspConnection';
import { toMonacoLanguageSelector } from './common';
import { toMonacoLocation } from "./common";

export class LspTypeDefinitionFeature extends Disposable {
    constructor(
        private readonly _connection: LspConnection,
    ) {
        super();

        this._register(this._connection.capabilities.addStaticClientCapabilities({
            textDocument: {
                typeDefinition: {
                    dynamicRegistration: true,
                    linkSupport: true,
                }
            }
        }));

        this._register(this._connection.capabilities.registerCapabilityHandler(capabilities.textDocumentTypeDefinition, true, capability => {
            return monaco.languages.registerTypeDefinitionProvider(
                toMonacoLanguageSelector(capability.documentSelector),
                new LspTypeDefinitionProvider(this._connection, capability),
            );
        }));
    }
}

class LspTypeDefinitionProvider implements monaco.languages.TypeDefinitionProvider {
    constructor(
        private readonly _client: LspConnection,
        private readonly _capabilities: TypeDefinitionRegistrationOptions,
    ) { }

    async provideTypeDefinition(
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        token: monaco.CancellationToken
    ): Promise<monaco.languages.Definition | monaco.languages.LocationLink[] | null> {
        const translated = this._client.bridge.translate(model, position);

        const result = await this._client.server.textDocumentTypeDefinition({
            textDocument: translated.textDocument,
            position: translated.position,
        });

        if (!result) {
            return null;
        }

        if (Array.isArray(result)) {
            return result.map(loc => toMonacoLocation(loc, this._client));
        }

        return toMonacoLocation(result, this._client);
    }
}
