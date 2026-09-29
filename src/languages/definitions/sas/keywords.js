/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Regenerates the word lists in sas.ts. Run from this directory:
//   node keywords.js
//
// The vocabulary is the SAS language data published with the SAS extension
// for Visual Studio Code (Apache-2.0):
// https://github.com/sassoftware/vscode-sas-extension
//
// Download a copy of the repository, then pass its server/data directory:
//   node keywords.js /path/to/vscode-sas-extension/server/data
//
// Prints one sorted, quoted, comma-separated list per group, ready to paste
// into sas.ts.

const fs = require('fs');
const path = require('path');

const DATA = process.argv[2];
if (!DATA) {
	console.error('usage: node keywords.js /path/to/vscode-sas-extension/server/data');
	process.exit(1);
}

/** Files that hold one flat list of keywords each. */
const FILES = {
	statements: ['SASGlobalStatements.json', 'SASGlobalProcedureStatements.json', 'SASDataStepStatements.json'],
	procNames: ['SASProcedures.json'],
	functions: ['SASFunctions.json'],
	callRoutines: ['SASCallRoutines.json'],
	macroStatements: ['SASMacroStatements.json'],
	macroFunctions: ['SASMacroFunctions.json', 'SASAutocallMacros.json', 'SASARMMacros.json'],
	options: ['SASDataStepOptions.json', 'SASDataSetOptions.json', 'SASDataStepOptions2.json'],
	systemOptions: ['Statements/OPTIONS.json'],
	odsTagsets: ['ODS_Tagsets.json'],
	styleElements: ['StyleElements.json'],
	styleAttributes: ['StyleAttributes.json'],
	styleLocations: ['StyleLocations.json'],
	sqlKeywords: ['SQLKeywords.json']
};

/** Groups whose words are stripped of a trailing '='. */
const STRIP_EQUALS = new Set(['options', 'systemOptions', 'styleAttributes']);

function clean(words, stripEquals) {
	const out = new Set();
	for (let word of words) {
		if (!word) {
			continue;
		}
		word = word.trim();
		if (stripEquals) {
			word = word.replace(/=$/, '');
		}
		// Documentation placeholders such as <name> are not real words.
		if (word.includes('<') || word.includes('>')) {
			continue;
		}
		if (!/^%?[A-Za-z_$][A-Za-z0-9_.$]*%?$/.test(word)) {
			continue;
		}
		out.add(word.toUpperCase());
	}
	return [...out].sort();
}

function readWords(file) {
	const data = JSON.parse(fs.readFileSync(path.join(DATA, file)).toString());
	return (data.Keywords?.Keyword ?? []).map((row) => row.Name ?? '');
}

for (const [group, files] of Object.entries(FILES)) {
	const words = clean(
		files.flatMap((file) => readWords(file)),
		STRIP_EQUALS.has(group)
	);
	console.log(`${group} (${words.length}):`);
	console.log(words.map((word) => `'${word}',`).join('\n'));
	console.log();
}
