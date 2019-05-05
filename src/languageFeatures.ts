/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { LanguageServiceDefaultsImpl } from './monaco.contribution';
import { HTMLWorker } from './htmlWorker';

import * as ls from 'vscode-languageserver-types';

import Uri = monaco.Uri;
import Position = monaco.Position;
import Range = monaco.Range;
import Thenable = monaco.Thenable;
import CancellationToken = monaco.CancellationToken;
import IDisposable = monaco.IDisposable;


export interface WorkerAccessor {
	(...more: Uri[]): Thenable<HTMLWorker>
}

// --- diagnostics --- ---

export class DiagnosticsAdapter {

	private _disposables: IDisposable[] = [];
	private _listener: { [uri: string]: IDisposable } = Object.create(null);

	constructor(private _languageId: string, private _worker: WorkerAccessor, defaults: LanguageServiceDefaultsImpl) {
		const onModelAdd = (model: monaco.editor.IModel): void => {
			const modeId = model.getModeId();
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
			const uriStr = model.uri.toString();
			const listener = this._listener[uriStr];
			if (listener) {
				listener.dispose();
				delete this._listener[uriStr];
			}
		};

		this._disposables.push(monaco.editor.onDidCreateModel(onModelAdd));
		this._disposables.push(monaco.editor.onWillDisposeModel(model => {
			onModelRemoved(model);
		}));
		this._disposables.push(monaco.editor.onDidChangeModelLanguage(event => {
			onModelRemoved(event.model);
			onModelAdd(event.model);
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
				for (const key in this._listener) {
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
			return worker.doValidation(resource.toString()).then(diagnostics => {
				const markers = diagnostics.map(d => toDiagnostics(resource, d));
				monaco.editor.setModelMarkers(monaco.editor.getModel(resource), languageId, markers);
			});
		}).then(undefined, err => {
			console.error(err);
		});
	}
}


function toSeverity(lsSeverity: number): monaco.MarkerSeverity {
	switch (lsSeverity) {
		case ls.DiagnosticSeverity.Error: return monaco.MarkerSeverity.Error;
		case ls.DiagnosticSeverity.Warning: return monaco.MarkerSeverity.Warning;
		case ls.DiagnosticSeverity.Information: return monaco.MarkerSeverity.Info;
		case ls.DiagnosticSeverity.Hint: return monaco.MarkerSeverity.Hint;
		default:
			return monaco.MarkerSeverity.Info;
	}
}

function toDiagnostics(resource: Uri, diag: ls.Diagnostic): monaco.editor.IMarkerData {
	const code = typeof diag.code === 'number' ? String(diag.code) : <string>diag.code;

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

function fromPosition(position: Position): ls.Position {
	if (!position) {
		return void 0;
	}
	return { character: position.column - 1, line: position.lineNumber - 1 };
}

function fromRange(range: Range): ls.Range {
	if (!range) {
		return void 0;
	}
	return { start: fromPosition(range.getStartPosition()), end: fromPosition(range.getEndPosition()) };
}

function toRange(range: ls.Range): Range {
	if (!range) {
		return void 0;
	}
	return new Range(range.start.line + 1, range.start.character + 1, range.end.line + 1, range.end.character + 1);
}

function toCompletionItemKind(kind: number): monaco.languages.CompletionItemKind {
	const mItemKind = monaco.languages.CompletionItemKind;

	switch (kind) {
		case ls.CompletionItemKind.Text: return mItemKind.Text;
		case ls.CompletionItemKind.Method: return mItemKind.Method;
		case ls.CompletionItemKind.Function: return mItemKind.Function;
		case ls.CompletionItemKind.Constructor: return mItemKind.Constructor;
		case ls.CompletionItemKind.Field: return mItemKind.Field;
		case ls.CompletionItemKind.Variable: return mItemKind.Variable;
		case ls.CompletionItemKind.Class: return mItemKind.Class;
		case ls.CompletionItemKind.Interface: return mItemKind.Interface;
		case ls.CompletionItemKind.Module: return mItemKind.Module;
		case ls.CompletionItemKind.Property: return mItemKind.Property;
		case ls.CompletionItemKind.Unit: return mItemKind.Unit;
		case ls.CompletionItemKind.Value: return mItemKind.Value;
		case ls.CompletionItemKind.Enum: return mItemKind.Enum;
		case ls.CompletionItemKind.Keyword: return mItemKind.Keyword;
		case ls.CompletionItemKind.Snippet: return mItemKind.Snippet;
		case ls.CompletionItemKind.Color: return mItemKind.Color;
		case ls.CompletionItemKind.File: return mItemKind.File;
		case ls.CompletionItemKind.Reference: return mItemKind.Reference;
	}
	return mItemKind.Property;
}

function fromCompletionItemKind(kind: monaco.languages.CompletionItemKind): ls.CompletionItemKind {
	const mItemKind = monaco.languages.CompletionItemKind;

	switch (kind) {
		case mItemKind.Text: return ls.CompletionItemKind.Text;
		case mItemKind.Method: return ls.CompletionItemKind.Method;
		case mItemKind.Function: return ls.CompletionItemKind.Function;
		case mItemKind.Constructor: return ls.CompletionItemKind.Constructor;
		case mItemKind.Field: return ls.CompletionItemKind.Field;
		case mItemKind.Variable: return ls.CompletionItemKind.Variable;
		case mItemKind.Class: return ls.CompletionItemKind.Class;
		case mItemKind.Interface: return ls.CompletionItemKind.Interface;
		case mItemKind.Module: return ls.CompletionItemKind.Module;
		case mItemKind.Property: return ls.CompletionItemKind.Property;
		case mItemKind.Unit: return ls.CompletionItemKind.Unit;
		case mItemKind.Value: return ls.CompletionItemKind.Value;
		case mItemKind.Enum: return ls.CompletionItemKind.Enum;
		case mItemKind.Keyword: return ls.CompletionItemKind.Keyword;
		case mItemKind.Snippet: return ls.CompletionItemKind.Snippet;
		case mItemKind.Color: return ls.CompletionItemKind.Color;
		case mItemKind.File: return ls.CompletionItemKind.File;
		case mItemKind.Reference: return ls.CompletionItemKind.Reference;
	}
	return ls.CompletionItemKind.Property;
}

function toTextEdit(textEdit: ls.TextEdit): monaco.editor.ISingleEditOperation {
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
		return ['.', ':', '<', '"', '=', '/'];
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

			const items: monaco.languages.CompletionItem[] = info.items.map(entry => {
				const item: monaco.languages.CompletionItem = {
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
				if (entry.insertTextFormat === ls.InsertTextFormat.Snippet) {
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

// --- hover ------

function isMarkupContent(thing: any): thing is ls.MarkupContent {
	return thing && typeof thing === 'object' && typeof (<ls.MarkupContent>thing).kind === 'string';
}

function toMarkdownString(entry: ls.MarkupContent | ls.MarkedString): monaco.IMarkdownString {
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

function toMarkedStringArray(contents: ls.MarkupContent | ls.MarkedString | ls.MarkedString[]): monaco.IMarkdownString[] {
	if (!contents) {
		return void 0;
	}
	if (Array.isArray(contents)) {
		return contents.map(toMarkdownString);
	}
	return [toMarkdownString(contents)];
}

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

function toHighlighKind(kind: ls.DocumentHighlightKind): monaco.languages.DocumentHighlightKind {
	const mKind = monaco.languages.DocumentHighlightKind;

	switch (kind) {
		case ls.DocumentHighlightKind.Read: return mKind.Read;
		case ls.DocumentHighlightKind.Write: return mKind.Write;
		case ls.DocumentHighlightKind.Text: return mKind.Text;
	}
	return mKind.Text;
}


export class DocumentHighlightAdapter implements monaco.languages.DocumentHighlightProvider {

	constructor(private _worker: WorkerAccessor) {
	}

	public provideDocumentHighlights(model: monaco.editor.IReadOnlyModel, position: Position, token: CancellationToken): Thenable<monaco.languages.DocumentHighlight[]> {
		const resource = model.uri;

		return this._worker(resource).then(worker => worker.findDocumentHighlights(resource.toString(), fromPosition(position))).then(items => {
			if (!items) {
				return;
			}
			return items.map(item => ({
				range: toRange(item.range),
				kind: toHighlighKind(item.kind)
			}));
		});
	}
}

// --- document symbols ------

function toSymbolKind(kind: ls.SymbolKind): monaco.languages.SymbolKind {
	let mKind = monaco.languages.SymbolKind;

	switch (kind) {
		case ls.SymbolKind.File: return mKind.Array;
		case ls.SymbolKind.Module: return mKind.Module;
		case ls.SymbolKind.Namespace: return mKind.Namespace;
		case ls.SymbolKind.Package: return mKind.Package;
		case ls.SymbolKind.Class: return mKind.Class;
		case ls.SymbolKind.Method: return mKind.Method;
		case ls.SymbolKind.Property: return mKind.Property;
		case ls.SymbolKind.Field: return mKind.Field;
		case ls.SymbolKind.Constructor: return mKind.Constructor;
		case ls.SymbolKind.Enum: return mKind.Enum;
		case ls.SymbolKind.Interface: return mKind.Interface;
		case ls.SymbolKind.Function: return mKind.Function;
		case ls.SymbolKind.Variable: return mKind.Variable;
		case ls.SymbolKind.Constant: return mKind.Constant;
		case ls.SymbolKind.String: return mKind.String;
		case ls.SymbolKind.Number: return mKind.Number;
		case ls.SymbolKind.Boolean: return mKind.Boolean;
		case ls.SymbolKind.Array: return mKind.Array;
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
				selectionRange: toRange(item.location.range)
			}));
		});
	}
}

export class DocumentLinkAdapter implements monaco.languages.LinkProvider {

	constructor(private _worker: WorkerAccessor) {
	}

	public provideLinks(model: monaco.editor.IReadOnlyModel, token: CancellationToken): Thenable<monaco.languages.ILinksList> {
		const resource = model.uri;

		return this._worker(resource).then(worker => worker.findDocumentLinks(resource.toString())).then(items => {
			if (!items) {
				return;
			}
			return {
				links: items.map(item => ({
					range: toRange(item.range),
					url: item.target
				}))
			};
		});
	}
}


function fromFormattingOptions(options: monaco.languages.FormattingOptions): ls.FormattingOptions {
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

export class FoldingRangeAdapter implements monaco.languages.FoldingRangeProvider {

	constructor(private _worker: WorkerAccessor) {
	}

	public provideFoldingRanges(model: monaco.editor.IReadOnlyModel, context: monaco.languages.FoldingContext, token: CancellationToken): Thenable<monaco.languages.FoldingRange[]> {
		const resource = model.uri;

		return this._worker(resource).then(worker => worker.provideFoldingRanges(resource.toString(), context)).then(ranges => {
			if (!ranges) {
				return;
			}
			return ranges.map(range => {
				const result: monaco.languages.FoldingRange = {
					start: range.startLine + 1,
					end: range.endLine + 1
				};
				if (typeof range.kind !== 'undefined') {
					result.kind = toFoldingRangeKind(<ls.FoldingRangeKind>range.kind);
				}
				return result;
			});
		});
	}

}

function toFoldingRangeKind(kind: ls.FoldingRangeKind): monaco.languages.FoldingRangeKind {
	switch (kind) {
		case ls.FoldingRangeKind.Comment: return monaco.languages.FoldingRangeKind.Comment;
		case ls.FoldingRangeKind.Imports: return monaco.languages.FoldingRangeKind.Imports;
		case ls.FoldingRangeKind.Region: return monaco.languages.FoldingRangeKind.Region;
	}
	return void 0;
}
