/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('cairo', [
	// Comments
	[
		{
			line: '#',
			tokens: [{ startIndex: 0, type: 'comment.cairo' }]
		}
	],

	[
		{
			line: '    # a comment',
			tokens: [
				{ startIndex: 0, type: 'white.cairo' },
				{ startIndex: 4, type: 'comment.cairo' }
			]
		}
	],

	[
		{
			line: '# a comment',
			tokens: [{ startIndex: 0, type: 'comment.cairo' }]
		}
	],

	[
		{
			line: '#sticky comment',
			tokens: [{ startIndex: 0, type: 'comment.cairo' }]
		}
	],

	[
		{
			line: '1 / 2 # comment',
			tokens: [
				{ startIndex: 0, type: 'number.cairo' },
				{ startIndex: 1, type: 'white.cairo' },
				{ startIndex: 2, type: 'delimiter.cairo' },
				{ startIndex: 3, type: 'white.cairo' },
				{ startIndex: 4, type: 'number.cairo' },
				{ startIndex: 5, type: 'white.cairo' },
				{ startIndex: 6, type: 'comment.cairo' }
			]
		}
	],

	// Keywords
	[
		{
			line: 'func increase_balance{',
			tokens: [
				{ startIndex: 0, type: 'keyword.func.cairo' },
				{ startIndex: 4, type: 'white.cairo' },
				{ startIndex: 5, type: 'identifier.cairo' },
				{ startIndex: 21, type: 'delimiter.curly.cairo' }
			]
		}
	],

	// Numbers
	[
		{
			line: '42',
			tokens: [{ startIndex: 0, type: 'number.cairo' }]
		}
	],

	[
		{
			line: '0x2A',
			tokens: [{ startIndex: 0, type: 'number.hex.cairo' }]
		}
	],

	// Directives
	[
		{
			line: '%builtins output',
			tokens: [
				{ startIndex: 0, type: 'tag.cairo' },
				{ startIndex: 9, type: 'white.cairo' },
				{ startIndex: 10, type: 'identifier.cairo' }
			]
		}
	]
]);
