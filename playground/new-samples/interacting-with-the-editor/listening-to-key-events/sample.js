var editor = monaco.editor.create(document.getElementById('container'), {
	value: "function hello() {\n\talert('Hello world!');\n}",
	language: 'javascript'
});

var myBinding = editor.addCommand(monaco.KeyCode.F9, function () {
	alert('F9 pressed!');
});

// You can't dispose `addCommand`
// If you need to dispose it you might use `addAction` or `registerCommand`
