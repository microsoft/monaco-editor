/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import glob = require('glob');
import path = require('path');
import fs = require('fs');
import cp = require('child_process');
import CleanCSS from 'clean-css';
import { REPO_ROOT, readFiles, writeFiles } from './utils';
import { removeDir } from './fs';

const MONACO_EDITOR_VERSION: string = (() => {
	const output = cp.execSync(`npm show monaco-editor version`).toString();
	const version = output.split(/\r\n|\r|\n/g)[0];
	if (!/\d+\.\d+\.\d+/.test(version)) {
		console.log('unrecognized package.json version: ' + version);
		process.exit(1);
	}
	return version;
})();

removeDir(`../monaco-editor-website`);
checkSamples();
generateWebsite();

/**
 * Check that there are samples for all available languages
 */
function checkSamples() {
	let languages = glob
		.sync('src/basic-languages/*/*.contribution.ts', { cwd: REPO_ROOT })
		.map((f) => path.dirname(f))
		.map((f) => f.substring('src/basic-languages/'.length));
	languages.push('css');
	languages.push('html');
	languages.push('json');
	languages.push('typescript');

	// some languages have a different id than their folder
	languages = languages.map((l) => {
		switch (l) {
			case 'coffee':
				return 'coffeescript';
			case 'protobuf':
				return 'proto';
			case 'solidity':
				return 'sol';
			case 'sophia':
				return 'aes';
			default:
				return l;
		}
	});

	let fail = false;
	for (const language of languages) {
		const expectedSamplePath = path.join(REPO_ROOT, `website/index/samples/sample.${language}.txt`);
		if (!fs.existsSync(expectedSamplePath)) {
			console.error(`Missing sample for ${language} at ${expectedSamplePath}`);
			fail = true;
		}
	}
	if (fail) {
		process.exit(1);
	}
}

function replaceWithRelativeResource(
	dataPath: string,
	contents: string,
	regex: RegExp,
	callback: (match: string, fileContents: Buffer) => string
): string {
	return contents.replace(regex, function (_, m0) {
		const filePath = path.join(REPO_ROOT, 'website', path.dirname(dataPath), m0);
		return callback(m0, fs.readFileSync(filePath));
	});
}

function generateWebsite() {
	const files = readFiles('website/**/*', {
		base: 'website',
		ignore: ['website/typedoc/**/*'],
		dot: true
	});

	for (const file of files) {
		if (!file.contents || !/\.(html)$/.test(file.path) || /new-samples/.test(file.path)) {
			continue;
		}

		let contents = file.contents.toString();
		contents = contents.replace(/\.\.\/release\/dev/g, 'node_modules/monaco-editor/min');
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
				const minifiedCSS = (new CleanCSS() as any).minify(fileContents.toString('utf8')).styles;
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
