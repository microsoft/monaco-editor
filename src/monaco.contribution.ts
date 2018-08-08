/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import * as mode from './tsMode';

import Emitter = monaco.Emitter;
import IEvent = monaco.IEvent;
import IDisposable = monaco.IDisposable;

// --- TypeScript configuration and defaults ---------

export class LanguageServiceDefaultsImpl implements monaco.languages.typescript.LanguageServiceDefaults {

	private _onDidChange = new Emitter<monaco.languages.typescript.LanguageServiceDefaults>();
	private _extraLibs: { [path: string]: string };
	private _workerMaxIdleTime: number;
	private _eagerModelSync: boolean;
	private _compilerOptions: monaco.languages.typescript.CompilerOptions;
	private _diagnosticsOptions: monaco.languages.typescript.DiagnosticsOptions;

	constructor(compilerOptions: monaco.languages.typescript.CompilerOptions, diagnosticsOptions: monaco.languages.typescript.DiagnosticsOptions) {
		this._extraLibs = Object.create(null);
		this._workerMaxIdleTime = 2 * 60 * 1000;
		this.setCompilerOptions(compilerOptions);
		this.setDiagnosticsOptions(diagnosticsOptions);
	}

	get onDidChange(): IEvent<monaco.languages.typescript.LanguageServiceDefaults> {
		return this._onDidChange.event;
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
			throw new Error(`${filePath} already a extra lib`);
		}

		this._extraLibs[filePath] = content;
		this._onDidChange.fire(this);

		return {
			dispose: () => {
				if (delete this._extraLibs[filePath]) {
					this._onDidChange.fire(this);
				}
			}
		};
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

const typescriptDefaults = new LanguageServiceDefaultsImpl(
	{ allowNonTsExtensions: true, target: ScriptTarget.Latest },
	{ noSemanticValidation: false, noSyntaxValidation: false });

const javascriptDefaults = new LanguageServiceDefaultsImpl(
	{ allowNonTsExtensions: true, allowJs: true, target: ScriptTarget.Latest },
	{ noSemanticValidation: true, noSyntaxValidation: false });

function getTypeScriptWorker(): monaco.Promise<any> {
	return getMode().then(mode => mode.getTypeScriptWorker());
}

function getJavaScriptWorker(): monaco.Promise<any> {
	return getMode().then(mode => mode.getJavaScriptWorker());
}

// Export API
function createAPI(): typeof monaco.languages.typescript {
	return {
		ModuleKind: ModuleKind,
		JsxEmit: JsxEmit,
		NewLineKind: NewLineKind,
		ScriptTarget: ScriptTarget,
		ModuleResolutionKind: ModuleResolutionKind,
		typescriptDefaults: typescriptDefaults,
		javascriptDefaults: javascriptDefaults,
		getTypeScriptWorker: getTypeScriptWorker,
		getJavaScriptWorker: getJavaScriptWorker
	}
}
monaco.languages.typescript = createAPI();

// --- Registration to monaco editor ---

function getMode(): monaco.Promise<typeof mode> {
	return monaco.Promise.wrap(import('./tsMode'))
}

monaco.languages.onLanguage('typescript', () => {
	return getMode().then(mode => mode.setupTypeScript(typescriptDefaults));
});
monaco.languages.onLanguage('javascript', () => {
	return getMode().then(mode => mode.setupJavaScript(javascriptDefaults));
});
