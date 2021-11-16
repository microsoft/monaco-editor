/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

const glob = require('glob');
const path = require('path');
const fs = require('fs');
const cp = require('child_process');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const { REPO_ROOT } = require('../utils');

const files = glob.sync('**/package.json', {
	cwd: REPO_ROOT,
	ignore: ['**/node_modules/**', '**/out/**', '**/release/**']
});

for (const file of files) {
	const filePath = path.join(REPO_ROOT, file);
	const contents = JSON.parse(fs.readFileSync(filePath).toString());
	if (!contents.dependencies && !contents.devDependencies && !contents.optionalDependencies) {
		// nothing to install
		continue;
	}

	npmInstall(path.dirname(file));
}

function npmInstall(location) {
	/** @type {'inherit'} */
	const stdio = 'inherit';
	const opts = {
		env: process.env,
		cwd: location,
		stdio
	};
	const args = ['install'];

	console.log(`Installing dependencies in ${location}...`);
	console.log(`$ npm ${args.join(' ')}`);
	const result = cp.spawnSync(npm, args, opts);

	if (result.error || result.status !== 0) {
		process.exit(1);
	}
}
