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
				{ startIndex: 13, type: '' },
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
	],

	// Modern Razor directives
	[
		{
			line: '@page "/counter"',
			tokens: [
				{ startIndex: 0, type: 'metatag.cs' },
				{ startIndex: 1, type: 'keyword.cs' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'string.cs' }
			]
		},
		{
			line: '@using System.Net.Http',
			tokens: [
				{ startIndex: 0, type: 'metatag.cs' },
				{ startIndex: 1, type: 'keyword.cs' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'identifier.cs' },
				{ startIndex: 13, type: 'delimiter.cs' },
				{ startIndex: 14, type: 'identifier.cs' },
				{ startIndex: 17, type: 'delimiter.cs' },
				{ startIndex: 18, type: 'identifier.cs' }
			]
		},
		{
			line: '@inject IJSRuntime JS',
			tokens: [
				{ startIndex: 0, type: 'metatag.cs' },
				{ startIndex: 1, type: 'keyword.cs' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.cs' },
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'identifier.cs' }
			]
		},
		{
			line: '<h1>Counter</h1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.html' },
				{ startIndex: 1, type: 'tag.html' },
				{ startIndex: 3, type: 'delimiter.html' },
				{ startIndex: 4, type: '' },
				{ startIndex: 11, type: 'delimiter.html' },
				{ startIndex: 13, type: 'tag.html' },
				{ startIndex: 15, type: 'delimiter.html' }
			]
		}
	],

	// Component code blocks and modern C# lexical forms
	[
		{
			line: '@code {',
			tokens: [
				{ startIndex: 0, type: 'metatag.cs' },
				{ startIndex: 1, type: 'keyword.cs' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.bracket.cs' }
			]
		},
		{
			line: '    private int count = 1_000;',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'keyword.cs' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'keyword.cs' },
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'identifier.cs' },
				{ startIndex: 21, type: '' },
				{ startIndex: 22, type: 'delimiter.cs' },
				{ startIndex: 23, type: '' },
				{ startIndex: 24, type: 'number.cs' },
				{ startIndex: 29, type: 'delimiter.cs' }
			]
		},
		{
			line: '    private string Message => $@"Count: {count}";',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'keyword.cs' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'keyword.cs' },
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'identifier.cs' },
				{ startIndex: 26, type: '' },
				{ startIndex: 27, type: 'delimiter.cs' },
				{ startIndex: 29, type: '' },
				{ startIndex: 30, type: 'string.cs' },
				{ startIndex: 48, type: 'delimiter.cs' }
			]
		},
		{
			line: '    /* block comment */',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'comment.cs' }
			]
		},
		{
			line: '}',
			tokens: [{ startIndex: 0, type: 'delimiter.bracket.cs' }]
		}
	],

	// Control flow with nested markup
	[
		{
			line: '@if (count > 0) {',
			tokens: [
				{ startIndex: 0, type: 'metatag.cs' },
				{ startIndex: 1, type: 'keyword.cs' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'delimiter.parenthesis.cs' },
				{ startIndex: 5, type: 'identifier.cs' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'delimiter.cs' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'number.cs' },
				{ startIndex: 14, type: 'delimiter.parenthesis.cs' },
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'delimiter.bracket.cs' }
			]
		},
		{
			line: '    <p>Count: @count</p>',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'delimiter.html' },
				{ startIndex: 5, type: 'tag.html' },
				{ startIndex: 6, type: 'delimiter.html' },
				{ startIndex: 7, type: '' },
				{ startIndex: 14, type: 'metatag.cs' },
				{ startIndex: 15, type: 'identifier.cs' },
				{ startIndex: 20, type: 'delimiter.html' },
				{ startIndex: 22, type: 'tag.html' },
				{ startIndex: 23, type: 'delimiter.html' }
			]
		},
		{
			line: '} else {',
			tokens: [
				{ startIndex: 0, type: 'delimiter.bracket.cs' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'keyword.cs' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'delimiter.bracket.cs' }
			]
		},
		{
			line: '    <p>None</p>',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'delimiter.html' },
				{ startIndex: 5, type: 'tag.html' },
				{ startIndex: 6, type: 'delimiter.html' },
				{ startIndex: 7, type: '' },
				{ startIndex: 11, type: 'delimiter.html' },
				{ startIndex: 13, type: 'tag.html' },
				{ startIndex: 14, type: 'delimiter.html' }
			]
		},
		{
			line: '}',
			tokens: [{ startIndex: 0, type: 'delimiter.bracket.cs' }]
		}
	],

	// Async control flow and self-closing components
	[
		{
			line: '@await foreach (var item in items) {',
			tokens: [
				{ startIndex: 0, type: 'metatag.cs' },
				{ startIndex: 1, type: 'keyword.cs' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'keyword.cs' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'delimiter.parenthesis.cs' },
				{ startIndex: 16, type: 'keyword.cs' },
				{ startIndex: 19, type: '' },
				{ startIndex: 20, type: 'identifier.cs' },
				{ startIndex: 24, type: '' },
				{ startIndex: 25, type: 'keyword.cs' },
				{ startIndex: 27, type: '' },
				{ startIndex: 28, type: 'identifier.cs' },
				{ startIndex: 33, type: 'delimiter.parenthesis.cs' },
				{ startIndex: 34, type: '' },
				{ startIndex: 35, type: 'delimiter.bracket.cs' }
			]
		},
		{
			line: '    <ItemRow Item="@item" />',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'delimiter.html' },
				{ startIndex: 5, type: 'tag.html' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'attribute.name' },
				{ startIndex: 17, type: 'delimiter' },
				{ startIndex: 18, type: 'attribute.value' },
				{ startIndex: 25, type: '' },
				{ startIndex: 26, type: 'delimiter.html' }
			]
		},
		{
			line: '}',
			tokens: [{ startIndex: 0, type: 'delimiter.bracket.cs' }]
		}
	],

	// Blazor directive attributes
	[
		{
			line: '<input @bind-Value:event="oninput" />',
			tokens: [
				{ startIndex: 0, type: 'delimiter.html' },
				{ startIndex: 1, type: 'tag.html' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'attribute.name' },
				{ startIndex: 24, type: 'delimiter' },
				{ startIndex: 25, type: 'attribute.value' },
				{ startIndex: 34, type: '' },
				{ startIndex: 35, type: 'delimiter.html' }
			]
		}
	],

	// Legacy block and section directives remain supported
	[
		{
			line: '@functions { }',
			tokens: [
				{ startIndex: 0, type: 'metatag.cs' },
				{ startIndex: 1, type: 'keyword.cs' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'delimiter.bracket.cs' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'delimiter.bracket.cs' }
			]
		}
	],
	[
		{
			line: '@section Scripts { }',
			tokens: [
				{ startIndex: 0, type: 'metatag.cs' },
				{ startIndex: 1, type: 'keyword.cs' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.cs' },
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'delimiter.bracket.cs' },
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'delimiter.bracket.cs' }
			]
		}
	]
]);

testTokenization(
	['razor', 'javascript'],
	[
		// Razor blocks suspend and restore embedded tokenizers
		[
			{
				line: '<script>let @if (x) { } let</script>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 7, type: 'delimiter.html' },
					{ startIndex: 8, type: 'keyword.js' },
					{ startIndex: 11, type: '' },
					{ startIndex: 12, type: 'metatag.cs' },
					{ startIndex: 13, type: 'keyword.cs' },
					{ startIndex: 15, type: '' },
					{ startIndex: 16, type: 'delimiter.parenthesis.cs' },
					{ startIndex: 17, type: 'identifier.cs' },
					{ startIndex: 18, type: 'delimiter.parenthesis.cs' },
					{ startIndex: 19, type: '' },
					{ startIndex: 20, type: 'delimiter.bracket.cs' },
					{ startIndex: 21, type: '' },
					{ startIndex: 22, type: 'delimiter.bracket.cs' },
					{ startIndex: 23, type: '' },
					{ startIndex: 24, type: 'keyword.js' },
					{ startIndex: 27, type: 'delimiter.html' },
					{ startIndex: 29, type: 'tag.html' },
					{ startIndex: 35, type: 'delimiter.html' }
				]
			}
		]
	]
);
