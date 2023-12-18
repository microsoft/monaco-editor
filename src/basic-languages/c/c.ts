/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { languages } from '../../fillers/monaco-editor-core';

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
	autoClosingPairs: [
		{ open: '[', close: ']' },
		{ open: '{', close: '}' },
		{ open: '(', close: ')' },
		{ open: "'", close: "'", notIn: ['string', 'comment'] },
		{ open: '"', close: '"', notIn: ['string'] }
	],
	surroundingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"' },
		{ open: "'", close: "'" }
	]
};

export const language = <languages.IMonarchLanguage>{
	defaultToken: '',
	tokenPostfix: '.c',

	brackets: [
		{ token: 'delimiter.curly', open: '{', close: '}' },
		{ token: 'delimiter.parenthesis', open: '(', close: ')' },
		{ token: 'delimiter.square', open: '[', close: ']' },
		{ token: 'delimiter.angle', open: '<', close: '>' }
	],

	keywords: [
		'auto',
		'bool',
		'break',
		'case',
		'char',
		'const',
		'constexpr',
		'continue',
		'cpu',
		'default',
		'do',
		'double',
		'else',
		'enum',
		'extern',
		'false',
		'float',
		'for',
		'goto',
		'if',
		'int',
		'long',
		'nullptr',
		'override',
		'register',
		'restrict',
		'return',
		'short',
		'signed',
		'sizeof',
		'static',
		'static_assert',
		'struct',
		'switch',
		'thread_local',
		'true',
		'typedef',
		'unsigned',
		'void',
		'volatile',
		'while',
		'inline',
		'alignof',
		'asm',
		'fortran',
		'pragma',
		'typeof',
		'typeof__unequal',

		'_asm', // reserved word with one underscores
		'_Alignof',
		'_Pragma',

		'__abstract' // reserved word with two underscores
	],

	operators: [
		'=',
		'>',
		'<',
		'!',
		'~',
		'?',
		':',
		'==',
		'<=',
		'>=',
		'!=',
		'&&',
		'||',
		'++',
		'--',
		'+',
		'-',
		'*',
		'/',
		'&',
		'|',
		'^',
		'%',
		'<<',
		'>>',
		'+=',
		'-=',
		'*=',
		'/=',
		'&=',
		'|=',
		'^=',
		'%=',
		'<<=',
		'>>='
	],

	// we include these common regular expressions
	symbols: /[=><!~?:&|+\-*\/\^%]+/,
	escapes: /\\(?:[0abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
	integersuffix: /([uU](ll|LL|l|L)|(ll|LL|l|L)?[uU]?)/,
	floatsuffix: /[fFlL]?/,
	encoding: /u|u8|U|L/,

	// The main tokenizer for our languages
	tokenizer: {
		root: [
			// identifiers and keywords
			[
				/[a-zA-Z_]\w*/,
				{
					cases: {
						'@keywords': { token: 'keyword.$0' },
						'@default': 'identifier'
					}
				}
			],

			// The preprocessor checks must be before whitespace as they check /^\s*#/ which
			// otherwise fails to match later after other whitespace has been removed.

			// Inclusion
			[/^\s*#\s*include/, { token: 'keyword.directive.include', next: '@include' }],

			// Preprocessor directive
			[/^\s*#\s*\w+/, 'keyword.directive'],

			// whitespace
			{ include: '@whitespace' },

			// delimiters and operators
			[/[{}()<>\[\]]/, '@brackets'],
			[
				/@symbols/,
				{
					cases: {
						'@operators': 'delimiter',
						'@default': ''
					}
				}
			],

			// numbers
			[/\d*\d+[eE]([\-+]?\d+)?(@floatsuffix)/, 'number.float'],
			[/\d*\.\d+([eE][\-+]?\d+)?(@floatsuffix)/, 'number.float'],
			[/0[xX][0-9a-fA-F']*[0-9a-fA-F](@integersuffix)/, 'number.hex'],
			[/0[0-7']*[0-7](@integersuffix)/, 'number.octal'],
			[/0[bB][0-1']*[0-1](@integersuffix)/, 'number.binary'],
			[/\d[\d']*\d(@integersuffix)/, 'number'],
			[/\d(@integersuffix)/, 'number'],

			// delimiter: after number because of .\d floats
			[/[;,.]/, 'delimiter'],

			// strings
			[/"([^"\\]|\\.)*$/, 'string.invalid'], // non-teminated string
			[/"/, 'string', '@string'],

			// characters
			[/'[^\\']'/, 'string'],
			[/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
			[/'/, 'string.invalid']
		],

		whitespace: [
			[/[ \t\r\n]+/, ''],
			[/\/\*\*(?!\/)/, 'comment.doc', '@doccomment'],
			[/\/\*/, 'comment', '@comment'],
			[/\/\/.*\\$/, 'comment', '@linecomment'],
			[/\/\/.*$/, 'comment']
		],

		comment: [
			[/[^\/*]+/, 'comment'],
			[/\*\//, 'comment', '@pop'],
			[/[\/*]/, 'comment']
		],

		//For use with continuous line comments
		linecomment: [
			[/.*[^\\]$/, 'comment', '@pop'],
			[/[^]+/, 'comment']
		],

		//Identical copy of comment above, except for the addition of .doc
		doccomment: [
			[/[^\/*]+/, 'comment.doc'],
			[/\*\//, 'comment.doc', '@pop'],
			[/[\/*]/, 'comment.doc']
		],

		string: [
			[/[^\\"]+/, 'string'],
			[/@escapes/, 'string.escape'],
			[/\\./, 'string.escape.invalid'],
			[/"/, 'string', '@pop']
		],

		include: [
			[
				/(\s*)(<)([^<>]*)(>)/,
				[
					'',
					'keyword.directive.include.begin',
					'string.include.identifier',
					{ token: 'keyword.directive.include.end', next: '@pop' }
				]
			],
			[
				/(\s*)(")([^"]*)(")/,
				[
					'',
					'keyword.directive.include.begin',
					'string.include.identifier',
					{ token: 'keyword.directive.include.end', next: '@pop' }
				]
			]
		]
	}
};
