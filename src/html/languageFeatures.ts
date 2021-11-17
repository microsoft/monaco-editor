/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { HTMLWorker } from './htmlWorker';
import * as lsTypes from 'vscode-languageserver-types';
import {
	languages,
	editor,
	Uri,
	Position,
	Range,
	CancellationToken
} from '../fillers/monaco-editor-core';
import {
	fromPosition,
	toRange,
	toTextEdit,
	fromRange,
	CompletionAdapter,
	HoverAdapter
} from '../common/lspLanguageFeatures';

export interface WorkerAccessor {
	(...more: Uri[]): Promise<HTMLWorker>;
}

export class HTMLCompletionAdapter extends CompletionAdapter<HTMLWorker> {
	constructor(worker: WorkerAccessor) {
		super(worker, ['.', ':', '<', '"', '=', '/']);
	}
}

export class HTMLHoverAdapter extends HoverAdapter<HTMLWorker> {}

// --- document highlights ------

function toDocumentHighlightKind(
	kind: lsTypes.DocumentHighlightKind
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

export class DocumentHighlightAdapter implements languages.DocumentHighlightProvider {
	constructor(private _worker: WorkerAccessor) {}

	public provideDocumentHighlights(
		model: editor.IReadOnlyModel,
		position: Position,
		token: CancellationToken
	): Promise<languages.DocumentHighlight[]> {
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

function toWorkspaceEdit(edit: lsTypes.WorkspaceEdit): languages.WorkspaceEdit {
	if (!edit || !edit.changes) {
		return void 0;
	}
	let resourceEdits: languages.WorkspaceTextEdit[] = [];
	for (let uri in edit.changes) {
		const _uri = Uri.parse(uri);
		for (let e of edit.changes[uri]) {
			resourceEdits.push({
				resource: _uri,
				edit: {
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

export class RenameAdapter implements languages.RenameProvider {
	constructor(private _worker: WorkerAccessor) {}

	provideRenameEdits(
		model: editor.IReadOnlyModel,
		position: Position,
		newName: string,
		token: CancellationToken
	): Promise<languages.WorkspaceEdit> {
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

export class DocumentLinkAdapter implements languages.LinkProvider {
	constructor(private _worker: WorkerAccessor) {}

	public provideLinks(
		model: editor.IReadOnlyModel,
		token: CancellationToken
	): Promise<languages.ILinksList> {
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

function fromFormattingOptions(options: languages.FormattingOptions): lsTypes.FormattingOptions {
	return {
		tabSize: options.tabSize,
		insertSpaces: options.insertSpaces
	};
}

export class DocumentFormattingEditProvider implements languages.DocumentFormattingEditProvider {
	constructor(private _worker: WorkerAccessor) {}

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

export class DocumentRangeFormattingEditProvider
	implements languages.DocumentRangeFormattingEditProvider
{
	constructor(private _worker: WorkerAccessor) {}

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
