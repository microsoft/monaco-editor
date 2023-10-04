//@ts-check

(function () {
	const corePaths = {
		src: '/vscode/out/vs',
		'npm/dev': 'node_modules/monaco-editor-core/dev/vs',
		'npm/min': 'node_modules/monaco-editor-core/min/vs',
		built: '/vscode/out-monaco-editor-core/min/vs',
		releaseDev: 'out/monaco-editor/dev/vs',
		releaseMin: 'out/monaco-editor/min/vs'
	};
	const pluginPaths = {
		src: 'out/amd',
		dev: 'out/release/dev/vs',
		min: 'out/release/min/vs'
	};
	const parsedQuery = parseQueryString();
	const editorQueryName = 'editor';
	const pluginsQueryName = 'plugins';
	const defaultEditorQueryValue = 'npm/dev';
	const defaultPluginsQueryValue = 'src';
	const editorQueryValue = parsedQuery[editorQueryName] || defaultEditorQueryValue;
	const pluginsQueryValue = parsedQuery[pluginsQueryName] || defaultPluginsQueryValue;
	const corePath = resolvePath(corePaths[editorQueryValue]);
	const pluginPath = resolvePath(pluginPaths[pluginsQueryValue]);
	const isRelease = /release/.test(editorQueryValue);

	(function () {
		let div = document.createElement('div');
		div.className = 'dev-setup-control';
		div.style.position = 'fixed';
		div.style.top = '0';
		div.style.right = '0';
		div.style.background = 'lightgray';
		div.style.padding = '5px 20px 5px 5px';
		div.style.zIndex = '1000';

		div.innerHTML = // CodeQL [SM03712] This code is not deployed and serves as local test code. No risk of malicious input.
			'<ul><li>' + // CodeQL [SM03712] This code is not deployed and serves as local test code. No risk of malicious input.
			renderLoadingOptions(true) + // CodeQL [SM03712] This code is not deployed and serves as local test code. No risk of malicious input.
			(isRelease ? '' : `</li><li>${renderLoadingOptions(false)}`) + // CodeQL [SM03712] This code is not deployed and serves as local test code. No risk of malicious input.
			'</li></ul>'; // CodeQL [SM03712] This code is not deployed and serves as local test code. No risk of malicious input.

		document.body.appendChild(div);

		let aElements = document.getElementsByTagName('a');
		for (let i = 0; i < aElements.length; i++) {
			let aElement = aElements[i];
			if (aElement.className === 'loading-opts') {
				aElement.href += window.location.search; // CodeQL [SM01507] This code is not deployed and serves as local test code. No risk of malicious input.
			}
		}
	})();

	/** @type {any} */
	const global = self;

	global.getCodiconPath = () => {
		return `${corePath}/base/browser/ui/codicons/codicon/codicon.ttf`;
	};

	/**
	 *
	 * @param {()=>void} callback
	 * @param {string} [PATH_PREFIX]
	 */
	global.loadEditor = (callback, PATH_PREFIX) => {
		PATH_PREFIX = PATH_PREFIX || '';

		loadScript(`${PATH_PREFIX}${corePath}/loader.js`, () => {
			global.AMD = true;

			/** @type {{[name:string]: string;}} */
			const loaderPathsConfig = {};
			if (isRelease) {
				loaderPathsConfig['vs'] = `${PATH_PREFIX}${corePath}`;
			} else {
				loaderPathsConfig[
					'vs/fillers/monaco-editor-core'
				] = `${PATH_PREFIX}/monaco-editor/out/amd/fillers/monaco-editor-core-amd`;
				loaderPathsConfig['vs/language'] = `${PATH_PREFIX}${pluginPath}/language`;
				loaderPathsConfig['vs/basic-language'] = `${PATH_PREFIX}${pluginPath}/basic-language`;
				loaderPathsConfig['vs'] = `${PATH_PREFIX}${corePath}`;
			}

			console.log('LOADER CONFIG: ');
			console.log(JSON.stringify(loaderPathsConfig, null, '\t'));

			/** @type {any} */
			const req = require;

			req.config({
				paths: loaderPathsConfig
				// 'vs/nls' : {
				// 	availableLanguages: {
				// 		'*': 'de'
				// 	}
				// }
			});

			req(['vs/editor/editor.main'], () => {
				if (isRelease) {
					callback();
					return;
				}
				// At this point we've loaded the monaco-editor-core
				req(
					[
						'vs/basic-languages/monaco.contribution',
						'vs/language/css/monaco.contribution',
						'vs/language/html/monaco.contribution',
						'vs/language/json/monaco.contribution',
						'vs/language/typescript/monaco.contribution'
					],
					callback
				);
			});
		});
	};

	function parseQueryString() {
		const str = window.location.search.replace(/^\?/, '');
		const pieces = str.split(/&/);
		/** @type {{[name:string]: string;}} */
		const result = {};
		pieces.forEach((piece) => {
			const config = piece.split(/=/);
			result[config[0]] = config[1];
		});
		return result;
	}

	/**
	 * @param {string} path
	 */
	function resolvePath(path) {
		if (/^\//.test(path)) {
			return path;
		}
		return `/monaco-editor/${path}`;
	}

	/**
	 * @param {boolean} isEditor
	 */
	function renderLoadingOptions(isEditor) {
		const name = isEditor ? 'editor' : 'plugins';
		const paths = isEditor ? corePaths : pluginPaths;
		const selectedPath = isEditor ? editorQueryValue : pluginsQueryValue;
		return (
			'<strong style="width:130px;display:inline-block;">' +
			name +
			'</strong>:&#160;&#160;&#160;' +
			Object.keys(paths)
				.map((path) => {
					if (path === selectedPath) {
						return '<strong>' + path + '</strong>';
					}
					return '<a href="' + generateUrlForLoadingOption(isEditor, path) + '">' + path + '</a>';
				})
				.join('&#160;&#160;&#160;')
		);
	}

	/**
	 * @param {boolean} isEditor
	 * @param {string} value
	 */
	function generateUrlForLoadingOption(isEditor, value) {
		/** @type {{[name:string]: string;}} */
		const newQueryOptions = {};
		const newEditorQueryValue = isEditor ? value : editorQueryValue;
		const newPluginsQueryValue = isEditor ? pluginsQueryValue : value;
		if (newEditorQueryValue !== defaultEditorQueryValue) {
			newQueryOptions[editorQueryName] = newEditorQueryValue;
		}
		if (newPluginsQueryValue !== defaultPluginsQueryValue) {
			newQueryOptions[pluginsQueryName] = newPluginsQueryValue;
		}

		let search = Object.keys(newQueryOptions)
			.map((key) => `${key}=${newQueryOptions[key]}`)
			.join('&amp;');

		if (search.length > 0) {
			search = '?' + search;
		}
		return toHREF(search);
	}

	/**
	 * @param {string} search
	 */
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

	function loadScript(path, callback) {
		const script = document.createElement('script');
		script.onload = callback;
		script.async = true;
		script.type = 'text/javascript';
		script.src = path;
		document.head.appendChild(script);
	}
})();
