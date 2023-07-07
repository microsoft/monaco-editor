# Maintaining

(For maintainers only)

Make sure every unassigned issue is labeled properly:

- [Inbox Queue](https://github.com/microsoft/monaco-editor/issues?q=is%3Aissue+is%3Aopen+no%3Aassignee+-label%3Afeature-request+-label%3Aupstream+-label%3A%22info-needed%22++-label%3Abug+)

## Publishing a stable build monaco-editor build

- Make sure there exists a nightly build from the VS Code commit the stable build should be built from
- [Compare Last Stable With Nightly](https://microsoft.github.io/monaco-editor/playground.html?source=v0.40.0-dev.20230704#XQAAAAJWBgAAAAAAAABBqQkHQ5NjdMjwa-jY7SIQ9S7DNlzs5W-mwj0fe1ZCDRFc9ws9XQE0SJE1jc2VKxhaLFIw9vEWSxW3yscw_SM66BuzMt6m3zM8Thvb-XSMR_Da8IdBq3FOgly-7-xuaHSi_yUg58ZO9Mr-RKT7GyHzHoU8B9N7P-uTzmCdhT2Vv-4gNRbWSMQCUPrfmzFCkSH_WR2Vc8LGx2m0uRSFiJu82B1mS0RM-eriU9PTOqAgBrlPUMTU44VrHyVOqgs5BFrUuUHwGDzUHxeNuUk-kg2u70awQLQ83wD4o2EbSefqfIWkk2Yi0mnUS903tLA4V17MD_6OHIRArunMPL6E14ZCW0_Aql21F62Fmz--i_pNbqBIpSlBbZl6LzA1HzNsoDH7i2rn1qAw55L1MjwOU4QQMCJfffmJznAbGoZWkXK91OPYlOGNHNGG-MPUFsY5JSjLfvCWOvXypW9ZVkBZMo1qUbtE135CLqbaBiw52f3eOPBTru3IL_wT__ciAFI5NDiVOeN8V9zqkzbwiFNeQyZcjxmrDLjYTPJpao0dG61Um0w4FpVud8p77bjoAdEfG8JNO97W4cawj0HvMfvcZS81P7IsijZqA7KyVsdq79iCJQuMO31aS86cM4GTNT0TvdI7p62uiEmm9X6ZjF8oSLxW87Vt0oYAZ5wBePqdN6FwNO6BWACt2Ep9i5Q6h-mOy7_JWOiPTOH0Zz3v6SaNhjxJwZAqNG3FqvRTgLg-au-pfa8PD0No3U15UyWeqrVXSthGFghLJ16ppEwFCqFfQ6Vr0leZtSZXyk41-t5ZKMG-KQjzq1XE2PnuyOz60nV4GaYvGlMHrXz-XrEqb2kwNf_pBee0)
  - Update [package.json](./package.json)
    - set `version` to next stable
    - set `vscodeRef` to _vscodeCommitId_
    - update `devDependencies.monaco-editor-core` to _version_
  - Run `npm install` to update lockfile
  - Update [CHANGELOG.md](./CHANGELOG.md)
    - API Changes / Breaking Changes / New and noteworthy
    - Thank you ([use this tool](https://tools.code.visualstudio.com/acknowledgement))
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
