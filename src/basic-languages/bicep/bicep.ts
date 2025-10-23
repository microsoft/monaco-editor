// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { languages } from 'monaco-editor-core';

const bounded = (text: string) => `\\b${text}\\b`;

const identifierStart = '[_a-zA-Z]';
const identifierContinue = '[_a-zA-Z0-9]';
const identifier = bounded(`${identifierStart}${identifierContinue}*`);

const keywords = [
	'targetScope',
	'resource',
	'module',
	'param',
	'var',
	'output',
	'for',
	'in',
	'if',
	'existing'
];

const namedLiterals = ['true', 'false', 'null'];

const nonCommentWs = `[ \\t\\r\\n]`;

const numericLiteral = `[0-9]+`;

export const conf: languages.LanguageConfiguration = {
	comments: {
		lineComment: '//',
		blockComment: ['/*', '*/']
	},
	brackets: [
		['{', '}'],
		['[', ']'],
		['(', ')']
	],
	surroundingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: "'", close: "'" },
		{ open: "'''", close: "'''" }
	],
	autoClosingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: "'", close: "'", notIn: ['string', 'comment'] },
		{ open: "'''", close: "'''", notIn: ['string', 'comment'] }
	],
	autoCloseBefore: ":.,=}])' \n\t",
	indentationRules: {
		increaseIndentPattern: new RegExp('^((?!\\/\\/).)*(\\{[^}"\'`]*|\\([^)"\'`]*|\\[[^\\]"\'`]*)$'),
		decreaseIndentPattern: new RegExp('^((?!.*?\\/\\*).*\\*/)?\\s*[\\}\\]].*$')
	}
};

export const language = <languages.IMonarchLanguage>{
	defaultToken: '',
	tokenPostfix: '.bicep',

	brackets: [
		{ open: '{', close: '}', token: 'delimiter.curly' },
		{ open: '[', close: ']', token: 'delimiter.square' },
		{ open: '(', close: ')', token: 'delimiter.parenthesis' }
	],

	symbols: /[=><!~?:&|+\-*/^%]+/,

	keywords,
	namedLiterals,

	escapes: `\\\\(u{[0-9A-Fa-f]+}|n|r|t|\\\\|'|\\\${)`,

	tokenizer: {
		root: [{ include: '@expression' }, { include: '@whitespace' }],

		stringVerbatim: [
			{ regex: `(|'|'')[^']`, action: { token: 'string' } },
			{ regex: `'''`, action: { token: 'string.quote', next: '@pop' } }
		],

		stringLiteral: [
			{ regex: `\\\${`, action: { token: 'delimiter.bracket', next: '@bracketCounting' } },
			{ regex: `[^\\\\'$]+`, action: { token: 'string' } },
			{ regex: '@escapes', action: { token: 'string.escape' } },
			{ regex: `\\\\.`, action: { token: 'string.escape.invalid' } },
			{ regex: `'`, action: { token: 'string', next: '@pop' } }
		],

		bracketCounting: [
			{ regex: `{`, action: { token: 'delimiter.bracket', next: '@bracketCounting' } },
			{ regex: `}`, action: { token: 'delimiter.bracket', next: '@pop' } },
			{ include: 'expression' }
		],

		comment: [
			{ regex: `[^\\*]+`, action: { token: 'comment' } },
			{ regex: `\\*\\/`, action: { token: 'comment', next: '@pop' } },
			{ regex: `[\\/*]`, action: { token: 'comment' } }
		],

		whitespace: [
			{ regex: nonCommentWs },
			{ regex: `\\/\\*`, action: { token: 'comment', next: '@comment' } },
			{ regex: `\\/\\/.*$`, action: { token: 'comment' } }
		],

		expression: [
			{ regex: `'''`, action: { token: 'string.quote', next: '@stringVerbatim' } },
			{ regex: `'`, action: { token: 'string.quote', next: '@stringLiteral' } },
			{ regex: numericLiteral, action: { token: 'number' } },
			{
				regex: identifier,
				action: {
					cases: {
						'@keywords': { token: 'keyword' },
						'@namedLiterals': { token: 'keyword' },
						'@default': { token: 'identifier' }
					}
				}
			}
		]
	}
};
