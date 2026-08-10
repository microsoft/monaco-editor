/// @ts-ignore
import * as require from 'require';

if (typeof (globalThis as any).require !== 'undefined' && typeof (globalThis as any).require.config === 'function') {
	(globalThis as any).require.config({
		ignoreDuplicateModules: [
			'vscode-languageserver-types',
			'vscode-languageserver-types/main',
			'vscode-languageserver-textdocument',
			'vscode-languageserver-textdocument/main',
			'vscode-nls',
			'vscode-nls/vscode-nls',
			'jsonc-parser',
			'jsonc-parser/main',
			'vscode-uri',
			'vscode-uri/index',
			'vs/basic-languages/typescript/typescript'
		]
	});
}

self.MonacoEnvironment = {
	getWorker: function (_moduleId, label) {
		if (label === 'json') {
			return new Worker(
				getWorkerBootstrapUrl(
					/// @ts-ignore
					new URL('../../../src/languages/features/json/json.worker.ts?esm', import.meta.url)
				)
			);
		}
		if (label === 'css' || label === 'scss' || label === 'less') {
			return new Worker(
				getWorkerBootstrapUrl(
					/// @ts-ignore
					new URL('../../../src/languages/features/css/css.worker.ts?esm', import.meta.url)
				)
			);
		}
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			return new Worker(
				getWorkerBootstrapUrl(
					/// @ts-ignore
					new URL('../../../src/languages/features/html/html.worker.ts?esm', import.meta.url)
				)
			);
		}
		if (label === 'typescript' || label === 'javascript') {
			return new Worker(
				getWorkerBootstrapUrl(
					/// @ts-ignore
					new URL('../../../src/languages/features/typescript/ts.worker.ts?esm', import.meta.url)
				)
			);
		}
		return new Worker(
			/// @ts-ignore
			getWorkerBootstrapUrl(new URL('../../../src/deprecated/editor/editor.worker.ts?esm', import.meta.url))
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
import * as monaco from '../../../src/index';
export * from '../../../src/index';

globalThis.monaco = monaco;

const lang = monaco.languages as any;
lang.css = monaco.css;
lang.html = monaco.html;
lang.typescript = monaco.typescript;
lang.json = monaco.json;

const styleSheetUrl = require.toUrl('vs/editor/editor.main.css');

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = styleSheetUrl;
document.head.appendChild(link);
