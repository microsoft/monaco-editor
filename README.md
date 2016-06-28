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

* change to your favorite source folder (`/src/`)
* `git clone https://github.com/Microsoft/monaco-editor` (this will create `$/src/monaco-editor`)
* in folder `monaco-editor` run `npm install` and run `npm run simpleserver`
* open [http://localhost:8080/monaco-editor/test/index.html#sample - css](http://localhost:8080/monaco-editor/test/index.html#sample - css)

## Development

### Dev: Running monaco-css from source
* change to your favorite source folder (`/src/`).
* if you haven't done so: `git clone https://github.com/Microsoft/monaco-editor` (this will create `$/src/monaco-editor`)
* `git clone https://github.com/Microsoft/monaco-cs` (this will create `$/src/monaco-css`)
* Important: both monaco repositories must have the same parent folder.
* in folder `monaco-css` run `npm install` and run `npm run watch`
* in folder `monaco-editor` run `npm install` and run `npm run simpleserver`
* open [http://localhost:8080/monaco-editor/test/?monaco-css=dev](http://localhost:8080/monaco-editor/test/?monaco-css=dev)

### [Optional] Running monaco-editor-core from source

* this is only needed when you want to make changes also in `monaco-editor-core`.
* change to the same favorite source folder (`/src/`) that already contains `monaco-css` and `monaco-editor`
* `git clone https://github.com/Microsoft/vscode` (this will create `$/src/vscode/`)
* Important: the vscode and the monaco repositories must have the same parent folder.
* read [here](https://github.com/Microsoft/vscode/wiki/How-to-Contribute#installing-prerequisites) on how to initialize the VS code source repository.
* in folder `vscode` run `gulp watch`
* open [http://localhost:8080/monaco-editor/test/?monaco-css=dev&editor=dev](http://localhost:8080/monaco-editor/test/?monaco-css=dev&editor=dev)

## License
[MIT](https://github.com/Microsoft/monaco-css/blob/master/LICENSE.md)