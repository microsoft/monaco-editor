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
		{ open: '"', close: '"', notIn: ['string'] }
	],
	surroundingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"' },
		{ open: "'", close: "'" }
	],
	folding: {
		markers: {
			start: new RegExp('^\\s*#pragma\\s+region\\b'),
			end: new RegExp('^\\s*#pragma\\s+endregion\\b')
		}
	}
};

export const language = <languages.IMonarchLanguage>{
	tokenPostfix: '.rust',
	defaultToken: 'invalid',
	keywords: [
		// https://doc.rust-lang.org/reference/keywords.html
		// Strict keywords
		'as',
		'async',
		'await',
		'break',
		'const',
		'continue',
		'crate',
		'dyn',
		'else',
		'enum',
		'extern',
		'false',
		'fn',
		'for',
		'if',
		'impl',
		'in',
		'let',
		'loop',
		'match',
		'mod',
		'move',
		'mut',
		'pub',
		'ref',
		'return',
		'self',
		'Self',
		'static',
		'struct',
		'super',
		'trait',
		'true',
		'type',
		'unsafe',
		'use',
		'where',
		'while',
		// Reserved keywords
		'abstract',
		'become',
		'box',
		'do',
		'final',
		'macro',
		'override',
		'priv',
		'try',
		'typeof',
		'unsized',
		'virtual',
		'yield',
		// Weak keywords
		'macro_rules',
		'union',
		'\'static'
	],

	typeKeywords: [
		'Self',
		'char',
		'bool',
		'u8',
		'u16',
		'u32',
		'u64',
		'u128',
		'usize',
		'f32',
		'f64',
		'i8',
		'i16',
		'i32',
		'i64',
		'i128',
		'isize',
		'str',
		'Option',
		'Result',
		'c_float',
		'c_double',
		'c_void',
		'c_char',
		'c_schar',
		'c_uchar',
		'c_short',
		'c_ushort',
		'c_int',
		'c_uint',
		'c_long',
		'c_ulong',
		'c_longlong',
		'c_ulonglong'
	],

	constants: ['true', 'false', 'Some', 'None', 'Ok', 'Err'],

	supportMacros: [
		'format!',
		'print!',
		'println!',
		'panic!',
		'format_args!',
		'unreachable!',
		'write!',
		'writeln!'
	],

	operators: [
		'!',
		'!=',
		'%',
		'%=',
		'&',
		'&=',
		'&&',
		'*',
		'*=',
		'+',
		'+=',
		'-',
		'-=',
		'->',
		'.',
		'..',
		'...',
		'/',
		'/=',
		':',
		';',
		'<<',
		'<<=',
		'<',
		'<=',
		'=',
		'==',
		'=>',
		'>',
		'>=',
		'>>',
		'>>=',
		'@',
		'^',
		'^=',
		'|',
		'|=',
		'||',
		'_',
		'?',
		'#'
	],

	escapes: /\\([nrt0\"''\\]|x\h{2}|u\{\h{1,6}\})/,
	delimiters: /[,]/,
	symbols: /[\#\!\%\&\*\+\-\.\/\:\;\<\=\>\@\^\|_\?]+/,
	intSuffixes: /[iu](8|16|32|64|128|size)/,
	floatSuffixes: /f(32|64)/,

	tokenizer: {
		root: [
			// Raw string literals
			[/r(#*)"/, { token: 'string.quote', bracket: '@open', next: '@stringraw.$1' }],
			[
				/[a-zA-Z][a-zA-Z0-9_]*!?|_[a-zA-Z0-9_]+/,
				{
					cases: {
						'@typeKeywords': 'keyword.type',
						'@keywords': 'keyword',
						'@supportMacros': 'keyword',
						'@constants': 'keyword',
						'@default': 'identifier'
					}
				}
			],
			// Designator
			[/\$/, 'identifier'],
			// Lifetime annotations
			[/'[a-zA-Z_][a-zA-Z0-9_]*(?=[^\'])/, 'identifier'],
			// Byte literal
			[/'(\S|@escapes)'/, 'string.byteliteral'],
			// Strings
			[/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
			{ include: '@numbers' },
			// Whitespace + comments
			{ include: '@whitespace' },
			[
				/@delimiters/,
				{
					cases: {
						'@keywords': 'keyword',
						'@default': 'delimiter'
					}
				}
			],

			[/[{}()\[\]<>]/, '@brackets'],
			[/@symbols/, { cases: { '@operators': 'operator', '@default': '' } }]
		],

		whitespace: [
			[/[ \t\r\n]+/, 'white'],
			[/\/\*/, 'comment', '@comment'],
			[/\/\/.*$/, 'comment']
		],

		comment: [
			[/[^\/*]+/, 'comment'],
			[/\/\*/, 'comment', '@push'],
			['\\*/', 'comment', '@pop'],
			[/[\/*]/, 'comment']
		],

		string: [
			[/[^\\"]+/, 'string'],
			[/@escapes/, 'string.escape'],
			[/\\./, 'string.escape.invalid'],
			[/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
		],

		stringraw: [
			[/[^"#]+/, { token: 'string' }],
			[
				/"(#*)/,
				{
					cases: {
						'$1==$S2': { token: 'string.quote', bracket: '@close', next: '@pop' },
						'@default': { token: 'string' }
					}
				}
			],
			[/["#]/, { token: 'string' }]
		],

		numbers: [
			//Octal
			[/(0o[0-7_]+)(@intSuffixes)?/, { token: 'number' }],
			//Binary
			[/(0b[0-1_]+)(@intSuffixes)?/, { token: 'number' }],
			//Exponent
			[/[\d][\d_]*(\.[\d][\d_]*)?[eE][+-][\d_]+(@floatSuffixes)?/, { token: 'number' }],
			//Float
			[/\b(\d\.?[\d_]*)(@floatSuffixes)?\b/, { token: 'number' }],
			//Hexadecimal
			[/(0x[\da-fA-F]+)_?(@intSuffixes)?/, { token: 'number' }],
			//Integer
			[/[\d][\d_]*(@intSuffixes?)?/, { token: 'number' }]
		]
	}
};
