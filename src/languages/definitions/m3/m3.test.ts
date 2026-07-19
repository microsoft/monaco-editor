/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('m3', [
	[
		{
			line: '(**)',
			tokens: [{ startIndex: 0, type: 'comment.m3' }]
		}
	],

	[
		{
			line: '    (* a comment *)',
			tokens: [
				{ startIndex: 0, type: 'white.m3' },
				{ startIndex: 4, type: 'comment.m3' }
			]
		}
	],

	[
		{
			line: '(* Lorem ipsum dolor sit amet, consectetur ',
			tokens: [{ startIndex: 0, type: 'comment.m3' }]
		},
		{
			line: '   adipiscing elit, sed do eiusmod tempor',
			tokens: [{ startIndex: 0, type: 'comment.m3' }]
		},
		{
			line: '  incididunt ut labore et dolore magna aliqua. *)',
			tokens: [{ startIndex: 0, type: 'comment.m3' }]
		}
	],

	[
		{
			line: '(* Lorem ipsum dolor sit amet (*, consectetur ',
			tokens: [{ startIndex: 0, type: 'comment.m3' }]
		},
		{
			line: '   adipiscing elit, sed do eiusmod tempor',
			tokens: [{ startIndex: 0, type: 'comment.m3' }]
		},
		{
			line: '  incididunt*) ut labore et dolore magna aliqua. *)',
			tokens: [{ startIndex: 0, type: 'comment.m3' }]
		}
	],

	[
		{
			line: 'MODULE Test EXPORTS Main; FROM IO IMPORT Put; BEGIN Put("test\\n") END Test.',
			tokens: [
				{ startIndex: 0, type: 'keyword.MODULE.m3' },
				{ startIndex: 6, type: 'white.m3' },
				{ startIndex: 7, type: 'identifier.m3' },
				{ startIndex: 11, type: 'white.m3' },
				{ startIndex: 12, type: 'keyword.EXPORTS.m3' },
				{ startIndex: 19, type: 'white.m3' },
				{ startIndex: 20, type: 'identifier.m3' },
				{ startIndex: 24, type: 'delimiter.m3' },
				{ startIndex: 25, type: 'white.m3' },

				{ startIndex: 26, type: 'keyword.FROM.m3' },
				{ startIndex: 30, type: 'white.m3' },
				{ startIndex: 31, type: 'identifier.m3' },
				{ startIndex: 33, type: 'white.m3' },
				{ startIndex: 34, type: 'keyword.IMPORT.m3' },
				{ startIndex: 40, type: 'white.m3' },
				{ startIndex: 41, type: 'identifier.m3' },
				{ startIndex: 44, type: 'delimiter.m3' },
				{ startIndex: 45, type: 'white.m3' },

				{ startIndex: 46, type: 'keyword.BEGIN.m3' },
				{ startIndex: 51, type: 'white.m3' },
				{ startIndex: 52, type: 'identifier.m3' },
				{ startIndex: 55, type: 'delimiter.parenthesis.m3' },
				{ startIndex: 56, type: 'string.text.m3' },
				{ startIndex: 61, type: 'string.escape.m3' },
				{ startIndex: 63, type: 'string.text.m3' },
				{ startIndex: 64, type: 'delimiter.parenthesis.m3' },
				{ startIndex: 65, type: 'white.m3' },

				{ startIndex: 66, type: 'keyword.END.m3' },
				{ startIndex: 69, type: 'white.m3' },
				{ startIndex: 70, type: 'identifier.m3' },
				{ startIndex: 74, type: 'operators.m3' }
			]
		}
	],

	[
		{
			line: '0',
			tokens: [{ startIndex: 0, type: 'number.m3' }]
		}
	],
	[
		{
			line: '-16_B33f',
			tokens: [
				{ startIndex: 0, type: 'operators.m3' },
				{ startIndex: 1, type: 'number.m3' }
			]
		}
	],
	[
		{
			line: '2.0D-5',
			tokens: [{ startIndex: 0, type: 'number.float.m3' }]
		}
	]
]);
