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

	// Control if the action should show up in the context menu and where.
	// Built-in groups:
	//   1_goto/* => e.g. 1_goto/1_peekDefinition
	//   2_change/* => e.g. 2_change/2_format
	//   3_edit/* => e.g. 3_edit/1_copy
	//   4_tools/* => e.g. 4_tools/1_commands
	// You can also create your own group.
	// Defaults to null (don't show in context menu).
	contextMenuGroupId: '2_change/2_bla',

	// Method that will be executed when the action is triggered.
	// @param editor The editor instance is passed in as a convinience
	run: function(ed) {
		alert("i'm running => " + ed.getPosition());
		return null;
	},

	// Optional enablement conditions. All members are optional
	enablement: {
		// The action is enabled only if text in the editor is focused (e.g. blinking cursor).
		// Warning: This condition will be disabled if the action is marked to be displayed in the context menu
		// Defaults to false.
		textFocus: true,

		// The action is enabled only if the editor or its widgets have focus (e.g. focus is in find widget).
		// Defaults to false.
		//widgetFocus: true,

		// The action is enabled only if the editor is not in read only mode.
		// Defaults to false.
		//writeableEditor: true,

		// The action is enabled only if the cursor position is over a word (i.e. not whitespace).
		// Defaults to false.
		wordAtPosition: true,

		// The action is enabled only if the cursor position is over tokens of a certain kind.
		// Defaults to no tokens required.
		tokensAtPosition: ['identifier', '', 'keyword'],
	}
});
