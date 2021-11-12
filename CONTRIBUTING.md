# Contributing & Maintaining

## A brief explanation on the source code structure

This repository contains source code only for Monaco Editor Languages, the core editor source lives in the [vscode repository](https://github.com/Microsoft/vscode).

| repository                                                  | npm module                                                             | explanation                                                             |
| ----------------------------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [vscode](https://github.com/microsoft/vscode)               | [monaco-editor-core](https://www.npmjs.com/package/monaco-editor-core) | editor core functionality (language agnostic) is shipped out of vscode. |
| [monaco-editor](https://github.com/microsoft/monaco-editor) | [monaco-editor](https://www.npmjs.com/package/monaco-editor)           | the Monaco Editor.                                                      |

## Contributing a new tokenizer / a new language

- create `$/monaco-languages/src/myLang/myLang.contribution.ts`
- create `$/monaco-languages/src/myLang/myLang.ts`
- create `$/monaco-languages/src/myLang/myLang.test.ts`
- edit `$/monaco-languages/src/monaco.contribution.ts` and register your new language

```js
import './myLang/myLang.contribution';
```

## Updating TypeScript

- change typescript's version in `package.json`.
- execute `npm install .`
- execute `npm run import-typescript`
- adopt new APIs

## Running the editor from source

You need to have all the build setup of VS Code to be able to build the Monaco Editor.

- Install all the [prerequisites](https://github.com/microsoft/vscode/wiki/How-to-Contribute#prerequisites)

```bash
# clone vscode-loc repository for localized string resources
/src> git clone https://github.com/microsoft/vscode-loc
# clone VS Code repository
/src> git clone https://github.com/microsoft/vscode
/src> cd vscode
# install npm deps for vscode
/src/vscode> yarn
# start the compiler in the background
/src/vscode> yarn watch
```

- For the monaco editor test pages:

```bash
# clone monaco-editor (note the folders must be siblings!)
/src> git clone https://github.com/microsoft/monaco-editor

# install npm deps for monaco-editor
/src/monaco-editor> npm install .

# compile all plugins
/src/monaco-editor> npm run prepublishOnly --prefix monaco-css
/src/monaco-editor> npm run prepublishOnly --prefix monaco-languages
/src/monaco-editor> npm run prepublishOnly --prefix monaco-typescript
/src/monaco-editor> npm run prepublishOnly --prefix monaco-json
/src/monaco-editor> npm run prepublishOnly --prefix monaco-html

# start a local http server in the background
/src/monaco-editor> npm run simpleserver
```

Open [http://localhost:8080/monaco-editor/test/?editor=src](http://localhost:8080/monaco-editor/test/?editor=src) to run.

## Running the editor tests

```bash
/src/vscode> npm run monaco-editor-test
# or run a test page http://localhost:8080/monaco-editor/test/?editor=src
```

> Tip: All folders must be cloned as siblings.

> Tip: When running the test pages, use the control panel in the top right corner to switch between running from source, running from npm or running from the local release:
> ![image](https://cloud.githubusercontent.com/assets/5047891/19599080/eb0d7622-979e-11e6-96ce-dde98cd95dc1.png)

## Running the website locally

> Note: The website is published automatically when pushing to the `master` branch.

```bash
# create a local release
/src/monaco-editor> npm run release

# build the website
/src/monaco-editor> npm run build-website

# start local webserver
/src/monaco-editor> npm run simpleserver

# open http://localhost:8080/monaco-editor-website/

```

## Shipping a new monaco-editor npm module

#### 0.

- make sure you have `https://github.com/microsoft/vscode-loc` checked out next to the `vscode` folder.

#### 1. Ship a new `monaco-editor-core` npm module

- bump version in `/src/vscode/build/monaco/package.json`
- **[important]** push all local changes to the remote to get a good public commit id.
- generate npm package `/src/vscode> yarn gulp editor-distro`
- publish npm package `/src/vscode/out-monaco-editor-core> npm publish`

#### 2. Update `monaco-editor-core`

- edit `/src/monaco-editor/package.json` and update the version of [`monaco-editor-core`](https://www.npmjs.com/package/monaco-editor-core)

```sh
# fetch latest deps
/src/monaco-editor> npm install .
```

#### 4. Generate and try out the local release

- `/src/monaco-editor> npm run release`
- try as many test pages as you think are relevant. e.g.:
  - open `http://localhost:8080/monaco-editor/test/?editor=releaseDev`
  - open `http://localhost:8080/monaco-editor/test/?editor=releaseMin`
  - open `http://localhost:8080/monaco-editor/test/smoketest.html?editor=releaseDev`
  - open `http://localhost:8080/monaco-editor/test/smoketest.html?editor=releaseMin`

#### 5. Update release note.

- API Change/Breaking Change/New and noteworthy
- Thank you ([use this tool](https://vscode-tools.azurewebsites.net/))

#### 6. Publish

- `/src/monaco-editor> npm version minor`
- `/src/monaco-editor> npm run release`
- `/src/monaco-editor/release> npm publish`
- `/src/monaco-editor> git push --tags`

#### 7. Update Website

- `/src/monaco-editor> npm run website`

#### 8. Publish new webpack plugin

- https://github.com/microsoft/monaco-editor-webpack-plugin
- update to latest `monaco-editor`
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
