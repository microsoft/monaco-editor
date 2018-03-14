var requirejs = require("requirejs");
var jsdom = require('jsdom-no-contextify');

requirejs.config({
	baseUrl: '',
	paths: {
		'vs/css': 'test/css.mock',
		'vs/nls': 'test/nls.mock',
		// 'vs': '../vscode/out/vs'
		'vs': 'node_modules/monaco-editor-core/dev/vs'
	},
	nodeRequire: require
});

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.document.queryCommandSupported = function() {};
global.self = global.window = global.document.parentWindow;
global.navigator = global.window.navigator;
global.window.require = requirejs;

function MyWorker() {}
MyWorker.prototype.postMessage = function() {};
global.Worker = MyWorker;

requirejs(['./test/setup'], function() {
}, function(err) {
	console.log(err);
});
