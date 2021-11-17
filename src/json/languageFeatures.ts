/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LanguageServiceDefaults } from './monaco.contribution';
import type { JSONWorker } from './jsonWorker';
import { editor, Uri } from '../fillers/monaco-editor-core';
import {
	DiagnosticsAdapter,
	CompletionAdapter,
	HoverAdapter,
	DocumentSymbolAdapter,
	DocumentFormattingEditProvider,
	DocumentRangeFormattingEditProvider,
	DocumentColorAdapter,
	FoldingRangeAdapter,
	SelectionRangeAdapter
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

export class JSONSelectionRangeAdapter extends SelectionRangeAdapter<JSONWorker> {}
