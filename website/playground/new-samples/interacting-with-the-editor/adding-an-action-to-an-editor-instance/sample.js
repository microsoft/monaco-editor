var editor = monaco.editor.create(document.getElementById("container"), {
	value: [
		'',
		'class Example {',
		'\tprivate m:number;',
		'',
		'\tpublic met(): string {',
		'\t\treturn "Hello world!";',
		'\t}',
		'}'
	].join('\n'),
	language: "typescript"
});

// Explanation:
// Try right clicking on an identifier or keyword => the action will be enabled (due to `tokensAtPosition`)
// Try right clicking on a string => the action will be disabled (due to `tokensAtPosition`)
// Try right clicking on whitespace => the action will be disabled (due to `wordAtPosition`)
// Press F1 (Alt-F1 in IE) => the action will appear and run if it is enabled
// Press Ctrl-F10 => the action will run if it is enabled

editor.addAction({
	// An unique identifier of the contributed action.
	id: 'my-unique-id',

	// A label of the action that will be presented to the user.
	label: 'My Label!!!',

	// An optional array of keybindings for the action.
	keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.F10],

	keybindingContext: null,

	contextMenuGroupId: 'navigation',

	contextMenuOrder: 1.5,

	// Method that will be executed when the action is triggered.
	// @param editor The editor instance is passed in as a convinience
	run: function(ed) {
		alert("i'm running => " + ed.getPosition());
		return null;
	}
});
