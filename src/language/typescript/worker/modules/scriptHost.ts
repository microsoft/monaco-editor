/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as ts from '../../lib/typescriptServices';
import { libFileMap } from '../../lib/lib';
import { IExtraLibs } from '../../monaco.contribution';
import { Uri, worker } from 'monaco-editor-core';

/**
 * Loading a default lib as a source file will mess up TS completely.
 * So our strategy is to hide such a text model from TS.
 * See https://github.com/microsoft/monaco-editor/issues/2182
 */
export function fileNameIsLib(resource: Uri | string): boolean {
	if (typeof resource === 'string') {
		if (/^file:\/\/\//.test(resource)) {
			return !!libFileMap[resource.substr(8)];
		}
		return false;
	}
	if (resource.path.indexOf('/lib.') === 0) {
		return !!libFileMap[resource.path.slice(1)];
	}
	return false;
}

export class ScriptHost {
	private _ctx: worker.IWorkerContext;
	private _extraLibs: IExtraLibs;
	private _compilerOptions: ts.CompilerOptions;

	constructor(ctx: worker.IWorkerContext, extraLibs: IExtraLibs, compilerOptions: ts.CompilerOptions) {
		this._ctx = ctx;
		this._extraLibs = extraLibs;
		this._compilerOptions = compilerOptions;
	}

	getCompilationSettings(): ts.CompilerOptions {
		return this._compilerOptions;
	}

	getExtraLibs(): IExtraLibs {
		return this._extraLibs;
	}

	getScriptFileNames(): string[] {
		const allModels = this._ctx.getMirrorModels().map((model) => model.uri);
		const models = allModels.filter((uri) => !fileNameIsLib(uri)).map((uri) => uri.toString());
		return models.concat(Object.keys(this._extraLibs));
	}

	private _getModel(fileName: string): worker.IMirrorModel | null {
		let models = this._ctx.getMirrorModels();
		for (let i = 0; i < models.length; i++) {
			const uri = models[i].uri;
			if (uri.toString() === fileName || uri.toString(true) === fileName) {
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

	async getScriptText(fileName: string): Promise<string | undefined> {
		return this._getScriptText(fileName);
	}

	_getScriptText(fileName: string): string | undefined {
		let text: string;
		let model = this._getModel(fileName);
		const libizedFileName = 'lib.' + fileName + '.d.ts';
		if (model) {
			// a true editor model
			text = model.getValue();
		} else if (fileName in libFileMap) {
			text = libFileMap[fileName];
		} else if (libizedFileName in libFileMap) {
			text = libFileMap[libizedFileName];
		} else if (fileName in this._extraLibs) {
			// extra lib
			text = this._extraLibs[fileName].content;
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
			case 'ts':
				return ts.ScriptKind.TS;
			case 'tsx':
				return ts.ScriptKind.TSX;
			case 'js':
				return ts.ScriptKind.JS;
			case 'jsx':
				return ts.ScriptKind.JSX;
			default:
				return this.getCompilationSettings().allowJs ? ts.ScriptKind.JS : ts.ScriptKind.TS;
		}
	}

	getCurrentDirectory(): string {
		return '';
	}

	getDefaultLibFileName(options: ts.CompilerOptions): string {
		switch (options.target) {
			case 99 /* ESNext */:
				const esnext = 'lib.esnext.full.d.ts';
				if (esnext in libFileMap || esnext in this._extraLibs) return esnext;
			case 7 /* ES2020 */:
			case 6 /* ES2019 */:
			case 5 /* ES2018 */:
			case 4 /* ES2017 */:
			case 3 /* ES2016 */:
			case 2 /* ES2015 */:
			default:
				// Support a dynamic lookup for the ES20XX version based on the target
				// which is safe unless TC39 changes their numbering system
				const eslib = `lib.es${2013 + (options.target || 99)}.full.d.ts`;
				// Note: This also looks in _extraLibs, If you want
				// to add support for additional target options, you will need to
				// add the extra dts files to _extraLibs via the API.
				if (eslib in libFileMap || eslib in this._extraLibs) {
					return eslib;
				}

				return 'lib.es6.d.ts'; // We don't use lib.es2015.full.d.ts due to breaking change.
			case 1:
			case 0:
				return 'lib.d.ts';
		}
	}

	isDefaultLibFileName(fileName: string): boolean {
		return fileName === this.getDefaultLibFileName(this._compilerOptions);
	}

	readFile(path: string): string | undefined {
		return this._getScriptText(path);
	}

	fileExists(path: string): boolean {
		return this._getScriptText(path) !== undefined;
	}

	async getLibFiles(): Promise<Record<string, string>> {
		return libFileMap;
	}

	updateExtraLibs(extraLibs: IExtraLibs): void {
		this._extraLibs = extraLibs;
	}
}
