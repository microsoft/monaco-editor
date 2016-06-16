/// <reference path="../../release/monaco.d.ts" />

(function() {

'use strict';

window.onload = function() {
	require(['vs/editor/editor.main'], function() {
		xhr('playground/monaco.d.ts.txt').then(function(response) {
			monaco.languages.typescript.javascriptDefaults.addExtraLib(response.responseText, 'monaco.d.ts');
			monaco.languages.typescript.javascriptDefaults.addExtraLib([
				'declare var require: {',
				'	toUrl(path: string): string;',
				'	(moduleName: string): any;',
				'	(dependencies: string[], callback: (...args: any[]) => any, errorback?: (err: any) => void): any;',
				'	config(data: any): any;',
				'	onError: Function;',
				'};',
			].join('\n'), 'require.d.ts');

			var loading = document.getElementById('loading');
			loading.parentNode.removeChild(loading);
			load();
		});
	});
};

var editor = null;
var data = {
	js: {
		model: null,
		state: null
	},
	css: {
		model: null,
		state: null
	},
	html: {
		model: null,
		state: null
	}
};

function load() {

	function layout() {
		var GLOBAL_PADDING = 20;

		var WIDTH = window.innerWidth - 2 * GLOBAL_PADDING;
		var HEIGHT = window.innerHeight;

		var TITLE_HEIGHT = 110;
		var FOOTER_HEIGHT = 80;
		var TABS_HEIGHT = 20;
		var INNER_PADDING = 20;
		var SWITCHER_HEIGHT = 30;

		var HALF_WIDTH = Math.floor((WIDTH - INNER_PADDING) / 2);
		var REMAINING_HEIGHT = HEIGHT - TITLE_HEIGHT - FOOTER_HEIGHT - SWITCHER_HEIGHT;

		playgroundContainer.style.width = WIDTH + 'px';
		playgroundContainer.style.height = (HEIGHT - FOOTER_HEIGHT) + 'px';

		sampleSwitcher.style.position = 'absolute';
		sampleSwitcher.style.top = TITLE_HEIGHT + 'px';
		sampleSwitcher.style.left = GLOBAL_PADDING + 'px';

		typingContainer.style.position = 'absolute';
		typingContainer.style.top = GLOBAL_PADDING + TITLE_HEIGHT + SWITCHER_HEIGHT + 'px';
		typingContainer.style.left = GLOBAL_PADDING + 'px';
		typingContainer.style.width = HALF_WIDTH + 'px';
		typingContainer.style.height = REMAINING_HEIGHT + 'px';

		tabArea.style.position = 'absolute';
		tabArea.style.boxSizing = 'border-box';
		tabArea.style.top = 0;
		tabArea.style.left = 0;
		tabArea.style.width = HALF_WIDTH + 'px';
		tabArea.style.height = TABS_HEIGHT + 'px';

		editorContainer.style.position = 'absolute';
		editorContainer.style.boxSizing = 'border-box';
		editorContainer.style.top = TABS_HEIGHT + 'px';
		editorContainer.style.left = 0;
		editorContainer.style.width = HALF_WIDTH + 'px';
		editorContainer.style.height = (REMAINING_HEIGHT - TABS_HEIGHT) + 'px';

		if (editor) {
			editor.layout({
				width: HALF_WIDTH - 2,
				height: (REMAINING_HEIGHT - TABS_HEIGHT) - 1
			});
		}

		runContainer.style.position = 'absolute';
		runContainer.style.top = GLOBAL_PADDING + TITLE_HEIGHT + SWITCHER_HEIGHT + TABS_HEIGHT + 'px';
		runContainer.style.left = GLOBAL_PADDING + INNER_PADDING + HALF_WIDTH + 'px';
		runContainer.style.width = HALF_WIDTH + 'px';
		runContainer.style.height = (REMAINING_HEIGHT - TABS_HEIGHT) + 'px';

		runIframeHeight = (REMAINING_HEIGHT - TABS_HEIGHT);
		if (runIframe) {
			runIframe.style.height = runIframeHeight + 'px';
		}
	}

	function changeTab(selectedTabNode, desiredModelId) {
		for (var i = 0; i < tabArea.childNodes.length; i++) {
			var child = tabArea.childNodes[i];
			if (/tab/.test(child.className)) {
				child.className = 'tab';
			}
		}
		selectedTabNode.className = 'tab active';

		var currentState = editor.saveViewState();

		var currentModel = editor.getModel();
		if (currentModel === data.js.model) {
			data.js.state = currentState;
		} else if (currentModel === data.css.model) {
			data.css.state = currentState;
		} else if (currentModel === data.html.model) {
			data.html.state = currentState;
		}

		editor.setModel(data[desiredModelId].model);
		editor.restoreViewState(data[desiredModelId].state);
		editor.focus();
	}


	// create the typing side
	var typingContainer = document.createElement('div');
	typingContainer.className = 'typingContainer';

	var tabArea = (function() {
		var tabArea = document.createElement('div');
		tabArea.className = 'tabArea';

		var jsTab = document.createElement('span');
		jsTab.className = 'tab active';
		jsTab.appendChild(document.createTextNode('JavaScript'));
		jsTab.onclick = function() { changeTab(jsTab, 'js'); };
		tabArea.appendChild(jsTab);

		var cssTab = document.createElement('span');
		cssTab.className = 'tab';
		cssTab.appendChild(document.createTextNode('CSS'));
		cssTab.onclick = function() { changeTab(cssTab, 'css'); };
		tabArea.appendChild(cssTab);

		var htmlTab = document.createElement('span');
		htmlTab.className = 'tab';
		htmlTab.appendChild(document.createTextNode('HTML'));
		htmlTab.onclick = function() { changeTab(htmlTab, 'html'); };
		tabArea.appendChild(htmlTab);

		var runBtn = document.createElement('span');
		runBtn.className = 'action run';
		runBtn.appendChild(document.createTextNode('Run'));
		runBtn.onclick = function() { run(); };
		tabArea.appendChild(runBtn);

		return tabArea;
	})();

	var editorContainer = document.createElement('div');
	editorContainer.className = 'editor-container';

	typingContainer.appendChild(tabArea);
	typingContainer.appendChild(editorContainer);

	var runContainer = document.createElement('div');
	runContainer.className = 'run-container';

	var sampleSwitcher = document.createElement('select');
	var sampleChapter;
	ALL_SAMPLES.forEach(function (sample) {
		if (!sampleChapter || sampleChapter.label !== sample.chapter) {
			sampleChapter = document.createElement('optgroup');
			sampleChapter.label = sample.chapter;
			sampleSwitcher.appendChild(sampleChapter);
		}
		var sampleOption = document.createElement('option');
		sampleOption.value = sample.sampleId;
		sampleOption.appendChild(document.createTextNode(sample.name));
		sampleChapter.appendChild(sampleOption);
	});
	sampleSwitcher.className = 'sample-switcher';

	function findSample(sampleId) {
		for (var i = 0; i < SAMPLES.length; i++) {
			var sample = SAMPLES[i];
			if (sample.id === sampleId) {
				return sample;
			}
		}
		return null;
	}

	function loadSample(sampleId, callback) {
		var sample = findSample(sampleId);
		if (sample) {
			return callback(null, sample);
		}

		var script = document.createElement('script');
		script.src = 'playground/samples/' + sampleId + '.js';
		script.onload = function() {
			var sample = findSample(sampleId);
			return callback(sample ? null : new Error('sample not found'), sample);
		};
		script.onerror = function(err) {
			return callback(err, null);
		};
		document.head.appendChild(script);
	}

	sampleSwitcher.onchange = function() {
		var sampleId = sampleSwitcher.options[sampleSwitcher.selectedIndex].value;
		window.location.hash = sampleId;
	};

	var playgroundContainer = document.getElementById('playground');

	layout();
	window.onresize = layout;

	playgroundContainer.appendChild(sampleSwitcher);
	playgroundContainer.appendChild(typingContainer);
	playgroundContainer.appendChild(runContainer);

	data.js.model = monaco.editor.createModel('console.log("hi")', 'javascript');
	data.css.model = monaco.editor.createModel('css', 'css');
	data.html.model = monaco.editor.createModel('html', 'html');

	editor = monaco.editor.create(editorContainer, {
		model: data.js.model
	});

	var currentToken = 0;
	function parseHash(firstTime) {
		var sampleId = window.location.hash.replace(/^#/, '');
		if (!sampleId) {
			sampleId = ALL_SAMPLES[0].sampleId;
		}

		if (firstTime) {
			for (var i = 0; i < sampleSwitcher.options.length; i++) {
				var opt = sampleSwitcher.options[i];
				if (opt.value === sampleId) {
					sampleSwitcher.selectedIndex = i;
					break;
				}
			}
		}

		var myToken = (++currentToken);
		loadSample(sampleId, function(err, sample) {
			if (err) {
				alert('Sample not found! ' + err.message);
				return;
			}
			if (myToken !== currentToken) {
				return;
			}
			data.js.model.setValue(sample.js);
			data.html.model.setValue(sample.html);
			data.css.model.setValue(sample.css);
			editor.setScrollTop(0);
			run();
		});
	}
	window.onhashchange = parseHash;
	parseHash(true);

	function run() {
		doRun(runContainer);
	}
}

var runIframe = null, runIframeHeight = 0;
function doRun(runContainer) {
	if (runIframe) {
		// Unload old iframe
		runContainer.removeChild(runIframe);
	}

	// Load new iframe
	runIframe = document.createElement('iframe');
	runIframe.id = 'runner';
	runIframe.src = 'playground/playground-runner.html';
	runIframe.className = 'run-iframe';
	runIframe.style.boxSizing = 'border-box';
	runIframe.style.height = runIframeHeight + 'px';
	runIframe.style.width = '100%';
	runIframe.style.border = '1px solid lightgrey';
	runIframe.frameborder = '0';
	runContainer.appendChild(runIframe);

	var getLang = function(lang) {
		return data[lang].model.getValue();
	};

	runIframe.addEventListener('load', function(e) {
		runIframe.contentWindow.load(getLang('js'), getLang('html'), getLang('css'));
	});
}

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

})();