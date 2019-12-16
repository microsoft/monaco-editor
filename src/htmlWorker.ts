/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import IWorkerContext = monaco.worker.IWorkerContext;

import Thenable = monaco.Thenable;

import * as htmlService from 'vscode-html-languageservice';

import * as poli from './fillers/polyfills';

poli.polyfill();

export class HTMLWorker {

	private _ctx: IWorkerContext;
	private _languageService: htmlService.LanguageService;
	private _languageSettings: monaco.languages.html.Options;
	private _languageId: string;

	constructor(ctx: IWorkerContext, createData: ICreateData) {
		this._ctx = ctx;
		this._languageSettings = createData.languageSettings;
		this._languageId = createData.languageId;
		this._languageService = htmlService.getLanguageService();
	}

	doValidation(uri: string): Thenable<htmlService.Diagnostic[]> {
		// not yet suported
		return Promise.resolve([]);
	}
	doComplete(uri: string, position: htmlService.Position): Thenable<htmlService.CompletionList> {
		let document = this._getTextDocument(uri);
		let htmlDocument = this._languageService.parseHTMLDocument(document);
		return Promise.resolve(this._languageService.doComplete(document, position, htmlDocument, this._languageSettings && this._languageSettings.suggest));
	}
	format(uri: string, range: htmlService.Range, options: htmlService.FormattingOptions): Thenable<htmlService.TextEdit[]> {
		let document = this._getTextDocument(uri);
		let textEdits = this._languageService.format(document, range, this._languageSettings && this._languageSettings.format);
		return Promise.resolve(textEdits);
	}
	doHover(uri: string, position: htmlService.Position): Thenable<htmlService.Hover> {
		let document = this._getTextDocument(uri);
		let htmlDocument = this._languageService.parseHTMLDocument(document);
		let hover = this._languageService.doHover(document, position, htmlDocument);
		return Promise.resolve(hover);
	}
	findDocumentHighlights(uri: string, position: htmlService.Position): Thenable<htmlService.DocumentHighlight[]> {
		let document = this._getTextDocument(uri);
		let htmlDocument = this._languageService.parseHTMLDocument(document);
		let highlights = this._languageService.findDocumentHighlights(document, position, htmlDocument);
		return Promise.resolve(highlights);
	}
	findDocumentLinks(uri: string): Thenable<htmlService.DocumentLink[]> {
		let document = this._getTextDocument(uri);
		let links = this._languageService.findDocumentLinks(document, null);
		return Promise.resolve(links);
	}
	findDocumentSymbols(uri: string): Thenable<htmlService.SymbolInformation[]> {
		let document = this._getTextDocument(uri);
		let htmlDocument = this._languageService.parseHTMLDocument(document);
		let symbols = this._languageService.findDocumentSymbols(document, htmlDocument);
		return Promise.resolve(symbols);
	}
	provideFoldingRanges(uri: string, context?: { rangeLimit?: number; }): Thenable<htmlService.FoldingRange[]> {
		let document = this._getTextDocument(uri);
		let ranges = this._languageService.getFoldingRanges(document, context);
		return Promise.resolve(ranges);
	}
	private _getTextDocument(uri: string): htmlService.TextDocument {
		let models = this._ctx.getMirrorModels();
		for (let model of models) {
			if (model.uri.toString() === uri) {
				return htmlService.TextDocument.create(uri, this._languageId, model.version, model.getValue());
			}
		}
		return null;
	}
}

export interface ICreateData {
	languageId: string;
	languageSettings: monaco.languages.html.Options;
}

export function create(ctx: IWorkerContext, createData: ICreateData): HTMLWorker {
	return new HTMLWorker(ctx, createData);
}
