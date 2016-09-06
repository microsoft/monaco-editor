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
	language: "javascript"
});

var decorations = editor.deltaDecorations([], [
	{ range: new monaco.Range(3,1,5,1), options: { isWholeLine: true, linesDecorationsClassName: 'myLineDecoration' }},
	{ range: new monaco.Range(7,1,7,24), options: { inlineClassName: 'myInlineDecoration' }},
]);
