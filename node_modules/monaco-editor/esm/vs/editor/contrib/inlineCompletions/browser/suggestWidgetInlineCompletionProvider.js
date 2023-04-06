/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { compareBy, findMaxBy, numberComparator } from '../../../../base/common/arrays.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { SnippetParser } from '../../snippet/browser/snippetParser.js';
import { SnippetSession } from '../../snippet/browser/snippetSession.js';
import { SuggestController } from '../../suggest/browser/suggestController.js';
import { minimizeInlineCompletion, normalizedInlineCompletionsEquals } from './inlineCompletionToGhostText.js';
export class SuggestWidgetInlineCompletionProvider extends Disposable {
    /**
     * Returns undefined if the suggest widget is not active.
    */
    get state() {
        if (!this._isActive) {
            return undefined;
        }
        return { selectedItem: this._currentSuggestItemInfo };
    }
    constructor(editor, suggestControllerPreselector) {
        super();
        this.editor = editor;
        this.suggestControllerPreselector = suggestControllerPreselector;
        this.isSuggestWidgetVisible = false;
        this.isShiftKeyPressed = false;
        this._isActive = false;
        this._currentSuggestItemInfo = undefined;
        this.onDidChangeEmitter = new Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
        // See the command acceptAlternativeSelectedSuggestion that is bound to shift+tab
        this._register(editor.onKeyDown(e => {
            if (e.shiftKey && !this.isShiftKeyPressed) {
                this.isShiftKeyPressed = true;
                this.update(this._isActive);
            }
        }));
        this._register(editor.onKeyUp(e => {
            if (e.shiftKey && this.isShiftKeyPressed) {
                this.isShiftKeyPressed = false;
                this.update(this._isActive);
            }
        }));
        const suggestController = SuggestController.get(this.editor);
        if (suggestController) {
            this._register(suggestController.registerSelector({
                priority: 100,
                select: (model, pos, suggestItems) => {
                    const textModel = this.editor.getModel();
                    const normalizedItemToPreselect = minimizeInlineCompletion(textModel, this.suggestControllerPreselector());
                    if (!normalizedItemToPreselect) {
                        return -1;
                    }
                    const position = Position.lift(pos);
                    const candidates = suggestItems
                        .map((suggestItem, index) => {
                        const inlineSuggestItem = suggestionToSuggestItemInfo(suggestController, position, suggestItem, this.isShiftKeyPressed);
                        const normalizedSuggestItem = minimizeInlineCompletion(textModel, inlineSuggestItem === null || inlineSuggestItem === void 0 ? void 0 : inlineSuggestItem.normalizedInlineCompletion);
                        if (!normalizedSuggestItem) {
                            return undefined;
                        }
                        const valid = rangeStartsWith(normalizedItemToPreselect.range, normalizedSuggestItem.range) &&
                            normalizedItemToPreselect.insertText.startsWith(normalizedSuggestItem.insertText);
                        return { index, valid, prefixLength: normalizedSuggestItem.insertText.length, suggestItem };
                    })
                        .filter(item => item && item.valid);
                    const result = findMaxBy(candidates, compareBy(s => s.prefixLength, numberComparator));
                    return result ? result.index : -1;
                }
            }));
            let isBoundToSuggestWidget = false;
            const bindToSuggestWidget = () => {
                if (isBoundToSuggestWidget) {
                    return;
                }
                isBoundToSuggestWidget = true;
                this._register(suggestController.widget.value.onDidShow(() => {
                    this.isSuggestWidgetVisible = true;
                    this.update(true);
                }));
                this._register(suggestController.widget.value.onDidHide(() => {
                    this.isSuggestWidgetVisible = false;
                    this.update(false);
                }));
                this._register(suggestController.widget.value.onDidFocus(() => {
                    this.isSuggestWidgetVisible = true;
                    this.update(true);
                }));
            };
            this._register(Event.once(suggestController.model.onDidTrigger)(e => {
                bindToSuggestWidget();
            }));
        }
        this.update(this._isActive);
    }
    update(newActive) {
        const newInlineCompletion = this.getSuggestItemInfo();
        let shouldFire = false;
        if (!suggestItemInfoEquals(this._currentSuggestItemInfo, newInlineCompletion)) {
            this._currentSuggestItemInfo = newInlineCompletion;
            shouldFire = true;
        }
        if (this._isActive !== newActive) {
            this._isActive = newActive;
            shouldFire = true;
        }
        if (shouldFire) {
            this.onDidChangeEmitter.fire();
        }
    }
    getSuggestItemInfo() {
        const suggestController = SuggestController.get(this.editor);
        if (!suggestController) {
            return undefined;
        }
        if (!this.isSuggestWidgetVisible) {
            return undefined;
        }
        const focusedItem = suggestController.widget.value.getFocusedItem();
        if (!focusedItem) {
            return undefined;
        }
        // TODO: item.isResolved
        return suggestionToSuggestItemInfo(suggestController, this.editor.getPosition(), focusedItem.item, this.isShiftKeyPressed);
    }
    stopForceRenderingAbove() {
        const suggestController = SuggestController.get(this.editor);
        suggestController === null || suggestController === void 0 ? void 0 : suggestController.stopForceRenderingAbove();
    }
    forceRenderingAbove() {
        const suggestController = SuggestController.get(this.editor);
        suggestController === null || suggestController === void 0 ? void 0 : suggestController.forceRenderingAbove();
    }
}
export function rangeStartsWith(rangeToTest, prefix) {
    return (prefix.startLineNumber === rangeToTest.startLineNumber &&
        prefix.startColumn === rangeToTest.startColumn &&
        (prefix.endLineNumber < rangeToTest.endLineNumber ||
            (prefix.endLineNumber === rangeToTest.endLineNumber &&
                prefix.endColumn <= rangeToTest.endColumn)));
}
function suggestItemInfoEquals(a, b) {
    if (a === b) {
        return true;
    }
    if (!a || !b) {
        return false;
    }
    return a.completionItemKind === b.completionItemKind &&
        a.isSnippetText === b.isSnippetText &&
        normalizedInlineCompletionsEquals(a.normalizedInlineCompletion, b.normalizedInlineCompletion);
}
function suggestionToSuggestItemInfo(suggestController, position, item, toggleMode) {
    // additionalTextEdits might not be resolved here, this could be problematic.
    if (Array.isArray(item.completion.additionalTextEdits) && item.completion.additionalTextEdits.length > 0) {
        // cannot represent additional text edits. TODO: Now we can.
        return {
            completionItemKind: item.completion.kind,
            isSnippetText: false,
            normalizedInlineCompletion: {
                // Dummy element, so that space is reserved, but no text is shown
                range: Range.fromPositions(position, position),
                insertText: '',
                filterText: '',
                snippetInfo: undefined,
                additionalTextEdits: [],
            },
        };
    }
    let { insertText } = item.completion;
    let isSnippetText = false;
    if (item.completion.insertTextRules & 4 /* CompletionItemInsertTextRule.InsertAsSnippet */) {
        const snippet = new SnippetParser().parse(insertText);
        const model = suggestController.editor.getModel();
        // Ignore snippets that are too large.
        // Adjust whitespace is expensive for them.
        if (snippet.children.length > 100) {
            return undefined;
        }
        SnippetSession.adjustWhitespace(model, position, true, snippet);
        insertText = snippet.toString();
        isSnippetText = true;
    }
    const info = suggestController.getOverwriteInfo(item, toggleMode);
    return {
        isSnippetText,
        completionItemKind: item.completion.kind,
        normalizedInlineCompletion: {
            insertText: insertText,
            filterText: insertText,
            range: Range.fromPositions(position.delta(0, -info.overwriteBefore), position.delta(0, Math.max(info.overwriteAfter, 0))),
            snippetInfo: undefined,
            additionalTextEdits: [],
        }
    };
}
