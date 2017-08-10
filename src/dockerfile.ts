/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import IRichLanguageConfiguration = monaco.languages.LanguageConfiguration;
import ILanguage = monaco.languages.IMonarchLanguage;

export const conf: IRichLanguageConfiguration = {
	brackets: [
		['{', '}'],
		['[', ']'],
		['(', ')']
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
	tokenPostfix: '.dockerfile',

	instructions: /FROM|MAINTAINER|RUN|EXPOSE|ENV|ADD|VOLUME|LABEL|USER|WORKDIR|COPY|CMD|STOPSIGNAL|SHELL|ENTRYPOINT/,

	instructionAfter: /ONBUILD/,

	variableAfter: /ENV/,

	variable: /\${?[\w]+}?/,

	tokenizer: {
		root: [
			{ include: '@whitespace' },
			{ include: '@comment' },

			[/(@instructionAfter)(\s+)/, ['keyword', { token: '', next: '@instructions' }]],
			['', 'keyword', '@instructions']
		],

		instructions: [
			[/(@variableAfter)(\s+)([\w]+)/, ['keyword', '', { token: 'variable', next: '@arguments' }]],
			[/(@instructions)/, 'keyword', '@arguments']
		],

		arguments: [
			{ include: '@whitespace' },
			{ include: '@strings' },

			[/(@variable)/, {
				cases: {
					'@eos': { token: 'variable', next: '@popall' },
					'@default': 'variable'
				}
			}],
			[/\\/, {
				cases: {
					'@eos': '',
					'@default': ''
				}
			}],
			[/./, {
				cases: {
					'@eos': { token: '', next: '@popall' },
					'@default': ''
				}
			}],
		],

		// Deal with white space, including comments
		whitespace: [
			[/\s+/, {
				cases: {
					'@eos': { token: '', next: '@popall' },
					'@default': ''
				}
			}],
		],

		comment: [
			[/(^#.*$)/, 'comment', '@popall']
		],

		// Recognize strings, including those broken across lines with \ (but not without)
		strings: [
			[/'$/, 'string', '@popall'],
			[/'/, 'string', '@stringBody'],
			[/"$/, 'string', '@popall'],
			[/"/, 'string', '@dblStringBody']
		],
		stringBody: [
			[/[^\\\$']/, {
				cases: {
					'@eos': { token: 'string', next: '@popall' },
					'@default': 'string'
				}
			}],

			[/\\./, 'string.escape'],
			[/'$/, 'string', '@popall'],
			[/'/, 'string', '@pop'],
			[/(@variable)/, 'variable'],

			[/\\$/, 'string'],
			[/$/, 'string', '@popall']
		],
		dblStringBody: [
			[/[^\\\$"]/, {
				cases: {
					'@eos': { token: 'string', next: '@popall' },
					'@default': 'string'
				}
			}],

			[/\\./, 'string.escape'],
			[/"$/, 'string', '@popall'],
			[/"/, 'string', '@pop'],
			[/(@variable)/, 'variable'],

			[/\\$/, 'string'],
			[/$/, 'string', '@popall']
		]
	}
};
