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
					// use ./ to indicate it is relative to the repository root
					src: './monaco-typescript/release/dev',
					dev: './monaco-typescript/release/dev',
					min: './monaco-typescript/release/min',
					'npm/dev': 'node_modules/monaco-typescript/release/dev',
					'npm/min': 'node_modules/monaco-typescript/release/min',
					esm: './monaco-typescript/release/esm'
				}
			},
			{
				name: 'monaco-css',
				contrib: 'vs/language/css/monaco.contribution',
				modulePrefix: 'vs/language/css',
				rootPath: './monaco-css',
				paths: {
					// use ./ to indicate it is relative to the repository root
					src: './monaco-css/release/dev',
					dev: './monaco-css/release/dev',
					min: './monaco-css/release/min',
					'npm/dev': 'node_modules/monaco-css/release/dev',
					'npm/min': 'node_modules/monaco-css/release/min',
					esm: './monaco-css/release/esm'
				}
			},
			{
				name: 'monaco-json',
				contrib: 'vs/language/json/monaco.contribution',
				modulePrefix: 'vs/language/json',
				rootPath: './monaco-json',
				paths: {
					// use ./ to indicate it is relative to the repository root
					src: './monaco-json/release/dev',
					dev: './monaco-json/release/dev',
					min: './monaco-json/release/min',
					'npm/dev': 'node_modules/monaco-json/release/dev',
					'npm/min': 'node_modules/monaco-json/release/min',
					esm: './monaco-json/release/esm'
				}
			},
			{
				name: 'monaco-html',
				contrib: 'vs/language/html/monaco.contribution',
				modulePrefix: 'vs/language/html',
				rootPath: './monaco-html',
				paths: {
					// use ./ to indicate it is relative to the repository root
					src: './monaco-html/release/dev',
					dev: './monaco-html/release/dev',
					min: './monaco-html/release/min',
					'npm/dev': 'node_modules/monaco-html/release/dev',
					'npm/min': 'node_modules/monaco-html/release/min',
					esm: './monaco-html/release/esm'
				}
			},
			{
				name: 'monaco-languages',
				contrib: 'vs/basic-languages/monaco.contribution',
				modulePrefix: 'vs/basic-languages',
				rootPath: './monaco-languages',
				paths: {
					// use ./ to indicate it is relative to the repository root
					src: './monaco-languages/release/dev',
					dev: './monaco-languages/release/dev',
					min: './monaco-languages/release/min',
					'npm/dev': 'node_modules/monaco-languages/release/dev',
					'npm/min': 'node_modules/monaco-languages/release/min',
					esm: './monaco-languages/release/esm'
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
