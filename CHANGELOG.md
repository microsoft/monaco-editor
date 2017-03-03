# Monaco Editor Change log

## [0.8.3]
 - Fixes an issue in monaco-typescript where it would attempt to validate a disposed model.

## [0.8.2]
 - Fixes the following regressions:
   - [issue #385](https://github.com/Microsoft/monaco-editor/issues/385): Cannot add action to the left-hand-side of the diff editor
   - [issue #386](https://github.com/Microsoft/monaco-editor/issues/386): Shortcuts for actions added via editor.addAction don't show up in the Command Palette
   - [issue #387](https://github.com/Microsoft/monaco-editor/issues/387): Cannot change diff editor to a custom theme based on high contrast

## [0.8.1]
 - CSS/JSON/HTML language supports updated:
   - CSS: Support for @apply
   - SCSS: Map support
   - New HTML formatter options: unformatedContent, wrapAttributes
 - Fixed issue where the editor was throwing in Safari due to `Intl` missing.
 - Fixed multiple issues where the editor would not position the cursor correctly when using browser zooming.

### API
 - Added `disableMonospaceOptimizations` editor option that can be used in case browser zooming exposes additional issues.
 - Added `formatOnPaste` editor option.
 - Added `IActionDescriptor.precondition`.
 - Breaking change: renamed `registerTypeDefinitionProvider` to `registerImplementationProvider` and associated types.

## [0.8.0]
 - This release has been brewing for a while and comes with quite a number of important changes.
 - There are many bugfixes and speed/memory usage improvements.
 - Now shipping TypeScript v2.1.5 in `monaco-typescript` (JS and TS language support).

### No longer supporting IE9 and IE10
 - we have not made the editor fail on purpose in these browsers, but we have removed IE9/IE10 targeted workarounds from our codebase;
 - now using **Typed Arrays** in a number of key places resulting in considerable speed boosts and lower memory consumption.

### Monarch Tokenizer
 - Monarch states are now memoized up to a depth of 5. This results in considerable memory improvements for files with many lines.
 - Speed improvements to Monarch tokenizer that resulted in one breaking change:
 - when entering an embedded mode (i.e. `nextEmbedded`), the state ending up in must immediately contain a `nextEmbedded: "@pop"` rule. This helps in quickly figuring out where the embedded mode should be left. The editor will throw an error if the Monarch grammar does not respect this condition.

### Tokens are styled in JS (not in CSS anymore)
 - This is a breaking change
 - Before, token types would be rendered on the `span` node of text, and CSS rules would match token types and assign styling to them (i.e. color, boldness, etc.to style tokens)
 - To enable us to build something like a minimap, we need to know the text color in JavaScript, and we have therefore moved the token style matching all to JavaScript. In the future, we foresee that even decorations will have to define their color in JavaScript.
 - It is possible to create a custom theme via a new API method `monaco.editor.defineTheme()` and the playground contains a sample showing how that works.
 - Token types can be inspected via `F1` > `Developer: Inspect tokens`. This will bring up a widget showing the token type and the applied styles.

### API changes:

#### Namespaces
 - added `monaco.editor.onDidCreateEditor` that will be fired whenever an editor is created (will fire even for a diff editor, with the two editors that a diff editor consists of).
 - added `monaco.editor.tokenize` that returns logical tokens (before theme matching, as opposed to `monaco.editor.colorize`).
 - added `monaco.languages.registerTypeDefinitionProvider`

#### Models
 - removed `IModel.getMode()`.
 - structural changes in the events `IModelLanguageChangedEvent`, `IModelDecorationsChangedEvent` and `IModelTokensChangedEvent`;
 - changed `IModel.findMatches`, `IModel.findNextMatch` and `IModel.findPreviousMatch` to be able to capture matches while searching.

#### Editors
 - `ICodeEditor.addAction` and  `IDiffEditor.addAction` now return an `IDisposable` to be able to remove a previously added action.
 - renamed `ICodeEditor.onDidChangeModelMode ` to `ICodeEditor.onDidChangeModelLanguage`;
 - `ICodeEditor.executeEdits` can now take resulting selection for better undo/redo stack management;
 - added `ICodeEditor.getTargetAtClientPoint(clientX, clientY)` to be able to do hit testing.
 - added `IViewZone.marginDomNode` to be able to insert a dom node in the margin side of a view zone.
 - settings:
    - `lineDecorationsWidth` can now take a value in the form of `"1.2ch"` besides the previous accepted number (in px)
    - `renderLineHighlight` can now take a value in the set `'none' | 'gutter' | 'line' | 'all'`.
    - added `fixedOverflowWidgets` to render overflowing content widgets as `'fixed'` (defaults to false)
    - added `acceptSuggestionOnCommitCharacter` to accept suggestions on provider defined characters (defaults to true)
    - added `emptySelectionClipboard` - copying without a selection copies the current line (defaults to true)
    - added `suggestFontSize` - the font size for the suggest widget
    - added `suggestLineHeight` - the line height for the suggest widget
 - diff editor settings:
    - added `renderIndicators` - Render +/- indicators for added/deleted changes. (defaults to true)

### Thank you
 * [Nico Tonozzi (@nicot)](https://github.com/nicot): Register React file extensions [PR monaco-typescript#12](https://github.com/Microsoft/monaco-typescript/pull/12)
 * [Jeong Woo Chang (@inspiredjw)](https://github.com/inspiredjw): Cannot read property 'uri' of null fix [PR vscode#13263](https://github.com/Microsoft/vscode/pull/13263)
 * [Jan Pilzer(@Hirse)](https://github.com/Hirse): Add YAML samples [PR monaco-editor#242](https://github.com/Microsoft/monaco-editor/pull/242)

## [0.7.1]
 - Bugfixes in monaco-html, including fixing formatting.

## [0.7.0]
 - Adopted TypeScript 2.0 in all the repos (also reflected in `monaco.d.ts`).
 - Added YAML colorization support.
 - Brought back the ability to use `editor.addAction()` and have the action show in the context menu.
 - Web workers now get a nice label next to the script name.

### API changes:
  - settings:
    - new values for `lineNumbers`: `'on' | 'off' | 'relative'`
    - new values for `renderWhitespace`: `'none' | 'boundary' | 'all'`
  - removed `model.setMode()`, as `IMode` will soon disappear from the API.

### Debt work
  - Removed html, razor, php and handlebars from `monaco-editor-core`:
    - the `monaco-editor-core` is now finally language agnostic.
    - coloring for html, razor, php and handlebars is now coming in from `monaco-languages`.
    - language smarts for html, razor and handlebars now comes from `monaco-html`.
  - Packaging improvements:
    - thanks to the removal of the old languages from `monaco-editor-core`, we could improve the bundling and reduce the number of .js files we ship.
    - we are thinking about simplifying this further in the upcoming releases.

### Thank you
  * [Sandy Armstrong (@sandyarmstrong)](https://github.com/sandyarmstrong): csharp: allow styling #r/#load [PR monaco-languages#9](https://github.com/Microsoft/monaco-languages/pull/9)
  * [Nico Tonozzi (@nicot)](https://github.com/nicot): Go: add raw string literal syntax [PR monaco-languages#10](https://github.com/Microsoft/monaco-languages/pull/10)
  * [Jason Killian (@JKillian)](https://github.com/JKillian): Add vmin and vmax CSS units [PR monaco-languages#11](https://github.com/Microsoft/monaco-languages/pull/11)
  * [Jan Pilzer (@Hirse)](https://github.com/Hirse): YAML colorization [PR monaco-languages#12](https://github.com/Microsoft/monaco-languages/pull/12)
  * [Sam El-Husseini (@microsoftsam)](https://github.com/microsoftsam): Using Cmd+Scroll to zoom on a mac [PR vscode#12477](https://github.com/Microsoft/vscode/pull/12477)


## [0.6.1]
 - Fixed regression where `editor.addCommand` was no longer working.

## [0.6.0]
- This will be the last release that contains specific IE9 and IE10 fixes/workarounds. We will begin cleaning our code-base and remove them.
- We plan to adopt TypeScript 2.0, so this will be the last release where `monaco.d.ts` is generated by TypeScript 1.8.
- `javascript` and `typescript` language services:
  - exposed API to get to the underlying language service.
  - fixed a bug that prevented modifying `extraLibs`.
- Multiple improvements/bugfixes to the `css`, `less`, `scss` and `json` language services.
- Added support for ATS/Postiats.

### API changes:
  - settings:
    - new: `mouseWheelZoom`, `wordWrap`, `snippetSuggestions`, `tabCompletion`, `wordBasedSuggestions`, `renderControlCharacters`, `renderLineHighlight`, `fontWeight`.
    - removed: `tabFocusMode`, `outlineMarkers`.
    - renamed: `indentGuides` -> `renderIndentGuides`, `referenceInfos` -> `codeLens`
  - added `editor.pushUndoStop()` to explicitly push an undo stop
  - added `suppressMouseDown` to `IContentWidget`
  - added optional `resolveLink` to `ILinkProvider`
  - removed `enablement`, `contextMenuGroupId` from `IActionDescriptor`
  - removed exposed constants for editor context keys.

### Notable bugfixes:
  - Icons missing in the find widget in IE11 [#148](https://github.com/Microsoft/monaco-editor/issues/148)
  - Multiple context menu issues
  - Multiple clicking issues in IE11/Edge ([#137](https://github.com/Microsoft/monaco-editor/issues/137), [#118](https://github.com/Microsoft/monaco-editor/issues/118))
  - Multiple issues with the high-contrast theme.
  - Multiple IME issues in IE11, Edge and Firefox.

### Thank you
  * [Pavel Kolev (@paveldk)](https://github.com/paveldk): Fix sending message to terminated worker [PR vscode#10833](https://github.com/Microsoft/vscode/pull/10833)
  * [Pavel Kolev (@paveldk)](https://github.com/paveldk): Export getTypeScriptWorker & getJavaScriptWorker to monaco.languages.typescript [PR monaco-typescript#8](https://github.com/Microsoft/monaco-typescript/pull/8)
  * [Sandy Armstrong (@sandyarmstrong)](https://github.com/sandyarmstrong): Support CompletionItemKind.Method. [PR vscode#10225](https://github.com/Microsoft/vscode/pull/10225)
  * [Sandy Armstrong (@sandyarmstrong)](https://github.com/sandyarmstrong): Fix show in IE11 [PR vscode#10309](https://github.com/Microsoft/vscode/pull/10309)
  * [Sandy Armstrong (@sandyarmstrong)](https://github.com/sandyarmstrong): Correct docs for IEditorScrollbarOptions.useShadows [PR vscode#11312](https://github.com/Microsoft/vscode/pull/11312)
  * [Artyom Shalkhakov (@ashalkhakov)](https://github.com/ashalkhakov): Adding support for ATS/Postiats [PR monaco-languages#5](https://github.com/Microsoft/monaco-languages/pull/5)

## [0.5.1]

- Fixed mouse handling in IE

## [0.5.0]

### Breaking changes
- `monaco.editor.createWebWorker` now loads the AMD module and calls `create` and passes in as first argument a context of type `monaco.worker.IWorkerContext` and as second argument the `initData`. This breaking change was needed to allow handling the case of misconfigured web workers (running on a file protocol or the cross-domain case)
- the `CodeActionProvider.provideCodeActions` now gets passed in a `CodeActionContext` that contains the markers at the relevant range.
- the `hoverMessage` of a decoration is now a `MarkedString | MarkedString[]`
- the `contents` of a `Hover` returned by a `HoverProvider` is now a `MarkedString | MarkedString[]`
- removed deprecated `IEditor.onDidChangeModelRawContent`, `IModel.onDidChangeRawContent`

### Notable fixes
- Broken configurations (loading from `file://` or misconfigured cross-domain loading) now load the web worker code in the UI thread. This caused a breaking change in the behaviour of `monaco.editor.createWebWorker`
- The right-pointing mouse pointer is oversized in high DPI - [issue](https://github.com/Microsoft/monaco-editor/issues/5)
- The editor functions now correctly when hosted inside a `position:fixed` element.
- Cross origin configuration is now picked up (as advertised in documentation from MonacoEnvironment)
