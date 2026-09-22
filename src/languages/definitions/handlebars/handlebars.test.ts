/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization(
	['handlebars', 'css'],
	[
		// Just HTML
		[
			{
				line: '<h1>handlebars!</h1>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 3, type: 'delimiter.html' },
					{ startIndex: 4, type: '' },
					{ startIndex: 15, type: 'delimiter.html' },
					{ startIndex: 17, type: 'tag.html' },
					{ startIndex: 19, type: 'delimiter.html' }
				]
			}
		],

		// Expressions
		[
			{
				line: '<h1>{{ title }}</h1>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 3, type: 'delimiter.html' },
					{ startIndex: 4, type: 'delimiter.handlebars' },
					{ startIndex: 6, type: '' },
					{ startIndex: 7, type: 'variable.parameter.handlebars' },
					{ startIndex: 12, type: '' },
					{ startIndex: 13, type: 'delimiter.handlebars' },
					{ startIndex: 15, type: 'delimiter.html' },
					{ startIndex: 17, type: 'tag.html' },
					{ startIndex: 19, type: 'delimiter.html' }
				]
			}
		],

		// Expressions Sans Whitespace
		[
			{
				line: '<h1>{{title}}</h1>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 3, type: 'delimiter.html' },
					{ startIndex: 4, type: 'delimiter.handlebars' },
					{ startIndex: 6, type: 'variable.parameter.handlebars' },
					{ startIndex: 11, type: 'delimiter.handlebars' },
					{ startIndex: 13, type: 'delimiter.html' },
					{ startIndex: 15, type: 'tag.html' },
					{ startIndex: 17, type: 'delimiter.html' }
				]
			}
		],

		// Unescaped Expressions
		[
			{
				line: '<h1>{{{ title }}}</h1>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 3, type: 'delimiter.html' },
					{ startIndex: 4, type: 'delimiter.handlebars' },
					{ startIndex: 7, type: '' },
					{ startIndex: 8, type: 'variable.parameter.handlebars' },
					{ startIndex: 13, type: '' },
					{ startIndex: 14, type: 'delimiter.handlebars' },
					{ startIndex: 17, type: 'delimiter.html' },
					{ startIndex: 19, type: 'tag.html' },
					{ startIndex: 21, type: 'delimiter.html' }
				]
			}
		],

		// Blocks
		[
			{
				line: '<ul>{{#each items}}<li>{{item}}</li>{{/each}}</ul>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 3, type: 'delimiter.html' },
					{ startIndex: 4, type: 'delimiter.handlebars' },
					{ startIndex: 6, type: 'keyword.helper.handlebars' },
					{ startIndex: 11, type: '' },
					{ startIndex: 12, type: 'variable.parameter.handlebars' },
					{ startIndex: 17, type: 'delimiter.handlebars' },
					{ startIndex: 19, type: 'delimiter.html' },
					{ startIndex: 20, type: 'tag.html' },
					{ startIndex: 22, type: 'delimiter.html' },
					{ startIndex: 23, type: 'delimiter.handlebars' },
					{ startIndex: 25, type: 'variable.parameter.handlebars' },
					{ startIndex: 29, type: 'delimiter.handlebars' },
					{ startIndex: 31, type: 'delimiter.html' },
					{ startIndex: 33, type: 'tag.html' },
					{ startIndex: 35, type: 'delimiter.html' },
					{ startIndex: 36, type: 'delimiter.handlebars' },
					{ startIndex: 38, type: 'keyword.helper.handlebars' },
					{ startIndex: 43, type: 'delimiter.handlebars' },
					{ startIndex: 45, type: 'delimiter.html' },
					{ startIndex: 47, type: 'tag.html' },
					{ startIndex: 49, type: 'delimiter.html' }
				]
			}
		],

		// Multiline
		[
			{
				line: '<div>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 4, type: 'delimiter.html' }
				]
			},
			{
				line: '{{#if foo}}',
				tokens: [
					{ startIndex: 0, type: 'delimiter.handlebars' },
					{ startIndex: 2, type: 'keyword.helper.handlebars' },
					{ startIndex: 5, type: '' },
					{ startIndex: 6, type: 'variable.parameter.handlebars' },
					{ startIndex: 9, type: 'delimiter.handlebars' }
				]
			},
			{
				line: '<span>{{bar}}</span>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 5, type: 'delimiter.html' },
					{ startIndex: 6, type: 'delimiter.handlebars' },
					{ startIndex: 8, type: 'variable.parameter.handlebars' },
					{ startIndex: 11, type: 'delimiter.handlebars' },
					{ startIndex: 13, type: 'delimiter.html' },
					{ startIndex: 15, type: 'tag.html' },
					{ startIndex: 19, type: 'delimiter.html' }
				]
			},
			{
				line: '{{/if}}',
				tokens: [
					{ startIndex: 0, type: 'delimiter.handlebars' },
					{ startIndex: 2, type: 'keyword.helper.handlebars' },
					{ startIndex: 5, type: 'delimiter.handlebars' }
				]
			}
		],

		// Div end
		[
			{
				line: '</div>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 2, type: 'tag.html' },
					{ startIndex: 5, type: 'delimiter.html' }
				]
			}
		],

		// HTML Expressions
		[
			{
				line: '<script type="text/x-handlebars-template"><h1>{{ title }}</h1></script>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 7, type: '' },
					{ startIndex: 8, type: 'attribute.name' },
					{ startIndex: 12, type: 'delimiter' },
					{ startIndex: 13, type: 'attribute.value' },
					{ startIndex: 41, type: 'delimiter.html' },
					{ startIndex: 42, type: 'delimiter.html' },
					{ startIndex: 43, type: 'tag.html' },
					{ startIndex: 45, type: 'delimiter.html' },
					{ startIndex: 46, type: 'delimiter.handlebars' },
					{ startIndex: 48, type: '' },
					{ startIndex: 49, type: 'variable.parameter.handlebars' },
					{ startIndex: 54, type: '' },
					{ startIndex: 55, type: 'delimiter.handlebars' },
					{ startIndex: 57, type: 'delimiter.html' },
					{ startIndex: 59, type: 'tag.html' },
					{ startIndex: 61, type: 'delimiter.html' },
					{ startIndex: 62, type: 'delimiter.html' },
					{ startIndex: 64, type: 'tag.html' },
					{ startIndex: 70, type: 'delimiter.html' }
				]
			}
		],

		// Multi-line HTML Expressions
		[
			{
				line: '<script type="text/x-handlebars-template">',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 7, type: '' },
					{ startIndex: 8, type: 'attribute.name' },
					{ startIndex: 12, type: 'delimiter' },
					{ startIndex: 13, type: 'attribute.value' },
					{ startIndex: 41, type: 'delimiter.html' }
				]
			},
			{
				line: '<h1>{{ title }}</h1>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 3, type: 'delimiter.html' },
					{ startIndex: 4, type: 'delimiter.handlebars' },
					{ startIndex: 6, type: '' },
					{ startIndex: 7, type: 'variable.parameter.handlebars' },
					{ startIndex: 12, type: '' },
					{ startIndex: 13, type: 'delimiter.handlebars' },
					{ startIndex: 15, type: 'delimiter.html' },
					{ startIndex: 17, type: 'tag.html' },
					{ startIndex: 19, type: 'delimiter.html' }
				]
			},
			{
				line: '</script>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 2, type: 'tag.html' },
					{ startIndex: 8, type: 'delimiter.html' }
				]
			}
		],

		// HTML Nested Modes
		[
			{
				line: '{{foo}}<script></script>{{bar}}',
				tokens: [
					{ startIndex: 0, type: 'delimiter.handlebars' },
					{ startIndex: 2, type: 'variable.parameter.handlebars' },
					{ startIndex: 5, type: 'delimiter.handlebars' },
					{ startIndex: 7, type: 'delimiter.html' },
					{ startIndex: 8, type: 'tag.html' },
					{ startIndex: 14, type: 'delimiter.html' },
					// { startIndex:15, type: 'delimiter.html' },
					{ startIndex: 17, type: 'tag.html' },
					{ startIndex: 23, type: 'delimiter.html' },
					{ startIndex: 24, type: 'delimiter.handlebars' },
					{ startIndex: 26, type: 'variable.parameter.handlebars' },
					{ startIndex: 29, type: 'delimiter.handlebars' }
				]
			}
		],

		// else keyword
		[
			{
				line: '{{else}}',
				tokens: [
					{ startIndex: 0, type: 'delimiter.handlebars' },
					{ startIndex: 2, type: 'keyword.helper.handlebars' },
					{ startIndex: 6, type: 'delimiter.handlebars' }
				]
			}
		],

		// else keyword #2
		[
			{
				line: '{{elseFoo}}',
				tokens: [
					{ startIndex: 0, type: 'delimiter.handlebars' },
					{ startIndex: 2, type: 'variable.parameter.handlebars' },
					{ startIndex: 9, type: 'delimiter.handlebars' }
				]
			}
		],

		// Token inside attribute
		[
			{
				line: '<a href="/posts/{{permalink}}">',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 2, type: '' },
					{ startIndex: 3, type: 'attribute.name' },
					{ startIndex: 7, type: 'delimiter' },
					{ startIndex: 8, type: 'attribute.value' },
					{ startIndex: 30, type: 'delimiter.html' }
				]
			}
		],

		[
			{
				line: '{{test "coloring/looks broken"}}">',
				tokens: [
					{ startIndex: 0, type: 'delimiter.handlebars' },
					{ startIndex: 2, type: 'variable.parameter.handlebars' },
					{ startIndex: 6, type: '' },
					{ startIndex: 7, type: 'string.handlebars' },
					{ startIndex: 30, type: 'delimiter.handlebars' },
					{ startIndex: 32, type: '' }
				]
			}
		],

		// Block comment
		[
			{
				line: '{{!-- block comment --}}',
				tokens: [
					{ startIndex: 0, type: 'comment.block.start.handlebars' },
					{ startIndex: 5, type: 'comment.content.handlebars' },
					{ startIndex: 20, type: 'comment.block.end.handlebars' }
				]
			}
		],

		// Block comment with mustache
		[
			{
				line: '{{!-- block comment }} with mustache --}}',
				tokens: [
					{ startIndex: 0, type: 'comment.block.start.handlebars' },
					{ startIndex: 5, type: 'comment.content.handlebars' },
					{ startIndex: 37, type: 'comment.block.end.handlebars' }
				]
			}
		],

		// Handlebars comment
		[
			{
				line: '{{! comment }}',
				tokens: [
					{ startIndex: 0, type: 'comment.start.handlebars' },
					{ startIndex: 3, type: 'comment.content.handlebars' },
					{ startIndex: 12, type: 'comment.end.handlebars' }
				]
			}
		]
	]
);
