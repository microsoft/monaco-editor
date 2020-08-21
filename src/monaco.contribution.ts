/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import * as mode from './tsMode';
import { typescriptVersion } from './lib/typescriptServicesMetadata'; // do not import the whole typescriptServices here

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
	private _eagerModelSync: boolean;
	private _compilerOptions!: monaco.languages.typescript.CompilerOptions;
	private _diagnosticsOptions!: monaco.languages.typescript.DiagnosticsOptions;
	private _workerOptions!: monaco.languages.typescript.WorkerOptions;
	private _onDidExtraLibsChangeTimeout: number;

	constructor(compilerOptions: monaco.languages.typescript.CompilerOptions, diagnosticsOptions: monaco.languages.typescript.DiagnosticsOptions, workerOptions: monaco.languages.typescript.WorkerOptions) {
		this._extraLibs = Object.create(null);
		this._eagerModelSync = false;
		this.setCompilerOptions(compilerOptions);
		this.setDiagnosticsOptions(diagnosticsOptions);
		this.setWorkerOptions(workerOptions)
		this._onDidExtraLibsChangeTimeout = -1;
	}

	get onDidChange(): IEvent<void> {
		return this._onDidChange.event;
	}

	get onDidExtraLibsChange(): IEvent<void> {
		return this._onDidExtraLibsChange.event;
	}

	get workerOptions(): monaco.languages.typescript.WorkerOptions {
		return this._workerOptions
	}

	getExtraLibs(): IExtraLibs {
		return this._extraLibs;
	}

	addExtraLib(content: string, _filePath?: string): IDisposable {
		let filePath: string;
		if (typeof _filePath === 'undefined') {
			filePath = `ts:extralib-${Math.random().toString(36).substring(2, 15)}`;
		} else {
			filePath = _filePath;
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

	setExtraLibs(libs: { content: string; filePath?: string }[]): void {
		// clear out everything
		this._extraLibs = Object.create(null);

		if (libs && libs.length > 0) {
			for (const lib of libs) {
				const filePath = lib.filePath || `ts:extralib-${Math.random().toString(36).substring(2, 15)}`;
				const content = lib.content;
				this._extraLibs[filePath] = {
					content: content,
					version: 1
				};
			}
		}

		this._fireOnDidExtraLibsChangeSoon();
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

	setWorkerOptions(options: monaco.languages.typescript.WorkerOptions): void {
		this._workerOptions = options || Object.create(null);
		this._onDidChange.fire(undefined);
	}

	setMaximumWorkerIdleTime(value: number): void {
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
	ESNext = 99
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
	ES2019 = 6,
	ES2020 = 7,
	ESNext = 99,
	JSON = 100,
	Latest = ESNext,
}

enum ModuleResolutionKind {
	Classic = 1,
	NodeJs = 2
}
//#endregion

const typescriptDefaults = new LanguageServiceDefaultsImpl(
	{ allowNonTsExtensions: true, target: ScriptTarget.Latest },
	{ noSemanticValidation: false, noSyntaxValidation: false },
	{});

const javascriptDefaults = new LanguageServiceDefaultsImpl(
	{ allowNonTsExtensions: true, allowJs: true, target: ScriptTarget.Latest },
	{ noSemanticValidation: true, noSyntaxValidation: false },
	{});

function getTypeScriptWorker(): Promise<(...uris: monaco.Uri[]) => Promise<monaco.languages.typescript.TypeScriptWorker>> {
	return getMode().then(mode => mode.getTypeScriptWorker());
}

function getJavaScriptWorker(): Promise<(...uris: monaco.Uri[]) => Promise<monaco.languages.typescript.TypeScriptWorker>> {
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
		typescriptVersion,
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
