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
		{ open: '"', close: '"', notIn: ['string', 'comment'] },	// quoted identifier?
		{ open: '[', close: ']', notIn: ['string', 'comment'] },
		{ open: '(', close: ')', notIn: ['string', 'comment'] },
		{ open: '{', close: '}', notIn: ['string', 'comment'] },
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
		"try", "type", "#binary",
		"#date", "#datetime",
		"#datetimezone", "#duration",
		"#infinity", "#nan", "#sections",
		"#shared", "#table", "#time"
	],

	typeKeywords: [
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

	wordDefinition: /([a-zA-Z_\.][a-zA-Z\._0-9]*)|([0-9][_\.a-zA-Z0-9]*[_\.a-zA-Z])/,

	tokenizer: {
		root: [
			{ include: "@comments" },

			[/\d+(\.\d+)?/, "number"],
			[/(([a-zA-Z_\.][a-zA-Z\._0-9]*)|([0-9][_\.a-zA-Z0-9]*[_\.a-zA-Z]))|(#["]([ \[\]_\.a-zA-Z0-9]+)["])/,
				{
					cases: {
						"@keywords": "keyword",
						"@default": "identifier"
					}
				}],
			{ include: "@strings" },
			[/[{}()\[\]]/, "@brackets"],
			// Removed forward slash for now to allow comments
			[/[,;=+<>\-*&@?]|([<>]=)|(<>)|([\.\.][\.]?)|(=>)/, "punctuator"],

		],
		comments: [
			["\\/\\*", "comment", "@comment"],
			["\\/\\/+.*", "comment"]
		],
		comment: [
			["\\*\\/", "comment", "@pop"],
			[".", "comment"]
		],
		// Recognize strings, including those broken across lines with \ (but not without)
		strings: [
			[/"$/, "string.escape", "@root"],
			[/"/, "string.escape", "@stringBody"],
			[/"$/, "string.escape", "@root"],
			[/"/, "string.escape", "@dblStringBody"]
		],
		stringBody: [
			[/\\./, "string"],
			[/"/, "string.escape", "@root"],
			[/.(?=.*")/, "string"],
			[/.*\\$/, "string"],
			[/.*$/, "string", "@root"]
		],
		dblStringBody: [
			[/\\./, "string"],
			[/"/, "string.escape", "@root"],
			[/.(?=.*")/, "string"],
			[/.*\\$/, "string"],
			[/.*$/, "string", "@root"]
		]
	}
};
