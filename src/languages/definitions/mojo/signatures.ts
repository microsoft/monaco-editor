/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { languages } from '../../../editor';

import { softIdentifier } from './parserBase';

// Header state suffixes are .context.indentation; context is decl, type, or lambda.
export const signatureRules: languages.IMonarchLanguage['tokenizer'] = {
	// Signatures.cpp: ParsedArgument::parse(), then parseArgOrParamList().
	parseArgument: [
		{ include: '@lexWhitespace' },
		{ include: '@skipComment' },
		[/\)/, '@brackets', '@pop'],
		[/,/, 'delimiter'],
		[
			new RegExp(
				'(?:var|ref)(?![a-zA-Z_0-9$])|' + softIdentifier('out|mut|imm|read|deinit').source
			),
			{
				token: 'keyword',
				switchTo: '@parseArgumentTail'
			}
		],
		[/./, { token: '@rematch', switchTo: '@parseArgumentTail' }]
	],
	parseArgumentTail: [
		[/\)/, '@brackets', '@pop'],
		[/,/, { token: 'delimiter', switchTo: '@parseArgOrParamList' }],
		[/[([{]/, '@brackets', '@parseExpressionList'],
		{ include: '@root' }
	],
	parseArgOrParamList: [{ include: '@parseArgument' }],

	// ParsedConstraint::parse(). The operand context keeps a variable named
	// "where" ordinary, while a subsequent clause starts a new constraint.
	parseConstraint: [
		[/(\.)(@identifier|@escapedIdentifier)/, ['delimiter', 'identifier']],
		[/[([{]/, '@brackets', '@parseExpressionList'],
		[softIdentifier('where'), { token: 'keyword', switchTo: '@parseConstraintOperand.$S2.$S3' }],
		{ include: '@endDeclaration' },
		[
			/(?:and|or|not|is|in|if|else)(?![a-zA-Z_0-9$])/,
			{
				token: 'keyword',
				switchTo: '@parseConstraintOperand.$S2.$S3'
			}
		],
		[/@binaryOperator/, { token: 'operator', switchTo: '@parseConstraintOperand.$S2.$S3' }],
		{ include: '@lexToken' }
	],
	parseConstraintOperand: [
		[/(?:not|in)(?![a-zA-Z_0-9$])/, 'keyword'],
		[/[-+~]/, 'operator'],
		[/(?:def|fn)(?![a-zA-Z_0-9$])/, { token: '@rematch', switchTo: '@parseConstraint.$S2.$S3' }],
		[
			/@identifier|@escapedIdentifier/,
			{
				cases: {
					'@keywords': { token: 'keyword', switchTo: '@parseConstraint.$S2.$S3' },
					'@default': { token: 'identifier', switchTo: '@parseConstraint.$S2.$S3' }
				}
			}
		],
		[/./, { token: '@rematch', switchTo: '@parseConstraint.$S2.$S3' }]
	],
	// ParsedParamList::parseParametersIfPresent(): no argument conventions.
	parseParametersIfPresent: [{ include: '@parseExpressionList' }],
	parseTrailingConstraintsIfPresent: [
		[softIdentifier('where'), { token: 'keyword', switchTo: '@parseConstraintOperand.$S2.$S3' }]
	],
	// ParsedCaptureList::parseCaptureList(). A bare convention is a default.
	parseCaptureList: [
		{ include: '@lexWhitespace' },
		{ include: '@skipComment' },
		[/\}/, '@brackets', '@pop'],
		[/,/, 'delimiter'],
		[
			new RegExp(
				'var(?![a-zA-Z_0-9$])|' + softIdentifier('mut|imm|read').source + '|ref(?![a-zA-Z_0-9$])'
			),
			{ token: 'keyword', switchTo: '@parseCaptureTail' }
		],
		[/./, { token: '@rematch', switchTo: '@parseCaptureTail' }]
	],
	parseCaptureTail: [
		[/\}/, '@brackets', '@pop'],
		[/,/, { token: 'delimiter', switchTo: '@parseCaptureList' }],
		{ include: '@lexToken' }
	],
	// ParsedArgumentList::parseArgumentListAndEffects(). Preserve even the
	// spellings which upstream recognizes only to diagnose their removal.
	parseArgumentListAndEffects: [
		[/\(/, '@brackets', '@parseArgOrParamList'],
		[/\[/, '@brackets', '@parseExpressionList'],
		[softIdentifier('raises'), { token: 'keyword', switchTo: '@parseThrownType.$S2.$S3' }],
		[softIdentifier('capturing|escaping|thin|__param_trait__|register_passable|abi'), 'keyword'],
		{ include: '@parseTrailingConstraintsIfPresent' },
		[/\{/, '@brackets', '@parseCaptureList'],
		[/->/, { token: 'operator', switchTo: '@parseResultIfPresent.$S2.$S3' }],
		{ include: '@endDeclaration' },
		[
			/[&|]/,
			{ cases: { '$S2==type': { token: '@rematch', next: '@pop' }, '@default': 'operator' } }
		],
		{ include: '@lexToken' }
	],
	parseThrownType: [
		[
			new RegExp(
				'(?=' +
					softIdentifier(
						'raises|capturing|escaping|thin|register_passable|abi|where|__param_trait__'
					).source +
					'|\\{|->|:)'
			),
			{
				token: '@rematch',
				switchTo: '@parseArgumentListAndEffects.$S2.$S3'
			}
		],
		[
			/@identifier|@escapedIdentifier/,
			{
				cases: {
					'@keywords': { token: 'keyword', switchTo: '@parseThrownTypeTail.$S2.$S3' },
					'@default': { token: 'identifier', switchTo: '@parseThrownTypeTail.$S2.$S3' }
				}
			}
		],
		[/./, { token: '@rematch', switchTo: '@parseThrownTypeTail.$S2.$S3' }]
	],
	parseThrownTypeTail: [
		[/(\.)(@identifier|@escapedIdentifier)/, ['delimiter', 'identifier']],
		[/[([]/, '@brackets', '@parseExpressionList'],
		[/./, { token: '@rematch', switchTo: '@parseArgumentListAndEffects.$S2.$S3' }]
	],
	// ParsedArgumentList::parseResultIfPresent(). A first identifier named
	// "raises" or "where" is a result type, not an effect or constraint.
	parseResultIfPresent: [
		[/ref(?![a-zA-Z_0-9$])/, 'keyword'],
		[/\[/, '@brackets', '@parseExpressionList'],
		[/[-+~*]/, 'operator'],
		[
			/(?:async|def|fn)(?![a-zA-Z_0-9$])/,
			{ token: '@rematch', switchTo: '@parseResultType.$S2.$S3' }
		],
		[
			/@identifier|@escapedIdentifier/,
			{
				cases: {
					'@keywords': { token: 'keyword', switchTo: '@parseResultType.$S2.$S3' },
					'@default': { token: 'identifier', switchTo: '@parseResultType.$S2.$S3' }
				}
			}
		],
		[/./, { token: '@rematch', switchTo: '@parseResultType.$S2.$S3' }]
	],
	parseResultType: [
		[/(\.)(@identifier|@escapedIdentifier)/, ['delimiter', 'identifier']],
		[/[([{]/, '@brackets', '@parseExpressionList'],
		{ include: '@parseTrailingConstraintsIfPresent' },
		{ include: '@endDeclaration' },
		[/@binaryOperator/, { token: 'operator', switchTo: '@parseResultIfPresent.$S2.$S3' }],
		{ include: '@lexToken' }
	]
};
