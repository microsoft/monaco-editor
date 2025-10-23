import * as css from '../../language/css/monaco.contribution.js';
import * as html from '../../language/html/monaco.contribution.js';
import * as json from '../../language/json/monaco.contribution.js';
import * as typescript from '../../language/typescript/monaco.contribution.js';
import '../../basic-languages/monaco.contribution.js';
import * as lsp from '@vscode/monaco-lsp-client';

export * from 'monaco-editor-core';
export { createWebWorker, type IWebWorkerOptions } from '../../common/workers.js';
export { css, html, json, typescript, lsp };
