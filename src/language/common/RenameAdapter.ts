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
import { WorkerAccessor } from './lspLanguageFeatures';

export interface ILanguageWorkerWithRename {
	doRename(
		uri: string,
		position: lsTypes.Position,
		newName: string
	): Promise<lsTypes.WorkspaceEdit | null>;
}

export class RenameAdapter<T extends ILanguageWorkerWithRename>
	implements languages.RenameProvider
{
	constructor(private readonly _worker: WorkerAccessor<T>) {}

	provideRenameEdits(
		model: editor.IReadOnlyModel,
		position: Position,
		newName: string,
		token: CancellationToken
	): Promise<languages.WorkspaceEdit | undefined> {
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

function toWorkspaceEdit(edit: lsTypes.WorkspaceEdit | null): languages.WorkspaceEdit | undefined {
	if (!edit || !edit.changes) {
		return void 0;
	}
	let resourceEdits: languages.IWorkspaceTextEdit[] = [];
	for (let uri in edit.changes) {
		const _uri = Uri.parse(uri);
		for (let e of edit.changes[uri]) {
			resourceEdits.push({
				resource: _uri,
				versionId: undefined,
				textEdit: {
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
