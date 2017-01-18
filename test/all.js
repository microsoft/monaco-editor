var requirejs = require("requirejs");
var jsdom = require('jsdom-no-contextify');

requirejs.config({
	baseUrl: '',
	paths: {
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

requirejs([
	'vs/editor/editor.main'
], function() {
	requirejs([
		'out/test/bat.test',
		'out/test/css.test',
		'out/test/coffee.test',
		'out/test/cpp.test',
		'out/test/csharp.test',
		'out/test/dockerfile.test',
		'out/test/fsharp.test',
		'out/test/go.test',
		'out/test/handlebars.test',
		'out/test/html.test',
		'out/test/jade.test',
		'out/test/java.test',
		'out/test/less.test',
		'out/test/lua.test',
		'out/test/markdown.test',
		'out/test/objective-c.test',
		'out/test/php.test',
		'out/test/postiats.test',
		'out/test/powershell.test',
		'out/test/python.test',
		'out/test/r.test',
		'out/test/razor.test',
		'out/test/ruby.test',
		'out/test/scss.test',
		'out/test/swift.test',
		'out/test/sql.test',
		'out/test/vb.test',
		'out/test/xml.test',
		'out/test/yaml.test'
	], function() {
		run(); // We can launch the tests!
	});
});
