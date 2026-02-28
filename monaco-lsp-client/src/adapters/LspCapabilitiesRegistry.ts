import { TypedChannel } from '@hediet/json-rpc';
import { ClientCapabilities, Capability, ServerCapabilities, api, capabilities, TextDocumentChangeRegistrationOptions, TextDocumentSyncKind } from '../../src/types';
import { IDisposable, Disposable } from '../utils';

export interface ILspCapabilitiesRegistry {
    addStaticClientCapabilities(capability: ClientCapabilities): IDisposable;
    registerCapabilityHandler<T>(capability: Capability<T>, handleStaticCapability: boolean, handler: (capability: T) => IDisposable): IDisposable;
}

export class LspCapabilitiesRegistry extends Disposable implements ILspCapabilitiesRegistry {
    private readonly _staticCapabilities = new Set<{ cap: ClientCapabilities; }>();
    private readonly _dynamicFromStatic = DynamicFromStaticOptions.create();
    private readonly _registrations = new Map<Capability<any>, CapabilityInfo<any>>();
    private _serverCapabilities: ServerCapabilities | undefined = undefined;

    constructor(
        private readonly _connection: TypedChannel
    ) {
        super();

        this._register(this._connection.registerRequestHandler(api.client.clientRegisterCapability, async (params) => {
            for (const registration of params.registrations) {
                const capability = getCapabilityByMethod(registration.method);
                const r = new CapabilityRegistration(registration.id, capability, registration.registerOptions, false);
                this._registerCapabilityOptions(r);
            }
            return { ok: null };
        }));

        this._register(this._connection.registerRequestHandler(api.client.clientUnregisterCapability, async (params) => {
            for (const unregistration of params.unregisterations) {
                const capability = getCapabilityByMethod(unregistration.method);
                const info = this._registrations.get(capability);
                const handlerInfo = info?.registrations.get(unregistration.id);
                if (!handlerInfo) {
                    throw new Error(`No registration for method ${unregistration.method} with id ${unregistration.id}`);
                }
                handlerInfo?.handlerDisposables.forEach(d => d.dispose());
                info?.registrations.delete(unregistration.id);
            }
            return { ok: null };
        }));
    }

    private _registerCapabilityOptions<T>(registration: CapabilityRegistration<T>) {
        let registrationForMethod = this._registrations.get(registration.capability);
        if (!registrationForMethod) {
            registrationForMethod = new CapabilityInfo();
            this._registrations.set(registration.capability, registrationForMethod);
        }
        if (registrationForMethod.registrations.has(registration.id)) {
            throw new Error(`Handler for method ${registration.capability.method} with id ${registration.id} already registered`);
        }
        registrationForMethod.registrations.set(registration.id, registration);
        for (const h of registrationForMethod.handlers) {
            if (!h.handleStaticCapability && registration.isFromStatic) {
                continue;
            }
            registration.handlerDisposables.set(h, h.handler(registration.options));
        }
    }

    setServerCapabilities(serverCapabilities: ServerCapabilities) {
        if (this._serverCapabilities) {
            throw new Error('Server capabilities already set');
        }
        this._serverCapabilities = serverCapabilities;
        for (const cap of Object.values(capabilities)) {
            const options = this._dynamicFromStatic.getOptions(cap, serverCapabilities);
            if (options) {
                this._registerCapabilityOptions(new CapabilityRegistration(cap.method, cap, options, true));
            }
        }
    }

    getClientCapabilities(): ClientCapabilities {
        const result: ClientCapabilities = {};
        for (const c of this._staticCapabilities) {
            deepAssign(result, c.cap);
        }
        return result;
    }

    addStaticClientCapabilities(capability: ClientCapabilities): IDisposable {
        const obj = { cap: capability };
        this._staticCapabilities.add(obj);
        return {
            dispose: () => {
                this._staticCapabilities.delete(obj);
            }
        };
    }

    registerCapabilityHandler<T>(capability: Capability<T>, handleStaticCapability: boolean, handler: (capability: T) => IDisposable): IDisposable {
        let info = this._registrations.get(capability);
        if (!info) {
            info = new CapabilityInfo();
            this._registrations.set(capability, info);
        }
        const handlerInfo = new CapabilityHandler(capability, handleStaticCapability, handler);
        info.handlers.add(handlerInfo);

        for (const registration of info.registrations.values()) {
            if (!handlerInfo.handleStaticCapability && registration.isFromStatic) {
                continue;
            }
            registration.handlerDisposables.set(handlerInfo, handler(registration.options));
        }

        return {
            dispose: () => {
                info.handlers.delete(handlerInfo);
                for (const registration of info.registrations.values()) {
                    const disposable = registration.handlerDisposables.get(handlerInfo);
                    if (disposable) {
                        disposable.dispose();
                        registration.handlerDisposables.delete(handlerInfo);
                    }
                }
            }
        };
    }
}

class CapabilityHandler<T> {
    constructor(
        public readonly capability: Capability<T>,
        public readonly handleStaticCapability: boolean,
        public readonly handler: (capabilityOptions: T) => IDisposable
    ) { }
}

class CapabilityRegistration<T> {
    public readonly handlerDisposables = new Map<CapabilityHandler<any>, IDisposable>();

    constructor(
        public readonly id: string,
        public readonly capability: Capability<T>,
        public readonly options: T,
        public readonly isFromStatic: boolean
    ) { }
}

const capabilitiesByMethod = new Map([...Object.values(capabilities)].map(c => [c.method, c]));
function getCapabilityByMethod(method: string): Capability<any> {
    const c = capabilitiesByMethod.get(method);
    if (!c) {
        throw new Error(`No capability found for method ${method}`);
    }
    return c;
}

class CapabilityInfo<T> {
    public readonly handlers = new Set<CapabilityHandler<T>>();
    public readonly registrations = new Map</* id */ string, CapabilityRegistration<T>>();
}

class DynamicFromStaticOptions {
    private readonly _mappings = new Map</* method */ string, (serverCapabilities: ServerCapabilities) => any>();

    public static create(): DynamicFromStaticOptions {
        const o = new DynamicFromStaticOptions();
        o.set(capabilities.textDocumentDidChange, s => {
            if (s.textDocumentSync === undefined) {
                return undefined;
            }
            if (typeof s.textDocumentSync === 'object') {
                return {
                    syncKind: s.textDocumentSync.change ?? TextDocumentSyncKind.None,
                    documentSelector: null,
                } satisfies TextDocumentChangeRegistrationOptions;
            } else {
                return {
                    syncKind: s.textDocumentSync,
                    documentSelector: null,
                } satisfies TextDocumentChangeRegistrationOptions;
            }
            return null!;
        });

        o.set(capabilities.textDocumentCompletion, s => s.completionProvider);
        o.set(capabilities.textDocumentHover, s => s.hoverProvider);
        o.set(capabilities.textDocumentSignatureHelp, s => s.signatureHelpProvider);
        o.set(capabilities.textDocumentDefinition, s => s.definitionProvider);
        o.set(capabilities.textDocumentReferences, s => s.referencesProvider);
        o.set(capabilities.textDocumentDocumentHighlight, s => s.documentHighlightProvider);
        o.set(capabilities.textDocumentDocumentSymbol, s => s.documentSymbolProvider);
        o.set(capabilities.textDocumentCodeAction, s => s.codeActionProvider);
        o.set(capabilities.textDocumentCodeLens, s => s.codeLensProvider);
        o.set(capabilities.textDocumentDocumentLink, s => s.documentLinkProvider);
        o.set(capabilities.textDocumentFormatting, s => s.documentFormattingProvider);
        o.set(capabilities.textDocumentRangeFormatting, s => s.documentRangeFormattingProvider);
        o.set(capabilities.textDocumentOnTypeFormatting, s => s.documentOnTypeFormattingProvider);
        o.set(capabilities.textDocumentRename, s => s.renameProvider);
        o.set(capabilities.textDocumentFoldingRange, s => s.foldingRangeProvider);
        o.set(capabilities.textDocumentDeclaration, s => s.declarationProvider);
        o.set(capabilities.textDocumentTypeDefinition, s => s.typeDefinitionProvider);
        o.set(capabilities.textDocumentImplementation, s => s.implementationProvider);
        o.set(capabilities.textDocumentDocumentColor, s => s.colorProvider);
        o.set(capabilities.textDocumentSelectionRange, s => s.selectionRangeProvider);
        o.set(capabilities.textDocumentLinkedEditingRange, s => s.linkedEditingRangeProvider);
        o.set(capabilities.textDocumentPrepareCallHierarchy, s => s.callHierarchyProvider);
        o.set(capabilities.textDocumentSemanticTokensFull, s => s.semanticTokensProvider);
        o.set(capabilities.textDocumentInlayHint, s => s.inlayHintProvider);
        o.set(capabilities.textDocumentInlineValue, s => s.inlineValueProvider);
        o.set(capabilities.textDocumentDiagnostic, s => s.diagnosticProvider);
        o.set(capabilities.textDocumentMoniker, s => s.monikerProvider);
        o.set(capabilities.textDocumentPrepareTypeHierarchy, s => s.typeHierarchyProvider);
        o.set(capabilities.workspaceSymbol, s => s.workspaceSymbolProvider);
        o.set(capabilities.workspaceExecuteCommand, s => s.executeCommandProvider);
        return o;
    }

    set<T>(capability: Capability<T>, getOptionsFromStatic: (serverCapabilities: ServerCapabilities) => T | boolean | undefined): void {
        if (this._mappings.has(capability.method)) {
            throw new Error(`Capability for method ${capability.method} already registered`);
        }
        this._mappings.set(capability.method, getOptionsFromStatic);
    }

    getOptions<T>(capability: Capability<T>, serverCapabilities: ServerCapabilities): T | undefined {
        const getter = this._mappings.get(capability.method);
        if (!getter) {
            return undefined;
        }
        const result = getter(serverCapabilities);
        return result;
    }
}

function deepAssign(target: any, source: any) {
    for (const key of Object.keys(source)) {
        const srcValue = source[key];
        if (srcValue === undefined) {
            continue;
        }
        const tgtValue = target[key];
        if (tgtValue === undefined) {
            target[key] = srcValue;
            continue;
        }

        if (typeof srcValue !== 'object' || srcValue === null) {
            target[key] = srcValue;
            continue;
        }
        if (typeof tgtValue !== 'object' || tgtValue === null) {
            target[key] = srcValue;
            continue;
        }

        deepAssign(tgtValue, srcValue);
    }
}
