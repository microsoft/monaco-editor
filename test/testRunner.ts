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

export function testTokenization(languageId:string, tests:ITestItem[][]): void {
	suite(languageId + ' tokenization', () => {
		test('', (done) => {
			loadLanguage(languageId).then(() => {
				runTests(languageId, tests);
				done();
			}).then(null, done);
		});
	});
}

function runTests(languageId:string, tests:ITestItem[][]): void {
	tests.forEach((test) => runTest(languageId, test));
}

function runTest(languageId:string, test:ITestItem[]): void {
	let text = test.map(t => t.line).join('\n');
	let model = _monaco.editor.createModel(text, languageId);

	for (let lineNumber = 1, lineCount = model.getLineCount(); lineNumber <= lineCount; lineNumber++) {
		let actual: IRelaxedToken[] = [];
		let lineTokens = (<any>model).getLineTokens(lineNumber);
		for (let j = 0; j < lineTokens.getTokenCount(); j++) {
			actual.push({
				startIndex: lineTokens.getTokenStartIndex(j),
				type: lineTokens.getTokenType(j)
			});
		}

		let expected = test[lineNumber - 1].tokens;
		// console.log(`actual: ${JSON.stringify(actual)}`);
		// console.log(`expected: ${JSON.stringify(expected)}`);
		assert.deepEqual(actual, expected, 'TOKENIZING ' + text);
	}

	model.dispose();
}
