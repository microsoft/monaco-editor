/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const path = require('path');
const fs = require('fs');

const TYPESCRIPT_LIB_SOURCE = path.join(__dirname, '../node_modules/typescript/lib');
const TYPESCRIPT_LIB_DESTINATION = path.join(__dirname, '../src/lib');

(function() {
	try {
		fs.statSync(TYPESCRIPT_LIB_DESTINATION);
	} catch (err) {
		fs.mkdirSync(TYPESCRIPT_LIB_DESTINATION);
	}
	importLibDeclarationFile('lib.d.ts');
	importLibDeclarationFile('lib.es6.d.ts');

	var tsServices = fs.readFileSync(path.join(TYPESCRIPT_LIB_SOURCE, 'typescriptServices.js')).toString();

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

/**
 * Import a lib*.d.ts file from TypeScript's dist
 */
function importLibDeclarationFile(name) {
	var dstName = name.replace(/\.d\.ts$/, '').replace(/\./g, '-') + '-ts';
	var srcPath = path.join(TYPESCRIPT_LIB_SOURCE, name);

	var contents = fs.readFileSync(srcPath).toString();

	var dstPath = path.join(TYPESCRIPT_LIB_DESTINATION, dstName + '.ts');
	fs.writeFileSync(dstPath,
`/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const contents = "${escapeText(contents)}";
`);
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
