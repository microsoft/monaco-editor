var jsCodeArr = [
	'// ------------------------------',
	'// ------------------------------',
	'function Person(age) {',
	'	if (age) {',
	'		this.age = age;',
	'	}',
	'}',
	'Person.prototype.getAge = function () {',
	'	return this.age;',
	'};',
	'',
	''
];

jsCodeArr = jsCodeArr.concat(jsCodeArr.slice(0));
jsCodeArr = jsCodeArr.concat(jsCodeArr.slice(0));
jsCodeArr = jsCodeArr.concat(jsCodeArr.slice(0));

jsCodeArr[49] += 'And this is some long line. And this is some long line. And this is some long line. And this is some long line. And this is some long line. ';

var editor = monaco.editor.create(document.getElementById("container"), {
	value: jsCodeArr.join('\n'),
	language: "javascript"
});

editor.revealPositionInCenter({ lineNumber: 50, column: 120 });
// Also see:
// - editor.revealLine
// - editor.revealLineInCenter
// - editor.revealLineInCenterIfOutsideViewport
// - editor.revealLines
// - editor.revealLinesInCenter
// - editor.revealLinesInCenterIfOutsideViewport
// - editor.revealPosition
// - editor.revealPositionInCenter
// - editor.revealPositionInCenterIfOutsideViewport
// - editor.revealRange
// - editor.revealRangeInCenter
// - editor.revealRangeInCenterIfOutsideViewport
