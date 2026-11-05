/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// The token rules follow the Verse grammar that Epic Games publishes under CC0 in
// https://github.com/verselang/book

import { languages } from '../../../editor';

const specifiers = [
	'abstract',
	'allocates',
	'castable',
	'closed',
	'computes',
	'concrete',
	'constructor',
	'converges',
	'decides',
	'epic_internal',
	'final',
	'final_super',
	'final_super_base',
	'getter',
	'inline',
	'internal',
	'localizes',
	'module_scoped_var_weak_map_key',
	'native',
	'native_callable',
	'no_rollback',
	'open',
	'override',
	'persistable',
	'persistent',
	'predicts',
	'private',
	'protected',
	'public',
	'reads',
	'scoped',
	'setter',
	'suspends',
	'transacts',
	'unique',
	'writes'
];

export const conf: languages.LanguageConfiguration = {
	comments: {
		lineComment: '#',
		blockComment: ['<#', '#>']
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
		{ open: '"', close: '"', notIn: ['string'] },
		{ open: "'", close: "'", notIn: ['string', 'comment'] }
	],
	surroundingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"' },
		{ open: "'", close: "'" }
	],
	onEnterRules: [
		{
			// an indented block follows a trailing `:` or `=`, as in `if (Ready?):` or `F():void =`
			beforeText: new RegExp('^[^#]*[:=]\\s*(#.*)?$'),
			action: { indentAction: languages.IndentAction.Indent }
		}
	],
	folding: {
		offSide: true
	}
};

export const language = <languages.IMonarchLanguage>{
	defaultToken: '',
	tokenPostfix: '.verse',

	keywords: [
		'alias',
		'and',
		'array',
		'block',
		'branch',
		'break',
		'case',
		'catch',
		'class',
		'const',
		'continue',
		'defer',
		'do',
		'else',
		'enum',
		'external',
		'false',
		'first',
		'for',
		'if',
		'import',
		'in',
		'interface',
		'is',
		'live',
		'loop',
		'map',
		'module',
		'mutable',
		'not',
		'of',
		'or',
		'profile',
		'race',
		'ref',
		'return',
		'rush',
		'Self',
		'set',
		'spawn',
		'struct',
		'sync',
		'then',
		'true',
		'until',
		'upon',
		'using',
		'var',
		'when',
		'where',
		'while',
		'with',
		'yield'
	],

	typeKeywords: [
		'any',
		'castable_subtype',
		'char',
		'char32',
		'comparable',
		'concrete_subtype',
		'float',
		'int',
		'logic',
		'option',
		'persistable',
		'rational',
		'string',
		'subtype',
		'tuple',
		'type',
		'void',
		'weak_map'
	],

	brackets: [
		{ open: '{', close: '}', token: 'delimiter.curly' },
		{ open: '[', close: ']', token: 'delimiter.square' },
		{ open: '(', close: ')', token: 'delimiter.parenthesis' }
	],

	escapes: /\\[tnr"'\\{}<>&#~]/,
	path: /\/[a-zA-Z0-9_][\w\-.]*(?:@[\w\-.]+)?(?:\/[a-zA-Z_]\w*)*/,
	specifiers: new RegExp(`<(?:${specifiers.join('|')})(?:\\{[^}]*\\}|\\([^)]*\\))?>`),

	tokenizer: {
		root: [
			// `<#>` comments out the rest of its line and every following line indented deeper than it
			[/^(\s*)(<#>.*)$/, ['white', { token: 'comment', next: '@indentedComment.$1' }]],
			{ include: '@code' }
		],

		code: [
			{ include: '@whitespace' },

			// `using { /Verse.org/Simulation }`
			[/(using)(\s*)(\{)/, ['keyword', 'white', { token: 'delimiter.curly', next: '@using' }]],
			// `(/Verse.org/Random:)GetRandomInt` and `import(/Verse.org/Random)`
			[/(\()(\s*)(@path)/, ['delimiter.parenthesis', 'white', 'constant.path']],

			// specifiers such as `<public>`, `<decides>` or `<scoped{/MyModule}>`, and attributes such as `@editable`
			[/@specifiers/, 'annotation'],
			[/@[a-zA-Z_]\w*/, 'annotation'],

			[
				/[a-zA-Z_]\w*/,
				{
					cases: {
						'@keywords': 'keyword',
						'@typeKeywords': 'keyword.type',
						'@default': 'identifier'
					}
				}
			],

			// numbers, with an optional suffix such as `f64`; `0o61` and `0u1F600` are characters
			[/0x[0-9a-fA-F]+/, 'number.hex'],
			[/0[ou][0-9a-fA-F]+/, 'string'],
			[/\d+(?:\.\d+(?:[eE][\-+]?\d+)?|[eE][\-+]?\d+)(?:%|[a-zA-Z_]\w*)?/, 'number.float'],
			[/\d+(?:%|[a-zA-Z_]\w*)?/, 'number'],

			// an interpolation may continue a string on the next line, so only a line without `{` is unterminated
			[/"(?:[^"\\{]|\\.)*$/, 'string.invalid'],
			[/"/, 'string', '@string'],

			[/'(?:[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\\'])'/, 'string'],
			[/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
			[/'/, 'string.invalid'],

			[/[{}()\[\]]/, '@brackets'],
			[/:=|=>|->|<>|<=|>=|\.\.|[+\-*\/]=|[=<>+\-*\/?:^]/, 'operator'],
			[/[;,.]/, 'delimiter']
		],

		whitespace: [
			[/[ \t\r\n]+/, 'white'],
			[/<#>.*$/, 'comment'],
			[/<#/, 'comment', '@comment'],
			[/#.*$/, 'comment']
		],

		comment: [
			[/[^<#]+/, 'comment'],
			[/<#>/, 'comment'],
			[/<#/, 'comment', '@push'],
			[/#>/, 'comment', '@pop'],
			[/[<#]/, 'comment']
		],

		// $S2 is the indentation of the line that holds the `<#>`
		indentedComment: [
			[/^$S2[ \t]+.*$/, 'comment'],
			[/^[ \t]*$/, 'comment'],
			[/^/, '@rematch', '@pop']
		],

		string: [
			[/[^\\"{<]+/, 'string'],
			[/@escapes/, 'string.escape'],
			[/\\./, 'string.escape.invalid'],
			// block comments are allowed in strings and are not part of their value
			[/<#(?!>)/, 'comment', '@comment'],
			[/</, 'string'],
			[/\{/, 'delimiter.bracket', '@interpolation'],
			[/"/, 'string', '@pop']
		],

		interpolation: [
			[/\}/, 'delimiter.bracket', '@pop'],
			[/\{/, 'delimiter.curly', '@interpolationBraces'],
			{ include: '@code' }
		],

		interpolationBraces: [
			[/\}/, 'delimiter.curly', '@pop'],
			[/\{/, 'delimiter.curly', '@push'],
			{ include: '@code' }
		],

		using: [
			{ include: '@whitespace' },
			[/@path/, 'constant.path'],
			[/[a-zA-Z_]\w*(?:\.[a-zA-Z_]\w*)*/, 'constant.path'],
			[/[,;]/, 'delimiter'],
			[/\}/, 'delimiter.curly', '@pop'],
			[/./, '@rematch', '@pop']
		]
	}
};
