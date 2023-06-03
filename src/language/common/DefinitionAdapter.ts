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

export interface ILanguageWorkerWithDefinitions {
	findDefinition(uri: string, position: lsTypes.Position): Promise<lsTypes.Location | null>;
}

export class DefinitionAdapter<T extends ILanguageWorkerWithDefinitions>
	implements languages.DefinitionProvider
{
	constructor(private readonly _worker: WorkerAccessor<T>) {}

	public provideDefinition(
		model: editor.IReadOnlyModel,
		position: Position,
		token: CancellationToken
	): Promise<languages.Definition | undefined> {
		const resource = model.uri;

		return this._worker(resource)
			.then((worker) => {
				return worker.findDefinition(resource.toString(), fromPosition(position));
			})
			.then((definition) => {
				if (!definition) {
					return;
				}
				return [toLocation(definition)];
			});
	}
}

export function toLocation(location: lsTypes.Location): languages.Location {
	return {
		uri: Uri.parse(location.uri),
		range: toRange(location.range)
	};
}
