/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('markdown', [
	[
		{
			line: '# Some header',
			tokens: [{ startIndex: 0, type: 'keyword.md' }]
		}
	],

	[
		{
			line: '* Some list item',
			tokens: [
				{ startIndex: 0, type: 'keyword.md' },
				{ startIndex: 2, type: '' }
			]
		}
	],

	[
		{
			line: 'some `code`',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 5, type: 'variable.md' }
			]
		}
	],

	[
		{
			line: 'some ![link](http://link.com)',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 5, type: 'string.link.md' },
				{ startIndex: 7, type: '' },
				{ startIndex: 11, type: 'string.link.md' }
			]
		}
	],

	// simple HTML content
	[
		{
			line: '<div>content</div>',
			tokens: [
				{ startIndex: 0, type: 'tag.md' },
				{ startIndex: 5, type: '' },
				{ startIndex: 12, type: 'tag.md' }
			]
		}
	],

	// hyphenated HTML tag
	[
		{
			line: '<custom-component>content</custom-component>',
			tokens: [
				{ startIndex: 0, type: 'tag.md' },
				{ startIndex: 18, type: '' },
				{ startIndex: 25, type: 'tag.md' }
			]
		}
	],

	// unclosed HTML tag without hyphens and a trailing character
	[
		{
			line: '<div',
			tokens: [{ startIndex: 0, type: 'tag.md' }]
		}
	],

	// unclosed HTML tag with trailing hyphen
	[
		{
			line: '<custom-',
			tokens: [{ startIndex: 0, type: 'tag.md' }]
		}
	],

	// unclosed HTML tag with hyphen and a trailing characer
	[
		{
			line: '<custom-component',
			tokens: [{ startIndex: 0, type: 'tag.md' }]
		}
	],

	// indented HTML tag spanning multiple lines inside an HTML block
	[
		{
			line: '<div>',
			tokens: [{ startIndex: 0, type: 'tag.md' }]
		},
		{
			line: '    <img src="a"',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'tag.md' },
				{ startIndex: 8, type: 'white.md' },
				{ startIndex: 9, type: 'attribute.name.html.md' },
				{ startIndex: 12, type: 'delimiter.html.md' },
				{ startIndex: 13, type: 'string.html.md' }
			]
		},
		{
			line: '         class="b" />',
			tokens: [
				{ startIndex: 0, type: 'white.md' },
				{ startIndex: 9, type: 'attribute.name.html.md' },
				{ startIndex: 14, type: 'delimiter.html.md' },
				{ startIndex: 15, type: 'string.html.md' },
				{ startIndex: 18, type: 'white.md' },
				{ startIndex: 19, type: 'tag.md' }
			]
		},
		// a blank line ends the HTML block, so block constructs apply again
		{
			line: '',
			tokens: []
		},
		{
			line: '# header',
			tokens: [{ startIndex: 0, type: 'keyword.md' }]
		},
		{
			line: '',
			tokens: []
		},
		// an indented code block outside of an HTML block is still a code block
		{
			line: '    <div>code</div>',
			tokens: [{ startIndex: 0, type: 'string.md' }]
		}
	]
]);
