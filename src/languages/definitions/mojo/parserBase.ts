/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { languages } from '../../../editor';

// ParserBase::consumeIfSoftIdentifier() also accepts escaped identifiers.
// Reserved token kinds such as kw_var and kw_ref do not use this path.
export function softIdentifier(spellings: string): RegExp {
	return new RegExp('(?:(?:' + spellings + ')(?![a-zA-Z_0-9$])|`(?:' + spellings + ')`)');
}

export const parserBaseRules: languages.IMonarchLanguage['tokenizer'] = {
	// ParserBase.cpp: identifier consumption and indentation boundaries.
	// Here $S2 is the destination, $S3 the context, and $S4 the indentation.
	parseIdentifier: [
		[/[ \t]+/, 'white'],
		[/\\[ \t]*\n/, 'delimiter'],
		[/\n/, 'white', '@pop'],
		[
			/@identifier|@escapedIdentifier/,
			{
				cases: {
					'@keywords': { token: 'keyword', switchTo: '@$S2.$S3.$S4' },
					'@default': { token: 'identifier', switchTo: '@$S2.$S3.$S4' }
				}
			}
		],
		[/./, { token: '@rematch', switchTo: '@$S2.$S3.$S4' }]
	],
	skipUntilIndentation: [
		[/^([ \t]*)(#[^\r\n\f\v]*)/, ['white', 'comment']],
		[/^[ \t]*\n/, 'white'],
		[/^$S3[ \t]+/, 'white'],
		[/^/, { token: '@rematch', next: '@pop' }],
		[/[ \t\r\n\f\v\0]+/, 'white']
	],
	// Local Monarch helper shared by declaration and signature contexts.
	endDeclaration: [
		[/[)\]},;]/, { token: '@rematch', next: '@pop' }],
		[
			/:(?!=)|=(?!=)/,
			{
				cases: {
					'$S2==type': { token: '@rematch', next: '@pop' },
					'$0==:': { token: 'delimiter', next: '@pop' },
					'@default': { token: 'operator', next: '@pop' }
				}
			}
		]
	]
};

// Monarch scans one line at a time. A backslash suppresses the next line's
// indentation boundary in Lexer::lexToken(). These shared adapters
// provide that behavior without duplicating each upstream-aligned rule group.
// Every entry must name an existing state whose suffixes are .context.indentation.
const headers = [
	'parseConstraint',
	'parseConstraintOperand',
	'parseArgumentListAndEffects',
	'parseThrownType',
	'parseThrownTypeTail',
	'parseResultIfPresent',
	'parseResultType',
	'parseFunctionType',
	'parseLambda',
	'declarationHeader'
];

// Only two-element tuples with expanded @rematch/switchTo actions are rewritten.
// Current header rules use that form; expanded rules and three-element tuples
// would need explicit handling before they can participate in this adaptation.
function continuedBody(body: languages.IMonarchLanguageRule[]): languages.IMonarchLanguageRule[] {
	return body.map((rule) => {
		if (
			!Array.isArray(rule) ||
			rule.length !== 2 ||
			typeof rule[1] !== 'object' ||
			Array.isArray(rule[1])
		) {
			return rule;
		}
		const action = rule[1];
		if (action.token !== '@rematch' || !action.switchTo) {
			return rule;
		}
		const target = action.switchTo.slice(1).split('.')[0];
		return headers.indexOf(target) < 0
			? rule
			: [
					rule[0],
					{ ...action, switchTo: action.switchTo.replace(/^@[^.]+/, `@continued_${target}`) }
			  ];
	});
}
export function withLineContinuations(
	rules: languages.IMonarchLanguage['tokenizer']
): languages.IMonarchLanguage['tokenizer'] {
	const parserRules = { ...rules };
	for (const name of headers) {
		const body = parserRules[name];
		const continued = `continued_${name}`;
		parserRules[name] = [
			{ include: '@skipUntilIndentation' },
			[/\\[ \t]*\n/, { token: 'delimiter', switchTo: `@${continued}.$S2.$S3` }],
			{ include: '@skipComment' },
			...body
		];
		parserRules[continued] = [
			[/[ \t\r\f\v\0]+/, 'white'],
			[/\\[ \t]*\n/, 'delimiter'],
			[/\n/, { token: 'white', switchTo: `@${name}.$S2.$S3` }],
			{ include: '@skipComment' },
			...continuedBody(body)
		];
	}
	return parserRules;
}
