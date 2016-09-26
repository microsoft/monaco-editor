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

const TOKEN_SELECTOR = 'entity.name.selector';
const TOKEN_SELECTOR_TAG = 'entity.name.tag';
const TOKEN_PROPERTY = 'support.type.property-name';
const TOKEN_VALUE = 'support.property-value';
const TOKEN_AT_KEYWORD = 'keyword.control.at-rule';

export var language = <ILanguage> {
	defaultToken: '',
	tokenPostfix: '.less',

	identifier: '-?-?([a-zA-Z]|(\\\\(([0-9a-fA-F]{1,6}\\s?)|[^[0-9a-fA-F])))([\\w\\-]|(\\\\(([0-9a-fA-F]{1,6}\\s?)|[^[0-9a-fA-F])))*',
	identifierPlus: '-?-?([a-zA-Z:.]|(\\\\(([0-9a-fA-F]{1,6}\\s?)|[^[0-9a-fA-F])))([\\w\\-:.]|(\\\\(([0-9a-fA-F]{1,6}\\s?)|[^[0-9a-fA-F])))*',

	brackets: [
		{ open: '{', close: '}', token: 'punctuation.curly' },
		{ open: '[', close: ']', token: 'punctuation.bracket' },
		{ open: '(', close: ')', token: 'punctuation.parenthesis' },
		{ open: '<', close: '>', token: 'punctuation.angle' }
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

			['url(\\-prefix)?\\(', { token: 'function', bracket: '@open', next: '@urldeclaration'}],

			['[{}()\\[\\]]', '@brackets'],
			['[,:;]', 'punctuation'],

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
			['``', 'punctuation.backtick'],
			<any[]>['`', { token: 'punctuation.backtick', bracket: '@open', next: '@nestedJSEnd', nextEmbedded: 'text/javascript' }],
		],

		nestedJSEnd: [
			<any[]>['`', { token: 'punctuation.backtick', bracket: '@close', next: '@pop' }],
			<any[]>['.', { token: '@rematch', next: '@javascript_block' }],
		],

		javascript_block: [
			<any[]>['`', { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }],
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
			['\\)', { token: 'tag', bracket: '@close', next: '@pop'}],
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

			['[;]', 'punctuation', '@pop'],
			['[,=:]', 'punctuation'],

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
			<any[]>['(\\d*\\.)?\\d+([eE][\\-+]?\\d+)?', { token: TOKEN_VALUE + '.numeric', next: '@units' }],
			['#[0-9a-fA-F_]+(?!\\w)', TOKEN_VALUE + '.rgb-value']
		],

		units: [
			['((em|ex|ch|rem|vmin|vmax|vw|vh|vm|cm|mm|in|px|pt|pc|deg|grad|rad|turn|s|ms|Hz|kHz|%)\\b)?', TOKEN_VALUE + '.unit', '@pop']
		],

		strings: [
			<any[]>['~?"', { token: 'string.punctuation', bracket: '@open', next: '@stringsEndDoubleQuote' }],
			<any[]>['~?\'', { token: 'string.punctuation', bracket: '@open', next: '@stringsEndQuote' }]
		],

		stringsEndDoubleQuote: [
			['\\\\"', 'string'],
			<any[]>['"', { token: 'string.punctuation', next: '@popall', bracket: '@close' }],
			['.', 'string']
		],

		stringsEndQuote: [
			['\\\\\'', 'string'],
			<any[]>['\'', { token: 'string.punctuation', next: '@popall', bracket: '@close' }],
			['.', 'string']
		],

		atRules: <any[]>[
			{ include: '@comments' },
			{ include: '@strings' },
			['[()]', 'punctuation'],
			['[\\{;]', 'punctuation', '@pop'],
			['.', 'key']
		]
	}
};