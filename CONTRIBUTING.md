# Contributing & Maintaining

This guide contains the lightweight setup version (that **only requires you to have node.js installed**).
If you wish to be able to run vscode from source, please see [VSCode's How to Contribute](https://github.com/Microsoft/vscode/wiki/How-to-Contribute#build-and-run-from-source).


## Running the editor from source

```bash
# clone vscode
/src> git clone https://github.com/Microsoft/vscode

# install minimal npm deps for vscode
/src/vscode> npm run monaco-editor-setup

# start the compiler in the background
/src/vscode> npm run watch-client

# clone monaco-editor (note the folders must be siblings!)
/src> git clone https://github.com/Microsoft/monaco-editor

# install npm deps for monaco-editor
/src/monaco-editor> npm install .

# start a local http server in the background
/src/monaco-editor> npm run simpleserver

# open http://localhost:8080/monaco-editor/test/?editor=dev
```

## Running a plugin from source (e.g. monaco-typescript)

```bash
# clone monaco-typescript
/src> git clone https://github.com/Microsoft/monaco-typescript

# install npm deps for monaco-typescript
/src/monaco-typescript> npm run watch

# open http://localhost:8080/monaco-editor/test/?editor=dev&monaco-typescript=dev
```

## Running the editor tests

```bash
/src/vscode> npm run monaco-editor-test
# or run a test page http://localhost:8080/monaco-editor/test/?editor=dev
```

> Tip: All folders must be cloned as siblings.

> Tip: When running the test pages, use the control panel in the top right corner to switch between running from source, running from npm or running from the local release:
![image](https://cloud.githubusercontent.com/assets/5047891/19599080/eb0d7622-979e-11e6-96ce-dde98cd95dc1.png)

## Running the website

```bash
# create a local release
/src/monaco-editor> npm run release

# open http://localhost:8080/monaco-editor/website/

# build the website
/src/monaco-editor> npm run website

# open http://localhost:8080/monaco-editor-website/

# publish the website
/src/monaco-editor-website> git push origin gh-pages --force
```

---

## Shipping a new monaco-editor version

#### 1. Ship a new `monaco-editor-core` version
* bump version in `/src/vscode/build/monaco/package.json`
* **[important]** push all local changes to the remote to get a good public commit id.
* generate npm package `/src/vscode> gulp editor-distro`
* publish npm package `/src/vscode/out-monaco-editor-core> npm publish`

#### 2. Adopt new `monaco-editor-core` in plugins
* if there are breaking API changes that affect the language plugins, adopt the new API in:
  * [repo - monaco-typescript](https://github.com/Microsoft/monaco-typescript)
  * [repo - monaco-languages](https://github.com/Microsoft/monaco-languages)
  * [repo - monaco-css](https://github.com/Microsoft/monaco-css)
  * [repo - monaco-json](https://github.com/Microsoft/monaco-json)
  * [repo - monaco-html](https://github.com/Microsoft/monaco-html)
* publish new versions of those plugins to npm as necessary.

#### 3. Update package.json
* edit `/src/monaco-editor/package.json` and update the version (as necessary):
  * [npm - monaco-editor-core](https://www.npmjs.com/package/monaco-editor-core)
  * [npm - monaco-typescript](https://www.npmjs.com/package/monaco-typescript)
  * [npm - monaco-languages](https://www.npmjs.com/package/monaco-languages)
  * [npm - monaco-css](https://www.npmjs.com/package/monaco-css)
  * [npm - monaco-json](https://www.npmjs.com/package/monaco-json)
  * [npm - monaco-html](https://www.npmjs.com/package/monaco-html)
* **[important]** fetch latest deps by running `/src/monaco-editor> npm install .`

#### 4. Generate and try out the local release

* `/src/monaco-editor> npm run release`
* try as many test pages as you think are relevant. e.g.:
  * open `http://localhost:8080/monaco-editor/test/?editor=releaseDev`
  * open `http://localhost:8080/monaco-editor/test/?editor=releaseMin`
  * open `http://localhost:8080/monaco-editor/test/smoketest.html?editor=releaseDev`
  * open `http://localhost:8080/monaco-editor/test/smoketest.html?editor=releaseMin`

#### 5. Publish local release

* `/src/monaco-editor> npm version minor`
* `/src/monaco-editor/release> npm publish`
* `/src/monaco-editor> git push --tags`
