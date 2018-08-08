/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const path = require('path');
const fs = require('fs');

const TYPESCRIPT_LIB_SOURCE = path.join(__dirname, '../node_modules/typescript/lib');
const TYPESCRIPT_LIB_DESTINATION = path.join(__dirname, '../src/lib');

(function () {
	try {
		fs.statSync(TYPESCRIPT_LIB_DESTINATION);
	} catch (err) {
		fs.mkdirSync(TYPESCRIPT_LIB_DESTINATION);
	}
	importLibs();

	var tsServices = fs.readFileSync(path.join(TYPESCRIPT_LIB_SOURCE, 'typescriptServices.js')).toString();

	// Ensure we never run into the node system...
	// (this also removes require calls that trick webpack into shimming those modules...)
	tsServices = (
		tsServices.replace(/\n    ts\.sys =([^]*)\n    \}\)\(\);/m, `\n    // MONACOCHANGE\n    ts.sys = undefined;\n    // END MONACOCHANGE`)
	);

	var tsServices_amd = tsServices +
		`
// MONACOCHANGE
// Defining the entire module name because r.js has an issue and cannot bundle this file
// correctly with an anonymous define call
define("vs/language/typescript/lib/typescriptServices", [], function() { return ts; });
// END MONACOCHANGE
`;
	fs.writeFileSync(path.join(TYPESCRIPT_LIB_DESTINATION, 'typescriptServices-amd.js'), tsServices_amd);

	var tsServices_esm = tsServices +
		`
// MONACOCHANGE
export const createClassifier = ts.createClassifier;
export const createLanguageService = ts.createLanguageService;
export const displayPartsToString = ts.displayPartsToString;
export const EndOfLineState = ts.EndOfLineState;
export const flattenDiagnosticMessageText = ts.flattenDiagnosticMessageText;
export const IndentStyle = ts.IndentStyle;
export const ScriptKind = ts.ScriptKind;
export const ScriptTarget = ts.ScriptTarget;
export const TokenClass = ts.TokenClass;
// END MONACOCHANGE
`;
	fs.writeFileSync(path.join(TYPESCRIPT_LIB_DESTINATION, 'typescriptServices.js'), tsServices_esm);

	var dtsServices = fs.readFileSync(path.join(TYPESCRIPT_LIB_SOURCE, 'typescriptServices.d.ts')).toString();
	dtsServices +=
		`
// MONACOCHANGE
export = ts;
// END MONACOCHANGE
`;
	fs.writeFileSync(path.join(TYPESCRIPT_LIB_DESTINATION, 'typescriptServices.d.ts'), dtsServices);
})();

function importLibs() {
	function getFileName(name) {
		return (name === '' ? 'lib.d.ts' : `lib.${name}.d.ts`);
	}
	function getVariableName(name) {
		return (name === '' ? 'lib_dts' : `lib_${name.replace(/\./g, '_')}_dts`);
	}
	function readLibFile(name) {
		var srcPath = path.join(TYPESCRIPT_LIB_SOURCE, getFileName(name));
		return fs.readFileSync(srcPath).toString();
	}

	var queue = [];
	var in_queue = {};

	var enqueue = function (name) {
		if (in_queue[name]) {
			return;
		}
		in_queue[name] = true;
		queue.push(name);
	};

	enqueue('');
	enqueue('es6');

	var result = [];
	while (queue.length > 0) {
		var name = queue.shift();
		var contents = readLibFile(name);
		var lines = contents.split(/\r\n|\r|\n/);

		var output = '';
		var writeOutput = function (text) {
			if (output.length === 0) {
				output = text;
			} else {
				output += ` + ${text}`;
			}
		};
		var outputLines = [];
		var flushOutputLines = function () {
			writeOutput(`"${escapeText(outputLines.join('\n'))}"`);
			outputLines = [];
		};
		var deps = [];
		for (let i = 0; i < lines.length; i++) {
			let m = lines[i].match(/\/\/\/\s*<reference\s*lib="([^"]+)"/);
			if (m) {
				flushOutputLines();
				writeOutput(getVariableName(m[1]));
				deps.push(getVariableName(m[1]));
				enqueue(m[1]);
				continue;
			}
			outputLines.push(lines[i]);
		}
		flushOutputLines();

		result.push({
			name: getVariableName(name),
			deps: deps,
			output: output
		});
	}

	var strResult = `/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
`;
	// Do a topological sort
	while (result.length > 0) {
		for (let i = result.length - 1; i >= 0; i--) {
			if (result[i].deps.length === 0) {
				// emit this node
				strResult += `\nexport const ${result[i].name} = ${result[i].output};\n`;

				// mark dep as resolved
				for (let j = 0; j < result.length; j++) {
					for (let k = 0; k < result[j].deps.length; k++) {
						if (result[j].deps[k] === result[i].name) {
							result[j].deps.splice(k, 1);
							break;
						}
					}
				}

				// remove from result
				result.splice(i, 1);
				break;
			}
		}
	}

	var dstPath = path.join(TYPESCRIPT_LIB_DESTINATION, 'lib.ts');
	fs.writeFileSync(dstPath, strResult);
}

/**
 * Escape text such that it can be used in a javascript string enclosed by double quotes (")
 */
function escapeText(text) {
	// See http://www.javascriptkit.com/jsref/escapesequence.shtml
	var _backspace = '\b'.charCodeAt(0);
	var _formFeed = '\f'.charCodeAt(0);
	var _newLine = '\n'.charCodeAt(0);
	var _nullChar = 0;
	var _carriageReturn = '\r'.charCodeAt(0);
	var _tab = '\t'.charCodeAt(0);
	var _verticalTab = '\v'.charCodeAt(0);
	var _backslash = '\\'.charCodeAt(0);
	var _doubleQuote = '"'.charCodeAt(0);

	var startPos = 0, chrCode, replaceWith = null, resultPieces = [];

	for (var i = 0, len = text.length; i < len; i++) {
		chrCode = text.charCodeAt(i);
		switch (chrCode) {
			case _backspace:
				replaceWith = '\\b';
				break;
			case _formFeed:
				replaceWith = '\\f';
				break;
			case _newLine:
				replaceWith = '\\n';
				break;
			case _nullChar:
				replaceWith = '\\0';
				break;
			case _carriageReturn:
				replaceWith = '\\r';
				break;
			case _tab:
				replaceWith = '\\t';
				break;
			case _verticalTab:
				replaceWith = '\\v';
				break;
			case _backslash:
				replaceWith = '\\\\';
				break;
			case _doubleQuote:
				replaceWith = '\\"';
				break;
		}
		if (replaceWith !== null) {
			resultPieces.push(text.substring(startPos, i));
			resultPieces.push(replaceWith);
			startPos = i + 1;
			replaceWith = null;
		}
	}
	resultPieces.push(text.substring(startPos, len));
	return resultPieces.join('');
}
