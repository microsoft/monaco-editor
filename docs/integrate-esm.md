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

When using parcel, we need to use the `getWorkerUrl` function to map the workers we import as URLs.

- `index.js`

```js
import JSONWorker from 'url:monaco-editor/esm/vs/language/json/json.worker.js';
import CSSWorker from 'url:monaco-editor/esm/vs/language/css/css.worker.js';
import HTMLWorker from 'url:monaco-editor/esm/vs/language/html/html.worker.js';
import TSWorker from 'url:monaco-editor/esm/vs/language/typescript/ts.worker.js';
import EditorWorker from 'url:monaco-editor/esm/vs/editor/editor.worker.js';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js';

self.MonacoEnvironment = {
	getWorkerUrl: function (moduleId, label) {
		if (label === 'json') {
			return JSONWorker;
		}
		if (label === 'css' || label === 'scss' || label === 'less') {
			return CSSWorker;
		}
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			return HTMLWorker;
		}
		if (label === 'typescript' || label === 'javascript') {
			return TSWorker;
		}
		return EditorWorker;
	}
};

monaco.editor.create(document.getElementById('container'), {
	value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
	language: 'javascript'
});
```

---

### Using Vite

Adding monaco editor to [Vite](https://vitejs.dev/) is simple since it has built-in support for web workers. You only need to implement the `getWorker` function (NOT the `getWorkerUrl`) to use Vite's output ([Source](https://github.com/vitejs/vite/discussions/1791#discussioncomment-321046)):

```js
import * as monaco from 'monaco-editor';

self.MonacoEnvironment = {
	getWorker: function (workerId, label) {
		const getWorkerModule = (moduleUrl, label) => {
			return new Worker(self.MonacoEnvironment.getWorkerUrl(moduleUrl), {
				name: label,
				type: 'module'
			});
		};

		switch (label) {
			case 'json':
				return getWorkerModule('/monaco-editor/esm/vs/language/json/json.worker?worker', label);
			case 'css':
			case 'scss':
			case 'less':
				return getWorkerModule('/monaco-editor/esm/vs/language/css/css.worker?worker', label);
			case 'html':
			case 'handlebars':
			case 'razor':
				return getWorkerModule('/monaco-editor/esm/vs/language/html/html.worker?worker', label);
			case 'typescript':
			case 'javascript':
				return getWorkerModule('/monaco-editor/esm/vs/language/typescript/ts.worker?worker', label);
			default:
				return getWorkerModule('/monaco-editor/esm/vs/editor/editor.worker?worker', label);
		}
	}
};

monaco.editor.create(document.getElementById('container'), {
	value: "function hello() {\n\talert('Hello world!');\n}",
	language: 'javascript'
});
```
