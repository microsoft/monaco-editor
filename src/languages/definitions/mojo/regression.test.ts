/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

// Local lexical/contextual regressions; upstream references and search scope are in AGENTS.md.
testTokenization('mojo', [
	// JavaScript's dot excludes these separators; Mojo diagnoses them outside literals.
	[
		{
			line: 'x\u2028y',
			tokens: [
				{ startIndex: 0, type: 'identifier.mojo' },
				{ startIndex: 1, type: 'invalid.mojo' },
				{ startIndex: 2, type: 'identifier.mojo' }
			]
		}
	],
	[
		{
			line: 'x\u2029y',
			tokens: [
				{ startIndex: 0, type: 'identifier.mojo' },
				{ startIndex: 1, type: 'invalid.mojo' },
				{ startIndex: 2, type: 'identifier.mojo' }
			]
		}
	],
	// Upstream tests assert expressions, but not the soft identifier "where" here.
	[
		{
			line: 'comptime assert where, "ready"',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 8, type: 'white.mojo' },
				{ startIndex: 9, type: 'keyword.mojo' },
				{ startIndex: 15, type: 'white.mojo' },
				{ startIndex: 16, type: 'identifier.mojo' },
				{ startIndex: 21, type: 'delimiter.mojo' },
				{ startIndex: 22, type: 'white.mojo' },
				{ startIndex: 23, type: 'string.mojo' }
			]
		},
		{ line: 'where', tokens: [{ startIndex: 0, type: 'identifier.mojo' }] }
	],
	[
		{
			line: 'comptime assert `where`',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 8, type: 'white.mojo' },
				{ startIndex: 9, type: 'keyword.mojo' },
				{ startIndex: 15, type: 'white.mojo' },
				{ startIndex: 16, type: 'identifier.mojo' }
			]
		}
	]
]);
