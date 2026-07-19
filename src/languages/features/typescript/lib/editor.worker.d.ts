/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'monaco-editor-core/esm/vs/editor/editor.worker.start' {
	import type { worker } from 'monaco-editor-core';

	export function start<THost extends object, TClient extends object>(createClient: (ctx: worker.IWorkerContext<THost>) => TClient): TClient;
 }
