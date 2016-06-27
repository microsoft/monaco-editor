# Monaco CSS

CSS language plugin for the Monaco Editor. It provides the following features when editing CSS, LESS and SCSS files:
* Code completion
* Hovers
* Validation: Syntax errors and linting
* Find definition, references & highlights for symbols in the same file
* Document Symbols

Linting an be configured through the API. See [here](https://github.com/Microsoft/monaco-css/blob/master/src/monaco.d.ts) for the API that the
CSS plugin offers to configure the CSS/LESS/SCSS language support.

Internally the CSS plugin uses the [vscode-css-languageservice](https://github.com/Microsoft/vscode-css-languageservice)
node module, providing the implementation of the functionally listed above. The same module is also used
in [Visual Studio Code](https://github.com/Microsoft/vscode) to power the CSS, LESS and SCSS editing experience.

## Installing

This npm module is bundled and distributed in the [monaco-editor](https://www.npmjs.com/package/monaco-editor) npm module.

## Dev: cheat sheet

* initial setup with `npm install .`
* compile with `npm run watch`
* bundle with `npm run prepublish`

## Dev: Running monaco-css from source

* clone https://github.com/Microsoft/monaco-css in `$/src/monaco-css`
* run `$/src/monaco-css> npm run watch`
* clone https://github.com/Microsoft/monaco-editor in `$/src/monaco-editor`
* run `$/src/monaco-editor> npm run simpleserver`
* open http://localhost:8080/monaco-editor/test/?monaco-css=dev

### [Optional] Running monaco-editor-core from source

* this is only needed when you want to make changes also in `monaco-editor-core`.
* clone https://github.com/Microsoft/vscode in `$/src/vscode/`
* run `$/src/vscode> gulp watch`
* open http://localhost:8080/monaco-editor/test/?monaco-css=dev&editor=dev


## Installing

This npm module is bundled and distributed in the [monaco-editor](https://www.npmjs.com/package/monaco-editor) npm module.

## License
[MIT](https://github.com/Microsoft/monaco-css/blob/master/LICENSE.md)
