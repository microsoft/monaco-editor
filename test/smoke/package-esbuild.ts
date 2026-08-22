/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { removeDir } from '../../build/fs';

removeDir('test/smoke/esbuild/out');

const workerEntryPoints = [
	'vs/language/json/json.worker.js',
	'vs/language/css/css.worker.js',
	'vs/language/html/html.worker.js',
	'vs/language/typescript/ts.worker.js',
	'vs/editor/editor.worker.js'
];

build({
	entryPoints: workerEntryPoints.map((entry) =>
		path.join(__dirname, `../../out/monaco-editor/esm/${entry}`)
	),
	bundle: true,
	format: 'iife',
	logLevel: 'silent',
	outbase: path.join(__dirname, '../../out/monaco-editor/esm/'),
	outdir: path.join(__dirname, 'esbuild/out')
});

build({
	entryPoints: [path.join(__dirname, 'esbuild/index.js')],
	bundle: true,
	format: 'iife',
	logLevel: 'silent',
	outdir: path.join(__dirname, 'esbuild/out'),
	loader: {
		'.ttf': 'file'
	}
});

build({
	stdin: {
		contents: fs.readFileSync(path.join(__dirname, 'esbuild/editor-main-css.js'), 'utf8'),
		// Resolve outside this package so the bare import exercises the generated package exports.
		resolveDir: os.tmpdir(),
		sourcefile: 'editor-main-css.js'
	},
	bundle: true,
	format: 'iife',
	logLevel: 'silent',
	outdir: path.join(__dirname, 'esbuild/out'),
	nodePaths: [path.join(__dirname, '../../out')],
	loader: {
		'.ttf': 'file'
	}
});

function build(opts: esbuild.BuildOptions) {
	esbuild.build(opts).then((result) => {
		const errors = result.errors;
		const warnings = result.warnings.filter((w) => {
			return (
				w.text !==
				'Top-level "this" will be replaced with undefined since this file is an ECMAScript module'
			);
		});
		if (errors.length > 0) {
			console.log(`errors:`);
			console.error(errors);
		}
		if (warnings.length > 0) {
			console.log(`warnings:`);
			console.error(warnings);
		}
	});
}
