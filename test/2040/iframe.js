const init = () => {
    loadEditor(function() {
        // create the editor
        const target = document.getElementById('container');
        const editor = monaco.editor.create(target, { language: 'html' });

        // load some sample data
        (async () => {
          const response = await fetch('https://microsoft.github.io/monaco-editor/');
          const html = await response.text();
          editor.getModel().setValue(html);
        })();
    });
};

window.addEventListener('DOMContentLoaded', () => {
  if (!window.innerWidth || !window.innerHeight) {
    window.addEventListener('resize', init, { once: true });
  } else {
    init();
  }
});
