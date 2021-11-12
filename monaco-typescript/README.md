# Monaco TypeScript

Simple TypeScript and JavaScript language support for the Monaco Editor.

![typescript](https://cloud.githubusercontent.com/assets/5047891/15926623/5262fe08-2e3d-11e6-9b90-1d43fda07178.gif)

_Note_ that this project focuses on single-file scenarios and that things like project-isolation, cross-file-features like Rename etc. are _outside_ the scope of this project and not supported.

## Development

- watch with `npm run watch`
- compile with `npm run prepublishOnly`
- open `$/monaco-typescript/test/index.html` in your favorite browser.

## Updating TypeScript

- change typescript's version in `package.json`.
- execute `npm install .`
- execute `npm run import-typescript`
- adopt new APIs
