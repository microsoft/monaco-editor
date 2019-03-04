/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const requirejs = require('requirejs');
const path = require('path');
const fs = require('fs');
const UglifyJS = require('uglify-js');
const helpers = require('monaco-plugin-helpers');

const REPO_ROOT = path.resolve(__dirname, '..');

const sha1 = helpers.getGitVersion(REPO_ROOT);
const semver = require('../package.json').version;
const headerVersion = semver + '(' + sha1 + ')';

const BUNDLED_FILE_HEADER = [
	'/*!-----------------------------------------------------------------------------',
	' * Copyright (c) Microsoft Corporation. All rights reserved.',
	' * monaco-typescript version: ' + headerVersion,
	' * Released under the MIT license',
	' * https://github.com/Microsoft/monaco-typescript/blob/master/LICENSE.md',
	' *-----------------------------------------------------------------------------*/',
	''
].join('\n');

bundleOne('monaco.contribution');
bundleOne('tsMode');
bundleOne('tsWorker');

function bundleOne(moduleId, exclude) {
	requirejs.optimize({
		baseUrl: 'release/dev/',
		name: 'vs/language/typescript/' + moduleId,
		out: 'release/min/' + moduleId + '.js',
		exclude: exclude,
		paths: {
			'vs/language/typescript': REPO_ROOT + '/release/dev'
		},
		optimize: 'none'
	}, function(buildResponse) {
		const filePath = path.join(REPO_ROOT, 'release/min/' + moduleId + '.js');
		const fileContents = fs.readFileSync(filePath).toString();
		console.log();
		console.log(`Minifying ${filePath}...`);
		const result = UglifyJS.minify(fileContents, {
			output: {
				comments: 'some'
			}
		});
		console.log(`Done.`);
		fs.writeFileSync(filePath, BUNDLED_FILE_HEADER + result.code);
	})
}
