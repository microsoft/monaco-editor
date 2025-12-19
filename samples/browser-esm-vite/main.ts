import './style.css';
import * as monaco from '../../src/editor/editor.main';
import type { WorkerImpl } from './worker';

monaco.languages.register({ id: 'typescript' });

const tm = monaco.editor.createModel(`class Test {}`, 'typescript',
	monaco.Uri.parse('file:///main.ts'));

const editor = monaco.editor.create(document.getElementById('root')!, {
	model: tm,
	language: 'typescript',
	theme: 'vs-dark',
});




export class ClientImpl extends Disposable {
	private readonly _workerImpl: WorkerImpl;

	constructor() {
		super();

		const w = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
		const t = monaco.lsp.createTransportToWorker(w);
		const client = this._register(new monaco.lsp.MonacoLspClient(t));

		this._workerImpl = getRemoteObject<WorkerImpl>(client.channel);
		this._register(registerLocalObject(client.channel, this));


		this._workerImpl.$setTextToWarnFor('warn', 'This is a warning from the LSP server!');

		// this should now see all text documents
		this._workerImpl.$getDiagnosticsCount().then(count => {
			console.log(`Diagnostics count: ${count}`);
		});
	}

	$callback(): void {
		console.log('Callback from server received!');
	}
}
