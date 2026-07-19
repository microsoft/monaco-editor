import * as monaco from 'monaco-editor-core';
import { capabilities, ImplementationRegistrationOptions } from '../../../src/types';
import { Disposable } from '../../utils';
import { LspConnection } from '../LspConnection';
import { toMonacoLanguageSelector } from './common';
import { toMonacoLocation } from "./common";

export class LspImplementationFeature extends Disposable {
    constructor(
        private readonly _connection: LspConnection,
    ) {
        super();

        this._register(this._connection.capabilities.addStaticClientCapabilities({
            textDocument: {
                implementation: {
                    dynamicRegistration: true,
                    linkSupport: true,
                }
            }
        }));

        this._register(this._connection.capabilities.registerCapabilityHandler(capabilities.textDocumentImplementation, true, capability => {
            return monaco.languages.registerImplementationProvider(
                toMonacoLanguageSelector(capability.documentSelector),
                new LspImplementationProvider(this._connection, capability),
            );
        }));
    }
}

class LspImplementationProvider implements monaco.languages.ImplementationProvider {
    constructor(
        private readonly _client: LspConnection,
        private readonly _capabilities: ImplementationRegistrationOptions,
    ) { }

    async provideImplementation(
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        token: monaco.CancellationToken
    ): Promise<monaco.languages.Definition | monaco.languages.LocationLink[] | null> {
        const translated = this._client.bridge.translate(model, position);

        const result = await this._client.server.textDocumentImplementation({
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
