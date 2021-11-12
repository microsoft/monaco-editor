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
	entryPoints: ['src/monaco.contribution.ts', 'src/cssMode.ts', 'src/css.worker.ts'],
	external: ['monaco-editor-core', '*/cssMode']
});
buildAMD({
	entryPoint: 'src/monaco.contribution.ts',
	banner: 'define("vs/language/css/monaco.contribution",["vs/editor/editor.api"],()=>{'
});
buildAMD({
	entryPoint: 'src/cssMode.ts',
	banner: 'define("vs/language/css/cssMode",["vs/editor/editor.api"],()=>{'
});
buildAMD({
	entryPoint: 'src/cssWorker.ts',
	banner: 'define("vs/language/css/cssWorker",[],()=>{'
});
