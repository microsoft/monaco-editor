/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('aes', [
	[
		{
			line: 'contract HackBG =',
			tokens: [
				{ startIndex: 0, type: 'keyword.contract.aes' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.aes' },
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'delimiter.aes' }
			]
		}
	],

	[
		{
			line: 'record state = { developers : list(developer) }',
			tokens: [
				{ startIndex: 0, type: 'keyword.record.aes' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'keyword.state.aes' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'delimiter.aes' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'delimiter.curly.aes' },
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'identifier.aes' },
				{ startIndex: 27, type: '' },
				{ startIndex: 28, type: 'delimiter.aes' },
				{ startIndex: 29, type: '' },
				{ startIndex: 30, type: 'keyword.list.aes' },
				{ startIndex: 34, type: 'delimiter.parenthesis.aes' },
				{ startIndex: 35, type: 'identifier.aes' },
				{ startIndex: 44, type: 'delimiter.parenthesis.aes' },
				{ startIndex: 45, type: '' },
				{ startIndex: 46, type: 'delimiter.curly.aes' }
			]
		}
	],

	[
		{
			line: 'record developer = {',
			tokens: [
				{ startIndex: 0, type: 'keyword.record.aes' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'identifier.aes' },
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'delimiter.aes' },
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'delimiter.curly.aes' }
			]
		}
	],

	[
		{
			line: 'name : string,',
			tokens: [
				{ startIndex: 0, type: 'identifier.aes' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'delimiter.aes' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'keyword.string.aes' },
				{ startIndex: 13, type: 'delimiter.aes' }
			]
		}
	],

	[
		{
			line: 'experience : int,',
			tokens: [
				{ startIndex: 0, type: 'identifier.aes' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'delimiter.aes' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'keyword.int.aes' },
				{ startIndex: 16, type: 'delimiter.aes' }
			]
		}
	],

	[
		{
			line: 'skillset : list(string) }',
			tokens: [
				{ startIndex: 0, type: 'identifier.aes' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'delimiter.aes' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'keyword.list.aes' },
				{ startIndex: 15, type: 'delimiter.parenthesis.aes' },
				{ startIndex: 16, type: 'keyword.string.aes' },
				{ startIndex: 22, type: 'delimiter.parenthesis.aes' },
				{ startIndex: 23, type: '' },
				{ startIndex: 24, type: 'delimiter.curly.aes' }
			]
		}
	],

	[
		{
			line: 'entrypoint init() = { developers = {} }',
			tokens: [
				{ startIndex: 0, type: 'keyword.entrypoint.aes' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'identifier.aes' },
				{ startIndex: 15, type: 'delimiter.parenthesis.aes' },
				{ startIndex: 17, type: '' },
				{ startIndex: 18, type: 'delimiter.aes' },
				{ startIndex: 19, type: '' },
				{ startIndex: 20, type: 'delimiter.curly.aes' },
				{ startIndex: 21, type: '' },
				{ startIndex: 22, type: 'identifier.aes' },
				{ startIndex: 32, type: '' },
				{ startIndex: 33, type: 'delimiter.aes' },
				{ startIndex: 34, type: '' },
				{ startIndex: 35, type: 'delimiter.curly.aes' },
				{ startIndex: 37, type: '' },
				{ startIndex: 38, type: 'delimiter.curly.aes' }
			]
		}
	],

	// Comments - single line
	[
		{
			line: '//',
			tokens: [{ startIndex: 0, type: 'comment.aes' }]
		}
	],

	[
		{
			line: '    // a comment',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'comment.aes' }
			]
		}
	],

	[
		{
			line: '// a comment',
			tokens: [{ startIndex: 0, type: 'comment.aes' }]
		}
	],

	[
		{
			line: '//sticky comment',
			tokens: [{ startIndex: 0, type: 'comment.aes' }]
		}
	],

	[
		{
			line: '/almost a comment',
			tokens: [
				{ startIndex: 0, type: 'delimiter.aes' },
				{ startIndex: 1, type: 'identifier.aes' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.aes' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'identifier.aes' }
			]
		}
	],

	[
		{
			line: '/* //*/ a',
			tokens: [
				{ startIndex: 0, type: 'comment.aes' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.aes' }
			]
		}
	],

	[
		{
			line: '1 / 2 /* comment',
			tokens: [
				{ startIndex: 0, type: 'number.aes' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.aes' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.aes' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'comment.aes' }
			]
		}
	],

	[
		{
			line: 'let x : int = 1 // my comment // is a nice one',
			tokens: [
				{ startIndex: 0, type: 'keyword.let.aes' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.aes' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.aes' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'keyword.int.aes' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'delimiter.aes' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'number.aes' },
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'comment.aes' }
			]
		}
	],

	// Comments - range comment, single line
	[
		{
			line: '/* a simple comment */',
			tokens: [{ startIndex: 0, type: 'comment.aes' }]
		}
	],

	[
		{
			line: 'let x : int = /* a simple comment */ 1',
			tokens: [
				{ startIndex: 0, type: 'keyword.let.aes' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.aes' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.aes' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'keyword.int.aes' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'delimiter.aes' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'comment.aes' },
				{ startIndex: 36, type: '' },
				{ startIndex: 37, type: 'number.aes' }
			]
		}
	],

	[
		{
			line: 'let x = /* comment */ 1 */',
			tokens: [
				{ startIndex: 0, type: 'keyword.let.aes' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.aes' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.aes' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'comment.aes' },
				{ startIndex: 21, type: '' },
				{ startIndex: 22, type: 'number.aes' },
				{ startIndex: 23, type: '' }
			]
		}
	],

	[
		{
			line: 'let x = /**/',
			tokens: [
				{ startIndex: 0, type: 'keyword.let.aes' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.aes' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.aes' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'comment.aes' }
			]
		}
	],

	[
		{
			line: 'let x = /*/',
			tokens: [
				{ startIndex: 0, type: 'keyword.let.aes' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.aes' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.aes' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'comment.aes' }
			]
		}
	]
]);
