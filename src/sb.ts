/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import IRichLanguageConfiguration = monaco.languages.LanguageConfiguration;
import ILanguage = monaco.languages.IMonarchLanguage;

export const conf: IRichLanguageConfiguration = {
	comments: {
		lineComment: '\'',
	},
	brackets: [
		['(', ')'], ['[', ']'],
		['If', 'EndIf'],
		['While', 'EndWhile'],
		['For', 'EndFor'],
		['Sub', 'EndSub']
	],
	autoClosingPairs: [
		{ open: '"', close: '"', notIn: ['string', 'comment'] },
		{ open: '(', close: ')', notIn: ['string', 'comment'] },
		{ open: '[', close: ']', notIn: ['string', 'comment'] },
	]
};

export const language = <ILanguage>{
	defaultToken: '',
	tokenPostfix: '.sb',
	ignoreCase: true,

	brackets: [
		{ token: 'delimiter.array', open: '[', close: ']' },
		{ token: 'delimiter.parenthesis', open: '(', close: ')' },

		// Special bracket statement pairs
		{ token: 'keyword.tag-if', open: 'If', close: 'EndIf' },
		{ token: 'keyword.tag-while', open: 'While', close: 'EndWhile' },
		{ token: 'keyword.tag-for', open: 'For', close: 'EndFor' },
		{ token: 'keyword.tag-sub', open: 'Sub', close: 'EndSub' },
	],

	keywords: [
		'And', 'Else', 'ElseIf', 'EndFor', 'EndIf', 'EndSub', 'EndWhile',
		'For', 'Goto', 'If', 'Or', 'Step', 'Sub', 'Then', 'To', 'While'
	],

	tagwords: [
		'If', 'Sub', 'While', 'For'
	],

	operators: [
		'>', '<', '<>', '<=', '>=', 'And',
		'Or', '+', '-', '*', '/', '=',
	],

	// we include these common regular expressions
	symbols: /[=><.,:+\-\/]+/,
	escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

	// The main tokenizer for our languages
	tokenizer: {
		root: [

			// whitespace
			{ include: '@whitespace' },

			// usual ending tags
			[/end([a-zA-Z_]\w*)/, { token: 'keyword.tag-$1' }],

			// identifiers, tagwords, and keywords
			[/[a-zA-Z_]\w*/, {
				cases: {
					'@tagwords': { token: 'keyword.tag-$0' },
					'@keywords': { token: 'keyword.$0' },
					'@default': 'identifier'
				}
			}],

			// Preprocessor directive
			[/^\s*#\w+/, 'keyword'],

			// numbers
			[/\d*\.\d+/, 'number.float'],
			[/\d+/, 'number'],

			// delimiters and operators
			[/[()\[\]]/, '@brackets'],
			[/@symbols/, 'delimiter'],

			// strings
			[/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
			[/"/, 'string', '@string'],

		],

		whitespace: [
			[/[ \t\r\n]+/, ''],
			[/(\').*$/, 'comment']
		],

		string: [
			[/[^\\"]+/, 'string'],
			[/@escapes/, 'string.escape'],
			[/\\./, 'string.escape.invalid'],
			[/"C?/, 'string', '@pop']
		],
	},
};
