/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import * as edworker from 'monaco-editor-core/esm/vs/editor/editor.worker';
import { TypeScriptWorker, ICreateData } from './tsWorker';
import { worker } from './fillers/monaco-editor-core';

self.onmessage = () => {
	// ignore the first message
	edworker.initialize((ctx: worker.IWorkerContext, createData: ICreateData) => {
		return new TypeScriptWorker(ctx, createData);
	});
};
