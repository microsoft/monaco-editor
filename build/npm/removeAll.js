/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

const glob = require('glob');
const path = require('path');
const fs = require('fs');
const { REPO_ROOT } = require('../utils');

const files = glob.sync('**/package-lock.json', {
	cwd: REPO_ROOT,
	ignore: ['**/node_modules/**', '**/out/**', '**/release/**']
});

for (const file of files) {
	const filePath = path.join(REPO_ROOT, file);
	console.log(`Deleting ${file}...`);
	fs.unlinkSync(filePath);
}
