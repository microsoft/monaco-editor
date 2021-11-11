# Monaco JSON

JSON language plugin for the Monaco Editor. It provides the following features when editing JSON files:

- Code completion, based on JSON schemas or by looking at similar objects in the same file
- Hovers, based on JSON schemas
- Validation: Syntax errors and schema validation
- Formatting
- Document Symbols
- Syntax highlighting
- Color decorators for all properties matching a schema containing `format: "color-hex"'` (non-standard schema extension)

Schemas can be provided by configuration. See [`monaco.d.ts`](./monaco.d.ts)
for the API that the JSON plugin offers to configure the JSON language support.

Internally the JSON plugin uses the [`vscode-json-languageservice`](https://github.com/microsoft/vscode-json-languageservice)
node module, providing the implementation of the features listed above. The same module is also used
in [Visual Studio Code](https://github.com/microsoft/vscode) to power the JSON editing experience.

## Development

- watch with `npm run watch`
- compile with `npm run prepublishOnly`
