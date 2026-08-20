/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as ts from './lib/typescriptServices';
import type { Diagnostic, DiagnosticRelatedInformation } from './monaco.contribution';

const sanitizeMessageText = (
	messageText: string | ts.DiagnosticMessageChain
): DiagnosticRelatedInformation['messageText'] => {
	if (typeof messageText === 'string') {
		return messageText;
	}
	return {
		messageText: messageText.messageText,
		category: messageText.category,
		code: messageText.code,
		next: messageText.next?.map(sanitizeMessageTextChain)
	};
};

const sanitizeMessageTextChain = (
	messageText: ts.DiagnosticMessageChain
): Exclude<DiagnosticRelatedInformation['messageText'], string> => ({
	messageText: messageText.messageText,
	category: messageText.category,
	code: messageText.code,
	next: messageText.next?.map(sanitizeMessageTextChain)
});

const sanitizeRelatedInformation = (
	diagnostic: ts.DiagnosticRelatedInformation
): DiagnosticRelatedInformation => ({
	category: diagnostic.category,
	code: diagnostic.code,
	file: diagnostic.file ? { fileName: diagnostic.file.fileName } : undefined,
	start: diagnostic.start,
	length: diagnostic.length,
	messageText: sanitizeMessageText(diagnostic.messageText)
});

export const sanitizeDiagnostics = (diagnostics: readonly ts.Diagnostic[]): Diagnostic[] =>
	diagnostics.map((diagnostic) => ({
		...sanitizeRelatedInformation(diagnostic),
		reportsUnnecessary: diagnostic.reportsUnnecessary,
		reportsDeprecated: diagnostic.reportsDeprecated,
		source: diagnostic.source,
		relatedInformation: diagnostic.relatedInformation?.map(sanitizeRelatedInformation)
	}));
