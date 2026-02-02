/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('ocaml', [
	// Comment
	[
		{
			line: '(** documentation *)',
			tokens: [
				{ startIndex: 0, type: 'comment.ocaml' },
			]
		}
	],
	[
		{
			line: ' (* comment (* nested comment *) *) ',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'comment.ocaml' },
				{ startIndex: 35, type: '' }
			]
		}
	],
	[
		{
			line: ' (* comment (* nested comment *)',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'comment.ocaml' }
			]
		},
		{
			line: 'multiline comment',
			tokens: [
				{ startIndex: 0, type: 'comment.ocaml' }
			]
		},
		{
			line: ' *)',
			tokens: [
				{ startIndex: 0, type: 'comment.ocaml' }
			]
		},
	],
	// Integer
	[
		{
			line: '37',
			tokens: [
				{ startIndex: 0, type: 'number.ocaml' },
			]
		}
	],
	[
		{
			line: '1_000_000',
			tokens: [
				{ startIndex: 0, type: 'number.ocaml' },
			]
		}
	],
	[
		{
			line: '0x00A9',
			tokens: [
				{ startIndex: 0, type: 'number.hex.ocaml' },
			]
		}
	],
	[
		{
			line: '0L',
			tokens: [
				{ startIndex: 0, type: 'number.ocaml' },
			]
		}
	],
	[
		{
			line: '3.141_592_653_589_793_12',
			tokens: [
				{ startIndex: 0, type: 'number.float.ocaml' },
			]
		}
	],
	[
		{
			line: '-1e-5',
			tokens: [
				{ startIndex: 0, type: 'number.float.ocaml' },
			]
		}
	],
	[
		{
			line: '0x1p-52',
			tokens: [
				{ startIndex: 0, type: 'number.float.ocaml' },
			]
		}
	],
	// Character
	[
		{
			line: '\'a\'',
			tokens: [
				{ startIndex: 0, type: 'string.ocaml' },
			]
		}
	],
	[
		{
			line: '\'\\\'\'',
			tokens: [
				{ startIndex: 0, type: 'string.ocaml' },
				{ startIndex: 1, type: 'string.escape.ocaml' },
				{ startIndex: 3, type: 'string.ocaml' },
			]
		}
	],
	[
		{
			line: '\'\\xA9\'',
			tokens: [
				{ startIndex: 0, type: 'string.ocaml' },
				{ startIndex: 1, type: 'string.escape.ocaml' },
				{ startIndex: 5, type: 'string.ocaml' },
			]
		}
	],
	// String
	[
		{
			line: '"Hello, World!\\n"',
			tokens: [
				{ startIndex: 0, type: 'string.ocaml' },
				{ startIndex: 14, type: 'string.escape.ocaml' },
				{ startIndex: 16, type: 'string.ocaml' },
			]
		}
	],
	[
		{
			line: '"\\u{207A}"',
			tokens: [
				{ startIndex: 0, type: 'string.ocaml' },
				{ startIndex: 1, type: 'string.escape.ocaml' },
				{ startIndex: 9, type: 'string.ocaml' },
			]
		}
	],
	[
		{
			line: 'let a = "This is a string"',
			tokens: [
				{ startIndex: 0, type: 'keyword.ocaml' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.ocaml' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'operator.ocaml' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'string.ocaml' },
			]
		}
	],
]);
