/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import Thenable = monaco.Thenable;
import IWorkerContext = monaco.worker.IWorkerContext;

import * as jsonService from 'vscode-json-languageservice';

let defaultSchemaRequestService;
if (typeof fetch !== 'undefined') {
	defaultSchemaRequestService = function (url) { return fetch(url).then(response => response.text()) };
}

class PromiseAdapter<T> implements jsonService.Thenable<T> {
	private wrapped: Promise<T>;

	constructor(executor: (resolve: (value?: T | jsonService.Thenable<T>) => void, reject: (reason?: any) => void) => void) {
		this.wrapped = new Promise<T>(executor);
	}
	public then<TResult>(onfulfilled?: (value: T) => TResult | jsonService.Thenable<TResult>, onrejected?: (reason: any) => void): jsonService.Thenable<TResult> {
		let thenable: jsonService.Thenable<T> = this.wrapped;
		return thenable.then(onfulfilled, onrejected);
	}
	public getWrapped(): monaco.Thenable<T> {
		return this.wrapped;
	}
	public static resolve<T>(v: T | Thenable<T>): jsonService.Thenable<T> {
		return <monaco.Thenable<T>>Promise.resolve(v);
	}
	public static reject<T>(v: T): jsonService.Thenable<T> {
		return Promise.reject(<any>v);
	}
	public static all<T>(values: jsonService.Thenable<T>[]): jsonService.Thenable<T[]> {
		return Promise.all(values);
	}
}

export class JSONWorker {

	private _ctx: IWorkerContext;
	private _languageService: jsonService.LanguageService;
	private _languageSettings: jsonService.LanguageSettings;
	private _languageId: string;

	constructor(ctx: IWorkerContext, createData: ICreateData) {
		this._ctx = ctx;
		this._languageSettings = createData.languageSettings;
		this._languageId = createData.languageId;
		this._languageService = jsonService.getLanguageService({
			schemaRequestService: createData.enableSchemaRequest && defaultSchemaRequestService,
			promiseConstructor: PromiseAdapter
		});
		this._languageService.configure(this._languageSettings);
	}

	doValidation(uri: string): Thenable<jsonService.Diagnostic[]> {
		let document = this._getTextDocument(uri);
		if (document) {
			let jsonDocument = this._languageService.parseJSONDocument(document);
			return this._languageService.doValidation(document, jsonDocument);
		}
		return Promise.resolve([]);
	}
	doComplete(uri: string, position: jsonService.Position): Thenable<jsonService.CompletionList> {
		let document = this._getTextDocument(uri);
		let jsonDocument = this._languageService.parseJSONDocument(document);
		return this._languageService.doComplete(document, position, jsonDocument);
	}
	doResolve(item: jsonService.CompletionItem): Thenable<jsonService.CompletionItem> {
		return this._languageService.doResolve(item);
	}
	doHover(uri: string, position: jsonService.Position): Thenable<jsonService.Hover> {
		let document = this._getTextDocument(uri);
		let jsonDocument = this._languageService.parseJSONDocument(document);
		return this._languageService.doHover(document, position, jsonDocument);
	}
	format(uri: string, range: jsonService.Range, options: jsonService.FormattingOptions): Thenable<jsonService.TextEdit[]> {
		let document = this._getTextDocument(uri);
		let textEdits = this._languageService.format(document, range, options);
		return Promise.resolve(textEdits);
	}
	resetSchema(uri: string): Thenable<boolean> {
		return Promise.resolve(this._languageService.resetSchema(uri));
	}
	findDocumentSymbols(uri: string): Thenable<jsonService.SymbolInformation[]> {
		let document = this._getTextDocument(uri);
		let jsonDocument = this._languageService.parseJSONDocument(document);
		let symbols = this._languageService.findDocumentSymbols(document, jsonDocument);
		return Promise.resolve(symbols);
	}
	findDocumentColors(uri: string): Thenable<jsonService.ColorInformation[]> {
		let document = this._getTextDocument(uri);
		let jsonDocument = this._languageService.parseJSONDocument(document);
		let colorSymbols = this._languageService.findDocumentColors(document, jsonDocument);
		return Promise.resolve(colorSymbols);
	}
	getColorPresentations(uri: string, color: jsonService.Color, range: jsonService.Range): Thenable<jsonService.ColorPresentation[]> {
		let document = this._getTextDocument(uri);
		let jsonDocument = this._languageService.parseJSONDocument(document);
		let colorPresentations = this._languageService.getColorPresentations(document, jsonDocument, color, range);
		return Promise.resolve(colorPresentations);
	}
	getFoldingRanges(uri: string, context?: { rangeLimit?: number; }): Thenable<jsonService.FoldingRange[]> {
		let document = this._getTextDocument(uri);
		let ranges = this._languageService.getFoldingRanges(document, context);
		return Promise.resolve(ranges);
	}
	getSelectionRanges(uri: string, positions: jsonService.Position[]): Thenable<jsonService.SelectionRange[]> {
		let document = this._getTextDocument(uri);
		let jsonDocument = this._languageService.parseJSONDocument(document);
		let ranges = this._languageService.getSelectionRanges(document, positions, jsonDocument);
		return Promise.resolve(ranges);
	}
	private _getTextDocument(uri: string): jsonService.TextDocument {
		let models = this._ctx.getMirrorModels();
		for (let model of models) {
			if (model.uri.toString() === uri) {
				return jsonService.TextDocument.create(uri, this._languageId, model.version, model.getValue());
			}
		}
		return null;
	}
}

export interface ICreateData {
	languageId: string;
	languageSettings: jsonService.LanguageSettings;
	enableSchemaRequest: boolean;
}

export function create(ctx: IWorkerContext, createData: ICreateData): JSONWorker {
	return new JSONWorker(ctx, createData);
}
