function validate(model) {
	const markers = [];
	// lines start at 1
	for (let i = 1; i < model.getLineCount() + 1; i++) {
		const range = {
			startLineNumber: i,
			startColumn: 1,
			endLineNumber: i,
			endColumn: model.getLineLength(i) + 1,
		};
		const content = model.getValueInRange(range).trim();
		const number = Number(content);
		if (Number.isNaN(number)) {
			markers.push({
				message: "not a number",
				severity: monaco.MarkerSeverity.Error,
				startLineNumber: range.startLineNumber,
				startColumn: range.startColumn,
				endLineNumber: range.endLineNumber,
				endColumn: range.endColumn,
			});
		} else if (!Number.isInteger(number)) {
			markers.push({
				message: "not an integer",
				severity: monaco.MarkerSeverity.Warning,
				startLineNumber: range.startLineNumber,
				startColumn: range.startColumn,
				endLineNumber: range.endLineNumber,
				endColumn: range.endColumn,
			});
		}
	}
	monaco.editor.setModelMarkers(model, "owner", markers);
}

const value = `12345
abcd
234.56
12345
abcd
234.56`;
const uri = monaco.Uri.parse("inmemory://test");
const model = monaco.editor.createModel(value, "demoLanguage", uri);
const editor = monaco.editor.create(document.getElementById("container"), {
	model,
});
validate(model);
model.onDidChangeContent(() => {
	validate(model);
});
