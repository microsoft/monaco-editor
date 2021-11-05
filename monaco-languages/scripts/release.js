/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const path = require('path');
const helpers = require('monaco-plugin-helpers');

const REPO_ROOT = path.join(__dirname, '../');

helpers.packageESM({
	repoRoot: REPO_ROOT,
	esmSource: 'out/esm',
	esmDestination: 'release/esm',
	entryPoints: ['monaco.contribution.js'],
	resolveSkip: ['monaco-editor-core']
});
