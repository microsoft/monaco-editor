/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as lsTypes from 'vscode-languageserver-types';
import { languages, editor, Position, CancellationToken } from '../../fillers/monaco-editor-core';
import { fromPosition } from './CompletionAdapter';
import { toLocation } from './DefinitionAdapter';
import { WorkerAccessor } from './lspLanguageFeatures';

export interface ILanguageWorkerWithReferences {
	findReferences(uri: string, position: lsTypes.Position): Promise<lsTypes.Location[]>;
}

export class ReferenceAdapter<T extends ILanguageWorkerWithReferences>
	implements languages.ReferenceProvider
{
	constructor(private readonly _worker: WorkerAccessor<T>) {}

	provideReferences(
		model: editor.IReadOnlyModel,
		position: Position,
		context: languages.ReferenceContext,
		token: CancellationToken
	): Promise<languages.Location[] | undefined> {
		const resource = model.uri;

		return this._worker(resource)
			.then((worker) => {
				return worker.findReferences(resource.toString(), fromPosition(position));
			})
			.then((entries) => {
				if (!entries) {
					return;
				}
				return entries.map(toLocation);
			});
	}
}
