/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as lsTypes from 'vscode-languageserver-types';
import {
	languages,
	editor,
	Position,
	IRange,
	Range,
	CancellationToken
} from '../../fillers/monaco-editor-core';
import { WorkerAccessor } from './lspLanguageFeatures';

export interface ILanguageWorkerWithCompletions {
	doComplete(uri: string, position: lsTypes.Position): Promise<lsTypes.CompletionList | null>;
}

export class CompletionAdapter<T extends ILanguageWorkerWithCompletions>
	implements languages.CompletionItemProvider
{
	constructor(
		private readonly _worker: WorkerAccessor<T>,
		private readonly _triggerCharacters: string[]
	) {}

	public get triggerCharacters(): string[] {
		return this._triggerCharacters;
	}

	provideCompletionItems(
		model: editor.IReadOnlyModel,
		position: Position,
		context: languages.CompletionContext,
		token: CancellationToken
	): Promise<languages.CompletionList | undefined> {
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
						command: toCommand(entry.command),
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
						item.additionalTextEdits =
							entry.additionalTextEdits.map<languages.TextEdit>(toTextEdit);
					}
					if (entry.insertTextFormat === lsTypes.InsertTextFormat.Snippet) {
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

export function fromPosition(position: Position): lsTypes.Position;
export function fromPosition(position: undefined): undefined;
export function fromPosition(position: Position | undefined): lsTypes.Position | undefined;
export function fromPosition(position: Position | undefined): lsTypes.Position | undefined {
	if (!position) {
		return void 0;
	}
	return { character: position.column - 1, line: position.lineNumber - 1 };
}

export function fromRange(range: IRange): lsTypes.Range;
export function fromRange(range: undefined): undefined;
export function fromRange(range: IRange | undefined): lsTypes.Range | undefined;
export function fromRange(range: IRange | undefined): lsTypes.Range | undefined {
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

export function toRange(range: lsTypes.Range): Range;
export function toRange(range: undefined): undefined;
export function toRange(range: lsTypes.Range | undefined): Range | undefined;
export function toRange(range: lsTypes.Range | undefined): Range | undefined {
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

function isInsertReplaceEdit(
	edit: lsTypes.TextEdit | lsTypes.InsertReplaceEdit
): edit is lsTypes.InsertReplaceEdit {
	return (
		typeof (<lsTypes.InsertReplaceEdit>edit).insert !== 'undefined' &&
		typeof (<lsTypes.InsertReplaceEdit>edit).replace !== 'undefined'
	);
}

function toCompletionItemKind(kind: number | undefined): languages.CompletionItemKind {
	const mItemKind = languages.CompletionItemKind;

	switch (kind) {
		case lsTypes.CompletionItemKind.Text:
			return mItemKind.Text;
		case lsTypes.CompletionItemKind.Method:
			return mItemKind.Method;
		case lsTypes.CompletionItemKind.Function:
			return mItemKind.Function;
		case lsTypes.CompletionItemKind.Constructor:
			return mItemKind.Constructor;
		case lsTypes.CompletionItemKind.Field:
			return mItemKind.Field;
		case lsTypes.CompletionItemKind.Variable:
			return mItemKind.Variable;
		case lsTypes.CompletionItemKind.Class:
			return mItemKind.Class;
		case lsTypes.CompletionItemKind.Interface:
			return mItemKind.Interface;
		case lsTypes.CompletionItemKind.Module:
			return mItemKind.Module;
		case lsTypes.CompletionItemKind.Property:
			return mItemKind.Property;
		case lsTypes.CompletionItemKind.Unit:
			return mItemKind.Unit;
		case lsTypes.CompletionItemKind.Value:
			return mItemKind.Value;
		case lsTypes.CompletionItemKind.Enum:
			return mItemKind.Enum;
		case lsTypes.CompletionItemKind.Keyword:
			return mItemKind.Keyword;
		case lsTypes.CompletionItemKind.Snippet:
			return mItemKind.Snippet;
		case lsTypes.CompletionItemKind.Color:
			return mItemKind.Color;
		case lsTypes.CompletionItemKind.File:
			return mItemKind.File;
		case lsTypes.CompletionItemKind.Reference:
			return mItemKind.Reference;
	}
	return mItemKind.Property;
}

function fromCompletionItemKind(kind: languages.CompletionItemKind): lsTypes.CompletionItemKind {
	const mItemKind = languages.CompletionItemKind;

	switch (kind) {
		case mItemKind.Text:
			return lsTypes.CompletionItemKind.Text;
		case mItemKind.Method:
			return lsTypes.CompletionItemKind.Method;
		case mItemKind.Function:
			return lsTypes.CompletionItemKind.Function;
		case mItemKind.Constructor:
			return lsTypes.CompletionItemKind.Constructor;
		case mItemKind.Field:
			return lsTypes.CompletionItemKind.Field;
		case mItemKind.Variable:
			return lsTypes.CompletionItemKind.Variable;
		case mItemKind.Class:
			return lsTypes.CompletionItemKind.Class;
		case mItemKind.Interface:
			return lsTypes.CompletionItemKind.Interface;
		case mItemKind.Module:
			return lsTypes.CompletionItemKind.Module;
		case mItemKind.Property:
			return lsTypes.CompletionItemKind.Property;
		case mItemKind.Unit:
			return lsTypes.CompletionItemKind.Unit;
		case mItemKind.Value:
			return lsTypes.CompletionItemKind.Value;
		case mItemKind.Enum:
			return lsTypes.CompletionItemKind.Enum;
		case mItemKind.Keyword:
			return lsTypes.CompletionItemKind.Keyword;
		case mItemKind.Snippet:
			return lsTypes.CompletionItemKind.Snippet;
		case mItemKind.Color:
			return lsTypes.CompletionItemKind.Color;
		case mItemKind.File:
			return lsTypes.CompletionItemKind.File;
		case mItemKind.Reference:
			return lsTypes.CompletionItemKind.Reference;
	}
	return lsTypes.CompletionItemKind.Property;
}

export function toTextEdit(textEdit: lsTypes.TextEdit): languages.TextEdit;
export function toTextEdit(textEdit: undefined): undefined;
export function toTextEdit(textEdit: lsTypes.TextEdit | undefined): languages.TextEdit | undefined;
export function toTextEdit(textEdit: lsTypes.TextEdit | undefined): languages.TextEdit | undefined {
	if (!textEdit) {
		return void 0;
	}
	return {
		range: toRange(textEdit.range),
		text: textEdit.newText
	};
}

function toCommand(c: lsTypes.Command | undefined): languages.Command | undefined {
	return c && c.command === 'editor.action.triggerSuggest'
		? { id: c.command, title: c.title, arguments: c.arguments }
		: undefined;
}
