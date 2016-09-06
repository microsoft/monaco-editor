
var gulp = require('gulp');
var metadata = require('./metadata');
var es = require('event-stream');
var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');
var cp = require('child_process');
var httpServer = require('http-server');

var WEBSITE_GENERATED_PATH = path.join(__dirname, 'website/playground/new-samples');
var MONACO_EDITOR_VERSION = (function() {
	var packageJsonPath = path.join(__dirname, 'package.json');
	var packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString());
	var version = packageJson.version;
	if (!/\d+\.\d+\.\d+/.test(version)) {
		console.log('unrecognized package.json version: ' + version);
		process.exit(0);
	}
	return version;
})();

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

		gulp.src('CHANGELOG.md'),

		// min-maps folder
		gulp.src('node_modules/monaco-editor-core/min-maps/**/*').pipe(gulp.dest('release/min-maps')),

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
});

function releaseOne(type) {
	return es.merge(
		gulp.src('node_modules/monaco-editor-core/' + type + '/**/*')
			.pipe(addPluginContribs())
			.pipe(gulp.dest('release/' + type)),
		pluginStreams('release/' + type + '/')
	)
}

function pluginStreams(destinationPath) {
	return es.merge(
		metadata.METADATA.PLUGINS.map(function(plugin) {
			return pluginStream(plugin, destinationPath);
		})
	);
}

function pluginStream(plugin, destinationPath) {
	var contribPath = path.join(plugin.paths.npm, plugin.contrib.substr(plugin.modulePrefix.length)) + '.js';
	return (
		gulp.src([
			plugin.paths.npm + '/**/*',
			'!' + contribPath,
			'!' + plugin.paths.npm + '/**/monaco.d.ts'
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
			var contribPath = path.join(__dirname, plugin.paths.npm, plugin.contrib.substr(plugin.modulePrefix.length)) + '.js';
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
			var dtsPath = path.join(plugin.paths.npm, 'monaco.d.ts');
			try {
				extraContent.push(fs.readFileSync(dtsPath).toString());
			} catch (err) {
				return;
			}
		});

		contents += '\n' + extraContent.join('\n');
		data.contents = new Buffer(contents);

		fs.writeFileSync('website/playground/monaco.d.ts.txt', contents);
		this.emit('data', data);
	});
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
			var thirdPartyNoticePath = path.join(path.dirname(plugin.paths.npm), 'ThirdPartyNotices.txt');
			try {
				var thirdPartyNoticeContent = fs.readFileSync(thirdPartyNoticePath).toString();
				thirdPartyNoticeContent = thirdPartyNoticeContent.split('\n').slice(8).join('\n');
				extraContent.push(thirdPartyNoticeContent);
			} catch (err) {
				return;
			}
		});

		contents += '\n' + extraContent.join('\n');
		data.contents = new Buffer(contents);

		this.emit('data', data);
	});
}


// --- website

gulp.task('clean-website', function(cb) { rimraf('../monaco-editor-website', { maxBusyTries: 1 }, cb); });
gulp.task('website', ['clean-website'], function() {

	return (
		gulp.src('website/**/*', { dot: true })
		.pipe(es.through(function(data) {
			if (!data.contents || !/\.(html)$/.test(data.path)) {
				return this.emit('data', data);
			}

			var contents = data.contents.toString();
			contents = contents.replace(/\.\.\/release\/dev/g, 'node_modules/monaco-editor/min');
			contents = contents.replace(/{{version}}/g, MONACO_EDITOR_VERSION);
			// contents = contents.replace('&copy; 2016 Microsoft', '&copy; 2016 Microsoft [' + builtTime + ']');

			data.contents = new Buffer(contents);

			this.emit('data', data);
		}))
		.pipe(gulp.dest('../monaco-editor-website'))
		.pipe(es.through(function(data) {
			this.emit('data', data);
		}, function() {

			// temporarily create package.json so that npm install doesn't bark
			fs.writeFileSync('../monaco-editor-website/package.json', '{}');
			cp.execSync('npm install monaco-editor', {
				cwd: path.join(__dirname, '../monaco-editor-website')
			});
			fs.unlink('../monaco-editor-website/package.json');

			cp.execSync('git init', {
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
			cp.execSync('git remote add origin https://github.com/Microsoft/monaco-editor.git', {
				cwd: path.join(__dirname, '../monaco-editor-website')
			});
			console.log('RUN monaco-editor-website>git push origin gh-pages --force')
			this.emit('end');
		}))
	);

});

gulp.task('generate-test-samples', function() {
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
			'	<meta http-equiv="X-UA-Compatible" content="IE=edge" />',
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
			'/*----------------------------------------SAMPLE CSS END*/',
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
});

gulp.task('simpleserver', ['generate-test-samples'], function(cb) {
	httpServer.createServer({ root: '../', cache: 5 }).listen(8080);
	httpServer.createServer({ root: '../', cache: 5 }).listen(8088);
	console.log('LISTENING on 8080 and 8088');
});
