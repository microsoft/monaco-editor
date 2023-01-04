/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as esbuild from 'esbuild';
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
	entryPoints: workerEntryPoints.map((entry) => path.join(__dirname, `../../release/esm/${entry}`)),
	bundle: true,
	format: 'iife',
	logLevel: 'silent',
	outbase: path.join(__dirname, '../../release/esm/'),
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
