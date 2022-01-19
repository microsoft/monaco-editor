# Monaco Editor Samples

Standalone HTML samples showing how to integrate the Monaco Editor.

## Running

```bash
git clone https://github.com/microsoft/monaco-editor.git
cd monaco-editor
cd samples
npm install .
npm run simpleserver
```

Go to <a href="http://localhost:8888">localhost:8888</a> and explore the samples!

## Loading variations

- `browser-amd-editor`: running in a browser using `AMD` lazy loading.
- `browser-script-editor`: running in a browser using `AMD` synchronous loading via `<script>` tags.
- `browser-esm-webpack`: running in a browser using webpack.
- `browser-esm-webpack-small`: running in a browser using webpack (only a subset of the editor).
- `electron-amd`: running in electron.
- `nwjs-amd` and `nwjs-amd-v2`: running in nwjs. it is reported that v2 works and the initial version does not.

## Other examples & techniques

- `browser-amd-diff-editor`: running the diff editor in a browser.
- `browser-amd-iframe`: running in an `<iframe>`.
- `browser-amd-localized`: running with the `German` locale.
- `browser-amd-monarch`: running with a custom language grammar written with Monarch.
- `browser-amd-shared-model`: using the same text model in two editors.

## License

MIT
