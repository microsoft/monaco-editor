/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('c', [
	// Keywords
	[
		{
			line: 'int _tmain(int argc, _TCHAR* argv[])',
			tokens: [
				{ startIndex: 0, type: 'keyword.int.c' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.c' },
				{ startIndex: 10, type: 'delimiter.parenthesis.c' },
				{ startIndex: 11, type: 'keyword.int.c' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'identifier.c' },
				{ startIndex: 19, type: 'delimiter.c' },
				{ startIndex: 20, type: '' },
				{ startIndex: 21, type: 'identifier.c' },
				{ startIndex: 27, type: 'delimiter.c' },
				{ startIndex: 28, type: '' },
				{ startIndex: 29, type: 'identifier.c' },
				{ startIndex: 33, type: 'delimiter.square.c' },
				{ startIndex: 35, type: 'delimiter.parenthesis.c' }
			]
		}
	],

	// Comments - single line
	[
		{
			line: '//',
			tokens: [{ startIndex: 0, type: 'comment.c' }]
		}
	],

	[
		{
			line: '    // a comment',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'comment.c' }
			]
		}
	],

	[
		{
			line: '// a comment',
			tokens: [{ startIndex: 0, type: 'comment.c' }]
		}
	],

	[
		{
			line: '//sticky comment',
			tokens: [{ startIndex: 0, type: 'comment.c' }]
		}
	],

	[
		{
			line: '/almost a comment',
			tokens: [
				{ startIndex: 0, type: 'delimiter.c' },
				{ startIndex: 1, type: 'identifier.c' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.c' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'identifier.c' }
			]
		}
	],

	[
		{
			line: '/* //*/ a',
			tokens: [
				{ startIndex: 0, type: 'comment.c' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.c' }
			]
		}
	],

	[
		{
			line: '1 / 2; /* comment',
			tokens: [
				{ startIndex: 0, type: 'number.c' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.c' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.c' },
				{ startIndex: 5, type: 'delimiter.c' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'comment.c' }
			]
		}
	],

	[
		{
			line: 'int x = 1; // my comment // is a nice one',
			tokens: [
				{ startIndex: 0, type: 'keyword.int.c' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.c' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.c' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'number.c' },
				{ startIndex: 9, type: 'delimiter.c' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'comment.c' }
			]
		}
	],

	// Comments - range comment, single line
	[
		{
			line: '/* a simple comment */',
			tokens: [{ startIndex: 0, type: 'comment.c' }]
		}
	],

	[
		{
			line: 'int x = /* a simple comment */ 1;',
			tokens: [
				{ startIndex: 0, type: 'keyword.int.c' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.c' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.c' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'comment.c' },
				{ startIndex: 30, type: '' },
				{ startIndex: 31, type: 'number.c' },
				{ startIndex: 32, type: 'delimiter.c' }
			]
		}
	],

	[
		{
			line: 'int x = /* comment */ 1; */',
			tokens: [
				{ startIndex: 0, type: 'keyword.int.c' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.c' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.c' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'comment.c' },
				{ startIndex: 21, type: '' },
				{ startIndex: 22, type: 'number.c' },
				{ startIndex: 23, type: 'delimiter.c' },
				{ startIndex: 24, type: '' }
			]
		}
	],

	[
		{
			line: 'x = /**/;',
			tokens: [
				{ startIndex: 0, type: 'identifier.c' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.c' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'comment.c' },
				{ startIndex: 8, type: 'delimiter.c' }
			]
		}
	],

	[
		{
			line: 'x = /*/;',
			tokens: [
				{ startIndex: 0, type: 'identifier.c' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.c' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'comment.c' }
			]
		}
	],

	// Numbers
	[
		{
			line: '0',
			tokens: [{ startIndex: 0, type: 'number.c' }]
		}
	],

	[
		{
			line: '12l',
			tokens: [{ startIndex: 0, type: 'number.c' }]
		}
	],

	[
		{
			line: '34U',
			tokens: [{ startIndex: 0, type: 'number.c' }]
		}
	],

	[
		{
			line: '55LL',
			tokens: [{ startIndex: 0, type: 'number.c' }]
		}
	],

	[
		{
			line: '34ul',
			tokens: [{ startIndex: 0, type: 'number.c' }]
		}
	],

	[
		{
			line: '55llU',
			tokens: [{ startIndex: 0, type: 'number.c' }]
		}
	],

	[
		{
			line: "5'5llU",
			tokens: [{ startIndex: 0, type: 'number.c' }]
		}
	],

	[
		{
			line: "100'000'000",
			tokens: [{ startIndex: 0, type: 'number.c' }]
		}
	],

	[
		{
			line: "0x100'aafllU",
			tokens: [{ startIndex: 0, type: 'number.hex.c' }]
		}
	],

	[
		{
			line: "0342'325",
			tokens: [{ startIndex: 0, type: 'number.octal.c' }]
		}
	],

	[
		{
			line: '0x123',
			tokens: [{ startIndex: 0, type: 'number.hex.c' }]
		}
	],

	[
		{
			line: '23.5',
			tokens: [{ startIndex: 0, type: 'number.float.c' }]
		}
	],

	[
		{
			line: '23.5e3',
			tokens: [{ startIndex: 0, type: 'number.float.c' }]
		}
	],

	[
		{
			line: '23.5E3',
			tokens: [{ startIndex: 0, type: 'number.float.c' }]
		}
	],

	[
		{
			line: '23.5F',
			tokens: [{ startIndex: 0, type: 'number.float.c' }]
		}
	],

	[
		{
			line: '23.5f',
			tokens: [{ startIndex: 0, type: 'number.float.c' }]
		}
	],

	[
		{
			line: '1.72E3F',
			tokens: [{ startIndex: 0, type: 'number.float.c' }]
		}
	],

	[
		{
			line: '1.72E3f',
			tokens: [{ startIndex: 0, type: 'number.float.c' }]
		}
	],

	[
		{
			line: '1.72e3F',
			tokens: [{ startIndex: 0, type: 'number.float.c' }]
		}
	],

	[
		{
			line: '1.72e3f',
			tokens: [{ startIndex: 0, type: 'number.float.c' }]
		}
	],

	[
		{
			line: '23.5L',
			tokens: [{ startIndex: 0, type: 'number.float.c' }]
		}
	],

	[
		{
			line: '23.5l',
			tokens: [{ startIndex: 0, type: 'number.float.c' }]
		}
	],

	[
		{
			line: '1.72E3L',
			tokens: [{ startIndex: 0, type: 'number.float.c' }]
		}
	],

	[
		{
			line: '1.72E3l',
			tokens: [{ startIndex: 0, type: 'number.float.c' }]
		}
	],

	[
		{
			line: '1.72e3L',
			tokens: [{ startIndex: 0, type: 'number.float.c' }]
		}
	],

	[
		{
			line: '1.72e3l',
			tokens: [{ startIndex: 0, type: 'number.float.c' }]
		}
	],

	[
		{
			line: '0+0',
			tokens: [
				{ startIndex: 0, type: 'number.c' },
				{ startIndex: 1, type: 'delimiter.c' },
				{ startIndex: 2, type: 'number.c' }
			]
		}
	],

	[
		{
			line: '100+10',
			tokens: [
				{ startIndex: 0, type: 'number.c' },
				{ startIndex: 3, type: 'delimiter.c' },
				{ startIndex: 4, type: 'number.c' }
			]
		}
	],

	[
		{
			line: '0 + 0',
			tokens: [
				{ startIndex: 0, type: 'number.c' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.c' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.c' }
			]
		}
	],

	// Monarch Generated
	[
		{
			line: '#include<iostream>',
			tokens: [
				{ startIndex: 0, type: 'keyword.directive.include.c' },
				{ startIndex: 8, type: 'keyword.directive.include.begin.c' },
				{ startIndex: 9, type: 'string.include.identifier.c' },
				{ startIndex: 17, type: 'keyword.directive.include.end.c' }
			]
		},
		{
			line: '#include "/path/to/my/file.h"',
			tokens: [
				{ startIndex: 0, type: 'keyword.directive.include.c' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'keyword.directive.include.begin.c' },
				{ startIndex: 10, type: 'string.include.identifier.c' },
				{ startIndex: 28, type: 'keyword.directive.include.end.c' }
			]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: '#ifdef VAR',
			tokens: [
				{ startIndex: 0, type: 'keyword.directive.c' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'identifier.c' }
			]
		},
		{
			line: '#define SUM(A,B) (A) + (B)',
			tokens: [
				{ startIndex: 0, type: 'keyword.directive.c' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.c' },
				{ startIndex: 11, type: 'delimiter.parenthesis.c' },
				{ startIndex: 12, type: 'identifier.c' },
				{ startIndex: 13, type: 'delimiter.c' },
				{ startIndex: 14, type: 'identifier.c' },
				{ startIndex: 15, type: 'delimiter.parenthesis.c' },
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'delimiter.parenthesis.c' },
				{ startIndex: 18, type: 'identifier.c' },
				{ startIndex: 19, type: 'delimiter.parenthesis.c' },
				{ startIndex: 20, type: '' },
				{ startIndex: 21, type: 'delimiter.c' },
				{ startIndex: 22, type: '' },
				{ startIndex: 23, type: 'delimiter.parenthesis.c' },
				{ startIndex: 24, type: 'identifier.c' },
				{ startIndex: 25, type: 'delimiter.parenthesis.c' }
			]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: 'int main(int argc, char** argv)',
			tokens: [
				{ startIndex: 0, type: 'keyword.int.c' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.c' },
				{ startIndex: 8, type: 'delimiter.parenthesis.c' },
				{ startIndex: 9, type: 'keyword.int.c' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'identifier.c' },
				{ startIndex: 17, type: 'delimiter.c' },
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'keyword.char.c' },
				{ startIndex: 23, type: '' },
				{ startIndex: 26, type: 'identifier.c' },
				{ startIndex: 30, type: 'delimiter.parenthesis.c' }
			]
		},
		{
			line: '{',
			tokens: [{ startIndex: 0, type: 'delimiter.curly.c' }]
		},
		{
			line: '	return 0;',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'keyword.return.c' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'number.c' },
				{ startIndex: 9, type: 'delimiter.c' }
			]
		},
		{
			line: '}',
			tokens: [{ startIndex: 0, type: 'delimiter.curly.c' }]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: '{',
			tokens: [{ startIndex: 0, type: 'delimiter.curly.c' }]
		},
		{
			line: '	{',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'delimiter.curly.c' }
			]
		},
		{
			line: '		',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '		static T field;',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'keyword.static.c' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.c' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'identifier.c' },
				{ startIndex: 16, type: 'delimiter.c' }
			]
		},
		{
			line: '		',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '		',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '		foo method() const override',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'identifier.c' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'identifier.c' },
				{ startIndex: 12, type: 'delimiter.parenthesis.c' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'keyword.const.c' },
				{ startIndex: 20, type: '' },
				{ startIndex: 21, type: 'keyword.override.c' }
			]
		},
		{
			line: '		{',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'delimiter.curly.c' }
			]
		},
		{
			line: '			',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '			if (s.field) {',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 3, type: 'keyword.if.c' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.parenthesis.c' },
				{ startIndex: 7, type: 'identifier.c' },
				{ startIndex: 8, type: 'delimiter.c' },
				{ startIndex: 9, type: 'identifier.c' },
				{ startIndex: 14, type: 'delimiter.parenthesis.c' },
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'delimiter.curly.c' }
			]
		},
		{
			line: '				for(const auto & b : s.field) {',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'keyword.for.c' },
				{ startIndex: 7, type: 'delimiter.parenthesis.c' },
				{ startIndex: 8, type: 'keyword.const.c' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'keyword.auto.c' },
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'delimiter.c' },
				{ startIndex: 20, type: '' },
				{ startIndex: 21, type: 'identifier.c' },
				{ startIndex: 22, type: '' },
				{ startIndex: 23, type: 'delimiter.c' },
				{ startIndex: 24, type: '' },
				{ startIndex: 25, type: 'identifier.c' },
				{ startIndex: 26, type: 'delimiter.c' },
				{ startIndex: 27, type: 'identifier.c' },
				{ startIndex: 32, type: 'delimiter.parenthesis.c' },
				{ startIndex: 33, type: '' },
				{ startIndex: 34, type: 'delimiter.curly.c' }
			]
		},
		{
			line: '					break;',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 5, type: 'keyword.break.c' },
				{ startIndex: 10, type: 'delimiter.c' }
			]
		},
		{
			line: '				}',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'delimiter.curly.c' }
			]
		},
		{
			line: '			}',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 3, type: 'delimiter.curly.c' }
			]
		},
		{
			line: '		}',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'delimiter.curly.c' }
			]
		},
		{
			line: '		',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '		std::string s = "hello wordld\\n";',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'identifier.c' },
				{ startIndex: 5, type: '' },
				{ startIndex: 7, type: 'identifier.c' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'identifier.c' },
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'delimiter.c' },
				{ startIndex: 17, type: '' },
				{ startIndex: 18, type: 'string.c' },
				{ startIndex: 31, type: 'string.escape.c' },
				{ startIndex: 33, type: 'string.c' },
				{ startIndex: 34, type: 'delimiter.c' }
			]
		},
		{
			line: '		',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: "		int number = 123'123'123Ull;",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'keyword.int.c' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'identifier.c' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'delimiter.c' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'number.c' },
				{ startIndex: 29, type: 'delimiter.c' }
			]
		},
		{
			line: '	}',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'delimiter.curly.c' }
			]
		},
		{
			line: '}',
			tokens: [{ startIndex: 0, type: 'delimiter.curly.c' }]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: '#endif',
			tokens: [{ startIndex: 0, type: 'keyword.directive.c' }]
		},
		{
			line: '#    ifdef VAR',
			tokens: [
				{ startIndex: 0, type: 'keyword.directive.c' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'identifier.c' }
			]
		},
		{
			line: '#	define SUM(A,B) (A) + (B)',
			tokens: [
				{ startIndex: 0, type: 'keyword.directive.c' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.c' },
				{ startIndex: 12, type: 'delimiter.parenthesis.c' },
				{ startIndex: 13, type: 'identifier.c' },
				{ startIndex: 14, type: 'delimiter.c' },
				{ startIndex: 15, type: 'identifier.c' },
				{ startIndex: 16, type: 'delimiter.parenthesis.c' },
				{ startIndex: 17, type: '' },
				{ startIndex: 18, type: 'delimiter.parenthesis.c' },
				{ startIndex: 19, type: 'identifier.c' },
				{ startIndex: 20, type: 'delimiter.parenthesis.c' },
				{ startIndex: 21, type: '' },
				{ startIndex: 22, type: 'delimiter.c' },
				{ startIndex: 23, type: '' },
				{ startIndex: 24, type: 'delimiter.parenthesis.c' },
				{ startIndex: 25, type: 'identifier.c' },
				{ startIndex: 26, type: 'delimiter.parenthesis.c' }
			]
		}
	],

	// https://github.com/microsoft/monaco-editor/issues/1951
	[
		{
			line: '    // This is a comment, not a string',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'comment.c' }
			]
		}
	],

	// Preprocessor directives with whitespace inamongst the characters,
	// and crucially checking with whitespace before the initial #.
	[
		{
			line: ' # if defined(SOMETHING)',
			tokens: [
				{ startIndex: 0, type: 'keyword.directive.c' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'identifier.c' },
				{ startIndex: 13, type: 'delimiter.parenthesis.c' },
				{ startIndex: 14, type: 'identifier.c' },
				{ startIndex: 23, type: 'delimiter.parenthesis.c' }
			]
		},
		{
			line: '        #include <io.h>',
			tokens: [
				{ startIndex: 0, type: 'keyword.directive.include.c' },
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'keyword.directive.include.begin.c' },
				{ startIndex: 18, type: 'string.include.identifier.c' },
				{ startIndex: 22, type: 'keyword.directive.include.end.c' }
			]
		},
		{
			line: '      #  include <io.h>',
			tokens: [
				{ startIndex: 0, type: 'keyword.directive.include.c' },
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'keyword.directive.include.begin.c' },
				{ startIndex: 18, type: 'string.include.identifier.c' },
				{ startIndex: 22, type: 'keyword.directive.include.end.c' }
			]
		}
	],

	[
		// microsoft/monaco-editor#2497 : comment continuation highlighting
		{
			line: '// this is a comment \\',
			tokens: [{ startIndex: 0, type: 'comment.c' }]
		},
		{
			line: 'this is still a comment',
			tokens: [{ startIndex: 0, type: 'comment.c' }]
		},
		{
			line: 'int x = 1;',
			tokens: [
				{ startIndex: 0, type: 'keyword.int.c' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.c' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.c' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'number.c' },
				{ startIndex: 9, type: 'delimiter.c' }
			]
		}
	]
]);
