/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// @ts-check

import { join, relative } from 'path';
import { defineConfig } from 'rollup';
import esbuild from 'rollup-plugin-esbuild';
//import { urlToEsmPlugin } from '../rollup-url-to-module-plugin/index.mjs';
import del from 'rollup-plugin-delete';
import keepCssImports from './rollup-plugin-keep-css-imports/dist/index.mjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import { urlToEsmPlugin } from './rollup-url-to-module-plugin/index.mjs';
import { getEntryPoints, getNlsFiles, mapModuleId } from '../shared.mjs';
import { readFileSync } from 'fs';


const root = join(import.meta.dirname, '../../');
const outDir = join(root, './out/monaco-editor/esm');

export default defineConfig({
	input: {
		...getEntryPoints(true),
	},

	output: {
		dir: outDir,
		format: 'es',

		entryFileNames: function (chunkInfo) {
			const moduleId = chunkInfo.facadeModuleId;
			if (moduleId) {
				const r = mapModuleId(moduleId, '.js');
				if (r !== undefined) {
					return r;
				}
			}
			return '[name].js';
		},
		preserveModules: true,
		hoistTransitiveImports: false,
	},


	plugins: [
		del({ targets: outDir, force: true }),

		{
			name: 'emit-additional-files',
			generateBundle() {
				this.emitFile({
					type: 'asset',
					fileName: 'vs/base/browser/ui/codicons/codicon/codicon.ttf',
					source: readFileSync(join(root, 'node_modules/monaco-editor-core/esm/vs/base/browser/ui/codicons/codicon/codicon.ttf'))
				});
				for (const file of getNlsFiles('vs')) {
					this.emitFile({
						type: 'asset',
						fileName: file.pathFromRoot,
						source: 'value' in file.source ? file.source.value : readFileSync(file.source.absolutePath)
					});
				}
			}
		},

		urlToEsmPlugin(),
		esbuild(),

		keepCssImports({
			/**
			 * @param {string} assetId
			*/
			outputPath: (assetId) => {
				const r = mapModuleId(assetId, '.css');
				if (r !== undefined) {
					return join(outDir, r);
				}
				const relativePath = join(outDir, relative(root, assetId));
				return relativePath.replace(/(\.s[ca]ss)$/, ".min$1")
			},
		}),
		nodeResolve({
			dedupe: ['monaco-editor-core', '@vscode/monaco-lsp-client'],
			browser: true,
		}),
	],
});
