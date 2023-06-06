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
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { matchesSubString } from '../../../../base/common/filters.js';
import { Disposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { derived } from '../../../../base/common/observable.js';
import { disposableObservableValue, transaction } from '../../../../base/common/observableImpl/base.js';
import { Position } from '../../../common/core/position.js';
import { InlineCompletionTriggerKind } from '../../../common/languages.js';
import { ILanguageConfigurationService } from '../../../common/languages/languageConfigurationRegistry.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { SingleTextEdit } from './singleTextEdit.js';
import { provideInlineCompletions } from './provideInlineCompletions.js';
export let InlineCompletionsSource = class InlineCompletionsSource extends Disposable {
    constructor(textModel, versionId, _debounceValue, languageFeaturesService, languageConfigurationService) {
        super();
        this.textModel = textModel;
        this.versionId = versionId;
        this._debounceValue = _debounceValue;
        this.languageFeaturesService = languageFeaturesService;
        this.languageConfigurationService = languageConfigurationService;
        this._updateOperation = this._register(new MutableDisposable());
        this.inlineCompletions = disposableObservableValue('inlineCompletions', undefined);
        this.suggestWidgetInlineCompletions = disposableObservableValue('suggestWidgetInlineCompletions', undefined);
        this._register(this.textModel.onDidChangeContent(() => {
            this._updateOperation.clear();
        }));
    }
    fetch(position, context, activeInlineCompletion) {
        var _a, _b;
        const request = new UpdateRequest(position, context, this.textModel.getVersionId());
        const target = context.selectedSuggestionInfo ? this.suggestWidgetInlineCompletions : this.inlineCompletions;
        if ((_a = this._updateOperation.value) === null || _a === void 0 ? void 0 : _a.request.satisfies(request)) {
            return this._updateOperation.value.promise;
        }
        else if ((_b = target.get()) === null || _b === void 0 ? void 0 : _b.request.satisfies(request)) {
            return Promise.resolve(true);
        }
        const updateOngoing = !!this._updateOperation.value;
        this._updateOperation.clear();
        const source = new CancellationTokenSource();
        const promise = (() => __awaiter(this, void 0, void 0, function* () {
            const shouldDebounce = updateOngoing || context.triggerKind === InlineCompletionTriggerKind.Automatic;
            if (shouldDebounce) {
                // This debounces the operation
                yield wait(this._debounceValue.get(this.textModel));
            }
            if (source.token.isCancellationRequested || this.textModel.getVersionId() !== request.versionId) {
                return false;
            }
            const startTime = new Date();
            const updatedCompletions = yield provideInlineCompletions(this.languageFeaturesService.inlineCompletionsProvider, position, this.textModel, context, source.token, this.languageConfigurationService);
            if (source.token.isCancellationRequested || this.textModel.getVersionId() !== request.versionId) {
                return false;
            }
            const endTime = new Date();
            this._debounceValue.update(this.textModel, endTime.getTime() - startTime.getTime());
            const completions = new UpToDateInlineCompletions(updatedCompletions, request, this.textModel, this.versionId);
            if (activeInlineCompletion) {
                const asInlineCompletion = activeInlineCompletion.toInlineCompletion(undefined);
                if (activeInlineCompletion.canBeReused(this.textModel, position) && !updatedCompletions.has(asInlineCompletion)) {
                    completions.prepend(activeInlineCompletion.inlineCompletion, asInlineCompletion.range, true);
                }
            }
            this._updateOperation.clear();
            transaction(tx => {
                target.set(completions, tx);
            });
            return true;
        }))();
        const updateOperation = new UpdateOperation(request, source, promise);
        this._updateOperation.value = updateOperation;
        return promise;
    }
    clear(tx) {
        this._updateOperation.clear();
        this.inlineCompletions.set(undefined, tx);
        this.suggestWidgetInlineCompletions.set(undefined, tx);
    }
    clearSuggestWidgetInlineCompletions(tx) {
        var _a;
        if ((_a = this._updateOperation.value) === null || _a === void 0 ? void 0 : _a.request.context.selectedSuggestionInfo) {
            this._updateOperation.clear();
        }
        this.suggestWidgetInlineCompletions.set(undefined, tx);
    }
    cancelUpdate() {
        this._updateOperation.clear();
    }
};
InlineCompletionsSource = __decorate([
    __param(3, ILanguageFeaturesService),
    __param(4, ILanguageConfigurationService)
], InlineCompletionsSource);
function wait(ms, cancellationToken) {
    return new Promise(resolve => {
        let d = undefined;
        const handle = setTimeout(() => {
            if (d) {
                d.dispose();
            }
            resolve();
        }, ms);
        if (cancellationToken) {
            d = cancellationToken.onCancellationRequested(() => {
                clearTimeout(handle);
                if (d) {
                    d.dispose();
                }
                resolve();
            });
        }
    });
}
class UpdateRequest {
    constructor(position, context, versionId) {
        this.position = position;
        this.context = context;
        this.versionId = versionId;
    }
    satisfies(other) {
        return this.position.equals(other.position)
            && equals(this.context.selectedSuggestionInfo, other.context.selectedSuggestionInfo, (v1, v2) => v1.equals(v2))
            && (other.context.triggerKind === InlineCompletionTriggerKind.Automatic
                || this.context.triggerKind === InlineCompletionTriggerKind.Explicit)
            && this.versionId === other.versionId;
    }
}
function equals(v1, v2, equals) {
    if (!v1 || !v2) {
        return v1 === v2;
    }
    return equals(v1, v2);
}
class UpdateOperation {
    constructor(request, cancellationTokenSource, promise) {
        this.request = request;
        this.cancellationTokenSource = cancellationTokenSource;
        this.promise = promise;
    }
    dispose() {
        this.cancellationTokenSource.cancel();
    }
}
export class UpToDateInlineCompletions {
    get inlineCompletions() { return this._inlineCompletions; }
    constructor(inlineCompletionProviderResult, request, textModel, versionId) {
        this.inlineCompletionProviderResult = inlineCompletionProviderResult;
        this.request = request;
        this.textModel = textModel;
        this.versionId = versionId;
        this._refCount = 1;
        this._prependedInlineCompletionItems = [];
        this._rangeVersionIdValue = 0;
        this._rangeVersionId = derived('ranges', reader => {
            this.versionId.read(reader);
            let changed = false;
            for (const i of this._inlineCompletions) {
                changed = changed || i._updateRange(this.textModel);
            }
            if (changed) {
                this._rangeVersionIdValue++;
            }
            return this._rangeVersionIdValue;
        });
        const ids = textModel.deltaDecorations([], inlineCompletionProviderResult.completions.map(i => ({
            range: i.range,
            options: {
                description: 'inline-completion-tracking-range'
            },
        })));
        this._inlineCompletions = inlineCompletionProviderResult.completions.map((i, index) => new InlineCompletionWithUpdatedRange(i, ids[index], this._rangeVersionId));
    }
    clone() {
        this._refCount++;
        return this;
    }
    dispose() {
        this._refCount--;
        if (this._refCount === 0) {
            this.textModel.deltaDecorations(this._inlineCompletions.map(i => i.decorationId), []);
            this.inlineCompletionProviderResult.dispose();
            for (const i of this._prependedInlineCompletionItems) {
                i.source.removeRef();
            }
        }
    }
    prepend(inlineCompletion, range, addRefToSource) {
        if (addRefToSource) {
            inlineCompletion.source.addRef();
        }
        const id = this.textModel.deltaDecorations([], [{
                range,
                options: {
                    description: 'inline-completion-tracking-range'
                },
            }])[0];
        this._inlineCompletions.unshift(new InlineCompletionWithUpdatedRange(inlineCompletion, id, this._rangeVersionId, range));
        this._prependedInlineCompletionItems.push(inlineCompletion);
    }
}
export class InlineCompletionWithUpdatedRange {
    get forwardStable() {
        var _a;
        return (_a = this.inlineCompletion.source.inlineCompletions.enableForwardStability) !== null && _a !== void 0 ? _a : false;
    }
    constructor(inlineCompletion, decorationId, rangeVersion, initialRange) {
        this.inlineCompletion = inlineCompletion;
        this.decorationId = decorationId;
        this.rangeVersion = rangeVersion;
        this.semanticId = JSON.stringify([
            this.inlineCompletion.filterText,
            this.inlineCompletion.insertText,
            this.inlineCompletion.range.getStartPosition().toString()
        ]);
        this._isValid = true;
        this._updatedRange = initialRange !== null && initialRange !== void 0 ? initialRange : inlineCompletion.range;
    }
    toInlineCompletion(reader) {
        return this.inlineCompletion.withRange(this._getUpdatedRange(reader));
    }
    toSingleTextEdit(reader) {
        return new SingleTextEdit(this._getUpdatedRange(reader), this.inlineCompletion.insertText);
    }
    isVisible(model, cursorPosition, reader) {
        const minimizedReplacement = this._toFilterTextReplacement(reader).removeCommonPrefix(model);
        if (!this._isValid
            || !this.inlineCompletion.range.getStartPosition().equals(this._getUpdatedRange(reader).getStartPosition())
            || cursorPosition.lineNumber !== minimizedReplacement.range.startLineNumber) {
            return false;
        }
        const originalValue = model.getValueInRange(minimizedReplacement.range, 1 /* EndOfLinePreference.LF */).toLowerCase();
        const filterText = minimizedReplacement.text.toLowerCase();
        const cursorPosIndex = Math.max(0, cursorPosition.column - minimizedReplacement.range.startColumn);
        let filterTextBefore = filterText.substring(0, cursorPosIndex);
        let filterTextAfter = filterText.substring(cursorPosIndex);
        let originalValueBefore = originalValue.substring(0, cursorPosIndex);
        let originalValueAfter = originalValue.substring(cursorPosIndex);
        const originalValueIndent = model.getLineIndentColumn(minimizedReplacement.range.startLineNumber);
        if (minimizedReplacement.range.startColumn <= originalValueIndent) {
            // Remove indentation
            originalValueBefore = originalValueBefore.trimStart();
            if (originalValueBefore.length === 0) {
                originalValueAfter = originalValueAfter.trimStart();
            }
            filterTextBefore = filterTextBefore.trimStart();
            if (filterTextBefore.length === 0) {
                filterTextAfter = filterTextAfter.trimStart();
            }
        }
        return filterTextBefore.startsWith(originalValueBefore)
            && !!matchesSubString(originalValueAfter, filterTextAfter);
    }
    canBeReused(model, position) {
        const result = this._isValid
            && this._getUpdatedRange(undefined).containsPosition(position)
            && this.isVisible(model, position, undefined)
            && !this._isSmallerThanOriginal(undefined);
        return result;
    }
    _toFilterTextReplacement(reader) {
        return new SingleTextEdit(this._getUpdatedRange(reader), this.inlineCompletion.filterText);
    }
    _isSmallerThanOriginal(reader) {
        return length(this._getUpdatedRange(reader)).isBefore(length(this.inlineCompletion.range));
    }
    _getUpdatedRange(reader) {
        this.rangeVersion.read(reader); // This makes sure all the ranges are updated.
        return this._updatedRange;
    }
    _updateRange(textModel) {
        const range = textModel.getDecorationRange(this.decorationId);
        if (!range) {
            // A setValue call might flush all decorations.
            this._isValid = false;
            return true;
        }
        if (!this._updatedRange.equalsRange(range)) {
            this._updatedRange = range;
            return true;
        }
        return false;
    }
}
function length(range) {
    if (range.startLineNumber === range.endLineNumber) {
        return new Position(1, 1 + range.endColumn - range.startColumn);
    }
    else {
        return new Position(1 + range.endLineNumber - range.startLineNumber, range.endColumn);
    }
}
