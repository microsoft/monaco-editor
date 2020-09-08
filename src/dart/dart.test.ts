/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('dart', [
	// Comments - single line
	[
		{
			line: '//',
			tokens: [{ startIndex: 0, type: 'comment.dart' }]
		}
	],

	[
		{
			line: '    // a comment',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'comment.dart' }
			]
		}
	],

	// Broken nested tokens due to invalid comment tokenization
	[
		{
			line: '/* //*/ a',
			tokens: [
				{ startIndex: 0, type: 'comment.dart' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.dart' }
			]
		}
	],

	[
		{
			line: '// a comment',
			tokens: [{ startIndex: 0, type: 'comment.dart' }]
		}
	],

	[
		{
			line: '//sticky comment',
			tokens: [{ startIndex: 0, type: 'comment.dart' }]
		}
	],

	[
		{
			line: '/almost a comment',
			tokens: [
				{ startIndex: 0, type: 'delimiter.dart' },
				{ startIndex: 1, type: 'identifier.dart' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.dart' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'identifier.dart' }
			]
		}
	],

	[
		{
			line: '1 / 2; /* comment',
			tokens: [
				{ startIndex: 0, type: 'number.dart' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.dart' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.dart' },
				{ startIndex: 5, type: 'delimiter.dart' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'comment.dart' }
			]
		}
	],

	[
		{
			line: 'var x = 1; // my comment // is a nice one',
			tokens: [
				{ startIndex: 0, type: 'keyword.dart' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.dart' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.dart' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'number.dart' },
				{ startIndex: 9, type: 'delimiter.dart' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'comment.dart' }
			]
		}
	],

	// Comments - range comment, single line
	[
		{
			line: '/* a simple comment */',
			tokens: [{ startIndex: 0, type: 'comment.dart' }]
		}
	],

	[
		{
			line: 'var x = /* a simple comment */ 1;',
			tokens: [
				{ startIndex: 0, type: 'keyword.dart' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.dart' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.dart' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'comment.dart' },
				{ startIndex: 30, type: '' },
				{ startIndex: 31, type: 'number.dart' },
				{ startIndex: 32, type: 'delimiter.dart' }
			]
		}
	],

	[
		{
			line: 'var x = /* comment */ 1; */',
			tokens: [
				{ startIndex: 0, type: 'keyword.dart' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.dart' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.dart' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'comment.dart' },
				{ startIndex: 21, type: '' },
				{ startIndex: 22, type: 'number.dart' },
				{ startIndex: 23, type: 'delimiter.dart' },
				{ startIndex: 24, type: '' }
			]
		}
	],

	[
		{
			line: 'x = /**/;',
			tokens: [
				{ startIndex: 0, type: 'identifier.dart' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.dart' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'comment.dart' },
				{ startIndex: 8, type: 'delimiter.dart' }
			]
		}
	],

	[
		{
			line: 'x = /*/;',
			tokens: [
				{ startIndex: 0, type: 'identifier.dart' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.dart' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'comment.dart' }
			]
		}
	],

	// Comments - range comment, multiple lines
	[
		{
			line: '/* start of multiline comment',
			tokens: [{ startIndex: 0, type: 'comment.dart' }]
		},
		{
			line: 'a comment between without a star',
			tokens: [{ startIndex: 0, type: 'comment.dart' }]
		},
		{
			line: 'end of multiline comment*/',
			tokens: [{ startIndex: 0, type: 'comment.dart' }]
		}
	],

	[
		{
			line: 'var x = /* start a comment',
			tokens: [
				{ startIndex: 0, type: 'keyword.dart' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.dart' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.dart' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'comment.dart' }
			]
		},
		{
			line: ' a ',
			tokens: [{ startIndex: 0, type: 'comment.dart' }]
		},
		{
			line: 'and end it */ 2;',
			tokens: [
				{ startIndex: 0, type: 'comment.dart' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'number.dart' },
				{ startIndex: 15, type: 'delimiter.dart' }
			]
		}
	],

	// Keywords
	[
		{
			line: 'var x = function() { };',
			tokens: [
				{ startIndex: 0, type: 'keyword.dart' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.dart' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.dart' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.dart' },
				{ startIndex: 16, type: 'delimiter.parenthesis.dart' },
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'delimiter.bracket.dart' },
				{ startIndex: 20, type: '' },
				{ startIndex: 21, type: 'delimiter.bracket.dart' },
				{ startIndex: 22, type: 'delimiter.dart' }
			]
		}
	],

	[
		{
			line: '    var    ',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'keyword.dart' },
				{ startIndex: 7, type: '' }
			]
		}
	],

	// Numbers
	[
		{
			line: '0',
			tokens: [{ startIndex: 0, type: 'number.dart' }]
		}
	],

	[
		{
			line: '0.10',
			tokens: [{ startIndex: 0, type: 'number.float.dart' }]
		}
	],

	[
		{
			line: '0x',
			tokens: [
				{ startIndex: 0, type: 'number.dart' },
				{ startIndex: 1, type: 'identifier.dart' }
			]
		}
	],

	[
		{
			line: '0x123',
			tokens: [{ startIndex: 0, type: 'number.hex.dart' }]
		}
	],

	[
		{
			line: '0x5_2',
			tokens: [{ startIndex: 0, type: 'number.hex.dart' }]
		}
	],
	[
		{
			line: '0b1010_0101',
			tokens: [{ startIndex: 0, type: 'number.binary.dart' }]
		}
	],

	[
		{
			line: '0B001',
			tokens: [{ startIndex: 0, type: 'number.binary.dart' }]
		}
	],

	[
		{
			line: '10e3',
			tokens: [{ startIndex: 0, type: 'number.float.dart' }]
		}
	],
	[
		{
			line: '23.5',
			tokens: [{ startIndex: 0, type: 'number.float.dart' }]
		}
	],

	[
		{
			line: '23.5e3',
			tokens: [{ startIndex: 0, type: 'number.float.dart' }]
		}
	],

	[
		{
			line: '23.5e-3',
			tokens: [{ startIndex: 0, type: 'number.float.dart' }]
		}
	],

	[
		{
			line: '23.5E3',
			tokens: [{ startIndex: 0, type: 'number.float.dart' }]
		}
	],

	[
		{
			line: '23.5E-3',
			tokens: [{ startIndex: 0, type: 'number.float.dart' }]
		}
	],

	[
		{
			line: '0_52',
			tokens: [{ startIndex: 0, type: 'number.dart' }]
		}
	],

	[
		{
			line: '5_2',
			tokens: [{ startIndex: 0, type: 'number.dart' }]
		}
	],

	[
		{
			line: '5_______2',
			tokens: [{ startIndex: 0, type: 'number.dart' }]
		}
	],
	[
		{
			line: '3._1415F',
			tokens: [
				{ startIndex: 0, type: 'number.dart' },
				{ startIndex: 1, type: 'delimiter.dart' },
				{ startIndex: 2, type: 'identifier.dart' }
			]
		}
	],

	[
		{
			line: '999_99_9999_L',
			tokens: [
				{ startIndex: 0, type: 'number.dart' },
				{ startIndex: 11, type: 'identifier.dart' }
			]
		}
	],

	[
		{
			line: '52_',
			tokens: [
				{ startIndex: 0, type: 'number.dart' },
				{ startIndex: 2, type: 'identifier.dart' }
			]
		}
	],

	[
		{
			line: '0_x52',
			tokens: [
				{ startIndex: 0, type: 'number.dart' },
				{ startIndex: 1, type: 'identifier.dart' }
			]
		}
	],

	[
		{
			line: '0x_52',
			tokens: [
				{ startIndex: 0, type: 'number.dart' },
				{ startIndex: 1, type: 'identifier.dart' }
			]
		}
	],

	[
		{
			line: '0x52_',
			tokens: [
				{ startIndex: 0, type: 'number.hex.dart' },
				{ startIndex: 4, type: 'identifier.dart' }
			]
		}
	],

	[
		{
			line: '052_',
			tokens: [
				{ startIndex: 0, type: 'number.octal.dart' },
				{ startIndex: 3, type: 'identifier.dart' }
			]
		}
	],

	[
		{
			line: '23.5L',
			tokens: [
				{ startIndex: 0, type: 'number.float.dart' },
				{ startIndex: 4, type: 'type.identifier.dart' }
			]
		}
	],

	[
		{
			line: '0+0',
			tokens: [
				{ startIndex: 0, type: 'number.dart' },
				{ startIndex: 1, type: 'delimiter.dart' },
				{ startIndex: 2, type: 'number.dart' }
			]
		}
	],

	[
		{
			line: '100+10',
			tokens: [
				{ startIndex: 0, type: 'number.dart' },
				{ startIndex: 3, type: 'delimiter.dart' },
				{ startIndex: 4, type: 'number.dart' }
			]
		}
	],

	[
		{
			line: '0 + 0',
			tokens: [
				{ startIndex: 0, type: 'number.dart' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.dart' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.dart' }
			]
		}
	],

	// Strings
	[
		{
			line: "var s = 's';",
			tokens: [
				{ startIndex: 0, type: 'keyword.dart' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.dart' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.dart' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'string.dart' },
				{ startIndex: 11, type: 'delimiter.dart' }
			]
		}
	],

	[
		{
			line: 'String s = "concatenated" + " String" ;',
			tokens: [
				{ startIndex: 0, type: 'type.identifier.dart' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'identifier.dart' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'delimiter.dart' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'string.dart' },
				{ startIndex: 25, type: '' },
				{ startIndex: 26, type: 'delimiter.dart' },
				{ startIndex: 27, type: '' },
				{ startIndex: 28, type: 'string.dart' },
				{ startIndex: 37, type: '' },
				{ startIndex: 38, type: 'delimiter.dart' }
			]
		}
	],

	[
		{
			line: '"quote in a string"',
			tokens: [{ startIndex: 0, type: 'string.dart' }]
		}
	],

	[
		{
			line: '"escaping \\"quotes\\" is cool"',
			tokens: [
				{ startIndex: 0, type: 'string.dart' },
				{ startIndex: 10, type: 'string.escape.dart' },
				{ startIndex: 12, type: 'string.dart' },
				{ startIndex: 18, type: 'string.escape.dart' },
				{ startIndex: 20, type: 'string.dart' }
			]
		}
	],

	[
		{
			line: '"\\"',
			tokens: [{ startIndex: 0, type: 'string.invalid.dart' }]
		}
	],

	// Annotations
	[
		{
			line: '@',
			tokens: [{ startIndex: 0, type: 'invalid.dart' }]
		}
	],

	[
		{
			line: '@Override',
			tokens: [{ startIndex: 0, type: 'annotation.dart' }]
		}
	]
]);
