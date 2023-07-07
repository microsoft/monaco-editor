/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { FuzzyScore } from '../../../../base/common/filters.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { RefCountedDisposable } from '../../../../base/common/lifecycle.js';
import { registerEditorContribution } from '../../../browser/editorExtensions.js';
import { ICodeEditorService } from '../../../browser/services/codeEditorService.js';
import { Range } from '../../../common/core/range.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { CompletionModel, LineContext } from './completionModel.js';
import { CompletionOptions, provideSuggestionItems, QuickSuggestionsOptions } from './suggest.js';
import { ISuggestMemoryService } from './suggestMemory.js';
import { WordDistance } from './wordDistance.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
class SuggestInlineCompletion {
    constructor(range, insertText, filterText, additionalTextEdits, command, completion) {
        this.range = range;
        this.insertText = insertText;
        this.filterText = filterText;
        this.additionalTextEdits = additionalTextEdits;
        this.command = command;
        this.completion = completion;
    }
}
let InlineCompletionResults = class InlineCompletionResults extends RefCountedDisposable {
    constructor(model, line, word, completionModel, completions, _suggestMemoryService) {
        super(completions.disposable);
        this.model = model;
        this.line = line;
        this.word = word;
        this.completionModel = completionModel;
        this._suggestMemoryService = _suggestMemoryService;
    }
    canBeReused(model, line, word) {
        return this.model === model // same model
            && this.line === line
            && this.word.word.length > 0
            && this.word.startColumn === word.startColumn && this.word.endColumn < word.endColumn // same word
            && this.completionModel.getIncompleteProvider().size === 0; // no incomplete results
    }
    get items() {
        var _a;
        const result = [];
        // Split items by preselected index. This ensures the memory-selected item shows first and that better/worst
        // ranked items are before/after
        const { items } = this.completionModel;
        const selectedIndex = this._suggestMemoryService.select(this.model, { lineNumber: this.line, column: this.word.endColumn + this.completionModel.lineContext.characterCountDelta }, items);
        const first = Iterable.slice(items, selectedIndex);
        const second = Iterable.slice(items, 0, selectedIndex);
        let resolveCount = 5;
        for (const item of Iterable.concat(first, second)) {
            if (item.score === FuzzyScore.Default) {
                // skip items that have no overlap
                continue;
            }
            const range = new Range(item.editStart.lineNumber, item.editStart.column, item.editInsertEnd.lineNumber, item.editInsertEnd.column + this.completionModel.lineContext.characterCountDelta // end PLUS character delta
            );
            const insertText = item.completion.insertTextRules && (item.completion.insertTextRules & 4 /* CompletionItemInsertTextRule.InsertAsSnippet */)
                ? { snippet: item.completion.insertText }
                : item.completion.insertText;
            result.push(new SuggestInlineCompletion(range, insertText, (_a = item.filterTextLow) !== null && _a !== void 0 ? _a : item.labelLow, item.completion.additionalTextEdits, item.completion.command, item));
            // resolve the first N suggestions eagerly
            if (resolveCount-- >= 0) {
                item.resolve(CancellationToken.None);
            }
        }
        return result;
    }
};
InlineCompletionResults = __decorate([
    __param(5, ISuggestMemoryService)
], InlineCompletionResults);
export let SuggestInlineCompletions = class SuggestInlineCompletions {
    constructor(_getEditorOption, _languageFeatureService, _clipboardService, _suggestMemoryService) {
        this._getEditorOption = _getEditorOption;
        this._languageFeatureService = _languageFeatureService;
        this._clipboardService = _clipboardService;
        this._suggestMemoryService = _suggestMemoryService;
    }
    provideInlineCompletions(model, position, context, token) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (context.selectedSuggestionInfo) {
                return;
            }
            const config = this._getEditorOption(86 /* EditorOption.quickSuggestions */, model);
            if (QuickSuggestionsOptions.isAllOff(config)) {
                // quick suggest is off (for this model/language)
                return;
            }
            model.tokenization.tokenizeIfCheap(position.lineNumber);
            const lineTokens = model.tokenization.getLineTokens(position.lineNumber);
            const tokenType = lineTokens.getStandardTokenType(lineTokens.findTokenIndexAtOffset(Math.max(position.column - 1 - 1, 0)));
            if (QuickSuggestionsOptions.valueFor(config, tokenType) !== 'inline') {
                // quick suggest is off (for this token)
                return undefined;
            }
            // We consider non-empty leading words and trigger characters. The latter only
            // when no word is being typed (word characters superseed trigger characters)
            let wordInfo = model.getWordAtPosition(position);
            let triggerCharacterInfo;
            if (!(wordInfo === null || wordInfo === void 0 ? void 0 : wordInfo.word)) {
                triggerCharacterInfo = this._getTriggerCharacterInfo(model, position);
            }
            if (!(wordInfo === null || wordInfo === void 0 ? void 0 : wordInfo.word) && !triggerCharacterInfo) {
                // not at word, not a trigger character
                return;
            }
            // ensure that we have word information and that we are at the end of a word
            // otherwise we stop because we don't want to do quick suggestions inside words
            if (!wordInfo) {
                wordInfo = model.getWordUntilPosition(position);
            }
            if (wordInfo.endColumn !== position.column) {
                return;
            }
            let result;
            const leadingLineContents = model.getValueInRange(new Range(position.lineNumber, 1, position.lineNumber, position.column));
            if (!triggerCharacterInfo && ((_a = this._lastResult) === null || _a === void 0 ? void 0 : _a.canBeReused(model, position.lineNumber, wordInfo))) {
                // reuse a previous result iff possible, only a refilter is needed
                // TODO@jrieken this can be improved further and only incomplete results can be updated
                // console.log(`REUSE with ${wordInfo.word}`);
                const newLineContext = new LineContext(leadingLineContents, position.column - this._lastResult.word.endColumn);
                this._lastResult.completionModel.lineContext = newLineContext;
                this._lastResult.acquire();
                result = this._lastResult;
            }
            else {
                // refesh model is required
                const completions = yield provideSuggestionItems(this._languageFeatureService.completionProvider, model, position, new CompletionOptions(undefined, undefined, triggerCharacterInfo === null || triggerCharacterInfo === void 0 ? void 0 : triggerCharacterInfo.providers), triggerCharacterInfo && { triggerKind: 1 /* CompletionTriggerKind.TriggerCharacter */, triggerCharacter: triggerCharacterInfo.ch }, token);
                let clipboardText;
                if (completions.needsClipboard) {
                    clipboardText = yield this._clipboardService.readText();
                }
                const completionModel = new CompletionModel(completions.items, position.column, new LineContext(leadingLineContents, 0), WordDistance.None, this._getEditorOption(115 /* EditorOption.suggest */, model), this._getEditorOption(109 /* EditorOption.snippetSuggestions */, model), { boostFullMatch: false, firstMatchCanBeWeak: false }, clipboardText);
                result = new InlineCompletionResults(model, position.lineNumber, wordInfo, completionModel, completions, this._suggestMemoryService);
            }
            this._lastResult = result;
            return result;
        });
    }
    handleItemDidShow(_completions, item) {
        item.completion.resolve(CancellationToken.None);
    }
    freeInlineCompletions(result) {
        result.release();
    }
    _getTriggerCharacterInfo(model, position) {
        var _a;
        const ch = model.getValueInRange(Range.fromPositions({ lineNumber: position.lineNumber, column: position.column - 1 }, position));
        const providers = new Set();
        for (const provider of this._languageFeatureService.completionProvider.all(model)) {
            if ((_a = provider.triggerCharacters) === null || _a === void 0 ? void 0 : _a.includes(ch)) {
                providers.add(provider);
            }
        }
        if (providers.size === 0) {
            return undefined;
        }
        return { providers, ch };
    }
};
SuggestInlineCompletions = __decorate([
    __param(1, ILanguageFeaturesService),
    __param(2, IClipboardService),
    __param(3, ISuggestMemoryService)
], SuggestInlineCompletions);
let EditorContribution = class EditorContribution {
    constructor(_editor, languageFeatureService, editorService, instaService) {
        // HACK - way to contribute something only once
        if (++EditorContribution._counter === 1) {
            const provider = instaService.createInstance(SuggestInlineCompletions, (id, model) => {
                var _a;
                // HACK - reuse the editor options world outside from a "normal" contribution
                const editor = (_a = editorService.listCodeEditors().find(editor => editor.getModel() === model)) !== null && _a !== void 0 ? _a : _editor;
                return editor.getOption(id);
            });
            EditorContribution._disposable = languageFeatureService.inlineCompletionsProvider.register('*', provider);
        }
    }
    dispose() {
        var _a;
        if (--EditorContribution._counter === 0) {
            (_a = EditorContribution._disposable) === null || _a === void 0 ? void 0 : _a.dispose();
            EditorContribution._disposable = undefined;
        }
    }
};
EditorContribution._counter = 0;
EditorContribution = __decorate([
    __param(1, ILanguageFeaturesService),
    __param(2, ICodeEditorService),
    __param(3, IInstantiationService)
], EditorContribution);
registerEditorContribution('suggest.inlineCompletionsProvider', EditorContribution, 0 /* EditorContributionInstantiation.Eager */); // eager because the contribution is used as a way to ONCE access a service to which a provider is registered
