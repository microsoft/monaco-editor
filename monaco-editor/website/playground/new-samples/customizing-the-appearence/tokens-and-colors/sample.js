
// Theme matching (i.e. applying a style to a token) happens in JavaScript.
// We must therefore register the theme rules in JavaScript.

// A custom theme must name its base theme (i.e. 'vs', 'vs-dark' or 'hc-black')
// It can then choose to inherit the rules from the base theme or not
// A rule token matching is prefix based: e.g.
//  - string will match a token with type: string, string.double.js or string.html
//  - string.double will match a token with type string.double but will not match string or string.html

// !!! Tokens can be inspected using F1 > Developer: Inspect Tokens !!!

monaco.editor.defineTheme('myCustomTheme', {
	base: 'vs', // can also be vs-dark or hc-black
	inherit: true, // can also be false to completely replace the builtin rules
	rules: [
		{ token: 'comment', foreground: 'ffa500', fontStyle: 'italic underline' },
		{ token: 'comment.js', foreground: '008800', fontStyle: 'bold' },
		{ token: 'comment.css', foreground: '0000ff' } // will inherit fontStyle from `comment` above
	]
});

monaco.editor.create(document.getElementById("container"), {
	value: getCode(),
	language: "text/html",
	theme: "myCustomTheme"
});

function getCode() {
	return "<html><!-- // !!! Tokens can be inspected using F1 > Developer: Inspect Tokens !!! -->\n<head>\n	<!-- HTML comment -->\n	<style type=\"text/css\">\n		/* CSS comment */\n	</style>\n	<script type=\"javascript\">\n		// JavaScript comment\n	</"+"script>\n</head>\n<body></body>\n</html>";
}
