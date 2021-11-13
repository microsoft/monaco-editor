/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('flow9', [
	[
		{
			line: '//',
			tokens: [{ startIndex: 0, type: 'comment.flow' }]
		}
	],

	[
		{
			line: '    // a comment',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'comment.flow' }
			]
		}
	],

	[
		{
			line: '/* //*/ a',
			tokens: [
				{ startIndex: 0, type: 'comment.flow' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.flow' }
			]
		}
	],

	[
		{
			line: '/import file 1',
			tokens: [
				{ startIndex: 0, type: 'delimiter.flow' },
				{ startIndex: 1, type: 'keyword.flow' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.flow' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'number.flow' }
			]
		}
	],

	[
		{
			line: 'getDefaults() -> [int] {}',
			tokens: [
				{ startIndex: 0, type: 'identifier.flow' },
				{ startIndex: 11, type: 'delimiter.flow' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'delimiter.flow' },
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'delimiter.flow' },
				{ startIndex: 18, type: 'type.flow' },
				{ startIndex: 21, type: 'delimiter.flow' },
				{ startIndex: 22, type: '' },
				{ startIndex: 23, type: 'delimiter.flow' }
			]
		}
	],

	// Numbers
	[
		{
			line: '0',
			tokens: [{ startIndex: 0, type: 'number.flow' }]
		}
	],

	[
		{
			line: '0.10',
			tokens: [{ startIndex: 0, type: 'number.flow' }]
		}
	],

	[
		{
			line: '0x123',
			tokens: [{ startIndex: 0, type: 'number.flow' }]
		}
	],

	[
		{
			line: '052_',
			tokens: [
				{ startIndex: 0, type: 'number.flow' },
				{ startIndex: 3, type: 'identifier.flow' }
			]
		}
	],

	[
		{
			line: '0+0',
			tokens: [
				{ startIndex: 0, type: 'number.flow' },
				{ startIndex: 1, type: 'delimiter.flow' },
				{ startIndex: 2, type: 'number.flow' }
			]
		}
	],

	[
		{
			line: '0 + 0',
			tokens: [
				{ startIndex: 0, type: 'number.flow' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.flow' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.flow' }
			]
		}
	],

	[
		{
			line: '"simple string"',
			tokens: [{ startIndex: 0, type: 'string.flow' }]
		}
	],

	[
		{
			line: '""',
			tokens: [{ startIndex: 0, type: 'string.flow' }]
		}
	],

	[
		{
			line: '"""',
			tokens: [
				{ startIndex: 0, type: 'string.flow' },
				{ startIndex: 2, type: 'string.invalid.flow' }
			]
		}
	]
]);
