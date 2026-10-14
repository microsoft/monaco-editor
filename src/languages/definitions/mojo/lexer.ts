/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { languages } from '../../../editor';
import { keywords, punctuation } from './tokenKinds';

type Rules = languages.IMonarchLanguageRule[];

export const lexerAttributes = {
	keywords,
	identifier: /[a-zA-Z_][a-zA-Z_0-9$]*/,
	escapedIdentifier: /`[^`\r\n\f\v]+`/,
	tStringPrefix: /[rR][tT]|[tT][rR]|[tT]/,
	bmpCodePoint: /[0-9a-cA-Ce-fE-F][0-9a-fA-F]{3}|[dD][0-7][0-9a-fA-F]{2}/,
	unicodeCodePoint: /0000(?:@bmpCodePoint)|000[1-9a-fA-F][0-9a-fA-F]{4}|0010[0-9a-fA-F]{4}/,
	decimalInteger: /[1-9][0-9_]*|0[0_]*/,
	digitPart: /[0-9][0-9_]*/,
	pointFloat: /@decimalInteger\.(?:@digitPart)?|\.@digitPart/,
	exponent: /[eE][+-]?@digitPart/
};

function punctuationRules(): Rules {
	// Lexer::lexToken() switch order. Within one branch the longest spelling
	// wins unless C++ checks a disjoint alternative earlier.
	const branches = [
		'%',
		'&',
		'(',
		')',
		'*',
		'+',
		',',
		'-',
		'.',
		'/',
		':',
		';',
		'<',
		'=',
		'>',
		'@',
		'[',
		']',
		'^',
		'{',
		'|',
		'}',
		'~',
		'!'
	];
	// These branches test an assignment spelling before their repeated-symbol
	// lookahead. Preserve that source order even though the alternatives are disjoint.
	const lookaheadOrder: { [branch: string]: string[] | undefined } = {
		'*': ['*=', '**=', '**', '*'],
		'/': ['/=', '//=', '//', '/'],
		'>': ['>=', '>>=', '>>', '>']
	};
	const rules: Rules = [];
	for (const branch of branches) {
		if (branch === '.') {
			rules.push({ include: '@lexFloat' });
		}
		const order = lookaheadOrder[branch];
		const definitions = punctuation
			.filter(([, spelling]) => spelling[0] === branch)
			.sort((a, b) =>
				order ? order.indexOf(a[1]) - order.indexOf(b[1]) : b[1].length - a[1].length
			);
		for (const [name, spelling] of definitions) {
			const token = /^[lr]_(?:paren|square|brace)$/.test(name)
				? '@brackets'
				: /^(?:comma|dot|colon|semi|dot_dot_dot)$/.test(name)
				? 'delimiter'
				: 'operator';
			rules.push([new RegExp(spelling.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), token]);
		}
	}
	return rules;
}

// Rule groups follow Lexer.cpp's function order. Opening rules use forward
// includes, so a maintainer can compare this file with the release source.
export const lexerRules: languages.IMonarchLanguage['tokenizer'] = {
	lexToken: [
		{ include: '@lexWhitespace' },
		// Prefix dispatch in lexToken() precedes lexIdentifierOrKeyword().
		{ include: '@lexTString' },
		{ include: '@lexString' },
		{ include: '@lexIdentifierOrKeyword' },
		{ include: '@lexBacktickIdentifier' },
		...punctuationRules(),
		{ include: '@lexInteger' },
		{ include: '@skipComment' },
		// lexToken() diagnoses every unexpected character, including U+2028/U+2029.
		// JavaScript's dot does not match those Unicode separators.
		[/[\s\S]/, 'invalid']
	],
	// Local helper for the whitespace and backslash cases in lexToken().
	lexWhitespace: [
		[/[ \t\r\n\f\v\0]+/, 'white'],
		// lexToken() requires a newline; EOF is also tolerated for unfinished editor input.
		[/\\[ \t]*(?:\r?\n|$)/, 'delimiter']
	],
	lexIdentifierOrKeyword: [
		[
			/@identifier/,
			{
				cases: {
					'def|fn': { token: 'keyword', next: '@parseFunctionType.type.' },
					lambda: { token: 'keyword', next: '@parseLambda.lambda.' },
					'@keywords': 'keyword',
					'@default': 'identifier'
				}
			}
		]
	],
	lexBacktickIdentifier: [
		[/@escapedIdentifier/, 'identifier'],
		[/`[^`\r\n\f\v]*`?/, 'invalid']
	],
	skipComment: [[/#[^\r\n\f\v]*/, 'comment']],

	consumeQuoteDelimiter: [
		[/$S3/, 'string', '@pop'],
		[
			/\r?\n/,
			{
				cases: { '$S2==short': { token: 'string.invalid', next: '@pop' }, '@default': 'string' }
			}
		]
	],
	consumeUnicodeEscape: [
		[
			/\\(?:u(?:@bmpCodePoint)|U(?:@unicodeCodePoint))/,
			{
				cases: { '$S4~[rR][tT]?|[tT][rR]': 'string', '@default': 'string.escape' }
			}
		],
		[
			/\\(?:u[0-9a-fA-F]{0,4}|U[0-9a-fA-F]{0,8})/,
			{
				cases: { '$S4~[rR][tT]?|[tT][rR]': 'string', '@default': 'string.escape.invalid' }
			}
		]
	],
	consumeStringBody: [
		{ include: '@consumeStringEscape' },
		{ include: '@consumeQuoteDelimiter' },
		[/['"]/, 'string'],
		[/[^\\'"\r\n]+/, 'string']
	],
	// Local helper for the escape branch within consumeStringBody().
	consumeStringEscape: [
		[
			/\\(?:[0-7]{1,3}|x[0-9a-fA-F]{2})/,
			{
				cases: { '$S4~[rR][tT]?|[tT][rR]': 'string', '@default': 'string.escape' }
			}
		],
		[
			/\\x[0-9a-fA-F]{0,2}/,
			{
				cases: { '$S4~[rR][tT]?|[tT][rR]': 'string', '@default': 'string.escape.invalid' }
			}
		],
		{ include: '@consumeUnicodeEscape' },
		[
			/\\[\\'"\r\nabfnrtv]/,
			{
				cases: { '$S4~[rR][tT]?|[tT][rR]': 'string', '@default': 'string.escape' }
			}
		],
		[
			/\\./,
			{
				cases: {
					'$S4~[rR][tT]?|[tT][rR]': 'string',
					'$S1==skipTStringBody': 'string.escape',
					'@default': 'string.escape.invalid'
				}
			}
		]
	],
	lexString: [
		[/([rR]?)("""|''')/, { token: 'string', next: '@consumeStringBody.long.$2.$1' }],
		[/([rR]?)(['"])/, { token: 'string', next: '@consumeStringBody.short.$2.$1' }]
	],

	findTStringInterpolationEnd: [
		[/\{/, '@brackets', '@push'],
		[/\}/, '@brackets', '@pop'],
		{ include: '@root' }
	],
	skipTStringBody: [
		[/\{\{/, 'string.escape'],
		[/\{/, '@brackets', '@findTStringInterpolationEnd'],
		[/\}\}/, 'string.escape'],
		[/\}/, 'string'],
		// parseTStringFromSpelling() still interprets a brace after a literal
		// backslash, including in raw t-strings such as rt"C:\Users\{name}".
		[/\\(?=[{}])/, 'string'],
		{ include: '@consumeStringEscape' },
		{ include: '@consumeQuoteDelimiter' },
		[/['"]/, 'string'],
		[/[^\\'"{}\r\n]+/, 'string']
	],
	lexTString: [
		[/(@tStringPrefix)("""|''')/, { token: 'string', next: '@skipTStringBody.long.$2.$1' }],
		[/(@tStringPrefix)(['"])/, { token: 'string', next: '@skipTStringBody.short.$2.$1' }]
	],

	lexInteger: [
		[/0[bB]_*[01][01_]*/, 'number.binary'],
		[/0[bB]_*/, 'number.invalid'],
		[/0[oO]_*[0-7][0-7_]*/, 'number.octal'],
		[/0[oO]_*/, 'number.invalid'],
		[/0[xX]_*[0-9a-fA-F][0-9a-fA-F_]*/, 'number.hex'],
		[/0[xX]_*/, 'number.invalid'],
		[/0[1-9][0-9_]*/, 'number.invalid'],
		[/@decimalInteger/, 'number']
	],
	lexFloat: [
		[/(?:@pointFloat|@decimalInteger)[eE](?:[+-](?![0-9])|(?![0-9+-]))/, 'number.invalid'],
		[/@pointFloat(?:@exponent)?/, 'number.float'],
		[/@decimalInteger@exponent/, 'number.float']
	]
};
