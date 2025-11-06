import * as css from '../../language/css/monaco.contribution';
import * as html from '../../language/html/monaco.contribution';
import * as json from '../../language/json/monaco.contribution';
import * as typescript from '../../language/typescript/monaco.contribution';
import '../../basic-languages/monaco.contribution';
import * as lsp from '@vscode/monaco-lsp-client';

export * from 'monaco-editor-core';
export { createWebWorker, type IWebWorkerOptions } from '../../common/workers';
export { css, html, json, typescript, lsp };
