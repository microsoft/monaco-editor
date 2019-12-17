/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { LanguageServiceDefaultsImpl } from './monaco.contribution';
import { CSSWorker } from './cssWorker';

import * as cssService from 'vscode-css-languageservice';

import Uri = monaco.Uri;
import Position = monaco.Position;
import IRange = monaco.IRange;
import Range = monaco.Range;
import Thenable = monaco.Thenable;
import CancellationToken = monaco.CancellationToken;
import IDisposable = monaco.IDisposable;


export interface WorkerAccessor {
	(first: Uri, ...more: Uri[]): Promise<CSSWorker>
}

// --- diagnostics --- ---

export class DiagnosticsAdapter {

	private _disposables: IDisposable[] = [];
	private _listener: { [uri: string]: IDisposable } = Object.create(null);

	constructor(private _languageId: string, private _worker: WorkerAccessor, defaults: LanguageServiceDefaultsImpl) {
		const onModelAdd = (model: monaco.editor.IModel): void => {
			let modeId = model.getModeId();
			if (modeId !== this._languageId) {
				return;
			}

			let handle: number;
			this._listener[model.uri.toString()] = model.onDidChangeContent(() => {
				window.clearTimeout(handle);
				handle = window.setTimeout(() => this._doValidate(model.uri, modeId), 500);
			});

			this._doValidate(model.uri, modeId);
		};

		const onModelRemoved = (model: monaco.editor.IModel): void => {
			monaco.editor.setModelMarkers(model, this._languageId, []);

			let uriStr = model.uri.toString();
			let listener = this._listener[uriStr];
			if (listener) {
				listener.dispose();
				delete this._listener[uriStr];
			}
		};

		this._disposables.push(monaco.editor.onDidCreateModel(onModelAdd));
		this._disposables.push(monaco.editor.onWillDisposeModel(onModelRemoved));
		this._disposables.push(monaco.editor.onDidChangeModelLanguage(event => {
			onModelRemoved(event.model);
			onModelAdd(event.model);
		}));

		defaults.onDidChange(_ => {
			monaco.editor.getModels().forEach(model => {
				if (model.getModeId() === this._languageId) {
					onModelRemoved(model);
					onModelAdd(model);
				}
			});
		});

		this._disposables.push({
			dispose: () => {
				for (let key in this._listener) {
					this._listener[key].dispose();
				}
			}
		});

		monaco.editor.getModels().forEach(onModelAdd);
	}

	public dispose(): void {
		this._disposables.forEach(d => d && d.dispose());
		this._disposables = [];
	}

	private _doValidate(resource: Uri, languageId: string): void {
		this._worker(resource).then(worker => {
			return worker.doValidation(resource.toString());
		}).then(diagnostics => {
			const markers = diagnostics.map(d => toDiagnostics(resource, d));
			let model = monaco.editor.getModel(resource);
			if (model.getModeId() === languageId) {
				monaco.editor.setModelMarkers(model, languageId, markers);
			}
		}).then(undefined, err => {
			console.error(err);
		});
	}
}


function toSeverity(lsSeverity: number): monaco.MarkerSeverity {
	switch (lsSeverity) {
		case cssService.DiagnosticSeverity.Error: return monaco.MarkerSeverity.Error;
		case cssService.DiagnosticSeverity.Warning: return monaco.MarkerSeverity.Warning;
		case cssService.DiagnosticSeverity.Information: return monaco.MarkerSeverity.Info;
		case cssService.DiagnosticSeverity.Hint: return monaco.MarkerSeverity.Hint;
		default:
			return monaco.MarkerSeverity.Info;
	}
}

function toDiagnostics(resource: Uri, diag: cssService.Diagnostic): monaco.editor.IMarkerData {
	let code = typeof diag.code === 'number' ? String(diag.code) : <string>diag.code;

	return {
		severity: toSeverity(diag.severity),
		startLineNumber: diag.range.start.line + 1,
		startColumn: diag.range.start.character + 1,
		endLineNumber: diag.range.end.line + 1,
		endColumn: diag.range.end.character + 1,
		message: diag.message,
		code: code,
		source: diag.source
	};
}

// --- completion ------

function fromPosition(position: Position): cssService.Position {
	if (!position) {
		return void 0;
	}
	return { character: position.column - 1, line: position.lineNumber - 1 };
}

function fromRange(range: IRange): cssService.Range {
	if (!range) {
		return void 0;
	}
	return { start: { line: range.startLineNumber - 1, character: range.startColumn - 1 }, end: { line: range.endLineNumber - 1, character: range.endColumn - 1 } };
}

function toRange(range: cssService.Range): Range {
	if (!range) {
		return void 0;
	}
	return new monaco.Range(range.start.line + 1, range.start.character + 1, range.end.line + 1, range.end.character + 1);
}

function toCompletionItemKind(kind: number): monaco.languages.CompletionItemKind {
	let mItemKind = monaco.languages.CompletionItemKind;

	switch (kind) {
		case cssService.CompletionItemKind.Text: return mItemKind.Text;
		case cssService.CompletionItemKind.Method: return mItemKind.Method;
		case cssService.CompletionItemKind.Function: return mItemKind.Function;
		case cssService.CompletionItemKind.Constructor: return mItemKind.Constructor;
		case cssService.CompletionItemKind.Field: return mItemKind.Field;
		case cssService.CompletionItemKind.Variable: return mItemKind.Variable;
		case cssService.CompletionItemKind.Class: return mItemKind.Class;
		case cssService.CompletionItemKind.Interface: return mItemKind.Interface;
		case cssService.CompletionItemKind.Module: return mItemKind.Module;
		case cssService.CompletionItemKind.Property: return mItemKind.Property;
		case cssService.CompletionItemKind.Unit: return mItemKind.Unit;
		case cssService.CompletionItemKind.Value: return mItemKind.Value;
		case cssService.CompletionItemKind.Enum: return mItemKind.Enum;
		case cssService.CompletionItemKind.Keyword: return mItemKind.Keyword;
		case cssService.CompletionItemKind.Snippet: return mItemKind.Snippet;
		case cssService.CompletionItemKind.Color: return mItemKind.Color;
		case cssService.CompletionItemKind.File: return mItemKind.File;
		case cssService.CompletionItemKind.Reference: return mItemKind.Reference;
	}
	return mItemKind.Property;
}

function toTextEdit(textEdit: cssService.TextEdit): monaco.editor.ISingleEditOperation {
	if (!textEdit) {
		return void 0;
	}
	return {
		range: toRange(textEdit.range),
		text: textEdit.newText
	}
}

export class CompletionAdapter implements monaco.languages.CompletionItemProvider {

	constructor(private _worker: WorkerAccessor) {
	}

	public get triggerCharacters(): string[] {
		return [' ', ':'];
	}

	provideCompletionItems(model: monaco.editor.IReadOnlyModel, position: Position, context: monaco.languages.CompletionContext, token: CancellationToken): Thenable<monaco.languages.CompletionList> {
		const resource = model.uri;

		return this._worker(resource).then(worker => {
			return worker.doComplete(resource.toString(), fromPosition(position));
		}).then(info => {
			if (!info) {
				return;
			}
			const wordInfo = model.getWordUntilPosition(position);
			const wordRange = new Range(position.lineNumber, wordInfo.startColumn, position.lineNumber, wordInfo.endColumn);

			let items: monaco.languages.CompletionItem[] = info.items.map(entry => {
				let item: monaco.languages.CompletionItem = {
					label: entry.label,
					insertText: entry.insertText || entry.label,
					sortText: entry.sortText,
					filterText: entry.filterText,
					documentation: entry.documentation,
					detail: entry.detail,
					range: wordRange,
					kind: toCompletionItemKind(entry.kind),
				};
				if (entry.textEdit) {
					item.range = toRange(entry.textEdit.range);
					item.insertText = entry.textEdit.newText;
				}
				if (entry.additionalTextEdits) {
					item.additionalTextEdits = entry.additionalTextEdits.map(toTextEdit)
				}
				if (entry.insertTextFormat === cssService.InsertTextFormat.Snippet) {
					item.insertTextRules = monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;
				}
				return item;
			});

			return {
				isIncomplete: info.isIncomplete,
				suggestions: items
			};
		});
	}
}


function isMarkupContent(thing: any): thing is cssService.MarkupContent {
	return thing && typeof thing === 'object' && typeof (<cssService.MarkupContent>thing).kind === 'string';
}

function toMarkdownString(entry: cssService.MarkupContent | cssService.MarkedString): monaco.IMarkdownString {
	if (typeof entry === 'string') {
		return {
			value: entry
		};
	}
	if (isMarkupContent(entry)) {
		if (entry.kind === 'plaintext') {
			return {
				value: entry.value.replace(/[\\`*_{}[\]()#+\-.!]/g, '\\$&')
			};
		}
		return {
			value: entry.value
		};
	}

	return { value: '```' + entry.language + '\n' + entry.value + '\n```\n' };
}

function toMarkedStringArray(contents: cssService.MarkupContent | cssService.MarkedString | cssService.MarkedString[]): monaco.IMarkdownString[] {
	if (!contents) {
		return void 0;
	}
	if (Array.isArray(contents)) {
		return contents.map(toMarkdownString);
	}
	return [toMarkdownString(contents)];
}


// --- hover ------

export class HoverAdapter implements monaco.languages.HoverProvider {

	constructor(private _worker: WorkerAccessor) {
	}

	provideHover(model: monaco.editor.IReadOnlyModel, position: Position, token: CancellationToken): Thenable<monaco.languages.Hover> {
		let resource = model.uri;

		return this._worker(resource).then(worker => {
			return worker.doHover(resource.toString(), fromPosition(position));
		}).then(info => {
			if (!info) {
				return;
			}
			return <monaco.languages.Hover>{
				range: toRange(info.range),
				contents: toMarkedStringArray(info.contents)
			};
		});
	}
}

// --- document highlights ------

function toDocumentHighlightKind(kind: number): monaco.languages.DocumentHighlightKind {
	switch (kind) {
		case cssService.DocumentHighlightKind.Read: return monaco.languages.DocumentHighlightKind.Read;
		case cssService.DocumentHighlightKind.Write: return monaco.languages.DocumentHighlightKind.Write;
		case cssService.DocumentHighlightKind.Text: return monaco.languages.DocumentHighlightKind.Text;
	}
	return monaco.languages.DocumentHighlightKind.Text;
}


export class DocumentHighlightAdapter implements monaco.languages.DocumentHighlightProvider {

	constructor(private _worker: WorkerAccessor) {
	}

	public provideDocumentHighlights(model: monaco.editor.IReadOnlyModel, position: Position, token: CancellationToken): Thenable<monaco.languages.DocumentHighlight[]> {
		const resource = model.uri;

		return this._worker(resource).then(worker => {
			return worker.findDocumentHighlights(resource.toString(), fromPosition(position))
		}).then(entries => {
			if (!entries) {
				return;
			}
			return entries.map(entry => {
				return <monaco.languages.DocumentHighlight>{
					range: toRange(entry.range),
					kind: toDocumentHighlightKind(entry.kind)
				};
			});
		});
	}
}

// --- definition ------

function toLocation(location: cssService.Location): monaco.languages.Location {
	return {
		uri: Uri.parse(location.uri),
		range: toRange(location.range)
	};
}

export class DefinitionAdapter {

	constructor(private _worker: WorkerAccessor) {
	}

	public provideDefinition(model: monaco.editor.IReadOnlyModel, position: Position, token: CancellationToken): Thenable<monaco.languages.Definition> {
		const resource = model.uri;

		return this._worker(resource).then(worker => {
			return worker.findDefinition(resource.toString(), fromPosition(position));
		}).then(definition => {
			if (!definition) {
				return;
			}
			return [toLocation(definition)];
		});
	}
}

// --- references ------

export class ReferenceAdapter implements monaco.languages.ReferenceProvider {

	constructor(private _worker: WorkerAccessor) {
	}

	provideReferences(model: monaco.editor.IReadOnlyModel, position: Position, context: monaco.languages.ReferenceContext, token: CancellationToken): Thenable<monaco.languages.Location[]> {
		const resource = model.uri;

		return this._worker(resource).then(worker => {
			return worker.findReferences(resource.toString(), fromPosition(position));
		}).then(entries => {
			if (!entries) {
				return;
			}
			return entries.map(toLocation);
		});
	}
}

// --- rename ------

function toWorkspaceEdit(edit: cssService.WorkspaceEdit): monaco.languages.WorkspaceEdit {
	if (!edit || !edit.changes) {
		return void 0;
	}
	let resourceEdits: monaco.languages.ResourceTextEdit[] = [];
	for (let uri in edit.changes) {
		let edits: monaco.languages.TextEdit[] = [];
		for (let e of edit.changes[uri]) {
			edits.push({
				range: toRange(e.range),
				text: e.newText
			});
		}
		resourceEdits.push({ resource: Uri.parse(uri), edits: edits });
	}
	return {
		edits: resourceEdits
	}
}


export class RenameAdapter implements monaco.languages.RenameProvider {

	constructor(private _worker: WorkerAccessor) {
	}

	provideRenameEdits(model: monaco.editor.IReadOnlyModel, position: Position, newName: string, token: CancellationToken): Thenable<monaco.languages.WorkspaceEdit> {
		const resource = model.uri;

		return this._worker(resource).then(worker => {
			return worker.doRename(resource.toString(), fromPosition(position), newName);
		}).then(edit => {
			return toWorkspaceEdit(edit);
		});
	}
}

// --- document symbols ------

function toSymbolKind(kind: cssService.SymbolKind): monaco.languages.SymbolKind {
	let mKind = monaco.languages.SymbolKind;

	switch (kind) {
		case cssService.SymbolKind.File: return mKind.Array;
		case cssService.SymbolKind.Module: return mKind.Module;
		case cssService.SymbolKind.Namespace: return mKind.Namespace;
		case cssService.SymbolKind.Package: return mKind.Package;
		case cssService.SymbolKind.Class: return mKind.Class;
		case cssService.SymbolKind.Method: return mKind.Method;
		case cssService.SymbolKind.Property: return mKind.Property;
		case cssService.SymbolKind.Field: return mKind.Field;
		case cssService.SymbolKind.Constructor: return mKind.Constructor;
		case cssService.SymbolKind.Enum: return mKind.Enum;
		case cssService.SymbolKind.Interface: return mKind.Interface;
		case cssService.SymbolKind.Function: return mKind.Function;
		case cssService.SymbolKind.Variable: return mKind.Variable;
		case cssService.SymbolKind.Constant: return mKind.Constant;
		case cssService.SymbolKind.String: return mKind.String;
		case cssService.SymbolKind.Number: return mKind.Number;
		case cssService.SymbolKind.Boolean: return mKind.Boolean;
		case cssService.SymbolKind.Array: return mKind.Array;
	}
	return mKind.Function;
}


export class DocumentSymbolAdapter implements monaco.languages.DocumentSymbolProvider {

	constructor(private _worker: WorkerAccessor) {
	}

	public provideDocumentSymbols(model: monaco.editor.IReadOnlyModel, token: CancellationToken): Thenable<monaco.languages.DocumentSymbol[]> {
		const resource = model.uri;

		return this._worker(resource).then(worker => worker.findDocumentSymbols(resource.toString())).then(items => {
			if (!items) {
				return;
			}
			return items.map(item => ({
				name: item.name,
				detail: '',
				containerName: item.containerName,
				kind: toSymbolKind(item.kind),
				tags: [],
				range: toRange(item.location.range),
				selectionRange: toRange(item.location.range)
			}));
		});
	}
}

export class DocumentColorAdapter implements monaco.languages.DocumentColorProvider {

	constructor(private _worker: WorkerAccessor) {
	}

	public provideDocumentColors(model: monaco.editor.IReadOnlyModel, token: CancellationToken): Thenable<monaco.languages.IColorInformation[]> {
		const resource = model.uri;

		return this._worker(resource).then(worker => worker.findDocumentColors(resource.toString())).then(infos => {
			if (!infos) {
				return;
			}
			return infos.map(item => ({
				color: item.color,
				range: toRange(item.range)
			}));
		});
	}

	public provideColorPresentations(model: monaco.editor.IReadOnlyModel, info: monaco.languages.IColorInformation, token: CancellationToken): Thenable<monaco.languages.IColorPresentation[]> {
		const resource = model.uri;

		return this._worker(resource).then(worker => worker.getColorPresentations(resource.toString(), info.color, fromRange(info.range))).then(presentations => {
			if (!presentations) {
				return;
			}
			return presentations.map(presentation => {
				let item: monaco.languages.IColorPresentation = {
					label: presentation.label,
				};
				if (presentation.textEdit) {
					item.textEdit = toTextEdit(presentation.textEdit)
				}
				if (presentation.additionalTextEdits) {
					item.additionalTextEdits = presentation.additionalTextEdits.map(toTextEdit)
				}
				return item;
			});
		});
	}
}

export class FoldingRangeAdapter implements monaco.languages.FoldingRangeProvider {

	constructor(private _worker: WorkerAccessor) {
	}

	public provideFoldingRanges(model: monaco.editor.IReadOnlyModel, context: monaco.languages.FoldingContext, token: CancellationToken): Thenable<monaco.languages.FoldingRange[]> {
		const resource = model.uri;

		return this._worker(resource).then(worker => worker.getFoldingRanges(resource.toString(), context)).then(ranges => {
			if (!ranges) {
				return;
			}
			return ranges.map(range => {
				let result: monaco.languages.FoldingRange = {
					start: range.startLine + 1,
					end: range.endLine + 1
				};
				if (typeof range.kind !== 'undefined') {
					result.kind = toFoldingRangeKind(<cssService.FoldingRangeKind>range.kind);
				}
				return result;
			});
		});
	}

}

function toFoldingRangeKind(kind: cssService.FoldingRangeKind): monaco.languages.FoldingRangeKind {
	switch (kind) {
		case cssService.FoldingRangeKind.Comment: return monaco.languages.FoldingRangeKind.Comment;
		case cssService.FoldingRangeKind.Imports: return monaco.languages.FoldingRangeKind.Imports;
		case cssService.FoldingRangeKind.Region: return monaco.languages.FoldingRangeKind.Region;
	}
}

export class SelectionRangeAdapter implements monaco.languages.SelectionRangeProvider {

	constructor(private _worker: WorkerAccessor) {
	}

	public provideSelectionRanges(model: monaco.editor.IReadOnlyModel, positions: Position[], token: CancellationToken): Thenable<monaco.languages.SelectionRange[][]> {
		const resource = model.uri;

		return this._worker(resource).then(worker => worker.getSelectionRanges(resource.toString(), positions.map(fromPosition))).then(selectionRanges => {
			if (!selectionRanges) {
				return;
			}
			return selectionRanges.map(selectionRange => {
				const result: monaco.languages.SelectionRange[] = [];
				while (selectionRange) {
					result.push({ range: toRange(selectionRange.range) });
					selectionRange = selectionRange.parent;
				}
				return result;
			});
		});
	}

}
