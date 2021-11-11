/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const requirejs = require('requirejs');
const path = require('path');
const fs = require('fs');
const terser = require('terser');
const { getBundledFileHeader } = require('../../build/utils');

const REPO_ROOT = path.resolve(__dirname, '..', '..');

const BUNDLED_FILE_HEADER = getBundledFileHeader();

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
				'vs/language/html': REPO_ROOT + '/monaco-html/out/amd',
				'vs/language/html/fillers/monaco-editor-core':
					REPO_ROOT + '/monaco-html/out/amd/fillers/monaco-editor-core-amd'
			},
			optimize: 'none',
			packages: [
				{
					name: 'vscode-html-languageservice',
					location: path.join(REPO_ROOT, 'node_modules/vscode-html-languageservice/lib/umd'),
					main: 'htmlLanguageService'
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
					location: path.join(REPO_ROOT, 'monaco-html/out/amd/fillers'),
					main: 'vscode-nls'
				}
			]
		},
		async function (buildResponse) {
			const devFilePath = path.join(REPO_ROOT, 'monaco-html/release/dev/' + moduleId + '.js');
			const minFilePath = path.join(REPO_ROOT, 'monaco-html/release/min/' + moduleId + '.js');
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
				fs.mkdirSync(path.join(REPO_ROOT, 'monaco-html/release/min'));
			} catch (err) {}
			fs.writeFileSync(minFilePath, BUNDLED_FILE_HEADER + result.code);
		}
	);
}
