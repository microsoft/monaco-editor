var jsCode = [
	'"use strict";',
	'function Person(age) {',
	'	if (age) {',
	'		this.age = age;',
	'	}',
	'}',
	'Person.prototype.getAge = function () {',
	'	return this.age;',
	'};'
].join('\n');

var editor = monaco.editor.create(document.getElementById("container"), {
	value: jsCode,
	language: "javascript",
	glyphMargin: true
});

var decorations = editor.deltaDecorations([], [
	{
		range: new monaco.Range(3,1,3,1),
		options: {
			isWholeLine: true,
			className: 'myContentClass',
			glyphMarginClassName: 'myGlyphMarginClass'
		}
	}
]);

// You can now use `decorations` to change or remove the decoration
