# Monaco CSS

CSS language plugin for the Monaco Editor. It provides the following features when editing CSS, LESS and SCSS files:

- Code completion
- Hovers
- Validation: Syntax errors and linting
- Find definition, references & highlights for symbols in the same file
- Document Symbols
- Color Decorators

Linting an be configured through the API. See [`monaco.d.ts`](./monaco.d.ts) for the API that the
CSS plugin offers to configure the CSS/LESS/SCSS language support.

Internally the CSS plugin uses the [`vscode-css-languageservice`](https://github.com/microsoft/vscode-css-languageservice)
node module, providing the implementation of the functionally listed above. The same module is also used
in [Visual Studio Code](https://github.com/microsoft/vscode) to power the CSS, LESS and SCSS editing experience.

## Development

- watch with `npm run watch`
- `npm run prepublishOnly`
- open `$/monaco-css/test/index.html` in your favorite browser.
