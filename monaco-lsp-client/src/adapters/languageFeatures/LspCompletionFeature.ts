import * as monaco from 'monaco-editor-core';
import { capabilities, CompletionRegistrationOptions, MarkupContent, CompletionItem, TextDocumentPositionParams } from '../../../src/types';
import { assertTargetTextModel, ITextModelBridge } from '../ITextModelBridge';
import { Disposable } from '../../utils';
import { LspConnection } from '../LspConnection';
import { toMonacoLanguageSelector } from './common';
import {
    lspCompletionItemKindToMonacoCompletionItemKind,
    lspCompletionItemTagToMonacoCompletionItemTag,
    toMonacoCompletionItemKind,
    toMonacoCompletionItemTag,
    toLspCompletionTriggerKind,
    toMonacoInsertTextRules,
    toMonacoCommand,
} from './common';

export class LspCompletionFeature extends Disposable {
    constructor(
        private readonly _connection: LspConnection,
    ) {
        super();

        this._register(this._connection.capabilities.addStaticClientCapabilities({
            textDocument: {
                completion: {
                    dynamicRegistration: true,
                    contextSupport: true,
                    completionItemKind: {
                        valueSet: Array.from(lspCompletionItemKindToMonacoCompletionItemKind.keys()),
                    },
                    completionItem: {
                        tagSupport: {
                            valueSet: Array.from(lspCompletionItemTagToMonacoCompletionItemTag.keys()),
                        },
                        commitCharactersSupport: true,
                        deprecatedSupport: true,
                        preselectSupport: true,
                    }
                }
            }
        }));

        this._register(this._connection.capabilities.registerCapabilityHandler(capabilities.textDocumentCompletion, true, capability => {
            return monaco.languages.registerCompletionItemProvider(
                toMonacoLanguageSelector(capability.documentSelector),
                new LspCompletionProvider(this._connection, capability),
            );
        }));
    }
}

interface ExtendedCompletionItem extends monaco.languages.CompletionItem {
    _lspItem: CompletionItem;
    _translated: TextDocumentPositionParams;
    _model: monaco.editor.ITextModel;
}

class LspCompletionProvider implements monaco.languages.CompletionItemProvider {
    public readonly resolveCompletionItem;

    constructor(
        private readonly _client: LspConnection,
        private readonly _capabilities: CompletionRegistrationOptions,
    ) {
        if (_capabilities.resolveProvider) {
            this.resolveCompletionItem = async (item: ExtendedCompletionItem, token: monaco.CancellationToken): Promise<ExtendedCompletionItem> => {
                const resolved = await this._client.server.completionItemResolve(item._lspItem);
                applyLspCompletionItemProperties(item, resolved, this._client.bridge, item._translated, item._model);
                return item;
            }
        }
    }

    get triggerCharacters(): string[] | undefined {
        return this._capabilities.triggerCharacters;
    }

    async provideCompletionItems(
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        context: monaco.languages.CompletionContext,
        token: monaco.CancellationToken
    ): Promise<monaco.languages.CompletionList & { suggestions: ExtendedCompletionItem[] }> {
        const translated = this._client.bridge.translate(model, position);

        const result = await this._client.server.textDocumentCompletion({
            textDocument: translated.textDocument,
            position: translated.position,
            context: context.triggerCharacter ? {
                triggerKind: toLspCompletionTriggerKind(context.triggerKind),
                triggerCharacter: context.triggerCharacter,
            } : undefined,
        });
        if (!result) {
            return { suggestions: [] };
        }

        const items = Array.isArray(result) ? result : result.items;

        return {
            suggestions: items.map<ExtendedCompletionItem>(i => {
                const item: ExtendedCompletionItem = {
                    ...convertLspToMonacoCompletionItem(
                        i,
                        this._client.bridge,
                        translated,
                        model,
                        position
                    ),
                    _lspItem: i,
                    _translated: translated,
                    _model: model,
                };

                return item;
            })
        };
    }
}

function convertLspToMonacoCompletionItem(
    lspItem: CompletionItem,
    bridge: ITextModelBridge,
    translated: TextDocumentPositionParams,
    model: monaco.editor.ITextModel,
    position: monaco.Position
): monaco.languages.CompletionItem {
    let insertText = lspItem.insertText || lspItem.label;
    let range: monaco.IRange | monaco.languages.CompletionItemRanges | undefined = undefined;

    if (lspItem.textEdit) {
        if ('range' in lspItem.textEdit) {
            insertText = lspItem.textEdit.newText;
            range = assertTargetTextModel(bridge.translateBackRange(translated.textDocument, lspItem.textEdit.range), model).range;
        } else {
            insertText = lspItem.textEdit.newText;
            range = {
                insert: assertTargetTextModel(bridge.translateBackRange(translated.textDocument, lspItem.textEdit.insert), model).range,
                replace: assertTargetTextModel(bridge.translateBackRange(translated.textDocument, lspItem.textEdit.replace), model).range,
            };
        }
    }

    if (!range) {
        range = monaco.Range.fromPositions(position, position);
    }

    const item: monaco.languages.CompletionItem = {
        label: lspItem.label,
        kind: toMonacoCompletionItemKind(lspItem.kind),
        insertText,
        sortText: lspItem.sortText,
        filterText: lspItem.filterText,
        preselect: lspItem.preselect,
        commitCharacters: lspItem.commitCharacters,
        range: range,
    };

    applyLspCompletionItemProperties(item, lspItem, bridge, translated, model);

    return item;
}

function applyLspCompletionItemProperties(
    monacoItem: monaco.languages.CompletionItem,
    lspItem: CompletionItem,
    bridge: ITextModelBridge,
    translated: TextDocumentPositionParams,
    targetModel: monaco.editor.ITextModel
): void {
    if (lspItem.detail !== undefined) {
        monacoItem.detail = lspItem.detail;
    }
    if (lspItem.documentation !== undefined) {
        monacoItem.documentation = toMonacoDocumentation(lspItem.documentation);
    }
    if (lspItem.insertTextFormat !== undefined) {
        const insertTextRules = toMonacoInsertTextRules(lspItem.insertTextFormat);
        monacoItem.insertTextRules = insertTextRules;
    }
    if (lspItem.tags && lspItem.tags.length > 0) {
        monacoItem.tags = lspItem.tags.map(toMonacoCompletionItemTag).filter((tag): tag is monaco.languages.CompletionItemTag => tag !== undefined);
    }
    if (lspItem.additionalTextEdits && lspItem.additionalTextEdits.length > 0) {
        monacoItem.additionalTextEdits = lspItem.additionalTextEdits.map(edit => ({
            range: assertTargetTextModel(bridge.translateBackRange(translated.textDocument, edit.range), targetModel).range,
            text: edit.newText,
        }));
    }
    if (lspItem.command) {
        monacoItem.command = toMonacoCommand(lspItem.command);
    }
}

function toMonacoDocumentation(doc: string | MarkupContent | undefined): string | monaco.IMarkdownString | undefined {
    if (!doc) return undefined;
    if (typeof doc === 'string') return doc;
    return {
        value: doc.value,
        isTrusted: true,
    };
}
