/// <reference path="../../node_modules/monaco-editor/monaco.d.ts" />

"use strict";

/*-----------------------------------------
   General helpers
------------------------------------------*/
function clearInnerText(elem) {
	elem.innerHTML = "";
}

function getInnerText(elem) {
	var text = elem.innerText;
	if (!text) text = elem.textContent;
	return text;
}

function escapeToHTML(text) {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}

function appendInnerText(elem, txt) {
	txt = escapeToHTML(txt);
	elem.innerHTML += txt;
}

function setInnerText(elem, txt) {
	clearInnerText(elem);
	appendInnerText(elem, txt);
}

function getTextFromId(id) {
	var elem = document.getElementById(id);
	if (elem == null) return null;
	return getInnerText(elem);
}

/* -----------------------------------------
   The main loader for the workbench UI
------------------------------------------*/

var outputPane = document.getElementById("monarchConsole");

var isDirty = false;
window.onbeforeunload = function (ev) {
	if (isDirty) {
		return "If you leave this page any unsaved work will be lost.";
	}
};

/* -----------------------------------------
   Sandboxed evaluation of language definitions.
   The definition text is arbitrary code, so it must never run in this page's
   origin. It is evaluated in an iframe with an opaque origin (sandbox without
   allow-same-origin); only the structured-cloned result is sent back.
------------------------------------------*/

function sandboxedEvaluatorMain() {
	window.addEventListener("message", function (e) {
		if (e.source !== window.parent) {
			return;
		}
		var id = e.data && e.data.id;
		try {
			var def = eval("(function(){ " + e.data.source + "; })()"); // CodeQL [SM01632] Runs inside a sandboxed iframe with an opaque origin, isolated from the website. Evaluating the definition is essential to the monarch playground. // CodeQL [SM02688] Runs inside a sandboxed iframe with an opaque origin, isolated from the website.
			window.parent.postMessage({ id: id, def: def }, "*");
		} catch (err) {
			window.parent.postMessage({ id: id, error: String(err) }, "*");
		}
	});
	window.parent.postMessage({ ready: true }, "*");
}

var evaluateDefinition = (function () {
	var iframe = document.createElement("iframe");
	iframe.setAttribute("sandbox", "allow-scripts");
	iframe.style.display = "none";
	iframe.srcdoc =
		"<!DOCTYPE html><script>(" +
		sandboxedEvaluatorMain.toString() +
		")();<" +
		"/script>";

	var ready = false;
	var queue = [];
	var callbacks = {};
	var nextId = 1;

	window.addEventListener("message", function (e) {
		if (!iframe.contentWindow || e.source !== iframe.contentWindow) {
			return;
		}
		var data = e.data || {};
		if (data.ready) {
			ready = true;
			queue.forEach(function (msg) {
				iframe.contentWindow.postMessage(msg, "*");
			});
			queue = [];
			return;
		}
		var callback = callbacks[data.id];
		if (!callback) {
			return;
		}
		delete callbacks[data.id];
		callback(data.error, data.def);
	});

	document.body.appendChild(iframe);

	return function (source, callback) {
		var msg = { id: nextId++, source: source };
		callbacks[msg.id] = callback;
		if (ready) {
			iframe.contentWindow.postMessage(msg, "*");
		} else {
			queue.push(msg);
		}
	};
})();

function createLangModel(languageId, text) {
	monaco.languages.register({ id: languageId });

	var langModel = monaco.editor.createModel(text, "javascript");
	var latestRequest = 0;
	var update = function () {
		var request = ++latestRequest;
		evaluateDefinition(langModel.getValue(), function (err, def) {
			if (request !== latestRequest) {
				return;
			}
			if (err) {
				setInnerText(outputPane, err + "\n");
				return;
			}
			monaco.languages.setMonarchTokensProvider(languageId, def);
			setInnerText(outputPane, "up-to-date\n");
		});
	};
	langModel.onDidChangeContent(function () {
		isDirty = true;
		update();
	});
	update();

	return langModel;
}

function readSamples(sampleSelect) {
	var samples = {};

	for (var i = 0; i < sampleSelect.options.length; i++) {
		var id = sampleSelect.options[i].value;
		if (!id || sampleSelect.options[i].disabled) {
			continue;
		}

		var languageId = "monarch-language-" + id;

		var sampleText = getTextFromId(id + "-sample");

		samples[id] = {
			languageId: languageId,
			langModel: createLangModel(languageId, getTextFromId(id)),
			langViewState: null,
			sampleModel: monaco.editor.createModel(sampleText, languageId),
			sampleViewState: null,
		};
	}

	return samples;
}

require(["vs/editor/editor.main"], function () {
	var sampleSelect = document.getElementById("sampleselect");
	var langPane = document.getElementById("langPane");
	var editorPane = document.getElementById("editor");

	// Adjust height of editors
	var screenHeight = window.innerHeight;
	if (screenHeight) {
		var paneHeight = 0.76 * screenHeight;
		langPane.style.height = paneHeight + "px";
		editorPane.style.height = paneHeight - 112 + "px"; // 100px + margin 10px + borders 2px
	}

	var SAMPLES = readSamples(sampleSelect);
	var CURRENT_SAMPLE = null;

	var langEditor = monaco.editor.create(langPane, {
		model: null,
		scrollBeyondLastLine: false,
	});

	var sampleEditor = monaco.editor.create(editorPane, {
		model: null,
		scrollBeyondLastLine: false,
	});

	var select = document.getElementById("themeselect");
	var currentTheme = "vs";
	select.onchange = function () {
		currentTheme = select.options[select.selectedIndex].value;
		monaco.editor.setTheme(currentTheme);
	};

	// on resize
	function refreshLayout() {
		langEditor.layout();
		sampleEditor.layout();
	}
	window.onresize = refreshLayout;

	// Switch to another sample
	function setEditorState(name) {
		if (!name || CURRENT_SAMPLE === name || !SAMPLES[name]) {
			return;
		}

		// Save previous sample's view state
		if (CURRENT_SAMPLE) {
			SAMPLES[CURRENT_SAMPLE].langViewState = langEditor.saveViewState();
			SAMPLES[CURRENT_SAMPLE].sampleViewState =
				sampleEditor.saveViewState();
		}

		CURRENT_SAMPLE = name;

		// Apply new sample
		langEditor.setModel(SAMPLES[CURRENT_SAMPLE].langModel);
		if (SAMPLES[CURRENT_SAMPLE].langViewState) {
			langEditor.restoreViewState(SAMPLES[CURRENT_SAMPLE].langViewState);
		}
		sampleEditor.setModel(SAMPLES[CURRENT_SAMPLE].sampleModel);
		if (SAMPLES[CURRENT_SAMPLE].sampleViewState) {
			sampleEditor.restoreViewState(
				SAMPLES[CURRENT_SAMPLE].sampleViewState
			);
		}
	}

	// Refresh the sample text
	function refreshSample() {
		var name = sampleSelect.options[sampleSelect.selectedIndex].value;
		setEditorState(name);
	}
	sampleSelect.onchange = refreshSample;
	refreshSample(); // initialize initial text
}); // require
