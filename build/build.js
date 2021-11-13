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
dts(
	`out/amd/json/monaco.contribution.d.ts`,
	`out/release/json/monaco.d.ts`,
	'monaco.languages.json'
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

buildESM2({
	base: 'json',
	entryPoints: ['src/json/monaco.contribution.ts', 'src/json/jsonMode.ts', 'src/json/json.worker.ts'],
	external: ['monaco-editor-core', '*/jsonMode']
});
buildAMD2({
	base: 'json',
	entryPoint: 'src/json/monaco.contribution.ts',
	amdModuleId: 'vs/language/json/monaco.contribution',
	amdDependencies: ['vs/editor/editor.api']
});
buildAMD2({
	base: 'json',
	entryPoint: 'src/json/jsonMode.ts',
	amdModuleId: 'vs/language/json/jsonMode'
});
buildAMD2({
	base: 'json',
	entryPoint: 'src/json/jsonWorker.ts',
	amdModuleId: 'vs/language/json/jsonWorker'
});
