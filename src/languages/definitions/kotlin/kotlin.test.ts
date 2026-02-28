/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('kotlin', [
	// inline reified function
	[
		{
			line: 'inline fun <reified T : Any> foo()',
			tokens: [
				{ startIndex: 0, type: 'keyword.inline.kt' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'keyword.fun.kt' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'delimiter.angle.kt' },
				{ startIndex: 12, type: 'keyword.reified.kt' },
				{ startIndex: 19, type: '' },
				{ startIndex: 20, type: 'type.identifier.kt' },
				{ startIndex: 21, type: '' },
				{ startIndex: 22, type: 'delimiter.kt' },
				{ startIndex: 23, type: '' },
				{ startIndex: 24, type: 'type.identifier.kt' },
				{ startIndex: 27, type: 'delimiter.angle.kt' },
				{ startIndex: 28, type: '' },
				{ startIndex: 29, type: 'identifier.kt' },
				{ startIndex: 32, type: 'delimiter.parenthesis.kt' }
			]
		}
	],

	// Val declaration and assignment
	[
		{
			line: 'val x: X=5',
			tokens: [
				{ startIndex: 0, type: 'keyword.val.kt' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.kt' },
				{ startIndex: 5, type: 'delimiter.kt' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'type.identifier.kt' },
				{ startIndex: 8, type: 'delimiter.kt' },
				{ startIndex: 9, type: 'number.kt' }
			]
		}
	],

	// Comments - single line
	[
		{
			line: '//',
			tokens: [{ startIndex: 0, type: 'comment.kt' }]
		}
	],

	[
		{
			line: '    // a comment',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'comment.kt' }
			]
		}
	],

	[
		{
			line: '// a comment',
			tokens: [{ startIndex: 0, type: 'comment.kt' }]
		}
	],

	[
		{
			line: '//sticky comment',
			tokens: [{ startIndex: 0, type: 'comment.kt' }]
		}
	],

	[
		{
			line: '/almost a comment',
			tokens: [
				{ startIndex: 0, type: 'delimiter.kt' },
				{ startIndex: 1, type: 'identifier.kt' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.kt' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'identifier.kt' }
			]
		}
	],

	[
		{
			line: '1 / 2; /* comment',
			tokens: [
				{ startIndex: 0, type: 'number.kt' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.kt' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.kt' },
				{ startIndex: 5, type: 'delimiter.kt' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'comment.kt' }
			]
		}
	],

	// [{
	// 	line: 'var x = 1 // my comment // is a nice one',
	// 	tokens: [
	// 		{ startIndex: 0, type: 'keyword.var.kt' },
	// 		{ startIndex: 3, type: '' },
	// 		{ startIndex: 4, type: 'identifier.kt' },
	// 		{ startIndex: 5, type: '' },
	// 		{ startIndex: 6, type: 'delimiter.kt' },
	// 		{ startIndex: 7, type: '' },
	// 		{ startIndex: 8, type: 'number.kt' },
	// 		{ startIndex: 9, type: '' },
	// 		{ startIndex: 10, type: 'comment.kt' },
	// 		{ startIndex: 12, type: '' },
	// 		{ startIndex: 13, type: 'comment.kt' }
	// 	]
	// }],

	// Comments - range comment, single line
	[
		{
			line: '/* a simple comment */',
			tokens: [{ startIndex: 0, type: 'comment.kt' }]
		}
	],

	[
		{
			line: 'var x = /* a simple comment */ 1',
			tokens: [
				{ startIndex: 0, type: 'keyword.var.kt' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.kt' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.kt' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'comment.kt' },
				{ startIndex: 30, type: '' },
				{ startIndex: 31, type: 'number.kt' }
			]
		}
	],

	[
		{
			line: 'var x = /* comment */ 1; */',
			tokens: [
				{ startIndex: 0, type: 'keyword.var.kt' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.kt' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.kt' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'comment.kt' },
				{ startIndex: 21, type: '' },
				{ startIndex: 22, type: 'number.kt' },
				{ startIndex: 23, type: 'delimiter.kt' },
				{ startIndex: 24, type: '' }
			]
		}
	],

	[
		{
			line: 'x = /**/',
			tokens: [
				{ startIndex: 0, type: 'identifier.kt' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.kt' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'comment.kt' }
			]
		}
	],

	[
		{
			line: 'var x = /** start a Java Doc comment',
			tokens: [
				{ startIndex: 0, type: 'keyword.var.kt' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.kt' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.kt' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'comment.doc.kt' }
			]
		},
		{
			line: ' a ',
			tokens: [{ startIndex: 0, type: 'comment.doc.kt' }]
		},
		{
			line: 'and end it */ 2',
			tokens: [
				{ startIndex: 0, type: 'comment.doc.kt' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'number.kt' }
			]
		}
	],

	[
		{
			line: '/** start of Java Doc',
			tokens: [{ startIndex: 0, type: 'comment.doc.kt' }]
		},
		{
			line: 'a comment between without a star',
			tokens: [{ startIndex: 0, type: 'comment.doc.kt' }]
		},
		{
			line: 'end of multiline comment*/',
			tokens: [{ startIndex: 0, type: 'comment.doc.kt' }]
		}
	],

	// Keywords
	[
		{
			line: 'package test class Program { fun main(vararg args: String) {} } }',
			tokens: [
				{ startIndex: 0, type: 'keyword.package.kt' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.kt' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'keyword.class.kt' },
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'type.identifier.kt' },
				{ startIndex: 26, type: '' },
				{ startIndex: 27, type: 'delimiter.curly.kt' },
				{ startIndex: 28, type: '' },
				{ startIndex: 29, type: 'keyword.fun.kt' },
				{ startIndex: 32, type: '' },
				{ startIndex: 33, type: 'identifier.kt' },
				{ startIndex: 37, type: 'delimiter.parenthesis.kt' },
				{ startIndex: 38, type: 'keyword.vararg.kt' },
				{ startIndex: 44, type: '' },
				{ startIndex: 45, type: 'identifier.kt' },
				{ startIndex: 49, type: 'delimiter.kt' },
				{ startIndex: 50, type: '' },
				{ startIndex: 51, type: 'type.identifier.kt' },
				{ startIndex: 57, type: 'delimiter.parenthesis.kt' },
				{ startIndex: 58, type: '' },
				{ startIndex: 59, type: 'delimiter.curly.kt' },
				{ startIndex: 61, type: '' },
				{ startIndex: 62, type: 'delimiter.curly.kt' },
				{ startIndex: 63, type: '' },
				{ startIndex: 64, type: 'delimiter.curly.kt' }
			]
		}
	],

	// Numbers
	[
		{
			line: '0',
			tokens: [{ startIndex: 0, type: 'number.kt' }]
		}
	],

	[
		{
			line: '0.10',
			tokens: [{ startIndex: 0, type: 'number.float.kt' }]
		}
	],

	[
		{
			line: '.123',
			tokens: [{ startIndex: 0, type: 'number.float.kt' }]
		}
	],

	[
		{
			line: '0x',
			tokens: [
				{ startIndex: 0, type: 'number.kt' },
				{ startIndex: 1, type: 'identifier.kt' }
			]
		}
	],

	[
		{
			line: '0x123',
			tokens: [{ startIndex: 0, type: 'number.hex.kt' }]
		}
	],

	[
		{
			line: '0x5_2',
			tokens: [{ startIndex: 0, type: 'number.hex.kt' }]
		}
	],

	[
		{
			line: '0Xff_81_00L',
			tokens: [{ startIndex: 0, type: 'number.hex.kt' }]
		}
	],

	[
		{
			line: '0x123u',
			tokens: [{ startIndex: 0, type: 'number.hex.kt' }]
		}
	],

	[
		{
			line: '0x123U',
			tokens: [{ startIndex: 0, type: 'number.hex.kt' }]
		}
	],

	[
		{
			line: '0x123uL',
			tokens: [{ startIndex: 0, type: 'number.hex.kt' }]
		}
	],

	[
		{
			line: '0x123UL',
			tokens: [{ startIndex: 0, type: 'number.hex.kt' }]
		}
	],

	[
		{
			line: '023L',
			tokens: [{ startIndex: 0, type: 'number.kt' }]
		}
	],

	[
		{
			line: '0123l',
			tokens: [
				{ startIndex: 0, type: 'number.kt' },
				{ startIndex: 4, type: 'identifier.kt' }
			]
		}
	],

	[
		{
			line: '05_2',
			tokens: [{ startIndex: 0, type: 'number.kt' }]
		}
	],

	[
		{
			line: '0b1010_0101',
			tokens: [{ startIndex: 0, type: 'number.binary.kt' }]
		}
	],

	[
		{
			line: '0B001',
			tokens: [{ startIndex: 0, type: 'number.binary.kt' }]
		}
	],

	[
		{
			line: '0b0101L',
			tokens: [{ startIndex: 0, type: 'number.binary.kt' }]
		}
	],

	[
		{
			line: '0B0101u',
			tokens: [{ startIndex: 0, type: 'number.binary.kt' }]
		}
	],

	[
		{
			line: '0B1__0U',
			tokens: [{ startIndex: 0, type: 'number.binary.kt' }]
		}
	],

	[
		{
			line: '0B0101uL',
			tokens: [{ startIndex: 0, type: 'number.binary.kt' }]
		}
	],

	[
		{
			line: '0B1__0UL',
			tokens: [{ startIndex: 0, type: 'number.binary.kt' }]
		}
	],

	[
		{
			line: '10e3',
			tokens: [{ startIndex: 0, type: 'number.float.kt' }]
		}
	],

	[
		{
			line: '10f',
			tokens: [{ startIndex: 0, type: 'number.float.kt' }]
		}
	],

	[
		{
			line: '23.5',
			tokens: [{ startIndex: 0, type: 'number.float.kt' }]
		}
	],

	[
		{
			line: '23.5e3',
			tokens: [{ startIndex: 0, type: 'number.float.kt' }]
		}
	],

	[
		{
			line: '23.5e-3',
			tokens: [{ startIndex: 0, type: 'number.float.kt' }]
		}
	],

	[
		{
			line: '23.5E3',
			tokens: [{ startIndex: 0, type: 'number.float.kt' }]
		}
	],

	[
		{
			line: '23.5E-3',
			tokens: [{ startIndex: 0, type: 'number.float.kt' }]
		}
	],

	[
		{
			line: '23.5F',
			tokens: [{ startIndex: 0, type: 'number.float.kt' }]
		}
	],

	[
		{
			line: '23.5f',
			tokens: [{ startIndex: 0, type: 'number.float.kt' }]
		}
	],

	[
		{
			line: '.001f',
			tokens: [{ startIndex: 0, type: 'number.float.kt' }]
		}
	],

	[
		{
			line: '23.5D',
			tokens: [
				{ startIndex: 0, type: 'number.float.kt' },
				{ startIndex: 4, type: 'type.identifier.kt' }
			]
		}
	],

	[
		{
			line: '23.5d',
			tokens: [
				{ startIndex: 0, type: 'number.float.kt' },
				{ startIndex: 4, type: 'identifier.kt' }
			]
		}
	],

	[
		{
			line: '1.72E3D',
			tokens: [
				{ startIndex: 0, type: 'number.float.kt' },
				{ startIndex: 6, type: 'type.identifier.kt' }
			]
		}
	],

	[
		{
			line: '1.72E3d',
			tokens: [
				{ startIndex: 0, type: 'number.float.kt' },
				{ startIndex: 6, type: 'identifier.kt' }
			]
		}
	],

	[
		{
			line: '1.72E-3d',
			tokens: [
				{ startIndex: 0, type: 'number.float.kt' },
				{ startIndex: 7, type: 'identifier.kt' }
			]
		}
	],

	[
		{
			line: '1.72e3D',
			tokens: [
				{ startIndex: 0, type: 'number.float.kt' },
				{ startIndex: 6, type: 'type.identifier.kt' }
			]
		}
	],

	[
		{
			line: '1.72e3d',
			tokens: [
				{ startIndex: 0, type: 'number.float.kt' },
				{ startIndex: 6, type: 'identifier.kt' }
			]
		}
	],

	[
		{
			line: '1.72e-3d',
			tokens: [
				{ startIndex: 0, type: 'number.float.kt' },
				{ startIndex: 7, type: 'identifier.kt' }
			]
		}
	],

	[
		{
			line: '23L',
			tokens: [{ startIndex: 0, type: 'number.kt' }]
		}
	],

	[
		{
			line: '23l',
			tokens: [
				{ startIndex: 0, type: 'number.kt' },
				{ startIndex: 2, type: 'identifier.kt' }
			]
		}
	],

	[
		{
			line: '23u',
			tokens: [{ startIndex: 0, type: 'number.kt' }]
		}
	],

	[
		{
			line: '23U',
			tokens: [{ startIndex: 0, type: 'number.kt' }]
		}
	],

	[
		{
			line: '23uL',
			tokens: [{ startIndex: 0, type: 'number.kt' }]
		}
	],

	[
		{
			line: '23UL',
			tokens: [{ startIndex: 0, type: 'number.kt' }]
		}
	],

	[
		{
			line: '0_52',
			tokens: [{ startIndex: 0, type: 'number.kt' }]
		}
	],

	[
		{
			line: '5_2',
			tokens: [{ startIndex: 0, type: 'number.kt' }]
		}
	],

	[
		{
			line: '5_______2',
			tokens: [{ startIndex: 0, type: 'number.kt' }]
		}
	],

	[
		{
			line: '3_.1415F',
			tokens: [
				{ startIndex: 0, type: 'number.kt' },
				{ startIndex: 1, type: 'identifier.kt' },
				{ startIndex: 2, type: 'number.float.kt' }
			]
		}
	],

	[
		{
			line: '3._1415F',
			tokens: [
				{ startIndex: 0, type: 'number.kt' },
				{ startIndex: 1, type: 'delimiter.kt' },
				{ startIndex: 2, type: 'identifier.kt' }
			]
		}
	],

	[
		{
			line: '999_99_9999_L',
			tokens: [
				{ startIndex: 0, type: 'number.kt' },
				{ startIndex: 11, type: 'identifier.kt' }
			]
		}
	],

	[
		{
			line: '52_',
			tokens: [
				{ startIndex: 0, type: 'number.kt' },
				{ startIndex: 2, type: 'identifier.kt' }
			]
		}
	],

	[
		{
			line: '0_x52',
			tokens: [
				{ startIndex: 0, type: 'number.kt' },
				{ startIndex: 1, type: 'identifier.kt' }
			]
		}
	],

	[
		{
			line: '0x_52',
			tokens: [
				{ startIndex: 0, type: 'number.kt' },
				{ startIndex: 1, type: 'identifier.kt' }
			]
		}
	],

	[
		{
			line: '0x52_',
			tokens: [
				{ startIndex: 0, type: 'number.hex.kt' },
				{ startIndex: 4, type: 'identifier.kt' }
			]
		}
	],

	[
		{
			line: '052_',
			tokens: [
				{ startIndex: 0, type: 'number.kt' },
				{ startIndex: 3, type: 'identifier.kt' }
			]
		}
	],

	[
		{
			line: '0+0',
			tokens: [
				{ startIndex: 0, type: 'number.kt' },
				{ startIndex: 1, type: 'delimiter.kt' },
				{ startIndex: 2, type: 'number.kt' }
			]
		}
	],

	[
		{
			line: '100+10',
			tokens: [
				{ startIndex: 0, type: 'number.kt' },
				{ startIndex: 3, type: 'delimiter.kt' },
				{ startIndex: 4, type: 'number.kt' }
			]
		}
	],

	[
		{
			line: '0 + 0',
			tokens: [
				{ startIndex: 0, type: 'number.kt' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.kt' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.kt' }
			]
		}
	],

	// single line Strings
	[
		{
			line: 'var s = "I\'m a Kotlin String"',
			tokens: [
				{ startIndex: 0, type: 'keyword.var.kt' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.kt' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.kt' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'string.kt' }
			]
		}
	],

	[
		{
			line: 'var s = "concatenated" + " String"',
			tokens: [
				{ startIndex: 0, type: 'keyword.var.kt' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.kt' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.kt' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'string.kt' },
				{ startIndex: 22, type: '' },
				{ startIndex: 23, type: 'delimiter.kt' },
				{ startIndex: 24, type: '' },
				{ startIndex: 25, type: 'string.kt' }
			]
		}
	],

	[
		{
			line: '"quote in a string"',
			tokens: [{ startIndex: 0, type: 'string.kt' }]
		}
	],

	[
		{
			line: '"escaping \\"quotes\\" is cool"',
			tokens: [
				{ startIndex: 0, type: 'string.kt' },
				{ startIndex: 10, type: 'string.escape.kt' },
				{ startIndex: 12, type: 'string.kt' },
				{ startIndex: 18, type: 'string.escape.kt' },
				{ startIndex: 20, type: 'string.kt' }
			]
		}
	],

	[
		{
			line: '"\\"',
			tokens: [{ startIndex: 0, type: 'string.invalid.kt' }]
		}
	],

	// Annotations
	[
		{
			line: '@',
			tokens: [{ startIndex: 0, type: '' }]
		}
	],

	[
		{
			line: '@Inject',
			tokens: [{ startIndex: 0, type: 'annotation.kt' }]
		}
	],

	[
		{
			line: '@SuppressWarnings("aString")',
			tokens: [
				{ startIndex: 0, type: 'annotation.kt' },
				{ startIndex: 17, type: 'delimiter.parenthesis.kt' },
				{ startIndex: 18, type: 'string.kt' },
				{ startIndex: 27, type: 'delimiter.parenthesis.kt' }
			]
		}
	],

	[
		{
			line: '@ AnnotationWithKeywordAfter private',
			tokens: [
				{ startIndex: 0, type: 'annotation.kt' },
				{ startIndex: 28, type: '' },
				{ startIndex: 29, type: 'keyword.private.kt' }
			]
		}
	],

	[
		{
			line: 'fun /* /* */ */ main() {',
			tokens: [
				{ startIndex: 0, type: 'keyword.fun.kt' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'comment.kt' },
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'identifier.kt' },
				{ startIndex: 20, type: 'delimiter.parenthesis.kt' },
				{ startIndex: 22, type: '' },
				{ startIndex: 23, type: 'delimiter.curly.kt' }
			]
		}
	],

	[
		{
			line: 'val text = """',
			tokens: [
				{ startIndex: 0, type: 'keyword.val.kt' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.kt' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'delimiter.kt' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'string.kt' }
			]
		},
		{
			line: '    for (c in "foo")',
			tokens: [{ startIndex: 0, type: 'string.kt' }]
		},
		{
			line: '        print(c)',
			tokens: [{ startIndex: 0, type: 'string.kt' }]
		},
		{
			line: '"""',
			tokens: [{ startIndex: 0, type: 'string.kt' }]
		}
	]
]);
