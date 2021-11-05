/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('scheme', [
	// Keywords
	[
		{
			line: 'define-macro some',
			tokens: [
				{ startIndex: 0, type: 'keyword.scheme' },
				{ startIndex: 12, type: 'white.scheme' },
				{ startIndex: 13, type: 'variable.scheme' }
			]
		}
	],

	// comments
	[
		{
			line: '; comment',
			tokens: [{ startIndex: 0, type: 'comment.scheme' }]
		}
	],
	[
		{
			line: '#| comment',
			tokens: [{ startIndex: 0, type: 'comment.scheme' }]
		},
		{
			line: 'multiline',
			tokens: [{ startIndex: 0, type: 'comment.scheme' }]
		},
		{
			line: '|# cons',
			tokens: [
				{ startIndex: 0, type: 'comment.scheme' },
				{ startIndex: 2, type: 'white.scheme' },
				{ startIndex: 3, type: 'keyword.scheme' }
			]
		}
	],

	// strings
	[
		{
			line: '"\\n string "',
			tokens: [
				{ startIndex: 0, type: 'string.scheme' },
				{ startIndex: 1, type: 'string.escape.scheme' },
				{ startIndex: 3, type: 'string.scheme' }
			]
		}
	],
	[
		{
			line: '" string \\',
			tokens: [{ startIndex: 0, type: 'string.scheme' }]
		},
		{
			line: 'multiline',
			tokens: [{ startIndex: 0, type: 'string.scheme' }]
		},
		{
			line: ' ',
			tokens: [
				// previous line needs to be terminated with \
				{ startIndex: 0, type: 'white.scheme' }
			]
		}
	],

	// numbers
	[
		{
			line: '1e2',
			tokens: [{ startIndex: 0, type: 'number.float.scheme' }]
		}
	],
	[
		{
			line: '#x03BB',
			tokens: [{ startIndex: 0, type: 'number.hex.scheme' }]
		}
	]
]);
