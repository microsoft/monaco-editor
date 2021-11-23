/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

const fs = require('fs');

if (process.argv.length !== 3) {
	console.error(`usage: node updateVersion.js <PATH_TO_PACKAGE_JSON_FILE>`);
	process.exit(1);
}

const packagejson = JSON.parse(fs.readFileSync(process.argv[2]).toString());

const date = new Date();
packagejson.version += `-dev.${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(
	2,
	'0'
)}${String(date.getUTCDate()).padStart(2, '0')}`;
fs.writeFileSync(process.argv[2], JSON.stringify(packagejson, null, '\t') + '\n');
