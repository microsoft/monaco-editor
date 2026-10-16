/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { languages } from '../../../editor';

// Local recognizer for symbolic operator boundaries, including incomplete code.
// This is not InfixInfo::get()'s precedence or validity classification.
// Multi-character spellings precede overlapping single-character alternatives.
export const expressionAttributes = {
	binaryOperator: /\*\*|\/\/|<<|>>|!=|<=|<>|==|>=|[-+*\/%@&|^<>]/
};

export const expressionRules: languages.IMonarchLanguage['tokenizer'] = {
	// ParserExprs.cpp: parseFunctionType(), then parseLambda(). Both use shared
	// parameter and signature routines. Upstream handles function-type capture
	// origins directly; lambdas use ParsedCaptureList::parseCaptureList().
	parseFunctionType: [
		[/\[/, '@brackets', '@parseParametersIfPresent'],
		[/./, { token: '@rematch', switchTo: '@parseArgumentListAndEffects.$S2.$S3' }]
	],
	parseLambda: [
		[/\[/, '@brackets', '@parseParametersIfPresent'],
		[/./, { token: '@rematch', switchTo: '@parseArgumentListAndEffects.$S2.$S3' }]
	],

	// ParserBase::parseExpressionList() is implemented in ParserExprs.cpp.
	// This Monarch helper balances delimiters without constructing expressions.
	parseExpressionList: [
		[/[([{]/, '@brackets', '@push'],
		[/[)\]}]/, '@brackets', '@pop'],
		{ include: '@root' }
	]
};
