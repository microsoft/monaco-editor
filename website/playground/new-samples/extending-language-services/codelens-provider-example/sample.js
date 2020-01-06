var editor = monaco.editor.create(document.getElementById("container"), {
    value: "{\n\t\"dependencies\": {\n\t\t\n\t}\n}\n",
    language: "json"
});

var commandId = editor.addCommand(0, function () {
    // services available in `ctx`
    alert('my command is executing!');

}, '');

monaco.languages.registerCodeLensProvider('json', {
    provideCodeLenses: function (model, token) {
        return {
            lenses: [
                {
                    range: {
                        startLineNumber: 1,
                        startColumn: 1,
                        endLineNumber: 2,
                        endColumn: 1
                    },
                    id: "First Line",
                    command: {
                        id: commandId,
                        title: "First Line"
                    }
                }
            ]
        };
    },
    resolveCodeLens: function (model, codeLens, token) {
        return codeLens;
    }
});
