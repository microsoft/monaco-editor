/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('mips', [
	// Comments
	[
		{
			line: '#',
			tokens: [{ startIndex: 0, type: 'comment.mips' }]
		}
	],

	[
		{
			line: '    # a comment',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'comment.mips' }
			]
		}
	],

	[
		{
			line: '# a comment',
			tokens: [{ startIndex: 0, type: 'comment.mips' }]
		}
	],

	[
		{
			line: '#sticky comment',
			tokens: [{ startIndex: 0, type: 'comment.mips' }]
		}
	],

	[
		{
			line: '$x, 1 # my comment # is a nice one',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.mips' },
				{ startIndex: 2, type: 'delimiter.mips' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.mips' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'comment.mips' }
			]
		}
	],

	[
		{
			line: '$x, 1e #is a exponent number',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.mips' },
				{ startIndex: 2, type: 'delimiter.mips' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.float.mips' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'comment.mips' }
			]
		}
	],

	[
		{
			line: '$x, 0x1F #is a hex number',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.mips' },
				{ startIndex: 2, type: 'delimiter.mips' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.hex.mips' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'comment.mips' }
			]
		}
	],

	// Keywords
	[
		{
			line: 'li $r0, 5',
			tokens: [
				{ startIndex: 0, type: 'keyword.li.mips' },
				{ startIndex: 2, type: '' },
				{ startIndex: 3, type: 'variable.predefined.mips' },
				{ startIndex: 6, type: 'delimiter.mips' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'number.mips' }
			]
		}
	],

	[
		{
			line: '.data # Data declaration',
			tokens: [
				{ startIndex: 0, type: 'keyword..data.mips' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'comment.mips' }
			]
		}
	],

	[
		{
			line: 'even_str: .asciiz "The number is even!" # Output string for even integer',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 8, type: 'delimiter.mips' },
				{ startIndex: 9, type: '' },
				{ startIndex: 18, type: 'string.mips' },
				{ startIndex: 39, type: '' },
				{ startIndex: 40, type: 'comment.mips' }
			]
		}
	],

	[
		{
			line: '    add    ',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'keyword.add.mips' },
				{ startIndex: 7, type: '' }
			]
		}
	],

	// Comments - range comment, single line
	[
		{
			line: '### a simple comment ###',
			tokens: [{ startIndex: 0, type: 'comment.mips' }]
		}
	],

	[
		{
			line: 'move $x, ### a simple comment ### 1',
			tokens: [
				{ startIndex: 0, type: 'keyword.move.mips' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'variable.predefined.mips' },
				{ startIndex: 7, type: 'delimiter.mips' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'comment.mips' }
			]
		}
	],

	[
		{
			line: '$x ###/',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.mips' },
				{ startIndex: 2, type: '' },
				{ startIndex: 3, type: 'comment.mips' }
			]
		}
	],

	// Numbers
	[
		{
			line: '0',
			tokens: [{ startIndex: 0, type: 'number.mips' }]
		}
	],

	[
		{
			line: ' 0',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'number.mips' }
			]
		}
	],

	[
		{
			line: ' 0 ',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'number.mips' },
				{ startIndex: 2, type: '' }
			]
		}
	],

	[
		{
			line: '0 ',
			tokens: [
				{ startIndex: 0, type: 'number.mips' },
				{ startIndex: 1, type: '' }
			]
		}
	],

	[
		{
			line: '0123',
			tokens: [{ startIndex: 0, type: 'number.octal.mips' }]
		}
	],

	[
		{
			line: '01239',
			tokens: [{ startIndex: 0, type: 'number.mips' }]
		}
	],

	[
		{
			line: '0x123',
			tokens: [{ startIndex: 0, type: 'number.hex.mips' }]
		}
	],

	[
		{
			line: '1,2,3',
			tokens: [
				{ startIndex: 0, type: 'number.mips' },
				{ startIndex: 1, type: 'delimiter.mips' },
				{ startIndex: 2, type: 'number.mips' },
				{ startIndex: 3, type: 'delimiter.mips' },
				{ startIndex: 4, type: 'number.mips' }
			]
		}
	]
]);
