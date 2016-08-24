(function() {

	var LOADER_OPTS = (function() {
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
	})();


	function Component(name, modulePrefix, paths, contrib) {
		this.name = name;
		this.modulePrefix = modulePrefix;
		this.paths = paths;
		this.contrib = contrib;
		this.selectedPath = LOADER_OPTS[name];
	}
	Component.prototype.getResolvedPath = function() {
		var resolvedPath = this.paths[this.selectedPath];
		if (this.selectedPath === 'npm') {
			resolvedPath = '/monaco-editor/' + resolvedPath;
		}
		return resolvedPath;
	};
	Component.prototype.generateLoaderConfig = function(dest) {
		dest[this.modulePrefix] = this.getResolvedPath();
	};


	var RESOLVED_CORE = new Component('editor', 'vs', METADATA.CORE.paths);
	var RESOLVED_PLUGINS = METADATA.PLUGINS.map(function(plugin) {
		return new Component(plugin.name, plugin.modulePrefix, plugin.paths, plugin.contrib);
	});
	self.METADATA = null;


	function loadScript(path, callback) {
		var script = document.createElement('script');
		script.onload = callback;
		script.async = true;
		script.type = 'text/javascript';
		script.src = path;
		document.head.appendChild(script);
	}


	self.loadDevEditor = function() {
		return (getQueryStringValue('editor') === 'dev');
	}
	function getQueryStringValue (key) {
		return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
	}


	self.loadEditor = function(callback, PATH_PREFIX) {
		PATH_PREFIX = PATH_PREFIX || '';

		loadScript(PATH_PREFIX + RESOLVED_CORE.getResolvedPath() + '/loader.js', function() {
			var loaderPathsConfig = {};
			RESOLVED_PLUGINS.forEach(function(plugin) {
				plugin.generateLoaderConfig(loaderPathsConfig);
			});
			RESOLVED_CORE.generateLoaderConfig(loaderPathsConfig);

			console.log('LOADER CONFIG: ');
			console.log(JSON.stringify(loaderPathsConfig, null, '\t'));

			require.config({
				paths: loaderPathsConfig
			});

			require(['vs/editor/editor.main'], function() {
				// At this point we've loaded the monaco-editor-core
				require(RESOLVED_PLUGINS.map(function(plugin) { return plugin.contrib; }), function() {
					// At this point we've loaded all the plugins
					callback();
				});
			});
		});
	}
})();
