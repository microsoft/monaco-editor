/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

const { removeDir, tsc, dts, buildESM2, buildAMD2 } = require('../build/utils');

removeDir(`out`);

tsc(`src/tsconfig.json`);

dts(`out/amd/css/monaco.contribution.d.ts`, `out/release/css/monaco.d.ts`, 'monaco.languages.css');
dts(
	`out/amd/html/monaco.contribution.d.ts`,
	`out/release/html/monaco.d.ts`,
	'monaco.languages.html'
);

buildESM2({
	base: 'css',
	entryPoints: ['src/css/monaco.contribution.ts', 'src/css/cssMode.ts', 'src/css/css.worker.ts'],
	external: ['monaco-editor-core', '*/cssMode']
});
buildAMD2({
	base: 'css',
	entryPoint: 'src/css/monaco.contribution.ts',
	amdModuleId: 'vs/language/css/monaco.contribution',
	amdDependencies: ['vs/editor/editor.api']
});
buildAMD2({
	base: 'css',
	entryPoint: 'src/css/cssMode.ts',
	amdModuleId: 'vs/language/css/cssMode'
});
buildAMD2({
	base: 'css',
	entryPoint: 'src/css/cssWorker.ts',
	amdModuleId: 'vs/language/css/cssWorker'
});

buildESM2({
	base: 'html',
	entryPoints: [
		'src/html/monaco.contribution.ts',
		'src/html/htmlMode.ts',
		'src/html/html.worker.ts'
	],
	external: ['monaco-editor-core', '*/htmlMode']
});
buildAMD2({
	base: 'html',
	entryPoint: 'src/html/monaco.contribution.ts',
	amdModuleId: 'vs/language/html/monaco.contribution',
	amdDependencies: ['vs/editor/editor.api']
});
buildAMD2({
	base: 'html',
	entryPoint: 'src/html/htmlMode.ts',
	amdModuleId: 'vs/language/html/htmlMode'
});
buildAMD2({
	base: 'html',
	entryPoint: 'src/html/htmlWorker.ts',
	amdModuleId: 'vs/language/html/htmlWorker'
});
