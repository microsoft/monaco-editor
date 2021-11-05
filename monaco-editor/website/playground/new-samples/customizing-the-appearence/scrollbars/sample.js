// Remember to check out the CSS too!
var htmlCode = "<html><!--long linelong linelong linelong linelong linelong linelong linelong linelong linelong line-->\n<head>\n	<!-- HTML comment -->\n	<style type=\"text/css\">\n		/* CSS comment */\n	</style>\n	<script type=\"javascript\">\n		// JavaScript comment\n	</"+"script>\n</head>\n<body></body>\n</html>";

monaco.editor.create(document.getElementById("container"), {
	value: htmlCode,
	language: "text/html",
	theme: "vs",
	scrollbar: {
		// Subtle shadows to the left & top. Defaults to true.
		useShadows: false,

		// Render vertical arrows. Defaults to false.
		verticalHasArrows: true,
		// Render horizontal arrows. Defaults to false.
		horizontalHasArrows: true,

		// Render vertical scrollbar.
		// Accepted values: 'auto', 'visible', 'hidden'.
		// Defaults to 'auto'
		vertical: 'visible',
		// Render horizontal scrollbar.
		// Accepted values: 'auto', 'visible', 'hidden'.
		// Defaults to 'auto'
		horizontal: 'visible',

		verticalScrollbarSize: 17,
		horizontalScrollbarSize: 17,
		arrowSize: 30
	}
});
