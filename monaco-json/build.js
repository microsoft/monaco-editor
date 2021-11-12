/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

const { removeDir, tsc, dts, buildESM, buildAMD } = require('../build/utils');

removeDir(`monaco-json/release`);
removeDir(`monaco-json/out`);

tsc(`monaco-json/src/tsconfig.json`);

dts(
	`monaco-json/out/amd/monaco.contribution.d.ts`,
	`monaco-json/monaco.d.ts`,
	'monaco.languages.json'
);

buildESM({
	entryPoints: ['src/monaco.contribution.ts', 'src/jsonMode.ts', 'src/json.worker.ts'],
	external: ['monaco-editor-core', '*/jsonMode']
});
buildAMD({
	entryPoint: 'src/monaco.contribution.ts',
	banner: 'define("vs/language/json/monaco.contribution",["vs/editor/editor.api"],()=>{'
});
buildAMD({
	entryPoint: 'src/jsonMode.ts',
	banner: 'define("vs/language/json/jsonMode",["vs/editor/editor.api"],()=>{'
});
buildAMD({
	entryPoint: 'src/jsonWorker.ts',
	banner: 'define("vs/language/json/jsonWorker",[],()=>{'
});
