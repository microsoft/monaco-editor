/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import { REPO_ROOT } from './utils';

checkEveryMonacoLanguageHasASample();

function checkEveryMonacoLanguageHasASample() {
	let languages = glob
		.sync('src/languages/definitions/*/register.ts', { cwd: REPO_ROOT })
		.map((f) => path.dirname(f))
		.map((f) => f.substring('src/languages/definitions/'.length));
	languages.push('css');
	languages.push('html');
	languages.push('json');
	languages.push('typescript');

	// some languages have a different id than their folder
	languages = languages.map((l) => {
		switch (l) {
			case 'coffee':
				return 'coffeescript';
			case 'protobuf':
				return 'proto';
			case 'solidity':
				return 'sol';
			case 'sophia':
				return 'aes';
			default:
				return l;
		}
	});

	let fail = false;
	for (const language of languages) {
		const expectedSamplePath = path.join(
			REPO_ROOT,
			`website/src/website/data/home-samples/sample.${language}.txt`
		);
		if (!fs.existsSync(expectedSamplePath)) {
			console.error(`Missing sample for ${language} at ${expectedSamplePath}`);
			fail = true;
		}
	}
	if (fail) {
		process.exit(1);
	}
}
