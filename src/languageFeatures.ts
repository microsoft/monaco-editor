/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { LanguageServiceDefaultsImpl } from './monaco.contribution';
import { JSONWorker } from './jsonWorker';

import * as jsonService from 'vscode-json-languageservice';

import Uri = monaco.Uri;
import Position = monaco.Position;
import Range = monaco.Range;
import IRange = monaco.IRange;
import Thenable = monaco.Thenable;
import CancellationToken = monaco.CancellationToken;
import IDisposable = monaco.IDisposable;


export interface WorkerAccessor {
	(...more: Uri[]): Thenable<JSONWorker>
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
				clearTimeout(handle);
				handle = setTimeout(() => this._doValidate(model.uri, modeId), 500);
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
		this._disposables.push(monaco.editor.onWillDisposeModel(model => {
			onModelRemoved(model);
			this._resetSchema(model.uri);
		}));
		this._disposables.push(monaco.editor.onDidChangeModelLanguage(event => {
			onModelRemoved(event.model);
			onModelAdd(event.model);
			this._resetSchema(event.model.uri);
		}));

		this._disposables.push(defaults.onDidChange(_ => {
			monaco.editor.getModels().forEach(model => {
				if (model.getModeId() === this._languageId) {
					onModelRemoved(model);
					onModelAdd(model);
				}
			});
		}));

		this._disposables.push({
			dispose: () => {
				monaco.editor.getModels().forEach(onModelRemoved);
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

	private _resetSchema(resource: Uri): void {
		this._worker().then(worker => {
			worker.resetSchema(resource.toString());
		});
	}

	private _doValidate(resource: Uri, languageId: string): void {
		this._worker(resource).then(worker => {
			return worker.doValidation(resource.toString()).then(diagnostics => {
				const markers = diagnostics.map(d => toDiagnostics(resource, d));
				let model = monaco.editor.getModel(resource);
				if (model && model.getModeId() === languageId) {
					monaco.editor.setModelMarkers(model, languageId, markers);
				}
			});
		}).then(undefined, err => {
			console.error(err);
		});
	}
}


function toSeverity(lsSeverity: number): monaco.MarkerSeverity {
	switch (lsSeverity) {
		case jsonService.DiagnosticSeverity.Error: return monaco.MarkerSeverity.Error;
		case jsonService.DiagnosticSeverity.Warning: return monaco.MarkerSeverity.Warning;
		case jsonService.DiagnosticSeverity.Information: return monaco.MarkerSeverity.Info;
		case jsonService.DiagnosticSeverity.Hint: return monaco.MarkerSeverity.Hint;
		default:
			return monaco.MarkerSeverity.Info;
	}
}

function toDiagnostics(resource: Uri, diag: jsonService.Diagnostic): monaco.editor.IMarkerData {
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

function fromPosition(position: Position): jsonService.Position {
	if (!position) {
		return void 0;
	}
	return { character: position.column - 1, line: position.lineNumber - 1 };
}

function fromRange(range: IRange): jsonService.Range {
	if (!range) {
		return void 0;
	}
	return { start: { line: range.startLineNumber - 1, character: range.startColumn - 1 }, end: { line: range.endLineNumber - 1, character: range.endColumn - 1 } };
}
function toRange(range: jsonService.Range): Range {
	if (!range) {
		return void 0;
	}
	return new Range(range.start.line + 1, range.start.character + 1, range.end.line + 1, range.end.character + 1);
}

function toCompletionItemKind(kind: number): monaco.languages.CompletionItemKind {
	let mItemKind = monaco.languages.CompletionItemKind;

	switch (kind) {
		case jsonService.CompletionItemKind.Text: return mItemKind.Text;
		case jsonService.CompletionItemKind.Method: return mItemKind.Method;
		case jsonService.CompletionItemKind.Function: return mItemKind.Function;
		case jsonService.CompletionItemKind.Constructor: return mItemKind.Constructor;
		case jsonService.CompletionItemKind.Field: return mItemKind.Field;
		case jsonService.CompletionItemKind.Variable: return mItemKind.Variable;
		case jsonService.CompletionItemKind.Class: return mItemKind.Class;
		case jsonService.CompletionItemKind.Interface: return mItemKind.Interface;
		case jsonService.CompletionItemKind.Module: return mItemKind.Module;
		case jsonService.CompletionItemKind.Property: return mItemKind.Property;
		case jsonService.CompletionItemKind.Unit: return mItemKind.Unit;
		case jsonService.CompletionItemKind.Value: return mItemKind.Value;
		case jsonService.CompletionItemKind.Enum: return mItemKind.Enum;
		case jsonService.CompletionItemKind.Keyword: return mItemKind.Keyword;
		case jsonService.CompletionItemKind.Snippet: return mItemKind.Snippet;
		case jsonService.CompletionItemKind.Color: return mItemKind.Color;
		case jsonService.CompletionItemKind.File: return mItemKind.File;
		case jsonService.CompletionItemKind.Reference: return mItemKind.Reference;
	}
	return mItemKind.Property;
}

function fromCompletionItemKind(kind: monaco.languages.CompletionItemKind): jsonService.CompletionItemKind {
	let mItemKind = monaco.languages.CompletionItemKind;

	switch (kind) {
		case mItemKind.Text: return jsonService.CompletionItemKind.Text;
		case mItemKind.Method: return jsonService.CompletionItemKind.Method;
		case mItemKind.Function: return jsonService.CompletionItemKind.Function;
		case mItemKind.Constructor: return jsonService.CompletionItemKind.Constructor;
		case mItemKind.Field: return jsonService.CompletionItemKind.Field;
		case mItemKind.Variable: return jsonService.CompletionItemKind.Variable;
		case mItemKind.Class: return jsonService.CompletionItemKind.Class;
		case mItemKind.Interface: return jsonService.CompletionItemKind.Interface;
		case mItemKind.Module: return jsonService.CompletionItemKind.Module;
		case mItemKind.Property: return jsonService.CompletionItemKind.Property;
		case mItemKind.Unit: return jsonService.CompletionItemKind.Unit;
		case mItemKind.Value: return jsonService.CompletionItemKind.Value;
		case mItemKind.Enum: return jsonService.CompletionItemKind.Enum;
		case mItemKind.Keyword: return jsonService.CompletionItemKind.Keyword;
		case mItemKind.Snippet: return jsonService.CompletionItemKind.Snippet;
		case mItemKind.Color: return jsonService.CompletionItemKind.Color;
		case mItemKind.File: return jsonService.CompletionItemKind.File;
		case mItemKind.Reference: return jsonService.CompletionItemKind.Reference;
	}
	return jsonService.CompletionItemKind.Property;
}

function toTextEdit(textEdit: jsonService.TextEdit): monaco.editor.ISingleEditOperation {
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
				if (entry.insertTextFormat === jsonService.InsertTextFormat.Snippet) {
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

function isMarkupContent(thing: any): thing is jsonService.MarkupContent {
	return thing && typeof thing === 'object' && typeof (<jsonService.MarkupContent>thing).kind === 'string';
}

function toMarkdownString(entry: jsonService.MarkupContent | jsonService.MarkedString): monaco.IMarkdownString {
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

function toMarkedStringArray(contents: jsonService.MarkupContent | jsonService.MarkedString | jsonService.MarkedString[]): monaco.IMarkdownString[] {
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

// --- definition ------

function toLocation(location: jsonService.Location): monaco.languages.Location {
	return {
		uri: Uri.parse(location.uri),
		range: toRange(location.range)
	};
}


// --- document symbols ------

function toSymbolKind(kind: jsonService.SymbolKind): monaco.languages.SymbolKind {
	let mKind = monaco.languages.SymbolKind;

	switch (kind) {
		case jsonService.SymbolKind.File: return mKind.Array;
		case jsonService.SymbolKind.Module: return mKind.Module;
		case jsonService.SymbolKind.Namespace: return mKind.Namespace;
		case jsonService.SymbolKind.Package: return mKind.Package;
		case jsonService.SymbolKind.Class: return mKind.Class;
		case jsonService.SymbolKind.Method: return mKind.Method;
		case jsonService.SymbolKind.Property: return mKind.Property;
		case jsonService.SymbolKind.Field: return mKind.Field;
		case jsonService.SymbolKind.Constructor: return mKind.Constructor;
		case jsonService.SymbolKind.Enum: return mKind.Enum;
		case jsonService.SymbolKind.Interface: return mKind.Interface;
		case jsonService.SymbolKind.Function: return mKind.Function;
		case jsonService.SymbolKind.Variable: return mKind.Variable;
		case jsonService.SymbolKind.Constant: return mKind.Constant;
		case jsonService.SymbolKind.String: return mKind.String;
		case jsonService.SymbolKind.Number: return mKind.Number;
		case jsonService.SymbolKind.Boolean: return mKind.Boolean;
		case jsonService.SymbolKind.Array: return mKind.Array;
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
				range: toRange(item.location.range),
				selectionRange: toRange(item.location.range),
				tags: []
			}));
		});
	}
}


function fromFormattingOptions(options: monaco.languages.FormattingOptions): jsonService.FormattingOptions {
	return {
		tabSize: options.tabSize,
		insertSpaces: options.insertSpaces
	};
}

export class DocumentFormattingEditProvider implements monaco.languages.DocumentFormattingEditProvider {

	constructor(private _worker: WorkerAccessor) {
	}

	public provideDocumentFormattingEdits(model: monaco.editor.IReadOnlyModel, options: monaco.languages.FormattingOptions, token: CancellationToken): Thenable<monaco.editor.ISingleEditOperation[]> {
		const resource = model.uri;

		return this._worker(resource).then(worker => {
			return worker.format(resource.toString(), null, fromFormattingOptions(options)).then(edits => {
				if (!edits || edits.length === 0) {
					return;
				}
				return edits.map(toTextEdit);
			});
		});
	}
}

export class DocumentRangeFormattingEditProvider implements monaco.languages.DocumentRangeFormattingEditProvider {

	constructor(private _worker: WorkerAccessor) {
	}

	public provideDocumentRangeFormattingEdits(model: monaco.editor.IReadOnlyModel, range: Range, options: monaco.languages.FormattingOptions, token: CancellationToken): Thenable<monaco.editor.ISingleEditOperation[]> {
		const resource = model.uri;

		return this._worker(resource).then(worker => {
			return worker.format(resource.toString(), fromRange(range), fromFormattingOptions(options)).then(edits => {
				if (!edits || edits.length === 0) {
					return;
				}
				return edits.map(toTextEdit);
			});
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
					result.kind = toFoldingRangeKind(<jsonService.FoldingRangeKind>range.kind);
				}
				return result;
			});
		});
	}

}

function toFoldingRangeKind(kind: jsonService.FoldingRangeKind): monaco.languages.FoldingRangeKind {
	switch (kind) {
		case jsonService.FoldingRangeKind.Comment: return monaco.languages.FoldingRangeKind.Comment;
		case jsonService.FoldingRangeKind.Imports: return monaco.languages.FoldingRangeKind.Imports;
		case jsonService.FoldingRangeKind.Region: return monaco.languages.FoldingRangeKind.Region;
	}
	return void 0;
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
