# Maintaining

(For maintainers)

- [Inbox Queue](https://github.com/microsoft/monaco-editor/issues?q=is%3Aissue+is%3Aopen+no%3Aassignee+-label%3Afeature-request+-label%3Aquestion+-label%3Aupstream+-label%3A%22help+wanted%22+-label%3A%22info-needed%22+-label%3A%22as-designed%22+)

## Updating TypeScript

- change typescript's version in `package.json`.
- execute `npm install .`
- execute `npm run import-typescript`
- adopt new APIs

## Shipping a new monaco-editor npm module

- update `package.json` and bump `"version"` as necessary
- update `package.json` and edit `"vscode"` to point to the vscode repo commit that should be shipped at `monaco-editor-core` (both `monaco-editor-core` and `monaco-editor` will be published under the same version defined in `package.json`).
- write entry in `CHANGELOG.md`
  - API Changes / Breaking Changes / New and noteworthy
  - Thank you ([use this tool](https://vscode-tools.azurewebsites.net/acknowledgement/))
- trigger a build using [`Publish to npm`](https://github.com/microsoft/monaco-editor/actions/workflows/publish.yml) and type false when asked "is nightly?"
- if the publish succeeded, run `git tag 0.x.y` and `git push origin 0.x.y`
- edit `package.json` and update the `"monaco-editor-core"` dev dependency.
- run `npm install`

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
