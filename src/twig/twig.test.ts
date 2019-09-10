/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { testTokenization } from '../test/testRunner';

testTokenization(['twig'], [
	/**
	 * Comments
	 */
	[{
		line: '{# Hello World! #}',
		tokens: [
			{ startIndex: 0, type: 'comment.twig' },
		],
	}],
	[{
		line: '{#Hello World!#}',
		tokens: [
			{ startIndex: 0, type: 'comment.twig' },
		],
	}],

	/**
	 * Variables Tags
	 */
	// Whitespace
	[{
		line: '{{}}',
		tokens: [
			{ startIndex: 0, type: 'delimiter.twig' },
		],
	}],
	[{
		line: '{{ }}',
		tokens: [
			{ startIndex: 0, type: 'delimiter.twig' },
			{ startIndex: 2, type: '' },
			{ startIndex: 3, type: 'delimiter.twig' },
		],
	}],
	// Numbers
	[{
		line: '{{1}}',
		tokens: [
			{ startIndex: 0, type: 'delimiter.twig' },
			{ startIndex: 2, type: 'number.twig' },
			{ startIndex: 3, type: 'delimiter.twig' },
		],
	}],
	[{
		line: '{{ 1 }}',
		tokens: [
			{ startIndex: 0, type: 'delimiter.twig' },
			{ startIndex: 2, type: '' },
			{ startIndex: 3, type: 'number.twig' },
			{ startIndex: 4, type: '' },
			{ startIndex: 5, type: 'delimiter.twig' },
		],
	}],
	[{
		line: '{{ 1 }}',
		tokens: [
			{ startIndex: 0, type: 'delimiter.twig' },
			{ startIndex: 2, type: '' },
			{ startIndex: 3, type: 'number.twig' },
			{ startIndex: 4, type: '' },
			{ startIndex: 5, type: 'delimiter.twig' },
		],
	}],
	[{
		line: '{{ 1.1 }}',
		tokens: [
			{ startIndex: 0, type: 'delimiter.twig' },
			{ startIndex: 2, type: '' },
			{ startIndex: 3, type: 'number.twig' },
			{ startIndex: 6, type: '' },
			{ startIndex: 7, type: 'delimiter.twig' },
		],
	}],
	// Strings
	[{
		line: "{{ 'hi' }}",
		tokens: [
			{ startIndex: 0, type: 'delimiter.twig' },
			{ startIndex: 2, type: '' },
			{ startIndex: 3, type: 'string.twig' },
			{ startIndex: 7, type: '' },
			{ startIndex: 8, type: 'delimiter.twig' },
		],
	}],
	[{
		line: '{{ "hi" }}',
		tokens: [
			{ startIndex: 0, type: 'delimiter.twig' },
			{ startIndex: 2, type: '' },
			{ startIndex: 3, type: 'string.twig' },
			{ startIndex: 7, type: '' },
			{ startIndex: 8, type: 'delimiter.twig' },
		],
	}],
	[{
		line: '{{ "hi #{1}" }}',
		tokens: [
			{ startIndex: 0, type: 'delimiter.twig' },
			{ startIndex: 2, type: '' },
			{ startIndex: 3, type: 'string.twig' },
			{ startIndex: 9, type: 'number.twig' },
			{ startIndex: 10, type: 'string.twig' },
			{ startIndex: 12, type: '' },
			{ startIndex: 13, type: 'delimiter.twig' },
		],
	}],
	// Variables and functions
	[{
		line: '{{ foo }}',
		tokens: [
			{ startIndex: 0, type: 'delimiter.twig' },
			{ startIndex: 2, type: '' },
			{ startIndex: 3, type: 'variable.twig' },
			{ startIndex: 6, type: '' },
			{ startIndex: 7, type: 'delimiter.twig' },
		],
	}],
	[{
		line: '{{ foo(42) }}',
		tokens: [
			{ startIndex: 0, type: 'delimiter.twig' },
			{ startIndex: 2, type: '' },
			{ startIndex: 3, type: 'variable.twig' },
			{ startIndex: 6, type: 'delimiter.twig' },
			{ startIndex: 7, type: 'number.twig' },
			{ startIndex: 9, type: 'delimiter.twig' },
			{ startIndex: 10, type: '' },
			{ startIndex: 11, type: 'delimiter.twig' },
		],
	}],
	// Operators
	[{
		line: '{{ 1 + 2 - 3 / 4 // 5 % 6 * 7 ** 8 }}',
		tokens: [
			{ startIndex: 0, type: 'delimiter.twig' },
			{ startIndex: 2, type: '' },
			{ startIndex: 3, type: 'number.twig' },
			{ startIndex: 4, type: '' },
			{ startIndex: 5, type: 'operators.twig' },
			{ startIndex: 6, type: '' },
			{ startIndex: 7, type: 'number.twig' },
			{ startIndex: 8, type: '' },
			{ startIndex: 9, type: 'operators.twig' },
			{ startIndex: 10, type: '' },
			{ startIndex: 11, type: 'number.twig' },
			{ startIndex: 12, type: '' },
			{ startIndex: 13, type: 'operators.twig' },
			{ startIndex: 14, type: '' },
			{ startIndex: 15, type: 'number.twig' },
			{ startIndex: 16, type: '' },
			{ startIndex: 17, type: 'operators.twig' },
			{ startIndex: 19, type: '' },
			{ startIndex: 20, type: 'number.twig' },
			{ startIndex: 21, type: '' },
			{ startIndex: 22, type: 'operators.twig' },
			{ startIndex: 23, type: '' },
			{ startIndex: 24, type: 'number.twig' },
			{ startIndex: 25, type: '' },
			{ startIndex: 26, type: 'operators.twig' },
			{ startIndex: 27, type: '' },
			{ startIndex: 28, type: 'number.twig' },
			{ startIndex: 29, type: '' },
			{ startIndex: 30, type: 'operators.twig' },
			{ startIndex: 32, type: '' },
			{ startIndex: 33, type: 'number.twig' },
			{ startIndex: 34, type: '' },
			{ startIndex: 35, type: 'delimiter.twig' },
		],
	}],
	[{
		line: '{{ true and false or true and not false }}',
		tokens: [
			{ startIndex: 0, type: 'delimiter.twig' },
			{ startIndex: 2, type: '' },
			{ startIndex: 3, type: 'keyword.twig' },
			{ startIndex: 7, type: '' },
			{ startIndex: 8, type: 'operators.twig' },
			{ startIndex: 11, type: '' },
			{ startIndex: 12, type: 'keyword.twig' },
			{ startIndex: 17, type: '' },
			{ startIndex: 18, type: 'operators.twig' },
			{ startIndex: 20, type: '' },
			{ startIndex: 21, type: 'keyword.twig' },
			{ startIndex: 25, type: '' },
			{ startIndex: 26, type: 'operators.twig' },
			{ startIndex: 29, type: '' },
			{ startIndex: 30, type: 'operators.twig' },
			{ startIndex: 33, type: '' },
			{ startIndex: 34, type: 'keyword.twig' },
			{ startIndex: 39, type: '' },
			{ startIndex: 40, type: 'delimiter.twig' },
		],
	}],
]);
