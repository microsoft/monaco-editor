/// @ts-ignore
import * as require from 'require';

self.MonacoEnvironment = {
	getWorker: function (_moduleId, label) {
		if (label === 'json') {
			return new Worker(
				getWorkerBootstrapUrl(
					/// @ts-ignore
					new URL('../../../src/language/json/json.worker.ts?worker', import.meta.url)
				)
			);
		}
		if (label === 'css' || label === 'scss' || label === 'less') {
			return new Worker(
				getWorkerBootstrapUrl(
					/// @ts-ignore
					new URL('../../../src/language/css/css.worker.ts?worker', import.meta.url)
				)
			);
		}
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			return new Worker(
				getWorkerBootstrapUrl(
					/// @ts-ignore
					new URL('../../../src/language/html/html.worker.ts?worker', import.meta.url)
				)
			);
		}
		if (label === 'typescript' || label === 'javascript') {
			return new Worker(
				getWorkerBootstrapUrl(
					/// @ts-ignore
					new URL('../../../src/language/typescript/ts.worker.ts?worker', import.meta.url)
				)
			);
		}
		return new Worker(
			/// @ts-ignore
			getWorkerBootstrapUrl(new URL('../../../src/editor/editor.worker.ts?worker', import.meta.url))
		);
	}
};

function getWorkerBootstrapUrl(workerScriptUrl: string | URL) {
	if (typeof workerScriptUrl !== 'string') {
		workerScriptUrl = workerScriptUrl.toString();
	}
	const blob = new Blob(
		[
			[
				`const ttPolicy = globalThis.trustedTypes?.createPolicy('defaultWorkerFactory', { createScriptURL: value => value });`,
				`globalThis.workerttPolicy = ttPolicy;`,
				`importScripts(ttPolicy?.createScriptURL(${JSON.stringify(
					workerScriptUrl
				)}) ?? ${JSON.stringify(workerScriptUrl)});`,
				`globalThis.postMessage({ type: 'vscode-worker-ready' });`
			].join('')
		],
		{ type: 'application/javascript' }
	);
	return URL.createObjectURL(blob);
}

import 'vs/nls.messages-loader!';
export * from '../../../src/editor/editor.main';

// for now, lsp is only available to amd build
import * as lsp from '@vscode/monaco-lsp-client';
export { lsp };

// TODO@hediet get rid of the monaco global
if ((globalThis as any).monaco) {
	(globalThis as any).monaco.lsp = lsp;
}

const styleSheetUrl = require.toUrl('vs/editor/editor.main.css');

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = styleSheetUrl;
document.head.appendChild(link);
