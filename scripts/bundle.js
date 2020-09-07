const requirejs = require('requirejs');
const path = require('path');
const fs = require('fs');
const terser = require('terser');
const helpers = require('monaco-plugin-helpers');

const REPO_ROOT = path.resolve(__dirname, '..');

const sha1 = helpers.getGitVersion(REPO_ROOT);
const semver = require('../package.json').version;
const headerVersion = semver + '(' + sha1 + ')';

const BUNDLED_FILE_HEADER = [
	'/*!-----------------------------------------------------------------------------',
	' * Copyright (c) Microsoft Corporation. All rights reserved.',
	' * monaco-html version: ' + headerVersion,
	' * Released under the MIT license',
	' * https://github.com/Microsoft/monaco-html/blob/master/LICENSE.md',
	' *-----------------------------------------------------------------------------*/',
	''
].join('\n');

bundleOne('monaco.contribution');
bundleOne('htmlMode', ['vs/language/html/monaco.contribution']);
bundleOne('htmlWorker');

function bundleOne(moduleId, exclude) {
	requirejs.optimize(
		{
			baseUrl: 'out/amd/',
			name: 'vs/language/html/' + moduleId,
			out: 'release/dev/' + moduleId + '.js',
			exclude: exclude,
			paths: {
				'vs/language/html': REPO_ROOT + '/out/amd',
				'vs/language/html/fillers/monaco-editor-core':
					REPO_ROOT + '/out/amd/fillers/monaco-editor-core-amd'
			},
			optimize: 'none',
			packages: [
				{
					name: 'vscode-html-languageservice',
					location: path.join(
						REPO_ROOT,
						'node_modules/vscode-html-languageservice/lib/umd'
					),
					main: 'htmlLanguageService'
				},
				{
					name: 'vscode-languageserver-types',
					location: path.join(
						REPO_ROOT,
						'node_modules/vscode-languageserver-types/lib/umd'
					),
					main: 'main'
				},
				{
					name: 'vscode-languageserver-textdocument',
					location: path.join(
						REPO_ROOT,
						'node_modules/vscode-languageserver-textdocument/lib/umd'
					),
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
			const devFilePath = path.join(
				REPO_ROOT,
				'release/dev/' + moduleId + '.js'
			);
			const minFilePath = path.join(
				REPO_ROOT,
				'release/min/' + moduleId + '.js'
			);
			const fileContents = fs.readFileSync(devFilePath).toString();
			console.log();
			console.log(`Minifying ${devFilePath}...`);
			const result = await terser.minify(fileContents, {
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
