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

gulp.task('clean-release', function(cb) { rimraf('release', { maxBusyTries: 1 }, cb); });
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
			baseUrl: '/out/amd/',
			name: 'vs/language/typescript/' + moduleId,
			out: moduleId + '.js',
			exclude: exclude,
			paths: {
				'vs/language/typescript': __dirname + '/out/amd/'
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
		.pipe(gulp.dest('./release/')),

		gulp.src('src/monaco.d.ts').pipe(gulp.dest('./release/')),
	);
});

/**
 * Import files from TypeScript's dist
 */
gulp.task('import-typescript', function() {
	try {
		fs.statSync(TYPESCRIPT_LIB_DESTINATION);
	} catch (err) {
		fs.mkdirSync(TYPESCRIPT_LIB_DESTINATION);
	}
	importLibDeclarationFile('lib.d.ts');
	importLibDeclarationFile('lib.es6.d.ts');

	var tsServices = fs.readFileSync(path.join(TYPESCRIPT_LIB_SOURCE, 'typescriptServices.js')).toString();
	tsServices +=
`
// MONACOCHANGE
// Defining the entire module name because r.js has an issue and cannot bundle this file
// correctly with an anonymous define call
define("vs/language/typescript/lib/typescriptServices", [], function() { return ts; });
// END MONACOCHANGE
`;
	fs.writeFileSync(path.join(TYPESCRIPT_LIB_DESTINATION, 'typescriptServices.js'), tsServices);

	var dtsServices = fs.readFileSync(path.join(TYPESCRIPT_LIB_SOURCE, 'typescriptServices.d.ts')).toString();
	dtsServices +=
`
// MONACOCHANGE
export = ts;
// END MONACOCHANGE
`;
	fs.writeFileSync(path.join(TYPESCRIPT_LIB_DESTINATION, 'typescriptServices.d.ts'), dtsServices);
});

/**
 * Import a lib*.d.ts file from TypeScript's dist
 */
function importLibDeclarationFile(name) {
	var dstName = name.replace(/\.d\.ts$/, '').replace(/\./g, '-') + '-ts';
	var srcPath = path.join(TYPESCRIPT_LIB_SOURCE, name);

	var contents = fs.readFileSync(srcPath).toString();

	var dstPath = path.join(TYPESCRIPT_LIB_DESTINATION, dstName + '.ts');
	fs.writeFileSync(dstPath,
`/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const contents = "${escapeText(contents)}";
`);
}

/**
 * Escape text such that it can be used in a javascript string enclosed by double quotes (")
 */
function escapeText(text) {
	// See http://www.javascriptkit.com/jsref/escapesequence.shtml
	var _backspace = '\b'.charCodeAt(0);
	var _formFeed = '\f'.charCodeAt(0);
	var _newLine = '\n'.charCodeAt(0);
	var _nullChar = 0;
	var _carriageReturn = '\r'.charCodeAt(0);
	var _tab = '\t'.charCodeAt(0);
	var _verticalTab = '\v'.charCodeAt(0);
	var _backslash = '\\'.charCodeAt(0);
	var _doubleQuote = '"'.charCodeAt(0);

	var startPos = 0, chrCode, replaceWith = null, resultPieces = [];

	for (var i = 0, len = text.length; i < len; i++) {
		chrCode = text.charCodeAt(i);
		switch (chrCode) {
			case _backspace:
				replaceWith = '\\b';
				break;
			case _formFeed:
				replaceWith = '\\f';
				break;
			case _newLine:
				replaceWith = '\\n';
				break;
			case _nullChar:
				replaceWith = '\\0';
				break;
			case _carriageReturn:
				replaceWith = '\\r';
				break;
			case _tab:
				replaceWith = '\\t';
				break;
			case _verticalTab:
				replaceWith = '\\v';
				break;
			case _backslash:
				replaceWith = '\\\\';
				break;
			case _doubleQuote:
				replaceWith = '\\"';
				break;
		}
		if (replaceWith !== null) {
			resultPieces.push(text.substring(startPos, i));
			resultPieces.push(replaceWith);
			startPos = i + 1;
			replaceWith = null;
		}
	}
	resultPieces.push(text.substring(startPos, len));
	return resultPieces.join('');
}

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