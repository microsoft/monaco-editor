(function() {

	var METADATA = {
		CORE: {
			paths: {
				npm: 'node_modules/monaco-editor-core/min/vs',
				// npm: 'node_modules/monaco-editor-core/dev/vs',
				dev: '/vscode/out/vs',
				built: '/vscode/out-monaco-editor-core/min/vs',
				releaseDev: 'release/dev/vs',
				releaseMin: 'release/min/vs',
			}
		},
		PLUGINS: [{
			name: 'monaco-typescript',
			contrib: 'vs/language/typescript/monaco.contribution',
			modulePrefix: 'vs/language/typescript',
			thirdPartyNotices: 'node_modules/monaco-typescript/ThirdPartyNotices.txt',
			paths: {
				npm: 'node_modules/monaco-typescript/release',
				dev: '/monaco-typescript/release/dev'
			}
		},{
			name: 'monaco-css',
			contrib: 'vs/language/css/monaco.contribution',
			modulePrefix: 'vs/language/css',
			paths: {
				npm: 'node_modules/monaco-css/release/min',
				dev: '/monaco-css/release/dev'
			}
		},{
			name: 'monaco-json',
			contrib: 'vs/language/json/monaco.contribution',
			modulePrefix: 'vs/language/json',
			paths: {
				npm: 'node_modules/monaco-json/release/min',
				dev: '/monaco-json/release/min'
			}
		},{
			name: 'monaco-html',
			contrib: 'vs/language/html/monaco.contribution',
			modulePrefix: 'vs/language/html',
			thirdPartyNotices: 'node_modules/monaco-html/ThirdPartyNotices.txt',
			paths: {
				npm: 'node_modules/monaco-html/release/min',
				dev: '/monaco-html/release/dev'
			}
		},{
			name: 'monaco-languages',
			contrib: 'vs/basic-languages/monaco.contribution',
			modulePrefix: 'vs/basic-languages',
			thirdPartyNotices: 'node_modules/monaco-languages/ThirdPartyNotices.txt',
			paths: {
				npm: 'node_modules/monaco-languages/release',
				dev: '/monaco-languages/release/dev'
			}
		}]
	}

	if (typeof exports !== 'undefined') {
		exports.METADATA = METADATA
	} else {
		self.METADATA = METADATA;
	}

})();
