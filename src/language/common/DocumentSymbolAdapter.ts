/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as lsTypes from 'vscode-languageserver-types';
import { languages, editor, CancellationToken } from '../../fillers/monaco-editor-core';
import { toRange } from './CompletionAdapter';
import { WorkerAccessor } from './lspLanguageFeatures';

export interface ILanguageWorkerWithDocumentSymbols {
	findDocumentSymbols(uri: string): Promise<lsTypes.SymbolInformation[]>;
}

export class DocumentSymbolAdapter<T extends ILanguageWorkerWithDocumentSymbols>
	implements languages.DocumentSymbolProvider
{
	constructor(private readonly _worker: WorkerAccessor<T>) {}

	public provideDocumentSymbols(
		model: editor.IReadOnlyModel,
		token: CancellationToken
	): Promise<languages.DocumentSymbol[] | undefined> {
		const resource = model.uri;

		return this._worker(resource)
			.then((worker) => worker.findDocumentSymbols(resource.toString()))
			.then((items) => {
				if (!items) {
					return;
				}
				return items.map((item) => ({
					name: item.name,
					detail: '',
					containerName: item.containerName,
					kind: toSymbolKind(item.kind),
					range: toRange(item.location.range),
					selectionRange: toRange(item.location.range),
					tags: []
				}));
			});
	}
}

function toSymbolKind(kind: lsTypes.SymbolKind): languages.SymbolKind {
	let mKind = languages.SymbolKind;

	switch (kind) {
		case lsTypes.SymbolKind.File:
			return mKind.Array;
		case lsTypes.SymbolKind.Module:
			return mKind.Module;
		case lsTypes.SymbolKind.Namespace:
			return mKind.Namespace;
		case lsTypes.SymbolKind.Package:
			return mKind.Package;
		case lsTypes.SymbolKind.Class:
			return mKind.Class;
		case lsTypes.SymbolKind.Method:
			return mKind.Method;
		case lsTypes.SymbolKind.Property:
			return mKind.Property;
		case lsTypes.SymbolKind.Field:
			return mKind.Field;
		case lsTypes.SymbolKind.Constructor:
			return mKind.Constructor;
		case lsTypes.SymbolKind.Enum:
			return mKind.Enum;
		case lsTypes.SymbolKind.Interface:
			return mKind.Interface;
		case lsTypes.SymbolKind.Function:
			return mKind.Function;
		case lsTypes.SymbolKind.Variable:
			return mKind.Variable;
		case lsTypes.SymbolKind.Constant:
			return mKind.Constant;
		case lsTypes.SymbolKind.String:
			return mKind.String;
		case lsTypes.SymbolKind.Number:
			return mKind.Number;
		case lsTypes.SymbolKind.Boolean:
			return mKind.Boolean;
		case lsTypes.SymbolKind.Array:
			return mKind.Array;
	}
	return mKind.Function;
}
