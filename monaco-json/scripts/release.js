/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const path = require('path');
const helpers = require('monaco-plugin-helpers');

const REPO_ROOT = path.join(__dirname, '../../');

helpers.packageESM({
	repoRoot: REPO_ROOT,
	esmSource: 'monaco-json/out/esm',
	esmDestination: 'monaco-json/release/esm',
	entryPoints: ['monaco.contribution.js', 'jsonMode.js', 'json.worker.js'],
	resolveAlias: {
		'vscode-nls': path.join(REPO_ROOT, 'monaco-json/out/esm/fillers/vscode-nls.js')
	},
	resolveSkip: ['monaco-editor-core'],
	destinationFolderSimplification: {
		node_modules: '_deps',
		'jsonc-parser/lib/esm': 'jsonc-parser',
		'vscode-languageserver-types/lib/esm': 'vscode-languageserver-types',
		'vscode-uri/lib/esm': 'vscode-uri',
		'vscode-json-languageservice/lib/esm': 'vscode-json-languageservice'
	}
});
