import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

(function () {
	// create div to avoid needing a HtmlWebpackPlugin template
	const div = document.createElement('div');
	div.id = 'root';
	div.style = 'width:800px; height:600px; border:1px solid #ccc;';

	document.body.appendChild(div);
})();

monaco.editor.create(document.getElementById('root'), {
	value: `const foo = () => 0;`,
	language: 'javascript',
	theme: 'vs-dark'
});
