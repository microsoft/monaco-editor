/// <reference path="../node_modules/monaco-editor-core/monaco.d.ts" />
define([], function() {

var actions = (function() {
	"use strict";

	return [
		{
			name: 'Undo',
			run: function (editor) {
				editor.trigger('keyboard', monaco.editor.Handler.Undo);
			}
		},
		{
			name: 'type & suggest',
			run: function (editor) {
				editor.setPosition({
					lineNumber: 1,
					column: 1
				});
				var firstChar = editor.getModel().getLineContent(1).charAt(0);
				editor.trigger('keyboard', monaco.editor.Handler.CursorEnd);
				editor.trigger('keyboard', monaco.editor.Handler.Type, {
					text: '\n' + firstChar
				});
				editor.focus();
				editor.trigger('test', 'editor.action.triggerSuggest');
			}
		},
		{
			name: 'links',
			run: function (editor) {
				editor.setPosition({
					lineNumber: 1,
					column: 1
				});
				var commentsSupport = editor.getModel().getMode().commentsSupport;
				var text = 'http://www.test.com';
				if (commentsSupport) {
					var commentsConfig = commentsSupport.getCommentsConfiguration();
					if (commentsConfig && commentsConfig.lineCommentTokens) {
						text = commentsConfig.lineCommentTokens[0] + ' ' + text;
					} else if (commentsConfig && commentsConfig.blockCommentStartToken) {
						text = commentsConfig.blockCommentStartToken + ' ' + text + ' ' + commentsConfig.blockCommentEndToken;
					}
				}
				editor.trigger('keyboard', monaco.editor.Handler.Type, {
					text: text + '\n'
				});
			}
		},
		{
			name: 'multicursor',
			run: function (editor) {
				editor.setPosition({
					lineNumber: 1,
					column: 1
				});
				editor.trigger('keyboard', monaco.editor.Handler.AddCursorDown);
				editor.trigger('keyboard', monaco.editor.Handler.AddCursorDown);
				editor.trigger('keyboard', monaco.editor.Handler.AddCursorDown);
				editor.trigger('keyboard', monaco.editor.Handler.AddCursorDown);
				editor.trigger('keyboard', monaco.editor.Handler.AddCursorDown);
				editor.trigger('keyboard', monaco.editor.Handler.Type, {
					text: 'some text - '
				});
			}
		}
	];
})();

var panelContainer = document.getElementById('control');
var editorContainer = document.getElementById('editor');
var editors = {}, models = {};

function onError(err) {
	console.error(err);
	alert('error!!');
}

function getAllModes() {
	var result = monaco.languages.getLanguages().map(function(language) { return language.id; });
	result.sort();
	return result;
}

function createEditor(container, mode) {
	editors[mode] = monaco.editor.create(container, {
		value: mode
	});
	xhr('samples/sample.' + mode + '.txt').then(function(response) {
		var value = mode + '\n' + response.responseText;
		var model = monaco.editor.createModel(value, mode);
		editors[mode].setModel(model);
	});
}

function createEditors(modes) {
	for (var i = 0; i < modes.length; i++) {
		var container = document.createElement('div');
		container.style.width = '300px';
		container.style.cssFloat = 'left';
		container.style.height = '200px';
		container.style.border = '1px solid #ccc';
		container.style.background = 'red';
		container.setAttribute('data-mime', modes[i]);
		editorContainer.appendChild(container);
		createEditor(container, modes[i]);
	}

	var clearer = document.createElement('div');
	clearer.style.clear = 'both';
	editorContainer.appendChild(clearer);
}

function executeAction(action) {
	for (var mime in editors) {
		if (editors.hasOwnProperty(mime)) {
			action(editors[mime]);
		}
	}
}

function createActions(actions) {
	for (var i = 0; i < actions.length; i++) {
		var btn = document.createElement('button');
		btn.appendChild(document.createTextNode('<<' + actions[i].name + '>>'));
		btn.onclick = executeAction.bind(this, actions[i].run);
		panelContainer.appendChild(btn);
	}
}

createEditors(getAllModes());
createActions(actions);

function xhr(url) {
	var req = null;
	return new monaco.Promise(function(c,e,p) {
		req = new XMLHttpRequest();
		req.onreadystatechange = function () {
			if (req._canceled) { return; }

			if (req.readyState === 4) {
				if ((req.status >= 200 && req.status < 300) || req.status === 1223) {
					c(req);
				} else {
					e(req);
				}
				req.onreadystatechange = function () { };
			} else {
				p(req);
			}
		};

		req.open("GET", url, true );
		req.responseType = "";

		req.send(null);
	}, function () {
		req._canceled = true;
		req.abort();
	});
}

});