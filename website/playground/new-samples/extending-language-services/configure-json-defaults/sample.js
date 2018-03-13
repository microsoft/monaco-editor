// Configures two JSON schemas, with references.

var id = "foo.json";

monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
	validate: true,
	schemas: [{
        uri: "http://myserver/foo-schema.json",
        fileMatch: [id],
        schema: {
            type: "object",
            properties: {
                p1: {
                    enum: [ "v1", "v2"]
                },
                p2: {
                    $ref: "http://myserver/bar-schema.json"
                }
            }
        }
    },{
        uri: "http://myserver/bar-schema.json",
        fileMatch: [id],
        schema: {
            type: "object",
            properties: {
                q1: {
                    enum: [ "x1", "x2"]
                }
            }
        }
    }]
});


var jsonCode = [
	'{',
	'    "p1": "v3",',
	'    "p2": false',
	"}"
].join('\n');

var model = monaco.editor.createModel(jsonCode, "json", id);

monaco.editor.create(document.getElementById("container"), {
	model: model
});
