/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

const fs = require('fs');
const cp = require('child_process');
const packageJson = require('../../../package.json');

if (process.argv.length !== 4) {
	console.error(`usage: node computeState.js <"workflow_dispatch"|"schedule"> <"true"|"false">`);
	process.exit(1);
}

const EVENT_NAME = /** @type {'workflow_dispatch'|'schedule'} */ (process.argv[2]);
const STR_NIGHTLY = /** @type {'true'|'false'|''} */ (process.argv[3]);

if (!/^((workflow_dispatch)|(schedule))$/.test(EVENT_NAME)) {
	console.error(`usage: node computeState.js <"workflow_dispatch"|"schedule"> <"true"|"false">`);
	process.exit(2);
}

if (!/^((true)|(false)|())$/.test(STR_NIGHTLY)) {
	console.error(`usage: node computeState.js <"workflow_dispatch"|"schedule"> <"true"|"false">`);
	process.exit(3);
}

const NIGHTLY = EVENT_NAME === 'schedule' || STR_NIGHTLY === 'true';

const distTag = NIGHTLY ? 'next' : 'latest';

const latestMonacoEditorVersion = npmGetLatestVersion('monaco-editor');
const version = (() => {
	if (NIGHTLY) {
		const pieces = latestMonacoEditorVersion.split('.');
		const minor = parseInt(pieces[1], 10);
		const date = new Date();
		const yyyy = date.getUTCFullYear();
		const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
		const dd = String(date.getUTCDate()).padStart(2, '0');
		return `0.${minor + 1}.0-dev.${yyyy}${mm}${dd}`;
	} else {
		return packageJson.version;
	}
})();

const vscodeBranch = (() => {
	if (NIGHTLY) {
		return 'main';
	} else {
		return packageJson.vscode;
	}
})();

const skipMonacoEditorCore = (() => {
	return /** @type {'true'|'false'} */ (String(npmExists('monaco-editor-core', version)));
})();

const skipMonacoEditor = (() => {
	return /** @type {'true'|'false'} */ (String(npmExists('monaco-editor', version)));
})();

console.log(`
::set-output name=dist_tag::${distTag}
::set-output name=version::${version}
::set-output name=vscode_branch::${vscodeBranch}
::set-output name=skip_monaco_editor_core::${skipMonacoEditorCore}
::set-output name=skip_monaco_editor::${skipMonacoEditor}
`);

/**
 * @param {string} packageName
 * @returns {string}
 */
function npmGetLatestVersion(packageName) {
	const output = cp.execSync(`npm show ${packageName} version`).toString();
	const version = output.split(/\r\n|\r|\n/g)[0];
	if (!/^0\.(\d+)\.(\d+)$/.test(version)) {
		console.error(`version ${version} does not match 0.x.y`);
		process.exit(1);
	}
	return version;
}

/**
 * @param {string} packageName
 * @param {string} version
 * @returns {boolean}
 */
function npmExists(packageName, version) {
	const output = cp.execSync(`npm show ${packageName}@${version} version`).toString();
	const result = output.split(/\r\n|\r|\n/g)[0];
	if (result.trim().length === 0) {
		return false;
	}
	return true;
}
