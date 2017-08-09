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
// Press F1 (Alt-F1 in IE) => the action will appear and run if it is enabled
// Press Ctrl-F10 => the action will run if it is enabled
// Press Chord Ctrl-K, Ctrl-M => the action will run if it is enabled

editor.addAction({
	// An unique identifier of the contributed action.
	id: 'my-unique-id',

	// A label of the action that will be presented to the user.
	label: 'My Label!!!',

	// An optional array of keybindings for the action.
	keybindings: [
		monaco.KeyMod.CtrlCmd | monaco.KeyCode.F10,
		// chord
		monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_K, monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_M)
	],

	// A precondition for this action.
	precondition: null,

	// A rule to evaluate on top of the precondition in order to dispatch the keybindings.
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
