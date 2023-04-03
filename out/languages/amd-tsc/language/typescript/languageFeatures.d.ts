import { LanguageServiceDefaults } from './monaco.contribution';
import type * as ts from './lib/typescriptServices';
import type { TypeScriptWorker } from './tsWorker';
import { editor, languages, Uri, Position, Range, CancellationToken, IRange } from '../../fillers/monaco-editor-core';
export declare function flattenDiagnosticMessageText(diag: string | ts.DiagnosticMessageChain | undefined, newLine: string, indent?: number): string;
export declare abstract class Adapter {
    protected _worker: (...uris: Uri[]) => Promise<TypeScriptWorker>;
    constructor(_worker: (...uris: Uri[]) => Promise<TypeScriptWorker>);
    protected _textSpanToRange(model: editor.ITextModel, span: ts.TextSpan): IRange;
}
export declare class LibFiles {
    private readonly _worker;
    private _libFiles;
    private _hasFetchedLibFiles;
    private _fetchLibFilesPromise;
    constructor(_worker: (...uris: Uri[]) => Promise<TypeScriptWorker>);
    isLibFile(uri: Uri | null): boolean;
    getOrCreateModel(fileName: string): editor.ITextModel | null;
    private _containsLibFile;
    fetchLibFilesIfNecessary(uris: (Uri | null)[]): Promise<void>;
    private _fetchLibFiles;
}
export declare class DiagnosticsAdapter extends Adapter {
    private readonly _libFiles;
    private _defaults;
    private _selector;
    private _disposables;
    private _listener;
    constructor(_libFiles: LibFiles, _defaults: LanguageServiceDefaults, _selector: string, worker: (...uris: Uri[]) => Promise<TypeScriptWorker>);
    dispose(): void;
    private _doValidate;
    private _convertDiagnostics;
    private _convertRelatedInformation;
    private _tsDiagnosticCategoryToMarkerSeverity;
}
export declare class SuggestAdapter extends Adapter implements languages.CompletionItemProvider {
    get triggerCharacters(): string[];
    provideCompletionItems(model: editor.ITextModel, position: Position, _context: languages.CompletionContext, token: CancellationToken): Promise<languages.CompletionList | undefined>;
    resolveCompletionItem(item: languages.CompletionItem, token: CancellationToken): Promise<languages.CompletionItem>;
    private static convertKind;
    private static createDocumentationString;
}
export declare class SignatureHelpAdapter extends Adapter implements languages.SignatureHelpProvider {
    signatureHelpTriggerCharacters: string[];
    private static _toSignatureHelpTriggerReason;
    provideSignatureHelp(model: editor.ITextModel, position: Position, token: CancellationToken, context: languages.SignatureHelpContext): Promise<languages.SignatureHelpResult | undefined>;
}
export declare class QuickInfoAdapter extends Adapter implements languages.HoverProvider {
    provideHover(model: editor.ITextModel, position: Position, token: CancellationToken): Promise<languages.Hover | undefined>;
}
export declare class DocumentHighlightAdapter extends Adapter implements languages.DocumentHighlightProvider {
    provideDocumentHighlights(model: editor.ITextModel, position: Position, token: CancellationToken): Promise<languages.DocumentHighlight[] | undefined>;
}
export declare class DefinitionAdapter extends Adapter {
    private readonly _libFiles;
    constructor(_libFiles: LibFiles, worker: (...uris: Uri[]) => Promise<TypeScriptWorker>);
    provideDefinition(model: editor.ITextModel, position: Position, token: CancellationToken): Promise<languages.Definition | undefined>;
}
export declare class ReferenceAdapter extends Adapter implements languages.ReferenceProvider {
    private readonly _libFiles;
    constructor(_libFiles: LibFiles, worker: (...uris: Uri[]) => Promise<TypeScriptWorker>);
    provideReferences(model: editor.ITextModel, position: Position, context: languages.ReferenceContext, token: CancellationToken): Promise<languages.Location[] | undefined>;
}
export declare class OutlineAdapter extends Adapter implements languages.DocumentSymbolProvider {
    provideDocumentSymbols(model: editor.ITextModel, token: CancellationToken): Promise<languages.DocumentSymbol[] | undefined>;
}
export declare class Kind {
    static unknown: string;
    static keyword: string;
    static script: string;
    static module: string;
    static class: string;
    static interface: string;
    static type: string;
    static enum: string;
    static variable: string;
    static localVariable: string;
    static function: string;
    static localFunction: string;
    static memberFunction: string;
    static memberGetAccessor: string;
    static memberSetAccessor: string;
    static memberVariable: string;
    static constructorImplementation: string;
    static callSignature: string;
    static indexSignature: string;
    static constructSignature: string;
    static parameter: string;
    static typeParameter: string;
    static primitiveType: string;
    static label: string;
    static alias: string;
    static const: string;
    static let: string;
    static warning: string;
}
export declare abstract class FormatHelper extends Adapter {
    protected static _convertOptions(options: languages.FormattingOptions): ts.FormatCodeOptions;
    protected _convertTextChanges(model: editor.ITextModel, change: ts.TextChange): languages.TextEdit;
}
export declare class FormatAdapter extends FormatHelper implements languages.DocumentRangeFormattingEditProvider {
    readonly canFormatMultipleRanges = false;
    provideDocumentRangeFormattingEdits(model: editor.ITextModel, range: Range, options: languages.FormattingOptions, token: CancellationToken): Promise<languages.TextEdit[] | undefined>;
}
export declare class FormatOnTypeAdapter extends FormatHelper implements languages.OnTypeFormattingEditProvider {
    get autoFormatTriggerCharacters(): string[];
    provideOnTypeFormattingEdits(model: editor.ITextModel, position: Position, ch: string, options: languages.FormattingOptions, token: CancellationToken): Promise<languages.TextEdit[] | undefined>;
}
export declare class CodeActionAdaptor extends FormatHelper implements languages.CodeActionProvider {
    provideCodeActions(model: editor.ITextModel, range: Range, context: languages.CodeActionContext, token: CancellationToken): Promise<languages.CodeActionList | undefined>;
    private _tsCodeFixActionToMonacoCodeAction;
}
export declare class RenameAdapter extends Adapter implements languages.RenameProvider {
    private readonly _libFiles;
    constructor(_libFiles: LibFiles, worker: (...uris: Uri[]) => Promise<TypeScriptWorker>);
    provideRenameEdits(model: editor.ITextModel, position: Position, newName: string, token: CancellationToken): Promise<(languages.WorkspaceEdit & languages.Rejection) | undefined>;
}
export declare class InlayHintsAdapter extends Adapter implements languages.InlayHintsProvider {
    provideInlayHints(model: editor.ITextModel, range: Range, token: CancellationToken): Promise<languages.InlayHintList | null>;
    private _convertHintKind;
}
