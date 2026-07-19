import * as monaco from 'monaco-editor-core';
import {
    CodeActionKind,
    CodeActionTriggerKind,
    Command,
    CompletionItemKind,
    CompletionItemTag,
    CompletionTriggerKind,
    Diagnostic,
    DiagnosticSeverity,
    DiagnosticTag,
    DocumentHighlightKind,
    DocumentSelector,
    FoldingRangeKind,
    InlayHintKind,
    InsertTextFormat,
    Location,
    LocationLink,
    SignatureHelpTriggerKind,
    SymbolKind,
    SymbolTag,
} from '../../../src/types';
import { LspConnection } from '../LspConnection';

// ============================================================================
// Code Action Kind
// ============================================================================

export const lspCodeActionKindToMonacoCodeActionKind = new Map<CodeActionKind, string>([
    [CodeActionKind.Empty, ''],
    [CodeActionKind.QuickFix, 'quickfix'],
    [CodeActionKind.Refactor, 'refactor'],
    [CodeActionKind.RefactorExtract, 'refactor.extract'],
    [CodeActionKind.RefactorInline, 'refactor.inline'],
    [CodeActionKind.RefactorRewrite, 'refactor.rewrite'],
    [CodeActionKind.Source, 'source'],
    [CodeActionKind.SourceOrganizeImports, 'source.organizeImports'],
    [CodeActionKind.SourceFixAll, 'source.fixAll'],
]);

export function toMonacoCodeActionKind(kind: CodeActionKind | undefined): string | undefined {
    if (!kind) {
        return undefined;
    }
    return lspCodeActionKindToMonacoCodeActionKind.get(kind) ?? kind;
}

// ============================================================================
// Code Action Trigger Kind
// ============================================================================

export const monacoCodeActionTriggerTypeToLspCodeActionTriggerKind = new Map<monaco.languages.CodeActionTriggerType, CodeActionTriggerKind>([
    [monaco.languages.CodeActionTriggerType.Invoke, CodeActionTriggerKind.Invoked],
    [monaco.languages.CodeActionTriggerType.Auto, CodeActionTriggerKind.Automatic],
]);

export function toLspCodeActionTriggerKind(monacoTrigger: monaco.languages.CodeActionTriggerType): CodeActionTriggerKind {
    return monacoCodeActionTriggerTypeToLspCodeActionTriggerKind.get(monacoTrigger) ?? CodeActionTriggerKind.Invoked;
}

// ============================================================================
// Completion Item Kind
// ============================================================================

export const lspCompletionItemKindToMonacoCompletionItemKind = new Map<CompletionItemKind, monaco.languages.CompletionItemKind>([
    [CompletionItemKind.Text, monaco.languages.CompletionItemKind.Text],
    [CompletionItemKind.Method, monaco.languages.CompletionItemKind.Method],
    [CompletionItemKind.Function, monaco.languages.CompletionItemKind.Function],
    [CompletionItemKind.Constructor, monaco.languages.CompletionItemKind.Constructor],
    [CompletionItemKind.Field, monaco.languages.CompletionItemKind.Field],
    [CompletionItemKind.Variable, monaco.languages.CompletionItemKind.Variable],
    [CompletionItemKind.Class, monaco.languages.CompletionItemKind.Class],
    [CompletionItemKind.Interface, monaco.languages.CompletionItemKind.Interface],
    [CompletionItemKind.Module, monaco.languages.CompletionItemKind.Module],
    [CompletionItemKind.Property, monaco.languages.CompletionItemKind.Property],
    [CompletionItemKind.Unit, monaco.languages.CompletionItemKind.Unit],
    [CompletionItemKind.Value, monaco.languages.CompletionItemKind.Value],
    [CompletionItemKind.Enum, monaco.languages.CompletionItemKind.Enum],
    [CompletionItemKind.Keyword, monaco.languages.CompletionItemKind.Keyword],
    [CompletionItemKind.Snippet, monaco.languages.CompletionItemKind.Snippet],
    [CompletionItemKind.Color, monaco.languages.CompletionItemKind.Color],
    [CompletionItemKind.File, monaco.languages.CompletionItemKind.File],
    [CompletionItemKind.Reference, monaco.languages.CompletionItemKind.Reference],
    [CompletionItemKind.Folder, monaco.languages.CompletionItemKind.Folder],
    [CompletionItemKind.EnumMember, monaco.languages.CompletionItemKind.EnumMember],
    [CompletionItemKind.Constant, monaco.languages.CompletionItemKind.Constant],
    [CompletionItemKind.Struct, monaco.languages.CompletionItemKind.Struct],
    [CompletionItemKind.Event, monaco.languages.CompletionItemKind.Event],
    [CompletionItemKind.Operator, monaco.languages.CompletionItemKind.Operator],
    [CompletionItemKind.TypeParameter, monaco.languages.CompletionItemKind.TypeParameter],
]);

export function toMonacoCompletionItemKind(kind: CompletionItemKind | undefined): monaco.languages.CompletionItemKind {
    if (!kind) {
        return monaco.languages.CompletionItemKind.Text;
    }
    return lspCompletionItemKindToMonacoCompletionItemKind.get(kind) ?? monaco.languages.CompletionItemKind.Text;
}

// ============================================================================
// Completion Item Tag
// ============================================================================

export const lspCompletionItemTagToMonacoCompletionItemTag = new Map<CompletionItemTag, monaco.languages.CompletionItemTag>([
    [CompletionItemTag.Deprecated, monaco.languages.CompletionItemTag.Deprecated],
]);

export function toMonacoCompletionItemTag(tag: CompletionItemTag): monaco.languages.CompletionItemTag | undefined {
    return lspCompletionItemTagToMonacoCompletionItemTag.get(tag);
}

// ============================================================================
// Completion Trigger Kind
// ============================================================================

export const monacoCompletionTriggerKindToLspCompletionTriggerKind = new Map<monaco.languages.CompletionTriggerKind, CompletionTriggerKind>([
    [monaco.languages.CompletionTriggerKind.Invoke, CompletionTriggerKind.Invoked],
    [monaco.languages.CompletionTriggerKind.TriggerCharacter, CompletionTriggerKind.TriggerCharacter],
    [monaco.languages.CompletionTriggerKind.TriggerForIncompleteCompletions, CompletionTriggerKind.TriggerForIncompleteCompletions],
]);

export function toLspCompletionTriggerKind(monacoKind: monaco.languages.CompletionTriggerKind): CompletionTriggerKind {
    return monacoCompletionTriggerKindToLspCompletionTriggerKind.get(monacoKind) ?? CompletionTriggerKind.Invoked;
}

// ============================================================================
// Insert Text Format
// ============================================================================

export const lspInsertTextFormatToMonacoInsertTextRules = new Map<InsertTextFormat, monaco.languages.CompletionItemInsertTextRule>([
    [InsertTextFormat.Snippet, monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet],
]);

export function toMonacoInsertTextRules(format: InsertTextFormat | undefined): monaco.languages.CompletionItemInsertTextRule | undefined {
    if (!format) {
        return undefined;
    }
    return lspInsertTextFormatToMonacoInsertTextRules.get(format);
}

// ============================================================================
// Symbol Kind
// ============================================================================

export const lspSymbolKindToMonacoSymbolKind = new Map<SymbolKind, monaco.languages.SymbolKind>([
    [SymbolKind.File, monaco.languages.SymbolKind.File],
    [SymbolKind.Module, monaco.languages.SymbolKind.Module],
    [SymbolKind.Namespace, monaco.languages.SymbolKind.Namespace],
    [SymbolKind.Package, monaco.languages.SymbolKind.Package],
    [SymbolKind.Class, monaco.languages.SymbolKind.Class],
    [SymbolKind.Method, monaco.languages.SymbolKind.Method],
    [SymbolKind.Property, monaco.languages.SymbolKind.Property],
    [SymbolKind.Field, monaco.languages.SymbolKind.Field],
    [SymbolKind.Constructor, monaco.languages.SymbolKind.Constructor],
    [SymbolKind.Enum, monaco.languages.SymbolKind.Enum],
    [SymbolKind.Interface, monaco.languages.SymbolKind.Interface],
    [SymbolKind.Function, monaco.languages.SymbolKind.Function],
    [SymbolKind.Variable, monaco.languages.SymbolKind.Variable],
    [SymbolKind.Constant, monaco.languages.SymbolKind.Constant],
    [SymbolKind.String, monaco.languages.SymbolKind.String],
    [SymbolKind.Number, monaco.languages.SymbolKind.Number],
    [SymbolKind.Boolean, monaco.languages.SymbolKind.Boolean],
    [SymbolKind.Array, monaco.languages.SymbolKind.Array],
    [SymbolKind.Object, monaco.languages.SymbolKind.Object],
    [SymbolKind.Key, monaco.languages.SymbolKind.Key],
    [SymbolKind.Null, monaco.languages.SymbolKind.Null],
    [SymbolKind.EnumMember, monaco.languages.SymbolKind.EnumMember],
    [SymbolKind.Struct, monaco.languages.SymbolKind.Struct],
    [SymbolKind.Event, monaco.languages.SymbolKind.Event],
    [SymbolKind.Operator, monaco.languages.SymbolKind.Operator],
    [SymbolKind.TypeParameter, monaco.languages.SymbolKind.TypeParameter],
]);

export function toMonacoSymbolKind(kind: SymbolKind): monaco.languages.SymbolKind {
    return lspSymbolKindToMonacoSymbolKind.get(kind) ?? monaco.languages.SymbolKind.File;
}

// ============================================================================
// Symbol Tag
// ============================================================================

export const lspSymbolTagToMonacoSymbolTag = new Map<SymbolTag, monaco.languages.SymbolTag>([
    [SymbolTag.Deprecated, monaco.languages.SymbolTag.Deprecated],
]);

export function toMonacoSymbolTag(tag: SymbolTag): monaco.languages.SymbolTag | undefined {
    return lspSymbolTagToMonacoSymbolTag.get(tag);
}

// ============================================================================
// Document Highlight Kind
// ============================================================================

export const lspDocumentHighlightKindToMonacoDocumentHighlightKind = new Map<DocumentHighlightKind, monaco.languages.DocumentHighlightKind>([
    [DocumentHighlightKind.Text, monaco.languages.DocumentHighlightKind.Text],
    [DocumentHighlightKind.Read, monaco.languages.DocumentHighlightKind.Read],
    [DocumentHighlightKind.Write, monaco.languages.DocumentHighlightKind.Write],
]);

export function toMonacoDocumentHighlightKind(kind: DocumentHighlightKind | undefined): monaco.languages.DocumentHighlightKind {
    if (!kind) {
        return monaco.languages.DocumentHighlightKind.Text;
    }
    return lspDocumentHighlightKindToMonacoDocumentHighlightKind.get(kind) ?? monaco.languages.DocumentHighlightKind.Text;
}

// ============================================================================
// Folding Range Kind
// ============================================================================

export const lspFoldingRangeKindToMonacoFoldingRangeKind = new Map<FoldingRangeKind, monaco.languages.FoldingRangeKind>([
    [FoldingRangeKind.Comment, monaco.languages.FoldingRangeKind.Comment],
    [FoldingRangeKind.Imports, monaco.languages.FoldingRangeKind.Imports],
    [FoldingRangeKind.Region, monaco.languages.FoldingRangeKind.Region],
]);

export function toMonacoFoldingRangeKind(kind: FoldingRangeKind | undefined): monaco.languages.FoldingRangeKind | undefined {
    if (!kind) {
        return undefined;
    }
    return lspFoldingRangeKindToMonacoFoldingRangeKind.get(kind);
}

// ============================================================================
// Diagnostic Severity
// ============================================================================

export const monacoMarkerSeverityToLspDiagnosticSeverity = new Map<monaco.MarkerSeverity, DiagnosticSeverity>([
    [monaco.MarkerSeverity.Error, DiagnosticSeverity.Error],
    [monaco.MarkerSeverity.Warning, DiagnosticSeverity.Warning],
    [monaco.MarkerSeverity.Info, DiagnosticSeverity.Information],
    [monaco.MarkerSeverity.Hint, DiagnosticSeverity.Hint],
]);

export function toLspDiagnosticSeverity(severity: monaco.MarkerSeverity): DiagnosticSeverity {
    return monacoMarkerSeverityToLspDiagnosticSeverity.get(severity) ?? DiagnosticSeverity.Error;
}

export const lspDiagnosticSeverityToMonacoMarkerSeverity = new Map<DiagnosticSeverity, monaco.MarkerSeverity>([
    [DiagnosticSeverity.Error, monaco.MarkerSeverity.Error],
    [DiagnosticSeverity.Warning, monaco.MarkerSeverity.Warning],
    [DiagnosticSeverity.Information, monaco.MarkerSeverity.Info],
    [DiagnosticSeverity.Hint, monaco.MarkerSeverity.Hint],
]);

export function toMonacoDiagnosticSeverity(severity: DiagnosticSeverity | undefined): monaco.MarkerSeverity {
    if (!severity) {
        return monaco.MarkerSeverity.Error;
    }
    return lspDiagnosticSeverityToMonacoMarkerSeverity.get(severity) ?? monaco.MarkerSeverity.Error;
}

// ============================================================================
// Diagnostic Tag
// ============================================================================

export const lspDiagnosticTagToMonacoMarkerTag = new Map<DiagnosticTag, monaco.MarkerTag>([
    [DiagnosticTag.Unnecessary, monaco.MarkerTag.Unnecessary],
    [DiagnosticTag.Deprecated, monaco.MarkerTag.Deprecated],
]);

export function toMonacoDiagnosticTag(tag: DiagnosticTag): monaco.MarkerTag | undefined {
    return lspDiagnosticTagToMonacoMarkerTag.get(tag);
}

// ============================================================================
// Signature Help Trigger Kind
// ============================================================================

export const monacoSignatureHelpTriggerKindToLspSignatureHelpTriggerKind = new Map<monaco.languages.SignatureHelpTriggerKind, SignatureHelpTriggerKind>([
    [monaco.languages.SignatureHelpTriggerKind.Invoke, SignatureHelpTriggerKind.Invoked],
    [monaco.languages.SignatureHelpTriggerKind.TriggerCharacter, SignatureHelpTriggerKind.TriggerCharacter],
    [monaco.languages.SignatureHelpTriggerKind.ContentChange, SignatureHelpTriggerKind.ContentChange],
]);

export function toLspSignatureHelpTriggerKind(monacoKind: monaco.languages.SignatureHelpTriggerKind): SignatureHelpTriggerKind {
    return monacoSignatureHelpTriggerKindToLspSignatureHelpTriggerKind.get(monacoKind) ?? SignatureHelpTriggerKind.Invoked;
}

// ============================================================================
// Command
// ============================================================================

export function toMonacoCommand(command: Command | undefined): monaco.languages.Command | undefined {
    if (!command) {
        return undefined;
    }
    return {
        id: command.command,
        title: command.title,
        arguments: command.arguments,
    };
}

// ============================================================================
// Inlay Hint Kind
// ============================================================================

export const lspInlayHintKindToMonacoInlayHintKind = new Map<InlayHintKind, monaco.languages.InlayHintKind>([
    [InlayHintKind.Type, monaco.languages.InlayHintKind.Type],
    [InlayHintKind.Parameter, monaco.languages.InlayHintKind.Parameter],
]);

export function toMonacoInlayHintKind(kind: InlayHintKind | undefined): monaco.languages.InlayHintKind {
    if (!kind) {
        return monaco.languages.InlayHintKind.Type;
    }
    return lspInlayHintKindToMonacoInlayHintKind.get(kind) ?? monaco.languages.InlayHintKind.Type;
} export function toMonacoLocation(
    location: Location | LocationLink,
    client: LspConnection
): monaco.languages.Location | monaco.languages.LocationLink {
    if ('targetUri' in location) {
        // LocationLink
        const translatedRange = client.bridge.translateBackRange({ uri: location.targetUri }, location.targetRange);
        return {
            uri: translatedRange.textModel.uri,
            range: translatedRange.range,
            originSelectionRange: location.originSelectionRange
                ? client.bridge.translateBackRange({ uri: location.targetUri }, location.originSelectionRange).range
                : undefined,
            targetSelectionRange: location.targetSelectionRange
                ? client.bridge.translateBackRange({ uri: location.targetUri }, location.targetSelectionRange).range
                : undefined,
        };
    } else {
        // Location
        const translatedRange = client.bridge.translateBackRange({ uri: location.uri }, location.range);
        return {
            uri: translatedRange.textModel.uri,
            range: translatedRange.range,
        };
    }
}
export function toMonacoLanguageSelector(s: DocumentSelector | null): monaco.languages.LanguageSelector {
    if (!s || s.length === 0) {
        return { language: '*' };
    }
    return s.map<monaco.languages.LanguageFilter>(s => {
        if ('notebook' in s) {
            if (typeof s.notebook === 'string') {
                return { notebookType: s.notebook, language: s.language };
            } else {
                return { notebookType: s.notebook.notebookType, language: s.language, pattern: s.notebook.pattern, scheme: s.notebook.scheme };
            }
        } else {
            return { language: s.language, pattern: s.pattern, scheme: s.scheme };
        }
    });

}
export function matchesDocumentSelector(model: monaco.editor.ITextModel, selector: DocumentSelector | null): boolean {
    if (!selector) {
        return true;
    }
    const languageId = model.getLanguageId();
    const uri = model.uri.toString(true);

    if (!selector || selector.length === 0) {
        return true;
    }

    for (const filter of selector) {
        if (filter.language && filter.language !== '*' && filter.language !== languageId) {
            continue;
        }
        return true;
    }

    return false;
}
export function toDiagnosticMarker(diagnostic: Diagnostic): monaco.editor.IMarkerData {
    const marker: monaco.editor.IMarkerData = {
        severity: toMonacoDiagnosticSeverity(diagnostic.severity),
        startLineNumber: diagnostic.range.start.line + 1,
        startColumn: diagnostic.range.start.character + 1,
        endLineNumber: diagnostic.range.end.line + 1,
        endColumn: diagnostic.range.end.character + 1,
        message: diagnostic.message,
        source: diagnostic.source,
        code: typeof diagnostic.code === 'string' ? diagnostic.code : diagnostic.code?.toString(),
    };

    if (diagnostic.tags) {
        marker.tags = diagnostic.tags.map(tag => toMonacoDiagnosticTag(tag)).filter((tag): tag is monaco.MarkerTag => tag !== undefined);
    }

    if (diagnostic.relatedInformation) {
        marker.relatedInformation = diagnostic.relatedInformation.map(info => ({
            resource: monaco.Uri.parse(info.location.uri),
            startLineNumber: info.location.range.start.line + 1,
            startColumn: info.location.range.start.character + 1,
            endLineNumber: info.location.range.end.line + 1,
            endColumn: info.location.range.end.character + 1,
            message: info.message,
        }));
    }

    return marker;
}

