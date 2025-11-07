/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import * as path from 'path';

const REPO_ROOT = path.join(__dirname, '../');

const existingDirCache = new Set();

export function ensureDir(dirname: string) {
	/** @type {string[]} */
	const dirs = [];

	while (dirname.length > REPO_ROOT.length) {
		dirs.push(dirname);
		dirname = path.dirname(dirname);
	}
	dirs.reverse();
	dirs.forEach((dir) => {
		if (!existingDirCache.has(dir)) {
			try {
				fs.mkdirSync(dir);
			} catch (err) { }
			existingDirCache.add(dir);
		}
	});
}
