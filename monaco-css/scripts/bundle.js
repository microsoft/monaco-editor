/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const requirejs = require('requirejs');
const path = require('path');
const fs = require('fs');
const Terser = require('terser');
const helpers = require('monaco-plugin-helpers');

const REPO_ROOT = path.resolve(__dirname, '..', '..');

const sha1 = helpers.getGitVersion(REPO_ROOT);
const semver = require('../../package.json').version;
const headerVersion = semver + '(' + sha1 + ')';

const BUNDLED_FILE_HEADER = [
	'/*!-----------------------------------------------------------------------------',
	' * Copyright (c) Microsoft Corporation. All rights reserved.',
	' * Version: ' + headerVersion,
	' * Released under the MIT license',
	' * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt',
	' *-----------------------------------------------------------------------------*/',
	''
].join('\n');

bundleOne('monaco.contribution');
bundleOne('cssMode', ['vs/language/css/monaco.contribution']);
bundleOne('cssWorker');

function bundleOne(moduleId, exclude) {
	requirejs.optimize(
		{
			baseUrl: 'out/amd/',
			name: 'vs/language/css/' + moduleId,
			out: 'release/dev/' + moduleId + '.js',
			exclude: exclude,
			paths: {
				'vs/language/css': REPO_ROOT + '/monaco-css/out/amd',
				'vs/language/css/fillers/monaco-editor-core':
					REPO_ROOT + '/monaco-css/out/amd/fillers/monaco-editor-core-amd'
			},
			optimize: 'none',
			packages: [
				{
					name: 'vscode-css-languageservice',
					location: path.join(REPO_ROOT, 'node_modules/vscode-css-languageservice/lib/umd'),
					main: 'cssLanguageService'
				},
				{
					name: 'vscode-languageserver-types',
					location: path.join(REPO_ROOT, 'node_modules/vscode-languageserver-types/lib/umd'),
					main: 'main'
				},
				{
					name: 'vscode-languageserver-textdocument',
					location: path.join(REPO_ROOT, 'node_modules/vscode-languageserver-textdocument/lib/umd'),
					main: 'main'
				},
				{
					name: 'vscode-uri',
					location: path.join(REPO_ROOT, 'node_modules/vscode-uri/lib/umd'),
					main: 'index'
				},
				{
					name: 'vscode-nls',
					location: path.join(REPO_ROOT, 'monaco-css/out/amd/fillers'),
					main: 'vscode-nls'
				}
			]
		},
		async function (buildResponse) {
			const devFilePath = path.join(REPO_ROOT, 'monaco-css/release/dev/' + moduleId + '.js');
			const minFilePath = path.join(REPO_ROOT, 'monaco-css/release/min/' + moduleId + '.js');
			const fileContents = fs.readFileSync(devFilePath).toString();
			console.log();
			console.log(`Minifying ${devFilePath}...`);
			const result = await Terser.minify(fileContents, {
				output: {
					comments: 'some'
				}
			});
			console.log(`Done minifying ${devFilePath}.`);
			try {
				fs.mkdirSync(path.join(REPO_ROOT, 'monaco-css/release/min'));
			} catch (err) {}
			fs.writeFileSync(minFilePath, BUNDLED_FILE_HEADER + result.code);
		}
	);
}
