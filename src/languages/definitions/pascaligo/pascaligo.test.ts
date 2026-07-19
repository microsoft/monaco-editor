/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('pascaligo', [
	// Comments - single line
	[
		{
			line: '//',
			tokens: [{ startIndex: 0, type: 'comment.pascaligo' }]
		}
	],

	[
		{
			line: '    // a comment',
			tokens: [
				{ startIndex: 0, type: 'white.pascaligo' },
				{ startIndex: 4, type: 'comment.pascaligo' }
			]
		}
	],

	[
		{
			line: '// a comment',
			tokens: [{ startIndex: 0, type: 'comment.pascaligo' }]
		}
	],

	[
		{
			line: '//sticky comment',
			tokens: [{ startIndex: 0, type: 'comment.pascaligo' }]
		}
	],

	// Comments - multi line (single line)
	[
		{
			line: '(**)',
			tokens: [{ startIndex: 0, type: 'comment.pascaligo' }]
		}
	],

	[
		{
			line: '    (* a comment *)',
			tokens: [
				{ startIndex: 0, type: 'white.pascaligo' },
				{ startIndex: 4, type: 'comment.pascaligo' }
			]
		}
	],

	[
		{
			line: '(* a comment *)',
			tokens: [{ startIndex: 0, type: 'comment.pascaligo' }]
		}
	],

	[
		{
			line: '(*sticky comment*)',
			tokens: [{ startIndex: 0, type: 'comment.pascaligo' }]
		}
	],

	// Comments - multi line (multi line)
	[
		{
			line: '(* start of multiline comment ',
			tokens: [{ startIndex: 0, type: 'comment.pascaligo' }]
		},
		{
			line: 'a comment between curly',
			tokens: [{ startIndex: 0, type: 'comment.pascaligo' }]
		},
		{
			line: 'end of multiline comment*)',
			tokens: [{ startIndex: 0, type: 'comment.pascaligo' }]
		}
	],

	// Keywords
	[
		{
			line: 'function add (const a',
			tokens: [
				{ startIndex: 0, type: 'keyword.function.pascaligo' },
				{ startIndex: 8, type: 'white.pascaligo' },
				{ startIndex: 9, type: 'identifier.pascaligo' },
				{ startIndex: 12, type: 'white.pascaligo' },
				{ startIndex: 13, type: 'delimiter.parenthesis.pascaligo' },
				{ startIndex: 14, type: 'keyword.const.pascaligo' },
				{ startIndex: 19, type: 'white.pascaligo' },
				{ startIndex: 20, type: 'identifier.pascaligo' }
			]
		}
	],

	// Numbers
	[
		{
			line: '0',
			tokens: [{ startIndex: 0, type: 'number.pascaligo' }]
		}
	],
	[
		{
			line: '0;',
			tokens: [
				{ startIndex: 0, type: 'number.pascaligo' },
				{ startIndex: 1, type: 'delimiter.pascaligo' }
			]
		}
	],
	[
		{
			line: '2.4',
			tokens: [{ startIndex: 0, type: 'number.float.pascaligo' }]
		}
	],
	[
		{
			line: '2.4;',
			tokens: [
				{ startIndex: 0, type: 'number.float.pascaligo' },
				{ startIndex: 3, type: 'delimiter.pascaligo' }
			]
		}
	],
	[
		{
			line: '$123FF',
			tokens: [{ startIndex: 0, type: 'number.hex.pascaligo' }]
		}
	]
]);
