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
glob('out/amd/*/*.contribution.js', { cwd: path.dirname(__dirname) }, function (err, files) {
	if (err) {
		console.log(err);
		return;
	}
	files.forEach(function (file) {
		file = file.replace(/\.contribution\.js$/, '');
		file = file.replace(/out[/\\]amd[/\\]/, '');
		bundleOne(file, ['vs/basic-languages/monaco.contribution']);
	});
});

function bundleOne(moduleId, exclude) {
	requirejs.optimize(
		{
			baseUrl: 'out/amd/',
			name: 'vs/basic-languages/' + moduleId,
			out: 'release/dev/' + moduleId + '.js',
			exclude: exclude,
			paths: {
				'vs/basic-languages': REPO_ROOT + '/out/amd',
				'vs/basic-languages/fillers/monaco-editor-core':
					REPO_ROOT + '/out/amd/fillers/monaco-editor-core-amd'
			},
			optimize: 'none'
		},
		async function (buildResponse) {
			const devFilePath = path.join(REPO_ROOT, 'release/dev/' + moduleId + '.js');
			const minFilePath = path.join(REPO_ROOT, 'release/min/' + moduleId + '.js');
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
			try {
				fs.mkdirSync(path.dirname(minFilePath));
			} catch (err) {}
			fs.writeFileSync(minFilePath, BUNDLED_FILE_HEADER + result.code);
		}
	);
}
