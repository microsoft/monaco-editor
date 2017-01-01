/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import IRichLanguageConfiguration = monaco.languages.LanguageConfiguration;
import ILanguage = monaco.languages.IMonarchLanguage;

export var conf:IRichLanguageConfiguration = {
	comments: {
		blockComment: ['<!--', '-->'],
	},
	brackets: [['{','}'],['[',']'],['(',')'],['<','>']],
	autoClosingPairs: [
		{ open: '\'', close: '\'', notIn: ['string', 'comment'] },
		{ open: '"', close: '"', notIn: ['string', 'comment'] },
	]
	// enhancedBrackets: [{
	// 	tokenType: 'tag.tag-$1.xml',
	// 	openTrigger: '>',
	// 	open: /<(\w[\w\d]*)([^\/>]*(?!\/)>)[^<>]*$/i,
	// 	closeComplete: '</$1>',
	// 	closeTrigger: '>',
	// 	close: /<\/(\w[\w\d]*)\s*>$/i
	// }],
};

export var language = <ILanguage> {
	defaultToken: '',
	tokenPostfix: '.xml',

	ignoreCase: true,

	// Useful regular expressions
	qualifiedName: /(?:[\w\.\-]+:)?[\w\.\-]+/,

	tokenizer: {
		root: [
			[/[^<&]+/, ''],

			{ include: '@whitespace' },

			// Standard opening tag
			[/(<)(@qualifiedName)/, [
				{ token: 'delimiter' },
				{ token: 'tag', next: '@tag' }]],

			// Standard closing tag
			[/(<\/)(@qualifiedName)(\s*)(>)/, [
				{ token: 'delimiter' },
				{ token: 'tag' },
				'',
				{ token: 'delimiter' }]],

			// Meta tags - instruction
			[/(<\?)(@qualifiedName)/, [
				{ token: 'delimiter' },
				{ token: 'metatag', next: '@tag' }]],

			// Meta tags - declaration
			[/(<\!)(@qualifiedName)/, [
				{ token: 'delimiter' },
				{ token: 'metatag', next: '@tag' }]],

			// CDATA
			[/<\!\[CDATA\[/, { token: 'delimiter.cdata', next: '@cdata' }],

			[/&\w+;/, 'string.escape'],
		],

		cdata: [
			[/[^\]]+/, ''],
			[/\]\]>/, { token: 'delimiter.cdata', next: '@pop' }],
			[/\]/, '']
		],

		tag: [
			[/[ \t\r\n]+/, '' ],
			[/(@qualifiedName)(\s*=\s*)("[^"]*"|'[^']*')/, ['attribute.name', '', 'attribute.value']],
			[/(@qualifiedName)(\s*=\s*)("[^">?\/]*|'[^'>?\/]*)(?=[\?\/]\>)/, ['attribute.name', '', 'attribute.value']],
			[/(@qualifiedName)(\s*=\s*)("[^">]*|'[^'>]*)/, ['attribute.name', '', 'attribute.value']],
			[/@qualifiedName/, 'attribute.name'],
			[/\?>/, { token: 'delimiter', next: '@pop' }],
			[/(\/)(>)/, [
				{ token: 'tag' },
				{ token: 'delimiter', next: '@pop' }]],
			[/>/, { token: 'delimiter', next: '@pop' }],
		],

		whitespace: [
			[/[ \t\r\n]+/, ''],
			[/<!--/, { token: 'comment', next: '@comment' }]
		],

		comment: [
			[/[^<\-]+/, 'comment.content' ],
			[/-->/,  { token: 'comment', next: '@pop' } ],
			[/<!--/, 'comment.content.invalid'],
			[/[<\-]/, 'comment.content' ]
		],
	},
};