/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '../');

const existingDirCache = new Set();
/**
 * @param {string} dirname
 */
function ensureDir(dirname) {
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
			} catch (err) {}
			existingDirCache.add(dir);
		}
	});
}
exports.ensureDir = ensureDir;

/**
 * Copy a file.
 *
 * @param {string} _source
 * @param {string} _destination
 */
function copyFile(_source, _destination) {
	const source = path.join(REPO_ROOT, _source);
	const destination = path.join(REPO_ROOT, _destination);

	ensureDir(path.dirname(destination));
	fs.writeFileSync(destination, fs.readFileSync(source));

	console.log(`Copied ${_source} to ${_destination}`);
}
exports.copyFile = copyFile;

/**
 * Remove a directory and all its contents.
 *
 * @param {string} _dirPath
 * @param {((filename:string)=>boolean)} [keep]
 */
function removeDir(_dirPath, keep) {
	if (typeof keep === 'undefined') {
		keep = () => false;
	}
	const dirPath = path.join(REPO_ROOT, _dirPath);
	if (!fs.existsSync(dirPath)) {
		return;
	}
	rmDir(dirPath, _dirPath);
	console.log(`Deleted ${_dirPath}`);

	/**
	 * @param {string} dirPath
	 * @param {string} relativeDirPath
	 * @returns {boolean}
	 */
	function rmDir(dirPath, relativeDirPath) {
		let keepsFiles = false;
		const entries = fs.readdirSync(dirPath);
		for (const entry of entries) {
			const filePath = path.join(dirPath, entry);
			const relativeFilePath = path.join(relativeDirPath, entry);
			if (keep(relativeFilePath)) {
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
exports.removeDir = removeDir;
