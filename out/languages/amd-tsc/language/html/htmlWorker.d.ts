import { worker } from '../../fillers/monaco-editor-core';
import * as htmlService from 'vscode-html-languageservice';
import type { Options } from './monaco.contribution';
export declare class HTMLWorker {
    private _ctx;
    private _languageService;
    private _languageSettings;
    private _languageId;
    constructor(ctx: worker.IWorkerContext, createData: ICreateData);
    doComplete(uri: string, position: htmlService.Position): Promise<htmlService.CompletionList | null>;
    format(uri: string, range: htmlService.Range, options: htmlService.FormattingOptions): Promise<htmlService.TextEdit[]>;
    doHover(uri: string, position: htmlService.Position): Promise<htmlService.Hover | null>;
    findDocumentHighlights(uri: string, position: htmlService.Position): Promise<htmlService.DocumentHighlight[]>;
    findDocumentLinks(uri: string): Promise<htmlService.DocumentLink[]>;
    findDocumentSymbols(uri: string): Promise<htmlService.SymbolInformation[]>;
    getFoldingRanges(uri: string, context?: {
        rangeLimit?: number;
    }): Promise<htmlService.FoldingRange[]>;
    getSelectionRanges(uri: string, positions: htmlService.Position[]): Promise<htmlService.SelectionRange[]>;
    doRename(uri: string, position: htmlService.Position, newName: string): Promise<htmlService.WorkspaceEdit | null>;
    private _getTextDocument;
}
export interface ICreateData {
    languageId: string;
    languageSettings: Options;
}
export declare function create(ctx: worker.IWorkerContext, createData: ICreateData): HTMLWorker;
