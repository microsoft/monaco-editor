const value = /* set from `myEditor.getModel()`: */ `function hello() {
	alert('Hello world!');
}`;

// Hover on each property to see its docs!
const myEditor = monaco.editor.create(document.getElementById("container"), {
	value,
	language: "javascript",
	automaticLayout: true,
});
