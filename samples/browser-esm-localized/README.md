# Monaco Editor ESM Localization Sample

This sample demonstrates how to use localization with the Monaco Editor ESM version.

## Features

- Shows how to import language files before importing Monaco Editor
- Demonstrates German localization of the Monaco Editor UI
- Includes examples of localized context menus, command palette, and other UI elements
- Provides a reference for implementing other languages

## How to Run

1. Navigate to the root of the monaco-editor repository
2. Install dependencies: `npm install`
3. Build the sample: `cd samples/browser-esm-localized && npm run build`
4. Open `index.html` in your browser

## How it Works

The key to ESM localization is importing the language file **before** importing the main Monaco Editor module:

```javascript
// Import German localization first
import 'monaco-editor/esm/nls.messages.de.js';
// Then import Monaco Editor
import * as monaco from 'monaco-editor';
```

The language file sets up global variables that Monaco Editor uses for localization:

- `globalThis._VSCODE_NLS_MESSAGES` - Contains the translated strings
- `globalThis._VSCODE_NLS_LANGUAGE` - Contains the language code

## Testing Localization

Once the sample is running, you can test the localization by:

1. **Right-clicking** in the editor to see the German context menu
2. **Pressing F1** to open the command palette in German
3. **Using Ctrl+F** to open the search box with German labels
4. **Checking error messages** and tooltips in German

## Available Languages

The following language files are available:

- `nls.messages.de.js` - German
- `nls.messages.es.js` - Spanish
- `nls.messages.fr.js` - French
- `nls.messages.it.js` - Italian
- `nls.messages.ja.js` - Japanese
- `nls.messages.ko.js` - Korean
- `nls.messages.zh-cn.js` - Chinese Simplified
- `nls.messages.zh-tw.js` - Chinese Traditional

## Switching Languages

To test different languages, modify the import statement in `index.js`:

```javascript
// For French
import 'monaco-editor/esm/nls.messages.fr.js';

// For Spanish
import 'monaco-editor/esm/nls.messages.es.js';

// etc.
```

Then rebuild and reload the page.

## Dynamic Language Loading

For a more advanced implementation that loads languages dynamically, see the documentation in `docs/integrate-esm.md`.
