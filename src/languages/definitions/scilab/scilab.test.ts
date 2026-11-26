/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('scilab', [
	[
		{
			line: "x = A' + b'';",
			tokens: [
				{ startIndex: 0, type: 'identifier.scilab' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'operator.scilab' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.scilab' },
				{ startIndex: 5, type: 'operator.scilab' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'operator.scilab' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.scilab' },
				{ startIndex: 10, type: 'operator.scilab' },
				{ startIndex: 12, type: 'delimiter.scilab' }
			]
		}
	],

	[
		{
			line: 's = \'it\'\'s\' + "a""b";',
			tokens: [
				{ startIndex: 0, type: 'identifier.scilab' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'operator.scilab' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'string.scilab' },
				{ startIndex: 7, type: 'string.escape.scilab' },
				{ startIndex: 9, type: 'string.scilab' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'operator.scilab' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'string.scilab' },
				{ startIndex: 16, type: 'string.escape.scilab' },
				{ startIndex: 18, type: 'string.scilab' },
				{ startIndex: 20, type: 'delimiter.scilab' }
			]
		}
	],

	[
		{
			line: 'if %t then disp(%pi), end',
			tokens: [
				{ startIndex: 0, type: 'keyword.scilab' },
				{ startIndex: 2, type: '' },
				{ startIndex: 3, type: 'constant.scilab' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'keyword.scilab' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'predefined.scilab' },
				{ startIndex: 15, type: 'delimiter.parenthesis.scilab' },
				{ startIndex: 16, type: 'constant.scilab' },
				{ startIndex: 19, type: 'delimiter.parenthesis.scilab' },
				{ startIndex: 20, type: 'delimiter.scilab' },
				{ startIndex: 21, type: '' },
				{ startIndex: 22, type: 'keyword.scilab' }
			]
		}
	],

	[
		{
			line: 'function y = f(a) // c',
			tokens: [
				{ startIndex: 0, type: 'keyword.scilab' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.scilab' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'operator.scilab' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'identifier.scilab' },
				{ startIndex: 14, type: 'delimiter.parenthesis.scilab' },
				{ startIndex: 15, type: 'identifier.scilab' },
				{ startIndex: 16, type: 'delimiter.parenthesis.scilab' },
				{ startIndex: 17, type: '' },
				{ startIndex: 18, type: 'comment.scilab' }
			]
		}
	],

	[
		{
			line: '/* multi',
			tokens: [{ startIndex: 0, type: 'comment.scilab' }]
		},
		{
			line: "line */ z = 1.5e-3 .* [1 2]';",
			tokens: [
				{ startIndex: 0, type: 'comment.scilab' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.scilab' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'operator.scilab' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'number.scilab' },
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'operator.scilab' },
				{ startIndex: 21, type: '' },
				{ startIndex: 22, type: 'delimiter.square.scilab' },
				{ startIndex: 23, type: 'number.scilab' },
				{ startIndex: 24, type: '' },
				{ startIndex: 25, type: 'number.scilab' },
				{ startIndex: 26, type: 'delimiter.square.scilab' },
				{ startIndex: 27, type: 'operator.scilab' },
				{ startIndex: 28, type: 'delimiter.scilab' }
			]
		}
	],

	[
		{
			line: 'a = 1 ... cont',
			tokens: [
				{ startIndex: 0, type: 'identifier.scilab' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'operator.scilab' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.scilab' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'comment.scilab' }
			]
		}
	],

	[
		{
			line: "foo(2)' ; y = 0x1F",
			tokens: [
				{ startIndex: 0, type: 'identifier.scilab' },
				{ startIndex: 3, type: 'delimiter.parenthesis.scilab' },
				{ startIndex: 4, type: 'number.scilab' },
				{ startIndex: 5, type: 'delimiter.parenthesis.scilab' },
				{ startIndex: 6, type: 'operator.scilab' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'delimiter.scilab' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'identifier.scilab' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'operator.scilab' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'number.hex.scilab' }
			]
		}
	]
]);
