/// <reference path="../../release/monaco.d.ts" />

"use strict";

var editor = null, diffEditor = null;

$(document).ready(function() {
	require(['vs/editor/editor.main'], function () {
		var MODES = (function() {
			var modesIds = monaco.languages.getLanguages().map(function(lang) { return lang.id; });
			modesIds.sort();

			return modesIds.map(function(modeId) {
				return {
					modeId: modeId,
					sampleURL: 'index/samples/sample.' + modeId + '.txt'
				};
			});
		})();

		var startModeIndex = 0;
		for (var i = 0; i < MODES.length; i++) {
			var o = document.createElement('option');
			o.textContent = MODES[i].modeId;
			if (MODES[i].modeId === 'typescript') {
				startModeIndex = i;
			}
			$(".language-picker").append(o);
		}
		$(".language-picker")[0].selectedIndex = startModeIndex;
		loadSample(MODES[startModeIndex]);
		$(".language-picker").change(function() {
			loadSample(MODES[this.selectedIndex]);
		});

		$(".theme-picker").change(function() {
			changeTheme(this.selectedIndex);
		});

		loadDiffSample();

		$('#inline-diff-checkbox').change(function () {
			diffEditor.updateOptions({
				renderSideBySide: !$(this).is(':checked')
			});
		});
	});

	window.onresize = function () {
		if (editor) {
			editor.layout();
		}
		if (diffEditor) {
			diffEditor.layout();
		}
	};
});

var preloaded = {};
(function() {
	var elements = Array.prototype.slice.call(document.querySelectorAll('pre[data-preload]'), 0);

	elements.forEach(function(el) {
		var path = el.getAttribute('data-preload');
		preloaded[path] = el.innerText || el.textContent;
		el.parentNode.removeChild(el);
	});
})();

function xhr(url, cb) {
	if (preloaded[url]) {
		return cb(null, preloaded[url]);
	}
	$.ajax({
		type: 'GET',
		url: url,
		dataType: 'text',
		error: function () {
			cb(this, null);
		}
	}).done(function(data) {
		cb(null, data);
	});
}

function loadSample(mode) {
	$('.loading.editor').show();
	xhr(mode.sampleURL, function(err, data) {
		if (err) {
			if (editor) {
				if (editor.getModel()) {
					editor.getModel().dispose();
				}
				editor.dispose();
				editor = null;
			}
			$('.loading.editor').fadeOut({ duration: 200 });
			$('#editor').empty();
			$('#editor').append('<p class="alert alert-error">Failed to load ' + mode.modeId + ' sample</p>');
			return;
		}

		if (!editor) {
			$('#editor').empty();
			editor = monaco.editor.create(document.getElementById('editor'), {
				model: null,
			});
		}

		var oldModel = editor.getModel();
		var newModel = monaco.editor.createModel(data, mode.modeId);
		editor.setModel(newModel);
		if (oldModel) {
			oldModel.dispose();
		}
		$('.loading.editor').fadeOut({ duration: 300 });
	})
}

function loadDiffSample() {

	var onError = function() {
		$('.loading.diff-editor').fadeOut({ duration: 200 });
		$('#diff-editor').append('<p class="alert alert-error">Failed to load diff editor sample</p>');
	};

	$('.loading.diff-editor').show();

	var lhsData = null, rhsData = null, jsMode = null;

	xhr('index/samples/diff.lhs.txt', function(err, data) {
		if (err) {
			return onError();
		}
		lhsData = data;
		onProgress();
	})
	xhr('index/samples/diff.rhs.txt', function(err, data) {
		if (err) {
			return onError();
		}
		rhsData = data;
		onProgress();
	})

	function onProgress() {
		if (lhsData && rhsData) {
			diffEditor = monaco.editor.createDiffEditor(document.getElementById('diff-editor'), {
				enableSplitViewResizing: false
			});

			var lhsModel = monaco.editor.createModel(lhsData, 'text/javascript');
			var rhsModel = monaco.editor.createModel(rhsData, 'text/javascript');

			diffEditor.setModel({
				original: lhsModel,
				modified: rhsModel
			});

			$('.loading.diff-editor').fadeOut({ duration: 300 });
		}
	}
}

function changeTheme(theme) {
	var newTheme = (theme === 1 ? 'vs-dark' : ( theme === 0 ? 'vs' : 'hc-black' ));
	if (editor) {
		editor.updateOptions({ 'theme' : newTheme });
	}
	if (diffEditor) {
		diffEditor.updateOptions({ 'theme': newTheme });
	}
}
