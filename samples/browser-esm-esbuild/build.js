/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

const esbuild = require('esbuild');
const path = require('path');
const { removeDir } = require('../../build/fs');

removeDir('samples/browser-esm-esbuild/dist', (entry) => /index.html$/.test(entry));

const workerEntryPoints = [
	'vs/language/json/json.worker.js',
	'vs/language/css/css.worker.js',
	'vs/language/html/html.worker.js',
	'vs/language/typescript/ts.worker.js',
	'vs/editor/editor.worker.js'
];

build({
	entryPoints: workerEntryPoints.map((entry) => `../node_modules/monaco-editor/esm/${entry}`),
	bundle: true,
	format: 'iife',
	outbase: '../node_modules/monaco-editor/esm/',
	outdir: path.join(__dirname, 'dist')
});

build({
	entryPoints: ['index.js'],
	bundle: true,
	format: 'iife',
	outdir: path.join(__dirname, 'dist'),
	loader: {
		'.ttf': 'file'
	}
});

/**
 * @param {import ('esbuild').BuildOptions} opts
 */
function build(opts) {
	esbuild.build(opts).then((result) => {
		if (result.errors.length > 0) {
			console.error(result.errors);
		}
		if (result.warnings.length > 0) {
			console.error(result.warnings);
		}
	});
}
