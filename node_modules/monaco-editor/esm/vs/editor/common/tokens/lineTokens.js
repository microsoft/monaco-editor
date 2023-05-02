/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { TokenMetadata } from '../encodedTokenAttributes.js';
export class LineTokens {
    static createEmpty(lineContent, decoder) {
        const defaultMetadata = LineTokens.defaultTokenMetadata;
        const tokens = new Uint32Array(2);
        tokens[0] = lineContent.length;
        tokens[1] = defaultMetadata;
        return new LineTokens(tokens, lineContent, decoder);
    }
    constructor(tokens, text, decoder) {
        this._lineTokensBrand = undefined;
        this._tokens = tokens;
        this._tokensCount = (this._tokens.length >>> 1);
        this._text = text;
        this._languageIdCodec = decoder;
    }
    equals(other) {
        if (other instanceof LineTokens) {
            return this.slicedEquals(other, 0, this._tokensCount);
        }
        return false;
    }
    slicedEquals(other, sliceFromTokenIndex, sliceTokenCount) {
        if (this._text !== other._text) {
            return false;
        }
        if (this._tokensCount !== other._tokensCount) {
            return false;
        }
        const from = (sliceFromTokenIndex << 1);
        const to = from + (sliceTokenCount << 1);
        for (let i = from; i < to; i++) {
            if (this._tokens[i] !== other._tokens[i]) {
                return false;
            }
        }
        return true;
    }
    getLineContent() {
        return this._text;
    }
    getCount() {
        return this._tokensCount;
    }
    getStartOffset(tokenIndex) {
        if (tokenIndex > 0) {
            return this._tokens[(tokenIndex - 1) << 1];
        }
        return 0;
    }
    getMetadata(tokenIndex) {
        const metadata = this._tokens[(tokenIndex << 1) + 1];
        return metadata;
    }
    getLanguageId(tokenIndex) {
        const metadata = this._tokens[(tokenIndex << 1) + 1];
        const languageId = TokenMetadata.getLanguageId(metadata);
        return this._languageIdCodec.decodeLanguageId(languageId);
    }
    getStandardTokenType(tokenIndex) {
        const metadata = this._tokens[(tokenIndex << 1) + 1];
        return TokenMetadata.getTokenType(metadata);
    }
    getForeground(tokenIndex) {
        const metadata = this._tokens[(tokenIndex << 1) + 1];
        return TokenMetadata.getForeground(metadata);
    }
    getClassName(tokenIndex) {
        const metadata = this._tokens[(tokenIndex << 1) + 1];
        return TokenMetadata.getClassNameFromMetadata(metadata);
    }
    getInlineStyle(tokenIndex, colorMap) {
        const metadata = this._tokens[(tokenIndex << 1) + 1];
        return TokenMetadata.getInlineStyleFromMetadata(metadata, colorMap);
    }
    getPresentation(tokenIndex) {
        const metadata = this._tokens[(tokenIndex << 1) + 1];
        return TokenMetadata.getPresentationFromMetadata(metadata);
    }
    getEndOffset(tokenIndex) {
        return this._tokens[tokenIndex << 1];
    }
    /**
     * Find the token containing offset `offset`.
     * @param offset The search offset
     * @return The index of the token containing the offset.
     */
    findTokenIndexAtOffset(offset) {
        return LineTokens.findIndexInTokensArray(this._tokens, offset);
    }
    inflate() {
        return this;
    }
    sliceAndInflate(startOffset, endOffset, deltaOffset) {
        return new SliceLineTokens(this, startOffset, endOffset, deltaOffset);
    }
    static convertToEndOffset(tokens, lineTextLength) {
        const tokenCount = (tokens.length >>> 1);
        const lastTokenIndex = tokenCount - 1;
        for (let tokenIndex = 0; tokenIndex < lastTokenIndex; tokenIndex++) {
            tokens[tokenIndex << 1] = tokens[(tokenIndex + 1) << 1];
        }
        tokens[lastTokenIndex << 1] = lineTextLength;
    }
    static findIndexInTokensArray(tokens, desiredIndex) {
        if (tokens.length <= 2) {
            return 0;
        }
        let low = 0;
        let high = (tokens.length >>> 1) - 1;
        while (low < high) {
            const mid = low + Math.floor((high - low) / 2);
            const endOffset = tokens[(mid << 1)];
            if (endOffset === desiredIndex) {
                return mid + 1;
            }
            else if (endOffset < desiredIndex) {
                low = mid + 1;
            }
            else if (endOffset > desiredIndex) {
                high = mid;
            }
        }
        return low;
    }
    /**
     * @pure
     * @param insertTokens Must be sorted by offset.
    */
    withInserted(insertTokens) {
        if (insertTokens.length === 0) {
            return this;
        }
        let nextOriginalTokenIdx = 0;
        let nextInsertTokenIdx = 0;
        let text = '';
        const newTokens = new Array();
        let originalEndOffset = 0;
        while (true) {
            const nextOriginalTokenEndOffset = nextOriginalTokenIdx < this._tokensCount ? this._tokens[nextOriginalTokenIdx << 1] : -1;
            const nextInsertToken = nextInsertTokenIdx < insertTokens.length ? insertTokens[nextInsertTokenIdx] : null;
            if (nextOriginalTokenEndOffset !== -1 && (nextInsertToken === null || nextOriginalTokenEndOffset <= nextInsertToken.offset)) {
                // original token ends before next insert token
                text += this._text.substring(originalEndOffset, nextOriginalTokenEndOffset);
                const metadata = this._tokens[(nextOriginalTokenIdx << 1) + 1];
                newTokens.push(text.length, metadata);
                nextOriginalTokenIdx++;
                originalEndOffset = nextOriginalTokenEndOffset;
            }
            else if (nextInsertToken) {
                if (nextInsertToken.offset > originalEndOffset) {
                    // insert token is in the middle of the next token.
                    text += this._text.substring(originalEndOffset, nextInsertToken.offset);
                    const metadata = this._tokens[(nextOriginalTokenIdx << 1) + 1];
                    newTokens.push(text.length, metadata);
                    originalEndOffset = nextInsertToken.offset;
                }
                text += nextInsertToken.text;
                newTokens.push(text.length, nextInsertToken.tokenMetadata);
                nextInsertTokenIdx++;
            }
            else {
                break;
            }
        }
        return new LineTokens(new Uint32Array(newTokens), text, this._languageIdCodec);
    }
}
LineTokens.defaultTokenMetadata = ((0 /* FontStyle.None */ << 11 /* MetadataConsts.FONT_STYLE_OFFSET */)
    | (1 /* ColorId.DefaultForeground */ << 15 /* MetadataConsts.FOREGROUND_OFFSET */)
    | (2 /* ColorId.DefaultBackground */ << 24 /* MetadataConsts.BACKGROUND_OFFSET */)) >>> 0;
class SliceLineTokens {
    constructor(source, startOffset, endOffset, deltaOffset) {
        this._source = source;
        this._startOffset = startOffset;
        this._endOffset = endOffset;
        this._deltaOffset = deltaOffset;
        this._firstTokenIndex = source.findTokenIndexAtOffset(startOffset);
        this._tokensCount = 0;
        for (let i = this._firstTokenIndex, len = source.getCount(); i < len; i++) {
            const tokenStartOffset = source.getStartOffset(i);
            if (tokenStartOffset >= endOffset) {
                break;
            }
            this._tokensCount++;
        }
    }
    getMetadata(tokenIndex) {
        return this._source.getMetadata(this._firstTokenIndex + tokenIndex);
    }
    getLanguageId(tokenIndex) {
        return this._source.getLanguageId(this._firstTokenIndex + tokenIndex);
    }
    getLineContent() {
        return this._source.getLineContent().substring(this._startOffset, this._endOffset);
    }
    equals(other) {
        if (other instanceof SliceLineTokens) {
            return (this._startOffset === other._startOffset
                && this._endOffset === other._endOffset
                && this._deltaOffset === other._deltaOffset
                && this._source.slicedEquals(other._source, this._firstTokenIndex, this._tokensCount));
        }
        return false;
    }
    getCount() {
        return this._tokensCount;
    }
    getForeground(tokenIndex) {
        return this._source.getForeground(this._firstTokenIndex + tokenIndex);
    }
    getEndOffset(tokenIndex) {
        const tokenEndOffset = this._source.getEndOffset(this._firstTokenIndex + tokenIndex);
        return Math.min(this._endOffset, tokenEndOffset) - this._startOffset + this._deltaOffset;
    }
    getClassName(tokenIndex) {
        return this._source.getClassName(this._firstTokenIndex + tokenIndex);
    }
    getInlineStyle(tokenIndex, colorMap) {
        return this._source.getInlineStyle(this._firstTokenIndex + tokenIndex, colorMap);
    }
    getPresentation(tokenIndex) {
        return this._source.getPresentation(this._firstTokenIndex + tokenIndex);
    }
    findTokenIndexAtOffset(offset) {
        return this._source.findTokenIndexAtOffset(offset + this._startOffset - this._deltaOffset) - this._firstTokenIndex;
    }
}
