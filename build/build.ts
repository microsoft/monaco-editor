/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import glob from 'glob';
import { tsc, dts, buildESM, buildAMD } from './utils';
import { copyFile, removeDir } from './fs';

removeDir(`out`);

tsc(`src/tsconfig.json`);

//#region Type Defintion

dts(
	`out/amd/language/css/monaco.contribution.d.ts`,
	`out/release/css.d.ts`,
	'monaco.languages.css'
);
dts(
	`out/amd/language/html/monaco.contribution.d.ts`,
	`out/release/html.d.ts`,
	'monaco.languages.html'
);
dts(
	`out/amd/language/json/monaco.contribution.d.ts`,
	`out/release/json.d.ts`,
	'monaco.languages.json'
);
dts(
	`out/amd/language/typescript/monaco.contribution.d.ts`,
	`out/release/typescript.d.ts`,
	'monaco.languages.typescript'
);

//#endregion

//#region css

buildESM({
	base: 'language/css',
	entryPoints: [
		'src/language/css/monaco.contribution.ts',
		'src/language/css/cssMode.ts',
		'src/language/css/css.worker.ts'
	],
	external: ['monaco-editor-core', '*/cssMode', '*/monaco.contribution']
});
buildAMD({
	base: 'language/css',
	entryPoint: 'src/language/css/monaco.contribution.ts',
	amdModuleId: 'vs/language/css/monaco.contribution',
	amdDependencies: ['vs/editor/editor.api']
});
buildAMD({
	base: 'language/css',
	entryPoint: 'src/language/css/cssMode.ts',
	amdModuleId: 'vs/language/css/cssMode',
	external: ['*/monaco.contribution']
});
buildAMD({
	base: 'language/css',
	entryPoint: 'src/language/css/cssWorker.ts',
	amdModuleId: 'vs/language/css/cssWorker'
});

//#endregion

//#region html

buildESM({
	base: 'language/html',
	entryPoints: [
		'src/language/html/monaco.contribution.ts',
		'src/language/html/htmlMode.ts',
		'src/language/html/html.worker.ts'
	],
	external: ['monaco-editor-core', '*/htmlMode', '*/monaco.contribution']
});
buildAMD({
	base: 'language/html',
	entryPoint: 'src/language/html/monaco.contribution.ts',
	amdModuleId: 'vs/language/html/monaco.contribution',
	amdDependencies: ['vs/editor/editor.api']
});
buildAMD({
	base: 'language/html',
	entryPoint: 'src/language/html/htmlMode.ts',
	amdModuleId: 'vs/language/html/htmlMode',
	external: ['*/monaco.contribution']
});
buildAMD({
	base: 'language/html',
	entryPoint: 'src/language/html/htmlWorker.ts',
	amdModuleId: 'vs/language/html/htmlWorker'
});

//#endregion

//#region json

buildESM({
	base: 'language/json',
	entryPoints: [
		'src/language/json/monaco.contribution.ts',
		'src/language/json/jsonMode.ts',
		'src/language/json/json.worker.ts'
	],
	external: ['monaco-editor-core', '*/jsonMode', '*/monaco.contribution']
});
buildAMD({
	base: 'language/json',
	entryPoint: 'src/language/json/monaco.contribution.ts',
	amdModuleId: 'vs/language/json/monaco.contribution',
	amdDependencies: ['vs/editor/editor.api']
});
buildAMD({
	base: 'language/json',
	entryPoint: 'src/language/json/jsonMode.ts',
	amdModuleId: 'vs/language/json/jsonMode',
	external: ['*/monaco.contribution']
});
buildAMD({
	base: 'language/json',
	entryPoint: 'src/language/json/jsonWorker.ts',
	amdModuleId: 'vs/language/json/jsonWorker'
});

//#endregion

//#region typescript

copyFile(
	`src/language/typescript/lib/typescriptServices-amd.js`,
	`out/amd/language/typescript/lib/typescriptServices.js`
);

buildESM({
	base: 'language/typescript',
	entryPoints: [
		'src/language/typescript/monaco.contribution.ts',
		'src/language/typescript/tsMode.ts',
		'src/language/typescript/ts.worker.ts'
	],
	external: ['monaco-editor-core', '*/tsMode', '*/monaco.contribution']
});
buildAMD({
	base: 'language/typescript',
	entryPoint: 'src/language/typescript/monaco.contribution.ts',
	amdModuleId: 'vs/language/typescript/monaco.contribution',
	amdDependencies: ['vs/editor/editor.api']
});
buildAMD({
	base: 'language/typescript',
	entryPoint: 'src/language/typescript/tsMode.ts',
	amdModuleId: 'vs/language/typescript/tsMode',
	external: ['*/monaco.contribution']
});
buildAMD({
	base: 'language/typescript',
	entryPoint: 'src/language/typescript/tsWorker.ts',
	amdModuleId: 'vs/language/typescript/tsWorker'
});

//#endregion

//#region basic-languages

glob('../src/basic-languages/*/*.contribution.ts', { cwd: __dirname }, function (err, files) {
	if (err) {
		console.error(err);
		return;
	}

	const languages = files.map((file) => file.split('/')[3]);

	// ESM
	{
		/** @type {string[]} */
		const entryPoints = [
			'src/basic-languages/monaco.contribution.ts',
			'src/basic-languages/_.contribution.ts'
		];
		const external = ['monaco-editor-core', '*/_.contribution'];
		for (const language of languages) {
			entryPoints.push(`src/basic-languages/${language}/${language}.contribution.ts`);
			entryPoints.push(`src/basic-languages/${language}/${language}.ts`);
			external.push(`*/${language}.contribution`);
			external.push(`*/${language}`);
		}
		buildESM({
			base: 'basic-languages',
			entryPoints,
			external
		});
	}

	// AMD
	{
		buildAMD({
			base: 'basic-languages',
			entryPoint: 'src/basic-languages/monaco.contribution.ts',
			amdModuleId: 'vs/basic-languages/monaco.contribution',
			amdDependencies: ['vs/editor/editor.api']
		});
		for (const language of languages) {
			buildAMD({
				base: 'basic-languages',
				entryPoint: `src/basic-languages/${language}/${language}.ts`,
				amdModuleId: `vs/basic-languages/${language}/${language}`
			});
		}
	}
});

//#endregion
