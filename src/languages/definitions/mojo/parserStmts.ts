/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { languages } from '../../../editor';

export const statementRules: languages.IMonarchLanguage['tokenizer'] = {
	// ParserStmts.cpp: declarations are recognized before root whitespace so
	// their original indentation is available to the Monarch header states.
	// ParserBase::parseDecorators() is defined before StmtParser::parseStmt().
	parseDecorators: [[/^([ \t]*)(@[a-zA-Z_][a-zA-Z_0-9$]*)/, ['white', 'tag']]],
	parseStmt: [
		{ include: '@parseDecorators' },
		{ include: '@parseDefFnStmt' },
		// parseStructStmt(), parseTraitStmt(), parseExtensionStmt(), parseClassStmt()
		[
			/^([ \t]*)(struct|trait|__extension|class)(?![a-zA-Z_0-9$])/,
			['white', { token: 'keyword', next: '@parseIdentifier.declarationHeader.decl.$1' }]
		],
		// parseComptimeCompoundStmt() dispatches both control flow and aliases.
		[
			/^([ \t]*)(comptime)(?![a-zA-Z_0-9$])/,
			['white', { token: 'keyword', next: '@parseComptimeCompoundStmt.decl.$1' }]
		]
	],
	parseComptimeCompoundStmt: [
		[/[ \t]+/, 'white'],
		[/\\[ \t]*\n/, 'delimiter'],
		[/\n/, 'white', '@pop'],
		// assert/if/for follow upstream dispatch; elif/else are recovery exits.
		// The fallback highlights a declaration header without validating the statement.
		[/(?=(?:assert|if|for|elif|else)(?![a-zA-Z_0-9$]))/, { token: '@rematch', next: '@pop' }],
		[/./, { token: '@rematch', switchTo: '@parseIdentifier.declarationHeader.$S2.$S3' }]
	],
	// StmtParser::parseDefFnStmt(), following the comptime dispatcher.
	parseDefFnStmt: [
		[
			/^([ \t]*)(async)([ \t]+)(def|fn)(?=[ \t]+(?:@identifier|@escapedIdentifier))/,
			[
				'white',
				'keyword',
				'white',
				{ token: 'keyword', next: '@parseIdentifier.parseFunctionType.decl.$1' }
			]
		],
		[
			/^([ \t]*)(def|fn)(?=[ \t]+(?:@identifier|@escapedIdentifier))/,
			['white', { token: 'keyword', next: '@parseIdentifier.parseFunctionType.decl.$1' }]
		]
	],
	// Local shared header adapter for value/type aliases, structs, traits,
	// extensions, and classes. It is not a same-named upstream parser routine.
	declarationHeader: [
		[/[([]/, '@brackets', '@parseExpressionList'],
		{ include: '@parseTrailingConstraintsIfPresent' },
		{ include: '@endDeclaration' },
		{ include: '@lexToken' }
	]
};
