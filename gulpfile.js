
const gulp = require('gulp');
const metadata = require('./metadata');
const es = require('event-stream');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const cp = require('child_process');
const os = require('os');
const yaserver = require('yaserver');
const http = require('http');
const typedoc = require("gulp-typedoc");
const CleanCSS = require('clean-css');
const uncss = require('uncss');
const File = require('vinyl');
const ts = require('typescript');

const WEBSITE_GENERATED_PATH = path.join(__dirname, 'website/playground/new-samples');
const MONACO_EDITOR_VERSION = (function() {
	const packageJsonPath = path.join(__dirname, 'package.json');
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString());
	const version = packageJson.version;
	if (!/\d+\.\d+\.\d+/.test(version)) {
		console.log('unrecognized package.json version: ' + version);
		process.exit(0);
	}
	return version;
})();

async function _execute(task) {
	// Always invoke as if it were a callback task
	return new Promise((resolve, reject) => {
		if (task.length === 1) {
			// this is a calback task
			task((err) => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
			return;
		}
		const taskResult = task();
		if (typeof taskResult === 'undefined') {
			// this is a sync task
			resolve();
			return;
		}
		if (typeof taskResult.then === 'function') {
			// this is a promise returning task
			taskResult.then(resolve, reject);
			return;
		}
		// this is a stream returning task
		taskResult.on('end', _ => resolve());
		taskResult.on('error', err => reject(err));
	});
}

function taskSeries(...tasks) {
	return async () => {
		for (let i = 0; i < tasks.length; i++) {
			await _execute(tasks[i]);
		}
	};
}

const cleanReleaseTask = function(cb) { rimraf('release', { maxBusyTries: 1 }, cb); };
gulp.task('release', taskSeries(cleanReleaseTask, function() {
	return es.merge(

		// dev folder
		releaseOne('dev'),

		// min folder
		releaseOne('min'),

		// esm folder
		ESM_release(),

		// package.json
		gulp.src('package.json')
			.pipe(es.through(function(data) {
				var json = JSON.parse(data.contents.toString());
				json.private = false;
				data.contents = Buffer.from(JSON.stringify(json, null, '  '));
				this.emit('data', data);
			}))
			.pipe(gulp.dest('release')),

		gulp.src('CHANGELOG.md')
			.pipe(gulp.dest('release')),

		// min-maps folder
		gulp.src('node_modules/monaco-editor-core/min-maps/**/*')
			.pipe(gulp.dest('release/min-maps')),

		// other files
		gulp.src([
			'node_modules/monaco-editor-core/LICENSE',
			'node_modules/monaco-editor-core/monaco.d.ts',
			'node_modules/monaco-editor-core/ThirdPartyNotices.txt',
			'README.md'
		])
		.pipe(addPluginDTS())
		.pipe(addPluginThirdPartyNotices())
		.pipe(gulp.dest('release'))
	)
}));

/**
 * Release to `dev` or `min`.
 */
function releaseOne(type) {
	return es.merge(
		gulp.src('node_modules/monaco-editor-core/' + type + '/**/*')
			.pipe(addPluginContribs(type))
			.pipe(gulp.dest('release/' + type)),

		pluginStreams(type, 'release/' + type + '/')
	)
}

/**
 * Release plugins to `dev` or `min`.
 */
function pluginStreams(type, destinationPath) {
	return es.merge(
		metadata.METADATA.PLUGINS.map(function(plugin) {
			return pluginStream(plugin, type, destinationPath);
		})
	);
}

/**
 * Release a plugin to `dev` or `min`.
 */
function pluginStream(plugin, type, destinationPath) {
	var pluginPath = plugin.paths[`npm/${type}`]; // npm/dev or npm/min
	var contribPath = path.join(pluginPath, plugin.contrib.substr(plugin.modulePrefix.length)) + '.js';
	return (
		gulp.src([
			pluginPath + '/**/*',
			'!' + contribPath
		])
		.pipe(es.through(function(data) {
			if (!/_\.contribution/.test(data.path)) {
				this.emit('data', data);
				return;
			}

			let contents = data.contents.toString();
			contents = contents.replace('define(["require", "exports"],', 'define(["require", "exports", "vs/editor/editor.api"],');
			data.contents = Buffer.from(contents);
			this.emit('data', data);
		}))
		.pipe(gulp.dest(destinationPath + plugin.modulePrefix))
	);
}

/**
 * Edit editor.main.js:
 * - rename the AMD module 'vs/editor/editor.main' to 'vs/editor/edcore.main'
 * - append monaco.contribution modules from plugins
 * - append new AMD module 'vs/editor/editor.main' that stiches things together
 */
function addPluginContribs(type) {
	return es.through(function(data) {
		if (!/editor\.main\.js$/.test(data.path)) {
			this.emit('data', data);
			return;
		}
		var contents = data.contents.toString();

		// Rename the AMD module 'vs/editor/editor.main' to 'vs/editor/edcore.main'
		contents = contents.replace(/"vs\/editor\/editor\.main\"/, '"vs/editor/edcore.main"');

		var extraContent = [];
		var allPluginsModuleIds = [];

		metadata.METADATA.PLUGINS.forEach(function(plugin) {
			allPluginsModuleIds.push(plugin.contrib);
			var pluginPath = plugin.paths[`npm/${type}`]; // npm/dev or npm/min
			var contribPath = path.join(__dirname, pluginPath, plugin.contrib.substr(plugin.modulePrefix.length)) + '.js';
			var contribContents = fs.readFileSync(contribPath).toString();

			// Check for the anonymous define call case 1
			// transform define(function() {...}) to define("moduleId",["require"],function() {...})
			var anonymousContribDefineCase1 = contribContents.indexOf('define(function');
			if (anonymousContribDefineCase1 >= 0) {
				contribContents = (
					contribContents.substring(0, anonymousContribDefineCase1)
					+ `define("${plugin.contrib}",["require"],function`
					+ contribContents.substring(anonymousContribDefineCase1 + 'define(function'.length)
				);
			}

			// Check for the anonymous define call case 2
			// transform define([ to define("moduleId",[
			var anonymousContribDefineCase2 = contribContents.indexOf('define([');
			if (anonymousContribDefineCase2 >= 0) {
				contribContents = (
					contribContents.substring(0, anonymousContribDefineCase2)
					+ `define("${plugin.contrib}",[`
					+ contribContents.substring(anonymousContribDefineCase2 + 'define(['.length)
				);
			}

			var contribDefineIndex = contribContents.indexOf('define("' + plugin.contrib);
			if (contribDefineIndex === -1) {
				contribDefineIndex = contribContents.indexOf('define(\'' + plugin.contrib);
				if (contribDefineIndex === -1) {
					console.error('(1) CANNOT DETERMINE AMD define location for contribution', pluginPath);
					process.exit(-1);
				}
			}

			var depsEndIndex = contribContents.indexOf(']', contribDefineIndex);
			if (contribDefineIndex === -1) {
				console.error('(2) CANNOT DETERMINE AMD define location for contribution', pluginPath);
				process.exit(-1);
			}

			contribContents = contribContents.substring(0, depsEndIndex) + ',"vs/editor/editor.api"' + contribContents.substring(depsEndIndex);

			contribContents = contribContents.replace(
				'define("vs/basic-languages/_.contribution",["require","exports"],',
				'define("vs/basic-languages/_.contribution",["require","exports","vs/editor/editor.api"],',
			);

			extraContent.push(contribContents);
		});

		extraContent.push(`define("vs/editor/editor.main", ["vs/editor/edcore.main","${allPluginsModuleIds.join('","')}"], function(api) { return api; });`);
		var insertIndex = contents.lastIndexOf('//# sourceMappingURL=');
		if (insertIndex === -1) {
			insertIndex = contents.length;
		}
		contents = contents.substring(0, insertIndex) + '\n' + extraContent.join('\n') + '\n' + contents.substring(insertIndex);

		data.contents = Buffer.from(contents);
		this.emit('data', data);
	});
}

function ESM_release() {
	return es.merge(
		gulp.src([
			'node_modules/monaco-editor-core/esm/**/*',
			// we will create our own editor.api.d.ts which also contains the plugins API
			'!node_modules/monaco-editor-core/esm/vs/editor/editor.api.d.ts'
		])
			.pipe(ESM_addImportSuffix())
			.pipe(ESM_addPluginContribs('release/esm'))
			.pipe(gulp.dest('release/esm')),

		ESM_pluginStreams('release/esm/')
	)
}

/**
 * Release plugins to `esm`.
 */
function ESM_pluginStreams(destinationPath) {
	return es.merge(
		metadata.METADATA.PLUGINS.map(function(plugin) {
			return ESM_pluginStream(plugin, destinationPath);
		})
	);
}

/**
 * Release a plugin to `esm`.
 * Adds a dependency to 'vs/editor/editor.api' in contrib files in order for `monaco` to be defined.
 * Rewrites imports for 'monaco-editor-core/**'
 */
function ESM_pluginStream(plugin, destinationPath) {
	const DESTINATION = path.join(__dirname, destinationPath);
	let pluginPath = plugin.paths[`esm`];
	return (
		gulp.src([
			pluginPath + '/**/*'
		])
		.pipe(es.through(function(data) {
			if (!/\.js$/.test(data.path)) {
				this.emit('data', data);
				return;
			}

			let contents = data.contents.toString();

			const info = ts.preProcessFile(contents);
			for (let i = info.importedFiles.length - 1; i >= 0; i--) {
				const importText = info.importedFiles[i].fileName;
				const pos = info.importedFiles[i].pos;
				const end = info.importedFiles[i].end;

				if (!/(^\.\/)|(^\.\.\/)/.test(importText)) {
					// non-relative import
					if (!/^monaco-editor-core/.test(importText)) {
						console.error(`Non-relative import for unknown module: ${importText} in ${data.path}`);
						process.exit(0);
					}

					const myFileDestPath = path.join(DESTINATION, plugin.modulePrefix, data.relative);
					const importFilePath = path.join(DESTINATION, importText.substr('monaco-editor-core/esm/'.length));
					let relativePath = path.relative(path.dirname(myFileDestPath), importFilePath).replace(/\\/g, '/');
					if (!/(^\.\/)|(^\.\.\/)/.test(relativePath)) {
						relativePath = './' + relativePath;
					}

					contents = (
						contents.substring(0, pos + 1)
						+ relativePath
						+ contents.substring(end + 1)
					);
				}
			}

			contents = contents.replace(/\/\/# sourceMappingURL=.*((\r?\n)|$)/g, '');

			data.contents = Buffer.from(contents);
			this.emit('data', data);
		}))
		.pipe(es.through(function(data) {
			if (!/monaco\.contribution\.js$/.test(data.path)) {
				this.emit('data', data);
				return;
			}

			const myFileDestPath = path.join(DESTINATION, plugin.modulePrefix, data.relative);
			const apiFilePath = path.join(DESTINATION, 'vs/editor/editor.api');
			let relativePath = path.relative(path.dirname(myFileDestPath), apiFilePath).replace(/\\/g, '/');
			if (!/(^\.\/)|(^\.\.\/)/.test(relativePath)) {
				relativePath = './' + relativePath;
			}

			let contents = data.contents.toString();
			contents = (
				`import '${relativePath}';\n` +
				contents
			);

			data.contents = Buffer.from(contents);

			this.emit('data', data);
		}))
		.pipe(ESM_addImportSuffix())
		.pipe(gulp.dest(destinationPath + plugin.modulePrefix))
	);
}

function ESM_addImportSuffix() {
	return es.through(function(data) {
		if (!/\.js$/.test(data.path)) {
			this.emit('data', data);
			return;
		}

		let contents = data.contents.toString();

		const info = ts.preProcessFile(contents);
		for (let i = info.importedFiles.length - 1; i >= 0; i--) {
			const importText = info.importedFiles[i].fileName;
			const pos = info.importedFiles[i].pos;
			const end = info.importedFiles[i].end;

			if (/\.css$/.test(importText)) {
				continue;
			}

			contents = (
				contents.substring(0, pos + 1)
				+ importText + '.js'
				+ contents.substring(end + 1)
			);
		}

		data.contents = Buffer.from(contents);
		this.emit('data', data);
	});
}

/**
 * - Rename esm/vs/editor/editor.main.js to esm/vs/editor/edcore.main.js
 * - Create esm/vs/editor/editor.main.js that that stiches things together
 */
function ESM_addPluginContribs(dest) {
	const DESTINATION = path.join(__dirname, dest);
	return es.through(function(data) {
		if (!/editor\.main\.js$/.test(data.path)) {
			this.emit('data', data);
			return;
		}

		this.emit('data', new File({
			path: data.path.replace(/editor\.main/, 'edcore.main'),
			base: data.base,
			contents: data.contents
		}));

		const mainFileDestPath = path.join(DESTINATION, 'vs/editor/editor.main.js');
		let mainFileImports = [];
		metadata.METADATA.PLUGINS.forEach(function(plugin) {
			const contribDestPath = path.join(DESTINATION, plugin.contrib);

			let relativePath = path.relative(path.dirname(mainFileDestPath), contribDestPath).replace(/\\/g, '/');
			if (!/(^\.\/)|(^\.\.\/)/.test(relativePath)) {
				relativePath = './' + relativePath;
			}

			mainFileImports.push(relativePath);
		});

		let mainFileContents = (
			mainFileImports.map((name) => `import '${name}';`).join('\n')
			+ `\n\nexport * from './edcore.main';`
		);

		this.emit('data', new File({
			path: data.path,
			base: data.base,
			contents: Buffer.from(mainFileContents)
		}));
	});
}

/**
 * Edit monaco.d.ts:
 * - append monaco.d.ts from plugins
 */
function addPluginDTS() {
	return es.through(function(data) {
		if (!/monaco\.d\.ts$/.test(data.path)) {
			this.emit('data', data);
			return;
		}
		var contents = data.contents.toString();

		var extraContent = [];
		metadata.METADATA.PLUGINS.forEach(function(plugin) {
			var pluginPath = plugin.paths[`npm/min`]; // npm/dev or npm/min
			var dtsPath = path.join(pluginPath, '../monaco.d.ts');
			try {
				let plugindts = fs.readFileSync(dtsPath).toString();
				plugindts = plugindts.replace('declare module', 'declare namespace');
				extraContent.push(plugindts);
			} catch (err) {
				return;
			}
		});

		contents = [
			'/*!-----------------------------------------------------------',
			' * Copyright (c) Microsoft Corporation. All rights reserved.',
			' * Type definitions for monaco-editor',
			' * Released under the MIT license',
			'*-----------------------------------------------------------*/',
		].join('\n') + '\n' + contents + '\n' + extraContent.join('\n');

		// Ensure consistent indentation and line endings
		contents = cleanFile(contents);

		data.contents = Buffer.from(contents);

		this.emit('data', new File({
			path: path.join(path.dirname(data.path), 'esm/vs/editor/editor.api.d.ts'),
			base: data.base,
			contents: Buffer.from(toExternalDTS(contents))
		}));

		fs.writeFileSync('website/playground/monaco.d.ts.txt', contents);
		fs.writeFileSync('monaco.d.ts', contents);
		this.emit('data', data);
	});
}

function toExternalDTS(contents) {
	let lines = contents.split(/\r\n|\r|\n/);
	let killNextCloseCurlyBrace = false;
	for (let i = 0; i < lines.length; i++) {
		let line = lines[i];

		if (killNextCloseCurlyBrace) {
			if ('}' === line) {
				lines[i] = '';
				killNextCloseCurlyBrace = false;
				continue;
			}

			if (line.indexOf('    ') === 0) {
				lines[i] = line.substr(4);
			} else if (line.charAt(0) === '\t') {
				lines[i] = line.substr(1);
			}

			continue;
		}

		if ('declare namespace monaco {' === line) {
			lines[i] = '';
			killNextCloseCurlyBrace = true;
			continue;
		}

		if (line.indexOf('declare namespace monaco.') === 0) {
			lines[i] = line.replace('declare namespace monaco.', 'export namespace ');
		}

		if (line.indexOf('declare let MonacoEnvironment') === 0) {
			lines[i] = `declare global {\n    let MonacoEnvironment: Environment | undefined;\n}`;
			// lines[i] = line.replace('declare namespace monaco.', 'export namespace ');
		}
	}
	return lines.join('\n').replace(/\n\n\n+/g, '\n\n');
}

/**
 * Normalize line endings and ensure consistent 4 spaces indentation
 */
function cleanFile(contents) {
	return contents.split(/\r\n|\r|\n/).map(function(line) {
		var m = line.match(/^(\t+)/);
		if (!m) {
			return line;
		}
		var tabsCount = m[1].length;
		var newIndent = '';
		for (var i = 0; i < 4 * tabsCount; i++) {
			newIndent += ' ';
		}
		return newIndent + line.substring(tabsCount);
	}).join('\n');
}

/**
 * Edit ThirdPartyNotices.txt:
 * - append ThirdPartyNotices.txt from plugins
 */
function addPluginThirdPartyNotices() {
	return es.through(function(data) {
		if (!/ThirdPartyNotices\.txt$/.test(data.path)) {
			this.emit('data', data);
			return;
		}
		var contents = data.contents.toString();

		var extraContent = [];
		metadata.METADATA.PLUGINS.forEach(function(plugin) {
			if (!plugin.thirdPartyNotices) {
				return;
			}

			console.log('ADDING ThirdPartyNotices from ' + plugin.thirdPartyNotices);
			var thirdPartyNoticeContent = fs.readFileSync(plugin.thirdPartyNotices).toString();
			thirdPartyNoticeContent = thirdPartyNoticeContent.split('\n').slice(8).join('\n');
			extraContent.push(thirdPartyNoticeContent);
		});

		contents += '\n' + extraContent.join('\n');
		data.contents = Buffer.from(contents);

		this.emit('data', data);
	});
}


// --- website

const cleanWebsiteTask = function(cb) { rimraf('../monaco-editor-website', { maxBusyTries: 1 }, cb); };
const buildWebsiteTask = taskSeries(cleanWebsiteTask, function() {

	const initialCWD = process.cwd();

	function replaceWithRelativeResource(dataPath, contents, regex, callback) {
		return contents.replace(regex, function(_, m0) {
			var filePath = path.join(path.dirname(dataPath), m0);
			return callback(m0, fs.readFileSync(filePath));
		});
	}

	var waiting = 0;
	var done = false;

	return (
		es.merge(
			gulp.src([
				'website/**/*',
				'!website/typedoc-theme/**'
			], { dot: true })
			.pipe(es.through(function(data) {
				if (!data.contents || !/\.(html)$/.test(data.path) || /new-samples/.test(data.path)) {
					return this.emit('data', data);
				}

				var contents = data.contents.toString();
				contents = contents.replace(/\.\.\/release\/dev/g, 'node_modules/monaco-editor/min');
				contents = contents.replace(/{{version}}/g, MONACO_EDITOR_VERSION);
				contents = contents.replace(/{{year}}/g, new Date().getFullYear());

				// Preload xhr contents
				contents = replaceWithRelativeResource(data.path, contents, /<pre data-preload="([^"]+)".*/g, function(m0, fileContents) {
					return (
						'<pre data-preload="' + m0 + '" style="display:none">'
						+ fileContents.toString('utf8')
							.replace(/&/g, '&amp;')
							.replace(/</g, '&lt;')
							.replace(/>/g, '&gt;')
						+ '</pre>'
					);
				});

				// Inline fork.png
				contents = replaceWithRelativeResource(data.path, contents, /src="(\.\/fork.png)"/g, function(m0, fileContents) {
					return (
						'src="data:image/png;base64,' + fileContents.toString('base64') + '"'
					);
				});

				var allCSS = '';
				var tmpcontents = replaceWithRelativeResource(data.path, contents, /<link data-inline="yes-please" href="([^"]+)".*/g, function(m0, fileContents) {
					allCSS += fileContents.toString('utf8');
					return '';
				});
				tmpcontents = tmpcontents.replace(/<script.*/g, '');
				tmpcontents = tmpcontents.replace(/<link.*/g, '');

				waiting++;
				uncss(tmpcontents, {
					raw: allCSS,
					ignore: [/\.alert\b/, /\.alert-error\b/, /\.playground-page\b/]
				}, function(err, output) {
					waiting--;

					if (!err) {
						output = new CleanCSS().minify(output).styles;
						var isFirst = true;
						contents = contents.replace(/<link data-inline="yes-please" href="([^"]+)".*/g, function(_, m0) {
							if (isFirst) {
								isFirst = false;
								return '<style>' + output + '</style>';
							}
							return '';
						});
					}

					// Inline javascript
					contents = replaceWithRelativeResource(data.path, contents, /<script data-inline="yes-please" src="([^"]+)".*/g, function(m0, fileContents) {
						return '<script>' + fileContents.toString('utf8') + '</script>';
					});

					data.contents = Buffer.from(contents.split(/\r\n|\r|\n/).join('\n'));
					this.emit('data', data);

					if (done && waiting === 0) {
						this.emit('end');
					}
				}.bind(this));

			}, function() {
				done = true;
				if (waiting === 0) {
					this.emit('end');
				}
			}))
			.pipe(gulp.dest('../monaco-editor-website')),

			// TypeDoc is silly and consumes the `exclude` option.
			// This option does not make it to typescript compiler, which ends up including /node_modules/ .d.ts files.
			// We work around this by changing the cwd... :O

			gulp.src('monaco.d.ts')
			.pipe(es.through(undefined, function() {
				process.chdir(os.tmpdir());
				this.emit('end');
			}))
			.pipe(typedoc({
				mode: 'file',
				out: path.join(__dirname, '../monaco-editor-website/api'),
				includeDeclarations: true,
				theme: path.join(__dirname, 'website/typedoc-theme'),
				entryPoint: 'monaco',
				name: 'Monaco Editor API v' + MONACO_EDITOR_VERSION,
				readme: 'none',
				hideGenerator: true
			}))
			.pipe(es.through(undefined, function() {
				process.chdir(initialCWD);
				this.emit('end');
			}))
		)

		.pipe(es.through(function(data) {
			this.emit('data', data);
		}, function() {

			// temporarily create package.json so that npm install doesn't bark
			fs.writeFileSync('../monaco-editor-website/package.json', '{}');
			fs.writeFileSync('../monaco-editor-website/.nojekyll', '');
			cp.execSync('npm install monaco-editor', {
				cwd: path.join(__dirname, '../monaco-editor-website')
			});
			fs.unlinkSync('../monaco-editor-website/package.json');

			this.emit('end');
		}))
	);

});
gulp.task('build-website', buildWebsiteTask);

gulp.task('website', taskSeries(buildWebsiteTask, function() {
	cp.execSync('git init', {
		cwd: path.join(__dirname, '../monaco-editor-website')
	});

	let remoteUrl = cp.execSync('git remote get-url origin')
	let committerUserName = cp.execSync('git log --format=\'%an\' -1');
	let committerEmail = cp.execSync('git log --format=\'%ae\' -1');

	cp.execSync(`git config user.name ${committerUserName}`, {
		cwd: path.join(__dirname, '../monaco-editor-website')
	});
	cp.execSync(`git config user.email ${committerEmail}`, {
		cwd: path.join(__dirname, '../monaco-editor-website')
	});

	cp.execSync(`git remote add origin ${remoteUrl}`, {
		cwd: path.join(__dirname, '../monaco-editor-website')
	});
	cp.execSync('git checkout -b gh-pages', {
		cwd: path.join(__dirname, '../monaco-editor-website')
	});
	cp.execSync('git add .', {
		cwd: path.join(__dirname, '../monaco-editor-website')
	});
	cp.execSync('git commit -m "Publish website"', {
		cwd: path.join(__dirname, '../monaco-editor-website')
	});
	console.log('RUN monaco-editor-website>git push origin gh-pages --force');
}));

const generateTestSamplesTask = function() {
	var sampleNames = fs.readdirSync(path.join(__dirname, 'test/samples'));
	var samples = sampleNames.map(function(sampleName) {
		var samplePath = path.join(__dirname, 'test/samples', sampleName);
		var sampleContent = fs.readFileSync(samplePath).toString();
		return {
			name: sampleName,
			content: sampleContent
		};
	});
	var prefix = '//This is a generated file via gulp generate-test-samples\ndefine([], function() { return';
	var suffix = '; });'
	fs.writeFileSync(path.join(__dirname, 'test/samples-all.generated.js'), prefix + JSON.stringify(samples, null, '\t') + suffix );

	var PLAY_SAMPLES = require(path.join(WEBSITE_GENERATED_PATH, 'all.js')).PLAY_SAMPLES;
	var locations = [];
	for (var i = 0; i < PLAY_SAMPLES.length; i++) {
		var sample = PLAY_SAMPLES[i];
		var sampleId = sample.id;
		var samplePath = path.join(WEBSITE_GENERATED_PATH, sample.path);

		var html = fs.readFileSync(path.join(samplePath, 'sample.html'));
		var js = fs.readFileSync(path.join(samplePath, 'sample.js'));
		var css = fs.readFileSync(path.join(samplePath, 'sample.css'));

		var result = [
			'<!DOCTYPE html>',
			'<!-- THIS IS A GENERATED FILE VIA gulp generate-test-samples -->',
			'<html>',
			'<head>',
			'	<base href="..">',
			'	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />',
			'</head>',
			'<body>',
			'<style>',
			'/*----------------------------------------SAMPLE CSS START*/',
			'',
			css,
			'',
			'/*----------------------------------------SAMPLE CSS END*/',
			'</style>',
			'<a class="loading-opts" href="playground.generated/index.html">[&lt;&lt; BACK]</a> <br/>',
			'THIS IS A GENERATED FILE VIA gulp generate-test-samples',
			'',
			'<div id="bar" style="margin-bottom: 6px;"></div>',
			'',
			'<div style="clear:both"></div>',
			'<div id="outer-container" style="width:800px;height:450px;border: 1px solid grey">',
			'<!-- ----------------------------------------SAMPLE HTML START-->',
			'',
			html,
			'',
			'<!-- ----------------------------------------SAMPLE HTML END-->',
			'</div>',
			'<div style="clear:both"></div>',
			'',
			'<script src="../metadata.js"></script>',
			'<script src="dev-setup.js"></script>',
			'<script>',
			'loadEditor(function() {',
			'/*----------------------------------------SAMPLE JS START*/',
			'',
			js,
			'',
			'/*----------------------------------------SAMPLE JS END*/',
			'});',
			'</script>',
			'</body>',
			'</html>',
		];
		fs.writeFileSync(path.join(__dirname, 'test/playground.generated/' + sampleId + '.html'), result.join('\n'));
		locations.push({
			path: sampleId + '.html',
			name: sample.chapter + ' &gt; ' + sample.name
		})
	}

	var index = [
		'<!DOCTYPE html>',
		'<!-- THIS IS A GENERATED FILE VIA gulp generate-test-samples -->',
		'<html>',
		'<head>',
		'	<base href="..">',
		'</head>',
		'<body>',
		'<a class="loading-opts" href="index.html">[&lt;&lt; BACK]</a><br/>',
		'THIS IS A GENERATED FILE VIA gulp generate-test-samples<br/><br/>',
		locations.map(function(location) {
			return '<a class="loading-opts" href="playground.generated/' + location.path + '">' + location.name + '</a>';
		}).join('<br/>\n'),
		'<script src="../metadata.js"></script>',
		'<script src="dev-setup.js"></script>',
		'</body>',
		'</html>',
	]
	fs.writeFileSync(path.join(__dirname, 'test/playground.generated/index.html'), index.join('\n'));
};

function createSimpleServer(rootDir, port) {
	yaserver.createServer({
		rootDir: rootDir
	}).then((staticServer) => {
		const server = http.createServer((request, response) => {
			return staticServer.handle(request, response);
		});
		server.listen(port, '127.0.0.1', () => {
			console.log(`Running at http://127.0.0.1:${port}`);
		});
	});
}

gulp.task('simpleserver', taskSeries(generateTestSamplesTask, function() {
	const SERVER_ROOT = path.normalize(path.join(__dirname, '../'));
	createSimpleServer(SERVER_ROOT, 8080);
	createSimpleServer(SERVER_ROOT, 8088);
}));

gulp.task('ciserver', taskSeries(generateTestSamplesTask, function () {
	const SERVER_ROOT = path.normalize(path.join(__dirname, './'));
	createSimpleServer(SERVER_ROOT, 8080);
}));
