/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { languages } from '../fillers/monaco-editor-core';

const EMPTY_ELEMENTS: string[] = [
	'area',
	'base',
	'br',
	'col',
	'embed',
	'hr',
	'img',
	'input',
	'keygen',
	'link',
	'menuitem',
	'meta',
	'param',
	'source',
	'track',
	'wbr'
];

export const conf: languages.LanguageConfiguration = {
	wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\$\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\s]+)/g,

	// comments: {
	// 	blockComment: ['{{!--', '--}}']
	// },

	brackets: [
		['<!--', '-->'],
		['<', '>'],
		['{{', '}}'],
		['{%', '%}'],
		['{', '}'],
		['(', ')']
	],

	autoClosingPairs: [
		{ open: '{', close: '}' },
		{ open: '%', close: '%' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"' },
		{ open: "'", close: "'" }
	],

	surroundingPairs: [
		{ open: '<', close: '>' },
		{ open: '"', close: '"' },
		{ open: "'", close: "'" }
	],

	onEnterRules: [
		{
			beforeText: new RegExp(
				`<(?!(?:${EMPTY_ELEMENTS.join('|')}))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$`,
				'i'
			),
			afterText: /^<\/(\w[\w\d]*)\s*>$/i,
			action: {
				indentAction: languages.IndentAction.IndentOutdent
			}
		},
		{
			beforeText: new RegExp(
				`<(?!(?:${EMPTY_ELEMENTS.join('|')}))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$`,
				'i'
			),
			action: { indentAction: languages.IndentAction.Indent }
		}
	]
};

export const language = <languages.IMonarchLanguage>{
	defaultToken: '',
	tokenPostfix: '',
	// ignoreCase: true,

	// The main tokenizer for our languages
	tokenizer: {
		root: [
			[/\{\%\s*comment\s*\%\}/, 'comment.start.liquid', '@comment'],
			[/\{\{/, { token: '@rematch', switchTo: '@liquidInSimpleState.root' }],
			[/\{\%/, { token: '@rematch', switchTo: '@liquidInSimpleState.root' }],
			[/(<)(\w+)(\/>)/, ['delimiter.html', 'tag.html', 'delimiter.html']],
			[/(<)([:\w]+)/, ['delimiter.html', { token: 'tag.html', next: '@otherTag' }]],
			[/(<\/)(\w+)/, ['delimiter.html', { token: 'tag.html', next: '@otherTag' }]],
			[/</, 'delimiter.html'],
			[/\{/, 'delimiter.html'],
			[/[^<{]+/] // text
		],

		comment: [
			[/\{\%\s*endcomment\s*\%\}/, 'comment.end.liquid', '@pop'],
			[/./, 'comment.content.liquid']
		],

		otherTag: [
			[
				/\{\{/,
				{
					token: '@rematch',
					switchTo: '@liquidInSimpleState.otherTag'
				}
			],
			[
				/\{%/,
				{
					token: '@rematch',
					switchTo: '@liquidInSimpleState.otherTag'
				}
			],
			[/\/?>/, 'delimiter.html', '@pop'],
			[/"([^"]*)"/, 'attribute.value'],
			[/'([^']*)'/, 'attribute.value'],
			[/[\w\-]+/, 'attribute.name'],
			[/=/, 'delimiter'],
			[/[ \t\r\n]+/] // whitespace
		],

		liquidInSimpleState: [
			[/\{\{/, 'delimiter.liquid'],
			[/\}\}/, { token: 'delimiter.liquid', switchTo: '@$S2.$S3' }],
			[/\{\%/, 'delimiter.output.liquid'],
			[/\%\}/, { token: 'delimiter.liquid', switchTo: '@$S2.$S3' }],
			{ include: 'liquidRoot' }
		],

		liquidInTagState: [
			[/%\}/, { token: 'delimiter.output.liquid', switchTo: '@$S2.$S3' }],
			// { include: 'liquidRoot' },
			[/[^%]/, 'wut']
		],

		liquidRoot: [
			[/\d+(\.\d+)?/, 'number.liquid'],
			[/"[^"]*"/, 'string.liquid'],
			[/'[^']*'/, 'string.liquid'],
			[/[\s]+/],
			[/[^}|%]/, 'variable.liquid']
		]
	}
};
