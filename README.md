# Monaco TypeScript

TypeScript and JavaScript language support for the Monaco Editor.

![typescript](https://cloud.githubusercontent.com/assets/5047891/15926623/5262fe08-2e3d-11e6-9b90-1d43fda07178.gif)

## Issues

Please file issues concering `monaco-typescript` in the [`monaco-editor`-repository](https://github.com/Microsoft/monaco-editor/issues).

## Installing

This npm module is bundled and distributed in the [monaco-editor](https://www.npmjs.com/package/monaco-editor) npm module.

## Dev: cheat sheet

* initial setup with `npm install .`
* compile with `npm run watch`
* test with `npm run test`
* bundle with `npm run prepublish`

## Dev: Running monaco-typescript from source

* clone https://github.com/Microsoft/monaco-typescript in `$/src/monaco-typescript`
* run `$/src/monaco-typescript> npm run watch`
* clone https://github.com/Microsoft/monaco-editor in `$/src/monaco-editor`
* run `$/src/monaco-editor> npm run simpleserver`
* open http://localhost:8080/monaco-editor/test/?monaco-typescript=dev

### [Optional] Running monaco-editor-core from source

* this is only needed when you want to make changes also in `monaco-editor-core`.
* clone https://github.com/Microsoft/vscode in `$/src/vscode/`
* run `$/src/vscode> gulp watch`
* open http://localhost:8080/monaco-editor/test/?monaco-typescript=dev&editor=dev

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.


## License
[MIT](https://github.com/Microsoft/monaco-typescript/blob/master/LICENSE.md)
