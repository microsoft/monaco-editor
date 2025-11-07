import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { urlToEsmPlugin } from './plugin';
import { getNlsEntryPoints } from '../shared.mjs';

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
					...getNlsEntryPoints(),
					'nls.messages-loader': resolve(__dirname, 'src/nls.messages-loader.js'),
					'editor/editor.main': resolve(__dirname, 'src/editor.main.ts'),
					'basic-languages/monaco.contribution': resolve(
						__dirname,
						'../../src/basic-languages/monaco.contribution.ts'
					),
					'language/css/monaco.contribution': resolve(
						__dirname,
						'../../src/language/css/monaco.contribution.ts'
					),
					'language/html/monaco.contribution': resolve(
						__dirname,
						'../../src/language/html/monaco.contribution.ts'
					),
					'language/json/monaco.contribution': resolve(
						__dirname,
						'../../src/language/json/monaco.contribution.ts'
					),
					'language/typescript/monaco.contribution': resolve(
						__dirname,
						'../../src/language/typescript/monaco.contribution.ts'
					)
				},
				name: 'monaco-editor',
				fileName: (_format, entryName) => entryName + '.js',
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
			urlToEsmPlugin()
		]
	};
});
