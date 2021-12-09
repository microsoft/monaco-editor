/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

const fs = require('fs');
const cp = require('child_process');

if (process.argv.length !== 3) {
	console.error(`usage: node updateVersion.js <PATH_TO_PACKAGE_JSON_FILE>`);
	process.exit(1);
}

const packagejson = JSON.parse(fs.readFileSync(process.argv[2]).toString());
const packageName = packagejson.name;
if (packageName !== 'monaco-editor' && packageName !== 'monaco-editor-core') {
	console.error(`expected name to be 'monaco-editor' or 'monaco-editor-core'`);
	process.exit(1);
}

/** @type {string} */
const latestVersion = (() => {
	const output = cp.execSync(`npm show ${packageName} version`).toString();
	const version = output.split(/\r\n|\r|\n/g)[0];
	if (!/\d+\.\d+\.\d+/.test(version)) {
		console.log('unrecognized package.json version: ' + version);
		process.exit(1);
	}
	return version;
})();

if (!/^0\.(\d+)\.(\d+)$/.test(latestVersion)) {
	console.error(`version ${latestVersion} does not match 0.x.y`);
	process.exit(1);
}

const devVersion = (() => {
	const pieces = latestVersion.split('.');
	const minor = parseInt(pieces[1], 10);
	const date = new Date();
	const yyyy = date.getUTCFullYear();
	const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
	const dd = String(date.getUTCDate()).padStart(2, '0');
	return `0.${minor + 1}.0-dev.${yyyy}${mm}${dd}`;
})();

packagejson.version = devVersion;
fs.writeFileSync(process.argv[2], JSON.stringify(packagejson, null, '\t') + '\n');
