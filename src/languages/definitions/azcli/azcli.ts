/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { languages } from '../../../editor';

export const conf: languages.LanguageConfiguration = {
	comments: {
		lineComment: '#'
	}
};

export const language = <languages.IMonarchLanguage>{
	defaultToken: 'keyword',
	ignoreCase: true,
	tokenPostfix: '.azcli',

	str: /[^#\s]/,

	tokenizer: {
		root: [
			{ include: '@comment' },
			[
				/\s-+@str*\s*/,
				{
					cases: {
						'@eos': { token: 'key.identifier', next: '@popall' },
						'@default': { token: 'key.identifier', next: '@type' }
					}
				}
			],
			[
				/^-+@str*\s*/,
				{
					cases: {
						'@eos': { token: 'key.identifier', next: '@popall' },
						'@default': { token: 'key.identifier', next: '@type' }
					}
				}
			]
		],

		type: [
			{ include: '@comment' },
			[
				/-+@str*\s*/,
				{
					cases: {
						'@eos': { token: 'key.identifier', next: '@popall' },
						'@default': 'key.identifier'
					}
				}
			],
			[
				/@str+\s*/,
				{
					cases: {
						'@eos': { token: 'string', next: '@popall' },
						'@default': 'string'
					}
				}
			]
		],

		comment: [
			[
				/#.*$/,
				{
					cases: {
						'@eos': { token: 'comment', next: '@popall' }
					}
				}
			]
		]
	}
};
