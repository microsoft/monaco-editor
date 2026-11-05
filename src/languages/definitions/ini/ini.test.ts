/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('ini', [
	// top-level comments
	[
		{
			line: '; comment',
			tokens: [{ startIndex: 0, type: 'comment.ini' }]
		}
	],
	[
		{
			line: '# comment',
			tokens: [{ startIndex: 0, type: 'comment.ini' }]
		}
	],
	// indented comments
	[
		{
			line: '    ; indented comment',
			tokens: [{ startIndex: 0, type: 'comment.ini' }]
		}
	],
	[
		{
			line: '\t# indented comment',
			tokens: [{ startIndex: 0, type: 'comment.ini' }]
		}
	],
	// sections
	[
		{
			line: '[section]',
			tokens: [{ startIndex: 0, type: 'metatag.ini' }]
		}
	],
	// keys
	[
		{
			line: 'key = value',
			tokens: [
				{ startIndex: 0, type: 'key.ini' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'delimiter.ini' },
				{ startIndex: 5, type: '' }
			]
		}
	],
	[
		{
			line: '    indented-key = value',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 13, type: 'key.ini' },
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'delimiter.ini' },
				{ startIndex: 18, type: '' }
			]
		}
	],
	// a comment character that is not at the beginning of a line is not a comment
	[
		{
			line: 'color = #ff0000',
			tokens: [
				{ startIndex: 0, type: 'key.ini' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.ini' },
				{ startIndex: 7, type: '' },
				{ startIndex: 11, type: 'number.ini' }
			]
		}
	],
	[
		{
			line: 'key = value ; trailing',
			tokens: [
				{ startIndex: 0, type: 'key.ini' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'delimiter.ini' },
				{ startIndex: 5, type: '' }
			]
		}
	],
	// strings
	[
		{
			line: 'key = "value 1"',
			tokens: [
				{ startIndex: 0, type: 'key.ini' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'delimiter.ini' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'string.ini' }
			]
		}
	],
	// indented comments and keys in a section
	[
		{
			line: '[Section]',
			tokens: [{ startIndex: 0, type: 'metatag.ini' }]
		},
		{
			line: '    ; Long comment explaining why',
			tokens: [{ startIndex: 0, type: 'comment.ini' }]
		},
		{
			line: '    key = value',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'key.ini' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'delimiter.ini' },
				{ startIndex: 9, type: '' }
			]
		}
	]
]);
