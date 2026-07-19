// Explanation:
// First, we need to know the ID of the command.
// If you know the default key bindings, you can get the ID by following these steps.
// 1. open Visual Studio Code and navigate to "Preferences => Keyboard Shortcuts".
// 2. enter a shortcut key (e.g. Tab, Escape, Enter, etc.) in the search text input at the top.
// 3. Once the commands are filtered, you will need to find which command is the target command by ID and name.

// In this sample, the cursor can be moved with the Ctrl key and HJKL.
// To move the cursor to the left, we usually use the LeftArrow key, so we type `LeftArrow` in the search form.
// You will see a number of commands, but you will find the most likely one, `cursorLeft`.
// Note that the `When` column says `textInputFocus`.
// In a similar fashion, you will find the commands `cursorDown`, `cursorUp`, and `cursorRight`.

monaco.editor.addKeybindingRules([
	{
		keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyH,
		command: "cursorLeft", // ID
		when: "textInputFocus", // When
	},
	{
		keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ,
		command: "cursorDown",
		when: "textInputFocus",
	},
	{
		keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK,
		command: "cursorUp",
		when: "textInputFocus",
	},
	{
		keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyL,
		command: "cursorRight",
		when: "textInputFocus",
	},
]);

monaco.editor.create(document.getElementById("container"), {
	value: [
		"",
		"class Example {",
		"\tprivate m:number;",
		"",
		"\tpublic met(): string {",
		'\t\treturn "Hello world!";',
		"\t}",
		"}",
	].join("\n"),
	language: "typescript",
});
