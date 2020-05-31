/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { testTokenization } from '../test/testRunner';

testTokenization('scala', [
	// Comments - single line
	[{
		line: '//',
		tokens: [
			{ startIndex: 0, type: 'comment.scala' }
		]
	}],

	[{
		line: '    // a comment',
		tokens: [
			{ startIndex: 0, type: '' },
			{ startIndex: 4, type: 'comment.scala' }
		]
	}],

	// Broken nested tokens due to invalid comment tokenization
	[{
		line: '/* //*/ a',
		tokens: [
			{ startIndex: 0, type: 'comment.scala' },
			{ startIndex: 7, type: '' },
			{ startIndex: 8, type: 'identifier.scala' }
		]
	}],

	[{
		line: '// a comment',
		tokens: [
			{ startIndex: 0, type: 'comment.scala' }
		]
	}],

	[{
		line: '//sticky comment',
		tokens: [
			{ startIndex: 0, type: 'comment.scala' }
		]
	}],

	[{
		line: '/almost a comment',
		tokens: [
			{ startIndex: 0, type: 'delimiter.scala' },
			{ startIndex: 1, type: 'identifier.scala' },
			{ startIndex: 7, type: '' },
			{ startIndex: 8, type: 'identifier.scala' },
			{ startIndex: 9, type: '' },
			{ startIndex: 10, type: 'identifier.scala' }
		]
	}],

	[{
		line: '1 / 2; /* comment',
		tokens: [
			{ startIndex: 0, type: 'number.scala' },
			{ startIndex: 1, type: '' },
			{ startIndex: 2, type: 'delimiter.scala' },
			{ startIndex: 3, type: '' },
			{ startIndex: 4, type: 'number.scala' },
			{ startIndex: 5, type: 'delimiter.scala' },
			{ startIndex: 6, type: '' },
			{ startIndex: 7, type: 'comment.scala' }
		]
	}],

	[{
		line: 'val x: Int = 1; // my comment // is a nice one',
		tokens: [
			{ startIndex: 0, type: 'keyword.val.scala' },
			{ startIndex: 3, type: '' },
			{ startIndex: 4, type: 'identifier.scala' },
			{ startIndex: 5, type: 'delimiter.scala' },
			{ startIndex: 6, type: '' },
			{ startIndex: 7, type: 'keyword.Int.scala' },
			{ startIndex: 10, type: '' },
			{ startIndex: 11, type: 'delimiter.scala' },
			{ startIndex: 12, type: '' },
			{ startIndex: 13, type: 'number.scala' },
			{ startIndex: 14, type: 'delimiter.scala' },
			{ startIndex: 15, type: '' },
			{ startIndex: 16, type: 'comment.scala' }
		]
	}],

	// Comments - range comment, single line
	[{
		line: '/* a simple comment */',
		tokens: [
			{ startIndex: 0, type: 'comment.scala' }
		]
	}],

	[{
		line: 'val x: Int = /* a simple comment */ 1;',
		tokens: [
			{ startIndex: 0, type: 'keyword.val.scala' },
			{ startIndex: 3, type: '' },
			{ startIndex: 4, type: 'identifier.scala' },
			{ startIndex: 5, type: 'delimiter.scala' },
			{ startIndex: 6, type: '' },
			{ startIndex: 7, type: 'keyword.Int.scala' },
			{ startIndex: 10, type: '' },
			{ startIndex: 11, type: 'delimiter.scala' },
			{ startIndex: 12, type: '' },
			{ startIndex: 13, type: 'comment.scala' },
			{ startIndex: 35, type: '' },
			{ startIndex: 36, type: 'number.scala' },
			{ startIndex: 37, type: 'delimiter.scala' }
		]
	}],

	[{
		line: 'val x: Int = /* a simple comment */ 1; */',
		tokens: [
			{ startIndex: 0, type: 'keyword.val.scala' },
			{ startIndex: 3, type: '' },
			{ startIndex: 4, type: 'identifier.scala' },
			{ startIndex: 5, type: 'delimiter.scala' },
			{ startIndex: 6, type: '' },
			{ startIndex: 7, type: 'keyword.Int.scala' },
			{ startIndex: 10, type: '' },
			{ startIndex: 11, type: 'delimiter.scala' },
			{ startIndex: 12, type: '' },
			{ startIndex: 13, type: 'comment.scala' },
			{ startIndex: 35, type: '' },
			{ startIndex: 36, type: 'number.scala' },
			{ startIndex: 37, type: 'delimiter.scala' },
			{ startIndex: 38, type: '' }
		]
	}],

	[{
		line: 'x = /**/;',
		tokens: [
			{ startIndex: 0, type: 'identifier.scala' },
			{ startIndex: 1, type: '' },
			{ startIndex: 2, type: 'delimiter.scala' },
			{ startIndex: 3, type: '' },
			{ startIndex: 4, type: 'comment.scala' },
			{ startIndex: 8, type: 'delimiter.scala' }
		]
	}],

	[{
		line: 'x = /*/;',
		tokens: [
			{ startIndex: 0, type: 'identifier.scala' },
			{ startIndex: 1, type: '' },
			{ startIndex: 2, type: 'delimiter.scala' },
			{ startIndex: 3, type: '' },
			{ startIndex: 4, type: 'comment.scala' }
		]
	}],

	// Comments - range comment, multiple lines
	[{
		line: '/* start of multiline comment',
		tokens: [
			{ startIndex: 0, type: 'comment.scala' }
		]
	}, {
		line: 'a comment between without a star',
		tokens: [
			{ startIndex: 0, type: 'comment.scala' }
		]
	}, {
		line: 'end of multiline comment*/',
		tokens: [
			{ startIndex: 0, type: 'comment.scala' }
		]
	}],

	[{
		line: 'val x: Int = /* start a comment',
		tokens: [
			{ startIndex: 0, type: 'keyword.val.scala' },
			{ startIndex: 3, type: '' },
			{ startIndex: 4, type: 'identifier.scala' },
			{ startIndex: 5, type: 'delimiter.scala' },
			{ startIndex: 6, type: '' },
			{ startIndex: 7, type: 'keyword.Int.scala' },
			{ startIndex: 10, type: '' },
			{ startIndex: 11, type: 'delimiter.scala' },
			{ startIndex: 12, type: '' },
			{ startIndex: 13, type: 'comment.scala' },
		]
	}, {
		line: ' a ',
		tokens: [
			{ startIndex: 0, type: 'comment.scala' },
		]
	}, {
		line: 'and end it */ 2;',
		tokens: [
			{ startIndex: 0, type: 'comment.scala' },
			{ startIndex: 13, type: '' },
			{ startIndex: 14, type: 'number.scala' },
			{ startIndex: 15, type: 'delimiter.scala' }
		]
	}],

	// Scala Doc, multiple lines
	[{
		line: '/** start of Scala Doc',
		tokens: [
			{ startIndex: 0, type: 'comment.doc.scala' }
		]
	}, {
		line: 'a comment between without a star',
		tokens: [
			{ startIndex: 0, type: 'comment.doc.scala' }
		]
	}, {
		line: 'end of multiline comment*/',
		tokens: [
			{ startIndex: 0, type: 'comment.doc.scala' }
		]
	}],

	// Keywords
	[{
		line: 'package test; object Program { def main(args: Array[String]): Unit = {} }',
		tokens: [
			{ startIndex: 0, type: 'keyword.package.scala' },
			{ startIndex: 7, type: '' },
			{ startIndex: 8, type: 'identifier.scala' },
			{ startIndex: 12, type: 'delimiter.scala' },
			{ startIndex: 13, type: '' },
			{ startIndex: 14, type: 'keyword.object.scala' },
			{ startIndex: 20, type: '' },
			{ startIndex: 21, type: 'identifier.scala' },
			{ startIndex: 28, type: '' },
			{ startIndex: 29, type: 'delimiter.curly.scala' },
			{ startIndex: 30, type: '' },
			{ startIndex: 31, type: 'keyword.def.scala' },
			{ startIndex: 34, type: '' },
			{ startIndex: 35, type: 'identifier.scala' },
			{ startIndex: 39, type: 'delimiter.parenthesis.scala' },
			{ startIndex: 40, type: 'identifier.scala' },
			{ startIndex: 44, type: 'delimiter.scala' },
			{ startIndex: 45, type: '' },
			{ startIndex: 46, type: 'identifier.scala' },
			{ startIndex: 51, type: 'delimiter.square.scala' },
			{ startIndex: 52, type: 'identifier.scala' },
			{ startIndex: 58, type: 'delimiter.square.scala' },
			{ startIndex: 59, type: 'delimiter.parenthesis.scala' },
			{ startIndex: 60, type: 'delimiter.scala' },
			{ startIndex: 61, type: '' },
			{ startIndex: 62, type: 'keyword.Unit.scala' },
			{ startIndex: 66, type: '' },
			{ startIndex: 67, type: 'delimiter.scala' },
			{ startIndex: 68, type: '' },
			{ startIndex: 69, type: 'delimiter.curly.scala' },
			{ startIndex: 71, type: '' },
			{ startIndex: 72, type: 'delimiter.curly.scala' }
		]
	}],

	// Numbers
	[{
		line: '0',
		tokens: [
			{ startIndex: 0, type: 'number.scala' }
		]
	}],

	[{
		line: '0.10',
		tokens: [
			{ startIndex: 0, type: 'number.float.scala' }
		]
	}],

	[{
		line: '0x',
		tokens: [
			{ startIndex: 0, type: 'number.scala' },
			{ startIndex: 1, type: 'identifier.scala' }
		]
	}],

	[{
		line: '0x123',
		tokens: [
			{ startIndex: 0, type: 'number.hex.scala' }
		]
	}],

	[{
		line: '0x5_2',
		tokens: [
			{ startIndex: 0, type: 'number.hex.scala' }
		]
	}],

	[{
		line: '10e3',
		tokens: [
			{ startIndex: 0, type: 'number.float.scala' }
		]
	}],

	[{
		line: '10f',
		tokens: [
			{ startIndex: 0, type: 'number.float.scala' }
		]
	}],

	[{
		line: '23.5',
		tokens: [
			{ startIndex: 0, type: 'number.float.scala' }
		]
	}],

	[{
		line: '23.5e3',
		tokens: [
			{ startIndex: 0, type: 'number.float.scala' }
		]
	}],

	[{
		line: '23.5e-3',
		tokens: [
			{ startIndex: 0, type: 'number.float.scala' }
		]
	}],

	[{
		line: '23.5E3',
		tokens: [
			{ startIndex: 0, type: 'number.float.scala' }
		]
	}],

	[{
		line: '23.5E-3',
		tokens: [
			{ startIndex: 0, type: 'number.float.scala' }
		]
	}],

	[{
		line: '23.5F',
		tokens: [
			{ startIndex: 0, type: 'number.float.scala' }
		]
	}],

	[{
		line: '23.5f',
		tokens: [
			{ startIndex: 0, type: 'number.float.scala' }
		]
	}],

	[{
		line: '23.5D',
		tokens: [
			{ startIndex: 0, type: 'number.float.scala' }
		]
	}],

	[{
		line: '23.5d',
		tokens: [
			{ startIndex: 0, type: 'number.float.scala' }
		]
	}],

	[{
		line: '1.72E3D',
		tokens: [
			{ startIndex: 0, type: 'number.float.scala' }
		]
	}],

	[{
		line: '1.72E3d',
		tokens: [
			{ startIndex: 0, type: 'number.float.scala' }
		]
	}],

	[{
		line: '1.72E-3d',
		tokens: [
			{ startIndex: 0, type: 'number.float.scala' }
		]
	}],

	[{
		line: '1.72e3D',
		tokens: [
			{ startIndex: 0, type: 'number.float.scala' }
		]
	}],

	[{
		line: '1.72e3d',
		tokens: [
			{ startIndex: 0, type: 'number.float.scala' }
		]
	}],

	[{
		line: '1.72e-3d',
		tokens: [
			{ startIndex: 0, type: 'number.float.scala' }
		]
	}],

	[{
		line: '23L',
		tokens: [
			{ startIndex: 0, type: 'number.scala' }
		]
	}],

	[{
		line: '23l',
		tokens: [
			{ startIndex: 0, type: 'number.scala' }
		]
	}],

	[{
		line: '5_2',
		tokens: [
			{ startIndex: 0, type: 'number.scala' }
		]
	}],

	[{
		line: '5_______2',
		tokens: [
			{ startIndex: 0, type: 'number.scala' }
		]
	}],

	[{
		line: '3_.1415F',
		tokens: [
			{ startIndex: 0, type: 'number.scala' },
			{ startIndex: 1, type: 'identifier.scala' },
			{ startIndex: 2, type: 'delimiter.scala' },
			{ startIndex: 3, type: 'number.float.scala' }
		]
	}],

	[{
		line: '3._1415F',
		tokens: [
			{ startIndex: 0, type: 'number.scala' },
			{ startIndex: 1, type: 'delimiter.scala' },
			{ startIndex: 2, type: 'identifier.scala' }
		]
	}],

	[{
		line: '999_99_9999_L',
		tokens: [
			{ startIndex: 0, type: 'number.scala' },
			{ startIndex: 11, type: 'identifier.scala' }
		]
	}],

	[{
		line: '52_',
		tokens: [
			{ startIndex: 0, type: 'number.scala' },
			{ startIndex: 2, type: 'identifier.scala' }
		]
	}],

	[{
		line: '0_x52',
		tokens: [
			{ startIndex: 0, type: 'number.scala' },
			{ startIndex: 1, type: 'identifier.scala' }
		]
	}],

	[{
		line: '0x_52',
		tokens: [
			{ startIndex: 0, type: 'number.scala' },
			{ startIndex: 1, type: 'identifier.scala' }
		]
	}],

	[{
		line: '0x52_',
		tokens: [
			{ startIndex: 0, type: 'number.hex.scala' },
			{ startIndex: 4, type: 'identifier.scala' }
		]
	}],

	[{
		line: '23.5L',
		tokens: [
			{ startIndex: 0, type: 'number.float.scala' },
			{ startIndex: 4, type: 'identifier.scala' }
		]
	}],

	[{
		line: '0+0',
		tokens: [
			{ startIndex: 0, type: 'number.scala' },
			{ startIndex: 1, type: 'delimiter.scala' },
			{ startIndex: 2, type: 'number.scala' }
		]
	}],

	[{
		line: '100+10',
		tokens: [
			{ startIndex: 0, type: 'number.scala' },
			{ startIndex: 3, type: 'delimiter.scala' },
			{ startIndex: 4, type: 'number.scala' }
		]
	}],

	[{
		line: '0 + 0',
		tokens: [
			{ startIndex: 0, type: 'number.scala' },
			{ startIndex: 1, type: '' },
			{ startIndex: 2, type: 'delimiter.scala' },
			{ startIndex: 3, type: '' },
			{ startIndex: 4, type: 'number.scala' }
		]
	}],

	// single line Strings
	[{
		line: 'val s: String = "I\'m a Scala String";',
		tokens: [
			{ startIndex: 0, type: 'keyword.val.scala' },
			{ startIndex: 3, type: '' },
			{ startIndex: 4, type: 'identifier.scala' },
			{ startIndex: 5, type: 'delimiter.scala' },
			{ startIndex: 6, type: '' },
			{ startIndex: 7, type: 'identifier.scala' },
			{ startIndex: 13, type: '' },
			{ startIndex: 14, type: 'delimiter.scala' },
			{ startIndex: 15, type: '' },
			{ startIndex: 16, type: 'string.scala' },
			{ startIndex: 36, type: 'delimiter.scala' }
		]
	}],

	[{
		line: 'val s: String = "concatenated" + " String" ;',
		tokens: [
			{ startIndex: 0, type: 'keyword.val.scala' },
			{ startIndex: 3, type: '' },
			{ startIndex: 4, type: 'identifier.scala' },
			{ startIndex: 5, type: 'delimiter.scala' },
			{ startIndex: 6, type: '' },
			{ startIndex: 7, type: 'identifier.scala' },
			{ startIndex: 13, type: '' },
			{ startIndex: 14, type: 'delimiter.scala' },
			{ startIndex: 15, type: '' },
			{ startIndex: 16, type: 'string.scala' },
			{ startIndex: 30, type: '' },
			{ startIndex: 31, type: 'delimiter.scala' },
			{ startIndex: 32, type: '' },
			{ startIndex: 33, type: 'string.scala' },
			{ startIndex: 42, type: '' },
			{ startIndex: 43, type: 'delimiter.scala' }
		]
	}],

	[{
		line: '"quote in a string"',
		tokens: [
			{ startIndex: 0, type: 'string.scala' }
		]
	}],

	[{
		line: '"escaping \\"quotes\\" is cool"',
		tokens: [
			{ startIndex: 0, type: 'string.scala' },
			{ startIndex: 10, type: 'string.escape.scala' },
			{ startIndex: 12, type: 'string.scala' },
			{ startIndex: 18, type: 'string.escape.scala' },
			{ startIndex: 20, type: 'string.scala' }
		]
	}],

	[{
		line: '"\\"',
		tokens: [
			{ startIndex: 0, type: 'string.invalid.scala' }
		]
	}],

	// Annotations
	[{
		line: '@',
		tokens: [
			{ startIndex: 0, type: '' }
		]
	}],

	[{
		line: '@uncheckedStable',
		tokens: [
			{ startIndex: 0, type: 'annotation.scala' }
		]
	}],

	[{
		line: '@silent("deprecated")',
		tokens: [
			{ startIndex: 0, type: 'annotation.scala' },
			{ startIndex: 7, type: 'delimiter.parenthesis.scala' },
			{ startIndex: 8, type: 'string.scala' },
			{ startIndex: 20, type: 'delimiter.parenthesis.scala' }
		]
	}],

	[{
		line: '@ AnnotationWithKeywordAfter private',
		tokens: [
			{ startIndex: 0, type: 'annotation.scala' },
			{ startIndex: 28, type: '' },
			{ startIndex: 29, type: 'keyword.private.scala' }
		]
	}]
]);

