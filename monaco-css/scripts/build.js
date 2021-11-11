/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const esbuild = require('esbuild');
const alias = require('esbuild-plugin-alias');
const path = require('path');
const cp = require('child_process');
const { copyFile, removeDir, tsc, dts } = require('../../build/utils');

removeDir(`monaco-css/release`);
removeDir(`monaco-css/out`);

tsc(`monaco-css/src/tsconfig.json`);

dts(`monaco-css/out/amd/monaco.contribution.d.ts`, `monaco-css/monaco.d.ts`, 'monaco.languages.css');

cp.spawnSync(process.execPath, [path.join(__dirname, '../../node_modules/prettier/bin-prettier.js'), '--write', path.join(__dirname, '../monaco.d.ts')], { stdio: 'inherit', stderr: 'inherit' });

esbuild.build({
	entryPoints: ['src/cssMode.ts', 'src/css.worker.ts', 'src/monaco.contribution.ts'],
	bundle: true,
	target: 'esnext',
	format: 'esm',
	external: ['monaco-editor-core', '*/cssMode'],
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

copyFile('monaco-css/out/amd/monaco.contribution.d.ts', 'monaco-css/release/esm/monaco.contribution.d.ts');
copyFile('monaco-css/out/amd/fillers/monaco-editor-core.d.ts', 'monaco-css/release/esm/fillers/monaco-editor-core.d.ts');

cp.spawnSync(process.execPath, [path.join(__dirname, './bundle.js')], { stdio: 'inherit', stderr: 'inherit' });
