/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

/** @typedef {import('../build/utils').IFile} IFile */

const path = require('path');
const fs = require('fs');
const cp = require('child_process');
const CleanCSS = require('clean-css');
const { REPO_ROOT, removeDir, readFiles, writeFiles } = require('./utils');

/** @type {string} */
const MONACO_EDITOR_VERSION = (() => {
	const packageJsonPath = path.join(REPO_ROOT, 'package.json');
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString());
	const version = packageJson.version;
	if (!/\d+\.\d+\.\d+/.test(version)) {
		console.log('unrecognized package.json version: ' + version);
		process.exit(1);
	}
	return version;
})();

removeDir(`../monaco-editor-website`);

generateWebsite();

/**
 * @param {string} dataPath
 * @param {string} contents
 * @param {RegExp} regex
 * @param {(match:string, fileContents:Buffer)=>string} callback
 * @returns {string}
 */
function replaceWithRelativeResource(dataPath, contents, regex, callback) {
	return contents.replace(regex, function (_, m0) {
		const filePath = path.join(REPO_ROOT, 'website', path.dirname(dataPath), m0);
		return callback(m0, fs.readFileSync(filePath));
	});
}

function generateWebsite() {
	const files = readFiles('website/**/*', {
		base: 'website',
		dot: true
	});

	for (const file of files) {
		if (!file.contents || !/\.(html)$/.test(file.path) || /new-samples/.test(file.path)) {
			continue;
		}

		let contents = file.contents.toString();
		contents = contents.replace(/\.\.\/\.\.\/release\/dev/g, 'node_modules/monaco-editor/min');
		// contents = contents.replace(/\.\.\/\.\.\/release\/dev/g, '../monaco-editor/release/dev');
		contents = contents.replace(/{{version}}/g, MONACO_EDITOR_VERSION);
		contents = contents.replace(/{{year}}/g, String(new Date().getFullYear()));

		// Preload xhr contents
		contents = replaceWithRelativeResource(
			file.path,
			contents,
			/<pre data-preload="([^"]+)".*/g,
			function (m0, fileContents) {
				return (
					'<pre data-preload="' +
					m0 +
					'" style="display:none">' +
					fileContents
						.toString('utf8')
						.replace(/&/g, '&amp;')
						.replace(/</g, '&lt;')
						.replace(/>/g, '&gt;') +
					'</pre>'
				);
			}
		);

		// Inline fork.png
		contents = replaceWithRelativeResource(
			file.path,
			contents,
			/src="(\.\/fork.png)"/g,
			function (m0, fileContents) {
				return 'src="data:image/png;base64,' + fileContents.toString('base64') + '"';
			}
		);

		// let allCSS = '';
		contents = replaceWithRelativeResource(
			file.path,
			contents,
			/<link data-inline="yes-please" href="([^"]+)".*/g,
			function (m0, fileContents) {
				const minifiedCSS = new CleanCSS().minify(fileContents.toString('utf8')).styles;
				return `<style>${minifiedCSS}</style>`;
			}
		);

		// Inline javascript
		contents = replaceWithRelativeResource(
			file.path,
			contents,
			/<script data-inline="yes-please" src="([^"]+)".*/g,
			function (m0, fileContents) {
				return '<script>' + fileContents.toString('utf8') + '</script>';
			}
		);

		file.contents = Buffer.from(contents.split(/\r\n|\r|\n/).join('\n'));
	}

	writeFiles(files, `../monaco-editor-website`);

	// temporarily create package.json so that npm install doesn't bark
	fs.writeFileSync(path.join(REPO_ROOT, '../monaco-editor-website/package.json'), '{}');
	fs.writeFileSync(path.join(REPO_ROOT, '../monaco-editor-website/.nojekyll'), '');
	cp.execSync('npm install monaco-editor', {
		cwd: path.join(REPO_ROOT, '../monaco-editor-website')
	});
	fs.unlinkSync(path.join(REPO_ROOT, '../monaco-editor-website/package.json'));
}
