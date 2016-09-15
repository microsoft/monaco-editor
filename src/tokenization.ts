/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import {Scanner, ScannerState, TokenType, createScanner} from 'vscode-html-languageservice/lib/parser/htmlScanner';


export function createTokenizationSupport(supportComments: boolean): monaco.languages.TokensProvider {
    return {
        getInitialState: () => new HTMLState(null, ScannerState.WithinContent),
        tokenize: (line, state, offsetDelta?, stopAtOffset?) => tokenize(line, <HTMLState>state, offsetDelta, stopAtOffset)
    };
}

const DELIM_END = 'punctuation.definition.meta.tag.end.html';
const DELIM_START = 'punctuation.definition.meta.tag.begin.html';
const DELIM_ASSIGN = 'meta.tag.assign.html';
const ATTRIB_NAME = 'entity.other.attribute-name.html';
const ATTRIB_VALUE = 'string.html';
const COMMENT = 'comment.html.content';
const DELIM_COMMENT = 'comment.html';
const DOCTYPE = 'entity.other.attribute-name.html';
const DELIM_DOCTYPE = 'entity.name.tag.html';

function getTag(name: string) {
	return TAG_PREFIX + name;
}

const TAG_PREFIX = 'entity.name.tag.tag-';

class HTMLState implements monaco.languages.IState {

    private _state: monaco.languages.IState;

    public scannerState: ScannerState;

    constructor(state: monaco.languages.IState, scannerState: ScannerState) {
        this._state = state;
        this.scannerState = scannerState;
    }

    public clone(): HTMLState {
        return new HTMLState(this._state, this.scannerState);
    }

    public equals(other: monaco.languages.IState): boolean {
        if (other === this) {
            return true;
        }
        if (!other || !(other instanceof HTMLState)) {
            return false;
        }
        return this.scannerState === (<HTMLState>other).scannerState;
    }

    public getStateData(): monaco.languages.IState {
        return this._state;
    }

    public setStateData(state: monaco.languages.IState): void {
        this._state = state;
    }
}


function tokenize(line: string, state: HTMLState, offsetDelta: number = 0, stopAtOffset = line.length): monaco.languages.ILineTokens {

    let scanner = createScanner(line, 0, state && state.scannerState);
    let tokenType = scanner.scan();
    let ret = {
        tokens: <monaco.languages.IToken[]>[],
        endState: state.clone()
    };
    let position = -1;
    while (tokenType !== TokenType.EOS && scanner.getTokenOffset() < stopAtOffset) {
        let scope;
        switch (tokenType) {
            case TokenType.AttributeName:
                scope = ATTRIB_NAME;
                break;
            case TokenType.AttributeValue:
                scope = ATTRIB_VALUE;
                break;
            case TokenType.StartTag:
            case TokenType.EndTag:
                scope = getTag(scanner.getTokenText());
                break;
            case TokenType.DelimiterAssign:
                scope = DELIM_ASSIGN;
                break;
            case TokenType.StartTagOpen:
            case TokenType.StartTagClose:
            case TokenType.StartTagSelfClose:
                scope = DELIM_START;
                break;
            case TokenType.EndTagOpen:
            case TokenType.EndTagClose:
                scope = DELIM_END;
                break;
            case TokenType.Doctype:
                scope = DOCTYPE;
                break;
            case TokenType.StartDoctypeTag:
            case TokenType.EndDoctypeTag:
                scope = DELIM_DOCTYPE;
                break;
            case TokenType.Comment:
                scope = COMMENT;
                break;
            case TokenType.StartCommentTag:
            case TokenType.EndCommentTag:
                scope = DELIM_COMMENT;
                break;
            default:
                scope = '';
                break;

        }
        if (position < scanner.getTokenOffset()) {
            ret.tokens.push({
                startIndex: scanner.getTokenOffset() + offsetDelta,
                scopes: scope
            });
        } else {
            throw new Error('Scanner did not advance, next 3 characters are: ' + line.substr(scanner.getTokenOffset(), 3));
        }
        position = scanner.getTokenOffset();

        tokenType = scanner.scan();
    }
    ret.endState = new HTMLState(state.getStateData(), scanner.getScannerState());

    return ret;
}