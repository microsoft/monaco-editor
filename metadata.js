(function() {

	var METADATA = {
		CORE: {
			path: 'node_modules/monaco-editor-core/min/vs',
			srcPath: '/vscode/out/vs'
			// srcPath: '/vscode/out-monaco-editor-core/min/vs'
		},
		PLUGINS: [{
			name: 'monaco-typescript',
			contrib: 'vs/language/typescript/src/monaco.contribution',
			modulePrefix: 'vs/language/typescript',
			path: 'node_modules/monaco-typescript/release',
			srcPath: '/monaco-typescript/out'
		}, {
			name: 'monaco-css',
			contrib: 'vs/language/css/monaco.contribution',
			modulePrefix: 'vs/language/css',
			path: 'node_modules/monaco-css/release/min',
			srcPath: '/monaco-css/release/dev'
		},{
			name: 'monaco-languages',
			contrib: 'vs/basic-languages/src/monaco.contribution',
			modulePrefix: 'vs/basic-languages',
			path: 'node_modules/monaco-languages/release',
			srcPath: '/monaco-languages/out'
		}]
	}

	if (typeof exports !== 'undefined') {
		exports.METADATA = METADATA
	} else {
		self.METADATA = METADATA;
	}

})();