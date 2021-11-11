/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');

/**
 * @param {string} _source
 * @param {string} _destination
 */
function copyFile(_source, _destination) {
	const source = path.join(REPO_ROOT, _source);
	const destination = path.join(REPO_ROOT, _destination);

	// ensure target dir
	(function () {
		/** @type {string[]} */
		const dirs = [];
		/** @type {string} */
		let dirname = path.dirname(destination);
		while (dirname.length > REPO_ROOT.length) {
			dirs.push(dirname);
			dirname = path.dirname(dirname);
		}
		dirs.reverse();
		dirs.forEach(function (dir) {
			try {
				fs.mkdirSync(dir);
			} catch (err) {}
		});
	})();

	fs.writeFileSync(destination, fs.readFileSync(source));

	console.log(`Copied ${_source} to ${_destination}`);
}
exports.copyFile = copyFile;

/**
 * @param {string} _dirPath
 */
function removeDir(_dirPath) {
	const dirPath = path.join(REPO_ROOT, _dirPath);
	if (!fs.existsSync(dirPath)) {
		return;
	}
	rmDir(dirPath);
	console.log(`Deleted ${_dirPath}`);

	/**
	 * @param {string} dirPath
	 */
	function rmDir(dirPath) {
		const entries = fs.readdirSync(dirPath);
		for (const entry of entries) {
			const filePath = path.join(dirPath, entry);
			if (fs.statSync(filePath).isFile()) {
				fs.unlinkSync(filePath);
			} else {
				rmDir(filePath);
			}
		}
		fs.rmdirSync(dirPath);
	}
}
exports.removeDir = removeDir;
