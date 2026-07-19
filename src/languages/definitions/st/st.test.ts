/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';
testTokenization('st', [
	[
		{
			line: 'xVar : BOOL;',
			tokens: [
				{ startIndex: 0, type: 'identifier.st' },
				{ startIndex: 4, type: 'white.st' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'white.st' },
				{ startIndex: 7, type: 'type.st' },
				{ startIndex: 11, type: 'delimiter.st' }
			]
		}
	],
	[
		{
			line: 'xStart AT %IX0.0.1: BOOL := TRUE;',
			tokens: [
				{ startIndex: 0, type: 'identifier.st' },
				{ startIndex: 6, type: 'white.st' },
				{ startIndex: 7, type: 'keyword.st' },
				{ startIndex: 9, type: 'white.st' },
				{ startIndex: 10, type: 'tag.st' },
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'white.st' },
				{ startIndex: 20, type: 'type.st' },
				{ startIndex: 24, type: 'white.st' },
				{ startIndex: 25, type: '' },
				{ startIndex: 27, type: 'white.st' },
				{ startIndex: 28, type: 'constant.st' },
				{ startIndex: 32, type: 'delimiter.st' }
			]
		}
	],
	[
		{
			line: "IF a > 2#0000_0110 THEN (* Something ' happens *)",
			tokens: [
				{ startIndex: 0, type: 'keyword.st' },
				{ startIndex: 2, type: 'white.st' },
				{ startIndex: 3, type: 'identifier.st' },
				{ startIndex: 4, type: 'white.st' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'white.st' },
				{ startIndex: 7, type: 'number.binary.st' },
				{ startIndex: 18, type: 'white.st' },
				{ startIndex: 19, type: 'keyword.st' },
				{ startIndex: 23, type: 'white.st' },
				{ startIndex: 24, type: 'comment.st' }
			]
		}
	],
	[
		{
			line: 'TON1(IN := TRUE, PT := T#20ms, Q => xStart); // Run timer',
			tokens: [
				{ startIndex: 0, type: 'identifier.st' },
				{ startIndex: 4, type: 'delimiter.parenthesis.st' },
				{ startIndex: 5, type: 'identifier.st' },
				{ startIndex: 7, type: 'white.st' },
				{ startIndex: 8, type: '' },
				{ startIndex: 10, type: 'white.st' },
				{ startIndex: 11, type: 'constant.st' },
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'white.st' },
				{ startIndex: 17, type: 'identifier.st' },
				{ startIndex: 19, type: 'white.st' },
				{ startIndex: 20, type: '' },
				{ startIndex: 22, type: 'white.st' },
				{ startIndex: 23, type: 'tag.st' },
				{ startIndex: 29, type: '' },
				{ startIndex: 30, type: 'white.st' },
				{ startIndex: 31, type: 'identifier.st' },
				{ startIndex: 32, type: 'white.st' },
				{ startIndex: 33, type: '' },
				{ startIndex: 35, type: 'white.st' },
				{ startIndex: 36, type: 'identifier.st' },
				{ startIndex: 42, type: 'delimiter.parenthesis.st' },
				{ startIndex: 43, type: 'delimiter.st' },
				{ startIndex: 44, type: 'white.st' },
				{ startIndex: 45, type: 'comment.st' }
			]
		}
	],
	// Numbers
	[
		{
			line: '0',
			tokens: [{ startIndex: 0, type: 'number.st' }]
		}
	],

	[
		{
			line: '0.0',
			tokens: [{ startIndex: 0, type: 'number.float.st' }]
		}
	],

	[
		{
			line: '2#000_0101',
			tokens: [{ startIndex: 0, type: 'number.binary.st' }]
		}
	],
	[
		{
			line: '16#0f',
			tokens: [{ startIndex: 0, type: 'number.hex.st' }]
		}
	],

	[
		{
			line: '23.5',
			tokens: [{ startIndex: 0, type: 'number.float.st' }]
		}
	],

	[
		{
			line: '23.5e3',
			tokens: [{ startIndex: 0, type: 'number.float.st' }]
		}
	],

	[
		{
			line: '23.5E3',
			tokens: [{ startIndex: 0, type: 'number.float.st' }]
		}
	]
]);
