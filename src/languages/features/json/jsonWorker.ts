/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as jsonService from 'vscode-json-languageservice';
import type { worker } from '../../../editor';
import { URI } from 'vscode-uri';
import { DiagnosticsOptions } from './register';

let defaultSchemaRequestService: ((url: string) => Promise<string>) | undefined;
if (typeof fetch !== 'undefined') {
	defaultSchemaRequestService = function (url: string) {
		return fetch(url).then((response) => response.text());
	};
}

export class JSONWorker {
	private _ctx: worker.IWorkerContext;
	private _languageService: jsonService.LanguageService;
	private _languageSettings: DiagnosticsOptions;
	private _languageId: string;

	constructor(ctx: worker.IWorkerContext, createData: ICreateData) {
		this._ctx = ctx;
		this._languageSettings = createData.languageSettings;
		this._languageId = createData.languageId;
		this._languageService = jsonService.getLanguageService({
			workspaceContext: {
				resolveRelativePath: (relativePath: string, resource: string) => {
					const base = resource.substr(0, resource.lastIndexOf('/') + 1);
					return resolvePath(base, relativePath);
				}
			},
			schemaRequestService: createData.enableSchemaRequest
				? defaultSchemaRequestService
				: undefined,
			clientCapabilities: jsonService.ClientCapabilities.LATEST
		});
		this._languageService.configure(this._languageSettings);
	}

	async doValidation(uri: string): Promise<jsonService.Diagnostic[]> {
		let document = this._getTextDocument(uri);
		if (document) {
			let jsonDocument = this._languageService.parseJSONDocument(document);
			return this._languageService.doValidation(document, jsonDocument, this._languageSettings);
		}
		return Promise.resolve([]);
	}
	async doComplete(
		uri: string,
		position: jsonService.Position
	): Promise<jsonService.CompletionList | null> {
		let document = this._getTextDocument(uri);
		if (!document) {
			return null;
		}
		let jsonDocument = this._languageService.parseJSONDocument(document);
		return this._languageService.doComplete(document, position, jsonDocument);
	}
	async doResolve(item: jsonService.CompletionItem): Promise<jsonService.CompletionItem> {
		return this._languageService.doResolve(item);
	}
	async doHover(uri: string, position: jsonService.Position): Promise<jsonService.Hover | null> {
		let document = this._getTextDocument(uri);
		if (!document) {
			return null;
		}
		let jsonDocument = this._languageService.parseJSONDocument(document);
		return this._languageService.doHover(document, position, jsonDocument);
	}
	async format(
		uri: string,
		range: jsonService.Range | null,
		options: jsonService.FormattingOptions
	): Promise<jsonService.TextEdit[]> {
		let document = this._getTextDocument(uri);
		if (!document) {
			return [];
		}
		let textEdits = this._languageService.format(document, range! /* TODO */, options);
		return Promise.resolve(textEdits);
	}
	async resetSchema(uri: string): Promise<boolean> {
		return Promise.resolve(this._languageService.resetSchema(uri));
	}
	async findDocumentSymbols(uri: string): Promise<jsonService.DocumentSymbol[]> {
		let document = this._getTextDocument(uri);
		if (!document) {
			return [];
		}
		let jsonDocument = this._languageService.parseJSONDocument(document);
		let symbols = this._languageService.findDocumentSymbols2(document, jsonDocument);
		return Promise.resolve(symbols);
	}
	async findDocumentColors(uri: string): Promise<jsonService.ColorInformation[]> {
		let document = this._getTextDocument(uri);
		if (!document) {
			return [];
		}
		let jsonDocument = this._languageService.parseJSONDocument(document);
		let colorSymbols = this._languageService.findDocumentColors(document, jsonDocument);
		return Promise.resolve(colorSymbols);
	}
	async getColorPresentations(
		uri: string,
		color: jsonService.Color,
		range: jsonService.Range
	): Promise<jsonService.ColorPresentation[]> {
		let document = this._getTextDocument(uri);
		if (!document) {
			return [];
		}
		let jsonDocument = this._languageService.parseJSONDocument(document);
		let colorPresentations = this._languageService.getColorPresentations(
			document,
			jsonDocument,
			color,
			range
		);
		return Promise.resolve(colorPresentations);
	}
	async getFoldingRanges(
		uri: string,
		context?: { rangeLimit?: number }
	): Promise<jsonService.FoldingRange[]> {
		let document = this._getTextDocument(uri);
		if (!document) {
			return [];
		}
		let ranges = this._languageService.getFoldingRanges(document, context);
		return Promise.resolve(ranges);
	}
	async getSelectionRanges(
		uri: string,
		positions: jsonService.Position[]
	): Promise<jsonService.SelectionRange[]> {
		let document = this._getTextDocument(uri);
		if (!document) {
			return [];
		}
		let jsonDocument = this._languageService.parseJSONDocument(document);
		let ranges = this._languageService.getSelectionRanges(document, positions, jsonDocument);
		return Promise.resolve(ranges);
	}
	async parseJSONDocument(uri: string): Promise<jsonService.JSONDocument | null> {
		let document = this._getTextDocument(uri);
		if (!document) {
			return null;
		}
		let jsonDocument = this._languageService.parseJSONDocument(document);
		return Promise.resolve(jsonDocument);
	}
	async getMatchingSchemas(uri: string): Promise<jsonService.MatchingSchema[]> {
		let document = this._getTextDocument(uri);
		if (!document) {
			return [];
		}
		let jsonDocument = this._languageService.parseJSONDocument(document);
		return Promise.resolve(this._languageService.getMatchingSchemas(document, jsonDocument));
	}
	private _getTextDocument(uri: string): jsonService.TextDocument | null {
		let models = this._ctx.getMirrorModels();
		for (let model of models) {
			if (model.uri.toString() === uri) {
				return jsonService.TextDocument.create(
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

// URI path utilities, will (hopefully) move to vscode-uri

const Slash = '/'.charCodeAt(0);
const Dot = '.'.charCodeAt(0);

function isAbsolutePath(path: string) {
	return path.charCodeAt(0) === Slash;
}

function resolvePath(uriString: string, path: string): string {
	if (isAbsolutePath(path)) {
		const uri = URI.parse(uriString);
		const parts = path.split('/');
		return uri.with({ path: normalizePath(parts) }).toString();
	}
	return joinPath(uriString, path);
}

function normalizePath(parts: string[]): string {
	const newParts: string[] = [];
	for (const part of parts) {
		if (part.length === 0 || (part.length === 1 && part.charCodeAt(0) === Dot)) {
			// ignore
		} else if (part.length === 2 && part.charCodeAt(0) === Dot && part.charCodeAt(1) === Dot) {
			newParts.pop();
		} else {
			newParts.push(part);
		}
	}
	if (parts.length > 1 && parts[parts.length - 1].length === 0) {
		newParts.push('');
	}
	let res = newParts.join('/');
	if (parts[0].length === 0) {
		res = '/' + res;
	}
	return res;
}

function joinPath(uriString: string, ...paths: string[]): string {
	const uri = URI.parse(uriString);
	const parts = uri.path.split('/');
	for (let path of paths) {
		parts.push(...path.split('/'));
	}
	return uri.with({ path: normalizePath(parts) }).toString();
}

export interface ICreateData {
	languageId: string;
	languageSettings: DiagnosticsOptions;
	enableSchemaRequest: boolean;
}

export function create(ctx: worker.IWorkerContext, createData: ICreateData): JSONWorker {
	return new JSONWorker(ctx, createData);
}
