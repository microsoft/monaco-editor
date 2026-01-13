import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { join } from 'node:path/posix';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { urlToEsmPlugin } from './plugin';
import { changeExt, getEntryPoints, getNlsFiles } from '../shared.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const root = join(__dirname, '../../');
const mappedPaths = {
	[join(root, 'node_modules/monaco-editor-core/esm/')]: '.',
	[join(root, 'node_modules/')]: 'external/',
	[join(root, 'monaco-lsp-client/')]: 'external/monaco-lsp-client/',
	[join(root, 'src/deprecated')]: '.',
	[join(root, 'src/')]: '.',
};

/**
 * @param {string} moduleId
 * @param {string} newExt (with leading .)
 * @returns {string | undefined}
 */
function mapModuleId(moduleId, newExt) {
	for (const [key, val] of Object.entries(mappedPaths)) {
		if (moduleId.startsWith(key)) {
			const relativePath = moduleId.substring(key.length);
			const result = changeExt(join(val, relativePath), newExt);
			return result;
		}
	}
	return undefined;
}

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
					...getEntryPoints(),
					'nls.messages-loader': resolve(__dirname, 'src/nls.messages-loader.js'),
					// redirect that entry point
					'src/deprecated/editor/editor.main.ts': resolve(__dirname, 'src/editor.main.ts'),
				},
				name: 'monaco-editor',
				fileName: (_format, entryName) => {
					let result;
					const m = mapModuleId(join(root, entryName), '.js');
					if (m !== undefined) {
						result = m;
					} else {
						result = entryName + '.js';
					}
					return result;
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
				// some "new URL(...)" get translated to "require.toUrl(...)" in AMD.
				// Unfortunately Vite/Rollup do not detect that and do not add 'require' as a dependency.
				// Since we are planning to deprecate AMD, we just fix this here for now.
				name: 'fix-amd-require',
				generateBundle(_, bundle) {
					for (const chunk of Object.values(bundle)) {
						if (chunk.type === 'chunk' && chunk.code.includes('require.toUrl(')) {
							// Add 'require' to AMD dependencies and function params if using require.toUrl
							chunk.code = chunk.code.replace(
								/define\(("[^"]+"),\s*\[([^\]]*)\],\s*\(function\(([^)]*)\)/,
								(match, id, deps, params) => {
									if (!deps.includes('"require"')) {
										const newDeps = deps ? `"require", ${deps}` : '"require"';
										const newParams = params ? `require, ${params}` : 'require';
										return `define(${id}, [${newDeps}], (function(${newParams})`;
									}
									return match;
								}
							);
						}
					}
				}
			},
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
					for (const file of getNlsFiles()) {
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
