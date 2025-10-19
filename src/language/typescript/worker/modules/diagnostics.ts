/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as ts from '../../lib/typescriptServices';
import { Diagnostic, DiagnosticRelatedInformation } from '../../monaco.contribution';
import { fileNameIsLib } from './scriptHost';

export class DiagnosticsModule {
	private _languageService: ts.LanguageService;

	constructor(languageService: ts.LanguageService) {
		this._languageService = languageService;
	}

	private static clearFiles(tsDiagnostics: ts.Diagnostic[]): Diagnostic[] {
		// Clear the `file` field, which cannot be JSON'yfied because it
		// contains cyclic data structures, except for the `fileName`
		// property.
		// Do a deep clone so we don't mutate the ts.Diagnostic object (see https://github.com/microsoft/monaco-editor/issues/2392)
		const diagnostics: Diagnostic[] = [];
		for (const tsDiagnostic of tsDiagnostics) {
			const diagnostic: Diagnostic = { ...tsDiagnostic };
			diagnostic.file = diagnostic.file ? { fileName: diagnostic.file.fileName } : undefined;
			if (tsDiagnostic.relatedInformation) {
				diagnostic.relatedInformation = [];
				for (const tsRelatedDiagnostic of tsDiagnostic.relatedInformation) {
					const relatedDiagnostic: DiagnosticRelatedInformation = { ...tsRelatedDiagnostic };
					relatedDiagnostic.file = relatedDiagnostic.file
						? { fileName: relatedDiagnostic.file.fileName }
						: undefined;
					diagnostic.relatedInformation.push(relatedDiagnostic);
				}
			}
			diagnostics.push(diagnostic);
		}
		return diagnostics;
	}

	async getSyntacticDiagnostics(fileName: string): Promise<Diagnostic[]> {
		if (fileNameIsLib(fileName)) {
			return [];
		}
		const diagnostics = this._languageService.getSyntacticDiagnostics(fileName);
		return DiagnosticsModule.clearFiles(diagnostics);
	}

	async getSemanticDiagnostics(fileName: string): Promise<Diagnostic[]> {
		if (fileNameIsLib(fileName)) {
			return [];
		}
		const diagnostics = this._languageService.getSemanticDiagnostics(fileName);
		return DiagnosticsModule.clearFiles(diagnostics);
	}

	async getSuggestionDiagnostics(fileName: string): Promise<Diagnostic[]> {
		if (fileNameIsLib(fileName)) {
			return [];
		}
		const diagnostics = this._languageService.getSuggestionDiagnostics(fileName);
		return DiagnosticsModule.clearFiles(diagnostics);
	}

	async getCompilerOptionsDiagnostics(fileName: string): Promise<Diagnostic[]> {
		if (fileNameIsLib(fileName)) {
			return [];
		}
		const diagnostics = this._languageService.getCompilerOptionsDiagnostics();
		return DiagnosticsModule.clearFiles(diagnostics);
	}
}
