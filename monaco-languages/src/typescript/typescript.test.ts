/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('typescript', [
	// Keywords
	[
		{
			line: 'var x = function() { };',
			tokens: [
				{ startIndex: 0, type: 'keyword.ts' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.ts' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.ts' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'keyword.ts' },
				{ startIndex: 16, type: 'delimiter.parenthesis.ts' },
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'delimiter.bracket.ts' },
				{ startIndex: 20, type: '' },
				{ startIndex: 21, type: 'delimiter.bracket.ts' },
				{ startIndex: 22, type: 'delimiter.ts' }
			]
		}
	],

	[
		{
			line: '    var    ',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'keyword.ts' },
				{ startIndex: 7, type: '' }
			]
		}
	],

	// Comments - single line
	[
		{
			line: '//',
			tokens: [{ startIndex: 0, type: 'comment.ts' }]
		}
	],

	[
		{
			line: '    // a comment',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'comment.ts' }
			]
		}
	],

	[
		{
			line: '// a comment',
			tokens: [{ startIndex: 0, type: 'comment.ts' }]
		}
	],

	[
		{
			line: '// a comment /*',
			tokens: [{ startIndex: 0, type: 'comment.ts' }]
		}
	],

	[
		{
			line: '// a comment /**',
			tokens: [{ startIndex: 0, type: 'comment.ts' }]
		}
	],

	[
		{
			line: '//sticky comment',
			tokens: [{ startIndex: 0, type: 'comment.ts' }]
		}
	],

	[
		{
			line: 'var x = 1; // my comment // is a nice one',
			tokens: [
				{ startIndex: 0, type: 'keyword.ts' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.ts' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.ts' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'number.ts' },
				{ startIndex: 9, type: 'delimiter.ts' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'comment.ts' }
			]
		}
	],

	// Comments - range comment, single line
	[
		{
			line: '/* a simple comment */',
			tokens: [{ startIndex: 0, type: 'comment.ts' }]
		}
	],

	[
		{
			line: 'var x = /* a simple comment */ 1;',
			tokens: [
				{ startIndex: 0, type: 'keyword.ts' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.ts' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.ts' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'comment.ts' },
				{ startIndex: 30, type: '' },
				{ startIndex: 31, type: 'number.ts' },
				{ startIndex: 32, type: 'delimiter.ts' }
			]
		}
	],

	[
		{
			line: 'x = /**/;',
			tokens: [
				{ startIndex: 0, type: 'identifier.ts' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.ts' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'comment.ts' },
				{ startIndex: 8, type: 'delimiter.ts' }
			]
		}
	],

	[
		{
			line: 'x = /*/;',
			tokens: [
				{ startIndex: 0, type: 'identifier.ts' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.ts' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'comment.ts' }
			]
		}
	],

	// Comments - range comment, multi lines
	[
		{
			line: '/* a multiline comment',
			tokens: [{ startIndex: 0, type: 'comment.ts' }]
		},
		{
			line: 'can actually span',
			tokens: [{ startIndex: 0, type: 'comment.ts' }]
		},
		{
			line: 'multiple lines */',
			tokens: [{ startIndex: 0, type: 'comment.ts' }]
		}
	],

	[
		{
			line: 'var x = /* start a comment',
			tokens: [
				{ startIndex: 0, type: 'keyword.ts' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.ts' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.ts' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'comment.ts' }
			]
		},
		{
			line: ' a ',
			tokens: [{ startIndex: 0, type: 'comment.ts' }]
		},
		{
			line: 'and end it */ var a = 2;',
			tokens: [
				{ startIndex: 0, type: 'comment.ts' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'keyword.ts' },
				{ startIndex: 17, type: '' },
				{ startIndex: 18, type: 'identifier.ts' },
				{ startIndex: 19, type: '' },
				{ startIndex: 20, type: 'delimiter.ts' },
				{ startIndex: 21, type: '' },
				{ startIndex: 22, type: 'number.ts' },
				{ startIndex: 23, type: 'delimiter.ts' }
			]
		}
	],

	// Strings
	[
		{
			line: "var a = 'a';",
			tokens: [
				{ startIndex: 0, type: 'keyword.ts' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.ts' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.ts' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'string.ts' },
				{ startIndex: 11, type: 'delimiter.ts' }
			]
		}
	],

	[
		{
			line: '"use strict";',
			tokens: [
				{ startIndex: 0, type: 'string.ts' },
				{ startIndex: 12, type: 'delimiter.ts' }
			]
		}
	],

	[
		{
			line: 'b = a + " \'cool\'  "',
			tokens: [
				{ startIndex: 0, type: 'identifier.ts' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.ts' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.ts' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.ts' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'string.ts' }
			]
		}
	],

	[
		{
			line: '"escaping \\"quotes\\" is cool"',
			tokens: [
				{ startIndex: 0, type: 'string.ts' },
				{ startIndex: 10, type: 'string.escape.ts' },
				{ startIndex: 12, type: 'string.ts' },
				{ startIndex: 18, type: 'string.escape.ts' },
				{ startIndex: 20, type: 'string.ts' }
			]
		}
	],

	[
		{
			line: "'''",
			tokens: [
				{ startIndex: 0, type: 'string.ts' },
				{ startIndex: 2, type: 'string.invalid.ts' }
			]
		}
	],

	[
		{
			line: "'\\''",
			tokens: [
				{ startIndex: 0, type: 'string.ts' },
				{ startIndex: 1, type: 'string.escape.ts' },
				{ startIndex: 3, type: 'string.ts' }
			]
		}
	],

	[
		{
			line: "'be careful \\not to escape'",
			tokens: [
				{ startIndex: 0, type: 'string.ts' },
				{ startIndex: 12, type: 'string.escape.ts' },
				{ startIndex: 14, type: 'string.ts' }
			]
		}
	],

	// Numbers
	[
		{
			line: '0',
			tokens: [{ startIndex: 0, type: 'number.ts' }]
		}
	],

	[
		{
			line: ' 0',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'number.ts' }
			]
		}
	],

	[
		{
			line: ' 0 ',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'number.ts' },
				{ startIndex: 2, type: '' }
			]
		}
	],

	[
		{
			line: '0 ',
			tokens: [
				{ startIndex: 0, type: 'number.ts' },
				{ startIndex: 1, type: '' }
			]
		}
	],

	[
		{
			line: '0+0',
			tokens: [
				{ startIndex: 0, type: 'number.ts' },
				{ startIndex: 1, type: 'delimiter.ts' },
				{ startIndex: 2, type: 'number.ts' }
			]
		}
	],

	[
		{
			line: '100+10',
			tokens: [
				{ startIndex: 0, type: 'number.ts' },
				{ startIndex: 3, type: 'delimiter.ts' },
				{ startIndex: 4, type: 'number.ts' }
			]
		}
	],

	[
		{
			line: '0 + 0',
			tokens: [
				{ startIndex: 0, type: 'number.ts' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.ts' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.ts' }
			]
		}
	],

	[
		{
			line: '0123',
			tokens: [{ startIndex: 0, type: 'number.octal.ts' }]
		}
	],

	[
		{
			line: '01239',
			tokens: [
				{ startIndex: 0, type: 'number.octal.ts' },
				{ startIndex: 4, type: 'number.ts' }
			]
		}
	],

	[
		{
			line: '0o123',
			tokens: [{ startIndex: 0, type: 'number.octal.ts' }]
		}
	],

	[
		{
			line: '0O123',
			tokens: [{ startIndex: 0, type: 'number.octal.ts' }]
		}
	],

	[
		{
			line: '0x',
			tokens: [
				{ startIndex: 0, type: 'number.ts' },
				{ startIndex: 1, type: 'identifier.ts' }
			]
		}
	],

	[
		{
			line: '0x123',
			tokens: [{ startIndex: 0, type: 'number.hex.ts' }]
		}
	],

	[
		{
			line: '0X123',
			tokens: [{ startIndex: 0, type: 'number.hex.ts' }]
		}
	],

	[
		{
			line: '0b101',
			tokens: [{ startIndex: 0, type: 'number.binary.ts' }]
		}
	],

	[
		{
			line: '0B101',
			tokens: [{ startIndex: 0, type: 'number.binary.ts' }]
		}
	],

	// Bigint
	[
		{
			line: '0n',
			tokens: [{ startIndex: 0, type: 'number.ts' }]
		}
	],

	[
		{
			line: ' 0n',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'number.ts' }
			]
		}
	],

	[
		{
			line: ' 0n ',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'number.ts' },
				{ startIndex: 3, type: '' }
			]
		}
	],

	[
		{
			line: '0n ',
			tokens: [
				{ startIndex: 0, type: 'number.ts' },
				{ startIndex: 2, type: '' }
			]
		}
	],

	[
		{
			line: '0n+0n',
			tokens: [
				{ startIndex: 0, type: 'number.ts' },
				{ startIndex: 2, type: 'delimiter.ts' },
				{ startIndex: 3, type: 'number.ts' }
			]
		}
	],

	[
		{
			line: '100n+10n',
			tokens: [
				{ startIndex: 0, type: 'number.ts' },
				{ startIndex: 4, type: 'delimiter.ts' },
				{ startIndex: 5, type: 'number.ts' }
			]
		}
	],

	[
		{
			line: '0n + 0n',
			tokens: [
				{ startIndex: 0, type: 'number.ts' },
				{ startIndex: 2, type: '' },
				{ startIndex: 3, type: 'delimiter.ts' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'number.ts' }
			]
		}
	],

	[
		{
			line: '0b101n',
			tokens: [{ startIndex: 0, type: 'number.binary.ts' }]
		}
	],

	[
		{
			line: '0123n',
			tokens: [{ startIndex: 0, type: 'number.octal.ts' }]
		}
	],

	[
		{
			line: '0o123n',
			tokens: [{ startIndex: 0, type: 'number.octal.ts' }]
		}
	],

	[
		{
			line: '0x123n',
			tokens: [{ startIndex: 0, type: 'number.hex.ts' }]
		}
	],

	// Regular Expressions
	[
		{
			line: '//',
			tokens: [{ startIndex: 0, type: 'comment.ts' }]
		}
	],

	[
		{
			line: '/**/',
			tokens: [{ startIndex: 0, type: 'comment.ts' }]
		}
	],

	[
		{
			line: '/***/',
			tokens: [{ startIndex: 0, type: 'comment.doc.ts' }]
		}
	],

	[
		{
			line: '5 / 3;',
			tokens: [
				{ startIndex: 0, type: 'number.ts' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.ts' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.ts' },
				{ startIndex: 5, type: 'delimiter.ts' }
			]
		}
	],

	// Advanced regular expressions
	[
		{
			line: '1 / 2; /* comment',
			tokens: [
				{ startIndex: 0, type: 'number.ts' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.ts' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.ts' },
				{ startIndex: 5, type: 'delimiter.ts' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'comment.ts' }
			]
		}
	],

	[
		{
			line: '1 / 2 / x / b;',
			tokens: [
				{ startIndex: 0, type: 'number.ts' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.ts' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.ts' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.ts' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.ts' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'delimiter.ts' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'identifier.ts' },
				{ startIndex: 13, type: 'delimiter.ts' }
			]
		}
	],

	[
		{
			line: "x = /foo/.test('')",
			tokens: [
				{ startIndex: 0, type: 'identifier.ts' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.ts' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'regexp.ts' },
				{ startIndex: 9, type: 'delimiter.ts' },
				{ startIndex: 10, type: 'identifier.ts' },
				{ startIndex: 14, type: 'delimiter.parenthesis.ts' },
				{ startIndex: 15, type: 'string.ts' },
				{ startIndex: 17, type: 'delimiter.parenthesis.ts' }
			]
		}
	],

	[
		{
			line: "var x = !/`/.test('a');",
			tokens: [
				{ startIndex: 0, type: 'keyword.ts' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.ts' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.ts' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'delimiter.ts' },
				{ startIndex: 9, type: 'regexp.ts' },
				{ startIndex: 12, type: 'delimiter.ts' },
				{ startIndex: 13, type: 'identifier.ts' },
				{ startIndex: 17, type: 'delimiter.parenthesis.ts' },
				{ startIndex: 18, type: 'string.ts' },
				{ startIndex: 21, type: 'delimiter.parenthesis.ts' },
				{ startIndex: 22, type: 'delimiter.ts' }
			]
		}
	],

	[
		{
			line: '/foo/',
			tokens: [{ startIndex: 0, type: 'regexp.ts' }]
		}
	],

	[
		{
			line: '/foo/g',
			tokens: [
				{ startIndex: 0, type: 'regexp.ts' },
				{ startIndex: 5, type: 'keyword.other.ts' }
			]
		}
	],

	[
		{
			line: '/foo/dgimsuy',
			tokens: [
				{ startIndex: 0, type: 'regexp.ts' },
				{ startIndex: 5, type: 'keyword.other.ts' }
			]
		}
	],

	[
		{
			line: '/foo/q', // invalid flag
			tokens: [
				{ startIndex: 0, type: 'delimiter.ts' },
				{ startIndex: 1, type: 'identifier.ts' },
				{ startIndex: 4, type: 'delimiter.ts' },
				{ startIndex: 5, type: 'identifier.ts' }
			]
		}
	],

	[
		{
			line: 'x = 1 + f(2 / 3, /foo/)',
			tokens: [
				{ startIndex: 0, type: 'identifier.ts' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.ts' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.ts' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.ts' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.ts' },
				{ startIndex: 9, type: 'delimiter.parenthesis.ts' },
				{ startIndex: 10, type: 'number.ts' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'delimiter.ts' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'number.ts' },
				{ startIndex: 15, type: 'delimiter.ts' },
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'regexp.ts' },
				{ startIndex: 22, type: 'delimiter.parenthesis.ts' }
			]
		}
	],

	[
		{
			line: 'a /ads/ b;',
			tokens: [
				{ startIndex: 0, type: 'identifier.ts' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.ts' },
				{ startIndex: 3, type: 'identifier.ts' },
				{ startIndex: 6, type: 'delimiter.ts' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.ts' },
				{ startIndex: 9, type: 'delimiter.ts' }
			]
		}
	],

	[
		{
			line: '1/(2/3)/2/3;',
			tokens: [
				{ startIndex: 0, type: 'number.ts' },
				{ startIndex: 1, type: 'delimiter.ts' },
				{ startIndex: 2, type: 'delimiter.parenthesis.ts' },
				{ startIndex: 3, type: 'number.ts' },
				{ startIndex: 4, type: 'delimiter.ts' },
				{ startIndex: 5, type: 'number.ts' },
				{ startIndex: 6, type: 'delimiter.parenthesis.ts' },
				{ startIndex: 7, type: 'delimiter.ts' },
				{ startIndex: 8, type: 'number.ts' },
				{ startIndex: 9, type: 'delimiter.ts' },
				{ startIndex: 10, type: 'number.ts' },
				{ startIndex: 11, type: 'delimiter.ts' }
			]
		}
	],

	[
		{
			line: '{ key: 123 }',
			tokens: [
				{ startIndex: 0, type: 'delimiter.bracket.ts' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'identifier.ts' },
				{ startIndex: 5, type: 'delimiter.ts' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'number.ts' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'delimiter.bracket.ts' }
			]
		}
	],

	[
		{
			line: '[1,2,3]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.ts' },
				{ startIndex: 1, type: 'number.ts' },
				{ startIndex: 2, type: 'delimiter.ts' },
				{ startIndex: 3, type: 'number.ts' },
				{ startIndex: 4, type: 'delimiter.ts' },
				{ startIndex: 5, type: 'number.ts' },
				{ startIndex: 6, type: 'delimiter.square.ts' }
			]
		}
	],

	[
		{
			line: 'foo(123);',
			tokens: [
				{ startIndex: 0, type: 'identifier.ts' },
				{ startIndex: 3, type: 'delimiter.parenthesis.ts' },
				{ startIndex: 4, type: 'number.ts' },
				{ startIndex: 7, type: 'delimiter.parenthesis.ts' },
				{ startIndex: 8, type: 'delimiter.ts' }
			]
		}
	],

	[
		{
			line: '{a:{b:[]}}',
			tokens: [
				{ startIndex: 0, type: 'delimiter.bracket.ts' },
				{ startIndex: 1, type: 'identifier.ts' },
				{ startIndex: 2, type: 'delimiter.ts' },
				{ startIndex: 3, type: 'delimiter.bracket.ts' },
				{ startIndex: 4, type: 'identifier.ts' },
				{ startIndex: 5, type: 'delimiter.ts' },
				{ startIndex: 6, type: 'delimiter.square.ts' },
				{ startIndex: 8, type: 'delimiter.bracket.ts' }
			]
		}
	],

	[
		{
			line: 'x = "[{()}]"',
			tokens: [
				{ startIndex: 0, type: 'identifier.ts' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.ts' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'string.ts' }
			]
		}
	],

	[
		{
			line: 'test ? 1 : 2',
			tokens: [
				{ startIndex: 0, type: 'identifier.ts' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'delimiter.ts' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'number.ts' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'delimiter.ts' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'number.ts' }
			]
		}
	],

	[
		{
			line: 'couldBeNullish ?? 1',
			tokens: [
				{ startIndex: 0, type: 'identifier.ts' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'delimiter.ts' },
				{ startIndex: 17, type: '' },
				{ startIndex: 18, type: 'number.ts' }
			]
		}
	],

	[
		{
			line: "`${5 + 'x' + (<any>)3}a${4}`",
			tokens: [
				{ startIndex: 0, type: 'string.ts' },
				{ startIndex: 1, type: 'delimiter.bracket.ts' },
				{ startIndex: 3, type: 'number.ts' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'delimiter.ts' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'string.ts' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'delimiter.ts' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'delimiter.parenthesis.ts' },
				{ startIndex: 14, type: 'delimiter.angle.ts' },
				{ startIndex: 15, type: 'keyword.ts' },
				{ startIndex: 18, type: 'delimiter.angle.ts' },
				{ startIndex: 19, type: 'delimiter.parenthesis.ts' },
				{ startIndex: 20, type: 'number.ts' },
				{ startIndex: 21, type: 'delimiter.bracket.ts' },
				{ startIndex: 22, type: 'string.ts' },
				{ startIndex: 23, type: 'delimiter.bracket.ts' },
				{ startIndex: 25, type: 'number.ts' },
				{ startIndex: 26, type: 'delimiter.bracket.ts' },
				{ startIndex: 27, type: 'string.ts' }
			]
		}
	],

	[
		{
			line: 'let x = 2 / 2; //asd',
			tokens: [
				{ startIndex: 0, type: 'keyword.ts' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.ts' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.ts' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'number.ts' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'delimiter.ts' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'number.ts' },
				{ startIndex: 13, type: 'delimiter.ts' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'comment.ts' }
			]
		}
	]
]);
