import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { urlToEsmPlugin } from './plugin';
import { getAdditionalEntryPoints, getAdditionalFiles, mapModuleId, root } from '../shared.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(async (args) => {
	/** @type {import('vite').UserConfig} */
	return {
		base: './',
		resolve: {
			dedupe: ['monaco-editor-core']
		},
		build: {
			lib: {
				cssFileName: 'editor/editor.main',
				entry: {
					...getAdditionalEntryPoints(),
					'nls.messages-loader': resolve(__dirname, 'src/nls.messages-loader.js'),
					'editor/editor.main': resolve(__dirname, 'src/editor.main.ts'),
				},
				name: 'monaco-editor',
				fileName: (_format, entryName) => {
					const m = mapModuleId(join(root, entryName), '.js');
					if (m !== undefined) {
						return m;
					}
					return entryName + '.js';
				},
				formats: ['amd']
			},
			outDir: resolve(
				__dirname,
				'../../out/monaco-editor/',
				args.mode === 'development' ? 'dev' : 'min',
				'vs'
			),
			rollupOptions: {
				external: ['require', 'vs/nls.messages-loader!'],
				output: {
					amd: {
						basePath: 'vs',
						autoId: true
					}
				}
			},
			minify: args.mode !== 'development',
			emptyOutDir: true
		},
		plugins: [
			{
				name: 'copy-loader',
				apply: 'build',
				generateBundle() {
					this.emitFile({
						type: 'asset',
						fileName: 'loader.js',
						source: readFileSync(resolve(__dirname, './src/loader.js'), 'utf-8')
					});
				}
			},
			{
				name: 'emit-additional-files',
				generateBundle() {
					for (const file of getAdditionalFiles()) {
						this.emitFile({
							type: 'asset',
							fileName: file.pathFromRoot,
							source: 'value' in file.source ? file.source.value : readFileSync(file.source.absolutePath)
						});
					}
				}
			},
			urlToEsmPlugin()
		]
	};
});
