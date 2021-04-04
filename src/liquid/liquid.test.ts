/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization(
	['liquid', 'css'],
	[
		// Just HTML
		[
			{
				line: '<h1>liquid!</h1>',
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

		// Simple output
		[
			{
				line: '<h1>{{ title }}</h1>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 3, type: 'delimiter.html' },
					{ startIndex: 4, type: 'delimiter.liquid' },
					{ startIndex: 6, type: '' },
					{ startIndex: 7, type: 'variable.liquid' },
					{ startIndex: 12, type: '' },
					{ startIndex: 13, type: 'delimiter.liquid' },
					{ startIndex: 15, type: 'delimiter.html' },
					{ startIndex: 17, type: 'tag.html' },
					{ startIndex: 19, type: 'delimiter.html' }
				]
			}
		],

		// // Output filter
		[
			{
				line: '<h1>{{ 3.14159265 | round | default: "pi"  }}</h1>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 3, type: 'delimiter.html' },
					{ startIndex: 4, type: 'delimiter.liquid' },
					{ startIndex: 6, type: '' },
					{ startIndex: 7, type: 'number.liquid' },
					{ startIndex: 17, type: '' },
					{ startIndex: 20, type: 'variable.liquid' },
					{ startIndex: 25, type: '' },
					{ startIndex: 28, type: 'variable.liquid' },
					{ startIndex: 36, type: '' },
					{ startIndex: 37, type: 'string.liquid' },
					{ startIndex: 41, type: '' },
					{ startIndex: 43, type: 'delimiter.liquid' },
					{ startIndex: 45, type: 'delimiter.html' },
					{ startIndex: 47, type: 'tag.html' },
					{ startIndex: 49, type: 'delimiter.html' }
				]
			}
		],

		// Tag
		[
			{
				line: '<div>{% render "files/file123.html" %}</div>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 4, type: 'delimiter.html' },
					{ startIndex: 5, type: 'delimiter.output.liquid' },
					{ startIndex: 7, type: '' },
					{ startIndex: 8, type: 'variable.liquid' },
					{ startIndex: 14, type: '' },
					{ startIndex: 15, type: 'string.liquid' },
					{ startIndex: 35, type: '' },
					{ startIndex: 36, type: 'delimiter.liquid' },
					{ startIndex: 38, type: 'delimiter.html' },
					{ startIndex: 40, type: 'tag.html' },
					{ startIndex: 43, type: 'delimiter.html' }
				]
			}
		],

		// Handlebars comment
		[
			{
				line: '<div>Anything you put between {% comment %} and {% endcomment %} tags</div>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 4, type: 'delimiter.html' },
					{ startIndex: 5, type: '' },
					{ startIndex: 30, type: 'comment.start.liquid' },
					{ startIndex: 43, type: 'comment.content.liquid' },
					{ startIndex: 48, type: 'comment.end.liquid' },
					{ startIndex: 64, type: '' },
					{ startIndex: 69, type: 'delimiter.html' },
					{ startIndex: 71, type: 'tag.html' },
					{ startIndex: 74, type: 'delimiter.html' }
				]
			}
		]
	]
);
