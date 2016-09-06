var originalModel = monaco.editor.createModel("This line is removed on the right.\njust some text\nabcd\nefgh\nSome more text", "text/plain");
var modifiedModel = monaco.editor.createModel("just some text\nabcz\nzzzzefgh\nSome more text.\nThis line is removed on the left.", "text/plain");

var diffEditor = monaco.editor.createDiffEditor(document.getElementById("container"), {
	// You can optionally disable the resizing
	enableSplitViewResizing: false
});
diffEditor.setModel({
	original: originalModel,
	modified: modifiedModel
});
