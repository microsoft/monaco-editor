const text = `function hello() {
	alert('Hello world!');
}`;

// Hover on each property to see its docs!
monaco.editor.create(document.getElementById("container"), {
	value: text,
	language: "javascript",
	automaticLayout: true,
});
