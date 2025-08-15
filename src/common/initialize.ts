import * as worker from 'monaco-editor-core/esm/vs/editor/editor.worker.start';

export function initialize(callback: (ctx: any, createData: any) => any): void {
	self.onmessage = (m) => {
		worker.start((ctx) => callback(ctx, m.data));
	};
}
