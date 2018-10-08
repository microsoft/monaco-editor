# Monaco Editor

The Monaco Editor is the code editor that powers [VS Code](https://github.com/Microsoft/vscode), a good page describing the code editor's features is [here](https://code.visualstudio.com/docs/editor/editingevolved).

![image](https://cloud.githubusercontent.com/assets/5047891/19600675/5eaae9e6-97a6-11e6-97ad-93903167d8ba.png)

## Try it out

See the editor in action [on the website](https://microsoft.github.io/monaco-editor/index.html).

## Installing

```
$ npm install monaco-editor
```

You will get:
* inside `esm`: ESM version of the editor (compatible with e.g. webpack)
* inside `dev`: AMD bundled, not minified
* inside `min`: AMD bundled, and minified
* inside `min-maps`: source maps for `min`
* `monaco.d.ts`: this specifies the API of the editor (this is what is actually versioned, everything else is considered private and might break with any release).

It is recommended to develop against the `dev` version, and in production to use the `min` version.

## Documentation

* Learn how to integrate the editor with these [complete samples](https://github.com/Microsoft/monaco-editor-samples/).
	* [Integrate the AMD version](./docs/integrate-amd.md).
	* [Integrate the AMD version cross-domain](./docs/integrate-amd-cross.md)
	* [Integrate the ESM version](./docs/integrate-esm.md)
* Learn how to use the editor API and try out your own customizations in the [playground](https://microsoft.github.io/monaco-editor/playground.html).
* Explore the [API docs](https://microsoft.github.io/monaco-editor/api/index.html) or read them straight from [`monaco.d.ts`](https://github.com/Microsoft/monaco-editor/blob/master/website/playground/monaco.d.ts.txt).
* Read [this guide](https://github.com/Microsoft/monaco-editor/wiki/Accessibility-Guide-for-Integrators) to ensure the editor is accessible to all your users!
* Create a Monarch tokenizer for a new programming language [in the Monarch playground](https://microsoft.github.io/monaco-editor/monarch.html).
* Ask questions on [StackOverflow](https://stackoverflow.com/questions/tagged/monaco-editor)!
* Search open and closed issues, there are a lot of tips in there!

## Issues

Create issues in this repository for anything Monaco Editor related. Always mention **the version** of the editor when creating issues and **the browser** you're having trouble in. Please search for existing issues to avoid duplicates.

## Known issues
In IE 11, the editor must be completely surrounded in the body element, otherwise the hit testing we do for mouse operations does not work. You can inspect this using F12 and clicking on the body element and confirm that visually it surrounds the editor.


## FAQ

❓ **What is the relationship between VS Code and the Monaco Editor?**

The Monaco Editor is generated straight from VS Code's sources with some shims around services the code needs to make it run in a web browser outside of its home.

❓ **What is the relationship between VS Code's version and the Monaco Editor's version?**

None. The Monaco Editor is a library and it reflects directly the source code.

❓ **I've written an extension for VS Code, will it work on the Monaco Editor in a browser?**

No.

> Note: If the extension is fully based on the [LSP](https://microsoft.github.io/language-server-protocol/) and if the language server is authored in JavaScript, then it would be possible.

❓ **Why all these web workers and why should I care?**

Language services create web workers to compute heavy stuff outside the UI thread. They cost hardly anything in terms of resource overhead and you shouldn't worry too much about them, as long as you get them to work (see above the cross-domain case).

❓ **What is this `loader.js`? Can I use `require.js`?**

It is an AMD loader that we use in VS Code. Yes.

❓ **I see the warning "Could not create web worker". What should I do?**

HTML5 does not allow pages loaded on `file://` to create web workers. Please load the editor with a web server on `http://` or `https://` schemes, i.e using `http://localhost:<PORT>/<DIRECTORY>` Please also see the cross domain case above.

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
