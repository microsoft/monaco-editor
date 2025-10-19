/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { initialize } from '../../common/initialize';
import * as ts from './lib/typescriptServices';
import { ModularTypeScriptWorker, ICreateData, ModuleConfig } from './worker/moduleLoader';
import { worker } from 'monaco-editor-core';
import { libFileMap } from './lib/lib';

// Default module configuration - can be customized
const DEFAULT_MODULE_CONFIG: ModuleConfig = {
	enableDiagnostics: true,
	enableCompletions: true,
	enableNavigation: true,
	enableFormatting: true,
	enableRefactoring: true,
	enableEmit: true,
	enableInlayHints: true
};

self.onmessage = () => {
	// ignore the first message
	initialize((ctx: worker.IWorkerContext, createData: ICreateData & { moduleConfig?: ModuleConfig }) => {
		const config = createData.moduleConfig || DEFAULT_MODULE_CONFIG;
		return new ModularTypeScriptWorker(ctx, createData, config);
	});
};

export { ModularTypeScriptWorker, create, initialize, libFileMap, ts };

// Factory function for creating modular workers with custom configuration
export function create(ctx: worker.IWorkerContext, createData: ICreateData, moduleConfig?: ModuleConfig): ModularTypeScriptWorker {
	const config = moduleConfig || DEFAULT_MODULE_CONFIG;
	return new ModularTypeScriptWorker(ctx, createData, config);
}
