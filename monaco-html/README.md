# Monaco HTML

HTML language plugin for the Monaco Editor. It provides the following features when editing HTML files:

- Code completion
- Formatting
- Document Highlights
- Link detection
- Syntax highlighting

Internally the HTML plugin uses the [`vscode-html-languageservice`](https://github.com/microsoft/vscode-html-languageservice)
node module, providing the implementation of the functionally listed above. The same module is also used
in [Visual Studio Code](https://github.com/microsoft/vscode) to power the HTML editing experience.

## Development

- watch with `npm run watch`
- compile with `npm run prepublishOnly`
