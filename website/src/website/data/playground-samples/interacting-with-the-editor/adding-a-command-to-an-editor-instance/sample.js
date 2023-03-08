var jsCode = [
	'"use strict";',
	"function Person(age) {",
	"	if (age) {",
	"		this.age = age;",
	"	}",
	"}",
	"Person.prototype.getAge = function () {",
	"	return this.age;",
	"};",
].join("\n");

var editor = monaco.editor.create(document.getElementById("container"), {
	value: jsCode,
	language: "javascript",
});

var myCondition1 = editor.createContextKey(
	/*key name*/ "myCondition1",
	/*default value*/ false
);
var myCondition2 = editor.createContextKey(
	/*key name*/ "myCondition2",
	/*default value*/ false
);

editor.addCommand(
	monaco.KeyCode.Tab,
	function () {
		// services available in `ctx`
		console.log("my command is executing!");
	},
	"myCondition1 && myCondition2"
);
// @ts-ignore
myCondition1.set(true);

setTimeout(function () {
	console.log("now enabling also myCondition2, try pressing Tab!");
	// @ts-ignore
	myCondition2.set(true);
	// you can use myCondition2.reset() to go back to the default
}, 2000);
