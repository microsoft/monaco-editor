/*---------------------------------------------------------------------------------------------
 *  JSON with Interpolation - Monarch Language Definition
 *  Supports ${...} interpolation with embedded JavaScript
 *--------------------------------------------------------------------------------------------*/

import { languages } from 'monaco-editor-core';

export const conf: languages.LanguageConfiguration = {
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

export const language = <languages.IMonarchLanguage>{
	defaultToken: '',
	tokenPostfix: '.json-interpolation',

	// Escape sequences
	escapes: /\\(?:["\\/bfnrt]|u[0-9A-Fa-f]{4})/,

	// The main tokenizer
	tokenizer: {
		root: [
			// Whitespace
			[/\s+/, ''],

			// Comments (JSONC style)
			[/\/\/.*$/, 'comment'],
			[/\/\*/, 'comment', '@comment'],

			// Start of object or array
			[/[{]/, 'delimiter.bracket', '@object'],
			[/\[/, 'delimiter.array', '@array']
		],

		// Inside an object
		object: [
			// Whitespace
			[/\s+/, ''],

			// Comments
			[/\/\/.*$/, 'comment'],
			[/\/\*/, 'comment', '@comment'],

			// Property name (key)
			[/"/, 'string.key', '@propertyName'],

			// Colon
			[/:/, 'delimiter.colon'],

			// Comma
			[/,/, 'delimiter.comma'],

			// Values
			{ include: '@value' },

			// End of object
			[/\}/, 'delimiter.bracket', '@pop']
		],

		// Property name inside double quotes
		propertyName: [
			[/[^"\\]+/, 'string.key'],
			[/@escapes/, 'string.escape'],
			[/\\./, 'string.escape.invalid'],
			[/"/, 'string.key', '@pop']
		],

		// Inside an array
		array: [
			// Whitespace
			[/\s+/, ''],

			// Comments
			[/\/\/.*$/, 'comment'],
			[/\/\*/, 'comment', '@comment'],

			// Comma
			[/,/, 'delimiter.comma'],

			// Values
			{ include: '@value' },

			// End of array
			[/\]/, 'delimiter.array', '@pop']
		],

		// JSON values
		value: [
			// String with interpolation support
			[/"/, 'string.value', '@string'],

			// Numbers
			[/-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/, 'number'],

			// Keywords
			[/true|false/, 'keyword'],
			[/null/, 'keyword'],

			// Nested object
			[/\{/, 'delimiter.bracket', '@object'],

			// Nested array
			[/\[/, 'delimiter.array', '@array']
		],

		// String value with interpolation
		string: [
			// Interpolation start - switch to JavaScript
			[
				/\$\{/,
				{
					token: 'delimiter.bracket.interpolation',
					next: '@interpolation',
					nextEmbedded: 'javascript'
				}
			],

			// Regular string content
			[/[^"\\$]+/, 'string.value'],

			// Escape sequences
			[/@escapes/, 'string.escape'],

			// Invalid escape
			[/\\./, 'string.escape.invalid'],

			// Dollar sign not followed by brace
			[/\$(?!\{)/, 'string.value'],

			// End of string
			[/"/, 'string.value', '@pop']
		],

		// Inside ${...} interpolation - JavaScript is embedded here
		interpolation: [
			// End of interpolation - return to string
			[
				/\}/,
				{
					token: 'delimiter.bracket.interpolation',
					next: '@pop',
					nextEmbedded: '@pop'
				}
			]
		],

		// Block comment
		comment: [
			[/[^/*]+/, 'comment'],
			[/\*\//, 'comment', '@pop'],
			[/[/*]/, 'comment']
		]
	}
};
