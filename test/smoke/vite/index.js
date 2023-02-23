/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as monaco from '../../../out/monaco-editor/esm/vs/editor/editor.main';
import editorWorker from '../../../out/monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from '../../../out/monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from '../../../out/monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from '../../../out/monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from '../../../out/monaco-editor/esm/vs/language/typescript/ts.worker?worker';

self.MonacoEnvironment = {
	getWorker(moduleId, label) {
		if (label === 'json') {
			return new jsonWorker();
		}
		if (label === 'css' || label === 'scss' || label === 'less') {
			return new cssWorker();
		}
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			return new htmlWorker();
		}
		if (label === 'typescript' || label === 'javascript') {
			return new tsWorker();
		}
		return new editorWorker();
	}
};

window.monacoAPI = monaco;
