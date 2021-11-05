/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const path = require('path');
const fs = require('fs');

const REPO_ROOT = path.join(__dirname, '../');
const SRC_PATH = path.join(REPO_ROOT, 'out/amd/monaco.contribution.d.ts');
const DST_PATH = path.join(REPO_ROOT, 'monaco.d.ts');

const lines = fs
	.readFileSync(SRC_PATH)
	.toString()
	.split(/\r\n|\r|\n/);
let result = [
	`/*---------------------------------------------------------------------------------------------`,
	` *  Copyright (c) Microsoft Corporation. All rights reserved.`,
	` *  Licensed under the MIT License. See License.txt in the project root for license information.`,
	` *--------------------------------------------------------------------------------------------*/`,
	``,
	`/// <reference path="node_modules/monaco-editor-core/monaco.d.ts" />`,
	``,
	`declare namespace monaco.languages.typescript {`
];
for (let line of lines) {
	if (/^import/.test(line)) {
		continue;
	}
	if (line === 'export {};') {
		continue;
	}
	line = line.replace(/    /g, '\t');
	line = line.replace(/declare /g, '');
	if (line.length > 0) {
		line = `\t${line}`;
		result.push(line);
	}
}
result.push(`}`);
result.push(``);

fs.writeFileSync(DST_PATH, result.join('\n'));
