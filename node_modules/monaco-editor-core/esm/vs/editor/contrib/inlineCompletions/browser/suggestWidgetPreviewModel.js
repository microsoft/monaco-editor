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
import { createCancelablePromise, RunOnceScheduler } from '../../../../base/common/async.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { InlineCompletionTriggerKind } from '../../../common/languages.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { BaseGhostTextWidgetModel, GhostText } from './ghostText.js';
import { provideInlineCompletions, UpdateOperation } from './inlineCompletionsModel.js';
import { inlineCompletionToGhostText, minimizeInlineCompletion } from './inlineCompletionToGhostText.js';
import { SuggestWidgetInlineCompletionProvider } from './suggestWidgetInlineCompletionProvider.js';
let SuggestWidgetPreviewModel = class SuggestWidgetPreviewModel extends BaseGhostTextWidgetModel {
    get isActive() {
        return this.suggestionInlineCompletionSource.state !== undefined;
    }
    constructor(editor, cache, languageFeaturesService) {
        super(editor);
        this.cache = cache;
        this.languageFeaturesService = languageFeaturesService;
        this.suggestionInlineCompletionSource = this._register(new SuggestWidgetInlineCompletionProvider(this.editor, 
        // Use the first cache item (if any) as preselection.
        () => {
            var _a, _b, _c;
            // We might get asked in a content change event before the cache has received that event.
            (_a = this.cache.value) === null || _a === void 0 ? void 0 : _a.updateRanges();
            return (_c = (_b = this.cache.value) === null || _b === void 0 ? void 0 : _b.completions[0]) === null || _c === void 0 ? void 0 : _c.toLiveInlineCompletion();
        }));
        this.updateOperation = this._register(new MutableDisposable());
        this.updateCacheSoon = this._register(new RunOnceScheduler(() => this.updateCache(), 50));
        this.minReservedLineCount = 0;
        this._register(this.suggestionInlineCompletionSource.onDidChange(() => {
            if (!this.editor.hasModel()) {
                // onDidChange might be called when calling setModel on the editor, before we are disposed.
                return;
            }
            this.updateCacheSoon.schedule();
            const suggestWidgetState = this.suggestionInlineCompletionSource.state;
            if (!suggestWidgetState) {
                this.minReservedLineCount = 0;
            }
            const newGhostText = this.ghostText;
            if (newGhostText) {
                this.minReservedLineCount = Math.max(this.minReservedLineCount, sum(newGhostText.parts.map(p => p.lines.length - 1)));
            }
            if (this.minReservedLineCount >= 1) {
                this.suggestionInlineCompletionSource.forceRenderingAbove();
            }
            else {
                this.suggestionInlineCompletionSource.stopForceRenderingAbove();
            }
            this.onDidChangeEmitter.fire();
        }));
        this._register(this.cache.onDidChange(() => {
            this.onDidChangeEmitter.fire();
        }));
        this._register(this.editor.onDidChangeCursorPosition((e) => {
            this.minReservedLineCount = 0;
            this.updateCacheSoon.schedule();
            this.onDidChangeEmitter.fire();
        }));
        this._register(toDisposable(() => this.suggestionInlineCompletionSource.stopForceRenderingAbove()));
    }
    isSuggestionPreviewEnabled() {
        const suggestOptions = this.editor.getOption(112 /* EditorOption.suggest */);
        return suggestOptions.preview;
    }
    updateCache() {
        return __awaiter(this, void 0, void 0, function* () {
            const state = this.suggestionInlineCompletionSource.state;
            if (!state || !state.selectedItem) {
                return;
            }
            const info = {
                text: state.selectedItem.normalizedInlineCompletion.insertText,
                range: state.selectedItem.normalizedInlineCompletion.range,
                isSnippetText: state.selectedItem.isSnippetText,
                completionKind: state.selectedItem.completionItemKind,
            };
            const position = this.editor.getPosition();
            if (state.selectedItem.isSnippetText ||
                state.selectedItem.completionItemKind === 27 /* CompletionItemKind.Snippet */ ||
                state.selectedItem.completionItemKind === 20 /* CompletionItemKind.File */ ||
                state.selectedItem.completionItemKind === 23 /* CompletionItemKind.Folder */) {
                // Don't ask providers for these types of suggestions.
                this.cache.clear();
                return;
            }
            const promise = createCancelablePromise((token) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield provideInlineCompletions(this.languageFeaturesService.inlineCompletionsProvider, position, this.editor.getModel(), { triggerKind: InlineCompletionTriggerKind.Automatic, selectedSuggestionInfo: info }, token);
                }
                catch (e) {
                    onUnexpectedError(e);
                    return;
                }
                if (token.isCancellationRequested) {
                    result.dispose();
                    return;
                }
                this.cache.setValue(this.editor, result, InlineCompletionTriggerKind.Automatic);
                this.onDidChangeEmitter.fire();
            }));
            const operation = new UpdateOperation(promise, InlineCompletionTriggerKind.Automatic);
            this.updateOperation.value = operation;
            yield promise;
            if (this.updateOperation.value === operation) {
                this.updateOperation.clear();
            }
        });
    }
    get ghostText() {
        var _a, _b, _c;
        const isSuggestionPreviewEnabled = this.isSuggestionPreviewEnabled();
        const model = this.editor.getModel();
        const augmentedCompletion = minimizeInlineCompletion(model, (_b = (_a = this.cache.value) === null || _a === void 0 ? void 0 : _a.completions[0]) === null || _b === void 0 ? void 0 : _b.toLiveInlineCompletion());
        const suggestWidgetState = this.suggestionInlineCompletionSource.state;
        const suggestInlineCompletion = minimizeInlineCompletion(model, (_c = suggestWidgetState === null || suggestWidgetState === void 0 ? void 0 : suggestWidgetState.selectedItem) === null || _c === void 0 ? void 0 : _c.normalizedInlineCompletion);
        const isAugmentedCompletionValid = augmentedCompletion
            && suggestInlineCompletion
            // The intellisense completion must be a prefix of the augmented completion
            && augmentedCompletion.insertText.startsWith(suggestInlineCompletion.insertText)
            // The augmented completion must replace the intellisense completion range, but can replace even more
            && rangeExtends(augmentedCompletion.range, suggestInlineCompletion.range);
        if (!isSuggestionPreviewEnabled && !isAugmentedCompletionValid) {
            return undefined;
        }
        // If the augmented completion is not valid and there is no suggest inline completion, we still show the augmented completion.
        const finalCompletion = isAugmentedCompletionValid ? augmentedCompletion : (suggestInlineCompletion || augmentedCompletion);
        const inlineCompletionPreviewLength = isAugmentedCompletionValid ? finalCompletion.insertText.length - suggestInlineCompletion.insertText.length : 0;
        const newGhostText = this.toGhostText(finalCompletion, inlineCompletionPreviewLength);
        return newGhostText;
    }
    toGhostText(completion, inlineCompletionPreviewLength) {
        const mode = this.editor.getOptions().get(112 /* EditorOption.suggest */).previewMode;
        return completion
            ? (inlineCompletionToGhostText(completion, this.editor.getModel(), mode, this.editor.getPosition(), inlineCompletionPreviewLength) ||
                // Show an invisible ghost text to reserve space
                new GhostText(completion.range.endLineNumber, [], this.minReservedLineCount))
            : undefined;
    }
};
SuggestWidgetPreviewModel = __decorate([
    __param(2, ILanguageFeaturesService)
], SuggestWidgetPreviewModel);
export { SuggestWidgetPreviewModel };
function sum(arr) {
    return arr.reduce((a, b) => a + b, 0);
}
function rangeExtends(extendingRange, rangeToExtend) {
    return extendingRange.startLineNumber === rangeToExtend.startLineNumber &&
        extendingRange.startColumn === rangeToExtend.startColumn &&
        ((extendingRange.endLineNumber === rangeToExtend.endLineNumber && extendingRange.endColumn >= rangeToExtend.endColumn)
            || extendingRange.endLineNumber > rangeToExtend.endLineNumber);
}
