/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// @ts-check

import nodeResolve from '@rollup/plugin-node-resolve';
import { join } from 'path';
import { defineConfig } from 'rollup';
import { dts } from "rollup-plugin-dts";
import { dtsDeprecationWarning, getEntryPoints, mapModuleId } from '../shared.mjs';

const root = join(import.meta.dirname, '../../');

export default defineConfig({
	input: {
		...getEntryPoints(true, false),
	},
	output: {
		dir: join(root, './out/monaco-editor/esm'),
		format: 'es',
		preserveModules: true,
		entryFileNames: function (chunkInfo) {
			const moduleId = chunkInfo.facadeModuleId;
			if (moduleId) {
				const m = mapModuleId(moduleId, '.d.ts');
				console.log(moduleId + ' => ' + m);
				if (m !== undefined) {

					return m;
				}
			} else {
				console.warn('NO MODULE ID for chunkInfo', chunkInfo);
			}
			return '[name].d.ts';
		},
	},
	external: [/.*\.css/],
	plugins: [
		nodeResolve(),
		dts({
			compilerOptions: {
				stripInternal: true,
			},
			includeExternal: ['monaco-editor-core', '@vscode/monaco-lsp-client']
		}),
		dtsDeprecationWarning(f => f.endsWith('editor.api.d.ts')),
	],
});
