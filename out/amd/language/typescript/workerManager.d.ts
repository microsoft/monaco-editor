import { LanguageServiceDefaults } from './monaco.contribution';
import type { TypeScriptWorker } from './tsWorker';
import { Uri } from '../../fillers/monaco-editor-core';
export declare class WorkerManager {
    private readonly _modeId;
    private readonly _defaults;
    private _configChangeListener;
    private _updateExtraLibsToken;
    private _extraLibsChangeListener;
    private _worker;
    private _client;
    constructor(_modeId: string, _defaults: LanguageServiceDefaults);
    dispose(): void;
    private _stopWorker;
    private _updateExtraLibs;
    private _getClient;
    getLanguageServiceWorker(...resources: Uri[]): Promise<TypeScriptWorker>;
}
