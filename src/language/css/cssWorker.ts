/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { worker } from '../../fillers/monaco-editor-core';
import * as cssService from 'vscode-css-languageservice';
import { Options } from './monaco.contribution';

export class CSSWorker {
	// --- model sync -----------------------

	private _ctx: worker.IWorkerContext;
	private _languageService: cssService.LanguageService;
	private _languageSettings: cssService.LanguageSettings;
	private _languageId: string;

	constructor(ctx: worker.IWorkerContext, createData: ICreateData) {
		this._ctx = ctx;
		this._languageSettings = createData.options;
		this._languageId = createData.languageId;

		const data = createData.options.data;

		const useDefaultDataProvider = data?.useDefaultDataProvider;
		const customDataProviders: cssService.ICSSDataProvider[] = [];
		if (data?.dataProviders) {
			for (const id in data.dataProviders) {
				customDataProviders.push(cssService.newCSSDataProvider(data.dataProviders[id]));
			}
		}
		const lsOptions: cssService.LanguageServiceOptions = {
			customDataProviders,
			useDefaultDataProvider
		};

		switch (this._languageId) {
			case 'css':
				this._languageService = cssService.getCSSLanguageService(lsOptions);
				break;
			case 'less':
				this._languageService = cssService.getLESSLanguageService(lsOptions);
				break;
			case 'scss':
				this._languageService = cssService.getSCSSLanguageService(lsOptions);
				break;
			default:
				throw new Error('Invalid language id: ' + this._languageId);
		}
		this._languageService.configure(this._languageSettings);
	}

	// --- language service host ---------------

	async doValidation(uri: string): Promise<cssService.Diagnostic[]> {
		let document = this._getTextDocument(uri);
		if (document) {
			let stylesheet = this._languageService.parseStylesheet(document);
			let diagnostics = this._languageService.doValidation(document, stylesheet);
			return Promise.resolve(diagnostics);
		}
		return Promise.resolve([]);
	}
	async doComplete(
		uri: string,
		position: cssService.Position
	): Promise<cssService.CompletionList | null> {
		let document = this._getTextDocument(uri);
		if (!document) {
			return null;
		}
		let stylesheet = this._languageService.parseStylesheet(document);
		let completions = this._languageService.doComplete(document, position, stylesheet);
		return Promise.resolve(completions);
	}
	async doHover(uri: string, position: cssService.Position): Promise<cssService.Hover | null> {
		let document = this._getTextDocument(uri);
		if (!document) {
			return null;
		}
		let stylesheet = this._languageService.parseStylesheet(document);
		let hover = this._languageService.doHover(document, position, stylesheet);
		return Promise.resolve(hover);
	}
	async findDefinition(
		uri: string,
		position: cssService.Position
	): Promise<cssService.Location | null> {
		let document = this._getTextDocument(uri);
		if (!document) {
			return null;
		}
		let stylesheet = this._languageService.parseStylesheet(document);
		let definition = this._languageService.findDefinition(document, position, stylesheet);
		return Promise.resolve(definition);
	}
	async findReferences(uri: string, position: cssService.Position): Promise<cssService.Location[]> {
		let document = this._getTextDocument(uri);
		if (!document) {
			return [];
		}
		let stylesheet = this._languageService.parseStylesheet(document);
		let references = this._languageService.findReferences(document, position, stylesheet);
		return Promise.resolve(references);
	}
	async findDocumentHighlights(
		uri: string,
		position: cssService.Position
	): Promise<cssService.DocumentHighlight[]> {
		let document = this._getTextDocument(uri);
		if (!document) {
			return [];
		}
		let stylesheet = this._languageService.parseStylesheet(document);
		let highlights = this._languageService.findDocumentHighlights(document, position, stylesheet);
		return Promise.resolve(highlights);
	}
	async findDocumentSymbols(uri: string): Promise<cssService.SymbolInformation[]> {
		let document = this._getTextDocument(uri);
		if (!document) {
			return [];
		}
		let stylesheet = this._languageService.parseStylesheet(document);
		let symbols = this._languageService.findDocumentSymbols(document, stylesheet);
		return Promise.resolve(symbols);
	}
	async doCodeActions(
		uri: string,
		range: cssService.Range,
		context: cssService.CodeActionContext
	): Promise<cssService.Command[]> {
		let document = this._getTextDocument(uri);
		if (!document) {
			return [];
		}
		let stylesheet = this._languageService.parseStylesheet(document);
		let actions = this._languageService.doCodeActions(document, range, context, stylesheet);
		return Promise.resolve(actions);
	}
	async findDocumentColors(uri: string): Promise<cssService.ColorInformation[]> {
		let document = this._getTextDocument(uri);
		if (!document) {
			return [];
		}
		let stylesheet = this._languageService.parseStylesheet(document);
		let colorSymbols = this._languageService.findDocumentColors(document, stylesheet);
		return Promise.resolve(colorSymbols);
	}
	async getColorPresentations(
		uri: string,
		color: cssService.Color,
		range: cssService.Range
	): Promise<cssService.ColorPresentation[]> {
		let document = this._getTextDocument(uri);
		if (!document) {
			return [];
		}
		let stylesheet = this._languageService.parseStylesheet(document);
		let colorPresentations = this._languageService.getColorPresentations(
			document,
			stylesheet,
			color,
			range
		);
		return Promise.resolve(colorPresentations);
	}
	async getFoldingRanges(
		uri: string,
		context?: { rangeLimit?: number }
	): Promise<cssService.FoldingRange[]> {
		let document = this._getTextDocument(uri);
		if (!document) {
			return [];
		}
		let ranges = this._languageService.getFoldingRanges(document, context);
		return Promise.resolve(ranges);
	}
	async getSelectionRanges(
		uri: string,
		positions: cssService.Position[]
	): Promise<cssService.SelectionRange[]> {
		let document = this._getTextDocument(uri);
		if (!document) {
			return [];
		}
		let stylesheet = this._languageService.parseStylesheet(document);
		let ranges = this._languageService.getSelectionRanges(document, positions, stylesheet);
		return Promise.resolve(ranges);
	}
	async doRename(
		uri: string,
		position: cssService.Position,
		newName: string
	): Promise<cssService.WorkspaceEdit | null> {
		let document = this._getTextDocument(uri);
		if (!document) {
			return null;
		}
		let stylesheet = this._languageService.parseStylesheet(document);
		let renames = this._languageService.doRename(document, position, newName, stylesheet);
		return Promise.resolve(renames);
	}
	private _getTextDocument(uri: string): cssService.TextDocument | null {
		let models = this._ctx.getMirrorModels();
		for (let model of models) {
			if (model.uri.toString() === uri) {
				return cssService.TextDocument.create(
					uri,
					this._languageId,
					model.version,
					model.getValue()
				);
			}
		}
		return null;
	}
}

export interface ICreateData {
	languageId: string;
	options: Options;
}

export function create(ctx: worker.IWorkerContext, createData: ICreateData): CSSWorker {
	return new CSSWorker(ctx, createData);
}
