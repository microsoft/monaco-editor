/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import * as ts from './lib/typescriptServices';
import { lib_es5_dts, lib_es2015_bundled_dts } from './lib/lib';
import { IExtraLibs } from './monaco.contribution';

import IWorkerContext = monaco.worker.IWorkerContext;

const DEFAULT_ES5_LIB = {
	NAME: 'defaultLib:lib.d.ts',
	CONTENTS: lib_es5_dts
};

const ES2015_LIB = {
	NAME: 'defaultLib:lib.es2015.d.ts',
	CONTENTS: lib_es2015_bundled_dts
};

export class TypeScriptWorker implements ts.LanguageServiceHost, monaco.languages.typescript.TypeScriptWorker {

	// --- model sync -----------------------

	private _ctx: IWorkerContext;
	private _extraLibs: IExtraLibs = Object.create(null);
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

	private _getModel(fileName: string): monaco.worker.IMirrorModel | null {
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
		} else if (this.isDefaultLibFileName(fileName)) {
			// default lib is static
			return '1';
		} else if (fileName in this._extraLibs) {
			return String(this._extraLibs[fileName].version);
		}
		return '';
	}

	getScriptText(fileName: string): Promise<string | undefined> {
		return Promise.resolve(this._getScriptText(fileName));
	}

	_getScriptText(fileName: string): string | undefined {
		let text: string;
		let model = this._getModel(fileName);
		if (model) {
			// a true editor model
			text = model.getValue();

		} else if (fileName in this._extraLibs) {
			// extra lib
			text = this._extraLibs[fileName].content;

		} else if (fileName === DEFAULT_ES5_LIB.NAME) {
			text = DEFAULT_ES5_LIB.CONTENTS;
		} else if (fileName === ES2015_LIB.NAME) {
			text = ES2015_LIB.CONTENTS;
		} else {
			return;
		}

		return text;
	}

	getScriptSnapshot(fileName: string): ts.IScriptSnapshot | undefined {
		const text = this._getScriptText(fileName);
		if (text === undefined) {
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
		return (options.target || ts.ScriptTarget.ES2015) < ts.ScriptTarget.ES2015 ? DEFAULT_ES5_LIB.NAME : ES2015_LIB.NAME;
	}

	isDefaultLibFileName(fileName: string): boolean {
		return fileName === this.getDefaultLibFileName(this._compilerOptions);
	}

	// --- language features

	private static clearFiles(diagnostics: ts.Diagnostic[]): monaco.languages.typescript.Diagnostic[] {
		// Clear the `file` field, which cannot be JSON'yfied because it
		// contains cyclic data structures.
		diagnostics.forEach(diag => {
			diag.file = undefined;
			const related = <ts.Diagnostic[]>diag.relatedInformation;
			if (related) {
				related.forEach(diag2 => diag2.file = undefined);
			}
		});
		return <monaco.languages.typescript.Diagnostic[]>diagnostics;
	}

	getSyntacticDiagnostics(fileName: string): Promise<monaco.languages.typescript.Diagnostic[]> {
		const diagnostics = this._languageService.getSyntacticDiagnostics(fileName);
		return Promise.resolve(TypeScriptWorker.clearFiles(diagnostics));
	}

	getSemanticDiagnostics(fileName: string): Promise<monaco.languages.typescript.Diagnostic[]> {
		const diagnostics = this._languageService.getSemanticDiagnostics(fileName);
		return Promise.resolve(TypeScriptWorker.clearFiles(diagnostics));
	}

	getSuggestionDiagnostics(fileName: string): Promise<monaco.languages.typescript.Diagnostic[]> {
		const diagnostics = this._languageService.getSuggestionDiagnostics(fileName);
		return Promise.resolve(TypeScriptWorker.clearFiles(diagnostics));
	}

	getCompilerOptionsDiagnostics(fileName: string): Promise<monaco.languages.typescript.Diagnostic[]> {
		const diagnostics = this._languageService.getCompilerOptionsDiagnostics();
		return Promise.resolve(TypeScriptWorker.clearFiles(diagnostics));
	}

	getCompletionsAtPosition(fileName: string, position: number): Promise<ts.CompletionInfo | undefined> {
		return Promise.resolve(this._languageService.getCompletionsAtPosition(fileName, position, undefined));
	}

	getCompletionEntryDetails(fileName: string, position: number, entry: string): Promise<ts.CompletionEntryDetails | undefined> {
		return Promise.resolve(this._languageService.getCompletionEntryDetails(fileName, position, entry, undefined, undefined, undefined));
	}

	getSignatureHelpItems(fileName: string, position: number): Promise<ts.SignatureHelpItems | undefined> {
		return Promise.resolve(this._languageService.getSignatureHelpItems(fileName, position, undefined));
	}

	getQuickInfoAtPosition(fileName: string, position: number): Promise<ts.QuickInfo | undefined> {
		return Promise.resolve(this._languageService.getQuickInfoAtPosition(fileName, position));
	}

	getOccurrencesAtPosition(fileName: string, position: number): Promise<ReadonlyArray<ts.ReferenceEntry> | undefined> {
		return Promise.resolve(this._languageService.getOccurrencesAtPosition(fileName, position));
	}

	getDefinitionAtPosition(fileName: string, position: number): Promise<ReadonlyArray<ts.DefinitionInfo> | undefined> {
		return Promise.resolve(this._languageService.getDefinitionAtPosition(fileName, position));
	}

	getReferencesAtPosition(fileName: string, position: number): Promise<ts.ReferenceEntry[] | undefined> {
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

	findRenameLocations(fileName: string, position: number, findInStrings: boolean, findInComments: boolean, providePrefixAndSuffixTextForRename: boolean): Promise<readonly ts.RenameLocation[] | undefined> {
		return Promise.resolve(this._languageService.findRenameLocations(fileName, position, findInStrings, findInComments, providePrefixAndSuffixTextForRename));
	}

	getRenameInfo(fileName: string, position: number, options: ts.RenameInfoOptions): Promise<ts.RenameInfo> {
		return Promise.resolve(this._languageService.getRenameInfo(fileName, position, options));
	}

	getEmitOutput(fileName: string): Promise<ts.EmitOutput> {
		return Promise.resolve(this._languageService.getEmitOutput(fileName));
	}

	getCodeFixesAtPosition(fileName: string, start: number, end: number, errorCodes: number[], formatOptions: ts.FormatCodeOptions): Promise<ReadonlyArray<ts.CodeFixAction>> {
		const preferences = {}
		return Promise.resolve(this._languageService.getCodeFixesAtPosition(fileName, start, end, errorCodes, formatOptions, preferences));
	}

	updateExtraLibs(extraLibs: IExtraLibs) {
		this._extraLibs = extraLibs;
	}
}

export interface ICreateData {
	compilerOptions: ts.CompilerOptions;
	extraLibs: IExtraLibs;
}

export function create(ctx: IWorkerContext, createData: ICreateData): TypeScriptWorker {
	return new TypeScriptWorker(ctx, createData);
}
