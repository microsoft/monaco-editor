import * as monaco from 'monaco-editor-core';
import { capabilities, DocumentLinkRegistrationOptions } from '../../../src/types';
import { Disposable } from '../../utils';
import { LspConnection } from '../LspConnection';
import { toMonacoLanguageSelector } from './common';

export class LspDocumentLinkFeature extends Disposable {
    constructor(
        private readonly _connection: LspConnection,
    ) {
        super();

        this._register(this._connection.capabilities.addStaticClientCapabilities({
            textDocument: {
                documentLink: {
                    dynamicRegistration: true,
                    tooltipSupport: true,
                }
            }
        }));

        this._register(this._connection.capabilities.registerCapabilityHandler(capabilities.textDocumentDocumentLink, true, capability => {
            return monaco.languages.registerLinkProvider(
                toMonacoLanguageSelector(capability.documentSelector),
                new LspDocumentLinkProvider(this._connection, capability),
            );
        }));
    }
}

class LspDocumentLinkProvider implements monaco.languages.LinkProvider {
    constructor(
        private readonly _client: LspConnection,
        private readonly _capabilities: DocumentLinkRegistrationOptions,
    ) { }

    async provideLinks(
        model: monaco.editor.ITextModel,
        token: monaco.CancellationToken
    ): Promise<monaco.languages.ILinksList | null> {
        const translated = this._client.bridge.translate(model, new monaco.Position(1, 1));

        const result = await this._client.server.textDocumentDocumentLink({
            textDocument: translated.textDocument,
        });

        if (!result) {
            return null;
        }

        return {
            links: result.map(link => ({
                range: this._client.bridge.translateBackRange(translated.textDocument, link.range).range,
                url: link.target,
                tooltip: link.tooltip,
            })),
        };
    }

    async resolveLink(
        link: monaco.languages.ILink,
        token: monaco.CancellationToken
    ): Promise<monaco.languages.ILink> {
        if (!this._capabilities.resolveProvider) {
            return link;
        }

        // TODO: Implement resolve
        return link;
    }
}
