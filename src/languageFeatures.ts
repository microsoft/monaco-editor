/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LanguageServiceDefaults } from './monaco.contribution';
import type { JSONWorker } from './jsonWorker';
import {
	Uri,
	Position,
	Range,
	IRange,
	CancellationToken,
	IDisposable,
	editor,
	languages,
	MarkerSeverity,
	IMarkdownString
} from './fillers/monaco-editor-core';
import * as jsonService from 'vscode-json-languageservice';

export interface WorkerAccessor {
	(...more: Uri[]): Promise<JSONWorker>;
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

		const onModelRemoved = (model: editor.IModel): void => {
			editor.setModelMarkers(model, this._languageId, []);
			let uriStr = model.uri.toString();
			let listener = this._listener[uriStr];
			if (listener) {
				listener.dispose();
				delete this._listener[uriStr];
			}
		};

		this._disposables.push(editor.onDidCreateModel(onModelAdd));
		this._disposables.push(
			editor.onWillDisposeModel((model) => {
				onModelRemoved(model);
				this._resetSchema(model.uri);
			})
		);
		this._disposables.push(
			editor.onDidChangeModelLanguage((event) => {
				onModelRemoved(event.model);
				onModelAdd(event.model);
				this._resetSchema(event.model.uri);
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
				editor.getModels().forEach(onModelRemoved);
				for (let key in this._listener) {
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

	private _resetSchema(resource: Uri): void {
		this._worker().then((worker) => {
			worker.resetSchema(resource.toString());
		});
	}

	private _doValidate(resource: Uri, languageId: string): void {
		this._worker(resource)
			.then((worker) => {
				return worker.doValidation(resource.toString()).then((diagnostics) => {
					const markers = diagnostics.map((d) => toDiagnostics(resource, d));
					let model = editor.getModel(resource);
					if (model && model.getModeId() === languageId) {
						editor.setModelMarkers(model, languageId, markers);
					}
				});
			})
			.then(undefined, (err) => {
				console.error(err);
			});
	}
}

function toSeverity(lsSeverity: number): MarkerSeverity {
	switch (lsSeverity) {
		case jsonService.DiagnosticSeverity.Error:
			return MarkerSeverity.Error;
		case jsonService.DiagnosticSeverity.Warning:
			return MarkerSeverity.Warning;
		case jsonService.DiagnosticSeverity.Information:
			return MarkerSeverity.Info;
		case jsonService.DiagnosticSeverity.Hint:
			return MarkerSeverity.Hint;
		default:
			return MarkerSeverity.Info;
	}
}

function toDiagnostics(resource: Uri, diag: jsonService.Diagnostic): editor.IMarkerData {
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
	return {
		start: {
			line: range.startLineNumber - 1,
			character: range.startColumn - 1
		},
		end: { line: range.endLineNumber - 1, character: range.endColumn - 1 }
	};
}
function toRange(range: jsonService.Range): Range {
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

interface InsertReplaceEdit {
	/**
	 * The string to be inserted.
	 */
	newText: string;
	/**
	 * The range if the insert is requested
	 */
	insert: jsonService.Range;
	/**
	 * The range if the replace is requested.
	 */
	replace: jsonService.Range;
}

function isInsertReplaceEdit(
	edit: jsonService.TextEdit | InsertReplaceEdit
): edit is InsertReplaceEdit {
	return (
		typeof (<InsertReplaceEdit>edit).insert !== 'undefined' &&
		typeof (<InsertReplaceEdit>edit).replace !== 'undefined'
	);
}

function toCompletionItemKind(kind: number): languages.CompletionItemKind {
	let mItemKind = languages.CompletionItemKind;

	switch (kind) {
		case jsonService.CompletionItemKind.Text:
			return mItemKind.Text;
		case jsonService.CompletionItemKind.Method:
			return mItemKind.Method;
		case jsonService.CompletionItemKind.Function:
			return mItemKind.Function;
		case jsonService.CompletionItemKind.Constructor:
			return mItemKind.Constructor;
		case jsonService.CompletionItemKind.Field:
			return mItemKind.Field;
		case jsonService.CompletionItemKind.Variable:
			return mItemKind.Variable;
		case jsonService.CompletionItemKind.Class:
			return mItemKind.Class;
		case jsonService.CompletionItemKind.Interface:
			return mItemKind.Interface;
		case jsonService.CompletionItemKind.Module:
			return mItemKind.Module;
		case jsonService.CompletionItemKind.Property:
			return mItemKind.Property;
		case jsonService.CompletionItemKind.Unit:
			return mItemKind.Unit;
		case jsonService.CompletionItemKind.Value:
			return mItemKind.Value;
		case jsonService.CompletionItemKind.Enum:
			return mItemKind.Enum;
		case jsonService.CompletionItemKind.Keyword:
			return mItemKind.Keyword;
		case jsonService.CompletionItemKind.Snippet:
			return mItemKind.Snippet;
		case jsonService.CompletionItemKind.Color:
			return mItemKind.Color;
		case jsonService.CompletionItemKind.File:
			return mItemKind.File;
		case jsonService.CompletionItemKind.Reference:
			return mItemKind.Reference;
	}
	return mItemKind.Property;
}

function fromCompletionItemKind(
	kind: languages.CompletionItemKind
): jsonService.CompletionItemKind {
	let mItemKind = languages.CompletionItemKind;

	switch (kind) {
		case mItemKind.Text:
			return jsonService.CompletionItemKind.Text;
		case mItemKind.Method:
			return jsonService.CompletionItemKind.Method;
		case mItemKind.Function:
			return jsonService.CompletionItemKind.Function;
		case mItemKind.Constructor:
			return jsonService.CompletionItemKind.Constructor;
		case mItemKind.Field:
			return jsonService.CompletionItemKind.Field;
		case mItemKind.Variable:
			return jsonService.CompletionItemKind.Variable;
		case mItemKind.Class:
			return jsonService.CompletionItemKind.Class;
		case mItemKind.Interface:
			return jsonService.CompletionItemKind.Interface;
		case mItemKind.Module:
			return jsonService.CompletionItemKind.Module;
		case mItemKind.Property:
			return jsonService.CompletionItemKind.Property;
		case mItemKind.Unit:
			return jsonService.CompletionItemKind.Unit;
		case mItemKind.Value:
			return jsonService.CompletionItemKind.Value;
		case mItemKind.Enum:
			return jsonService.CompletionItemKind.Enum;
		case mItemKind.Keyword:
			return jsonService.CompletionItemKind.Keyword;
		case mItemKind.Snippet:
			return jsonService.CompletionItemKind.Snippet;
		case mItemKind.Color:
			return jsonService.CompletionItemKind.Color;
		case mItemKind.File:
			return jsonService.CompletionItemKind.File;
		case mItemKind.Reference:
			return jsonService.CompletionItemKind.Reference;
	}
	return jsonService.CompletionItemKind.Property;
}

function toTextEdit(textEdit: jsonService.TextEdit): editor.ISingleEditOperation {
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
		return [' ', ':'];
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

				let items: languages.CompletionItem[] = info.items.map((entry) => {
					let item: languages.CompletionItem = {
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
					if (entry.insertTextFormat === jsonService.InsertTextFormat.Snippet) {
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

function isMarkupContent(thing: any): thing is jsonService.MarkupContent {
	return (
		thing &&
		typeof thing === 'object' &&
		typeof (<jsonService.MarkupContent>thing).kind === 'string'
	);
}

function toMarkdownString(
	entry: jsonService.MarkupContent | jsonService.MarkedString
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
	contents: jsonService.MarkupContent | jsonService.MarkedString | jsonService.MarkedString[]
): IMarkdownString[] {
	if (!contents) {
		return void 0;
	}
	if (Array.isArray(contents)) {
		return contents.map(toMarkdownString);
	}
	return [toMarkdownString(contents)];
}

// --- hover ------

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

// --- definition ------

function toLocation(location: jsonService.Location): languages.Location {
	return {
		uri: Uri.parse(location.uri),
		range: toRange(location.range)
	};
}

// --- document symbols ------

function toSymbolKind(kind: jsonService.SymbolKind): languages.SymbolKind {
	let mKind = languages.SymbolKind;

	switch (kind) {
		case jsonService.SymbolKind.File:
			return mKind.Array;
		case jsonService.SymbolKind.Module:
			return mKind.Module;
		case jsonService.SymbolKind.Namespace:
			return mKind.Namespace;
		case jsonService.SymbolKind.Package:
			return mKind.Package;
		case jsonService.SymbolKind.Class:
			return mKind.Class;
		case jsonService.SymbolKind.Method:
			return mKind.Method;
		case jsonService.SymbolKind.Property:
			return mKind.Property;
		case jsonService.SymbolKind.Field:
			return mKind.Field;
		case jsonService.SymbolKind.Constructor:
			return mKind.Constructor;
		case jsonService.SymbolKind.Enum:
			return mKind.Enum;
		case jsonService.SymbolKind.Interface:
			return mKind.Interface;
		case jsonService.SymbolKind.Function:
			return mKind.Function;
		case jsonService.SymbolKind.Variable:
			return mKind.Variable;
		case jsonService.SymbolKind.Constant:
			return mKind.Constant;
		case jsonService.SymbolKind.String:
			return mKind.String;
		case jsonService.SymbolKind.Number:
			return mKind.Number;
		case jsonService.SymbolKind.Boolean:
			return mKind.Boolean;
		case jsonService.SymbolKind.Array:
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
					range: toRange(item.location.range),
					selectionRange: toRange(item.location.range),
					tags: []
				}));
			});
	}
}

function fromFormattingOptions(
	options: languages.FormattingOptions
): jsonService.FormattingOptions {
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

export class DocumentColorAdapter implements languages.DocumentColorProvider {
	constructor(private _worker: WorkerAccessor) {}

	public provideDocumentColors(
		model: editor.IReadOnlyModel,
		token: CancellationToken
	): Promise<languages.IColorInformation[]> {
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
	): Promise<languages.IColorPresentation[]> {
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
						item.additionalTextEdits = presentation.additionalTextEdits.map(toTextEdit);
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
	): Promise<languages.FoldingRange[]> {
		const resource = model.uri;

		return this._worker(resource)
			.then((worker) => worker.getFoldingRanges(resource.toString(), context))
			.then((ranges) => {
				if (!ranges) {
					return;
				}
				return ranges.map((range) => {
					let result: languages.FoldingRange = {
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

function toFoldingRangeKind(kind: jsonService.FoldingRangeKind): languages.FoldingRangeKind {
	switch (kind) {
		case jsonService.FoldingRangeKind.Comment:
			return languages.FoldingRangeKind.Comment;
		case jsonService.FoldingRangeKind.Imports:
			return languages.FoldingRangeKind.Imports;
		case jsonService.FoldingRangeKind.Region:
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
