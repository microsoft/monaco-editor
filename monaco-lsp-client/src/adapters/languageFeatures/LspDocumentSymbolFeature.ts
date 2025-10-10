import * as monaco from 'monaco-editor-core';
import { capabilities, DocumentSymbolRegistrationOptions, DocumentSymbol, SymbolInformation, SymbolTag } from '../../../src/types';
import { Disposable } from '../../utils';
import { LspConnection } from '../LspConnection';
import { toMonacoLanguageSelector } from './common';
import { lspSymbolKindToMonacoSymbolKind, toMonacoSymbolKind, toMonacoSymbolTag } from './common';

export class LspDocumentSymbolFeature extends Disposable {
    constructor(
        private readonly _connection: LspConnection,
    ) {
        super();

        this._register(this._connection.capabilities.addStaticClientCapabilities({
            textDocument: {
                documentSymbol: {
                    dynamicRegistration: true,
                    hierarchicalDocumentSymbolSupport: true,
                    symbolKind: {
                        valueSet: Array.from(lspSymbolKindToMonacoSymbolKind.keys()),
                    },
                    tagSupport: {
                        valueSet: [SymbolTag.Deprecated],
                    },
                }
            }
        }));

        this._register(this._connection.capabilities.registerCapabilityHandler(capabilities.textDocumentDocumentSymbol, true, capability => {
            return monaco.languages.registerDocumentSymbolProvider(
                toMonacoLanguageSelector(capability.documentSelector),
                new LspDocumentSymbolProvider(this._connection, capability),
            );
        }));
    }
}

class LspDocumentSymbolProvider implements monaco.languages.DocumentSymbolProvider {
    constructor(
        private readonly _client: LspConnection,
        private readonly _capabilities: DocumentSymbolRegistrationOptions,
    ) { }

    async provideDocumentSymbols(
        model: monaco.editor.ITextModel,
        token: monaco.CancellationToken
    ): Promise<monaco.languages.DocumentSymbol[] | null> {
        const translated = this._client.bridge.translate(model, new monaco.Position(1, 1));

        const result = await this._client.server.textDocumentDocumentSymbol({
            textDocument: translated.textDocument,
        });

        if (!result) {
            return null;
        }

        if (Array.isArray(result) && result.length > 0) {
            if ('location' in result[0]) {
                // SymbolInformation[]
                return (result as SymbolInformation[]).map(symbol => toMonacoSymbolInformation(symbol, this._client));
            } else {
                // DocumentSymbol[]
                return (result as DocumentSymbol[]).map(symbol => toMonacoDocumentSymbol(symbol, this._client, translated.textDocument));
            }
        }

        return [];
    }
}

function toMonacoDocumentSymbol(
    symbol: DocumentSymbol,
    client: LspConnection,
    textDocument: { uri: string }
): monaco.languages.DocumentSymbol {
    return {
        name: symbol.name,
        detail: symbol.detail || '',
        kind: toMonacoSymbolKind(symbol.kind),
        tags: symbol.tags?.map(tag => toMonacoSymbolTag(tag)).filter((t): t is monaco.languages.SymbolTag => t !== undefined) || [],
        range: client.bridge.translateBackRange(textDocument, symbol.range).range,
        selectionRange: client.bridge.translateBackRange(textDocument, symbol.selectionRange).range,
        children: symbol.children?.map(child => toMonacoDocumentSymbol(child, client, textDocument)) || [],
    };
}

function toMonacoSymbolInformation(
    symbol: SymbolInformation,
    client: LspConnection
): monaco.languages.DocumentSymbol {
    return {
        name: symbol.name,
        detail: '',
        kind: toMonacoSymbolKind(symbol.kind),
        tags: symbol.tags?.map(tag => toMonacoSymbolTag(tag)).filter((t): t is monaco.languages.SymbolTag => t !== undefined) || [],
        range: client.bridge.translateBackRange({ uri: symbol.location.uri }, symbol.location.range).range,
        selectionRange: client.bridge.translateBackRange({ uri: symbol.location.uri }, symbol.location.range).range,
        children: [],
    };
}
