/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization(
	['mdx', 'yaml'],
	[
		// headers
		[
			{
				line: '# header 1',
				tokens: [{ startIndex: 0, type: 'keyword.mdx' }]
			},
			{
				line: '## header 2',
				tokens: [{ startIndex: 0, type: 'keyword.mdx' }]
			},
			{
				line: '### header 3',
				tokens: [{ startIndex: 0, type: 'keyword.mdx' }]
			},
			{
				line: '#### header 4',
				tokens: [{ startIndex: 0, type: 'keyword.mdx' }]
			},
			{
				line: '##### header 5',
				tokens: [{ startIndex: 0, type: 'keyword.mdx' }]
			},
			{
				line: '###### header 6',
				tokens: [{ startIndex: 0, type: 'keyword.mdx' }]
			}
		],

		// Lists
		[
			{
				line: '- apple',
				tokens: [
					{ startIndex: 0, type: 'keyword.mdx' },
					{ startIndex: 1, type: 'white.mdx' },
					{ startIndex: 2, type: '' }
				]
			},
			{
				line: '* pear',
				tokens: [
					{ startIndex: 0, type: 'keyword.mdx' },
					{ startIndex: 1, type: 'white.mdx' },
					{ startIndex: 2, type: '' }
				]
			},
			{
				line: '+ pineapple',
				tokens: [
					{ startIndex: 0, type: 'keyword.mdx' },
					{ startIndex: 1, type: 'white.mdx' },
					{ startIndex: 2, type: '' }
				]
			},
			{
				line: '1. orange',
				tokens: [
					{ startIndex: 0, type: 'number.mdx' },
					{ startIndex: 2, type: 'white.mdx' },
					{ startIndex: 3, type: '' }
				]
			}
		],

		// Frontmatter
		[
			{
				line: '---',
				tokens: [{ startIndex: 0, type: 'meta.content.mdx' }]
			},
			{
				line: 'frontmatter: yaml',
				tokens: [
					{ startIndex: 0, type: 'type.yaml' },
					{ startIndex: 11, type: 'operators.yaml' },
					{ startIndex: 12, type: 'white.yaml' },
					{ startIndex: 13, type: 'string.yaml' }
				]
			},
			{
				line: '---',
				tokens: [{ startIndex: 0, type: 'meta.content.mdx' }]
			}
		],

		// links
		[
			{
				line: '[MDX](https://mdxjs.com)',
				tokens: [
					{ startIndex: 0, type: '' },
					{ startIndex: 1, type: 'type.identifier.mdx' },
					{ startIndex: 4, type: '' },
					{ startIndex: 6, type: 'string.link.mdx' },
					{ startIndex: 23, type: '' }
				]
			},
			{
				line: '[monaco][monaco]',
				tokens: [
					{ startIndex: 0, type: '' },
					{ startIndex: 1, type: 'type.identifier.mdx' },
					{ startIndex: 7, type: '' },
					{ startIndex: 9, type: 'type.identifier.mdx' },
					{ startIndex: 15, type: '' }
				]
			},
			{
				line: '[monaco][]',
				tokens: [
					{ startIndex: 0, type: '' },
					{ startIndex: 1, type: 'type.identifier.mdx' },
					{ startIndex: 9, type: '' }
				]
			},
			{
				line: '[monaco]',
				tokens: [
					{ startIndex: 0, type: '' },
					{ startIndex: 1, type: 'type.identifier.mdx' },
					{ startIndex: 7, type: '' }
				]
			},
			{
				line: '[monaco]: https://github.com/microsoft/monaco-editor',
				tokens: [
					{ startIndex: 0, type: '' },
					{ startIndex: 1, type: 'type.identifier.mdx' },
					{ startIndex: 7, type: '' },
					{ startIndex: 10, type: 'string.link.mdx' }
				]
			}
		],

		// JSX
		[
			{
				line: '<div>**child**</div>',
				tokens: [
					{ startIndex: 0, type: 'type.identifier.mdx' },
					// This is incorrect. MDX children that start on the same line are JSX, not markdown
					{ startIndex: 5, type: 'strong.mdx' },
					{ startIndex: 14, type: 'type.identifier.mdx' }
				]
			},
			{
				line: '{console.log("This is JavaScript")}',
				tokens: [
					{ startIndex: 0, type: 'delimiter.bracket.mdx' },
					{ startIndex: 1, type: 'identifier.js' },
					{ startIndex: 8, type: 'delimiter.js' },
					{ startIndex: 9, type: 'identifier.js' },
					{ startIndex: 12, type: 'delimiter.parenthesis.js' },
					{ startIndex: 13, type: 'string.js' },
					{ startIndex: 33, type: 'delimiter.parenthesis.js' },
					{ startIndex: 34, type: 'delimiter.bracket.mdx' }
				]
			}
		]
	]
);
