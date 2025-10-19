/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as ts from '../../lib/typescriptServices';
import { EmitOutput, Diagnostic } from '../../monaco.contribution';
import { fileNameIsLib } from './scriptHost';

export class EmitModule {
	private _languageService: ts.LanguageService;

	constructor(languageService: ts.LanguageService) {
		this._languageService = languageService;
	}

	async getEmitOutput(
		fileName: string,
		emitOnlyDtsFiles?: boolean,
		forceDtsEmit?: boolean
	): Promise<EmitOutput> {
		if (fileNameIsLib(fileName)) {
			return { outputFiles: [], emitSkipped: true };
		}
		// The diagnostics property is internal, returning it without clearing breaks message serialization.
		const emitOutput = this._languageService.getEmitOutput(
			fileName,
			emitOnlyDtsFiles,
			forceDtsEmit
		) as ts.EmitOutput & {
			diagnostics?: ts.Diagnostic[];
		};
		const diagnostics = emitOutput.diagnostics
			? this.clearFiles(emitOutput.diagnostics)
			: undefined;
		return { ...emitOutput, diagnostics };
	}

	private clearFiles(tsDiagnostics: ts.Diagnostic[]): Diagnostic[] {
		// Clear the `file` field, which cannot be JSON'yfied because it
		// contains cyclic data structures, except for the `fileName`
		// property.
		// Do a deep clone so we don't mutate the ts.Diagnostic object (see https://github.com/microsoft/monaco-editor/issues/2392)
		const diagnostics: Diagnostic[] = [];
		for (const tsDiagnostic of tsDiagnostics) {
			const diagnostic: Diagnostic = { ...tsDiagnostic };
			diagnostic.file = diagnostic.file ? { fileName: diagnostic.file.fileName } : undefined;
			diagnostics.push(diagnostic);
		}
		return diagnostics;
	}
}
