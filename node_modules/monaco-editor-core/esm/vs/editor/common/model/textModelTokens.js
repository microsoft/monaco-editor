/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as arrays from '../../../base/common/arrays.js';
import { runWhenIdle } from '../../../base/common/async.js';
import { BugIndicatingError, onUnexpectedError } from '../../../base/common/errors.js';
import { Disposable, MutableDisposable } from '../../../base/common/lifecycle.js';
import { setTimeout0 } from '../../../base/common/platform.js';
import { StopWatch } from '../../../base/common/stopwatch.js';
import { countEOL } from '../core/eolCounter.js';
import { TokenizationRegistry } from '../languages.js';
import { nullTokenizeEncoded } from '../languages/nullTokenize.js';
import { ContiguousMultilineTokensBuilder } from '../tokens/contiguousMultilineTokensBuilder.js';
import { LineTokens } from '../tokens/lineTokens.js';
/**
 * An array that avoids being sparse by always
 * filling up unused indices with a default value.
 */
export class ContiguousGrowingArray {
    constructor(_default) {
        this._default = _default;
        this._store = [];
    }
    get(index) {
        if (index < this._store.length) {
            return this._store[index];
        }
        return this._default;
    }
    set(index, value) {
        while (index >= this._store.length) {
            this._store[this._store.length] = this._default;
        }
        this._store[index] = value;
    }
    // TODO have `replace` instead of `delete` and `insert`
    delete(deleteIndex, deleteCount) {
        if (deleteCount === 0 || deleteIndex >= this._store.length) {
            return;
        }
        this._store.splice(deleteIndex, deleteCount);
    }
    insert(insertIndex, insertCount) {
        if (insertCount === 0 || insertIndex >= this._store.length) {
            return;
        }
        const arr = [];
        for (let i = 0; i < insertCount; i++) {
            arr[i] = this._default;
        }
        this._store = arrays.arrayInsert(this._store, insertIndex, arr);
    }
}
/**
 * Stores the states at the start of each line and keeps track of which lines
 * must be re-tokenized. Also uses state equality to quickly validate lines
 * that don't need to be re-tokenized.
 *
 * For example, when typing on a line, the line gets marked as needing to be tokenized.
 * Once the line is tokenized, the end state is checked for equality against the begin
 * state of the next line. If the states are equal, tokenization doesn't need to run
 * again over the rest of the file. If the states are not equal, the next line gets marked
 * as needing to be tokenized.
 */
export class TokenizationStateStore {
    get invalidLineStartIndex() {
        return this._firstLineNeedsTokenization;
    }
    constructor(tokenizationSupport, initialState) {
        this.tokenizationSupport = tokenizationSupport;
        this.initialState = initialState;
        /**
         * `lineBeginState[i]` contains the begin state used to tokenize line number `i + 1`.
         */
        this._lineBeginState = new ContiguousGrowingArray(null);
        /**
         * `lineNeedsTokenization[i]` describes if line number `i + 1` needs to be tokenized.
         */
        this._lineNeedsTokenization = new ContiguousGrowingArray(true);
        this._firstLineNeedsTokenization = 0;
        this._lineBeginState.set(0, this.initialState);
    }
    markMustBeTokenized(lineIndex) {
        this._lineNeedsTokenization.set(lineIndex, true);
        this._firstLineNeedsTokenization = Math.min(this._firstLineNeedsTokenization, lineIndex);
    }
    getBeginState(lineIndex) {
        return this._lineBeginState.get(lineIndex);
    }
    setEndState(linesLength, lineIndex, endState) {
        this._lineNeedsTokenization.set(lineIndex, false);
        this._firstLineNeedsTokenization = lineIndex + 1;
        // Check if this was the last line
        if (lineIndex === linesLength - 1) {
            return false;
        }
        // Check if the end state has changed
        const previousEndState = this._lineBeginState.get(lineIndex + 1);
        if (previousEndState === null || !endState.equals(previousEndState)) {
            this._lineBeginState.set(lineIndex + 1, endState);
            this.markMustBeTokenized(lineIndex + 1);
            return true;
        }
        // Perhaps we can skip tokenizing some lines...
        let i = lineIndex + 1;
        while (i < linesLength) {
            if (this._lineNeedsTokenization.get(i)) {
                break;
            }
            i++;
        }
        this._firstLineNeedsTokenization = i;
        return false;
    }
    applyEdits(range, eolCount) {
        this.markMustBeTokenized(range.startLineNumber - 1);
        this._lineBeginState.delete(range.startLineNumber, range.endLineNumber - range.startLineNumber);
        this._lineNeedsTokenization.delete(range.startLineNumber, range.endLineNumber - range.startLineNumber);
        this._lineBeginState.insert(range.startLineNumber, eolCount);
        this._lineNeedsTokenization.insert(range.startLineNumber, eolCount);
    }
    updateTokensUntilLine(textModel, languageIdCodec, builder, lineNumber) {
        const languageId = textModel.getLanguageId();
        const linesLength = textModel.getLineCount();
        const endLineIndex = lineNumber - 1;
        // Validate all states up to and including endLineIndex
        for (let lineIndex = this.invalidLineStartIndex; lineIndex <= endLineIndex; lineIndex++) {
            const text = textModel.getLineContent(lineIndex + 1);
            const lineStartState = this.getBeginState(lineIndex);
            const r = safeTokenize(languageIdCodec, languageId, this.tokenizationSupport, text, true, lineStartState);
            builder.add(lineIndex + 1, r.tokens);
            this.setEndState(linesLength, lineIndex, r.endState);
            lineIndex = this.invalidLineStartIndex - 1; // -1 because the outer loop increments it
        }
    }
    isTokenizationComplete(textModel) {
        return this.invalidLineStartIndex >= textModel.getLineCount();
    }
}
export class TextModelTokenization extends Disposable {
    constructor(_textModel, _tokenizationPart, _languageIdCodec) {
        super();
        this._textModel = _textModel;
        this._tokenizationPart = _tokenizationPart;
        this._languageIdCodec = _languageIdCodec;
        this._tokenizationStateStore = null;
        this._defaultBackgroundTokenizer = null;
        this.backgroundTokenizer = this._register(new MutableDisposable());
        this._register(TokenizationRegistry.onDidChange((e) => {
            const languageId = this._textModel.getLanguageId();
            if (e.changedLanguages.indexOf(languageId) === -1) {
                return;
            }
            this._resetTokenizationState();
            this._tokenizationPart.clearTokens();
        }));
        this._resetTokenizationState();
    }
    handleDidChangeContent(e) {
        var _a;
        if (e.isFlush) {
            this._resetTokenizationState();
            return;
        }
        if (this._tokenizationStateStore) {
            for (let i = 0, len = e.changes.length; i < len; i++) {
                const change = e.changes[i];
                const [eolCount] = countEOL(change.text);
                this._tokenizationStateStore.applyEdits(change.range, eolCount);
            }
        }
        (_a = this._defaultBackgroundTokenizer) === null || _a === void 0 ? void 0 : _a.handleChanges();
    }
    handleDidChangeAttached() {
        var _a;
        (_a = this._defaultBackgroundTokenizer) === null || _a === void 0 ? void 0 : _a.handleChanges();
    }
    handleDidChangeLanguage(e) {
        this._resetTokenizationState();
        this._tokenizationPart.clearTokens();
    }
    _resetTokenizationState() {
        const [tokenizationSupport, initialState] = initializeTokenization(this._textModel, this._tokenizationPart);
        if (tokenizationSupport && initialState) {
            this._tokenizationStateStore = new TokenizationStateStore(tokenizationSupport, initialState);
        }
        else {
            this._tokenizationStateStore = null;
        }
        this.backgroundTokenizer.clear();
        this._defaultBackgroundTokenizer = null;
        if (this._tokenizationStateStore) {
            const b = {
                setTokens: (tokens) => {
                    this._tokenizationPart.setTokens(tokens);
                },
                backgroundTokenizationFinished: () => {
                    this._tokenizationPart.handleBackgroundTokenizationFinished();
                },
                setEndState: (lineNumber, state) => {
                    var _a, _b;
                    if (!state) {
                        throw new BugIndicatingError();
                    }
                    const invalidLineStartIndex = (_a = this._tokenizationStateStore) === null || _a === void 0 ? void 0 : _a.invalidLineStartIndex;
                    if (invalidLineStartIndex !== undefined && lineNumber - 1 >= invalidLineStartIndex) {
                        // Don't accept states for definitely valid states
                        (_b = this._tokenizationStateStore) === null || _b === void 0 ? void 0 : _b.setEndState(this._textModel.getLineCount(), lineNumber - 1, state);
                    }
                },
            };
            if (tokenizationSupport && tokenizationSupport.createBackgroundTokenizer) {
                this.backgroundTokenizer.value = tokenizationSupport.createBackgroundTokenizer(this._textModel, b);
            }
            if (!this.backgroundTokenizer.value) {
                this.backgroundTokenizer.value = this._defaultBackgroundTokenizer =
                    new DefaultBackgroundTokenizer(this._textModel, this._tokenizationStateStore, b, this._languageIdCodec);
                this._defaultBackgroundTokenizer.handleChanges();
            }
        }
    }
    tokenizeViewport(startLineNumber, endLineNumber) {
        var _a;
        const builder = new ContiguousMultilineTokensBuilder();
        this._heuristicallyTokenizeViewport(builder, startLineNumber, endLineNumber);
        this._tokenizationPart.setTokens(builder.finalize());
        (_a = this._defaultBackgroundTokenizer) === null || _a === void 0 ? void 0 : _a.checkFinished();
    }
    reset() {
        this._resetTokenizationState();
        this._tokenizationPart.clearTokens();
    }
    forceTokenization(lineNumber) {
        var _a, _b;
        const builder = new ContiguousMultilineTokensBuilder();
        (_a = this._tokenizationStateStore) === null || _a === void 0 ? void 0 : _a.updateTokensUntilLine(this._textModel, this._languageIdCodec, builder, lineNumber);
        this._tokenizationPart.setTokens(builder.finalize());
        (_b = this._defaultBackgroundTokenizer) === null || _b === void 0 ? void 0 : _b.checkFinished();
    }
    getTokenTypeIfInsertingCharacter(position, character) {
        if (!this._tokenizationStateStore) {
            return 0 /* StandardTokenType.Other */;
        }
        this.forceTokenization(position.lineNumber);
        const lineStartState = this._tokenizationStateStore.getBeginState(position.lineNumber - 1);
        if (!lineStartState) {
            return 0 /* StandardTokenType.Other */;
        }
        const languageId = this._textModel.getLanguageId();
        const lineContent = this._textModel.getLineContent(position.lineNumber);
        // Create the text as if `character` was inserted
        const text = (lineContent.substring(0, position.column - 1)
            + character
            + lineContent.substring(position.column - 1));
        const r = safeTokenize(this._languageIdCodec, languageId, this._tokenizationStateStore.tokenizationSupport, text, true, lineStartState);
        const lineTokens = new LineTokens(r.tokens, text, this._languageIdCodec);
        if (lineTokens.getCount() === 0) {
            return 0 /* StandardTokenType.Other */;
        }
        const tokenIndex = lineTokens.findTokenIndexAtOffset(position.column - 1);
        return lineTokens.getStandardTokenType(tokenIndex);
    }
    tokenizeLineWithEdit(position, length, newText) {
        const lineNumber = position.lineNumber;
        const column = position.column;
        if (!this._tokenizationStateStore) {
            return null;
        }
        this.forceTokenization(lineNumber);
        const lineStartState = this._tokenizationStateStore.getBeginState(lineNumber - 1);
        if (!lineStartState) {
            return null;
        }
        const curLineContent = this._textModel.getLineContent(lineNumber);
        const newLineContent = curLineContent.substring(0, column - 1)
            + newText + curLineContent.substring(column - 1 + length);
        const languageId = this._textModel.getLanguageIdAtPosition(lineNumber, 0);
        const result = safeTokenize(this._languageIdCodec, languageId, this._tokenizationStateStore.tokenizationSupport, newLineContent, true, lineStartState);
        const lineTokens = new LineTokens(result.tokens, newLineContent, this._languageIdCodec);
        return lineTokens;
    }
    isCheapToTokenize(lineNumber) {
        if (!this._tokenizationStateStore) {
            return true;
        }
        const firstInvalidLineNumber = this._tokenizationStateStore.invalidLineStartIndex + 1;
        if (lineNumber > firstInvalidLineNumber) {
            return false;
        }
        if (lineNumber < firstInvalidLineNumber) {
            return true;
        }
        if (this._textModel.getLineLength(lineNumber) < 2048 /* Constants.CHEAP_TOKENIZATION_LENGTH_LIMIT */) {
            return true;
        }
        return false;
    }
    /**
     * The result is not cached.
     */
    _heuristicallyTokenizeViewport(builder, startLineNumber, endLineNumber) {
        var _a;
        if (!this._tokenizationStateStore) {
            // nothing to do
            return;
        }
        if (endLineNumber <= this._tokenizationStateStore.invalidLineStartIndex) {
            // nothing to do
            return;
        }
        if (startLineNumber <= this._tokenizationStateStore.invalidLineStartIndex) {
            // tokenization has reached the viewport start...
            this._tokenizationStateStore.updateTokensUntilLine(this._textModel, this._languageIdCodec, builder, endLineNumber);
            return;
        }
        let state = this.guessStartState(startLineNumber);
        const languageId = this._textModel.getLanguageId();
        for (let lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
            const text = this._textModel.getLineContent(lineNumber);
            const r = safeTokenize(this._languageIdCodec, languageId, this._tokenizationStateStore.tokenizationSupport, text, true, state);
            builder.add(lineNumber, r.tokens);
            state = r.endState;
        }
        // We overrode the tokens. Because old states might get reused (thus stopping invalidation),
        // we have to explicitly request the tokens for this range again.
        (_a = this.backgroundTokenizer.value) === null || _a === void 0 ? void 0 : _a.requestTokens(startLineNumber, endLineNumber + 1);
    }
    guessStartState(lineNumber) {
        let nonWhitespaceColumn = this._textModel.getLineFirstNonWhitespaceColumn(lineNumber);
        const likelyRelevantLines = [];
        let initialState = null;
        for (let i = lineNumber - 1; nonWhitespaceColumn > 1 && i >= 1; i--) {
            const newNonWhitespaceIndex = this._textModel.getLineFirstNonWhitespaceColumn(i);
            // Ignore lines full of whitespace
            if (newNonWhitespaceIndex === 0) {
                continue;
            }
            if (newNonWhitespaceIndex < nonWhitespaceColumn) {
                likelyRelevantLines.push(this._textModel.getLineContent(i));
                nonWhitespaceColumn = newNonWhitespaceIndex;
                initialState = this._tokenizationStateStore.getBeginState(i - 1);
                if (initialState) {
                    break;
                }
            }
        }
        if (!initialState) {
            initialState = this._tokenizationStateStore.initialState;
        }
        likelyRelevantLines.reverse();
        const languageId = this._textModel.getLanguageId();
        let state = initialState;
        for (const line of likelyRelevantLines) {
            const r = safeTokenize(this._languageIdCodec, languageId, this._tokenizationStateStore.tokenizationSupport, line, false, state);
            state = r.endState;
        }
        return state;
    }
}
function initializeTokenization(textModel, tokenizationPart) {
    if (textModel.isTooLargeForTokenization()) {
        return [null, null];
    }
    const tokenizationSupport = TokenizationRegistry.get(tokenizationPart.getLanguageId());
    if (!tokenizationSupport) {
        return [null, null];
    }
    let initialState;
    try {
        initialState = tokenizationSupport.getInitialState();
    }
    catch (e) {
        onUnexpectedError(e);
        return [null, null];
    }
    return [tokenizationSupport, initialState];
}
function safeTokenize(languageIdCodec, languageId, tokenizationSupport, text, hasEOL, state) {
    let r = null;
    if (tokenizationSupport) {
        try {
            r = tokenizationSupport.tokenizeEncoded(text, hasEOL, state.clone());
        }
        catch (e) {
            onUnexpectedError(e);
        }
    }
    if (!r) {
        r = nullTokenizeEncoded(languageIdCodec.encodeLanguageId(languageId), state);
    }
    LineTokens.convertToEndOffset(r.tokens, text.length);
    return r;
}
class DefaultBackgroundTokenizer {
    constructor(_textModel, _stateStore, _backgroundTokenStore, _languageIdCodec) {
        this._textModel = _textModel;
        this._stateStore = _stateStore;
        this._backgroundTokenStore = _backgroundTokenStore;
        this._languageIdCodec = _languageIdCodec;
        this._isDisposed = false;
        this._isScheduled = false;
    }
    dispose() {
        this._isDisposed = true;
    }
    handleChanges() {
        this._beginBackgroundTokenization();
    }
    _beginBackgroundTokenization() {
        if (this._isScheduled || !this._textModel.isAttachedToEditor() || !this._hasLinesToTokenize()) {
            return;
        }
        this._isScheduled = true;
        runWhenIdle((deadline) => {
            this._isScheduled = false;
            this._backgroundTokenizeWithDeadline(deadline);
        });
    }
    /**
     * Tokenize until the deadline occurs, but try to yield every 1-2ms.
     */
    _backgroundTokenizeWithDeadline(deadline) {
        // Read the time remaining from the `deadline` immediately because it is unclear
        // if the `deadline` object will be valid after execution leaves this function.
        const endTime = Date.now() + deadline.timeRemaining();
        const execute = () => {
            if (this._isDisposed || !this._textModel.isAttachedToEditor() || !this._hasLinesToTokenize()) {
                // disposed in the meantime or detached or finished
                return;
            }
            this._backgroundTokenizeForAtLeast1ms();
            if (Date.now() < endTime) {
                // There is still time before reaching the deadline, so yield to the browser and then
                // continue execution
                setTimeout0(execute);
            }
            else {
                // The deadline has been reached, so schedule a new idle callback if necessary
                this._beginBackgroundTokenization();
            }
        };
        execute();
    }
    /**
     * Tokenize for at least 1ms.
     */
    _backgroundTokenizeForAtLeast1ms() {
        const lineCount = this._textModel.getLineCount();
        const builder = new ContiguousMultilineTokensBuilder();
        const sw = StopWatch.create(false);
        do {
            if (sw.elapsed() > 1) {
                // the comparison is intentionally > 1 and not >= 1 to ensure that
                // a full millisecond has elapsed, given how microseconds are rounded
                // to milliseconds
                break;
            }
            const tokenizedLineNumber = this._tokenizeOneInvalidLine(builder);
            if (tokenizedLineNumber >= lineCount) {
                break;
            }
        } while (this._hasLinesToTokenize());
        this._backgroundTokenStore.setTokens(builder.finalize());
        this.checkFinished();
    }
    _hasLinesToTokenize() {
        if (!this._stateStore) {
            return false;
        }
        return this._stateStore.invalidLineStartIndex < this._textModel.getLineCount();
    }
    _tokenizeOneInvalidLine(builder) {
        if (!this._stateStore || !this._hasLinesToTokenize()) {
            return this._textModel.getLineCount() + 1;
        }
        const lineNumber = this._stateStore.invalidLineStartIndex + 1;
        this._stateStore.updateTokensUntilLine(this._textModel, this._languageIdCodec, builder, lineNumber);
        return lineNumber;
    }
    checkFinished() {
        if (this._isDisposed) {
            return;
        }
        if (this._stateStore.isTokenizationComplete(this._textModel)) {
            this._backgroundTokenStore.backgroundTokenizationFinished();
        }
    }
    requestTokens(startLineNumber, endLineNumberExclusive) {
        for (let lineNumber = startLineNumber; lineNumber < endLineNumberExclusive; lineNumber++) {
            this._stateStore.markMustBeTokenized(lineNumber - 1);
        }
    }
}
