import * as jsonService from 'vscode-json-languageservice';
import type { worker } from '../../fillers/monaco-editor-core';
import { DiagnosticsOptions } from './monaco.contribution';
export declare class JSONWorker {
    private _ctx;
    private _languageService;
    private _languageSettings;
    private _languageId;
    constructor(ctx: worker.IWorkerContext, createData: ICreateData);
    doValidation(uri: string): Promise<jsonService.Diagnostic[]>;
    doComplete(uri: string, position: jsonService.Position): Promise<jsonService.CompletionList | null>;
    doResolve(item: jsonService.CompletionItem): Promise<jsonService.CompletionItem>;
    doHover(uri: string, position: jsonService.Position): Promise<jsonService.Hover | null>;
    format(uri: string, range: jsonService.Range | null, options: jsonService.FormattingOptions): Promise<jsonService.TextEdit[]>;
    resetSchema(uri: string): Promise<boolean>;
    findDocumentSymbols(uri: string): Promise<jsonService.SymbolInformation[]>;
    findDocumentColors(uri: string): Promise<jsonService.ColorInformation[]>;
    getColorPresentations(uri: string, color: jsonService.Color, range: jsonService.Range): Promise<jsonService.ColorPresentation[]>;
    getFoldingRanges(uri: string, context?: {
        rangeLimit?: number;
    }): Promise<jsonService.FoldingRange[]>;
    getSelectionRanges(uri: string, positions: jsonService.Position[]): Promise<jsonService.SelectionRange[]>;
    private _getTextDocument;
}
export interface ICreateData {
    languageId: string;
    languageSettings: DiagnosticsOptions;
    enableSchemaRequest: boolean;
}
export declare function create(ctx: worker.IWorkerContext, createData: ICreateData): JSONWorker;
