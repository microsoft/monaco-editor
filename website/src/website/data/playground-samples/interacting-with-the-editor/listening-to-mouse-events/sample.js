var jsCode = [
	'"use strict";',
	"function Person(age) {",
	"	if (age) {",
	"		this.age = age;",
	"	}",
	"}",
	"Person.prototype.getAge = function () {",
	"	return this.age;",
	"};",
].join("\n");

var editor = monaco.editor.create(document.getElementById("container"), {
	value: jsCode,
	language: "javascript",
	glyphMargin: true,
	contextmenu: false,
});

var decorations = editor.createDecorationsCollection([
	{
		range: new monaco.Range(3, 1, 3, 1),
		options: {
			isWholeLine: true,
			className: "myContentClass",
			glyphMarginClassName: "myGlyphMarginClass",
		},
	},
]);

// Add a zone to make hit testing more interesting
var viewZoneId = null;
editor.changeViewZones(function (changeAccessor) {
	var domNode = document.createElement("div");
	domNode.style.background = "lightgreen";
	viewZoneId = changeAccessor.addZone({
		afterLineNumber: 3,
		heightInLines: 3,
		domNode: domNode,
	});
});

// Add a content widget (scrolls inline with text)
var contentWidget = {
	domNode: (function () {
		var domNode = document.createElement("div");
		domNode.innerHTML = "My content widget";
		domNode.style.background = "grey";
		return domNode;
	})(),
	getId: function () {
		return "my.content.widget";
	},
	getDomNode: function () {
		return this.domNode;
	},
	getPosition: function () {
		return {
			position: {
				lineNumber: 7,
				column: 8,
			},
			preference: [
				monaco.editor.ContentWidgetPositionPreference.ABOVE,
				monaco.editor.ContentWidgetPositionPreference.BELOW,
			],
		};
	},
};
editor.addContentWidget(contentWidget);

// Add an overlay widget
var overlayWidget = {
	domNode: (function () {
		var domNode = document.createElement("div");
		domNode.innerHTML = "My overlay widget";
		domNode.style.background = "grey";
		domNode.style.right = "30px";
		domNode.style.top = "50px";
		return domNode;
	})(),
	getId: function () {
		return "my.overlay.widget";
	},
	getDomNode: function () {
		return this.domNode;
	},
	getPosition: function () {
		return null;
	},
};
editor.addOverlayWidget(overlayWidget);

var output = document.getElementById("output");
function showEvent(str) {
	while (output.childNodes.length > 6) {
		output.removeChild(output.firstChild.nextSibling.nextSibling);
	}
	output.appendChild(document.createTextNode(str));
	output.appendChild(document.createElement("br"));
}

editor.onMouseMove(function (e) {
	showEvent("mousemove - " + e.target.toString());
});
editor.onMouseDown(function (e) {
	showEvent("mousedown - " + e.target.toString());
});
editor.onContextMenu(function (e) {
	showEvent("contextmenu - " + e.target.toString());
});
editor.onMouseLeave(function (e) {
	showEvent("mouseleave");
});
