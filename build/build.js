/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

const glob = require('glob');
const { copyFile, removeDir, tsc, dts, buildESM, buildAMD } = require('../build/utils');

removeDir(`out`);

tsc(`src/tsconfig.json`);

//#region Type Defintion

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
dts(
	`out/amd/typescript/monaco.contribution.d.ts`,
	`out/release/typescript/monaco.d.ts`,
	'monaco.languages.typescript'
);

//#endregion

//#region css

buildESM({
	base: 'css',
	entryPoints: ['src/css/monaco.contribution.ts', 'src/css/cssMode.ts', 'src/css/css.worker.ts'],
	external: ['monaco-editor-core', '*/cssMode']
});
buildAMD({
	base: 'css',
	entryPoint: 'src/css/monaco.contribution.ts',
	amdModuleId: 'vs/language/css/monaco.contribution',
	amdDependencies: ['vs/editor/editor.api']
});
buildAMD({
	base: 'css',
	entryPoint: 'src/css/cssMode.ts',
	amdModuleId: 'vs/language/css/cssMode'
});
buildAMD({
	base: 'css',
	entryPoint: 'src/css/cssWorker.ts',
	amdModuleId: 'vs/language/css/cssWorker'
});

//#endregion

//#region html

buildESM({
	base: 'html',
	entryPoints: [
		'src/html/monaco.contribution.ts',
		'src/html/htmlMode.ts',
		'src/html/html.worker.ts'
	],
	external: ['monaco-editor-core', '*/htmlMode']
});
buildAMD({
	base: 'html',
	entryPoint: 'src/html/monaco.contribution.ts',
	amdModuleId: 'vs/language/html/monaco.contribution',
	amdDependencies: ['vs/editor/editor.api']
});
buildAMD({
	base: 'html',
	entryPoint: 'src/html/htmlMode.ts',
	amdModuleId: 'vs/language/html/htmlMode'
});
buildAMD({
	base: 'html',
	entryPoint: 'src/html/htmlWorker.ts',
	amdModuleId: 'vs/language/html/htmlWorker'
});

//#endregion

//#region json

buildESM({
	base: 'json',
	entryPoints: [
		'src/json/monaco.contribution.ts',
		'src/json/jsonMode.ts',
		'src/json/json.worker.ts'
	],
	external: ['monaco-editor-core', '*/jsonMode']
});
buildAMD({
	base: 'json',
	entryPoint: 'src/json/monaco.contribution.ts',
	amdModuleId: 'vs/language/json/monaco.contribution',
	amdDependencies: ['vs/editor/editor.api']
});
buildAMD({
	base: 'json',
	entryPoint: 'src/json/jsonMode.ts',
	amdModuleId: 'vs/language/json/jsonMode'
});
buildAMD({
	base: 'json',
	entryPoint: 'src/json/jsonWorker.ts',
	amdModuleId: 'vs/language/json/jsonWorker'
});

//#endregion

//#region typescript

copyFile(
	`src/typescript/lib/typescriptServices-amd.js`,
	`out/amd/typescript/lib/typescriptServices.js`
);

buildESM({
	base: 'typescript',
	entryPoints: [
		'src/typescript/monaco.contribution.ts',
		'src/typescript/tsMode.ts',
		'src/typescript/ts.worker.ts'
	],
	external: ['monaco-editor-core', '*/tsMode']
});
buildAMD({
	base: 'typescript',
	entryPoint: 'src/typescript/monaco.contribution.ts',
	amdModuleId: 'vs/language/typescript/monaco.contribution',
	amdDependencies: ['vs/editor/editor.api']
});
buildAMD({
	base: 'typescript',
	entryPoint: 'src/typescript/tsMode.ts',
	amdModuleId: 'vs/language/typescript/tsMode'
});
buildAMD({
	base: 'typescript',
	entryPoint: 'src/typescript/tsWorker.ts',
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
