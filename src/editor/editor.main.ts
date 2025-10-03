import { createWebWorker } from '../common/workers.js';
import '../basic-languages/monaco.contribution.js';
import '../language/css/monaco.contribution.js';
import '../language/html/monaco.contribution.js';
import '../language/json/monaco.contribution.js';
import '../language/typescript/monaco.contribution.js';
import * as monaco from 'monaco-editor-core';
export * from 'monaco-editor-core';

const existingCreateWebWorker = monaco.editor.createWebWorker;
monaco.editor.createWebWorker = function (options: any) {
	if (options.worker === undefined) {
		return createWebWorker(options);
	}
	return existingCreateWebWorker(options);
} as any;
