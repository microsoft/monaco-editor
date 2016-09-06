// This example shows how to integrate the editor with a certain theme and then customize the token colors of that theme.
var htmlCode = "<html>\n<head>\n	<!-- HTML comment -->\n	<style type=\"text/css\">\n		/* CSS comment */\n	</style>\n	<script type=\"javascript\">\n		// JavaScript comment\n	</"+"script>\n</head>\n<body></body>\n</html>";

monaco.editor.create(document.getElementById("container"), {
	value: htmlCode,
	language: "text/html",
	theme: "vs"
});
