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
				rootPath: './out/release',
				paths: {
					// use ./ to indicate it is relative to the `rootPath`
					src: './../amd/language/typescript',
					dev: './dev/vs/language/typescript',
					min: './min/vs/language/typescript',
					esm: './esm/vs/language/typescript'
				}
			},
			{
				name: 'monaco-css',
				contrib: 'vs/language/css/monaco.contribution',
				modulePrefix: 'vs/language/css',
				rootPath: './out/release',
				paths: {
					// use ./ to indicate it is relative to the `rootPath`
					src: './../amd/language/css',
					dev: './dev/vs/language/css',
					min: './min/vs/language/css',
					esm: './esm/vs/language/css'
				}
			},
			{
				name: 'monaco-json',
				contrib: 'vs/language/json/monaco.contribution',
				modulePrefix: 'vs/language/json',
				rootPath: './out/release',
				paths: {
					// use ./ to indicate it is relative to the `rootPath`
					src: './../amd/language/json',
					dev: './dev/vs/language/json',
					min: './min/vs/language/json',
					esm: './esm/vs/language/json'
				}
			},
			{
				name: 'monaco-html',
				contrib: 'vs/language/html/monaco.contribution',
				modulePrefix: 'vs/language/html',
				rootPath: './out/release',
				paths: {
					// use ./ to indicate it is relative to the `rootPath`
					src: './../amd/language/html',
					dev: './dev/vs/language/html',
					min: './min/vs/language/html',
					esm: './esm/vs/language/html'
				}
			},
			{
				name: 'monaco-languages',
				contrib: 'vs/basic-languages/monaco.contribution',
				modulePrefix: 'vs/basic-languages',
				rootPath: './out/release',
				paths: {
					// use ./ to indicate it is relative to the `rootPath`
					src: './../amd/basic-languages',
					dev: './dev/vs/basic-languages',
					min: './min/vs/basic-languages',
					esm: './esm/vs/basic-languages'
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
