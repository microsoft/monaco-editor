var requirejs = require("requirejs");
var jsdom = require('jsdom');

requirejs.config({
	baseUrl: '',
	paths: {
		'vs/css': 'test/css.mock',
		'vs/nls': 'test/nls.mock',
		'vs': 'node_modules/monaco-editor-core/dev/vs'
	},
	nodeRequire: require
});

let tmp = new jsdom.JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = tmp.window.document;
global.navigator = tmp.window.navigator;
global.self = global;
global.document.queryCommandSupported = function() { return false; };

requirejs(['./test/setup'], function() {
}, function(err) {
	console.log(err);
});
