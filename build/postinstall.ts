/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import cp = require('child_process');
import path = require('path');

function huskyInstall() {
	console.log(`Installing husky hooks...`);
	console.log(`$ husky install`);
	const result = cp.spawnSync(
		process.execPath,
		[path.join(__dirname, '../node_modules/husky/lib/bin.js'), 'install'],
		{ stdio: 'inherit' }
	);

	if (result.error || result.status !== 0) {
		process.exit(1);
	}
}

huskyInstall();
