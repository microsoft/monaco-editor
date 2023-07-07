
/*!----------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *----------------------------------------------------------------*/

export interface IWorkerDefinition {
	id: string;
	entry: string;
}

export interface IFeatureDefinition {
	label: string;
	entry: string | string[] | undefined;
	worker?: IWorkerDefinition;
}

export const features: IFeatureDefinition[];

export const languages: IFeatureDefinition[];

export type EditorLanguage = 'abap' | 'apex' | 'azcli' | 'bat' | 'bicep' | 'cameligo' | 'clojure' | 'coffee' | 'cpp' | 'csharp' | 'csp' | 'css' | 'cypher' | 'dart' | 'dockerfile' | 'ecl' | 'elixir' | 'flow9' | 'freemarker2' | 'fsharp' | 'go' | 'graphql' | 'handlebars' | 'hcl' | 'html' | 'ini' | 'java' | 'javascript' | 'json' | 'julia' | 'kotlin' | 'less' | 'lexon' | 'liquid' | 'lua' | 'm3' | 'markdown' | 'mips' | 'msdax' | 'mysql' | 'objective-c' | 'pascal' | 'pascaligo' | 'perl' | 'pgsql' | 'php' | 'pla' | 'postiats' | 'powerquery' | 'powershell' | 'protobuf' | 'pug' | 'python' | 'qsharp' | 'r' | 'razor' | 'redis' | 'redshift' | 'restructuredtext' | 'ruby' | 'rust' | 'sb' | 'scala' | 'scheme' | 'scss' | 'shell' | 'solidity' | 'sophia' | 'sparql' | 'sql' | 'st' | 'swift' | 'systemverilog' | 'tcl' | 'twig' | 'typescript' | 'vb' | 'wgsl' | 'xml' | 'yaml';

export type EditorFeature = 'anchorSelect' | 'bracketMatching' | 'browser' | 'caretOperations' | 'clipboard' | 'codeAction' | 'codelens' | 'colorPicker' | 'comment' | 'contextmenu' | 'cursorUndo' | 'dnd' | 'documentSymbols' | 'dropOrPasteInto' | 'find' | 'folding' | 'fontZoom' | 'format' | 'gotoError' | 'gotoLine' | 'gotoSymbol' | 'hover' | 'iPadShowKeyboard' | 'inPlaceReplace' | 'indentation' | 'inlayHints' | 'inlineCompletions' | 'inlineProgress' | 'inspectTokens' | 'lineSelection' | 'linesOperations' | 'linkedEditing' | 'links' | 'longLinesHelper' | 'multicursor' | 'parameterHints' | 'quickCommand' | 'quickHelp' | 'quickOutline' | 'readOnlyMessage' | 'referenceSearch' | 'rename' | 'semanticTokens' | 'smartSelect' | 'snippet' | 'stickyScroll' | 'suggest' | 'toggleHighContrast' | 'toggleTabFocusMode' | 'tokenization' | 'unicodeHighlighter' | 'unusualLineTerminators' | 'wordHighlighter' | 'wordOperations' | 'wordPartOperations';

export type NegatedEditorFeature = '!anchorSelect' | '!bracketMatching' | '!browser' | '!caretOperations' | '!clipboard' | '!codeAction' | '!codelens' | '!colorPicker' | '!comment' | '!contextmenu' | '!cursorUndo' | '!dnd' | '!documentSymbols' | '!dropOrPasteInto' | '!find' | '!folding' | '!fontZoom' | '!format' | '!gotoError' | '!gotoLine' | '!gotoSymbol' | '!hover' | '!iPadShowKeyboard' | '!inPlaceReplace' | '!indentation' | '!inlayHints' | '!inlineCompletions' | '!inlineProgress' | '!inspectTokens' | '!lineSelection' | '!linesOperations' | '!linkedEditing' | '!links' | '!longLinesHelper' | '!multicursor' | '!parameterHints' | '!quickCommand' | '!quickHelp' | '!quickOutline' | '!readOnlyMessage' | '!referenceSearch' | '!rename' | '!semanticTokens' | '!smartSelect' | '!snippet' | '!stickyScroll' | '!suggest' | '!toggleHighContrast' | '!toggleTabFocusMode' | '!tokenization' | '!unicodeHighlighter' | '!unusualLineTerminators' | '!wordHighlighter' | '!wordOperations' | '!wordPartOperations';

