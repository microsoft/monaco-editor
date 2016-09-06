// The editor exposes a set of CSS classes that can be overwritten.
monaco.editor.create(document.getElementById("container"), {
	value: "My to-do list:\n* buy milk\n* buy coffee\n* write awesome code",
	language: "text/plain",
	fontFamily: "Arial",
	fontSize: 20
});
