/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import IRichLanguageConfiguration = monaco.languages.LanguageConfiguration;
import ILanguage = monaco.languages.IMonarchLanguage;

export const conf: IRichLanguageConfiguration = {
	comments: {
		lineComment: '#'
	},
	brackets: [
		['{', '}'],
		['[', ']'],
		['(', ')'],
	],
	autoClosingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"' },
		{ open: '\'', close: '\'' },
	],
	surroundingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"' },
		{ open: '\'', close: '\'' },
	]
};

export const language = <ILanguage>{
	defaultToken: '',
	tokenPostfix: '.ini',

	// we include these common regular expressions
	escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

	// The main tokenizer for our languages
	tokenizer: {
		root: [

			// sections
			[/^\[[^\]]*\]/, 'metatag'],

			// keys
			[/(^\w+)(\s*)(\=)/, ['key', '', 'delimiter']],

			// whitespace
			{ include: '@whitespace' },

			// numbers
			[/\d+/, 'number'],

			// strings: recover on non-terminated strings
			[/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
			[/'([^'\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
			[/"/, 'string', '@string."'],
			[/'/, 'string', '@string.\''],
		],

		whitespace: [
			[/[ \t\r\n]+/, ''],
			[/^\s*[#;].*$/, 'comment'],
		],

		string: [
			[/[^\\"']+/, 'string'],
			[/@escapes/, 'string.escape'],
			[/\\./, 'string.escape.invalid'],
			[/["']/, {
				cases: {
					'$#==$S2': { token: 'string', next: '@pop' },
					'@default': 'string'
				}
			}]
		],
	},
};
