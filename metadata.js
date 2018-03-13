(function () {

	var METADATA = {
		CORE: {
			paths: {
				src: '/vscode/out/vs',
				'npm/dev': 'node_modules/monaco-editor-core/dev/vs',
				'npm/min': 'node_modules/monaco-editor-core/min/vs',
				built: '/vscode/out-monaco-editor-core/min/vs',
				releaseDev: 'release/dev/vs',
				releaseMin: 'release/min/vs',
			}
		},
		PLUGINS: [
			{
				name: 'monaco-typescript',
				contrib: 'vs/language/typescript/monaco.contribution',
				modulePrefix: 'vs/language/typescript',
				thirdPartyNotices: 'node_modules/monaco-typescript/ThirdPartyNotices.txt',
				paths: {
					src: '/monaco-typescript/release/dev',
					'npm/dev': 'node_modules/monaco-typescript/release/dev',
					'npm/min': 'node_modules/monaco-typescript/release/min',
					esm: 'node_modules/monaco-typescript/release/esm',
				}
			},
			{
				name: 'monaco-css',
				contrib: 'vs/language/css/monaco.contribution',
				modulePrefix: 'vs/language/css',
				paths: {
					src: '/monaco-css/release/dev',
					'npm/dev': 'node_modules/monaco-css/release/dev',
					'npm/min': 'node_modules/monaco-css/release/min',
					esm: 'node_modules/monaco-css/release/esm',
				}
			},
			{
				name: 'monaco-json',
				contrib: 'vs/language/json/monaco.contribution',
				modulePrefix: 'vs/language/json',
				paths: {
					src: '/monaco-json/release/dev',
					'npm/dev': 'node_modules/monaco-json/release/dev',
					'npm/min': 'node_modules/monaco-json/release/min',
					esm: 'node_modules/monaco-json/release/esm',
				}
			},
			{
				name: 'monaco-html',
				contrib: 'vs/language/html/monaco.contribution',
				modulePrefix: 'vs/language/html',
				thirdPartyNotices: 'node_modules/monaco-html/ThirdPartyNotices.txt',
				paths: {
					src: '/monaco-html/release/dev',
					'npm/dev': 'node_modules/monaco-html/release/dev',
					'npm/min': 'node_modules/monaco-html/release/min',
					esm: 'node_modules/monaco-html/release/esm',
				}
			},
			{
				name: 'monaco-languages',
				contrib: 'vs/basic-languages/monaco.contribution',
				modulePrefix: 'vs/basic-languages',
				thirdPartyNotices: 'node_modules/monaco-languages/ThirdPartyNotices.txt',
				paths: {
					src: '/monaco-languages/release/dev',
					'npm/dev': 'node_modules/monaco-languages/release/dev',
					'npm/min': 'node_modules/monaco-languages/release/min',
					esm: 'node_modules/monaco-languages/release/esm',
				}
			}
		]
	}

	if (typeof exports !== 'undefined') {
		exports.METADATA = METADATA
	} else {
		self.METADATA = METADATA;
	}

})();
