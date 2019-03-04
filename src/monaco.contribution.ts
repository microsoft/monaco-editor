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

export interface IExtraLib {
	content: string;
	version: number;
}

export interface IExtraLibs {
	[path: string]: IExtraLib;
}

export class LanguageServiceDefaultsImpl implements monaco.languages.typescript.LanguageServiceDefaults {

	private _onDidChange = new Emitter<void>();
	private _onDidExtraLibsChange = new Emitter<void>();

	private _extraLibs: IExtraLibs;
	private _workerMaxIdleTime: number;
	private _eagerModelSync: boolean;
	private _compilerOptions: monaco.languages.typescript.CompilerOptions;
	private _diagnosticsOptions: monaco.languages.typescript.DiagnosticsOptions;
	private _onDidExtraLibsChangeTimeout: number;

	constructor(compilerOptions: monaco.languages.typescript.CompilerOptions, diagnosticsOptions: monaco.languages.typescript.DiagnosticsOptions) {
		this._extraLibs = Object.create(null);
		this._workerMaxIdleTime = 2 * 60 * 1000;
		this.setCompilerOptions(compilerOptions);
		this.setDiagnosticsOptions(diagnosticsOptions);
		this._onDidExtraLibsChangeTimeout = -1;
	}

	get onDidChange(): IEvent<void> {
		return this._onDidChange.event;
	}

	get onDidExtraLibsChange(): IEvent<void> {
		return this._onDidExtraLibsChange.event;
	}

	getExtraLibs(): IExtraLibs {
		return this._extraLibs;
	}

	addExtraLib(content: string, filePath?: string): IDisposable {
		if (typeof filePath === 'undefined') {
			filePath = `ts:extralib-${Math.random().toString(36).substring(2, 15)}`;
		}

		if (this._extraLibs[filePath] && this._extraLibs[filePath].content === content) {
			// no-op, there already exists an extra lib with this content
			return {
				dispose: () => { }
			};
		}

		let myVersion = 1;
		if (this._extraLibs[filePath]) {
			myVersion = this._extraLibs[filePath].version + 1;
		}

		this._extraLibs[filePath] = {
			content: content,
			version: myVersion,
		};
		this._fireOnDidExtraLibsChangeSoon();

		return {
			dispose: () => {
				let extraLib = this._extraLibs[filePath];
				if (!extraLib) {
					return;
				}
				if (extraLib.version !== myVersion) {
					return;
				}

				delete this._extraLibs[filePath];
				this._fireOnDidExtraLibsChangeSoon();
			}
		};
	}

	private _fireOnDidExtraLibsChangeSoon(): void {
		if (this._onDidExtraLibsChangeTimeout !== -1) {
			// already scheduled
			return;
		}
		this._onDidExtraLibsChangeTimeout = setTimeout(() => {
			this._onDidExtraLibsChangeTimeout = -1;
			this._onDidExtraLibsChange.fire(undefined);
		}, 0);
	}

	getCompilerOptions(): monaco.languages.typescript.CompilerOptions {
		return this._compilerOptions;
	}

	setCompilerOptions(options: monaco.languages.typescript.CompilerOptions): void {
		this._compilerOptions = options || Object.create(null);
		this._onDidChange.fire(undefined);
	}

	getDiagnosticsOptions(): monaco.languages.typescript.DiagnosticsOptions {
		return this._diagnosticsOptions;
	}

	setDiagnosticsOptions(options: monaco.languages.typescript.DiagnosticsOptions): void {
		this._diagnosticsOptions = options || Object.create(null);
		this._onDidChange.fire(undefined);
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

function getTypeScriptWorker(): Promise<any> {
	return getMode().then(mode => mode.getTypeScriptWorker());
}

function getJavaScriptWorker(): Promise<any> {
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

function getMode(): Promise<typeof mode> {
	return import('./tsMode');
}

monaco.languages.onLanguage('typescript', () => {
	return getMode().then(mode => mode.setupTypeScript(typescriptDefaults));
});
monaco.languages.onLanguage('javascript', () => {
	return getMode().then(mode => mode.setupJavaScript(javascriptDefaults));
});
