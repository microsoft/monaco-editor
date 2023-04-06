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
import { assertNever } from '../../../../base/common/assert.js';
import { createCancelablePromise, RunOnceScheduler } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { onUnexpectedError, onUnexpectedExternalError } from '../../../../base/common/errors.js';
import { Emitter } from '../../../../base/common/event.js';
import { matchesSubString } from '../../../../base/common/filters.js';
import { Disposable, MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { CoreEditingCommands } from '../../../browser/coreCommands.js';
import { EditOperation } from '../../../common/core/editOperation.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { InlineCompletionTriggerKind } from '../../../common/languages.js';
import { ILanguageConfigurationService } from '../../../common/languages/languageConfigurationRegistry.js';
import { fixBracketsInLine } from '../../../common/model/bracketPairsTextModelPart/fixBrackets.js';
import { ILanguageFeatureDebounceService } from '../../../common/services/languageFeatureDebounce.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { inlineSuggestCommitId } from './consts.js';
import { BaseGhostTextWidgetModel, GhostTextReplacement } from './ghostText.js';
import { inlineCompletionToGhostText } from './inlineCompletionToGhostText.js';
import { InlineSuggestionHintsContentWidget } from './inlineSuggestionHintsWidget.js';
import { getReadonlyEmptyArray } from './utils.js';
import { SnippetController2 } from '../../snippet/browser/snippetController2.js';
import { SnippetParser, Text } from '../../snippet/browser/snippetParser.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
let InlineCompletionsModel = class InlineCompletionsModel extends Disposable {
    constructor(editor, cache, commandService, languageConfigurationService, languageFeaturesService, debounceService, configurationService) {
        super();
        this.editor = editor;
        this.cache = cache;
        this.commandService = commandService;
        this.languageConfigurationService = languageConfigurationService;
        this.languageFeaturesService = languageFeaturesService;
        this.debounceService = debounceService;
        this.onDidChangeEmitter = new Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
        this.completionSession = this._register(new MutableDisposable());
        this.active = false;
        this.disposed = false;
        this.debounceValue = this.debounceService.for(this.languageFeaturesService.inlineCompletionsProvider, 'InlineCompletionsDebounce', { min: 50, max: 50 });
        this._register(commandService.onDidExecuteCommand((e) => {
            // These commands don't trigger onDidType.
            const commands = new Set([
                CoreEditingCommands.Tab.id,
                CoreEditingCommands.DeleteLeft.id,
                CoreEditingCommands.DeleteRight.id,
                inlineSuggestCommitId,
                'acceptSelectedSuggestion',
            ]);
            if (commands.has(e.commandId) && editor.hasTextFocus()) {
                this.handleUserInput();
            }
        }));
        this._register(this.editor.onDidType((e) => {
            this.handleUserInput();
        }));
        this._register(this.editor.onDidChangeCursorPosition((e) => {
            if (e.reason === 3 /* CursorChangeReason.Explicit */ ||
                this.session && !this.session.isValid) {
                this.hide();
            }
        }));
        this._register(toDisposable(() => {
            this.disposed = true;
        }));
        this._register(this.editor.onDidBlurEditorWidget(() => {
            // This is a hidden setting very useful for debugging
            if (configurationService.getValue('editor.inlineSuggest.hideOnBlur')) {
                return;
            }
            if (InlineSuggestionHintsContentWidget.dropDownVisible) {
                return;
            }
            this.hide();
        }));
    }
    handleUserInput() {
        if (this.session && !this.session.isValid) {
            this.hide();
        }
        setTimeout(() => {
            if (this.disposed) {
                return;
            }
            // Wait for the cursor update that happens in the same iteration loop iteration
            this.startSessionIfTriggered();
        }, 0);
    }
    get session() {
        return this.completionSession.value;
    }
    get ghostText() {
        var _a;
        return (_a = this.session) === null || _a === void 0 ? void 0 : _a.ghostText;
    }
    get minReservedLineCount() {
        return this.session ? this.session.minReservedLineCount : 0;
    }
    setExpanded(expanded) {
        var _a;
        (_a = this.session) === null || _a === void 0 ? void 0 : _a.setExpanded(expanded);
    }
    setActive(active) {
        var _a;
        this.active = active;
        if (active) {
            (_a = this.session) === null || _a === void 0 ? void 0 : _a.scheduleAutomaticUpdate();
        }
    }
    startSessionIfTriggered() {
        const suggestOptions = this.editor.getOption(60 /* EditorOption.inlineSuggest */);
        if (!suggestOptions.enabled) {
            return;
        }
        if (this.session && this.session.isValid) {
            return;
        }
        this.trigger(InlineCompletionTriggerKind.Automatic);
    }
    trigger(triggerKind) {
        if (this.completionSession.value) {
            if (triggerKind === InlineCompletionTriggerKind.Explicit) {
                void this.completionSession.value.ensureUpdateWithExplicitContext();
            }
            return;
        }
        this.completionSession.value = new InlineCompletionsSession(this.editor, this.editor.getPosition(), () => this.active, this.commandService, this.cache, triggerKind, this.languageConfigurationService, this.languageFeaturesService.inlineCompletionsProvider, this.debounceValue);
        this.completionSession.value.takeOwnership(this.completionSession.value.onDidChange(() => {
            this.onDidChangeEmitter.fire();
        }));
    }
    hide() {
        if (this.completionSession.value) {
            this.completionSession.clear();
            this.onDidChangeEmitter.fire();
        }
    }
    commitCurrentSuggestion() {
        var _a;
        // Don't dispose the session, so that after committing, more suggestions are shown.
        (_a = this.session) === null || _a === void 0 ? void 0 : _a.commitCurrentCompletion();
    }
    commitCurrentSuggestionPartially() {
        var _a;
        (_a = this.session) === null || _a === void 0 ? void 0 : _a.commitCurrentCompletionNextWord();
    }
    showNext() {
        var _a;
        (_a = this.session) === null || _a === void 0 ? void 0 : _a.showNextInlineCompletion();
    }
    showPrevious() {
        var _a;
        (_a = this.session) === null || _a === void 0 ? void 0 : _a.showPreviousInlineCompletion();
    }
};
InlineCompletionsModel = __decorate([
    __param(2, ICommandService),
    __param(3, ILanguageConfigurationService),
    __param(4, ILanguageFeaturesService),
    __param(5, ILanguageFeatureDebounceService),
    __param(6, IConfigurationService)
], InlineCompletionsModel);
export { InlineCompletionsModel };
export class InlineCompletionsSession extends BaseGhostTextWidgetModel {
    constructor(editor, triggerPosition, shouldUpdate, commandService, cache, initialTriggerKind, languageConfigurationService, registry, debounce) {
        super(editor);
        this.triggerPosition = triggerPosition;
        this.shouldUpdate = shouldUpdate;
        this.commandService = commandService;
        this.cache = cache;
        this.initialTriggerKind = initialTriggerKind;
        this.languageConfigurationService = languageConfigurationService;
        this.registry = registry;
        this.debounce = debounce;
        this.minReservedLineCount = 0;
        this.updateOperation = this._register(new MutableDisposable());
        this.updateSoon = this._register(new RunOnceScheduler(() => {
            const triggerKind = this.initialTriggerKind;
            // All subsequent triggers are automatic.
            this.initialTriggerKind = InlineCompletionTriggerKind.Automatic;
            return this.update(triggerKind);
        }, 50));
        this.filteredCompletions = [];
        //#region Selection
        // We use a semantic id to track the selection even if the cache changes.
        this.currentlySelectedCompletionId = undefined;
        let lastCompletionItem = undefined;
        this._register(this.onDidChange(() => {
            var _a;
            const currentCompletion = this.currentCompletion;
            if (currentCompletion && currentCompletion.sourceInlineCompletion !== lastCompletionItem) {
                lastCompletionItem = currentCompletion.sourceInlineCompletion;
                const provider = currentCompletion.sourceProvider;
                (_a = provider.handleItemDidShow) === null || _a === void 0 ? void 0 : _a.call(provider, currentCompletion.sourceInlineCompletions, lastCompletionItem);
            }
        }));
        this._register(toDisposable(() => {
            this.cache.clear();
        }));
        this._register(this.editor.onDidChangeCursorPosition((e) => {
            var _a;
            if (e.reason === 3 /* CursorChangeReason.Explicit */) {
                return;
            }
            // Ghost text depends on the cursor position
            (_a = this.cache.value) === null || _a === void 0 ? void 0 : _a.updateRanges();
            if (this.cache.value) {
                this.updateFilteredInlineCompletions();
                this.onDidChangeEmitter.fire();
            }
        }));
        this._register(this.editor.onDidChangeModelContent((e) => {
            var _a;
            // Call this in case `onDidChangeModelContent` calls us first.
            (_a = this.cache.value) === null || _a === void 0 ? void 0 : _a.updateRanges();
            this.updateFilteredInlineCompletions();
            this.scheduleAutomaticUpdate();
        }));
        this._register(this.registry.onDidChange(() => {
            this.updateSoon.schedule(this.debounce.get(this.editor.getModel()));
        }));
        this.scheduleAutomaticUpdate();
    }
    updateFilteredInlineCompletions() {
        if (!this.cache.value) {
            this.filteredCompletions = [];
            return;
        }
        const model = this.editor.getModel();
        const cursorPosition = model.validatePosition(this.editor.getPosition());
        this.filteredCompletions = this.cache.value.completions.filter(c => {
            const originalValue = model.getValueInRange(c.synchronizedRange).toLowerCase();
            const filterText = c.inlineCompletion.filterText.toLowerCase();
            const indent = model.getLineIndentColumn(c.synchronizedRange.startLineNumber);
            const cursorPosIndex = Math.max(0, cursorPosition.column - c.synchronizedRange.startColumn);
            let filterTextBefore = filterText.substring(0, cursorPosIndex);
            let filterTextAfter = filterText.substring(cursorPosIndex);
            let originalValueBefore = originalValue.substring(0, cursorPosIndex);
            let originalValueAfter = originalValue.substring(cursorPosIndex);
            if (c.synchronizedRange.startColumn <= indent) {
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
                && matchesSubString(originalValueAfter, filterTextAfter);
        });
    }
    get currentlySelectedIndex() {
        return this.fixAndGetIndexOfCurrentSelection();
    }
    fixAndGetIndexOfCurrentSelection() {
        if (!this.currentlySelectedCompletionId || !this.cache.value) {
            return 0;
        }
        if (this.cache.value.completions.length === 0) {
            // don't reset the selection in this case
            return 0;
        }
        const idx = this.filteredCompletions.findIndex(v => v.semanticId === this.currentlySelectedCompletionId);
        if (idx === -1) {
            // Reset the selection so that the selection does not jump back when it appears again
            this.currentlySelectedCompletionId = undefined;
            return 0;
        }
        return idx;
    }
    get currentCachedCompletion() {
        if (!this.cache.value) {
            return undefined;
        }
        return this.filteredCompletions[this.fixAndGetIndexOfCurrentSelection()];
    }
    showNextInlineCompletion() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureUpdateWithExplicitContext();
            const completions = this.filteredCompletions || [];
            if (completions.length > 0) {
                const newIdx = (this.fixAndGetIndexOfCurrentSelection() + 1) % completions.length;
                this.currentlySelectedCompletionId = completions[newIdx].semanticId;
            }
            else {
                this.currentlySelectedCompletionId = undefined;
            }
            this.onDidChangeEmitter.fire();
        });
    }
    showPreviousInlineCompletion() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureUpdateWithExplicitContext();
            const completions = this.filteredCompletions || [];
            if (completions.length > 0) {
                const newIdx = (this.fixAndGetIndexOfCurrentSelection() + completions.length - 1) % completions.length;
                this.currentlySelectedCompletionId = completions[newIdx].semanticId;
            }
            else {
                this.currentlySelectedCompletionId = undefined;
            }
            this.onDidChangeEmitter.fire();
        });
    }
    get hasBeenTriggeredExplicitly() {
        var _a;
        return ((_a = this.cache.value) === null || _a === void 0 ? void 0 : _a.triggerKind) === InlineCompletionTriggerKind.Explicit;
    }
    ensureUpdateWithExplicitContext() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.updateOperation.value) {
                // Restart or wait for current update operation
                if (this.updateOperation.value.triggerKind === InlineCompletionTriggerKind.Explicit) {
                    yield this.updateOperation.value.promise;
                }
                else {
                    yield this.update(InlineCompletionTriggerKind.Explicit);
                }
            }
            else if (((_a = this.cache.value) === null || _a === void 0 ? void 0 : _a.triggerKind) !== InlineCompletionTriggerKind.Explicit) {
                // Refresh cache
                yield this.update(InlineCompletionTriggerKind.Explicit);
            }
        });
    }
    getInlineCompletionsCountSync() {
        return this.filteredCompletions.length || 0;
    }
    //#endregion
    get ghostText() {
        const currentCompletion = this.currentCompletion;
        if (!currentCompletion) {
            return undefined;
        }
        const cursorPosition = this.editor.getPosition();
        if (currentCompletion.range.getEndPosition().isBefore(cursorPosition)) {
            return undefined;
        }
        const mode = this.editor.getOptions().get(60 /* EditorOption.inlineSuggest */).mode;
        const ghostText = inlineCompletionToGhostText(currentCompletion, this.editor.getModel(), mode, cursorPosition);
        if (ghostText) {
            if (ghostText.isEmpty()) {
                return undefined;
            }
            return ghostText;
        }
        return new GhostTextReplacement(currentCompletion.range.startLineNumber, currentCompletion.range.startColumn, currentCompletion.range.endColumn - currentCompletion.range.startColumn, currentCompletion.insertText.split('\n'), 0);
    }
    get currentCompletion() {
        const completion = this.currentCachedCompletion;
        if (!completion) {
            return undefined;
        }
        return completion.toLiveInlineCompletion();
    }
    get isValid() {
        return this.editor.getPosition().lineNumber === this.triggerPosition.lineNumber;
    }
    scheduleAutomaticUpdate() {
        // Since updateSoon debounces, starvation can happen.
        // To prevent stale cache, we clear the current update operation.
        this.updateOperation.clear();
        this.updateSoon.schedule(this.debounce.get(this.editor.getModel()));
    }
    update(triggerKind) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.shouldUpdate()) {
                return;
            }
            const position = this.editor.getPosition();
            const startTime = new Date();
            const promise = createCancelablePromise((token) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield provideInlineCompletions(this.registry, position, this.editor.getModel(), { triggerKind, selectedSuggestionInfo: undefined }, token, this.languageConfigurationService);
                    const endTime = new Date();
                    if (this.editor.hasModel()) {
                        this.debounce.update(this.editor.getModel(), endTime.getTime() - startTime.getTime());
                    }
                }
                catch (e) {
                    onUnexpectedError(e);
                    return;
                }
                if (token.isCancellationRequested) {
                    return;
                }
                this.cache.setValue(this.editor, result, triggerKind);
                this.updateFilteredInlineCompletions();
                this.onDidChangeEmitter.fire();
            }));
            const operation = new UpdateOperation(promise, triggerKind);
            this.updateOperation.value = operation;
            yield promise;
            if (this.updateOperation.value === operation) {
                this.updateOperation.clear();
            }
        });
    }
    takeOwnership(disposable) {
        this._register(disposable);
    }
    commitCurrentCompletionNextWord() {
        const ghostText = this.ghostText;
        if (!ghostText) {
            return;
        }
        const completion = this.currentCompletion;
        if (!completion) {
            return;
        }
        if (completion.snippetInfo || completion.filterText !== completion.insertText) {
            // not in WYSIWYG mode, partial commit might change completion, thus it is not supported
            this.commit(completion);
            return;
        }
        if (ghostText.parts.length === 0) {
            return;
        }
        const firstPart = ghostText.parts[0];
        const position = new Position(ghostText.lineNumber, firstPart.column);
        const line = firstPart.lines[0];
        const langId = this.editor.getModel().getLanguageIdAtPosition(ghostText.lineNumber, 1);
        const config = this.languageConfigurationService.getLanguageConfiguration(langId);
        const wordRegExp = new RegExp(config.wordDefinition.source, config.wordDefinition.flags.replace('g', ''));
        const m1 = line.match(wordRegExp);
        let acceptUntilIndexExclusive = 0;
        if (m1 && m1.index !== undefined) {
            if (m1.index === 0) {
                acceptUntilIndexExclusive = m1[0].length;
            }
            else {
                acceptUntilIndexExclusive = m1.index;
            }
        }
        else {
            acceptUntilIndexExclusive = line.length;
        }
        const wsRegExp = /\s/g;
        let m2 = wsRegExp.exec(line);
        if (m2 && m2.index === 0) {
            m2 = wsRegExp.exec(line);
        }
        if (m2 && m2.index !== undefined) {
            if (m2.index < acceptUntilIndexExclusive) {
                acceptUntilIndexExclusive = m2.index;
            }
        }
        const partialText = line.substring(0, acceptUntilIndexExclusive);
        this.editor.pushUndoStop();
        this.editor.executeEdits('inlineSuggestion.accept', [
            EditOperation.replace(Range.fromPositions(position), partialText),
        ]);
        this.editor.setPosition(position.delta(0, partialText.length));
        if (completion.sourceProvider.handlePartialAccept) {
            const acceptedRange = Range.fromPositions(completion.range.getStartPosition(), position.delta(0, acceptUntilIndexExclusive));
            // This assumes that the inline completion and the model use the same EOL style.
            // This is not a problem at the moment, because partial acceptance only works for the first line of an
            // inline completion.
            const text = this.editor.getModel().getValueInRange(acceptedRange);
            completion.sourceProvider.handlePartialAccept(completion.sourceInlineCompletions, completion.sourceInlineCompletion, text.length);
        }
    }
    commitCurrentCompletion() {
        const ghostText = this.ghostText;
        if (!ghostText) {
            // No ghost text was shown for this completion.
            // Thus, we don't want to commit anything.
            return;
        }
        const completion = this.currentCompletion;
        if (completion) {
            this.commit(completion);
        }
    }
    commit(completion) {
        var _a;
        // Mark the cache as stale, but don't dispose it yet,
        // otherwise command args might get disposed.
        const cache = this.cache.clearAndLeak();
        this.editor.pushUndoStop();
        if (completion.snippetInfo) {
            this.editor.executeEdits('inlineSuggestion.accept', [
                EditOperation.replaceMove(completion.range, ''),
                ...completion.additionalTextEdits
            ]);
            this.editor.setPosition(completion.snippetInfo.range.getStartPosition());
            (_a = SnippetController2.get(this.editor)) === null || _a === void 0 ? void 0 : _a.insert(completion.snippetInfo.snippet, { undoStopBefore: false });
        }
        else {
            this.editor.executeEdits('inlineSuggestion.accept', [
                EditOperation.replaceMove(completion.range, completion.insertText),
                ...completion.additionalTextEdits
            ]);
        }
        if (completion.command) {
            this.commandService
                .executeCommand(completion.command.id, ...(completion.command.arguments || []))
                .finally(() => {
                cache === null || cache === void 0 ? void 0 : cache.dispose();
            })
                .then(undefined, onUnexpectedExternalError);
        }
        else {
            cache === null || cache === void 0 ? void 0 : cache.dispose();
        }
        this.onDidChangeEmitter.fire();
    }
    get commands() {
        var _a;
        const lists = new Set(((_a = this.cache.value) === null || _a === void 0 ? void 0 : _a.completions.map(c => c.inlineCompletion.sourceInlineCompletions)) || []);
        return [...lists].flatMap(l => l.commands || []);
    }
}
export class UpdateOperation {
    constructor(promise, triggerKind) {
        this.promise = promise;
        this.triggerKind = triggerKind;
    }
    dispose() {
        this.promise.cancel();
    }
}
/**
 * The cache keeps itself in sync with the editor.
 * It also owns the completions result and disposes it when the cache is diposed.
*/
export class SynchronizedInlineCompletionsCache extends Disposable {
    constructor(completionsSource, editor, onChange, triggerKind) {
        super();
        this.editor = editor;
        this.onChange = onChange;
        this.triggerKind = triggerKind;
        this.isDisposing = false;
        const decorationIds = editor.changeDecorations((changeAccessor) => {
            return changeAccessor.deltaDecorations([], completionsSource.items.map(i => ({
                range: i.range,
                options: {
                    description: 'inline-completion-tracking-range'
                },
            })));
        });
        this._register(toDisposable(() => {
            this.isDisposing = true;
            editor.removeDecorations(decorationIds);
        }));
        this.completions = completionsSource.items.map((c, idx) => new CachedInlineCompletion(c, decorationIds[idx]));
        this._register(editor.onDidChangeModelContent(() => {
            this.updateRanges();
        }));
        this._register(completionsSource);
    }
    updateRanges() {
        if (this.isDisposing) {
            return;
        }
        let hasChanged = false;
        const model = this.editor.getModel();
        for (const c of this.completions) {
            const newRange = model.getDecorationRange(c.decorationId);
            if (!newRange) {
                // onUnexpectedError(new Error('Decoration has no range'));
                continue;
            }
            if (!c.synchronizedRange.equalsRange(newRange)) {
                hasChanged = true;
                c.synchronizedRange = newRange;
            }
        }
        if (hasChanged) {
            this.onChange();
        }
    }
}
class CachedInlineCompletion {
    constructor(inlineCompletion, decorationId) {
        this.inlineCompletion = inlineCompletion;
        this.decorationId = decorationId;
        this.semanticId = JSON.stringify({
            text: this.inlineCompletion.insertText,
            abbreviation: this.inlineCompletion.filterText,
            startLine: this.inlineCompletion.range.startLineNumber,
            startColumn: this.inlineCompletion.range.startColumn,
            command: this.inlineCompletion.command
        });
        this.synchronizedRange = inlineCompletion.range;
    }
    toLiveInlineCompletion() {
        return {
            insertText: this.inlineCompletion.insertText,
            range: this.synchronizedRange,
            command: this.inlineCompletion.command,
            sourceProvider: this.inlineCompletion.sourceProvider,
            sourceInlineCompletions: this.inlineCompletion.sourceInlineCompletions,
            sourceInlineCompletion: this.inlineCompletion.sourceInlineCompletion,
            snippetInfo: this.inlineCompletion.snippetInfo,
            filterText: this.inlineCompletion.filterText,
            additionalTextEdits: this.inlineCompletion.additionalTextEdits,
        };
    }
}
export function provideInlineCompletions(registry, position, model, context, token = CancellationToken.None, languageConfigurationService) {
    return __awaiter(this, void 0, void 0, function* () {
        const defaultReplaceRange = getDefaultRange(position, model);
        const providers = registry.all(model);
        const results = yield Promise.all(providers.map((provider) => __awaiter(this, void 0, void 0, function* () {
            const completions = yield Promise.resolve(provider.provideInlineCompletions(model, position, context, token)).catch(onUnexpectedExternalError);
            return ({
                completions,
                provider,
                dispose: () => {
                    if (completions) {
                        provider.freeInlineCompletions(completions);
                    }
                }
            });
        })));
        const itemsByHash = new Map();
        for (const result of results) {
            const completions = result.completions;
            if (!completions) {
                continue;
            }
            for (const item of completions.items) {
                let range = item.range ? Range.lift(item.range) : defaultReplaceRange;
                if (range.startLineNumber !== range.endLineNumber) {
                    // Ignore invalid ranges.
                    continue;
                }
                let insertText;
                let snippetInfo;
                if (typeof item.insertText === 'string') {
                    insertText = item.insertText;
                    if (languageConfigurationService && item.completeBracketPairs) {
                        insertText = closeBrackets(insertText, range.getStartPosition(), model, languageConfigurationService);
                        // Modify range depending on if brackets are added or removed
                        const diff = insertText.length - item.insertText.length;
                        if (diff !== 0) {
                            range = new Range(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn + diff);
                        }
                    }
                    snippetInfo = undefined;
                }
                else if ('snippet' in item.insertText) {
                    const preBracketCompletionLength = item.insertText.snippet.length;
                    if (languageConfigurationService && item.completeBracketPairs) {
                        item.insertText.snippet = closeBrackets(item.insertText.snippet, range.getStartPosition(), model, languageConfigurationService);
                        // Modify range depending on if brackets are added or removed
                        const diff = item.insertText.snippet.length - preBracketCompletionLength;
                        if (diff !== 0) {
                            range = new Range(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn + diff);
                        }
                    }
                    const snippet = new SnippetParser().parse(item.insertText.snippet);
                    if (snippet.children.length === 1 && snippet.children[0] instanceof Text) {
                        insertText = snippet.children[0].value;
                        snippetInfo = undefined;
                    }
                    else {
                        insertText = snippet.toString();
                        snippetInfo = {
                            snippet: item.insertText.snippet,
                            range: range
                        };
                    }
                }
                else {
                    assertNever(item.insertText);
                }
                const trackedItem = ({
                    insertText,
                    snippetInfo,
                    range,
                    command: item.command,
                    sourceProvider: result.provider,
                    sourceInlineCompletions: completions,
                    sourceInlineCompletion: item,
                    filterText: item.filterText || insertText,
                    additionalTextEdits: item.additionalTextEdits || getReadonlyEmptyArray()
                });
                itemsByHash.set(JSON.stringify({ insertText, range: item.range }), trackedItem);
            }
        }
        return {
            items: [...itemsByHash.values()],
            dispose: () => {
                for (const result of results) {
                    result.dispose();
                }
            },
        };
    });
}
function getDefaultRange(position, model) {
    const word = model.getWordAtPosition(position);
    const maxColumn = model.getLineMaxColumn(position.lineNumber);
    // By default, always replace up until the end of the current line.
    // This default might be subject to change!
    return word
        ? new Range(position.lineNumber, word.startColumn, position.lineNumber, maxColumn)
        : Range.fromPositions(position, position.with(undefined, maxColumn));
}
function closeBrackets(text, position, model, languageConfigurationService) {
    const lineStart = model.getLineContent(position.lineNumber).substring(0, position.column - 1);
    const newLine = lineStart + text;
    const newTokens = model.tokenization.tokenizeLineWithEdit(position, newLine.length - (position.column - 1), text);
    const slicedTokens = newTokens === null || newTokens === void 0 ? void 0 : newTokens.sliceAndInflate(position.column - 1, newLine.length, 0);
    if (!slicedTokens) {
        return text;
    }
    const newText = fixBracketsInLine(slicedTokens, languageConfigurationService);
    return newText;
}
