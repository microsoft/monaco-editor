/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import path = require('path');
import fs = require('fs');
import { REPO_ROOT, readFiles, writeFiles } from '../build/utils';
import { generateEsmMetadataJsAndDTs } from './releaseMetadata';
import { buildESM } from './esm/build.script';
import { buildAmdMinDev } from './amd/build.script';
import { rm } from 'fs/promises';

async function run() {
	await rm(path.join(REPO_ROOT, './out/monaco-editor'), { recursive: true, force: true });

	await buildESM();
	await buildAmdMinDev();

	// copy types.d.ts from build/amd/out/ to out/monaco-editor/monaco.d.ts (and append `declare global { export import monaco = editor_main; }`)
	(() => {
		let contents = fs.readFileSync('build/amd/out/types.d.ts', { encoding: 'utf8' });
		contents += '\n\ndeclare global { export import monaco = editor_main; }\n';
		fs.writeFileSync('out/monaco-editor/monaco.d.ts', contents);
	})();

	createThirdPartyNoticesDotTxt();
	generateEsmMetadataJsAndDTs();

	// package.json
	(() => {
		const packageJSON = readFiles('package.json', { base: '' })[0];
		const json = JSON.parse(packageJSON.contents.toString());

		json.private = false;
		delete json.scripts['postinstall'];

		packageJSON.contents = Buffer.from(JSON.stringify(json, null, '  '));
		writeFiles([packageJSON], `out/monaco-editor`);
	})();

	(() => {
		/** @type {IFile[]} */
		let otherFiles = [];

		otherFiles = otherFiles.concat(readFiles('README.md', { base: '' }));
		otherFiles = otherFiles.concat(readFiles('CHANGELOG.md', { base: '' }));
		otherFiles = otherFiles.concat(
			readFiles('node_modules/monaco-editor-core/LICENSE', {
				base: 'node_modules/monaco-editor-core/'
			})
		);

		writeFiles(otherFiles, `out/monaco-editor`);
	})();
}

/**
 * Edit ThirdPartyNotices.txt:
 * - append ThirdPartyNotices.txt from plugins
 */
function createThirdPartyNoticesDotTxt() {
	const tpn = readFiles('node_modules/monaco-editor-core/ThirdPartyNotices.txt', {
		base: 'node_modules/monaco-editor-core'
	})[0];

	let contents = tpn.contents.toString();

	console.log('ADDING ThirdPartyNotices from ./ThirdPartyNotices.txt');
	let thirdPartyNoticeContent = fs
		.readFileSync(path.join(REPO_ROOT, 'ThirdPartyNotices.txt'))
		.toString();
	thirdPartyNoticeContent = thirdPartyNoticeContent.split('\n').slice(8).join('\n');

	contents += '\n' + thirdPartyNoticeContent;
	tpn.contents = Buffer.from(contents);

	writeFiles([tpn], `out/monaco-editor`);
}

run();
