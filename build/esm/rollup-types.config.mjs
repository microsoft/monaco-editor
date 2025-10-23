/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// @ts-check

import nodeResolve from '@rollup/plugin-node-resolve';
import { join } from 'path';
import { defineConfig } from 'rollup';
import { dts } from "rollup-plugin-dts";

const root = join(import.meta.dirname, '../../');
const outDir = join(root, './out/monaco-editor/esm');

/**
 * @param {string} filePath
 * @param {string} newExt
 * @returns {string}
 */
function changeExt(filePath, newExt) {
	const idx = filePath.lastIndexOf('.');
	if (idx === -1) {
		return filePath + newExt;
	} else {
		return filePath.substring(0, idx) + newExt;
	}
}

const mappedPaths = {
	[join(root, 'node_modules/monaco-editor-core/esm/')]: '.',
	[join(root, 'node_modules/')]: 'external/',
	[join(root, 'src/')]: 'vs/',
};

export default defineConfig({
	input: {
		entry: join(root, './src/editor/editor.main.ts'),
	},
	output: {
		dir: outDir,
		format: 'es',
		preserveModules: false,
		entryFileNames: function (chunkInfo) {
			const moduleId = chunkInfo.facadeModuleId;
			if (moduleId) {
				for (const [key, val] of Object.entries(mappedPaths)) {
					if (moduleId.startsWith(key)) {
						const relativePath = moduleId.substring(key.length);
						return changeExt(join(val, relativePath), '.d.ts');
					}
				}
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
	],
});
