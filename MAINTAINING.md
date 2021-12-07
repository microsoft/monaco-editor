# Maintaining

(For maintainers)

## Updating TypeScript

- change typescript's version in `package.json`.
- execute `npm install .`
- execute `npm run import-typescript`
- adopt new APIs

## Shipping a new monaco-editor npm module

#### 0.

- make sure you have `https://github.com/microsoft/vscode-loc` checked out next to the `vscode` folder.

#### 1. Ship a new `monaco-editor-core` npm module

- bump version in `/src/vscode/build/monaco/package.json`
- **[important]** push all local changes to the remote to get a good public commit id.
- generate npm package `/src/vscode> yarn gulp editor-distro`
- publish npm package `/src/vscode/out-monaco-editor-core> npm publish`

#### 2. Adopt new `monaco-editor-core` version

- edit `/src/monaco-editor/package.json` and update the version of [`monaco-editor-core`](https://www.npmjs.com/package/monaco-editor-core)

```sh
# fetch latest deps
/src/monaco-editor> npm install .
```

#### 4. Generate and try out the local release

- run the editor smoketest via CI or [manually](#running-the-editor-tests).

#### 5. Update release note.

- API Changes / Breaking Changes / New and noteworthy
- Thank you ([use this tool](https://vscode-tools.azurewebsites.net/))

#### 6. Publish

- `/src/monaco-editor> npm version minor`
- `/src/monaco-editor> npm run release`
- `/src/monaco-editor/release> npm publish`
- `/src/monaco-editor> git push origin v0.50.0`

#### 7. Update Website

- `/src/monaco-editor> npm run website`

#### 8. Publish new webpack plugin

- **TBD**
- https://github.com/microsoft/monaco-editor/tree/main/webpack-plugin
- `npm install .`
- `npm run import-editor`
- if there are no changes generated after the script:
  - update the peer dependency in `package.json` and use the `||` format e.g. `"monaco-editor": "0.27.x || 0.28.x"`
  - update the version matrix in the README.md and add the new editor version to the plugin's current major version
  - use `npm version minor`
  - publish using `npm publish`
- if there are any changes generated after the script:
  - update the peer dependency in `package.json` e.g. `"monaco-editor": "0.29.x"`
  - update the version matrix in the README.md and add a new row with the new major version
  - use `npm version major`
  - publish using `npm publish`
- remember to push tags upstream
