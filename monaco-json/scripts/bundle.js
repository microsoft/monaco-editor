const requirejs = require('requirejs');
const path = require('path');
const fs = require('fs');
const Terser = require('terser');
const helpers = require('monaco-plugin-helpers');

const REPO_ROOT = path.resolve(__dirname, '..');

const sha1 = helpers.getGitVersion(REPO_ROOT);
const semver = require('../package.json').version;
const headerVersion = semver + '(' + sha1 + ')';

const BUNDLED_FILE_HEADER = [
	'/*!-----------------------------------------------------------------------------',
	' * Copyright (c) Microsoft Corporation. All rights reserved.',
	' * monaco-json version: ' + headerVersion,
	' * Released under the MIT license',
	' * https://github.com/Microsoft/monaco-json/blob/master/LICENSE.md',
	' *-----------------------------------------------------------------------------*/',
	''
].join('\n');

bundleOne('monaco.contribution');
bundleOne('jsonMode', ['vs/language/json/monaco.contribution']);
bundleOne('jsonWorker');

function bundleOne(moduleId, exclude) {
	requirejs.optimize(
		{
			baseUrl: 'out/amd/',
			name: 'vs/language/json/' + moduleId,
			out: 'release/dev/' + moduleId + '.js',
			exclude: exclude,
			paths: {
				'vs/language/json': REPO_ROOT + '/out/amd',
				'vs/language/json/fillers/monaco-editor-core':
					REPO_ROOT + '/out/amd/fillers/monaco-editor-core-amd'
			},
			optimize: 'none',
			packages: [
				{
					name: 'vscode-json-languageservice',
					location: path.join(REPO_ROOT, 'node_modules/vscode-json-languageservice/lib/umd'),
					main: 'jsonLanguageService'
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
					name: 'jsonc-parser',
					location: path.join(REPO_ROOT, 'node_modules/jsonc-parser/lib/umd'),
					main: 'main'
				},
				{
					name: 'vscode-uri',
					location: path.join(REPO_ROOT, 'node_modules/vscode-uri/lib/umd'),
					main: 'index'
				},
				{
					name: 'vscode-nls',
					location: path.join(REPO_ROOT, '/out/amd/fillers'),
					main: 'vscode-nls'
				}
			]
		},
		async function (buildResponse) {
			const devFilePath = path.join(REPO_ROOT, 'release/dev/' + moduleId + '.js');
			const minFilePath = path.join(REPO_ROOT, 'release/min/' + moduleId + '.js');
			const fileContents = fs.readFileSync(devFilePath).toString();
			console.log(`Minifying ${devFilePath}...`);
			const result = await Terser.minify(fileContents, {
				output: {
					comments: 'some'
				}
			});
			console.log(`Done minifying ${devFilePath}.`);
			try {
				fs.mkdirSync(path.join(REPO_ROOT, 'release/min'));
			} catch (err) {}
			fs.writeFileSync(minFilePath, BUNDLED_FILE_HEADER + result.code);
		}
	);
}
