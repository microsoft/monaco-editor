/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('msdax', [
	// Comments
	[
		{
			line: '// a comment',
			tokens: [{ startIndex: 0, type: 'comment.msdax' }]
		}
	],

	[
		{
			line: '-almost a comment',
			tokens: [
				{ startIndex: 0, type: 'operator.msdax' },
				{ startIndex: 1, type: 'identifier.msdax' },
				{ startIndex: 7, type: 'white.msdax' },
				{ startIndex: 8, type: 'identifier.msdax' },
				{ startIndex: 9, type: 'white.msdax' },
				{ startIndex: 10, type: 'identifier.msdax' }
			]
		}
	],

	[
		{
			line: '/* a full line comment */',
			tokens: [
				{ startIndex: 0, type: 'comment.quote.msdax' },
				{ startIndex: 2, type: 'comment.msdax' },
				{ startIndex: 23, type: 'comment.quote.msdax' }
			]
		}
	],

	[
		{
			line: '/* /// *** /// */',
			tokens: [
				{ startIndex: 0, type: 'comment.quote.msdax' },
				{ startIndex: 2, type: 'comment.msdax' },
				{ startIndex: 15, type: 'comment.quote.msdax' }
			]
		}
	],

	[
		{
			line: 'define measure x = /* a simple comment */ 1;',
			tokens: [
				{ startIndex: 0, type: 'keyword.msdax' },
				{ startIndex: 6, type: 'white.msdax' },
				{ startIndex: 7, type: 'keyword.msdax' },
				{ startIndex: 14, type: 'white.msdax' },
				{ startIndex: 15, type: 'identifier.msdax' },
				{ startIndex: 16, type: 'white.msdax' },
				{ startIndex: 17, type: 'operator.msdax' },
				{ startIndex: 18, type: 'white.msdax' },
				{ startIndex: 19, type: 'comment.quote.msdax' },
				{ startIndex: 21, type: 'comment.msdax' },
				{ startIndex: 39, type: 'comment.quote.msdax' },
				{ startIndex: 41, type: 'white.msdax' },
				{ startIndex: 42, type: 'number.msdax' },
				{ startIndex: 43, type: 'delimiter.msdax' }
			]
		}
	],

	// Numbers
	[
		{
			line: '123',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '-123',
			tokens: [
				{ startIndex: 0, type: 'operator.msdax' },
				{ startIndex: 1, type: 'number.msdax' }
			]
		}
	],

	[
		{
			line: '0xaBc123',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '0XaBc123',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '0x',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '0x0',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '0xAB_CD',
			tokens: [
				{ startIndex: 0, type: 'number.msdax' },
				{ startIndex: 4, type: 'identifier.msdax' }
			]
		}
	],

	[
		{
			line: '.',
			tokens: [{ startIndex: 0, type: 'delimiter.msdax' }]
		}
	],

	[
		{
			line: '123',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '123.5678',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '0.99',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '.99',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '99.',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '0.',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '.0',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '1E-2',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '1E+2',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '1E2',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '0.1E2',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '1.E2',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '.1E2',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	// Identifiers
	[
		{
			line: '_abc01',
			tokens: [{ startIndex: 0, type: 'identifier.msdax' }]
		}
	],

	[
		{
			line: 'abc01',
			tokens: [{ startIndex: 0, type: 'identifier.msdax' }]
		}
	],

	[
		{
			line: 'evaluate filter',
			tokens: [
				{ startIndex: 0, type: 'keyword.msdax' },
				{ startIndex: 8, type: 'white.msdax' },
				{ startIndex: 9, type: 'keyword.msdax' }
			]
		}
	],

	[
		{
			line: '[abc[[ 321 ]] xyz]',
			tokens: [
				{ startIndex: 0, type: 'identifier.quote.msdax' },
				{ startIndex: 1, type: 'identifier.msdax' },
				{ startIndex: 17, type: 'identifier.quote.msdax' }
			]
		}
	],

	[
		{
			line: '[abc',
			tokens: [
				{ startIndex: 0, type: 'identifier.quote.msdax' },
				{ startIndex: 1, type: 'identifier.msdax' }
			]
		}
	],

	[
		{
			line: "define measure 'abc'[def]",
			tokens: [
				{ startIndex: 0, type: 'keyword.msdax' },
				{ startIndex: 6, type: 'white.msdax' },
				{ startIndex: 7, type: 'keyword.msdax' },
				{ startIndex: 14, type: 'white.msdax' },
				{ startIndex: 15, type: 'identifier.quote.msdax' },
				{ startIndex: 16, type: 'identifier.msdax' },
				{ startIndex: 19, type: 'identifier.quote.msdax' },
				{ startIndex: 21, type: 'identifier.msdax' },
				{ startIndex: 24, type: 'identifier.quote.msdax' }
			]
		}
	],

	[
		{
			line: 'int',
			tokens: [{ startIndex: 0, type: 'keyword.msdax' }]
		}
	],

	[
		{
			line: '[int]',
			tokens: [
				{ startIndex: 0, type: 'identifier.quote.msdax' },
				{ startIndex: 1, type: 'identifier.msdax' },
				{ startIndex: 4, type: 'identifier.quote.msdax' }
			]
		}
	],

	// Strings
	[
		{
			line: '"abc"" 321 "" xyz"',
			tokens: [{ startIndex: 0, type: 'string.msdax' }]
		}
	],

	[
		{
			line: 'define var x="a string"',
			tokens: [
				{ startIndex: 0, type: 'keyword.msdax' },
				{ startIndex: 6, type: 'white.msdax' },
				{ startIndex: 7, type: 'keyword.msdax' },
				{ startIndex: 10, type: 'white.msdax' },
				{ startIndex: 11, type: 'identifier.msdax' },
				{ startIndex: 12, type: 'operator.msdax' },
				{ startIndex: 13, type: 'string.msdax' }
			]
		}
	],

	[
		{
			line: '"a "" string with quotes"',
			tokens: [{ startIndex: 0, type: 'string.msdax' }]
		}
	],

	[
		{
			line: '"a // string with comment"',
			tokens: [{ startIndex: 0, type: 'string.msdax' }]
		}
	],

	[
		{
			line: 'N"a unicode string"',
			tokens: [{ startIndex: 0, type: 'string.msdax' }]
		}
	],

	[
		{
			line: '"a endless string',
			tokens: [{ startIndex: 0, type: 'string.msdax' }]
		}
	],

	// Operators
	[
		{
			line: 'define var x=1+3',
			tokens: [
				{ startIndex: 0, type: 'keyword.msdax' },
				{ startIndex: 6, type: 'white.msdax' },
				{ startIndex: 7, type: 'keyword.msdax' },
				{ startIndex: 10, type: 'white.msdax' },
				{ startIndex: 11, type: 'identifier.msdax' },
				{ startIndex: 12, type: 'operator.msdax' },
				{ startIndex: 13, type: 'number.msdax' },
				{ startIndex: 14, type: 'operator.msdax' },
				{ startIndex: 15, type: 'number.msdax' }
			]
		}
	],

	[
		{
			line: 'define var x=1^+abc',
			tokens: [
				{ startIndex: 0, type: 'keyword.msdax' },
				{ startIndex: 6, type: 'white.msdax' },
				{ startIndex: 7, type: 'keyword.msdax' },
				{ startIndex: 10, type: 'white.msdax' },
				{ startIndex: 11, type: 'identifier.msdax' },
				{ startIndex: 12, type: 'operator.msdax' },
				{ startIndex: 13, type: 'number.msdax' },
				{ startIndex: 14, type: 'operator.msdax' },
				{ startIndex: 16, type: 'identifier.msdax' }
			]
		}
	],

	// Realistic queries and expressions
	[
		{
			line: "EVALUATE 'Products' ORDER BY [Product Id] DESC",
			tokens: [
				{ startIndex: 0, type: 'keyword.msdax' },
				{ startIndex: 8, type: 'white.msdax' },
				{ startIndex: 9, type: 'identifier.quote.msdax' },
				{ startIndex: 10, type: 'identifier.msdax' },
				{ startIndex: 18, type: 'identifier.quote.msdax' },
				{ startIndex: 19, type: 'white.msdax' },
				{ startIndex: 20, type: 'keyword.msdax' },
				{ startIndex: 25, type: 'white.msdax' },
				{ startIndex: 26, type: 'keyword.msdax' },
				{ startIndex: 28, type: 'white.msdax' },
				{ startIndex: 29, type: 'identifier.quote.msdax' },
				{ startIndex: 30, type: 'identifier.msdax' },
				{ startIndex: 40, type: 'identifier.quote.msdax' },
				{ startIndex: 41, type: 'white.msdax' },
				{ startIndex: 42, type: 'keyword.msdax' }
			]
		}
	],

	[
		{
			line: 'DATATABLE("Price", STRING, {{"Low"},{"Medium"}})',
			tokens: [
				{ startIndex: 0, type: 'keyword.msdax' },
				{ startIndex: 9, type: 'delimiter.parenthesis.msdax' },
				{ startIndex: 10, type: 'string.msdax' },
				{ startIndex: 17, type: 'delimiter.msdax' },
				{ startIndex: 18, type: 'white.msdax' },
				{ startIndex: 19, type: 'keyword.msdax' },
				{ startIndex: 25, type: 'delimiter.msdax' },
				{ startIndex: 26, type: 'white.msdax' },
				{ startIndex: 27, type: 'delimiter.brackets.msdax' },
				{ startIndex: 29, type: 'string.msdax' },
				{ startIndex: 34, type: 'delimiter.brackets.msdax' },
				{ startIndex: 35, type: 'delimiter.msdax' },
				{ startIndex: 36, type: 'delimiter.brackets.msdax' },
				{ startIndex: 37, type: 'string.msdax' },
				{ startIndex: 45, type: 'delimiter.brackets.msdax' },
				{ startIndex: 47, type: 'delimiter.parenthesis.msdax' }
			]
		}
	]
]);
