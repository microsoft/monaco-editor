# Monaco Languages

Colorization and configuration supports for multiple languages for the Monaco Editor:

![monaco-languages](https://cloud.githubusercontent.com/assets/5047891/15938606/1fd4bac6-2e74-11e6-8839-d455da8bc8a7.gif)

* bat
* coffee script
* cpp
* csharp
* fsharp
* go
* ini
* jade
* lua
* objective-c
* postiats
* powershell
* python
* r
* ruby
* sql
* swift
* vb
* xml

Also `css` dialects: 

* css
* less
* scss

## Issues

Please file issues concering `monaco-languages` in the [`monaco-editor`-repository](https://github.com/Microsoft/monaco-editor/issues).

## Installing

This npm module is bundled and distributed in the [monaco-editor](https://www.npmjs.com/package/monaco-editor) npm module.

## Dev: cheat sheet

* initial setup with `npm install .`
* compile with `npm run watch`
* test with `npm run test`
 * There is a problem with nls.js while running under the test environment. If you get `Uncaught Error: Evaluating node_modules/monaco-editor-core/dev/vs/nls.js as module "vs/nls" failed with error: TypeError: Cannot read property 'Plugin' of undefined` you must edit for now `$/node_modules/monaco-editor-core/dev/vs/nls.js` and around line 27 use `var global = _nlsPluginGlobal || {};`. A fix will come soon.
* bundle with `npm run prepublish`

## Dev: Running monaco-languages from source

* clone https://github.com/Microsoft/monaco-languages in `$/src/monaco-languages`
* run `$/src/monaco-languages> npm run watch`
* clone https://github.com/Microsoft/monaco-editor in `$/src/monaco-editor`
* run `$/src/monaco-editor> npm run simpleserver`
* edit `$/src/monaco-editor/test/index.html` and set `RUN_PLUGINS_FROM_SOURCE['monaco-languages'] = true;`
* open http://localhost:8080/monaco-editor/test/

### [Optional] Running monaco-editor-core from source

* this is only needed when you want to make changes also in `monaco-editor-core`.
* clone https://github.com/Microsoft/vscode in `$/src/vscode/`
* run `gulp watch`
* edit `$/src/monaco-editor/test/index.html` and set `var RUN_EDITOR_FROM_SOURCE = true;`
* open http://localhost:8080/monaco-editor/test/

## Dev: Adding a new language

* create `$/src/myLang.ts`
* create `$/test/myLang.test.ts`
* update tsconfig.json with `$> node_modules/.bin/tscg .`
* restart compilation with `$> npm run watch`
* edit `$/src/monaco.contribution.ts` and register your new language:
```js
registerLanguage({
	id: 'sql',
	extensions: [ '.sql' ],
	aliases: [ 'SQL' ],
	module: './sql'
});
```
* edit `$/test/all.js` and load your new language while testing
```js
'out/test/sql.test',
```
* edit `$/gulpfile.js` and ship your new language
```js
bundleOne('src/sql'),
```

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.


## License
[MIT](https://github.com/Microsoft/monaco-languages/blob/master/LICENSE.md)
