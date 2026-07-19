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
	]
]);
