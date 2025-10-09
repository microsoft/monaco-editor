import { createWebWorker } from '../common/workers.js';
import '../basic-languages/monaco.contribution.js';
import * as css from '../language/css/monaco.contribution.js';
import * as html from '../language/html/monaco.contribution.js';
import * as json from '../language/json/monaco.contribution.js';
import * as typescript from '../language/typescript/monaco.contribution.js';
import * as monaco from 'monaco-editor-core';
export * from 'monaco-editor-core';

export { css, html, json, typescript };

const existingCreateWebWorker = monaco.editor.createWebWorker;
monaco.editor.createWebWorker = function (options: any) {
	if (options.worker === undefined) {
		return createWebWorker(options);
	}
	return existingCreateWebWorker(options);
} as any;
