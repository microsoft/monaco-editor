import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

monaco.editor.create(document.getElementById('container'), {
	value: '',
	language: 'html'
});
