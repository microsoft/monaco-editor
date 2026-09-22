/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('apex', [
	// Comments - single line
	[
		{
			line: '//',
			tokens: [{ startIndex: 0, type: 'comment.apex' }]
		}
	],

	[
		{
			line: '    // a comment',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'comment.apex' }
			]
		}
	],

	// Broken nested tokens due to invalid comment tokenization
	[
		{
			line: '/* //*/ a',
			tokens: [
				{ startIndex: 0, type: 'comment.apex' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.apex' }
			]
		}
	],

	[
		{
			line: '// a comment',
			tokens: [{ startIndex: 0, type: 'comment.apex' }]
		}
	],

	[
		{
			line: '//sticky comment',
			tokens: [{ startIndex: 0, type: 'comment.apex' }]
		}
	],

	[
		{
			line: '/almost a comment',
			tokens: [
				{ startIndex: 0, type: 'delimiter.apex' },
				{ startIndex: 1, type: 'identifier.apex' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.apex' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'identifier.apex' }
			]
		}
	],

	[
		{
			line: '1 / 2; /* comment',
			tokens: [
				{ startIndex: 0, type: 'number.apex' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.apex' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.apex' },
				{ startIndex: 5, type: 'delimiter.apex' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'comment.apex' }
			]
		}
	],

	[
		{
			line: 'int x = 1; // my comment // is a nice one',
			tokens: [
				{ startIndex: 0, type: 'keyword.int.apex' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.apex' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.apex' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'number.apex' },
				{ startIndex: 9, type: 'delimiter.apex' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'comment.apex' }
			]
		}
	],

	// Comments - range comment, single line
	[
		{
			line: '/* a simple comment */',
			tokens: [{ startIndex: 0, type: 'comment.apex' }]
		}
	],

	[
		{
			line: 'int x = /* a simple comment */ 1;',
			tokens: [
				{ startIndex: 0, type: 'keyword.int.apex' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.apex' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.apex' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'comment.apex' },
				{ startIndex: 30, type: '' },
				{ startIndex: 31, type: 'number.apex' },
				{ startIndex: 32, type: 'delimiter.apex' }
			]
		}
	],

	[
		{
			line: 'int x = /* comment */ 1; */',
			tokens: [
				{ startIndex: 0, type: 'keyword.int.apex' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.apex' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.apex' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'comment.apex' },
				{ startIndex: 21, type: '' },
				{ startIndex: 22, type: 'number.apex' },
				{ startIndex: 23, type: 'delimiter.apex' },
				{ startIndex: 24, type: '' }
			]
		}
	],

	[
		{
			line: 'x = /**/;',
			tokens: [
				{ startIndex: 0, type: 'identifier.apex' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.apex' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'comment.apex' },
				{ startIndex: 8, type: 'delimiter.apex' }
			]
		}
	],

	[
		{
			line: 'x = /*/;',
			tokens: [
				{ startIndex: 0, type: 'identifier.apex' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.apex' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'comment.apex' }
			]
		}
	],

	// Comments - range comment, multiple lines
	[
		{
			line: '/* start of multiline comment',
			tokens: [{ startIndex: 0, type: 'comment.apex' }]
		},
		{
			line: 'a comment between without a star',
			tokens: [{ startIndex: 0, type: 'comment.apex' }]
		},
		{
			line: 'end of multiline comment*/',
			tokens: [{ startIndex: 0, type: 'comment.apex' }]
		}
	],

	[
		{
			line: 'int x = /* start a comment',
			tokens: [
				{ startIndex: 0, type: 'keyword.int.apex' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.apex' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.apex' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'comment.apex' }
			]
		},
		{
			line: ' a ',
			tokens: [{ startIndex: 0, type: 'comment.apex' }]
		},
		{
			line: 'and end it */ 2;',
			tokens: [
				{ startIndex: 0, type: 'comment.apex' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'number.apex' },
				{ startIndex: 15, type: 'delimiter.apex' }
			]
		}
	],

	// Comments - apex doc, multiple lines
	[
		{
			line: '/** start of Apex Doc',
			tokens: [{ startIndex: 0, type: 'comment.doc.apex' }]
		},
		{
			line: 'a comment between without a star',
			tokens: [{ startIndex: 0, type: 'comment.doc.apex' }]
		},
		{
			line: 'end of multiline comment*/',
			tokens: [{ startIndex: 0, type: 'comment.doc.apex' }]
		}
	],

	// Keywords
	[
		{
			line: 'package test; class Program { static void main(String[] args) {} } }',
			tokens: [
				{ startIndex: 0, type: 'keyword.package.apex' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.apex' },
				{ startIndex: 12, type: 'delimiter.apex' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'keyword.class.apex' },
				{ startIndex: 19, type: '' },
				{ startIndex: 20, type: 'type.identifier.apex' },
				{ startIndex: 27, type: '' },
				{ startIndex: 28, type: 'delimiter.curly.apex' },
				{ startIndex: 29, type: '' },
				{ startIndex: 30, type: 'keyword.static.apex' },
				{ startIndex: 36, type: '' },
				{ startIndex: 37, type: 'keyword.void.apex' },
				{ startIndex: 41, type: '' },
				{ startIndex: 42, type: 'identifier.apex' },
				{ startIndex: 46, type: 'delimiter.parenthesis.apex' },
				{ startIndex: 47, type: 'type.identifier.apex' },
				{ startIndex: 53, type: 'delimiter.square.apex' },
				{ startIndex: 55, type: '' },
				{ startIndex: 56, type: 'identifier.apex' },
				{ startIndex: 60, type: 'delimiter.parenthesis.apex' },
				{ startIndex: 61, type: '' },
				{ startIndex: 62, type: 'delimiter.curly.apex' },
				{ startIndex: 64, type: '' },
				{ startIndex: 65, type: 'delimiter.curly.apex' },
				{ startIndex: 66, type: '' },
				{ startIndex: 67, type: 'delimiter.curly.apex' }
			]
		}
	],

	// Keywords with case variations
	[
		{
			line: 'Package test; CLASS Program { Static void main(String[] args) {} } }',
			tokens: [
				{ startIndex: 0, type: 'keyword.Package.apex' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.apex' },
				{ startIndex: 12, type: 'delimiter.apex' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'keyword.CLASS.apex' },
				{ startIndex: 19, type: '' },
				{ startIndex: 20, type: 'type.identifier.apex' },
				{ startIndex: 27, type: '' },
				{ startIndex: 28, type: 'delimiter.curly.apex' },
				{ startIndex: 29, type: '' },
				{ startIndex: 30, type: 'keyword.Static.apex' },
				{ startIndex: 36, type: '' },
				{ startIndex: 37, type: 'keyword.void.apex' },
				{ startIndex: 41, type: '' },
				{ startIndex: 42, type: 'identifier.apex' },
				{ startIndex: 46, type: 'delimiter.parenthesis.apex' },
				{ startIndex: 47, type: 'type.identifier.apex' },
				{ startIndex: 53, type: 'delimiter.square.apex' },
				{ startIndex: 55, type: '' },
				{ startIndex: 56, type: 'identifier.apex' },
				{ startIndex: 60, type: 'delimiter.parenthesis.apex' },
				{ startIndex: 61, type: '' },
				{ startIndex: 62, type: 'delimiter.curly.apex' },
				{ startIndex: 64, type: '' },
				{ startIndex: 65, type: 'delimiter.curly.apex' },
				{ startIndex: 66, type: '' },
				{ startIndex: 67, type: 'delimiter.curly.apex' }
			]
		}
	],

	// Numbers
	[
		{
			line: '0',
			tokens: [{ startIndex: 0, type: 'number.apex' }]
		}
	],

	[
		{
			line: '0.10',
			tokens: [{ startIndex: 0, type: 'number.float.apex' }]
		}
	],

	[
		{
			line: '0x',
			tokens: [
				{ startIndex: 0, type: 'number.apex' },
				{ startIndex: 1, type: 'identifier.apex' }
			]
		}
	],

	[
		{
			line: '10e3',
			tokens: [{ startIndex: 0, type: 'number.float.apex' }]
		}
	],

	[
		{
			line: '10f',
			tokens: [{ startIndex: 0, type: 'number.float.apex' }]
		}
	],

	[
		{
			line: '23.5',
			tokens: [{ startIndex: 0, type: 'number.float.apex' }]
		}
	],

	[
		{
			line: '23.5e3',
			tokens: [{ startIndex: 0, type: 'number.float.apex' }]
		}
	],

	[
		{
			line: '23.5e-3',
			tokens: [{ startIndex: 0, type: 'number.float.apex' }]
		}
	],

	[
		{
			line: '23.5E3',
			tokens: [{ startIndex: 0, type: 'number.float.apex' }]
		}
	],

	[
		{
			line: '23.5E-3',
			tokens: [{ startIndex: 0, type: 'number.float.apex' }]
		}
	],

	[
		{
			line: '23.5F',
			tokens: [{ startIndex: 0, type: 'number.float.apex' }]
		}
	],

	[
		{
			line: '23.5f',
			tokens: [{ startIndex: 0, type: 'number.float.apex' }]
		}
	],

	[
		{
			line: '23.5D',
			tokens: [{ startIndex: 0, type: 'number.float.apex' }]
		}
	],

	[
		{
			line: '23.5d',
			tokens: [{ startIndex: 0, type: 'number.float.apex' }]
		}
	],

	[
		{
			line: '1.72E3D',
			tokens: [{ startIndex: 0, type: 'number.float.apex' }]
		}
	],

	[
		{
			line: '1.72E3d',
			tokens: [{ startIndex: 0, type: 'number.float.apex' }]
		}
	],

	[
		{
			line: '1.72E-3d',
			tokens: [{ startIndex: 0, type: 'number.float.apex' }]
		}
	],

	[
		{
			line: '1.72e3D',
			tokens: [{ startIndex: 0, type: 'number.float.apex' }]
		}
	],

	[
		{
			line: '1.72e3d',
			tokens: [{ startIndex: 0, type: 'number.float.apex' }]
		}
	],

	[
		{
			line: '1.72e-3d',
			tokens: [{ startIndex: 0, type: 'number.float.apex' }]
		}
	],

	[
		{
			line: '23L',
			tokens: [{ startIndex: 0, type: 'number.apex' }]
		}
	],

	[
		{
			line: '23l',
			tokens: [{ startIndex: 0, type: 'number.apex' }]
		}
	],

	[
		{
			line: '0_52',
			tokens: [{ startIndex: 0, type: 'number.apex' }]
		}
	],

	[
		{
			line: '5_2',
			tokens: [{ startIndex: 0, type: 'number.apex' }]
		}
	],

	[
		{
			line: '5_______2',
			tokens: [{ startIndex: 0, type: 'number.apex' }]
		}
	],

	[
		{
			line: '3_.1415F',
			tokens: [
				{ startIndex: 0, type: 'number.apex' },
				{ startIndex: 1, type: 'identifier.apex' },
				{ startIndex: 2, type: 'delimiter.apex' },
				{ startIndex: 3, type: 'number.float.apex' }
			]
		}
	],

	[
		{
			line: '3._1415F',
			tokens: [
				{ startIndex: 0, type: 'number.apex' },
				{ startIndex: 1, type: 'delimiter.apex' },
				{ startIndex: 2, type: 'identifier.apex' }
			]
		}
	],

	[
		{
			line: '999_99_9999_L',
			tokens: [
				{ startIndex: 0, type: 'number.apex' },
				{ startIndex: 11, type: 'identifier.apex' }
			]
		}
	],

	[
		{
			line: '52_',
			tokens: [
				{ startIndex: 0, type: 'number.apex' },
				{ startIndex: 2, type: 'identifier.apex' }
			]
		}
	],

	[
		{
			line: '0_x52',
			tokens: [
				{ startIndex: 0, type: 'number.apex' },
				{ startIndex: 1, type: 'identifier.apex' }
			]
		}
	],

	[
		{
			line: '0x_52',
			tokens: [
				{ startIndex: 0, type: 'number.apex' },
				{ startIndex: 1, type: 'identifier.apex' }
			]
		}
	],

	[
		{
			line: '23.5L',
			tokens: [
				{ startIndex: 0, type: 'number.float.apex' },
				{ startIndex: 4, type: 'type.identifier.apex' }
			]
		}
	],

	[
		{
			line: '0+0',
			tokens: [
				{ startIndex: 0, type: 'number.apex' },
				{ startIndex: 1, type: 'delimiter.apex' },
				{ startIndex: 2, type: 'number.apex' }
			]
		}
	],

	[
		{
			line: '100+10',
			tokens: [
				{ startIndex: 0, type: 'number.apex' },
				{ startIndex: 3, type: 'delimiter.apex' },
				{ startIndex: 4, type: 'number.apex' }
			]
		}
	],

	[
		{
			line: '0 + 0',
			tokens: [
				{ startIndex: 0, type: 'number.apex' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.apex' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.apex' }
			]
		}
	],

	// single line Strings
	[
		{
			line: 'String s = "I\'m an Apex String";',
			tokens: [
				{ startIndex: 0, type: 'type.identifier.apex' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'identifier.apex' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'delimiter.apex' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'string.apex' },
				{ startIndex: 31, type: 'delimiter.apex' }
			]
		}
	],

	[
		{
			line: 'String s = "concatenated" + " String" ;',
			tokens: [
				{ startIndex: 0, type: 'type.identifier.apex' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'identifier.apex' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'delimiter.apex' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'string.apex' },
				{ startIndex: 25, type: '' },
				{ startIndex: 26, type: 'delimiter.apex' },
				{ startIndex: 27, type: '' },
				{ startIndex: 28, type: 'string.apex' },
				{ startIndex: 37, type: '' },
				{ startIndex: 38, type: 'delimiter.apex' }
			]
		}
	],

	[
		{
			line: '"quote in a string"',
			tokens: [{ startIndex: 0, type: 'string.apex' }]
		}
	],

	[
		{
			line: '"escaping \\"quotes\\" is cool"',
			tokens: [
				{ startIndex: 0, type: 'string.apex' },
				{ startIndex: 10, type: 'string.escape.apex' },
				{ startIndex: 12, type: 'string.apex' },
				{ startIndex: 18, type: 'string.escape.apex' },
				{ startIndex: 20, type: 'string.apex' }
			]
		}
	],

	[
		{
			line: '"\\"',
			tokens: [{ startIndex: 0, type: 'string.invalid.apex' }]
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
			line: '@Override',
			tokens: [{ startIndex: 0, type: 'annotation.apex' }]
		}
	],

	[
		{
			line: '@SuppressWarnings(value = "aString")',
			tokens: [
				{ startIndex: 0, type: 'annotation.apex' },
				{ startIndex: 17, type: 'delimiter.parenthesis.apex' },
				{ startIndex: 18, type: 'identifier.apex' },
				{ startIndex: 23, type: '' },
				{ startIndex: 24, type: 'delimiter.apex' },
				{ startIndex: 25, type: '' },
				{ startIndex: 26, type: 'string.apex' },
				{ startIndex: 35, type: 'delimiter.parenthesis.apex' }
			]
		}
	],

	[
		{
			line: '@ AnnotationWithKeywordAfter private',
			tokens: [
				{ startIndex: 0, type: 'annotation.apex' },
				{ startIndex: 28, type: '' },
				{ startIndex: 29, type: 'keyword.private.apex' }
			]
		}
	]
]);
