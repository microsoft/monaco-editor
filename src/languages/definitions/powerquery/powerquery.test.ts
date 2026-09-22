/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('powerquery', [
	// Comments
	[
		{
			line: '// a comment',
			tokens: [{ startIndex: 0, type: 'comment.pq' }]
		}
	],

	[
		{
			line: '    // a comment */',
			tokens: [
				{ startIndex: 0, type: 'white.pq' },
				{ startIndex: 4, type: 'comment.pq' }
			]
		}
	],

	[
		{
			line: '// a comment',
			tokens: [{ startIndex: 0, type: 'comment.pq' }]
		}
	],

	[
		{
			line: '// /* #A */',
			tokens: [{ startIndex: 0, type: 'comment.pq' }]
		}
	],

	[
		{
			line: '/*ABCD12$!()\\u000D%%%%%*/',
			tokens: [{ startIndex: 0, type: 'comment.pq' }]
		}
	],

	[
		{
			line: '42 /* + 45 */ /*',
			tokens: [
				{ startIndex: 0, type: 'number.pq' },
				{ startIndex: 2, type: 'white.pq' },
				{ startIndex: 3, type: 'comment.pq' },
				{ startIndex: 13, type: 'white.pq' },
				{ startIndex: 14, type: 'comment.pq' }
			]
		}
	],

	[
		{
			line: '/* //*/ a',
			tokens: [
				{ startIndex: 0, type: 'comment.pq' },
				{ startIndex: 7, type: 'white.pq' },
				{ startIndex: 8, type: 'identifier.pq' }
			]
		}
	],

	[
		{
			line: '1 / 2; /* comment',
			tokens: [
				{ startIndex: 0, type: 'number.pq' },
				{ startIndex: 1, type: 'white.pq' },
				{ startIndex: 2, type: 'operators.pq' },
				{ startIndex: 3, type: 'white.pq' },
				{ startIndex: 4, type: 'number.pq' },
				{ startIndex: 5, type: 'delimiter.pq' },
				{ startIndex: 6, type: 'white.pq' },
				{ startIndex: 7, type: 'comment.pq' }
			]
		}
	],

	// Quoted Identifiers
	[
		{
			line: '#"Change Types"',
			tokens: [{ startIndex: 0, type: 'identifier.quote.pq' }]
		}
	],

	[
		{
			line: '#"A  B" = 1+2,',
			tokens: [
				{ startIndex: 0, type: 'identifier.quote.pq' },
				{ startIndex: 7, type: 'white.pq' },
				{ startIndex: 8, type: 'operators.pq' },
				{ startIndex: 9, type: 'white.pq' },
				{ startIndex: 10, type: 'number.pq' },
				{ startIndex: 11, type: 'operators.pq' },
				{ startIndex: 12, type: 'number.pq' },
				{ startIndex: 13, type: 'delimiter.pq' }
			]
		}
	],

	[
		{
			line: 'a = #"escap ed"+ 1',
			tokens: [
				{ startIndex: 0, type: 'identifier.pq' },
				{ startIndex: 1, type: 'white.pq' },
				{ startIndex: 2, type: 'operators.pq' },
				{ startIndex: 3, type: 'white.pq' },
				{ startIndex: 4, type: 'identifier.quote.pq' },
				{ startIndex: 15, type: 'operators.pq' },
				{ startIndex: 16, type: 'white.pq' },
				{ startIndex: 17, type: 'number.pq' }
			]
		}
	],

	// Number formats
	[
		{
			line: '0Xabc',
			tokens: [{ startIndex: 0, type: 'number.hex.pq' }]
		}
	],

	[
		{
			line: '0xA',
			tokens: [{ startIndex: 0, type: 'number.hex.pq' }]
		}
	],

	[
		{
			line: '1e1',
			tokens: [{ startIndex: 0, type: 'number.pq' }]
		}
	],

	[
		{
			line: '5 / 1.2e+2 + 0x1234abc',
			tokens: [
				{ startIndex: 0, type: 'number.pq' },
				{ startIndex: 1, type: 'white.pq' },
				{ startIndex: 2, type: 'operators.pq' },
				{ startIndex: 3, type: 'white.pq' },
				{ startIndex: 4, type: 'number.float.pq' },
				{ startIndex: 10, type: 'white.pq' },
				{ startIndex: 11, type: 'operators.pq' },
				{ startIndex: 12, type: 'white.pq' },
				{ startIndex: 13, type: 'number.hex.pq' }
			]
		}
	],

	[
		{
			line: '0xb *(.2)',
			tokens: [
				{ startIndex: 0, type: 'number.hex.pq' },
				{ startIndex: 3, type: 'white.pq' },
				{ startIndex: 4, type: 'operators.pq' },
				{ startIndex: 5, type: 'delimiter.parenthesis.pq' },
				{ startIndex: 6, type: 'number.float.pq' },
				{ startIndex: 8, type: 'delimiter.parenthesis.pq' }
			]
		}
	],

	[
		{
			line: '1.23e34+1.2e-2-.3e2',
			tokens: [
				{ startIndex: 0, type: 'number.float.pq' },
				{ startIndex: 7, type: 'operators.pq' },
				{ startIndex: 8, type: 'number.float.pq' },
				{ startIndex: 14, type: 'operators.pq' },
				{ startIndex: 15, type: 'number.float.pq' }
			]
		}
	],

	// strings
	[
		{
			line: '  "string"',
			tokens: [
				{ startIndex: 0, type: 'white.pq' },
				{ startIndex: 2, type: 'string.pq' }
			]
		}
	],

	[
		{
			line: '"string" & "another"',
			tokens: [
				{ startIndex: 0, type: 'string.pq' },
				{ startIndex: 8, type: 'white.pq' },
				{ startIndex: 9, type: 'operators.pq' },
				{ startIndex: 10, type: 'white.pq' },
				{ startIndex: 11, type: 'string.pq' }
			]
		}
	],

	[
		{
			line: '"with  ""escaped "" \'text',
			tokens: [
				{ startIndex: 0, type: 'string.pq' },
				{ startIndex: 7, type: 'string.escape.pq' },
				{ startIndex: 9, type: 'string.pq' },
				{ startIndex: 17, type: 'string.escape.pq' },
				{ startIndex: 19, type: 'string.pq' }
			]
		}
	],

	// built-in keywords/identifiers
	[
		{
			line: 'And as Each each _',
			tokens: [
				{ startIndex: 0, type: 'identifier.pq' },
				{ startIndex: 3, type: 'white.pq' },
				{ startIndex: 4, type: 'keyword.pq' },
				{ startIndex: 6, type: 'white.pq' },
				{ startIndex: 7, type: 'identifier.pq' },
				{ startIndex: 11, type: 'white.pq' },
				{ startIndex: 12, type: 'keyword.pq' },
				{ startIndex: 16, type: 'white.pq' },
				{ startIndex: 17, type: 'identifier.pq' }
			]
		}
	],

	[
		{
			line: '  #table({})',
			tokens: [
				{ startIndex: 0, type: 'white.pq' },
				{ startIndex: 2, type: 'constructor.pq' },
				{ startIndex: 8, type: 'delimiter.parenthesis.pq' },
				{ startIndex: 9, type: 'delimiter.brackets.pq' },
				{ startIndex: 11, type: 'delimiter.parenthesis.pq' }
			]
		}
	],

	[
		{
			line: 'param as number',
			tokens: [
				{ startIndex: 0, type: 'identifier.pq' },
				{ startIndex: 5, type: 'white.pq' },
				{ startIndex: 6, type: 'keyword.pq' },
				{ startIndex: 8, type: 'white.pq' },
				{ startIndex: 9, type: 'type.pq' }
			]
		}
	],

	[
		{
			line: 'type table',
			tokens: [
				{ startIndex: 0, type: 'keyword.pq' },
				{ startIndex: 4, type: 'white.pq' },
				{ startIndex: 5, type: 'type.pq' }
			]
		}
	],

	[
		{
			line: 'if (a = #nan) then null else a',
			tokens: [
				{ startIndex: 0, type: 'keyword.pq' },
				{ startIndex: 2, type: 'white.pq' },
				{ startIndex: 3, type: 'delimiter.parenthesis.pq' },
				{ startIndex: 4, type: 'identifier.pq' },
				{ startIndex: 5, type: 'white.pq' },
				{ startIndex: 6, type: 'operators.pq' },
				{ startIndex: 7, type: 'white.pq' },
				{ startIndex: 8, type: 'constant.pq' },
				{ startIndex: 12, type: 'delimiter.parenthesis.pq' },
				{ startIndex: 13, type: 'white.pq' },
				{ startIndex: 14, type: 'keyword.pq' },
				{ startIndex: 18, type: 'white.pq' },
				{ startIndex: 19, type: 'type.pq' },
				{ startIndex: 23, type: 'white.pq' },
				{ startIndex: 24, type: 'keyword.pq' },
				{ startIndex: 28, type: 'white.pq' },
				{ startIndex: 29, type: 'identifier.pq' }
			]
		}
	],

	// built-ins
	[
		{
			line: 'Text.From(1)',
			tokens: [
				{ startIndex: 0, type: 'keyword.function.pq' },
				{ startIndex: 9, type: 'delimiter.parenthesis.pq' },
				{ startIndex: 10, type: 'number.pq' },
				{ startIndex: 11, type: 'delimiter.parenthesis.pq' }
			]
		}
	],

	[
		{
			line: 'Text.ToBinary("123", BinaryEncoding.Base64)',
			tokens: [
				{ startIndex: 0, type: 'keyword.function.pq' },
				{ startIndex: 13, type: 'delimiter.parenthesis.pq' },
				{ startIndex: 14, type: 'string.pq' },
				{ startIndex: 19, type: 'delimiter.pq' },
				{ startIndex: 20, type: 'white.pq' },
				{ startIndex: 21, type: 'constant.pq' },
				{ startIndex: 42, type: 'delimiter.parenthesis.pq' }
			]
		}
	],

	[
		{
			line: 'Int8.Type',
			tokens: [{ startIndex: 0, type: 'type.pq' }]
		}
	],

	[
		{
			line: 'DB2.Database',
			tokens: [{ startIndex: 0, type: 'keyword.function.pq' }]
		}
	],

	[
		{
			line: 'RelativePosition.Type',
			tokens: [{ startIndex: 0, type: 'type.pq' }]
		}
	],

	// other statements
	[
		{
			line: '[version="1.0.0.1"] section Foo; shared Member.Name = 1;',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.pq' },
				{ startIndex: 1, type: 'identifier.pq' },
				{ startIndex: 8, type: 'operators.pq' },
				{ startIndex: 9, type: 'string.pq' },
				{ startIndex: 18, type: 'delimiter.square.pq' },
				{ startIndex: 19, type: 'white.pq' },
				{ startIndex: 20, type: 'keyword.pq' },
				{ startIndex: 27, type: 'white.pq' },
				{ startIndex: 28, type: 'identifier.pq' },
				{ startIndex: 31, type: 'delimiter.pq' },
				{ startIndex: 32, type: 'white.pq' },
				{ startIndex: 33, type: 'keyword.pq' },
				{ startIndex: 39, type: 'white.pq' },
				{ startIndex: 40, type: 'identifier.pq' },
				{ startIndex: 51, type: 'white.pq' },
				{ startIndex: 52, type: 'operators.pq' },
				{ startIndex: 53, type: 'white.pq' },
				{ startIndex: 54, type: 'number.pq' },
				{ startIndex: 55, type: 'delimiter.pq' }
			]
		}
	],

	[
		{
			line: 'isFunctionthen = 1;// comment',
			tokens: [
				{ startIndex: 0, type: 'identifier.pq' },
				{ startIndex: 14, type: 'white.pq' },
				{ startIndex: 15, type: 'operators.pq' },
				{ startIndex: 16, type: 'white.pq' },
				{ startIndex: 17, type: 'number.pq' },
				{ startIndex: 18, type: 'delimiter.pq' },
				{ startIndex: 19, type: 'comment.pq' }
			]
		}
	],

	[
		{
			line: '@RecursiveFunction()+@Rec.Func()',
			tokens: [
				{ startIndex: 0, type: 'operators.pq' },
				{ startIndex: 1, type: 'identifier.pq' },
				{ startIndex: 18, type: 'delimiter.parenthesis.pq' },
				{ startIndex: 20, type: 'operators.pq' },
				{ startIndex: 22, type: 'identifier.pq' },
				{ startIndex: 30, type: 'delimiter.parenthesis.pq' }
			]
		}
	]
]);
