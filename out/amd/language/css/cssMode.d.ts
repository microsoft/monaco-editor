import { LanguageServiceDefaults } from './monaco.contribution';
import { IDisposable } from '../../fillers/monaco-editor-core';
export declare function setupMode(defaults: LanguageServiceDefaults): IDisposable;
export { WorkerManager } from './workerManager';
export * from '../common/lspLanguageFeatures';
