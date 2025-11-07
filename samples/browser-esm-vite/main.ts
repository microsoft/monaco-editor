import './style.css';
import * as monaco from '../../src/editor/editor.main';

monaco.languages.register({ id: 'typescript' });

const tm = monaco.editor.createModel(`class Test {}`, 'typescript',
	monaco.Uri.parse('file:///main.ts'));

const editor = monaco.editor.create(document.getElementById('root')!, {
	model: tm,
	language: 'typescript',
	theme: 'vs-dark',
});
