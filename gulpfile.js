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
		' * monaco-html version: ' + headerVersion,
		' * Released under the MIT license',
		' * https://github.com/Microsoft/monaco-html/blob/master/LICENSE.md',
		' *-----------------------------------------------------------------------------*/',
		''
	].join('\n');

	function getDependencyLocation(name, libLocation, container) {
		var location = __dirname + '/node_modules/' + name + '/' + libLocation;
		if (!fs.existsSync(location)) {
			var oldLocation = __dirname + '/node_modules/' + container + '/node_modules/' + name + '/' + libLocation;
			if (!fs.existsSync(oldLocation)) {
				console.error('Unable to find ' + name + ' node module at ' + location + ' or ' + oldLocation);
				return;
			}
			return oldLocation;
		}
		return location;
	}

	var uriLocation = getDependencyLocation('vscode-uri', 'lib', 'vscode-html-languageservice');

	function bundleOne(moduleId, exclude) {


		return rjs({
			baseUrl: '/out/',
			name: 'vs/language/html/' + moduleId,
			out: moduleId + '.js',
			exclude: exclude,
			paths: {
				'vs/language/html': __dirname + '/out'
			},
			packages: [{
				name: 'vscode-html-languageservice/lib/parser/htmlScanner',
				location: __dirname + '/node_modules/vscode-html-languageservice/lib/parser',
				main: 'htmlScanner'
			}, {
				name: 'vscode-html-languageservice',
				location: __dirname + '/node_modules/vscode-html-languageservice/lib',
				main: 'htmlLanguageService'
			}, {
				name: 'vscode-languageserver-types',
				location: __dirname + '/node_modules/vscode-languageserver-types/lib',
				main: 'main'
			}, {
				name: 'vscode-uri',
				location: uriLocation,
				main: 'index'
			}, {
				name: 'vscode-nls',
				location: __dirname + '/out/fillers',
				main: 'vscode-nls'
			}]
		})
	}

	return merge(
		merge(
			bundleOne('monaco.contribution', ['vs/language/html/htmlMode']),
			bundleOne('htmlMode'),
			bundleOne('htmlWorker')
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
			preserveComments: function(node, token) {
				var text = token.value;
				if (text.indexOf('monaco-html version') >= 0) {
					// this is the main copyright header
					return true;
				}
				if (text.indexOf('Copyright (c) Microsoft') >= 0) {
					// this is another Microsoft copyright header (not the main)
					return false;
				}
				if (/copyright/i.test(text)) {
					return true;
				}
				return false;
			}
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