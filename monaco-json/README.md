# Monaco JSON

JSON language plugin for the Monaco Editor. It provides the following features when editing JSON files:

- Code completion, based on JSON schemas or by looking at similar objects in the same file
- Hovers, based on JSON schemas
- Validation: Syntax errors and schema validation
- Formatting
- Document Symbols
- Syntax highlighting
- Color decorators for all properties matching a schema containing `format: "color-hex"'` (non-standard schema extension)

Schemas can be provided by configuration. See [here](https://github.com/Microsoft/monaco-json/blob/master/monaco.d.ts)
for the API that the JSON plugin offers to configure the JSON language support.

Internally the JSON plugin uses the [vscode-json-languageservice](https://github.com/Microsoft/vscode-json-languageservice)
node module, providing the implementation of the features listed above. The same module is also used
in [Visual Studio Code](https://github.com/Microsoft/vscode) to power the JSON editing experience.

## Issues

Please file issues concerning `monaco-json` in the [`monaco-editor` repository](https://github.com/Microsoft/monaco-editor/issues).

## Installing

This npm module is bundled and distributed in the [monaco-editor](https://www.npmjs.com/package/monaco-editor) npm module.

## Development

- `git clone https://github.com/Microsoft/monaco-json`
- `npm install .`
- compile with `npm run compile`
- watch with `npm run watch`
- `npm run prepublishOnly`
- open `$/monaco-json/test/index.html` in your favorite browser.

## License

[MIT](https://github.com/Microsoft/monaco-json/blob/master/LICENSE.md)
