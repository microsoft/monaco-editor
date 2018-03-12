const requirejs = require('requirejs');
const path = require('path');
const fs = require('fs');
const UglifyJS = require("uglify-js");
const git = require('./git');

const REPO_ROOT = path.resolve(__dirname, '..');

const sha1 = git.getGitVersion(REPO_ROOT);
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
bundleOne('bat');
bundleOne('css');
bundleOne('coffee');
bundleOne('cpp');
bundleOne('csharp');
bundleOne('dockerfile');
bundleOne('fsharp');
bundleOne('go');
bundleOne('handlebars');
bundleOne('html');
bundleOne('ini');
bundleOne('pug');
bundleOne('java');
bundleOne('less');
bundleOne('lua');
bundleOne('markdown');
bundleOne('msdax');
bundleOne('objective-c');
bundleOne('php');
bundleOne('powershell');
bundleOne('postiats');
bundleOne('python');
bundleOne('r');
bundleOne('razor');
bundleOne('ruby');
bundleOne('scss');
bundleOne('sql');
bundleOne('swift');
bundleOne('vb');
bundleOne('xml');
bundleOne('yaml');
bundleOne('solidity');
bundleOne('sb');
bundleOne('mysql');
bundleOne('redshift');
bundleOne('pgsql');
bundleOne('redis');
bundleOne('csp');

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
