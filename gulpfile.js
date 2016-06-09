
var gulp = require('gulp');
var metadata = require('./metadata');
var es = require('event-stream');
var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');

gulp.task('clean-release', function(cb) { rimraf('release', { maxBusyTries: 1 }, cb); });
gulp.task('release', ['clean-release'], function() {
	return es.merge(

		// dev folder
		releaseOne('dev'),

		// min folder
		releaseOne('min'),

		// package.json
		gulp.src('package.json')
			.pipe(es.through(function(data) {
				var json = JSON.parse(data.contents.toString());
				json.private = false;
				data.contents = new Buffer(JSON.stringify(json, null, '  '));
				this.emit('data', data);
			}))
			.pipe(gulp.dest('release')),

		// min-maps folder
		gulp.src('node_modules/monaco-editor-core/min-maps/**/*').pipe(gulp.dest('release/min-maps')),

		// other files
		gulp.src([
			'node_modules/monaco-editor-core/LICENSE',
			'node_modules/monaco-editor-core/monaco.d.ts',
			'node_modules/monaco-editor-core/ThirdPartyNotices.txt',
			'README.md'
		]).pipe(gulp.dest('release'))
	)
});

function releaseOne(type) {
	return es.merge(
		gulp.src('node_modules/monaco-editor-core/' + type + '/**/*')
			.pipe(addPluginContribs())
			.pipe(gulp.dest('release/' + type)),
		pluginStreams('release/' + type + '/')
	)
}

function mergePluginsContribsIntoCore(coreStream) {
	return (
		coreStream
		.pipe(addPluginContribs())
	);
}

function pluginStreams(destinationPath) {
	return es.merge(
		metadata.METADATA.PLUGINS.map(function(plugin) {
			return pluginStream(plugin, destinationPath);
		})
	);
}

function pluginStream(plugin, destinationPath) {
	var contribPath = path.join(plugin.path, plugin.contrib.substr(plugin.modulePrefix.length)) + '.js';
	return (
		gulp.src([
			plugin.path + '/**/*',
			'!' + contribPath
		])
		.pipe(gulp.dest(destinationPath + plugin.modulePrefix))
	);
}

/**
 * Edit editor.main.js:
 * - rename the AMD module 'vs/editor/editor.main' to 'vs/editor/edcore.main'
 * - append contribs from plugins
 * - append new AMD module 'vs/editor/editor.main' that stiches things together
 */
function addPluginContribs() {
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
			var contribPath = path.join(__dirname, plugin.path, plugin.contrib.substr(plugin.modulePrefix.length)) + '.js';
			var contribContents = fs.readFileSync(contribPath).toString();

			var contribDefineIndex = contribContents.indexOf('define("' + plugin.contrib);
			if (contribDefineIndex === -1) {
				console.error('(1) CANNOT DETERMINE AMD define location for contribution', plugin);
				process.exit(-1);
			}

			var depsEndIndex = contribContents.indexOf(']', contribDefineIndex);
			if (contribDefineIndex === -1) {
				console.error('(2) CANNOT DETERMINE AMD define location for contribution', plugin);
				process.exit(-1);
			}

			contribContents = contribContents.substring(0, depsEndIndex) + ',"vs/editor/edcore.main"' + contribContents.substring(depsEndIndex);

			extraContent.push(contribContents);
		});

		extraContent.push(`define("vs/editor/editor.main", ["vs/editor/edcore.main","${allPluginsModuleIds.join('","')}"], function() {});`);
		var insertIndex = contents.lastIndexOf('//# sourceMappingURL=');
		if (insertIndex === -1) {
			insertIndex = contents.length;
		}
		contents = contents.substring(0, insertIndex) + '\n' + extraContent.join('\n') + '\n' + contents.substring(insertIndex);

		data.contents = new Buffer(contents);
		this.emit('data', data);
	});
}
