const gulp = require('gulp');
const es = require('event-stream');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const cp = require('child_process');
const CleanCSS = require('clean-css');
const uncss = require('uncss');
const File = require('vinyl');

/** @type {string} */
const MONACO_EDITOR_VERSION = (function () {
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
		taskResult.on('end', (_) => resolve());
		taskResult.on('error', (err) => reject(err));
	});
}

function taskSeries(...tasks) {
	return async () => {
		for (let i = 0; i < tasks.length; i++) {
			await _execute(tasks[i]);
		}
	};
}

// --- website
const cleanWebsiteTask = function (cb) {
	rimraf('../monaco-editor-website', { maxBusyTries: 1 }, cb);
};
const buildWebsiteTask = taskSeries(cleanWebsiteTask, function () {
	/**
	 * @param {string} dataPath
	 * @param {string} contents
	 * @param {RegExp} regex
	 * @param {(match:string, fileContents:Buffer)=>string} callback
	 * @returns {string}
	 */
	function replaceWithRelativeResource(dataPath, contents, regex, callback) {
		return contents.replace(regex, function (_, m0) {
			var filePath = path.join(path.dirname(dataPath), m0);
			return callback(m0, fs.readFileSync(filePath));
		});
	}

	var waiting = 0;
	var done = false;

	return es
		.merge(
			gulp
				.src(['monaco-editor/website/**/*'], { dot: true })
				.pipe(
					es.through(
						/**
						 * @param {File} data
						 */
						function (data) {
							if (!data.contents || !/\.(html)$/.test(data.path) || /new-samples/.test(data.path)) {
								return this.emit('data', data);
							}

							let contents = data.contents.toString();
							contents = contents.replace(/\.\.\/release\/dev/g, 'node_modules/monaco-editor/min');
							contents = contents.replace(/{{version}}/g, MONACO_EDITOR_VERSION);
							contents = contents.replace(/{{year}}/g, new Date().getFullYear());

							// Preload xhr contents
							contents = replaceWithRelativeResource(
								data.path,
								contents,
								/<pre data-preload="([^"]+)".*/g,
								function (m0, fileContents) {
									return (
										'<pre data-preload="' +
										m0 +
										'" style="display:none">' +
										fileContents
											.toString('utf8')
											.replace(/&/g, '&amp;')
											.replace(/</g, '&lt;')
											.replace(/>/g, '&gt;') +
										'</pre>'
									);
								}
							);

							// Inline fork.png
							contents = replaceWithRelativeResource(
								data.path,
								contents,
								/src="(\.\/fork.png)"/g,
								function (m0, fileContents) {
									return 'src="data:image/png;base64,' + fileContents.toString('base64') + '"';
								}
							);

							let allCSS = '';
							let tmpcontents = replaceWithRelativeResource(
								data.path,
								contents,
								/<link data-inline="yes-please" href="([^"]+)".*/g,
								function (m0, fileContents) {
									allCSS += fileContents.toString('utf8');
									return '';
								}
							);
							tmpcontents = tmpcontents.replace(/<script.*/g, '');
							tmpcontents = tmpcontents.replace(/<link.*/g, '');

							waiting++;
							uncss(
								tmpcontents,
								{
									raw: allCSS,
									ignore: [/\.alert\b/, /\.alert-error\b/, /\.playground-page\b/]
								},
								function (err, output) {
									waiting--;

									if (!err) {
										output = new CleanCSS().minify(output).styles;
										let isFirst = true;
										contents = contents.replace(
											/<link data-inline="yes-please" href="([^"]+)".*/g,
											function (_, m0) {
												if (isFirst) {
													isFirst = false;
													return '<style>' + output + '</style>';
												}
												return '';
											}
										);
									}

									// Inline javascript
									contents = replaceWithRelativeResource(
										data.path,
										contents,
										/<script data-inline="yes-please" src="([^"]+)".*/g,
										function (m0, fileContents) {
											return '<script>' + fileContents.toString('utf8') + '</script>';
										}
									);

									data.contents = Buffer.from(contents.split(/\r\n|\r|\n/).join('\n'));
									this.emit('data', data);

									if (done && waiting === 0) {
										this.emit('end');
									}
								}.bind(this)
							);
						},
						function () {
							done = true;
							if (waiting === 0) {
								this.emit('end');
							}
						}
					)
				)
				.pipe(gulp.dest('../monaco-editor-website'))
		)

		.pipe(
			es.through(
				/**
				 * @param {File} data
				 */
				function (data) {
					this.emit('data', data);
				},
				function () {
					// temporarily create package.json so that npm install doesn't bark
					fs.writeFileSync('../monaco-editor-website/package.json', '{}');
					fs.writeFileSync('../monaco-editor-website/.nojekyll', '');
					cp.execSync('npm install monaco-editor', {
						cwd: path.join(__dirname, '../monaco-editor-website')
					});
					fs.unlinkSync('../monaco-editor-website/package.json');

					this.emit('end');
				}
			)
		);
});
gulp.task('build-website', buildWebsiteTask);

gulp.task('prepare-website-branch', async function () {
	cp.execSync('git init', {
		cwd: path.join(__dirname, '../monaco-editor-website')
	});

	let remoteUrl = cp.execSync('git remote get-url origin');
	let committerUserName = cp.execSync("git log --format='%an' -1");
	let committerEmail = cp.execSync("git log --format='%ae' -1");

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
});
