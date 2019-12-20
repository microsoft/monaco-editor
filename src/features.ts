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
    label: 'goToDefinitionCommands',
    entry: 'vs/editor/contrib/goToDefinition/goToDefinitionCommands'
  },
  {
    label: 'goToDefinitionMouse',
    entry: 'vs/editor/contrib/goToDefinition/goToDefinitionMouse'
  },
  {
    label: 'gotoError',
    entry: 'vs/editor/contrib/gotoError/gotoError'
  },
  {
    label: 'gotoLine',
    entry: 'vs/editor/standalone/browser/quickOpen/gotoLine'
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
    label: 'parameterHints',
    entry: 'vs/editor/contrib/parameterHints/parameterHints'
  },
  {
    label: 'quickCommand',
    entry: 'vs/editor/standalone/browser/quickOpen/quickCommand'
  },
  {
    label: 'quickOutline',
    entry: 'vs/editor/standalone/browser/quickOpen/quickOutline'
  },
  {
    label: 'referenceSearch',
    entry: [
      'vs/editor/contrib/referenceSearch/referenceSearch',
      'vs/editor/standalone/browser/referenceSearch/standaloneReferenceSearch'
    ]
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

export type EditorFeature = 'accessibilityHelp' | 'bracketMatching' | 'caretOperations' | 'clipboard' | 'codeAction' | 'codelens' | 'colorDetector' | 'comment' | 'contextmenu' | 'coreCommands' | 'cursorUndo' | 'dnd' | 'find' | 'folding' | 'fontZoom' | 'format' | 'goToDefinitionCommands' | 'goToDefinitionMouse' | 'gotoError' | 'gotoLine' | 'hover' | 'iPadShowKeyboard' | 'inPlaceReplace' | 'inspectTokens' | 'linesOperations' | 'links' | 'multicursor' | 'parameterHints' | 'quickCommand' | 'quickOutline' | 'referenceSearch' | 'rename' | 'smartSelect' | 'snippets' | 'suggest' | 'toggleHighContrast' | 'toggleTabFocusMode' | 'transpose' | 'wordHighlighter' | 'wordOperations' | 'wordPartOperations';

export type NegatedEditorFeature = '!accessibilityHelp' | '!bracketMatching' | '!caretOperations' | '!clipboard' | '!codeAction' | '!codelens' | '!colorDetector' | '!comment' | '!contextmenu' | '!coreCommands' | '!cursorUndo' | '!dnd' | '!find' | '!folding' | '!fontZoom' | '!format' | '!goToDefinitionCommands' | '!goToDefinitionMouse' | '!gotoError' | '!gotoLine' | '!hover' | '!iPadShowKeyboard' | '!inPlaceReplace' | '!inspectTokens' | '!linesOperations' | '!links' | '!multicursor' | '!parameterHints' | '!quickCommand' | '!quickOutline' | '!referenceSearch' | '!rename' | '!smartSelect' | '!snippets' | '!suggest' | '!toggleHighContrast' | '!toggleTabFocusMode' | '!transpose' | '!wordHighlighter' | '!wordOperations' | '!wordPartOperations';
