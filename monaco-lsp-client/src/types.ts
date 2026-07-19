// Generated TypeScript definitions for LSP
// Protocol version: 3.17.0
// This file is auto-generated. Do not edit manually.

import {
    contract, unverifiedRequest,
    unverifiedNotification
} from "@hediet/json-rpc";

/**
 * A set of predefined token types. This set is not fixed
 * an clients can specify additional token types via the
 * corresponding client capabilities.
 * 
 * @since 3.16.0
 */
export enum SemanticTokenTypes {
    namespace = 'namespace',
    /**
     * Represents a generic type. Acts as a fallback for types which can't be mapped to
 * a specific type like class or enum.
     */
    type = 'type',
    class = 'class',
    enum = 'enum',
    interface = 'interface',
    struct = 'struct',
    typeParameter = 'typeParameter',
    parameter = 'parameter',
    variable = 'variable',
    property = 'property',
    enumMember = 'enumMember',
    event = 'event',
    function = 'function',
    method = 'method',
    macro = 'macro',
    keyword = 'keyword',
    modifier = 'modifier',
    comment = 'comment',
    string = 'string',
    number = 'number',
    regexp = 'regexp',
    operator = 'operator',
    /**
     * @since 3.17.0
     */
    decorator = 'decorator'
}

/**
 * A set of predefined token modifiers. This set is not fixed
 * an clients can specify additional token types via the
 * corresponding client capabilities.
 * 
 * @since 3.16.0
 */
export enum SemanticTokenModifiers {
    declaration = 'declaration',
    definition = 'definition',
    readonly = 'readonly',
    static = 'static',
    deprecated = 'deprecated',
    abstract = 'abstract',
    async = 'async',
    modification = 'modification',
    documentation = 'documentation',
    defaultLibrary = 'defaultLibrary'
}

/**
 * The document diagnostic report kinds.
 * 
 * @since 3.17.0
 */
export enum DocumentDiagnosticReportKind {
    /**
     * A diagnostic report with a full
 * set of problems.
     */
    Full = 'full',
    /**
     * A report indicating that the last
 * returned report is still accurate.
     */
    Unchanged = 'unchanged'
}

/**
 * Predefined error codes.
 */
export enum ErrorCodes {
    ParseError = -32700,
    InvalidRequest = -32600,
    MethodNotFound = -32601,
    InvalidParams = -32602,
    InternalError = -32603,
    /**
     * Error code indicating that a server received a notification or
 * request before the server has received the `initialize` request.
     */
    ServerNotInitialized = -32002,
    UnknownErrorCode = -32001
}

export enum LSPErrorCodes {
    /**
     * A request failed but it was syntactically correct, e.g the
 * method name was known and the parameters were valid. The error
 * message should contain human readable information about why
 * the request failed.
 * 
 * @since 3.17.0
     */
    RequestFailed = -32803,
    /**
     * The server cancelled the request. This error code should
 * only be used for requests that explicitly support being
 * server cancellable.
 * 
 * @since 3.17.0
     */
    ServerCancelled = -32802,
    /**
     * The server detected that the content of a document got
 * modified outside normal conditions. A server should
 * NOT send this error code if it detects a content change
 * in it unprocessed messages. The result even computed
 * on an older state might still be useful for the client.
 * 
 * If a client decides that a result is not of any use anymore
 * the client should cancel the request.
     */
    ContentModified = -32801,
    /**
     * The client has canceled a request and a server has detected
 * the cancel.
     */
    RequestCancelled = -32800
}

/**
 * A set of predefined range kinds.
 */
export enum FoldingRangeKind {
    /**
     * Folding range for a comment
     */
    Comment = 'comment',
    /**
     * Folding range for an import or include
     */
    Imports = 'imports',
    /**
     * Folding range for a region (e.g. `#region`)
     */
    Region = 'region'
}

/**
 * A symbol kind.
 */
export enum SymbolKind {
    File = 1,
    Module = 2,
    Namespace = 3,
    Package = 4,
    Class = 5,
    Method = 6,
    Property = 7,
    Field = 8,
    Constructor = 9,
    Enum = 10,
    Interface = 11,
    Function = 12,
    Variable = 13,
    Constant = 14,
    String = 15,
    Number = 16,
    Boolean = 17,
    Array = 18,
    Object = 19,
    Key = 20,
    Null = 21,
    EnumMember = 22,
    Struct = 23,
    Event = 24,
    Operator = 25,
    TypeParameter = 26
}

/**
 * Symbol tags are extra annotations that tweak the rendering of a symbol.
 * 
 * @since 3.16
 */
export enum SymbolTag {
    /**
     * Render a symbol as obsolete, usually using a strike-out.
     */
    Deprecated = 1
}

/**
 * Moniker uniqueness level to define scope of the moniker.
 * 
 * @since 3.16.0
 */
export enum UniquenessLevel {
    /**
     * The moniker is only unique inside a document
     */
    document = 'document',
    /**
     * The moniker is unique inside a project for which a dump got created
     */
    project = 'project',
    /**
     * The moniker is unique inside the group to which a project belongs
     */
    group = 'group',
    /**
     * The moniker is unique inside the moniker scheme.
     */
    scheme = 'scheme',
    /**
     * The moniker is globally unique
     */
    global = 'global'
}

/**
 * The moniker kind.
 * 
 * @since 3.16.0
 */
export enum MonikerKind {
    /**
     * The moniker represent a symbol that is imported into a project
     */
    import = 'import',
    /**
     * The moniker represents a symbol that is exported from a project
     */
    export = 'export',
    /**
     * The moniker represents a symbol that is local to a project (e.g. a local
 * variable of a function, a class not visible outside the project, ...)
     */
    local = 'local'
}

/**
 * Inlay hint kinds.
 * 
 * @since 3.17.0
 */
export enum InlayHintKind {
    /**
     * An inlay hint that for a type annotation.
     */
    Type = 1,
    /**
     * An inlay hint that is for a parameter.
     */
    Parameter = 2
}

/**
 * The message type
 */
export enum MessageType {
    /**
     * An error message.
     */
    Error = 1,
    /**
     * A warning message.
     */
    Warning = 2,
    /**
     * An information message.
     */
    Info = 3,
    /**
     * A log message.
     */
    Log = 4,
    /**
     * A debug message.
 * 
 * @since 3.18.0
     */
    Debug = 5
}

/**
 * Defines how the host (editor) should sync
 * document changes to the language server.
 */
export enum TextDocumentSyncKind {
    /**
     * Documents should not be synced at all.
     */
    None = 0,
    /**
     * Documents are synced by always sending the full content
 * of the document.
     */
    Full = 1,
    /**
     * Documents are synced by sending the full content on open.
 * After that only incremental updates to the document are
 * send.
     */
    Incremental = 2
}

/**
 * Represents reasons why a text document is saved.
 */
export enum TextDocumentSaveReason {
    /**
     * Manually triggered, e.g. by the user pressing save, by starting debugging,
 * or by an API call.
     */
    Manual = 1,
    /**
     * Automatic after a delay.
     */
    AfterDelay = 2,
    /**
     * When the editor lost focus.
     */
    FocusOut = 3
}

/**
 * The kind of a completion entry.
 */
export enum CompletionItemKind {
    Text = 1,
    Method = 2,
    Function = 3,
    Constructor = 4,
    Field = 5,
    Variable = 6,
    Class = 7,
    Interface = 8,
    Module = 9,
    Property = 10,
    Unit = 11,
    Value = 12,
    Enum = 13,
    Keyword = 14,
    Snippet = 15,
    Color = 16,
    File = 17,
    Reference = 18,
    Folder = 19,
    EnumMember = 20,
    Constant = 21,
    Struct = 22,
    Event = 23,
    Operator = 24,
    TypeParameter = 25
}

/**
 * Completion item tags are extra annotations that tweak the rendering of a completion
 * item.
 * 
 * @since 3.15.0
 */
export enum CompletionItemTag {
    /**
     * Render a completion as obsolete, usually using a strike-out.
     */
    Deprecated = 1
}

/**
 * Defines whether the insert text in a completion item should be interpreted as
 * plain text or a snippet.
 */
export enum InsertTextFormat {
    /**
     * The primary text to be inserted is treated as a plain string.
     */
    PlainText = 1,
    /**
     * The primary text to be inserted is treated as a snippet.
 * 
 * A snippet can define tab stops and placeholders with `$1`, `$2`
 * and `${3:foo}`. `$0` defines the final tab stop, it defaults to
 * the end of the snippet. Placeholders with equal identifiers are linked,
 * that is typing in one will update others too.
 * 
 * See also: https://microsoft.github.io/language-server-protocol/specifications/specification-current/#snippet_syntax
     */
    Snippet = 2
}

/**
 * How whitespace and indentation is handled during completion
 * item insertion.
 * 
 * @since 3.16.0
 */
export enum InsertTextMode {
    /**
     * The insertion or replace strings is taken as it is. If the
 * value is multi line the lines below the cursor will be
 * inserted using the indentation defined in the string value.
 * The client will not apply any kind of adjustments to the
 * string.
     */
    asIs = 1,
    /**
     * The editor adjusts leading whitespace of new lines so that
 * they match the indentation up to the cursor of the line for
 * which the item is accepted.
 * 
 * Consider a line like this: <2tabs><cursor><3tabs>foo. Accepting a
 * multi line completion item is indented using 2 tabs and all
 * following lines inserted will be indented using 2 tabs as well.
     */
    adjustIndentation = 2
}

/**
 * A document highlight kind.
 */
export enum DocumentHighlightKind {
    /**
     * A textual occurrence.
     */
    Text = 1,
    /**
     * Read-access of a symbol, like reading a variable.
     */
    Read = 2,
    /**
     * Write-access of a symbol, like writing to a variable.
     */
    Write = 3
}

/**
 * A set of predefined code action kinds
 */
export enum CodeActionKind {
    /**
     * Empty kind.
     */
    Empty = '',
    /**
     * Base kind for quickfix actions: 'quickfix'
     */
    QuickFix = 'quickfix',
    /**
     * Base kind for refactoring actions: 'refactor'
     */
    Refactor = 'refactor',
    /**
     * Base kind for refactoring extraction actions: 'refactor.extract'
 * 
 * Example extract actions:
 * 
 * - Extract method
 * - Extract function
 * - Extract variable
 * - Extract interface from class
 * - ...
     */
    RefactorExtract = 'refactor.extract',
    /**
     * Base kind for refactoring inline actions: 'refactor.inline'
 * 
 * Example inline actions:
 * 
 * - Inline function
 * - Inline variable
 * - Inline constant
 * - ...
     */
    RefactorInline = 'refactor.inline',
    /**
     * Base kind for refactoring rewrite actions: 'refactor.rewrite'
 * 
 * Example rewrite actions:
 * 
 * - Convert JavaScript function to class
 * - Add or remove parameter
 * - Encapsulate field
 * - Make method static
 * - Move method to base class
 * - ...
     */
    RefactorRewrite = 'refactor.rewrite',
    /**
     * Base kind for source actions: `source`
 * 
 * Source code actions apply to the entire file.
     */
    Source = 'source',
    /**
     * Base kind for an organize imports source action: `source.organizeImports`
     */
    SourceOrganizeImports = 'source.organizeImports',
    /**
     * Base kind for auto-fix source actions: `source.fixAll`.
 * 
 * Fix all actions automatically fix errors that have a clear fix that do not require user input.
 * They should not suppress errors or perform unsafe fixes such as generating new types or classes.
 * 
 * @since 3.15.0
     */
    SourceFixAll = 'source.fixAll'
}

export enum TraceValues {
    /**
     * Turn tracing off.
     */
    Off = 'off',
    /**
     * Trace messages only.
     */
    Messages = 'messages',
    /**
     * Verbose message tracing.
     */
    Verbose = 'verbose'
}

/**
 * Describes the content type that a client supports in various
 * result literals like `Hover`, `ParameterInfo` or `CompletionItem`.
 * 
 * Please note that `MarkupKinds` must not start with a `$`. This kinds
 * are reserved for internal usage.
 */
export enum MarkupKind {
    /**
     * Plain text is supported as a content format
     */
    PlainText = 'plaintext',
    /**
     * Markdown is supported as a content format
     */
    Markdown = 'markdown'
}

/**
 * Describes how an {@link InlineCompletionItemProvider inline completion provider} was triggered.
 * 
 * @since 3.18.0
 * @proposed
 */
export enum InlineCompletionTriggerKind {
    /**
     * Completion was triggered explicitly by a user gesture.
     */
    Invoked = 0,
    /**
     * Completion was triggered automatically while editing.
     */
    Automatic = 1
}

/**
 * A set of predefined position encoding kinds.
 * 
 * @since 3.17.0
 */
export enum PositionEncodingKind {
    /**
     * Character offsets count UTF-8 code units (e.g. bytes).
     */
    UTF8 = 'utf-8',
    /**
     * Character offsets count UTF-16 code units.
 * 
 * This is the default and must always be supported
 * by servers
     */
    UTF16 = 'utf-16',
    /**
     * Character offsets count UTF-32 code units.
 * 
 * Implementation note: these are the same as Unicode codepoints,
 * so this `PositionEncodingKind` may also be used for an
 * encoding-agnostic representation of character offsets.
     */
    UTF32 = 'utf-32'
}

/**
 * The file event type
 */
export enum FileChangeType {
    /**
     * The file got created.
     */
    Created = 1,
    /**
     * The file got changed.
     */
    Changed = 2,
    /**
     * The file got deleted.
     */
    Deleted = 3
}

export enum WatchKind {
    /**
     * Interested in create events.
     */
    Create = 1,
    /**
     * Interested in change events
     */
    Change = 2,
    /**
     * Interested in delete events
     */
    Delete = 4
}

/**
 * The diagnostic's severity.
 */
export enum DiagnosticSeverity {
    /**
     * Reports an error.
     */
    Error = 1,
    /**
     * Reports a warning.
     */
    Warning = 2,
    /**
     * Reports an information.
     */
    Information = 3,
    /**
     * Reports a hint.
     */
    Hint = 4
}

/**
 * The diagnostic tags.
 * 
 * @since 3.15.0
 */
export enum DiagnosticTag {
    /**
     * Unused or unnecessary code.
 * 
 * Clients are allowed to render diagnostics with this tag faded out instead of having
 * an error squiggle.
     */
    Unnecessary = 1,
    /**
     * Deprecated or obsolete code.
 * 
 * Clients are allowed to rendered diagnostics with this tag strike through.
     */
    Deprecated = 2
}

/**
 * How a completion was triggered
 */
export enum CompletionTriggerKind {
    /**
     * Completion was triggered by typing an identifier (24x7 code
 * complete), manual invocation (e.g Ctrl+Space) or via API.
     */
    Invoked = 1,
    /**
     * Completion was triggered by a trigger character specified by
 * the `triggerCharacters` properties of the `CompletionRegistrationOptions`.
     */
    TriggerCharacter = 2,
    /**
     * Completion was re-triggered as current completion list is incomplete
     */
    TriggerForIncompleteCompletions = 3
}

/**
 * How a signature help was triggered.
 * 
 * @since 3.15.0
 */
export enum SignatureHelpTriggerKind {
    /**
     * Signature help was invoked manually by the user or by a command.
     */
    Invoked = 1,
    /**
     * Signature help was triggered by a trigger character.
     */
    TriggerCharacter = 2,
    /**
     * Signature help was triggered by the cursor moving or by the document content changing.
     */
    ContentChange = 3
}

/**
 * The reason why code actions were requested.
 * 
 * @since 3.17.0
 */
export enum CodeActionTriggerKind {
    /**
     * Code actions were explicitly requested by the user or by an extension.
     */
    Invoked = 1,
    /**
     * Code actions were requested automatically.
 * 
 * This typically happens when current selection in a file changes, but can
 * also be triggered when file content changes.
     */
    Automatic = 2
}

/**
 * A pattern kind describing if a glob pattern matches a file a folder or
 * both.
 * 
 * @since 3.16.0
 */
export enum FileOperationPatternKind {
    /**
     * The pattern matches a file only.
     */
    file = 'file',
    /**
     * The pattern matches a folder only.
     */
    folder = 'folder'
}

/**
 * A notebook cell kind.
 * 
 * @since 3.17.0
 */
export enum NotebookCellKind {
    /**
     * A markup-cell is formatted source that is used for display.
     */
    Markup = 1,
    /**
     * A code-cell is source code.
     */
    Code = 2
}

export enum ResourceOperationKind {
    /**
     * Supports creating new files and folders.
     */
    Create = 'create',
    /**
     * Supports renaming existing files and folders.
     */
    Rename = 'rename',
    /**
     * Supports deleting existing files and folders.
     */
    Delete = 'delete'
}

export enum FailureHandlingKind {
    /**
     * Applying the workspace change is simply aborted if one of the changes provided
 * fails. All operations executed before the failing operation stay executed.
     */
    Abort = 'abort',
    /**
     * All operations are executed transactional. That means they either all
 * succeed or no changes at all are applied to the workspace.
     */
    Transactional = 'transactional',
    /**
     * If the workspace edit contains only textual file changes they are executed transactional.
 * If resource changes (create, rename or delete file) are part of the change the failure
 * handling strategy is abort.
     */
    TextOnlyTransactional = 'textOnlyTransactional',
    /**
     * The client tries to undo the operations already executed. But there is no
 * guarantee that this is succeeding.
     */
    Undo = 'undo'
}

export enum PrepareSupportDefaultBehavior {
    /**
     * The client's default behavior is to select the identifier
 * according the to language's syntax rule.
     */
    Identifier = 1
}

export enum TokenFormat {
    Relative = 'relative'
}

/**
 * The definition of a symbol represented as one or many {@link Location locations}.
 * For most programming languages there is only one location at which a symbol is
 * defined.
 * 
 * Servers should prefer returning `DefinitionLink` over `Definition` if supported
 * by the client.
 */
export type Definition = Location | (Location)[];

/**
 * Information about where a symbol is defined.
 * 
 * Provides additional metadata over normal {@link Location location} definitions, including the range of
 * the defining symbol
 */
export type DefinitionLink = LocationLink;

/**
 * LSP arrays.
 * @since 3.17.0
 */
export type LSPArray = (LSPAny)[];

/**
 * The LSP any type.
 * Please note that strictly speaking a property with the value `undefined`
 * can't be converted into JSON preserving the property name. However for
 * convenience it is allowed and assumed that all these properties are
 * optional as well.
 * @since 3.17.0
 */
export type LSPAny = LSPObject | LSPArray | string | number | number | number | boolean | null;

/**
 * The declaration of a symbol representation as one or many {@link Location locations}.
 */
export type Declaration = Location | (Location)[];

/**
 * Information about where a symbol is declared.
 * 
 * Provides additional metadata over normal {@link Location location} declarations, including the range of
 * the declaring symbol.
 * 
 * Servers should prefer returning `DeclarationLink` over `Declaration` if supported
 * by the client.
 */
export type DeclarationLink = LocationLink;

/**
 * Inline value information can be provided by different means:
 * - directly as a text value (class InlineValueText).
 * - as a name to use for a variable lookup (class InlineValueVariableLookup)
 * - as an evaluatable expression (class InlineValueEvaluatableExpression)
 * The InlineValue types combines all inline value types into one type.
 * 
 * @since 3.17.0
 */
export type InlineValue = InlineValueText | InlineValueVariableLookup | InlineValueEvaluatableExpression;

/**
 * The result of a document diagnostic pull request. A report can
 * either be a full report containing all diagnostics for the
 * requested document or an unchanged report indicating that nothing
 * has changed in terms of diagnostics in comparison to the last
 * pull request.
 * 
 * @since 3.17.0
 */
export type DocumentDiagnosticReport = RelatedFullDocumentDiagnosticReport | RelatedUnchangedDocumentDiagnosticReport;

export type PrepareRenameResult = Range | {
    range: Range;
    placeholder: string
} | {
    defaultBehavior: boolean
};

/**
 * A document selector is the combination of one or many document filters.
 * 
 * @sample `let sel:DocumentSelector = [{ language: 'typescript' }, { language: 'json', pattern: '**∕tsconfig.json' }]`;
 * 
 * The use of a string as a document filter is deprecated @since 3.16.0.
 */
export type DocumentSelector = (DocumentFilter)[];

export type ProgressToken = number | string;

/**
 * An identifier to refer to a change annotation stored with a workspace edit.
 */
export type ChangeAnnotationIdentifier = string;

/**
 * A workspace diagnostic document report.
 * 
 * @since 3.17.0
 */
export type WorkspaceDocumentDiagnosticReport = WorkspaceFullDocumentDiagnosticReport | WorkspaceUnchangedDocumentDiagnosticReport;

/**
 * An event describing a change to a text document. If only a text is provided
 * it is considered to be the full content of the document.
 */
export type TextDocumentContentChangeEvent = {
    range: Range;
    rangeLength?: number;
    text: string
} | {
    text: string
};

/**
 * MarkedString can be used to render human readable text. It is either a markdown string
 * or a code-block that provides a language and a code snippet. The language identifier
 * is semantically equal to the optional language identifier in fenced code blocks in GitHub
 * issues. See https://help.github.com/articles/creating-and-highlighting-code-blocks/#syntax-highlighting
 * 
 * The pair of a language and a value is an equivalent to markdown:
 * ```${language}
 * ${value}
 * ```
 * 
 * Note that markdown strings will be sanitized - that means html will be escaped.
 * @deprecated use MarkupContent instead.
 */
export type MarkedString = string | {
    language: string;
    value: string
};

/**
 * A document filter describes a top level text document or
 * a notebook cell document.
 * 
 * @since 3.17.0 - proposed support for NotebookCellTextDocumentFilter.
 */
export type DocumentFilter = TextDocumentFilter | NotebookCellTextDocumentFilter;

/**
 * LSP object definition.
 * @since 3.17.0
 */
export type LSPObject = { [key: string]: LSPAny };

/**
 * The glob pattern. Either a string pattern or a relative pattern.
 * 
 * @since 3.17.0
 */
export type GlobPattern = Pattern | RelativePattern;

/**
 * A document filter denotes a document by different properties like
 * the {@link TextDocument.languageId language}, the {@link Uri.scheme scheme} of
 * its resource, or a glob-pattern that is applied to the {@link TextDocument.fileName path}.
 * 
 * Glob patterns can have the following syntax:
 * - `*` to match zero or more characters in a path segment
 * - `?` to match on one character in a path segment
 * - `**` to match any number of path segments, including none
 * - `{}` to group sub patterns into an OR expression. (e.g. `**​/*.{ts,js}` matches all TypeScript and JavaScript files)
 * - `[]` to declare a range of characters to match in a path segment (e.g., `example.[0-9]` to match on `example.0`, `example.1`, …)
 * - `[!...]` to negate a range of characters to match in a path segment (e.g., `example.[!0-9]` to match on `example.a`, `example.b`, but not `example.0`)
 * 
 * @sample A language filter that applies to typescript files on disk: `{ language: 'typescript', scheme: 'file' }`
 * @sample A language filter that applies to all package.json paths: `{ language: 'json', pattern: '**package.json' }`
 * 
 * @since 3.17.0
 */
export type TextDocumentFilter = {
    language: string;
    scheme?: string;
    pattern?: string
} | {
    language?: string;
    scheme: string;
    pattern?: string
} | {
    language?: string;
    scheme?: string;
    pattern: string
};

/**
 * A notebook document filter denotes a notebook document by
 * different properties. The properties will be match
 * against the notebook's URI (same as with documents)
 * 
 * @since 3.17.0
 */
export type NotebookDocumentFilter = {
    notebookType: string;
    scheme?: string;
    pattern?: string
} | {
    notebookType?: string;
    scheme: string;
    pattern?: string
} | {
    notebookType?: string;
    scheme?: string;
    pattern: string
};

/**
 * The glob pattern to watch relative to the base path. Glob patterns can have the following syntax:
 * - `*` to match zero or more characters in a path segment
 * - `?` to match on one character in a path segment
 * - `**` to match any number of path segments, including none
 * - `{}` to group conditions (e.g. `**​/*.{ts,js}` matches all TypeScript and JavaScript files)
 * - `[]` to declare a range of characters to match in a path segment (e.g., `example.[0-9]` to match on `example.0`, `example.1`, …)
 * - `[!...]` to negate a range of characters to match in a path segment (e.g., `example.[!0-9]` to match on `example.a`, `example.b`, but not `example.0`)
 * 
 * @since 3.17.0
 */
export type Pattern = string;

export interface ImplementationParams extends TextDocumentPositionParams, WorkDoneProgressParams, PartialResultParams {
}

/**
 * Represents a location inside a resource, such as a line
 * inside a text file.
 */
export interface Location {
    uri: string;
    range: Range;
}

export interface ImplementationRegistrationOptions extends TextDocumentRegistrationOptions, ImplementationOptions, StaticRegistrationOptions {
}

export interface TypeDefinitionParams extends TextDocumentPositionParams, WorkDoneProgressParams, PartialResultParams {
}

export interface TypeDefinitionRegistrationOptions extends TextDocumentRegistrationOptions, TypeDefinitionOptions, StaticRegistrationOptions {
}

/**
 * A workspace folder inside a client.
 */
export interface WorkspaceFolder {
    /**
     * The associated URI for this workspace folder.
     */
    uri: string;
    /**
     * The name of the workspace folder. Used to refer to this
 * workspace folder in the user interface.
     */
    name: string;
}

/**
 * The parameters of a `workspace/didChangeWorkspaceFolders` notification.
 */
export interface DidChangeWorkspaceFoldersParams {
    /**
     * The actual workspace folder change event.
     */
    event: WorkspaceFoldersChangeEvent;
}

/**
 * The parameters of a configuration request.
 */
export interface ConfigurationParams {
    items: (ConfigurationItem)[];
}

/**
 * Parameters for a {@link DocumentColorRequest}.
 */
export interface DocumentColorParams extends WorkDoneProgressParams, PartialResultParams {
    /**
     * The text document.
     */
    textDocument: TextDocumentIdentifier;
}

/**
 * Represents a color range from a document.
 */
export interface ColorInformation {
    /**
     * The range in the document where this color appears.
     */
    range: Range;
    /**
     * The actual color value for this color range.
     */
    color: Color;
}

export interface DocumentColorRegistrationOptions extends TextDocumentRegistrationOptions, DocumentColorOptions, StaticRegistrationOptions {
}

/**
 * Parameters for a {@link ColorPresentationRequest}.
 */
export interface ColorPresentationParams extends WorkDoneProgressParams, PartialResultParams {
    /**
     * The text document.
     */
    textDocument: TextDocumentIdentifier;
    /**
     * The color to request presentations for.
     */
    color: Color;
    /**
     * The range where the color would be inserted. Serves as a context.
     */
    range: Range;
}

export interface ColorPresentation {
    /**
     * The label of this color presentation. It will be shown on the color
 * picker header. By default this is also the text that is inserted when selecting
 * this color presentation.
     */
    label: string;
    /**
     * An {@link TextEdit edit} which is applied to a document when selecting
 * this presentation for the color.  When `falsy` the {@link ColorPresentation.label label}
 * is used.
     */
    textEdit?: TextEdit;
    /**
     * An optional array of additional {@link TextEdit text edits} that are applied when
 * selecting this color presentation. Edits must not overlap with the main {@link ColorPresentation.textEdit edit} nor with themselves.
     */
    additionalTextEdits?: (TextEdit)[];
}

export interface WorkDoneProgressOptions {
    workDoneProgress?: boolean;
}

/**
 * General text document registration options.
 */
export interface TextDocumentRegistrationOptions {
    /**
     * A document selector to identify the scope of the registration. If set to null
 * the document selector provided on the client side will be used.
     */
    documentSelector: DocumentSelector | null;
}

/**
 * Parameters for a {@link FoldingRangeRequest}.
 */
export interface FoldingRangeParams extends WorkDoneProgressParams, PartialResultParams {
    /**
     * The text document.
     */
    textDocument: TextDocumentIdentifier;
}

/**
 * Represents a folding range. To be valid, start and end line must be bigger than zero and smaller
 * than the number of lines in the document. Clients are free to ignore invalid ranges.
 */
export interface FoldingRange {
    /**
     * The zero-based start line of the range to fold. The folded area starts after the line's last character.
 * To be valid, the end must be zero or larger and smaller than the number of lines in the document.
     */
    startLine: number;
    /**
     * The zero-based character offset from where the folded range starts. If not defined, defaults to the length of the start line.
     */
    startCharacter?: number;
    /**
     * The zero-based end line of the range to fold. The folded area ends with the line's last character.
 * To be valid, the end must be zero or larger and smaller than the number of lines in the document.
     */
    endLine: number;
    /**
     * The zero-based character offset before the folded range ends. If not defined, defaults to the length of the end line.
     */
    endCharacter?: number;
    /**
     * Describes the kind of the folding range such as `comment' or 'region'. The kind
 * is used to categorize folding ranges and used by commands like 'Fold all comments'.
 * See {@link FoldingRangeKind} for an enumeration of standardized kinds.
     */
    kind?: FoldingRangeKind;
    /**
     * The text that the client should show when the specified range is
 * collapsed. If not defined or not supported by the client, a default
 * will be chosen by the client.
 * 
 * @since 3.17.0
     */
    collapsedText?: string;
}

export interface FoldingRangeRegistrationOptions extends TextDocumentRegistrationOptions, FoldingRangeOptions, StaticRegistrationOptions {
}

export interface DeclarationParams extends TextDocumentPositionParams, WorkDoneProgressParams, PartialResultParams {
}

export interface DeclarationRegistrationOptions extends DeclarationOptions, TextDocumentRegistrationOptions, StaticRegistrationOptions {
}

/**
 * A parameter literal used in selection range requests.
 */
export interface SelectionRangeParams extends WorkDoneProgressParams, PartialResultParams {
    /**
     * The text document.
     */
    textDocument: TextDocumentIdentifier;
    /**
     * The positions inside the text document.
     */
    positions: (Position)[];
}

/**
 * A selection range represents a part of a selection hierarchy. A selection range
 * may have a parent selection range that contains it.
 */
export interface SelectionRange {
    /**
     * The {@link Range range} of this selection range.
     */
    range: Range;
    /**
     * The parent selection range containing this range. Therefore `parent.range` must contain `this.range`.
     */
    parent?: SelectionRange;
}

export interface SelectionRangeRegistrationOptions extends SelectionRangeOptions, TextDocumentRegistrationOptions, StaticRegistrationOptions {
}

export interface WorkDoneProgressCreateParams {
    /**
     * The token to be used to report progress.
     */
    token: ProgressToken;
}

export interface WorkDoneProgressCancelParams {
    /**
     * The token to be used to report progress.
     */
    token: ProgressToken;
}

/**
 * The parameter of a `textDocument/prepareCallHierarchy` request.
 * 
 * @since 3.16.0
 */
export interface CallHierarchyPrepareParams extends TextDocumentPositionParams, WorkDoneProgressParams {
}

/**
 * Represents programming constructs like functions or constructors in the context
 * of call hierarchy.
 * 
 * @since 3.16.0
 */
export interface CallHierarchyItem {
    /**
     * The name of this item.
     */
    name: string;
    /**
     * The kind of this item.
     */
    kind: SymbolKind;
    /**
     * Tags for this item.
     */
    tags?: (SymbolTag)[];
    /**
     * More detail for this item, e.g. the signature of a function.
     */
    detail?: string;
    /**
     * The resource identifier of this item.
     */
    uri: string;
    /**
     * The range enclosing this symbol not including leading/trailing whitespace but everything else, e.g. comments and code.
     */
    range: Range;
    /**
     * The range that should be selected and revealed when this symbol is being picked, e.g. the name of a function.
 * Must be contained by the {@link CallHierarchyItem.range `range`}.
     */
    selectionRange: Range;
    /**
     * A data entry field that is preserved between a call hierarchy prepare and
 * incoming calls or outgoing calls requests.
     */
    data?: LSPAny;
}

/**
 * Call hierarchy options used during static or dynamic registration.
 * 
 * @since 3.16.0
 */
export interface CallHierarchyRegistrationOptions extends TextDocumentRegistrationOptions, CallHierarchyOptions, StaticRegistrationOptions {
}

/**
 * The parameter of a `callHierarchy/incomingCalls` request.
 * 
 * @since 3.16.0
 */
export interface CallHierarchyIncomingCallsParams extends WorkDoneProgressParams, PartialResultParams {
    item: CallHierarchyItem;
}

/**
 * Represents an incoming call, e.g. a caller of a method or constructor.
 * 
 * @since 3.16.0
 */
export interface CallHierarchyIncomingCall {
    /**
     * The item that makes the call.
     */
    from: CallHierarchyItem;
    /**
     * The ranges at which the calls appear. This is relative to the caller
 * denoted by {@link CallHierarchyIncomingCall.from `this.from`}.
     */
    fromRanges: (Range)[];
}

/**
 * The parameter of a `callHierarchy/outgoingCalls` request.
 * 
 * @since 3.16.0
 */
export interface CallHierarchyOutgoingCallsParams extends WorkDoneProgressParams, PartialResultParams {
    item: CallHierarchyItem;
}

/**
 * Represents an outgoing call, e.g. calling a getter from a method or a method from a constructor etc.
 * 
 * @since 3.16.0
 */
export interface CallHierarchyOutgoingCall {
    /**
     * The item that is called.
     */
    to: CallHierarchyItem;
    /**
     * The range at which this item is called. This is the range relative to the caller, e.g the item
 * passed to {@link CallHierarchyItemProvider.provideCallHierarchyOutgoingCalls `provideCallHierarchyOutgoingCalls`}
 * and not {@link CallHierarchyOutgoingCall.to `this.to`}.
     */
    fromRanges: (Range)[];
}

/**
 * @since 3.16.0
 */
export interface SemanticTokensParams extends WorkDoneProgressParams, PartialResultParams {
    /**
     * The text document.
     */
    textDocument: TextDocumentIdentifier;
}

/**
 * @since 3.16.0
 */
export interface SemanticTokens {
    /**
     * An optional result id. If provided and clients support delta updating
 * the client will include the result id in the next semantic token request.
 * A server can then instead of computing all semantic tokens again simply
 * send a delta.
     */
    resultId?: string;
    /**
     * The actual tokens.
     */
    data: (number)[];
}

/**
 * @since 3.16.0
 */
export interface SemanticTokensPartialResult {
    data: (number)[];
}

/**
 * @since 3.16.0
 */
export interface SemanticTokensRegistrationOptions extends TextDocumentRegistrationOptions, SemanticTokensOptions, StaticRegistrationOptions {
}

/**
 * @since 3.16.0
 */
export interface SemanticTokensDeltaParams extends WorkDoneProgressParams, PartialResultParams {
    /**
     * The text document.
     */
    textDocument: TextDocumentIdentifier;
    /**
     * The result id of a previous response. The result Id can either point to a full response
 * or a delta response depending on what was received last.
     */
    previousResultId: string;
}

/**
 * @since 3.16.0
 */
export interface SemanticTokensDelta {
    resultId?: string;
    /**
     * The semantic token edits to transform a previous result into a new result.
     */
    edits: (SemanticTokensEdit)[];
}

/**
 * @since 3.16.0
 */
export interface SemanticTokensDeltaPartialResult {
    edits: (SemanticTokensEdit)[];
}

/**
 * @since 3.16.0
 */
export interface SemanticTokensRangeParams extends WorkDoneProgressParams, PartialResultParams {
    /**
     * The text document.
     */
    textDocument: TextDocumentIdentifier;
    /**
     * The range the semantic tokens are requested for.
     */
    range: Range;
}

/**
 * Params to show a resource in the UI.
 * 
 * @since 3.16.0
 */
export interface ShowDocumentParams {
    /**
     * The uri to show.
     */
    uri: string;
    /**
     * Indicates to show the resource in an external program.
 * To show, for example, `https://code.visualstudio.com/`
 * in the default WEB browser set `external` to `true`.
     */
    external?: boolean;
    /**
     * An optional property to indicate whether the editor
 * showing the document should take focus or not.
 * Clients might ignore this property if an external
 * program is started.
     */
    takeFocus?: boolean;
    /**
     * An optional selection range if the document is a text
 * document. Clients might ignore the property if an
 * external program is started or the file is not a text
 * file.
     */
    selection?: Range;
}

/**
 * The result of a showDocument request.
 * 
 * @since 3.16.0
 */
export interface ShowDocumentResult {
    /**
     * A boolean indicating if the show was successful.
     */
    success: boolean;
}

export interface LinkedEditingRangeParams extends TextDocumentPositionParams, WorkDoneProgressParams {
}

/**
 * The result of a linked editing range request.
 * 
 * @since 3.16.0
 */
export interface LinkedEditingRanges {
    /**
     * A list of ranges that can be edited together. The ranges must have
 * identical length and contain identical text content. The ranges cannot overlap.
     */
    ranges: (Range)[];
    /**
     * An optional word pattern (regular expression) that describes valid contents for
 * the given ranges. If no pattern is provided, the client configuration's word
 * pattern will be used.
     */
    wordPattern?: string;
}

export interface LinkedEditingRangeRegistrationOptions extends TextDocumentRegistrationOptions, LinkedEditingRangeOptions, StaticRegistrationOptions {
}

/**
 * The parameters sent in notifications/requests for user-initiated creation of
 * files.
 * 
 * @since 3.16.0
 */
export interface CreateFilesParams {
    /**
     * An array of all files/folders created in this operation.
     */
    files: (FileCreate)[];
}

/**
 * A workspace edit represents changes to many resources managed in the workspace. The edit
 * should either provide `changes` or `documentChanges`. If documentChanges are present
 * they are preferred over `changes` if the client can handle versioned document edits.
 * 
 * Since version 3.13.0 a workspace edit can contain resource operations as well. If resource
 * operations are present clients need to execute the operations in the order in which they
 * are provided. So a workspace edit for example can consist of the following two changes:
 * (1) a create file a.txt and (2) a text document edit which insert text into file a.txt.
 * 
 * An invalid sequence (e.g. (1) delete file a.txt and (2) insert text into file a.txt) will
 * cause failure of the operation. How the client recovers from the failure is described by
 * the client capability: `workspace.workspaceEdit.failureHandling`
 */
export interface WorkspaceEdit {
    /**
     * Holds changes to existing resources.
     */
    changes?: { [key: string]: (TextEdit)[] };
    /**
     * Depending on the client capability `workspace.workspaceEdit.resourceOperations` document changes
 * are either an array of `TextDocumentEdit`s to express changes to n different text documents
 * where each text document edit addresses a specific version of a text document. Or it can contain
 * above `TextDocumentEdit`s mixed with create, rename and delete file / folder operations.
 * 
 * Whether a client supports versioned document edits is expressed via
 * `workspace.workspaceEdit.documentChanges` client capability.
 * 
 * If a client neither supports `documentChanges` nor `workspace.workspaceEdit.resourceOperations` then
 * only plain `TextEdit`s using the `changes` property are supported.
     */
    documentChanges?: (TextDocumentEdit | CreateFile | RenameFile | DeleteFile)[];
    /**
     * A map of change annotations that can be referenced in `AnnotatedTextEdit`s or create, rename and
 * delete file / folder operations.
 * 
 * Whether clients honor this property depends on the client capability `workspace.changeAnnotationSupport`.
 * 
 * @since 3.16.0
     */
    changeAnnotations?: { [key: ChangeAnnotationIdentifier]: ChangeAnnotation };
}

/**
 * The options to register for file operations.
 * 
 * @since 3.16.0
 */
export interface FileOperationRegistrationOptions {
    /**
     * The actual filters.
     */
    filters: (FileOperationFilter)[];
}

/**
 * The parameters sent in notifications/requests for user-initiated renames of
 * files.
 * 
 * @since 3.16.0
 */
export interface RenameFilesParams {
    /**
     * An array of all files/folders renamed in this operation. When a folder is renamed, only
 * the folder will be included, and not its children.
     */
    files: (FileRename)[];
}

/**
 * The parameters sent in notifications/requests for user-initiated deletes of
 * files.
 * 
 * @since 3.16.0
 */
export interface DeleteFilesParams {
    /**
     * An array of all files/folders deleted in this operation.
     */
    files: (FileDelete)[];
}

export interface MonikerParams extends TextDocumentPositionParams, WorkDoneProgressParams, PartialResultParams {
}

/**
 * Moniker definition to match LSIF 0.5 moniker definition.
 * 
 * @since 3.16.0
 */
export interface Moniker {
    /**
     * The scheme of the moniker. For example tsc or .Net
     */
    scheme: string;
    /**
     * The identifier of the moniker. The value is opaque in LSIF however
 * schema owners are allowed to define the structure if they want.
     */
    identifier: string;
    /**
     * The scope in which the moniker is unique
     */
    unique: UniquenessLevel;
    /**
     * The moniker kind if known.
     */
    kind?: MonikerKind;
}

export interface MonikerRegistrationOptions extends TextDocumentRegistrationOptions, MonikerOptions {
}

/**
 * The parameter of a `textDocument/prepareTypeHierarchy` request.
 * 
 * @since 3.17.0
 */
export interface TypeHierarchyPrepareParams extends TextDocumentPositionParams, WorkDoneProgressParams {
}

/**
 * @since 3.17.0
 */
export interface TypeHierarchyItem {
    /**
     * The name of this item.
     */
    name: string;
    /**
     * The kind of this item.
     */
    kind: SymbolKind;
    /**
     * Tags for this item.
     */
    tags?: (SymbolTag)[];
    /**
     * More detail for this item, e.g. the signature of a function.
     */
    detail?: string;
    /**
     * The resource identifier of this item.
     */
    uri: string;
    /**
     * The range enclosing this symbol not including leading/trailing whitespace
 * but everything else, e.g. comments and code.
     */
    range: Range;
    /**
     * The range that should be selected and revealed when this symbol is being
 * picked, e.g. the name of a function. Must be contained by the
 * {@link TypeHierarchyItem.range `range`}.
     */
    selectionRange: Range;
    /**
     * A data entry field that is preserved between a type hierarchy prepare and
 * supertypes or subtypes requests. It could also be used to identify the
 * type hierarchy in the server, helping improve the performance on
 * resolving supertypes and subtypes.
     */
    data?: LSPAny;
}

/**
 * Type hierarchy options used during static or dynamic registration.
 * 
 * @since 3.17.0
 */
export interface TypeHierarchyRegistrationOptions extends TextDocumentRegistrationOptions, TypeHierarchyOptions, StaticRegistrationOptions {
}

/**
 * The parameter of a `typeHierarchy/supertypes` request.
 * 
 * @since 3.17.0
 */
export interface TypeHierarchySupertypesParams extends WorkDoneProgressParams, PartialResultParams {
    item: TypeHierarchyItem;
}

/**
 * The parameter of a `typeHierarchy/subtypes` request.
 * 
 * @since 3.17.0
 */
export interface TypeHierarchySubtypesParams extends WorkDoneProgressParams, PartialResultParams {
    item: TypeHierarchyItem;
}

/**
 * A parameter literal used in inline value requests.
 * 
 * @since 3.17.0
 */
export interface InlineValueParams extends WorkDoneProgressParams {
    /**
     * The text document.
     */
    textDocument: TextDocumentIdentifier;
    /**
     * The document range for which inline values should be computed.
     */
    range: Range;
    /**
     * Additional information about the context in which inline values were
 * requested.
     */
    context: InlineValueContext;
}

/**
 * Inline value options used during static or dynamic registration.
 * 
 * @since 3.17.0
 */
export interface InlineValueRegistrationOptions extends InlineValueOptions, TextDocumentRegistrationOptions, StaticRegistrationOptions {
}

/**
 * A parameter literal used in inlay hint requests.
 * 
 * @since 3.17.0
 */
export interface InlayHintParams extends WorkDoneProgressParams {
    /**
     * The text document.
     */
    textDocument: TextDocumentIdentifier;
    /**
     * The document range for which inlay hints should be computed.
     */
    range: Range;
}

/**
 * Inlay hint information.
 * 
 * @since 3.17.0
 */
export interface InlayHint {
    /**
     * The position of this hint.
 * 
 * If multiple hints have the same position, they will be shown in the order
 * they appear in the response.
     */
    position: Position;
    /**
     * The label of this hint. A human readable string or an array of
 * InlayHintLabelPart label parts.
 * 
 * *Note* that neither the string nor the label part can be empty.
     */
    label: string | (InlayHintLabelPart)[];
    /**
     * The kind of this hint. Can be omitted in which case the client
 * should fall back to a reasonable default.
     */
    kind?: InlayHintKind;
    /**
     * Optional text edits that are performed when accepting this inlay hint.
 * 
 * *Note* that edits are expected to change the document so that the inlay
 * hint (or its nearest variant) is now part of the document and the inlay
 * hint itself is now obsolete.
     */
    textEdits?: (TextEdit)[];
    /**
     * The tooltip text when you hover over this item.
     */
    tooltip?: string | MarkupContent;
    /**
     * Render padding before the hint.
 * 
 * Note: Padding should use the editor's background color, not the
 * background color of the hint itself. That means padding can be used
 * to visually align/separate an inlay hint.
     */
    paddingLeft?: boolean;
    /**
     * Render padding after the hint.
 * 
 * Note: Padding should use the editor's background color, not the
 * background color of the hint itself. That means padding can be used
 * to visually align/separate an inlay hint.
     */
    paddingRight?: boolean;
    /**
     * A data entry field that is preserved on an inlay hint between
 * a `textDocument/inlayHint` and a `inlayHint/resolve` request.
     */
    data?: LSPAny;
}

/**
 * Inlay hint options used during static or dynamic registration.
 * 
 * @since 3.17.0
 */
export interface InlayHintRegistrationOptions extends InlayHintOptions, TextDocumentRegistrationOptions, StaticRegistrationOptions {
}

/**
 * Parameters of the document diagnostic request.
 * 
 * @since 3.17.0
 */
export interface DocumentDiagnosticParams extends WorkDoneProgressParams, PartialResultParams {
    /**
     * The text document.
     */
    textDocument: TextDocumentIdentifier;
    /**
     * The additional identifier  provided during registration.
     */
    identifier?: string;
    /**
     * The result id of a previous response if provided.
     */
    previousResultId?: string;
}

/**
 * A partial result for a document diagnostic report.
 * 
 * @since 3.17.0
 */
export interface DocumentDiagnosticReportPartialResult {
    relatedDocuments: { [key: string]: FullDocumentDiagnosticReport | UnchangedDocumentDiagnosticReport };
}

/**
 * Cancellation data returned from a diagnostic request.
 * 
 * @since 3.17.0
 */
export interface DiagnosticServerCancellationData {
    retriggerRequest: boolean;
}

/**
 * Diagnostic registration options.
 * 
 * @since 3.17.0
 */
export interface DiagnosticRegistrationOptions extends TextDocumentRegistrationOptions, DiagnosticOptions, StaticRegistrationOptions {
}

/**
 * Parameters of the workspace diagnostic request.
 * 
 * @since 3.17.0
 */
export interface WorkspaceDiagnosticParams extends WorkDoneProgressParams, PartialResultParams {
    /**
     * The additional identifier provided during registration.
     */
    identifier?: string;
    /**
     * The currently known diagnostic reports with their
 * previous result ids.
     */
    previousResultIds: (PreviousResultId)[];
}

/**
 * A workspace diagnostic report.
 * 
 * @since 3.17.0
 */
export interface WorkspaceDiagnosticReport {
    items: (WorkspaceDocumentDiagnosticReport)[];
}

/**
 * A partial result for a workspace diagnostic report.
 * 
 * @since 3.17.0
 */
export interface WorkspaceDiagnosticReportPartialResult {
    items: (WorkspaceDocumentDiagnosticReport)[];
}

/**
 * The params sent in an open notebook document notification.
 * 
 * @since 3.17.0
 */
export interface DidOpenNotebookDocumentParams {
    /**
     * The notebook document that got opened.
     */
    notebookDocument: NotebookDocument;
    /**
     * The text documents that represent the content
 * of a notebook cell.
     */
    cellTextDocuments: (TextDocumentItem)[];
}

/**
 * The params sent in a change notebook document notification.
 * 
 * @since 3.17.0
 */
export interface DidChangeNotebookDocumentParams {
    /**
     * The notebook document that did change. The version number points
 * to the version after all provided changes have been applied. If
 * only the text document content of a cell changes the notebook version
 * doesn't necessarily have to change.
     */
    notebookDocument: VersionedNotebookDocumentIdentifier;
    /**
     * The actual changes to the notebook document.
 * 
 * The changes describe single state changes to the notebook document.
 * So if there are two changes c1 (at array index 0) and c2 (at array
 * index 1) for a notebook in state S then c1 moves the notebook from
 * S to S' and c2 from S' to S''. So c1 is computed on the state S and
 * c2 is computed on the state S'.
 * 
 * To mirror the content of a notebook using change events use the following approach:
 * - start with the same initial content
 * - apply the 'notebookDocument/didChange' notifications in the order you receive them.
 * - apply the `NotebookChangeEvent`s in a single notification in the order
 *   you receive them.
     */
    change: NotebookDocumentChangeEvent;
}

/**
 * The params sent in a save notebook document notification.
 * 
 * @since 3.17.0
 */
export interface DidSaveNotebookDocumentParams {
    /**
     * The notebook document that got saved.
     */
    notebookDocument: NotebookDocumentIdentifier;
}

/**
 * The params sent in a close notebook document notification.
 * 
 * @since 3.17.0
 */
export interface DidCloseNotebookDocumentParams {
    /**
     * The notebook document that got closed.
     */
    notebookDocument: NotebookDocumentIdentifier;
    /**
     * The text documents that represent the content
 * of a notebook cell that got closed.
     */
    cellTextDocuments: (TextDocumentIdentifier)[];
}

/**
 * A parameter literal used in inline completion requests.
 * 
 * @since 3.18.0
 * @proposed
 */
export interface InlineCompletionParams extends TextDocumentPositionParams, WorkDoneProgressParams {
    /**
     * Additional information about the context in which inline completions were
 * requested.
     */
    context: InlineCompletionContext;
}

/**
 * Represents a collection of {@link InlineCompletionItem inline completion items} to be presented in the editor.
 * 
 * @since 3.18.0
 * @proposed
 */
export interface InlineCompletionList {
    /**
     * The inline completion items
     */
    items: (InlineCompletionItem)[];
}

/**
 * An inline completion item represents a text snippet that is proposed inline to complete text that is being typed.
 * 
 * @since 3.18.0
 * @proposed
 */
export interface InlineCompletionItem {
    /**
     * The text to replace the range with. Must be set.
     */
    insertText: string | StringValue;
    /**
     * A text that is used to decide if this inline completion should be shown. When `falsy` the {@link InlineCompletionItem.insertText} is used.
     */
    filterText?: string;
    /**
     * The range to replace. Must begin and end on the same line.
     */
    range?: Range;
    /**
     * An optional {@link Command} that is executed *after* inserting this completion.
     */
    command?: Command;
}

/**
 * Inline completion options used during static or dynamic registration.
 * 
 * @since 3.18.0
 * @proposed
 */
export interface InlineCompletionRegistrationOptions extends InlineCompletionOptions, TextDocumentRegistrationOptions, StaticRegistrationOptions {
}

export interface RegistrationParams {
    registrations: (Registration)[];
}

export interface UnregistrationParams {
    unregisterations: (Unregistration)[];
}

export interface InitializeParams extends _InitializeParams, WorkspaceFoldersInitializeParams {
}

/**
 * The result returned from an initialize request.
 */
export interface InitializeResult {
    /**
     * The capabilities the language server provides.
     */
    capabilities: ServerCapabilities;
    /**
     * Information about the server.
 * 
 * @since 3.15.0
     */
    serverInfo?: {
        name: string;
        version?: string
    };
}

/**
 * The data type of the ResponseError if the
 * initialize request fails.
 */
export interface InitializeError {
    /**
     * Indicates whether the client execute the following retry logic:
 * (1) show the message provided by the ResponseError to the user
 * (2) user selects retry or cancel
 * (3) if user selected retry the initialize method is sent again.
     */
    retry: boolean;
}

export interface InitializedParams {
}

/**
 * The parameters of a change configuration notification.
 */
export interface DidChangeConfigurationParams {
    /**
     * The actual changed settings
     */
    settings: LSPAny;
}

export interface DidChangeConfigurationRegistrationOptions {
    section?: string | (string)[];
}

/**
 * The parameters of a notification message.
 */
export interface ShowMessageParams {
    /**
     * The message type. See {@link MessageType}
     */
    type: MessageType;
    /**
     * The actual message.
     */
    message: string;
}

export interface ShowMessageRequestParams {
    /**
     * The message type. See {@link MessageType}
     */
    type: MessageType;
    /**
     * The actual message.
     */
    message: string;
    /**
     * The message action items to present.
     */
    actions?: (MessageActionItem)[];
}

export interface MessageActionItem {
    /**
     * A short title like 'Retry', 'Open Log' etc.
     */
    title: string;
}

/**
 * The log message parameters.
 */
export interface LogMessageParams {
    /**
     * The message type. See {@link MessageType}
     */
    type: MessageType;
    /**
     * The actual message.
     */
    message: string;
}

/**
 * The parameters sent in an open text document notification
 */
export interface DidOpenTextDocumentParams {
    /**
     * The document that was opened.
     */
    textDocument: TextDocumentItem;
}

/**
 * The change text document notification's parameters.
 */
export interface DidChangeTextDocumentParams {
    /**
     * The document that did change. The version number points
 * to the version after all provided content changes have
 * been applied.
     */
    textDocument: VersionedTextDocumentIdentifier;
    /**
     * The actual content changes. The content changes describe single state changes
 * to the document. So if there are two content changes c1 (at array index 0) and
 * c2 (at array index 1) for a document in state S then c1 moves the document from
 * S to S' and c2 from S' to S''. So c1 is computed on the state S and c2 is computed
 * on the state S'.
 * 
 * To mirror the content of a document using change events use the following approach:
 * - start with the same initial content
 * - apply the 'textDocument/didChange' notifications in the order you receive them.
 * - apply the `TextDocumentContentChangeEvent`s in a single notification in the order
 *   you receive them.
     */
    contentChanges: (TextDocumentContentChangeEvent)[];
}

/**
 * Describe options to be used when registered for text document change events.
 */
export interface TextDocumentChangeRegistrationOptions extends TextDocumentRegistrationOptions {
    /**
     * How documents are synced to the server.
     */
    syncKind: TextDocumentSyncKind;
}

/**
 * The parameters sent in a close text document notification
 */
export interface DidCloseTextDocumentParams {
    /**
     * The document that was closed.
     */
    textDocument: TextDocumentIdentifier;
}

/**
 * The parameters sent in a save text document notification
 */
export interface DidSaveTextDocumentParams {
    /**
     * The document that was saved.
     */
    textDocument: TextDocumentIdentifier;
    /**
     * Optional the content when saved. Depends on the includeText value
 * when the save notification was requested.
     */
    text?: string;
}

/**
 * Save registration options.
 */
export interface TextDocumentSaveRegistrationOptions extends TextDocumentRegistrationOptions, SaveOptions {
}

/**
 * The parameters sent in a will save text document notification.
 */
export interface WillSaveTextDocumentParams {
    /**
     * The document that will be saved.
     */
    textDocument: TextDocumentIdentifier;
    /**
     * The 'TextDocumentSaveReason'.
     */
    reason: TextDocumentSaveReason;
}

/**
 * A text edit applicable to a text document.
 */
export interface TextEdit {
    /**
     * The range of the text document to be manipulated. To insert
 * text into a document create a range where start === end.
     */
    range: Range;
    /**
     * The string to be inserted. For delete operations use an
 * empty string.
     */
    newText: string;
}

/**
 * The watched files change notification's parameters.
 */
export interface DidChangeWatchedFilesParams {
    /**
     * The actual file events.
     */
    changes: (FileEvent)[];
}

/**
 * Describe options to be used when registered for text document change events.
 */
export interface DidChangeWatchedFilesRegistrationOptions {
    /**
     * The watchers to register.
     */
    watchers: (FileSystemWatcher)[];
}

/**
 * The publish diagnostic notification's parameters.
 */
export interface PublishDiagnosticsParams {
    /**
     * The URI for which diagnostic information is reported.
     */
    uri: string;
    /**
     * Optional the version number of the document the diagnostics are published for.
 * 
 * @since 3.15.0
     */
    version?: number;
    /**
     * An array of diagnostic information items.
     */
    diagnostics: (Diagnostic)[];
}

/**
 * Completion parameters
 */
export interface CompletionParams extends TextDocumentPositionParams, WorkDoneProgressParams, PartialResultParams {
    /**
     * The completion context. This is only available if the client specifies
 * to send this using the client capability `textDocument.completion.contextSupport === true`
     */
    context?: CompletionContext;
}

/**
 * A completion item represents a text snippet that is
 * proposed to complete text that is being typed.
 */
export interface CompletionItem {
    /**
     * The label of this completion item.
 * 
 * The label property is also by default the text that
 * is inserted when selecting this completion.
 * 
 * If label details are provided the label itself should
 * be an unqualified name of the completion item.
     */
    label: string;
    /**
     * Additional details for the label
 * 
 * @since 3.17.0
     */
    labelDetails?: CompletionItemLabelDetails;
    /**
     * The kind of this completion item. Based of the kind
 * an icon is chosen by the editor.
     */
    kind?: CompletionItemKind;
    /**
     * Tags for this completion item.
 * 
 * @since 3.15.0
     */
    tags?: (CompletionItemTag)[];
    /**
     * A human-readable string with additional information
 * about this item, like type or symbol information.
     */
    detail?: string;
    /**
     * A human-readable string that represents a doc-comment.
     */
    documentation?: string | MarkupContent;
    /**
     * Indicates if this item is deprecated.
 * @deprecated Use `tags` instead.
     */
    deprecated?: boolean;
    /**
     * Select this item when showing.
 * 
 * *Note* that only one completion item can be selected and that the
 * tool / client decides which item that is. The rule is that the *first*
 * item of those that match best is selected.
     */
    preselect?: boolean;
    /**
     * A string that should be used when comparing this item
 * with other items. When `falsy` the {@link CompletionItem.label label}
 * is used.
     */
    sortText?: string;
    /**
     * A string that should be used when filtering a set of
 * completion items. When `falsy` the {@link CompletionItem.label label}
 * is used.
     */
    filterText?: string;
    /**
     * A string that should be inserted into a document when selecting
 * this completion. When `falsy` the {@link CompletionItem.label label}
 * is used.
 * 
 * The `insertText` is subject to interpretation by the client side.
 * Some tools might not take the string literally. For example
 * VS Code when code complete is requested in this example
 * `con<cursor position>` and a completion item with an `insertText` of
 * `console` is provided it will only insert `sole`. Therefore it is
 * recommended to use `textEdit` instead since it avoids additional client
 * side interpretation.
     */
    insertText?: string;
    /**
     * The format of the insert text. The format applies to both the
 * `insertText` property and the `newText` property of a provided
 * `textEdit`. If omitted defaults to `InsertTextFormat.PlainText`.
 * 
 * Please note that the insertTextFormat doesn't apply to
 * `additionalTextEdits`.
     */
    insertTextFormat?: InsertTextFormat;
    /**
     * How whitespace and indentation is handled during completion
 * item insertion. If not provided the clients default value depends on
 * the `textDocument.completion.insertTextMode` client capability.
 * 
 * @since 3.16.0
     */
    insertTextMode?: InsertTextMode;
    /**
     * An {@link TextEdit edit} which is applied to a document when selecting
 * this completion. When an edit is provided the value of
 * {@link CompletionItem.insertText insertText} is ignored.
 * 
 * Most editors support two different operations when accepting a completion
 * item. One is to insert a completion text and the other is to replace an
 * existing text with a completion text. Since this can usually not be
 * predetermined by a server it can report both ranges. Clients need to
 * signal support for `InsertReplaceEdits` via the
 * `textDocument.completion.insertReplaceSupport` client capability
 * property.
 * 
 * *Note 1:* The text edit's range as well as both ranges from an insert
 * replace edit must be a [single line] and they must contain the position
 * at which completion has been requested.
 * *Note 2:* If an `InsertReplaceEdit` is returned the edit's insert range
 * must be a prefix of the edit's replace range, that means it must be
 * contained and starting at the same position.
 * 
 * @since 3.16.0 additional type `InsertReplaceEdit`
     */
    textEdit?: TextEdit | InsertReplaceEdit;
    /**
     * The edit text used if the completion item is part of a CompletionList and
 * CompletionList defines an item default for the text edit range.
 * 
 * Clients will only honor this property if they opt into completion list
 * item defaults using the capability `completionList.itemDefaults`.
 * 
 * If not provided and a list's default range is provided the label
 * property is used as a text.
 * 
 * @since 3.17.0
     */
    textEditText?: string;
    /**
     * An optional array of additional {@link TextEdit text edits} that are applied when
 * selecting this completion. Edits must not overlap (including the same insert position)
 * with the main {@link CompletionItem.textEdit edit} nor with themselves.
 * 
 * Additional text edits should be used to change text unrelated to the current cursor position
 * (for example adding an import statement at the top of the file if the completion item will
 * insert an unqualified type).
     */
    additionalTextEdits?: (TextEdit)[];
    /**
     * An optional set of characters that when pressed while this completion is active will accept it first and
 * then type that character. *Note* that all commit characters should have `length=1` and that superfluous
 * characters will be ignored.
     */
    commitCharacters?: (string)[];
    /**
     * An optional {@link Command command} that is executed *after* inserting this completion. *Note* that
 * additional modifications to the current document should be described with the
 * {@link CompletionItem.additionalTextEdits additionalTextEdits}-property.
     */
    command?: Command;
    /**
     * A data entry field that is preserved on a completion item between a
 * {@link CompletionRequest} and a {@link CompletionResolveRequest}.
     */
    data?: LSPAny;
}

/**
 * Represents a collection of {@link CompletionItem completion items} to be presented
 * in the editor.
 */
export interface CompletionList {
    /**
     * This list it not complete. Further typing results in recomputing this list.
 * 
 * Recomputed lists have all their items replaced (not appended) in the
 * incomplete completion sessions.
     */
    isIncomplete: boolean;
    /**
     * In many cases the items of an actual completion result share the same
 * value for properties like `commitCharacters` or the range of a text
 * edit. A completion list can therefore define item defaults which will
 * be used if a completion item itself doesn't specify the value.
 * 
 * If a completion list specifies a default value and a completion item
 * also specifies a corresponding value the one from the item is used.
 * 
 * Servers are only allowed to return default values if the client
 * signals support for this via the `completionList.itemDefaults`
 * capability.
 * 
 * @since 3.17.0
     */
    itemDefaults?: {
        commitCharacters?: (string)[];
        editRange?: Range | {
            insert: Range;
            replace: Range
        };
        insertTextFormat?: InsertTextFormat;
        insertTextMode?: InsertTextMode;
        data?: LSPAny
    };
    /**
     * The completion items.
     */
    items: (CompletionItem)[];
}

/**
 * Registration options for a {@link CompletionRequest}.
 */
export interface CompletionRegistrationOptions extends TextDocumentRegistrationOptions, CompletionOptions {
}

/**
 * Parameters for a {@link HoverRequest}.
 */
export interface HoverParams extends TextDocumentPositionParams, WorkDoneProgressParams {
}

/**
 * The result of a hover request.
 */
export interface Hover {
    /**
     * The hover's content
     */
    contents: MarkupContent | MarkedString | (MarkedString)[];
    /**
     * An optional range inside the text document that is used to
 * visualize the hover, e.g. by changing the background color.
     */
    range?: Range;
}

/**
 * Registration options for a {@link HoverRequest}.
 */
export interface HoverRegistrationOptions extends TextDocumentRegistrationOptions, HoverOptions {
}

/**
 * Parameters for a {@link SignatureHelpRequest}.
 */
export interface SignatureHelpParams extends TextDocumentPositionParams, WorkDoneProgressParams {
    /**
     * The signature help context. This is only available if the client specifies
 * to send this using the client capability `textDocument.signatureHelp.contextSupport === true`
 * 
 * @since 3.15.0
     */
    context?: SignatureHelpContext;
}

/**
 * Signature help represents the signature of something
 * callable. There can be multiple signature but only one
 * active and only one active parameter.
 */
export interface SignatureHelp {
    /**
     * One or more signatures.
     */
    signatures: (SignatureInformation)[];
    /**
     * The active signature. If omitted or the value lies outside the
 * range of `signatures` the value defaults to zero or is ignored if
 * the `SignatureHelp` has no signatures.
 * 
 * Whenever possible implementors should make an active decision about
 * the active signature and shouldn't rely on a default value.
 * 
 * In future version of the protocol this property might become
 * mandatory to better express this.
     */
    activeSignature?: number;
    /**
     * The active parameter of the active signature. If omitted or the value
 * lies outside the range of `signatures[activeSignature].parameters`
 * defaults to 0 if the active signature has parameters. If
 * the active signature has no parameters it is ignored.
 * In future version of the protocol this property might become
 * mandatory to better express the active parameter if the
 * active signature does have any.
     */
    activeParameter?: number;
}

/**
 * Registration options for a {@link SignatureHelpRequest}.
 */
export interface SignatureHelpRegistrationOptions extends TextDocumentRegistrationOptions, SignatureHelpOptions {
}

/**
 * Parameters for a {@link DefinitionRequest}.
 */
export interface DefinitionParams extends TextDocumentPositionParams, WorkDoneProgressParams, PartialResultParams {
}

/**
 * Registration options for a {@link DefinitionRequest}.
 */
export interface DefinitionRegistrationOptions extends TextDocumentRegistrationOptions, DefinitionOptions {
}

/**
 * Parameters for a {@link ReferencesRequest}.
 */
export interface ReferenceParams extends TextDocumentPositionParams, WorkDoneProgressParams, PartialResultParams {
    context: ReferenceContext;
}

/**
 * Registration options for a {@link ReferencesRequest}.
 */
export interface ReferenceRegistrationOptions extends TextDocumentRegistrationOptions, ReferenceOptions {
}

/**
 * Parameters for a {@link DocumentHighlightRequest}.
 */
export interface DocumentHighlightParams extends TextDocumentPositionParams, WorkDoneProgressParams, PartialResultParams {
}

/**
 * A document highlight is a range inside a text document which deserves
 * special attention. Usually a document highlight is visualized by changing
 * the background color of its range.
 */
export interface DocumentHighlight {
    /**
     * The range this highlight applies to.
     */
    range: Range;
    /**
     * The highlight kind, default is {@link DocumentHighlightKind.Text text}.
     */
    kind?: DocumentHighlightKind;
}

/**
 * Registration options for a {@link DocumentHighlightRequest}.
 */
export interface DocumentHighlightRegistrationOptions extends TextDocumentRegistrationOptions, DocumentHighlightOptions {
}

/**
 * Parameters for a {@link DocumentSymbolRequest}.
 */
export interface DocumentSymbolParams extends WorkDoneProgressParams, PartialResultParams {
    /**
     * The text document.
     */
    textDocument: TextDocumentIdentifier;
}

/**
 * Represents information about programming constructs like variables, classes,
 * interfaces etc.
 */
export interface SymbolInformation extends BaseSymbolInformation {
    /**
     * Indicates if this symbol is deprecated.
 * 
 * @deprecated Use tags instead
     */
    deprecated?: boolean;
    /**
     * The location of this symbol. The location's range is used by a tool
 * to reveal the location in the editor. If the symbol is selected in the
 * tool the range's start information is used to position the cursor. So
 * the range usually spans more than the actual symbol's name and does
 * normally include things like visibility modifiers.
 * 
 * The range doesn't have to denote a node range in the sense of an abstract
 * syntax tree. It can therefore not be used to re-construct a hierarchy of
 * the symbols.
     */
    location: Location;
}

/**
 * Represents programming constructs like variables, classes, interfaces etc.
 * that appear in a document. Document symbols can be hierarchical and they
 * have two ranges: one that encloses its definition and one that points to
 * its most interesting range, e.g. the range of an identifier.
 */
export interface DocumentSymbol {
    /**
     * The name of this symbol. Will be displayed in the user interface and therefore must not be
 * an empty string or a string only consisting of white spaces.
     */
    name: string;
    /**
     * More detail for this symbol, e.g the signature of a function.
     */
    detail?: string;
    /**
     * The kind of this symbol.
     */
    kind: SymbolKind;
    /**
     * Tags for this document symbol.
 * 
 * @since 3.16.0
     */
    tags?: (SymbolTag)[];
    /**
     * Indicates if this symbol is deprecated.
 * 
 * @deprecated Use tags instead
     */
    deprecated?: boolean;
    /**
     * The range enclosing this symbol not including leading/trailing whitespace but everything else
 * like comments. This information is typically used to determine if the clients cursor is
 * inside the symbol to reveal in the symbol in the UI.
     */
    range: Range;
    /**
     * The range that should be selected and revealed when this symbol is being picked, e.g the name of a function.
 * Must be contained by the `range`.
     */
    selectionRange: Range;
    /**
     * Children of this symbol, e.g. properties of a class.
     */
    children?: (DocumentSymbol)[];
}

/**
 * Registration options for a {@link DocumentSymbolRequest}.
 */
export interface DocumentSymbolRegistrationOptions extends TextDocumentRegistrationOptions, DocumentSymbolOptions {
}

/**
 * The parameters of a {@link CodeActionRequest}.
 */
export interface CodeActionParams extends WorkDoneProgressParams, PartialResultParams {
    /**
     * The document in which the command was invoked.
     */
    textDocument: TextDocumentIdentifier;
    /**
     * The range for which the command was invoked.
     */
    range: Range;
    /**
     * Context carrying additional information.
     */
    context: CodeActionContext;
}

/**
 * Represents a reference to a command. Provides a title which
 * will be used to represent a command in the UI and, optionally,
 * an array of arguments which will be passed to the command handler
 * function when invoked.
 */
export interface Command {
    /**
     * Title of the command, like `save`.
     */
    title: string;
    /**
     * The identifier of the actual command handler.
     */
    command: string;
    /**
     * Arguments that the command handler should be
 * invoked with.
     */
    arguments?: (LSPAny)[];
}

/**
 * A code action represents a change that can be performed in code, e.g. to fix a problem or
 * to refactor code.
 * 
 * A CodeAction must set either `edit` and/or a `command`. If both are supplied, the `edit` is applied first, then the `command` is executed.
 */
export interface CodeAction {
    /**
     * A short, human-readable, title for this code action.
     */
    title: string;
    /**
     * The kind of the code action.
 * 
 * Used to filter code actions.
     */
    kind?: CodeActionKind;
    /**
     * The diagnostics that this code action resolves.
     */
    diagnostics?: (Diagnostic)[];
    /**
     * Marks this as a preferred action. Preferred actions are used by the `auto fix` command and can be targeted
 * by keybindings.
 * 
 * A quick fix should be marked preferred if it properly addresses the underlying error.
 * A refactoring should be marked preferred if it is the most reasonable choice of actions to take.
 * 
 * @since 3.15.0
     */
    isPreferred?: boolean;
    /**
     * Marks that the code action cannot currently be applied.
 * 
 * Clients should follow the following guidelines regarding disabled code actions:
 * 
 *   - Disabled code actions are not shown in automatic [lightbulbs](https://code.visualstudio.com/docs/editor/editingevolved#_code-action)
 *     code action menus.
 * 
 *   - Disabled actions are shown as faded out in the code action menu when the user requests a more specific type
 *     of code action, such as refactorings.
 * 
 *   - If the user has a [keybinding](https://code.visualstudio.com/docs/editor/refactoring#_keybindings-for-code-actions)
 *     that auto applies a code action and only disabled code actions are returned, the client should show the user an
 *     error message with `reason` in the editor.
 * 
 * @since 3.16.0
     */
    disabled?: {
        reason: string
    };
    /**
     * The workspace edit this code action performs.
     */
    edit?: WorkspaceEdit;
    /**
     * A command this code action executes. If a code action
 * provides an edit and a command, first the edit is
 * executed and then the command.
     */
    command?: Command;
    /**
     * A data entry field that is preserved on a code action between
 * a `textDocument/codeAction` and a `codeAction/resolve` request.
 * 
 * @since 3.16.0
     */
    data?: LSPAny;
}

/**
 * Registration options for a {@link CodeActionRequest}.
 */
export interface CodeActionRegistrationOptions extends TextDocumentRegistrationOptions, CodeActionOptions {
}

/**
 * The parameters of a {@link WorkspaceSymbolRequest}.
 */
export interface WorkspaceSymbolParams extends WorkDoneProgressParams, PartialResultParams {
    /**
     * A query string to filter symbols by. Clients may send an empty
 * string here to request all symbols.
     */
    query: string;
}

/**
 * A special workspace symbol that supports locations without a range.
 * 
 * See also SymbolInformation.
 * 
 * @since 3.17.0
 */
export interface WorkspaceSymbol extends BaseSymbolInformation {
    /**
     * The location of the symbol. Whether a server is allowed to
 * return a location without a range depends on the client
 * capability `workspace.symbol.resolveSupport`.
 * 
 * See SymbolInformation#location for more details.
     */
    location: Location | {
        uri: string
    };
    /**
     * A data entry field that is preserved on a workspace symbol between a
 * workspace symbol request and a workspace symbol resolve request.
     */
    data?: LSPAny;
}

/**
 * Registration options for a {@link WorkspaceSymbolRequest}.
 */
export interface WorkspaceSymbolRegistrationOptions extends WorkspaceSymbolOptions {
}

/**
 * The parameters of a {@link CodeLensRequest}.
 */
export interface CodeLensParams extends WorkDoneProgressParams, PartialResultParams {
    /**
     * The document to request code lens for.
     */
    textDocument: TextDocumentIdentifier;
}

/**
 * A code lens represents a {@link Command command} that should be shown along with
 * source text, like the number of references, a way to run tests, etc.
 * 
 * A code lens is _unresolved_ when no command is associated to it. For performance
 * reasons the creation of a code lens and resolving should be done in two stages.
 */
export interface CodeLens {
    /**
     * The range in which this code lens is valid. Should only span a single line.
     */
    range: Range;
    /**
     * The command this code lens represents.
     */
    command?: Command;
    /**
     * A data entry field that is preserved on a code lens item between
 * a {@link CodeLensRequest} and a {@link CodeLensResolveRequest}
     */
    data?: LSPAny;
}

/**
 * Registration options for a {@link CodeLensRequest}.
 */
export interface CodeLensRegistrationOptions extends TextDocumentRegistrationOptions, CodeLensOptions {
}

/**
 * The parameters of a {@link DocumentLinkRequest}.
 */
export interface DocumentLinkParams extends WorkDoneProgressParams, PartialResultParams {
    /**
     * The document to provide document links for.
     */
    textDocument: TextDocumentIdentifier;
}

/**
 * A document link is a range in a text document that links to an internal or external resource, like another
 * text document or a web site.
 */
export interface DocumentLink {
    /**
     * The range this link applies to.
     */
    range: Range;
    /**
     * The uri this link points to. If missing a resolve request is sent later.
     */
    target?: string;
    /**
     * The tooltip text when you hover over this link.
 * 
 * If a tooltip is provided, is will be displayed in a string that includes instructions on how to
 * trigger the link, such as `{0} (ctrl + click)`. The specific instructions vary depending on OS,
 * user settings, and localization.
 * 
 * @since 3.15.0
     */
    tooltip?: string;
    /**
     * A data entry field that is preserved on a document link between a
 * DocumentLinkRequest and a DocumentLinkResolveRequest.
     */
    data?: LSPAny;
}

/**
 * Registration options for a {@link DocumentLinkRequest}.
 */
export interface DocumentLinkRegistrationOptions extends TextDocumentRegistrationOptions, DocumentLinkOptions {
}

/**
 * The parameters of a {@link DocumentFormattingRequest}.
 */
export interface DocumentFormattingParams extends WorkDoneProgressParams {
    /**
     * The document to format.
     */
    textDocument: TextDocumentIdentifier;
    /**
     * The format options.
     */
    options: FormattingOptions;
}

/**
 * Registration options for a {@link DocumentFormattingRequest}.
 */
export interface DocumentFormattingRegistrationOptions extends TextDocumentRegistrationOptions, DocumentFormattingOptions {
}

/**
 * The parameters of a {@link DocumentRangeFormattingRequest}.
 */
export interface DocumentRangeFormattingParams extends WorkDoneProgressParams {
    /**
     * The document to format.
     */
    textDocument: TextDocumentIdentifier;
    /**
     * The range to format
     */
    range: Range;
    /**
     * The format options
     */
    options: FormattingOptions;
}

/**
 * Registration options for a {@link DocumentRangeFormattingRequest}.
 */
export interface DocumentRangeFormattingRegistrationOptions extends TextDocumentRegistrationOptions, DocumentRangeFormattingOptions {
}

/**
 * The parameters of a {@link DocumentRangesFormattingRequest}.
 * 
 * @since 3.18.0
 * @proposed
 */
export interface DocumentRangesFormattingParams extends WorkDoneProgressParams {
    /**
     * The document to format.
     */
    textDocument: TextDocumentIdentifier;
    /**
     * The ranges to format
     */
    ranges: (Range)[];
    /**
     * The format options
     */
    options: FormattingOptions;
}

/**
 * The parameters of a {@link DocumentOnTypeFormattingRequest}.
 */
export interface DocumentOnTypeFormattingParams {
    /**
     * The document to format.
     */
    textDocument: TextDocumentIdentifier;
    /**
     * The position around which the on type formatting should happen.
 * This is not necessarily the exact position where the character denoted
 * by the property `ch` got typed.
     */
    position: Position;
    /**
     * The character that has been typed that triggered the formatting
 * on type request. That is not necessarily the last character that
 * got inserted into the document since the client could auto insert
 * characters as well (e.g. like automatic brace completion).
     */
    ch: string;
    /**
     * The formatting options.
     */
    options: FormattingOptions;
}

/**
 * Registration options for a {@link DocumentOnTypeFormattingRequest}.
 */
export interface DocumentOnTypeFormattingRegistrationOptions extends TextDocumentRegistrationOptions, DocumentOnTypeFormattingOptions {
}

/**
 * The parameters of a {@link RenameRequest}.
 */
export interface RenameParams extends WorkDoneProgressParams {
    /**
     * The document to rename.
     */
    textDocument: TextDocumentIdentifier;
    /**
     * The position at which this request was sent.
     */
    position: Position;
    /**
     * The new name of the symbol. If the given name is not valid the
 * request must return a {@link ResponseError} with an
 * appropriate message set.
     */
    newName: string;
}

/**
 * Registration options for a {@link RenameRequest}.
 */
export interface RenameRegistrationOptions extends TextDocumentRegistrationOptions, RenameOptions {
}

export interface PrepareRenameParams extends TextDocumentPositionParams, WorkDoneProgressParams {
}

/**
 * The parameters of a {@link ExecuteCommandRequest}.
 */
export interface ExecuteCommandParams extends WorkDoneProgressParams {
    /**
     * The identifier of the actual command handler.
     */
    command: string;
    /**
     * Arguments that the command should be invoked with.
     */
    arguments?: (LSPAny)[];
}

/**
 * Registration options for a {@link ExecuteCommandRequest}.
 */
export interface ExecuteCommandRegistrationOptions extends ExecuteCommandOptions {
}

/**
 * The parameters passed via an apply workspace edit request.
 */
export interface ApplyWorkspaceEditParams {
    /**
     * An optional label of the workspace edit. This label is
 * presented in the user interface for example on an undo
 * stack to undo the workspace edit.
     */
    label?: string;
    /**
     * The edits to apply.
     */
    edit: WorkspaceEdit;
}

/**
 * The result returned from the apply workspace edit request.
 * 
 * @since 3.17 renamed from ApplyWorkspaceEditResponse
 */
export interface ApplyWorkspaceEditResult {
    /**
     * Indicates whether the edit was applied or not.
     */
    applied: boolean;
    /**
     * An optional textual description for why the edit was not applied.
 * This may be used by the server for diagnostic logging or to provide
 * a suitable error for a request that triggered the edit.
     */
    failureReason?: string;
    /**
     * Depending on the client's failure handling strategy `failedChange` might
 * contain the index of the change that failed. This property is only available
 * if the client signals a `failureHandlingStrategy` in its client capabilities.
     */
    failedChange?: number;
}

export interface WorkDoneProgressBegin {
    kind: 'begin';
    /**
     * Mandatory title of the progress operation. Used to briefly inform about
 * the kind of operation being performed.
 * 
 * Examples: "Indexing" or "Linking dependencies".
     */
    title: string;
    /**
     * Controls if a cancel button should show to allow the user to cancel the
 * long running operation. Clients that don't support cancellation are allowed
 * to ignore the setting.
     */
    cancellable?: boolean;
    /**
     * Optional, more detailed associated progress message. Contains
 * complementary information to the `title`.
 * 
 * Examples: "3/25 files", "project/src/module2", "node_modules/some_dep".
 * If unset, the previous progress message (if any) is still valid.
     */
    message?: string;
    /**
     * Optional progress percentage to display (value 100 is considered 100%).
 * If not provided infinite progress is assumed and clients are allowed
 * to ignore the `percentage` value in subsequent report notifications.
 * 
 * The value should be steadily rising. Clients are free to ignore values
 * that are not following this rule. The value range is [0, 100].
     */
    percentage?: number;
}

export interface WorkDoneProgressReport {
    kind: 'report';
    /**
     * Controls enablement state of a cancel button.
 * 
 * Clients that don't support cancellation or don't support controlling the button's
 * enablement state are allowed to ignore the property.
     */
    cancellable?: boolean;
    /**
     * Optional, more detailed associated progress message. Contains
 * complementary information to the `title`.
 * 
 * Examples: "3/25 files", "project/src/module2", "node_modules/some_dep".
 * If unset, the previous progress message (if any) is still valid.
     */
    message?: string;
    /**
     * Optional progress percentage to display (value 100 is considered 100%).
 * If not provided infinite progress is assumed and clients are allowed
 * to ignore the `percentage` value in subsequent report notifications.
 * 
 * The value should be steadily rising. Clients are free to ignore values
 * that are not following this rule. The value range is [0, 100].
     */
    percentage?: number;
}

export interface WorkDoneProgressEnd {
    kind: 'end';
    /**
     * Optional, a final message indicating to for example indicate the outcome
 * of the operation.
     */
    message?: string;
}

export interface SetTraceParams {
    value: TraceValues;
}

export interface LogTraceParams {
    message: string;
    verbose?: string;
}

export interface CancelParams {
    /**
     * The request id to cancel.
     */
    id: number | string;
}

export interface ProgressParams {
    /**
     * The progress token provided by the client or server.
     */
    token: ProgressToken;
    /**
     * The progress data.
     */
    value: LSPAny;
}

/**
 * A parameter literal used in requests to pass a text document and a position inside that
 * document.
 */
export interface TextDocumentPositionParams {
    /**
     * The text document.
     */
    textDocument: TextDocumentIdentifier;
    /**
     * The position inside the text document.
     */
    position: Position;
}

export interface WorkDoneProgressParams {
    /**
     * An optional token that a server can use to report work done progress.
     */
    workDoneToken?: ProgressToken;
}

export interface PartialResultParams {
    /**
     * An optional token that a server can use to report partial results (e.g. streaming) to
 * the client.
     */
    partialResultToken?: ProgressToken;
}

/**
 * Represents the connection of two locations. Provides additional metadata over normal {@link Location locations},
 * including an origin range.
 */
export interface LocationLink {
    /**
     * Span of the origin of this link.
 * 
 * Used as the underlined span for mouse interaction. Defaults to the word range at
 * the definition position.
     */
    originSelectionRange?: Range;
    /**
     * The target resource identifier of this link.
     */
    targetUri: string;
    /**
     * The full target range of this link. If the target for example is a symbol then target range is the
 * range enclosing this symbol not including leading/trailing whitespace but everything else
 * like comments. This information is typically used to highlight the range in the editor.
     */
    targetRange: Range;
    /**
     * The range that should be selected and revealed when this link is being followed, e.g the name of a function.
 * Must be contained by the `targetRange`. See also `DocumentSymbol#range`
     */
    targetSelectionRange: Range;
}

/**
 * A range in a text document expressed as (zero-based) start and end positions.
 * 
 * If you want to specify a range that contains a line including the line ending
 * character(s) then use an end position denoting the start of the next line.
 * For example:
 * ```ts
 * {
 *     start: { line: 5, character: 23 }
 *     end : { line 6, character : 0 }
 * }
 * ```
 */
export interface Range {
    /**
     * The range's start position.
     */
    start: Position;
    /**
     * The range's end position.
     */
    end: Position;
}

export interface ImplementationOptions extends WorkDoneProgressOptions {
}

/**
 * Static registration options to be returned in the initialize
 * request.
 */
export interface StaticRegistrationOptions {
    /**
     * The id used to register the request. The id can be used to deregister
 * the request again. See also Registration#id.
     */
    id?: string;
}

export interface TypeDefinitionOptions extends WorkDoneProgressOptions {
}

/**
 * The workspace folder change event.
 */
export interface WorkspaceFoldersChangeEvent {
    /**
     * The array of added workspace folders
     */
    added: (WorkspaceFolder)[];
    /**
     * The array of the removed workspace folders
     */
    removed: (WorkspaceFolder)[];
}

export interface ConfigurationItem {
    /**
     * The scope to get the configuration section for.
     */
    scopeUri?: string;
    /**
     * The configuration section asked for.
     */
    section?: string;
}

/**
 * A literal to identify a text document in the client.
 */
export interface TextDocumentIdentifier {
    /**
     * The text document's uri.
     */
    uri: string;
}

/**
 * Represents a color in RGBA space.
 */
export interface Color {
    /**
     * The red component of this color in the range [0-1].
     */
    red: number;
    /**
     * The green component of this color in the range [0-1].
     */
    green: number;
    /**
     * The blue component of this color in the range [0-1].
     */
    blue: number;
    /**
     * The alpha component of this color in the range [0-1].
     */
    alpha: number;
}

export interface DocumentColorOptions extends WorkDoneProgressOptions {
}

export interface FoldingRangeOptions extends WorkDoneProgressOptions {
}

export interface DeclarationOptions extends WorkDoneProgressOptions {
}

/**
 * Position in a text document expressed as zero-based line and character
 * offset. Prior to 3.17 the offsets were always based on a UTF-16 string
 * representation. So a string of the form `a𐐀b` the character offset of the
 * character `a` is 0, the character offset of `𐐀` is 1 and the character
 * offset of b is 3 since `𐐀` is represented using two code units in UTF-16.
 * Since 3.17 clients and servers can agree on a different string encoding
 * representation (e.g. UTF-8). The client announces it's supported encoding
 * via the client capability [`general.positionEncodings`](https://microsoft.github.io/language-server-protocol/specifications/specification-current/#clientCapabilities).
 * The value is an array of position encodings the client supports, with
 * decreasing preference (e.g. the encoding at index `0` is the most preferred
 * one). To stay backwards compatible the only mandatory encoding is UTF-16
 * represented via the string `utf-16`. The server can pick one of the
 * encodings offered by the client and signals that encoding back to the
 * client via the initialize result's property
 * [`capabilities.positionEncoding`](https://microsoft.github.io/language-server-protocol/specifications/specification-current/#serverCapabilities). If the string value
 * `utf-16` is missing from the client's capability `general.positionEncodings`
 * servers can safely assume that the client supports UTF-16. If the server
 * omits the position encoding in its initialize result the encoding defaults
 * to the string value `utf-16`. Implementation considerations: since the
 * conversion from one encoding into another requires the content of the
 * file / line the conversion is best done where the file is read which is
 * usually on the server side.
 * 
 * Positions are line end character agnostic. So you can not specify a position
 * that denotes `\r|\n` or `\n|` where `|` represents the character offset.
 * 
 * @since 3.17.0 - support for negotiated position encoding.
 */
export interface Position {
    /**
     * Line position in a document (zero-based).
 * 
 * If a line number is greater than the number of lines in a document, it defaults back to the number of lines in the document.
 * If a line number is negative, it defaults to 0.
     */
    line: number;
    /**
     * Character offset on a line in a document (zero-based).
 * 
 * The meaning of this offset is determined by the negotiated
 * `PositionEncodingKind`.
 * 
 * If the character value is greater than the line length it defaults back to the
 * line length.
     */
    character: number;
}

export interface SelectionRangeOptions extends WorkDoneProgressOptions {
}

/**
 * Call hierarchy options used during static registration.
 * 
 * @since 3.16.0
 */
export interface CallHierarchyOptions extends WorkDoneProgressOptions {
}

/**
 * @since 3.16.0
 */
export interface SemanticTokensOptions extends WorkDoneProgressOptions {
    /**
     * The legend used by the server
     */
    legend: SemanticTokensLegend;
    /**
     * Server supports providing semantic tokens for a specific range
 * of a document.
     */
    range?: boolean | {

    };
    /**
     * Server supports providing semantic tokens for a full document.
     */
    full?: boolean | {
        delta?: boolean
    };
}

/**
 * @since 3.16.0
 */
export interface SemanticTokensEdit {
    /**
     * The start offset of the edit.
     */
    start: number;
    /**
     * The count of elements to remove.
     */
    deleteCount: number;
    /**
     * The elements to insert.
     */
    data?: (number)[];
}

export interface LinkedEditingRangeOptions extends WorkDoneProgressOptions {
}

/**
 * Represents information on a file/folder create.
 * 
 * @since 3.16.0
 */
export interface FileCreate {
    /**
     * A file:// URI for the location of the file/folder being created.
     */
    uri: string;
}

/**
 * Describes textual changes on a text document. A TextDocumentEdit describes all changes
 * on a document version Si and after they are applied move the document to version Si+1.
 * So the creator of a TextDocumentEdit doesn't need to sort the array of edits or do any
 * kind of ordering. However the edits must be non overlapping.
 */
export interface TextDocumentEdit {
    /**
     * The text document to change.
     */
    textDocument: OptionalVersionedTextDocumentIdentifier;
    /**
     * The edits to be applied.
 * 
 * @since 3.16.0 - support for AnnotatedTextEdit. This is guarded using a
 * client capability.
     */
    edits: (TextEdit | AnnotatedTextEdit)[];
}

/**
 * Create file operation.
 */
export interface CreateFile extends ResourceOperation {
    /**
     * A create
     */
    kind: 'create';
    /**
     * The resource to create.
     */
    uri: string;
    /**
     * Additional options
     */
    options?: CreateFileOptions;
}

/**
 * Rename file operation
 */
export interface RenameFile extends ResourceOperation {
    /**
     * A rename
     */
    kind: 'rename';
    /**
     * The old (existing) location.
     */
    oldUri: string;
    /**
     * The new location.
     */
    newUri: string;
    /**
     * Rename options.
     */
    options?: RenameFileOptions;
}

/**
 * Delete file operation
 */
export interface DeleteFile extends ResourceOperation {
    /**
     * A delete
     */
    kind: 'delete';
    /**
     * The file to delete.
     */
    uri: string;
    /**
     * Delete options.
     */
    options?: DeleteFileOptions;
}

/**
 * Additional information that describes document changes.
 * 
 * @since 3.16.0
 */
export interface ChangeAnnotation {
    /**
     * A human-readable string describing the actual change. The string
 * is rendered prominent in the user interface.
     */
    label: string;
    /**
     * A flag which indicates that user confirmation is needed
 * before applying the change.
     */
    needsConfirmation?: boolean;
    /**
     * A human-readable string which is rendered less prominent in
 * the user interface.
     */
    description?: string;
}

/**
 * A filter to describe in which file operation requests or notifications
 * the server is interested in receiving.
 * 
 * @since 3.16.0
 */
export interface FileOperationFilter {
    /**
     * A Uri scheme like `file` or `untitled`.
     */
    scheme?: string;
    /**
     * The actual file operation pattern.
     */
    pattern: FileOperationPattern;
}

/**
 * Represents information on a file/folder rename.
 * 
 * @since 3.16.0
 */
export interface FileRename {
    /**
     * A file:// URI for the original location of the file/folder being renamed.
     */
    oldUri: string;
    /**
     * A file:// URI for the new location of the file/folder being renamed.
     */
    newUri: string;
}

/**
 * Represents information on a file/folder delete.
 * 
 * @since 3.16.0
 */
export interface FileDelete {
    /**
     * A file:// URI for the location of the file/folder being deleted.
     */
    uri: string;
}

export interface MonikerOptions extends WorkDoneProgressOptions {
}

/**
 * Type hierarchy options used during static registration.
 * 
 * @since 3.17.0
 */
export interface TypeHierarchyOptions extends WorkDoneProgressOptions {
}

/**
 * @since 3.17.0
 */
export interface InlineValueContext {
    /**
     * The stack frame (as a DAP Id) where the execution has stopped.
     */
    frameId: number;
    /**
     * The document range where execution has stopped.
 * Typically the end position of the range denotes the line where the inline values are shown.
     */
    stoppedLocation: Range;
}

/**
 * Provide inline value as text.
 * 
 * @since 3.17.0
 */
export interface InlineValueText {
    /**
     * The document range for which the inline value applies.
     */
    range: Range;
    /**
     * The text of the inline value.
     */
    text: string;
}

/**
 * Provide inline value through a variable lookup.
 * If only a range is specified, the variable name will be extracted from the underlying document.
 * An optional variable name can be used to override the extracted name.
 * 
 * @since 3.17.0
 */
export interface InlineValueVariableLookup {
    /**
     * The document range for which the inline value applies.
 * The range is used to extract the variable name from the underlying document.
     */
    range: Range;
    /**
     * If specified the name of the variable to look up.
     */
    variableName?: string;
    /**
     * How to perform the lookup.
     */
    caseSensitiveLookup: boolean;
}

/**
 * Provide an inline value through an expression evaluation.
 * If only a range is specified, the expression will be extracted from the underlying document.
 * An optional expression can be used to override the extracted expression.
 * 
 * @since 3.17.0
 */
export interface InlineValueEvaluatableExpression {
    /**
     * The document range for which the inline value applies.
 * The range is used to extract the evaluatable expression from the underlying document.
     */
    range: Range;
    /**
     * If specified the expression overrides the extracted expression.
     */
    expression?: string;
}

/**
 * Inline value options used during static registration.
 * 
 * @since 3.17.0
 */
export interface InlineValueOptions extends WorkDoneProgressOptions {
}

/**
 * An inlay hint label part allows for interactive and composite labels
 * of inlay hints.
 * 
 * @since 3.17.0
 */
export interface InlayHintLabelPart {
    /**
     * The value of this label part.
     */
    value: string;
    /**
     * The tooltip text when you hover over this label part. Depending on
 * the client capability `inlayHint.resolveSupport` clients might resolve
 * this property late using the resolve request.
     */
    tooltip?: string | MarkupContent;
    /**
     * An optional source code location that represents this
 * label part.
 * 
 * The editor will use this location for the hover and for code navigation
 * features: This part will become a clickable link that resolves to the
 * definition of the symbol at the given location (not necessarily the
 * location itself), it shows the hover that shows at the given location,
 * and it shows a context menu with further code navigation commands.
 * 
 * Depending on the client capability `inlayHint.resolveSupport` clients
 * might resolve this property late using the resolve request.
     */
    location?: Location;
    /**
     * An optional command for this label part.
 * 
 * Depending on the client capability `inlayHint.resolveSupport` clients
 * might resolve this property late using the resolve request.
     */
    command?: Command;
}

/**
 * A `MarkupContent` literal represents a string value which content is interpreted base on its
 * kind flag. Currently the protocol supports `plaintext` and `markdown` as markup kinds.
 * 
 * If the kind is `markdown` then the value can contain fenced code blocks like in GitHub issues.
 * See https://help.github.com/articles/creating-and-highlighting-code-blocks/#syntax-highlighting
 * 
 * Here is an example how such a string can be constructed using JavaScript / TypeScript:
 * ```ts
 * let markdown: MarkdownContent = {
 *  kind: MarkupKind.Markdown,
 *  value: [
 *    '# Header',
 *    'Some text',
 *    '```typescript',
 *    'someCode();',
 *    '```'
 *  ].join('\n')
 * };
 * ```
 * 
 * *Please Note* that clients might sanitize the return markdown. A client could decide to
 * remove HTML from the markdown to avoid script execution.
 */
export interface MarkupContent {
    /**
     * The type of the Markup
     */
    kind: MarkupKind;
    /**
     * The content itself
     */
    value: string;
}

/**
 * Inlay hint options used during static registration.
 * 
 * @since 3.17.0
 */
export interface InlayHintOptions extends WorkDoneProgressOptions {
    /**
     * The server provides support to resolve additional
 * information for an inlay hint item.
     */
    resolveProvider?: boolean;
}

/**
 * A full diagnostic report with a set of related documents.
 * 
 * @since 3.17.0
 */
export interface RelatedFullDocumentDiagnosticReport extends FullDocumentDiagnosticReport {
    /**
     * Diagnostics of related documents. This information is useful
 * in programming languages where code in a file A can generate
 * diagnostics in a file B which A depends on. An example of
 * such a language is C/C++ where marco definitions in a file
 * a.cpp and result in errors in a header file b.hpp.
 * 
 * @since 3.17.0
     */
    relatedDocuments?: { [key: string]: FullDocumentDiagnosticReport | UnchangedDocumentDiagnosticReport };
}

/**
 * An unchanged diagnostic report with a set of related documents.
 * 
 * @since 3.17.0
 */
export interface RelatedUnchangedDocumentDiagnosticReport extends UnchangedDocumentDiagnosticReport {
    /**
     * Diagnostics of related documents. This information is useful
 * in programming languages where code in a file A can generate
 * diagnostics in a file B which A depends on. An example of
 * such a language is C/C++ where marco definitions in a file
 * a.cpp and result in errors in a header file b.hpp.
 * 
 * @since 3.17.0
     */
    relatedDocuments?: { [key: string]: FullDocumentDiagnosticReport | UnchangedDocumentDiagnosticReport };
}

/**
 * A diagnostic report with a full set of problems.
 * 
 * @since 3.17.0
 */
export interface FullDocumentDiagnosticReport {
    /**
     * A full document diagnostic report.
     */
    kind: 'full';
    /**
     * An optional result id. If provided it will
 * be sent on the next diagnostic request for the
 * same document.
     */
    resultId?: string;
    /**
     * The actual items.
     */
    items: (Diagnostic)[];
}

/**
 * A diagnostic report indicating that the last returned
 * report is still accurate.
 * 
 * @since 3.17.0
 */
export interface UnchangedDocumentDiagnosticReport {
    /**
     * A document diagnostic report indicating
 * no changes to the last result. A server can
 * only return `unchanged` if result ids are
 * provided.
     */
    kind: 'unchanged';
    /**
     * A result id which will be sent on the next
 * diagnostic request for the same document.
     */
    resultId: string;
}

/**
 * Diagnostic options.
 * 
 * @since 3.17.0
 */
export interface DiagnosticOptions extends WorkDoneProgressOptions {
    /**
     * An optional identifier under which the diagnostics are
 * managed by the client.
     */
    identifier?: string;
    /**
     * Whether the language has inter file dependencies meaning that
 * editing code in one file can result in a different diagnostic
 * set in another file. Inter file dependencies are common for
 * most programming languages and typically uncommon for linters.
     */
    interFileDependencies: boolean;
    /**
     * The server provides support for workspace diagnostics as well.
     */
    workspaceDiagnostics: boolean;
}

/**
 * A previous result id in a workspace pull request.
 * 
 * @since 3.17.0
 */
export interface PreviousResultId {
    /**
     * The URI for which the client knowns a
 * result id.
     */
    uri: string;
    /**
     * The value of the previous result id.
     */
    value: string;
}

/**
 * A notebook document.
 * 
 * @since 3.17.0
 */
export interface NotebookDocument {
    /**
     * The notebook document's uri.
     */
    uri: string;
    /**
     * The type of the notebook.
     */
    notebookType: string;
    /**
     * The version number of this document (it will increase after each
 * change, including undo/redo).
     */
    version: number;
    /**
     * Additional metadata stored with the notebook
 * document.
 * 
 * Note: should always be an object literal (e.g. LSPObject)
     */
    metadata?: LSPObject;
    /**
     * The cells of a notebook.
     */
    cells: (NotebookCell)[];
}

/**
 * An item to transfer a text document from the client to the
 * server.
 */
export interface TextDocumentItem {
    /**
     * The text document's uri.
     */
    uri: string;
    /**
     * The text document's language identifier.
     */
    languageId: string;
    /**
     * The version number of this document (it will increase after each
 * change, including undo/redo).
     */
    version: number;
    /**
     * The content of the opened text document.
     */
    text: string;
}

/**
 * A versioned notebook document identifier.
 * 
 * @since 3.17.0
 */
export interface VersionedNotebookDocumentIdentifier {
    /**
     * The version number of this notebook document.
     */
    version: number;
    /**
     * The notebook document's uri.
     */
    uri: string;
}

/**
 * A change event for a notebook document.
 * 
 * @since 3.17.0
 */
export interface NotebookDocumentChangeEvent {
    /**
     * The changed meta data if any.
 * 
 * Note: should always be an object literal (e.g. LSPObject)
     */
    metadata?: LSPObject;
    /**
     * Changes to cells
     */
    cells?: {
        structure?: {
            array: NotebookCellArrayChange;
            didOpen?: (TextDocumentItem)[];
            didClose?: (TextDocumentIdentifier)[]
        };
        data?: (NotebookCell)[];
        textContent?: ({
            document: VersionedTextDocumentIdentifier;
            changes: (TextDocumentContentChangeEvent)[]
        })[]
    };
}

/**
 * A literal to identify a notebook document in the client.
 * 
 * @since 3.17.0
 */
export interface NotebookDocumentIdentifier {
    /**
     * The notebook document's uri.
     */
    uri: string;
}

/**
 * Provides information about the context in which an inline completion was requested.
 * 
 * @since 3.18.0
 * @proposed
 */
export interface InlineCompletionContext {
    /**
     * Describes how the inline completion was triggered.
     */
    triggerKind: InlineCompletionTriggerKind;
    /**
     * Provides information about the currently selected item in the autocomplete widget if it is visible.
     */
    selectedCompletionInfo?: SelectedCompletionInfo;
}

/**
 * A string value used as a snippet is a template which allows to insert text
 * and to control the editor cursor when insertion happens.
 * 
 * A snippet can define tab stops and placeholders with `$1`, `$2`
 * and `${3:foo}`. `$0` defines the final tab stop, it defaults to
 * the end of the snippet. Variables are defined with `$name` and
 * `${name:default value}`.
 * 
 * @since 3.18.0
 * @proposed
 */
export interface StringValue {
    /**
     * The kind of string value.
     */
    kind: 'snippet';
    /**
     * The snippet string.
     */
    value: string;
}

/**
 * Inline completion options used during static registration.
 * 
 * @since 3.18.0
 * @proposed
 */
export interface InlineCompletionOptions extends WorkDoneProgressOptions {
}

/**
 * General parameters to register for a notification or to register a provider.
 */
export interface Registration {
    /**
     * The id used to register the request. The id can be used to deregister
 * the request again.
     */
    id: string;
    /**
     * The method / capability to register for.
     */
    method: string;
    /**
     * Options necessary for the registration.
     */
    registerOptions?: LSPAny;
}

/**
 * General parameters to unregister a request or notification.
 */
export interface Unregistration {
    /**
     * The id used to unregister the request or notification. Usually an id
 * provided during the register request.
     */
    id: string;
    /**
     * The method to unregister for.
     */
    method: string;
}

/**
 * The initialize parameters
 */
export interface _InitializeParams extends WorkDoneProgressParams {
    /**
     * The process Id of the parent process that started
 * the server.
 * 
 * Is `null` if the process has not been started by another process.
 * If the parent process is not alive then the server should exit.
     */
    processId: number | null;
    /**
     * Information about the client
 * 
 * @since 3.15.0
     */
    clientInfo?: {
        name: string;
        version?: string
    };
    /**
     * The locale the client is currently showing the user interface
 * in. This must not necessarily be the locale of the operating
 * system.
 * 
 * Uses IETF language tags as the value's syntax
 * (See https://en.wikipedia.org/wiki/IETF_language_tag)
 * 
 * @since 3.16.0
     */
    locale?: string;
    /**
     * The rootPath of the workspace. Is null
 * if no folder is open.
 * 
 * @deprecated in favour of rootUri.
     */
    rootPath?: string | null;
    /**
     * The rootUri of the workspace. Is null if no
 * folder is open. If both `rootPath` and `rootUri` are set
 * `rootUri` wins.
 * 
 * @deprecated in favour of workspaceFolders.
     */
    rootUri: string | null;
    /**
     * The capabilities provided by the client (editor or tool)
     */
    capabilities: ClientCapabilities;
    /**
     * User provided initialization options.
     */
    initializationOptions?: LSPAny;
    /**
     * The initial trace setting. If omitted trace is disabled ('off').
     */
    trace?: TraceValues;
}

export interface WorkspaceFoldersInitializeParams {
    /**
     * The workspace folders configured in the client when the server starts.
 * 
 * This property is only available if the client supports workspace folders.
 * It can be `null` if the client supports workspace folders but none are
 * configured.
 * 
 * @since 3.6.0
     */
    workspaceFolders?: (WorkspaceFolder)[] | null;
}

/**
 * Defines the capabilities provided by a language
 * server.
 */
export interface ServerCapabilities {
    /**
     * The position encoding the server picked from the encodings offered
 * by the client via the client capability `general.positionEncodings`.
 * 
 * If the client didn't provide any position encodings the only valid
 * value that a server can return is 'utf-16'.
 * 
 * If omitted it defaults to 'utf-16'.
 * 
 * @since 3.17.0
     */
    positionEncoding?: PositionEncodingKind;
    /**
     * Defines how text documents are synced. Is either a detailed structure
 * defining each notification or for backwards compatibility the
 * TextDocumentSyncKind number.
     */
    textDocumentSync?: TextDocumentSyncOptions | TextDocumentSyncKind;
    /**
     * Defines how notebook documents are synced.
 * 
 * @since 3.17.0
     */
    notebookDocumentSync?: NotebookDocumentSyncOptions | NotebookDocumentSyncRegistrationOptions;
    /**
     * The server provides completion support.
     */
    completionProvider?: CompletionOptions;
    /**
     * The server provides hover support.
     */
    hoverProvider?: boolean | HoverOptions;
    /**
     * The server provides signature help support.
     */
    signatureHelpProvider?: SignatureHelpOptions;
    /**
     * The server provides Goto Declaration support.
     */
    declarationProvider?: boolean | DeclarationOptions | DeclarationRegistrationOptions;
    /**
     * The server provides goto definition support.
     */
    definitionProvider?: boolean | DefinitionOptions;
    /**
     * The server provides Goto Type Definition support.
     */
    typeDefinitionProvider?: boolean | TypeDefinitionOptions | TypeDefinitionRegistrationOptions;
    /**
     * The server provides Goto Implementation support.
     */
    implementationProvider?: boolean | ImplementationOptions | ImplementationRegistrationOptions;
    /**
     * The server provides find references support.
     */
    referencesProvider?: boolean | ReferenceOptions;
    /**
     * The server provides document highlight support.
     */
    documentHighlightProvider?: boolean | DocumentHighlightOptions;
    /**
     * The server provides document symbol support.
     */
    documentSymbolProvider?: boolean | DocumentSymbolOptions;
    /**
     * The server provides code actions. CodeActionOptions may only be
 * specified if the client states that it supports
 * `codeActionLiteralSupport` in its initial `initialize` request.
     */
    codeActionProvider?: boolean | CodeActionOptions;
    /**
     * The server provides code lens.
     */
    codeLensProvider?: CodeLensOptions;
    /**
     * The server provides document link support.
     */
    documentLinkProvider?: DocumentLinkOptions;
    /**
     * The server provides color provider support.
     */
    colorProvider?: boolean | DocumentColorOptions | DocumentColorRegistrationOptions;
    /**
     * The server provides workspace symbol support.
     */
    workspaceSymbolProvider?: boolean | WorkspaceSymbolOptions;
    /**
     * The server provides document formatting.
     */
    documentFormattingProvider?: boolean | DocumentFormattingOptions;
    /**
     * The server provides document range formatting.
     */
    documentRangeFormattingProvider?: boolean | DocumentRangeFormattingOptions;
    /**
     * The server provides document formatting on typing.
     */
    documentOnTypeFormattingProvider?: DocumentOnTypeFormattingOptions;
    /**
     * The server provides rename support. RenameOptions may only be
 * specified if the client states that it supports
 * `prepareSupport` in its initial `initialize` request.
     */
    renameProvider?: boolean | RenameOptions;
    /**
     * The server provides folding provider support.
     */
    foldingRangeProvider?: boolean | FoldingRangeOptions | FoldingRangeRegistrationOptions;
    /**
     * The server provides selection range support.
     */
    selectionRangeProvider?: boolean | SelectionRangeOptions | SelectionRangeRegistrationOptions;
    /**
     * The server provides execute command support.
     */
    executeCommandProvider?: ExecuteCommandOptions;
    /**
     * The server provides call hierarchy support.
 * 
 * @since 3.16.0
     */
    callHierarchyProvider?: boolean | CallHierarchyOptions | CallHierarchyRegistrationOptions;
    /**
     * The server provides linked editing range support.
 * 
 * @since 3.16.0
     */
    linkedEditingRangeProvider?: boolean | LinkedEditingRangeOptions | LinkedEditingRangeRegistrationOptions;
    /**
     * The server provides semantic tokens support.
 * 
 * @since 3.16.0
     */
    semanticTokensProvider?: SemanticTokensOptions | SemanticTokensRegistrationOptions;
    /**
     * The server provides moniker support.
 * 
 * @since 3.16.0
     */
    monikerProvider?: boolean | MonikerOptions | MonikerRegistrationOptions;
    /**
     * The server provides type hierarchy support.
 * 
 * @since 3.17.0
     */
    typeHierarchyProvider?: boolean | TypeHierarchyOptions | TypeHierarchyRegistrationOptions;
    /**
     * The server provides inline values.
 * 
 * @since 3.17.0
     */
    inlineValueProvider?: boolean | InlineValueOptions | InlineValueRegistrationOptions;
    /**
     * The server provides inlay hints.
 * 
 * @since 3.17.0
     */
    inlayHintProvider?: boolean | InlayHintOptions | InlayHintRegistrationOptions;
    /**
     * The server has support for pull model diagnostics.
 * 
 * @since 3.17.0
     */
    diagnosticProvider?: DiagnosticOptions | DiagnosticRegistrationOptions;
    /**
     * Inline completion options used during static registration.
 * 
 * @since 3.18.0
 * @proposed
     */
    inlineCompletionProvider?: boolean | InlineCompletionOptions;
    /**
     * Workspace specific server capabilities.
     */
    workspace?: {
        workspaceFolders?: WorkspaceFoldersServerCapabilities;
        fileOperations?: FileOperationOptions
    };
    /**
     * Experimental server capabilities.
     */
    experimental?: LSPAny;
}

/**
 * A text document identifier to denote a specific version of a text document.
 */
export interface VersionedTextDocumentIdentifier extends TextDocumentIdentifier {
    /**
     * The version number of this document.
     */
    version: number;
}

/**
 * Save options.
 */
export interface SaveOptions {
    /**
     * The client is supposed to include the content on save.
     */
    includeText?: boolean;
}

/**
 * An event describing a file change.
 */
export interface FileEvent {
    /**
     * The file's uri.
     */
    uri: string;
    /**
     * The change type.
     */
    type: FileChangeType;
}

export interface FileSystemWatcher {
    /**
     * The glob pattern to watch. See {@link GlobPattern glob pattern} for more detail.
 * 
 * @since 3.17.0 support for relative patterns.
     */
    globPattern: GlobPattern;
    /**
     * The kind of events of interest. If omitted it defaults
 * to WatchKind.Create | WatchKind.Change | WatchKind.Delete
 * which is 7.
     */
    kind?: WatchKind;
}

/**
 * Represents a diagnostic, such as a compiler error or warning. Diagnostic objects
 * are only valid in the scope of a resource.
 */
export interface Diagnostic {
    /**
     * The range at which the message applies
     */
    range: Range;
    /**
     * The diagnostic's severity. Can be omitted. If omitted it is up to the
 * client to interpret diagnostics as error, warning, info or hint.
     */
    severity?: DiagnosticSeverity;
    /**
     * The diagnostic's code, which usually appear in the user interface.
     */
    code?: number | string;
    /**
     * An optional property to describe the error code.
 * Requires the code field (above) to be present/not null.
 * 
 * @since 3.16.0
     */
    codeDescription?: CodeDescription;
    /**
     * A human-readable string describing the source of this
 * diagnostic, e.g. 'typescript' or 'super lint'. It usually
 * appears in the user interface.
     */
    source?: string;
    /**
     * The diagnostic's message. It usually appears in the user interface
     */
    message: string;
    /**
     * Additional metadata about the diagnostic.
 * 
 * @since 3.15.0
     */
    tags?: (DiagnosticTag)[];
    /**
     * An array of related diagnostic information, e.g. when symbol-names within
 * a scope collide all definitions can be marked via this property.
     */
    relatedInformation?: (DiagnosticRelatedInformation)[];
    /**
     * A data entry field that is preserved between a `textDocument/publishDiagnostics`
 * notification and `textDocument/codeAction` request.
 * 
 * @since 3.16.0
     */
    data?: LSPAny;
}

/**
 * Contains additional information about the context in which a completion request is triggered.
 */
export interface CompletionContext {
    /**
     * How the completion was triggered.
     */
    triggerKind: CompletionTriggerKind;
    /**
     * The trigger character (a single character) that has trigger code complete.
 * Is undefined if `triggerKind !== CompletionTriggerKind.TriggerCharacter`
     */
    triggerCharacter?: string;
}

/**
 * Additional details for a completion item label.
 * 
 * @since 3.17.0
 */
export interface CompletionItemLabelDetails {
    /**
     * An optional string which is rendered less prominently directly after {@link CompletionItem.label label},
 * without any spacing. Should be used for function signatures and type annotations.
     */
    detail?: string;
    /**
     * An optional string which is rendered less prominently after {@link CompletionItem.detail}. Should be used
 * for fully qualified names and file paths.
     */
    description?: string;
}

/**
 * A special text edit to provide an insert and a replace operation.
 * 
 * @since 3.16.0
 */
export interface InsertReplaceEdit {
    /**
     * The string to be inserted.
     */
    newText: string;
    /**
     * The range if the insert is requested
     */
    insert: Range;
    /**
     * The range if the replace is requested.
     */
    replace: Range;
}

/**
 * Completion options.
 */
export interface CompletionOptions extends WorkDoneProgressOptions {
    /**
     * Most tools trigger completion request automatically without explicitly requesting
 * it using a keyboard shortcut (e.g. Ctrl+Space). Typically they do so when the user
 * starts to type an identifier. For example if the user types `c` in a JavaScript file
 * code complete will automatically pop up present `console` besides others as a
 * completion item. Characters that make up identifiers don't need to be listed here.
 * 
 * If code complete should automatically be trigger on characters not being valid inside
 * an identifier (for example `.` in JavaScript) list them in `triggerCharacters`.
     */
    triggerCharacters?: (string)[];
    /**
     * The list of all possible characters that commit a completion. This field can be used
 * if clients don't support individual commit characters per completion item. See
 * `ClientCapabilities.textDocument.completion.completionItem.commitCharactersSupport`
 * 
 * If a server provides both `allCommitCharacters` and commit characters on an individual
 * completion item the ones on the completion item win.
 * 
 * @since 3.2.0
     */
    allCommitCharacters?: (string)[];
    /**
     * The server provides support to resolve additional
 * information for a completion item.
     */
    resolveProvider?: boolean;
    /**
     * The server supports the following `CompletionItem` specific
 * capabilities.
 * 
 * @since 3.17.0
     */
    completionItem?: {
        labelDetailsSupport?: boolean
    };
}

/**
 * Hover options.
 */
export interface HoverOptions extends WorkDoneProgressOptions {
}

/**
 * Additional information about the context in which a signature help request was triggered.
 * 
 * @since 3.15.0
 */
export interface SignatureHelpContext {
    /**
     * Action that caused signature help to be triggered.
     */
    triggerKind: SignatureHelpTriggerKind;
    /**
     * Character that caused signature help to be triggered.
 * 
 * This is undefined when `triggerKind !== SignatureHelpTriggerKind.TriggerCharacter`
     */
    triggerCharacter?: string;
    /**
     * `true` if signature help was already showing when it was triggered.
 * 
 * Retriggers occurs when the signature help is already active and can be caused by actions such as
 * typing a trigger character, a cursor move, or document content changes.
     */
    isRetrigger: boolean;
    /**
     * The currently active `SignatureHelp`.
 * 
 * The `activeSignatureHelp` has its `SignatureHelp.activeSignature` field updated based on
 * the user navigating through available signatures.
     */
    activeSignatureHelp?: SignatureHelp;
}

/**
 * Represents the signature of something callable. A signature
 * can have a label, like a function-name, a doc-comment, and
 * a set of parameters.
 */
export interface SignatureInformation {
    /**
     * The label of this signature. Will be shown in
 * the UI.
     */
    label: string;
    /**
     * The human-readable doc-comment of this signature. Will be shown
 * in the UI but can be omitted.
     */
    documentation?: string | MarkupContent;
    /**
     * The parameters of this signature.
     */
    parameters?: (ParameterInformation)[];
    /**
     * The index of the active parameter.
 * 
 * If provided, this is used in place of `SignatureHelp.activeParameter`.
 * 
 * @since 3.16.0
     */
    activeParameter?: number;
}

/**
 * Server Capabilities for a {@link SignatureHelpRequest}.
 */
export interface SignatureHelpOptions extends WorkDoneProgressOptions {
    /**
     * List of characters that trigger signature help automatically.
     */
    triggerCharacters?: (string)[];
    /**
     * List of characters that re-trigger signature help.
 * 
 * These trigger characters are only active when signature help is already showing. All trigger characters
 * are also counted as re-trigger characters.
 * 
 * @since 3.15.0
     */
    retriggerCharacters?: (string)[];
}

/**
 * Server Capabilities for a {@link DefinitionRequest}.
 */
export interface DefinitionOptions extends WorkDoneProgressOptions {
}

/**
 * Value-object that contains additional information when
 * requesting references.
 */
export interface ReferenceContext {
    /**
     * Include the declaration of the current symbol.
     */
    includeDeclaration: boolean;
}

/**
 * Reference options.
 */
export interface ReferenceOptions extends WorkDoneProgressOptions {
}

/**
 * Provider options for a {@link DocumentHighlightRequest}.
 */
export interface DocumentHighlightOptions extends WorkDoneProgressOptions {
}

/**
 * A base for all symbol information.
 */
export interface BaseSymbolInformation {
    /**
     * The name of this symbol.
     */
    name: string;
    /**
     * The kind of this symbol.
     */
    kind: SymbolKind;
    /**
     * Tags for this symbol.
 * 
 * @since 3.16.0
     */
    tags?: (SymbolTag)[];
    /**
     * The name of the symbol containing this symbol. This information is for
 * user interface purposes (e.g. to render a qualifier in the user interface
 * if necessary). It can't be used to re-infer a hierarchy for the document
 * symbols.
     */
    containerName?: string;
}

/**
 * Provider options for a {@link DocumentSymbolRequest}.
 */
export interface DocumentSymbolOptions extends WorkDoneProgressOptions {
    /**
     * A human-readable string that is shown when multiple outlines trees
 * are shown for the same document.
 * 
 * @since 3.16.0
     */
    label?: string;
}

/**
 * Contains additional diagnostic information about the context in which
 * a {@link CodeActionProvider.provideCodeActions code action} is run.
 */
export interface CodeActionContext {
    /**
     * An array of diagnostics known on the client side overlapping the range provided to the
 * `textDocument/codeAction` request. They are provided so that the server knows which
 * errors are currently presented to the user for the given range. There is no guarantee
 * that these accurately reflect the error state of the resource. The primary parameter
 * to compute code actions is the provided range.
     */
    diagnostics: (Diagnostic)[];
    /**
     * Requested kind of actions to return.
 * 
 * Actions not of this kind are filtered out by the client before being shown. So servers
 * can omit computing them.
     */
    only?: (CodeActionKind)[];
    /**
     * The reason why code actions were requested.
 * 
 * @since 3.17.0
     */
    triggerKind?: CodeActionTriggerKind;
}

/**
 * Provider options for a {@link CodeActionRequest}.
 */
export interface CodeActionOptions extends WorkDoneProgressOptions {
    /**
     * CodeActionKinds that this server may return.
 * 
 * The list of kinds may be generic, such as `CodeActionKind.Refactor`, or the server
 * may list out every specific kind they provide.
     */
    codeActionKinds?: (CodeActionKind)[];
    /**
     * The server provides support to resolve additional
 * information for a code action.
 * 
 * @since 3.16.0
     */
    resolveProvider?: boolean;
}

/**
 * Server capabilities for a {@link WorkspaceSymbolRequest}.
 */
export interface WorkspaceSymbolOptions extends WorkDoneProgressOptions {
    /**
     * The server provides support to resolve additional
 * information for a workspace symbol.
 * 
 * @since 3.17.0
     */
    resolveProvider?: boolean;
}

/**
 * Code Lens provider options of a {@link CodeLensRequest}.
 */
export interface CodeLensOptions extends WorkDoneProgressOptions {
    /**
     * Code lens has a resolve provider as well.
     */
    resolveProvider?: boolean;
}

/**
 * Provider options for a {@link DocumentLinkRequest}.
 */
export interface DocumentLinkOptions extends WorkDoneProgressOptions {
    /**
     * Document links have a resolve provider as well.
     */
    resolveProvider?: boolean;
}

/**
 * Value-object describing what options formatting should use.
 */
export interface FormattingOptions {
    /**
     * Size of a tab in spaces.
     */
    tabSize: number;
    /**
     * Prefer spaces over tabs.
     */
    insertSpaces: boolean;
    /**
     * Trim trailing whitespace on a line.
 * 
 * @since 3.15.0
     */
    trimTrailingWhitespace?: boolean;
    /**
     * Insert a newline character at the end of the file if one does not exist.
 * 
 * @since 3.15.0
     */
    insertFinalNewline?: boolean;
    /**
     * Trim all newlines after the final newline at the end of the file.
 * 
 * @since 3.15.0
     */
    trimFinalNewlines?: boolean;
}

/**
 * Provider options for a {@link DocumentFormattingRequest}.
 */
export interface DocumentFormattingOptions extends WorkDoneProgressOptions {
}

/**
 * Provider options for a {@link DocumentRangeFormattingRequest}.
 */
export interface DocumentRangeFormattingOptions extends WorkDoneProgressOptions {
    /**
     * Whether the server supports formatting multiple ranges at once.
 * 
 * @since 3.18.0
 * @proposed
     */
    rangesSupport?: boolean;
}

/**
 * Provider options for a {@link DocumentOnTypeFormattingRequest}.
 */
export interface DocumentOnTypeFormattingOptions {
    /**
     * A character on which formatting should be triggered, like `{`.
     */
    firstTriggerCharacter: string;
    /**
     * More trigger characters.
     */
    moreTriggerCharacter?: (string)[];
}

/**
 * Provider options for a {@link RenameRequest}.
 */
export interface RenameOptions extends WorkDoneProgressOptions {
    /**
     * Renames should be checked and tested before being executed.
 * 
 * @since version 3.12.0
     */
    prepareProvider?: boolean;
}

/**
 * The server capabilities of a {@link ExecuteCommandRequest}.
 */
export interface ExecuteCommandOptions extends WorkDoneProgressOptions {
    /**
     * The commands to be executed on the server
     */
    commands: (string)[];
}

/**
 * @since 3.16.0
 */
export interface SemanticTokensLegend {
    /**
     * The token types a server uses.
     */
    tokenTypes: (string)[];
    /**
     * The token modifiers a server uses.
     */
    tokenModifiers: (string)[];
}

/**
 * A text document identifier to optionally denote a specific version of a text document.
 */
export interface OptionalVersionedTextDocumentIdentifier extends TextDocumentIdentifier {
    /**
     * The version number of this document. If a versioned text document identifier
 * is sent from the server to the client and the file is not open in the editor
 * (the server has not received an open notification before) the server can send
 * `null` to indicate that the version is unknown and the content on disk is the
 * truth (as specified with document content ownership).
     */
    version: number | null;
}

/**
 * A special text edit with an additional change annotation.
 * 
 * @since 3.16.0.
 */
export interface AnnotatedTextEdit extends TextEdit {
    /**
     * The actual identifier of the change annotation
     */
    annotationId: ChangeAnnotationIdentifier;
}

/**
 * A generic resource operation.
 */
export interface ResourceOperation {
    /**
     * The resource operation kind.
     */
    kind: string;
    /**
     * An optional annotation identifier describing the operation.
 * 
 * @since 3.16.0
     */
    annotationId?: ChangeAnnotationIdentifier;
}

/**
 * Options to create a file.
 */
export interface CreateFileOptions {
    /**
     * Overwrite existing file. Overwrite wins over `ignoreIfExists`
     */
    overwrite?: boolean;
    /**
     * Ignore if exists.
     */
    ignoreIfExists?: boolean;
}

/**
 * Rename file options
 */
export interface RenameFileOptions {
    /**
     * Overwrite target if existing. Overwrite wins over `ignoreIfExists`
     */
    overwrite?: boolean;
    /**
     * Ignores if target exists.
     */
    ignoreIfExists?: boolean;
}

/**
 * Delete file options
 */
export interface DeleteFileOptions {
    /**
     * Delete the content recursively if a folder is denoted.
     */
    recursive?: boolean;
    /**
     * Ignore the operation if the file doesn't exist.
     */
    ignoreIfNotExists?: boolean;
}

/**
 * A pattern to describe in which file operation requests or notifications
 * the server is interested in receiving.
 * 
 * @since 3.16.0
 */
export interface FileOperationPattern {
    /**
     * The glob pattern to match. Glob patterns can have the following syntax:
 * - `*` to match zero or more characters in a path segment
 * - `?` to match on one character in a path segment
 * - `**` to match any number of path segments, including none
 * - `{}` to group sub patterns into an OR expression. (e.g. `**​/*.{ts,js}` matches all TypeScript and JavaScript files)
 * - `[]` to declare a range of characters to match in a path segment (e.g., `example.[0-9]` to match on `example.0`, `example.1`, …)
 * - `[!...]` to negate a range of characters to match in a path segment (e.g., `example.[!0-9]` to match on `example.a`, `example.b`, but not `example.0`)
     */
    glob: string;
    /**
     * Whether to match files or folders with this pattern.
 * 
 * Matches both if undefined.
     */
    matches?: FileOperationPatternKind;
    /**
     * Additional options used during matching.
     */
    options?: FileOperationPatternOptions;
}

/**
 * A full document diagnostic report for a workspace diagnostic result.
 * 
 * @since 3.17.0
 */
export interface WorkspaceFullDocumentDiagnosticReport extends FullDocumentDiagnosticReport {
    /**
     * The URI for which diagnostic information is reported.
     */
    uri: string;
    /**
     * The version number for which the diagnostics are reported.
 * If the document is not marked as open `null` can be provided.
     */
    version: number | null;
}

/**
 * An unchanged document diagnostic report for a workspace diagnostic result.
 * 
 * @since 3.17.0
 */
export interface WorkspaceUnchangedDocumentDiagnosticReport extends UnchangedDocumentDiagnosticReport {
    /**
     * The URI for which diagnostic information is reported.
     */
    uri: string;
    /**
     * The version number for which the diagnostics are reported.
 * If the document is not marked as open `null` can be provided.
     */
    version: number | null;
}

/**
 * A notebook cell.
 * 
 * A cell's document URI must be unique across ALL notebook
 * cells and can therefore be used to uniquely identify a
 * notebook cell or the cell's text document.
 * 
 * @since 3.17.0
 */
export interface NotebookCell {
    /**
     * The cell's kind
     */
    kind: NotebookCellKind;
    /**
     * The URI of the cell's text document
 * content.
     */
    document: string;
    /**
     * Additional metadata stored with the cell.
 * 
 * Note: should always be an object literal (e.g. LSPObject)
     */
    metadata?: LSPObject;
    /**
     * Additional execution summary information
 * if supported by the client.
     */
    executionSummary?: ExecutionSummary;
}

/**
 * A change describing how to move a `NotebookCell`
 * array from state S to S'.
 * 
 * @since 3.17.0
 */
export interface NotebookCellArrayChange {
    /**
     * The start oftest of the cell that changed.
     */
    start: number;
    /**
     * The deleted cells
     */
    deleteCount: number;
    /**
     * The new cells, if any
     */
    cells?: (NotebookCell)[];
}

/**
 * Describes the currently selected completion item.
 * 
 * @since 3.18.0
 * @proposed
 */
export interface SelectedCompletionInfo {
    /**
     * The range that will be replaced if this completion item is accepted.
     */
    range: Range;
    /**
     * The text the range will be replaced with if this completion is accepted.
     */
    text: string;
}

/**
 * Defines the capabilities provided by the client.
 */
export interface ClientCapabilities {
    /**
     * Workspace specific client capabilities.
     */
    workspace?: WorkspaceClientCapabilities;
    /**
     * Text document specific client capabilities.
     */
    textDocument?: TextDocumentClientCapabilities;
    /**
     * Capabilities specific to the notebook document support.
 * 
 * @since 3.17.0
     */
    notebookDocument?: NotebookDocumentClientCapabilities;
    /**
     * Window specific client capabilities.
     */
    window?: WindowClientCapabilities;
    /**
     * General client capabilities.
 * 
 * @since 3.16.0
     */
    general?: GeneralClientCapabilities;
    /**
     * Experimental client capabilities.
     */
    experimental?: LSPAny;
}

export interface TextDocumentSyncOptions {
    /**
     * Open and close notifications are sent to the server. If omitted open close notification should not
 * be sent.
     */
    openClose?: boolean;
    /**
     * Change notifications are sent to the server. See TextDocumentSyncKind.None, TextDocumentSyncKind.Full
 * and TextDocumentSyncKind.Incremental. If omitted it defaults to TextDocumentSyncKind.None.
     */
    change?: TextDocumentSyncKind;
    /**
     * If present will save notifications are sent to the server. If omitted the notification should not be
 * sent.
     */
    willSave?: boolean;
    /**
     * If present will save wait until requests are sent to the server. If omitted the request should not be
 * sent.
     */
    willSaveWaitUntil?: boolean;
    /**
     * If present save notifications are sent to the server. If omitted the notification should not be
 * sent.
     */
    save?: boolean | SaveOptions;
}

/**
 * Options specific to a notebook plus its cells
 * to be synced to the server.
 * 
 * If a selector provides a notebook document
 * filter but no cell selector all cells of a
 * matching notebook document will be synced.
 * 
 * If a selector provides no notebook document
 * filter but only a cell selector all notebook
 * document that contain at least one matching
 * cell will be synced.
 * 
 * @since 3.17.0
 */
export interface NotebookDocumentSyncOptions {
    /**
     * The notebooks to be synced
     */
    notebookSelector: ({
        notebook: string | NotebookDocumentFilter;
        cells?: ({
            language: string
        })[]
    } | {
        notebook?: string | NotebookDocumentFilter;
        cells: ({
            language: string
        })[]
    })[];
    /**
     * Whether save notification should be forwarded to
 * the server. Will only be honored if mode === `notebook`.
     */
    save?: boolean;
}

/**
 * Registration options specific to a notebook.
 * 
 * @since 3.17.0
 */
export interface NotebookDocumentSyncRegistrationOptions extends NotebookDocumentSyncOptions, StaticRegistrationOptions {
}

export interface WorkspaceFoldersServerCapabilities {
    /**
     * The server has support for workspace folders
     */
    supported?: boolean;
    /**
     * Whether the server wants to receive workspace folder
 * change notifications.
 * 
 * If a string is provided the string is treated as an ID
 * under which the notification is registered on the client
 * side. The ID can be used to unregister for these events
 * using the `client/unregisterCapability` request.
     */
    changeNotifications?: string | boolean;
}

/**
 * Options for notifications/requests for user operations on files.
 * 
 * @since 3.16.0
 */
export interface FileOperationOptions {
    /**
     * The server is interested in receiving didCreateFiles notifications.
     */
    didCreate?: FileOperationRegistrationOptions;
    /**
     * The server is interested in receiving willCreateFiles requests.
     */
    willCreate?: FileOperationRegistrationOptions;
    /**
     * The server is interested in receiving didRenameFiles notifications.
     */
    didRename?: FileOperationRegistrationOptions;
    /**
     * The server is interested in receiving willRenameFiles requests.
     */
    willRename?: FileOperationRegistrationOptions;
    /**
     * The server is interested in receiving didDeleteFiles file notifications.
     */
    didDelete?: FileOperationRegistrationOptions;
    /**
     * The server is interested in receiving willDeleteFiles file requests.
     */
    willDelete?: FileOperationRegistrationOptions;
}

/**
 * Structure to capture a description for an error code.
 * 
 * @since 3.16.0
 */
export interface CodeDescription {
    /**
     * An URI to open with more information about the diagnostic error.
     */
    href: string;
}

/**
 * Represents a related message and source code location for a diagnostic. This should be
 * used to point to code locations that cause or related to a diagnostics, e.g when duplicating
 * a symbol in a scope.
 */
export interface DiagnosticRelatedInformation {
    /**
     * The location of this related diagnostic information.
     */
    location: Location;
    /**
     * The message of this related diagnostic information.
     */
    message: string;
}

/**
 * Represents a parameter of a callable-signature. A parameter can
 * have a label and a doc-comment.
 */
export interface ParameterInformation {
    /**
     * The label of this parameter information.
 * 
 * Either a string or an inclusive start and exclusive end offsets within its containing
 * signature label. (see SignatureInformation.label). The offsets are based on a UTF-16
 * string representation as `Position` and `Range` does.
 * 
 * *Note*: a label of type string should be a substring of its containing signature label.
 * Its intended use case is to highlight the parameter label part in the `SignatureInformation.label`.
     */
    label: string | [number, number];
    /**
     * The human-readable doc-comment of this parameter. Will be shown
 * in the UI but can be omitted.
     */
    documentation?: string | MarkupContent;
}

/**
 * A notebook cell text document filter denotes a cell text
 * document by different properties.
 * 
 * @since 3.17.0
 */
export interface NotebookCellTextDocumentFilter {
    /**
     * A filter that matches against the notebook
 * containing the notebook cell. If a string
 * value is provided it matches against the
 * notebook type. '*' matches every notebook.
     */
    notebook: string | NotebookDocumentFilter;
    /**
     * A language id like `python`.
 * 
 * Will be matched against the language id of the
 * notebook cell document. '*' matches every language.
     */
    language?: string;
}

/**
 * Matching options for the file operation pattern.
 * 
 * @since 3.16.0
 */
export interface FileOperationPatternOptions {
    /**
     * The pattern should be matched ignoring casing.
     */
    ignoreCase?: boolean;
}

export interface ExecutionSummary {
    /**
     * A strict monotonically increasing value
 * indicating the execution order of a cell
 * inside a notebook.
     */
    executionOrder: number;
    /**
     * Whether the execution was successful or
 * not if known by the client.
     */
    success?: boolean;
}

/**
 * Workspace specific client capabilities.
 */
export interface WorkspaceClientCapabilities {
    /**
     * The client supports applying batch edits
 * to the workspace by supporting the request
 * 'workspace/applyEdit'
     */
    applyEdit?: boolean;
    /**
     * Capabilities specific to `WorkspaceEdit`s.
     */
    workspaceEdit?: WorkspaceEditClientCapabilities;
    /**
     * Capabilities specific to the `workspace/didChangeConfiguration` notification.
     */
    didChangeConfiguration?: DidChangeConfigurationClientCapabilities;
    /**
     * Capabilities specific to the `workspace/didChangeWatchedFiles` notification.
     */
    didChangeWatchedFiles?: DidChangeWatchedFilesClientCapabilities;
    /**
     * Capabilities specific to the `workspace/symbol` request.
     */
    symbol?: WorkspaceSymbolClientCapabilities;
    /**
     * Capabilities specific to the `workspace/executeCommand` request.
     */
    executeCommand?: ExecuteCommandClientCapabilities;
    /**
     * The client has support for workspace folders.
 * 
 * @since 3.6.0
     */
    workspaceFolders?: boolean;
    /**
     * The client supports `workspace/configuration` requests.
 * 
 * @since 3.6.0
     */
    configuration?: boolean;
    /**
     * Capabilities specific to the semantic token requests scoped to the
 * workspace.
 * 
 * @since 3.16.0.
     */
    semanticTokens?: SemanticTokensWorkspaceClientCapabilities;
    /**
     * Capabilities specific to the code lens requests scoped to the
 * workspace.
 * 
 * @since 3.16.0.
     */
    codeLens?: CodeLensWorkspaceClientCapabilities;
    /**
     * The client has support for file notifications/requests for user operations on files.
 * 
 * Since 3.16.0
     */
    fileOperations?: FileOperationClientCapabilities;
    /**
     * Capabilities specific to the inline values requests scoped to the
 * workspace.
 * 
 * @since 3.17.0.
     */
    inlineValue?: InlineValueWorkspaceClientCapabilities;
    /**
     * Capabilities specific to the inlay hint requests scoped to the
 * workspace.
 * 
 * @since 3.17.0.
     */
    inlayHint?: InlayHintWorkspaceClientCapabilities;
    /**
     * Capabilities specific to the diagnostic requests scoped to the
 * workspace.
 * 
 * @since 3.17.0.
     */
    diagnostics?: DiagnosticWorkspaceClientCapabilities;
    /**
     * Capabilities specific to the folding range requests scoped to the workspace.
 * 
 * @since 3.18.0
 * @proposed
     */
    foldingRange?: FoldingRangeWorkspaceClientCapabilities;
}

/**
 * Text document specific client capabilities.
 */
export interface TextDocumentClientCapabilities {
    /**
     * Defines which synchronization capabilities the client supports.
     */
    synchronization?: TextDocumentSyncClientCapabilities;
    /**
     * Capabilities specific to the `textDocument/completion` request.
     */
    completion?: CompletionClientCapabilities;
    /**
     * Capabilities specific to the `textDocument/hover` request.
     */
    hover?: HoverClientCapabilities;
    /**
     * Capabilities specific to the `textDocument/signatureHelp` request.
     */
    signatureHelp?: SignatureHelpClientCapabilities;
    /**
     * Capabilities specific to the `textDocument/declaration` request.
 * 
 * @since 3.14.0
     */
    declaration?: DeclarationClientCapabilities;
    /**
     * Capabilities specific to the `textDocument/definition` request.
     */
    definition?: DefinitionClientCapabilities;
    /**
     * Capabilities specific to the `textDocument/typeDefinition` request.
 * 
 * @since 3.6.0
     */
    typeDefinition?: TypeDefinitionClientCapabilities;
    /**
     * Capabilities specific to the `textDocument/implementation` request.
 * 
 * @since 3.6.0
     */
    implementation?: ImplementationClientCapabilities;
    /**
     * Capabilities specific to the `textDocument/references` request.
     */
    references?: ReferenceClientCapabilities;
    /**
     * Capabilities specific to the `textDocument/documentHighlight` request.
     */
    documentHighlight?: DocumentHighlightClientCapabilities;
    /**
     * Capabilities specific to the `textDocument/documentSymbol` request.
     */
    documentSymbol?: DocumentSymbolClientCapabilities;
    /**
     * Capabilities specific to the `textDocument/codeAction` request.
     */
    codeAction?: CodeActionClientCapabilities;
    /**
     * Capabilities specific to the `textDocument/codeLens` request.
     */
    codeLens?: CodeLensClientCapabilities;
    /**
     * Capabilities specific to the `textDocument/documentLink` request.
     */
    documentLink?: DocumentLinkClientCapabilities;
    /**
     * Capabilities specific to the `textDocument/documentColor` and the
 * `textDocument/colorPresentation` request.
 * 
 * @since 3.6.0
     */
    colorProvider?: DocumentColorClientCapabilities;
    /**
     * Capabilities specific to the `textDocument/formatting` request.
     */
    formatting?: DocumentFormattingClientCapabilities;
    /**
     * Capabilities specific to the `textDocument/rangeFormatting` request.
     */
    rangeFormatting?: DocumentRangeFormattingClientCapabilities;
    /**
     * Capabilities specific to the `textDocument/onTypeFormatting` request.
     */
    onTypeFormatting?: DocumentOnTypeFormattingClientCapabilities;
    /**
     * Capabilities specific to the `textDocument/rename` request.
     */
    rename?: RenameClientCapabilities;
    /**
     * Capabilities specific to the `textDocument/foldingRange` request.
 * 
 * @since 3.10.0
     */
    foldingRange?: FoldingRangeClientCapabilities;
    /**
     * Capabilities specific to the `textDocument/selectionRange` request.
 * 
 * @since 3.15.0
     */
    selectionRange?: SelectionRangeClientCapabilities;
    /**
     * Capabilities specific to the `textDocument/publishDiagnostics` notification.
     */
    publishDiagnostics?: PublishDiagnosticsClientCapabilities;
    /**
     * Capabilities specific to the various call hierarchy requests.
 * 
 * @since 3.16.0
     */
    callHierarchy?: CallHierarchyClientCapabilities;
    /**
     * Capabilities specific to the various semantic token request.
 * 
 * @since 3.16.0
     */
    semanticTokens?: SemanticTokensClientCapabilities;
    /**
     * Capabilities specific to the `textDocument/linkedEditingRange` request.
 * 
 * @since 3.16.0
     */
    linkedEditingRange?: LinkedEditingRangeClientCapabilities;
    /**
     * Client capabilities specific to the `textDocument/moniker` request.
 * 
 * @since 3.16.0
     */
    moniker?: MonikerClientCapabilities;
    /**
     * Capabilities specific to the various type hierarchy requests.
 * 
 * @since 3.17.0
     */
    typeHierarchy?: TypeHierarchyClientCapabilities;
    /**
     * Capabilities specific to the `textDocument/inlineValue` request.
 * 
 * @since 3.17.0
     */
    inlineValue?: InlineValueClientCapabilities;
    /**
     * Capabilities specific to the `textDocument/inlayHint` request.
 * 
 * @since 3.17.0
     */
    inlayHint?: InlayHintClientCapabilities;
    /**
     * Capabilities specific to the diagnostic pull model.
 * 
 * @since 3.17.0
     */
    diagnostic?: DiagnosticClientCapabilities;
    /**
     * Client capabilities specific to inline completions.
 * 
 * @since 3.18.0
 * @proposed
     */
    inlineCompletion?: InlineCompletionClientCapabilities;
}

/**
 * Capabilities specific to the notebook document support.
 * 
 * @since 3.17.0
 */
export interface NotebookDocumentClientCapabilities {
    /**
     * Capabilities specific to notebook document synchronization
 * 
 * @since 3.17.0
     */
    synchronization: NotebookDocumentSyncClientCapabilities;
}

export interface WindowClientCapabilities {
    /**
     * It indicates whether the client supports server initiated
 * progress using the `window/workDoneProgress/create` request.
 * 
 * The capability also controls Whether client supports handling
 * of progress notifications. If set servers are allowed to report a
 * `workDoneProgress` property in the request specific server
 * capabilities.
 * 
 * @since 3.15.0
     */
    workDoneProgress?: boolean;
    /**
     * Capabilities specific to the showMessage request.
 * 
 * @since 3.16.0
     */
    showMessage?: ShowMessageRequestClientCapabilities;
    /**
     * Capabilities specific to the showDocument request.
 * 
 * @since 3.16.0
     */
    showDocument?: ShowDocumentClientCapabilities;
}

/**
 * General client capabilities.
 * 
 * @since 3.16.0
 */
export interface GeneralClientCapabilities {
    /**
     * Client capability that signals how the client
 * handles stale requests (e.g. a request
 * for which the client will not process the response
 * anymore since the information is outdated).
 * 
 * @since 3.17.0
     */
    staleRequestSupport?: {
        cancel: boolean;
        retryOnContentModified: (string)[]
    };
    /**
     * Client capabilities specific to regular expressions.
 * 
 * @since 3.16.0
     */
    regularExpressions?: RegularExpressionsClientCapabilities;
    /**
     * Client capabilities specific to the client's markdown parser.
 * 
 * @since 3.16.0
     */
    markdown?: MarkdownClientCapabilities;
    /**
     * The position encodings supported by the client. Client and server
 * have to agree on the same position encoding to ensure that offsets
 * (e.g. character position in a line) are interpreted the same on both
 * sides.
 * 
 * To keep the protocol backwards compatible the following applies: if
 * the value 'utf-16' is missing from the array of position encodings
 * servers can assume that the client supports UTF-16. UTF-16 is
 * therefore a mandatory encoding.
 * 
 * If omitted it defaults to ['utf-16'].
 * 
 * Implementation considerations: since the conversion from one encoding
 * into another requires the content of the file / line the conversion
 * is best done where the file is read which is usually on the server
 * side.
 * 
 * @since 3.17.0
     */
    positionEncodings?: (PositionEncodingKind)[];
}

/**
 * A relative pattern is a helper to construct glob patterns that are matched
 * relatively to a base URI. The common value for a `baseUri` is a workspace
 * folder root, but it can be another absolute URI as well.
 * 
 * @since 3.17.0
 */
export interface RelativePattern {
    /**
     * A workspace folder or a base URI to which this pattern will be matched
 * against relatively.
     */
    baseUri: WorkspaceFolder | string;
    /**
     * The actual glob pattern;
     */
    pattern: Pattern;
}

export interface WorkspaceEditClientCapabilities {
    /**
     * The client supports versioned document changes in `WorkspaceEdit`s
     */
    documentChanges?: boolean;
    /**
     * The resource operations the client supports. Clients should at least
 * support 'create', 'rename' and 'delete' files and folders.
 * 
 * @since 3.13.0
     */
    resourceOperations?: (ResourceOperationKind)[];
    /**
     * The failure handling strategy of a client if applying the workspace edit
 * fails.
 * 
 * @since 3.13.0
     */
    failureHandling?: FailureHandlingKind;
    /**
     * Whether the client normalizes line endings to the client specific
 * setting.
 * If set to `true` the client will normalize line ending characters
 * in a workspace edit to the client-specified new line
 * character.
 * 
 * @since 3.16.0
     */
    normalizesLineEndings?: boolean;
    /**
     * Whether the client in general supports change annotations on text edits,
 * create file, rename file and delete file changes.
 * 
 * @since 3.16.0
     */
    changeAnnotationSupport?: {
        groupsOnLabel?: boolean
    };
}

export interface DidChangeConfigurationClientCapabilities {
    /**
     * Did change configuration notification supports dynamic registration.
     */
    dynamicRegistration?: boolean;
}

export interface DidChangeWatchedFilesClientCapabilities {
    /**
     * Did change watched files notification supports dynamic registration. Please note
 * that the current protocol doesn't support static configuration for file changes
 * from the server side.
     */
    dynamicRegistration?: boolean;
    /**
     * Whether the client has support for {@link  RelativePattern relative pattern}
 * or not.
 * 
 * @since 3.17.0
     */
    relativePatternSupport?: boolean;
}

/**
 * Client capabilities for a {@link WorkspaceSymbolRequest}.
 */
export interface WorkspaceSymbolClientCapabilities {
    /**
     * Symbol request supports dynamic registration.
     */
    dynamicRegistration?: boolean;
    /**
     * Specific capabilities for the `SymbolKind` in the `workspace/symbol` request.
     */
    symbolKind?: {
        valueSet?: (SymbolKind)[]
    };
    /**
     * The client supports tags on `SymbolInformation`.
 * Clients supporting tags have to handle unknown tags gracefully.
 * 
 * @since 3.16.0
     */
    tagSupport?: {
        valueSet: (SymbolTag)[]
    };
    /**
     * The client support partial workspace symbols. The client will send the
 * request `workspaceSymbol/resolve` to the server to resolve additional
 * properties.
 * 
 * @since 3.17.0
     */
    resolveSupport?: {
        properties: (string)[]
    };
}

/**
 * The client capabilities of a {@link ExecuteCommandRequest}.
 */
export interface ExecuteCommandClientCapabilities {
    /**
     * Execute command supports dynamic registration.
     */
    dynamicRegistration?: boolean;
}

/**
 * @since 3.16.0
 */
export interface SemanticTokensWorkspaceClientCapabilities {
    /**
     * Whether the client implementation supports a refresh request sent from
 * the server to the client.
 * 
 * Note that this event is global and will force the client to refresh all
 * semantic tokens currently shown. It should be used with absolute care
 * and is useful for situation where a server for example detects a project
 * wide change that requires such a calculation.
     */
    refreshSupport?: boolean;
}

/**
 * @since 3.16.0
 */
export interface CodeLensWorkspaceClientCapabilities {
    /**
     * Whether the client implementation supports a refresh request sent from the
 * server to the client.
 * 
 * Note that this event is global and will force the client to refresh all
 * code lenses currently shown. It should be used with absolute care and is
 * useful for situation where a server for example detect a project wide
 * change that requires such a calculation.
     */
    refreshSupport?: boolean;
}

/**
 * Capabilities relating to events from file operations by the user in the client.
 * 
 * These events do not come from the file system, they come from user operations
 * like renaming a file in the UI.
 * 
 * @since 3.16.0
 */
export interface FileOperationClientCapabilities {
    /**
     * Whether the client supports dynamic registration for file requests/notifications.
     */
    dynamicRegistration?: boolean;
    /**
     * The client has support for sending didCreateFiles notifications.
     */
    didCreate?: boolean;
    /**
     * The client has support for sending willCreateFiles requests.
     */
    willCreate?: boolean;
    /**
     * The client has support for sending didRenameFiles notifications.
     */
    didRename?: boolean;
    /**
     * The client has support for sending willRenameFiles requests.
     */
    willRename?: boolean;
    /**
     * The client has support for sending didDeleteFiles notifications.
     */
    didDelete?: boolean;
    /**
     * The client has support for sending willDeleteFiles requests.
     */
    willDelete?: boolean;
}

/**
 * Client workspace capabilities specific to inline values.
 * 
 * @since 3.17.0
 */
export interface InlineValueWorkspaceClientCapabilities {
    /**
     * Whether the client implementation supports a refresh request sent from the
 * server to the client.
 * 
 * Note that this event is global and will force the client to refresh all
 * inline values currently shown. It should be used with absolute care and is
 * useful for situation where a server for example detects a project wide
 * change that requires such a calculation.
     */
    refreshSupport?: boolean;
}

/**
 * Client workspace capabilities specific to inlay hints.
 * 
 * @since 3.17.0
 */
export interface InlayHintWorkspaceClientCapabilities {
    /**
     * Whether the client implementation supports a refresh request sent from
 * the server to the client.
 * 
 * Note that this event is global and will force the client to refresh all
 * inlay hints currently shown. It should be used with absolute care and
 * is useful for situation where a server for example detects a project wide
 * change that requires such a calculation.
     */
    refreshSupport?: boolean;
}

/**
 * Workspace client capabilities specific to diagnostic pull requests.
 * 
 * @since 3.17.0
 */
export interface DiagnosticWorkspaceClientCapabilities {
    /**
     * Whether the client implementation supports a refresh request sent from
 * the server to the client.
 * 
 * Note that this event is global and will force the client to refresh all
 * pulled diagnostics currently shown. It should be used with absolute care and
 * is useful for situation where a server for example detects a project wide
 * change that requires such a calculation.
     */
    refreshSupport?: boolean;
}

/**
 * Client workspace capabilities specific to folding ranges
 * 
 * @since 3.18.0
 * @proposed
 */
export interface FoldingRangeWorkspaceClientCapabilities {
    /**
     * Whether the client implementation supports a refresh request sent from the
 * server to the client.
 * 
 * Note that this event is global and will force the client to refresh all
 * folding ranges currently shown. It should be used with absolute care and is
 * useful for situation where a server for example detects a project wide
 * change that requires such a calculation.
 * 
 * @since 3.18.0
 * @proposed
     */
    refreshSupport?: boolean;
}

export interface TextDocumentSyncClientCapabilities {
    /**
     * Whether text document synchronization supports dynamic registration.
     */
    dynamicRegistration?: boolean;
    /**
     * The client supports sending will save notifications.
     */
    willSave?: boolean;
    /**
     * The client supports sending a will save request and
 * waits for a response providing text edits which will
 * be applied to the document before it is saved.
     */
    willSaveWaitUntil?: boolean;
    /**
     * The client supports did save notifications.
     */
    didSave?: boolean;
}

/**
 * Completion client capabilities
 */
export interface CompletionClientCapabilities {
    /**
     * Whether completion supports dynamic registration.
     */
    dynamicRegistration?: boolean;
    /**
     * The client supports the following `CompletionItem` specific
 * capabilities.
     */
    completionItem?: {
        snippetSupport?: boolean;
        commitCharactersSupport?: boolean;
        documentationFormat?: (MarkupKind)[];
        deprecatedSupport?: boolean;
        preselectSupport?: boolean;
        tagSupport?: {
            valueSet: (CompletionItemTag)[]
        };
        insertReplaceSupport?: boolean;
        resolveSupport?: {
            properties: (string)[]
        };
        insertTextModeSupport?: {
            valueSet: (InsertTextMode)[]
        };
        labelDetailsSupport?: boolean
    };
    completionItemKind?: {
        valueSet?: (CompletionItemKind)[]
    };
    /**
     * Defines how the client handles whitespace and indentation
 * when accepting a completion item that uses multi line
 * text in either `insertText` or `textEdit`.
 * 
 * @since 3.17.0
     */
    insertTextMode?: InsertTextMode;
    /**
     * The client supports to send additional context information for a
 * `textDocument/completion` request.
     */
    contextSupport?: boolean;
    /**
     * The client supports the following `CompletionList` specific
 * capabilities.
 * 
 * @since 3.17.0
     */
    completionList?: {
        itemDefaults?: (string)[]
    };
}

export interface HoverClientCapabilities {
    /**
     * Whether hover supports dynamic registration.
     */
    dynamicRegistration?: boolean;
    /**
     * Client supports the following content formats for the content
 * property. The order describes the preferred format of the client.
     */
    contentFormat?: (MarkupKind)[];
}

/**
 * Client Capabilities for a {@link SignatureHelpRequest}.
 */
export interface SignatureHelpClientCapabilities {
    /**
     * Whether signature help supports dynamic registration.
     */
    dynamicRegistration?: boolean;
    /**
     * The client supports the following `SignatureInformation`
 * specific properties.
     */
    signatureInformation?: {
        documentationFormat?: (MarkupKind)[];
        parameterInformation?: {
            labelOffsetSupport?: boolean
        };
        activeParameterSupport?: boolean
    };
    /**
     * The client supports to send additional context information for a
 * `textDocument/signatureHelp` request. A client that opts into
 * contextSupport will also support the `retriggerCharacters` on
 * `SignatureHelpOptions`.
 * 
 * @since 3.15.0
     */
    contextSupport?: boolean;
}

/**
 * @since 3.14.0
 */
export interface DeclarationClientCapabilities {
    /**
     * Whether declaration supports dynamic registration. If this is set to `true`
 * the client supports the new `DeclarationRegistrationOptions` return value
 * for the corresponding server capability as well.
     */
    dynamicRegistration?: boolean;
    /**
     * The client supports additional metadata in the form of declaration links.
     */
    linkSupport?: boolean;
}

/**
 * Client Capabilities for a {@link DefinitionRequest}.
 */
export interface DefinitionClientCapabilities {
    /**
     * Whether definition supports dynamic registration.
     */
    dynamicRegistration?: boolean;
    /**
     * The client supports additional metadata in the form of definition links.
 * 
 * @since 3.14.0
     */
    linkSupport?: boolean;
}

/**
 * Since 3.6.0
 */
export interface TypeDefinitionClientCapabilities {
    /**
     * Whether implementation supports dynamic registration. If this is set to `true`
 * the client supports the new `TypeDefinitionRegistrationOptions` return value
 * for the corresponding server capability as well.
     */
    dynamicRegistration?: boolean;
    /**
     * The client supports additional metadata in the form of definition links.
 * 
 * Since 3.14.0
     */
    linkSupport?: boolean;
}

/**
 * @since 3.6.0
 */
export interface ImplementationClientCapabilities {
    /**
     * Whether implementation supports dynamic registration. If this is set to `true`
 * the client supports the new `ImplementationRegistrationOptions` return value
 * for the corresponding server capability as well.
     */
    dynamicRegistration?: boolean;
    /**
     * The client supports additional metadata in the form of definition links.
 * 
 * @since 3.14.0
     */
    linkSupport?: boolean;
}

/**
 * Client Capabilities for a {@link ReferencesRequest}.
 */
export interface ReferenceClientCapabilities {
    /**
     * Whether references supports dynamic registration.
     */
    dynamicRegistration?: boolean;
}

/**
 * Client Capabilities for a {@link DocumentHighlightRequest}.
 */
export interface DocumentHighlightClientCapabilities {
    /**
     * Whether document highlight supports dynamic registration.
     */
    dynamicRegistration?: boolean;
}

/**
 * Client Capabilities for a {@link DocumentSymbolRequest}.
 */
export interface DocumentSymbolClientCapabilities {
    /**
     * Whether document symbol supports dynamic registration.
     */
    dynamicRegistration?: boolean;
    /**
     * Specific capabilities for the `SymbolKind` in the
 * `textDocument/documentSymbol` request.
     */
    symbolKind?: {
        valueSet?: (SymbolKind)[]
    };
    /**
     * The client supports hierarchical document symbols.
     */
    hierarchicalDocumentSymbolSupport?: boolean;
    /**
     * The client supports tags on `SymbolInformation`. Tags are supported on
 * `DocumentSymbol` if `hierarchicalDocumentSymbolSupport` is set to true.
 * Clients supporting tags have to handle unknown tags gracefully.
 * 
 * @since 3.16.0
     */
    tagSupport?: {
        valueSet: (SymbolTag)[]
    };
    /**
     * The client supports an additional label presented in the UI when
 * registering a document symbol provider.
 * 
 * @since 3.16.0
     */
    labelSupport?: boolean;
}

/**
 * The Client Capabilities of a {@link CodeActionRequest}.
 */
export interface CodeActionClientCapabilities {
    /**
     * Whether code action supports dynamic registration.
     */
    dynamicRegistration?: boolean;
    /**
     * The client support code action literals of type `CodeAction` as a valid
 * response of the `textDocument/codeAction` request. If the property is not
 * set the request can only return `Command` literals.
 * 
 * @since 3.8.0
     */
    codeActionLiteralSupport?: {
        codeActionKind: {
            valueSet: (CodeActionKind)[]
        }
    };
    /**
     * Whether code action supports the `isPreferred` property.
 * 
 * @since 3.15.0
     */
    isPreferredSupport?: boolean;
    /**
     * Whether code action supports the `disabled` property.
 * 
 * @since 3.16.0
     */
    disabledSupport?: boolean;
    /**
     * Whether code action supports the `data` property which is
 * preserved between a `textDocument/codeAction` and a
 * `codeAction/resolve` request.
 * 
 * @since 3.16.0
     */
    dataSupport?: boolean;
    /**
     * Whether the client supports resolving additional code action
 * properties via a separate `codeAction/resolve` request.
 * 
 * @since 3.16.0
     */
    resolveSupport?: {
        properties: (string)[]
    };
    /**
     * Whether the client honors the change annotations in
 * text edits and resource operations returned via the
 * `CodeAction#edit` property by for example presenting
 * the workspace edit in the user interface and asking
 * for confirmation.
 * 
 * @since 3.16.0
     */
    honorsChangeAnnotations?: boolean;
}

/**
 * The client capabilities  of a {@link CodeLensRequest}.
 */
export interface CodeLensClientCapabilities {
    /**
     * Whether code lens supports dynamic registration.
     */
    dynamicRegistration?: boolean;
}

/**
 * The client capabilities of a {@link DocumentLinkRequest}.
 */
export interface DocumentLinkClientCapabilities {
    /**
     * Whether document link supports dynamic registration.
     */
    dynamicRegistration?: boolean;
    /**
     * Whether the client supports the `tooltip` property on `DocumentLink`.
 * 
 * @since 3.15.0
     */
    tooltipSupport?: boolean;
}

export interface DocumentColorClientCapabilities {
    /**
     * Whether implementation supports dynamic registration. If this is set to `true`
 * the client supports the new `DocumentColorRegistrationOptions` return value
 * for the corresponding server capability as well.
     */
    dynamicRegistration?: boolean;
}

/**
 * Client capabilities of a {@link DocumentFormattingRequest}.
 */
export interface DocumentFormattingClientCapabilities {
    /**
     * Whether formatting supports dynamic registration.
     */
    dynamicRegistration?: boolean;
}

/**
 * Client capabilities of a {@link DocumentRangeFormattingRequest}.
 */
export interface DocumentRangeFormattingClientCapabilities {
    /**
     * Whether range formatting supports dynamic registration.
     */
    dynamicRegistration?: boolean;
    /**
     * Whether the client supports formatting multiple ranges at once.
 * 
 * @since 3.18.0
 * @proposed
     */
    rangesSupport?: boolean;
}

/**
 * Client capabilities of a {@link DocumentOnTypeFormattingRequest}.
 */
export interface DocumentOnTypeFormattingClientCapabilities {
    /**
     * Whether on type formatting supports dynamic registration.
     */
    dynamicRegistration?: boolean;
}

export interface RenameClientCapabilities {
    /**
     * Whether rename supports dynamic registration.
     */
    dynamicRegistration?: boolean;
    /**
     * Client supports testing for validity of rename operations
 * before execution.
 * 
 * @since 3.12.0
     */
    prepareSupport?: boolean;
    /**
     * Client supports the default behavior result.
 * 
 * The value indicates the default behavior used by the
 * client.
 * 
 * @since 3.16.0
     */
    prepareSupportDefaultBehavior?: PrepareSupportDefaultBehavior;
    /**
     * Whether the client honors the change annotations in
 * text edits and resource operations returned via the
 * rename request's workspace edit by for example presenting
 * the workspace edit in the user interface and asking
 * for confirmation.
 * 
 * @since 3.16.0
     */
    honorsChangeAnnotations?: boolean;
}

export interface FoldingRangeClientCapabilities {
    /**
     * Whether implementation supports dynamic registration for folding range
 * providers. If this is set to `true` the client supports the new
 * `FoldingRangeRegistrationOptions` return value for the corresponding
 * server capability as well.
     */
    dynamicRegistration?: boolean;
    /**
     * The maximum number of folding ranges that the client prefers to receive
 * per document. The value serves as a hint, servers are free to follow the
 * limit.
     */
    rangeLimit?: number;
    /**
     * If set, the client signals that it only supports folding complete lines.
 * If set, client will ignore specified `startCharacter` and `endCharacter`
 * properties in a FoldingRange.
     */
    lineFoldingOnly?: boolean;
    /**
     * Specific options for the folding range kind.
 * 
 * @since 3.17.0
     */
    foldingRangeKind?: {
        valueSet?: (FoldingRangeKind)[]
    };
    /**
     * Specific options for the folding range.
 * 
 * @since 3.17.0
     */
    foldingRange?: {
        collapsedText?: boolean
    };
}

export interface SelectionRangeClientCapabilities {
    /**
     * Whether implementation supports dynamic registration for selection range providers. If this is set to `true`
 * the client supports the new `SelectionRangeRegistrationOptions` return value for the corresponding server
 * capability as well.
     */
    dynamicRegistration?: boolean;
}

/**
 * The publish diagnostic client capabilities.
 */
export interface PublishDiagnosticsClientCapabilities {
    /**
     * Whether the clients accepts diagnostics with related information.
     */
    relatedInformation?: boolean;
    /**
     * Client supports the tag property to provide meta data about a diagnostic.
 * Clients supporting tags have to handle unknown tags gracefully.
 * 
 * @since 3.15.0
     */
    tagSupport?: {
        valueSet: (DiagnosticTag)[]
    };
    /**
     * Whether the client interprets the version property of the
 * `textDocument/publishDiagnostics` notification's parameter.
 * 
 * @since 3.15.0
     */
    versionSupport?: boolean;
    /**
     * Client supports a codeDescription property
 * 
 * @since 3.16.0
     */
    codeDescriptionSupport?: boolean;
    /**
     * Whether code action supports the `data` property which is
 * preserved between a `textDocument/publishDiagnostics` and
 * `textDocument/codeAction` request.
 * 
 * @since 3.16.0
     */
    dataSupport?: boolean;
}

/**
 * @since 3.16.0
 */
export interface CallHierarchyClientCapabilities {
    /**
     * Whether implementation supports dynamic registration. If this is set to `true`
 * the client supports the new `(TextDocumentRegistrationOptions & StaticRegistrationOptions)`
 * return value for the corresponding server capability as well.
     */
    dynamicRegistration?: boolean;
}

/**
 * @since 3.16.0
 */
export interface SemanticTokensClientCapabilities {
    /**
     * Whether implementation supports dynamic registration. If this is set to `true`
 * the client supports the new `(TextDocumentRegistrationOptions & StaticRegistrationOptions)`
 * return value for the corresponding server capability as well.
     */
    dynamicRegistration?: boolean;
    /**
     * Which requests the client supports and might send to the server
 * depending on the server's capability. Please note that clients might not
 * show semantic tokens or degrade some of the user experience if a range
 * or full request is advertised by the client but not provided by the
 * server. If for example the client capability `requests.full` and
 * `request.range` are both set to true but the server only provides a
 * range provider the client might not render a minimap correctly or might
 * even decide to not show any semantic tokens at all.
     */
    requests: {
        range?: boolean | {

        };
        full?: boolean | {
            delta?: boolean
        }
    };
    /**
     * The token types that the client supports.
     */
    tokenTypes: (string)[];
    /**
     * The token modifiers that the client supports.
     */
    tokenModifiers: (string)[];
    /**
     * The token formats the clients supports.
     */
    formats: (TokenFormat)[];
    /**
     * Whether the client supports tokens that can overlap each other.
     */
    overlappingTokenSupport?: boolean;
    /**
     * Whether the client supports tokens that can span multiple lines.
     */
    multilineTokenSupport?: boolean;
    /**
     * Whether the client allows the server to actively cancel a
 * semantic token request, e.g. supports returning
 * LSPErrorCodes.ServerCancelled. If a server does the client
 * needs to retrigger the request.
 * 
 * @since 3.17.0
     */
    serverCancelSupport?: boolean;
    /**
     * Whether the client uses semantic tokens to augment existing
 * syntax tokens. If set to `true` client side created syntax
 * tokens and semantic tokens are both used for colorization. If
 * set to `false` the client only uses the returned semantic tokens
 * for colorization.
 * 
 * If the value is `undefined` then the client behavior is not
 * specified.
 * 
 * @since 3.17.0
     */
    augmentsSyntaxTokens?: boolean;
}

/**
 * Client capabilities for the linked editing range request.
 * 
 * @since 3.16.0
 */
export interface LinkedEditingRangeClientCapabilities {
    /**
     * Whether implementation supports dynamic registration. If this is set to `true`
 * the client supports the new `(TextDocumentRegistrationOptions & StaticRegistrationOptions)`
 * return value for the corresponding server capability as well.
     */
    dynamicRegistration?: boolean;
}

/**
 * Client capabilities specific to the moniker request.
 * 
 * @since 3.16.0
 */
export interface MonikerClientCapabilities {
    /**
     * Whether moniker supports dynamic registration. If this is set to `true`
 * the client supports the new `MonikerRegistrationOptions` return value
 * for the corresponding server capability as well.
     */
    dynamicRegistration?: boolean;
}

/**
 * @since 3.17.0
 */
export interface TypeHierarchyClientCapabilities {
    /**
     * Whether implementation supports dynamic registration. If this is set to `true`
 * the client supports the new `(TextDocumentRegistrationOptions & StaticRegistrationOptions)`
 * return value for the corresponding server capability as well.
     */
    dynamicRegistration?: boolean;
}

/**
 * Client capabilities specific to inline values.
 * 
 * @since 3.17.0
 */
export interface InlineValueClientCapabilities {
    /**
     * Whether implementation supports dynamic registration for inline value providers.
     */
    dynamicRegistration?: boolean;
}

/**
 * Inlay hint client capabilities.
 * 
 * @since 3.17.0
 */
export interface InlayHintClientCapabilities {
    /**
     * Whether inlay hints support dynamic registration.
     */
    dynamicRegistration?: boolean;
    /**
     * Indicates which properties a client can resolve lazily on an inlay
 * hint.
     */
    resolveSupport?: {
        properties: (string)[]
    };
}

/**
 * Client capabilities specific to diagnostic pull requests.
 * 
 * @since 3.17.0
 */
export interface DiagnosticClientCapabilities {
    /**
     * Whether implementation supports dynamic registration. If this is set to `true`
 * the client supports the new `(TextDocumentRegistrationOptions & StaticRegistrationOptions)`
 * return value for the corresponding server capability as well.
     */
    dynamicRegistration?: boolean;
    /**
     * Whether the clients supports related documents for document diagnostic pulls.
     */
    relatedDocumentSupport?: boolean;
}

/**
 * Client capabilities specific to inline completions.
 * 
 * @since 3.18.0
 * @proposed
 */
export interface InlineCompletionClientCapabilities {
    /**
     * Whether implementation supports dynamic registration for inline completion providers.
     */
    dynamicRegistration?: boolean;
}

/**
 * Notebook specific client capabilities.
 * 
 * @since 3.17.0
 */
export interface NotebookDocumentSyncClientCapabilities {
    /**
     * Whether implementation supports dynamic registration. If this is
 * set to `true` the client supports the new
 * `(TextDocumentRegistrationOptions & StaticRegistrationOptions)`
 * return value for the corresponding server capability as well.
     */
    dynamicRegistration?: boolean;
    /**
     * The client supports sending execution summary data per cell.
     */
    executionSummarySupport?: boolean;
}

/**
 * Show message request client capabilities
 */
export interface ShowMessageRequestClientCapabilities {
    /**
     * Capabilities specific to the `MessageActionItem` type.
     */
    messageActionItem?: {
        additionalPropertiesSupport?: boolean
    };
}

/**
 * Client capabilities for the showDocument request.
 * 
 * @since 3.16.0
 */
export interface ShowDocumentClientCapabilities {
    /**
     * The client has support for the showDocument
 * request.
     */
    support: boolean;
}

/**
 * Client capabilities specific to regular expressions.
 * 
 * @since 3.16.0
 */
export interface RegularExpressionsClientCapabilities {
    /**
     * The engine's name.
     */
    engine: string;
    /**
     * The engine's version.
     */
    version?: string;
}

/**
 * Client capabilities specific to the used markdown parser.
 * 
 * @since 3.16.0
 */
export interface MarkdownClientCapabilities {
    /**
     * The name of the parser.
     */
    parser: string;
    /**
     * The version of the parser.
     */
    version?: string;
    /**
     * A list of HTML tags that the client allows / supports in
 * Markdown.
 * 
 * @since 3.17.0
     */
    allowedTags?: (string)[];
}

/**
 * Represents a capability with its associated method and registration options type
 */
export class Capability<T> {
    constructor(public readonly method: string) { }
}

/**
 * Map of all LSP capabilities with their registration options
 */
export const capabilities = {
    textDocumentImplementation: new Capability<ImplementationRegistrationOptions>('textDocument/implementation'),
    textDocumentTypeDefinition: new Capability<TypeDefinitionRegistrationOptions>('textDocument/typeDefinition'),
    textDocumentDocumentColor: new Capability<DocumentColorRegistrationOptions>('textDocument/documentColor'),
    textDocumentColorPresentation: new Capability<WorkDoneProgressOptions & TextDocumentRegistrationOptions>('textDocument/colorPresentation'),
    textDocumentFoldingRange: new Capability<FoldingRangeRegistrationOptions>('textDocument/foldingRange'),
    textDocumentDeclaration: new Capability<DeclarationRegistrationOptions>('textDocument/declaration'),
    textDocumentSelectionRange: new Capability<SelectionRangeRegistrationOptions>('textDocument/selectionRange'),
    textDocumentPrepareCallHierarchy: new Capability<CallHierarchyRegistrationOptions>('textDocument/prepareCallHierarchy'),
    textDocumentSemanticTokensFull: new Capability<SemanticTokensRegistrationOptions>('textDocument/semanticTokens/full'),
    textDocumentSemanticTokensFullDelta: new Capability<SemanticTokensRegistrationOptions>('textDocument/semanticTokens/full/delta'),
    textDocumentLinkedEditingRange: new Capability<LinkedEditingRangeRegistrationOptions>('textDocument/linkedEditingRange'),
    workspaceWillCreateFiles: new Capability<FileOperationRegistrationOptions>('workspace/willCreateFiles'),
    workspaceWillRenameFiles: new Capability<FileOperationRegistrationOptions>('workspace/willRenameFiles'),
    workspaceWillDeleteFiles: new Capability<FileOperationRegistrationOptions>('workspace/willDeleteFiles'),
    textDocumentMoniker: new Capability<MonikerRegistrationOptions>('textDocument/moniker'),
    textDocumentPrepareTypeHierarchy: new Capability<TypeHierarchyRegistrationOptions>('textDocument/prepareTypeHierarchy'),
    textDocumentInlineValue: new Capability<InlineValueRegistrationOptions>('textDocument/inlineValue'),
    textDocumentInlayHint: new Capability<InlayHintRegistrationOptions>('textDocument/inlayHint'),
    textDocumentDiagnostic: new Capability<DiagnosticRegistrationOptions>('textDocument/diagnostic'),
    textDocumentInlineCompletion: new Capability<InlineCompletionRegistrationOptions>('textDocument/inlineCompletion'),
    textDocumentWillSaveWaitUntil: new Capability<TextDocumentRegistrationOptions>('textDocument/willSaveWaitUntil'),
    textDocumentCompletion: new Capability<CompletionRegistrationOptions>('textDocument/completion'),
    textDocumentHover: new Capability<HoverRegistrationOptions>('textDocument/hover'),
    textDocumentSignatureHelp: new Capability<SignatureHelpRegistrationOptions>('textDocument/signatureHelp'),
    textDocumentDefinition: new Capability<DefinitionRegistrationOptions>('textDocument/definition'),
    textDocumentReferences: new Capability<ReferenceRegistrationOptions>('textDocument/references'),
    textDocumentDocumentHighlight: new Capability<DocumentHighlightRegistrationOptions>('textDocument/documentHighlight'),
    textDocumentDocumentSymbol: new Capability<DocumentSymbolRegistrationOptions>('textDocument/documentSymbol'),
    textDocumentCodeAction: new Capability<CodeActionRegistrationOptions>('textDocument/codeAction'),
    workspaceSymbol: new Capability<WorkspaceSymbolRegistrationOptions>('workspace/symbol'),
    textDocumentCodeLens: new Capability<CodeLensRegistrationOptions>('textDocument/codeLens'),
    textDocumentDocumentLink: new Capability<DocumentLinkRegistrationOptions>('textDocument/documentLink'),
    textDocumentFormatting: new Capability<DocumentFormattingRegistrationOptions>('textDocument/formatting'),
    textDocumentRangeFormatting: new Capability<DocumentRangeFormattingRegistrationOptions>('textDocument/rangeFormatting'),
    textDocumentRangesFormatting: new Capability<DocumentRangeFormattingRegistrationOptions>('textDocument/rangesFormatting'),
    textDocumentOnTypeFormatting: new Capability<DocumentOnTypeFormattingRegistrationOptions>('textDocument/onTypeFormatting'),
    textDocumentRename: new Capability<RenameRegistrationOptions>('textDocument/rename'),
    workspaceExecuteCommand: new Capability<ExecuteCommandRegistrationOptions>('workspace/executeCommand'),
    workspaceDidCreateFiles: new Capability<FileOperationRegistrationOptions>('workspace/didCreateFiles'),
    workspaceDidRenameFiles: new Capability<FileOperationRegistrationOptions>('workspace/didRenameFiles'),
    workspaceDidDeleteFiles: new Capability<FileOperationRegistrationOptions>('workspace/didDeleteFiles'),
    workspaceDidChangeConfiguration: new Capability<DidChangeConfigurationRegistrationOptions>('workspace/didChangeConfiguration'),
    textDocumentDidOpen: new Capability<TextDocumentRegistrationOptions>('textDocument/didOpen'),
    textDocumentDidChange: new Capability<TextDocumentChangeRegistrationOptions>('textDocument/didChange'),
    textDocumentDidClose: new Capability<TextDocumentRegistrationOptions>('textDocument/didClose'),
    textDocumentDidSave: new Capability<TextDocumentSaveRegistrationOptions>('textDocument/didSave'),
    textDocumentWillSave: new Capability<TextDocumentRegistrationOptions>('textDocument/willSave'),
    workspaceDidChangeWatchedFiles: new Capability<DidChangeWatchedFilesRegistrationOptions>('workspace/didChangeWatchedFiles'),
};

/**
 * LSP API Contract
 */
export const api = contract({
    name: "LSP",
    server: {
        /**
         * A request to resolve the implementation locations of a symbol at a given text
     * document position. The request's parameter is of type {@link TextDocumentPositionParams}
     * the response is of type {@link Definition} or a Thenable that resolves to such.
         */
        textDocumentImplementation: unverifiedRequest<ImplementationParams, Definition | (DefinitionLink)[] | null>({ method: "textDocument/implementation" }),
        /**
         * A request to resolve the type definition locations of a symbol at a given text
     * document position. The request's parameter is of type {@link TextDocumentPositionParams}
     * the response is of type {@link Definition} or a Thenable that resolves to such.
         */
        textDocumentTypeDefinition: unverifiedRequest<TypeDefinitionParams, Definition | (DefinitionLink)[] | null>({ method: "textDocument/typeDefinition" }),
        /**
         * A request to list all color symbols found in a given text document. The request's
     * parameter is of type {@link DocumentColorParams} the
     * response is of type {@link ColorInformation ColorInformation[]} or a Thenable
     * that resolves to such.
         */
        textDocumentDocumentColor: unverifiedRequest<DocumentColorParams, (ColorInformation)[]>({ method: "textDocument/documentColor" }),
        /**
         * A request to list all presentation for a color. The request's
     * parameter is of type {@link ColorPresentationParams} the
     * response is of type {@link ColorInformation ColorInformation[]} or a Thenable
     * that resolves to such.
         */
        textDocumentColorPresentation: unverifiedRequest<ColorPresentationParams, (ColorPresentation)[]>({ method: "textDocument/colorPresentation" }),
        /**
         * A request to provide folding ranges in a document. The request's
     * parameter is of type {@link FoldingRangeParams}, the
     * response is of type {@link FoldingRangeList} or a Thenable
     * that resolves to such.
         */
        textDocumentFoldingRange: unverifiedRequest<FoldingRangeParams, (FoldingRange)[] | null>({ method: "textDocument/foldingRange" }),
        /**
         * A request to resolve the type definition locations of a symbol at a given text
     * document position. The request's parameter is of type {@link TextDocumentPositionParams}
     * the response is of type {@link Declaration} or a typed array of {@link DeclarationLink}
     * or a Thenable that resolves to such.
         */
        textDocumentDeclaration: unverifiedRequest<DeclarationParams, Declaration | (DeclarationLink)[] | null>({ method: "textDocument/declaration" }),
        /**
         * A request to provide selection ranges in a document. The request's
     * parameter is of type {@link SelectionRangeParams}, the
     * response is of type {@link SelectionRange SelectionRange[]} or a Thenable
     * that resolves to such.
         */
        textDocumentSelectionRange: unverifiedRequest<SelectionRangeParams, (SelectionRange)[] | null>({ method: "textDocument/selectionRange" }),
        /**
         * A request to result a `CallHierarchyItem` in a document at a given position.
     * Can be used as an input to an incoming or outgoing call hierarchy.
     * 
     * @since 3.16.0
         */
        textDocumentPrepareCallHierarchy: unverifiedRequest<CallHierarchyPrepareParams, (CallHierarchyItem)[] | null>({ method: "textDocument/prepareCallHierarchy" }),
        /**
         * A request to resolve the incoming calls for a given `CallHierarchyItem`.
     * 
     * @since 3.16.0
         */
        callHierarchyIncomingCalls: unverifiedRequest<CallHierarchyIncomingCallsParams, (CallHierarchyIncomingCall)[] | null>({ method: "callHierarchy/incomingCalls" }),
        /**
         * A request to resolve the outgoing calls for a given `CallHierarchyItem`.
     * 
     * @since 3.16.0
         */
        callHierarchyOutgoingCalls: unverifiedRequest<CallHierarchyOutgoingCallsParams, (CallHierarchyOutgoingCall)[] | null>({ method: "callHierarchy/outgoingCalls" }),
        /**
         * @since 3.16.0
         */
        textDocumentSemanticTokensFull: unverifiedRequest<SemanticTokensParams, SemanticTokens | null>({ method: "textDocument/semanticTokens/full" }),
        /**
         * @since 3.16.0
         */
        textDocumentSemanticTokensFullDelta: unverifiedRequest<SemanticTokensDeltaParams, SemanticTokens | SemanticTokensDelta | null>({ method: "textDocument/semanticTokens/full/delta" }),
        /**
         * @since 3.16.0
         */
        textDocumentSemanticTokensRange: unverifiedRequest<SemanticTokensRangeParams, SemanticTokens | null>({ method: "textDocument/semanticTokens/range" }),
        /**
         * A request to provide ranges that can be edited together.
     * 
     * @since 3.16.0
         */
        textDocumentLinkedEditingRange: unverifiedRequest<LinkedEditingRangeParams, LinkedEditingRanges | null>({ method: "textDocument/linkedEditingRange" }),
        /**
         * The will create files request is sent from the client to the server before files are actually
     * created as long as the creation is triggered from within the client.
     * 
     * The request can return a `WorkspaceEdit` which will be applied to workspace before the
     * files are created. Hence the `WorkspaceEdit` can not manipulate the content of the file
     * to be created.
     * 
     * @since 3.16.0
         */
        workspaceWillCreateFiles: unverifiedRequest<CreateFilesParams, WorkspaceEdit | null>({ method: "workspace/willCreateFiles" }),
        /**
         * The will rename files request is sent from the client to the server before files are actually
     * renamed as long as the rename is triggered from within the client.
     * 
     * @since 3.16.0
         */
        workspaceWillRenameFiles: unverifiedRequest<RenameFilesParams, WorkspaceEdit | null>({ method: "workspace/willRenameFiles" }),
        /**
         * The did delete files notification is sent from the client to the server when
     * files were deleted from within the client.
     * 
     * @since 3.16.0
         */
        workspaceWillDeleteFiles: unverifiedRequest<DeleteFilesParams, WorkspaceEdit | null>({ method: "workspace/willDeleteFiles" }),
        /**
         * A request to get the moniker of a symbol at a given text document position.
     * The request parameter is of type {@link TextDocumentPositionParams}.
     * The response is of type {@link Moniker Moniker[]} or `null`.
         */
        textDocumentMoniker: unverifiedRequest<MonikerParams, (Moniker)[] | null>({ method: "textDocument/moniker" }),
        /**
         * A request to result a `TypeHierarchyItem` in a document at a given position.
     * Can be used as an input to a subtypes or supertypes type hierarchy.
     * 
     * @since 3.17.0
         */
        textDocumentPrepareTypeHierarchy: unverifiedRequest<TypeHierarchyPrepareParams, (TypeHierarchyItem)[] | null>({ method: "textDocument/prepareTypeHierarchy" }),
        /**
         * A request to resolve the supertypes for a given `TypeHierarchyItem`.
     * 
     * @since 3.17.0
         */
        typeHierarchySupertypes: unverifiedRequest<TypeHierarchySupertypesParams, (TypeHierarchyItem)[] | null>({ method: "typeHierarchy/supertypes" }),
        /**
         * A request to resolve the subtypes for a given `TypeHierarchyItem`.
     * 
     * @since 3.17.0
         */
        typeHierarchySubtypes: unverifiedRequest<TypeHierarchySubtypesParams, (TypeHierarchyItem)[] | null>({ method: "typeHierarchy/subtypes" }),
        /**
         * A request to provide inline values in a document. The request's parameter is of
     * type {@link InlineValueParams}, the response is of type
     * {@link InlineValue InlineValue[]} or a Thenable that resolves to such.
     * 
     * @since 3.17.0
         */
        textDocumentInlineValue: unverifiedRequest<InlineValueParams, (InlineValue)[] | null>({ method: "textDocument/inlineValue" }),
        /**
         * A request to provide inlay hints in a document. The request's parameter is of
     * type {@link InlayHintsParams}, the response is of type
     * {@link InlayHint InlayHint[]} or a Thenable that resolves to such.
     * 
     * @since 3.17.0
         */
        textDocumentInlayHint: unverifiedRequest<InlayHintParams, (InlayHint)[] | null>({ method: "textDocument/inlayHint" }),
        /**
         * A request to resolve additional properties for an inlay hint.
     * The request's parameter is of type {@link InlayHint}, the response is
     * of type {@link InlayHint} or a Thenable that resolves to such.
     * 
     * @since 3.17.0
         */
        inlayHintResolve: unverifiedRequest<InlayHint, InlayHint>({ method: "inlayHint/resolve" }),
        /**
         * The document diagnostic request definition.
     * 
     * @since 3.17.0
         */
        textDocumentDiagnostic: unverifiedRequest<DocumentDiagnosticParams, DocumentDiagnosticReport>({ method: "textDocument/diagnostic" }),
        /**
         * The workspace diagnostic request definition.
     * 
     * @since 3.17.0
         */
        workspaceDiagnostic: unverifiedRequest<WorkspaceDiagnosticParams, WorkspaceDiagnosticReport>({ method: "workspace/diagnostic" }),
        /**
         * A request to provide inline completions in a document. The request's parameter is of
     * type {@link InlineCompletionParams}, the response is of type
     * {@link InlineCompletion InlineCompletion[]} or a Thenable that resolves to such.
     * 
     * @since 3.18.0
     * @proposed
         */
        textDocumentInlineCompletion: unverifiedRequest<InlineCompletionParams, InlineCompletionList | (InlineCompletionItem)[] | null>({ method: "textDocument/inlineCompletion" }),
        /**
         * The initialize request is sent from the client to the server.
     * It is sent once as the request after starting up the server.
     * The requests parameter is of type {@link InitializeParams}
     * the response if of type {@link InitializeResult} of a Thenable that
     * resolves to such.
         */
        initialize: unverifiedRequest<InitializeParams, InitializeResult>({ method: "initialize" }),
        /**
         * A shutdown request is sent from the client to the server.
     * It is sent once when the client decides to shutdown the
     * server. The only notification that is sent after a shutdown request
     * is the exit event.
         */
        shutdown: unverifiedRequest<void, null>({ method: "shutdown" }),
        /**
         * A document will save request is sent from the client to the server before
     * the document is actually saved. The request can return an array of TextEdits
     * which will be applied to the text document before it is saved. Please note that
     * clients might drop results if computing the text edits took too long or if a
     * server constantly fails on this request. This is done to keep the save fast and
     * reliable.
         */
        textDocumentWillSaveWaitUntil: unverifiedRequest<WillSaveTextDocumentParams, (TextEdit)[] | null>({ method: "textDocument/willSaveWaitUntil" }),
        /**
         * Request to request completion at a given text document position. The request's
     * parameter is of type {@link TextDocumentPosition} the response
     * is of type {@link CompletionItem CompletionItem[]} or {@link CompletionList}
     * or a Thenable that resolves to such.
     * 
     * The request can delay the computation of the {@link CompletionItem.detail `detail`}
     * and {@link CompletionItem.documentation `documentation`} properties to the `completionItem/resolve`
     * request. However, properties that are needed for the initial sorting and filtering, like `sortText`,
     * `filterText`, `insertText`, and `textEdit`, must not be changed during resolve.
         */
        textDocumentCompletion: unverifiedRequest<CompletionParams, (CompletionItem)[] | CompletionList | null>({ method: "textDocument/completion" }),
        /**
         * Request to resolve additional information for a given completion item.The request's
     * parameter is of type {@link CompletionItem} the response
     * is of type {@link CompletionItem} or a Thenable that resolves to such.
         */
        completionItemResolve: unverifiedRequest<CompletionItem, CompletionItem>({ method: "completionItem/resolve" }),
        /**
         * Request to request hover information at a given text document position. The request's
     * parameter is of type {@link TextDocumentPosition} the response is of
     * type {@link Hover} or a Thenable that resolves to such.
         */
        textDocumentHover: unverifiedRequest<HoverParams, Hover | null>({ method: "textDocument/hover" }),
        textDocumentSignatureHelp: unverifiedRequest<SignatureHelpParams, SignatureHelp | null>({ method: "textDocument/signatureHelp" }),
        /**
         * A request to resolve the definition location of a symbol at a given text
     * document position. The request's parameter is of type {@link TextDocumentPosition}
     * the response is of either type {@link Definition} or a typed array of
     * {@link DefinitionLink} or a Thenable that resolves to such.
         */
        textDocumentDefinition: unverifiedRequest<DefinitionParams, Definition | (DefinitionLink)[] | null>({ method: "textDocument/definition" }),
        /**
         * A request to resolve project-wide references for the symbol denoted
     * by the given text document position. The request's parameter is of
     * type {@link ReferenceParams} the response is of type
     * {@link Location Location[]} or a Thenable that resolves to such.
         */
        textDocumentReferences: unverifiedRequest<ReferenceParams, (Location)[] | null>({ method: "textDocument/references" }),
        /**
         * Request to resolve a {@link DocumentHighlight} for a given
     * text document position. The request's parameter is of type {@link TextDocumentPosition}
     * the request response is an array of type {@link DocumentHighlight}
     * or a Thenable that resolves to such.
         */
        textDocumentDocumentHighlight: unverifiedRequest<DocumentHighlightParams, (DocumentHighlight)[] | null>({ method: "textDocument/documentHighlight" }),
        /**
         * A request to list all symbols found in a given text document. The request's
     * parameter is of type {@link TextDocumentIdentifier} the
     * response is of type {@link SymbolInformation SymbolInformation[]} or a Thenable
     * that resolves to such.
         */
        textDocumentDocumentSymbol: unverifiedRequest<DocumentSymbolParams, (SymbolInformation)[] | (DocumentSymbol)[] | null>({ method: "textDocument/documentSymbol" }),
        /**
         * A request to provide commands for the given text document and range.
         */
        textDocumentCodeAction: unverifiedRequest<CodeActionParams, (Command | CodeAction)[] | null>({ method: "textDocument/codeAction" }),
        /**
         * Request to resolve additional information for a given code action.The request's
     * parameter is of type {@link CodeAction} the response
     * is of type {@link CodeAction} or a Thenable that resolves to such.
         */
        codeActionResolve: unverifiedRequest<CodeAction, CodeAction>({ method: "codeAction/resolve" }),
        /**
         * A request to list project-wide symbols matching the query string given
     * by the {@link WorkspaceSymbolParams}. The response is
     * of type {@link SymbolInformation SymbolInformation[]} or a Thenable that
     * resolves to such.
     * 
     * @since 3.17.0 - support for WorkspaceSymbol in the returned data. Clients
     *  need to advertise support for WorkspaceSymbols via the client capability
     *  `workspace.symbol.resolveSupport`.
     * 
         */
        workspaceSymbol: unverifiedRequest<WorkspaceSymbolParams, (SymbolInformation)[] | (WorkspaceSymbol)[] | null>({ method: "workspace/symbol" }),
        /**
         * A request to resolve the range inside the workspace
     * symbol's location.
     * 
     * @since 3.17.0
         */
        workspaceSymbolResolve: unverifiedRequest<WorkspaceSymbol, WorkspaceSymbol>({ method: "workspaceSymbol/resolve" }),
        /**
         * A request to provide code lens for the given text document.
         */
        textDocumentCodeLens: unverifiedRequest<CodeLensParams, (CodeLens)[] | null>({ method: "textDocument/codeLens" }),
        /**
         * A request to resolve a command for a given code lens.
         */
        codeLensResolve: unverifiedRequest<CodeLens, CodeLens>({ method: "codeLens/resolve" }),
        /**
         * A request to provide document links
         */
        textDocumentDocumentLink: unverifiedRequest<DocumentLinkParams, (DocumentLink)[] | null>({ method: "textDocument/documentLink" }),
        /**
         * Request to resolve additional information for a given document link. The request's
     * parameter is of type {@link DocumentLink} the response
     * is of type {@link DocumentLink} or a Thenable that resolves to such.
         */
        documentLinkResolve: unverifiedRequest<DocumentLink, DocumentLink>({ method: "documentLink/resolve" }),
        /**
         * A request to format a whole document.
         */
        textDocumentFormatting: unverifiedRequest<DocumentFormattingParams, (TextEdit)[] | null>({ method: "textDocument/formatting" }),
        /**
         * A request to format a range in a document.
         */
        textDocumentRangeFormatting: unverifiedRequest<DocumentRangeFormattingParams, (TextEdit)[] | null>({ method: "textDocument/rangeFormatting" }),
        /**
         * A request to format ranges in a document.
     * 
     * @since 3.18.0
     * @proposed
         */
        textDocumentRangesFormatting: unverifiedRequest<DocumentRangesFormattingParams, (TextEdit)[] | null>({ method: "textDocument/rangesFormatting" }),
        /**
         * A request to format a document on type.
         */
        textDocumentOnTypeFormatting: unverifiedRequest<DocumentOnTypeFormattingParams, (TextEdit)[] | null>({ method: "textDocument/onTypeFormatting" }),
        /**
         * A request to rename a symbol.
         */
        textDocumentRename: unverifiedRequest<RenameParams, WorkspaceEdit | null>({ method: "textDocument/rename" }),
        /**
         * A request to test and perform the setup necessary for a rename.
     * 
     * @since 3.16 - support for default behavior
         */
        textDocumentPrepareRename: unverifiedRequest<PrepareRenameParams, PrepareRenameResult | null>({ method: "textDocument/prepareRename" }),
        /**
         * A request send from the client to the server to execute a command. The request might return
     * a workspace edit which the client will apply to the workspace.
         */
        workspaceExecuteCommand: unverifiedRequest<ExecuteCommandParams, LSPAny | null>({ method: "workspace/executeCommand" }),
        /**
         * The `workspace/didChangeWorkspaceFolders` notification is sent from the client to the server when the workspace
     * folder configuration changes.
         */
        workspaceDidChangeWorkspaceFolders: unverifiedNotification<DidChangeWorkspaceFoldersParams>({ method: "workspace/didChangeWorkspaceFolders" }),
        /**
         * The `window/workDoneProgress/cancel` notification is sent from  the client to the server to cancel a progress
     * initiated on the server side.
         */
        windowWorkDoneProgressCancel: unverifiedNotification<WorkDoneProgressCancelParams>({ method: "window/workDoneProgress/cancel" }),
        /**
         * The did create files notification is sent from the client to the server when
     * files were created from within the client.
     * 
     * @since 3.16.0
         */
        workspaceDidCreateFiles: unverifiedNotification<CreateFilesParams>({ method: "workspace/didCreateFiles" }),
        /**
         * The did rename files notification is sent from the client to the server when
     * files were renamed from within the client.
     * 
     * @since 3.16.0
         */
        workspaceDidRenameFiles: unverifiedNotification<RenameFilesParams>({ method: "workspace/didRenameFiles" }),
        /**
         * The will delete files request is sent from the client to the server before files are actually
     * deleted as long as the deletion is triggered from within the client.
     * 
     * @since 3.16.0
         */
        workspaceDidDeleteFiles: unverifiedNotification<DeleteFilesParams>({ method: "workspace/didDeleteFiles" }),
        /**
         * A notification sent when a notebook opens.
     * 
     * @since 3.17.0
         */
        notebookDocumentDidOpen: unverifiedNotification<DidOpenNotebookDocumentParams>({ method: "notebookDocument/didOpen" }),
        notebookDocumentDidChange: unverifiedNotification<DidChangeNotebookDocumentParams>({ method: "notebookDocument/didChange" }),
        /**
         * A notification sent when a notebook document is saved.
     * 
     * @since 3.17.0
         */
        notebookDocumentDidSave: unverifiedNotification<DidSaveNotebookDocumentParams>({ method: "notebookDocument/didSave" }),
        /**
         * A notification sent when a notebook closes.
     * 
     * @since 3.17.0
         */
        notebookDocumentDidClose: unverifiedNotification<DidCloseNotebookDocumentParams>({ method: "notebookDocument/didClose" }),
        /**
         * The initialized notification is sent from the client to the
     * server after the client is fully initialized and the server
     * is allowed to send requests from the server to the client.
         */
        initialized: unverifiedNotification<InitializedParams>({ method: "initialized" }),
        /**
         * The exit event is sent from the client to the server to
     * ask the server to exit its process.
         */
        exit: unverifiedNotification<void>({ method: "exit" }),
        /**
         * The configuration change notification is sent from the client to the server
     * when the client's configuration has changed. The notification contains
     * the changed configuration as defined by the language client.
         */
        workspaceDidChangeConfiguration: unverifiedNotification<DidChangeConfigurationParams>({ method: "workspace/didChangeConfiguration" }),
        /**
         * The document open notification is sent from the client to the server to signal
     * newly opened text documents. The document's truth is now managed by the client
     * and the server must not try to read the document's truth using the document's
     * uri. Open in this sense means it is managed by the client. It doesn't necessarily
     * mean that its content is presented in an editor. An open notification must not
     * be sent more than once without a corresponding close notification send before.
     * This means open and close notification must be balanced and the max open count
     * is one.
         */
        textDocumentDidOpen: unverifiedNotification<DidOpenTextDocumentParams>({ method: "textDocument/didOpen" }),
        /**
         * The document change notification is sent from the client to the server to signal
     * changes to a text document.
         */
        textDocumentDidChange: unverifiedNotification<DidChangeTextDocumentParams>({ method: "textDocument/didChange" }),
        /**
         * The document close notification is sent from the client to the server when
     * the document got closed in the client. The document's truth now exists where
     * the document's uri points to (e.g. if the document's uri is a file uri the
     * truth now exists on disk). As with the open notification the close notification
     * is about managing the document's content. Receiving a close notification
     * doesn't mean that the document was open in an editor before. A close
     * notification requires a previous open notification to be sent.
         */
        textDocumentDidClose: unverifiedNotification<DidCloseTextDocumentParams>({ method: "textDocument/didClose" }),
        /**
         * The document save notification is sent from the client to the server when
     * the document got saved in the client.
         */
        textDocumentDidSave: unverifiedNotification<DidSaveTextDocumentParams>({ method: "textDocument/didSave" }),
        /**
         * A document will save notification is sent from the client to the server before
     * the document is actually saved.
         */
        textDocumentWillSave: unverifiedNotification<WillSaveTextDocumentParams>({ method: "textDocument/willSave" }),
        /**
         * The watched files notification is sent from the client to the server when
     * the client detects changes to file watched by the language client.
         */
        workspaceDidChangeWatchedFiles: unverifiedNotification<DidChangeWatchedFilesParams>({ method: "workspace/didChangeWatchedFiles" }),
        setTrace: unverifiedNotification<SetTraceParams>({ method: "$/setTrace" }),
        cancelRequest: unverifiedNotification<CancelParams>({ method: "$/cancelRequest" }),
        progress: unverifiedNotification<ProgressParams>({ method: "$/progress" }),
    },
    client: {
        /**
         * The `workspace/workspaceFolders` is sent from the server to the client to fetch the open workspace folders.
         */
        workspaceWorkspaceFolders: unverifiedRequest<void, (WorkspaceFolder)[] | null>({ method: "workspace/workspaceFolders" }).optional(),
        /**
         * The 'workspace/configuration' request is sent from the server to the client to fetch a certain
     * configuration setting.
     * 
     * This pull model replaces the old push model where the client signaled configuration change via an
     * event. If the server still needs to react to configuration changes (since the server caches the
     * result of `workspace/configuration` requests) the server should register for an empty configuration
     * change event and empty the cache if such an event is received.
         */
        workspaceConfiguration: unverifiedRequest<ConfigurationParams, (LSPAny)[]>({ method: "workspace/configuration" }).optional(),
        /**
         * @since 3.18.0
     * @proposed
         */
        workspaceFoldingRangeRefresh: unverifiedRequest<void, null>({ method: "workspace/foldingRange/refresh" }).optional(),
        /**
         * The `window/workDoneProgress/create` request is sent from the server to the client to initiate progress
     * reporting from the server.
         */
        windowWorkDoneProgressCreate: unverifiedRequest<WorkDoneProgressCreateParams, null>({ method: "window/workDoneProgress/create" }).optional(),
        /**
         * @since 3.16.0
         */
        workspaceSemanticTokensRefresh: unverifiedRequest<void, null>({ method: "workspace/semanticTokens/refresh" }).optional(),
        /**
         * A request to show a document. This request might open an
     * external program depending on the value of the URI to open.
     * For example a request to open `https://code.visualstudio.com/`
     * will very likely open the URI in a WEB browser.
     * 
     * @since 3.16.0
         */
        windowShowDocument: unverifiedRequest<ShowDocumentParams, ShowDocumentResult>({ method: "window/showDocument" }).optional(),
        /**
         * @since 3.17.0
         */
        workspaceInlineValueRefresh: unverifiedRequest<void, null>({ method: "workspace/inlineValue/refresh" }).optional(),
        /**
         * @since 3.17.0
         */
        workspaceInlayHintRefresh: unverifiedRequest<void, null>({ method: "workspace/inlayHint/refresh" }).optional(),
        /**
         * The diagnostic refresh request definition.
     * 
     * @since 3.17.0
         */
        workspaceDiagnosticRefresh: unverifiedRequest<void, null>({ method: "workspace/diagnostic/refresh" }).optional(),
        /**
         * The `client/registerCapability` request is sent from the server to the client to register a new capability
     * handler on the client side.
         */
        clientRegisterCapability: unverifiedRequest<RegistrationParams, null>({ method: "client/registerCapability" }).optional(),
        /**
         * The `client/unregisterCapability` request is sent from the server to the client to unregister a previously registered capability
     * handler on the client side.
         */
        clientUnregisterCapability: unverifiedRequest<UnregistrationParams, null>({ method: "client/unregisterCapability" }).optional(),
        /**
         * The show message request is sent from the server to the client to show a message
     * and a set of options actions to the user.
         */
        windowShowMessageRequest: unverifiedRequest<ShowMessageRequestParams, MessageActionItem | null>({ method: "window/showMessageRequest" }).optional(),
        /**
         * A request to refresh all code actions
     * 
     * @since 3.16.0
         */
        workspaceCodeLensRefresh: unverifiedRequest<void, null>({ method: "workspace/codeLens/refresh" }).optional(),
        /**
         * A request sent from the server to the client to modified certain resources.
         */
        workspaceApplyEdit: unverifiedRequest<ApplyWorkspaceEditParams, ApplyWorkspaceEditResult>({ method: "workspace/applyEdit" }).optional(),
        /**
         * The show message notification is sent from a server to a client to ask
     * the client to display a particular message in the user interface.
         */
        windowShowMessage: unverifiedNotification<ShowMessageParams>({ method: "window/showMessage" }),
        /**
         * The log message notification is sent from the server to the client to ask
     * the client to log a particular message.
         */
        windowLogMessage: unverifiedNotification<LogMessageParams>({ method: "window/logMessage" }),
        /**
         * The telemetry event notification is sent from the server to the client to ask
     * the client to log telemetry data.
         */
        telemetryEvent: unverifiedNotification<LSPAny>({ method: "telemetry/event" }),
        /**
         * Diagnostics notification are sent from the server to the client to signal
     * results of validation runs.
         */
        textDocumentPublishDiagnostics: unverifiedNotification<PublishDiagnosticsParams>({ method: "textDocument/publishDiagnostics" }),
        logTrace: unverifiedNotification<LogTraceParams>({ method: "$/logTrace" }),
        cancelRequest: unverifiedNotification<CancelParams>({ method: "$/cancelRequest" }),
        progress: unverifiedNotification<ProgressParams>({ method: "$/progress" }),
    }
});
