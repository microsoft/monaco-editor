/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

// Fresh lexical examples informed by the pinned string-literal tests in AGENTS.md.
// Every offset is in UTF-16 code units, including positions after literal emoji.
testTokenization('mojo', [
	// consumeUnicodeEscape(): fixed widths, scalar limits and surrogate exclusion.
	[
		{
			line: '"\\u0000"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 1, type: 'string.escape.mojo' },
				{ startIndex: 7, type: 'string.mojo' }
			]
		},
		{
			line: '"\\uD7FF"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 1, type: 'string.escape.mojo' },
				{ startIndex: 7, type: 'string.mojo' }
			]
		},
		{
			line: '"\\uE000"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 1, type: 'string.escape.mojo' },
				{ startIndex: 7, type: 'string.mojo' }
			]
		},
		{
			line: '"\\uFFFF"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 1, type: 'string.escape.mojo' },
				{ startIndex: 7, type: 'string.mojo' }
			]
		},
		{
			line: '"\\U0000007F"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 1, type: 'string.escape.mojo' },
				{ startIndex: 11, type: 'string.mojo' }
			]
		},
		{
			line: '"\\U0001F680"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 1, type: 'string.escape.mojo' },
				{ startIndex: 11, type: 'string.mojo' }
			]
		},
		{
			line: '"\\U0010FFFF"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 1, type: 'string.escape.mojo' },
				{ startIndex: 11, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: '"\\uD800"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 1, type: 'string.escape.invalid.mojo' },
				{ startIndex: 7, type: 'string.mojo' }
			]
		},
		{
			line: '"\\udfff"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 1, type: 'string.escape.invalid.mojo' },
				{ startIndex: 7, type: 'string.mojo' }
			]
		},
		{
			line: '"\\U0000D800"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 1, type: 'string.escape.invalid.mojo' },
				{ startIndex: 11, type: 'string.mojo' }
			]
		},
		{
			line: '"\\U00110000"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 1, type: 'string.escape.invalid.mojo' },
				{ startIndex: 11, type: 'string.mojo' }
			]
		},
		{
			line: '"\\UFFFFFFFF"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 1, type: 'string.escape.invalid.mojo' },
				{ startIndex: 11, type: 'string.mojo' }
			]
		},
		{
			line: '"\\u12"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 1, type: 'string.escape.invalid.mojo' },
				{ startIndex: 5, type: 'string.mojo' }
			]
		},
		{
			line: '"\\U0001F6"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 1, type: 'string.escape.invalid.mojo' },
				{ startIndex: 9, type: 'string.mojo' }
			]
		}
	],
	// UTF-8 encoding is a compiler concern; these assert escape spans and UTF-16 offsets.
	[
		{
			line: '"é\\u00f1中\\u03A9👋\\U0001F9ED!"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 2, type: 'string.escape.mojo' },
				{ startIndex: 8, type: 'string.mojo' },
				{ startIndex: 9, type: 'string.escape.mojo' },
				{ startIndex: 15, type: 'string.mojo' },
				{ startIndex: 17, type: 'string.escape.mojo' },
				{ startIndex: 27, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: '"\\u00412\\U000000423"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 1, type: 'string.escape.mojo' },
				{ startIndex: 7, type: 'string.mojo' },
				{ startIndex: 8, type: 'string.escape.mojo' },
				{ startIndex: 18, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: '"\\u12G4\\U0000Z123"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 1, type: 'string.escape.invalid.mojo' },
				{ startIndex: 5, type: 'string.mojo' },
				{ startIndex: 7, type: 'string.escape.invalid.mojo' },
				{ startIndex: 13, type: 'string.mojo' }
			]
		}
	],
	// Unsupported named escapes consume the escape pair, leaving braces as string text.
	[
		{
			line: '"\\N{GREEK SMALL LETTER PI}"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 1, type: 'string.escape.invalid.mojo' },
				{ startIndex: 3, type: 'string.mojo' }
			]
		}
	],

	// consumeStringBody(): every simple escape; adjacent escape tokens coalesce.
	[
		{
			line: '"\\\\\\"\\\'\\a\\b\\f\\n\\r\\t\\v"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 1, type: 'string.escape.mojo' },
				{ startIndex: 21, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: '"\\0"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 1, type: 'string.escape.mojo' },
				{ startIndex: 3, type: 'string.mojo' }
			]
		},
		{
			line: '"\\77"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 1, type: 'string.escape.mojo' },
				{ startIndex: 4, type: 'string.mojo' }
			]
		},
		{
			line: '"\\777"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 1, type: 'string.escape.mojo' },
				{ startIndex: 5, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: '"\\1234\\078"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 1, type: 'string.escape.mojo' },
				{ startIndex: 5, type: 'string.mojo' },
				{ startIndex: 6, type: 'string.escape.mojo' },
				{ startIndex: 9, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: '"\\xE9"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 1, type: 'string.escape.mojo' },
				{ startIndex: 5, type: 'string.mojo' }
			]
		},
		{
			line: '"\\x4aF"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 1, type: 'string.escape.mojo' },
				{ startIndex: 5, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: '"\\q"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 1, type: 'string.escape.invalid.mojo' },
				{ startIndex: 3, type: 'string.mojo' }
			]
		},
		{
			line: '"\\x"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 1, type: 'string.escape.invalid.mojo' },
				{ startIndex: 3, type: 'string.mojo' }
			]
		},
		{
			line: '"\\xA"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 1, type: 'string.escape.invalid.mojo' },
				{ startIndex: 4, type: 'string.mojo' }
			]
		},
		{
			line: '"\\xG1\\8\\9"',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 1, type: 'string.escape.invalid.mojo' },
				{ startIndex: 3, type: 'string.mojo' },
				{ startIndex: 5, type: 'string.escape.invalid.mojo' },
				{ startIndex: 9, type: 'string.mojo' }
			]
		}
	],
	// Invalid escapes do not swallow the closing quote or following expression.
	[
		{
			line: '"\\q"+True',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 1, type: 'string.escape.invalid.mojo' },
				{ startIndex: 3, type: 'string.mojo' },
				{ startIndex: 4, type: 'operator.mojo' },
				{ startIndex: 5, type: 'keyword.mojo' }
			]
		}
	],

	// lexString(): both quote styles and raw-prefix case variants remain literal.
	[
		{ line: '"text # {} 👋"', tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{ line: "'text # {} 👋'", tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{ line: 'r"text # {} 👋"', tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{ line: "r'text # {} 👋'", tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{ line: 'R"text # {} 👋"', tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{ line: "R'text # {} 👋'", tokens: [{ startIndex: 0, type: 'string.mojo' }] }
	],
	[
		{ line: 'r"\\uD800\\xQ\\q\\{x}"', tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{ line: "R'\\u0041\\U00000042'", tokens: [{ startIndex: 0, type: 'string.mojo' }] }
	],
	[
		{
			line: 'r"a\\"b"+False',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 7, type: 'operator.mojo' },
				{ startIndex: 8, type: 'keyword.mojo' }
			]
		}
	],
	[
		{
			line: "R'a\\'b'+True",
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 7, type: 'operator.mojo' },
				{ startIndex: 8, type: 'keyword.mojo' }
			]
		}
	],
	// A raw prefix must be adjacent; f is an ordinary identifier in this release.
	[
		{
			line: 'r "raw?"',
			tokens: [
				{ startIndex: 0, type: 'identifier.mojo' },
				{ startIndex: 1, type: 'white.mojo' },
				{ startIndex: 2, type: 'string.mojo' }
			]
		},
		{
			line: 'f"{ordinary}"',
			tokens: [
				{ startIndex: 0, type: 'identifier.mojo' },
				{ startIndex: 1, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: '"👋"+True # end',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 4, type: 'operator.mojo' },
				{ startIndex: 5, type: 'keyword.mojo' },
				{ startIndex: 9, type: 'white.mojo' },
				{ startIndex: 10, type: 'comment.mojo' }
			]
		}
	],

	// Triple strings retain state; one or two matching quotes are body text.
	[
		{ line: '"""line one', tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{ line: '# literal text', tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{ line: 'line three"""', tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{ line: 'True', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }
	],
	[
		{ line: "'''line one", tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{ line: '# literal text', tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{ line: "line three'''", tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{ line: 'True', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }
	],
	[
		{ line: '"""one " two ""', tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{ line: "''' remains text", tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{
			line: '"""+True',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 3, type: 'operator.mojo' },
				{ startIndex: 4, type: 'keyword.mojo' }
			]
		}
	],
	[
		{ line: "'''one ' two ''", tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{ line: '""" remains text', tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{
			line: "'''+False",
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 3, type: 'operator.mojo' },
				{ startIndex: 4, type: 'keyword.mojo' }
			]
		}
	],
	[
		{
			line: '"""a\\q\\n"""',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 4, type: 'string.escape.invalid.mojo' },
				{ startIndex: 6, type: 'string.escape.mojo' },
				{ startIndex: 8, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: "'''\\u03c0",
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 3, type: 'string.escape.mojo' }
			]
		},
		{
			line: "\\U0000DFFF'''",
			tokens: [
				{ startIndex: 0, type: 'string.escape.invalid.mojo' },
				{ startIndex: 10, type: 'string.mojo' }
			]
		}
	],
	[
		{ line: 'R"""\\q', tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{ line: '\\uD800"""', tokens: [{ startIndex: 0, type: 'string.mojo' }] }
	],
	[
		{ line: "r'''\\xZ", tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{ line: "\\UFFFFFFFF'''", tokens: [{ startIndex: 0, type: 'string.mojo' }] }
	],
	[
		{ line: '""""""', tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{ line: "''''''", tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{ line: 'r""', tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{ line: "R''", tokens: [{ startIndex: 0, type: 'string.mojo' }] }
	],

	// Monaco recovery: uncontinued short strings end at the line boundary.
	[
		{ line: '"open', tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{ line: 'True', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }
	],
	[
		{ line: "'", tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{ line: 'False', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }
	],
	[
		{ line: 'r"open', tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{ line: 'True', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }
	],
	[
		{
			line: '"\\u12',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 1, type: 'string.escape.invalid.mojo' }
			]
		},
		{ line: 'False', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }
	],
	// A final backslash splices the next physical line for ordinary and raw strings.
	[
		{
			line: '"joined\\',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 7, type: 'string.escape.mojo' }
			]
		},
		{ line: 'text"', tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{ line: 'True', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }
	],
	[
		{ line: "R'joined\\", tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{ line: "text'", tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{ line: 'False', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }
	],
	// Two backslashes are an escape pair; they do not continue a short string.
	[
		{
			line: '"stop\\\\',
			tokens: [
				{ startIndex: 0, type: 'string.mojo' },
				{ startIndex: 5, type: 'string.escape.mojo' }
			]
		},
		{ line: 'True', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }
	],
	// Unfinished triple strings intentionally retain their string state across lines.
	[
		{ line: '"""still open', tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{ line: 'True # literal', tokens: [{ startIndex: 0, type: 'string.mojo' }] },
		{ line: '', tokens: [] },
		{ line: 'False', tokens: [{ startIndex: 0, type: 'string.mojo' }] }
	]
]);
