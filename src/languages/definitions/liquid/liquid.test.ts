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
					{ startIndex: 4, type: 'delimiter.output.liquid' },
					{ startIndex: 6, type: '' },
					{ startIndex: 7, type: 'variable.liquid' },
					{ startIndex: 12, type: '' },
					{ startIndex: 13, type: 'delimiter.output.liquid' },
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
					{ startIndex: 4, type: 'delimiter.output.liquid' },
					{ startIndex: 6, type: '' },
					{ startIndex: 7, type: 'number.liquid' },
					{ startIndex: 17, type: '' },
					{ startIndex: 20, type: 'predefined.liquid' },
					{ startIndex: 25, type: '' },
					{ startIndex: 28, type: 'predefined.liquid' },
					{ startIndex: 35, type: 'variable.liquid' },
					{ startIndex: 36, type: '' },
					{ startIndex: 37, type: 'string.liquid' },
					{ startIndex: 41, type: '' },
					{ startIndex: 43, type: 'delimiter.output.liquid' },
					{ startIndex: 45, type: 'delimiter.html' },
					{ startIndex: 47, type: 'tag.html' },
					{ startIndex: 49, type: 'delimiter.html' }
				]
			}
		],

		// Simple Tag
		[
			{
				line: '<div>{% render "files/file123.html" %}</div>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 4, type: 'delimiter.html' },
					{ startIndex: 5, type: 'delimiter.tag.liquid' },
					{ startIndex: 7, type: '' },
					{ startIndex: 8, type: 'predefined.liquid' },
					{ startIndex: 14, type: '' },
					{ startIndex: 15, type: 'string.liquid' },
					{ startIndex: 35, type: '' },
					{ startIndex: 36, type: 'delimiter.tag.liquid' },
					{ startIndex: 38, type: 'delimiter.html' },
					{ startIndex: 40, type: 'tag.html' },
					{ startIndex: 43, type: 'delimiter.html' }
				]
			}
		],

		// Tag with drop
		[
			{
				line: '<div>{{ thing.other_thing }}</div>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 4, type: 'delimiter.html' },
					{ startIndex: 5, type: 'delimiter.output.liquid' },
					{ startIndex: 7, type: '' },
					{ startIndex: 8, type: 'variable.liquid' },
					{ startIndex: 13, type: '' },
					{ startIndex: 14, type: 'variable.liquid' },
					{ startIndex: 25, type: '' },
					{ startIndex: 26, type: 'delimiter.output.liquid' },
					{ startIndex: 28, type: 'delimiter.html' },
					{ startIndex: 30, type: 'tag.html' },
					{ startIndex: 33, type: 'delimiter.html' }
				]
			}
		],

		// If tag / keywords / block style tags
		[
			{
				line: '<div>{% if true=false %}<div>True</div>{% else %}<div>False</div>{% endif %}</div>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 4, type: 'delimiter.html' },
					{ startIndex: 5, type: 'delimiter.tag.liquid' },
					{ startIndex: 7, type: '' },
					{ startIndex: 8, type: 'predefined.liquid' },
					{ startIndex: 10, type: '' },
					{ startIndex: 11, type: 'keyword.liquid' },
					{ startIndex: 15, type: '' },
					{ startIndex: 16, type: 'keyword.liquid' },
					{ startIndex: 21, type: '' },
					{ startIndex: 22, type: 'delimiter.tag.liquid' },
					{ startIndex: 24, type: 'delimiter.html' },
					{ startIndex: 25, type: 'tag.html' },
					{ startIndex: 28, type: 'delimiter.html' },
					{ startIndex: 29, type: '' },
					{ startIndex: 33, type: 'delimiter.html' },
					{ startIndex: 35, type: 'tag.html' },
					{ startIndex: 38, type: 'delimiter.html' },
					{ startIndex: 39, type: 'delimiter.tag.liquid' },
					{ startIndex: 41, type: '' },
					{ startIndex: 42, type: 'predefined.liquid' },
					{ startIndex: 46, type: '' },
					{ startIndex: 47, type: 'delimiter.tag.liquid' },
					{ startIndex: 49, type: 'delimiter.html' },
					{ startIndex: 50, type: 'tag.html' },
					{ startIndex: 53, type: 'delimiter.html' },
					{ startIndex: 54, type: '' },
					{ startIndex: 59, type: 'delimiter.html' },
					{ startIndex: 61, type: 'tag.html' },
					{ startIndex: 64, type: 'delimiter.html' },
					{ startIndex: 65, type: 'delimiter.tag.liquid' },
					{ startIndex: 67, type: '' },
					{ startIndex: 68, type: 'predefined.liquid' },
					{ startIndex: 73, type: '' },
					{ startIndex: 74, type: 'delimiter.tag.liquid' },
					{ startIndex: 76, type: 'delimiter.html' },
					{ startIndex: 78, type: 'tag.html' },
					{ startIndex: 81, type: 'delimiter.html' }
				]
			}
		],

		// Comment tag
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
		],

		// Raw tag
		[
			{
				line: '<div>Everything here should be escaped {% raw %} In Handlebars, {{ this }} will be HTML-escaped, but {{{ that }}} will not. {% endraw %}</div>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 4, type: 'delimiter.html' },
					{ startIndex: 5, type: '' },
					{ startIndex: 39, type: 'delimiter.tag.liquid' },
					{ startIndex: 41, type: '' },
					{ startIndex: 42, type: 'delimiter.tag.liquid' },
					{ startIndex: 48, type: '' },
					{ startIndex: 124, type: 'delimiter.tag.liquid' },
					{ startIndex: 126, type: '' },
					{ startIndex: 134, type: 'delimiter.tag.liquid' },
					{ startIndex: 136, type: 'delimiter.html' },
					{ startIndex: 138, type: 'tag.html' },
					{ startIndex: 141, type: 'delimiter.html' }
				]
			}
		]
	]
);
