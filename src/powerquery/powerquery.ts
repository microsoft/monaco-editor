/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import IRichLanguageConfiguration = monaco.languages.LanguageConfiguration;
import ILanguage = monaco.languages.IMonarchLanguage;

export const conf: IRichLanguageConfiguration = {
	comments: {
		lineComment: '//',
		blockComment: ['/*', '*/'],
	},
	brackets: [['[', ']'], ['(', ')'], ['{', '}']],
	autoClosingPairs: [
		{ open: '"', close: '"', notIn: ['string', 'comment', 'identifier'] },
		{ open: '[', close: ']', notIn: ['string', 'comment', 'identifier'] },
		{ open: '(', close: ')', notIn: ['string', 'comment', 'identifier'] },
		{ open: '{', close: '}', notIn: ['string', 'comment', 'identifier'] },
	]
};

export const language = <ILanguage>{
	defaultToken: '',
	tokenPostfix: '.pq',
	ignoreCase: false,

	brackets: [
		{ open: '[', close: ']', token: 'delimiter.square' },
		{ open: '{', close: '}', token: 'delimiter.brackets' },
		{ open: '(', close: ')', token: 'delimiter.parenthesis' }
	],

	keywords: [
		"and", "as", "each", "else",
		"error", "false", "if", "in",
		"is", "let", "meta", "not",
		"otherwise", "or", "section",
		"shared", "then", "true",
		"try", "type"
	],

	constructors: [
		"#binary",
		"#date",
		"#datetime",
		"#datetimezone",
		"#duration",
		"#table",
		"#time"
	],

	constants: [
		"#infinity",
		"#nan",
		"#sections",
		"#shared"
	],

	typeKeywords: [
		"action",
		"any",
		"anynonnull",
		"none",
		"null",
		"logical",
		"number",
		"time",
		"date",
		"datetime",
		"datetimezone",
		"duration",
		"text",
		"binary",
		"list",
		"record",
		"table",
		"function"
	],

	tokenizer: {
		root: [
			// quoted identifier
			[/#"[\w \.]+"/, "identifier.quote"],

			// numbers
			[/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
			[/0[xX][0-9a-fA-F]+/, "number.hex"],
			[/\d+([eE][\-+]?\d+)?/, "number"],

			// keywords
			[/(#?[a-z]+)/,
				{
					cases: {
						"@typeKeywords": "type",
						"@keywords": "keyword",
						"@constants": "constant",
						"@constructors": "constructor",
						"@default": "identifier"
					}
				}
			],

			// other identifiers
			[/([a-zA-Z_][\w\.]*)/, "identifier"],

			{ include: "@whitespace" },
			{ include: "@comments" },
			{ include: "@strings" },

			[/[{}()\[\]]/, "@brackets"],
			[/([=\+<>\-\*&@\?\/!])|([<>]=)|(<>)|(=>)|(\.\.\.)|(\.\.)/, "operator"],
			[/[,;]/, "delimiter"],
		],

		whitespace: [
			[/\s+/, "white"]
		],

		comments: [
			["\\/\\*", "comment", "@comment"],
			["\\/\\/+.*", "comment"]
		],

		comment: [
			["\\*\\/", "comment", "@pop"],
			[".", "comment"]
		],

		strings: [
			["\"", "string", "@string"]
		],

		string: [
			["\"\"", "string.escape"],
			["\"", "string", "@pop"],
			[".", "string"]
		]
	}
};
