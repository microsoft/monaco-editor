/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LanguageServiceDefaults } from './monaco.contribution';
import type { CSSWorker } from './cssWorker';
import * as lsTypes from 'vscode-languageserver-types';
import { languages, editor, Uri, Position, CancellationToken } from '../fillers/monaco-editor-core';
import {
	DiagnosticsAdapter,
	fromPosition,
	toRange,
	CompletionAdapter,
	HoverAdapter,
	DocumentHighlightAdapter,
	DefinitionAdapter,
	ReferenceAdapter,
	RenameAdapter,
	DocumentSymbolAdapter,
	DocumentColorAdapter,
	FoldingRangeAdapter
} from '../common/lspLanguageFeatures';

export interface WorkerAccessor {
	(first: Uri, ...more: Uri[]): Promise<CSSWorker>;
}

export class CSSDiagnosticsAdapter extends DiagnosticsAdapter<CSSWorker> {
	constructor(languageId: string, worker: WorkerAccessor, defaults: LanguageServiceDefaults) {
		super(languageId, worker, defaults.onDidChange);
	}
}

export class CSSCompletionAdapter extends CompletionAdapter<CSSWorker> {
	constructor(worker: WorkerAccessor) {
		super(worker, ['/', '-', ':']);
	}
}

export class CSSHoverAdapter extends HoverAdapter<CSSWorker> {}

export class CSSDocumentHighlightAdapter extends DocumentHighlightAdapter<CSSWorker> {}

export class CSSDefinitionAdapter extends DefinitionAdapter<CSSWorker> {}

export class CSSReferenceAdapter extends ReferenceAdapter<CSSWorker> {}

export class CSSRenameAdapter extends RenameAdapter<CSSWorker> {}

export class CSSDocumentSymbolAdapter extends DocumentSymbolAdapter<CSSWorker> {}

export class CSSDocumentColorAdapter extends DocumentColorAdapter<CSSWorker> {}

export class CSSFoldingRangeAdapter extends FoldingRangeAdapter<CSSWorker> {}

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
