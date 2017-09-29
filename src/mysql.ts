/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import IRichLanguageConfiguration = monaco.languages.LanguageConfiguration;
import ILanguage = monaco.languages.IMonarchLanguage;

export const conf: IRichLanguageConfiguration = {
	comments: {
		lineComment: '--',
		blockComment: ['/*', '*/'],
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
		{ open: '"', close: '"' },
		{ open: '\'', close: '\'' },
	],
	surroundingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"' },
		{ open: '\'', close: '\'' },
	]
};

export const language = <ILanguage>{
	defaultToken: '',
	tokenPostfix: '.sql',
	ignoreCase: true,

	brackets: [
		{ open: '[', close: ']', token: 'delimiter.square' },
		{ open: '(', close: ')', token: 'delimiter.parenthesis' }
	],

	keywords: [

	],
	operators: [
		"AND", "BETWEEN", "IN", "LIKE", "NOT", "OR","IS", "NULL", "INTERSECT", "UNION", "INNER", "JOIN", "LEFT", "OUTER", "RIGHT"
	],
	builtinFunctions: [

	],
	builtinVariables: [
		// NOT SUPPORTED
	],
	pseudoColumns: [
		// NOT SUPPORTED
	],
	tokenizer: {
		root: [
			{ include: '@comments' },
			{ include: '@whitespace' },
			{ include: '@pseudoColumns' },
			{ include: '@numbers' },
			{ include: '@strings' },
			{ include: '@complexIdentifiers' },
			{ include: '@scopes' },
			[/[;,.]/, 'delimiter'],
			[/[()]/, '@brackets'],
			[/[\w@#$]+/, {
				cases: {
					'@keywords': 'keyword',
					'@operators': 'operator',
					'@builtinVariables': 'predefined',
					'@builtinFunctions': 'predefined',
					'@default': 'identifier'
				}
			}],
			[/[<>=!%&+\-*/|~^]/, 'operator'],
		],
		whitespace: [
			[/\s+/, 'white']
		],
		comments: [
			[/--+.*/, 'comment'],
			[/#+.*/, 'comment'],
			[/\/\*/, { token: 'comment.quote', next: '@comment' }]
		],
		comment: [
			[/[^*/]+/, 'comment'],
			// Not supporting nested comments, as nested comments seem to not be standard?
			// i.e. http://stackoverflow.com/questions/728172/are-there-multiline-comment-delimiters-in-sql-that-are-vendor-agnostic
			// [/\/\*/, { token: 'comment.quote', next: '@push' }],    // nested comment not allowed :-(
			[/\*\//, { token: 'comment.quote', next: '@pop' }],
			[/./, 'comment']
		],
		pseudoColumns: [
			[/[$][A-Za-z_][\w@#$]*/, {
				cases: {
					'@pseudoColumns': 'predefined',
					'@default': 'identifier'
				}
			}],
		],
		numbers: [
			[/0[xX][0-9a-fA-F]*/, 'number'],
			[/[$][+-]*\d*(\.\d*)?/, 'number'],
			[/((\d+(\.\d*)?)|(\.\d+))([eE][\-+]?\d+)?/, 'number']
		],
		strings: [
			[/'/, { token: 'string', next: '@string' }],
			[/"/, { token: 'string', next: '@string' }]
		],
		string: [
			[/[^']+/, 'string'],
			[/[^"]+/, 'string'],
			[/''/, 'string'],
			[/""/, 'string'],
			[/'/, { token: 'string', next: '@pop' }],
			[/"/, { token: 'string', next: '@pop' }]
		],
		complexIdentifiers: [

			[/`/, { token: 'identifier.quote', next: '@quotedIdentifier' }]
		],
		quotedIdentifier: [
			[/[^`]+/, 'identifier'],
			[/``/, 'identifier'],
			[/`/, { token: 'identifier.quote', next: '@pop' }]
		],
		scopes: [
			// NOT SUPPORTED
		]
	}
};
