// Configures two JSON schemas, with references.

monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
	schemas: [{
        uri: "http://myserver/foo-schema.json",
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
	'    "$schema": "http://myserver/foo-schema.json"',
	"}"
].join('\n');

monaco.editor.create(document.getElementById("container"), {
	value: jsonCode,
	language: "json"
});