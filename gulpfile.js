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

var TYPESCRIPT_LIB_SOURCE = path.join(__dirname, 'node_modules', 'typescript', 'lib');
var TYPESCRIPT_LIB_DESTINATION = path.join(__dirname, 'src', 'lib');

gulp.task('clean-release', function(cb) { rimraf('release/min', { maxBusyTries: 1 }, cb); });
gulp.task('release', ['clean-release'], function() {

	var sha1 = getGitVersion(__dirname);
	var semver = require('./package.json').version;
	var headerVersion = semver + '(' + sha1 + ')';

	var BUNDLED_FILE_HEADER = [
		'/*!-----------------------------------------------------------------------------',
		' * Copyright (c) Microsoft Corporation. All rights reserved.',
		' * monaco-typescript version: ' + headerVersion,
		' * Released under the MIT license',
		' * https://github.com/Microsoft/monaco-typescript/blob/master/LICENSE.md',
		' *-----------------------------------------------------------------------------*/',
		''
	].join('\n');

	function bundleOne(moduleId, exclude) {
		return rjs({
			baseUrl: '/release/dev/',
			name: 'vs/language/typescript/' + moduleId,
			out: moduleId + '.js',
			exclude: exclude,
			paths: {
				'vs/language/typescript': __dirname + '/release/dev/'
			}
		})
	}

	return merge(
		merge(
			bundleOne('monaco.contribution'),
			bundleOne('lib/typescriptServices'),
			bundleOne('mode', ['vs/language/typescript/lib/typescriptServices']),
			bundleOne('worker', ['vs/language/typescript/lib/typescriptServices'])
		)
		.pipe(uglify({
			preserveComments: 'some'
		}))
		.pipe(es.through(function(data) {
			data.contents = new Buffer(
				BUNDLED_FILE_HEADER
				+ data.contents.toString()
			);
			this.emit('data', data);
		}))
		.pipe(gulp.dest('./release/min/')),

		gulp.src('src/monaco.d.ts').pipe(gulp.dest('./release/')),
	);
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