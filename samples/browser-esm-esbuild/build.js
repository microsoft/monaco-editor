/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

removeDir('dist', (entry) => /index.html$/.test(entry));

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

/**
 * Remove a directory and all its contents.
 * @param {string} _dirPath
 * @param {(filename: string) => boolean} [keep]
 */
function removeDir(_dirPath, keep) {
	if (typeof keep === 'undefined') {
		keep = () => false;
	}
	const dirPath = path.join(__dirname, _dirPath);
	if (!fs.existsSync(dirPath)) {
		return;
	}
	rmDir(dirPath, _dirPath);
	console.log(`Deleted ${_dirPath}`);

	/**
	 * @param {string} dirPath
	 * @param {string} relativeDirPath
	 * @returns {boolean}
	 */
	function rmDir(dirPath, relativeDirPath) {
		let keepsFiles = false;
		const entries = fs.readdirSync(dirPath);
		for (const entry of entries) {
			const filePath = path.join(dirPath, entry);
			const relativeFilePath = path.join(relativeDirPath, entry);
			if (keep(relativeFilePath)) {
				keepsFiles = true;
				continue;
			}
			if (fs.statSync(filePath).isFile()) {
				fs.unlinkSync(filePath);
			} else {
				keepsFiles = rmDir(filePath, relativeFilePath) || keepsFiles;
			}
		}
		if (!keepsFiles) {
			fs.rmdirSync(dirPath);
		}
		return keepsFiles;
	}
}
