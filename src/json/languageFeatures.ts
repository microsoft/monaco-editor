/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LanguageServiceDefaults } from './monaco.contribution';
import type { JSONWorker } from './jsonWorker';
import * as lsTypes from 'vscode-languageserver-types';
import { languages, editor, Uri, Position, CancellationToken } from '../fillers/monaco-editor-core';
import {
	DiagnosticsAdapter,
	fromPosition,
	toRange,
	CompletionAdapter,
	HoverAdapter,
	DocumentSymbolAdapter,
	DocumentFormattingEditProvider,
	DocumentRangeFormattingEditProvider,
	DocumentColorAdapter,
	FoldingRangeAdapter
} from '../common/lspLanguageFeatures';

export interface WorkerAccessor {
	(...more: Uri[]): Promise<JSONWorker>;
}

export class JSONDiagnosticsAdapter extends DiagnosticsAdapter<JSONWorker> {
	constructor(languageId: string, worker: WorkerAccessor, defaults: LanguageServiceDefaults) {
		super(languageId, worker, defaults.onDidChange);

		this._disposables.push(
			editor.onWillDisposeModel((model) => {
				this._resetSchema(model.uri);
			})
		);
		this._disposables.push(
			editor.onDidChangeModelLanguage((event) => {
				this._resetSchema(event.model.uri);
			})
		);
	}

	private _resetSchema(resource: Uri): void {
		this._worker().then((worker) => {
			worker.resetSchema(resource.toString());
		});
	}
}

export class JSONCompletionAdapter extends CompletionAdapter<JSONWorker> {
	constructor(worker: WorkerAccessor) {
		super(worker, [' ', ':', '"']);
	}
}

export class JSONHoverAdapter extends HoverAdapter<JSONWorker> {}

export class JSONDocumentSymbolAdapter extends DocumentSymbolAdapter<JSONWorker> {}

export class JSONDocumentFormattingEditProvider extends DocumentFormattingEditProvider<JSONWorker> {}

export class JSONDocumentRangeFormattingEditProvider extends DocumentRangeFormattingEditProvider<JSONWorker> {}

export class JSONDocumentColorAdapter extends DocumentColorAdapter<JSONWorker> {}

export class JSONFoldingRangeAdapter extends FoldingRangeAdapter<JSONWorker> {}

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
