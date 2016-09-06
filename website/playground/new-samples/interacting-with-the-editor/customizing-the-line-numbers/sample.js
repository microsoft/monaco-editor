function lineNumbersFunc(originalLineNumber) {
	var map = [ 'O', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
	if (originalLineNumber < map.length) {
		return map[originalLineNumber];
	}
	return originalLineNumber;
}

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
	lineNumbers: lineNumbersFunc
});
