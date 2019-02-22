/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import * as mode from './tsMode';
import * as tsDefinitions from 'vs/basic-languages/typescript/typescript';
import * as jsDefinitions from 'vs/basic-languages/javascript/javascript';

import Emitter = monaco.Emitter;
import IEvent = monaco.IEvent;
import IDisposable = monaco.IDisposable;

// --- TypeScript configuration and defaults ---------

export class LanguageServiceDefaultsImpl implements monaco.languages.typescript.LanguageServiceDefaults {

	private _onDidChange = new Emitter<monaco.languages.typescript.LanguageServiceDefaults>();
	private _onDidExtraLibsChange = new Emitter<monaco.languages.typescript.LanguageServiceDefaults>();

	private _extraLibs: { [path: string]: { content: string, version: number } };
	private _workerMaxIdleTime: number;
	private _eagerModelSync: boolean;
	private _compilerOptions: monaco.languages.typescript.CompilerOptions;
	private _diagnosticsOptions: monaco.languages.typescript.DiagnosticsOptions;
	private _languageId: string;
	private _eagerExtraLibSync: boolean = true;

	constructor(langualgeId: string, compilerOptions: monaco.languages.typescript.CompilerOptions, diagnosticsOptions: monaco.languages.typescript.DiagnosticsOptions) {
		this._extraLibs = Object.create(null);
		this._workerMaxIdleTime = 2 * 60 * 1000;
		this.setCompilerOptions(compilerOptions);
		this.setDiagnosticsOptions(diagnosticsOptions);
		this._languageId = langualgeId;
	}

	get onDidChange(): IEvent<monaco.languages.typescript.LanguageServiceDefaults> {
		return this._onDidChange.event;
	}

	get onDidExtraLibsChange(): IEvent<monaco.languages.typescript.LanguageServiceDefaults> {
		return this._onDidExtraLibsChange.event;
	}

	getExtraLibs(): { [path: string]: string; } {
		const result = Object.create(null);
		for (var key in this._extraLibs) {
			result[key] = this._extraLibs[key];
		}
		return Object.freeze(result);
	}

	addExtraLib(content: string, filePath?: string): IDisposable {
		if (typeof filePath === 'undefined') {
			filePath = `ts:extralib-${Date.now()}`;
		}

		if (this._extraLibs[filePath]) {
			this._extraLibs[filePath].version++;
			this._extraLibs[filePath].content = content;
		} else {
			this._extraLibs[filePath] = {
				content: content,
				version: 1
			};
		}
		if (this._eagerExtraLibSync) {
			this.syncExtraLibs();
		}

		return {
			dispose: () => {
				if (delete this._extraLibs[filePath] && this._eagerExtraLibSync) {
					this.syncExtraLibs();
				}
			}
		};
	}

	async syncExtraLibs() {
		try {
			let worker;
			// we don't care if the get language worker fails.
			// This happens because the worker initialzies much slower than the addExtraLib calls
			try {
				worker = await getLanguageWorker(this._languageId);
			} catch (ignored) {
				return;
			}
			const client = await worker("");
			client.syncExtraLibs(this._extraLibs);
			// let all listeners know that the extra libs have changed
			this._onDidExtraLibsChange.fire(this);
		} catch (error) {
			console.error(error);
		}
	}

	getCompilerOptions(): monaco.languages.typescript.CompilerOptions {
		return this._compilerOptions;
	}

	setCompilerOptions(options: monaco.languages.typescript.CompilerOptions): void {
		this._compilerOptions = options || Object.create(null);
		this._onDidChange.fire(this);
	}

	getDiagnosticsOptions(): monaco.languages.typescript.DiagnosticsOptions {
		return this._diagnosticsOptions;
	}

	setDiagnosticsOptions(options: monaco.languages.typescript.DiagnosticsOptions): void {
		this._diagnosticsOptions = options || Object.create(null);
		this._onDidChange.fire(this);
	}

	setMaximumWorkerIdleTime(value: number): void {
		// doesn't fire an event since no
		// worker restart is required here
		this._workerMaxIdleTime = value;
	}

	getWorkerMaxIdleTime() {
		return this._workerMaxIdleTime;
	}

	setEagerModelSync(value: boolean) {
		// doesn't fire an event since no
		// worker restart is required here
		this._eagerModelSync = value;
	}

	getEagerModelSync() {
		return this._eagerModelSync;
	}

	setEagerExtraLibSync(value: boolean) {
		this._eagerExtraLibSync = value;
	}
}

//#region enums copied from typescript to prevent loading the entire typescriptServices ---

enum ModuleKind {
	None = 0,
	CommonJS = 1,
	AMD = 2,
	UMD = 3,
	System = 4,
	ES2015 = 5,
	ESNext = 6
}
enum JsxEmit {
	None = 0,
	Preserve = 1,
	React = 2,
	ReactNative = 3
}
enum NewLineKind {
	CarriageReturnLineFeed = 0,
	LineFeed = 1
}
enum ScriptTarget {
	ES3 = 0,
	ES5 = 1,
	ES2015 = 2,
	ES2016 = 3,
	ES2017 = 4,
	ES2018 = 5,
	ESNext = 6,
	JSON = 100,
	Latest = 6
}
enum ModuleResolutionKind {
	Classic = 1,
	NodeJs = 2
}
//#endregion

const languageDefaultOptions = {
	javascript: {
		compilerOptions: { allowNonTsExtensions: true, allowJs: true, target: ScriptTarget.Latest },
		diagnosticsOptions: { noSemanticValidation: true, noSyntaxValidation: false },
	},
	typescript: {
		compilerOptions: { allowNonTsExtensions: true, target: ScriptTarget.Latest },
		diagnosticsOptions: { noSemanticValidation: false, noSyntaxValidation: false }
	}
}

const languageDefaults: { [name: string]: LanguageServiceDefaultsImpl } = {};

function setupLanguageServiceDefaults(languageId, isTypescript) {
	const languageOptions = languageDefaultOptions[isTypescript ? "typescript" : "javascript"]
	languageDefaults[languageId] = new LanguageServiceDefaultsImpl(languageId, languageOptions.compilerOptions, languageOptions.diagnosticsOptions);
}

setupLanguageServiceDefaults("typescript", true);
setupLanguageServiceDefaults("javascript", false);

function getTypeScriptWorker(): Promise<any> {
	return getLanguageWorker("typescript");
}

function getJavaScriptWorker(): Promise<any> {
	return getLanguageWorker("javascript");
}

function getLanguageWorker(languageName: string): Promise<any> {
	return getMode().then(mode => mode.getNamedLanguageWorker(languageName));
}

function getLanguageDefaults(languageName: string): LanguageServiceDefaultsImpl {
	return languageDefaults[languageName];
}

function setupNamedLanguage(languageDefinition: monaco.languages.ILanguageExtensionPoint, isTypescript: boolean, registerLanguage?: boolean): void {
	if (registerLanguage) {
		monaco.languages.register(languageDefinition);

		const langageConfig = isTypescript ? tsDefinitions : jsDefinitions;
		monaco.languages.setMonarchTokensProvider(languageDefinition.id, langageConfig.language);
		monaco.languages.setLanguageConfiguration(languageDefinition.id, langageConfig.conf);
	}

	setupLanguageServiceDefaults(languageDefinition.id, isTypescript);

	monaco.languages.onLanguage(languageDefinition.id, () => {
		return getMode().then(mode => mode.setupNamedLanguage(languageDefinition.id, isTypescript, languageDefaults[languageDefinition.id]));
	});
}

// Export API
function createAPI(): typeof monaco.languages.typescript {
	return {
		ModuleKind: ModuleKind,
		JsxEmit: JsxEmit,
		NewLineKind: NewLineKind,
		ScriptTarget: ScriptTarget,
		ModuleResolutionKind: ModuleResolutionKind,
		typescriptDefaults: getLanguageDefaults("typescript"),
		javascriptDefaults: getLanguageDefaults("javascript"),
		getLanguageDefaults: getLanguageDefaults,
		getTypeScriptWorker: getTypeScriptWorker,
		getJavaScriptWorker: getJavaScriptWorker,
		getLanguageWorker: getLanguageWorker,
		setupNamedLanguage: setupNamedLanguage
	}
}
monaco.languages.typescript = createAPI();

// --- Registration to monaco editor ---

function getMode(): Promise<typeof mode> {
	return import('./tsMode');
}

setupNamedLanguage({
	id: 'typescript',
	extensions: ['.ts', '.tsx'],
	aliases: ['TypeScript', 'ts', 'typescript'],
	mimetypes: ['text/typescript']
}, true);

setupNamedLanguage({
	id: 'javascript',
	extensions: ['.js', '.es6', '.jsx'],
	firstLine: '^#!.*\\bnode',
	filenames: ['jakefile'],
	aliases: ['JavaScript', 'javascript', 'js'],
	mimetypes: ['text/javascript'],
}, false);