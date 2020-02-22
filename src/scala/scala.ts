/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import IRichLanguageConfiguration = monaco.languages.LanguageConfiguration;
import ILanguage = monaco.languages.IMonarchLanguage;

export const conf: IRichLanguageConfiguration = {
	tokenPostfix: '.scala',

	keywords: [
		'asInstanceOf',
		'catch', 'class', 'classOf',
		'def', 'do',
		'else', 'extends',
		'finally', 'for', 'foreach', 'forSome',
		'if', 'import', 'isInstanceOf',
		'match',
		'new',
		'object',
		'package',
		'return',
		'throw', 'trait', 'try', 'type',
		'until',
		'val', 'var',
		'while', 'with',
		'yield'
	],

	constants: [
		'true', 'false', 'null',
		'this', 'super'
	],

	modifiers: [
		'abstract', 'final', 'implicit', 'lazy', 'override',
		'private', 'protected', 'sealed'
	],

	name: /[a-z_$][\w$]*/,

	// we include these common regular expressions
	symbols: /[=><!~?:&|+\-*\/\^%@#]+/,

	// C# style strings
	escapes: /\\(?:[btnfr\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

	fstring_conv: /[bBhHsScCdoxXeEfgGaAt]|[Tn](?:[HIklMSLNpzZsQ]|[BbhAaCYyjmde]|[RTrDFC])/,

	// The main tokenizer for our languages
	tokenizer: {
		root: [
			// strings
			[/\braw"""/, {token: 'string.quote', bracket: '@open', next: '@rawstringt'}],
			[/\braw"/, {token: 'string.quote', bracket: '@open', next: '@rawstring'}],

			[/\bs"""/, {token: 'string.quote', bracket: '@open', next: '@sstringt'}],
			[/\bs"/, {token: 'string.quote', bracket: '@open', next: '@sstring'}],

			[/\bf""""/, {token: 'string.quote', bracket: '@open', next: '@fstringt'}],
			[/\bf"/, {token: 'string.quote', bracket: '@open', next: '@fstring'}],

			[/"""/, {token: 'string.quote', bracket: '@open', next: '@stringt'}],
			[/"/, {token: 'string.quote', bracket: '@open', next: '@string'}],

			// numbers
			[/[+\-]?(?:\d[_\d])*\.\d+[dDfFlL]?([eE][\-+]?\d+)?/, 'number.float'],
			[/0[xX][0-9a-fA-F]+/, 'number.hex'],
			[/[+\-]?\d[_\d]*[dDfFlL]?/, 'number'],

			[/\b_\*/, 'key'],
			[/\b(_)(\b)/, 'keyword'],
			
			// identifiers and keywords
			[/\b(case)([ \t]+)(class)\b/, ['tag.id.pug', 'white', 'keyword']],
			[/\bcase\b/, 'keyword', '@case'],
			[/\bva[lr]\b/, 'keyword', '@vardef'],
			[/\b(def[ \t]+)(@name)/, ['keyword', 'keyword.flow']],
			[/@name(?=:(?!:))/, 'variable'],
			[/(\.)(@name)(?=[ \t]*[({])/, ['operator', 'keyword.flow']],
			[/@name(?=[ \t]*[({])/, {cases: {
				'@keywords': 'keyword',
				'@default': 'keyword.flow'
			}}],
			[/(\{)(\s*)(@name(?=\s*=>))/, ['@brackets', 'white', 'variable']],
			[/@name/, {cases: {
				'@keywords': 'keyword',
				'@modifiers': 'tag.id.pug',
				'@constants': 'constant',
				'@default': 'identifier'
			}}],
			[/[A-Z]\w*/, 'type.identifier'],

			// whitespace
			{include: '@whitespace'},
			
			// @ annotations.
			[/@[a-zA-Z_$][\w$]*(?:\.[a-zA-Z_$][\w$]*)*/, 'annotation'],

			// delimiters and operators
			[/[{}()]/, '@brackets'],
			[/[\[\]]/, 'operator.scss'],
			[/[=-]>|<-|>:|<:|<%/, 'keyword'],
			[/@symbols/, 'operator'],

			// delimiter: after number because of .\d floats
			[/[;,.]/, 'delimiter'],

			// characters
			[/'[^\\']'/, 'string'],
			[/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
			[/'/, 'string.invalid']
		],

		comment: [
			[/[^\/*]+/, 'comment'],
			[/\/\*/, 'comment', '@push'], // nested comment
			["\\*/", 'comment', '@pop'],
			[/[\/*]/, 'comment']
		],

		case: [
			[/\b_\*/, 'key'],
			[/\b(_|true|false|null|this|super)\b/, 'keyword'],
			[/\bif\b|=>/, 'keyword', '@pop'],
			[/`@name`/, 'identifier'],
			[/@name/, 'variable'],
			[/:::?|\||@(?![a-z_$])/, 'keyword'],
			{include: '@root'}
		],

		vardef: [
			[/\b_\*/, 'key'],
			[/\b(_|true|false|null|this|super)\b/, 'keyword'],
			[/@name/, 'variable'],
			[/:::?|\||@(?![a-z_$])/, 'keyword'],
			[/[=:]/, 'operator', '@pop'],
			[/$/, 'white', '@pop'],
			{include: '@root'}
		],

		string: [
			[/[^\\"\n\r]+/, 'string'],
			[/@escapes/, 'string.escape'],
			[/\\./, 'string.escape.invalid'],
			[/"/, {token: 'string.quote', bracket: '@close', next: '@pop'}],
		],

		stringt: [
			[/[^\\"\n\r]+/,	'string'],
			[/@escapes/, 'string.escape'],
			[/\\./, 'string.escape.invalid'],
			[/"""/, {token: 'string.quote', bracket: '@close', next: '@pop'}],
			[/"/, 'string']
		],

		fstring: [
			[/@escapes/, 'string.escape'],
			[/"/, {token: 'string.quote', bracket: '@close', next: '@pop'}],
			[/\$\$/, 'string'],
			[/(\$)([a-z_]\w*)/, ['operator', 'identifier']],
			[/\$\{/, 'operator', '@interp'],
			[/%%/, 'string'],
			[/(%)([\-#+ 0,(])(\d+|\.\d+|\d+\.\d+)(@fstring_conv)/, ['metatag', 'tag.id.pug', 'number', 'metatag']],
			[/(%)(\d+|\.\d+|\d+\.\d+)(@fstring_conv)/, ['metatag', 'number', 'metatag']],
			[/(%)([\-#+ 0,(])(@fstring_conv)/, ['metatag', 'tag.id.pug', 'metatag']],
			[/(%)(@fstring_conv)/, ['metatag', 'metatag']],
			[/./, 'string']
		],

		fstringt: [
			[/@escapes/, 'string.escape'],
			[/"""/, {token: 'string.quote', bracket: '@close', next: '@pop'}],
			[/\$\$/, 'string'],
			[/(\$)([a-z_]\w*)/, ['operator', 'identifier']],
			[/\$\{/, 'operator', '@interp'],
			[/%%/, 'string'],
			[/(%)([\-#+ 0,(])(\d+|\.\d+|\d+\.\d+)(@fstring_conv)/, ['metatag', 'tag.id.pug', 'number', 'metatag']],
			[/(%)(\d+|\.\d+|\d+\.\d+)(@fstring_conv)/, ['metatag', 'number', 'metatag']],
			[/(%)([\-#+ 0,(])(@fstring_conv)/, ['metatag', 'tag.id.pug', 'metatag']],
			[/(%)(@fstring_conv)/, ['metatag', 'metatag']],
			[/./, 'string']
		],

		sstring: [
			[/@escapes/, 'string.escape'],
			[/"/, {token: 'string.quote', bracket: '@close', next: '@pop'}],
			[/\$\$/, 'string'],
			[/(\$)([a-z_]\w*)/, ['operator', 'identifier']],
			[/\$\{/, 'operator', '@interp'],
			[/./, 'string']
		],

		sstringt: [
			[/@escapes/, 'string.escape'],
			[/"""/, {token: 'string.quote', bracket: '@close', next: '@pop'}],
			[/\$\$/, 'string'],
			[/(\$)([a-z_]\w*)/, ['operator', 'identifier']],
			[/\$\{/, 'operator', '@interp'],
			[/./, 'string']
		],

		interp: [
			[/\{/, 'operator', '@push'],
			[/\}/, 'operator', '@pop'],
			{include: '@root'}
		],

		rawstring: [
			[/[^"]/, 'string'],
			[/"/, {token: 'string.quote', bracket: '@close', next: '@pop'}]
		],

		rawstringt: [
			[/[^"]/, 'string'],
			[/"""/, {token: 'string.quote', bracket: '@close', next: '@pop'}],
			[/"/, 'string']
		],

		whitespace: [
			[/[ \t\r\n]+/, 'white'],
			[/\/\*/, 'comment', '@comment'],
			[/\/\/.*$/, 'comment'],
		],
	},
};
