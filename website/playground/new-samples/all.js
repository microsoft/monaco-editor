(function() {

var PLAY_SAMPLES = [
	{
		chapter: "Creating the editor",
		name: "Hello world!",
		id: "creating-the-editor-hello-world",
		path: "creating-the-editor/hello-world"
	},
	{
		chapter: "Creating the editor",
		name: "Editor basic options",
		id: "creating-the-editor-editor-basic-options",
		path: "creating-the-editor/editor-basic-options"
	},
	{
		chapter: "Creating the editor",
		name: "Hard wrapping",
		id: "creating-the-editor-hard-wrapping",
		path: "creating-the-editor/hard-wrapping"
	},
	{
		chapter: "Creating the editor",
		name: "Syntax highlighting for HTML elements",
		id: "creating-the-editor-syntax-highlighting-for-html-elements",
		path: "creating-the-editor/syntax-highlighting-for-html-elements"
	},
	{
		chapter: "Interacting with the editor",
		name: "Adding a command to an editor instance",
		id: "interacting-with-the-editor-adding-a-command-to-an-editor-instance",
		path: "interacting-with-the-editor/adding-a-command-to-an-editor-instance"
	},
	{
		chapter: "Interacting with the editor",
		name: "Adding an action to an editor instance",
		id: "interacting-with-the-editor-adding-an-action-to-an-editor-instance",
		path: "interacting-with-the-editor/adding-an-action-to-an-editor-instance"
	},
	{
		chapter: "Interacting with the editor",
		name: "Revealing a position",
		id: "interacting-with-the-editor-revealing-a-position",
		path: "interacting-with-the-editor/revealing-a-position"
	},
	{
		chapter: "Interacting with the editor",
		name: "Rendering glyphs in the margin",
		id: "interacting-with-the-editor-rendering-glyphs-in-the-margin",
		path: "interacting-with-the-editor/rendering-glyphs-in-the-margin"
	},
	{
		chapter: "Interacting with the editor",
		name: "Line and Inline decorations",
		id: "interacting-with-the-editor-line-and-inline-decorations",
		path: "interacting-with-the-editor/line-and-inline-decorations"
	},
	{
		chapter: "Interacting with the editor",
		name: "Customizing the line numbers",
		id: "interacting-with-the-editor-customizing-the-line-numbers",
		path: "interacting-with-the-editor/customizing-the-line-numbers"
	},
	{
		chapter: "Interacting with the editor",
		name: "Listening to mouse events",
		id: "interacting-with-the-editor-listening-to-mouse-events",
		path: "interacting-with-the-editor/listening-to-mouse-events"
	},
	{
		chapter: "Interacting with the editor",
		name: "Listening to key events",
		id: "interacting-with-the-editor-listening-to-key-events",
		path: "interacting-with-the-editor/listening-to-key-events"
	},
	{
		chapter: "Customizing the appearence",
		name: "Exposed colors",
		id: "customizing-the-appearence-exposed-colors",
		path: "customizing-the-appearence/exposed-colors"
	},
	{
		chapter: "Customizing the appearence",
		name: "Scrollbars",
		id: "customizing-the-appearence-scrollbars",
		path: "customizing-the-appearence/scrollbars"
	},
	{
		chapter: "Customizing the appearence",
		name: "Tokens and colors",
		id: "customizing-the-appearence-tokens-and-colors",
		path: "customizing-the-appearence/tokens-and-colors"
	},
	{
		chapter: "Creating the DiffEditor",
		name: "Hello diff world!",
		id: "creating-the-diffeditor-hello-diff-world",
		path: "creating-the-diffeditor/hello-diff-world"
	},
	{
		chapter: "Creating the DiffEditor",
		name: "Multi-line example",
		id: "creating-the-diffeditor-multi-line-example",
		path: "creating-the-diffeditor/multi-line-example"
	},
	{
		chapter: "Creating the DiffEditor",
		name: "Inline Diff Example",
		id: "creating-the-diffeditor-inline-diff-example",
		path: "creating-the-diffeditor/inline-diff-example"
	},
	{
		chapter: "Creating the DiffEditor",
		name: "Navigating a Diff",
		id: "creating-the-diffeditor-navigating-a-diff",
		path: "creating-the-diffeditor/navigating-a-diff"
	},
	{
		chapter: "Extending Language Services",
		name: "Custom languages",
		id: "extending-language-services-custom-languages",
		path: "extending-language-services/custom-languages"
	},
	{
		chapter: "Extending Language Services",
		name: "Completion provider example",
		id: "extending-language-services-completion-provider-example",
		path: "extending-language-services/completion-provider-example"
	},
	{
		chapter: "Extending Language Services",
		name: "Codelens provider example",
		id: "extending-language-services-codelens-provider-example",
		path: "extending-language-services/codelens-provider-example"
	},
	{
		chapter: "Extending Language Services",
		name: "Color provider example",
		id: "extending-language-services-color-provider-example",
		path: "extending-language-services/color-provider-example"
	},
	{
		chapter: "Extending Language Services",
		name: "Symbols provider example",
		id: "extending-language-services-symbols-provider-example",
		path: "extending-language-services/symbols-provider-example"
	},
	{
		chapter: "Extending Language Services",
		name: "Folding provider example",
		id: "extending-language-services-folding-provider-example",
		path: "extending-language-services/folding-provider-example"
	},
	{
		chapter: "Extending Language Services",
		name: "Hover provider example",
		id: "extending-language-services-hover-provider-example",
		path: "extending-language-services/hover-provider-example"
	},
	{
		chapter: "Extending Language Services",
		name: "Configure JavaScript defaults",
		id: "extending-language-services-configure-javascript-defaults",
		path: "extending-language-services/configure-javascript-defaults"
	},
	{
		chapter: "Extending Language Services",
		name: "Configure JSON defaults",
		id: "extending-language-services-configure-json-defaults",
		path: "extending-language-services/configure-json-defaults"
	}
];

if (typeof exports !== 'undefined') {
	exports.PLAY_SAMPLES = PLAY_SAMPLES
} else {
	self.PLAY_SAMPLES = PLAY_SAMPLES;
}

})();
