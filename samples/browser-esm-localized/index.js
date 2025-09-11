// Import German localization before importing Monaco Editor
import '../../out/monaco-editor/esm/nls.messages.de.js';
import * as monaco from '../../out/monaco-editor/esm/vs/editor/editor.api.js';

self.MonacoEnvironment = {
	getWorkerUrl: function (moduleId, label) {
		if (label === 'json') {
			return './json.worker.bundle.js';
		}
		if (label === 'css' || label === 'scss' || label === 'less') {
			return './css.worker.bundle.js';
		}
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			return './html.worker.bundle.js';
		}
		if (label === 'typescript' || label === 'javascript') {
			return './ts.worker.bundle.js';
		}
		return './editor.worker.bundle.js';
	}
};

// Language selector functionality
const languageSelector = document.getElementById('language-selector');
const reloadButton = document.getElementById('reload-button');
const editorContainer = document.getElementById('container');

// Function to reload the page with a different language
function loadLanguage(language) {
	// Store the selected language in localStorage
	localStorage.setItem('monaco-language', language);
	// Reload the page to apply the new language
	window.location.reload();
}

// Check if a different language was selected
const selectedLanguage = localStorage.getItem('monaco-language') || 'de';
languageSelector.value = selectedLanguage;

// If the current import doesn't match the selected language, we need to reload
const currentLanguage = 'de'; // This matches our import above

if (selectedLanguage !== currentLanguage) {
	// For demonstration purposes, we'll show a message to reload manually
	// In a real application, you would dynamically import the language
	document.body.innerHTML = `
		<h2>Monaco Editor ESM Localization Sample</h2>
		<p>Please reload the page to apply the ${selectedLanguage} language setting.</p>
		<button onclick="window.location.reload()">Reload Page</button>
	`;
} else {
	// Create the editor with German localization
	languageSelector.addEventListener('change', (e) => {
		loadLanguage(e.target.value);
	});

	reloadButton.addEventListener('click', () => {
		loadLanguage(languageSelector.value);
	});

	monaco.editor.create(editorContainer, {
		value: [
			'function x() {',
			'\t// This editor uses German localization',
			'\t// Try right-clicking to see the German context menu',
			'\t// Or press F1 to see the German command palette',
			'\tconsole.log("Hallo Welt!");',
			'}'
		].join('\n'),
		language: 'javascript',
		theme: 'vs-dark',
		minimap: { enabled: false }
	});
}
