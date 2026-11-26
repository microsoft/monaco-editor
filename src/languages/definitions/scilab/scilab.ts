/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { languages } from '../../../editor';

export const conf: languages.LanguageConfiguration = {
	comments: {
		lineComment: '//',
		blockComment: ['/*', '*/']
	},
	brackets: [
		['{', '}'],
		['[', ']'],
		['(', ')'],
		['function', 'endfunction'],
		['if', 'end'],
		['for', 'end'],
		['while', 'end'],
		['select', 'end'],
		['try', 'end']
	],
	autoClosingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"', notIn: ['string', 'comment'] }
	],
	surroundingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"' },
		{ open: "'", close: "'" }
	]
};

// The keyword, constant and function lists are short, hand-written selections
// based on the Scilab documentation; the reference lexers (Pygments ScilabLexer,
// Chroma scilab.xml, highlight.js scilab.js) were used only to compare coverage.
export const language = <languages.IMonarchLanguage>{
	defaultToken: '',
	tokenPostfix: '.scilab',

	keywords: [
		'abort',
		'break',
		'case',
		'catch',
		'continue',
		'do',
		'else',
		'elseif',
		'end',
		'endfunction',
		'for',
		'function',
		'global',
		'if',
		'pause',
		'quit',
		'resume',
		'return',
		'select',
		'then',
		'try',
		'while'
	],

	// Predefined %-constants: %t %f %T %F %pi %e %i %eps %inf %nan %s %z %io ...
	constants: ['%t', '%f', '%T', '%F', '%pi', '%e', '%i', '%eps', '%inf', '%nan', '%s', '%z', '%io'],

	// Scilab has thousands of functions; only the most common ones are listed.
	builtins: [
		'abs',
		'acos',
		'and',
		'asin',
		'atan',
		'ceil',
		'cd',
		'chdir',
		'clear',
		'clearglobal',
		'cos',
		'cosh',
		'cumprod',
		'cumsum',
		'deff',
		'disp',
		'error',
		'exec',
		'execstr',
		'exists',
		'exp',
		'eye',
		'fclose',
		'floor',
		'fopen',
		'fprintf',
		'fscanf',
		'getenv',
		'gettext',
		'gsort',
		'imag',
		'input',
		'isdef',
		'isempty',
		'isinf',
		'isnan',
		'isvector',
		'lasterror',
		'length',
		'linspace',
		'list',
		'load',
		'log',
		'log10',
		'log2',
		'matrix',
		'max',
		'mclose',
		'min',
		'mopen',
		'msprintf',
		'ones',
		'or',
		'pathconvert',
		'plot',
		'poly',
		'printf',
		'prod',
		'pwd',
		'rand',
		'real',
		'round',
		'save',
		'sin',
		'sinh',
		'size',
		'sprintf',
		'sqrt',
		'strcat',
		'strcmp',
		'string',
		'sum',
		'system',
		'tan',
		'tanh',
		'type',
		'typeof',
		'warning',
		'zeros'
	],

	brackets: [
		{ open: '(', close: ')', token: 'delimiter.parenthesis' },
		{ open: '[', close: ']', token: 'delimiter.square' },
		{ open: '{', close: '}', token: 'delimiter.curly' }
	],

	operators: [
		'+',
		'-',
		'*',
		'/',
		'\\',
		'^',
		'**',
		'.*',
		'./',
		'.\\',
		'.^',
		'==',
		'~=',
		'<>',
		'<',
		'>',
		'<=',
		'>=',
		'=',
		'&',
		'|',
		'~',
		'@',
		':'
	],

	symbols: /[=><~&|+\-*\/\\^@:.]+/,

	tokenizer: {
		root: [
			// line continuation: everything after '...' is ignored
			[/\.\.\..*$/, 'comment'],

			// %-constants and other %-names
			[
				/%[a-zA-Z_]\w*/,
				{
					cases: {
						'@constants': { token: 'constant', next: '@afterValue' },
						'@default': { token: 'identifier', next: '@afterValue' }
					}
				}
			],

			// identifiers, keywords and common functions
			[
				/[a-zA-Z_]\w*/,
				{
					cases: {
						'@keywords': 'keyword',
						'@builtins': { token: 'predefined', next: '@afterValue' },
						'@default': { token: 'identifier', next: '@afterValue' }
					}
				}
			],

			{ include: '@whitespace' },

			// numbers
			[/0[xX][0-9a-fA-F]+/, { token: 'number.hex', next: '@afterValue' }],
			[/(\d+\.?\d*|\.\d+)([eEdD][\-+]?\d+)?/, { token: 'number', next: '@afterValue' }],

			// brackets; a quote directly after a closing bracket is a transpose
			[/[(\[{]/, '@brackets'],
			[/[)\]}]/, { token: '@brackets', next: '@afterValue' }],

			// operators, including the element-wise and transpose forms
			[/\.'/, 'operator'],
			[
				/@symbols/,
				{
					cases: {
						'@operators': 'operator',
						'@default': 'delimiter'
					}
				}
			],
			[/[;,.]/, 'delimiter'],

			// strings: both quote characters start a string here, a doubled quote is an escaped quote
			[/"/, 'string', '@dqstring'],
			[/'/, 'string', '@sqstring']
		],

		// a quote right after a value is the transpose operator, not a string
		afterValue: [
			[/'+/, { token: 'operator', next: '@pop' }],
			[/$/, { token: '', next: '@pop' }],
			[/./, { token: '@rematch', next: '@pop' }]
		],

		whitespace: [
			[/[ \t\r\n]+/, ''],
			[/\/\*/, 'comment', '@comment'],
			[/\/\/.*$/, 'comment']
		],

		comment: [
			[/[^\/*]+/, 'comment'],
			[/\*\//, 'comment', '@pop'],
			[/[\/*]/, 'comment']
		],

		dqstring: [
			[/[^"]+/, 'string'],
			[/""/, 'string.escape'],
			[/"/, 'string', '@pop']
		],

		sqstring: [
			[/[^']+/, 'string'],
			[/''/, 'string.escape'],
			[/'/, 'string', '@pop']
		]
	}
};
