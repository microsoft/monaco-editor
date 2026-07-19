import * as monaco from 'monaco-editor-core';
import { capabilities, DefinitionRegistrationOptions } from '../../../src/types';
import { Disposable } from '../../utils';
import { LspConnection } from '../LspConnection';
import { toMonacoLanguageSelector } from './common';
import { toMonacoLocation } from "./common";

export class LspDefinitionFeature extends Disposable {
    constructor(
        private readonly _connection: LspConnection,
    ) {
        super();

        this._register(this._connection.capabilities.addStaticClientCapabilities({
            textDocument: {
                definition: {
                    dynamicRegistration: true,
                    linkSupport: true,
                }
            }
        }));

        this._register(this._connection.capabilities.registerCapabilityHandler(capabilities.textDocumentDefinition, true, capability => {
            return monaco.languages.registerDefinitionProvider(
                toMonacoLanguageSelector(capability.documentSelector),
                new LspDefinitionProvider(this._connection, capability),
            );
        }));
    }
}

class LspDefinitionProvider implements monaco.languages.DefinitionProvider {
    constructor(
        private readonly _client: LspConnection,
        private readonly _capabilities: DefinitionRegistrationOptions,
    ) { }

    async provideDefinition(
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        token: monaco.CancellationToken
    ): Promise<monaco.languages.Definition | monaco.languages.LocationLink[] | null> {
        const translated = this._client.bridge.translate(model, position);

        const result = await this._client.server.textDocumentDefinition({
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
