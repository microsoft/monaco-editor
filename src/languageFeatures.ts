/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LanguageServiceDefaults } from './monaco.contribution';
import type { HTMLWorker } from './htmlWorker';
import * as htmlService from 'vscode-html-languageservice';
import {
	languages,
	editor,
	Uri,
	Position,
	Range,
	CancellationToken,
	IDisposable,
	MarkerSeverity,
	IMarkdownString
} from './fillers/monaco-editor-core';
import { InsertReplaceEdit, TextEdit } from 'vscode-html-languageservice';

export interface WorkerAccessor {
	(...more: Uri[]): Promise<HTMLWorker>;
}

// --- diagnostics --- ---

export class DiagnosticsAdapter {
	private _disposables: IDisposable[] = [];
	private _listener: { [uri: string]: IDisposable } = Object.create(null);

	constructor(
		private _languageId: string,
		private _worker: WorkerAccessor,
		defaults: LanguageServiceDefaults
	) {
		const onModelAdd = (model: editor.IModel): void => {
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

		const onModelRemoved = (model: editor.IModel): void => {
			editor.setModelMarkers(model, this._languageId, []);
			const uriStr = model.uri.toString();
			const listener = this._listener[uriStr];
			if (listener) {
				listener.dispose();
				delete this._listener[uriStr];
			}
		};

		this._disposables.push(editor.onDidCreateModel(onModelAdd));
		this._disposables.push(
			editor.onWillDisposeModel((model) => {
				onModelRemoved(model);
			})
		);
		this._disposables.push(
			editor.onDidChangeModelLanguage((event) => {
				onModelRemoved(event.model);
				onModelAdd(event.model);
			})
		);

		this._disposables.push(
			defaults.onDidChange((_) => {
				editor.getModels().forEach((model) => {
					if (model.getModeId() === this._languageId) {
						onModelRemoved(model);
						onModelAdd(model);
					}
				});
			})
		);

		this._disposables.push({
			dispose: () => {
				for (const key in this._listener) {
					this._listener[key].dispose();
				}
			}
		});

		editor.getModels().forEach(onModelAdd);
	}

	public dispose(): void {
		this._disposables.forEach((d) => d && d.dispose());
		this._disposables = [];
	}

	private _doValidate(resource: Uri, languageId: string): void {
		this._worker(resource)
			.then((worker) => {
				return worker.doValidation(resource.toString()).then((diagnostics) => {
					const markers = diagnostics.map((d) => toDiagnostics(resource, d));
					editor.setModelMarkers(editor.getModel(resource), languageId, markers);
				});
			})
			.then(undefined, (err) => {
				console.error(err);
			});
	}
}

function toSeverity(lsSeverity: number): MarkerSeverity {
	switch (lsSeverity) {
		case htmlService.DiagnosticSeverity.Error:
			return MarkerSeverity.Error;
		case htmlService.DiagnosticSeverity.Warning:
			return MarkerSeverity.Warning;
		case htmlService.DiagnosticSeverity.Information:
			return MarkerSeverity.Info;
		case htmlService.DiagnosticSeverity.Hint:
			return MarkerSeverity.Hint;
		default:
			return MarkerSeverity.Info;
	}
}

function toDiagnostics(resource: Uri, diag: htmlService.Diagnostic): editor.IMarkerData {
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

function fromPosition(position: Position): htmlService.Position {
	if (!position) {
		return void 0;
	}
	return { character: position.column - 1, line: position.lineNumber - 1 };
}

function fromRange(range: Range): htmlService.Range {
	if (!range) {
		return void 0;
	}
	return {
		start: fromPosition(range.getStartPosition()),
		end: fromPosition(range.getEndPosition())
	};
}

function toRange(range: htmlService.Range): Range {
	if (!range) {
		return void 0;
	}
	return new Range(
		range.start.line + 1,
		range.start.character + 1,
		range.end.line + 1,
		range.end.character + 1
	);
}

function isInsertReplaceEdit(edit: TextEdit | InsertReplaceEdit): edit is InsertReplaceEdit {
	return (
		typeof (<InsertReplaceEdit>edit).insert !== 'undefined' &&
		typeof (<InsertReplaceEdit>edit).replace !== 'undefined'
	);
}

function toCompletionItemKind(kind: number): languages.CompletionItemKind {
	const mItemKind = languages.CompletionItemKind;

	switch (kind) {
		case htmlService.CompletionItemKind.Text:
			return mItemKind.Text;
		case htmlService.CompletionItemKind.Method:
			return mItemKind.Method;
		case htmlService.CompletionItemKind.Function:
			return mItemKind.Function;
		case htmlService.CompletionItemKind.Constructor:
			return mItemKind.Constructor;
		case htmlService.CompletionItemKind.Field:
			return mItemKind.Field;
		case htmlService.CompletionItemKind.Variable:
			return mItemKind.Variable;
		case htmlService.CompletionItemKind.Class:
			return mItemKind.Class;
		case htmlService.CompletionItemKind.Interface:
			return mItemKind.Interface;
		case htmlService.CompletionItemKind.Module:
			return mItemKind.Module;
		case htmlService.CompletionItemKind.Property:
			return mItemKind.Property;
		case htmlService.CompletionItemKind.Unit:
			return mItemKind.Unit;
		case htmlService.CompletionItemKind.Value:
			return mItemKind.Value;
		case htmlService.CompletionItemKind.Enum:
			return mItemKind.Enum;
		case htmlService.CompletionItemKind.Keyword:
			return mItemKind.Keyword;
		case htmlService.CompletionItemKind.Snippet:
			return mItemKind.Snippet;
		case htmlService.CompletionItemKind.Color:
			return mItemKind.Color;
		case htmlService.CompletionItemKind.File:
			return mItemKind.File;
		case htmlService.CompletionItemKind.Reference:
			return mItemKind.Reference;
	}
	return mItemKind.Property;
}

function fromCompletionItemKind(
	kind: languages.CompletionItemKind
): htmlService.CompletionItemKind {
	const mItemKind = languages.CompletionItemKind;

	switch (kind) {
		case mItemKind.Text:
			return htmlService.CompletionItemKind.Text;
		case mItemKind.Method:
			return htmlService.CompletionItemKind.Method;
		case mItemKind.Function:
			return htmlService.CompletionItemKind.Function;
		case mItemKind.Constructor:
			return htmlService.CompletionItemKind.Constructor;
		case mItemKind.Field:
			return htmlService.CompletionItemKind.Field;
		case mItemKind.Variable:
			return htmlService.CompletionItemKind.Variable;
		case mItemKind.Class:
			return htmlService.CompletionItemKind.Class;
		case mItemKind.Interface:
			return htmlService.CompletionItemKind.Interface;
		case mItemKind.Module:
			return htmlService.CompletionItemKind.Module;
		case mItemKind.Property:
			return htmlService.CompletionItemKind.Property;
		case mItemKind.Unit:
			return htmlService.CompletionItemKind.Unit;
		case mItemKind.Value:
			return htmlService.CompletionItemKind.Value;
		case mItemKind.Enum:
			return htmlService.CompletionItemKind.Enum;
		case mItemKind.Keyword:
			return htmlService.CompletionItemKind.Keyword;
		case mItemKind.Snippet:
			return htmlService.CompletionItemKind.Snippet;
		case mItemKind.Color:
			return htmlService.CompletionItemKind.Color;
		case mItemKind.File:
			return htmlService.CompletionItemKind.File;
		case mItemKind.Reference:
			return htmlService.CompletionItemKind.Reference;
	}
	return htmlService.CompletionItemKind.Property;
}

function toTextEdit(textEdit: htmlService.TextEdit): editor.ISingleEditOperation {
	if (!textEdit) {
		return void 0;
	}
	return {
		range: toRange(textEdit.range),
		text: textEdit.newText
	};
}

export class CompletionAdapter implements languages.CompletionItemProvider {
	constructor(private _worker: WorkerAccessor) {}

	public get triggerCharacters(): string[] {
		return ['.', ':', '<', '"', '=', '/'];
	}

	provideCompletionItems(
		model: editor.IReadOnlyModel,
		position: Position,
		context: languages.CompletionContext,
		token: CancellationToken
	): Promise<languages.CompletionList> {
		const resource = model.uri;

		return this._worker(resource)
			.then((worker) => {
				return worker.doComplete(resource.toString(), fromPosition(position));
			})
			.then((info) => {
				if (!info) {
					return;
				}
				const wordInfo = model.getWordUntilPosition(position);
				const wordRange = new Range(
					position.lineNumber,
					wordInfo.startColumn,
					position.lineNumber,
					wordInfo.endColumn
				);

				const items: languages.CompletionItem[] = info.items.map((entry) => {
					const item: languages.CompletionItem = {
						label: entry.label,
						insertText: entry.insertText || entry.label,
						sortText: entry.sortText,
						filterText: entry.filterText,
						documentation: entry.documentation,
						detail: entry.detail,
						range: wordRange,
						kind: toCompletionItemKind(entry.kind)
					};
					if (entry.textEdit) {
						if (isInsertReplaceEdit(entry.textEdit)) {
							item.range = {
								insert: toRange(entry.textEdit.insert),
								replace: toRange(entry.textEdit.replace)
							};
						} else {
							item.range = toRange(entry.textEdit.range);
						}
						item.insertText = entry.textEdit.newText;
					}
					if (entry.additionalTextEdits) {
						item.additionalTextEdits = entry.additionalTextEdits.map(toTextEdit);
					}
					if (entry.insertTextFormat === htmlService.InsertTextFormat.Snippet) {
						item.insertTextRules = languages.CompletionItemInsertTextRule.InsertAsSnippet;
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

function isMarkupContent(thing: any): thing is htmlService.MarkupContent {
	return (
		thing &&
		typeof thing === 'object' &&
		typeof (<htmlService.MarkupContent>thing).kind === 'string'
	);
}

function toMarkdownString(
	entry: htmlService.MarkupContent | htmlService.MarkedString
): IMarkdownString {
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

function toMarkedStringArray(
	contents: htmlService.MarkupContent | htmlService.MarkedString | htmlService.MarkedString[]
): IMarkdownString[] {
	if (!contents) {
		return void 0;
	}
	if (Array.isArray(contents)) {
		return contents.map(toMarkdownString);
	}
	return [toMarkdownString(contents)];
}

export class HoverAdapter implements languages.HoverProvider {
	constructor(private _worker: WorkerAccessor) {}

	provideHover(
		model: editor.IReadOnlyModel,
		position: Position,
		token: CancellationToken
	): Promise<languages.Hover> {
		let resource = model.uri;

		return this._worker(resource)
			.then((worker) => {
				return worker.doHover(resource.toString(), fromPosition(position));
			})
			.then((info) => {
				if (!info) {
					return;
				}
				return <languages.Hover>{
					range: toRange(info.range),
					contents: toMarkedStringArray(info.contents)
				};
			});
	}
}

// --- document highlights ------

function toHighlighKind(kind: htmlService.DocumentHighlightKind): languages.DocumentHighlightKind {
	const mKind = languages.DocumentHighlightKind;

	switch (kind) {
		case htmlService.DocumentHighlightKind.Read:
			return mKind.Read;
		case htmlService.DocumentHighlightKind.Write:
			return mKind.Write;
		case htmlService.DocumentHighlightKind.Text:
			return mKind.Text;
	}
	return mKind.Text;
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
			.then((items) => {
				if (!items) {
					return;
				}
				return items.map((item) => ({
					range: toRange(item.range),
					kind: toHighlighKind(item.kind)
				}));
			});
	}
}

// --- document symbols ------

function toSymbolKind(kind: htmlService.SymbolKind): languages.SymbolKind {
	let mKind = languages.SymbolKind;

	switch (kind) {
		case htmlService.SymbolKind.File:
			return mKind.Array;
		case htmlService.SymbolKind.Module:
			return mKind.Module;
		case htmlService.SymbolKind.Namespace:
			return mKind.Namespace;
		case htmlService.SymbolKind.Package:
			return mKind.Package;
		case htmlService.SymbolKind.Class:
			return mKind.Class;
		case htmlService.SymbolKind.Method:
			return mKind.Method;
		case htmlService.SymbolKind.Property:
			return mKind.Property;
		case htmlService.SymbolKind.Field:
			return mKind.Field;
		case htmlService.SymbolKind.Constructor:
			return mKind.Constructor;
		case htmlService.SymbolKind.Enum:
			return mKind.Enum;
		case htmlService.SymbolKind.Interface:
			return mKind.Interface;
		case htmlService.SymbolKind.Function:
			return mKind.Function;
		case htmlService.SymbolKind.Variable:
			return mKind.Variable;
		case htmlService.SymbolKind.Constant:
			return mKind.Constant;
		case htmlService.SymbolKind.String:
			return mKind.String;
		case htmlService.SymbolKind.Number:
			return mKind.Number;
		case htmlService.SymbolKind.Boolean:
			return mKind.Boolean;
		case htmlService.SymbolKind.Array:
			return mKind.Array;
	}
	return mKind.Function;
}

export class DocumentSymbolAdapter implements languages.DocumentSymbolProvider {
	constructor(private _worker: WorkerAccessor) {}

	public provideDocumentSymbols(
		model: editor.IReadOnlyModel,
		token: CancellationToken
	): Promise<languages.DocumentSymbol[]> {
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
					tags: [],
					range: toRange(item.location.range),
					selectionRange: toRange(item.location.range)
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

function fromFormattingOptions(
	options: languages.FormattingOptions
): htmlService.FormattingOptions {
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
	): Promise<editor.ISingleEditOperation[]> {
		const resource = model.uri;

		return this._worker(resource).then((worker) => {
			return worker
				.format(resource.toString(), null, fromFormattingOptions(options))
				.then((edits) => {
					if (!edits || edits.length === 0) {
						return;
					}
					return edits.map(toTextEdit);
				});
		});
	}
}

export class DocumentRangeFormattingEditProvider
	implements languages.DocumentRangeFormattingEditProvider {
	constructor(private _worker: WorkerAccessor) {}

	public provideDocumentRangeFormattingEdits(
		model: editor.IReadOnlyModel,
		range: Range,
		options: languages.FormattingOptions,
		token: CancellationToken
	): Promise<editor.ISingleEditOperation[]> {
		const resource = model.uri;

		return this._worker(resource).then((worker) => {
			return worker
				.format(resource.toString(), fromRange(range), fromFormattingOptions(options))
				.then((edits) => {
					if (!edits || edits.length === 0) {
						return;
					}
					return edits.map(toTextEdit);
				});
		});
	}
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

function toWorkspaceEdit(edit: htmlService.WorkspaceEdit): languages.WorkspaceEdit {
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

export class FoldingRangeAdapter implements languages.FoldingRangeProvider {
	constructor(private _worker: WorkerAccessor) {}

	public provideFoldingRanges(
		model: editor.IReadOnlyModel,
		context: languages.FoldingContext,
		token: CancellationToken
	): Promise<languages.FoldingRange[]> {
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
						result.kind = toFoldingRangeKind(<htmlService.FoldingRangeKind>range.kind);
					}
					return result;
				});
			});
	}
}

function toFoldingRangeKind(kind: htmlService.FoldingRangeKind): languages.FoldingRangeKind {
	switch (kind) {
		case htmlService.FoldingRangeKind.Comment:
			return languages.FoldingRangeKind.Comment;
		case htmlService.FoldingRangeKind.Imports:
			return languages.FoldingRangeKind.Imports;
		case htmlService.FoldingRangeKind.Region:
			return languages.FoldingRangeKind.Region;
	}
}

export class SelectionRangeAdapter implements languages.SelectionRangeProvider {
	constructor(private _worker: WorkerAccessor) {}

	public provideSelectionRanges(
		model: editor.IReadOnlyModel,
		positions: Position[],
		token: CancellationToken
	): Promise<languages.SelectionRange[][]> {
		const resource = model.uri;

		return this._worker(resource)
			.then((worker) => worker.getSelectionRanges(resource.toString(), positions.map(fromPosition)))
			.then((selectionRanges) => {
				if (!selectionRanges) {
					return;
				}
				return selectionRanges.map((selectionRange) => {
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
