/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as json from 'jsonc-parser';
import { languages } from '../../fillers/monaco-editor-core';

export function createTokenizationSupport(supportComments: boolean): languages.TokensProvider {
	return {
		getInitialState: () => new JSONState(null, null, false, null),
		tokenize: (line, state?) => tokenize(supportComments, line, <JSONState>state)
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

const enum JSONParent {
	Object = 0,
	Array = 1
}

class ParentsStack {
	constructor(public readonly parent: ParentsStack | null, public readonly type: JSONParent) {}

	public static pop(parents: ParentsStack | null): ParentsStack | null {
		if (parents) {
			return parents.parent;
		}
		return null;
	}

	public static push(parents: ParentsStack | null, type: JSONParent): ParentsStack {
		return new ParentsStack(parents, type);
	}

	public static equals(a: ParentsStack | null, b: ParentsStack | null): boolean {
		if (!a && !b) {
			return true;
		}
		if (!a || !b) {
			return false;
		}
		while (a && b) {
			if (a === b) {
				return true;
			}
			if (a.type !== b.type) {
				return false;
			}
			a = a.parent;
			b = b.parent;
		}
		return true;
	}
}

class JSONState implements languages.IState {
	private _state: languages.IState | null;

	public scanError: ScanError | null;
	public lastWasColon: boolean;
	public parents: ParentsStack | null;

	constructor(
		state: languages.IState | null,
		scanError: ScanError | null,
		lastWasColon: boolean,
		parents: ParentsStack | null
	) {
		this._state = state;
		this.scanError = scanError;
		this.lastWasColon = lastWasColon;
		this.parents = parents;
	}

	public clone(): JSONState {
		return new JSONState(this._state, this.scanError, this.lastWasColon, this.parents);
	}

	public equals(other: languages.IState): boolean {
		if (other === this) {
			return true;
		}
		if (!other || !(other instanceof JSONState)) {
			return false;
		}
		return (
			this.scanError === other.scanError &&
			this.lastWasColon === other.lastWasColon &&
			ParentsStack.equals(this.parents, other.parents)
		);
	}

	public getStateData(): languages.IState | null {
		return this._state;
	}

	public setStateData(state: languages.IState): void {
		this._state = state;
	}
}

const enum ScanError {
	None = 0,
	UnexpectedEndOfComment = 1,
	UnexpectedEndOfString = 2,
	UnexpectedEndOfNumber = 3,
	InvalidUnicode = 4,
	InvalidEscapeCharacter = 5,
	InvalidCharacter = 6
}

const enum SyntaxKind {
	OpenBraceToken = 1,
	CloseBraceToken = 2,
	OpenBracketToken = 3,
	CloseBracketToken = 4,
	CommaToken = 5,
	ColonToken = 6,
	NullKeyword = 7,
	TrueKeyword = 8,
	FalseKeyword = 9,
	StringLiteral = 10,
	NumericLiteral = 11,
	LineCommentTrivia = 12,
	BlockCommentTrivia = 13,
	LineBreakTrivia = 14,
	Trivia = 15,
	Unknown = 16,
	EOF = 17
}

function tokenize(
	comments: boolean,
	line: string,
	state: JSONState,
	offsetDelta: number = 0
): languages.ILineTokens {
	// handle multiline strings and block comments
	let numberOfInsertedCharacters = 0;
	let adjustOffset = false;

	switch (state.scanError) {
		case ScanError.UnexpectedEndOfString:
			line = '"' + line;
			numberOfInsertedCharacters = 1;
			break;
		case ScanError.UnexpectedEndOfComment:
			line = '/*' + line;
			numberOfInsertedCharacters = 2;
			break;
	}

	const scanner = json.createScanner(line);
	let lastWasColon = state.lastWasColon;
	let parents = state.parents;

	const ret: languages.ILineTokens = {
		tokens: <languages.IToken[]>[],
		endState: state.clone()
	};

	while (true) {
		let offset = offsetDelta + scanner.getPosition();
		let type = '';

		const kind = <SyntaxKind>(<any>scanner.scan());
		if (kind === SyntaxKind.EOF) {
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
			case SyntaxKind.OpenBraceToken:
				parents = ParentsStack.push(parents, JSONParent.Object);
				type = TOKEN_DELIM_OBJECT;
				lastWasColon = false;
				break;
			case SyntaxKind.CloseBraceToken:
				parents = ParentsStack.pop(parents);
				type = TOKEN_DELIM_OBJECT;
				lastWasColon = false;
				break;
			case SyntaxKind.OpenBracketToken:
				parents = ParentsStack.push(parents, JSONParent.Array);
				type = TOKEN_DELIM_ARRAY;
				lastWasColon = false;
				break;
			case SyntaxKind.CloseBracketToken:
				parents = ParentsStack.pop(parents);
				type = TOKEN_DELIM_ARRAY;
				lastWasColon = false;
				break;
			case SyntaxKind.ColonToken:
				type = TOKEN_DELIM_COLON;
				lastWasColon = true;
				break;
			case SyntaxKind.CommaToken:
				type = TOKEN_DELIM_COMMA;
				lastWasColon = false;
				break;
			case SyntaxKind.TrueKeyword:
			case SyntaxKind.FalseKeyword:
				type = TOKEN_VALUE_BOOLEAN;
				lastWasColon = false;
				break;
			case SyntaxKind.NullKeyword:
				type = TOKEN_VALUE_NULL;
				lastWasColon = false;
				break;
			case SyntaxKind.StringLiteral:
				const currentParent = parents ? parents.type : JSONParent.Object;
				const inArray = currentParent === JSONParent.Array;
				type = lastWasColon || inArray ? TOKEN_VALUE_STRING : TOKEN_PROPERTY_NAME;
				lastWasColon = false;
				break;
			case SyntaxKind.NumericLiteral:
				type = TOKEN_VALUE_NUMBER;
				lastWasColon = false;
				break;
		}

		// comments, iff enabled
		if (comments) {
			switch (kind) {
				case SyntaxKind.LineCommentTrivia:
					type = TOKEN_COMMENT_LINE;
					break;
				case SyntaxKind.BlockCommentTrivia:
					type = TOKEN_COMMENT_BLOCK;
					break;
			}
		}

		ret.endState = new JSONState(
			state.getStateData(),
			<ScanError>(<any>scanner.getTokenError()),
			lastWasColon,
			parents
		);
		ret.tokens.push({
			startIndex: offset,
			scopes: type
		});
	}

	return ret;
}
