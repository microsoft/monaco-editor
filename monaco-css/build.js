/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

const { removeDir, tsc, dts, buildESM, buildAMD } = require('../build/utils');

removeDir(`monaco-css/release`);
removeDir(`monaco-css/out`);

tsc(`monaco-css/src/tsconfig.json`);

dts(
	`monaco-css/out/amd/monaco.contribution.d.ts`,
	`monaco-css/monaco.d.ts`,
	'monaco.languages.css'
);

buildESM({
	base: 'monaco-css',
	entryPoints: ['src/monaco.contribution.ts', 'src/cssMode.ts', 'src/css.worker.ts'],
	external: ['monaco-editor-core', '*/cssMode']
});
buildAMD({
	base: 'monaco-css',
	entryPoint: 'src/monaco.contribution.ts',
	amdModuleId: 'vs/language/css/monaco.contribution',
	amdDependencies: ['vs/editor/editor.api']
});
buildAMD({
	base: 'monaco-css',
	entryPoint: 'src/cssMode.ts',
	amdModuleId: 'vs/language/css/cssMode'
});
buildAMD({
	base: 'monaco-css',
	entryPoint: 'src/cssWorker.ts',
	amdModuleId: 'vs/language/css/cssWorker'
});
