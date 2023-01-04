# Contributing

Checkout [MAINTAINING.md](./MAINTAINING.md) for common maintaining tasks.

## A brief explanation on the source code structure

This repository contains source code only for Monaco Editor Languages, the core editor source lives in the [vscode repository](https://github.com/microsoft/vscode).

| repository                                                  | npm module                                                             | explanation                                                             |
| ----------------------------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [vscode](https://github.com/microsoft/vscode)               | [monaco-editor-core](https://www.npmjs.com/package/monaco-editor-core) | editor core functionality (language agnostic) is shipped out of vscode. |
| [monaco-editor](https://github.com/microsoft/monaco-editor) | [monaco-editor](https://www.npmjs.com/package/monaco-editor)           | the Monaco Editor.                                                      |

## Contributing a new tokenizer / a new language

Please understand that we only bundle languages with the monaco editor that have a significant relevance (for example, those that have an article in Wikipedia).

- create `$/src/basic-languages/{myLang}/{myLang}.contribution.ts`
- create `$/src/basic-languages/{myLang}/{myLang}.ts`
- create `$/src/basic-languages/{myLang}/{myLang}.test.ts`
- edit `$/src/basic-languages/monaco.contribution.ts` and register your new language
- create `$/website/index/samples/sample.{myLang}.txt`

```js
import './{myLang}/{myLang}.contribution';
```

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

# compile and bundle all plugins
/src/monaco-editor> npm run release

# start a local http server in the background
/src/monaco-editor> npm run simpleserver
```

Open [http://localhost:8080/monaco-editor/test/manual/?editor=src](http://localhost:8080/monaco-editor/test/manual/?editor=src) to run.

## Running the editor tests

```bash
# create a local release
/src/monaco-editor> npm run release

# run unit tests
/src/monaco-editor> npm run test

# compile the webpack plugin
/src/monaco-editor> npm run compile --prefix webpack-plugin

# package using the webpack plugin
/src/monaco-editor> npm run package-for-smoketest-webpack

# package using esbuild
/src/monaco-editor> npm run package-for-smoketest-esbuild

# package using vite
/src/monaco-editor> npm run package-for-smoketest-vite

# package using parcel
/src/monaco-editor> npm run package-for-smoketest-parcel --prefix test/smoke/parcel

# run the smoketest
/src/monaco-editor> npm run smoketest-debug
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
