/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LanguageServiceDefaults } from './monaco.contribution';
import type { CSSWorker } from './cssWorker';
import * as lsTypes from 'vscode-languageserver-types';
import { languages, editor, Uri, Position, CancellationToken } from '../fillers/monaco-editor-core';
import {
	DiagnosticsAdapter,
	fromPosition,
	toRange,
	toTextEdit,
	fromRange,
	CompletionAdapter,
	HoverAdapter,
	DocumentHighlightAdapter,
	DefinitionAdapter,
	ReferenceAdapter,
	RenameAdapter
} from '../common/lspLanguageFeatures';

export interface WorkerAccessor {
	(first: Uri, ...more: Uri[]): Promise<CSSWorker>;
}

export class CSSDiagnosticsAdapter extends DiagnosticsAdapter<CSSWorker> {
	constructor(languageId: string, worker: WorkerAccessor, defaults: LanguageServiceDefaults) {
		super(languageId, worker, defaults.onDidChange);
	}
}

export class CSSCompletionAdapter extends CompletionAdapter<CSSWorker> {
	constructor(worker: WorkerAccessor) {
		super(worker, ['/', '-', ':']);
	}
}

export class CSSHoverAdapter extends HoverAdapter<CSSWorker> {}

export class CSSDocumentHighlightAdapter extends DocumentHighlightAdapter<CSSWorker> {}

export class CSSDefinitionAdapter extends DefinitionAdapter<CSSWorker> {}

export class CSSReferenceAdapter extends ReferenceAdapter<CSSWorker> {}

export class CSSRenameAdapter extends RenameAdapter<CSSWorker> {}

// --- document symbols ------

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

export class DocumentSymbolAdapter implements languages.DocumentSymbolProvider {
	constructor(private _worker: WorkerAccessor) {}

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

export class DocumentColorAdapter implements languages.DocumentColorProvider {
	constructor(private _worker: WorkerAccessor) {}

	public provideDocumentColors(
		model: editor.IReadOnlyModel,
		token: CancellationToken
	): Promise<languages.IColorInformation[] | undefined> {
		const resource = model.uri;

		return this._worker(resource)
			.then((worker) => worker.findDocumentColors(resource.toString()))
			.then((infos) => {
				if (!infos) {
					return;
				}
				return infos.map((item) => ({
					color: item.color,
					range: toRange(item.range)
				}));
			});
	}

	public provideColorPresentations(
		model: editor.IReadOnlyModel,
		info: languages.IColorInformation,
		token: CancellationToken
	): Promise<languages.IColorPresentation[] | undefined> {
		const resource = model.uri;

		return this._worker(resource)
			.then((worker) =>
				worker.getColorPresentations(resource.toString(), info.color, fromRange(info.range))
			)
			.then((presentations) => {
				if (!presentations) {
					return;
				}
				return presentations.map((presentation) => {
					let item: languages.IColorPresentation = {
						label: presentation.label
					};
					if (presentation.textEdit) {
						item.textEdit = toTextEdit(presentation.textEdit);
					}
					if (presentation.additionalTextEdits) {
						item.additionalTextEdits =
							presentation.additionalTextEdits.map<languages.TextEdit>(toTextEdit);
					}
					return item;
				});
			});
	}
}

export class FoldingRangeAdapter implements languages.FoldingRangeProvider {
	constructor(private _worker: WorkerAccessor) {}

	public provideFoldingRanges(
		model: editor.IReadOnlyModel,
		context: languages.FoldingContext,
		token: CancellationToken
	): Promise<languages.FoldingRange[] | undefined> {
		const resource = model.uri;

		return this._worker(resource)
			.then((worker) => worker.getFoldingRanges(resource.toString(), context))
			.then((ranges) => {
				if (!ranges) {
					return;
				}
				return ranges.map((range) => {
					const result: languages.FoldingRange = {
						start: range.startLine + 1,
						end: range.endLine + 1
					};
					if (typeof range.kind !== 'undefined') {
						result.kind = toFoldingRangeKind(<lsTypes.FoldingRangeKind>range.kind);
					}
					return result;
				});
			});
	}
}

function toFoldingRangeKind(
	kind: lsTypes.FoldingRangeKind
): languages.FoldingRangeKind | undefined {
	switch (kind) {
		case lsTypes.FoldingRangeKind.Comment:
			return languages.FoldingRangeKind.Comment;
		case lsTypes.FoldingRangeKind.Imports:
			return languages.FoldingRangeKind.Imports;
		case lsTypes.FoldingRangeKind.Region:
			return languages.FoldingRangeKind.Region;
	}
	return void 0;
}

export class SelectionRangeAdapter implements languages.SelectionRangeProvider {
	constructor(private _worker: WorkerAccessor) {}

	public provideSelectionRanges(
		model: editor.IReadOnlyModel,
		positions: Position[],
		token: CancellationToken
	): Promise<languages.SelectionRange[][] | undefined> {
		const resource = model.uri;

		return this._worker(resource)
			.then((worker) =>
				worker.getSelectionRanges(
					resource.toString(),
					positions.map<lsTypes.Position>(fromPosition)
				)
			)
			.then((selectionRanges) => {
				if (!selectionRanges) {
					return;
				}
				return selectionRanges.map((selectionRange: lsTypes.SelectionRange | undefined) => {
					const result: languages.SelectionRange[] = [];
					while (selectionRange) {
						result.push({ range: toRange(selectionRange.range) });
						selectionRange = selectionRange.parent;
					}
					return result;
				});
			});
	}
}
