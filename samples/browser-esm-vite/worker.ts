import * as m from '@vscode/monaco-lsp-client/src/types';
import { createTransportFromWorkerToParent } from '@hediet/json-rpc-browser';
import { TypedChannel, IMessageTransport } from '@hediet/json-rpc';
import type { ClientImpl } from './main';


class LspConnection {
	constructor(
		public readonly server: typeof client,
		public readonly channel: TypedChannel,
	) { }
}

class TextDocuments {
	constructor(connection: LspConnection) {
		const { client } = m.api.registerServer(connection.channel, {
			textDocumentDidOpen: async (arg, info) => {
				arg.textDocument.text;
			},
			textDocumentDidClose: async (arg, info) => {
				arg.textDocument.uri;
			},
			textDocumentDidChange: async (arg, info) => {
				arg.contentChanges;
				arg.textDocument.uri;
			},
		});
	}

	getTextModel(uri: string): TextModel | null {
		return null;
	}

	getTextModelOrThrow(uri: string | m.TextDocumentIdentifier): TextModel {
		return null;
	}
}

class TextModel {
	getValue(): string {

	}
}

class LspServer {
	public static create(transport: IMessageTransport): LspServer { }

	public readonly textDocuments: TextDocuments;
	public readonly server: typeof m.api.TClientInterface;
	public readonly channel: TypedChannel;

	constructor(
		channel: TypedChannel,
	) {

	}

	public startListen(): void { }
}

const channel = TypedChannel.fromTransport(transport);
const { client } = m.api.registerServer(channel, {
	initialize: async (arg, info) => {
		return {
			capabilities: {
				textDocumentSync: m.TextDocumentSyncKind.Full,
				diagnosticProvider: {
					interFileDependencies: false,
					workspaceDiagnostics: false,
				},
			}
		};
	},
});









export class WorkerImpl extends Disposable {
	private readonly _clientImpl: ClientImpl;
	private readonly _server: LspServer;

	constructor() {
		super();

		this._server = LspServer.create(createTransportFromWorkerToParent());

		this._clientImpl = getRemoteObject<ClientImpl>(server.channel);
		this._register(registerLocalObject(server.channel, this));

		this._clientImpl.$callback();

		m.api.registerServer(this._server.channel, {
			textDocumentDiagnostic: async (arg) => {
				const doc = this._server.textDocuments.getTextModelOrThrow(arg.textDocument);

				return {
					items: [],
					kind: "full",
				};
			},
		});
	}

	$setTextToWarnFor(text: string, message: string): void {
		this._server.server.workspaceDiagnosticRefresh();
	}

	$getDiagnosticsCount(): Promise<number> {
		return 0;
	}
}
