/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { languages } from '../../../editor';

export const conf: languages.LanguageConfiguration = {};

// Tokenizes unified diffs (`diff -u`, `git diff`, `git format-patch`).
//
// Added and removed lines are emitted as `number.inserted` and `string.deleted`
// so that the built-in themes already show them in a green and a red tone;
// a custom theme can target `inserted` / `deleted` instead.
export const language = <languages.IMonarchLanguage>{
	defaultToken: '',
	tokenPostfix: '.diff',

	tokenizer: {
		// Before the first hunk of a file: the file header lines.
		root: [
			[/^@@.*$/, 'metatag', '@hunk'],
			[/^(?:---|\+\+\+)(?:\s.*)?$/, 'keyword'],
			[
				/^(?:diff|index|Index:|new file mode|deleted file mode|old mode|new mode|similarity index|dissimilarity index|rename from|rename to|copy from|copy to|Binary files|GIT binary patch).*$/,
				'keyword'
			],
			[/^=+$/, 'delimiter'],
			[/.*$/, '']
		],

		// Inside a hunk: every line starts with '+', '-', ' ' or '\'.
		hunk: [
			[/^@@.*$/, 'metatag'],
			[/^diff\s.*$/, { token: 'keyword', next: '@pop' }],
			[/^Index:.*$/, { token: 'keyword', next: '@pop' }],
			[/^\+.*$/, 'number.inserted'],
			[/^-.*$/, 'string.deleted'],
			[/^\\.*$/, 'comment'],
			[/.*$/, '']
		]
	}
};
