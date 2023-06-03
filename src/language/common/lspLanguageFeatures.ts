/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as lsTypes from 'vscode-languageserver-types';
import {
	languages,
	editor,
	Uri,
	Position,
	Range,
	CancellationToken
} from '../../fillers/monaco-editor-core';
import { fromPosition, toRange, toTextEdit, fromRange } from './CompletionAdapter';

export interface WorkerAccessor<T> {
	(...more: Uri[]): Promise<T>;
}

export * from './DiagnosticsAdapter';

export * from './CompletionAdapter';

export * from './HoverAdapter';

//#region DocumentHighlightAdapter

export interface ILanguageWorkerWithDocumentHighlights {
	findDocumentHighlights(
		uri: string,
		position: lsTypes.Position
	): Promise<lsTypes.DocumentHighlight[]>;
}

export class DocumentHighlightAdapter<T extends ILanguageWorkerWithDocumentHighlights>
	implements languages.DocumentHighlightProvider
{
	constructor(private readonly _worker: WorkerAccessor<T>) {}

	public provideDocumentHighlights(
		model: editor.IReadOnlyModel,
		position: Position,
		token: CancellationToken
	): Promise<languages.DocumentHighlight[] | undefined> {
		const resource = model.uri;

		return this._worker(resource)
			.then((worker) => worker.findDocumentHighlights(resource.toString(), fromPosition(position)))
			.then((entries) => {
				if (!entries) {
					return;
				}
				return entries.map((entry) => {
					return <languages.DocumentHighlight>{
						range: toRange(entry.range),
						kind: toDocumentHighlightKind(entry.kind)
					};
				});
			});
	}
}

function toDocumentHighlightKind(
	kind: lsTypes.DocumentHighlightKind | undefined
): languages.DocumentHighlightKind {
	switch (kind) {
		case lsTypes.DocumentHighlightKind.Read:
			return languages.DocumentHighlightKind.Read;
		case lsTypes.DocumentHighlightKind.Write:
			return languages.DocumentHighlightKind.Write;
		case lsTypes.DocumentHighlightKind.Text:
			return languages.DocumentHighlightKind.Text;
	}
	return languages.DocumentHighlightKind.Text;
}

//#endregion

//#region DefinitionAdapter

export interface ILanguageWorkerWithDefinitions {
	findDefinition(uri: string, position: lsTypes.Position): Promise<lsTypes.Location | null>;
}

export class DefinitionAdapter<T extends ILanguageWorkerWithDefinitions>
	implements languages.DefinitionProvider
{
	constructor(private readonly _worker: WorkerAccessor<T>) {}

	public provideDefinition(
		model: editor.IReadOnlyModel,
		position: Position,
		token: CancellationToken
	): Promise<languages.Definition | undefined> {
		const resource = model.uri;

		return this._worker(resource)
			.then((worker) => {
				return worker.findDefinition(resource.toString(), fromPosition(position));
			})
			.then((definition) => {
				if (!definition) {
					return;
				}
				return [toLocation(definition)];
			});
	}
}

function toLocation(location: lsTypes.Location): languages.Location {
	return {
		uri: Uri.parse(location.uri),
		range: toRange(location.range)
	};
}

//#endregion

//#region ReferenceAdapter

export interface ILanguageWorkerWithReferences {
	findReferences(uri: string, position: lsTypes.Position): Promise<lsTypes.Location[]>;
}

export class ReferenceAdapter<T extends ILanguageWorkerWithReferences>
	implements languages.ReferenceProvider
{
	constructor(private readonly _worker: WorkerAccessor<T>) {}

	provideReferences(
		model: editor.IReadOnlyModel,
		position: Position,
		context: languages.ReferenceContext,
		token: CancellationToken
	): Promise<languages.Location[] | undefined> {
		const resource = model.uri;

		return this._worker(resource)
			.then((worker) => {
				return worker.findReferences(resource.toString(), fromPosition(position));
			})
			.then((entries) => {
				if (!entries) {
					return;
				}
				return entries.map(toLocation);
			});
	}
}

//#endregion

//#region RenameAdapter

export interface ILanguageWorkerWithRename {
	doRename(
		uri: string,
		position: lsTypes.Position,
		newName: string
	): Promise<lsTypes.WorkspaceEdit | null>;
}

export class RenameAdapter<T extends ILanguageWorkerWithRename>
	implements languages.RenameProvider
{
	constructor(private readonly _worker: WorkerAccessor<T>) {}

	provideRenameEdits(
		model: editor.IReadOnlyModel,
		position: Position,
		newName: string,
		token: CancellationToken
	): Promise<languages.WorkspaceEdit | undefined> {
		const resource = model.uri;

		return this._worker(resource)
			.then((worker) => {
				return worker.doRename(resource.toString(), fromPosition(position), newName);
			})
			.then((edit) => {
				return toWorkspaceEdit(edit);
			});
	}
}

function toWorkspaceEdit(edit: lsTypes.WorkspaceEdit | null): languages.WorkspaceEdit | undefined {
	if (!edit || !edit.changes) {
		return void 0;
	}
	let resourceEdits: languages.IWorkspaceTextEdit[] = [];
	for (let uri in edit.changes) {
		const _uri = Uri.parse(uri);
		for (let e of edit.changes[uri]) {
			resourceEdits.push({
				resource: _uri,
				versionId: undefined,
				textEdit: {
					range: toRange(e.range),
					text: e.newText
				}
			});
		}
	}
	return {
		edits: resourceEdits
	};
}

//#endregion

//#region DocumentSymbolAdapter

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

//#endregion

//#region DocumentLinkAdapter

export interface ILanguageWorkerWithDocumentLinks {
	findDocumentLinks(uri: string): Promise<lsTypes.DocumentLink[]>;
}

export class DocumentLinkAdapter<T extends ILanguageWorkerWithDocumentLinks>
	implements languages.LinkProvider
{
	constructor(private _worker: WorkerAccessor<T>) {}

	public provideLinks(
		model: editor.IReadOnlyModel,
		token: CancellationToken
	): Promise<languages.ILinksList | undefined> {
		const resource = model.uri;

		return this._worker(resource)
			.then((worker) => worker.findDocumentLinks(resource.toString()))
			.then((items) => {
				if (!items) {
					return;
				}
				return {
					links: items.map((item) => ({
						range: toRange(item.range),
						url: item.target
					}))
				};
			});
	}
}

//#endregion

//#region DocumentFormattingEditProvider, DocumentRangeFormattingEditProvider

export interface ILanguageWorkerWithFormat {
	format(
		uri: string,
		range: lsTypes.Range | null,
		options: lsTypes.FormattingOptions
	): Promise<lsTypes.TextEdit[]>;
}

export class DocumentFormattingEditProvider<T extends ILanguageWorkerWithFormat>
	implements languages.DocumentFormattingEditProvider
{
	constructor(private _worker: WorkerAccessor<T>) {}

	public provideDocumentFormattingEdits(
		model: editor.IReadOnlyModel,
		options: languages.FormattingOptions,
		token: CancellationToken
	): Promise<languages.TextEdit[] | undefined> {
		const resource = model.uri;

		return this._worker(resource).then((worker) => {
			return worker
				.format(resource.toString(), null, fromFormattingOptions(options))
				.then((edits) => {
					if (!edits || edits.length === 0) {
						return;
					}
					return edits.map<languages.TextEdit>(toTextEdit);
				});
		});
	}
}

export class DocumentRangeFormattingEditProvider<T extends ILanguageWorkerWithFormat>
	implements languages.DocumentRangeFormattingEditProvider
{
	readonly canFormatMultipleRanges = false;

	constructor(private _worker: WorkerAccessor<T>) {}

	public provideDocumentRangeFormattingEdits(
		model: editor.IReadOnlyModel,
		range: Range,
		options: languages.FormattingOptions,
		token: CancellationToken
	): Promise<languages.TextEdit[] | undefined> {
		const resource = model.uri;

		return this._worker(resource).then((worker) => {
			return worker
				.format(resource.toString(), fromRange(range), fromFormattingOptions(options))
				.then((edits) => {
					if (!edits || edits.length === 0) {
						return;
					}
					return edits.map<languages.TextEdit>(toTextEdit);
				});
		});
	}
}

function fromFormattingOptions(options: languages.FormattingOptions): lsTypes.FormattingOptions {
	return {
		tabSize: options.tabSize,
		insertSpaces: options.insertSpaces
	};
}

//#endregion

//#region DocumentColorAdapter

export interface ILanguageWorkerWithDocumentColors {
	findDocumentColors(uri: string): Promise<lsTypes.ColorInformation[]>;
	getColorPresentations(
		uri: string,
		color: lsTypes.Color,
		range: lsTypes.Range
	): Promise<lsTypes.ColorPresentation[]>;
}

export class DocumentColorAdapter<T extends ILanguageWorkerWithDocumentColors>
	implements languages.DocumentColorProvider
{
	constructor(private readonly _worker: WorkerAccessor<T>) {}

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

//#endregion

//#region FoldingRangeAdapter

export interface ILanguageWorkerWithFoldingRanges {
	getFoldingRanges(uri: string, context?: { rangeLimit?: number }): Promise<lsTypes.FoldingRange[]>;
}

export class FoldingRangeAdapter<T extends ILanguageWorkerWithFoldingRanges>
	implements languages.FoldingRangeProvider
{
	constructor(private _worker: WorkerAccessor<T>) {}

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

//#endregion

//#region SelectionRangeAdapter

export interface ILanguageWorkerWithSelectionRanges {
	getSelectionRanges(uri: string, positions: lsTypes.Position[]): Promise<lsTypes.SelectionRange[]>;
}

export class SelectionRangeAdapter<T extends ILanguageWorkerWithSelectionRanges>
	implements languages.SelectionRangeProvider
{
	constructor(private _worker: WorkerAccessor<T>) {}

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

//#endregion
