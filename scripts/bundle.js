const requirejs = require('requirejs');
const path = require('path');
const fs = require('fs');
const UglifyJS = require("uglify-js");
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
bundleOne('bat/bat');
bundleOne('css/css');
bundleOne('coffee/coffee');
bundleOne('cpp/cpp');
bundleOne('csharp/csharp');
bundleOne('dockerfile/dockerfile');
bundleOne('fsharp/fsharp');
bundleOne('go/go');
bundleOne('handlebars/handlebars');
bundleOne('html/html');
bundleOne('ini/ini');
bundleOne('pug/pug');
bundleOne('java/java');
bundleOne('javascript/javascript');
bundleOne('kotlin/kotlin');
bundleOne('less/less');
bundleOne('lua/lua');
bundleOne('markdown/markdown');
bundleOne('msdax/msdax');
bundleOne('objective-c/objective-c');
bundleOne('pascal/pascal');
bundleOne('php/php');
bundleOne('powershell/powershell');
bundleOne('postiats/postiats');
bundleOne('python/python');
bundleOne('r/r');
bundleOne('razor/razor');
bundleOne('ruby/ruby');
bundleOne('rust/rust');
bundleOne('scss/scss');
bundleOne('sql/sql');
bundleOne('st/st');
bundleOne('swift/swift');
bundleOne('typescript/typescript');
bundleOne('vb/vb');
bundleOne('xml/xml');
bundleOne('yaml/yaml');
bundleOne('solidity/solidity');
bundleOne('sb/sb');
bundleOne('mysql/mysql');
bundleOne('redshift/redshift');
bundleOne('pgsql/pgsql');
bundleOne('redis/redis');
bundleOne('csp/csp');
bundleOne('scheme/scheme');
bundleOne('clojure/clojure');
bundleOne('shell/shell');
bundleOne('perl/perl');
bundleOne('powerquery/powerquery');
bundleOne('azcli/azcli');
bundleOne('apex/apex');
bundleOne('tcl/tcl');
bundleOne('graphql/graphql');

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
		const result = UglifyJS.minify(fileContents, {
			output: {
				comments: 'some'
			}
		});
		console.log(`Done.`);
		fs.writeFileSync(filePath, BUNDLED_FILE_HEADER + result.code);
	})
}
