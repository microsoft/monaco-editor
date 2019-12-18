const requirejs = require('requirejs');
const path = require('path');
const fs = require('fs');
const terser = require('terser');
const glob = require('glob');
const helpers = require('monaco-plugin-helpers');

const REPO_ROOT = path.resolve(__dirname, '..');

const sha1 = helpers.getGitVersion(REPO_ROOT);
const semver = require('../package.json').version;
const headerVersion = semver + '(' + sha1 + ')';

const BUNDLED_FILE_HEADER = [
	'/*!-----------------------------------------------------------------------------',
	' * Copyright (c) Microsoft Corporation. All rights reserved.',
	' * monaco-languages version: ' + headerVersion,
	' * Released under the MIT license',
	' * https://github.com/Microsoft/monaco-languages/blob/master/LICENSE.md',
	' *-----------------------------------------------------------------------------*/',
	''
].join('\n');

bundleOne('monaco.contribution');
glob('release/dev/*/*.contribution.js', { cwd: path.dirname(__dirname) }, function (err, files) {
	if (err) {
		console.log(err);
		return;
	}
	files.forEach(function (file) {
		file = file.replace(/\.contribution\.js$/, '');
		file = file.replace(/release[/\\]dev[/\\]/, '');
		bundleOne(file);
	});
});

function bundleOne(moduleId, exclude) {
	requirejs.optimize({
		baseUrl: 'release/dev/',
		name: 'vs/basic-languages/' + moduleId,
		out: 'release/min/' + moduleId + '.js',
		exclude: exclude,
		paths: {
			'vs/basic-languages': REPO_ROOT + '/release/dev'
		},
		optimize: 'none'
	}, function (buildResponse) {
		const filePath = path.join(REPO_ROOT, 'release/min/' + moduleId + '.js');
		const fileContents = fs.readFileSync(filePath).toString();
		console.log();
		console.log(`Minifying ${filePath}...`);
		const result = terser.minify(fileContents);
		console.log(`Done.`);
		fs.writeFileSync(filePath, BUNDLED_FILE_HEADER + result.code);
	})
}
