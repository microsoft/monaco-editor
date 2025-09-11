## Integrating the ESM version of the Monaco Editor

- [Webpack](#using-webpack)
  - [Option 1: Using the Monaco Editor WebPack Plugin](#option-1-using-the-monaco-editor-webpack-plugin)
  - [Option 2: Using plain webpack](#option-2-using-plain-webpack)
- [Parcel](#using-parcel)
- [Vite](#using-vite)
- [Localization](#localization)

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

---

## Localization

Monaco Editor supports localization in multiple languages. When using the ESM version, you need to load the appropriate language files and configure the global NLS (National Language Support) variables.

### Available Languages

The monaco-editor package includes translations for the following languages:

- German (`de`)
- Spanish (`es`)
- French (`fr`)
- Italian (`it`)
- Japanese (`ja`)
- Korean (`ko`)
- Chinese Simplified (`zh-cn`)
- Chinese Traditional (`zh-tw`)

### Setting up Localization

To enable localization in your ESM integration, follow these steps:

1. **Import the language file** for your desired language before importing the editor:

```js
// Import the German localization
import 'monaco-editor/esm/nls.messages.de.js';
// Import monaco editor after the language file
import * as monaco from 'monaco-editor';

// Your existing MonacoEnvironment setup
self.MonacoEnvironment = {
	getWorkerUrl: function (moduleId, label) {
		// ... your worker configuration
	}
};

// Create editor - it will now use German localization
monaco.editor.create(document.getElementById('container'), {
	value: 'function x() {\n\tconsole.log("Hello world!");\n}',
	language: 'javascript'
});
```

2. **For other languages**, replace the import with the appropriate file:

```js
// Spanish
import 'monaco-editor/esm/nls.messages.es.js';

// French
import 'monaco-editor/esm/nls.messages.fr.js';

// Italian
import 'monaco-editor/esm/nls.messages.it.js';

// Japanese
import 'monaco-editor/esm/nls.messages.ja.js';

// Korean
import 'monaco-editor/esm/nls.messages.ko.js';

// Chinese Simplified
import 'monaco-editor/esm/nls.messages.zh-cn.js';

// Chinese Traditional
import 'monaco-editor/esm/nls.messages.zh-tw.js';
```

### How it Works

The language files set up global variables that the editor uses for localization:

- `globalThis._VSCODE_NLS_MESSAGES` - Contains the translated strings
- `globalThis._VSCODE_NLS_LANGUAGE` - Contains the language code

When you import a language file, it automatically sets these global variables, and the editor will use the translated strings for its UI elements like context menus, command palette, error messages, etc.

### Dynamic Language Loading

You can also load languages dynamically based on user preferences:

```js
async function loadLanguage(language) {
	if (language !== 'en') {
		// Dynamically import the language file
		await import(`monaco-editor/esm/nls.messages.${language}.js`);
	}

	// Import monaco after language is loaded
	const monaco = await import('monaco-editor');

	// Setup your editor
	return monaco;
}

// Usage
loadLanguage('de').then((monaco) => {
	monaco.editor.create(document.getElementById('container'), {
		value: 'function x() {\n\tconsole.log("Hello world!");\n}',
		language: 'javascript'
	});
});
```

### Complete Example with Webpack

Here's a complete webpack example with German localization:

- `index.js`:

```js
// Import German localization first
import 'monaco-editor/esm/nls.messages.de.js';
import * as monaco from 'monaco-editor';

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

// Create editor with German UI
monaco.editor.create(document.getElementById('container'), {
	value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
	language: 'javascript'
});
```

The webpack configuration remains the same as shown in the [plain webpack](#option-2-using-plain-webpack) section.

### Notes

- Language files must be imported **before** importing the main monaco-editor module
- If no language file is imported, the editor will use English (the default language)
- Language files are included in the monaco-editor package and don't require separate downloads
- The localization affects editor UI elements but does not translate your code content
