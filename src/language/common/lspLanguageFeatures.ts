/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as lsTypes from 'vscode-languageserver-types';
import {
	languages,
	editor,
	Uri,
	Position,
	CancellationToken
} from '../../fillers/monaco-editor-core';
import { fromPosition, toRange } from './CompletionAdapter';

export interface WorkerAccessor<T> {
	(...more: Uri[]): Promise<T>;
}

export * from './DiagnosticsAdapter';

export * from './CompletionAdapter';

export * from './HoverAdapter';

export * from './DocumentHighlightAdapter';

export * from './DefinitionAdapter';

export * from './ReferenceAdapter';

export * from './RenameAdapter';

export * from './DocumentSymbolAdapter';

export * from './DocumentLinkAdapter';

export * from './DocumentFormattingEditProvider';

export * from './DocumentColorAdapter';

export * from './FoldingRangeAdapter';

//#region SelectionRangeAdapter

export interface ILanguageWorkerWithSelectionRanges {
	getSelectionRanges(uri: string, positions: lsTypes.Position[]): Promise<lsTypes.SelectionRange[]>;
}

export class SelectionRangeAdapter<T extends ILanguageWorkerWithSelectionRanges>
	implements languages.SelectionRangeProvider
{
	constructor(private _worker: WorkerAccessor<T>) {}

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

//#endregion
