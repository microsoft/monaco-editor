# Monaco Editor

[Demo page](https://microsoft.github.io/monaco-editor/)

The Monaco Editor is the code editor that powers [VS Code](https://github.com/Microsoft/vscode), a good page describing the code editor's features is [here](https://code.visualstudio.com/docs/editor/editingevolved).

![image](https://cloud.githubusercontent.com/assets/5047891/15751937/4267b918-28ec-11e6-9fbd-d6cd2973c770.png)

## Issues

Please mention the version of the editor when creating issues and the browser you're having trouble in.

This repository contains only the scripts to glue things together, please create issues against the actual repositories where the source code lives:
 * [monaco-editor-core](https://github.com/Microsoft/vscode) -- (the editor itself)
 * [monaco-typescript](https://github.com/Microsoft/monaco-typescript) -- (JavaScript or TypeScript language support)
 * [monaco-css](https://github.com/Microsoft/monaco-css) -- (CSS, LESS or SCSS advanced language support)
 * [monaco-json](https://github.com/Microsoft/monaco-json) -- (JSON advanced language support)
 * [monaco-languages](https://github.com/Microsoft/monaco-languages) -- (bat, coffee script, cpp, csharp, fsharp, go, ini, jade, lua, objective-c, powershell, python, r, ruby, sql, swift, vb or xml colorizers)

## Known issues
In IE, the editor must be completely surrounded in the body element, otherwise the hit testing we do for mouse operations does not work. You can inspect this using F12 and clicking on the body element and confirm that visually it surrounds the editor.

## Installing

```
npm install monaco-editor
```

You will get:
* inside `dev`: bundled, not minified
* inside `min`: bundled, and minified
* inside `min-maps`: source maps for `min`
* `monaco.d.ts`: this specifies the API of the editor (this is what is actually versioned, everything else is considered private and might break with any release).

It is recommended to develop against the `dev` version, and in production to use the `min` version.

## Integrate

Here is the most basic HTML page that embeds the editor. More samples are available at [monaco-editor-samples](https://github.com/Microsoft/monaco-editor-samples).

```html
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" >
</head>
<body>

<div id="container" style="width:800px;height:600px;border:1px solid grey"></div>

<script src="monaco-editor/min/vs/loader.js"></script>
<script>
	require.config({ paths: { 'vs': 'monaco-editor/min/vs' }});
	require(['vs/editor/editor.main'], function() {
		var editor = monaco.editor.create(document.getElementById('container'), {
			value: [
				'function x() {',
				'\tconsole.log("Hello world!");',
				'}'
			].join('\n'),
			language: 'javascript'
		});
	});
</script>
</body>
</html>
```

## Integrate cross domain

If you are hosting your `.js` on a different domain (e.g. on a CDN) than the HTML, you should know that the Monaco Editor creates web workers for smart language features. Cross-domain web workers are not allowed, but here is how you can proxy their loading and get them to work:

```html
<!--
	Assuming the HTML lives on www.mydomain.com and that the editor is hosted on www.mycdn.com
-->
<script type="text/javascript" src="http://www.mycdn.com/monaco-editor/min/vs/loader.js"></script>
<script>
	require.config({ paths: { 'vs': 'http://www.mycdn.com/monaco-editor/min/vs' }});

	// Before loading vs/editor/editor.main, define a global MonacoEnvironment that overwrites
	// the default worker url location (used when creating WebWorkers). The problem here is that
	// HTML5 does not allow cross-domain web workers, so we need to proxy the instantion of
	// a web worker through a same-domain script
	window.MonacoEnvironment = {
		getWorkerUrl: function(workerId, label) {
			return 'monaco-editor-worker-loader-proxy.js';
		}
	};

	require(["vs/editor/editor.main"], function () {
		// ...
	});
</script>

<!--
	Create http://www.mydomain.com/monaco-editor-worker-loader-proxy.js with the following content:
		self.MonacoEnvironment = {
			baseUrl: 'http://www.mycdn.com/monaco-editor/min/'
		};
		importScripts('www.mycdn.com/monaco-editor/min/vs/base/worker/workerMain.js');
	That's it. You're good to go! :)
-->
```

## Documentation

Please program against the API described in `monaco.d.ts`.

See the editor in action [here](https://microsoft.github.io/monaco-editor/index.html).

Find full HTML samples [here](https://github.com/Microsoft/monaco-editor-samples).

Explore API samples [here](https://microsoft.github.io/monaco-editor/playground.html).
![image](https://cloud.githubusercontent.com/assets/5047891/16143056/9909d2d6-346a-11e6-86dc-f4f75c94ed2b.png)

Create a Monarch tokenizer [here](https://microsoft.github.io/monaco-editor/monarch.html).
![image](https://cloud.githubusercontent.com/assets/5047891/16143041/840ced64-346a-11e6-98f3-3c68bf61884a.png)

## FAQ

> Q: What is the relationship between VS Code and the Monaco Editor?<br/>
> A: The Monaco Editor is generated straight from VS Code's sources with some shims around services the code needs to make it run in a web browser outside of its home.


> Q: What is the relationship between VS Code's version and the Monaco Editor's version?<br/>
> A: None. The Monaco Editor is a library and it reflects directly the source code.


> Q: I've written an extension for VS Code, will it work on the Monaco Editor in a browser?<br/>
> A: No.


> Q: Why all these web workers and why should I care?<br/>
> A: Language services create web workers to compute heavy stuff outside the UI thread. They cost hardly anything in terms of resource overhead and you shouldn't worry too much about them, as long as you get them to work (see above the cross-domain case).


> Q: What is this `loader.js`? Can I use `require.js`?<br/>
> A: It is an AMD loader that we use in VS Code. Yes.


> Q: I see the warning "Could not create web worker". What should I do?<br/>
> A: HTML5 does not allow pages loaded on `file://` to create web workers. Please load the editor with a web server on `http://` or `https://` schemes. Please also see the cross domain case above.

## Dev

### Cheat Sheet

* simpleserver with `npm run simpleserver`, open [http://localhost:8080/monaco-editor/website/](http://localhost:8080/monaco-editor/website/)
* release with `npm run release`
* website with `npm run website`

### Running monaco-editor-core from source

* clone https://github.com/Microsoft/vscode in `$/src/vscode/` (next to this repo)
* run `$/src/vscode> gulp watch`
* run `$/src/monaco-editor> npm run simpleserver`
* open http://localhost:8080/monaco-editor/test/?editor=dev

### Running a plugin (e.g. monaco-typescript) from source

* clone https://github.com/Microsoft/monaco-typescript in `$/src/monaco-typescript` (next to this repo)
* run `$/src/monaco-typescript> npm run watch`
* run `$/src/monaco-editor> npm run simpleserver`
* open http://localhost:8080/monaco-editor/test/?editor=dev&monaco-typescript=dev

---

### Shipping a new `monaco-editor` version

#### Ship a new `monaco-editor-core` version (if necessary)
* bump version in https://github.com/Microsoft/vscode/blob/master/build/monaco/package.json
 * if there is a breaking API change, bump the major (or the minor for 0.x.y)
* push all local changes to the remote
* generate npm package `$/src/vscode> gulp editor-distro`
* publish npm package `$/src/vscode/out-monaco-editor-core> npm publish`

#### Adopt new `monaco-editor-core` in plugins (if necessary)
* https://github.com/Microsoft/monaco-typescript
* https://github.com/Microsoft/monaco-languages
* https://github.com/Microsoft/monaco-css
* https://github.com/Microsoft/monaco-json

#### Adopt new `monaco-editor-core`
* edit `$/src/monaco-editor/package.json` and update the version for (as necessary):
 * `monaco-editor-core`
 * `monaco-typescript`
 * `monaco-css`
 * `monaco-json`
 * `monaco-languages`
* update the version in `$/src/monaco-editor/package.json`
 * I try to keep it similar to `monaco-editor-core`, maybe just vary the patch version.
* fetch latest deps by running `$/src/monaco-editor> npm install .`

#### Package `monaco-editor`
* run `$/src/monaco-editor> npm run release`

#### Try out packaged bits
* open http://localhost:8080/monaco-editor/test/index-release.html
* open http://localhost:8080/monaco-editor/test/smoketest-release.html

#### Publish packaged bits
* run `$/src/monaco-editor/release> npm publish`

---

### Running the website from its source

* run `$/src/monaco-editor> npm run release`
* open http://localhost:8080/monaco-editor/website/

### Generating the playground samples

* edit `$/src/monaco-editor/website/playground/playground.mdoc`
* run `$/src/monaco-editor> gulp playground-samples`

### Publishing the website

* run `$/src/monaco-editor> npm run website`
* force-push the gh-pages branch: `$/src/monaco-editor-website> git push origin gh-pages --force`

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.


## License
[MIT](https://github.com/Microsoft/monaco-editor/blob/master/LICENSE.md)
