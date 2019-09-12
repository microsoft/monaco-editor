/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { testTokenization } from '../test/testRunner';

testTokenization('abap', [
	[{
		line: '* comment',
		tokens: [
			{ startIndex: 0, type: 'comment.abap' }
		]
	}],
	[{
		line: ' " comment',
		tokens: [
			{ startIndex: 0, type: '' },
			{ startIndex: 1, type: 'comment.abap' }
		]
	}],
	[{
		line: 'write hello.',
		tokens: [
			{ startIndex: 0, type: 'keyword.abap' },
			{ startIndex: 5, type: '' },
			{ startIndex: 6, type: 'identifier.abap' },
			{ startIndex: 11, type: 'delimiter.abap' }
		]
	}],
	[{
		line: 'IF 2 = 3.',
		tokens: [
			{ startIndex: 0, type: 'keyword.abap' },
			{ startIndex: 2, type: '' },
			{ startIndex: 3, type: 'number.abap' },
			{ startIndex: 4, type: '' },
			{ startIndex: 5, type: 'operator.abap' },
			{ startIndex: 6, type: '' },
			{ startIndex: 7, type: 'number.abap' },
			{ startIndex: 8, type: 'delimiter.abap' }
		]
	}],
	[{
		line: '\'hello\'',
		tokens: [
			{ startIndex: 0, type: 'string.abap' },
		]
	}],
	[{
		line: '|hello|',
		tokens: [
			{ startIndex: 0, type: 'string.abap' },
		]
	}],
	[{
		line: 'write: hello, world.',
		tokens: [
			{ startIndex: 0, type: 'keyword.abap' },
			{ startIndex: 5, type: 'delimiter.abap' },
			{ startIndex: 6, type: '' },
			{ startIndex: 7, type: 'identifier.abap' },
			{ startIndex: 12, type: 'delimiter.abap' },
			{ startIndex: 13, type: '' },
			{ startIndex: 14, type: 'identifier.abap' },
			{ startIndex: 19, type: 'delimiter.abap' },
		]
	}],
	[{
		line: 'method_call( param ).',
		tokens: [
			{ startIndex: 0, type: 'identifier.abap' },
			{ startIndex: 11, type: 'delimiter.parenthesis.abap' },
			{ startIndex: 12, type: '' },
			{ startIndex: 13, type: 'identifier.abap' },
			{ startIndex: 18, type: '' },
			{ startIndex: 19, type: 'delimiter.parenthesis.abap' },
			{ startIndex: 20, type: 'delimiter.abap' },
		]
	}],
	[{
		line: '\'he\'\' llo\'',
		tokens: [
			{ startIndex: 0, type: 'string.abap' },
		]
	}],
	[{
		line: '|hel\\|lo|',
		tokens: [
			{ startIndex: 0, type: 'string.abap' },
		]
	}],
]);
