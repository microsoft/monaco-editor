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

## Debugging / Developing The Core Editor

TODO

## Debugging / Developing Language Support

TODO

## Running the editor from source

TODO

## Running the editor tests

```bash
> npm run build-monaco-editor
> npm run test
> npm run compile --prefix webpack-plugin

> npm run package-for-smoketest-webpack
> npm run package-for-smoketest-esbuild
> npm run package-for-smoketest-vite
> npm run package-for-smoketest-parcel --prefix test/smoke/parcel
> npm run smoketest-debug
```

## Running the website locally

TOD
