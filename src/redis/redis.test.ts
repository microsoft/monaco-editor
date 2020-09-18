/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('redis', [
	// Numbers
	[
		{
			line: '123',
			tokens: [{ startIndex: 0, type: 'number.redis' }]
		}
	],

	[
		{
			line: '-123',
			tokens: [
				{ startIndex: 0, type: 'operator.redis' },
				{ startIndex: 1, type: 'number.redis' }
			]
		}
	],

	[
		{
			line: '0xaBc123',
			tokens: [{ startIndex: 0, type: 'number.redis' }]
		}
	],

	[
		{
			line: '0XaBc123',
			tokens: [{ startIndex: 0, type: 'number.redis' }]
		}
	],

	[
		{
			line: '0x',
			tokens: [{ startIndex: 0, type: 'number.redis' }]
		}
	],

	[
		{
			line: '0x0',
			tokens: [{ startIndex: 0, type: 'number.redis' }]
		}
	],

	[
		{
			line: '0xAB_CD',
			tokens: [
				{ startIndex: 0, type: 'number.redis' },
				{ startIndex: 4, type: 'identifier.redis' }
			]
		}
	],

	[
		{
			line: '$',
			tokens: [{ startIndex: 0, type: 'number.redis' }]
		}
	],

	[
		{
			line: '$-123',
			tokens: [{ startIndex: 0, type: 'number.redis' }]
		}
	],

	[
		{
			line: '$-+-123',
			tokens: [{ startIndex: 0, type: 'number.redis' }]
		}
	],

	[
		{
			line: '$123.5678',
			tokens: [{ startIndex: 0, type: 'number.redis' }]
		}
	],

	[
		{
			line: '$0.99',
			tokens: [{ startIndex: 0, type: 'number.redis' }]
		}
	],

	[
		{
			line: '$.99',
			tokens: [{ startIndex: 0, type: 'number.redis' }]
		}
	],

	[
		{
			line: '$99.',
			tokens: [{ startIndex: 0, type: 'number.redis' }]
		}
	],

	[
		{
			line: '$0.',
			tokens: [{ startIndex: 0, type: 'number.redis' }]
		}
	],

	[
		{
			line: '$.0',
			tokens: [{ startIndex: 0, type: 'number.redis' }]
		}
	],

	[
		{
			line: '.',
			tokens: [{ startIndex: 0, type: 'delimiter.redis' }]
		}
	],

	[
		{
			line: '123',
			tokens: [{ startIndex: 0, type: 'number.redis' }]
		}
	],

	[
		{
			line: '123.5678',
			tokens: [{ startIndex: 0, type: 'number.redis' }]
		}
	],

	[
		{
			line: '0.99',
			tokens: [{ startIndex: 0, type: 'number.redis' }]
		}
	],

	[
		{
			line: '.99',
			tokens: [{ startIndex: 0, type: 'number.redis' }]
		}
	],

	[
		{
			line: '99.',
			tokens: [{ startIndex: 0, type: 'number.redis' }]
		}
	],

	[
		{
			line: '0.',
			tokens: [{ startIndex: 0, type: 'number.redis' }]
		}
	],

	[
		{
			line: '.0',
			tokens: [{ startIndex: 0, type: 'number.redis' }]
		}
	],

	[
		{
			line: '1E-2',
			tokens: [{ startIndex: 0, type: 'number.redis' }]
		}
	],

	[
		{
			line: '1E+2',
			tokens: [{ startIndex: 0, type: 'number.redis' }]
		}
	],

	[
		{
			line: '1E2',
			tokens: [{ startIndex: 0, type: 'number.redis' }]
		}
	],

	[
		{
			line: '0.1E2',
			tokens: [{ startIndex: 0, type: 'number.redis' }]
		}
	],

	[
		{
			line: '1.E2',
			tokens: [{ startIndex: 0, type: 'number.redis' }]
		}
	],

	[
		{
			line: '.1E2',
			tokens: [{ startIndex: 0, type: 'number.redis' }]
		}
	],

	// Strings

	[
		{
			line: 'SET key1 "Hello"',
			tokens: [
				{ startIndex: 0, type: 'keyword.redis' },
				{ startIndex: 3, type: 'white.redis' },
				{ startIndex: 4, type: 'identifier.redis' },
				{ startIndex: 8, type: 'white.redis' },
				{ startIndex: 9, type: 'string.double.redis' }
			]
		}
	],

	[
		{
			line: "SET key1 'Hello'",
			tokens: [
				{ startIndex: 0, type: 'keyword.redis' },
				{ startIndex: 3, type: 'white.redis' },
				{ startIndex: 4, type: 'identifier.redis' },
				{ startIndex: 8, type: 'white.redis' },
				{ startIndex: 9, type: 'string.redis' }
			]
		}
	],

	// Commands

	[
		{
			line: 'DEL key1 key2 key3',
			tokens: [
				{ startIndex: 0, type: 'keyword.redis' },
				{ startIndex: 3, type: 'white.redis' },
				{ startIndex: 4, type: 'identifier.redis' },
				{ startIndex: 8, type: 'white.redis' },
				{ startIndex: 9, type: 'identifier.redis' },
				{ startIndex: 13, type: 'white.redis' },
				{ startIndex: 14, type: 'identifier.redis' }
			]
		}
	],

	[
		{
			line: 'GEOADD Sicily 13.361389 38.115556 "Palermo" 15.087269 37.502669 "Catania"',
			tokens: [
				{ startIndex: 0, type: 'keyword.redis' },
				{ startIndex: 6, type: 'white.redis' },
				{ startIndex: 7, type: 'identifier.redis' },
				{ startIndex: 13, type: 'white.redis' },
				{ startIndex: 14, type: 'number.redis' },
				{ startIndex: 23, type: 'white.redis' },
				{ startIndex: 24, type: 'number.redis' },
				{ startIndex: 33, type: 'white.redis' },
				{ startIndex: 34, type: 'string.double.redis' },
				{ startIndex: 43, type: 'white.redis' },
				{ startIndex: 44, type: 'number.redis' },
				{ startIndex: 53, type: 'white.redis' },
				{ startIndex: 54, type: 'number.redis' },
				{ startIndex: 63, type: 'white.redis' },
				{ startIndex: 64, type: 'string.double.redis' }
			]
		}
	],

	[
		{
			line: 'HGET myhash field1',
			tokens: [
				{ startIndex: 0, type: 'keyword.redis' },
				{ startIndex: 4, type: 'white.redis' },
				{ startIndex: 5, type: 'identifier.redis' },
				{ startIndex: 11, type: 'white.redis' },
				{ startIndex: 12, type: 'identifier.redis' }
			]
		}
	]
]);
