(function () {
	var METADATA = {
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
				contrib: 'vs/language/typescript/monaco.contribution',
				modulePrefix: 'vs/language/typescript',
				rootPath: './monaco-typescript',
				paths: {
					// use ./ to indicate it is relative to the `rootPath`
					dev: './release/dev',
					min: './release/min',
					esm: './release/esm'
				}
			},
			{
				name: 'monaco-css',
				contrib: 'vs/language/css/monaco.contribution',
				modulePrefix: 'vs/language/css',
				rootPath: './monaco-css',
				paths: {
					// use ./ to indicate it is relative to the `rootPath`
					dev: './release/dev',
					min: './release/min',
					esm: './release/esm'
				}
			},
			{
				name: 'monaco-json',
				contrib: 'vs/language/json/monaco.contribution',
				modulePrefix: 'vs/language/json',
				rootPath: './monaco-json',
				paths: {
					// use ./ to indicate it is relative to the `rootPath`
					dev: './release/dev',
					min: './release/min',
					esm: './release/esm'
				}
			},
			{
				name: 'monaco-html',
				contrib: 'vs/language/html/monaco.contribution',
				modulePrefix: 'vs/language/html',
				rootPath: './monaco-html',
				paths: {
					// use ./ to indicate it is relative to the `rootPath`
					dev: './release/dev',
					min: './release/min',
					esm: './release/esm'
				}
			},
			{
				name: 'monaco-languages',
				contrib: 'vs/basic-languages/monaco.contribution',
				modulePrefix: 'vs/basic-languages',
				rootPath: './monaco-languages',
				paths: {
					// use ./ to indicate it is relative to the `rootPath`
					dev: './release/dev',
					min: './release/min',
					esm: './release/esm'
				}
			}
		]
	};

	if (typeof exports !== 'undefined') {
		exports.METADATA = METADATA;
	} else {
		self.METADATA = METADATA;
	}
})();
