/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('julia', [
	[
		{
			line: 'a = 1',
			tokens: [
				{ startIndex: 0, type: 'identifier.julia' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'source.julia' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.julia' }
			]
		}
	],

	[
		{
			line: 'b(c) = 2c',
			tokens: [
				{ startIndex: 0, type: 'keyword.flow.julia' },
				{ startIndex: 1, type: 'delimiter.parenthesis.julia' },
				{ startIndex: 2, type: 'identifier.julia' },
				{ startIndex: 3, type: 'delimiter.parenthesis.julia' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'source.julia' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'number.julia' },
				{ startIndex: 8, type: 'identifier.julia' }
			]
		}
	]
]);
