/*---------------------------------------------------------------------------------------------
 *	Copyright (c) Microsoft Corporation. All rights reserved.
 *	Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { languages } from '../../fillers/monaco-editor-core';

export const conf: languages.LanguageConfiguration = {
	comments: {
		blockComment: ['{/*', '*/}']
	}
};

export const language = <languages.IMonarchLanguage>{
	defaultToken: '',
	tokenPostfix: '.mdx',
	escapes: /\\(?:["'\\abfnrtv]|x[\dA-Fa-f]{1,4}|u[\dA-Fa-f]{4}|U[\dA-Fa-f]{8})/,
	bracket_open: ['{'],
	single_quote: ["'"],
	double_quote: ['"'],
	tokenizer: {
		root: [
			[/^\s*import/, { token: 'keyword', next: '@import', nextEmbedded: 'js' }],
			[/<\w+/, { token: 'keyword', next: '@jsx' }],
			[/<\/?\w+>/, { token: 'keyword' }],
			[/\*\*.+\*\*/, 'strong'],
			[/{/, { token: 'delimiter.bracket', nextEmbedded: 'js' }],
			{ include: 'expression' }
		],
		import: [[/'\s*(;|$)/, { token: 'string', next: '@pop', nextEmbedded: '@pop' }]],
		expression: [[/}/, { token: 'delimiter.bracket', nextEmbedded: '@pop' }]],
		jsx: [
			[/\w+=/, { token: 'delimiter.bracket', next: '@jsx_expression' }],
			[/\/?>/, { token: 'keyword', next: '@pop' }]
		],
		jsx_expression: [
			[
				/["'{]/,
				{
					cases: {
						'@bracket_open': {
							token: 'delimiter.bracket',
							next: '@expression',
							nextEmbedded: 'js'
						},
						'@double_quote': { token: 'string', next: '@string_double' },
						'@single_quote': { token: 'string', next: '@string_single' }
					}
				}
			]
		],
		string_double: [
			[/[^"\\]+/, 'string'],
			[/@escapes/, 'string.escape'],
			[/\\./, 'string.escape.invalid'],
			[/"/, 'string', '@pop']
		],
		string_single: [
			[/[^'\\]+/, 'string'],
			[/@escapes/, 'string.escape'],
			[/\\./, 'string.escape.invalid'],
			[/'/, 'string', '@pop']
		]
	}
};
