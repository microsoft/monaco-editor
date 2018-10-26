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
		});

		const loading = document.getElementById('loading');
		loading.parentNode.removeChild(loading);
		load();

	});
};

let editor = null;
const data = {
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
		let GLOBAL_PADDING = 20;

		let WIDTH = window.innerWidth - 2 * GLOBAL_PADDING;
		let HEIGHT = window.innerHeight;

		let TITLE_HEIGHT = 110;
		let FOOTER_HEIGHT = 80;
		let TABS_HEIGHT = 20;
		let INNER_PADDING = 20;
		let SWITCHER_HEIGHT = 30;

		let HALF_WIDTH = Math.floor((WIDTH - INNER_PADDING) / 2);
		let REMAINING_HEIGHT = HEIGHT - TITLE_HEIGHT - FOOTER_HEIGHT - SWITCHER_HEIGHT;

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
			runIframe.style.height = `${runIframeHeight}px`;
		}
	}

	function changeTab(selectedTabNode, desiredModelId) {
		for (let i = 0; i < tabArea.childNodes.length; i++) {
			let child = tabArea.childNodes[i];
			if (/tab/.test(child.className)) {
				child.className = 'tab';
			}
		}
		selectedTabNode.className = 'tab active';

		let currentState = editor.saveViewState();

		let currentModel = editor.getModel();
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
	const typingContainer = document.createElement('div');
	typingContainer.className = 'typingContainer';

	let tabArea = (function() {
		let tabArea = document.createElement('div');
		tabArea.className = 'tabArea';

		let jsTab = document.createElement('span');
		jsTab.className = 'tab active';
		jsTab.appendChild(document.createTextNode('JavaScript'));
		jsTab.onclick = function() { changeTab(jsTab, 'js'); };
		tabArea.appendChild(jsTab);

		const cssTab = document.createElement('span');
		cssTab.className = 'tab';
		cssTab.appendChild(document.createTextNode('CSS'));
		cssTab.onclick = function() { changeTab(cssTab, 'css'); };
		tabArea.appendChild(cssTab);

		let htmlTab = document.createElement('span');
		htmlTab.className = 'tab';
		htmlTab.appendChild(document.createTextNode('HTML'));
		htmlTab.onclick = function() { changeTab(htmlTab, 'html'); };
		tabArea.appendChild(htmlTab);

		let runBtn = document.createElement('span');
		runBtn.className = 'action run';
		runBtn.appendChild(document.createTextNode('Run'));
		runBtn.onclick = function() { run(); };
		tabArea.appendChild(runBtn);

		return tabArea;
	})();

	let editorContainer = document.createElement('div');
	editorContainer.className = 'editor-container';

	typingContainer.appendChild(tabArea);
	typingContainer.appendChild(editorContainer);

	let runContainer = document.createElement('div');
	runContainer.className = 'run-container';

	let sampleSwitcher = document.createElement('select');
	let sampleChapter;
	PLAY_SAMPLES.forEach(function (sample) {
		if (!sampleChapter || sampleChapter.label !== sample.chapter) {
			sampleChapter = document.createElement('optgroup');
			sampleChapter.label = sample.chapter;
			sampleSwitcher.appendChild(sampleChapter);
		}
		let sampleOption = document.createElement('option');
		sampleOption.value = sample.id;
		sampleOption.appendChild(document.createTextNode(sample.name));
		sampleChapter.appendChild(sampleOption);
	});
	sampleSwitcher.className = 'sample-switcher';

	let LOADED_SAMPLES = [];
	function findLoadedSample(sampleId) {
		for (let i = 0; i < LOADED_SAMPLES.length; i++) {
			let sample = LOADED_SAMPLES[i];
			if (sample.id === sampleId) {
				return sample;
			}
		}
		return null;
	}

	function findSamplePath(sampleId) {
		for (let i = 0; i < PLAY_SAMPLES.length; i++) {
			let sample = PLAY_SAMPLES[i];
			if (sample.id === sampleId) {
				return sample.path;
			}
		}
		return null;
	}

	function loadSample(sampleId, callback) {
		var sample = findLoadedSample(sampleId);
		if (sample) {
			return callback(null, sample);
		}

		let samplePath = findSamplePath(sampleId);
		if (!samplePath) {
			return callback(new Error('sample not found'));
		}

		samplePath = 'playground/new-samples/' + samplePath;

		let js = xhr(samplePath + '/sample.js').then(function(response) { return response.responseText});
		let css = xhr(samplePath + '/sample.css').then(function(response) { return response.responseText});
		let html = xhr(samplePath + '/sample.html').then(function(response) { return response.responseText});
		monaco.Promise.join([js, css, html]).then(function(_) {
			let js = _[0];
			let css = _[1];
			let html = _[2];
			LOADED_SAMPLES.push({
				id: sampleId,
				js: js,
				css: css,
				html: html
			});
			return callback(null, findLoadedSample(sampleId));
		}, function(err) {
			callback(err, null);
		});
	}

	sampleSwitcher.onchange = function() {
		let sampleId = sampleSwitcher.options[sampleSwitcher.selectedIndex].value;
		window.location.hash = sampleId;
	};

	const playgroundContainer = document.getElementById('playground');

	layout();
	window.onresize = layout;

	playgroundContainer.appendChild(sampleSwitcher);
	playgroundContainer.appendChild(typingContainer);
	playgroundContainer.appendChild(runContainer);

	data.js.model = monaco.editor.createModel('console.log("hi")', 'javascript');
	data.css.model = monaco.editor.createModel('css', 'css');
	data.html.model = monaco.editor.createModel('html', 'html');

	editor = monaco.editor.create(editorContainer, {
		model: data.js.model,
		minimap: {
			enabled: false
		}
	});

	let currentToken = 0;
	function parseHash(firstTime) {
		let sampleId = window.location.hash.replace(/^#/, '');
		if (!sampleId) {
			sampleId = PLAY_SAMPLES[0].id;
		}

		if (firstTime) {
			for (let i = 0; i < sampleSwitcher.options.length; i++) {
				let opt = sampleSwitcher.options[i];
				if (opt.value === sampleId) {
					sampleSwitcher.selectedIndex = i;
					break;
				}
			}
		}

		let myToken = (++currentToken);
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

let runIframe = null, runIframeHeight = 0;
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

	let getLang = function(lang) {
		return data[lang].model.getValue();
	};

	runIframe.addEventListener('load', function(e) {
		runIframe.contentWindow.load(getLang('js'), getLang('html'), getLang('css'));
	});
}

let preloaded = {};
(function() {
	let elements = Array.prototype.slice.call(document.querySelectorAll('pre[data-preload]'), 0);

	elements.forEach(function(el) {
		let path = el.getAttribute('data-preload');
		preloaded[path] = el.innerText || el.textContent;
		el.parentNode.removeChild(el);
	});
})();

function xhr(url) {
	if (preloaded[url]) {
		return monaco.Promise.as({
			responseText: preloaded[url]
		});
	}

	let req = null;
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
