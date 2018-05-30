// Configures two JSON schemas, with references.

var jsonCode = [
    '{',
    '    "p1": "v3",',
    '    "p2": false',
    "}"
].join('\n');
var modelUri = monaco.Uri.parse("a://b/foo.json"); // a made up unique URI for our model
var model = monaco.editor.createModel(jsonCode, "json", modelUri);

// configure the JSON language support with schemas and schema associations
monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    schemas: [{
        uri: "http://myserver/foo-schema.json", // id of the first schema
        fileMatch: [modelUri.toString()], // associate with our model
        schema: {
            type: "object",
            properties: {
                p1: {
                    enum: ["v1", "v2"]
                },
                p2: {
                    $ref: "http://myserver/bar-schema.json" // reference the second schema
                }
            }
        }
    }, {
        uri: "http://myserver/bar-schema.json", // id of the first schema
        schema: {
            type: "object",
            properties: {
                q1: {
                    enum: ["x1", "x2"]
                }
            }
        }
    }]
});

monaco.editor.create(document.getElementById("container"), {
    model: model
});