(function () {
	const METADATA = {
		CORE: {
			paths: {
				src: '/vscode/out/vs',
				'npm/dev': 'node_modules/monaco-editor-core/dev/vs',
				'npm/min': 'node_modules/monaco-editor-core/min/vs',
				built: '/vscode/out-monaco-editor-core/min/vs',
				releaseDev: 'release/dev/vs',
				releaseMin: 'release/min/vs'
			}
		},
		PLUGINS: [
			{
				name: 'monaco-typescript',
				modulePrefix: 'vs/language/typescript',
				paths: {
					src: './out/amd/language/typescript',
					dev: './out/release/dev/vs/language/typescript',
					min: './out/release/min/vs/language/typescript'
				}
			},
			{
				name: 'monaco-css',
				modulePrefix: 'vs/language/css',
				paths: {
					src: './out/amd/language/css',
					dev: './out/release/dev/vs/language/css',
					min: './out/release/min/vs/language/css'
				}
			},
			{
				name: 'monaco-json',
				modulePrefix: 'vs/language/json',
				paths: {
					src: './out/amd/language/json',
					dev: './out/release/dev/vs/language/json',
					min: './out/release/min/vs/language/json'
				}
			},
			{
				name: 'monaco-html',
				modulePrefix: 'vs/language/html',
				paths: {
					src: './out/amd/language/html',
					dev: './out/release/dev/vs/language/html',
					min: './out/release/min/vs/language/html'
				}
			},
			{
				name: 'monaco-languages',
				modulePrefix: 'vs/basic-languages',
				paths: {
					src: './out/amd/basic-languages',
					dev: './out/release/dev/vs/basic-languages',
					min: './out/release/min/vs/basic-languages'
				}
			}
		]
	};

	let LOADER_OPTS = (function () {
		function parseQueryString() {
			let str = window.location.search;
			str = str.replace(/^\?/, '');
			let pieces = str.split(/&/);
			let result = {};
			pieces.forEach(function (piece) {
				let config = piece.split(/=/);
				result[config[0]] = config[1];
			});
			return result;
		}
		let overwrites = parseQueryString();
		let result = {};
		result['editor'] = overwrites['editor'] || 'npm/dev';
		METADATA.PLUGINS.map(function (plugin) {
			result[plugin.name] = overwrites[plugin.name] || 'dev';
		});
		return result;
	})();
	function toHREF(search) {
		let port = window.location.port;
		if (port.length > 0) {
			port = ':' + port;
		}
		return (
			window.location.protocol +
			'//' +
			window.location.hostname +
			port +
			window.location.pathname +
			search +
			window.location.hash
		);
	}

	function Component(name, modulePrefix, paths) {
		this.name = name;
		this.modulePrefix = modulePrefix;
		this.paths = paths;
		this.selectedPath = LOADER_OPTS[name];
	}
	Component.prototype.isRelease = function () {
		return /release/.test(this.selectedPath);
	};
	Component.prototype.getResolvedPath = function (PATH_PREFIX) {
		let resolvedPath = this.paths[this.selectedPath];
		if (!/^\//.test(resolvedPath)) {
			resolvedPath = PATH_PREFIX + '/monaco-editor/' + resolvedPath;
		}
		return resolvedPath;
	};
	Component.prototype.generateLoaderConfig = function (dest, PATH_PREFIX) {
		dest[this.modulePrefix] = this.getResolvedPath(PATH_PREFIX);
	};
	Component.prototype.generateUrlForPath = function (pathName) {
		let NEW_LOADER_OPTS = {};
		Object.keys(LOADER_OPTS).forEach(function (key) {
			NEW_LOADER_OPTS[key] = LOADER_OPTS[key] === 'npm/dev' ? undefined : LOADER_OPTS[key];
		});
		NEW_LOADER_OPTS[this.name] = pathName === 'npm/dev' ? undefined : pathName;

		let search = Object.keys(NEW_LOADER_OPTS)
			.map(function (key) {
				let value = NEW_LOADER_OPTS[key];
				if (value) {
					return key + '=' + value;
				}
				return '';
			})
			.filter(function (assignment) {
				return !!assignment;
			})
			.join('&amp;');
		if (search.length > 0) {
			search = '?' + search;
		}
		return toHREF(search);
	};
	Component.prototype.renderLoadingOptions = function () {
		return (
			'<strong style="width:130px;display:inline-block;">' +
			this.name +
			'</strong>:&#160;&#160;&#160;' +
			Object.keys(this.paths)
				.map(
					function (pathName) {
						if (pathName === this.selectedPath) {
							return '<strong>' + pathName + '</strong>';
						}
						return '<a href="' + this.generateUrlForPath(pathName) + '">' + pathName + '</a>';
					}.bind(this)
				)
				.join('&#160;&#160;&#160;')
		);
	};

	let RESOLVED_CORE = new Component('editor', 'vs', METADATA.CORE.paths);
	self.RESOLVED_CORE_PATH = RESOLVED_CORE.getResolvedPath('');
	let RESOLVED_PLUGINS = METADATA.PLUGINS.map(function (plugin) {
		return new Component(plugin.name, plugin.modulePrefix, plugin.paths);
	});

	function loadScript(path, callback) {
		let script = document.createElement('script');
		script.onload = callback;
		script.async = true;
		script.type = 'text/javascript';
		script.src = path;
		document.head.appendChild(script);
	}

	(function () {
		let allComponents = [RESOLVED_CORE];
		if (!RESOLVED_CORE.isRelease()) {
			allComponents = allComponents.concat(RESOLVED_PLUGINS);
		}

		let div = document.createElement('div');
		div.className = 'dev-setup-control';
		div.style.position = 'fixed';
		div.style.top = 0;
		div.style.right = 0;
		div.style.background = 'lightgray';
		div.style.padding = '5px 20px 5px 5px';
		div.style.zIndex = '1000';

		div.innerHTML =
			'<ul><li>' +
			allComponents
				.map(function (component) {
					return component.renderLoadingOptions();
				})
				.join('</li><li>') +
			'</li></ul>';

		document.body.appendChild(div);

		let aElements = document.getElementsByTagName('a');
		for (let i = 0; i < aElements.length; i++) {
			let aElement = aElements[i];
			if (aElement.className === 'loading-opts') {
				aElement.href += window.location.search;
			}
		}
	})();

	self.getCodiconPath = function (PATH_PREFIX) {
		PATH_PREFIX = PATH_PREFIX || '';
		const result = RESOLVED_CORE.getResolvedPath(PATH_PREFIX);
		return result + '/base/browser/ui/codicons/codicon/codicon.ttf';
	};

	self.loadEditor = function (callback, PATH_PREFIX) {
		PATH_PREFIX = PATH_PREFIX || '';

		loadScript(RESOLVED_CORE.getResolvedPath(PATH_PREFIX) + '/loader.js', function () {
			let loaderPathsConfig = {};
			window.AMD = true;
			loaderPathsConfig['vs/fillers/monaco-editor-core'] =
				PATH_PREFIX + '/monaco-editor/./out/amd/fillers/monaco-editor-core-amd';
			if (!RESOLVED_CORE.isRelease()) {
				RESOLVED_PLUGINS.forEach(function (plugin) {
					plugin.generateLoaderConfig(loaderPathsConfig, PATH_PREFIX);
				});
			}
			RESOLVED_CORE.generateLoaderConfig(loaderPathsConfig, PATH_PREFIX);

			console.log('LOADER CONFIG: ');
			console.log(JSON.stringify(loaderPathsConfig, null, '\t'));

			require.config({
				paths: loaderPathsConfig
				// 'vs/nls' : {
				// 	availableLanguages: {
				// 		'*': 'de'
				// 	}
				// }
			});

			require(['vs/editor/editor.main'], function () {
				if (!RESOLVED_CORE.isRelease()) {
					// At this point we've loaded the monaco-editor-core
					require([
						'vs/basic-languages/monaco.contribution',
						'vs/language/css/monaco.contribution',
						'vs/language/html/monaco.contribution',
						'vs/language/json/monaco.contribution',
						'vs/language/typescript/monaco.contribution'
					], function () {
						// At this point we've loaded all the plugins
						callback();
					});
				} else {
					callback();
				}
			});
		});
	};
})();
