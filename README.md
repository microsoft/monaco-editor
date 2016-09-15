# Monaco HTML

HTML language plugin for the Monaco Editor. It provides the following features when editing HTML files:
* Code completion
* Formatting
* Document Highlights
* Link detection
* Syntax highlighting

Internally the HTML plugin uses the [vscode-html-languageservice](https://github.com/Microsoft/vscode-html-languageservice)
node module, providing the implementation of the functionally listed above. The same module is also used
in [Visual Studio Code](https://github.com/Microsoft/vscode) to power the HTML editing experience.

## Issues

Please file issues concering `monaco-html` in the [`monaco-editor`-repository](https://github.com/Microsoft/monaco-editor/issues).

## Installing

This npm module is bundled and distributed in the [monaco-editor](https://www.npmjs.com/package/monaco-editor) npm module.

* change to your favorite source folder (`/src/`)
* `git clone https://github.com/Microsoft/monaco-editor` (this will create `$/src/monaco-editor`)
* in folder `monaco-editor` run `npm install` and run `npm run simpleserver`
* open http://localhost:8080/monaco-editor/test/index.html#sample - html

## Development

### Dev: Running monaco-html from source
* change to your favorite source folder (`/src/`).
* if you haven't done so: `git clone https://github.com/Microsoft/monaco-editor` (this will create `$/src/monaco-editor`)
* `git clone https://github.com/Microsoft/monaco-html` (this will create `$/src/monaco-html`)
* Important: both monaco repositories must have the same parent folder.
* in folder `monaco-html` run `npm install` and run `npm run watch`
* in folder `monaco-editor` run `npm install` and run `npm run simpleserver`
* open http://localhost:8080/monaco-editor/test/?monaco-html=dev

### [Optional] Running monaco-editor-core from source

* this is only needed when you want to make changes also in `monaco-editor-core`.
* change to the same favorite source folder (`/src/`) that already contains `monaco-html` and `monaco-editor`
* `git clone https://github.com/Microsoft/vscode` (this will create `$/src/vscode/`)
* read [here](https://github.com/Microsoft/vscode/wiki/How-to-Contribute#installing-prerequisites) on how to initialize the VS Code source repository.
* in folder `vscode` run `gulp watch`
* open http://localhost:8080/monaco-editor/test/?monaco-html=dev&editor=dev

## License
[MIT](https://github.com/Microsoft/monaco-html/blob/master/LICENSE.md)
