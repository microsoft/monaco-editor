import * as lsTypes from 'vscode-languageserver-types';
import { languages, editor, Uri, Position, IRange, Range, CancellationToken, IDisposable, IEvent } from '../../fillers/monaco-editor-core';
export interface WorkerAccessor<T> {
    (...more: Uri[]): Promise<T>;
}
export interface ILanguageWorkerWithDiagnostics {
    doValidation(uri: string): Promise<lsTypes.Diagnostic[]>;
}
export declare class DiagnosticsAdapter<T extends ILanguageWorkerWithDiagnostics> {
    private readonly _languageId;
    protected readonly _worker: WorkerAccessor<T>;
    protected readonly _disposables: IDisposable[];
    private readonly _listener;
    constructor(_languageId: string, _worker: WorkerAccessor<T>, configChangeEvent: IEvent<any>);
    dispose(): void;
    private _doValidate;
}
export interface ILanguageWorkerWithCompletions {
    doComplete(uri: string, position: lsTypes.Position): Promise<lsTypes.CompletionList | null>;
}
export declare class CompletionAdapter<T extends ILanguageWorkerWithCompletions> implements languages.CompletionItemProvider {
    private readonly _worker;
    private readonly _triggerCharacters;
    constructor(_worker: WorkerAccessor<T>, _triggerCharacters: string[]);
    get triggerCharacters(): string[];
    provideCompletionItems(model: editor.IReadOnlyModel, position: Position, context: languages.CompletionContext, token: CancellationToken): Promise<languages.CompletionList | undefined>;
}
export declare function fromPosition(position: Position): lsTypes.Position;
export declare function fromPosition(position: undefined): undefined;
export declare function fromPosition(position: Position | undefined): lsTypes.Position | undefined;
export declare function fromRange(range: IRange): lsTypes.Range;
export declare function fromRange(range: undefined): undefined;
export declare function fromRange(range: IRange | undefined): lsTypes.Range | undefined;
export declare function toRange(range: lsTypes.Range): Range;
export declare function toRange(range: undefined): undefined;
export declare function toRange(range: lsTypes.Range | undefined): Range | undefined;
export declare function toTextEdit(textEdit: lsTypes.TextEdit): languages.TextEdit;
export declare function toTextEdit(textEdit: undefined): undefined;
export declare function toTextEdit(textEdit: lsTypes.TextEdit | undefined): languages.TextEdit | undefined;
export interface ILanguageWorkerWithHover {
    doHover(uri: string, position: lsTypes.Position): Promise<lsTypes.Hover | null>;
}
export declare class HoverAdapter<T extends ILanguageWorkerWithHover> implements languages.HoverProvider {
    private readonly _worker;
    constructor(_worker: WorkerAccessor<T>);
    provideHover(model: editor.IReadOnlyModel, position: Position, token: CancellationToken): Promise<languages.Hover | undefined>;
}
export interface ILanguageWorkerWithDocumentHighlights {
    findDocumentHighlights(uri: string, position: lsTypes.Position): Promise<lsTypes.DocumentHighlight[]>;
}
export declare class DocumentHighlightAdapter<T extends ILanguageWorkerWithDocumentHighlights> implements languages.DocumentHighlightProvider {
    private readonly _worker;
    constructor(_worker: WorkerAccessor<T>);
    provideDocumentHighlights(model: editor.IReadOnlyModel, position: Position, token: CancellationToken): Promise<languages.DocumentHighlight[] | undefined>;
}
export interface ILanguageWorkerWithDefinitions {
    findDefinition(uri: string, position: lsTypes.Position): Promise<lsTypes.Location | null>;
}
export declare class DefinitionAdapter<T extends ILanguageWorkerWithDefinitions> implements languages.DefinitionProvider {
    private readonly _worker;
    constructor(_worker: WorkerAccessor<T>);
    provideDefinition(model: editor.IReadOnlyModel, position: Position, token: CancellationToken): Promise<languages.Definition | undefined>;
}
export interface ILanguageWorkerWithReferences {
    findReferences(uri: string, position: lsTypes.Position): Promise<lsTypes.Location[]>;
}
export declare class ReferenceAdapter<T extends ILanguageWorkerWithReferences> implements languages.ReferenceProvider {
    private readonly _worker;
    constructor(_worker: WorkerAccessor<T>);
    provideReferences(model: editor.IReadOnlyModel, position: Position, context: languages.ReferenceContext, token: CancellationToken): Promise<languages.Location[] | undefined>;
}
export interface ILanguageWorkerWithRename {
    doRename(uri: string, position: lsTypes.Position, newName: string): Promise<lsTypes.WorkspaceEdit | null>;
}
export declare class RenameAdapter<T extends ILanguageWorkerWithRename> implements languages.RenameProvider {
    private readonly _worker;
    constructor(_worker: WorkerAccessor<T>);
    provideRenameEdits(model: editor.IReadOnlyModel, position: Position, newName: string, token: CancellationToken): Promise<languages.WorkspaceEdit | undefined>;
}
export interface ILanguageWorkerWithDocumentSymbols {
    findDocumentSymbols(uri: string): Promise<lsTypes.SymbolInformation[]>;
}
export declare class DocumentSymbolAdapter<T extends ILanguageWorkerWithDocumentSymbols> implements languages.DocumentSymbolProvider {
    private readonly _worker;
    constructor(_worker: WorkerAccessor<T>);
    provideDocumentSymbols(model: editor.IReadOnlyModel, token: CancellationToken): Promise<languages.DocumentSymbol[] | undefined>;
}
export interface ILanguageWorkerWithDocumentLinks {
    findDocumentLinks(uri: string): Promise<lsTypes.DocumentLink[]>;
}
export declare class DocumentLinkAdapter<T extends ILanguageWorkerWithDocumentLinks> implements languages.LinkProvider {
    private _worker;
    constructor(_worker: WorkerAccessor<T>);
    provideLinks(model: editor.IReadOnlyModel, token: CancellationToken): Promise<languages.ILinksList | undefined>;
}
export interface ILanguageWorkerWithFormat {
    format(uri: string, range: lsTypes.Range | null, options: lsTypes.FormattingOptions): Promise<lsTypes.TextEdit[]>;
}
export declare class DocumentFormattingEditProvider<T extends ILanguageWorkerWithFormat> implements languages.DocumentFormattingEditProvider {
    private _worker;
    constructor(_worker: WorkerAccessor<T>);
    provideDocumentFormattingEdits(model: editor.IReadOnlyModel, options: languages.FormattingOptions, token: CancellationToken): Promise<languages.TextEdit[] | undefined>;
}
export declare class DocumentRangeFormattingEditProvider<T extends ILanguageWorkerWithFormat> implements languages.DocumentRangeFormattingEditProvider {
    private _worker;
    readonly canFormatMultipleRanges = false;
    constructor(_worker: WorkerAccessor<T>);
    provideDocumentRangeFormattingEdits(model: editor.IReadOnlyModel, range: Range, options: languages.FormattingOptions, token: CancellationToken): Promise<languages.TextEdit[] | undefined>;
}
export interface ILanguageWorkerWithDocumentColors {
    findDocumentColors(uri: string): Promise<lsTypes.ColorInformation[]>;
    getColorPresentations(uri: string, color: lsTypes.Color, range: lsTypes.Range): Promise<lsTypes.ColorPresentation[]>;
}
export declare class DocumentColorAdapter<T extends ILanguageWorkerWithDocumentColors> implements languages.DocumentColorProvider {
    private readonly _worker;
    constructor(_worker: WorkerAccessor<T>);
    provideDocumentColors(model: editor.IReadOnlyModel, token: CancellationToken): Promise<languages.IColorInformation[] | undefined>;
    provideColorPresentations(model: editor.IReadOnlyModel, info: languages.IColorInformation, token: CancellationToken): Promise<languages.IColorPresentation[] | undefined>;
}
export interface ILanguageWorkerWithFoldingRanges {
    getFoldingRanges(uri: string, context?: {
        rangeLimit?: number;
    }): Promise<lsTypes.FoldingRange[]>;
}
export declare class FoldingRangeAdapter<T extends ILanguageWorkerWithFoldingRanges> implements languages.FoldingRangeProvider {
    private _worker;
    constructor(_worker: WorkerAccessor<T>);
    provideFoldingRanges(model: editor.IReadOnlyModel, context: languages.FoldingContext, token: CancellationToken): Promise<languages.FoldingRange[] | undefined>;
}
export interface ILanguageWorkerWithSelectionRanges {
    getSelectionRanges(uri: string, positions: lsTypes.Position[]): Promise<lsTypes.SelectionRange[]>;
}
export declare class SelectionRangeAdapter<T extends ILanguageWorkerWithSelectionRanges> implements languages.SelectionRangeProvider {
    private _worker;
    constructor(_worker: WorkerAccessor<T>);
    provideSelectionRanges(model: editor.IReadOnlyModel, positions: Position[], token: CancellationToken): Promise<languages.SelectionRange[][] | undefined>;
}
