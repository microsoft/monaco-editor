import { createWebWorker } from '../common/workers';
import '../basic-languages/monaco.contribution';
import '../language/css/monaco.contribution';
import '../language/html/monaco.contribution';
import '../language/json/monaco.contribution';
import '../language/typescript/monaco.contribution';
import * as monaco from 'monaco-editor-core';
export * from 'monaco-editor-core';

const existingCreateWebWorker = monaco.editor.createWebWorker;
monaco.editor.createWebWorker = function (options: any) {
	if (options.worker === undefined) {
		return createWebWorker(options);
	}
	return existingCreateWebWorker(options);
} as any;
