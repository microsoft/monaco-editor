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

copyFile(
	`monaco-typescript/src/lib/typescriptServices.js`,
	`monaco-typescript/out/esm/lib/typescriptServices.js`
);

tsc(`monaco-typescript/src/tsconfig.json`);

dts(
	`monaco-typescript/out/amd/monaco.contribution.d.ts`,
	`monaco-typescript/monaco.d.ts`,
	'monaco.languages.typescript'
);

buildESM({
	entryPoints: ['src/monaco.contribution.ts', 'src/tsMode.ts', 'src/ts.worker.ts'],
	external: ['monaco-editor-core', '*/tsMode']
});
buildAMD({
	entryPoint: 'src/monaco.contribution.ts',
	banner: 'define("vs/language/typescript/monaco.contribution",["vs/editor/editor.api"],()=>{'
});
buildAMD({
	entryPoint: 'src/tsMode.ts',
	banner: 'define("vs/language/typescript/tsMode",["vs/editor/editor.api"],()=>{'
});
buildAMD({
	entryPoint: 'src/tsWorker.ts',
	banner: 'define("vs/language/typescript/tsWorker",[],()=>{'
});
