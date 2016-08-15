/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import {LanguageServiceDefaultsImpl} from './monaco.contribution';
import {CSSWorker} from './cssWorker';

import * as ls from 'vscode-languageserver-types';

import Uri = monaco.Uri;
import Position = monaco.Position;
import Range = monaco.Range;
import Thenable = monaco.Thenable;
import Promise = monaco.Promise;
import CancellationToken = monaco.CancellationToken;
import IDisposable = monaco.IDisposable;


export interface WorkerAccessor {
	(first: Uri, ...more: Uri[]): Promise<CSSWorker>
}

// --- diagnostics --- ---

export class DiagnostcsAdapter {

	private _disposables: IDisposable[] = [];
	private _listener: { [uri: string]: IDisposable } = Object.create(null);

	constructor(private _languageId: string, private _worker: WorkerAccessor) {
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
			delete this._listener[model.uri.toString()];
		};

		this._disposables.push(monaco.editor.onDidCreateModel(onModelAdd));
		this._disposables.push(monaco.editor.onWillDisposeModel(onModelRemoved));
		this._disposables.push(monaco.editor.onDidChangeModelLanguage(event => {
			onModelRemoved(event.model);
			onModelAdd(event.model);
		}));

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
			monaco.editor.setModelMarkers(monaco.editor.getModel(resource), languageId, markers);
		}).done(undefined, err => {
			console.error(err);
		});
	}
}


function toSeverity(lsSeverity: number): monaco.Severity {
	switch (lsSeverity) {
		case ls.DiagnosticSeverity.Error: return monaco.Severity.Error;
		case ls.DiagnosticSeverity.Warning: return monaco.Severity.Warning;
		case ls.DiagnosticSeverity.Information:
		case ls.DiagnosticSeverity.Hint:
		default:
			return monaco.Severity.Info;
	}
}

function toDiagnostics(resource: Uri, diag: ls.Diagnostic): monaco.editor.IMarkerData {
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
	let mItemKind = monaco.languages.CompletionItemKind;

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
		return [' ', ':'];
	}

	provideCompletionItems(model: monaco.editor.IReadOnlyModel, position: Position, token: CancellationToken): Thenable<monaco.languages.CompletionList> {
		const wordInfo = model.getWordUntilPosition(position);
		const resource = model.uri;

		return wireCancellationToken(token, this._worker(resource).then(worker => {
			return worker.doComplete(resource.toString(), fromPosition(position));
		}).then(info => {
			if (!info) {
				return;
			}
			let items: monaco.languages.CompletionItem[] = info.items.map(entry => {
				return {
					label: entry.label,
					insertText: entry.insertText,
					sortText: entry.sortText,
					filterText: entry.filterText,
					documentation: entry.documentation,
					detail: entry.detail,
					kind: toCompletionItemKind(entry.kind),
					textEdit: toTextEdit(entry.textEdit)
				};
			});

			return {
				isIncomplete: info.isIncomplete,
				items: items
			};
		}));
	}
}

function toMarkedStringArray(contents: ls.MarkedString | ls.MarkedString[]): monaco.MarkedString[] {
	if (!contents) {
		return void 0;
	}
	if (Array.isArray(contents)) {
		return (<ls.MarkedString[]>contents);
	}
	return [<ls.MarkedString>contents];
}


// --- hover ------

export class HoverAdapter implements monaco.languages.HoverProvider {

	constructor(private _worker: WorkerAccessor) {
	}

	provideHover(model: monaco.editor.IReadOnlyModel, position: Position, token: CancellationToken): Thenable<monaco.languages.Hover> {
		let resource = model.uri;

		return wireCancellationToken(token, this._worker(resource).then(worker => {
			return worker.doHover(resource.toString(), fromPosition(position));
		}).then(info => {
			if (!info) {
				return;
			}
			return <monaco.languages.Hover>{
				range: toRange(info.range),
				contents: toMarkedStringArray(info.contents)
			};
		}));
	}
}

// --- document highlights ------

function toDocumentHighlightKind(kind: number): monaco.languages.DocumentHighlightKind {
	switch (kind) {
		case ls.DocumentHighlightKind.Read: return monaco.languages.DocumentHighlightKind.Read;
		case ls.DocumentHighlightKind.Write: return monaco.languages.DocumentHighlightKind.Write;
		case ls.DocumentHighlightKind.Text: return monaco.languages.DocumentHighlightKind.Text;
	}
	return monaco.languages.DocumentHighlightKind.Text;
}


export class DocumentHighlightAdapter implements monaco.languages.DocumentHighlightProvider {

	constructor(private _worker: WorkerAccessor) {
	}

	public provideDocumentHighlights(model: monaco.editor.IReadOnlyModel, position: Position, token: CancellationToken): Thenable<monaco.languages.DocumentHighlight[]> {
		const resource = model.uri;

		return wireCancellationToken(token, this._worker(resource).then(worker => {
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
		}));
	}
}

// --- definition ------

function toLocation(location: ls.Location): monaco.languages.Location {
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

		return wireCancellationToken(token, this._worker(resource).then(worker => {
			return worker.findDefinition(resource.toString(), fromPosition(position));
		}).then(definition => {
			if (!definition) {
				return;
			}
			return [toLocation(definition)];
		}));
	}
}

// --- references ------

export class ReferenceAdapter implements monaco.languages.ReferenceProvider {

	constructor(private _worker: WorkerAccessor) {
	}

	provideReferences(model: monaco.editor.IReadOnlyModel, position: Position, context: monaco.languages.ReferenceContext, token: CancellationToken): Thenable<monaco.languages.Location[]> {
		const resource = model.uri;

		return wireCancellationToken(token, this._worker(resource).then(worker => {
			return worker.findReferences(resource.toString(), fromPosition(position));
		}).then(entries => {
			if (!entries) {
				return;
			}
			return entries.map(toLocation);
		}));
	}
}

// --- rename ------

function toWorkspaceEdit(edit: ls.WorkspaceEdit): monaco.languages.WorkspaceEdit {
	if (!edit || !edit.changes) {
		return void 0;
	}
	let resourceEdits: monaco.languages.IResourceEdit[] = [];
	for (let uri in edit.changes) {
		let edits = edit.changes[uri];
		for (let e of edits) {
			resourceEdits.push({ resource: Uri.parse(uri), range: toRange(e.range), newText: e.newText });
		}

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

		return wireCancellationToken(token, this._worker(resource).then(worker => {
			return worker.doRename(resource.toString(), fromPosition(position), newName);
		}).then(edit => {
			return toWorkspaceEdit(edit);
		}));
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

	public provideDocumentSymbols(model: monaco.editor.IReadOnlyModel, token: CancellationToken): Thenable<monaco.languages.SymbolInformation[]> {
		const resource = model.uri;

		return wireCancellationToken(token, this._worker(resource).then(worker => worker.findDocumentSymbols(resource.toString())).then(items => {
			if (!items) {
				return;
			}
			return items.map(item => ({
				name: item.name,
				containerName: item.containerName,
				kind: toSymbolKind(item.kind),
				location: toLocation(item.location)
			}));
		}));
	}
}

/**
 * Hook a cancellation token to a WinJS Promise
 */
function wireCancellationToken<T>(token: CancellationToken, promise: Promise<T>): Thenable<T> {
	token.onCancellationRequested(() => promise.cancel());
	return promise;
}
