/// <reference path="../../out/monaco-editor/monaco.d.ts" />
define(['require', './samples'], function (require, SAMPLES) {
	let model = monaco.editor.createModel('', 'plaintext');

	monaco.languages.typescript.typescriptDefaults.setInlayHintsOptions({
		includeInlayParameterNameHints: 'all',
		includeInlayParameterNameHintsWhenArgumentMatchesName: true,
		includeInlayFunctionParameterTypeHints: true,
		includeInlayVariableTypeHints: true,
		includeInlayPropertyDeclarationTypeHints: true,
		includeInlayFunctionLikeReturnTypeHints: true,
		includeInlayEnumMemberValueHints: true
	});

	var editor = monaco.editor.create(document.getElementById('container'), {
		model: model,
		glyphMargin: true,
		renderWhitespace: true
	});

	editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.F9, function (ctx, args) {
		alert('Command Running!!');
		console.log(ctx);
	});

	editor.addAction({
		id: 'my-unique-id',
		label: 'My Label!!!',
		keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.F10],
		contextMenuGroupId: 'navigation',
		contextMenuOrder: 2.5,
		run: function (ed) {
			console.log("i'm running => " + ed.getPosition());
		}
	});

	var currentSamplePromise = null;
	var samplesData = {};
	SAMPLES.sort(function (a, b) {
		return a.name.localeCompare(b.name);
	}).forEach(function (sample) {
		samplesData[sample.name] = function () {
			if (currentSamplePromise !== null) {
				currentSamplePromise.cancel();
				currentSamplePromise = null;
			}
			currentSamplePromise = sample.loadText().then(function (modelText) {
				currentSamplePromise = null;
				updateEditor(sample.mimeType, modelText, sample.name);
			});
		};
	});
	var examplesComboBox = new ComboBox('Template', samplesData);

	var modesData = {};
	monaco.languages.getLanguages().forEach(function (language) {
		modesData[language.id] = updateEditor.bind(this, language.id);
	});
	var modesComboBox = new ComboBox('Mode', modesData);

	var themesData = {};
	themesData['vs'] = function () {
		monaco.editor.setTheme('vs');
	};
	themesData['vs-dark'] = function () {
		monaco.editor.setTheme('vs-dark');
	};
	themesData['hc-black'] = function () {
		monaco.editor.setTheme('hc-black');
	};
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

		bar.appendChild(
			createButton('Dispose all', function (e) {
				editor.dispose();
				editor = null;
				if (model) {
					model.dispose();
					model = null;
				}
			})
		);

		bar.appendChild(
			createButton('Remove Model', function (e) {
				editor.setModel(null);
			})
		);

		bar.appendChild(
			createButton('Dispose Model', function (e) {
				if (model) {
					model.dispose();
					model = null;
				}
			})
		);

		bar.appendChild(
			createButton(
				'Ballistic scroll',
				(function () {
					var friction = 1000; // px per second
					var speed = 0; // px per second
					var isRunning = false;
					var lastTime;
					var r = 0;

					var scroll = function () {
						var currentTime = new Date().getTime();
						var ellapsedTimeS = (currentTime - lastTime) / 1000;
						lastTime = currentTime;

						speed = speed - friction * ellapsedTimeS;
						r = r + speed * ellapsedTimeS;
						editor.setScrollTop(r);

						if (speed >= 0) {
							requestAnimationFrame(scroll);
						} else {
							isRunning = false;
						}
					};

					return function (e) {
						speed += 2000;
						if (!isRunning) {
							isRunning = true;
							r = editor.getScrollTop();
							lastTime = new Date().getTime();
							requestAnimationFrame(scroll);
						}
					};
				})()
			)
		);
	}

	function createButton(label, onClick) {
		var result = document.createElement('button');
		result.innerHTML = label;
		result.onclick = onClick;
		return result;
	}

	function createOptions(editor) {
		var options = document.getElementById('options');

		var lineNumbers;
		options.appendChild(
			createOptionToggle(
				editor,
				'lineNumbers',
				function () {
					return lineNumbers === false ? false : true;
				},
				function (editor, newValue) {
					lineNumbers = newValue;
					editor.updateOptions({ lineNumbers: lineNumbers ? 'on' : 'off' });
				}
			)
		);

		var glyphMargin;
		options.appendChild(
			createOptionToggle(
				editor,
				'glyphMargin',
				function () {
					return glyphMargin === false ? false : true;
				},
				function (editor, newValue) {
					glyphMargin = newValue;
					editor.updateOptions({ glyphMargin: glyphMargin });
				}
			)
		);

		var minimap;
		options.appendChild(
			createOptionToggle(
				editor,
				'minimap',
				function () {
					return minimap === false ? false : true;
				},
				function (editor, newValue) {
					minimap = newValue;
					editor.updateOptions({ minimap: { enabled: minimap } });
				}
			)
		);

		var roundedSelection;
		options.appendChild(
			createOptionToggle(
				editor,
				'roundedSelection',
				function () {
					return roundedSelection === false ? false : true;
				},
				function (editor, newValue) {
					roundedSelection = newValue;
					editor.updateOptions({ roundedSelection: roundedSelection });
				}
			)
		);

		var scrollBeyondLastLine;
		options.appendChild(
			createOptionToggle(
				editor,
				'scrollBeyondLastLine',
				function () {
					return scrollBeyondLastLine === false ? false : true;
				},
				function (editor, newValue) {
					scrollBeyondLastLine = newValue;
					editor.updateOptions({ scrollBeyondLastLine: scrollBeyondLastLine });
				}
			)
		);

		var renderWhitespace;
		options.appendChild(
			createOptionToggle(
				editor,
				'renderWhitespace',
				function () {
					return renderWhitespace === true ? true : false;
				},
				function (editor, newValue) {
					renderWhitespace = newValue;
					editor.updateOptions({ renderWhitespace: renderWhitespace });
				}
			)
		);

		var readOnly;
		options.appendChild(
			createOptionToggle(
				editor,
				'readOnly',
				function () {
					return readOnly === true ? true : false;
				},
				function (editor, newValue) {
					readOnly = newValue;
					editor.updateOptions({ readOnly: readOnly });
				}
			)
		);

		var wordWrap;
		options.appendChild(
			createOptionToggle(
				editor,
				'wordWrap',
				function () {
					return wordWrap === true ? true : false;
				},
				function (editor, newValue) {
					wordWrap = newValue;
					editor.updateOptions({ wordWrap: wordWrap ? 'on' : 'off' });
				}
			)
		);

		var folding;
		options.appendChild(
			createOptionToggle(
				editor,
				'folding',
				function () {
					return folding === false ? false : true;
				},
				function (editor, newValue) {
					folding = newValue;
					editor.updateOptions({ folding: folding });
				}
			)
		);

		var bracketPairColorizationEnabled = false;
		options.appendChild(
			createOptionToggle(
				editor,
				'bracketPairColorizationEnabled',
				function () {
					return bracketPairColorizationEnabled === false ? false : true;
				},
				function (editor, newValue) {
					bracketPairColorizationEnabled = newValue;
					editor.updateOptions({
						'bracketPairColorization.enabled': bracketPairColorizationEnabled
					});
				}
			)
		);
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

		var renderState = function () {
			input.checked = stateReader();
		};

		renderState();
		editor.onDidChangeConfiguration(function () {
			renderState();
		});
		input.onchange = function () {
			setState(editor, !stateReader());
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
		this.comboBox.onchange = function (e) {
			var target = e.target || e.srcElement;
			this.options[target.options[target.selectedIndex].value].callback();
		}.bind(this);

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
