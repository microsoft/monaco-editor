const requirejs = require("requirejs");
const jsdom = require('jsdom');
const glob = require('glob');
const path = require('path');

requirejs.config({
	baseUrl: '',
	paths: {
		'vs/css': 'test/css.mock',
		'vs/nls': 'test/nls.mock',
		'vs': 'node_modules/monaco-editor-core/dev/vs'
	},
	nodeRequire: require
});

const tmp = new jsdom.JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = tmp.window.document;
global.navigator = tmp.window.navigator;
global.self = global;
global.document.queryCommandSupported = function () { return false; };
global.window = { location: {}, navigator: tmp.window.navigator };

requirejs(['./test/setup'], function () {
	glob('release/dev/*/*.test.js', { cwd: path.dirname(__dirname) }, function (err, files) {
		if (err) {
			console.log(err);
			return;
		}
		requirejs(files.map(f => f.replace(/\.js$/, '')), function () {
			// We can launch the tests!
		}, function (err) {
			console.log(err);
		})
	});
}, function (err) {
	console.log(err);
});
