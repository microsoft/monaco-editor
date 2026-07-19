/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const fs = require('fs');
const path = require('path');

const keywords = getPostgreSQLKeywords();
keywords.sort();
console.log(`'${keywords.join("',\n'")}'`);

function getPostgreSQLKeywords() {
	// https://www.postgresql.org/docs/current/sql-keywords-appendix.html
	const lines = fs
		.readFileSync(path.join(__dirname, 'keywords.postgresql.txt'))
		.toString()
		.split(/\r\n|\r|\n/);
	const tokens = [];
	for (let line of lines) {
		const pieces = line.split(/\t/);
		if (/non-reserved/.test(pieces[1])) {
			continue;
		}
		if (/reserved/.test(pieces[1])) {
			tokens.push(pieces[0]);
		}
	}
	return tokens;
}
