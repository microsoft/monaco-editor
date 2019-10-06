# Contributing & Maintaining

## A brief explanation on the source code structure

This repository contains no source code, it only contains the scripts to package everything together and ship the `monaco-editor` npm module:

These packages are described in the root file called `metadata.js` and it is possible to create an editor distribution that contains only certain plugins by editing that file.

| repository | npm module | explanation |
|------------|------------|-------------|
| [vscode](https://github.com/Microsoft/vscode) | [monaco-editor-core](https://www.npmjs.com/package/monaco-editor-core) | editor core functionality (language agnostic) is shipped out of vscode. |
| [monaco-languages](https://github.com/Microsoft/monaco-languages) | [monaco-languages](https://www.npmjs.com/package/monaco-languages) | plugin that adds colorization and basic supports for dozens of languages. |
| [monaco-typescript](https://github.com/Microsoft/monaco-typescript) | [monaco-typescript](https://www.npmjs.com/package/monaco-typescript) | plugin that adds rich language support for JavaScript and TypeScript. |
| [monaco-css](https://github.com/Microsoft/monaco-css) | [monaco-css](https://www.npmjs.com/package/monaco-css) | plugin that adds rich language support for CSS, LESS and SCSS. |
| [monaco-json](https://github.com/Microsoft/monaco-json) | [monaco-json](https://www.npmjs.com/package/monaco-json) | plugin that adds rich language support for JSON. |
| [monaco-html](https://github.com/Microsoft/monaco-html) | [monaco-html](https://www.npmjs.com/package/monaco-html) | plugin that adds rich language support for HTML. |


## Running the editor from source

You need to have all the build setup of VS Code to be able to build the Monaco Editor.

* Install all the [prerequisites](https://github.com/Microsoft/vscode/wiki/How-to-Contribute#prerequisites)

### OS X and Linux

```bash
# clone vscode-loc repository for localized string resources
/src> git clone https://github.com/microsoft/vscode-loc
# clone VS Code repository
/src> git clone https://github.com/microsoft/vscode
/src> cd vscode
# install npm deps for vscode
/src/vscode> yarn
# start the compiler in the background
/src/vscode> yarn run watch
```

### Windows

```cmd
# clone vscode-loc repository for localized string resources
/src> git clone https://github.com/microsoft/vscode-loc
# clone VS Code repository
/src> git clone https://github.com/microsoft/vscode
/src> cd vscode
# install npm deps for vscode
/src/vscode> yarn
# start the compiler in the background
/src/vscode> yarn run watch
```

* For the monaco editor test pages:

```bash
# clone monaco-editor (note the folders must be siblings!)
/src> git clone https://github.com/Microsoft/monaco-editor

# install npm deps for monaco-editor
/src/monaco-editor> npm install .

# start a local http server in the background
/src/monaco-editor> npm run simpleserver
```

Open [http://localhost:8080/monaco-editor/test/?editor=src](http://localhost:8080/monaco-editor/test/?editor=src) to run.

## Running a plugin from source (e.g. monaco-typescript)

```bash
# clone monaco-typescript
/src> git clone https://github.com/Microsoft/monaco-typescript

# install npm deps for monaco-typescript
/src/monaco-typescript> npm install .

# start the compiler in the background
/src/monaco-typescript> npm run watch
```

Open [http://localhost:8080/monaco-editor/test/?editor=src&monaco-typescript=src](http://localhost:8080/monaco-editor/test/?editor=src&monaco-typescript=src) to run.

## Running the editor tests

```bash
/src/vscode> npm run monaco-editor-test
# or run a test page http://localhost:8080/monaco-editor/test/?editor=src
```

> Tip: All folders must be cloned as siblings.

> Tip: When running the test pages, use the control panel in the top right corner to switch between running from source, running from npm or running from the local release:
![image](https://cloud.githubusercontent.com/assets/5047891/19599080/eb0d7622-979e-11e6-96ce-dde98cd95dc1.png)

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

#### 1. Ship a new `monaco-editor-core` npm module
* bump version in `/src/vscode/build/monaco/package.json`
* **[important]** push all local changes to the remote to get a good public commit id.
* generate npm package `/src/vscode> node_modules/.bin/gulp editor-distro`
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

#### 5. Update release note.
* API Change/Breaking Change/New and noteworthy
* Thank you

#### 6. Publish

* `/src/monaco-editor> npm version minor`
* `/src/monaco-editor/release> npm publish`
* `/src/monaco-editor> git push --tags`
