/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const fs = require('fs');
const path = require('path');

const keywords = getMySQLKeywords();
keywords.sort();
console.log(`'${keywords.join("',\n'")}'`);

function getMySQLKeywords() {
	// https://dev.mysql.com/doc/refman/8.0/en/keywords.html
	const lines = fs
		.readFileSync(path.join(__dirname, 'keywords.mysql.txt'))
		.toString()
		.split(/\r\n|\r|\n/);
	const tokens = [];
	for (let line of lines) {
		// Treat ; as a comment marker
		line = line.replace(/;.*$/, '');
		line = line.trim();
		// Only consider reserved keywords
		if (!/ \(R\)$/.test(line)) {
			continue;
		}
		line = line.replace(/ \(R\)$/, '');
		tokens.push(line);
	}
	return tokens;
}
