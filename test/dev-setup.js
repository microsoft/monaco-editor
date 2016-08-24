(function() {

	self.loadDevEditor = function() {
		return (getQueryStringValue('editor') === 'dev');
	}

	function getQueryStringValue (key) {
		return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
	}

	function resolveCorePath(core) {
		if (loadDevEditor()) {
			return core.paths.dev;
		} else {
			return '/monaco-editor/' + core.paths.npm;
		}
	}

	function resolvePluginPath(plugin) {
		if (plugin.paths.dev && getQueryStringValue(plugin.name) === 'dev') {
			return plugin.paths.dev;
		} else {
			return '/monaco-editor/' + plugin.paths.npm;
		}
	}

	self.RESOLVED_CORE_PATH = resolveCorePath(METADATA.CORE);
	var RESOLVED_PLUGINS = METADATA.PLUGINS.map(function(plugin) {
		return {
			name: plugin.name,
			contrib: plugin.contrib,
			modulePrefix: plugin.modulePrefix,
			path: resolvePluginPath(plugin)
		};
	});
	self.METADATA = null;

	self.loadEditor = function(callback, PATH_PREFIX) {
		PATH_PREFIX = PATH_PREFIX || '';
		var pathsConfig = {};
		RESOLVED_PLUGINS.forEach(function(plugin) {
			pathsConfig[plugin.modulePrefix] = PATH_PREFIX + plugin.path;
		});
		pathsConfig['vs'] = PATH_PREFIX + RESOLVED_CORE_PATH;

		var loaderInfo = document.createElement('div');
		loaderInfo.style.position = 'fixed';
		loaderInfo.style.top = 0;
		loaderInfo.style.right = 0;
		loaderInfo.innerHTML = 'LOADER PATH CONFIGURATION: ' + '<br/><pre>' + JSON.stringify(pathsConfig, null, '\t') + '</pre>';
		document.body.appendChild(loaderInfo);

		require.config({
			paths: pathsConfig
		});

		require(['vs/editor/editor.main'], function() {
			// At this point we've loaded the monaco-editor-core
			require(RESOLVED_PLUGINS.map(function(plugin) { return plugin.contrib; }), function() {
				// At this point we've loaded all the plugins
				callback();
				// require(['./index'], function() {});
			});
		});
	}
})();
