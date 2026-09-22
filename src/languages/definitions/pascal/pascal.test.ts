/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('pascal', [
	// Comments - single line
	[
		{
			line: '//',
			tokens: [{ startIndex: 0, type: 'comment.pascal' }]
		}
	],

	[
		{
			line: '    // a comment',
			tokens: [
				{ startIndex: 0, type: 'white.pascal' },
				{ startIndex: 4, type: 'comment.pascal' }
			]
		}
	],

	[
		{
			line: '// a comment',
			tokens: [{ startIndex: 0, type: 'comment.pascal' }]
		}
	],

	[
		{
			line: '//sticky comment',
			tokens: [{ startIndex: 0, type: 'comment.pascal' }]
		}
	],

	// Comments - multi line (single line)
	[
		{
			line: '{}',
			tokens: [{ startIndex: 0, type: 'comment.pascal' }]
		}
	],

	[
		{
			line: '    { a comment }',
			tokens: [
				{ startIndex: 0, type: 'white.pascal' },
				{ startIndex: 4, type: 'comment.pascal' }
			]
		}
	],

	[
		{
			line: '{ a comment }',
			tokens: [{ startIndex: 0, type: 'comment.pascal' }]
		}
	],

	[
		{
			line: '{sticky comment}',
			tokens: [{ startIndex: 0, type: 'comment.pascal' }]
		}
	],

	// Comments - multi line (multi line)
	[
		{
			line: '{ start of multiline comment ',
			tokens: [{ startIndex: 0, type: 'comment.pascal' }]
		},
		{
			line: 'a comment between curly',
			tokens: [{ startIndex: 0, type: 'comment.pascal' }]
		},
		{
			line: 'end of multiline comment}',
			tokens: [{ startIndex: 0, type: 'comment.pascal' }]
		}
	],

	// Keywords
	[
		{
			line: "program Test; begin writeln('hello'); end.",
			tokens: [
				{ startIndex: 0, type: 'keyword.program.pascal' },
				{ startIndex: 7, type: 'white.pascal' },
				{ startIndex: 8, type: 'identifier.pascal' },
				{ startIndex: 12, type: 'delimiter.pascal' },
				{ startIndex: 13, type: 'white.pascal' },
				{ startIndex: 14, type: 'keyword.begin.pascal' },
				{ startIndex: 19, type: 'white.pascal' },
				{ startIndex: 20, type: 'identifier.pascal' },
				{ startIndex: 27, type: 'delimiter.parenthesis.pascal' },
				{ startIndex: 28, type: 'string.pascal' },
				{ startIndex: 34, type: 'string.quote.pascal' },
				{ startIndex: 35, type: 'delimiter.parenthesis.pascal' },
				{ startIndex: 36, type: 'delimiter.pascal' },
				{ startIndex: 37, type: 'white.pascal' },
				{ startIndex: 38, type: 'keyword.end.pascal' },
				{ startIndex: 41, type: 'delimiter.pascal' }
			]
		}
	],

	// Numbers
	[
		{
			line: '0',
			tokens: [{ startIndex: 0, type: 'number.pascal' }]
		}
	],
	[
		{
			line: '0;',
			tokens: [
				{ startIndex: 0, type: 'number.pascal' },
				{ startIndex: 1, type: 'delimiter.pascal' }
			]
		}
	],
	[
		{
			line: '2.4',
			tokens: [{ startIndex: 0, type: 'number.float.pascal' }]
		}
	],
	[
		{
			line: '2.4;',
			tokens: [
				{ startIndex: 0, type: 'number.float.pascal' },
				{ startIndex: 3, type: 'delimiter.pascal' }
			]
		}
	],
	[
		{
			line: '$123FF',
			tokens: [{ startIndex: 0, type: 'number.hex.pascal' }]
		}
	]
]);
