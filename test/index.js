/// <reference path="../node_modules/monaco-editor-core/monaco.d.ts" />
define(['require', './samples'], function(require, SAMPLES) {

var domutils = require('vs/base/browser/dom');

var model = monaco.editor.createModel('', 'plaintext');

var editor = monaco.editor.create(document.getElementById('container'), {
	model: model,
	glyphMargin: true,
	renderWhitespace: true
});

editor.addCommand({
	ctrlCmd: true,
	key: 'F9'
}, function(ctx, args) {
	alert('Command Running!!');
	console.log(ctx);
});

editor.addAction({
	id: 'my-unique-id',
	label: 'My Label!!!',
	keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.F10],
	contextMenuGroupId: 'navigation',
	contextMenuOrder: 2.5,
	run: function(ed) {
		console.log("i'm running => " + ed.getPosition());
	}
});

var currentSamplePromise = null;
var samplesData = {};
SAMPLES.sort(function(a,b) {
	return a.name.localeCompare(b.name);
}).forEach(function(sample) {
	samplesData[sample.name] = function() {
		if (currentSamplePromise !== null) {
			currentSamplePromise.cancel();
			currentSamplePromise = null;
		}
		currentSamplePromise = sample.loadText().then(function(modelText) {
			currentSamplePromise = null;
			updateEditor(sample.mimeType, modelText, sample.name);
		});
	}
});
var examplesComboBox = new ComboBox('Template', samplesData);


var modesData = {};
monaco.languages.getLanguages().forEach(function(language) {
	modesData[language.id] = updateEditor.bind(this, language.id);
});
var modesComboBox = new ComboBox('Mode', modesData);


var themesData = {};
themesData['vs'] = function() { monaco.editor.setTheme('vs') };
themesData['vs-dark'] = function() { monaco.editor.setTheme('vs-dark') };
themesData['hc-black'] = function() { monaco.editor.setTheme('hc-black') };
var themesComboBox = new ComboBox('Theme', themesData);


// Do it in a timeout to simplify profiles
window.setTimeout(function () {
	var START_SAMPLE = 'Y___DefaultJS';

	var url_matches = location.search.match(/sample=([^?&]+)/i);
	if (url_matches) {
		START_SAMPLE = url_matches[1];
	}

	if (location.hash) {
		START_SAMPLE = location.hash.replace(/^\#/, '');
		START_SAMPLE = decodeURIComponent(START_SAMPLE);
	}

	samplesData[START_SAMPLE]();
	examplesComboBox.set(START_SAMPLE);

	createOptions(editor);
	createToolbar(editor);
}, 0);


function updateEditor(mode, value, sampleName) {
	if (sampleName) {
		window.location.hash = sampleName;
	}

	if (typeof value !== 'undefined') {
		var oldModel = model;
		model = monaco.editor.createModel(value, mode);
		editor.setModel(model);
		if (oldModel) {
			oldModel.dispose();
		}
	} else {
		monaco.editor.setModelLanguage(model, mode);
	}

	modesComboBox.set(mode);
}


function createToolbar(editor) {
	var bar = document.getElementById('bar');

	bar.appendChild(examplesComboBox.domNode);

	bar.appendChild(modesComboBox.domNode);

	bar.appendChild(themesComboBox.domNode);

	bar.appendChild(createButton("Dispose all", function (e) {
		editor.dispose();
		editor = null;
		if (model) {
			model.dispose();
			model = null;
		}
	}));

	bar.appendChild(createButton("Remove Model", function(e) {
		editor.setModel(null);
	}));

	bar.appendChild(createButton("Dispose Model", function(e) {
		if (model) {
			model.dispose();
			model = null;
		}
	}));

	bar.appendChild(createButton('Ballistic scroll', (function() {
		var friction = 1000; // px per second
		var speed = 0; // px per second
		var isRunning = false;
		var lastTime;
		var r = 0;

		var scroll = function() {
			var currentTime = new Date().getTime();
			var ellapsedTimeS = (currentTime - lastTime) / 1000;
			lastTime = currentTime;

			speed = speed - friction * ellapsedTimeS;
			r = r + speed * ellapsedTimeS;
			editor.setScrollTop(r);

			if (speed >= 0) {
				domutils.scheduleAtNextAnimationFrame(scroll);
			} else {
				isRunning = false;
			}
		}

		return function (e) {
			speed += 2000;
			if (!isRunning) {
				isRunning = true;
				r = editor.getScrollTop();
				lastTime = new Date().getTime();
				domutils.runAtThisOrScheduleAtNextAnimationFrame(scroll);
			}
		};
	})()));
}

function createButton(label, onClick) {
	var result = document.createElement("button");
	result.innerHTML = label;
	result.onclick = onClick;
	return result;
}

function createOptions(editor) {
	var options = document.getElementById('options');

	options.appendChild(createOptionToggle(
		editor,
		'lineNumbers',
		function(config) {
			return config.viewInfo.renderLineNumbers;
		},
		function(editor, newValue) {
			editor.updateOptions({ lineNumbers: newValue ? 'on': 'off' });
		}
	));

	options.appendChild(createOptionToggle(
		editor,
		'glyphMargin',
		function(config) {
			return config.viewInfo.glyphMargin;
		},
		function(editor, newValue) {
			editor.updateOptions({ glyphMargin: newValue });
		}
	));

	options.appendChild(createOptionToggle(
		editor,
		'minimap',
		function(config) {
			return config.viewInfo.minimap.enabled;
		},
		function(editor, newValue) {
			editor.updateOptions({ minimap: { enabled: newValue } });
		}
	));

	options.appendChild(createOptionToggle(
		editor,
		'roundedSelection',
		function(config) {
			return config.viewInfo.roundedSelection;
		},
		function(editor, newValue) {
			editor.updateOptions({ roundedSelection: newValue });
		}
	));

	options.appendChild(createOptionToggle(
		editor,
		'scrollBeyondLastLine',
		function(config) {
			return config.viewInfo.scrollBeyondLastLine;
		}, function(editor, newValue) {
			editor.updateOptions({ scrollBeyondLastLine: newValue });
		}
	));

	options.appendChild(createOptionToggle(
		editor,
		'renderWhitespace',
		function(config) {
			return config.viewInfo.renderWhitespace;
		}, function(editor, newValue) {
			editor.updateOptions({ renderWhitespace: newValue });
		}
	));

	options.appendChild(createOptionToggle(
		editor,
		'readOnly',
		function(config) {
			return config.readOnly;
		},
		function(editor, newValue) {
			editor.updateOptions({ readOnly: newValue });
		}
	));

	options.appendChild(createOptionToggle(
		editor,
		'wordWrap',
		function(config) {
			return config.wrappingInfo.isViewportWrapping;
		}, function(editor, newValue) {
			editor.updateOptions({ wordWrap: newValue ? 'on' : 'off' });
		}
	));

	options.appendChild(createOptionToggle(
		editor,
		'folding',
		function(config) {
			return config.contribInfo.folding;
		}, function(editor, newValue) {
			editor.updateOptions({ folding: newValue });
		}
	));
}


function createOptionToggle(editor, labelText, stateReader, setState) {
	var domNode = document.createElement('div');
	domNode.className = 'option toggle';

	var input = document.createElement('input');
	input.type = 'checkbox';

	var label = document.createElement('label');
	label.appendChild(input);
	label.appendChild(document.createTextNode(labelText));

	domNode.appendChild(label);

	var renderState = function() {
		input.checked = stateReader(editor.getConfiguration());
	};

	renderState();
	editor.onDidChangeConfiguration(function() {
		renderState();
	});
	input.onchange = function() {
		setState(editor, !stateReader(editor.getConfiguration()));
	};

	return domNode;
}


function ComboBox(label, externalOptions) {
	this.id = 'combobox-' + label.toLowerCase().replace(/\s/g, '-');

	this.domNode = document.createElement('div');
	this.domNode.setAttribute('style', 'display: inline; margin-right: 5px;');

	this.label = document.createElement('label');
	this.label.innerHTML = label;
	this.label.setAttribute('for', this.id);
	this.domNode.appendChild(this.label);

	this.comboBox = document.createElement('select');
	this.comboBox.setAttribute('id', this.id);
	this.comboBox.setAttribute('name', this.id);
	this.comboBox.onchange =(function (e) {
		var target = e.target || e.srcElement;
		this.options[target.options[target.selectedIndex].value].callback();
	}).bind(this);

	this.domNode.appendChild(this.comboBox);

	this.options = [];
	for (var name in externalOptions) {
		if (externalOptions.hasOwnProperty(name)) {
			var optionElement = document.createElement('option');
			optionElement.value = name;
			optionElement.innerHTML = name;
			this.options[name] = {
				element: optionElement,
				callback: externalOptions[name]
			};
			this.comboBox.appendChild(optionElement);
		}
	}
}
ComboBox.prototype.set = function (name) {
	if (this.options[name]) {
		this.options[name].element.selected = true;
	}
};

});