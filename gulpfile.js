/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

var gulp = require('gulp');
var tsb = require('gulp-tsb');
var assign = require('object-assign');
var fs = require('fs');
var path = require('path');
var merge = require('merge-stream');
var rjs = require('gulp-requirejs');
var uglify = require('gulp-uglify');
var rimraf = require('rimraf');
var es = require('event-stream');

gulp.task('clean-release', function(cb) { rimraf('release', { maxBusyTries: 1 }, cb); });
gulp.task('release', ['clean-release'], function() {

	var sha1 = getGitVersion(__dirname);
	var semver = require('./package.json').version;
	var headerVersion = semver + '(' + sha1 + ')';

	var BUNDLED_FILE_HEADER = [
		'/*!-----------------------------------------------------------------------------',
		' * Copyright (c) Microsoft Corporation. All rights reserved.',
		' * monaco-languages version: ' + headerVersion,
		' * Released under the MIT license',
		' * https://github.com/Microsoft/monaco-languages/blob/master/LICENSE.md',
		' *-----------------------------------------------------------------------------*/',
		''
	].join('\n');

	function bundleOne(moduleId, exclude) {
		return rjs({
			baseUrl: '/out/amd/',
			name: 'vs/basic-languages/' + moduleId,
			out: moduleId + '.js',
			exclude: exclude,
			paths: {
				'vs/basic-languages': __dirname + '/out/amd'
			}
		})
	}

	return merge(
			bundleOne('monaco.contribution'),
			bundleOne('bat'),
			bundleOne('css'),
			bundleOne('coffee'),
			bundleOne('cpp'),
			bundleOne('csharp'),
			bundleOne('dockerfile'),
			bundleOne('fsharp'),
			bundleOne('go'),
			bundleOne('handlebars'),
			bundleOne('html'),
			bundleOne('ini'),
			bundleOne('pug'),
			bundleOne('java'),
			bundleOne('less'),
			bundleOne('lua'),
			bundleOne('markdown'),
			bundleOne('msdax'),
			bundleOne('objective-c'),
			bundleOne('php'),
			bundleOne('powershell'),
			bundleOne('postiats'),
			bundleOne('python'),
			bundleOne('r'),
			bundleOne('razor'),
			bundleOne('ruby'),
			bundleOne('scss'),
			bundleOne('sql'),
			bundleOne('swift'),
			bundleOne('vb'),
			bundleOne('xml'),
			bundleOne('yaml'),
			bundleOne('solidity'),
			bundleOne('sb'),
			bundleOne('mysql'),
			bundleOne('redshift'),
			bundleOne('pgsql'),
			bundleOne('redis'),
			bundleOne('csp')
		)
		.pipe(uglify({
			output: {
				comments: /^!/
			}
		}))
		.pipe(es.through(function(data) {
			data.contents = new Buffer(
				BUNDLED_FILE_HEADER
				+ data.contents.toString()
			);
			this.emit('data', data);
		}))
		.pipe(gulp.dest('./release/min/'));
});

function getGitVersion(repo) {
	var git = path.join(repo, '.git');
	var headPath = path.join(git, 'HEAD');
	var head;

	try {
		head = fs.readFileSync(headPath, 'utf8').trim();
	} catch (e) {
		return void 0;
	}

	if (/^[0-9a-f]{40}$/i.test(head)) {
		return head;
	}

	var refMatch = /^ref: (.*)$/.exec(head);

	if (!refMatch) {
		return void 0;
	}

	var ref = refMatch[1];
	var refPath = path.join(git, ref);

	try {
		return fs.readFileSync(refPath, 'utf8').trim();
	} catch (e) {
		// noop
	}

	var packedRefsPath = path.join(git, 'packed-refs');
	var refsRaw;

	try {
		refsRaw = fs.readFileSync(packedRefsPath, 'utf8').trim();
	} catch (e) {
		return void 0;
	}

	var refsRegex = /^([0-9a-f]{40})\s+(.+)$/gm;
	var refsMatch;
	var refs = {};

	while (refsMatch = refsRegex.exec(refsRaw)) {
		refs[refsMatch[2]] = refsMatch[1];
	}

	return refs[ref];
}
