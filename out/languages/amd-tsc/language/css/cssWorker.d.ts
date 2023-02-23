import type { worker } from '../../fillers/monaco-editor-core';
import * as cssService from 'vscode-css-languageservice';
import { Options } from './monaco.contribution';
export declare class CSSWorker {
    private _ctx;
    private _languageService;
    private _languageSettings;
    private _languageId;
    constructor(ctx: worker.IWorkerContext, createData: ICreateData);
    doValidation(uri: string): Promise<cssService.Diagnostic[]>;
    doComplete(uri: string, position: cssService.Position): Promise<cssService.CompletionList | null>;
    doHover(uri: string, position: cssService.Position): Promise<cssService.Hover | null>;
    findDefinition(uri: string, position: cssService.Position): Promise<cssService.Location | null>;
    findReferences(uri: string, position: cssService.Position): Promise<cssService.Location[]>;
    findDocumentHighlights(uri: string, position: cssService.Position): Promise<cssService.DocumentHighlight[]>;
    findDocumentSymbols(uri: string): Promise<cssService.SymbolInformation[]>;
    doCodeActions(uri: string, range: cssService.Range, context: cssService.CodeActionContext): Promise<cssService.Command[]>;
    findDocumentColors(uri: string): Promise<cssService.ColorInformation[]>;
    getColorPresentations(uri: string, color: cssService.Color, range: cssService.Range): Promise<cssService.ColorPresentation[]>;
    getFoldingRanges(uri: string, context?: {
        rangeLimit?: number;
    }): Promise<cssService.FoldingRange[]>;
    getSelectionRanges(uri: string, positions: cssService.Position[]): Promise<cssService.SelectionRange[]>;
    doRename(uri: string, position: cssService.Position, newName: string): Promise<cssService.WorkspaceEdit | null>;
    format(uri: string, range: cssService.Range | null, options: cssService.CSSFormatConfiguration): Promise<cssService.TextEdit[]>;
    private _getTextDocument;
}
export interface ICreateData {
    languageId: string;
    options: Options;
}
export declare function create(ctx: worker.IWorkerContext, createData: ICreateData): CSSWorker;
