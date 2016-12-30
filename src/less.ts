/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import IRichLanguageConfiguration = monaco.languages.LanguageConfiguration;
import ILanguage = monaco.languages.IMonarchLanguage;

export var conf: IRichLanguageConfiguration = {
    wordPattern: /(#?-?\d*\.\d\w*%?)|([@#!.:]?[\w-?]+%?)|[@#!.]/g,
    comments: {
        blockComment: ['/*', '*/'],
        lineComment: '//'
    },
    brackets: [['{','}'], ['[',']'], ['(',')'], ['<','>']],
    autoClosingPairs: [
        { open: '"', close: '"', notIn: ['string', 'comment'] },
        { open: '\'', close: '\'', notIn: ['string', 'comment'] },
        { open: '{', close: '}', notIn: ['string', 'comment'] },
        { open: '[', close: ']', notIn: ['string', 'comment'] },
        { open: '(', close: ')', notIn: ['string', 'comment'] },
        { open: '<', close: '>', notIn: ['string', 'comment'] },
    ]
};

const TOKEN_SELECTOR = 'tag';
const TOKEN_SELECTOR_TAG = 'tag';
const TOKEN_PROPERTY = 'attribute.name';
const TOKEN_VALUE = 'attribute.value';
const TOKEN_AT_KEYWORD = 'keyword.control.at-rule';

export var language = <ILanguage> {
	defaultToken: '',
	tokenPostfix: '.less',

	identifier: '-?-?([a-zA-Z]|(\\\\(([0-9a-fA-F]{1,6}\\s?)|[^[0-9a-fA-F])))([\\w\\-]|(\\\\(([0-9a-fA-F]{1,6}\\s?)|[^[0-9a-fA-F])))*',
	identifierPlus: '-?-?([a-zA-Z:.]|(\\\\(([0-9a-fA-F]{1,6}\\s?)|[^[0-9a-fA-F])))([\\w\\-:.]|(\\\\(([0-9a-fA-F]{1,6}\\s?)|[^[0-9a-fA-F])))*',

	brackets: [
		{ open: '{', close: '}', token: 'delimiter.curly' },
		{ open: '[', close: ']', token: 'delimiter.bracket' },
		{ open: '(', close: ')', token: 'delimiter.parenthesis' },
		{ open: '<', close: '>', token: 'delimiter.angle' }
	],

	tokenizer: {
		root: <any[]>[
			{ include: '@nestedJSBegin' },

			['[ \\t\\r\\n]+', ''],

			{ include: '@comments' },
			{ include: '@keyword' },
			{ include: '@strings' },
			{ include: '@numbers' },
			['[*_]?[a-zA-Z\\-\\s]+(?=:.*(;|(\\\\$)))', TOKEN_PROPERTY, '@attribute'],

			['url(\\-prefix)?\\(', { token: 'tag', next: '@urldeclaration'}],

			['[{}()\\[\\]]', '@brackets'],
			['[,:;]', 'delimiter'],

			['#@identifierPlus', TOKEN_SELECTOR + '.id'],
			['&', TOKEN_SELECTOR_TAG],

			['\\.@identifierPlus(?=\\()', TOKEN_SELECTOR + '.class', '@attribute'],
			['\\.@identifierPlus', TOKEN_SELECTOR + '.class'],

			['@identifierPlus', TOKEN_SELECTOR_TAG],
			{ include: '@operators' },

			['@(@identifier(?=[:,\\)]))', 'variable', '@attribute'],
			['@(@identifier)', 'variable'],
			['@', 'key', '@atRules']
		],

		nestedJSBegin: [
			['``', 'delimiter.backtick'],
			['`', { token: 'delimiter.backtick', next: '@nestedJSEnd', nextEmbedded: 'text/javascript' }],
		],

		nestedJSEnd: [
			['`', { token: 'delimiter.backtick', next: '@pop', nextEmbedded: '@pop' }],
		],

		operators: [
			['[<>=\\+\\-\\*\\/\\^\\|\\~]', 'operator']
		],

		keyword: [
			['(@[\\s]*import|![\\s]*important|true|false|when|iscolor|isnumber|isstring|iskeyword|isurl|ispixel|ispercentage|isem|hue|saturation|lightness|alpha|lighten|darken|saturate|desaturate|fadein|fadeout|fade|spin|mix|round|ceil|floor|percentage)\\b', 'keyword']
		],

		urldeclaration: [
			{ include: '@strings'},
			[ '[^)\r\n]+', 'string' ],
			['\\)', { token: 'tag', next: '@pop'}],
		],

		attribute: <any[]>[
			{ include: '@nestedJSBegin' },
			{ include: '@comments' },
			{ include: '@strings' },
			{ include: '@numbers' },

			{ include: '@keyword' },

			['[a-zA-Z\\-]+(?=\\()', TOKEN_VALUE, '@attribute'],
			['>', 'operator', '@pop'],
			['@identifier', TOKEN_VALUE],
			{ include: '@operators' },
			['@(@identifier)', 'variable'],

			['[)\\}]', '@brackets', '@pop'],
			['[{}()\\[\\]>]', '@brackets'],

			['[;]', 'delimiter', '@pop'],
			['[,=:]', 'delimiter'],

			['\\s', ''],
			['.', TOKEN_VALUE]
		],

		comments: [
			['\\/\\*', 'comment', '@comment'],
			['\\/\\/+.*', 'comment'],
		],

		comment: [
			['\\*\\/', 'comment', '@pop'],
			['.', 'comment'],
		],

		numbers: [
			['(\\d*\\.)?\\d+([eE][\\-+]?\\d+)?', { token: TOKEN_VALUE + '.number', next: '@units' }],
			['#[0-9a-fA-F_]+(?!\\w)', TOKEN_VALUE + '.hex']
		],

		units: [
			['(em|ex|ch|rem|vmin|vmax|vw|vh|vm|cm|mm|in|px|pt|pc|deg|grad|rad|turn|s|ms|Hz|kHz|%)?', TOKEN_VALUE + '.unit', '@pop']
		],

		strings: [
			<any[]>['~?"', { token: 'string.delimiter', next: '@stringsEndDoubleQuote' }],
			<any[]>['~?\'', { token: 'string.delimiter', next: '@stringsEndQuote' }]
		],

		stringsEndDoubleQuote: [
			['\\\\"', 'string'],
			<any[]>['"', { token: 'string.delimiter', next: '@popall' }],
			['.', 'string']
		],

		stringsEndQuote: [
			['\\\\\'', 'string'],
			<any[]>['\'', { token: 'string.delimiter', next: '@popall' }],
			['.', 'string']
		],

		atRules: <any[]>[
			{ include: '@comments' },
			{ include: '@strings' },
			['[()]', 'delimiter'],
			['[\\{;]', 'delimiter', '@pop'],
			['.', 'key']
		]
	}
};