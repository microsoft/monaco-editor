# Monaco Editor Change log

## [0.14.3] (17.08.2018)
* Fixes TypeScript/JavaScript coloring of regular expressions https://github.com/Microsoft/monaco-editor/issues/1009

## [0.14.2] (10.08.2018)
* Reverts https://github.com/Microsoft/monaco-editor/pull/981

## [0.14.1] (10.08.2018)
* Fixes Find All References (https://github.com/Microsoft/vscode/issues/56160)

## [0.14.0] (10.08.2018)
### New & Noteworthy
* Using tree-shaking to reduce the amount of shipped code.
* TypeScript and JavaScript coloring is now done with Monarch.
* `typescriptServices` is no longer loaded on the UI thread, this helps with webpack's bundle output size.
* Added coloring for: apex, azcli, clojure, powerquery, rust, scheme and shell.
* Added sub-word navigation commands.
* Added font zoom commands.
* Syntax highlighting for deleted lines in inline diff editor.
* Highlighted indent guide.
* Column selection using middle mouse button.
* Added editor options: `scrollBeyondLastColumn`, `hover`, `suggest`, `highlightActiveIndentGuide`, `showUnused`.
* Added `setTokensProvider` with `EncodedTokensProvider`.
* Added `monaco.languages.getEncodedLanguageId` to get the numeric language id.
* `DefinitionProvider.provideDefinition`, `ImplementationProvider.provideImplementation`, `TypeDefinitionProvider.provideTypeDefinition` can now return a `DefinitionLink`.

### Breaking Changes
* Removed no longer used `Severity`.
* Renamed `IEditor.isFocused` to `IEditor.hasTextFocus`.
* Renamed `ICodeEditor.onDidFocusEditor` to `ICodeEditor.onDidFocusEditorWidget`.
* Renamed `ICodeEditor.onDidBlurEditor` to `ICodeEditor.onDidBlurEditorWidget`.
* `DocumentSymbolProvider.provideDocumentSymbols` must now return `DocumentSymbol[]`.

### Thank you

Contributions to `monaco-editor`:

* [Ali Mirlou (@AliMirlou)](https://github.com/AliMirlou): Fix typo [PR #952](https://github.com/Microsoft/monaco-editor/pull/952)
* [Avelino (@avelino)](https://github.com/avelino): added clojure exampple [PR #904](https://github.com/Microsoft/monaco-editor/pull/904)
* [Sebastián Gurin (@cancerberoSgx)](https://github.com/cancerberoSgx): fix small error in integration docs [PR #957](https://github.com/Microsoft/monaco-editor/pull/957)
* [Haegyun Jung (@haeguri)](https://github.com/haeguri): Fix playground sample option [PR #962](https://github.com/Microsoft/monaco-editor/pull/962)
(https://github.com/Microsoft/monaco-editor/pull/914)
* [Myles Scolnick (@mscolnick)](https://github.com/mscolnick): add sideEffects false for tree-shaking in webpack [PR #981](https://github.com/Microsoft/monaco-editor/pull/981)
* [Niklas Mollenhauer (@nikeee)](https://github.com/nikeee): Fix hash comment in xdot sample [PR #916](https://github.com/Microsoft/monaco-editor/pull/916)
* [Remy Suen (@rcjsuen)](https://github.com/rcjsuen): Add folding provider sample to the playground [PR #878](https://github.com/Microsoft/monaco-

Contributions to `monaco-typescript`:

* [Fathy Boundjadj (@fathyb)](https://github.com/fathyb): Use Mardown code block for hover tooltip [PR #20](https://github.com/Microsoft/monaco-typescript/pull/20)
* [Matt McCutchen (@mattmccutchen)](https://github.com/mattmccutchen): Clear the `file` fields of `relatedInformation` too. (WIP) [PR #21](https://github.com/Microsoft/monaco-typescript/pull/21)

Contributions to `monaco-languages`:

* [Avelino (@avelino)](https://github.com/avelino)
  * upgrade all language support (today) [PR #35](https://github.com/Microsoft/monaco-languages/pull/35)
  * Clojure support [PR #36](https://github.com/Microsoft/monaco-languages/pull/36)
  * Clojure: added more keywords [PR #37](https://github.com/Microsoft/monaco-languages/pull/37)
* [Faris Masad (@masad-frost)](https://github.com/masad-frost)
  * Fix Clojure syntax highlighting [PR #38](https://github.com/Microsoft/monaco-languages/pull/38)
  * Add Scheme language [PR #34](https://github.com/Microsoft/monaco-languages/pull/34)
  * Add auto-indentation for python [PR #33](https://github.com/Microsoft/monaco-languages/pull/33)
* [Matt Masson (@mattmasson)](https://github.com/mattmasson): Add support for Power Query (M) language [PR #42](https://github.com/Microsoft/monaco-languages/pull/42)
* [Oli Lane (@olane)](https://github.com/olane): Add Apex language [PR #44](https://github.com/Microsoft/monaco-languages/pull/44)
* [Viktar Pakanechny (@Vityanchys)](https://github.com/Vityanchys): Added azcli [PR #43](https://github.com/Microsoft/monaco-languages/pull/43)
* [zqlu (@zqlu)](https://github.com/zqlu)
  * Add Shell language [PR #39](https://github.com/Microsoft/monaco-languages/pull/39)
  * Add Perl language [PR #40](https://github.com/Microsoft/monaco-languages/pull/40)
  * add perl to bundle.js [PR #41](https://github.com/Microsoft/monaco-languages/pull/41)

## [0.13.1] (15.05.2018)
 - Fixes [issue #871](https://github.com/Microsoft/monaco-editor/issues/871): TypeScript import error after mocaco-editor upgraded from 0.12 to 0.13

## [0.13.0] (11.05.2018)
### New & Noteworthy
* New folding provider `registerFoldingRangeProvider`.
* You can now specifies the stack order of a decoration by setting `IModelDecorationOptions.zIndex`. A decoration with greater stack order is always in front of a decoration with a lower stack order.
* You can now tell Monaco if there is an `inlineClassName` which affects letter spacing. the stack order of a decoration by setting `IModelDecorationOptions.inlineClassNameAffectsLetterSpacing`.
* Get the text length for a certain line on text model (`ITextModel.getLineLength(lineNumber: number)`)
* New option `codeActionsOnSave`, controls whether code action kinds will be run on save.
* New option `codeActionsOnSaveTimeout`, controls timeout for running code actions on save.
* New option `multiCursorMergeOverlapping`, controls if overlapping selections should be merged. Default to `true`.

### Breaking Change
* Removed `ICodeEditor.getCenteredRangeInViewport`.
* `RenameProvider.resolveRenameLocation` now returns `RenameLocation` instead of `IRange`.

### Thank you
* [Sergey Romanov @Serhioromano](https://github.com/Serhioromano): Add new language Structured Text support [PR monaco-languages#32](https://github.com/Microsoft/monaco-languages/pull/32)
* [Yukai Huang @Yukaii](https://github.com/Yukaii): Fix backspace in IME composition on iOS Safari [PR vscode#40546](https://github.com/Microsoft/vscode/pull/40546)

## [0.12.0] (11.04.2018)
* Special thanks to [Tim Kendrick](https://github.com/timkendrick) for contributing a webpack plugin - `monaco-editor-webpack-plugin` - now available on [npm](https://www.npmjs.com/package/monaco-editor-webpack-plugin).

### Breaking changes
* Introduced `MarkerSeverity` instead of `Severity` for markers serverity.
* Replaced `RenameProvider.resolveInitialRenameValue` with `RenameProvider.resolveRenameLocation`.
* Fixed typo in `monaco-typescript`, renamed `setMaximunWorkerIdleTime` to `setMaximumWorkerIdleTime`.

### Thank you
* [Remy Suen @rcjsuen](https://github.com/rcjsuen): Fix conversion code from MarkedString to IMarkdownString in hovers [PR monaco-css#5](https://github.com/Microsoft/monaco-css/pull/5)
* [Peng Xiao @pengx17](https://github.com/pengx17): fix an issue of `fromMarkdownString` [PR monaco-json#4](https://github.com/Microsoft/monaco-json/pull/4)
* [TJ Kells @systemsoverload](https://github.com/systemsoverload): Add rust colorization support [PR monaco-languages#31](https://github.com/Microsoft/monaco-languages/pull/31)

## [0.11.1] (15.03.2018)
 - Fixes [issue #756](https://github.com/Microsoft/monaco-editor/issues/756): Can't use "Enter" key to accept an IntelliSense item
 - Fixes [issue #757](https://github.com/Microsoft/monaco-editor/issues/757): TypeScript errors in `editor.api.d.ts` typings

## [0.11.0] (14.03.2018)

### New & Noteworthy
* **ESM distribution** (compatible with e.g. webpack).
* New interval tree decorations implementation.
* New piece tree text buffer implementation.
* The minimap can be placed to the left.
* Line numbers can be displayed in an interval.
* The cursor width can be customized.
* Smooth scrolling can be turned on.
* Color decorators and color picker via `DocumentColorProvider`.

### Breaking changes
* Replaced `MarkedString` with `IMarkdownString`. Source code snippets can be expressed using the GH markdown syntax.
* Renamed `IResourceEdit` to `ResourceTextEdit`.

### API changes
* Merged `IModel`, `IReadOnlyModel`, `IEditableTextModel`, `ITextModelWithMarkers`, `ITokenizedModel`, `ITextModelWithDecorations` to `ITextModel`. A type alias for `IModel` is defined for compatibility.
* Merged `ICommonCodeEditor` and `ICodeEditor` to `ICodeEditor`.
* Merged `ICommonDiffEditor` and `IDiffEditor` to `IDiffEditor`.
* `CompletionItem.documentation`, `ParameterInformation.documentation` and `SignatureInformation.documentation` can now be an `IMarkdownString`.
* Added `CompetionItem.command`, `CompletionItem.commitCharacters` and `CompletionItem.additionalTextEdits`.
* Added language configuration `folding` which can define markers for code patterns where a folding regions should be created. See for example the [Python configuration](https://github.com/Microsoft/monaco-languages/blob/d2db3faa76b741bf4ee822c403fc355c913bc46d/src/python/python.ts#L35-L41).
* Added by accident `ResourceFileEdit` (due to how `monaco.d.ts` is generated from vscode). That is not honoured by the editor, and should not be used.

### Thank you
* [Remy Suen @rcjsuen](https://github.com/rcjsuen):
  * Fix a small typo in README.md [PR monaco-typescript#18](https://github.com/Microsoft/monaco-typescript/pull/18)
  * Remove unused IDisposable array [PR monaco-typescript#19](https://github.com/Microsoft/monaco-typescript/pull/19)
  * Add HEALTHCHECK as a Dockerfile keyword [PR monaco-languages#29](https://github.com/Microsoft/monaco-languages/pull/29)
  * Add ARG as a Dockerfile keyword [PR monaco-languages#30](https://github.com/Microsoft/monaco-languages/pull/30)
* [Can Abacigil @abacigil](https://github.com/abacigil): MySQL, Postgres, Redshift and Redis Language Support [PR monaco-languages#26](https://github.com/Microsoft/monaco-languages/pull/26)
* [Matthias Kadenbach @mattes](https://github.com/mattes): Support Content-Security-Policy syntax highlighting [PR monaco-languages#27](https://github.com/Microsoft/monaco-languages/pull/27)
* [e.vakili @evakili](https://github.com/evakili): Whitespaces after # are allowed in C++ preprocessor statements [PR monaco-languages#28](https://github.com/Microsoft/monaco-languages/pull/28)
* [Pankaj Kumar Gautam @PAPERPANKS](https://github.com/PAPERPANKS): adding microsoft logo to footer [PR monaco-editor#577](https://github.com/Microsoft/monaco-editor/pull/577)
* [Dominik Moritz @domoritz](https://github.com/domoritz): Fix code in changelog [PR monaco-editor#582](https://github.com/Microsoft/monaco-editor/pull/582)
* [ItsPugle @ItsPugle](https://github.com/ItsPugle): Updating the footer to reflect change of year [PR monaco-editor#707](https://github.com/Microsoft/monaco-editor/pull/707)
* [Michael Seifert @MSeifert04](https://github.com/MSeifert04): Add linebreak for if  [PR monaco-editor#726](https://github.com/Microsoft/monaco-editor/pull/726)
* [Andrew Palm @apalm](https://github.com/apalm): Fix 'Configure JSON defaults' sample [PR monaco-editor#731](https://github.com/Microsoft/monaco-editor/pull/731)
* [Niklas Mollenhauer @nikeee](https://github.com/nikeee): Fix line number API usage [PR monaco-editor#740](https://github.com/Microsoft/monaco-editor/pull/740)
* [Andre @anc](https://github.com/anc): More realistic terminal shell [PR monaco-editor#742](https://github.com/Microsoft/monaco-editor/pull/742)
* to the many others that have contributed PRs to [vscode](https://github.com/Microsoft/vscode) which have also made their way into the monaco-editor.


## [0.10.1] (16.10.2017)
 - Fixes [issue #601](https://github.com/Microsoft/monaco-editor/issues/601): window.opener should be set to null to protect against malicious code

## [0.10.0] (17.08.2017)

### Breaking changes
* Removed `CodeAction`.
* Method `provideCodeActions` in `CodeActionProvider` now returns `Command[] | Thenable<Command[]>` instead of `CodeAction[] | Thenable<CodeAction[]>`, which is already removed.

### API changes
* added `monaco.editor.getModelMarkers`. Get markers for owner and/or resource.

### Notable Fixes
* No longer use CSS class `.row` for command palette to avoid CSS conflicts with Bootstrap.
* Fix Accessibility Help Dialog accessible issue on IE/Edge.
* Fix Find Widget CSS compability issues with IE11.
* Toggle Block Comment can remove extra whitespaces.

### Thank you
* [Kitson Kelly @kitsonk](https://github.com/kitsonk): Update monaco-typescript to TypeScript 2.4.1 [PR monaco-typescript#15](https://github.com/Microsoft/monaco-typescript/pull/15)
* [@duncanwerner](https://github.com/duncanwerner): Add hex number tokenization to R language [PR monaco-languages#21](https://github.com/Microsoft/monaco-languages/pull/21)
* [Remy Suen @rcjsuen](https://github.com/rcjsuen): Update Dockerfile grammar with STOPSIGNAL and SHELL instructions [PR monaco-languages#22](https://github.com/Microsoft/monaco-languages/pull/22)
* [Marlene Cota @marlenecota](https://github.com/marlenecota): Add Small Basic support [PR monaco-languages#23](https://github.com/Microsoft/monaco-languages/pull/23)
* [Ben Jacobson @bjacobso](https://github.com/bjacobso): Add LIMIT to sql keywords [PR monaco-languages#24](https://github.com/Microsoft/monaco-languages/pull/24)
* to the many others that have contributed PRs to [vscode](https://github.com/Microsoft/vscode) which have also made their way into the monaco-editor.

## [0.9.0] (03.07.2017)

### New & Noteworthy
 * Minimap (on by default, use `editor.minimap` to disable it).
 * Drag and Drop (on by default, use `editor.dragAndDrop` to disable it).
 * Copy text with formatting.

### Accessibility
 * There is a new [guide for making the editor accessible to all](https://github.com/Microsoft/monaco-editor/wiki/Accessibility-Guide-for-Integrators).
 * There is a new Alt+F1 (Ctrl+F1 in IE) accessibility help panel.
 * There is a new F8/Shift+F8 diff review panel in the diff editor.
 * Many bugfixes, including now respecting the Windows High Contrast Theme on Edge.

### Breaking changes

* A lot has changed w.r.t. how themes work in the editor, mostly driven by the work to support theming in VS Code. `editor.updateOptions()` **no longer accepts `theme`**; the theme can be changed via the newly introduced `monaco.editor.setTheme()`. Additionally, we recommend editor colors be customized via `monaco.editor.defineTheme()` instead of via CSS -- see [sample](https://microsoft.github.io/monaco-editor/playground.html#customizing-the-appearence-exposed-colors). The color names will be stable, while the CSS class names might break at any time.
* Support for the internal snippet syntax **has been discontinued** and snippet must now use the official, TextMate-like syntax. Find its grammar and samples [here](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_snippet-syntax).
* Changed `IModel.findMatches` to accept a list of word separators.
* Changed the shape of the `IModelContentChangedEvent` emitted via `IModel.onDidChangeContent` to **now contain a batch** of all the changes that the model had.
* No longer using `transform: translate3d`, now using `will-change: transform` for browser layer hinting. Use the `disableLayerHinting` option if you have any trouble with browser layers (bluriness or high GPU memory usage).
* Simplified wrapping settings: `wordWrap`, `wordWrapColumn` and `wordWrapMinified`.

### API changes

* added `monaco.languages.registerTypeDefinitionProvider`.
* new editor options:
  * `accessibilityHelpUrl` - the url of a page to open for documentation about how to operate the editor when using a Screen Reader.
   * `find.seedSearchStringFromSelection` - Ctrl+F/Cmd+F seeds search string from the editor selection.
   * `find.autoFindInSelection` - Ctrl+F/Cmd+F turns on the find in selection toggle if the editor selection is multiline.
   * `minimap.enabled` - enable minimap.
   * `minimap.showSlider` - control when to render the minimap slider.
   * `minimap.renderCharacters` - render characters or blocks in the minimap.
   * `minimap.maxColumn` - maximum number of columns the minimap shows.
   * `overviewRulerBorder` - toggle that the overview ruler renders a border.
   * `links` - enable link detection.
   * `multiCursorModifier` - change the multi cursor modifier key.
   * `accessibilitySupport` - optimize the editor for use with a Screen Reader.
   * `autoIndent` - automatically fix indentation when moving lines, pasting or typing.
   * `dragAndDrop` - dragging and dropping editor selection within the editor.
   * `occurrencesHighlight` - enable highlighting of occurences.
   * `showFoldingControls` - fine-tune when the folding icons should show
   * `matchBrackets` - enable bracket matching
   * `letterSpacing` - configure font's letter-spacing.

### Thank you
 * [Joey Marianer (@jmarianer)](https://github.com/jmarianer): Support literal interpolated strings ($@"") [PR monaco-languages#13](https://github.com/Microsoft/monaco-languages/pull/13)
 * [@AndersMad](https://github.com/AndersMad): HTML Tags: Add support for dash and fix colon in end tag [PR monaco-languages#14](https://github.com/Microsoft/monaco-languages/pull/14)
 * [Sandy Armstrong (@sandyarmstrong)](https://github.com/sandyarmstrong): csharp: add support for binary literals and _ as separator [PR monaco-languages#16](https://github.com/Microsoft/monaco-languages/pull/16)
 * [Anton Kosyakov (@akosyakov)](https://github.com/akosyakov): Include src as a part of npm package [PR monaco-languages#17](https://github.com/Microsoft/monaco-languages/pull/17)
 * [Andrew Bonventre (@andybons)](https://github.com/andybons): Fix typo: concering → concerning [PR monaco-languages#18](https://github.com/Microsoft/monaco-languages/pull/18)
 * [Scott McMaster (@scottmcmaster)](https://github.com/scottmcmaster): MSDAX support [PR monaco-languages#19](https://github.com/Microsoft/monaco-languages/pull/19)
 * [Luzian Serafin (@lserafin)](https://github.com/lserafin): Add Solidity [PR monaco-languages#20](https://github.com/Microsoft/monaco-languages/pull/20)
 * [Kitson Kelly (@kitsonk)](https://github.com/kitsonk): Update to TypeScript 2.3.4 [PR monaco-typescript#13](https://github.com/Microsoft/monaco-typescript/pull/13)
 * [Kitson Kelly (@kitsonk)](https://github.com/kitsonk): Add documentation support on hover [PR monaco-typescript#14](https://github.com/Microsoft/monaco-typescript/pull/14)
 * [@replacepreg](https://github.com/replacepreg): Updating date at footer [PR monaco-editor#409](https://github.com/Microsoft/monaco-editor/pull/409)
 * [Aarin Smith (@aarinsmith)](https://github.com/aarinsmith): Fixed spelling error in README.md:85 'instantion' -> 'instantiation' [PR monaco-editor#440](https://github.com/Microsoft/monaco-editor/pull/440)
 * to the many others that have contributed PRs to [`vscode`](https://github.com/Microsoft/vscode) which have also made their way into the `monaco-editor`.

---

## [0.8.3] (03.03.2017)
 - Fixes an issue in monaco-typescript where it would attempt to validate a disposed model.

---

## [0.8.2] (01.03.2017)
 - Fixes the following regressions:
   - [issue #385](https://github.com/Microsoft/monaco-editor/issues/385): Cannot add action to the left-hand-side of the diff editor
   - [issue #386](https://github.com/Microsoft/monaco-editor/issues/386): Shortcuts for actions added via editor.addAction don't show up in the Command Palette
   - [issue #387](https://github.com/Microsoft/monaco-editor/issues/387): Cannot change diff editor to a custom theme based on high contrast

---

## [0.8.1] (27.01.2017)
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
 - **Breaking change**: renamed `registerTypeDefinitionProvider` to `registerImplementationProvider` and associated types.

---

## [0.8.0] (18.01.2017)
 - This release has been brewing for a while and comes with quite a number of important changes.
 - There are many bugfixes and speed/memory usage improvements.
 - Now shipping TypeScript v2.1.5 in `monaco-typescript` (JS and TS language support).

### No longer supporting IE9 and IE10
 - we have not made the editor fail on purpose in these browsers, but we have removed IE9/IE10 targeted workarounds from our codebase;
 - now using **Typed Arrays** in a number of key places resulting in considerable speed boosts and lower memory consumption.

### Monarch Tokenizer
 - Monarch states are now memoized up to a depth of 5. This results in considerable memory improvements for files with many lines.
 - Speed improvements to Monarch tokenizer that resulted in one **breaking change**:
 - when entering an embedded mode (i.e. `nextEmbedded`), the state ending up in must immediately contain a `nextEmbedded: "@pop"` rule. This helps in quickly figuring out where the embedded mode should be left. The editor will throw an error if the Monarch grammar does not respect this condition.

### Tokens are styled in JS (not in CSS anymore)
 - This is a **breaking change**
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

---

## [0.7.1] (07.10.2016)
 - Bugfixes in monaco-html, including fixing formatting.

---

## [0.7.0] (07.10.2016)
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

---

## [0.6.1] (06.09.2016)
 - Fixed regression where `editor.addCommand` was no longer working.

---

## [0.6.0] (05.09.2016)
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

---

## [0.5.1] (24.06.2016)

- Fixed mouse handling in IE

---

## [0.5.0] (24.06.2016)

### Breaking changes
- `monaco.editor.createWebWorker` now loads the AMD module and calls `create` and passes in as first argument a context of type `monaco.worker.IWorkerContext` and as second argument the `initData`. This **breaking change** was needed to allow handling the case of misconfigured web workers (running on a file protocol or the cross-domain case)
- the `CodeActionProvider.provideCodeActions` now gets passed in a `CodeActionContext` that contains the markers at the relevant range.
- the `hoverMessage` of a decoration is now a `MarkedString | MarkedString[]`
- the `contents` of a `Hover` returned by a `HoverProvider` is now a `MarkedString | MarkedString[]`
- removed deprecated `IEditor.onDidChangeModelRawContent`, `IModel.onDidChangeRawContent`

### Notable fixes
- Broken configurations (loading from `file://` or misconfigured cross-domain loading) now load the web worker code in the UI thread. This caused a **breaking change** in the behaviour of `monaco.editor.createWebWorker`
- The right-pointing mouse pointer is oversized in high DPI - [issue](https://github.com/Microsoft/monaco-editor/issues/5)
- The editor functions now correctly when hosted inside a `position:fixed` element.
- Cross origin configuration is now picked up (as advertised in documentation from MonacoEnvironment)

[0.14.3]: https://github.com/Microsoft/monaco-editor/compare/v0.14.2...v0.14.3
[0.14.2]: https://github.com/Microsoft/monaco-editor/compare/v0.14.1...v0.14.2
[0.14.1]: https://github.com/Microsoft/monaco-editor/compare/v0.14.0...v0.14.1
[0.14.0]: https://github.com/Microsoft/monaco-editor/compare/v0.13.1...v0.14.0
[0.13.1]: https://github.com/Microsoft/monaco-editor/compare/v0.13.0...v0.13.1
[0.13.0]: https://github.com/Microsoft/monaco-editor/compare/v0.12.0...v0.13.0
[0.12.0]: https://github.com/Microsoft/monaco-editor/compare/v0.11.1...v0.12.0
[0.11.1]: https://github.com/Microsoft/monaco-editor/compare/v0.11.0...v0.11.1
[0.11.0]: https://github.com/Microsoft/monaco-editor/compare/v0.10.1...v0.11.0
[0.10.1]: https://github.com/Microsoft/monaco-editor/compare/v0.10.0...v0.10.1
[0.10.0]: https://github.com/Microsoft/monaco-editor/compare/v0.9.0...v0.10.0
[0.9.0]: https://github.com/Microsoft/monaco-editor/compare/v0.8.3...v0.9.0
[0.8.3]: https://github.com/Microsoft/monaco-editor/compare/v0.8.2...v0.8.3
[0.8.2]: https://github.com/Microsoft/monaco-editor/compare/v0.8.1...v0.8.2
[0.8.1]: https://github.com/Microsoft/monaco-editor/compare/v0.8.0...v0.8.1
[0.6.1]: https://github.com/Microsoft/monaco-editor/compare/v0.6.0...v0.6.1
[0.6.0]: https://github.com/Microsoft/monaco-editor/compare/v0.5.1...v0.6.0
[0.5.1]: https://github.com/Microsoft/monaco-editor/compare/v0.5.0...v0.5.1
