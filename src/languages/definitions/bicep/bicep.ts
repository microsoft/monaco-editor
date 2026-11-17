// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { languages } from '../../../editor';

const bounded = (text: string) => `\\b${text}\\b`;
const notBefore = (regex: string) => `(?!${regex})`;

const identifierStart = '[_a-zA-Z]';
const identifierContinue = '[_a-zA-Z0-9]';
const identifier = bounded(`${identifierStart}${identifierContinue}*`);
const directive = bounded(`[_a-zA-Z-0-9]+`);

const keywords = [
	'metadata',
	'targetScope',
	'resource',
	'module',
	'param',
	'var',
	'output',
	'for',
	'in',
	'if',
	'existing',
	'import',
	'as',
	'type',
	'with',
	'using',
	'extends',
	'func',
	'assert',
	'extension'
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

		multilineString: [
			{ regex: `(|'|'')[^']`, action: { token: 'string' } },
			{ regex: `'''${notBefore(`'`)}`, action: { token: 'string.quote', next: '@pop' } }
		],

		multilineString1Interpolation: [
			{ regex: `\\\${`, action: { token: 'delimiter.bracket', next: '@bracketCounting' } },
			{ regex: `(|'|'')[^']`, action: { token: 'string' } },
			{ regex: `'''${notBefore(`'`)}`, action: { token: 'string.quote', next: '@pop' } }
		],

		multilineString2Interpolation: [
			{ regex: `\\$\\\${`, action: { token: 'delimiter.bracket', next: '@bracketCounting' } },
			{ regex: `(|'|'')[^']`, action: { token: 'string' } },
			{ regex: `'''${notBefore(`'`)}`, action: { token: 'string.quote', next: '@pop' } }
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
			{ include: '@expression' }
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
			{
				regex: `\\$\\$'''`,
				action: { token: 'string.quote', next: '@multilineString2Interpolation' }
			},
			{
				regex: `\\$'''`,
				action: { token: 'string.quote', next: '@multilineString1Interpolation' }
			},
			{ regex: `'''`, action: { token: 'string.quote', next: '@multilineString' } },
			{ regex: `'${notBefore(`''`)}`, action: { token: 'string.quote', next: '@stringLiteral' } },
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
			},
			{ regex: `#${directive}`, action: { token: 'directive' } }
		]
	}
};
