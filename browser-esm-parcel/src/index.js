
import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js';

self.MonacoEnvironment = {
	getWorkerUrl: function (moduleId, label) {
		if (label === 'json') {
			return './json.worker.js';
		}
		if (label === 'css') {
			return './css.worker.js';
		}
		if (label === 'html') {
			return './html.worker.js';
		}
		if (label === 'typescript' || label === 'javascript') {
			return './ts.worker.js';
		}
		return './editor.worker.js';
	},
};

monaco.editor.create(document.getElementById('container'), {
	value: [
		'function x() {',
		'\tconsole.log("Hello world!");',
		'}'
	].join('\n'),
	language: 'javascript'
});
