//
// THIS IS A GENERATED FILE. PLEASE DO NOT EDIT DIRECTLY.
// GENERATED USING node scripts/import-editor.js
//
import { IFeatureDefinition } from "./types";

export const featuresArr: IFeatureDefinition[] = [
  {
    label: 'accessibilityHelp',
    entry: 'vs/editor/standalone/browser/accessibilityHelp/accessibilityHelp'
  },
  {
    label: 'anchorSelect',
    entry: 'vs/editor/contrib/anchorSelect/anchorSelect'
  },
  {
    label: 'bracketMatching',
    entry: 'vs/editor/contrib/bracketMatching/bracketMatching'
  },
  {
    label: 'caretOperations',
    entry: 'vs/editor/contrib/caretOperations/caretOperations'
  },
  {
    label: 'clipboard',
    entry: 'vs/editor/contrib/clipboard/clipboard'
  },
  {
    label: 'codeAction',
    entry: 'vs/editor/contrib/codeAction/codeActionContributions'
  },
  {
    label: 'codelens',
    entry: 'vs/editor/contrib/codelens/codelensController'
  },
  {
    label: 'colorDetector',
    entry: 'vs/editor/contrib/colorPicker/colorDetector'
  },
  {
    label: 'comment',
    entry: 'vs/editor/contrib/comment/comment'
  },
  {
    label: 'contextmenu',
    entry: 'vs/editor/contrib/contextmenu/contextmenu'
  },
  {
    label: 'coreCommands',
    entry: 'vs/editor/browser/controller/coreCommands'
  },
  {
    label: 'cursorUndo',
    entry: 'vs/editor/contrib/cursorUndo/cursorUndo'
  },
  {
    label: 'dnd',
    entry: 'vs/editor/contrib/dnd/dnd'
  },
  {
    label: 'find',
    entry: 'vs/editor/contrib/find/findController'
  },
  {
    label: 'folding',
    entry: 'vs/editor/contrib/folding/folding'
  },
  {
    label: 'fontZoom',
    entry: 'vs/editor/contrib/fontZoom/fontZoom'
  },
  {
    label: 'format',
    entry: 'vs/editor/contrib/format/formatActions'
  },
  {
    label: 'gotoError',
    entry: 'vs/editor/contrib/gotoError/gotoError'
  },
  {
    label: 'gotoLine',
    entry: 'vs/editor/standalone/browser/quickAccess/standaloneGotoLineQuickAccess'
  },
  {
    label: 'gotoSymbol',
    entry: [
      'vs/editor/contrib/gotoSymbol/goToCommands',
      'vs/editor/contrib/gotoSymbol/link/goToDefinitionAtPosition'
    ]
  },
  {
    label: 'hover',
    entry: 'vs/editor/contrib/hover/hover'
  },
  {
    label: 'iPadShowKeyboard',
    entry: 'vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard'
  },
  {
    label: 'inPlaceReplace',
    entry: 'vs/editor/contrib/inPlaceReplace/inPlaceReplace'
  },
  {
    label: 'indentation',
    entry: 'vs/editor/contrib/indentation/indentation'
  },
  {
    label: 'inspectTokens',
    entry: 'vs/editor/standalone/browser/inspectTokens/inspectTokens'
  },
  {
    label: 'linesOperations',
    entry: 'vs/editor/contrib/linesOperations/linesOperations'
  },
  {
    label: 'links',
    entry: 'vs/editor/contrib/links/links'
  },
  {
    label: 'multicursor',
    entry: 'vs/editor/contrib/multicursor/multicursor'
  },
  {
    label: 'onTypeRename',
    entry: 'vs/editor/contrib/rename/onTypeRename'
  },
  {
    label: 'parameterHints',
    entry: 'vs/editor/contrib/parameterHints/parameterHints'
  },
  {
    label: 'quickCommand',
    entry: 'vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess'
  },
  {
    label: 'quickHelp',
    entry: 'vs/editor/standalone/browser/quickAccess/standaloneHelpQuickAccess'
  },
  {
    label: 'quickOutline',
    entry: 'vs/editor/standalone/browser/quickAccess/standaloneGotoSymbolQuickAccess'
  },
  {
    label: 'referenceSearch',
    entry: 'vs/editor/standalone/browser/referenceSearch/standaloneReferenceSearch'
  },
  {
    label: 'rename',
    entry: 'vs/editor/contrib/rename/rename'
  },
  {
    label: 'smartSelect',
    entry: 'vs/editor/contrib/smartSelect/smartSelect'
  },
  {
    label: 'snippets',
    entry: 'vs/editor/contrib/snippet/snippetController2'
  },
  {
    label: 'suggest',
    entry: 'vs/editor/contrib/suggest/suggestController'
  },
  {
    label: 'toggleHighContrast',
    entry: 'vs/editor/standalone/browser/toggleHighContrast/toggleHighContrast'
  },
  {
    label: 'toggleTabFocusMode',
    entry: 'vs/editor/contrib/toggleTabFocusMode/toggleTabFocusMode'
  },
  {
    label: 'transpose',
    entry: 'vs/editor/contrib/caretOperations/transpose'
  },
  {
    label: 'unusualLineTerminators',
    entry: 'vs/editor/contrib/unusualLineTerminators/unusualLineTerminators'
  },
  {
    label: 'viewportSemanticTokens',
    entry: 'vs/editor/contrib/viewportSemanticTokens/viewportSemanticTokens'
  },
  {
    label: 'wordHighlighter',
    entry: 'vs/editor/contrib/wordHighlighter/wordHighlighter'
  },
  {
    label: 'wordOperations',
    entry: 'vs/editor/contrib/wordOperations/wordOperations'
  },
  {
    label: 'wordPartOperations',
    entry: 'vs/editor/contrib/wordPartOperations/wordPartOperations'
  }
];

export type EditorFeature = 'accessibilityHelp' | 'anchorSelect' | 'bracketMatching' | 'caretOperations' | 'clipboard' | 'codeAction' | 'codelens' | 'colorDetector' | 'comment' | 'contextmenu' | 'coreCommands' | 'cursorUndo' | 'dnd' | 'find' | 'folding' | 'fontZoom' | 'format' | 'gotoError' | 'gotoLine' | 'gotoSymbol' | 'hover' | 'iPadShowKeyboard' | 'inPlaceReplace' | 'indentation' | 'inspectTokens' | 'linesOperations' | 'links' | 'multicursor' | 'onTypeRename' | 'parameterHints' | 'quickCommand' | 'quickHelp' | 'quickOutline' | 'referenceSearch' | 'rename' | 'smartSelect' | 'snippets' | 'suggest' | 'toggleHighContrast' | 'toggleTabFocusMode' | 'transpose' | 'unusualLineTerminators' | 'viewportSemanticTokens' | 'wordHighlighter' | 'wordOperations' | 'wordPartOperations';

export type NegatedEditorFeature = '!accessibilityHelp' | '!anchorSelect' | '!bracketMatching' | '!caretOperations' | '!clipboard' | '!codeAction' | '!codelens' | '!colorDetector' | '!comment' | '!contextmenu' | '!coreCommands' | '!cursorUndo' | '!dnd' | '!find' | '!folding' | '!fontZoom' | '!format' | '!gotoError' | '!gotoLine' | '!gotoSymbol' | '!hover' | '!iPadShowKeyboard' | '!inPlaceReplace' | '!indentation' | '!inspectTokens' | '!linesOperations' | '!links' | '!multicursor' | '!onTypeRename' | '!parameterHints' | '!quickCommand' | '!quickHelp' | '!quickOutline' | '!referenceSearch' | '!rename' | '!smartSelect' | '!snippets' | '!suggest' | '!toggleHighContrast' | '!toggleTabFocusMode' | '!transpose' | '!unusualLineTerminators' | '!viewportSemanticTokens' | '!wordHighlighter' | '!wordOperations' | '!wordPartOperations';
