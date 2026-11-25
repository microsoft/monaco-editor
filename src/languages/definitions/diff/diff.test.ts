/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('diff', [
	// git header, then a hunk
	[
		{ line: 'diff --git a/a.txt b/a.txt', tokens: [{ startIndex: 0, type: 'keyword.diff' }] },
		{ line: 'index 3b18e51..a2c4f0d 100644', tokens: [{ startIndex: 0, type: 'keyword.diff' }] },
		{ line: '--- a/a.txt', tokens: [{ startIndex: 0, type: 'keyword.diff' }] },
		{ line: '+++ b/a.txt', tokens: [{ startIndex: 0, type: 'keyword.diff' }] },
		{ line: '@@ -1,3 +1,3 @@ function f()', tokens: [{ startIndex: 0, type: 'metatag.diff' }] },
		{ line: ' context', tokens: [{ startIndex: 0, type: '' }] },
		{ line: '-removed', tokens: [{ startIndex: 0, type: 'string.deleted.diff' }] },
		{ line: '+added', tokens: [{ startIndex: 0, type: 'number.inserted.diff' }] },
		{ line: '\\ No newline at end of file', tokens: [{ startIndex: 0, type: 'comment.diff' }] }
	],
	// inside a hunk, a removed line that starts with '-- ' is content, not a file header
	[
		{ line: '@@ -1,2 +1,1 @@', tokens: [{ startIndex: 0, type: 'metatag.diff' }] },
		{ line: '--- a SQL comment', tokens: [{ startIndex: 0, type: 'string.deleted.diff' }] },
		{ line: '+++ added with plus signs', tokens: [{ startIndex: 0, type: 'number.inserted.diff' }] }
	],
	// a second file in the same patch starts with a new header
	[
		{ line: '@@ -1 +1 @@', tokens: [{ startIndex: 0, type: 'metatag.diff' }] },
		{ line: '-a', tokens: [{ startIndex: 0, type: 'string.deleted.diff' }] },
		{ line: 'diff --git a/b.txt b/b.txt', tokens: [{ startIndex: 0, type: 'keyword.diff' }] },
		{ line: '--- a/b.txt', tokens: [{ startIndex: 0, type: 'keyword.diff' }] },
		{ line: '+++ b/b.txt', tokens: [{ startIndex: 0, type: 'keyword.diff' }] },
		{ line: '@@ -1 +1 @@', tokens: [{ startIndex: 0, type: 'metatag.diff' }] },
		{ line: '+b', tokens: [{ startIndex: 0, type: 'number.inserted.diff' }] }
	],
	// plain text before the first header is left alone
	[
		{ line: 'Subject: [PATCH] fix', tokens: [{ startIndex: 0, type: '' }] },
		{ line: '---', tokens: [{ startIndex: 0, type: 'keyword.diff' }] }
	]
]);
