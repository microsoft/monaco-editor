/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

const { copyFile, removeDir, tsc, dts, buildESM, buildAMD } = require('../build/utils');

removeDir(`monaco-typescript/release`);
removeDir(`monaco-typescript/out`);

copyFile(
	`monaco-typescript/src/lib/typescriptServices-amd.js`,
	`monaco-typescript/out/amd/lib/typescriptServices.js`
);

tsc(`monaco-typescript/src/tsconfig.json`);

dts(
	`monaco-typescript/out/amd/monaco.contribution.d.ts`,
	`monaco-typescript/monaco.d.ts`,
	'monaco.languages.typescript'
);

buildESM({
	base: 'monaco-typescript',
	entryPoints: ['src/monaco.contribution.ts', 'src/tsMode.ts', 'src/ts.worker.ts'],
	external: ['monaco-editor-core', '*/tsMode']
});
buildAMD({
	base: 'monaco-typescript',
	entryPoint: 'src/monaco.contribution.ts',
	amdModuleId: 'vs/language/typescript/monaco.contribution',
	amdDependencies: ['vs/editor/editor.api']
});
buildAMD({
	base: 'monaco-typescript',
	entryPoint: 'src/tsMode.ts',
	amdModuleId: 'vs/language/typescript/tsMode'
});
buildAMD({
	base: 'monaco-typescript',
	entryPoint: 'src/tsWorker.ts',
	amdModuleId: 'vs/language/typescript/tsWorker',
	amdDependencies: []
});
