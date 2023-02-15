/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { CachedFunction } from '../../../../base/common/cache.js';
import { BugIndicatingError } from '../../../../base/common/errors.js';
/**
 * Captures all bracket related configurations for a single language.
 * Immutable.
*/
export class LanguageBracketsConfiguration {
    constructor(languageId, config) {
        this.languageId = languageId;
        let brackets;
        // Prefer colorized bracket pairs, as they are more accurate.
        // TODO@hediet: Deprecate `colorizedBracketPairs` and increase accuracy for brackets.
        if (config.colorizedBracketPairs) {
            brackets = filterValidBrackets(config.colorizedBracketPairs.map(b => [b[0], b[1]]));
        }
        else if (config.brackets) {
            brackets = filterValidBrackets(config.brackets
                .map((b) => [b[0], b[1]])
                // Many languages set < ... > as bracket pair, even though they also use it as comparison operator.
                // This leads to problems when colorizing this bracket, so we exclude it by default.
                // Languages can still override this by configuring `colorizedBracketPairs`
                // https://github.com/microsoft/vscode/issues/132476
                .filter((p) => !(p[0] === '<' && p[1] === '>')));
        }
        else {
            brackets = [];
        }
        const openingBracketInfos = new CachedFunction((bracket) => {
            const closing = new Set();
            return {
                info: new OpeningBracketKind(this, bracket, closing),
                closing,
            };
        });
        const closingBracketInfos = new CachedFunction((bracket) => {
            const opening = new Set();
            return {
                info: new ClosingBracketKind(this, bracket, opening),
                opening,
            };
        });
        for (const [open, close] of brackets) {
            const opening = openingBracketInfos.get(open);
            const closing = closingBracketInfos.get(close);
            opening.closing.add(closing.info);
            closing.opening.add(opening.info);
        }
        this._openingBrackets = new Map([...openingBracketInfos.cachedValues].map(([k, v]) => [k, v.info]));
        this._closingBrackets = new Map([...closingBracketInfos.cachedValues].map(([k, v]) => [k, v.info]));
    }
    /**
     * No two brackets have the same bracket text.
    */
    get openingBrackets() {
        return [...this._openingBrackets.values()];
    }
    /**
     * No two brackets have the same bracket text.
    */
    get closingBrackets() {
        return [...this._closingBrackets.values()];
    }
    getOpeningBracketInfo(bracketText) {
        return this._openingBrackets.get(bracketText);
    }
    getClosingBracketInfo(bracketText) {
        return this._closingBrackets.get(bracketText);
    }
    getBracketInfo(bracketText) {
        return this.getOpeningBracketInfo(bracketText) || this.getClosingBracketInfo(bracketText);
    }
}
function filterValidBrackets(bracketPairs) {
    return bracketPairs.filter(([open, close]) => open !== '' && close !== '');
}
export class BracketKindBase {
    constructor(config, bracketText) {
        this.config = config;
        this.bracketText = bracketText;
    }
    get languageId() {
        return this.config.languageId;
    }
}
export class OpeningBracketKind extends BracketKindBase {
    constructor(config, bracketText, openedBrackets) {
        super(config, bracketText);
        this.openedBrackets = openedBrackets;
        this.isOpeningBracket = true;
    }
}
export class ClosingBracketKind extends BracketKindBase {
    constructor(config, bracketText, 
    /**
     * Non empty array of all opening brackets this bracket closes.
    */
    closedBrackets) {
        super(config, bracketText);
        this.closedBrackets = closedBrackets;
        this.isOpeningBracket = false;
    }
    /**
     * Checks if this bracket closes the given other bracket.
     * Brackets from other language configuration can be used (they will always return false).
     * If other is a bracket with the same language id, they have to be from the same configuration.
    */
    closes(other) {
        if (other.languageId === this.languageId) {
            if (other['config'] !== this.config) {
                throw new BugIndicatingError('Brackets from different language configuration cannot be used.');
            }
        }
        return this.closedBrackets.has(other);
    }
    getClosedBrackets() {
        return [...this.closedBrackets];
    }
}
