/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import ts = require('../lib/typescriptServices');
import {contents as libdts} from '../lib/lib-ts';
import {contents as libes6ts} from '../lib/lib-es6-ts';

import Promise = monaco.Promise;

const DEFAULT_LIB = {
	NAME: 'defaultLib:lib.d.ts',
	CONTENTS: libdts
};

const ES6_LIB = {
	NAME: 'defaultLib:lib.es6.d.ts',
	CONTENTS: libes6ts
};

export class TypeScriptWorker implements ts.LanguageServiceHost {

	// --- model sync -----------------------

	// private _models: { [uri: string]: MirrorModel2 } = Object.create(null);
	private _extraLibs: { [fileName: string]: string } = Object.create(null);
	private _languageService = ts.createLanguageService(this);
	private _compilerOptions: ts.CompilerOptions;

	// --- default ---------

	acceptDefaults(options:ts.CompilerOptions, extraLibs:{ [path: string]: string }): Promise<void> {
		this._compilerOptions = options;
		this._extraLibs = extraLibs;
		return;
	}

	// --- language service host ---------------

	getCompilationSettings(): ts.CompilerOptions {
		return this._compilerOptions;
	}

	getScriptFileNames(): string[] {
		let models = monaco.worker.mirrorModels.map(model => model.uri.toString());
		return models.concat(Object.keys(this._extraLibs));
	}

	private _getModel(fileName:string): monaco.worker.IMirrorModel {
		let models = monaco.worker.mirrorModels;
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
			text = model.getText();

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

	getCurrentDirectory(): string {
		return '';
	}

	getDefaultLibFileName(options: ts.CompilerOptions): string {
		// TODO@joh support lib.es7.d.ts
		return options.target > ts.ScriptTarget.ES5 ? DEFAULT_LIB.NAME : ES6_LIB.NAME;
	}

	isDefaultLibFileName(fileName: string): boolean {
		return fileName === this.getDefaultLibFileName(this._compilerOptions);
	}

	// --- language features

	getSyntacticDiagnostics(fileName: string): Promise<ts.Diagnostic[]> {
		const diagnostics = this._languageService.getSyntacticDiagnostics(fileName);
		diagnostics.forEach(diag => diag.file = undefined); // diag.file cannot be JSON'yfied
		return Promise.as(diagnostics);
	}

	getSemanticDiagnostics(fileName: string): Promise<ts.Diagnostic[]> {
		const diagnostics = this._languageService.getSemanticDiagnostics(fileName);
		diagnostics.forEach(diag => diag.file = undefined); // diag.file cannot be JSON'yfied
		return Promise.as(diagnostics);
	}

	getCompilerOptionsDiagnostics(fileName: string): Promise<ts.Diagnostic[]> {
		const diagnostics = this._languageService.getCompilerOptionsDiagnostics();
		diagnostics.forEach(diag => diag.file = undefined); // diag.file cannot be JSON'yfied
		return Promise.as(diagnostics);
	}

	getCompletionsAtPosition(fileName: string, position:number): Promise<ts.CompletionInfo> {
		return Promise.as(this._languageService.getCompletionsAtPosition(fileName, position));
	}

	getCompletionEntryDetails(fileName: string, position: number, entry: string): Promise<ts.CompletionEntryDetails> {
		return Promise.as(this._languageService.getCompletionEntryDetails(fileName, position, entry));
	}

	getSignatureHelpItems(fileName: string, position:number): Promise<ts.SignatureHelpItems> {
		return Promise.as(this._languageService.getSignatureHelpItems(fileName, position));
	}

	getQuickInfoAtPosition(fileName: string, position: number): Promise<ts.QuickInfo> {
		return Promise.as(this._languageService.getQuickInfoAtPosition(fileName, position));
	}

	getOccurrencesAtPosition(fileName: string, position: number): Promise<ts.ReferenceEntry[]> {
		return Promise.as(this._languageService.getOccurrencesAtPosition(fileName, position));
	}

	getDefinitionAtPosition(fileName: string, position: number): Promise<ts.DefinitionInfo[]> {
		return Promise.as(this._languageService.getDefinitionAtPosition(fileName, position));
	}

	getReferencesAtPosition(fileName: string, position: number): Promise<ts.ReferenceEntry[]> {
		return Promise.as(this._languageService.getReferencesAtPosition(fileName, position));
	}

	getNavigationBarItems(fileName: string): Promise<ts.NavigationBarItem[]> {
		return Promise.as(this._languageService.getNavigationBarItems(fileName));
	}

	getFormattingEditsForDocument(fileName: string, options: ts.FormatCodeOptions): Promise<ts.TextChange[]> {
		return Promise.as(this._languageService.getFormattingEditsForDocument(fileName, options));
	}

	getFormattingEditsForRange(fileName: string, start: number, end: number, options: ts.FormatCodeOptions): Promise<ts.TextChange[]> {
		return Promise.as(this._languageService.getFormattingEditsForRange(fileName, start, end, options));
	}

	getFormattingEditsAfterKeystroke(fileName: string, postion: number, ch: string, options: ts.FormatCodeOptions): Promise<ts.TextChange[]> {
		return Promise.as(this._languageService.getFormattingEditsAfterKeystroke(fileName, postion, ch, options));
	}

	getEmitOutput(fileName: string): Promise<ts.EmitOutput> {
		return Promise.as(this._languageService.getEmitOutput(fileName));
	}
}

export function create(): TypeScriptWorker {
	return new TypeScriptWorker();
}
