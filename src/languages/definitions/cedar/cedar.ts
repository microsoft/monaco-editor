/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { languages } from '../../../editor';

export const conf: languages.LanguageConfiguration = {
	comments: {
		lineComment: '//'
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
		{ open: '"', close: '"', notIn: ['string'] }
	],
	surroundingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"' }
	]
};

export const language = <languages.IMonarchLanguage>{
	defaultToken: '',
	tokenPostfix: '.cedar',

	// sections + keywords from TextMate grammar
	keywords: ['permit', 'forbid', 'when', 'unless', 'in', 'has', 'like', 'if', 'then', 'else', 'is'],

	// principal, action, resource, context
	constants: ['principal', 'action', 'resource', 'context'],

	// true, false
	booleans: ['true', 'false'],

	// extension functions
	functions: ['ip', 'decimal', 'datetime', 'duration'],

	// all methods (methods + ipmethods + decimalmethods + datetimemethods + durationmethods)
	methods: [
		'contains',
		'containsAll',
		'containsAny',
		'isEmpty',
		'getTag',
		'hasTag',
		'isIpv4',
		'isIpv6',
		'isLoopback',
		'isMulticast',
		'isInRange',
		'lessThan',
		'lessThanOrEqual',
		'greaterThan',
		'greaterThanOrEqual',
		'offset',
		'durationSince',
		'toDate',
		'toTime',
		'toMilliseconds',
		'toSeconds',
		'toMinutes',
		'toHours',
		'toDays'
	],

	symbols: /[=!<>|&+\-*\/]+/,

	tokenizer: {
		root: [
			// comments
			[/\/\/.*$/, 'comment'],

			// annotations: @name(
			[/@[_a-zA-Z][_a-zA-Z0-9]*(?=\()/, 'annotation'],

			// ?principal, ?resource
			[/\?(?:principal|resource)\b/, 'variable'],

			// method calls: .methodName(
			[
				/\.([a-zA-Z][a-zA-Z0-9]*)(?=\()/,
				{
					cases: {
						'$1@methods': 'keyword.function',
						'@default': 'identifier'
					}
				}
			],

			// extension functions: ip(, decimal(, datetime(, duration(
			[
				/[a-z][a-zA-Z0-9]*(?=\()/,
				{
					cases: {
						'@functions': 'keyword.function',
						'@default': 'identifier'
					}
				}
			],

			// entity type references with :: before a string: Namespace::Type::
			[
				/[_a-zA-Z][_a-zA-Z0-9]*(?:::[_a-zA-Z][_a-zA-Z0-9]*)*(?=::(?="))/,
				'type.identifier'
			],

			// namespaced types: Namespace::Type
			[
				/[_a-zA-Z][_a-zA-Z0-9]*(?:::[_a-zA-Z][_a-zA-Z0-9]*)+/,
				'type.identifier'
			],

			// identifiers, keywords, constants, booleans
			[
				/[_a-zA-Z][_a-zA-Z0-9]*/,
				{
					cases: {
						'@keywords': 'keyword',
						'@constants': 'variable',
						'@booleans': 'constant',
						'@default': 'identifier'
					}
				}
			],

			// integers
			[/[1-9][0-9]*|0/, 'number'],

			// whitespace
			[/[ \t\r\n]+/, ''],

			// brackets
			[/[{}()\[\]]/, '@brackets'],

			// operators
			[/@symbols/, 'operator'],

			// strings
			[/"([^"\\]|\\.)*$/, 'string.invalid'],
			[/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],

			// delimiters
			[/[;,.]/, 'delimiter']
		],

		string: [
			[/[^\\"]+/, 'string'],
			[/\\./, 'string.escape'],
			[/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
		]
	}
};
