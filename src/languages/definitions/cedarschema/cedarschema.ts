/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { languages } from '../../../editor';

export const conf: languages.LanguageConfiguration = {
	comments: {
		lineComment: '//'
	},
	brackets: [
		['{', '}'],
		['[', ']'],
		['(', ')']
	],
	autoClosingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"', notIn: ['string'] }
	],
	surroundingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"' }
	]
};

export const language = <languages.IMonarchLanguage>{
	defaultToken: '',
	tokenPostfix: '.cedarschema',

	keywords: ['namespace', 'type', 'entity', 'action', 'appliesTo', 'in', 'enum', 'tags'],

	typeKeywords: ['Long', 'String', 'Bool', 'Set', 'Record', 'Entity', 'Extension'],

	symbols: /[=:?<>]+/,

	tokenizer: {
		root: [
			// comments
			[/\/\/.*$/, 'comment'],

			// namespace path (e.g. My::Namespace::Path)
			[
				/[A-Z_a-z][A-Za-z0-9_]*(?:::[A-Z_a-z][A-Za-z0-9_]*)+/,
				'entity.name.namespace'
			],

			// properties (identifier followed by optional ? then : but not ::)
			[/[_a-zA-Z][_a-zA-Z0-9]*(?=\??\s*:(?!:))/, 'variable.property'],

			// identifiers and keywords
			[
				/[a-z_][A-Za-z0-9_]*/,
				{
					cases: {
						'@keywords': 'keyword',
						'@default': 'identifier'
					}
				}
			],

			// type identifiers (capitalized)
			[
				/[A-Z][A-Za-z0-9_]*/,
				{
					cases: {
						'@typeKeywords': 'type.identifier',
						'@default': 'type.identifier'
					}
				}
			],

			// whitespace
			[/[ \t\r\n]+/, ''],

			// brackets
			[/[{}()\[\]]/, '@brackets'],

			// operators / symbols
			[/@symbols/, 'operator'],

			// optional marker
			[/\?/, 'operator'],

			// strings
			[/"([^"\\]|\\.)*$/, 'string.invalid'],
			[/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],

			// delimiter
			[/[;,.]/, 'delimiter']
		],

		string: [
			[/[^\\"]+/, 'string'],
			[/\\./, 'string.escape'],
			[/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
		]
	}
};
