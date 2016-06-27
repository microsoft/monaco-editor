# Monaco JSON

JSON language plugin for the Monaco Editor. It provides the following features when editing JSON files:
* Code completion, based on JSON schemas or by looking at similar objects in the same file
* Hovers, based on JSON schemas
* Validation: Syntax errors and schema validation
* Formatting
* Document Symbols
* Syntax highlighting

Schemas can be provided by configuration. See ([here](https://github.com/Microsoft/monaco-json/blob/master/src/monaco.d.ts) for the API that the
JSON plugin offers to configure the JSON language support.

Internally the JSON plugin uses the [vscode-json-languageservice](https://github.com/Microsoft/vscode-json-languageservice)
node module, providing the implementation of the functionally listed above. The same module is also used
in [VSCode](https://github.com/Microsoft/vscode) to power the JSON editing experience.

## Installing

This npm module is bundled and distributed in the [monaco-editor](https://www.npmjs.com/package/monaco-editor) npm module.

## Dev: cheat sheet

* initial setup with `npm install .`
* compile with `npm run watch`
* bundle with `npm run prepublish`

## Dev: Running monaco-json from source

* clone https://github.com/Microsoft/monaco-json in `$/src/monaco-json`
* run `$/src/monaco-json> npm run watch`
* clone https://github.com/Microsoft/monaco-editor in `$/src/monaco-editor`
* run `$/src/monaco-editor> npm run simpleserver`
* open http://localhost:8080/monaco-editor/test/?monaco-json=dev

### [Optional] Running monaco-editor-core from source

* this is only needed when you want to make changes also in `monaco-editor-core`.
* clone https://github.com/Microsoft/vscode in `$/src/vscode/`
* run `$/src/vscode> gulp watch`
* open http://localhost:8080/monaco-editor/test/?monaco-json=dev&editor=dev


## License
[MIT](https://github.com/Microsoft/monaco-json/blob/master/LICENSE.md)
