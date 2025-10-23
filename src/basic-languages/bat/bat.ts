/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { languages } from 'monaco-editor-core';

export const conf: languages.LanguageConfiguration = {
	comments: {
		lineComment: 'REM'
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
		{ open: '"', close: '"' }
	],
	surroundingPairs: [
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"' }
	],
	folding: {
		markers: {
			start: new RegExp('^\\s*(::\\s*|REM\\s+)#region'),
			end: new RegExp('^\\s*(::\\s*|REM\\s+)#endregion')
		}
	}
};

export const language = <languages.IMonarchLanguage>{
	defaultToken: '',
	ignoreCase: true,
	tokenPostfix: '.bat',

	brackets: [
		{ token: 'delimiter.bracket', open: '{', close: '}' },
		{ token: 'delimiter.parenthesis', open: '(', close: ')' },
		{ token: 'delimiter.square', open: '[', close: ']' }
	],

	keywords:
		/call|defined|echo|errorlevel|exist|for|goto|if|pause|set|shift|start|title|not|pushd|popd/,

	// we include these common regular expressions
	symbols: /[=><!~?&|+\-*\/\^;\.,]+/,
	escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

	// The main tokenizer for our languages
	tokenizer: {
		root: [
			[/^(\s*)(rem(?:\s.*|))$/, ['', 'comment']],

			[/(\@?)(@keywords)(?!\w)/, [{ token: 'keyword' }, { token: 'keyword.$2' }]],

			// whitespace
			[/[ \t\r\n]+/, ''],

			// blocks
			[/setlocal(?!\w)/, 'keyword.tag-setlocal'],
			[/endlocal(?!\w)/, 'keyword.tag-setlocal'],

			// words
			[/[a-zA-Z_]\w*/, ''],

			// labels
			[/:\w*/, 'metatag'],

			// variables
			[/%[^%]+%/, 'variable'],
			[/%%[\w]+(?!\w)/, 'variable'],

			// punctuations
			[/[{}()\[\]]/, '@brackets'],
			[/@symbols/, 'delimiter'],

			// numbers
			[/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
			[/0[xX][0-9a-fA-F_]*[0-9a-fA-F]/, 'number.hex'],
			[/\d+/, 'number'],

			// punctuation: after number because of .\d floats
			[/[;,.]/, 'delimiter'],

			// strings:
			[/"/, 'string', '@string."'],
			[/'/, 'string', "@string.'"]
		],

		string: [
			[
				/[^\\"'%]+/,
				{
					cases: {
						'@eos': { token: 'string', next: '@popall' },
						'@default': 'string'
					}
				}
			],
			[/@escapes/, 'string.escape'],
			[/\\./, 'string.escape.invalid'],
			[/%[\w ]+%/, 'variable'],
			[/%%[\w]+(?!\w)/, 'variable'],
			[
				/["']/,
				{
					cases: {
						'$#==$S2': { token: 'string', next: '@pop' },
						'@default': 'string'
					}
				}
			],
			[/$/, 'string', '@popall']
		]
	}
};
