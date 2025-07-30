/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as monaco from '../../../out/monaco-editor/esm/vs/editor/editor.main.js';

self.MonacoEnvironment = {
	getWorkerUrl: function (moduleId, label) {
		if (label === 'json') {
			return './out/vs/language/json/json.worker.js';
		}
		if (label === 'css' || label === 'scss' || label === 'less') {
			return './out/vs/language/css/css.worker.js';
		}
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			return './out/vs/language/html/html.worker.js';
		}
		if (label === 'typescript' || label === 'javascript') {
			return './out/vs/language/typescript/ts.worker.js';
		}
		//return './out/vs/editor/editor.worker.js';
		return './out/vs/editor/common/services/editorWebWorkerMain.js';
	}
};

window.monacoAPI = monaco;

window.ed = monacoAPI.editor.create(document.getElementById('editor-container'), {
	value: '.test { color: blue; }',
	language: 'javascript'
});
