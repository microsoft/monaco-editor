## Integrating the ESM version of the Monaco Editor

- [Webpack](#using-webpack)
  - [Option 1: Using the Monaco Editor WebPack Plugin](#option-1-using-the-monaco-editor-webpack-plugin)
  - [Option 2: Using plain webpack](#option-2-using-plain-webpack)
- [Parcel](#using-parcel)
- [Vite](#using-vite)

### Using webpack

Here is the most basic script that imports the editor using ESM with webpack.

More self-contained samples are available in the [samples folder](../samples/).

---

### Option 1: Using the Monaco Editor WebPack Plugin

This is the easiest method, and it allows for options to be passed into the plugin in order to select only a subset of editor features or editor languages. Read more about the [Monaco Editor WebPack Plugin](../webpack-plugin/), which is a community authored plugin.

- `index.js`

```js
import * as monaco from 'monaco-editor';

monaco.editor.create(document.getElementById('container'), {
	value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
	language: 'javascript'
});
```

- `webpack.config.js`

```js
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');

module.exports = {
	entry: './index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'app.js'
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.ttf$/,
				use: ['file-loader']
			}
		]
	},
	plugins: [new MonacoWebpackPlugin()]
};
```

---

### Option 2: Using plain webpack

Full working samples are available at https://github.com/microsoft/monaco-editor/tree/main/samples/browser-esm-webpack or https://github.com/microsoft/monaco-editor/tree/main/samples/browser-esm-webpack-small

- `index.js`

```js
import * as monaco from 'monaco-editor';

// Since packaging is done by you, you need
// to instruct the editor how you named the
// bundles that contain the web workers.
self.MonacoEnvironment = {
	getWorkerUrl: function (moduleId, label) {
		if (label === 'json') {
			return './json.worker.bundle.js';
		}
		if (label === 'css' || label === 'scss' || label === 'less') {
			return './css.worker.bundle.js';
		}
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			return './html.worker.bundle.js';
		}
		if (label === 'typescript' || label === 'javascript') {
			return './ts.worker.bundle.js';
		}
		return './editor.worker.bundle.js';
	}
};

monaco.editor.create(document.getElementById('container'), {
	value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
	language: 'javascript'
});
```

- `webpack.config.js`:

```js
const path = require('path');

module.exports = {
	entry: {
		app: './index.js',
		// Package each language's worker and give these filenames in `getWorkerUrl`
		'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
		'json.worker': 'monaco-editor/esm/vs/language/json/json.worker',
		'css.worker': 'monaco-editor/esm/vs/language/css/css.worker',
		'html.worker': 'monaco-editor/esm/vs/language/html/html.worker',
		'ts.worker': 'monaco-editor/esm/vs/language/typescript/ts.worker'
	},
	output: {
		globalObject: 'self',
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.ttf$/,
				use: ['file-loader']
			}
		]
	}
};
```

---

### Using parcel

A full working sample is available at https://github.com/microsoft/monaco-editor/tree/main/samples/browser-esm-parcel

When using parcel, we need to use the `getWorkerUrl` function and build the workers seperately from our main source. To simplify things, we can write a tiny bash script to build the workers for us.

- `index.js`

```js
import * as monaco from 'monaco-editor';

self.MonacoEnvironment = {
	getWorkerUrl: function (moduleId, label) {
		if (label === 'json') {
			return './json.worker.js';
		}
		if (label === 'css' || label === 'scss' || label === 'less') {
			return './css.worker.js';
		}
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			return './html.worker.js';
		}
		if (label === 'typescript' || label === 'javascript') {
			return './ts.worker.js';
		}
		return './editor.worker.js';
	}
};

monaco.editor.create(document.getElementById('container'), {
	value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
	language: 'javascript'
});
```

- `build_workers.sh`

```sh
ROOT=$PWD/node_modules/monaco-editor/esm/vs
OPTS="--no-source-maps --log-level 1"        # Parcel options - See: https://parceljs.org/cli.html

parcel build $ROOT/language/json/json.worker.js $OPTS
parcel build $ROOT/language/css/css.worker.js $OPTS
parcel build $ROOT/language/html/html.worker.js $OPTS
parcel build $ROOT/language/typescript/ts.worker.js $OPTS
parcel build $ROOT/editor/editor.worker.js $OPTS
```

Then, simply run `sh ./build_workers.sh && parcel index.html`. This builds the workers into the same directory as your main bundle (usually `./dist`). If you want to change the `--out-dir` of the workers, you must change the paths in `index.js` to reflect their new location.

_note - the `getWorkerUrl` paths are relative to the build directory of your src bundle_

---

### Using Vite

Adding monaco editor to [Vite](https://vitejs.dev/) is simple since it has built-in support for web workers. You only need to implement the `getWorker` function (NOT the `getWorkerUrl`) to use Vite's output ([Source](https://github.com/vitejs/vite/discussions/1791#discussioncomment-321046)):

```js
import * as monaco from 'monaco-editor';

import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import JsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import CssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import HtmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import TsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

self.MonacoEnvironment = {
	getWorker(_, label) {
		if (label === "json") {
			return new JsonWorker();
		}
		if (label === "css" || label === "scss" || label === "less") {
			return new CssWorker();
		}
		if (label === "html" || label === "handlebars" || label === "razor") {
			return new HtmlWorker();
		}
		if (label === "typescript" || label === "javascript") {
			return new TsWorker();
		}
		return new EditorWorker();
	}
};

monaco.editor.create(document.getElementById('container'), {
	value: "function hello() {\n\talert('Hello world!');\n}",
	language: 'javascript'
});
```

> [!NOTE]
> If you are running your frontend on a port that is different from the origin domain where the workers are evaluated,  
> you will encounter cross-origin errors.
> 
> In this scenario, you can use a blob like this:
> ```js
> self.MonacoEnvironment = {
>		getWorker(_, label) {
>			function createBlobWorker(workerModule) {
>				const code = workerModule.toString();
>				const blob = new Blob([code], { type: 'application/javascript' });
>				const blobUrl = URL.createObjectURL(blob);
>				return new Worker(blobUrl, { type: 'module' });
>			}
>
>			if (label === "json") {
>				return createBlobWorker(JsonWorker);
>			}
>			if (label === "css" || label === "scss" || label === "less") {
>				return createBlobWorker(CssWorker);
>			}
>			if (label === "html" || label === "handlebars" || label === "razor") {
>				return createBlobWorker(HtmlWorker);
>			}
>			if (label === "typescript" || label === "javascript") {
>				return createBlobWorker(TsWorker);
>			}
>
>			return createBlobWorker(EditorWorker);
>		}
>	};
> ```
