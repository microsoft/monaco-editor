# Monaco Editor

[Demo page](https://microsoft.github.io/monaco-editor/)

The Monaco Editor is the code editor that powers [VS Code](https://github.com/Microsoft/vscode), a good page describing the code editor's features is [here](https://code.visualstudio.com/docs/editor/editingevolved).

![image](https://cloud.githubusercontent.com/assets/5047891/19600675/5eaae9e6-97a6-11e6-97ad-93903167d8ba.png)

## Try it out

See the editor in action [here](https://microsoft.github.io/monaco-editor/index.html).

Learn how to extend the editor and try out your own customizations in the [playground](https://microsoft.github.io/monaco-editor/playground.html).

Browse the latest editor API at [`monaco.d.ts`](https://github.com/Microsoft/monaco-editor/blob/master/website/playground/monaco.d.ts.txt).

## Issues

Please mention the version of the editor when creating issues and the browser you're having trouble in. Create issues in this repository.

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

# More documentation

Find full HTML samples [here](https://github.com/Microsoft/monaco-editor-samples).

Create a Monarch tokenizer [here](https://microsoft.github.io/monaco-editor/monarch.html).
![image](https://cloud.githubusercontent.com/assets/5047891/16143041/840ced64-346a-11e6-98f3-3c68bf61884a.png)

## FAQ

❓ **What is the relationship between VS Code and the Monaco Editor?**

The Monaco Editor is generated straight from VS Code's sources with some shims around services the code needs to make it run in a web browser outside of its home.

❓ **What is the relationship between VS Code's version and the Monaco Editor's version?**

None. The Monaco Editor is a library and it reflects directly the source code.

❓ **I've written an extension for VS Code, will it work on the Monaco Editor in a browser?**

No.

❓ **Why all these web workers and why should I care?**

Language services create web workers to compute heavy stuff outside the UI thread. They cost hardly anything in terms of resource overhead and you shouldn't worry too much about them, as long as you get them to work (see above the cross-domain case).

❓ **What is this `loader.js`? Can I use `require.js`?**

It is an AMD loader that we use in VS Code. Yes.

❓ **I see the warning "Could not create web worker". What should I do?**

HTML5 does not allow pages loaded on `file://` to create web workers. Please load the editor with a web server on `http://` or `https://` schemes. Please also see the cross domain case above.

❓ **Is the editor supported in mobile browsers or mobile web app frameworks?**

No.

❓ **Why doesn't the editor support TextMate grammars?**

* all the regular expressions in TM grammars are based on [oniguruma](https://github.com/kkos/oniguruma), a regular expression library written in C.
* the only way to interpret the grammars and get anywhere near original fidelity is to use the exact same regular expression library (with its custom syntax constructs)
* in VSCode, our runtime is node.js and we can use a node native module that exposes the library to JavaScript
* in Monaco, we are constrained to a browser environment where we cannot do anything similar
* we have experimented with Emscripten to compile the C library to asm.js, but performance was very poor even in Firefox (10x slower) and extremely poor in Chrome (100x slower).
* we can revisit this once WebAssembly gets traction in the major browsers, but we will still need to consider the browser matrix we support. i.e. if we support IE11 and only Edge will add WebAssembly support, what will the experience be in IE11, etc.

## Development setup

Please see [CONTRIBUTING](./CONTRIBUTING.md)

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.


## License
[MIT](https://github.com/Microsoft/monaco-editor/blob/master/LICENSE.md)
