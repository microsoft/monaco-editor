(function() {

	function parseLoaderOptions() {
		function parseQueryString() {
			var str = window.location.search;
			str = str.replace(/^\?/, '');
			var pieces = str.split(/&/);
			var result = {};
			pieces.forEach(function(piece) {
				var config = piece.split(/=/);
				result[config[0]] = config[1];
			});
			return result;
		}
		var overwrites = parseQueryString();
		var result = {};
		result['editor'] = overwrites['editor'] || 'npm';
		METADATA.PLUGINS.map(function(plugin) {
			result[plugin.name] = overwrites[plugin.name] || 'npm';
		});
		return result;
	}
	var LOADER_OPTS = parseLoaderOptions();

	// console.log(JSON.stringify(LOADER_OPTS, null, '\t'));

	self.loadDevEditor = function() {
		return (getQueryStringValue('editor') === 'dev');
	}

	function getQueryStringValue (key) {
		return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
	}


	function resolvePath(paths, selectedPath) {
		if (selectedPath === 'npm') {
			return '/monaco-editor/' + paths[selectedPath];
		} else {
			return paths[selectedPath];
		}
	}
	self.RESOLVED_CORE_PATH = resolvePath(METADATA.CORE.paths, LOADER_OPTS['editor']);
	var RESOLVED_PLUGINS = METADATA.PLUGINS.map(function(plugin) {
		return {
			name: plugin.name,
			contrib: plugin.contrib,
			modulePrefix: plugin.modulePrefix,
			path: resolvePath(plugin.paths, LOADER_OPTS[plugin.name])
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
