/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('sql', [
	// Comments
	[
		{
			line: '-- a comment',
			tokens: [{ startIndex: 0, type: 'comment.sql' }]
		}
	],

	[
		{
			line: '---sticky -- comment',
			tokens: [{ startIndex: 0, type: 'comment.sql' }]
		}
	],

	[
		{
			line: '-almost a comment',
			tokens: [
				{ startIndex: 0, type: 'operator.sql' },
				{ startIndex: 1, type: 'identifier.sql' },
				{ startIndex: 7, type: 'white.sql' },
				{ startIndex: 8, type: 'identifier.sql' },
				{ startIndex: 9, type: 'white.sql' },
				{ startIndex: 10, type: 'identifier.sql' }
			]
		}
	],

	[
		{
			line: '/* a full line comment */',
			tokens: [
				{ startIndex: 0, type: 'comment.quote.sql' },
				{ startIndex: 2, type: 'comment.sql' },
				{ startIndex: 23, type: 'comment.quote.sql' }
			]
		}
	],

	[
		{
			line: '/* /// *** /// */',
			tokens: [
				{ startIndex: 0, type: 'comment.quote.sql' },
				{ startIndex: 2, type: 'comment.sql' },
				{ startIndex: 15, type: 'comment.quote.sql' }
			]
		}
	],

	[
		{
			line: 'declare _x int = /* a simple comment */ 1;',
			tokens: [
				{ startIndex: 0, type: 'keyword.sql' },
				{ startIndex: 7, type: 'white.sql' },
				{ startIndex: 8, type: 'identifier.sql' },
				{ startIndex: 10, type: 'white.sql' },
				{ startIndex: 11, type: 'keyword.sql' },
				{ startIndex: 14, type: 'white.sql' },
				{ startIndex: 15, type: 'operator.sql' },
				{ startIndex: 16, type: 'white.sql' },
				{ startIndex: 17, type: 'comment.quote.sql' },
				{ startIndex: 19, type: 'comment.sql' },
				{ startIndex: 37, type: 'comment.quote.sql' },
				{ startIndex: 39, type: 'white.sql' },
				{ startIndex: 40, type: 'number.sql' },
				{ startIndex: 41, type: 'delimiter.sql' }
			]
		}
	],

	// Not supporting nested comments, as nested comments seem to not be standard?
	// i.e. http://stackoverflow.com/questions/728172/are-there-multiline-comment-delimiters-in-sql-that-are-vendor-agnostic
	[
		{
			line: '_x=/* a /* nested comment  1*/;',
			tokens: [
				{ startIndex: 0, type: 'identifier.sql' },
				{ startIndex: 2, type: 'operator.sql' },
				{ startIndex: 3, type: 'comment.quote.sql' },
				{ startIndex: 5, type: 'comment.sql' },
				{ startIndex: 28, type: 'comment.quote.sql' },
				{ startIndex: 30, type: 'delimiter.sql' }
			]
		}
	],

	[
		{
			line: '_x=/* another comment */ 1*/;',
			tokens: [
				{ startIndex: 0, type: 'identifier.sql' },
				{ startIndex: 2, type: 'operator.sql' },
				{ startIndex: 3, type: 'comment.quote.sql' },
				{ startIndex: 5, type: 'comment.sql' },
				{ startIndex: 22, type: 'comment.quote.sql' },
				{ startIndex: 24, type: 'white.sql' },
				{ startIndex: 25, type: 'number.sql' },
				{ startIndex: 26, type: 'operator.sql' },
				{ startIndex: 28, type: 'delimiter.sql' }
			]
		}
	],

	[
		{
			line: '_x=/*/;',
			tokens: [
				{ startIndex: 0, type: 'identifier.sql' },
				{ startIndex: 2, type: 'operator.sql' },
				{ startIndex: 3, type: 'comment.quote.sql' },
				{ startIndex: 5, type: 'comment.sql' }
			]
		}
	],

	// Numbers
	[
		{
			line: '123',
			tokens: [{ startIndex: 0, type: 'number.sql' }]
		}
	],

	[
		{
			line: '-123',
			tokens: [
				{ startIndex: 0, type: 'operator.sql' },
				{ startIndex: 1, type: 'number.sql' }
			]
		}
	],

	[
		{
			line: '0xaBc123',
			tokens: [{ startIndex: 0, type: 'number.sql' }]
		}
	],

	[
		{
			line: '0XaBc123',
			tokens: [{ startIndex: 0, type: 'number.sql' }]
		}
	],

	[
		{
			line: '0x',
			tokens: [{ startIndex: 0, type: 'number.sql' }]
		}
	],

	[
		{
			line: '0x0',
			tokens: [{ startIndex: 0, type: 'number.sql' }]
		}
	],

	[
		{
			line: '0xAB_CD',
			tokens: [
				{ startIndex: 0, type: 'number.sql' },
				{ startIndex: 4, type: 'identifier.sql' }
			]
		}
	],

	[
		{
			line: '$',
			tokens: [{ startIndex: 0, type: 'number.sql' }]
		}
	],

	[
		{
			line: '$-123',
			tokens: [{ startIndex: 0, type: 'number.sql' }]
		}
	],

	[
		{
			line: '$-+-123',
			tokens: [{ startIndex: 0, type: 'number.sql' }]
		}
	],

	[
		{
			line: '$123.5678',
			tokens: [{ startIndex: 0, type: 'number.sql' }]
		}
	],

	[
		{
			line: '$0.99',
			tokens: [{ startIndex: 0, type: 'number.sql' }]
		}
	],

	[
		{
			line: '$.99',
			tokens: [{ startIndex: 0, type: 'number.sql' }]
		}
	],

	[
		{
			line: '$99.',
			tokens: [{ startIndex: 0, type: 'number.sql' }]
		}
	],

	[
		{
			line: '$0.',
			tokens: [{ startIndex: 0, type: 'number.sql' }]
		}
	],

	[
		{
			line: '$.0',
			tokens: [{ startIndex: 0, type: 'number.sql' }]
		}
	],

	[
		{
			line: '.',
			tokens: [{ startIndex: 0, type: 'delimiter.sql' }]
		}
	],

	[
		{
			line: '123',
			tokens: [{ startIndex: 0, type: 'number.sql' }]
		}
	],

	[
		{
			line: '123.5678',
			tokens: [{ startIndex: 0, type: 'number.sql' }]
		}
	],

	[
		{
			line: '0.99',
			tokens: [{ startIndex: 0, type: 'number.sql' }]
		}
	],

	[
		{
			line: '.99',
			tokens: [{ startIndex: 0, type: 'number.sql' }]
		}
	],

	[
		{
			line: '99.',
			tokens: [{ startIndex: 0, type: 'number.sql' }]
		}
	],

	[
		{
			line: '0.',
			tokens: [{ startIndex: 0, type: 'number.sql' }]
		}
	],

	[
		{
			line: '.0',
			tokens: [{ startIndex: 0, type: 'number.sql' }]
		}
	],

	[
		{
			line: '1E-2',
			tokens: [{ startIndex: 0, type: 'number.sql' }]
		}
	],

	[
		{
			line: '1E+2',
			tokens: [{ startIndex: 0, type: 'number.sql' }]
		}
	],

	[
		{
			line: '1E2',
			tokens: [{ startIndex: 0, type: 'number.sql' }]
		}
	],

	[
		{
			line: '0.1E2',
			tokens: [{ startIndex: 0, type: 'number.sql' }]
		}
	],

	[
		{
			line: '1.E2',
			tokens: [{ startIndex: 0, type: 'number.sql' }]
		}
	],

	[
		{
			line: '.1E2',
			tokens: [{ startIndex: 0, type: 'number.sql' }]
		}
	],

	// Identifiers
	[
		{
			line: '_abc$01',
			tokens: [{ startIndex: 0, type: 'identifier.sql' }]
		}
	],

	[
		{
			line: '#abc$01',
			tokens: [{ startIndex: 0, type: 'identifier.sql' }]
		}
	],

	[
		{
			line: '##abc$01',
			tokens: [{ startIndex: 0, type: 'identifier.sql' }]
		}
	],

	[
		{
			line: '@abc$01',
			tokens: [{ startIndex: 0, type: 'identifier.sql' }]
		}
	],

	[
		{
			line: '@@abc$01',
			tokens: [{ startIndex: 0, type: 'identifier.sql' }]
		}
	],

	[
		{
			line: '$abc',
			tokens: [{ startIndex: 0, type: 'identifier.sql' }]
		}
	],

	[
		{
			line: '$nonexistent',
			tokens: [{ startIndex: 0, type: 'identifier.sql' }]
		}
	],

	[
		{
			line: '@@nonexistent',
			tokens: [{ startIndex: 0, type: 'identifier.sql' }]
		}
	],

	[
		{
			line: 'declare "abc 321";',
			tokens: [
				{ startIndex: 0, type: 'keyword.sql' },
				{ startIndex: 7, type: 'white.sql' },
				{ startIndex: 8, type: 'identifier.quote.sql' },
				{ startIndex: 9, type: 'identifier.sql' },
				{ startIndex: 16, type: 'identifier.quote.sql' },
				{ startIndex: 17, type: 'delimiter.sql' }
			]
		}
	],

	[
		{
			line: '"abc"" 321 "" xyz"',
			tokens: [
				{ startIndex: 0, type: 'identifier.quote.sql' },
				{ startIndex: 1, type: 'identifier.sql' },
				{ startIndex: 17, type: 'identifier.quote.sql' }
			]
		}
	],

	[
		{
			line: '"abc',
			tokens: [
				{ startIndex: 0, type: 'identifier.quote.sql' },
				{ startIndex: 1, type: 'identifier.sql' }
			]
		}
	],

	[
		{
			line: 'declare "abc 321";',
			tokens: [
				{ startIndex: 0, type: 'keyword.sql' },
				{ startIndex: 7, type: 'white.sql' },
				{ startIndex: 8, type: 'identifier.quote.sql' },
				{ startIndex: 9, type: 'identifier.sql' },
				{ startIndex: 16, type: 'identifier.quote.sql' },
				{ startIndex: 17, type: 'delimiter.sql' }
			]
		}
	],

	[
		{
			line: '"abc"" 321 "" xyz"',
			tokens: [
				{ startIndex: 0, type: 'identifier.quote.sql' },
				{ startIndex: 1, type: 'identifier.sql' },
				{ startIndex: 17, type: 'identifier.quote.sql' }
			]
		}
	],

	[
		{
			line: '"abc',
			tokens: [
				{ startIndex: 0, type: 'identifier.quote.sql' },
				{ startIndex: 1, type: 'identifier.sql' }
			]
		}
	],

	[
		{
			line: 'int',
			tokens: [{ startIndex: 0, type: 'keyword.sql' }]
		}
	],

	[
		{
			line: '"int"',
			tokens: [
				{ startIndex: 0, type: 'identifier.quote.sql' },
				{ startIndex: 1, type: 'identifier.sql' },
				{ startIndex: 4, type: 'identifier.quote.sql' }
			]
		}
	],

	// Strings
	[
		{
			line: "declare _x='a string';",
			tokens: [
				{ startIndex: 0, type: 'keyword.sql' },
				{ startIndex: 7, type: 'white.sql' },
				{ startIndex: 8, type: 'identifier.sql' },
				{ startIndex: 10, type: 'operator.sql' },
				{ startIndex: 11, type: 'string.sql' },
				{ startIndex: 21, type: 'delimiter.sql' }
			]
		}
	],

	[
		{
			line: "'a '' string with quotes'",
			tokens: [{ startIndex: 0, type: 'string.sql' }]
		}
	],

	[
		{
			line: "'a -- string with comment'",
			tokens: [{ startIndex: 0, type: 'string.sql' }]
		}
	],

	[
		{
			line: "'a endless string",
			tokens: [{ startIndex: 0, type: 'string.sql' }]
		}
	],

	// Operators
	[
		{
			line: 'x=x+1',
			tokens: [
				{ startIndex: 0, type: 'identifier.sql' },
				{ startIndex: 1, type: 'operator.sql' },
				{ startIndex: 2, type: 'identifier.sql' },
				{ startIndex: 3, type: 'operator.sql' },
				{ startIndex: 4, type: 'number.sql' }
			]
		}
	],

	[
		{
			line: '_x^=_x',
			tokens: [
				{ startIndex: 0, type: 'identifier.sql' },
				{ startIndex: 2, type: 'operator.sql' },
				{ startIndex: 4, type: 'identifier.sql' }
			]
		}
	],

	[
		{
			line: 'WHERE x IS NOT NULL',
			tokens: [
				{ startIndex: 0, type: 'keyword.sql' },
				{ startIndex: 5, type: 'white.sql' },
				{ startIndex: 6, type: 'identifier.sql' },
				{ startIndex: 7, type: 'white.sql' },
				{ startIndex: 8, type: 'operator.sql' },
				{ startIndex: 10, type: 'white.sql' },
				{ startIndex: 11, type: 'operator.sql' },
				{ startIndex: 14, type: 'white.sql' },
				{ startIndex: 15, type: 'operator.sql' }
			]
		}
	],

	[
		{
			line: 'SELECT * FROM sch.MyTable WHERE MyColumn IN (1,2)',
			tokens: [
				{ startIndex: 0, type: 'keyword.sql' },
				{ startIndex: 6, type: 'white.sql' },
				{ startIndex: 7, type: 'operator.sql' },
				{ startIndex: 8, type: 'white.sql' },
				{ startIndex: 9, type: 'keyword.sql' },
				{ startIndex: 13, type: 'white.sql' },
				{ startIndex: 14, type: 'identifier.sql' },
				{ startIndex: 17, type: 'delimiter.sql' },
				{ startIndex: 18, type: 'identifier.sql' },
				{ startIndex: 25, type: 'white.sql' },
				{ startIndex: 26, type: 'keyword.sql' },
				{ startIndex: 31, type: 'white.sql' },
				{ startIndex: 32, type: 'identifier.sql' },
				{ startIndex: 40, type: 'white.sql' },
				{ startIndex: 41, type: 'operator.sql' },
				{ startIndex: 43, type: 'white.sql' },
				{ startIndex: 44, type: 'delimiter.parenthesis.sql' },
				{ startIndex: 45, type: 'number.sql' },
				{ startIndex: 46, type: 'delimiter.sql' },
				{ startIndex: 47, type: 'number.sql' },
				{ startIndex: 48, type: 'delimiter.parenthesis.sql' }
			]
		}
	]
]);
