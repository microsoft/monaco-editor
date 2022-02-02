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
				contrib: 'vs/language/typescript/monaco.contribution',
				modulePrefix: 'vs/language/typescript',
				rootPath: './out/release/language/typescript',
				paths: {
					// use ./ to indicate it is relative to the `rootPath`
					src: './../../../amd/language/typescript',
					dev: './dev',
					min: './min',
					esm: './esm'
				}
			},
			{
				name: 'monaco-css',
				contrib: 'vs/language/css/monaco.contribution',
				modulePrefix: 'vs/language/css',
				rootPath: './out/release/language/css',
				paths: {
					// use ./ to indicate it is relative to the `rootPath`
					src: './../../../amd/language/css',
					dev: './dev',
					min: './min',
					esm: './esm'
				}
			},
			{
				name: 'monaco-json',
				contrib: 'vs/language/json/monaco.contribution',
				modulePrefix: 'vs/language/json',
				rootPath: './out/release/language/json',
				paths: {
					// use ./ to indicate it is relative to the `rootPath`
					src: './../../../amd/language/json',
					dev: './dev',
					min: './min',
					esm: './esm'
				}
			},
			{
				name: 'monaco-html',
				contrib: 'vs/language/html/monaco.contribution',
				modulePrefix: 'vs/language/html',
				rootPath: './out/release/language/html',
				paths: {
					// use ./ to indicate it is relative to the `rootPath`
					src: './../../../amd/language/html',
					dev: './dev',
					min: './min',
					esm: './esm'
				}
			},
			{
				name: 'monaco-languages',
				contrib: 'vs/basic-languages/monaco.contribution',
				modulePrefix: 'vs/basic-languages',
				rootPath: './out/release/basic-languages',
				paths: {
					// use ./ to indicate it is relative to the `rootPath`
					src: './../../amd/basic-languages',
					dev: './dev',
					min: './min',
					esm: './esm'
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
