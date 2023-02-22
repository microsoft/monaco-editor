/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import glob = require('glob');
import path = require('path');
import fs = require('fs');
import cp = require('child_process');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
import { REPO_ROOT } from '../utils';

const files = glob.sync('**/package.json', {
	cwd: REPO_ROOT,
	ignore: ['**/node_modules/**', '**/dist/**', '**/out/**']
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
	const stdio = 'inherit';
	const args = ['install'];

	console.log(`Installing dependencies in ${location}...`);
	console.log(`$ npm ${args.join(' ')}`);
	const result = cp.spawnSync(npm, args, {
		env: process.env,
		cwd: location,
		stdio
	});

	if (result.error || result.status !== 0) {
		process.exit(1);
	}
}
