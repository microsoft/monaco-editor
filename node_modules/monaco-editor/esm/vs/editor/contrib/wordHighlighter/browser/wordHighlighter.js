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
import { alert } from '../../../../base/browser/ui/aria/aria.js';
import * as arrays from '../../../../base/common/arrays.js';
import { createCancelablePromise, first, timeout } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { onUnexpectedError, onUnexpectedExternalError } from '../../../../base/common/errors.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { EditorAction, registerEditorAction, registerEditorContribution, registerModelAndPositionCommand } from '../../../browser/editorExtensions.js';
import { Range } from '../../../common/core/range.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { DocumentHighlightKind } from '../../../common/languages.js';
import * as nls from '../../../../nls.js';
import { IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { getHighlightDecorationOptions } from './highlightDecorations.js';
const ctxHasWordHighlights = new RawContextKey('hasWordHighlights', false);
export function getOccurrencesAtPosition(registry, model, position, token) {
    const orderedByScore = registry.ordered(model);
    // in order of score ask the occurrences provider
    // until someone response with a good result
    // (good = none empty array)
    return first(orderedByScore.map(provider => () => {
        return Promise.resolve(provider.provideDocumentHighlights(model, position, token))
            .then(undefined, onUnexpectedExternalError);
    }), arrays.isNonEmptyArray);
}
class OccurenceAtPositionRequest {
    constructor(_model, _selection, _wordSeparators) {
        this._model = _model;
        this._selection = _selection;
        this._wordSeparators = _wordSeparators;
        this._wordRange = this._getCurrentWordRange(_model, _selection);
        this._result = null;
    }
    get result() {
        if (!this._result) {
            this._result = createCancelablePromise(token => this._compute(this._model, this._selection, this._wordSeparators, token));
        }
        return this._result;
    }
    _getCurrentWordRange(model, selection) {
        const word = model.getWordAtPosition(selection.getPosition());
        if (word) {
            return new Range(selection.startLineNumber, word.startColumn, selection.startLineNumber, word.endColumn);
        }
        return null;
    }
    isValid(model, selection, decorations) {
        const lineNumber = selection.startLineNumber;
        const startColumn = selection.startColumn;
        const endColumn = selection.endColumn;
        const currentWordRange = this._getCurrentWordRange(model, selection);
        let requestIsValid = Boolean(this._wordRange && this._wordRange.equalsRange(currentWordRange));
        // Even if we are on a different word, if that word is in the decorations ranges, the request is still valid
        // (Same symbol)
        for (let i = 0, len = decorations.length; !requestIsValid && i < len; i++) {
            const range = decorations.getRange(i);
            if (range && range.startLineNumber === lineNumber) {
                if (range.startColumn <= startColumn && range.endColumn >= endColumn) {
                    requestIsValid = true;
                }
            }
        }
        return requestIsValid;
    }
    cancel() {
        this.result.cancel();
    }
}
class SemanticOccurenceAtPositionRequest extends OccurenceAtPositionRequest {
    constructor(model, selection, wordSeparators, providers) {
        super(model, selection, wordSeparators);
        this._providers = providers;
    }
    _compute(model, selection, wordSeparators, token) {
        return getOccurrencesAtPosition(this._providers, model, selection.getPosition(), token).then(value => value || []);
    }
}
class TextualOccurenceAtPositionRequest extends OccurenceAtPositionRequest {
    constructor(model, selection, wordSeparators) {
        super(model, selection, wordSeparators);
        this._selectionIsEmpty = selection.isEmpty();
    }
    _compute(model, selection, wordSeparators, token) {
        return timeout(250, token).then(() => {
            if (!selection.isEmpty()) {
                return [];
            }
            const word = model.getWordAtPosition(selection.getPosition());
            if (!word || word.word.length > 1000) {
                return [];
            }
            const matches = model.findMatches(word.word, true, false, true, wordSeparators, false);
            return matches.map(m => {
                return {
                    range: m.range,
                    kind: DocumentHighlightKind.Text
                };
            });
        });
    }
    isValid(model, selection, decorations) {
        const currentSelectionIsEmpty = selection.isEmpty();
        if (this._selectionIsEmpty !== currentSelectionIsEmpty) {
            return false;
        }
        return super.isValid(model, selection, decorations);
    }
}
function computeOccurencesAtPosition(registry, model, selection, wordSeparators) {
    if (registry.has(model)) {
        return new SemanticOccurenceAtPositionRequest(model, selection, wordSeparators, registry);
    }
    return new TextualOccurenceAtPositionRequest(model, selection, wordSeparators);
}
registerModelAndPositionCommand('_executeDocumentHighlights', (accessor, model, position) => {
    const languageFeaturesService = accessor.get(ILanguageFeaturesService);
    return getOccurrencesAtPosition(languageFeaturesService.documentHighlightProvider, model, position, CancellationToken.None);
});
class WordHighlighter {
    constructor(editor, providers, contextKeyService) {
        this.toUnhook = new DisposableStore();
        this.workerRequestTokenId = 0;
        this.workerRequestCompleted = false;
        this.workerRequestValue = [];
        this.lastCursorPositionChangeTime = 0;
        this.renderDecorationsTimer = -1;
        this.editor = editor;
        this.providers = providers;
        this._hasWordHighlights = ctxHasWordHighlights.bindTo(contextKeyService);
        this._ignorePositionChangeEvent = false;
        this.occurrencesHighlight = this.editor.getOption(78 /* EditorOption.occurrencesHighlight */);
        this.model = this.editor.getModel();
        this.toUnhook.add(editor.onDidChangeCursorPosition((e) => {
            if (this._ignorePositionChangeEvent) {
                // We are changing the position => ignore this event
                return;
            }
            if (!this.occurrencesHighlight) {
                // Early exit if nothing needs to be done!
                // Leave some form of early exit check here if you wish to continue being a cursor position change listener ;)
                return;
            }
            this._onPositionChanged(e);
        }));
        this.toUnhook.add(editor.onDidChangeModelContent((e) => {
            this._stopAll();
        }));
        this.toUnhook.add(editor.onDidChangeConfiguration((e) => {
            const newValue = this.editor.getOption(78 /* EditorOption.occurrencesHighlight */);
            if (this.occurrencesHighlight !== newValue) {
                this.occurrencesHighlight = newValue;
                this._stopAll();
            }
        }));
        this.decorations = this.editor.createDecorationsCollection();
        this.workerRequestTokenId = 0;
        this.workerRequest = null;
        this.workerRequestCompleted = false;
        this.lastCursorPositionChangeTime = 0;
        this.renderDecorationsTimer = -1;
    }
    hasDecorations() {
        return (this.decorations.length > 0);
    }
    restore() {
        if (!this.occurrencesHighlight) {
            return;
        }
        this._run();
    }
    _getSortedHighlights() {
        return (this.decorations.getRanges()
            .sort(Range.compareRangesUsingStarts));
    }
    moveNext() {
        const highlights = this._getSortedHighlights();
        const index = highlights.findIndex((range) => range.containsPosition(this.editor.getPosition()));
        const newIndex = ((index + 1) % highlights.length);
        const dest = highlights[newIndex];
        try {
            this._ignorePositionChangeEvent = true;
            this.editor.setPosition(dest.getStartPosition());
            this.editor.revealRangeInCenterIfOutsideViewport(dest);
            const word = this._getWord();
            if (word) {
                const lineContent = this.editor.getModel().getLineContent(dest.startLineNumber);
                alert(`${lineContent}, ${newIndex + 1} of ${highlights.length} for '${word.word}'`);
            }
        }
        finally {
            this._ignorePositionChangeEvent = false;
        }
    }
    moveBack() {
        const highlights = this._getSortedHighlights();
        const index = highlights.findIndex((range) => range.containsPosition(this.editor.getPosition()));
        const newIndex = ((index - 1 + highlights.length) % highlights.length);
        const dest = highlights[newIndex];
        try {
            this._ignorePositionChangeEvent = true;
            this.editor.setPosition(dest.getStartPosition());
            this.editor.revealRangeInCenterIfOutsideViewport(dest);
            const word = this._getWord();
            if (word) {
                const lineContent = this.editor.getModel().getLineContent(dest.startLineNumber);
                alert(`${lineContent}, ${newIndex + 1} of ${highlights.length} for '${word.word}'`);
            }
        }
        finally {
            this._ignorePositionChangeEvent = false;
        }
    }
    _removeDecorations() {
        if (this.decorations.length > 0) {
            // remove decorations
            this.decorations.clear();
            this._hasWordHighlights.set(false);
        }
    }
    _stopAll() {
        // Remove any existing decorations
        this._removeDecorations();
        // Cancel any renderDecorationsTimer
        if (this.renderDecorationsTimer !== -1) {
            clearTimeout(this.renderDecorationsTimer);
            this.renderDecorationsTimer = -1;
        }
        // Cancel any worker request
        if (this.workerRequest !== null) {
            this.workerRequest.cancel();
            this.workerRequest = null;
        }
        // Invalidate any worker request callback
        if (!this.workerRequestCompleted) {
            this.workerRequestTokenId++;
            this.workerRequestCompleted = true;
        }
    }
    _onPositionChanged(e) {
        // disabled
        if (!this.occurrencesHighlight) {
            this._stopAll();
            return;
        }
        // ignore typing & other
        if (e.reason !== 3 /* CursorChangeReason.Explicit */) {
            this._stopAll();
            return;
        }
        this._run();
    }
    _getWord() {
        const editorSelection = this.editor.getSelection();
        const lineNumber = editorSelection.startLineNumber;
        const startColumn = editorSelection.startColumn;
        return this.model.getWordAtPosition({
            lineNumber: lineNumber,
            column: startColumn
        });
    }
    _run() {
        const editorSelection = this.editor.getSelection();
        // ignore multiline selection
        if (editorSelection.startLineNumber !== editorSelection.endLineNumber) {
            this._stopAll();
            return;
        }
        const startColumn = editorSelection.startColumn;
        const endColumn = editorSelection.endColumn;
        const word = this._getWord();
        // The selection must be inside a word or surround one word at most
        if (!word || word.startColumn > startColumn || word.endColumn < endColumn) {
            this._stopAll();
            return;
        }
        // All the effort below is trying to achieve this:
        // - when cursor is moved to a word, trigger immediately a findOccurrences request
        // - 250ms later after the last cursor move event, render the occurrences
        // - no flickering!
        const workerRequestIsValid = (this.workerRequest && this.workerRequest.isValid(this.model, editorSelection, this.decorations));
        // There are 4 cases:
        // a) old workerRequest is valid & completed, renderDecorationsTimer fired
        // b) old workerRequest is valid & completed, renderDecorationsTimer not fired
        // c) old workerRequest is valid, but not completed
        // d) old workerRequest is not valid
        // For a) no action is needed
        // For c), member 'lastCursorPositionChangeTime' will be used when installing the timer so no action is needed
        this.lastCursorPositionChangeTime = (new Date()).getTime();
        if (workerRequestIsValid) {
            if (this.workerRequestCompleted && this.renderDecorationsTimer !== -1) {
                // case b)
                // Delay the firing of renderDecorationsTimer by an extra 250 ms
                clearTimeout(this.renderDecorationsTimer);
                this.renderDecorationsTimer = -1;
                this._beginRenderDecorations();
            }
        }
        else {
            // case d)
            // Stop all previous actions and start fresh
            this._stopAll();
            const myRequestId = ++this.workerRequestTokenId;
            this.workerRequestCompleted = false;
            this.workerRequest = computeOccurencesAtPosition(this.providers, this.model, this.editor.getSelection(), this.editor.getOption(125 /* EditorOption.wordSeparators */));
            this.workerRequest.result.then(data => {
                if (myRequestId === this.workerRequestTokenId) {
                    this.workerRequestCompleted = true;
                    this.workerRequestValue = data || [];
                    this._beginRenderDecorations();
                }
            }, onUnexpectedError);
        }
    }
    _beginRenderDecorations() {
        const currentTime = (new Date()).getTime();
        const minimumRenderTime = this.lastCursorPositionChangeTime + 250;
        if (currentTime >= minimumRenderTime) {
            // Synchronous
            this.renderDecorationsTimer = -1;
            this.renderDecorations();
        }
        else {
            // Asynchronous
            this.renderDecorationsTimer = setTimeout(() => {
                this.renderDecorations();
            }, (minimumRenderTime - currentTime));
        }
    }
    renderDecorations() {
        this.renderDecorationsTimer = -1;
        const decorations = [];
        for (const info of this.workerRequestValue) {
            if (info.range) {
                decorations.push({
                    range: info.range,
                    options: getHighlightDecorationOptions(info.kind)
                });
            }
        }
        this.decorations.set(decorations);
        this._hasWordHighlights.set(this.hasDecorations());
    }
    dispose() {
        this._stopAll();
        this.toUnhook.dispose();
    }
}
let WordHighlighterContribution = class WordHighlighterContribution extends Disposable {
    static get(editor) {
        return editor.getContribution(WordHighlighterContribution.ID);
    }
    constructor(editor, contextKeyService, languageFeaturesService) {
        super();
        this.wordHighlighter = null;
        const createWordHighlighterIfPossible = () => {
            if (editor.hasModel()) {
                this.wordHighlighter = new WordHighlighter(editor, languageFeaturesService.documentHighlightProvider, contextKeyService);
            }
        };
        this._register(editor.onDidChangeModel((e) => {
            if (this.wordHighlighter) {
                this.wordHighlighter.dispose();
                this.wordHighlighter = null;
            }
            createWordHighlighterIfPossible();
        }));
        createWordHighlighterIfPossible();
    }
    saveViewState() {
        if (this.wordHighlighter && this.wordHighlighter.hasDecorations()) {
            return true;
        }
        return false;
    }
    moveNext() {
        var _a;
        (_a = this.wordHighlighter) === null || _a === void 0 ? void 0 : _a.moveNext();
    }
    moveBack() {
        var _a;
        (_a = this.wordHighlighter) === null || _a === void 0 ? void 0 : _a.moveBack();
    }
    restoreViewState(state) {
        if (this.wordHighlighter && state) {
            this.wordHighlighter.restore();
        }
    }
    dispose() {
        if (this.wordHighlighter) {
            this.wordHighlighter.dispose();
            this.wordHighlighter = null;
        }
        super.dispose();
    }
};
WordHighlighterContribution.ID = 'editor.contrib.wordHighlighter';
WordHighlighterContribution = __decorate([
    __param(1, IContextKeyService),
    __param(2, ILanguageFeaturesService)
], WordHighlighterContribution);
export { WordHighlighterContribution };
class WordHighlightNavigationAction extends EditorAction {
    constructor(next, opts) {
        super(opts);
        this._isNext = next;
    }
    run(accessor, editor) {
        const controller = WordHighlighterContribution.get(editor);
        if (!controller) {
            return;
        }
        if (this._isNext) {
            controller.moveNext();
        }
        else {
            controller.moveBack();
        }
    }
}
class NextWordHighlightAction extends WordHighlightNavigationAction {
    constructor() {
        super(true, {
            id: 'editor.action.wordHighlight.next',
            label: nls.localize('wordHighlight.next.label', "Go to Next Symbol Highlight"),
            alias: 'Go to Next Symbol Highlight',
            precondition: ctxHasWordHighlights,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 65 /* KeyCode.F7 */,
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
}
class PrevWordHighlightAction extends WordHighlightNavigationAction {
    constructor() {
        super(false, {
            id: 'editor.action.wordHighlight.prev',
            label: nls.localize('wordHighlight.previous.label', "Go to Previous Symbol Highlight"),
            alias: 'Go to Previous Symbol Highlight',
            precondition: ctxHasWordHighlights,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 1024 /* KeyMod.Shift */ | 65 /* KeyCode.F7 */,
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
}
class TriggerWordHighlightAction extends EditorAction {
    constructor() {
        super({
            id: 'editor.action.wordHighlight.trigger',
            label: nls.localize('wordHighlight.trigger.label', "Trigger Symbol Highlight"),
            alias: 'Trigger Symbol Highlight',
            precondition: ctxHasWordHighlights.toNegated(),
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 0,
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    run(accessor, editor, args) {
        const controller = WordHighlighterContribution.get(editor);
        if (!controller) {
            return;
        }
        controller.restoreViewState(true);
    }
}
registerEditorContribution(WordHighlighterContribution.ID, WordHighlighterContribution, 0 /* EditorContributionInstantiation.Eager */); // eager because it uses `saveViewState`/`restoreViewState`
registerEditorAction(NextWordHighlightAction);
registerEditorAction(PrevWordHighlightAction);
registerEditorAction(TriggerWordHighlightAction);
