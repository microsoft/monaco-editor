import * as monaco from 'monaco-editor-core';
import { capabilities, SemanticTokensRegistrationOptions, TokenFormat } from '../../../src/types';
import { Disposable } from '../../utils';
import { LspConnection } from '../LspConnection';
import { toMonacoLanguageSelector } from './common';

export class LspSemanticTokensFeature extends Disposable {
    constructor(
        private readonly _connection: LspConnection,
    ) {
        super();

        this._register(this._connection.capabilities.addStaticClientCapabilities({
            textDocument: {
                semanticTokens: {
                    dynamicRegistration: true,
                    requests: {
                        range: true,
                        full: {
                            delta: true,
                        },
                    },
                    tokenTypes: [
                        'namespace', 'type', 'class', 'enum', 'interface', 'struct',
                        'typeParameter', 'parameter', 'variable', 'property', 'enumMember',
                        'event', 'function', 'method', 'macro', 'keyword', 'modifier',
                        'comment', 'string', 'number', 'regexp', 'operator', 'decorator'
                    ],
                    tokenModifiers: [
                        'declaration', 'definition', 'readonly', 'static', 'deprecated',
                        'abstract', 'async', 'modification', 'documentation', 'defaultLibrary'
                    ],
                    formats: [TokenFormat.Relative],
                    overlappingTokenSupport: false,
                    multilineTokenSupport: true,
                }
            }
        }));

        this._register(this._connection.capabilities.registerCapabilityHandler(capabilities.textDocumentSemanticTokensFull, true, capability => {
            return monaco.languages.registerDocumentSemanticTokensProvider(
                toMonacoLanguageSelector(capability.documentSelector),
                new LspSemanticTokensProvider(this._connection, capability),
            );
        }));
    }
}

class LspSemanticTokensProvider implements monaco.languages.DocumentSemanticTokensProvider {
    constructor(
        private readonly _client: LspConnection,
        private readonly _capabilities: SemanticTokensRegistrationOptions,
    ) { }

    getLegend(): monaco.languages.SemanticTokensLegend {
        return {
            tokenTypes: this._capabilities.legend.tokenTypes,
            tokenModifiers: this._capabilities.legend.tokenModifiers,
        };
    }

    releaseDocumentSemanticTokens(resultId: string | undefined): void {
        // Monaco will call this when it's done with a result
        // We can potentially notify the server if needed
    }

    async provideDocumentSemanticTokens(
        model: monaco.editor.ITextModel,
        lastResultId: string | null,
        token: monaco.CancellationToken
    ): Promise<monaco.languages.SemanticTokens | monaco.languages.SemanticTokensEdits | null> {
        const translated = this._client.bridge.translate(model, model.getPositionAt(0));

        // Try delta request if we have a previous result and server supports it
        const full = this._capabilities.full;
        if (lastResultId && full && typeof full === 'object' && full.delta) {
            const deltaResult = await this._client.server.textDocumentSemanticTokensFullDelta({
                textDocument: translated.textDocument,
                previousResultId: lastResultId,
            });

            if (!deltaResult) {
                return null;
            }

            // Check if it's a delta or full result
            if ('edits' in deltaResult) {
                // It's a delta
                return {
                    resultId: deltaResult.resultId,
                    edits: deltaResult.edits.map(edit => ({
                        start: edit.start,
                        deleteCount: edit.deleteCount,
                        data: edit.data ? new Uint32Array(edit.data) : undefined,
                    })),
                };
            } else {
                // It's a full result
                return {
                    resultId: deltaResult.resultId,
                    data: new Uint32Array(deltaResult.data),
                };
            }
        }

        // Full request
        const result = await this._client.server.textDocumentSemanticTokensFull({
            textDocument: translated.textDocument,
        });

        if (!result) {
            return null;
        }

        return {
            resultId: result.resultId,
            data: new Uint32Array(result.data),
        };
    }

    async provideDocumentSemanticTokensEdits?(
        model: monaco.editor.ITextModel,
        previousResultId: string,
        token: monaco.CancellationToken
    ): Promise<monaco.languages.SemanticTokens | monaco.languages.SemanticTokensEdits | null> {
        // This method is called when Monaco wants to use delta updates
        // We can delegate to provideDocumentSemanticTokens which handles both
        return this.provideDocumentSemanticTokens(model, previousResultId, token);
    }
}
