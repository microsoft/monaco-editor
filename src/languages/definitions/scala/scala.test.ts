/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('scala', [
	[
		{
			line: 'var a = 1',
			tokens: [
				{ startIndex: 0, type: 'keyword.scala' },
				{ startIndex: 3, type: 'white.scala' },
				{ startIndex: 4, type: 'variable.scala' },
				{ startIndex: 5, type: 'white.scala' },
				{ startIndex: 6, type: 'operator.scala' },
				{ startIndex: 7, type: 'white.scala' },
				{ startIndex: 8, type: 'number.scala' }
			]
		}
	],

	// Comments - single line
	[
		{
			line: '//',
			tokens: [{ startIndex: 0, type: 'comment.scala' }]
		}
	],

	[
		{
			line: '    // a comment',
			tokens: [
				{ startIndex: 0, type: 'white.scala' },
				{ startIndex: 4, type: 'comment.scala' }
			]
		}
	],

	// Broken nested tokens due to invalid comment tokenization
	[
		{
			line: '/* //*/ a',
			tokens: [{ startIndex: 0, type: 'comment.scala' }]
		}
	],

	[
		{
			line: '// a comment',
			tokens: [{ startIndex: 0, type: 'comment.scala' }]
		}
	],

	[
		{
			line: '//sticky comment',
			tokens: [{ startIndex: 0, type: 'comment.scala' }]
		}
	],

	[
		{
			line: '/almost a comment',
			tokens: [
				{ startIndex: 0, type: 'operator.scala' },
				{ startIndex: 1, type: 'identifier.scala' },
				{ startIndex: 7, type: 'white.scala' },
				{ startIndex: 8, type: 'identifier.scala' },
				{ startIndex: 9, type: 'white.scala' },
				{ startIndex: 10, type: 'identifier.scala' }
			]
		}
	],

	[
		{
			line: '1 / 2; /* comment',
			tokens: [
				{ startIndex: 0, type: 'number.scala' },
				{ startIndex: 1, type: 'white.scala' },
				{ startIndex: 2, type: 'operator.scala' },
				{ startIndex: 3, type: 'white.scala' },
				{ startIndex: 4, type: 'number.scala' },
				{ startIndex: 5, type: 'delimiter.scala' },
				{ startIndex: 6, type: 'white.scala' },
				{ startIndex: 7, type: 'comment.scala' }
			]
		}
	],

	[
		{
			line: 'val x: Int = 1; // my comment // is a nice one',
			tokens: [
				{ startIndex: 0, type: 'keyword.scala' },
				{ startIndex: 3, type: 'white.scala' },
				{ startIndex: 4, type: 'variable.scala' },
				{ startIndex: 5, type: 'operator.scala' },
				{ startIndex: 6, type: 'white.scala' },
				{ startIndex: 7, type: 'type.scala' },
				{ startIndex: 10, type: 'white.scala' },
				{ startIndex: 11, type: 'operator.scala' },
				{ startIndex: 12, type: 'white.scala' },
				{ startIndex: 13, type: 'number.scala' },
				{ startIndex: 14, type: 'delimiter.scala' },
				{ startIndex: 15, type: 'white.scala' },
				{ startIndex: 16, type: 'comment.scala' }
			]
		}
	],

	// Comments - range comment, single line
	[
		{
			line: '/* a simple comment */',
			tokens: [{ startIndex: 0, type: 'comment.scala' }]
		}
	],

	[
		{
			line: 'val x: Int = /* a simple comment */ 1;',
			tokens: [
				{ startIndex: 0, type: 'keyword.scala' },
				{ startIndex: 3, type: 'white.scala' },
				{ startIndex: 4, type: 'variable.scala' },
				{ startIndex: 5, type: 'operator.scala' },
				{ startIndex: 6, type: 'white.scala' },
				{ startIndex: 7, type: 'type.scala' },
				{ startIndex: 10, type: 'white.scala' },
				{ startIndex: 11, type: 'operator.scala' },
				{ startIndex: 12, type: 'white.scala' },
				{ startIndex: 13, type: 'comment.scala' },
				{ startIndex: 35, type: 'white.scala' },
				{ startIndex: 36, type: 'number.scala' },
				{ startIndex: 37, type: 'delimiter.scala' }
			]
		}
	],

	[
		{
			line: 'val x: Int = /* a simple comment */ 1; */',
			tokens: [
				{ startIndex: 0, type: 'keyword.scala' },
				{ startIndex: 3, type: 'white.scala' },
				{ startIndex: 4, type: 'variable.scala' },
				{ startIndex: 5, type: 'operator.scala' },
				{ startIndex: 6, type: 'white.scala' },
				{ startIndex: 7, type: 'type.scala' },
				{ startIndex: 10, type: 'white.scala' },
				{ startIndex: 11, type: 'operator.scala' },
				{ startIndex: 12, type: 'white.scala' },
				{ startIndex: 13, type: 'comment.scala' },
				{ startIndex: 35, type: 'white.scala' },
				{ startIndex: 36, type: 'number.scala' },
				{ startIndex: 37, type: 'delimiter.scala' },
				{ startIndex: 38, type: 'white.scala' },
				{ startIndex: 39, type: 'operator.scala' }
			]
		}
	],

	[
		{
			line: 'x = /**/;',
			tokens: [
				{ startIndex: 0, type: 'identifier.scala' },
				{ startIndex: 1, type: 'white.scala' },
				{ startIndex: 2, type: 'operator.scala' },
				{ startIndex: 3, type: 'white.scala' },
				{ startIndex: 4, type: 'comment.scala' },
				{ startIndex: 8, type: 'delimiter.scala' }
			]
		}
	],

	[
		{
			line: 'x = /*/;',
			tokens: [
				{ startIndex: 0, type: 'identifier.scala' },
				{ startIndex: 1, type: 'white.scala' },
				{ startIndex: 2, type: 'operator.scala' },
				{ startIndex: 3, type: 'white.scala' },
				{ startIndex: 4, type: 'comment.scala' }
			]
		}
	],

	// Comments - range comment, multiple lines
	[
		{
			line: '/* start of multiline comment',
			tokens: [{ startIndex: 0, type: 'comment.scala' }]
		},
		{
			line: 'a comment between without a star',
			tokens: [{ startIndex: 0, type: 'comment.scala' }]
		},
		{
			line: 'end of multiline comment*/',
			tokens: [{ startIndex: 0, type: 'comment.scala' }]
		}
	],

	[
		{
			line: 'val x: Int = /* start a comment',
			tokens: [
				{ startIndex: 0, type: 'keyword.scala' },
				{ startIndex: 3, type: 'white.scala' },
				{ startIndex: 4, type: 'variable.scala' },
				{ startIndex: 5, type: 'operator.scala' },
				{ startIndex: 6, type: 'white.scala' },
				{ startIndex: 7, type: 'type.scala' },
				{ startIndex: 10, type: 'white.scala' },
				{ startIndex: 11, type: 'operator.scala' },
				{ startIndex: 12, type: 'white.scala' },
				{ startIndex: 13, type: 'comment.scala' }
			]
		},
		{
			line: ' a ',
			tokens: [{ startIndex: 0, type: 'comment.scala' }]
		},
		{
			line: 'and end it */ 2;',
			tokens: [
				{ startIndex: 0, type: 'comment.scala' },
				{ startIndex: 13, type: 'white.scala' },
				{ startIndex: 14, type: 'number.scala' },
				{ startIndex: 15, type: 'delimiter.scala' }
			]
		}
	],

	// Scala Doc, multiple lines
	[
		{
			line: '/** start of Scala Doc',
			tokens: [{ startIndex: 0, type: 'comment.scala' }]
		},
		{
			line: 'a comment between without a star',
			tokens: [{ startIndex: 0, type: 'comment.scala' }]
		},
		{
			line: 'end of multiline comment*/',
			tokens: [{ startIndex: 0, type: 'comment.scala' }]
		}
	],

	// Keywords
	[
		{
			line: 'package test; object Program { def main(args: Array[String]): Unit = {} }',
			tokens: [
				{ startIndex: 0, type: 'keyword.scala' },
				{ startIndex: 7, type: 'white.scala' },
				{ startIndex: 8, type: 'identifier.scala' },
				{ startIndex: 12, type: 'delimiter.scala' },
				{ startIndex: 13, type: 'white.scala' },
				{ startIndex: 14, type: 'keyword.scala' },
				{ startIndex: 20, type: 'white.scala' },
				{ startIndex: 21, type: 'type.scala' },
				{ startIndex: 28, type: 'white.scala' },
				{ startIndex: 29, type: 'delimiter.curly.scala' },
				{ startIndex: 30, type: 'white.scala' },
				{ startIndex: 31, type: 'keyword.scala' },
				{ startIndex: 34, type: 'white.scala' },
				{ startIndex: 35, type: 'identifier.scala' },
				{ startIndex: 39, type: 'delimiter.parenthesis.scala' },
				{ startIndex: 40, type: 'variable.scala' },
				{ startIndex: 44, type: 'operator.scala' },
				{ startIndex: 45, type: 'white.scala' },
				{ startIndex: 46, type: 'type.scala' },
				{ startIndex: 51, type: 'operator.square.scala' },
				{ startIndex: 52, type: 'type.scala' },
				{ startIndex: 58, type: 'operator.square.scala' },
				{ startIndex: 59, type: 'delimiter.parenthesis.scala' },
				{ startIndex: 60, type: 'operator.scala' },
				{ startIndex: 61, type: 'white.scala' },
				{ startIndex: 62, type: 'type.scala' },
				{ startIndex: 66, type: 'white.scala' },
				{ startIndex: 67, type: 'operator.scala' },
				{ startIndex: 68, type: 'white.scala' },
				{ startIndex: 69, type: 'delimiter.curly.scala' },
				{ startIndex: 71, type: 'white.scala' },
				{ startIndex: 72, type: 'delimiter.curly.scala' }
			]
		}
	],

	// Numbers
	[
		{
			line: '0',
			tokens: [{ startIndex: 0, type: 'number.scala' }]
		}
	],

	[
		{
			line: '0.10',
			tokens: [{ startIndex: 0, type: 'number.float.scala' }]
		}
	],

	[
		{
			line: '0x',
			tokens: [
				{ startIndex: 0, type: 'number.scala' },
				{ startIndex: 1, type: 'identifier.scala' }
			]
		}
	],

	[
		{
			line: '0x123',
			tokens: [{ startIndex: 0, type: 'number.hex.scala' }]
		}
	],

	[
		{
			line: '0x5_2',
			tokens: [{ startIndex: 0, type: 'number.hex.scala' }]
		}
	],

	[
		{
			line: '10e3',
			tokens: [{ startIndex: 0, type: 'number.float.scala' }]
		}
	],

	[
		{
			line: '10f',
			tokens: [{ startIndex: 0, type: 'number.float.scala' }]
		}
	],

	[
		{
			line: '23.5',
			tokens: [{ startIndex: 0, type: 'number.float.scala' }]
		}
	],

	[
		{
			line: '23.5e3',
			tokens: [{ startIndex: 0, type: 'number.float.scala' }]
		}
	],

	[
		{
			line: '23.5e-3',
			tokens: [{ startIndex: 0, type: 'number.float.scala' }]
		}
	],

	[
		{
			line: '23.5E3',
			tokens: [{ startIndex: 0, type: 'number.float.scala' }]
		}
	],

	[
		{
			line: '23.5E-3',
			tokens: [{ startIndex: 0, type: 'number.float.scala' }]
		}
	],

	[
		{
			line: '23.5F',
			tokens: [{ startIndex: 0, type: 'number.float.scala' }]
		}
	],

	[
		{
			line: '23.5f',
			tokens: [{ startIndex: 0, type: 'number.float.scala' }]
		}
	],

	[
		{
			line: '23.5D',
			tokens: [{ startIndex: 0, type: 'number.float.scala' }]
		}
	],

	[
		{
			line: '23.5d',
			tokens: [{ startIndex: 0, type: 'number.float.scala' }]
		}
	],

	[
		{
			line: '1.72E3D',
			tokens: [{ startIndex: 0, type: 'number.float.scala' }]
		}
	],

	[
		{
			line: '1.72E3d',
			tokens: [{ startIndex: 0, type: 'number.float.scala' }]
		}
	],

	[
		{
			line: '1.72E-3d',
			tokens: [{ startIndex: 0, type: 'number.float.scala' }]
		}
	],

	[
		{
			line: '1.72e3D',
			tokens: [{ startIndex: 0, type: 'number.float.scala' }]
		}
	],

	[
		{
			line: '1.72e3d',
			tokens: [{ startIndex: 0, type: 'number.float.scala' }]
		}
	],

	[
		{
			line: '1.72e-3d',
			tokens: [{ startIndex: 0, type: 'number.float.scala' }]
		}
	],

	[
		{
			line: '23L',
			tokens: [{ startIndex: 0, type: 'number.scala' }]
		}
	],

	[
		{
			line: '23l',
			tokens: [{ startIndex: 0, type: 'number.scala' }]
		}
	],

	[
		{
			line: '5_2',
			tokens: [{ startIndex: 0, type: 'number.scala' }]
		}
	],

	[
		{
			line: '5_______2',
			tokens: [{ startIndex: 0, type: 'number.scala' }]
		}
	],

	[
		{
			line: '3_.1415F',
			tokens: [
				{ startIndex: 0, type: 'number.scala' },
				{ startIndex: 1, type: 'keyword.scala' },
				{ startIndex: 2, type: 'delimiter.scala' },
				{ startIndex: 3, type: 'number.float.scala' }
			]
		}
	],

	[
		{
			line: '3._1415F',
			tokens: [
				{ startIndex: 0, type: 'number.scala' },
				{ startIndex: 1, type: 'operator.scala' },
				{ startIndex: 2, type: 'identifier.scala' }
			]
		}
	],

	[
		{
			line: '999_99_9999_L',
			tokens: [
				{ startIndex: 0, type: 'number.scala' },
				{ startIndex: 11, type: 'identifier.scala' }
			]
		}
	],

	[
		{
			line: '52_',
			tokens: [
				{ startIndex: 0, type: 'number.scala' },
				{ startIndex: 2, type: 'keyword.scala' }
			]
		}
	],

	[
		{
			line: '0_x52',
			tokens: [
				{ startIndex: 0, type: 'number.scala' },
				{ startIndex: 1, type: 'identifier.scala' }
			]
		}
	],

	[
		{
			line: '0x_52',
			tokens: [
				{ startIndex: 0, type: 'number.scala' },
				{ startIndex: 1, type: 'identifier.scala' }
			]
		}
	],

	[
		{
			line: '0x52_',
			tokens: [
				{ startIndex: 0, type: 'number.hex.scala' },
				{ startIndex: 4, type: 'keyword.scala' } // TODO
			]
		}
	],

	[
		{
			line: '23.5L',
			tokens: [
				{ startIndex: 0, type: 'number.float.scala' },
				{ startIndex: 4, type: 'type.scala' }
			]
		}
	],

	[
		{
			line: '0+0',
			tokens: [
				{ startIndex: 0, type: 'number.scala' },
				{ startIndex: 1, type: 'operator.scala' },
				{ startIndex: 2, type: 'number.scala' }
			]
		}
	],

	[
		{
			line: '100+10',
			tokens: [
				{ startIndex: 0, type: 'number.scala' },
				{ startIndex: 3, type: 'operator.scala' },
				{ startIndex: 4, type: 'number.scala' }
			]
		}
	],

	[
		{
			line: '0 + 0',
			tokens: [
				{ startIndex: 0, type: 'number.scala' },
				{ startIndex: 1, type: 'white.scala' },
				{ startIndex: 2, type: 'operator.scala' },
				{ startIndex: 3, type: 'white.scala' },
				{ startIndex: 4, type: 'number.scala' }
			]
		}
	],

	// single line Strings
	[
		{
			line: 'val s: String = "I\'m a Scala String";',
			tokens: [
				{ startIndex: 0, type: 'keyword.scala' },
				{ startIndex: 3, type: 'white.scala' },
				{ startIndex: 4, type: 'variable.scala' },
				{ startIndex: 5, type: 'operator.scala' },
				{ startIndex: 6, type: 'white.scala' },
				{ startIndex: 7, type: 'type.scala' },
				{ startIndex: 13, type: 'white.scala' },
				{ startIndex: 14, type: 'operator.scala' },
				{ startIndex: 15, type: 'white.scala' },
				{ startIndex: 16, type: 'string.quote.scala' },
				{ startIndex: 17, type: 'string.scala' },
				{ startIndex: 35, type: 'string.quote.scala' },
				{ startIndex: 36, type: 'delimiter.scala' }
			]
		}
	],

	[
		{
			line: 'val s: String = "concatenated" + " String" ;',
			tokens: [
				{ startIndex: 0, type: 'keyword.scala' },
				{ startIndex: 3, type: 'white.scala' },
				{ startIndex: 4, type: 'variable.scala' },
				{ startIndex: 5, type: 'operator.scala' },
				{ startIndex: 6, type: 'white.scala' },
				{ startIndex: 7, type: 'type.scala' },
				{ startIndex: 13, type: 'white.scala' },
				{ startIndex: 14, type: 'operator.scala' },
				{ startIndex: 15, type: 'white.scala' },
				{ startIndex: 16, type: 'string.quote.scala' },
				{ startIndex: 17, type: 'string.scala' },
				{ startIndex: 29, type: 'string.quote.scala' },
				{ startIndex: 30, type: 'white.scala' },
				{ startIndex: 31, type: 'operator.scala' },
				{ startIndex: 32, type: 'white.scala' },
				{ startIndex: 33, type: 'string.quote.scala' },
				{ startIndex: 34, type: 'string.scala' },
				{ startIndex: 41, type: 'string.quote.scala' },
				{ startIndex: 42, type: 'white.scala' },
				{ startIndex: 43, type: 'delimiter.scala' }
			]
		}
	],

	[
		{
			line: '"quote in a string"',
			tokens: [
				{ startIndex: 0, type: 'string.quote.scala' },
				{ startIndex: 1, type: 'string.scala' },
				{ startIndex: 18, type: 'string.quote.scala' }
			]
		}
	],

	[
		{
			line: '"escaping \\"quotes\\" is cool"',
			tokens: [
				{ startIndex: 0, type: 'string.quote.scala' },
				{ startIndex: 1, type: 'string.scala' },
				{ startIndex: 10, type: 'string.escape.scala' },
				{ startIndex: 12, type: 'string.scala' },
				{ startIndex: 18, type: 'string.escape.scala' },
				{ startIndex: 20, type: 'string.scala' },
				{ startIndex: 28, type: 'string.quote.scala' }
			]
		}
	],

	[
		{
			line: '"\\"',
			tokens: [
				{ startIndex: 0, type: 'string.quote.scala' },
				{ startIndex: 1, type: 'string.escape.scala' }
			]
		}
	],

	// Annotations
	[
		{
			line: '@',
			tokens: [{ startIndex: 0, type: 'operator.scala' }]
		}
	],

	[
		{
			line: '@uncheckedStable',
			tokens: [{ startIndex: 0, type: 'annotation.scala' }]
		}
	],

	[
		{
			line: '@silent("deprecated")',
			tokens: [
				{ startIndex: 0, type: 'annotation.scala' },
				{ startIndex: 7, type: 'delimiter.parenthesis.scala' },
				{ startIndex: 8, type: 'string.quote.scala' },
				{ startIndex: 9, type: 'string.scala' },
				{ startIndex: 19, type: 'string.quote.scala' },
				{ startIndex: 20, type: 'delimiter.parenthesis.scala' }
			]
		}
	],

	[
		{
			line: '@AnnotationWithKeywordAfter private',
			tokens: [
				{ startIndex: 0, type: 'annotation.scala' },
				{ startIndex: 27, type: 'white.scala' },
				{ startIndex: 28, type: 'keyword.modifier.scala' }
			]
		}
	]
]);
