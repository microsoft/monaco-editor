
function loadDevEditor() {
	return (getQueryStringValue('editor') === 'dev');
}

function getQueryStringValue (key) {
	return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

(function() {
	// Resolve paths
	// should run the editor and/or plugins from source? (or from the node module)
	if (loadDevEditor()) {
		METADATA.CORE.path = METADATA.CORE.srcPath;
	} else {
		METADATA.CORE.path = '/monaco-editor/' + METADATA.CORE.path;
	}
	METADATA.PLUGINS.forEach(function(plugin) {
		// should run the editor plugins from source? (or from node modules)
		if (plugin.srcPath && getQueryStringValue(plugin.name) === 'dev') {
			plugin.path = plugin.srcPath;
		} else {
			plugin.path = '/monaco-editor/' + plugin.path;
		}
	});
})();

function loadEditor(callback, PATH_PREFIX) {
	PATH_PREFIX = PATH_PREFIX || '';
	var pathsConfig = {};
	METADATA.PLUGINS.forEach(function(plugin) {
		pathsConfig[plugin.modulePrefix] = PATH_PREFIX + plugin.path;
	});
	pathsConfig['vs'] = PATH_PREFIX + METADATA.CORE.path;

	// console.log(JSON.stringify(pathsConfig, null, '\t'));

	require.config({
		paths: pathsConfig
	});

	require(['vs/editor/editor.main'], function() {
		// At this point we've loaded the monaco-editor-core
		require(METADATA.PLUGINS.map(function(plugin) { return plugin.contrib; }), function() {
			// At this point we've loaded all the plugins
			callback();
			// require(['./index'], function() {});
		});
	});
}