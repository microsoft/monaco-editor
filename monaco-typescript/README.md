# Monaco TypeScript

Simple TypeScript and JavaScript language support for the Monaco Editor.

![typescript](https://cloud.githubusercontent.com/assets/5047891/15926623/5262fe08-2e3d-11e6-9b90-1d43fda07178.gif)

_Note_ that this project focuses on single-file scenarios and that things like project-isolation, cross-file-features like Rename etc. are _outside_ the scope of this project and not supported.

## Issues

Please file issues concerning `monaco-typescript` in the [`monaco-editor` repository](https://github.com/Microsoft/monaco-editor/issues).

## Installing

This npm module is bundled and distributed in the [monaco-editor](https://www.npmjs.com/package/monaco-editor) npm module.

## Development

- `git clone https://github.com/Microsoft/monaco-typescript`
- `cd monaco-typescript`
- `npm install .`
- `npm run compile`
- `npm run watch`
- open `$/monaco-typescript/test/index.html` in your favorite browser.

## Updating TypeScript

- change typescript's version in `package.json`.
- execute `npm install .`
- execute `npm run import-typescript`
- adopt new APIs

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## License

[MIT](https://github.com/Microsoft/monaco-typescript/blob/master/LICENSE.md)
