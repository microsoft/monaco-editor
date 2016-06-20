# Monaco TypeScript

TypeScript and JavaScript language support for the Monaco Editor.

![typescript](https://cloud.githubusercontent.com/assets/5047891/15926623/5262fe08-2e3d-11e6-9b90-1d43fda07178.gif)

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
* edit `$/src/monaco-editor/test/index.html` and set `RUN_PLUGINS_FROM_SOURCE['monaco-typescript'] = true;`
* open http://localhost:8080/monaco-editor/test/

### [Optional] Running monaco-editor-core from source

* this is only needed when you want to make changes also in `monaco-editor-core`.
* clone https://github.com/Microsoft/vscode in `$/src/vscode/`
* run `$/src/vscode> gulp watch`
* edit `$/src/monaco-editor/test/index.html` and set `var RUN_EDITOR_FROM_SOURCE = true;`
* open http://localhost:8080/monaco-editor/test/

## License
[MIT](https://github.com/Microsoft/monaco-typescript/blob/master/LICENSE.md)
