/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as json from 'jsonc-parser';
import { languages } from './fillers/monaco-editor-core';

export function createTokenizationSupport(supportComments: boolean): languages.TokensProvider {
	return {
		getInitialState: () => new JSONState(null, null),
		tokenize: (line, state, offsetDelta?, stopAtOffset?) =>
			tokenize(supportComments, line, <JSONState>state, offsetDelta, stopAtOffset)
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

class JSONState implements languages.IState {
	private _state: languages.IState;

	public scanError: json.ScanError;

	constructor(state: languages.IState, scanError: json.ScanError) {
		this._state = state;
		this.scanError = scanError;
	}

	public clone(): JSONState {
		return new JSONState(this._state, this.scanError);
	}

	public equals(other: languages.IState): boolean {
		if (other === this) {
			return true;
		}
		if (!other || !(other instanceof JSONState)) {
			return false;
		}
		return this.scanError === (<JSONState>other).scanError;
	}

	public getStateData(): languages.IState {
		return this._state;
	}

	public setStateData(state: languages.IState): void {
		this._state = state;
	}
}

function tokenize(
	comments: boolean,
	line: string,
	state: JSONState,
	offsetDelta: number = 0,
	stopAtOffset?: number
): languages.ILineTokens {
	// handle multiline strings and block comments
	let numberOfInsertedCharacters = 0;
	let adjustOffset = false;

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

	const scanner = json.createScanner(line);

	const ret: languages.ILineTokens = {
		tokens: <languages.IToken[]>[],
		endState: state.clone()
	};

	while (true) {
		let offset = offsetDelta + scanner.getPosition();
		let type = '';

		const kind = scanner.scan();
		if (kind === json.SyntaxKind.EOF) {
			break;
		}

		// Check that the scanner has advanced
		if (offset === offsetDelta + scanner.getPosition()) {
			throw new Error(
				'Scanner did not advance, next 3 characters are: ' + line.substr(scanner.getPosition(), 3)
			);
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
				break;
			case json.SyntaxKind.CloseBraceToken:
				type = TOKEN_DELIM_OBJECT;
				break;
			case json.SyntaxKind.OpenBracketToken:
				type = TOKEN_DELIM_ARRAY;
				break;
			case json.SyntaxKind.CloseBracketToken:
				type = TOKEN_DELIM_ARRAY;
				break;
			case json.SyntaxKind.ColonToken:
				for (let i = ret.tokens.length - 1; i >= 0; i--) {
					const token = ret.tokens[i];
					if (token.scopes === '' || token.scopes === TOKEN_COMMENT_BLOCK) {
						continue;
					}
					if (token.scopes === TOKEN_VALUE_STRING) {
						// !change previous token to property name!
						token.scopes = TOKEN_PROPERTY_NAME;
					}
					break;
				}
				type = TOKEN_DELIM_COLON;
				break;
			case json.SyntaxKind.CommaToken:
				type = TOKEN_DELIM_COMMA;
				break;
			case json.SyntaxKind.TrueKeyword:
			case json.SyntaxKind.FalseKeyword:
				type = TOKEN_VALUE_BOOLEAN;
				break;
			case json.SyntaxKind.NullKeyword:
				type = TOKEN_VALUE_NULL;
				break;
			case json.SyntaxKind.StringLiteral:
				type = TOKEN_VALUE_STRING;
				break;
			case json.SyntaxKind.NumericLiteral:
				type = TOKEN_VALUE_NUMBER;
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

		ret.endState = new JSONState(state.getStateData(), scanner.getTokenError());
		ret.tokens.push({
			startIndex: offset,
			scopes: type
		});
	}

	return ret;
}
