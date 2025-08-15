// @ and monaco-editor-core will not get bundled (because these dependencies get bundled on their own). Instead, the path gets rewritten.

import { createWebWorker } from '../common/workers';
import '../basic-languages/monaco.contribution';
import '../language/css/monaco.contribution';
import '../language/html/monaco.contribution';
import '../language/json/monaco.contribution';
import '../language/typescript/monaco.contribution';
import * as core from 'monaco-editor-core';

export * from './edcore.main';

(core.editor as any).createWebWorker = createWebWorker;
