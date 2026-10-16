/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

// Fresh examples informed by the pinned upstream t-strings tests listed in AGENTS.md.
testTokenization('mojo', [
	// lexTString(): both quote styles and every prefix spelling; raw backslashes
	// remain literal immediately before an interpolation.
	[
		{
			line: 't"value {count}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 8, type: 'delimiter.curly.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 14, type: 'delimiter.curly.mojo' },
				{ startIndex: 15, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: "t'value {count}'",
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 8, type: 'delimiter.curly.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 14, type: 'delimiter.curly.mojo' },
				{ startIndex: 15, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: 'T"value {count}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 8, type: 'delimiter.curly.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 14, type: 'delimiter.curly.mojo' },
				{ startIndex: 15, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: "T'value {count}'",
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 8, type: 'delimiter.curly.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 14, type: 'delimiter.curly.mojo' },
				{ startIndex: 15, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: 'rt"folder\\{user}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 10, type: 'delimiter.curly.mojo' },
				{ startIndex: 11, type: 'identifier.mojo' },
				{ startIndex: 15, type: 'delimiter.curly.mojo' },
				{ startIndex: 16, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: "rt'folder\\{user}'",
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 10, type: 'delimiter.curly.mojo' },
				{ startIndex: 11, type: 'identifier.mojo' },
				{ startIndex: 15, type: 'delimiter.curly.mojo' },
				{ startIndex: 16, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: 'rT"folder\\{user}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 10, type: 'delimiter.curly.mojo' },
				{ startIndex: 11, type: 'identifier.mojo' },
				{ startIndex: 15, type: 'delimiter.curly.mojo' },
				{ startIndex: 16, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: "rT'folder\\{user}'",
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 10, type: 'delimiter.curly.mojo' },
				{ startIndex: 11, type: 'identifier.mojo' },
				{ startIndex: 15, type: 'delimiter.curly.mojo' },
				{ startIndex: 16, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: 'Rt"folder\\{user}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 10, type: 'delimiter.curly.mojo' },
				{ startIndex: 11, type: 'identifier.mojo' },
				{ startIndex: 15, type: 'delimiter.curly.mojo' },
				{ startIndex: 16, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: "Rt'folder\\{user}'",
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 10, type: 'delimiter.curly.mojo' },
				{ startIndex: 11, type: 'identifier.mojo' },
				{ startIndex: 15, type: 'delimiter.curly.mojo' },
				{ startIndex: 16, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: 'RT"folder\\{user}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 10, type: 'delimiter.curly.mojo' },
				{ startIndex: 11, type: 'identifier.mojo' },
				{ startIndex: 15, type: 'delimiter.curly.mojo' },
				{ startIndex: 16, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: "RT'folder\\{user}'",
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 10, type: 'delimiter.curly.mojo' },
				{ startIndex: 11, type: 'identifier.mojo' },
				{ startIndex: 15, type: 'delimiter.curly.mojo' },
				{ startIndex: 16, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: 'tr"folder\\{user}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 10, type: 'delimiter.curly.mojo' },
				{ startIndex: 11, type: 'identifier.mojo' },
				{ startIndex: 15, type: 'delimiter.curly.mojo' },
				{ startIndex: 16, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: "tr'folder\\{user}'",
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 10, type: 'delimiter.curly.mojo' },
				{ startIndex: 11, type: 'identifier.mojo' },
				{ startIndex: 15, type: 'delimiter.curly.mojo' },
				{ startIndex: 16, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: 'tR"folder\\{user}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 10, type: 'delimiter.curly.mojo' },
				{ startIndex: 11, type: 'identifier.mojo' },
				{ startIndex: 15, type: 'delimiter.curly.mojo' },
				{ startIndex: 16, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: "tR'folder\\{user}'",
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 10, type: 'delimiter.curly.mojo' },
				{ startIndex: 11, type: 'identifier.mojo' },
				{ startIndex: 15, type: 'delimiter.curly.mojo' },
				{ startIndex: 16, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: 'Tr"folder\\{user}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 10, type: 'delimiter.curly.mojo' },
				{ startIndex: 11, type: 'identifier.mojo' },
				{ startIndex: 15, type: 'delimiter.curly.mojo' },
				{ startIndex: 16, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: "Tr'folder\\{user}'",
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 10, type: 'delimiter.curly.mojo' },
				{ startIndex: 11, type: 'identifier.mojo' },
				{ startIndex: 15, type: 'delimiter.curly.mojo' },
				{ startIndex: 16, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: 'TR"folder\\{user}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 10, type: 'delimiter.curly.mojo' },
				{ startIndex: 11, type: 'identifier.mojo' },
				{ startIndex: 15, type: 'delimiter.curly.mojo' },
				{ startIndex: 16, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: "TR'folder\\{user}'",
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 10, type: 'delimiter.curly.mojo' },
				{ startIndex: 11, type: 'identifier.mojo' },
				{ startIndex: 15, type: 'delimiter.curly.mojo' },
				{ startIndex: 16, type: 'string.mojo' }
			]
		}
	],

	// basic.mojo: literal-only, empty, arithmetic, adjacent interpolations,
	// interpolation in an argument, and nested templates.
	[{ line: 't"plain # text"', tokens: [{ startIndex: 0, type: 'string.mojo' }] }],
	[{ line: "T''", tokens: [{ startIndex: 0, type: 'string.mojo' }] }],
	[
		{
			line: 't"{6 * 7}={True}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 2, type: 'delimiter.curly.mojo' },
				{ startIndex: 3, type: 'number.mojo' },
				{ startIndex: 4, type: 'white.mojo' },
				{ startIndex: 5, type: 'operator.mojo' },
				{ startIndex: 6, type: 'white.mojo' },
				{ startIndex: 7, type: 'number.mojo' },
				{ startIndex: 8, type: 'delimiter.curly.mojo' },
				{ startIndex: 9, type: 'string.mojo' },
				{ startIndex: 10, type: 'delimiter.curly.mojo' },
				{ startIndex: 11, type: 'keyword.mojo' },
				{ startIndex: 15, type: 'delimiter.curly.mojo' },
				{ startIndex: 16, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: 't"{a}{2}{False}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 2, type: 'delimiter.curly.mojo' },
				{ startIndex: 3, type: 'identifier.mojo' },
				{ startIndex: 4, type: 'delimiter.curly.mojo' },
				{ startIndex: 6, type: 'number.mojo' },
				{ startIndex: 7, type: 'delimiter.curly.mojo' },
				{ startIndex: 9, type: 'keyword.mojo' },
				{ startIndex: 14, type: 'delimiter.curly.mojo' },
				{ startIndex: 15, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: 'show(t"{n}!", "ok")',
			tokens: [
				{ startIndex: 0, type: 'identifier.mojo' },
				{ startIndex: 4, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 5, type: 'string.mojo' },
				{ startIndex: 7, type: 'delimiter.curly.mojo' },
				{ startIndex: 8, type: 'identifier.mojo' },
				{ startIndex: 9, type: 'delimiter.curly.mojo' },
				{ startIndex: 10, type: 'string.mojo' },
				{ startIndex: 12, type: 'delimiter.mojo' },
				{ startIndex: 13, type: 'white.mojo' },
				{ startIndex: 14, type: 'string.mojo' },
				{ startIndex: 18, type: 'delimiter.parenthesis.mojo' }
			]
		}
	],
	[
		{
			line: 't"{t\'nested {8}\'}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 2, type: 'delimiter.curly.mojo' },
				{ startIndex: 3, type: 'string.mojo' },
				{ startIndex: 12, type: 'delimiter.curly.mojo' },
				{ startIndex: 13, type: 'number.mojo' },
				{ startIndex: 14, type: 'delimiter.curly.mojo' },
				{ startIndex: 15, type: 'string.mojo' },
				{ startIndex: 16, type: 'delimiter.curly.mojo' },
				{ startIndex: 17, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: 't"{t"{t"{n}"}"}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 2, type: 'delimiter.curly.mojo' },
				{ startIndex: 3, type: 'string.mojo' },
				{ startIndex: 5, type: 'delimiter.curly.mojo' },
				{ startIndex: 6, type: 'string.mojo' },
				{ startIndex: 8, type: 'delimiter.curly.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 10, type: 'delimiter.curly.mojo' },
				{ startIndex: 11, type: 'string.mojo' },
				{ startIndex: 12, type: 'delimiter.curly.mojo' },
				{ startIndex: 13, type: 'string.mojo' },
				{ startIndex: 14, type: 'delimiter.curly.mojo' },
				{ startIndex: 15, type: 'string.mojo' }
			]
		}
	],

	// edge_cases.mojo: escaped brace runs and odd runs around interpolation.
	[
		{
			line: 't"{{}}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 2, type: 'string.escape.mojo' },
				{ startIndex: 6, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: 't"{{{{}}}}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 2, type: 'string.escape.mojo' },
				{ startIndex: 10, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: 't"{{{8}}}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 2, type: 'string.escape.mojo' },
				{ startIndex: 4, type: 'delimiter.curly.mojo' },
				{ startIndex: 5, type: 'number.mojo' },
				{ startIndex: 6, type: 'delimiter.curly.mojo' },
				{ startIndex: 7, type: 'string.escape.mojo' },
				{ startIndex: 9, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: 't"{{{n}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 2, type: 'string.escape.mojo' },
				{ startIndex: 4, type: 'delimiter.curly.mojo' },
				{ startIndex: 5, type: 'identifier.mojo' },
				{ startIndex: 6, type: 'delimiter.curly.mojo' },
				{ startIndex: 7, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: 't"{n}}}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 2, type: 'delimiter.curly.mojo' },
				{ startIndex: 3, type: 'identifier.mojo' },
				{ startIndex: 4, type: 'delimiter.curly.mojo' },
				{ startIndex: 5, type: 'string.escape.mojo' },
				{ startIndex: 7, type: 'string.mojo' }
			]
		}
	],
	// Braces inside expressions are delimiters, including adjacent closing braces.
	[
		{
			line: 't"{ {\'x\':8} }"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 2, type: 'delimiter.curly.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'delimiter.curly.mojo' },
				{ startIndex: 5, type: 'string.mojo' },
				{ startIndex: 8, type: 'delimiter.mojo' },
				{ startIndex: 9, type: 'number.mojo' },
				{ startIndex: 10, type: 'delimiter.curly.mojo' },
				{ startIndex: 11, type: 'white.mojo' },
				{ startIndex: 12, type: 'delimiter.curly.mojo' },
				{ startIndex: 13, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: 't"{ {n}} tail"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 2, type: 'delimiter.curly.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'delimiter.curly.mojo' },
				{ startIndex: 5, type: 'identifier.mojo' },
				{ startIndex: 6, type: 'delimiter.curly.mojo' },
				{ startIndex: 8, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: 't"{pick[0](n > 2)}!"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 2, type: 'delimiter.curly.mojo' },
				{ startIndex: 3, type: 'identifier.mojo' },
				{ startIndex: 7, type: 'delimiter.square.mojo' },
				{ startIndex: 8, type: 'number.mojo' },
				{ startIndex: 9, type: 'delimiter.square.mojo' },
				{ startIndex: 10, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 11, type: 'identifier.mojo' },
				{ startIndex: 12, type: 'white.mojo' },
				{ startIndex: 13, type: 'operator.mojo' },
				{ startIndex: 14, type: 'white.mojo' },
				{ startIndex: 15, type: 'number.mojo' },
				{ startIndex: 16, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 17, type: 'delimiter.curly.mojo' },
				{ startIndex: 18, type: 'string.mojo' }
			]
		}
	],
	// Same-quote strings and string-contained braces do not end interpolation.
	[
		{
			line: 't"{"same quotes"}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 2, type: 'delimiter.curly.mojo' },
				{ startIndex: 3, type: 'string.mojo' },
				{ startIndex: 16, type: 'delimiter.curly.mojo' },
				{ startIndex: 17, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: "t'{'{'}'",
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 2, type: 'delimiter.curly.mojo' },
				{ startIndex: 3, type: 'string.mojo' },
				{ startIndex: 6, type: 'delimiter.curly.mojo' },
				{ startIndex: 7, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: 't"{r"}"}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 2, type: 'delimiter.curly.mojo' },
				{ startIndex: 3, type: 'string.mojo' },
				{ startIndex: 7, type: 'delimiter.curly.mojo' },
				{ startIndex: 8, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: 't"""{"inner"}"""',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 4, type: 'delimiter.curly.mojo' },
				{ startIndex: 5, type: 'string.mojo' },
				{ startIndex: 12, type: 'delimiter.curly.mojo' },
				{ startIndex: 13, type: 'string.mojo' }
			]
		}
	],
	// Both literal and interpolation regions retain their own state across lines.
	[
		{
			line: 't"{(',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 2, type: 'delimiter.curly.mojo' },
				{ startIndex: 3, type: 'delimiter.parenthesis.mojo' }
			]
		},
		{
			line: '8+2',
			tokens: [
				{ startIndex: 0, type: 'number.mojo' },
				{ startIndex: 1, type: 'operator.mojo' },
				{ startIndex: 2, type: 'number.mojo' }
			]
		},
		{
			line: ')}"',
			tokens: [
				{ startIndex: 0, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 1, type: 'delimiter.curly.mojo' },
				{ startIndex: 2, type: 'string.mojo' }
			]
		},
		{ line: 'True', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }
	],
	[
		{
			line: 't"""first {8}',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 10, type: 'delimiter.curly.mojo' },
				{ startIndex: 11, type: 'number.mojo' },
				{ startIndex: 12, type: 'delimiter.curly.mojo' }
			]
		},
		{ line: '# literal text', tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{ line: 'last"""', tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{ line: 'True', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }
	],
	[
		{ line: "t'''one", tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{
			line: "{n}'''",
			tokens: [
				{ startIndex: 0, type: 'delimiter.curly.mojo' },
				{ startIndex: 1, type: 'identifier.mojo' },
				{ startIndex: 2, type: 'delimiter.curly.mojo' },
				{ startIndex: 3, type: 'string.mojo' }
			]
		},
		{ line: 'False', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }
	],

	// raw.mojo: brace escapes, ordinary escape spellings as text, triple quotes,
	// adjacent expressions, and transitions from raw to cooked templates.
	[
		{
			line: 'rt"\\{{label}}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 4, type: 'string.escape.mojo' },
				{ startIndex: 6, type: 'string.mojo' },
				{ startIndex: 11, type: 'string.escape.mojo' },
				{ startIndex: 13, type: 'string.mojo' }
			]
		}
	],
	[{ line: 'rt"\\uD800\\xQ\\q"', tokens: [{ startIndex: 0, type: 'string.mojo' }] }],
	[
		{
			line: 'tr"\\x61\\012\\\\{n}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 13, type: 'delimiter.curly.mojo' },
				{ startIndex: 14, type: 'identifier.mojo' },
				{ startIndex: 15, type: 'delimiter.curly.mojo' },
				{ startIndex: 16, type: 'string.mojo' }
			]
		}
	],
	[
		{ line: 'rt"""\\n', tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{
			line: '{n}\\q"""',
			tokens: [
				{ startIndex: 0, type: 'delimiter.curly.mojo' },
				{ startIndex: 1, type: 'identifier.mojo' },
				{ startIndex: 2, type: 'delimiter.curly.mojo' },
				{ startIndex: 3, type: 'string.mojo' }
			]
		},
		{ line: 'True', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }
	],
	[
		{
			line: 'rt"{a}{b}" t"\\n{c}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 3, type: 'delimiter.curly.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 5, type: 'delimiter.curly.mojo' },
				{ startIndex: 7, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.curly.mojo' },
				{ startIndex: 9, type: 'string.mojo' },
				{ startIndex: 10, type: 'white.mojo' },
				{ startIndex: 11, type: 'string.mojo' },
				{ startIndex: 13, type: 'string.escape.mojo' },
				{ startIndex: 15, type: 'delimiter.curly.mojo' },
				{ startIndex: 16, type: 'identifier.mojo' },
				{ startIndex: 17, type: 'delimiter.curly.mojo' },
				{ startIndex: 18, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: 't"{rt"\\n{n}"}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 2, type: 'delimiter.curly.mojo' },
				{ startIndex: 3, type: 'string.mojo' },
				{ startIndex: 8, type: 'delimiter.curly.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 10, type: 'delimiter.curly.mojo' },
				{ startIndex: 11, type: 'string.mojo' },
				{ startIndex: 12, type: 'delimiter.curly.mojo' },
				{ startIndex: 13, type: 'string.mojo' }
			]
		}
	],

	// unicode.mojo: escape boundaries around interpolation, a supplementary
	// scalar, escaped backslashes, and literal UTF-16 offsets after an emoji.
	[
		{
			line: 't"\\u03A9{n}\\u4E00"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 2, type: 'string.escape.mojo' },
				{ startIndex: 8, type: 'delimiter.curly.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 10, type: 'delimiter.curly.mojo' },
				{ startIndex: 11, type: 'string.escape.mojo' },
				{ startIndex: 17, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: 't"\\U0001F680{n}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 2, type: 'string.escape.mojo' },
				{ startIndex: 12, type: 'delimiter.curly.mojo' },
				{ startIndex: 13, type: 'identifier.mojo' },
				{ startIndex: 14, type: 'delimiter.curly.mojo' },
				{ startIndex: 15, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: 't"\\\\U00110000{n}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 2, type: 'string.escape.mojo' },
				{ startIndex: 4, type: 'string.mojo' },
				{ startIndex: 13, type: 'delimiter.curly.mojo' },
				{ startIndex: 14, type: 'identifier.mojo' },
				{ startIndex: 15, type: 'delimiter.curly.mojo' },
				{ startIndex: 16, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: 't"🚀{n}é"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 4, type: 'delimiter.curly.mojo' },
				{ startIndex: 5, type: 'identifier.mojo' },
				{ startIndex: 6, type: 'delimiter.curly.mojo' },
				{ startIndex: 7, type: 'string.mojo' }
			]
		}
	],

	// errors.mojo: preserve lexical categories independently of expression
	// validity; lone closing braces are literal, not invalid syntax tokens.
	[{ line: 't"a}b"', tokens: [{ startIndex: 0, type: 'string.mojo' }] }],
	[{ line: 't"""a}b"""', tokens: [{ startIndex: 0, type: 'string.mojo' }] }],
	[
		{
			line: 't"{}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 2, type: 'delimiter.curly.mojo' },
				{ startIndex: 4, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: 'rt"{+}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 3, type: 'delimiter.curly.mojo' },
				{ startIndex: 4, type: 'operator.mojo' },
				{ startIndex: 5, type: 'delimiter.curly.mojo' },
				{ startIndex: 6, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: 't"{1 +}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 2, type: 'delimiter.curly.mojo' },
				{ startIndex: 3, type: 'number.mojo' },
				{ startIndex: 4, type: 'white.mojo' },
				{ startIndex: 5, type: 'operator.mojo' },
				{ startIndex: 6, type: 'delimiter.curly.mojo' },
				{ startIndex: 7, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: 't"\\q"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 2, type: 'string.escape.mojo' },
				{ startIndex: 4, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: 't"\\uD800{n}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 2, type: 'string.escape.invalid.mojo' },
				{ startIndex: 8, type: 'delimiter.curly.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 10, type: 'delimiter.curly.mojo' },
				{ startIndex: 11, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: 't"\\U00110000{n}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 2, type: 'string.escape.invalid.mojo' },
				{ startIndex: 12, type: 'delimiter.curly.mojo' },
				{ startIndex: 13, type: 'identifier.mojo' },
				{ startIndex: 14, type: 'delimiter.curly.mojo' },
				{ startIndex: 15, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: 't"\\u03A{n}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 2, type: 'string.escape.invalid.mojo' },
				{ startIndex: 7, type: 'delimiter.curly.mojo' },
				{ startIndex: 8, type: 'identifier.mojo' },
				{ startIndex: 9, type: 'delimiter.curly.mojo' },
				{ startIndex: 10, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: 't"\\U0001F68{n}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 2, type: 'string.escape.invalid.mojo' },
				{ startIndex: 11, type: 'delimiter.curly.mojo' },
				{ startIndex: 12, type: 'identifier.mojo' },
				{ startIndex: 13, type: 'delimiter.curly.mojo' },
				{ startIndex: 14, type: 'string.mojo' }
			]
		}
	],
	// Monaco recovery: unfinished short literals stop at an unescaped newline;
	// escaped newlines and unfinished interpolation continue their own state.
	[
		{ line: 't"broken', tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{ line: 'True', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }
	],
	[
		{ line: "rt'broken", tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{ line: 'False', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }
	],
	[
		{
			line: 't"joined\\',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 8, type: 'string.escape.mojo' }
			]
		},
		{
			line: 'text {n}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 5, type: 'delimiter.curly.mojo' },
				{ startIndex: 6, type: 'identifier.mojo' },
				{ startIndex: 7, type: 'delimiter.curly.mojo' },
				{ startIndex: 8, type: 'string.mojo' }
			]
		},
		{ line: 'True', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }
	],
	[
		{
			line: 't"{name',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 2, type: 'delimiter.curly.mojo' },
				{ startIndex: 3, type: 'identifier.mojo' }
			]
		},
		{
			line: '} done"',
			tokens: [
				{ startIndex: 0, type: 'delimiter.curly.mojo' },
				{ startIndex: 1, type: 'string.mojo' }
			]
		},
		{ line: 'True', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }
	]
]);
