/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('razor', [
	// Embedding - embedded html
	[
		{
			line: '@{ var x; <b>x</b> }',
			tokens: [
				{ startIndex: 0, type: 'metatag.cs' },
				{ startIndex: 2, type: '' },
				{ startIndex: 3, type: 'keyword.cs' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'identifier.cs' },
				{ startIndex: 8, type: 'delimiter.cs' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'delimiter.html' },
				{ startIndex: 11, type: 'tag.html' },
				{ startIndex: 12, type: 'delimiter.html' },
				{ startIndex: 13, type: 'identifier.cs' },
				{ startIndex: 14, type: 'delimiter.html' },
				{ startIndex: 16, type: 'tag.html' },
				{ startIndex: 17, type: 'delimiter.html' },
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'metatag.cs' }
			]
		}
	],

	// Comments - razor comment inside csharp
	[
		{
			line: '@{ var x; @* comment *@ x= 0; }',
			tokens: [
				{ startIndex: 0, type: 'metatag.cs' },
				{ startIndex: 2, type: '' },
				{ startIndex: 3, type: 'keyword.cs' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'identifier.cs' },
				{ startIndex: 8, type: 'delimiter.cs' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'comment.cs' },
				{ startIndex: 23, type: '' },
				{ startIndex: 24, type: 'identifier.cs' },
				{ startIndex: 25, type: 'delimiter.cs' },
				{ startIndex: 26, type: '' },
				{ startIndex: 27, type: 'number.cs' },
				{ startIndex: 28, type: 'delimiter.cs' },
				{ startIndex: 29, type: '' },
				{ startIndex: 30, type: 'metatag.cs' }
			]
		}
	],

	// Blocks - simple
	[
		{
			line: '@{ var total = 0; }',
			tokens: [
				{ startIndex: 0, type: 'metatag.cs' },
				{ startIndex: 2, type: '' },
				{ startIndex: 3, type: 'keyword.cs' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'identifier.cs' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'delimiter.cs' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'number.cs' },
				{ startIndex: 16, type: 'delimiter.cs' },
				{ startIndex: 17, type: '' },
				{ startIndex: 18, type: 'metatag.cs' }
			]
		}
	],

	// [{
	// line: '@if(true){ var total = 0; }',
	// tokens: [
	// 	{ startIndex: 0, type: 'metatag.cs' },
	// 	{ startIndex: 1, type: 'keyword.cs' },
	// 	{ startIndex: 3, type: 'punctuation.parenthesis.cs' },
	// 	{ startIndex: 4, type: 'keyword.cs' },
	// 	{ startIndex: 8, type: 'punctuation.parenthesis.cs' },
	// 	{ startIndex: 9, type: 'metatag.cs' },
	// 	{ startIndex: 10, type: '' },
	// 	{ startIndex: 11, type: 'keyword.cs' },
	// 	{ startIndex: 14, type: '' },
	// 	{ startIndex: 15, type: 'identifier.cs' },
	// 	{ startIndex: 20, type: '' },
	// 	{ startIndex: 21, type: 'delimiter.cs' },
	// 	{ startIndex: 22, type: '' },
	// 	{ startIndex: 23, type: 'number.cs' },
	// 	{ startIndex: 24, type: 'delimiter.cs' },
	// 	{ startIndex: 25, type: '' },
	// 	{ startIndex: 26, type: 'metatag.cs' }
	// ]}],

	// Expressions - csharp expressions in html
	[
		{
			line: 'test@xyz<br>',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'metatag.cs' },
				{ startIndex: 5, type: 'identifier.cs' },
				{ startIndex: 8, type: 'delimiter.html' },
				{ startIndex: 9, type: 'tag.html' },
				{ startIndex: 11, type: 'delimiter.html' }
			]
		}
	],

	[
		{
			line: 'test@xyz',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'metatag.cs' },
				{ startIndex: 5, type: 'identifier.cs' }
			]
		}
	],

	[
		{
			line: 'test @ xyz',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 5, type: 'metatag.cs' },
				{ startIndex: 6, type: 'identifier.cs' }
			]
		}
	],

	[
		{
			line: 'test @(foo) xyz',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 5, type: 'metatag.cs' },
				{ startIndex: 7, type: 'identifier.cs' },
				{ startIndex: 10, type: 'metatag.cs' },
				{ startIndex: 11, type: '' }
			]
		}
	],

	[
		{
			line: 'test @(foo(")")) xyz',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 5, type: 'metatag.cs' },
				{ startIndex: 7, type: 'identifier.cs' },
				{ startIndex: 10, type: 'delimiter.parenthesis.cs' },
				{ startIndex: 11, type: 'string.cs' },
				{ startIndex: 14, type: 'delimiter.parenthesis.cs' },
				{ startIndex: 15, type: 'metatag.cs' },
				{ startIndex: 16, type: '' }
			]
		}
	],

	// Escaping - escaped at character
	[
		{
			line: 'test@@xyz',
			tokens: [{ startIndex: 0, type: '' }]
		}
	]
]);
