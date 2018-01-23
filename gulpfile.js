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
gulp.task('release', ['clean-release','compile'], function() {

	var sha1 = getGitVersion(__dirname);
	var semver = require('./package.json').version;
	var headerVersion = semver + '(' + sha1 + ')';

	var BUNDLED_FILE_HEADER = [
		'/*!-----------------------------------------------------------------------------',
		' * Copyright (c) Microsoft Corporation. All rights reserved.',
		' * monaco-css version: ' + headerVersion,
		' * Released under the MIT license',
		' * https://github.com/Microsoft/monaco-css/blob/master/LICENSE.md',
		' *-----------------------------------------------------------------------------*/',
		''
	].join('\n');

	function bundleOne(moduleId, exclude) {
		return rjs({
			baseUrl: '/out/',
			name: 'vs/language/css/' + moduleId,
			out: moduleId + '.js',
			exclude: exclude,
			paths: {
				'vs/language/css': __dirname + '/out'
			},
			packages: [{
				name: 'vscode-css-languageservice',
				location: __dirname + '/node_modules/vscode-css-languageservice/lib',
				main: 'cssLanguageService'
			}, {
				name: 'vscode-languageserver-types',
				location: __dirname + '/node_modules/vscode-languageserver-types/lib',
				main: 'main'
			}, {
				name: 'vscode-nls',
				location: __dirname + '/out/fillers',
				main: 'vscode-nls'
			}]
		})
	}

	return merge(
		merge(
			bundleOne('monaco.contribution', ['vs/language/css/cssMode']),
			bundleOne('cssMode'),
			bundleOne('cssWorker')
		)
		.pipe(es.through(function(data) {
			data.contents = new Buffer(
				BUNDLED_FILE_HEADER
				+ data.contents.toString()
			);
			this.emit('data', data);
		}))
		.pipe(gulp.dest('./release/dev'))
		.pipe(uglify({
			preserveComments: 'some'
		}))
		.pipe(gulp.dest('./release/min')),
		gulp.src('src/monaco.d.ts').pipe(gulp.dest('./release/min'))
	);
});


var compilation = tsb.create(assign({ verbose: true }, require('./src/tsconfig.json').compilerOptions));

var tsSources = 'src/**/*.ts';

function compileTask() {
	return merge(
		gulp.src(tsSources).pipe(compilation())
	)
	.pipe(gulp.dest('out'));
}

gulp.task('clean-out', function(cb) { rimraf('out', { maxBusyTries: 1 }, cb); });
gulp.task('compile', ['clean-out'], compileTask);
gulp.task('compile-without-clean', compileTask);
gulp.task('watch', ['compile'], function() {
	gulp.watch(tsSources, ['compile-without-clean']);
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