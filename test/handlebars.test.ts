/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import {testTokenization} from './testRunner';
import {htmlTokenTypes} from '../src/handlebars';

const HTML_DELIM_START = htmlTokenTypes.DELIM_START;
const HTML_DELIM_END = htmlTokenTypes.DELIM_END;
const DELIM_ASSIGN = 'delimiter';
const HTML_ATTRIB_NAME = 'attribute.name';
const HTML_ATTRIB_VALUE = 'attribute.value';
function getTag(name: string) {
	return htmlTokenTypes.getTag(name);
}

const handlebarsTokenTypes = {
	EMBED: 'delimiter.handlebars',
	EMBED_UNESCAPED: 'delimiter.handlebars',
	KEYWORD: 'keyword.helper.handlebars',
	VARIABLE: 'variable.parameter.handlebars',
}

testTokenization(['handlebars', 'css'], [

	// Just HTML
	[{
		line: '<h1>handlebars!</h1>',
		tokens: [
			{ startIndex:0, type: HTML_DELIM_START },
			{ startIndex:1, type: getTag('h1') },
			{ startIndex:3, type: HTML_DELIM_END },
			{ startIndex:4, type: '' },
			{ startIndex:15, type: HTML_DELIM_START },
			{ startIndex:17, type: getTag('h1') },
			{ startIndex:19, type: HTML_DELIM_END }
		]
	}],

	// Expressions
	[{
		line: '<h1>{{ title }}</h1>',
		tokens: [
			{ startIndex:0, type: HTML_DELIM_START },
			{ startIndex:1, type: getTag('h1') },
			{ startIndex:3, type: HTML_DELIM_END },
			{ startIndex:4, type: handlebarsTokenTypes.EMBED },
			{ startIndex:6, type: '' },
			{ startIndex:7, type: handlebarsTokenTypes.VARIABLE },
			{ startIndex:12, type: '' },
			{ startIndex:13, type: handlebarsTokenTypes.EMBED },
			{ startIndex:15, type: HTML_DELIM_START },
			{ startIndex:17, type: getTag('h1') },
			{ startIndex:19, type: HTML_DELIM_END }
		]
	}],

	// Expressions Sans Whitespace
	[{
		line: '<h1>{{title}}</h1>',
		tokens: [
			{ startIndex:0, type: HTML_DELIM_START },
			{ startIndex:1, type: getTag('h1') },
			{ startIndex:3, type: HTML_DELIM_END },
			{ startIndex:4, type: handlebarsTokenTypes.EMBED },
			{ startIndex:6, type: handlebarsTokenTypes.VARIABLE },
			{ startIndex:11, type: handlebarsTokenTypes.EMBED },
			{ startIndex:13, type: HTML_DELIM_START },
			{ startIndex:15, type: getTag('h1') },
			{ startIndex:17, type: HTML_DELIM_END }
		]
	}],

	// Unescaped Expressions
	[{
		line: '<h1>{{{ title }}}</h1>',
		tokens: [
			{ startIndex:0, type: HTML_DELIM_START },
			{ startIndex:1, type: getTag('h1') },
			{ startIndex:3, type: HTML_DELIM_END },
			{ startIndex:4, type: handlebarsTokenTypes.EMBED_UNESCAPED },
			{ startIndex:7, type: '' },
			{ startIndex:8, type: handlebarsTokenTypes.VARIABLE },
			{ startIndex:13, type: '' },
			{ startIndex:14, type: handlebarsTokenTypes.EMBED_UNESCAPED },
			{ startIndex:17, type: HTML_DELIM_START },
			{ startIndex:19, type: getTag('h1') },
			{ startIndex:21, type: HTML_DELIM_END }
		]
	}],

	// Blocks
	[{
		line: '<ul>{{#each items}}<li>{{item}}</li>{{/each}}</ul>',
		tokens: [
			{ startIndex:0, type: HTML_DELIM_START },
			{ startIndex:1, type: getTag('ul') },
			{ startIndex:3, type: HTML_DELIM_END },
			{ startIndex:4, type: handlebarsTokenTypes.EMBED },
			{ startIndex:6, type: handlebarsTokenTypes.KEYWORD },
			{ startIndex:11, type: '' },
			{ startIndex:12, type: handlebarsTokenTypes.VARIABLE },
			{ startIndex:17, type: handlebarsTokenTypes.EMBED },
			{ startIndex:19, type: HTML_DELIM_START },
			{ startIndex:20, type: getTag('li') },
			{ startIndex:22, type: HTML_DELIM_END },
			{ startIndex:23, type: handlebarsTokenTypes.EMBED },
			{ startIndex:25, type: handlebarsTokenTypes.VARIABLE },
			{ startIndex:29, type: handlebarsTokenTypes.EMBED },
			{ startIndex:31, type: HTML_DELIM_START },
			{ startIndex:33, type: getTag('li') },
			{ startIndex:35, type: HTML_DELIM_END },
			{ startIndex:36, type: handlebarsTokenTypes.EMBED },
			{ startIndex:38, type: handlebarsTokenTypes.KEYWORD },
			{ startIndex:43, type: handlebarsTokenTypes.EMBED },
			{ startIndex:45, type: HTML_DELIM_START },
			{ startIndex:47, type: getTag('ul') },
			{ startIndex:49, type: HTML_DELIM_END }
		]
	}],

	// Multiline
	[{
		line: '<div>',
		tokens: [
			{ startIndex:0, type: HTML_DELIM_START },
			{ startIndex:1, type: getTag('div') },
			{ startIndex:4, type: HTML_DELIM_END }
		]
	}, {
		line: '{{#if foo}}',
		tokens: [
			{ startIndex:0, type: handlebarsTokenTypes.EMBED },
			{ startIndex:2, type: handlebarsTokenTypes.KEYWORD },
			{ startIndex:5, type: '' },
			{ startIndex:6, type: handlebarsTokenTypes.VARIABLE },
			{ startIndex:9, type: handlebarsTokenTypes.EMBED }
		]
	}, {
		line: '<span>{{bar}}</span>',
		tokens: [
			{ startIndex:0, type: HTML_DELIM_START },
			{ startIndex:1, type: getTag('span') },
			{ startIndex:5, type: HTML_DELIM_END },
			{ startIndex:6, type: handlebarsTokenTypes.EMBED },
			{ startIndex:8, type: handlebarsTokenTypes.VARIABLE },
			{ startIndex:11, type: handlebarsTokenTypes.EMBED },
			{ startIndex:13, type: HTML_DELIM_START },
			{ startIndex:15, type: getTag('span') },
			{ startIndex:19, type: HTML_DELIM_END }
		]
	}, {
		line: '{{/if}}',
		tokens: [
			{ startIndex:0, type: handlebarsTokenTypes.EMBED },
			{ startIndex:2, type: handlebarsTokenTypes.KEYWORD },
			{ startIndex:5, type: handlebarsTokenTypes.EMBED }
		]
	}],

	// Div end
	[{
		line: '</div>',
		tokens: [
			{ startIndex:0, type: HTML_DELIM_START },
			{ startIndex:2, type: getTag('div') },
			{ startIndex:5, type: HTML_DELIM_END }
		]
	}],

	// HTML Expressions
	[{
		line: '<script type="text/x-handlebars-template"><h1>{{ title }}</h1></script>',
		tokens: [
			{ startIndex:0, type: HTML_DELIM_START },
			{ startIndex:1, type: getTag('script') },
			{ startIndex:7, type: '' },
			{ startIndex:8, type: HTML_ATTRIB_NAME },
			{ startIndex:12, type: DELIM_ASSIGN },
			{ startIndex:13, type: HTML_ATTRIB_VALUE },
			{ startIndex:41, type: HTML_DELIM_END },
			{ startIndex:42, type: HTML_DELIM_START },
			{ startIndex:43, type: getTag('h1') },
			{ startIndex:45, type: HTML_DELIM_END },
			{ startIndex:46, type: handlebarsTokenTypes.EMBED },
			{ startIndex:48, type: '' },
			{ startIndex:49, type: handlebarsTokenTypes.VARIABLE },
			{ startIndex:54, type: '' },
			{ startIndex:55, type: handlebarsTokenTypes.EMBED },
			{ startIndex:57, type: HTML_DELIM_START },
			{ startIndex:59, type: getTag('h1') },
			{ startIndex:61, type: HTML_DELIM_END },
			{ startIndex:62, type: HTML_DELIM_START },
			{ startIndex:64, type: getTag('script') },
			{ startIndex:70, type: HTML_DELIM_END }
		]
	}],

	// Multi-line HTML Expressions
	[{
		line: '<script type="text/x-handlebars-template">',
		tokens: [
			{ startIndex:0, type: HTML_DELIM_START },
			{ startIndex:1, type: getTag('script') },
			{ startIndex:7, type: '' },
			{ startIndex:8, type: HTML_ATTRIB_NAME },
			{ startIndex:12, type: DELIM_ASSIGN },
			{ startIndex:13, type: HTML_ATTRIB_VALUE },
			{ startIndex:41, type: HTML_DELIM_END }
		]
	}, {
		line: '<h1>{{ title }}</h1>',
		tokens: [
			{ startIndex:0, type: HTML_DELIM_START },
			{ startIndex:1, type: getTag('h1') },
			{ startIndex:3, type: HTML_DELIM_END },
			{ startIndex:4, type: handlebarsTokenTypes.EMBED },
			{ startIndex:6, type: '' },
			{ startIndex:7, type: handlebarsTokenTypes.VARIABLE },
			{ startIndex:12, type: '' },
			{ startIndex:13, type: handlebarsTokenTypes.EMBED },
			{ startIndex:15, type: HTML_DELIM_START },
			{ startIndex:17, type: getTag('h1') },
			{ startIndex:19, type: HTML_DELIM_END }
		]
	}, {
		line: '</script>',
		tokens: [
			{ startIndex:0, type: HTML_DELIM_START },
			{ startIndex:2, type: getTag('script') },
			{ startIndex:8, type: HTML_DELIM_END }
		]
	}],

	// HTML Nested Modes
	[{
		line: '{{foo}}<script></script>{{bar}}',
		tokens: [
			{ startIndex:0, type: handlebarsTokenTypes.EMBED },
			{ startIndex:2, type: handlebarsTokenTypes.VARIABLE },
			{ startIndex:5, type: handlebarsTokenTypes.EMBED },
			{ startIndex:7, type: HTML_DELIM_START },
			{ startIndex:8, type: getTag('script') },
			{ startIndex:14, type: HTML_DELIM_END },
			// { startIndex:15, type: HTML_DELIM_START },
			{ startIndex:17, type: getTag('script') },
			{ startIndex:23, type: HTML_DELIM_END },
			{ startIndex:24, type: handlebarsTokenTypes.EMBED },
			{ startIndex:26, type: handlebarsTokenTypes.VARIABLE },
			{ startIndex:29, type: handlebarsTokenTypes.EMBED }
		]
	}],

	// else keyword
	[{
		line: '{{else}}',
		tokens: [
			{ startIndex:0, type: handlebarsTokenTypes.EMBED },
			{ startIndex:2, type: handlebarsTokenTypes.KEYWORD },
			{ startIndex:6, type: handlebarsTokenTypes.EMBED }
		]
	}],

	// else keyword #2
	[{
		line: '{{elseFoo}}',
		tokens: [
			{ startIndex:0, type: handlebarsTokenTypes.EMBED },
			{ startIndex:2, type: handlebarsTokenTypes.VARIABLE },
			{ startIndex:9, type: handlebarsTokenTypes.EMBED }
		]
	}],

	// Token inside attribute
	[{
		line: '<a href="/posts/{{permalink}}">',
		tokens: [
			{ startIndex:0, type: HTML_DELIM_START },
			{ startIndex:1, type: getTag('a') },
			{ startIndex:2, type: '' },
			{ startIndex:3, type: HTML_ATTRIB_NAME },
			{ startIndex:7, type: DELIM_ASSIGN },
			{ startIndex:8, type: HTML_ATTRIB_VALUE },
			{ startIndex:30, type: HTML_DELIM_END }
		]
	}]
]);
