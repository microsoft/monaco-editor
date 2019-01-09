/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import * as ts from './lib/typescriptServices';
import { lib_dts, lib_es6_dts } from './lib/lib';

import IWorkerContext = monaco.worker.IWorkerContext;

const DEFAULT_LIB = {
	NAME: 'defaultLib:lib.d.ts',
	CONTENTS: lib_dts
};

const ES6_LIB = {
	NAME: 'defaultLib:lib.es6.d.ts',
	CONTENTS: lib_es6_dts
};

export class TypeScriptWorker implements ts.LanguageServiceHost {

	// --- model sync -----------------------

	private _ctx: IWorkerContext;
	private _extraLibs: { [fileName: string]: string } = Object.create(null);
	private _languageService = ts.createLanguageService(this);
	private _compilerOptions: ts.CompilerOptions;

	constructor(ctx: IWorkerContext, createData: ICreateData) {
		this._ctx = ctx;
		this._compilerOptions = createData.compilerOptions;
		this._extraLibs = createData.extraLibs;
	}

	// --- language service host ---------------

	getCompilationSettings(): ts.CompilerOptions {
		return this._compilerOptions;
	}

	getScriptFileNames(): string[] {
		let models = this._ctx.getMirrorModels().map(model => model.uri.toString());
		return models.concat(Object.keys(this._extraLibs));
	}

	private _getModel(fileName: string): monaco.worker.IMirrorModel {
		let models = this._ctx.getMirrorModels();
		for (let i = 0; i < models.length; i++) {
			if (models[i].uri.toString() === fileName) {
				return models[i];
			}
		}
		return null;
	}

	getScriptVersion(fileName: string): string {
		let model = this._getModel(fileName);
		if (model) {
			return model.version.toString();
		} else if (this.isDefaultLibFileName(fileName) || fileName in this._extraLibs) {
			// extra lib and default lib are static
			return '1';
		}
	}

	getScriptSnapshot(fileName: string): ts.IScriptSnapshot {
		let text: string;
		let model = this._getModel(fileName);
		if (model) {
			// a true editor model
			text = model.getValue();

		} else if (fileName in this._extraLibs) {
			// static extra lib
			text = this._extraLibs[fileName];

		} else if (fileName === DEFAULT_LIB.NAME) {
			text = DEFAULT_LIB.CONTENTS;
		} else if (fileName === ES6_LIB.NAME) {
			text = ES6_LIB.CONTENTS;
		} else {
			return;
		}

		return <ts.IScriptSnapshot>{
			getText: (start, end) => text.substring(start, end),
			getLength: () => text.length,
			getChangeRange: () => undefined
		};
	}

	getScriptKind?(fileName: string): ts.ScriptKind {
		const suffix = fileName.substr(fileName.lastIndexOf('.') + 1);
		switch (suffix) {
			case 'ts': return ts.ScriptKind.TS;
			case 'tsx': return ts.ScriptKind.TSX;
			case 'js': return ts.ScriptKind.JS;
			case 'jsx': return ts.ScriptKind.JSX;
			default: return this.getCompilationSettings().allowJs
				? ts.ScriptKind.JS
				: ts.ScriptKind.TS;
		}
	}

	getCurrentDirectory(): string {
		return '';
	}

	getDefaultLibFileName(options: ts.CompilerOptions): string {
		// TODO@joh support lib.es7.d.ts
		return options.target <= ts.ScriptTarget.ES5 ? DEFAULT_LIB.NAME : ES6_LIB.NAME;
	}

	isDefaultLibFileName(fileName: string): boolean {
		return fileName === this.getDefaultLibFileName(this._compilerOptions);
	}

	// --- language features

	private static clearFiles(diagnostics: ts.Diagnostic[]) {
		// Clear the `file` field, which cannot be JSON'yfied because it
		// contains cyclic data structures.
		diagnostics.forEach(diag => {
			diag.file = undefined;
			const related = <ts.Diagnostic[]>diag.relatedInformation;
			if (related) {
				related.forEach(diag2 => diag2.file = undefined);
			}
		});
	}

	getSyntacticDiagnostics(fileName: string): Promise<ts.Diagnostic[]> {
		const diagnostics = this._languageService.getSyntacticDiagnostics(fileName);
		TypeScriptWorker.clearFiles(diagnostics);
		return Promise.resolve(diagnostics);
	}

	getSemanticDiagnostics(fileName: string): Promise<ts.Diagnostic[]> {
		const diagnostics = this._languageService.getSemanticDiagnostics(fileName);
		TypeScriptWorker.clearFiles(diagnostics);
		return Promise.resolve(diagnostics);
	}

	getCompilerOptionsDiagnostics(fileName: string): Promise<ts.Diagnostic[]> {
		const diagnostics = this._languageService.getCompilerOptionsDiagnostics();
		TypeScriptWorker.clearFiles(diagnostics);
		return Promise.resolve(diagnostics);
	}

	getCompletionsAtPosition(fileName: string, position: number): Promise<ts.CompletionInfo> {
		return Promise.resolve(this._languageService.getCompletionsAtPosition(fileName, position, undefined));
	}

	getCompletionEntryDetails(fileName: string, position: number, entry: string): Promise<ts.CompletionEntryDetails> {
		return Promise.resolve(this._languageService.getCompletionEntryDetails(fileName, position, entry, undefined, undefined, undefined));
	}

	getSignatureHelpItems(fileName: string, position: number): Promise<ts.SignatureHelpItems> {
		return Promise.resolve(this._languageService.getSignatureHelpItems(fileName, position, undefined));
	}

	getQuickInfoAtPosition(fileName: string, position: number): Promise<ts.QuickInfo> {
		return Promise.resolve(this._languageService.getQuickInfoAtPosition(fileName, position));
	}

	getOccurrencesAtPosition(fileName: string, position: number): Promise<ReadonlyArray<ts.ReferenceEntry>> {
		return Promise.resolve(this._languageService.getOccurrencesAtPosition(fileName, position));
	}

	getDefinitionAtPosition(fileName: string, position: number): Promise<ReadonlyArray<ts.DefinitionInfo>> {
		return Promise.resolve(this._languageService.getDefinitionAtPosition(fileName, position));
	}

	getReferencesAtPosition(fileName: string, position: number): Promise<ts.ReferenceEntry[]> {
		return Promise.resolve(this._languageService.getReferencesAtPosition(fileName, position));
	}

	getNavigationBarItems(fileName: string): Promise<ts.NavigationBarItem[]> {
		return Promise.resolve(this._languageService.getNavigationBarItems(fileName));
	}

	getFormattingEditsForDocument(fileName: string, options: ts.FormatCodeOptions): Promise<ts.TextChange[]> {
		return Promise.resolve(this._languageService.getFormattingEditsForDocument(fileName, options));
	}

	getFormattingEditsForRange(fileName: string, start: number, end: number, options: ts.FormatCodeOptions): Promise<ts.TextChange[]> {
		return Promise.resolve(this._languageService.getFormattingEditsForRange(fileName, start, end, options));
	}

	getFormattingEditsAfterKeystroke(fileName: string, postion: number, ch: string, options: ts.FormatCodeOptions): Promise<ts.TextChange[]> {
		return Promise.resolve(this._languageService.getFormattingEditsAfterKeystroke(fileName, postion, ch, options));
	}

	getEmitOutput(fileName: string): Promise<ts.EmitOutput> {
		return Promise.resolve(this._languageService.getEmitOutput(fileName));
	}
}

export interface ICreateData {
	compilerOptions: ts.CompilerOptions;
	extraLibs: { [path: string]: string };
}

export function create(ctx: IWorkerContext, createData: ICreateData): TypeScriptWorker {
	return new TypeScriptWorker(ctx, createData);
}
