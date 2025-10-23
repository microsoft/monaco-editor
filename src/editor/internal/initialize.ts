import * as monaco from 'monaco-editor-core/esm/vs/editor/editor.api.js';

export function getGlobalMonaco(): any {
	return monaco;
}

// TODO@hediet get rid of the monaco global

const monacoEnvironment: monaco.Environment | undefined = (globalThis as any).MonacoEnvironment;
if (monacoEnvironment?.globalAPI) {
	(globalThis as any).monaco = getGlobalMonaco();
}
