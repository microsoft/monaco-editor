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
import { copyFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync } from 'fs';

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
	[join(root, 'monaco-lsp-client/')]: 'external/monaco-lsp-client/',
	[join(root, 'src/')]: 'vs/',
};

function getNlsEntryPoints() {
	// Scan for nls.messages.*.js files dynamically
	const nlsDir = dirname(fileURLToPath(import.meta.resolve('monaco-editor-core/esm/nls.messages.en.js')));
	const nlsFiles = readdirSync(nlsDir)
		.filter(file => file.startsWith('nls.messages.') && file.endsWith('.js'))
		.reduce((acc, file) => {
			// @ts-ignore
			acc[file] = join(nlsDir, file);
			return acc;
		}, {});
	return nlsFiles;
}

export default defineConfig({
	input: {
		entry: join(root, './src/editor/editor.main.ts'),
		editorAll: join(root, './src/editor/editor.all.ts'),
		edcoreMain: join(root, './src/editor/edcore.main.ts'),
		editorApi: join(root, './src/editor/editor.api.ts'),
		editorWorker: join(root, './src/editor/editor.worker.ts'),
		...getNlsEntryPoints(),
	},

	output: {
		dir: outDir,
		format: 'es',

		entryFileNames: function (chunkInfo) {
			const moduleId = chunkInfo.facadeModuleId;
			if (moduleId) {
				for (const [key, val] of Object.entries(mappedPaths)) {
					if (moduleId.startsWith(key)) {
						const relativePath = moduleId.substring(key.length);
						return changeExt(join(val, relativePath), '.js');
					}
				}
			}
			return '[name].js';
		},
		preserveModules: true,
	},


	plugins: [
		del({ targets: outDir, force: true }),

		{
			name: 'copy-codicon-font',
			buildEnd() {
				const codiconSource = join(root, 'node_modules/monaco-editor-core/esm/vs/base/browser/ui/codicons/codicon/codicon.ttf');
				const codiconDest = join(outDir, 'vs/base/browser/ui/codicons/codicon/codicon.ttf');
				mkdirSync(dirname(codiconDest), { recursive: true });
				copyFileSync(codiconSource, codiconDest);
			}
		},

		urlToEsmPlugin(),
		esbuild(),

		keepCssImports({
			/**
			 * @param {string} assetId
			*/
			outputPath: (assetId) => {
				for (const [key, val] of Object.entries(mappedPaths)) {
					if (assetId.startsWith(key)) {
						const relativePath = assetId.substring(key.length);
						return changeExt(join(outDir, val, relativePath), '.css');
					}
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
