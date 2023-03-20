const value = `
const f = (a, b) => a + b;

const result = f(2, 5);
`;

const editor = monaco.editor.create(document.getElementById("container"), {
	value,
	language: "javascript",
});

monaco.languages.registerInlayHintsProvider("javascript", {
	provideInlayHints(model, range, token) {
		return {
			hints: [
				{
					kind: monaco.languages.InlayHintKind.Type,
					position: { column: 13, lineNumber: 4 },
					label: `: Number`,
				},
				{
					kind: monaco.languages.InlayHintKind.Type,
					position: { column: 13, lineNumber: 2 },
					label: `: Number`,
				},
				{
					kind: monaco.languages.InlayHintKind.Type,
					position: { column: 16, lineNumber: 2 },
					label: `: Number`,
					whitespaceBefore: true, // see difference between a and b parameter
				},
				{
					kind: monaco.languages.InlayHintKind.Parameter,
					position: { column: 18, lineNumber: 4 },
					label: `a:`,
				},
				{
					kind: monaco.languages.InlayHintKind.Parameter,
					position: { column: 21, lineNumber: 4 },
					label: `b:`,
					whitespaceAfter: true, // similar to whitespaceBefore
				},
			],
			dispose: () => {},
		};
	},
});
