import * as worker from 'monaco-editor-core/esm/vs/editor/editor.worker.start';

let initialized = false;

export function isWorkerInitialized(): boolean {
	return initialized;
}

export function initialize(callback: (ctx: any, createData: any) => any): void {
	initialized = true;
	self.onmessage = (m) => {
		worker.start((ctx) => {
			return callback(ctx, m.data);
		});
	};
}
