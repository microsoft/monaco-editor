import * as require_ from 'require';

self.MonacoEnvironment = {
	getWorker: function (_moduleId, label) {
		const require = require_;
		if (!require) {
			label = label; // NOOP
		}
		if (label === 'json') {
			return new Worker(new URL('../../../src/language/json/json.worker.ts', import.meta.url), {
				type: 'module'
			});
		}
		if (label === 'css' || label === 'scss' || label === 'less') {
			return new Worker(new URL('../../../src/language/css/css.worker.ts', import.meta.url), {
				type: 'module'
			});
		}
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			return new Worker(new URL('../../../src/language/html/html.worker.ts', import.meta.url), {
				type: 'module'
			});
		}
		if (label === 'typescript' || label === 'javascript') {
			return new Worker(new URL('../../../src/language/typescript/ts.worker.ts', import.meta.url), {
				type: 'module'
			});
		}
		return new Worker(new URL('../../../src/editor/editor.worker.ts', import.meta.url), {
			type: 'module'
		});
	}
};

import 'vs/nls.messages-loader!';
import '../../../src/basic-languages/monaco.contribution';
import '../../../src/language/css/monaco.contribution';
import '../../../src/language/html/monaco.contribution';
import '../../../src/language/json/monaco.contribution';
import '../../../src/language/typescript/monaco.contribution';

const styleSheetUrl = require_.toUrl('vs/style.css');

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = styleSheetUrl;
document.head.appendChild(link);

export * as m from 'monaco-editor-core';
