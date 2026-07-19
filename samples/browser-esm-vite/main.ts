import './style.css';
import * as monaco from '../../src/editor';

// import 'monaco-editor/nls/lang/de';

// import 'monaco-editor/languages/definitions/register.all';
// import 'monaco-editor/features/register.all';
//import 'monaco-editor/languages/definitions/register.all';
//import 'monaco-editor/languages/features/register.all';
//import 'monaco-editor';

//import * as monaco from 'monaco-editor/editor';

console.log('monaco', monaco);

monaco.languages.register({ id: 'typescript' });

const tm = monaco.editor.createModel(`class Test {}`, 'typescript',
	monaco.Uri.parse('file:///main.ts'));

const editor = monaco.editor.create(document.getElementById('root')!, {
	model: tm,
	language: 'typescript',
	theme: 'vs-dark',
});
