/*---------------------------------------------------------------------------------------------
 *  JSON with Interpolation - Monarch Tokenizer
 *  Supports ${...} interpolation with embedded JavaScript highlighting
 *--------------------------------------------------------------------------------------------*/

import type * as monaco from 'monaco-editor';

export const conf: monaco.languages.LanguageConfiguration = {
	wordPattern: /(-?\d*\.\d\w*)|([^\[\{\]\}\:\"\,\s]+)/g,

	comments: {
		lineComment: '//',
		blockComment: ['/*', '*/']
	},

	brackets: [
		['{', '}'],
		['[', ']'],
		['${', '}']
	],

	autoClosingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '"', close: '"', notIn: ['string'] },
		{ open: '${', close: '}' }
	],

	surroundingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '"', close: '"' }
	],

	folding: {
		markers: {
			start: /^\s*\/\/\s*#?region\b/,
			end: /^\s*\/\/\s*#?endregion\b/
		}
	}
};

export const language: monaco.languages.IMonarchLanguage = {
	defaultToken: '',
	tokenPostfix: '.json-interpolation',

	escapes: /\\(?:["\\/bfnrt]|u[0-9A-Fa-f]{4})/,

	tokenizer: {
		root: [
			[/\s+/, ''],
			[/\/\/.*$/, 'comment'],
			[/\/\*/, 'comment', '@comment'],
			[/[{]/, 'delimiter.bracket', '@object'],
			[/\[/, 'delimiter.array', '@array']
		],

		object: [
			[/\s+/, ''],
			[/\/\/.*$/, 'comment'],
			[/\/\*/, 'comment', '@comment'],
			[/"/, 'string.key', '@propertyName'],
			[/:/, 'delimiter.colon'],
			[/,/, 'delimiter.comma'],
			{ include: '@value' },
			[/\}/, 'delimiter.bracket', '@pop']
		],

		propertyName: [
			[/[^"\\]+/, 'string.key'],
			[/@escapes/, 'string.escape'],
			[/\\./, 'string.escape.invalid'],
			[/"/, 'string.key', '@pop']
		],

		array: [
			[/\s+/, ''],
			[/\/\/.*$/, 'comment'],
			[/\/\*/, 'comment', '@comment'],
			[/,/, 'delimiter.comma'],
			{ include: '@value' },
			[/\]/, 'delimiter.array', '@pop']
		],

		value: [
			[/"/, 'string.value', '@string'],
			[/-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/, 'number'],
			[/true|false/, 'keyword'],
			[/null/, 'keyword'],
			[/\{/, 'delimiter.bracket', '@object'],
			[/\[/, 'delimiter.array', '@array']
		],

		string: [
			[
				/\$\{/,
				{
					token: 'delimiter.bracket.interpolation',
					next: '@interpolation',
					nextEmbedded: 'javascript'
				}
			],
			[/[^"\\$]+/, 'string.value'],
			[/@escapes/, 'string.escape'],
			[/\\./, 'string.escape.invalid'],
			[/\$(?!\{)/, 'string.value'],
			[/"/, 'string.value', '@pop']
		],

		interpolation: [
			[
				/\}/,
				{
					token: 'delimiter.bracket.interpolation',
					next: '@pop',
					nextEmbedded: '@pop'
				}
			]
		],

		comment: [
			[/[^/*]+/, 'comment'],
			[/\*\//, 'comment', '@pop'],
			[/[/*]/, 'comment']
		]
	}
};
