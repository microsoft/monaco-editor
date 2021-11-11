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
				'vs/language/json': REPO_ROOT + '/monaco-json/out/amd',
				'vs/language/json/fillers/monaco-editor-core':
					REPO_ROOT + '/monaco-json/out/amd/fillers/monaco-editor-core-amd'
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
					location: path.join(REPO_ROOT, 'monaco-json/out/amd/fillers'),
					main: 'vscode-nls'
				}
			]
		},
		async function (buildResponse) {
			const devFilePath = path.join(REPO_ROOT, 'monaco-json/release/dev/' + moduleId + '.js');
			const minFilePath = path.join(REPO_ROOT, 'monaco-json/release/min/' + moduleId + '.js');
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
				fs.mkdirSync(path.join(REPO_ROOT, 'monaco-json/release/min'));
			} catch (err) {}
			fs.writeFileSync(minFilePath, BUNDLED_FILE_HEADER + result.code);
		}
	);
}
