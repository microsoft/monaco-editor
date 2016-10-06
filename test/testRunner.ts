/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {loadLanguage} from '../src/monaco.contribution';
import * as assert from 'assert';

// Allow for running under nodejs/requirejs in tests
var _monaco: typeof monaco = (typeof monaco === 'undefined' ? (<any>self).monaco : monaco);

export interface IRelaxedToken {
	startIndex: number;
	type: string;
}

export interface ITestItem {
	line: string;
	tokens: IRelaxedToken[];
}

export function testTokenization(_language:string|string[], tests:ITestItem[][]): void {
	let languages:string[];
	if (typeof _language === 'string') {
		languages = [_language];
	} else {
		languages = _language;
	}
	let mainLanguage = languages[0];
	suite(mainLanguage + ' tokenization', () => {
		test('', (done) => {
			_monaco.Promise.join(languages.map(l => loadLanguage(l))).then(() => {
				// clean stack
				setTimeout(() => {
					runTests(mainLanguage, tests);
					done();
				});
			}).then(null, done);
		});
	});
}

function runTests(languageId:string, tests:ITestItem[][]): void {
	tests.forEach((test) => runTest(languageId, test));
}

function runTest(languageId:string, test:ITestItem[]): void {

	interface LineToken {
		startOffset: number;
		endOffset: number;
		type: string;
		modeId: string;
		hasPrev: boolean;
		hasNext: boolean;

		prev(): LineToken;
		next(): LineToken;
	}

	interface LineTokens {
		// modeTransitions:ModeTransition[];

		getTokenCount(): number;
		getTokenStartOffset(tokenIndex:number): number;
		getTokenType(tokenIndex:number): string;
		getTokenEndOffset(tokenIndex:number): number;
		equals(other:LineTokens): boolean;
		findTokenIndexAtOffset(offset:number): number;
		findTokenAtOffset(offset:number): LineToken;
		firstToken(): LineToken;
		lastToken(): LineToken;
		// inflate(): ViewLineToken[];
		// sliceAndInflate(startOffset:number, endOffset:number, deltaStartIndex:number): ViewLineToken[];
	}

	let text = test.map(t => t.line).join('\n');
	let model = _monaco.editor.createModel(text, languageId);

	for (let lineNumber = 1, lineCount = model.getLineCount(); lineNumber <= lineCount; lineNumber++) {
		let actual: IRelaxedToken[] = [];
		let lineTokens:LineTokens = (<any>model).getLineTokens(lineNumber);
		let token = lineTokens.firstToken();
		while (token) {
			actual.push({
				startIndex: token.startOffset,
				type: token.type
			});
			token = token.next();
		}

		let expected = test[lineNumber - 1].tokens;
		// console.log(`actual: ${JSON.stringify(actual)}`);
		// console.log(`expected: ${JSON.stringify(expected)}`);
		assert.deepEqual(actual, expected, 'TOKENIZING ' + text);
	}

	model.dispose();
}
