var originalModel = monaco.editor.createModel("heLLo world!", "text/plain");
var modifiedModel = monaco.editor.createModel("hello orlando!", "text/plain");

var diffEditor = monaco.editor.createDiffEditor(document.getElementById("container"));
diffEditor.setModel({
	original: originalModel,
	modified: modifiedModel
});
