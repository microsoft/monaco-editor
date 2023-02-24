/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Emitter } from '../../../base/common/event.js';
import { Position } from '../core/position.js';
import { getWordAtText } from '../core/wordHelper.js';
import { TextModelPart } from './textModelPart.js';
import { TextModelTokenization } from './textModelTokens.js';
import { ContiguousTokensStore } from '../tokens/contiguousTokensStore.js';
import { SparseTokensStore } from '../tokens/sparseTokensStore.js';
export class TokenizationTextModelPart extends TextModelPart {
    constructor(_languageService, _languageConfigurationService, _textModel, bracketPairsTextModelPart, _languageId) {
        super();
        this._languageService = _languageService;
        this._languageConfigurationService = _languageConfigurationService;
        this._textModel = _textModel;
        this.bracketPairsTextModelPart = bracketPairsTextModelPart;
        this._languageId = _languageId;
        this._onDidChangeLanguage = this._register(new Emitter());
        this.onDidChangeLanguage = this._onDidChangeLanguage.event;
        this._onDidChangeLanguageConfiguration = this._register(new Emitter());
        this.onDidChangeLanguageConfiguration = this._onDidChangeLanguageConfiguration.event;
        this._onDidChangeTokens = this._register(new Emitter());
        this.onDidChangeTokens = this._onDidChangeTokens.event;
        this._backgroundTokenizationState = 1 /* BackgroundTokenizationState.InProgress */;
        this._tokens = new ContiguousTokensStore(this._languageService.languageIdCodec);
        this._semanticTokens = new SparseTokensStore(this._languageService.languageIdCodec);
        this._tokenization = this._register(new TextModelTokenization(_textModel, this, this._languageService.languageIdCodec));
        this._register(this._languageConfigurationService.onDidChange(e => {
            if (e.affects(this._languageId)) {
                this._onDidChangeLanguageConfiguration.fire({});
            }
        }));
    }
    acceptEdit(range, text, eolCount, firstLineLength, lastLineLength) {
        this._tokens.acceptEdit(range, eolCount, firstLineLength);
        this._semanticTokens.acceptEdit(range, eolCount, firstLineLength, lastLineLength, text.length > 0 ? text.charCodeAt(0) : 0 /* CharCode.Null */);
    }
    handleDidChangeAttached() {
        this._tokenization.handleDidChangeAttached();
    }
    flush() {
        this._tokens.flush();
        this._semanticTokens.flush();
    }
    // TODO@hediet TODO@alexdima what is the difference between this and acceptEdit?
    handleDidChangeContent(change) {
        this._tokenization.handleDidChangeContent(change);
    }
    get backgroundTokenizationState() {
        return this._backgroundTokenizationState;
    }
    handleBackgroundTokenizationFinished() {
        if (this._backgroundTokenizationState === 2 /* BackgroundTokenizationState.Completed */) {
            // We already did a full tokenization and don't go back to progressing.
            return;
        }
        const newState = 2 /* BackgroundTokenizationState.Completed */;
        this._backgroundTokenizationState = newState;
        this.bracketPairsTextModelPart.handleDidChangeBackgroundTokenizationState();
    }
    get hasTokens() {
        return this._tokens.hasTokens;
    }
    setTokens(tokens) {
        if (tokens.length === 0) {
            return;
        }
        const ranges = [];
        for (let i = 0, len = tokens.length; i < len; i++) {
            const element = tokens[i];
            let minChangedLineNumber = 0;
            let maxChangedLineNumber = 0;
            let hasChange = false;
            for (let lineNumber = element.startLineNumber; lineNumber <= element.endLineNumber; lineNumber++) {
                if (hasChange) {
                    this._tokens.setTokens(this._languageId, lineNumber - 1, this._textModel.getLineLength(lineNumber), element.getLineTokens(lineNumber), false);
                    maxChangedLineNumber = lineNumber;
                }
                else {
                    const lineHasChange = this._tokens.setTokens(this._languageId, lineNumber - 1, this._textModel.getLineLength(lineNumber), element.getLineTokens(lineNumber), true);
                    if (lineHasChange) {
                        hasChange = true;
                        minChangedLineNumber = lineNumber;
                        maxChangedLineNumber = lineNumber;
                    }
                }
            }
            if (hasChange) {
                ranges.push({
                    fromLineNumber: minChangedLineNumber,
                    toLineNumber: maxChangedLineNumber,
                });
            }
        }
        if (ranges.length > 0) {
            this._emitModelTokensChangedEvent({
                tokenizationSupportChanged: false,
                semanticTokensApplied: false,
                ranges: ranges,
            });
        }
    }
    setSemanticTokens(tokens, isComplete) {
        this._semanticTokens.set(tokens, isComplete);
        this._emitModelTokensChangedEvent({
            tokenizationSupportChanged: false,
            semanticTokensApplied: tokens !== null,
            ranges: [{ fromLineNumber: 1, toLineNumber: this._textModel.getLineCount() }],
        });
    }
    hasCompleteSemanticTokens() {
        return this._semanticTokens.isComplete();
    }
    hasSomeSemanticTokens() {
        return !this._semanticTokens.isEmpty();
    }
    setPartialSemanticTokens(range, tokens) {
        if (this.hasCompleteSemanticTokens()) {
            return;
        }
        const changedRange = this._textModel.validateRange(this._semanticTokens.setPartial(range, tokens));
        this._emitModelTokensChangedEvent({
            tokenizationSupportChanged: false,
            semanticTokensApplied: true,
            ranges: [
                {
                    fromLineNumber: changedRange.startLineNumber,
                    toLineNumber: changedRange.endLineNumber,
                },
            ],
        });
    }
    tokenizeViewport(startLineNumber, endLineNumber) {
        startLineNumber = Math.max(1, startLineNumber);
        endLineNumber = Math.min(this._textModel.getLineCount(), endLineNumber);
        this._tokenization.tokenizeViewport(startLineNumber, endLineNumber);
    }
    clearTokens() {
        this._tokens.flush();
        this._emitModelTokensChangedEvent({
            tokenizationSupportChanged: true,
            semanticTokensApplied: false,
            ranges: [
                {
                    fromLineNumber: 1,
                    toLineNumber: this._textModel.getLineCount(),
                },
            ],
        });
    }
    _emitModelTokensChangedEvent(e) {
        if (!this._textModel._isDisposing()) {
            this.bracketPairsTextModelPart.handleDidChangeTokens(e);
            this._onDidChangeTokens.fire(e);
        }
    }
    resetTokenization() {
        this._tokenization.reset();
    }
    forceTokenization(lineNumber) {
        if (lineNumber < 1 || lineNumber > this._textModel.getLineCount()) {
            throw new Error('Illegal value for lineNumber');
        }
        this._tokenization.forceTokenization(lineNumber);
    }
    isCheapToTokenize(lineNumber) {
        return this._tokenization.isCheapToTokenize(lineNumber);
    }
    tokenizeIfCheap(lineNumber) {
        if (this.isCheapToTokenize(lineNumber)) {
            this.forceTokenization(lineNumber);
        }
    }
    getLineTokens(lineNumber) {
        if (lineNumber < 1 || lineNumber > this._textModel.getLineCount()) {
            throw new Error('Illegal value for lineNumber');
        }
        return this._getLineTokens(lineNumber);
    }
    _getLineTokens(lineNumber) {
        const lineText = this._textModel.getLineContent(lineNumber);
        const syntacticTokens = this._tokens.getTokens(this._languageId, lineNumber - 1, lineText);
        return this._semanticTokens.addSparseTokens(lineNumber, syntacticTokens);
    }
    getTokenTypeIfInsertingCharacter(lineNumber, column, character) {
        const position = this._textModel.validatePosition(new Position(lineNumber, column));
        return this._tokenization.getTokenTypeIfInsertingCharacter(position, character);
    }
    tokenizeLineWithEdit(position, length, newText) {
        const validatedPosition = this._textModel.validatePosition(position);
        return this._tokenization.tokenizeLineWithEdit(validatedPosition, length, newText);
    }
    getLanguageConfiguration(languageId) {
        return this._languageConfigurationService.getLanguageConfiguration(languageId);
    }
    // Having tokens allows implementing additional helper methods
    getWordAtPosition(_position) {
        this.assertNotDisposed();
        const position = this._textModel.validatePosition(_position);
        const lineContent = this._textModel.getLineContent(position.lineNumber);
        const lineTokens = this._getLineTokens(position.lineNumber);
        const tokenIndex = lineTokens.findTokenIndexAtOffset(position.column - 1);
        // (1). First try checking right biased word
        const [rbStartOffset, rbEndOffset] = TokenizationTextModelPart._findLanguageBoundaries(lineTokens, tokenIndex);
        const rightBiasedWord = getWordAtText(position.column, this.getLanguageConfiguration(lineTokens.getLanguageId(tokenIndex)).getWordDefinition(), lineContent.substring(rbStartOffset, rbEndOffset), rbStartOffset);
        // Make sure the result touches the original passed in position
        if (rightBiasedWord &&
            rightBiasedWord.startColumn <= _position.column &&
            _position.column <= rightBiasedWord.endColumn) {
            return rightBiasedWord;
        }
        // (2). Else, if we were at a language boundary, check the left biased word
        if (tokenIndex > 0 && rbStartOffset === position.column - 1) {
            // edge case, where `position` sits between two tokens belonging to two different languages
            const [lbStartOffset, lbEndOffset] = TokenizationTextModelPart._findLanguageBoundaries(lineTokens, tokenIndex - 1);
            const leftBiasedWord = getWordAtText(position.column, this.getLanguageConfiguration(lineTokens.getLanguageId(tokenIndex - 1)).getWordDefinition(), lineContent.substring(lbStartOffset, lbEndOffset), lbStartOffset);
            // Make sure the result touches the original passed in position
            if (leftBiasedWord &&
                leftBiasedWord.startColumn <= _position.column &&
                _position.column <= leftBiasedWord.endColumn) {
                return leftBiasedWord;
            }
        }
        return null;
    }
    static _findLanguageBoundaries(lineTokens, tokenIndex) {
        const languageId = lineTokens.getLanguageId(tokenIndex);
        // go left until a different language is hit
        let startOffset = 0;
        for (let i = tokenIndex; i >= 0 && lineTokens.getLanguageId(i) === languageId; i--) {
            startOffset = lineTokens.getStartOffset(i);
        }
        // go right until a different language is hit
        let endOffset = lineTokens.getLineContent().length;
        for (let i = tokenIndex, tokenCount = lineTokens.getCount(); i < tokenCount && lineTokens.getLanguageId(i) === languageId; i++) {
            endOffset = lineTokens.getEndOffset(i);
        }
        return [startOffset, endOffset];
    }
    getWordUntilPosition(position) {
        const wordAtPosition = this.getWordAtPosition(position);
        if (!wordAtPosition) {
            return {
                word: '',
                startColumn: position.column,
                endColumn: position.column,
            };
        }
        return {
            word: wordAtPosition.word.substr(0, position.column - wordAtPosition.startColumn),
            startColumn: wordAtPosition.startColumn,
            endColumn: position.column,
        };
    }
    getLanguageId() {
        return this._languageId;
    }
    getLanguageIdAtPosition(lineNumber, column) {
        const position = this._textModel.validatePosition(new Position(lineNumber, column));
        const lineTokens = this.getLineTokens(position.lineNumber);
        return lineTokens.getLanguageId(lineTokens.findTokenIndexAtOffset(position.column - 1));
    }
    setLanguageId(languageId, source = 'api') {
        if (this._languageId === languageId) {
            // There's nothing to do
            return;
        }
        const e = {
            oldLanguage: this._languageId,
            newLanguage: languageId,
            source
        };
        this._languageId = languageId;
        this.bracketPairsTextModelPart.handleDidChangeLanguage(e);
        this._tokenization.handleDidChangeLanguage(e);
        this._onDidChangeLanguage.fire(e);
        this._onDidChangeLanguageConfiguration.fire({});
    }
}
