monaco.languages.registerDocumentSymbolProvider('json', {
    provideDocumentSymbols: function (model, token) {
        return [
            {
                range: {
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: 2,
                    endColumn: 1
                },
                name: 'File',
                kind: 0
            },
            {
                range: {
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: 2,
                    endColumn: 1
                },
                name: 'Module',
                kind: 1
            },
            {
                range: {
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: 2,
                    endColumn: 1
                },
                name: 'Namespace',
                kind: 2
            },
            {
                range: {
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: 2,
                    endColumn: 1
                },
                name: 'Package',
                kind: 3
            },
            {
                range: {
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: 2,
                    endColumn: 1
                },
                name: 'Class',
                kind: 4
            },
            {
                range: {
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: 2,
                    endColumn: 1
                },
                name: 'Method',
                kind: 5
            },
            {
                range: {
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: 2,
                    endColumn: 1
                },
                name: 'Property',
                kind: 6
            },
            {
                range: {
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: 2,
                    endColumn: 1
                },
                name: 'Field',
                kind: 7
            },
            {
                range: {
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: 2,
                    endColumn: 1
                },
                name: 'Constructor',
                kind: 8
            },
            {
                range: {
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: 2,
                    endColumn: 1
                },
                name: 'Enum',
                kind: 9
            },
            {
                range: {
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: 2,
                    endColumn: 1
                },
                name: 'Interface',
                kind: 10
            },
            {
                range: {
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: 2,
                    endColumn: 1
                },
                name: 'Function',
                kind: 11
            },
            {
                range: {
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: 2,
                    endColumn: 1
                },
                name: 'Variable',
                kind: 12
            },
            {
                range: {
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: 2,
                    endColumn: 1
                },
                name: 'Constant',
                kind: 13
            },
            {
                range: {
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: 2,
                    endColumn: 1
                },
                name: 'String',
                kind: 14
            },
            {
                range: {
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: 2,
                    endColumn: 1
                },
                name: 'Number',
                kind: 15
            },
            {
                range: {
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: 2,
                    endColumn: 1
                },
                name: 'Boolean',
                kind: 16
            },
            {
                range: {
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: 2,
                    endColumn: 1
                },
                name: 'Array',
                kind: 17
            },
            {
                range: {
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: 2,
                    endColumn: 1
                },
                name: 'Object',
                kind: 18
            },
            {
                range: {
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: 2,
                    endColumn: 1
                },
                name: 'Key',
                kind: 19
            },
            {
                range: {
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: 2,
                    endColumn: 1
                },
                name: 'Null',
                kind: 20
            },
            {
                range: {
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: 2,
                    endColumn: 1
                },
                name: 'EnumMember',
                kind: 21
            },
            {
                range: {
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: 2,
                    endColumn: 1
                },
                name: 'Struct',
                kind: 22
            },
            {
                range: {
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: 2,
                    endColumn: 1
                },
                name: 'Event',
                kind: 23
            },
            {
                range: {
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: 2,
                    endColumn: 1
                },
                name: 'Operator',
                kind: 24
            },
            {
                range: {
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: 2,
                    endColumn: 1
                },
                name: 'TypeParameter',
                kind: 25
            },
        ];
    }
});

monaco.editor.create(document.getElementById("container"), {
    value: "{\n\t\"dependencies\": {\n\t\t\n\t}\n}\n",
    language: "json"
});