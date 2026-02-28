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

/**
 * Remove a directory and all its contents.
 */
export function removeDir(_dirPath: string, keep?: (filename: string) => boolean) {
	if (typeof keep === 'undefined') {
		keep = () => false;
	}
	const dirPath = path.join(REPO_ROOT, _dirPath);
	if (!fs.existsSync(dirPath)) {
		return;
	}
	rmDir(dirPath, _dirPath);
	console.log(`Deleted ${_dirPath}`);

	function rmDir(dirPath: string, relativeDirPath: string): boolean {
		let keepsFiles = false;
		const entries = fs.readdirSync(dirPath);
		for (const entry of entries) {
			const filePath = path.join(dirPath, entry);
			const relativeFilePath = path.join(relativeDirPath, entry);
			if (keep!(relativeFilePath)) {
				keepsFiles = true;
				continue;
			}
			if (fs.statSync(filePath).isFile()) {
				fs.unlinkSync(filePath);
			} else {
				keepsFiles = rmDir(filePath, relativeFilePath) || keepsFiles;
			}
		}
		if (!keepsFiles) {
			fs.rmdirSync(dirPath);
		}
		return keepsFiles;
	}
}
