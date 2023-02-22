import * as monaco from '../../../out/monaco-editor/esm/vs/editor/editor.main.js';

self.MonacoEnvironment = {
	getWorker: function (moduleId, label) {
		if (label === 'json') {
			return new Worker(
				new URL('../../../out/monaco-editor/esm/vs/language/json/json.worker.js', import.meta.url),
				{ type: 'module' }
			);
		}
		if (label === 'css' || label === 'scss' || label === 'less') {
			return new Worker(
				new URL('../../../out/monaco-editor/esm/vs/language/css/css.worker.js', import.meta.url),
				{ type: 'module' }
			);
		}
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			return new Worker(
				new URL('../../../out/monaco-editor/esm/vs/language/html/html.worker.js', import.meta.url),
				{ type: 'module' }
			);
		}
		if (label === 'typescript' || label === 'javascript') {
			return new Worker(
				new URL(
					'../../../out/monaco-editor/esm/vs/language/typescript/ts.worker.js',
					import.meta.url
				),
				{ type: 'module' }
			);
		}
		return new Worker(
			new URL('../../../out/monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url),
			{
				type: 'module'
			}
		);
	}
};

window.monacoAPI = monaco;
