/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as lsTypes from 'vscode-languageserver-types';
import { languages, editor, Range, CancellationToken } from '../../fillers/monaco-editor-core';
import { toTextEdit, fromRange } from './CompletionAdapter';
import { WorkerAccessor } from './lspLanguageFeatures';

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
