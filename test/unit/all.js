const requirejs = require('requirejs');
const jsdom = require('jsdom');
const glob = require('glob');
const path = require('path');

requirejs.config({
	baseUrl: '',
	paths: {
		'vs/fillers/monaco-editor-core': 'out/languages/amd-tsc/fillers/monaco-editor-core-amd',
		'vs/basic-languages': 'out/languages/amd-tsc/basic-languages',
		vs: './node_modules/monaco-editor-core/dev/vs'
	},
	nodeRequire: require
});

const tmp = new jsdom.JSDOM('<!DOCTYPE html><html><body></body></html>');
global.AMD = true;
global.document = tmp.window.document;
global.navigator = tmp.window.navigator;
global.self = global;
global.document.queryCommandSupported = function () {
	return false;
};
global.UIEvent = tmp.window.UIEvent;

global.window = {
	location: {},
	navigator: tmp.window.navigator,
	matchMedia: function () {
		return {
			matches: false,
			addEventListener: function () {}
		};
	}
};

requirejs(
	['test/unit/setup'],
	function () {
		glob(
			'out/languages/amd-tsc/basic-languages/*/*.test.js',
			{ cwd: path.join(__dirname, '../../') },
			function (err, files) {
				if (err) {
					console.log(err);
					return;
				}
				requirejs(
					files.map((f) => f.replace(/^out\/languages\/amd-tsc/, 'vs').replace(/\.js$/, '')),
					function () {
						run(); // We can launch the tests!
					},
					function (err) {
						console.log(err);
					}
				);
			}
		);
	},
	function (err) {
		console.log(err);
		process.exit(1);
	}
);
