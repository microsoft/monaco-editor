/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import Thenable = monaco.Thenable;
import IWorkerContext = monaco.worker.IWorkerContext;

import * as cssService from 'vscode-css-languageservice';

export class CSSWorker {

	// --- model sync -----------------------

	private _ctx: IWorkerContext;
	private _languageService: cssService.LanguageService;
	private _languageSettings: cssService.LanguageSettings;
	private _languageId: string;

	constructor(ctx: IWorkerContext, createData: ICreateData) {
		this._ctx = ctx;
		this._languageSettings = createData.languageSettings;
		this._languageId = createData.languageId;
		switch (this._languageId) {
			case 'css':
				this._languageService = cssService.getCSSLanguageService();
				break;
			case 'less':
				this._languageService = cssService.getLESSLanguageService();
				break;
			case 'scss':
				this._languageService = cssService.getSCSSLanguageService();
				break;
			default:
				throw new Error('Invalid language id: ' + this._languageId);
		}
		this._languageService.configure(this._languageSettings);
	}

	// --- language service host ---------------

	doValidation(uri: string): Thenable<cssService.Diagnostic[]> {
		let document = this._getTextDocument(uri);
		if (document) {
			let stylesheet = this._languageService.parseStylesheet(document);
			let diagnostics = this._languageService.doValidation(document, stylesheet);
			return Promise.resolve(diagnostics)
		}
		return Promise.resolve([]);
	}
	doComplete(uri: string, position: cssService.Position): Thenable<cssService.CompletionList> {
		let document = this._getTextDocument(uri);
		let stylesheet = this._languageService.parseStylesheet(document);
		let completions = this._languageService.doComplete(document, position, stylesheet);
		return Promise.resolve(completions);
	}
	doHover(uri: string, position: cssService.Position): Thenable<cssService.Hover> {
		let document = this._getTextDocument(uri);
		let stylesheet = this._languageService.parseStylesheet(document);
		let hover = this._languageService.doHover(document, position, stylesheet);
		return Promise.resolve(hover);
	}
	findDefinition(uri: string, position: cssService.Position): Thenable<cssService.Location> {
		let document = this._getTextDocument(uri);
		let stylesheet = this._languageService.parseStylesheet(document);
		let definition = this._languageService.findDefinition(document, position, stylesheet);
		return Promise.resolve(definition);
	}
	findReferences(uri: string, position: cssService.Position): Thenable<cssService.Location[]> {
		let document = this._getTextDocument(uri);
		let stylesheet = this._languageService.parseStylesheet(document);
		let references = this._languageService.findReferences(document, position, stylesheet);
		return Promise.resolve(references);
	}
	findDocumentHighlights(uri: string, position: cssService.Position): Thenable<cssService.DocumentHighlight[]> {
		let document = this._getTextDocument(uri);
		let stylesheet = this._languageService.parseStylesheet(document);
		let highlights = this._languageService.findDocumentHighlights(document, position, stylesheet);
		return Promise.resolve(highlights);
	}
	findDocumentSymbols(uri: string): Thenable<cssService.SymbolInformation[]> {
		let document = this._getTextDocument(uri);
		let stylesheet = this._languageService.parseStylesheet(document);
		let symbols = this._languageService.findDocumentSymbols(document, stylesheet);
		return Promise.resolve(symbols);
	}
	doCodeActions(uri: string, range: cssService.Range, context: cssService.CodeActionContext): Thenable<cssService.Command[]> {
		let document = this._getTextDocument(uri);
		let stylesheet = this._languageService.parseStylesheet(document);
		let actions = this._languageService.doCodeActions(document, range, context, stylesheet);
		return Promise.resolve(actions);
	}
	findDocumentColors(uri: string): Thenable<cssService.ColorInformation[]> {
		let document = this._getTextDocument(uri);
		let stylesheet = this._languageService.parseStylesheet(document);
		let colorSymbols = this._languageService.findDocumentColors(document, stylesheet);
		return Promise.resolve(colorSymbols);
	}
	getColorPresentations(uri: string, color: cssService.Color, range: cssService.Range): Thenable<cssService.ColorPresentation[]> {
		let document = this._getTextDocument(uri);
		let stylesheet = this._languageService.parseStylesheet(document);
		let colorPresentations = this._languageService.getColorPresentations(document, stylesheet, color, range);
		return Promise.resolve(colorPresentations);
	}
	getFoldingRanges(uri: string, context?: { rangeLimit?: number; }): Thenable<cssService.FoldingRange[]> {
		let document = this._getTextDocument(uri);
		let ranges = this._languageService.getFoldingRanges(document, context);
		return Promise.resolve(ranges);
	}
	getSelectionRanges(uri: string, positions: cssService.Position[]): Thenable<cssService.SelectionRange[]> {
		let document = this._getTextDocument(uri);
		let stylesheet = this._languageService.parseStylesheet(document);
		let ranges = this._languageService.getSelectionRanges(document, positions, stylesheet);
		return Promise.resolve(ranges);
	}
	doRename(uri: string, position: cssService.Position, newName: string): Thenable<cssService.WorkspaceEdit> {
		let document = this._getTextDocument(uri);
		let stylesheet = this._languageService.parseStylesheet(document);
		let renames = this._languageService.doRename(document, position, newName, stylesheet);
		return Promise.resolve(renames);
	}
	private _getTextDocument(uri: string): cssService.TextDocument {
		let models = this._ctx.getMirrorModels();
		for (let model of models) {
			if (model.uri.toString() === uri) {
				return cssService.TextDocument.create(uri, this._languageId, model.version, model.getValue());
			}
		}
		return null;
	}
}

export interface ICreateData {
	languageId: string;
	languageSettings: cssService.LanguageSettings;
}

export function create(ctx: IWorkerContext, createData: ICreateData): CSSWorker {
	return new CSSWorker(ctx, createData);
}
