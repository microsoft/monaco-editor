/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const esbuild = require('esbuild');
const alias = require('esbuild-plugin-alias');
const path = require('path');
const cp = require('child_process');
const { removeDir, tsc, dts } = require('../../build/utils');

removeDir(`monaco-json/release`);
removeDir(`monaco-json/out`);

tsc(`monaco-json/src/tsconfig.json`);

dts(`monaco-json/out/amd/monaco.contribution.d.ts`, `monaco-json/monaco.d.ts`, 'monaco.languages.json');

esbuild.build({
	entryPoints: ['src/jsonMode.ts', 'src/json.worker.ts', 'src/monaco.contribution.ts'],
	bundle: true,
	target: 'esnext',
	format: 'esm',
	external: ['monaco-editor-core', '*/jsonMode'],
	outdir: 'release/esm/',
	plugins: [
		alias({
			'vscode-nls': path.join(__dirname, '../src/fillers/vscode-nls.ts'),
		}),
	],
}).then((result) => {
	if (result.errors.length > 0) {
		console.error(result.errors);
	}
	if (result.warnings.length > 0) {
		console.error(result.warnings);
	}
});

cp.spawnSync(process.execPath, [path.join(__dirname, './bundle.js')], { stdio: 'inherit', stderr: 'inherit' });
