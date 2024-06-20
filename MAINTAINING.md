# Maintaining

(For maintainers only)

Make sure every unassigned issue is labeled properly:

- [Inbox Queue](https://github.com/microsoft/monaco-editor/issues?q=is%3Aissue+is%3Aopen+no%3Aassignee+-label%3Afeature-request+-label%3Aupstream+-label%3A%22info-needed%22++-label%3Abug+)

## Publishing a stable build monaco-editor build

- Trigger an rc-build
  - Go to https://github.com/microsoft/vscode/tree/release/1.89 (use latest VS Code version instead of .89!) and copy the id of the latest commit
  - Go to https://dev.azure.com/monacotools/Monaco/_build?definitionId=421 and click on "Run pipeline"
    - Use the copied commit id for `The VS Code commit id.`
    - Use `rc` for `The prerelease version.`
  - Wait until pipeline completes
- [Compare Last Stable With Nightly](https://microsoft.github.io/monaco-editor/playground.html?source=v0.40.0-dev.20230704#XQAAAAIGBwAAAAAAAABBqQkHQ5NjdMjwa-jY7SIQ9S7DNlzs5W-mwj0fe1ZCDRFc9ws9XQE0SJE1jc2VKxhaLFIw9vEWSxW3yscxAWG5G70rT-mLieOxDi0igaBcv2nRy9q6wT9hrC3N47TPeSd0URO3iwn_firHxVGLm2_8QMEuG2aOJ-jnXkHfLAawVi9XJdfEkOLYHqAT78XFdClh7HNBHFpSfLkCNQ3vE811FAdf6WYL_UK2n1jfGRMcnWqaztoAOTcWNn5qQ9RusryNfDBRqtjOJktItFKSNuOcLg104A0xatH8uXcfAULeE9RZRf41YqC9wbcZDEp7Mnul26YzW_IBv-vL-EGPcEFiu34YZPHQguQiuU8L4VXh7uAtKRWehN9N2m2XFF3yHCBpSGiN8qmBi4HSBRjbhkEKka_icj87t3Lfmg15PMqKgTr7l73XusvkQCZDvqumlN-mcVTZiIdD51m-OFugmn0Cq_ZPU2zq45rRtk1he8PcWiZpPSbCknJsHs4D-mKcc-ypq6CLYlqO8Cvc5lRWzwD-pG6e6uPAQsRAOJ45-mySqhRo_MGJ7aLfkhe7fVn9OvOm6BRsDAYmNVZqpA5aKJzwjeUwQqHwV8CW-b4hrZooiPavu8m2XgbiSW_5nmzbjQ-SaPnBsJxcAewWB_NiYiU3H_Gfhi8K0qQZlBxaetqYX5Ns1Ww6S_By4izRxeEln7McyDQxKk-tnywSCklMhZPiMaR0AZsXs5DQSxGTlB5q61e7Wtxb0RLdk5einYvNwXDooi5Vi5go_ZsO7JYmzylxi-T_hdsPgKNoy6j9IVh5BZb_HgRoaGCrojOWJdYpNNrPJJG_1fyZ8Bk80eYNmHHPJ7Q-pdXqQuAZBdd9Grv4UfXoY1R3Sl529QkIjEHTzgzYGn4C5KE5IGhEfu49Ugy0fFHU-yJGY__aPECJ)
  - Check the metadata and verify that the last stable is on the left and the the last rc build is on the right
- Update [package.json](./package.json)
  - set `version` to _lastNightly.nextStableVersion_ (from the compare step)
  - set `vscodeRef` to _lastNightly.vscodeCommitId_
  - update `devDependencies.monaco-editor-core` to _lastNightly.currentVersion_
- Run `npm install` to update lockfile
- Update [CHANGELOG.md](./CHANGELOG.md)
  - API Changes / Breaking Changes / New and noteworthy (use the diff from the compare step)
  - Add thank you mentions ([use this tool](https://tools.code.visualstudio.com/acknowledgement) and select only the monaco-editor)
- Commit & Create PR
- [Trigger build](https://dev.azure.com/monacotools/Monaco/_build?definitionId=416) once merged. Tick the following checkboxes:
  - Publish Monaco Editor Core
  - Publish Monaco Editor

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
