/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

const fs = require('fs');

if (process.argv.length !== 5) {
	console.error(
		`usage: node setDevDependencyVersion.js <PATH_TO_PACKAGE_JSON_FILE> <PACKAGE> <VERSION>`
	);
	process.exit(1);
}

const packagejson = JSON.parse(fs.readFileSync(process.argv[2]).toString());
packagejson['devDependencies'][process.argv[3]] = process.argv[4];
fs.writeFileSync(process.argv[2], JSON.stringify(packagejson, null, '\t') + '\n');
