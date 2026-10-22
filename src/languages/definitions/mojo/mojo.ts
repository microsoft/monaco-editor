/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { languages } from '../../../editor';
import { lexerAttributes, lexerRules } from './lexer';
import { parserBaseRules, withLineContinuations } from './parserBase';
import { expressionAttributes, expressionRules } from './parserExprs';
import { statementRules } from './parserStmts';
import { signatureRules } from './signatures';

// See AGENTS.md for the release pin, source order, and state mapping.
export const conf: languages.LanguageConfiguration = {
	comments: { lineComment: '#' },
	brackets: [
		['(', ')'],
		['[', ']'],
		['{', '}']
	],
	autoClosingPairs: [
		{ open: '(', close: ')' },
		{ open: '[', close: ']' },
		{ open: '{', close: '}' },
		{ open: '"', close: '"', notIn: ['string', 'comment'] },
		{ open: "'", close: "'", notIn: ['string', 'comment'] },
		{ open: '`', close: '`', notIn: ['string', 'comment'] }
	],
	onEnterRules: [
		{
			// Lexer::lexBacktickIdentifier() allows # and quotes inside escaped names.
			beforeText:
				/^[ \t]*(?:(?:async[ \t]+)?(?:def|fn|struct|trait|class|__extension|__mlir_region|__match|if|elif|else|while|for|try|except|finally|with|case)(?![\w$])|comptime[ \t]+(?:if|elif|else|for)(?![\w$])|[)\]}])(?:[^#'"`\r\n]|`[^`\r\n\f\v]+`|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')*:[ \t]*(?:#.*)?$/,
			action: { indentAction: languages.IndentAction.Indent }
		}
	],
	folding: { offSide: true }
};

export const language: languages.IMonarchLanguage = {
	// The lexer must see line endings to recover short strings in unfinished code.
	includeLF: true,
	...lexerAttributes,
	...expressionAttributes,
	tokenizer: {
		root: [{ include: '@parseStmt' }, { include: '@lexToken' }],
		...lexerRules,
		...withLineContinuations({
			...parserBaseRules,
			...signatureRules,
			...expressionRules,
			...statementRules
		})
	}
};
