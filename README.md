# Monaco JSON

JSON language plugin for the Monaco Editor. It provides the following features when editing JSON files:
* Code completion, based on JSON schemas or by looking at similar objects in the same file
* Hovers, based on JSON schemas
* Validation: Syntax errors and schema validation
* Formatting
* Document Symbols
* Syntax highlighting

Schemas can be provided by configuration. See [here](https://github.com/Microsoft/monaco-json/blob/master/src/monaco.d.ts)
for the API that the JSON plugin offers to configure the JSON language support.

Internally the JSON plugin uses the [vscode-json-languageservice](https://github.com/Microsoft/vscode-json-languageservice)
node module, providing the implementation of the functionally listed above. The same module is also used
in [Visual Studio Code](https://github.com/Microsoft/vscode) to power the JSON editing experience.

## Issues

Please file issues concering `monaco-json` in the [`monaco-editor`-repository](https://github.com/Microsoft/monaco-editor/issues).

## Installing

This npm module is bundled and distributed in the [monaco-editor](https://www.npmjs.com/package/monaco-editor) npm module.

* change to your favorite source folder (`/src/`)
* `git clone https://github.com/Microsoft/monaco-editor` (this will create `$/src/monaco-editor`)
* in folder `monaco-editor` run `npm install` and run `npm run simpleserver`
* open http://localhost:8080/monaco-editor/test/index.html#sample - json

## Development

### Dev: Running monaco-json from source
* change to your favorite source folder (`/src/`).
* if you haven't done so: `git clone https://github.com/Microsoft/monaco-editor` (this will create `$/src/monaco-editor`)
* `git clone https://github.com/Microsoft/monaco-json` (this will create `$/src/monaco-json`)
* Important: both monaco repositories must have the same parent folder.
* in folder `monaco-json` run `npm install` and run `npm run watch`
* in folder `monaco-editor` run `npm install` and run `npm run simpleserver`
* open http://localhost:8080/monaco-editor/test/?monaco-json=dev

### [Optional] Running monaco-editor-core from source

* this is only needed when you want to make changes also in `monaco-editor-core`.
* change to the same favorite source folder (`/src/`) that already contains `monaco-json` and `monaco-editor`
* `git clone https://github.com/Microsoft/vscode` (this will create `$/src/vscode/`)
* read [here](https://github.com/Microsoft/vscode/wiki/How-to-Contribute#installing-prerequisites) on how to initialize the VS code source repository.
* in folder `vscode` run `gulp watch`
* open http://localhost:8080/monaco-editor/test/?monaco-json=dev&editor=dev

## License
[MIT](https://github.com/Microsoft/monaco-json/blob/master/LICENSE.md)
