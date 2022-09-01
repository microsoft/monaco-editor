/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { tsc, buildESM } from './utils';
import { removeDir } from './fs';

removeDir(`out`);

tsc(`src/tsconfig.json`);

buildESM({
	base: 'language/typescript',
	entryPoints: [
		'src/language/typescript/monaco.contribution.ts',
		'src/language/typescript/tsMode.ts',
		'src/language/typescript/ts.worker.ts'
	],
	external: ['monaco-editor-core', '*/tsMode', '*/monaco.contribution']
});
