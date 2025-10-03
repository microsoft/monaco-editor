import { readFileSync } from 'node:fs';
import { glob } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { urlToEsmPlugin } from './plugin';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(async (args) => {
	const monacoEditorCoreDir = join(
		dirname(require.resolve('monaco-editor-core/package.json')),
		'esm'
	);
	const nlsEntries = {};
	for await (const path of glob(`${monacoEditorCoreDir}/nls.messages.*.js`)) {
		const entryName = basename(path).replace('.js', '');
		nlsEntries[entryName] = path;
	}

	/** @type {import('vite').UserConfig} */
	return {
		base: './',
		define: {
			AMD: false
		},
		build: {
			lib: {
				cssFileName: 'editor/editor.main',
				entry: {
					...nlsEntries,
					'nls.messages-loader': resolve(__dirname, 'src/nls.messages-loader.js'),
					'editor/editor.main': resolve(__dirname, 'src/editor.main.js'),
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
