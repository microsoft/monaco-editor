/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('cameligo', [
	// Comments - single line
	[
		{
			line: '//',
			tokens: [{ startIndex: 0, type: 'comment.cameligo' }]
		}
	],

	[
		{
			line: '    // a comment',
			tokens: [
				{ startIndex: 0, type: 'white.cameligo' },
				{ startIndex: 4, type: 'comment.cameligo' }
			]
		}
	],

	[
		{
			line: '// a comment',
			tokens: [{ startIndex: 0, type: 'comment.cameligo' }]
		}
	],

	[
		{
			line: '//sticky comment',
			tokens: [{ startIndex: 0, type: 'comment.cameligo' }]
		}
	],

	// Comments - multi line (single line)
	[
		{
			line: '(**)',
			tokens: [{ startIndex: 0, type: 'comment.cameligo' }]
		}
	],

	[
		{
			line: '    (* a comment *)',
			tokens: [
				{ startIndex: 0, type: 'white.cameligo' },
				{ startIndex: 4, type: 'comment.cameligo' }
			]
		}
	],

	[
		{
			line: '(* a comment *)',
			tokens: [{ startIndex: 0, type: 'comment.cameligo' }]
		}
	],

	[
		{
			line: '(*sticky comment*)',
			tokens: [{ startIndex: 0, type: 'comment.cameligo' }]
		}
	],

	// Comments - multi line (multi line)
	[
		{
			line: '(* start of multiline comment ',
			tokens: [{ startIndex: 0, type: 'comment.cameligo' }]
		},
		{
			line: 'a comment between curly',
			tokens: [{ startIndex: 0, type: 'comment.cameligo' }]
		},
		{
			line: 'end of multiline comment*)',
			tokens: [{ startIndex: 0, type: 'comment.cameligo' }]
		}
	],

	// Keywords
	[
		{
			line: 'let check if Current.amount',
			tokens: [
				{ startIndex: 0, type: 'keyword.let.cameligo' },
				{ startIndex: 3, type: 'white.cameligo' },
				{ startIndex: 4, type: 'identifier.cameligo' },
				{ startIndex: 9, type: 'white.cameligo' },
				{ startIndex: 10, type: 'keyword.if.cameligo' },
				{ startIndex: 12, type: 'white.cameligo' },
				{ startIndex: 13, type: 'keyword.current.cameligo' },
				{ startIndex: 20, type: 'delimiter.cameligo' },
				{ startIndex: 21, type: 'identifier.cameligo' }
			]
		}
	],

	// Numbers
	[
		{
			line: '0',
			tokens: [{ startIndex: 0, type: 'number.cameligo' }]
		}
	],
	[
		{
			line: '0;',
			tokens: [
				{ startIndex: 0, type: 'number.cameligo' },
				{ startIndex: 1, type: 'delimiter.cameligo' }
			]
		}
	],
	[
		{
			line: '2.4',
			tokens: [{ startIndex: 0, type: 'number.float.cameligo' }]
		}
	],
	[
		{
			line: '2.4;',
			tokens: [
				{ startIndex: 0, type: 'number.float.cameligo' },
				{ startIndex: 3, type: 'delimiter.cameligo' }
			]
		}
	],
	[
		{
			line: '$123FF',
			tokens: [{ startIndex: 0, type: 'number.hex.cameligo' }]
		}
	]
]);
