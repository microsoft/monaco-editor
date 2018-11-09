(function() {

	let IS_FILE_PROTOCOL = (window.location.protocol === 'file:');
	let DIRNAME = null;
	if (IS_FILE_PROTOCOL) {
		let port = window.location.port;
		if (port.length > 0) {
			port = ':' + port;
		}
		DIRNAME = window.location.protocol + '//' + window.location.hostname + port + window.location.pathname.substr(0, window.location.pathname.lastIndexOf('/'));

		let bases = document.getElementsByTagName('base');
		if (bases.length > 0) {
			DIRNAME = DIRNAME + '/' + bases[0].getAttribute('href');
		}
	}


	let LOADER_OPTS = (function() {
		function parseQueryString() {
			let str = window.location.search;
			str = str.replace(/^\?/, '');
			let pieces = str.split(/&/);
			let result = {};
			pieces.forEach(function(piece) {
				let config = piece.split(/=/);
				result[config[0]] = config[1];
			});
			return result;
		}
		let overwrites = parseQueryString();
		let result = {};
		result['editor'] = overwrites['editor'] || 'npm/dev';
		METADATA.PLUGINS.map(function(plugin) {
			result[plugin.name] = overwrites[plugin.name] || 'npm/dev';
		});
		return result;
	})();
	function toHREF(search) {
		let port = window.location.port;
		if (port.length > 0) {
			port = ':' + port;
		}
		return window.location.protocol + '//' + window.location.hostname + port + window.location.pathname + search + window.location.hash;
	}


	function Component(name, modulePrefix, paths, contrib) {
		this.name = name;
		this.modulePrefix = modulePrefix;
		this.paths = paths;
		this.contrib = contrib;
		this.selectedPath = LOADER_OPTS[name];
	}
	Component.prototype.isRelease = function() {
		return /release/.test(this.selectedPath);
	};
	Component.prototype.getResolvedPath = function() {
		let resolvedPath = this.paths[this.selectedPath];
		if (this.selectedPath === 'npm/dev' || this.selectedPath === 'npm/min' || this.isRelease()) {
			if (IS_FILE_PROTOCOL) {
				resolvedPath = DIRNAME + '/../' + resolvedPath;
			} else {
				resolvedPath = '/monaco-editor/' + resolvedPath;
			}
		} else {
			if (IS_FILE_PROTOCOL) {
				resolvedPath = DIRNAME + '/../..' + resolvedPath;
			}
		}
		return resolvedPath;
	};
	Component.prototype.generateLoaderConfig = function(dest) {
		dest[this.modulePrefix] = this.getResolvedPath();
	};
	Component.prototype.generateUrlForPath = function(pathName) {
		let NEW_LOADER_OPTS = {};
		Object.keys(LOADER_OPTS).forEach(function(key) {
			NEW_LOADER_OPTS[key] = (LOADER_OPTS[key] === 'npm/dev' ? undefined : LOADER_OPTS[key]);
		});
		NEW_LOADER_OPTS[this.name] = (pathName === 'npm/dev' ? undefined : pathName);

		let search = Object.keys(NEW_LOADER_OPTS).map(function(key) {
			let value = NEW_LOADER_OPTS[key];
			if (value) {
				return key + '=' + value;
			}
			return '';
		}).filter(function(assignment) { return !!assignment; }).join('&');
		if (search.length > 0) {
			search = '?' + search;
		}
		return toHREF(search);
	};
	Component.prototype.renderLoadingOptions = function() {
		return '<strong style="width:130px;display:inline-block;">' + this.name + '</strong>:&nbsp;&nbsp;&nbsp;' + Object.keys(this.paths).map(function(pathName) {
			if (pathName === this.selectedPath) {
				return '<strong>' + pathName + '</strong>';
			}
			return '<a href="' + this.generateUrlForPath(pathName) + '">' + pathName + '</a>';
		}.bind(this)).join('&nbsp;&nbsp;&nbsp;');
	};


	let RESOLVED_CORE = new Component('editor', 'vs', METADATA.CORE.paths);
	self.RESOLVED_CORE_PATH = RESOLVED_CORE.getResolvedPath();
	let RESOLVED_PLUGINS = METADATA.PLUGINS.map(function(plugin) {
		return new Component(plugin.name, plugin.modulePrefix, plugin.paths, plugin.contrib);
	});
	METADATA = null;


	function loadScript(path, callback) {
		let script = document.createElement('script');
		script.onload = callback;
		script.async = true;
		script.type = 'text/javascript';
		script.src = path;
		document.head.appendChild(script);
	}


	(function() {
		let allComponents = [RESOLVED_CORE];
		if (!RESOLVED_CORE.isRelease()) {
			allComponents = allComponents.concat(RESOLVED_PLUGINS);
		}

		let div = document.createElement('div');
		div.style.position = 'fixed';
		div.style.top = 0;
		div.style.right = 0;
		div.style.background = 'lightgray';
		div.style.padding = '5px 20px 5px 5px';
		div.style.zIndex = '1000';

		div.innerHTML = '<ul><li>' + allComponents.map(function(component) { return component.renderLoadingOptions(); }).join('</li><li>') + '</li></ul>';

		document.body.appendChild(div);

		let aElements = document.getElementsByTagName('a');
		for (let i = 0; i < aElements.length; i++) {
			let aElement = aElements[i];
			if (aElement.className === 'loading-opts') {
				aElement.href += window.location.search
			}
		}
	})();


	self.loadEditor = function(callback, PATH_PREFIX) {
		PATH_PREFIX = PATH_PREFIX || '';

		loadScript(PATH_PREFIX + RESOLVED_CORE.getResolvedPath() + '/loader.js', function() {
			let loaderPathsConfig = {};
			if (!RESOLVED_CORE.isRelease()) {
				RESOLVED_PLUGINS.forEach(function(plugin) {
					plugin.generateLoaderConfig(loaderPathsConfig);
				});
			}
			RESOLVED_CORE.generateLoaderConfig(loaderPathsConfig);

			console.log('LOADER CONFIG: ');
			console.log(JSON.stringify(loaderPathsConfig, null, '\t'));

			require.config({
				paths: loaderPathsConfig
			});

			require(['vs/editor/editor.main'], function() {
				if (!RESOLVED_CORE.isRelease()) {
					// At this point we've loaded the monaco-editor-core
					require(RESOLVED_PLUGINS.map(function(plugin) { return plugin.contrib; }), function() {
						// At this point we've loaded all the plugins
						callback();
					});
				} else {
					callback();
				}
			});
		});
	}
})();
