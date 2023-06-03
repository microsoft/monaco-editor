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

export * from './DocumentHighlightAdapter';

export * from './DefinitionAdapter';

export * from './ReferenceAdapter';

export * from './RenameAdapter';

export * from './DocumentSymbolAdapter';

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
