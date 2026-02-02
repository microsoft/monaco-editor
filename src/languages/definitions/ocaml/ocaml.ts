/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { languages } from '../../../editor';

export const conf: languages.LanguageConfiguration = {
	comments: {
		blockComment: ['(*', '*)']
	},
	brackets: [
		['{', '}'],
		['[', ']'],
		['(', ')'],
		['{|', '|}'],
		['[|', '|]'],
	],
	autoClosingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
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
			start: new RegExp('^\\s*//\\s*#region\\b|^\\s*\\(\\*\\s*#region(.*)\\*\\)'),
			end: new RegExp('^\\s*//\\s*#endregion\\b|^\\s*\\(\\*\\s*#endregion\\s*\\*\\)')
		}
	}
};

export const language = <languages.IMonarchLanguage>{
	defaultToken: 'invalid',
	tokenPostfix: '.ocaml',

	// Not implemented:
	// - Quoted string

	keywords: [
		'and',
		'as',
		'assert',
		'begin',
		'class',
		'constraint',
		'do',
		'done',
		'downto',
		'else',
		'end',
		'exception',
		'external',
		'false',
		'for',
		'fun',
		'function',
		'functor',
		'if',
		'in',
		'include',
		'inherit',
		'initializer',
		'lazy',
		'let',
		'match',
		'method',
		'module',
		'mutable',
		'new',
		'nonrec',
		'object',
		'of',
		'open',
		'open!',
		'or',
		'private',
		'rec',
		'sig',
		'struct',
		'then',
		'to',
		'true',
		'try',
		'type',
		'val',
		'virtual',
		'when',
		'while',
		'with',
	],
	operatorKeywords: [
		'mod',
		'land',
		'lor',
		'lxor',
		'lsl',
		'lsr',
		'asr',
	],
	bracketOpenKeywords: [
		'begin',
		'object',
		'sig',
		'struct'
	],
	debuggingConsts: [
		'__FILE__',
		'__FUNCTION__',
		'__LINE__',
		'__LINE_OF__',
		'__LOC__',
		'__LOC_OF__',
		'__MODULE__',
		'__POS__',
		'__POS_OF__',
	],

	coreOperatorChar: /[$&*+\-\/=>@\^|]/,
	operatorChar: /((@coreOperatorChar)|[~!?%<:\.])/,
	infixSym: /(((@coreOperatorChar)|[%<])(@operatorChar)*|#(@operatorChar)+)/,
	infixOp: /(!=|<|>|\|\||&&|:=|(@infixSym))/,
	prefixSym: /(!(@operatorChar)*|[?~](@operatorChar)+)/,
	operator: /((@prefixSym)|(@infixOp))/,

	escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

	coreDec: /[\d][\d_]*/,
	coreHex: /0[xX][\da-fA-F][\da-fA-F_]*/,
	exponent: /[eE][+-]?(@coreDec)/,
	hexExponent: /[pP][+-]?(@coreDec)/,
	integerSuffix: /[lLn]/,

	// The main tokenizer for our languages
	tokenizer: {
		root: [
			// identifiers and keywords
			[
				/[~?]?[a-z_]\w*/,
				{
					cases: {
						'end': { token: 'keyword.bracket', bracket: '@close' },
						'@bracketOpenKeywords': { token: 'keyword.bracket', bracket: '@open' },
						'@operatorKeywords': 'operator',
						'@keywords': 'keyword',
						'@debuggingConsts': 'constant',
						'@default': 'identifier'
					}
				}
			],
			[/[A-Z]\w*/, 'constructor'],

			{ include: '@whitespace' },

			{ include: '@number' },

			[/[:;,.]/, 'delimiter'],

			// strings
			[/"""/, 'string', '@string."""'],
			[/"/, 'string', '@string."'],

			// characters
			[/'[^\\']'B?/, 'string'],
			[/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
			[/'/, 'string.invalid'],

			// brackets
			[/[{\[]\|/, '@brackets'],
			[/\|[}\]]/, '@brackets'],
			[/[{}()\[\]]/, '@brackets'],

			[/@operator/, 'operator']
		],

		whitespace: [
			[/[ \t\r\n]+/, ''],
			// [/\(\*\*/, 'comment.doc', '@comment'],
			[/\(\*\*?/, 'comment', '@comment']
		],

		comment: [
			[/[^\(\)*]+/, 'comment'],
			[/\(\*/, 'comment', '@push'],
			[/\*\)/, 'comment', '@pop'],
			[/[\(\)*]/, 'comment']
		],

		number: [
			// for float, fractional part and exponent part can be omitted but not both
			[/-?(@coreHex)((\.[\da-fA-F_]*)(@hexExponent)?|(@hexExponent))/, 'number.float'],
			[/-?(@coreHex)(@integerSuffix)?/, 'number.hex'],
			[/-?0[oO][0-7][0-7_]*(@integerSuffix)?/, 'number.octal'],
			[/-?0[bB][01][01_]*(@integerSuffix)?/, 'number.binary'],
			[/-?(@coreDec)((\.[\d_]*)(@exponent)?|(@exponent))/, 'number.float'],
			[/-?(@coreDec)(@integerSuffix)?/, 'number'],
		],

		string: [
			[/[^\\"]+/, 'string'],

			[/\\$/, 'string'], // newline sequence
			[/\\u{\w+}/, 'string.escape'],
			[/@escapes/, 'string.escape'],
			[/\\./, 'string.escape.invalid'],
			[
				/("""|")/,
				{
					cases: {
						'$#==$S2': { token: 'string', next: '@pop' },
						'@default': 'string'
					}
				}
			]

		]
	}
};
