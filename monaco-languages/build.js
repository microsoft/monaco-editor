/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

const glob = require('glob');
const { removeDir, tsc, buildESM, buildAMD } = require('../build/utils');

removeDir(`monaco-languages/release`);
removeDir(`monaco-languages/out`);

tsc(`monaco-languages/src/tsconfig.json`);

glob('src/*/*.contribution.ts', { cwd: __dirname }, function (err, files) {
	if (err) {
		console.error(err);
		return;
	}

	const languages = files.map((file) => file.split('/')[1]);

	// ESM
	{
		/** @type {string[]} */
		const entryPoints = ['src/monaco.contribution.ts', 'src/_.contribution.ts'];
		const external = ['monaco-editor-core', '*/_.contribution'];
		for (const language of languages) {
			entryPoints.push(`src/${language}/${language}.contribution.ts`);
			entryPoints.push(`src/${language}/${language}.ts`);
			external.push(`*/${language}.contribution`);
			external.push(`*/${language}`);
		}
		buildESM({
			entryPoints,
			external
		});
	}

	// AMD
	{
		buildAMD({
			entryPoint: 'src/monaco.contribution.ts',
			banner: 'define("vs/basic-languages/monaco.contribution",["vs/editor/editor.api"],()=>{'
		});
		for (const language of languages) {
			buildAMD({
				entryPoint: `src/${language}/${language}.ts`,
				banner: `define("vs/basic-languages/${language}/${language}",[],()=>{`
			});
		}
	}
});
