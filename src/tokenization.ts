/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import * as json from 'jsonc-parser';

export function createTokenizationSupport(supportComments: boolean): monaco.languages.TokensProvider {
    return {
        getInitialState: () => new JSONState(null, null, false),
        tokenize: (line, state, offsetDelta?, stopAtOffset?) => tokenize(supportComments, line, <JSONState>state, offsetDelta, stopAtOffset)
    };
}

export const TOKEN_DELIM_OBJECT = 'delimiter.bracket.json';
export const TOKEN_DELIM_ARRAY = 'delimiter.array.json';
export const TOKEN_DELIM_COLON = 'delimiter.colon.json';
export const TOKEN_DELIM_COMMA = 'delimiter.comma.json';
export const TOKEN_VALUE_BOOLEAN = 'keyword.json';
export const TOKEN_VALUE_NULL = 'keyword.json';
export const TOKEN_VALUE_STRING = 'string.value.json';
export const TOKEN_VALUE_NUMBER = 'number.json';
export const TOKEN_PROPERTY_NAME = 'string.key.json';
export const TOKEN_COMMENT_BLOCK = 'comment.block.json';
export const TOKEN_COMMENT_LINE = 'comment.line.json';

class JSONState implements monaco.languages.IState {

    private _state: monaco.languages.IState;

    public scanError: json.ScanError;
    public lastWasColon: boolean;

    constructor(state: monaco.languages.IState, scanError: json.ScanError, lastWasColon: boolean) {
        this._state = state;
        this.scanError = scanError;
        this.lastWasColon = lastWasColon;
    }

    public clone(): JSONState {
        return new JSONState(this._state, this.scanError, this.lastWasColon);
    }

    public equals(other: monaco.languages.IState): boolean {
        if (other === this) {
            return true;
        }
        if (!other || !(other instanceof JSONState)) {
            return false;
        }
        return this.scanError === (<JSONState>other).scanError &&
            this.lastWasColon === (<JSONState>other).lastWasColon;
    }

    public getStateData(): monaco.languages.IState {
        return this._state;
    }

    public setStateData(state: monaco.languages.IState): void {
        this._state = state;
    }
}

function tokenize(comments: boolean, line: string, state: JSONState, offsetDelta: number = 0, stopAtOffset?: number): monaco.languages.ILineTokens {

    // handle multiline strings and block comments
    var numberOfInsertedCharacters = 0,
        adjustOffset = false;

    switch (state.scanError) {
        case json.ScanError.UnexpectedEndOfString:
            line = '"' + line;
            numberOfInsertedCharacters = 1;
            break;
        case json.ScanError.UnexpectedEndOfComment:
            line = '/*' + line;
            numberOfInsertedCharacters = 2;
            break;
    }

    var scanner = json.createScanner(line),
        kind: json.SyntaxKind,
        ret: monaco.languages.ILineTokens,
        lastWasColon = state.lastWasColon;

    ret = {
        tokens: <monaco.languages.IToken[]>[],
        endState: state.clone()
    };

    while (true) {

        var offset = offsetDelta + scanner.getPosition(),
            type = '';

        kind = scanner.scan();
        if (kind === json.SyntaxKind.EOF) {
            break;
        }

        // Check that the scanner has advanced
        if (offset === offsetDelta + scanner.getPosition()) {
            throw new Error('Scanner did not advance, next 3 characters are: ' + line.substr(scanner.getPosition(), 3));
        }

        // In case we inserted /* or " character, we need to
        // adjust the offset of all tokens (except the first)
        if (adjustOffset) {
            offset -= numberOfInsertedCharacters;
        }
        adjustOffset = numberOfInsertedCharacters > 0;


        // brackets and type
        switch (kind) {
            case json.SyntaxKind.OpenBraceToken:
                type = TOKEN_DELIM_OBJECT;
                lastWasColon = false;
                break;
            case json.SyntaxKind.CloseBraceToken:
                type = TOKEN_DELIM_OBJECT;
                lastWasColon = false;
                break;
            case json.SyntaxKind.OpenBracketToken:
                type = TOKEN_DELIM_ARRAY;
                lastWasColon = false;
                break;
            case json.SyntaxKind.CloseBracketToken:
                type = TOKEN_DELIM_ARRAY;
                lastWasColon = false;
                break;
            case json.SyntaxKind.ColonToken:
                type = TOKEN_DELIM_COLON;
                lastWasColon = true;
                break;
            case json.SyntaxKind.CommaToken:
                type = TOKEN_DELIM_COMMA;
                lastWasColon = false;
                break;
            case json.SyntaxKind.TrueKeyword:
            case json.SyntaxKind.FalseKeyword:
                type = TOKEN_VALUE_BOOLEAN;
                lastWasColon = false;
                break;
            case json.SyntaxKind.NullKeyword:
                type = TOKEN_VALUE_NULL;
                lastWasColon = false;
                break;
            case json.SyntaxKind.StringLiteral:
                type = lastWasColon ? TOKEN_VALUE_STRING : TOKEN_PROPERTY_NAME;
                lastWasColon = false;
                break;
            case json.SyntaxKind.NumericLiteral:
                type = TOKEN_VALUE_NUMBER;
                lastWasColon = false;
                break;
        }

        // comments, iff enabled
        if (comments) {
            switch (kind) {
                case json.SyntaxKind.LineCommentTrivia:
                    type = TOKEN_COMMENT_LINE;
                    break;
                case json.SyntaxKind.BlockCommentTrivia:
                    type = TOKEN_COMMENT_BLOCK;
                    break;
            }
        }

        ret.endState = new JSONState(state.getStateData(), scanner.getTokenError(), lastWasColon);
        ret.tokens.push({
            startIndex: offset,
            scopes: type
        });
    }

    return ret;
}