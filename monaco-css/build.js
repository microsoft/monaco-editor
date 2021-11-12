/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const esbuild = require('esbuild');
const alias = require('esbuild-plugin-alias');
const path = require('path');
const { removeDir, tsc, dts } = require('../build/utils');

removeDir(`monaco-css/release`);
removeDir(`monaco-css/out`);

tsc(`monaco-css/src/tsconfig.json`);

dts(
	`monaco-css/out/amd/monaco.contribution.d.ts`,
	`monaco-css/monaco.d.ts`,
	'monaco.languages.css'
);

/**
 * @param {import('esbuild').BuildOptions} options
 */
function build(options) {
	esbuild.build(options).then((result) => {
		if (result.errors.length > 0) {
			console.error(result.errors);
		}
		if (result.warnings.length > 0) {
			console.error(result.warnings);
		}
	});
}

build({
	entryPoints: ['src/monaco.contribution.ts', 'src/cssMode.ts', 'src/css.worker.ts'],
	bundle: true,
	target: 'esnext',
	format: 'esm',
	define: {
		AMD: false
	},
	external: ['monaco-editor-core', '*/cssMode'],
	outdir: 'release/esm/',
	plugins: [
		alias({
			'vscode-nls': path.join(__dirname, 'src/fillers/vscode-nls.ts')
		})
	]
});

/**
 * @param {'dev'|'min'} type
 * @param {string} entryPoint
 * @param {string} banner
 */
function buildOneAMD(type, entryPoint, banner) {
	/** @type {import('esbuild').BuildOptions} */
	const options = {
		entryPoints: [entryPoint],
		bundle: true,
		target: 'esnext',
		format: 'iife',
		define: {
			AMD: true
		},
		external: ['*/cssMode'],
		globalName: 'moduleExports',
		banner: {
			js: banner
		},
		footer: {
			js: 'return moduleExports;\n});'
		},
		outdir: `release/${type}/`,
		plugins: [
			alias({
				'vscode-nls': path.join(__dirname, 'src/fillers/vscode-nls.ts'),
				'monaco-editor-core': path.join(__dirname, 'src/fillers/monaco-editor-core-amd.ts')
			})
		]
	};
	if (type === 'min') {
		options.minify = true;
	}
	build(options);
}

/**
 * @param {string} entryPoint
 * @param {string} banner
 */
function buildAMD(entryPoint, banner) {
	buildOneAMD('dev', entryPoint, banner);
	buildOneAMD('min', entryPoint, banner);
}

buildAMD(
	'src/monaco.contribution.ts',
	'define("vs/language/css/monaco.contribution",["vs/editor/editor.api"],()=>{'
);
buildAMD('src/cssMode.ts', 'define("vs/language/css/cssMode",["vs/editor/editor.api"],()=>{');
buildAMD('src/cssWorker.ts', 'define("vs/language/css/cssWorker",[],()=>{');
