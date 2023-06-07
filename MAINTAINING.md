# Maintaining

(For maintainers only)

Make sure every unassigned issue is labeled properly:

- [Inbox Queue](https://github.com/microsoft/monaco-editor/issues?q=is%3Aissue+is%3Aopen+no%3Aassignee+-label%3Afeature-request+-label%3Aupstream+-label%3A%22info-needed%22++-label%3Abug+)

## Publishing a stable build monaco-editor build

- Make sure there exists a nightly build from the VS Code commit the stable build should be built from
- [Compare Last Stable With Nightly](https://microsoft.github.io/monaco-editor/playground.html?source=v0.39.0-dev.20230606#XQAAAAKzBQAAAAAAAABBqQkHQ5NjdMjwa-jY7SIQ9S7DNlzs5W-mwj0fe1ZCDRFc9ws9XQE0SJE1jc2VKxhaLFIw9vEWSxW3yscw9ajfg2SGxNmVfIdymzfNMmpU96miXJZvs8c7gcyo98bKVzbks7HoMVAZiOQjzsGSo4vYRPplxTKh4qJ5_s9m1RB0u1a8RPwJXtmqrYtToAekuwuDQ2im8_QvtfSt1HbJIiHVd2zPiTBSeoC03JVOCBfBsHUM0AOblitxr0yoEKp5yCNj9Xx68iP2xX6l7R-oQQP0QegyE5JU_S6OAtnV--nu4J_lwqYHYrlBXuqsqRU-cKhSqrbrcWCxKMEmQyZkUHmM75vxSD8qepWmGk7BA4eU4YQI7tZ6g74Y0LXfIckS_2A-xIQYChatES1wLXoLosL4FhDqugt7bJg6Lelf09SdwM_NgJuVqmU8jOyMkHaKZ4nkZt61mFhR3Wa4KUfFUTCro6cKL3tIHInvgOfg8gpWdNOKy19pICfKSDYlWkn6rPgZxR0b-KCbY8K3_B6h8_TU8JfXlva5OmzfgvNBQcN_UE95r5zuBUua8JDaVLTOUKDRsOj5DYNx9KGGgicA2qjH3IlyyuOfgPTmNssWQv496rVgpqm4Zpt3DGSDY-1vxbGQe7m135DxLbACD70fgH8-C-ou2umXUKDrJbZJI2EFFMvzvZVBZVEp7Fa2j7161WJ_oyFj1HvHtTMvvrE_0P2g-u--1zh_9OHJ_ybwLAA)
  - Update [package.json](./package.json)
    - set `version` to next stable
    - set `vscodeRef` to _vscodeCommitId_
    - update `devDependencies.monaco-editor-core` to _version_
  - Run `npm install` to update lockfile
  - Update [CHANGELOG.md](./CHANGELOG.md)
    - API Changes / Breaking Changes / New and noteworthy
    - Thank you ([use this tool](https://vscode-tools.azurewebsites.net/acknowledgement/))
  - Commit
  - [Trigger build](https://dev.azure.com/monacotools/Monaco/_build?definitionId=416)

#### Publish new webpack plugin

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

## Updating TypeScript

- change typescript's version in `package.json`.
- execute `npm install .`
- execute `npm run import-typescript`
- adopt new APIs
