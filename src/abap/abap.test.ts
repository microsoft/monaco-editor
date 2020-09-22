/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('abap', [
	[
		{
			line: '* comment',
			tokens: [{ startIndex: 0, type: 'comment.abap' }]
		}
	],
	[
		{
			line: ' " comment',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'comment.abap' }
			]
		}
	],
	[
		{
			line: 'write hello.',
			tokens: [
				{ startIndex: 0, type: 'keyword.abap' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'identifier.abap' },
				{ startIndex: 11, type: 'delimiter.abap' }
			]
		}
	],
	[
		{
			line: 'IF 2 = 3.',
			tokens: [
				{ startIndex: 0, type: 'keyword.abap' },
				{ startIndex: 2, type: '' },
				{ startIndex: 3, type: 'number.abap' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'operator.abap' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'number.abap' },
				{ startIndex: 8, type: 'delimiter.abap' }
			]
		}
	],
	[
		{
			line: "'hello'",
			tokens: [{ startIndex: 0, type: 'string.abap' }]
		}
	],
	[
		{
			line: '|hello|',
			tokens: [{ startIndex: 0, type: 'string.abap' }]
		}
	],
	[
		{
			line: 'write: hello, world.',
			tokens: [
				{ startIndex: 0, type: 'keyword.abap' },
				{ startIndex: 5, type: 'delimiter.abap' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'identifier.abap' },
				{ startIndex: 12, type: 'delimiter.abap' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'identifier.abap' },
				{ startIndex: 19, type: 'delimiter.abap' }
			]
		}
	],
	[
		{
			line: 'method_call( param ).',
			tokens: [
				{ startIndex: 0, type: 'identifier.abap' },
				{ startIndex: 11, type: 'delimiter.parenthesis.abap' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'identifier.abap' },
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'delimiter.parenthesis.abap' },
				{ startIndex: 20, type: 'delimiter.abap' }
			]
		}
	],
	[
		{
			line: "'he'' llo'",
			tokens: [{ startIndex: 0, type: 'string.abap' }]
		}
	],
	[
		{
			line: '|hel\\|lo|',
			tokens: [{ startIndex: 0, type: 'string.abap' }]
		}
	],
	[
		{
			line: 'FIELD-SYMBOLS <foo>.',
			tokens: [
				{ startIndex: 0, type: 'keyword.abap' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'identifier.abap' },
				{ startIndex: 19, type: 'delimiter.abap' }
			]
		}
	],
	[
		{
			line: 'IF foo IS NOT INITIAL.',
			tokens: [
				{ startIndex: 0, type: 'keyword.abap' },
				{ startIndex: 2, type: '' },
				{ startIndex: 3, type: 'identifier.abap' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'keyword.abap' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'operator.abap' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'keyword.abap' },
				{ startIndex: 21, type: 'delimiter.abap' }
			]
		}
	],
	[
		{
			line: 'WRITE `moo`.',
			tokens: [
				{ startIndex: 0, type: 'keyword.abap' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'string.abap' },
				{ startIndex: 11, type: 'delimiter.abap' }
			]
		}
	],
	[
		{
			line: 'FORM foo.',
			tokens: [
				{ startIndex: 0, type: 'keyword.abap' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'identifier.abap' },
				{ startIndex: 8, type: 'delimiter.abap' }
			]
		}
	],
	[
		{
			line: 'moo = CONV #( 1 ).',
			tokens: [
				{ startIndex: 0, type: 'identifier.abap' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'operator.abap' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'keyword.abap' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'operator.abap' },
				{ startIndex: 12, type: 'delimiter.parenthesis.abap' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'number.abap' },
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'delimiter.parenthesis.abap' },
				{ startIndex: 17, type: 'delimiter.abap' }
			]
		}
	],
	[
		{
			line: 'WRITE foo ##pragma.',
			tokens: [
				{ startIndex: 0, type: 'keyword.abap' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'identifier.abap' },
				{ startIndex: 9, type: '' },
				{ startIndex: 12, type: 'identifier.abap' },
				{ startIndex: 18, type: 'delimiter.abap' }
			]
		}
	],
	[
		{
			line: 'SELECT * FROM foo02 INTO @foo.',
			tokens: [
				{ startIndex: 0, type: 'keyword.abap' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'operator.abap' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'keyword.abap' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'identifier.abap' },
				{ startIndex: 19, type: '' },
				{ startIndex: 20, type: 'keyword.abap' },
				{ startIndex: 24, type: '' },
				{ startIndex: 25, type: 'operator.abap' },
				{ startIndex: 26, type: 'identifier.abap' },
				{ startIndex: 29, type: 'delimiter.abap' }
			]
		}
	]
]);
