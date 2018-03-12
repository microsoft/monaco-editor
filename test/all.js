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
global.doNotInitLoader = true;

function MyWorker() {}
MyWorker.prototype.postMessage = function() {};
global.Worker = MyWorker;

requirejs([
	'vs/editor/editor.main'
], function() {
	requirejs([
		'out/amd/test/bat.test',
		'out/amd/test/css.test',
		'out/amd/test/coffee.test',
		'out/amd/test/cpp.test',
		'out/amd/test/csharp.test',
		'out/amd/test/dockerfile.test',
		'out/amd/test/fsharp.test',
		'out/amd/test/go.test',
		'out/amd/test/handlebars.test',
		'out/amd/test/html.test',
		'out/amd/test/pug.test',
		'out/amd/test/java.test',
		'out/amd/test/less.test',
		'out/amd/test/lua.test',
		'out/amd/test/markdown.test',
		'out/amd/test/msdax.test',
		'out/amd/test/objective-c.test',
		'out/amd/test/php.test',
		'out/amd/test/postiats.test',
		'out/amd/test/powershell.test',
		'out/amd/test/python.test',
		'out/amd/test/r.test',
		'out/amd/test/razor.test',
		'out/amd/test/ruby.test',
		'out/amd/test/scss.test',
		'out/amd/test/swift.test',
		'out/amd/test/sql.test',
		'out/amd/test/vb.test',
		'out/amd/test/xml.test',
		'out/amd/test/yaml.test',
		'out/amd/test/solidity.test',
		'out/amd/test/sb.test',
		'out/amd/test/mysql.test',
		'out/amd/test/pgsql.test',
		'out/amd/test/redshift.test',
		'out/amd/test/redis.test',
		'out/amd/test/csp.test',
	], function() {
		run(); // We can launch the tests!
	});
});
