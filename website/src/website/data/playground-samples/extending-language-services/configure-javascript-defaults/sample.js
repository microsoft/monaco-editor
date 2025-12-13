// Add additional d.ts files to the JavaScript language service and change.
// Also change the default compilation options.
// The sample below shows how a class Facts is declared and introduced
// to the system and how the compiler is told to use ES6 (target=2).

// validation settings
monaco.typescript.javascriptDefaults.setDiagnosticsOptions({
	noSemanticValidation: true,
	noSyntaxValidation: false,
});

// compiler options
monaco.typescript.javascriptDefaults.setCompilerOptions({
	target: monaco.typescript.ScriptTarget.ES2015,
	allowNonTsExtensions: true,
});

// extra libraries
var libSource = [
	"declare class Facts {",
	"    /**",
	"     * Returns the next fact",
	"     */",
	"    static next():string",
	"}",
].join("\n");
var libUri = "ts:filename/facts.d.ts";
monaco.typescript.javascriptDefaults.addExtraLib(libSource, libUri);
// When resolving definitions and references, the editor will try to use created models.
// Creating a model for the library allows "peek definition/references" commands to work with the library.
monaco.editor.createModel(libSource, "typescript", monaco.Uri.parse(libUri));

var jsCode = [
	'"use strict";',
	"",
	"class Chuck {",
	"    greet() {",
	"        return Facts.next();",
	"    }",
	"}",
].join("\n");

monaco.editor.create(document.getElementById("container"), {
	value: jsCode,
	language: "javascript",
});
