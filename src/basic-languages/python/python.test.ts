/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('python', [
	// Keywords
	[
		{
			line: 'def func():',
			tokens: [
				{ startIndex: 0, type: 'keyword.python' },
				{ startIndex: 3, type: 'white.python' },
				{ startIndex: 4, type: 'identifier.python' },
				{ startIndex: 8, type: 'delimiter.parenthesis.python' },
				{ startIndex: 10, type: 'delimiter.python' }
			]
		}
	],

	[
		{
			line: 'func(str Y3)',
			tokens: [
				{ startIndex: 0, type: 'identifier.python' },
				{ startIndex: 4, type: 'delimiter.parenthesis.python' },
				{ startIndex: 5, type: 'keyword.python' },
				{ startIndex: 8, type: 'white.python' },
				{ startIndex: 9, type: 'identifier.python' },
				{ startIndex: 11, type: 'delimiter.parenthesis.python' }
			]
		}
	],

	[
		{
			line: '@Dec0_rator:',
			tokens: [
				{ startIndex: 0, type: 'tag.python' },
				{ startIndex: 11, type: 'delimiter.python' }
			]
		}
	],

	// Comments
	[
		{
			line: ' # Comments! ## "jfkd" ',
			tokens: [
				{ startIndex: 0, type: 'white.python' },
				{ startIndex: 1, type: 'comment.python' }
			]
		}
	],

	// Strings
	[
		{
			line: "'s0'",
			tokens: [
				{ startIndex: 0, type: 'string.escape.python' },
				{ startIndex: 1, type: 'string.python' },
				{ startIndex: 3, type: 'string.escape.python' }
			]
		}
	],

	[
		{
			line: '"\' " "',
			tokens: [
				{ startIndex: 0, type: 'string.escape.python' },
				{ startIndex: 1, type: 'string.python' },
				{ startIndex: 3, type: 'string.escape.python' },
				{ startIndex: 4, type: 'white.python' },
				{ startIndex: 5, type: 'string.escape.python' }
			]
		}
	],

	[
		{
			line: "'''Lots of string'''",
			tokens: [{ startIndex: 0, type: 'string.python' }]
		}
	],

	[
		{
			line: '"""Lots \'\'\'     \'\'\'"""',
			tokens: [{ startIndex: 0, type: 'string.python' }]
		}
	],

	[
		{
			line: "'''Lots '''0.3e-5",
			tokens: [
				{ startIndex: 0, type: 'string.python' },
				{ startIndex: 11, type: 'number.python' }
			]
		}
	],

	// https://github.com/microsoft/monaco-editor/issues/1170
	[
		{
			line: 'def f():',
			tokens: [
				{ startIndex: 0, type: 'keyword.python' },
				{ startIndex: 3, type: 'white.python' },
				{ startIndex: 4, type: 'identifier.python' },
				{ startIndex: 5, type: 'delimiter.parenthesis.python' },
				{ startIndex: 7, type: 'delimiter.python' }
			]
		},
		{
			line: '   """multi',
			tokens: [
				{ startIndex: 0, type: 'white.python' },
				{ startIndex: 3, type: 'string.python' }
			]
		},
		{
			line: '   line',
			tokens: [{ startIndex: 0, type: 'string.python' }]
		},
		{
			line: '   comment',
			tokens: [{ startIndex: 0, type: 'string.python' }]
		},
		{
			line: '   """ + """',
			tokens: [
				{ startIndex: 0, type: 'string.python' },
				{ startIndex: 6, type: 'white.python' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'white.python' },
				{ startIndex: 9, type: 'string.python' }
			]
		},
		{
			line: '   another',
			tokens: [{ startIndex: 0, type: 'string.python' }]
		},
		{
			line: '   multi',
			tokens: [{ startIndex: 0, type: 'string.python' }]
		},
		{
			line: '   line',
			tokens: [{ startIndex: 0, type: 'string.python' }]
		},
		{
			line: '   comment"""',
			tokens: [{ startIndex: 0, type: 'string.python' }]
		},
		{
			line: '   code',
			tokens: [
				{ startIndex: 0, type: 'white.python' },
				{ startIndex: 3, type: 'identifier.python' }
			]
		}
	],

	// Numbers
	[
		{
			line: '0xAcBFd',
			tokens: [{ startIndex: 0, type: 'number.hex.python' }]
		}
	],

	[
		{
			line: '0x0cH',
			tokens: [
				{ startIndex: 0, type: 'number.hex.python' },
				{ startIndex: 4, type: 'identifier.python' }
			]
		}
	],

	[
		{
			line: '456.7e-7j',
			tokens: [{ startIndex: 0, type: 'number.python' }]
		}
	],

	// F-Strings
	[
		{
			line: 'f"str {var} str"',
			tokens: [
				{ startIndex: 0, type: 'string.escape.python' },
				{ startIndex: 2, type: 'string.python' },
				{ startIndex: 6, type: 'identifier.python' },
				{ startIndex: 11, type: 'string.python' },
				{ startIndex: 15, type: 'string.escape.python' }
			]
		}
	],
	[
		{
			line: `f'''str {var} str'''`,
			tokens: [
				{ startIndex: 0, type: 'string.escape.python' },
				{ startIndex: 4, type: 'string.python' },
				{ startIndex: 8, type: 'identifier.python' },
				{ startIndex: 13, type: 'string.python' },
				{ startIndex: 17, type: 'string.escape.python' }
			]
		}
	],
	[
		{
			line: 'f"{var:.3f}{var!r}{var=}"',
			tokens: [
				{ startIndex: 0, type: 'string.escape.python' },
				{ startIndex: 2, type: 'identifier.python' },
				{ startIndex: 6, type: 'string.python' },
				{ startIndex: 10, type: 'identifier.python' },
				{ startIndex: 15, type: 'string.python' },
				{ startIndex: 17, type: 'identifier.python' },
				{ startIndex: 22, type: 'string.python' },
				{ startIndex: 23, type: 'identifier.python' },
				{ startIndex: 24, type: 'string.escape.python' }
			]
		}
	],
	[
		{
			line: 'f"\' " "',
			tokens: [
				{ startIndex: 0, type: 'string.escape.python' },
				{ startIndex: 2, type: 'string.python' },
				{ startIndex: 4, type: 'string.escape.python' },
				{ startIndex: 5, type: 'white.python' },
				{ startIndex: 6, type: 'string.escape.python' }
			]
		}
	],
	[
		{
			line: '"{var}"',
			tokens: [
				{ startIndex: 0, type: 'string.escape.python' },
				{ startIndex: 1, type: 'string.python' },
				{ startIndex: 6, type: 'string.escape.python' }
			]
		}
	]
]);
