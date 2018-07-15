## Integrating the AMD version of the Monaco Editor in a cross-domain setup

Here is the most basic HTML page that embeds the editor, using AMD, in the case that the editor sources are hosted on a different domain (e.g. CDN) than the document origin.

More self-contained samples are available at [monaco-editor-samples](https://github.com/Microsoft/monaco-editor-samples).

If you are hosting your `.js` on a different domain (e.g. on a CDN) than the HTML, you should know that the Monaco Editor creates web workers for smart language features. Cross-domain web workers are not allowed, but here is how you can proxy their loading and get them to work:

Assuming the HTML lives on `www.mydomain.com` and the editor is hosted on `www.mycdn.com`.

----

# Option 1: Use a data: worker URI

* `https://www.mydomain.com/index.html`:
```html
<script type="text/javascript" src="http://www.mycdn.com/monaco-editor/min/vs/loader.js"></script>
<script>
  require.config({ paths: { 'vs': 'http://www.mycdn.com/monaco-editor/min/vs' }});

  // Before loading vs/editor/editor.main, define a global MonacoEnvironment that overwrites
  // the default worker url location (used when creating WebWorkers). The problem here is that
  // HTML5 does not allow cross-domain web workers, so we need to proxy the instantiation of
  // a web worker through a same-domain script
  window.MonacoEnvironment = {
    getWorkerUrl: function(workerId, label) {
      return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
        self.MonacoEnvironment = {
          baseUrl: 'http://www.mycdn.com/monaco-editor/min/'
        };
        importScripts('http://www.mycdn.com/monaco-editor/min/vs/base/worker/workerMain.js');`
      )}`;
    }
  };

  require(["vs/editor/editor.main"], function () {
    // ...
  });
</script>
```

----

# Option 2: Host on your domain a worker proxy

* `https://www.mydomain.com/index.html`:
```html
<script type="text/javascript" src="http://www.mycdn.com/monaco-editor/min/vs/loader.js"></script>
<script>
  require.config({ paths: { 'vs': 'http://www.mycdn.com/monaco-editor/min/vs' }});

  // Before loading vs/editor/editor.main, define a global MonacoEnvironment that overwrites
  // the default worker url location (used when creating WebWorkers). The problem here is that
  // HTML5 does not allow cross-domain web workers, so we need to proxy the instantiation of
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
```

* `https://www.mydomain.com/monaco-editor-worker-loader-proxy.js`:
```js
self.MonacoEnvironment = {
    baseUrl: 'http://www.mycdn.com/monaco-editor/min/'
};
importScripts('www.mycdn.com/monaco-editor/min/vs/base/worker/workerMain.js');
```

----

That's it. You're good to go! :)