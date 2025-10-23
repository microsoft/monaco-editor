import { IMessageTransport, TypedChannel } from "@hediet/json-rpc";
import { LspCompletionFeature } from "./languageFeatures/LspCompletionFeature";
import { LspHoverFeature } from "./languageFeatures/LspHoverFeature";
import { LspSignatureHelpFeature } from "./languageFeatures/LspSignatureHelpFeature";
import { LspDefinitionFeature } from "./languageFeatures/LspDefinitionFeature";
import { LspDeclarationFeature } from "./languageFeatures/LspDeclarationFeature";
import { LspTypeDefinitionFeature } from "./languageFeatures/LspTypeDefinitionFeature";
import { LspImplementationFeature } from "./languageFeatures/LspImplementationFeature";
import { LspReferencesFeature } from "./languageFeatures/LspReferencesFeature";
import { LspDocumentHighlightFeature } from "./languageFeatures/LspDocumentHighlightFeature";
import { LspDocumentSymbolFeature } from "./languageFeatures/LspDocumentSymbolFeature";
import { LspRenameFeature } from "./languageFeatures/LspRenameFeature";
import { LspCodeActionFeature } from "./languageFeatures/LspCodeActionFeature";
import { LspCodeLensFeature } from "./languageFeatures/LspCodeLensFeature";
import { LspDocumentLinkFeature } from "./languageFeatures/LspDocumentLinkFeature";
import { LspFormattingFeature } from "./languageFeatures/LspFormattingFeature";
import { LspRangeFormattingFeature } from "./languageFeatures/LspRangeFormattingFeature";
import { LspOnTypeFormattingFeature } from "./languageFeatures/LspOnTypeFormattingFeature";
import { LspFoldingRangeFeature } from "./languageFeatures/LspFoldingRangeFeature";
import { LspSelectionRangeFeature } from "./languageFeatures/LspSelectionRangeFeature";
import { LspInlayHintsFeature } from "./languageFeatures/LspInlayHintsFeature";
import { LspSemanticTokensFeature } from "./languageFeatures/LspSemanticTokensFeature";
import { LspDiagnosticsFeature } from "./languageFeatures/LspDiagnosticsFeature";
import { api } from "../../src/types";
import { LspConnection } from "./LspConnection";
import { LspCapabilitiesRegistry } from './LspCapabilitiesRegistry';
import { TextDocumentSynchronizer } from "./TextDocumentSynchronizer";
import { DisposableStore, IDisposable } from "../utils";

export class MonacoLspClient {
    private _connection: LspConnection;
    private readonly _capabilitiesRegistry: LspCapabilitiesRegistry;
    private readonly _bridge: TextDocumentSynchronizer;

    private _initPromise: Promise<void>;

    constructor(transport: IMessageTransport) {
        const c = TypedChannel.fromTransport(transport);
        const s = api.getServer(c, {});
        c.startListen();

        this._capabilitiesRegistry = new LspCapabilitiesRegistry(c);
        this._bridge = new TextDocumentSynchronizer(s.server, this._capabilitiesRegistry);

        this._connection = new LspConnection(s.server, this._bridge, this._capabilitiesRegistry, c);
        this.createFeatures();

        this._initPromise = this._init();
    }

    private async _init() {
        const result = await this._connection.server.initialize({
            processId: null,
            capabilities: this._capabilitiesRegistry.getClientCapabilities(),
            rootUri: null,
        });

        this._connection.server.initialized({});
        this._capabilitiesRegistry.setServerCapabilities(result.capabilities);
    }

    protected createFeatures(): IDisposable {
        const store = new DisposableStore();

        store.add(new LspCompletionFeature(this._connection));
        store.add(new LspHoverFeature(this._connection));
        store.add(new LspSignatureHelpFeature(this._connection));
        store.add(new LspDefinitionFeature(this._connection));
        store.add(new LspDeclarationFeature(this._connection));
        store.add(new LspTypeDefinitionFeature(this._connection));
        store.add(new LspImplementationFeature(this._connection));
        store.add(new LspReferencesFeature(this._connection));
        store.add(new LspDocumentHighlightFeature(this._connection));
        store.add(new LspDocumentSymbolFeature(this._connection));
        store.add(new LspRenameFeature(this._connection));
        store.add(new LspCodeActionFeature(this._connection));
        store.add(new LspCodeLensFeature(this._connection));
        store.add(new LspDocumentLinkFeature(this._connection));
        store.add(new LspFormattingFeature(this._connection));
        store.add(new LspRangeFormattingFeature(this._connection));
        store.add(new LspOnTypeFormattingFeature(this._connection));
        store.add(new LspFoldingRangeFeature(this._connection));
        store.add(new LspSelectionRangeFeature(this._connection));
        store.add(new LspInlayHintsFeature(this._connection));
        store.add(new LspSemanticTokensFeature(this._connection));
        store.add(new LspDiagnosticsFeature(this._connection));

        return store;
    }
}
