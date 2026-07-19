/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Artyom Shalkhakov. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('postiats', [
	// Keywords
	[
		{
			line: 'implement main(argc, argv) =',
			tokens: [
				{ startIndex: 0, type: 'keyword.pats' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'identifier.pats' },
				{ startIndex: 14, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 15, type: 'identifier.pats' },
				{ startIndex: 19, type: 'delimiter.comma.pats' },
				{ startIndex: 20, type: '' },
				{ startIndex: 21, type: 'identifier.pats' },
				{ startIndex: 25, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 26, type: '' },
				{ startIndex: 27, type: 'keyword.pats' }
			]
		}
	],

	// Comments - single line
	[
		{
			line: '//',
			tokens: [{ startIndex: 0, type: 'comment.pats' }]
		}
	],

	[
		{
			line: '    // a comment',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'comment.pats' }
			]
		}
	],

	[
		{
			line: '// a comment',
			tokens: [{ startIndex: 0, type: 'comment.pats' }]
		}
	],

	[
		{
			line: '//sticky comment',
			tokens: [{ startIndex: 0, type: 'comment.pats' }]
		}
	],

	[
		{
			line: '/almost a comment',
			tokens: [
				{ startIndex: 0, type: 'operator.pats' },
				{ startIndex: 1, type: 'identifier.pats' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.pats' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'identifier.pats' }
			]
		}
	],

	[
		{
			line: '/* //*/ a',
			tokens: [
				{ startIndex: 0, type: 'comment.pats' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.pats' }
			]
		}
	],

	[
		{
			line: '1 / 2; /* comment',
			tokens: [
				{ startIndex: 0, type: 'number.decimal.pats' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'operator.pats' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.decimal.pats' },
				{ startIndex: 5, type: 'delimiter.semicolon.pats' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'comment.pats' }
			]
		}
	],

	[
		{
			line: 'val x:int = 1; // my comment // is a nice one',
			tokens: [
				{ startIndex: 0, type: 'keyword.pats' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.pats' },
				{ startIndex: 5, type: 'keyword.pats' },
				{ startIndex: 6, type: 'type.pats' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'keyword.pats' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'number.decimal.pats' },
				{ startIndex: 13, type: 'delimiter.semicolon.pats' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'comment.pats' }
			]
		}
	],

	// Comments - range comment, single line
	[
		{
			line: '/* a simple comment */',
			tokens: [{ startIndex: 0, type: 'comment.pats' }]
		}
	],

	[
		{
			line: 'var x : int = /* a simple comment */ 1;',
			tokens: [
				{ startIndex: 0, type: 'keyword.pats' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.pats' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'keyword.pats' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'type.pats' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'keyword.pats' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'comment.pats' },
				{ startIndex: 36, type: '' },
				{ startIndex: 37, type: 'number.decimal.pats' },
				{ startIndex: 38, type: 'delimiter.semicolon.pats' }
			]
		}
	],

	[
		{
			line: 'val x = /* comment */ 1; */',
			tokens: [
				{ startIndex: 0, type: 'keyword.pats' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.pats' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'keyword.pats' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'comment.pats' },
				{ startIndex: 21, type: '' },
				{ startIndex: 22, type: 'number.decimal.pats' },
				{ startIndex: 23, type: 'delimiter.semicolon.pats' },
				{ startIndex: 24, type: '' },
				{ startIndex: 25, type: 'operator.pats' }
			]
		}
	],

	[
		{
			line: 'x = /**/;',
			tokens: [
				{ startIndex: 0, type: 'identifier.pats' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'keyword.pats' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'comment.pats' },
				{ startIndex: 8, type: 'delimiter.semicolon.pats' }
			]
		}
	],

	[
		{
			line: 'x = /*/;',
			tokens: [
				{ startIndex: 0, type: 'identifier.pats' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'keyword.pats' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'comment.pats' }
			]
		}
	],

	// block comments, single line
	[
		{
			line: '(* a simple comment *)',
			tokens: [{ startIndex: 0, type: 'comment.pats' }]
		}
	],

	[
		{
			line: '(* a simple (* nested *) comment *)',
			tokens: [{ startIndex: 0, type: 'comment.pats' }]
		}
	],

	[
		{
			line: '(* ****** ****** *)',
			tokens: [{ startIndex: 0, type: 'comment.pats' }]
		}
	],

	[
		{
			line: 'var x : int = (* a simple comment *) 1;',
			tokens: [
				{ startIndex: 0, type: 'keyword.pats' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.pats' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'keyword.pats' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'type.pats' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'keyword.pats' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'comment.pats' },
				{ startIndex: 36, type: '' },
				{ startIndex: 37, type: 'number.decimal.pats' },
				{ startIndex: 38, type: 'delimiter.semicolon.pats' }
			]
		}
	],

	[
		{
			line: 'val x = (* comment *) 1; *)',
			tokens: [
				{ startIndex: 0, type: 'keyword.pats' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.pats' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'keyword.pats' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'comment.pats' },
				{ startIndex: 21, type: '' },
				{ startIndex: 22, type: 'number.decimal.pats' },
				{ startIndex: 23, type: 'delimiter.semicolon.pats' },
				{ startIndex: 24, type: '' },
				{ startIndex: 25, type: 'operator.pats' },
				{ startIndex: 26, type: 'delimiter.parenthesis.pats' }
			]
		}
	],

	[
		{
			line: 'x = (**);',
			tokens: [
				{ startIndex: 0, type: 'identifier.pats' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'keyword.pats' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'comment.pats' },
				{ startIndex: 8, type: 'delimiter.semicolon.pats' }
			]
		}
	],

	[
		{
			line: '(*)',
			tokens: [
				{ startIndex: 0, type: 'invalid.pats' } // not a comment!
			]
		}
	],

	// Numbers
	[
		{
			line: '0',
			tokens: [{ startIndex: 0, type: 'number.decimal.pats' }]
		}
	],

	[
		{
			line: '12l',
			tokens: [{ startIndex: 0, type: 'number.decimal.pats' }]
		}
	],

	[
		{
			line: '34U',
			tokens: [{ startIndex: 0, type: 'number.decimal.pats' }]
		}
	],

	[
		{
			line: '55LL',
			tokens: [{ startIndex: 0, type: 'number.decimal.pats' }]
		}
	],

	[
		{
			line: '34ul',
			tokens: [{ startIndex: 0, type: 'number.decimal.pats' }]
		}
	],

	[
		{
			line: '55llU',
			tokens: [{ startIndex: 0, type: 'number.decimal.pats' }]
		}
	],

	/*
		[{
		line: '5\'5llU',
		tokens: [
			{ startIndex: 0, type: 'number.pats' }
		]}],

		[{
		line: '100\'000\'000',
		tokens: [
			{ startIndex: 0, type: 'number.pats' }
		]}],
	*/
	[
		{
			line: '0x100aafllU',
			tokens: [{ startIndex: 0, type: 'number.hex.pats' }]
		}
	],

	[
		{
			line: '0342325',
			tokens: [{ startIndex: 0, type: 'number.octal.pats' }]
		}
	],

	[
		{
			line: '0x123',
			tokens: [{ startIndex: 0, type: 'number.hex.pats' }]
		}
	],

	[
		{
			line: '23.5',
			tokens: [{ startIndex: 0, type: 'number.float.pats' }]
		}
	],

	[
		{
			line: '23.5e3',
			tokens: [{ startIndex: 0, type: 'number.float.pats' }]
		}
	],

	[
		{
			line: '23.5E3',
			tokens: [{ startIndex: 0, type: 'number.float.pats' }]
		}
	],

	[
		{
			line: '23.5F',
			tokens: [{ startIndex: 0, type: 'number.float.pats' }]
		}
	],

	[
		{
			line: '23.5f',
			tokens: [{ startIndex: 0, type: 'number.float.pats' }]
		}
	],

	[
		{
			line: '1.72E3F',
			tokens: [{ startIndex: 0, type: 'number.float.pats' }]
		}
	],

	[
		{
			line: '1.72E3f',
			tokens: [{ startIndex: 0, type: 'number.float.pats' }]
		}
	],

	[
		{
			line: '1.72e3F',
			tokens: [{ startIndex: 0, type: 'number.float.pats' }]
		}
	],

	[
		{
			line: '1.72e3f',
			tokens: [{ startIndex: 0, type: 'number.float.pats' }]
		}
	],

	[
		{
			line: '23.5L',
			tokens: [{ startIndex: 0, type: 'number.float.pats' }]
		}
	],

	[
		{
			line: '23.5l',
			tokens: [{ startIndex: 0, type: 'number.float.pats' }]
		}
	],

	[
		{
			line: '1.72E3L',
			tokens: [{ startIndex: 0, type: 'number.float.pats' }]
		}
	],

	[
		{
			line: '1.72E3l',
			tokens: [{ startIndex: 0, type: 'number.float.pats' }]
		}
	],

	[
		{
			line: '1.72e3L',
			tokens: [{ startIndex: 0, type: 'number.float.pats' }]
		}
	],

	[
		{
			line: '1.72e3l',
			tokens: [{ startIndex: 0, type: 'number.float.pats' }]
		}
	],

	[
		{
			line: '0+0',
			tokens: [
				{ startIndex: 0, type: 'number.decimal.pats' },
				{ startIndex: 1, type: 'operator.pats' },
				{ startIndex: 2, type: 'number.decimal.pats' }
			]
		}
	],

	[
		{
			line: '100+10',
			tokens: [
				{ startIndex: 0, type: 'number.decimal.pats' },
				{ startIndex: 3, type: 'operator.pats' },
				{ startIndex: 4, type: 'number.decimal.pats' }
			]
		}
	],

	[
		{
			line: '0 + 0',
			tokens: [
				{ startIndex: 0, type: 'number.decimal.pats' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'operator.pats' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.decimal.pats' }
			]
		}
	],

	// hi-lighting of variables in staload/dynload
	[
		{
			line: '"{$LIBATSCC2JS}/staloadall.hats"',
			tokens: [
				{ startIndex: 0, type: 'string.quote.pats' },
				{ startIndex: 1, type: 'string.escape.pats' },
				{ startIndex: 3, type: 'identifier.pats' },
				{ startIndex: 14, type: 'string.escape.pats' },
				{ startIndex: 15, type: 'string.pats' },
				{ startIndex: 31, type: 'string.quote.pats' }
			]
		}
	],

	// Monarch Generated
	[
		{
			line: '#include "/path/to/my/file.h"',
			tokens: [
				{ startIndex: 0, type: 'keyword.srp.pats' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'string.quote.pats' },
				{ startIndex: 10, type: 'string.pats' },
				{ startIndex: 28, type: 'string.quote.pats' }
			]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: '#ifdef VAR #then',
			tokens: [
				{ startIndex: 0, type: 'keyword.srp.pats' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'identifier.pats' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'keyword.srp.pats' }
			]
		},
		{
			line: '#define SUM(A,B) (A) + (B)',
			tokens: [
				{ startIndex: 0, type: 'keyword.srp.pats' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.pats' },
				{ startIndex: 11, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 12, type: 'identifier.pats' },
				{ startIndex: 13, type: 'delimiter.comma.pats' },
				{ startIndex: 14, type: 'identifier.pats' },
				{ startIndex: 15, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 18, type: 'identifier.pats' },
				{ startIndex: 19, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 20, type: '' },
				{ startIndex: 21, type: 'operator.pats' },
				{ startIndex: 22, type: '' },
				{ startIndex: 23, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 24, type: 'identifier.pats' },
				{ startIndex: 25, type: 'delimiter.parenthesis.pats' }
			]
		},
		{
			line: 'staload Asdf_CDE = "./myfile.sats"',
			tokens: [
				{ startIndex: 0, type: 'keyword.pats' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.pats' },
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'keyword.pats' },
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'string.quote.pats' },
				{ startIndex: 20, type: 'string.pats' },
				{ startIndex: 33, type: 'string.quote.pats' }
			]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: 'implement main(argc, argv)',
			tokens: [
				{ startIndex: 0, type: 'keyword.pats' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'identifier.pats' },
				{ startIndex: 14, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 15, type: 'identifier.pats' },
				{ startIndex: 19, type: 'delimiter.comma.pats' },
				{ startIndex: 20, type: '' },
				{ startIndex: 21, type: 'identifier.pats' },
				{ startIndex: 25, type: 'delimiter.parenthesis.pats' }
			]
		},
		{
			line: ' = begin',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'keyword.pats' },
				{ startIndex: 2, type: '' },
				{ startIndex: 3, type: 'keyword.pats' }
			]
		},
		{
			line: '0',
			tokens: [{ startIndex: 0, type: 'number.decimal.pats' }]
		},
		{
			line: 'end',
			tokens: [{ startIndex: 0, type: 'keyword.pats' }]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: '',
			tokens: []
		},
		{
			line: 'dataprop FACT (int, int) =',
			tokens: [
				{ startIndex: 0, type: 'keyword.pats' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.pats' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 15, type: 'type.pats' },
				{ startIndex: 18, type: 'delimiter.comma.pats' },
				{ startIndex: 19, type: '' },
				{ startIndex: 20, type: 'type.pats' },
				{ startIndex: 23, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 24, type: '' },
				{ startIndex: 25, type: 'keyword.pats' }
			]
		},
		{
			line: ' | FACTbas (0, 1) of ()',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'keyword.pats' },
				{ startIndex: 2, type: '' },
				{ startIndex: 3, type: 'identifier.pats' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 12, type: 'number.decimal.pats' },
				{ startIndex: 13, type: 'delimiter.comma.pats' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'number.decimal.pats' },
				{ startIndex: 16, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 17, type: '' },
				{ startIndex: 18, type: 'keyword.pats' },
				{ startIndex: 20, type: '' },
				{ startIndex: 21, type: 'delimiter.parenthesis.pats' }
			]
		},
		{
			line: ' | {n:pos}{r:int} FACTind (n, n*r) of FACT (n-1, r)',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'keyword.pats' },
				{ startIndex: 2, type: '' },
				{ startIndex: 3, type: 'delimiter.curly.pats' },
				{ startIndex: 4, type: 'identifier.pats' },
				{ startIndex: 5, type: 'keyword.pats' },
				{ startIndex: 6, type: 'identifier.pats' },
				{ startIndex: 9, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 10, type: 'delimiter.curly.pats' },
				{ startIndex: 11, type: 'identifier.pats' },
				{ startIndex: 12, type: 'keyword.pats' },
				{ startIndex: 13, type: 'type.pats' },
				{ startIndex: 16, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 17, type: '' },
				{ startIndex: 18, type: 'identifier.pats' },
				{ startIndex: 25, type: '' },
				{ startIndex: 26, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 27, type: 'identifier.pats' },
				{ startIndex: 28, type: 'delimiter.comma.pats' },
				{ startIndex: 29, type: '' },
				{ startIndex: 30, type: 'identifier.pats' },
				{ startIndex: 31, type: 'operator.pats' },
				{ startIndex: 32, type: 'identifier.pats' },
				{ startIndex: 33, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 34, type: '' },
				{ startIndex: 35, type: 'keyword.pats' },
				{ startIndex: 37, type: '' },
				{ startIndex: 38, type: 'identifier.pats' },
				{ startIndex: 42, type: '' },
				{ startIndex: 43, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 44, type: 'identifier.pats' },
				{ startIndex: 45, type: 'operator.pats' },
				{ startIndex: 46, type: 'number.decimal.pats' },
				{ startIndex: 47, type: 'delimiter.comma.pats' },
				{ startIndex: 48, type: '' },
				{ startIndex: 49, type: 'identifier.pats' },
				{ startIndex: 50, type: 'delimiter.parenthesis.pats' }
			]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: 'fun fact {n:nat} .<n>. (x: int n) : [r:int] (FACT(n, r) | int(r)) = (',
			tokens: [
				{ startIndex: 0, type: 'keyword.pats' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.pats' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'delimiter.curly.pats' },
				{ startIndex: 10, type: 'identifier.pats' },
				{ startIndex: 11, type: 'keyword.pats' },
				{ startIndex: 12, type: 'identifier.pats' },
				{ startIndex: 15, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'identifier.sym.pats' },
				{ startIndex: 19, type: 'identifier.pats' },
				{ startIndex: 20, type: 'keyword.pats' },
				{ startIndex: 22, type: '' },
				{ startIndex: 23, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 24, type: 'identifier.pats' },
				{ startIndex: 25, type: 'keyword.pats' },
				{ startIndex: 26, type: '' },
				{ startIndex: 27, type: 'type.pats' },
				{ startIndex: 30, type: '' },
				{ startIndex: 31, type: 'identifier.pats' },
				{ startIndex: 32, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 33, type: '' },
				{ startIndex: 34, type: 'keyword.pats' },
				{ startIndex: 35, type: '' },
				{ startIndex: 36, type: 'delimiter.square.pats' },
				{ startIndex: 37, type: 'identifier.pats' },
				{ startIndex: 38, type: 'keyword.pats' },
				{ startIndex: 39, type: 'type.pats' },
				{ startIndex: 42, type: 'delimiter.square.pats' },
				{ startIndex: 43, type: '' },
				{ startIndex: 44, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 45, type: 'identifier.pats' },
				{ startIndex: 49, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 50, type: 'identifier.pats' },
				{ startIndex: 51, type: 'delimiter.comma.pats' },
				{ startIndex: 52, type: '' },
				{ startIndex: 53, type: 'identifier.pats' },
				{ startIndex: 54, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 55, type: '' },
				{ startIndex: 56, type: 'keyword.pats' },
				{ startIndex: 57, type: '' },
				{ startIndex: 58, type: 'type.pats' },
				{ startIndex: 61, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 62, type: 'identifier.pats' },
				{ startIndex: 63, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 65, type: '' },
				{ startIndex: 66, type: 'keyword.pats' },
				{ startIndex: 67, type: '' },
				{ startIndex: 68, type: 'delimiter.parenthesis.pats' }
			]
		},
		{
			line: 'if x > 0 then let',
			tokens: [
				{ startIndex: 0, type: 'keyword.pats' },
				{ startIndex: 2, type: '' },
				{ startIndex: 3, type: 'identifier.pats' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'keyword.pats' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'number.decimal.pats' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'keyword.pats' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'keyword.pats' }
			]
		},
		{
			line: '  val [r1:int] (pf1 | r1) = fact (x-1)',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'keyword.pats' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.square.pats' },
				{ startIndex: 7, type: 'identifier.pats' },
				{ startIndex: 9, type: 'keyword.pats' },
				{ startIndex: 10, type: 'type.pats' },
				{ startIndex: 13, type: 'delimiter.square.pats' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 16, type: 'identifier.pats' },
				{ startIndex: 19, type: '' },
				{ startIndex: 20, type: 'keyword.pats' },
				{ startIndex: 21, type: '' },
				{ startIndex: 22, type: 'identifier.pats' },
				{ startIndex: 24, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 25, type: '' },
				{ startIndex: 26, type: 'keyword.pats' },
				{ startIndex: 27, type: '' },
				{ startIndex: 28, type: 'identifier.pats' },
				{ startIndex: 32, type: '' },
				{ startIndex: 33, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 34, type: 'identifier.pats' },
				{ startIndex: 35, type: 'operator.pats' },
				{ startIndex: 36, type: 'number.decimal.pats' },
				{ startIndex: 37, type: 'delimiter.parenthesis.pats' }
			]
		},
		{
			line: '  prval pf = FACTind {n}{r1} (pf1)',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'keyword.pats' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.pats' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'keyword.pats' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'identifier.pats' },
				{ startIndex: 20, type: '' },
				{ startIndex: 21, type: 'delimiter.curly.pats' },
				{ startIndex: 22, type: 'identifier.pats' },
				{ startIndex: 23, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 24, type: 'delimiter.curly.pats' },
				{ startIndex: 25, type: 'identifier.pats' },
				{ startIndex: 27, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 28, type: '' },
				{ startIndex: 29, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 30, type: 'identifier.pats' },
				{ startIndex: 33, type: 'delimiter.parenthesis.pats' }
			]
		},
		{
			line: '  val r = x * r1',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'keyword.pats' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'identifier.pats' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'keyword.pats' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'identifier.pats' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'operator.pats' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'identifier.pats' }
			]
		},
		{
			line: 'in',
			tokens: [{ startIndex: 0, type: 'keyword.pats' }]
		},
		{
			line: '  (pf | r)',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 3, type: 'identifier.pats' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'keyword.pats' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.pats' },
				{ startIndex: 9, type: 'delimiter.parenthesis.pats' }
			]
		},
		{
			line: 'end // end of [then]',
			tokens: [
				{ startIndex: 0, type: 'keyword.pats' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'comment.pats' }
			]
		},
		{
			line: 'else (FACTbas () | 1)',
			tokens: [
				{ startIndex: 0, type: 'keyword.pats' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 6, type: 'identifier.pats' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'keyword.pats' },
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'number.decimal.pats' },
				{ startIndex: 20, type: 'delimiter.parenthesis.pats' }
			]
		},
		{
			line: ') (* end of [fact] *)',
			tokens: [
				{ startIndex: 0, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'comment.pats' }
			]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: 'local',
			tokens: [{ startIndex: 0, type: 'keyword.pats' }]
		},
		{
			line: 'var __count: int = 0 // it is statically allocated',
			tokens: [
				{ startIndex: 0, type: 'keyword.pats' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.pats' },
				{ startIndex: 11, type: 'keyword.pats' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'type.pats' },
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'keyword.pats' },
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'number.decimal.pats' },
				{ startIndex: 20, type: '' },
				{ startIndex: 21, type: 'comment.pats' }
			]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: 'val theCount =',
			tokens: [
				{ startIndex: 0, type: 'keyword.pats' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.pats' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'keyword.pats' }
			]
		},
		{
			line: '  ref_make_viewptr{int}(view@(__count) | addr@(__count))',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'identifier.pats' },
				{ startIndex: 18, type: 'delimiter.curly.pats' },
				{ startIndex: 19, type: 'type.pats' },
				{ startIndex: 22, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 24, type: 'keyword.pats' },
				{ startIndex: 29, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 30, type: 'identifier.pats' },
				{ startIndex: 37, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 38, type: '' },
				{ startIndex: 39, type: 'keyword.pats' },
				{ startIndex: 40, type: '' },
				{ startIndex: 41, type: 'keyword.pats' },
				{ startIndex: 46, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 47, type: 'identifier.pats' },
				{ startIndex: 54, type: 'delimiter.parenthesis.pats' }
			]
		},
		{
			line: '// end of [val]',
			tokens: [{ startIndex: 0, type: 'comment.pats' }]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: 'in (* in of [local] *)',
			tokens: [
				{ startIndex: 0, type: 'keyword.pats' },
				{ startIndex: 2, type: '' },
				{ startIndex: 3, type: 'comment.pats' }
			]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: 'fun theCount_get (): int = !theCount',
			tokens: [
				{ startIndex: 0, type: 'keyword.pats' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.pats' },
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 19, type: 'keyword.pats' },
				{ startIndex: 20, type: '' },
				{ startIndex: 21, type: 'type.pats' },
				{ startIndex: 24, type: '' },
				{ startIndex: 25, type: 'keyword.pats' },
				{ startIndex: 26, type: '' },
				{ startIndex: 27, type: 'keyword.pats' },
				{ startIndex: 28, type: 'identifier.pats' }
			]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: 'fun theCount_inc (): void = !theCount := !theCount + 1',
			tokens: [
				{ startIndex: 0, type: 'keyword.pats' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.pats' },
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'delimiter.parenthesis.pats' },
				{ startIndex: 19, type: 'keyword.pats' },
				{ startIndex: 20, type: '' },
				{ startIndex: 21, type: 'type.pats' },
				{ startIndex: 25, type: '' },
				{ startIndex: 26, type: 'keyword.pats' },
				{ startIndex: 27, type: '' },
				{ startIndex: 28, type: 'keyword.pats' },
				{ startIndex: 29, type: 'identifier.pats' },
				{ startIndex: 37, type: '' },
				{ startIndex: 38, type: 'operator.pats' },
				{ startIndex: 40, type: '' },
				{ startIndex: 41, type: 'keyword.pats' },
				{ startIndex: 42, type: 'identifier.pats' },
				{ startIndex: 50, type: '' },
				{ startIndex: 51, type: 'operator.pats' },
				{ startIndex: 52, type: '' },
				{ startIndex: 53, type: 'number.decimal.pats' }
			]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: 'end // end of [local]',
			tokens: [
				{ startIndex: 0, type: 'keyword.pats' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'comment.pats' }
			]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: '#endif',
			tokens: [{ startIndex: 0, type: 'keyword.srp.pats' }]
		}
	]
]);
