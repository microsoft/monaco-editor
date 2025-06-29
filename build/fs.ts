/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import * as path from 'path';

const REPO_ROOT = path.join(__dirname, '../');

const existingDirCache = new Set();

export function ensureDir(dirname: string) {
	// Node.js ≥10 supports the recursive option for mkdirSync, which creates all
	// parent folders that do not yet exist. This is more robust than the manual
	// loop above and avoids race-conditions when multiple processes attempt to
	// create the same directory tree concurrently.
	if (!existingDirCache.has(dirname)) {
		fs.mkdirSync(dirname, { recursive: true });
		existingDirCache.add(dirname);
	}
}

/**
 * Copy a file.
 */
export function copyFile(_source: string, _destination: string) {
	const source = path.join(REPO_ROOT, _source);
	const destination = path.join(REPO_ROOT, _destination);

	ensureDir(path.dirname(destination));
	fs.writeFileSync(destination, fs.readFileSync(source));

	console.log(`Copied ${_source} to ${_destination}`);
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
			// fs.rmdirSync is deprecated for non-empty directories and removed in
			// future Node.js versions. fs.rmSync with { recursive: true, force: true }
			// is the recommended API.
			fs.rmSync(dirPath, { recursive: true, force: true });
		}
		return keepsFiles;
	}
}
