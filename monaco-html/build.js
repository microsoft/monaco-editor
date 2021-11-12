/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

const { removeDir, tsc, dts, buildESM, buildAMD } = require('../build/utils');

removeDir(`monaco-html/release`);
removeDir(`monaco-html/out`);

tsc(`monaco-html/src/tsconfig.json`);

dts(
	`monaco-html/out/amd/monaco.contribution.d.ts`,
	`monaco-html/monaco.d.ts`,
	'monaco.languages.html'
);

buildESM({
	base: 'monaco-html',
	entryPoints: ['src/monaco.contribution.ts', 'src/htmlMode.ts', 'src/html.worker.ts'],
	external: ['monaco-editor-core', '*/htmlMode']
});
buildAMD({
	base: 'monaco-html',
	entryPoint: 'src/monaco.contribution.ts',
	amdModuleId: 'vs/language/html/monaco.contribution',
	amdDependencies: ['vs/editor/editor.api']
});
buildAMD({
	base: 'monaco-html',
	entryPoint: 'src/htmlMode.ts',
	amdModuleId: 'vs/language/html/htmlMode'
});
buildAMD({
	base: 'monaco-html',
	entryPoint: 'src/htmlWorker.ts',
	amdModuleId: 'vs/language/html/htmlWorker'
});
