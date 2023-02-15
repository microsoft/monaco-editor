/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// THIS IS A GENERATED FILE. DO NOT EDIT DIRECTLY.
export var AccessibilitySupport;
(function (AccessibilitySupport) {
    /**
     * This should be the browser case where it is not known if a screen reader is attached or no.
     */
    AccessibilitySupport[AccessibilitySupport["Unknown"] = 0] = "Unknown";
    AccessibilitySupport[AccessibilitySupport["Disabled"] = 1] = "Disabled";
    AccessibilitySupport[AccessibilitySupport["Enabled"] = 2] = "Enabled";
})(AccessibilitySupport || (AccessibilitySupport = {}));
export var CodeActionTriggerType;
(function (CodeActionTriggerType) {
    CodeActionTriggerType[CodeActionTriggerType["Invoke"] = 1] = "Invoke";
    CodeActionTriggerType[CodeActionTriggerType["Auto"] = 2] = "Auto";
})(CodeActionTriggerType || (CodeActionTriggerType = {}));
export var CompletionItemInsertTextRule;
(function (CompletionItemInsertTextRule) {
    CompletionItemInsertTextRule[CompletionItemInsertTextRule["None"] = 0] = "None";
    /**
     * Adjust whitespace/indentation of multiline insert texts to
     * match the current line indentation.
     */
    CompletionItemInsertTextRule[CompletionItemInsertTextRule["KeepWhitespace"] = 1] = "KeepWhitespace";
    /**
     * `insertText` is a snippet.
     */
    CompletionItemInsertTextRule[CompletionItemInsertTextRule["InsertAsSnippet"] = 4] = "InsertAsSnippet";
})(CompletionItemInsertTextRule || (CompletionItemInsertTextRule = {}));
export var CompletionItemKind;
(function (CompletionItemKind) {
    CompletionItemKind[CompletionItemKind["Method"] = 0] = "Method";
    CompletionItemKind[CompletionItemKind["Function"] = 1] = "Function";
    CompletionItemKind[CompletionItemKind["Constructor"] = 2] = "Constructor";
    CompletionItemKind[CompletionItemKind["Field"] = 3] = "Field";
    CompletionItemKind[CompletionItemKind["Variable"] = 4] = "Variable";
    CompletionItemKind[CompletionItemKind["Class"] = 5] = "Class";
    CompletionItemKind[CompletionItemKind["Struct"] = 6] = "Struct";
    CompletionItemKind[CompletionItemKind["Interface"] = 7] = "Interface";
    CompletionItemKind[CompletionItemKind["Module"] = 8] = "Module";
    CompletionItemKind[CompletionItemKind["Property"] = 9] = "Property";
    CompletionItemKind[CompletionItemKind["Event"] = 10] = "Event";
    CompletionItemKind[CompletionItemKind["Operator"] = 11] = "Operator";
    CompletionItemKind[CompletionItemKind["Unit"] = 12] = "Unit";
    CompletionItemKind[CompletionItemKind["Value"] = 13] = "Value";
    CompletionItemKind[CompletionItemKind["Constant"] = 14] = "Constant";
    CompletionItemKind[CompletionItemKind["Enum"] = 15] = "Enum";
    CompletionItemKind[CompletionItemKind["EnumMember"] = 16] = "EnumMember";
    CompletionItemKind[CompletionItemKind["Keyword"] = 17] = "Keyword";
    CompletionItemKind[CompletionItemKind["Text"] = 18] = "Text";
    CompletionItemKind[CompletionItemKind["Color"] = 19] = "Color";
    CompletionItemKind[CompletionItemKind["File"] = 20] = "File";
    CompletionItemKind[CompletionItemKind["Reference"] = 21] = "Reference";
    CompletionItemKind[CompletionItemKind["Customcolor"] = 22] = "Customcolor";
    CompletionItemKind[CompletionItemKind["Folder"] = 23] = "Folder";
    CompletionItemKind[CompletionItemKind["TypeParameter"] = 24] = "TypeParameter";
    CompletionItemKind[CompletionItemKind["User"] = 25] = "User";
    CompletionItemKind[CompletionItemKind["Issue"] = 26] = "Issue";
    CompletionItemKind[CompletionItemKind["Snippet"] = 27] = "Snippet";
})(CompletionItemKind || (CompletionItemKind = {}));
export var CompletionItemTag;
(function (CompletionItemTag) {
    CompletionItemTag[CompletionItemTag["Deprecated"] = 1] = "Deprecated";
})(CompletionItemTag || (CompletionItemTag = {}));
/**
 * How a suggest provider was triggered.
 */
export var CompletionTriggerKind;
(function (CompletionTriggerKind) {
    CompletionTriggerKind[CompletionTriggerKind["Invoke"] = 0] = "Invoke";
    CompletionTriggerKind[CompletionTriggerKind["TriggerCharacter"] = 1] = "TriggerCharacter";
    CompletionTriggerKind[CompletionTriggerKind["TriggerForIncompleteCompletions"] = 2] = "TriggerForIncompleteCompletions";
})(CompletionTriggerKind || (CompletionTriggerKind = {}));
/**
 * A positioning preference for rendering content widgets.
 */
export var ContentWidgetPositionPreference;
(function (ContentWidgetPositionPreference) {
    /**
     * Place the content widget exactly at a position
     */
    ContentWidgetPositionPreference[ContentWidgetPositionPreference["EXACT"] = 0] = "EXACT";
    /**
     * Place the content widget above a position
     */
    ContentWidgetPositionPreference[ContentWidgetPositionPreference["ABOVE"] = 1] = "ABOVE";
    /**
     * Place the content widget below a position
     */
    ContentWidgetPositionPreference[ContentWidgetPositionPreference["BELOW"] = 2] = "BELOW";
})(ContentWidgetPositionPreference || (ContentWidgetPositionPreference = {}));
/**
 * Describes the reason the cursor has changed its position.
 */
export var CursorChangeReason;
(function (CursorChangeReason) {
    /**
     * Unknown or not set.
     */
    CursorChangeReason[CursorChangeReason["NotSet"] = 0] = "NotSet";
    /**
     * A `model.setValue()` was called.
     */
    CursorChangeReason[CursorChangeReason["ContentFlush"] = 1] = "ContentFlush";
    /**
     * The `model` has been changed outside of this cursor and the cursor recovers its position from associated markers.
     */
    CursorChangeReason[CursorChangeReason["RecoverFromMarkers"] = 2] = "RecoverFromMarkers";
    /**
     * There was an explicit user gesture.
     */
    CursorChangeReason[CursorChangeReason["Explicit"] = 3] = "Explicit";
    /**
     * There was a Paste.
     */
    CursorChangeReason[CursorChangeReason["Paste"] = 4] = "Paste";
    /**
     * There was an Undo.
     */
    CursorChangeReason[CursorChangeReason["Undo"] = 5] = "Undo";
    /**
     * There was a Redo.
     */
    CursorChangeReason[CursorChangeReason["Redo"] = 6] = "Redo";
})(CursorChangeReason || (CursorChangeReason = {}));
/**
 * The default end of line to use when instantiating models.
 */
export var DefaultEndOfLine;
(function (DefaultEndOfLine) {
    /**
     * Use line feed (\n) as the end of line character.
     */
    DefaultEndOfLine[DefaultEndOfLine["LF"] = 1] = "LF";
    /**
     * Use carriage return and line feed (\r\n) as the end of line character.
     */
    DefaultEndOfLine[DefaultEndOfLine["CRLF"] = 2] = "CRLF";
})(DefaultEndOfLine || (DefaultEndOfLine = {}));
/**
 * A document highlight kind.
 */
export var DocumentHighlightKind;
(function (DocumentHighlightKind) {
    /**
     * A textual occurrence.
     */
    DocumentHighlightKind[DocumentHighlightKind["Text"] = 0] = "Text";
    /**
     * Read-access of a symbol, like reading a variable.
     */
    DocumentHighlightKind[DocumentHighlightKind["Read"] = 1] = "Read";
    /**
     * Write-access of a symbol, like writing to a variable.
     */
    DocumentHighlightKind[DocumentHighlightKind["Write"] = 2] = "Write";
})(DocumentHighlightKind || (DocumentHighlightKind = {}));
/**
 * Configuration options for auto indentation in the editor
 */
export var EditorAutoIndentStrategy;
(function (EditorAutoIndentStrategy) {
    EditorAutoIndentStrategy[EditorAutoIndentStrategy["None"] = 0] = "None";
    EditorAutoIndentStrategy[EditorAutoIndentStrategy["Keep"] = 1] = "Keep";
    EditorAutoIndentStrategy[EditorAutoIndentStrategy["Brackets"] = 2] = "Brackets";
    EditorAutoIndentStrategy[EditorAutoIndentStrategy["Advanced"] = 3] = "Advanced";
    EditorAutoIndentStrategy[EditorAutoIndentStrategy["Full"] = 4] = "Full";
})(EditorAutoIndentStrategy || (EditorAutoIndentStrategy = {}));
export var EditorOption;
(function (EditorOption) {
    EditorOption[EditorOption["acceptSuggestionOnCommitCharacter"] = 0] = "acceptSuggestionOnCommitCharacter";
    EditorOption[EditorOption["acceptSuggestionOnEnter"] = 1] = "acceptSuggestionOnEnter";
    EditorOption[EditorOption["accessibilitySupport"] = 2] = "accessibilitySupport";
    EditorOption[EditorOption["accessibilityPageSize"] = 3] = "accessibilityPageSize";
    EditorOption[EditorOption["ariaLabel"] = 4] = "ariaLabel";
    EditorOption[EditorOption["autoClosingBrackets"] = 5] = "autoClosingBrackets";
    EditorOption[EditorOption["autoClosingDelete"] = 6] = "autoClosingDelete";
    EditorOption[EditorOption["autoClosingOvertype"] = 7] = "autoClosingOvertype";
    EditorOption[EditorOption["autoClosingQuotes"] = 8] = "autoClosingQuotes";
    EditorOption[EditorOption["autoIndent"] = 9] = "autoIndent";
    EditorOption[EditorOption["automaticLayout"] = 10] = "automaticLayout";
    EditorOption[EditorOption["autoSurround"] = 11] = "autoSurround";
    EditorOption[EditorOption["bracketPairColorization"] = 12] = "bracketPairColorization";
    EditorOption[EditorOption["guides"] = 13] = "guides";
    EditorOption[EditorOption["codeLens"] = 14] = "codeLens";
    EditorOption[EditorOption["codeLensFontFamily"] = 15] = "codeLensFontFamily";
    EditorOption[EditorOption["codeLensFontSize"] = 16] = "codeLensFontSize";
    EditorOption[EditorOption["colorDecorators"] = 17] = "colorDecorators";
    EditorOption[EditorOption["colorDecoratorsLimit"] = 18] = "colorDecoratorsLimit";
    EditorOption[EditorOption["columnSelection"] = 19] = "columnSelection";
    EditorOption[EditorOption["comments"] = 20] = "comments";
    EditorOption[EditorOption["contextmenu"] = 21] = "contextmenu";
    EditorOption[EditorOption["copyWithSyntaxHighlighting"] = 22] = "copyWithSyntaxHighlighting";
    EditorOption[EditorOption["cursorBlinking"] = 23] = "cursorBlinking";
    EditorOption[EditorOption["cursorSmoothCaretAnimation"] = 24] = "cursorSmoothCaretAnimation";
    EditorOption[EditorOption["cursorStyle"] = 25] = "cursorStyle";
    EditorOption[EditorOption["cursorSurroundingLines"] = 26] = "cursorSurroundingLines";
    EditorOption[EditorOption["cursorSurroundingLinesStyle"] = 27] = "cursorSurroundingLinesStyle";
    EditorOption[EditorOption["cursorWidth"] = 28] = "cursorWidth";
    EditorOption[EditorOption["disableLayerHinting"] = 29] = "disableLayerHinting";
    EditorOption[EditorOption["disableMonospaceOptimizations"] = 30] = "disableMonospaceOptimizations";
    EditorOption[EditorOption["domReadOnly"] = 31] = "domReadOnly";
    EditorOption[EditorOption["dragAndDrop"] = 32] = "dragAndDrop";
    EditorOption[EditorOption["dropIntoEditor"] = 33] = "dropIntoEditor";
    EditorOption[EditorOption["emptySelectionClipboard"] = 34] = "emptySelectionClipboard";
    EditorOption[EditorOption["experimentalWhitespaceRendering"] = 35] = "experimentalWhitespaceRendering";
    EditorOption[EditorOption["extraEditorClassName"] = 36] = "extraEditorClassName";
    EditorOption[EditorOption["fastScrollSensitivity"] = 37] = "fastScrollSensitivity";
    EditorOption[EditorOption["find"] = 38] = "find";
    EditorOption[EditorOption["fixedOverflowWidgets"] = 39] = "fixedOverflowWidgets";
    EditorOption[EditorOption["folding"] = 40] = "folding";
    EditorOption[EditorOption["foldingStrategy"] = 41] = "foldingStrategy";
    EditorOption[EditorOption["foldingHighlight"] = 42] = "foldingHighlight";
    EditorOption[EditorOption["foldingImportsByDefault"] = 43] = "foldingImportsByDefault";
    EditorOption[EditorOption["foldingMaximumRegions"] = 44] = "foldingMaximumRegions";
    EditorOption[EditorOption["unfoldOnClickAfterEndOfLine"] = 45] = "unfoldOnClickAfterEndOfLine";
    EditorOption[EditorOption["fontFamily"] = 46] = "fontFamily";
    EditorOption[EditorOption["fontInfo"] = 47] = "fontInfo";
    EditorOption[EditorOption["fontLigatures"] = 48] = "fontLigatures";
    EditorOption[EditorOption["fontSize"] = 49] = "fontSize";
    EditorOption[EditorOption["fontWeight"] = 50] = "fontWeight";
    EditorOption[EditorOption["fontVariations"] = 51] = "fontVariations";
    EditorOption[EditorOption["formatOnPaste"] = 52] = "formatOnPaste";
    EditorOption[EditorOption["formatOnType"] = 53] = "formatOnType";
    EditorOption[EditorOption["glyphMargin"] = 54] = "glyphMargin";
    EditorOption[EditorOption["gotoLocation"] = 55] = "gotoLocation";
    EditorOption[EditorOption["hideCursorInOverviewRuler"] = 56] = "hideCursorInOverviewRuler";
    EditorOption[EditorOption["hover"] = 57] = "hover";
    EditorOption[EditorOption["inDiffEditor"] = 58] = "inDiffEditor";
    EditorOption[EditorOption["inlineSuggest"] = 59] = "inlineSuggest";
    EditorOption[EditorOption["letterSpacing"] = 60] = "letterSpacing";
    EditorOption[EditorOption["lightbulb"] = 61] = "lightbulb";
    EditorOption[EditorOption["lineDecorationsWidth"] = 62] = "lineDecorationsWidth";
    EditorOption[EditorOption["lineHeight"] = 63] = "lineHeight";
    EditorOption[EditorOption["lineNumbers"] = 64] = "lineNumbers";
    EditorOption[EditorOption["lineNumbersMinChars"] = 65] = "lineNumbersMinChars";
    EditorOption[EditorOption["linkedEditing"] = 66] = "linkedEditing";
    EditorOption[EditorOption["links"] = 67] = "links";
    EditorOption[EditorOption["matchBrackets"] = 68] = "matchBrackets";
    EditorOption[EditorOption["minimap"] = 69] = "minimap";
    EditorOption[EditorOption["mouseStyle"] = 70] = "mouseStyle";
    EditorOption[EditorOption["mouseWheelScrollSensitivity"] = 71] = "mouseWheelScrollSensitivity";
    EditorOption[EditorOption["mouseWheelZoom"] = 72] = "mouseWheelZoom";
    EditorOption[EditorOption["multiCursorMergeOverlapping"] = 73] = "multiCursorMergeOverlapping";
    EditorOption[EditorOption["multiCursorModifier"] = 74] = "multiCursorModifier";
    EditorOption[EditorOption["multiCursorPaste"] = 75] = "multiCursorPaste";
    EditorOption[EditorOption["multiCursorLimit"] = 76] = "multiCursorLimit";
    EditorOption[EditorOption["occurrencesHighlight"] = 77] = "occurrencesHighlight";
    EditorOption[EditorOption["overviewRulerBorder"] = 78] = "overviewRulerBorder";
    EditorOption[EditorOption["overviewRulerLanes"] = 79] = "overviewRulerLanes";
    EditorOption[EditorOption["padding"] = 80] = "padding";
    EditorOption[EditorOption["parameterHints"] = 81] = "parameterHints";
    EditorOption[EditorOption["peekWidgetDefaultFocus"] = 82] = "peekWidgetDefaultFocus";
    EditorOption[EditorOption["definitionLinkOpensInPeek"] = 83] = "definitionLinkOpensInPeek";
    EditorOption[EditorOption["quickSuggestions"] = 84] = "quickSuggestions";
    EditorOption[EditorOption["quickSuggestionsDelay"] = 85] = "quickSuggestionsDelay";
    EditorOption[EditorOption["readOnly"] = 86] = "readOnly";
    EditorOption[EditorOption["renameOnType"] = 87] = "renameOnType";
    EditorOption[EditorOption["renderControlCharacters"] = 88] = "renderControlCharacters";
    EditorOption[EditorOption["renderFinalNewline"] = 89] = "renderFinalNewline";
    EditorOption[EditorOption["renderLineHighlight"] = 90] = "renderLineHighlight";
    EditorOption[EditorOption["renderLineHighlightOnlyWhenFocus"] = 91] = "renderLineHighlightOnlyWhenFocus";
    EditorOption[EditorOption["renderValidationDecorations"] = 92] = "renderValidationDecorations";
    EditorOption[EditorOption["renderWhitespace"] = 93] = "renderWhitespace";
    EditorOption[EditorOption["revealHorizontalRightPadding"] = 94] = "revealHorizontalRightPadding";
    EditorOption[EditorOption["roundedSelection"] = 95] = "roundedSelection";
    EditorOption[EditorOption["rulers"] = 96] = "rulers";
    EditorOption[EditorOption["scrollbar"] = 97] = "scrollbar";
    EditorOption[EditorOption["scrollBeyondLastColumn"] = 98] = "scrollBeyondLastColumn";
    EditorOption[EditorOption["scrollBeyondLastLine"] = 99] = "scrollBeyondLastLine";
    EditorOption[EditorOption["scrollPredominantAxis"] = 100] = "scrollPredominantAxis";
    EditorOption[EditorOption["selectionClipboard"] = 101] = "selectionClipboard";
    EditorOption[EditorOption["selectionHighlight"] = 102] = "selectionHighlight";
    EditorOption[EditorOption["selectOnLineNumbers"] = 103] = "selectOnLineNumbers";
    EditorOption[EditorOption["showFoldingControls"] = 104] = "showFoldingControls";
    EditorOption[EditorOption["showUnused"] = 105] = "showUnused";
    EditorOption[EditorOption["snippetSuggestions"] = 106] = "snippetSuggestions";
    EditorOption[EditorOption["smartSelect"] = 107] = "smartSelect";
    EditorOption[EditorOption["smoothScrolling"] = 108] = "smoothScrolling";
    EditorOption[EditorOption["stickyScroll"] = 109] = "stickyScroll";
    EditorOption[EditorOption["stickyTabStops"] = 110] = "stickyTabStops";
    EditorOption[EditorOption["stopRenderingLineAfter"] = 111] = "stopRenderingLineAfter";
    EditorOption[EditorOption["suggest"] = 112] = "suggest";
    EditorOption[EditorOption["suggestFontSize"] = 113] = "suggestFontSize";
    EditorOption[EditorOption["suggestLineHeight"] = 114] = "suggestLineHeight";
    EditorOption[EditorOption["suggestOnTriggerCharacters"] = 115] = "suggestOnTriggerCharacters";
    EditorOption[EditorOption["suggestSelection"] = 116] = "suggestSelection";
    EditorOption[EditorOption["tabCompletion"] = 117] = "tabCompletion";
    EditorOption[EditorOption["tabIndex"] = 118] = "tabIndex";
    EditorOption[EditorOption["unicodeHighlighting"] = 119] = "unicodeHighlighting";
    EditorOption[EditorOption["unusualLineTerminators"] = 120] = "unusualLineTerminators";
    EditorOption[EditorOption["useShadowDOM"] = 121] = "useShadowDOM";
    EditorOption[EditorOption["useTabStops"] = 122] = "useTabStops";
    EditorOption[EditorOption["wordBreak"] = 123] = "wordBreak";
    EditorOption[EditorOption["wordSeparators"] = 124] = "wordSeparators";
    EditorOption[EditorOption["wordWrap"] = 125] = "wordWrap";
    EditorOption[EditorOption["wordWrapBreakAfterCharacters"] = 126] = "wordWrapBreakAfterCharacters";
    EditorOption[EditorOption["wordWrapBreakBeforeCharacters"] = 127] = "wordWrapBreakBeforeCharacters";
    EditorOption[EditorOption["wordWrapColumn"] = 128] = "wordWrapColumn";
    EditorOption[EditorOption["wordWrapOverride1"] = 129] = "wordWrapOverride1";
    EditorOption[EditorOption["wordWrapOverride2"] = 130] = "wordWrapOverride2";
    EditorOption[EditorOption["wrappingIndent"] = 131] = "wrappingIndent";
    EditorOption[EditorOption["wrappingStrategy"] = 132] = "wrappingStrategy";
    EditorOption[EditorOption["showDeprecated"] = 133] = "showDeprecated";
    EditorOption[EditorOption["inlayHints"] = 134] = "inlayHints";
    EditorOption[EditorOption["editorClassName"] = 135] = "editorClassName";
    EditorOption[EditorOption["pixelRatio"] = 136] = "pixelRatio";
    EditorOption[EditorOption["tabFocusMode"] = 137] = "tabFocusMode";
    EditorOption[EditorOption["layoutInfo"] = 138] = "layoutInfo";
    EditorOption[EditorOption["wrappingInfo"] = 139] = "wrappingInfo";
})(EditorOption || (EditorOption = {}));
/**
 * End of line character preference.
 */
export var EndOfLinePreference;
(function (EndOfLinePreference) {
    /**
     * Use the end of line character identified in the text buffer.
     */
    EndOfLinePreference[EndOfLinePreference["TextDefined"] = 0] = "TextDefined";
    /**
     * Use line feed (\n) as the end of line character.
     */
    EndOfLinePreference[EndOfLinePreference["LF"] = 1] = "LF";
    /**
     * Use carriage return and line feed (\r\n) as the end of line character.
     */
    EndOfLinePreference[EndOfLinePreference["CRLF"] = 2] = "CRLF";
})(EndOfLinePreference || (EndOfLinePreference = {}));
/**
 * End of line character preference.
 */
export var EndOfLineSequence;
(function (EndOfLineSequence) {
    /**
     * Use line feed (\n) as the end of line character.
     */
    EndOfLineSequence[EndOfLineSequence["LF"] = 0] = "LF";
    /**
     * Use carriage return and line feed (\r\n) as the end of line character.
     */
    EndOfLineSequence[EndOfLineSequence["CRLF"] = 1] = "CRLF";
})(EndOfLineSequence || (EndOfLineSequence = {}));
/**
 * Describes what to do with the indentation when pressing Enter.
 */
export var IndentAction;
(function (IndentAction) {
    /**
     * Insert new line and copy the previous line's indentation.
     */
    IndentAction[IndentAction["None"] = 0] = "None";
    /**
     * Insert new line and indent once (relative to the previous line's indentation).
     */
    IndentAction[IndentAction["Indent"] = 1] = "Indent";
    /**
     * Insert two new lines:
     *  - the first one indented which will hold the cursor
     *  - the second one at the same indentation level
     */
    IndentAction[IndentAction["IndentOutdent"] = 2] = "IndentOutdent";
    /**
     * Insert new line and outdent once (relative to the previous line's indentation).
     */
    IndentAction[IndentAction["Outdent"] = 3] = "Outdent";
})(IndentAction || (IndentAction = {}));
export var InjectedTextCursorStops;
(function (InjectedTextCursorStops) {
    InjectedTextCursorStops[InjectedTextCursorStops["Both"] = 0] = "Both";
    InjectedTextCursorStops[InjectedTextCursorStops["Right"] = 1] = "Right";
    InjectedTextCursorStops[InjectedTextCursorStops["Left"] = 2] = "Left";
    InjectedTextCursorStops[InjectedTextCursorStops["None"] = 3] = "None";
})(InjectedTextCursorStops || (InjectedTextCursorStops = {}));
export var InlayHintKind;
(function (InlayHintKind) {
    InlayHintKind[InlayHintKind["Type"] = 1] = "Type";
    InlayHintKind[InlayHintKind["Parameter"] = 2] = "Parameter";
})(InlayHintKind || (InlayHintKind = {}));
/**
 * How an {@link InlineCompletionsProvider inline completion provider} was triggered.
 */
export var InlineCompletionTriggerKind;
(function (InlineCompletionTriggerKind) {
    /**
     * Completion was triggered automatically while editing.
     * It is sufficient to return a single completion item in this case.
     */
    InlineCompletionTriggerKind[InlineCompletionTriggerKind["Automatic"] = 0] = "Automatic";
    /**
     * Completion was triggered explicitly by a user gesture.
     * Return multiple completion items to enable cycling through them.
     */
    InlineCompletionTriggerKind[InlineCompletionTriggerKind["Explicit"] = 1] = "Explicit";
})(InlineCompletionTriggerKind || (InlineCompletionTriggerKind = {}));
/**
 * Virtual Key Codes, the value does not hold any inherent meaning.
 * Inspired somewhat from https://msdn.microsoft.com/en-us/library/windows/desktop/dd375731(v=vs.85).aspx
 * But these are "more general", as they should work across browsers & OS`s.
 */
export var KeyCode;
(function (KeyCode) {
    KeyCode[KeyCode["DependsOnKbLayout"] = -1] = "DependsOnKbLayout";
    /**
     * Placed first to cover the 0 value of the enum.
     */
    KeyCode[KeyCode["Unknown"] = 0] = "Unknown";
    KeyCode[KeyCode["Backspace"] = 1] = "Backspace";
    KeyCode[KeyCode["Tab"] = 2] = "Tab";
    KeyCode[KeyCode["Enter"] = 3] = "Enter";
    KeyCode[KeyCode["Shift"] = 4] = "Shift";
    KeyCode[KeyCode["Ctrl"] = 5] = "Ctrl";
    KeyCode[KeyCode["Alt"] = 6] = "Alt";
    KeyCode[KeyCode["PauseBreak"] = 7] = "PauseBreak";
    KeyCode[KeyCode["CapsLock"] = 8] = "CapsLock";
    KeyCode[KeyCode["Escape"] = 9] = "Escape";
    KeyCode[KeyCode["Space"] = 10] = "Space";
    KeyCode[KeyCode["PageUp"] = 11] = "PageUp";
    KeyCode[KeyCode["PageDown"] = 12] = "PageDown";
    KeyCode[KeyCode["End"] = 13] = "End";
    KeyCode[KeyCode["Home"] = 14] = "Home";
    KeyCode[KeyCode["LeftArrow"] = 15] = "LeftArrow";
    KeyCode[KeyCode["UpArrow"] = 16] = "UpArrow";
    KeyCode[KeyCode["RightArrow"] = 17] = "RightArrow";
    KeyCode[KeyCode["DownArrow"] = 18] = "DownArrow";
    KeyCode[KeyCode["Insert"] = 19] = "Insert";
    KeyCode[KeyCode["Delete"] = 20] = "Delete";
    KeyCode[KeyCode["Digit0"] = 21] = "Digit0";
    KeyCode[KeyCode["Digit1"] = 22] = "Digit1";
    KeyCode[KeyCode["Digit2"] = 23] = "Digit2";
    KeyCode[KeyCode["Digit3"] = 24] = "Digit3";
    KeyCode[KeyCode["Digit4"] = 25] = "Digit4";
    KeyCode[KeyCode["Digit5"] = 26] = "Digit5";
    KeyCode[KeyCode["Digit6"] = 27] = "Digit6";
    KeyCode[KeyCode["Digit7"] = 28] = "Digit7";
    KeyCode[KeyCode["Digit8"] = 29] = "Digit8";
    KeyCode[KeyCode["Digit9"] = 30] = "Digit9";
    KeyCode[KeyCode["KeyA"] = 31] = "KeyA";
    KeyCode[KeyCode["KeyB"] = 32] = "KeyB";
    KeyCode[KeyCode["KeyC"] = 33] = "KeyC";
    KeyCode[KeyCode["KeyD"] = 34] = "KeyD";
    KeyCode[KeyCode["KeyE"] = 35] = "KeyE";
    KeyCode[KeyCode["KeyF"] = 36] = "KeyF";
    KeyCode[KeyCode["KeyG"] = 37] = "KeyG";
    KeyCode[KeyCode["KeyH"] = 38] = "KeyH";
    KeyCode[KeyCode["KeyI"] = 39] = "KeyI";
    KeyCode[KeyCode["KeyJ"] = 40] = "KeyJ";
    KeyCode[KeyCode["KeyK"] = 41] = "KeyK";
    KeyCode[KeyCode["KeyL"] = 42] = "KeyL";
    KeyCode[KeyCode["KeyM"] = 43] = "KeyM";
    KeyCode[KeyCode["KeyN"] = 44] = "KeyN";
    KeyCode[KeyCode["KeyO"] = 45] = "KeyO";
    KeyCode[KeyCode["KeyP"] = 46] = "KeyP";
    KeyCode[KeyCode["KeyQ"] = 47] = "KeyQ";
    KeyCode[KeyCode["KeyR"] = 48] = "KeyR";
    KeyCode[KeyCode["KeyS"] = 49] = "KeyS";
    KeyCode[KeyCode["KeyT"] = 50] = "KeyT";
    KeyCode[KeyCode["KeyU"] = 51] = "KeyU";
    KeyCode[KeyCode["KeyV"] = 52] = "KeyV";
    KeyCode[KeyCode["KeyW"] = 53] = "KeyW";
    KeyCode[KeyCode["KeyX"] = 54] = "KeyX";
    KeyCode[KeyCode["KeyY"] = 55] = "KeyY";
    KeyCode[KeyCode["KeyZ"] = 56] = "KeyZ";
    KeyCode[KeyCode["Meta"] = 57] = "Meta";
    KeyCode[KeyCode["ContextMenu"] = 58] = "ContextMenu";
    KeyCode[KeyCode["F1"] = 59] = "F1";
    KeyCode[KeyCode["F2"] = 60] = "F2";
    KeyCode[KeyCode["F3"] = 61] = "F3";
    KeyCode[KeyCode["F4"] = 62] = "F4";
    KeyCode[KeyCode["F5"] = 63] = "F5";
    KeyCode[KeyCode["F6"] = 64] = "F6";
    KeyCode[KeyCode["F7"] = 65] = "F7";
    KeyCode[KeyCode["F8"] = 66] = "F8";
    KeyCode[KeyCode["F9"] = 67] = "F9";
    KeyCode[KeyCode["F10"] = 68] = "F10";
    KeyCode[KeyCode["F11"] = 69] = "F11";
    KeyCode[KeyCode["F12"] = 70] = "F12";
    KeyCode[KeyCode["F13"] = 71] = "F13";
    KeyCode[KeyCode["F14"] = 72] = "F14";
    KeyCode[KeyCode["F15"] = 73] = "F15";
    KeyCode[KeyCode["F16"] = 74] = "F16";
    KeyCode[KeyCode["F17"] = 75] = "F17";
    KeyCode[KeyCode["F18"] = 76] = "F18";
    KeyCode[KeyCode["F19"] = 77] = "F19";
    KeyCode[KeyCode["NumLock"] = 78] = "NumLock";
    KeyCode[KeyCode["ScrollLock"] = 79] = "ScrollLock";
    /**
     * Used for miscellaneous characters; it can vary by keyboard.
     * For the US standard keyboard, the ';:' key
     */
    KeyCode[KeyCode["Semicolon"] = 80] = "Semicolon";
    /**
     * For any country/region, the '+' key
     * For the US standard keyboard, the '=+' key
     */
    KeyCode[KeyCode["Equal"] = 81] = "Equal";
    /**
     * For any country/region, the ',' key
     * For the US standard keyboard, the ',<' key
     */
    KeyCode[KeyCode["Comma"] = 82] = "Comma";
    /**
     * For any country/region, the '-' key
     * For the US standard keyboard, the '-_' key
     */
    KeyCode[KeyCode["Minus"] = 83] = "Minus";
    /**
     * For any country/region, the '.' key
     * For the US standard keyboard, the '.>' key
     */
    KeyCode[KeyCode["Period"] = 84] = "Period";
    /**
     * Used for miscellaneous characters; it can vary by keyboard.
     * For the US standard keyboard, the '/?' key
     */
    KeyCode[KeyCode["Slash"] = 85] = "Slash";
    /**
     * Used for miscellaneous characters; it can vary by keyboard.
     * For the US standard keyboard, the '`~' key
     */
    KeyCode[KeyCode["Backquote"] = 86] = "Backquote";
    /**
     * Used for miscellaneous characters; it can vary by keyboard.
     * For the US standard keyboard, the '[{' key
     */
    KeyCode[KeyCode["BracketLeft"] = 87] = "BracketLeft";
    /**
     * Used for miscellaneous characters; it can vary by keyboard.
     * For the US standard keyboard, the '\|' key
     */
    KeyCode[KeyCode["Backslash"] = 88] = "Backslash";
    /**
     * Used for miscellaneous characters; it can vary by keyboard.
     * For the US standard keyboard, the ']}' key
     */
    KeyCode[KeyCode["BracketRight"] = 89] = "BracketRight";
    /**
     * Used for miscellaneous characters; it can vary by keyboard.
     * For the US standard keyboard, the ''"' key
     */
    KeyCode[KeyCode["Quote"] = 90] = "Quote";
    /**
     * Used for miscellaneous characters; it can vary by keyboard.
     */
    KeyCode[KeyCode["OEM_8"] = 91] = "OEM_8";
    /**
     * Either the angle bracket key or the backslash key on the RT 102-key keyboard.
     */
    KeyCode[KeyCode["IntlBackslash"] = 92] = "IntlBackslash";
    KeyCode[KeyCode["Numpad0"] = 93] = "Numpad0";
    KeyCode[KeyCode["Numpad1"] = 94] = "Numpad1";
    KeyCode[KeyCode["Numpad2"] = 95] = "Numpad2";
    KeyCode[KeyCode["Numpad3"] = 96] = "Numpad3";
    KeyCode[KeyCode["Numpad4"] = 97] = "Numpad4";
    KeyCode[KeyCode["Numpad5"] = 98] = "Numpad5";
    KeyCode[KeyCode["Numpad6"] = 99] = "Numpad6";
    KeyCode[KeyCode["Numpad7"] = 100] = "Numpad7";
    KeyCode[KeyCode["Numpad8"] = 101] = "Numpad8";
    KeyCode[KeyCode["Numpad9"] = 102] = "Numpad9";
    KeyCode[KeyCode["NumpadMultiply"] = 103] = "NumpadMultiply";
    KeyCode[KeyCode["NumpadAdd"] = 104] = "NumpadAdd";
    KeyCode[KeyCode["NUMPAD_SEPARATOR"] = 105] = "NUMPAD_SEPARATOR";
    KeyCode[KeyCode["NumpadSubtract"] = 106] = "NumpadSubtract";
    KeyCode[KeyCode["NumpadDecimal"] = 107] = "NumpadDecimal";
    KeyCode[KeyCode["NumpadDivide"] = 108] = "NumpadDivide";
    /**
     * Cover all key codes when IME is processing input.
     */
    KeyCode[KeyCode["KEY_IN_COMPOSITION"] = 109] = "KEY_IN_COMPOSITION";
    KeyCode[KeyCode["ABNT_C1"] = 110] = "ABNT_C1";
    KeyCode[KeyCode["ABNT_C2"] = 111] = "ABNT_C2";
    KeyCode[KeyCode["AudioVolumeMute"] = 112] = "AudioVolumeMute";
    KeyCode[KeyCode["AudioVolumeUp"] = 113] = "AudioVolumeUp";
    KeyCode[KeyCode["AudioVolumeDown"] = 114] = "AudioVolumeDown";
    KeyCode[KeyCode["BrowserSearch"] = 115] = "BrowserSearch";
    KeyCode[KeyCode["BrowserHome"] = 116] = "BrowserHome";
    KeyCode[KeyCode["BrowserBack"] = 117] = "BrowserBack";
    KeyCode[KeyCode["BrowserForward"] = 118] = "BrowserForward";
    KeyCode[KeyCode["MediaTrackNext"] = 119] = "MediaTrackNext";
    KeyCode[KeyCode["MediaTrackPrevious"] = 120] = "MediaTrackPrevious";
    KeyCode[KeyCode["MediaStop"] = 121] = "MediaStop";
    KeyCode[KeyCode["MediaPlayPause"] = 122] = "MediaPlayPause";
    KeyCode[KeyCode["LaunchMediaPlayer"] = 123] = "LaunchMediaPlayer";
    KeyCode[KeyCode["LaunchMail"] = 124] = "LaunchMail";
    KeyCode[KeyCode["LaunchApp2"] = 125] = "LaunchApp2";
    /**
     * VK_CLEAR, 0x0C, CLEAR key
     */
    KeyCode[KeyCode["Clear"] = 126] = "Clear";
    /**
     * Placed last to cover the length of the enum.
     * Please do not depend on this value!
     */
    KeyCode[KeyCode["MAX_VALUE"] = 127] = "MAX_VALUE";
})(KeyCode || (KeyCode = {}));
export var MarkerSeverity;
(function (MarkerSeverity) {
    MarkerSeverity[MarkerSeverity["Hint"] = 1] = "Hint";
    MarkerSeverity[MarkerSeverity["Info"] = 2] = "Info";
    MarkerSeverity[MarkerSeverity["Warning"] = 4] = "Warning";
    MarkerSeverity[MarkerSeverity["Error"] = 8] = "Error";
})(MarkerSeverity || (MarkerSeverity = {}));
export var MarkerTag;
(function (MarkerTag) {
    MarkerTag[MarkerTag["Unnecessary"] = 1] = "Unnecessary";
    MarkerTag[MarkerTag["Deprecated"] = 2] = "Deprecated";
})(MarkerTag || (MarkerTag = {}));
/**
 * Position in the minimap to render the decoration.
 */
export var MinimapPosition;
(function (MinimapPosition) {
    MinimapPosition[MinimapPosition["Inline"] = 1] = "Inline";
    MinimapPosition[MinimapPosition["Gutter"] = 2] = "Gutter";
})(MinimapPosition || (MinimapPosition = {}));
/**
 * Type of hit element with the mouse in the editor.
 */
export var MouseTargetType;
(function (MouseTargetType) {
    /**
     * Mouse is on top of an unknown element.
     */
    MouseTargetType[MouseTargetType["UNKNOWN"] = 0] = "UNKNOWN";
    /**
     * Mouse is on top of the textarea used for input.
     */
    MouseTargetType[MouseTargetType["TEXTAREA"] = 1] = "TEXTAREA";
    /**
     * Mouse is on top of the glyph margin
     */
    MouseTargetType[MouseTargetType["GUTTER_GLYPH_MARGIN"] = 2] = "GUTTER_GLYPH_MARGIN";
    /**
     * Mouse is on top of the line numbers
     */
    MouseTargetType[MouseTargetType["GUTTER_LINE_NUMBERS"] = 3] = "GUTTER_LINE_NUMBERS";
    /**
     * Mouse is on top of the line decorations
     */
    MouseTargetType[MouseTargetType["GUTTER_LINE_DECORATIONS"] = 4] = "GUTTER_LINE_DECORATIONS";
    /**
     * Mouse is on top of the whitespace left in the gutter by a view zone.
     */
    MouseTargetType[MouseTargetType["GUTTER_VIEW_ZONE"] = 5] = "GUTTER_VIEW_ZONE";
    /**
     * Mouse is on top of text in the content.
     */
    MouseTargetType[MouseTargetType["CONTENT_TEXT"] = 6] = "CONTENT_TEXT";
    /**
     * Mouse is on top of empty space in the content (e.g. after line text or below last line)
     */
    MouseTargetType[MouseTargetType["CONTENT_EMPTY"] = 7] = "CONTENT_EMPTY";
    /**
     * Mouse is on top of a view zone in the content.
     */
    MouseTargetType[MouseTargetType["CONTENT_VIEW_ZONE"] = 8] = "CONTENT_VIEW_ZONE";
    /**
     * Mouse is on top of a content widget.
     */
    MouseTargetType[MouseTargetType["CONTENT_WIDGET"] = 9] = "CONTENT_WIDGET";
    /**
     * Mouse is on top of the decorations overview ruler.
     */
    MouseTargetType[MouseTargetType["OVERVIEW_RULER"] = 10] = "OVERVIEW_RULER";
    /**
     * Mouse is on top of a scrollbar.
     */
    MouseTargetType[MouseTargetType["SCROLLBAR"] = 11] = "SCROLLBAR";
    /**
     * Mouse is on top of an overlay widget.
     */
    MouseTargetType[MouseTargetType["OVERLAY_WIDGET"] = 12] = "OVERLAY_WIDGET";
    /**
     * Mouse is outside of the editor.
     */
    MouseTargetType[MouseTargetType["OUTSIDE_EDITOR"] = 13] = "OUTSIDE_EDITOR";
})(MouseTargetType || (MouseTargetType = {}));
/**
 * A positioning preference for rendering overlay widgets.
 */
export var OverlayWidgetPositionPreference;
(function (OverlayWidgetPositionPreference) {
    /**
     * Position the overlay widget in the top right corner
     */
    OverlayWidgetPositionPreference[OverlayWidgetPositionPreference["TOP_RIGHT_CORNER"] = 0] = "TOP_RIGHT_CORNER";
    /**
     * Position the overlay widget in the bottom right corner
     */
    OverlayWidgetPositionPreference[OverlayWidgetPositionPreference["BOTTOM_RIGHT_CORNER"] = 1] = "BOTTOM_RIGHT_CORNER";
    /**
     * Position the overlay widget in the top center
     */
    OverlayWidgetPositionPreference[OverlayWidgetPositionPreference["TOP_CENTER"] = 2] = "TOP_CENTER";
})(OverlayWidgetPositionPreference || (OverlayWidgetPositionPreference = {}));
/**
 * Vertical Lane in the overview ruler of the editor.
 */
export var OverviewRulerLane;
(function (OverviewRulerLane) {
    OverviewRulerLane[OverviewRulerLane["Left"] = 1] = "Left";
    OverviewRulerLane[OverviewRulerLane["Center"] = 2] = "Center";
    OverviewRulerLane[OverviewRulerLane["Right"] = 4] = "Right";
    OverviewRulerLane[OverviewRulerLane["Full"] = 7] = "Full";
})(OverviewRulerLane || (OverviewRulerLane = {}));
export var PositionAffinity;
(function (PositionAffinity) {
    /**
     * Prefers the left most position.
    */
    PositionAffinity[PositionAffinity["Left"] = 0] = "Left";
    /**
     * Prefers the right most position.
    */
    PositionAffinity[PositionAffinity["Right"] = 1] = "Right";
    /**
     * No preference.
    */
    PositionAffinity[PositionAffinity["None"] = 2] = "None";
    /**
     * If the given position is on injected text, prefers the position left of it.
    */
    PositionAffinity[PositionAffinity["LeftOfInjectedText"] = 3] = "LeftOfInjectedText";
    /**
     * If the given position is on injected text, prefers the position right of it.
    */
    PositionAffinity[PositionAffinity["RightOfInjectedText"] = 4] = "RightOfInjectedText";
})(PositionAffinity || (PositionAffinity = {}));
export var RenderLineNumbersType;
(function (RenderLineNumbersType) {
    RenderLineNumbersType[RenderLineNumbersType["Off"] = 0] = "Off";
    RenderLineNumbersType[RenderLineNumbersType["On"] = 1] = "On";
    RenderLineNumbersType[RenderLineNumbersType["Relative"] = 2] = "Relative";
    RenderLineNumbersType[RenderLineNumbersType["Interval"] = 3] = "Interval";
    RenderLineNumbersType[RenderLineNumbersType["Custom"] = 4] = "Custom";
})(RenderLineNumbersType || (RenderLineNumbersType = {}));
export var RenderMinimap;
(function (RenderMinimap) {
    RenderMinimap[RenderMinimap["None"] = 0] = "None";
    RenderMinimap[RenderMinimap["Text"] = 1] = "Text";
    RenderMinimap[RenderMinimap["Blocks"] = 2] = "Blocks";
})(RenderMinimap || (RenderMinimap = {}));
export var ScrollType;
(function (ScrollType) {
    ScrollType[ScrollType["Smooth"] = 0] = "Smooth";
    ScrollType[ScrollType["Immediate"] = 1] = "Immediate";
})(ScrollType || (ScrollType = {}));
export var ScrollbarVisibility;
(function (ScrollbarVisibility) {
    ScrollbarVisibility[ScrollbarVisibility["Auto"] = 1] = "Auto";
    ScrollbarVisibility[ScrollbarVisibility["Hidden"] = 2] = "Hidden";
    ScrollbarVisibility[ScrollbarVisibility["Visible"] = 3] = "Visible";
})(ScrollbarVisibility || (ScrollbarVisibility = {}));
/**
 * The direction of a selection.
 */
export var SelectionDirection;
(function (SelectionDirection) {
    /**
     * The selection starts above where it ends.
     */
    SelectionDirection[SelectionDirection["LTR"] = 0] = "LTR";
    /**
     * The selection starts below where it ends.
     */
    SelectionDirection[SelectionDirection["RTL"] = 1] = "RTL";
})(SelectionDirection || (SelectionDirection = {}));
export var SignatureHelpTriggerKind;
(function (SignatureHelpTriggerKind) {
    SignatureHelpTriggerKind[SignatureHelpTriggerKind["Invoke"] = 1] = "Invoke";
    SignatureHelpTriggerKind[SignatureHelpTriggerKind["TriggerCharacter"] = 2] = "TriggerCharacter";
    SignatureHelpTriggerKind[SignatureHelpTriggerKind["ContentChange"] = 3] = "ContentChange";
})(SignatureHelpTriggerKind || (SignatureHelpTriggerKind = {}));
/**
 * A symbol kind.
 */
export var SymbolKind;
(function (SymbolKind) {
    SymbolKind[SymbolKind["File"] = 0] = "File";
    SymbolKind[SymbolKind["Module"] = 1] = "Module";
    SymbolKind[SymbolKind["Namespace"] = 2] = "Namespace";
    SymbolKind[SymbolKind["Package"] = 3] = "Package";
    SymbolKind[SymbolKind["Class"] = 4] = "Class";
    SymbolKind[SymbolKind["Method"] = 5] = "Method";
    SymbolKind[SymbolKind["Property"] = 6] = "Property";
    SymbolKind[SymbolKind["Field"] = 7] = "Field";
    SymbolKind[SymbolKind["Constructor"] = 8] = "Constructor";
    SymbolKind[SymbolKind["Enum"] = 9] = "Enum";
    SymbolKind[SymbolKind["Interface"] = 10] = "Interface";
    SymbolKind[SymbolKind["Function"] = 11] = "Function";
    SymbolKind[SymbolKind["Variable"] = 12] = "Variable";
    SymbolKind[SymbolKind["Constant"] = 13] = "Constant";
    SymbolKind[SymbolKind["String"] = 14] = "String";
    SymbolKind[SymbolKind["Number"] = 15] = "Number";
    SymbolKind[SymbolKind["Boolean"] = 16] = "Boolean";
    SymbolKind[SymbolKind["Array"] = 17] = "Array";
    SymbolKind[SymbolKind["Object"] = 18] = "Object";
    SymbolKind[SymbolKind["Key"] = 19] = "Key";
    SymbolKind[SymbolKind["Null"] = 20] = "Null";
    SymbolKind[SymbolKind["EnumMember"] = 21] = "EnumMember";
    SymbolKind[SymbolKind["Struct"] = 22] = "Struct";
    SymbolKind[SymbolKind["Event"] = 23] = "Event";
    SymbolKind[SymbolKind["Operator"] = 24] = "Operator";
    SymbolKind[SymbolKind["TypeParameter"] = 25] = "TypeParameter";
})(SymbolKind || (SymbolKind = {}));
export var SymbolTag;
(function (SymbolTag) {
    SymbolTag[SymbolTag["Deprecated"] = 1] = "Deprecated";
})(SymbolTag || (SymbolTag = {}));
/**
 * The kind of animation in which the editor's cursor should be rendered.
 */
export var TextEditorCursorBlinkingStyle;
(function (TextEditorCursorBlinkingStyle) {
    /**
     * Hidden
     */
    TextEditorCursorBlinkingStyle[TextEditorCursorBlinkingStyle["Hidden"] = 0] = "Hidden";
    /**
     * Blinking
     */
    TextEditorCursorBlinkingStyle[TextEditorCursorBlinkingStyle["Blink"] = 1] = "Blink";
    /**
     * Blinking with smooth fading
     */
    TextEditorCursorBlinkingStyle[TextEditorCursorBlinkingStyle["Smooth"] = 2] = "Smooth";
    /**
     * Blinking with prolonged filled state and smooth fading
     */
    TextEditorCursorBlinkingStyle[TextEditorCursorBlinkingStyle["Phase"] = 3] = "Phase";
    /**
     * Expand collapse animation on the y axis
     */
    TextEditorCursorBlinkingStyle[TextEditorCursorBlinkingStyle["Expand"] = 4] = "Expand";
    /**
     * No-Blinking
     */
    TextEditorCursorBlinkingStyle[TextEditorCursorBlinkingStyle["Solid"] = 5] = "Solid";
})(TextEditorCursorBlinkingStyle || (TextEditorCursorBlinkingStyle = {}));
/**
 * The style in which the editor's cursor should be rendered.
 */
export var TextEditorCursorStyle;
(function (TextEditorCursorStyle) {
    /**
     * As a vertical line (sitting between two characters).
     */
    TextEditorCursorStyle[TextEditorCursorStyle["Line"] = 1] = "Line";
    /**
     * As a block (sitting on top of a character).
     */
    TextEditorCursorStyle[TextEditorCursorStyle["Block"] = 2] = "Block";
    /**
     * As a horizontal line (sitting under a character).
     */
    TextEditorCursorStyle[TextEditorCursorStyle["Underline"] = 3] = "Underline";
    /**
     * As a thin vertical line (sitting between two characters).
     */
    TextEditorCursorStyle[TextEditorCursorStyle["LineThin"] = 4] = "LineThin";
    /**
     * As an outlined block (sitting on top of a character).
     */
    TextEditorCursorStyle[TextEditorCursorStyle["BlockOutline"] = 5] = "BlockOutline";
    /**
     * As a thin horizontal line (sitting under a character).
     */
    TextEditorCursorStyle[TextEditorCursorStyle["UnderlineThin"] = 6] = "UnderlineThin";
})(TextEditorCursorStyle || (TextEditorCursorStyle = {}));
/**
 * Describes the behavior of decorations when typing/editing near their edges.
 * Note: Please do not edit the values, as they very carefully match `DecorationRangeBehavior`
 */
export var TrackedRangeStickiness;
(function (TrackedRangeStickiness) {
    TrackedRangeStickiness[TrackedRangeStickiness["AlwaysGrowsWhenTypingAtEdges"] = 0] = "AlwaysGrowsWhenTypingAtEdges";
    TrackedRangeStickiness[TrackedRangeStickiness["NeverGrowsWhenTypingAtEdges"] = 1] = "NeverGrowsWhenTypingAtEdges";
    TrackedRangeStickiness[TrackedRangeStickiness["GrowsOnlyWhenTypingBefore"] = 2] = "GrowsOnlyWhenTypingBefore";
    TrackedRangeStickiness[TrackedRangeStickiness["GrowsOnlyWhenTypingAfter"] = 3] = "GrowsOnlyWhenTypingAfter";
})(TrackedRangeStickiness || (TrackedRangeStickiness = {}));
/**
 * Describes how to indent wrapped lines.
 */
export var WrappingIndent;
(function (WrappingIndent) {
    /**
     * No indentation => wrapped lines begin at column 1.
     */
    WrappingIndent[WrappingIndent["None"] = 0] = "None";
    /**
     * Same => wrapped lines get the same indentation as the parent.
     */
    WrappingIndent[WrappingIndent["Same"] = 1] = "Same";
    /**
     * Indent => wrapped lines get +1 indentation toward the parent.
     */
    WrappingIndent[WrappingIndent["Indent"] = 2] = "Indent";
    /**
     * DeepIndent => wrapped lines get +2 indentation toward the parent.
     */
    WrappingIndent[WrappingIndent["DeepIndent"] = 3] = "DeepIndent";
})(WrappingIndent || (WrappingIndent = {}));
