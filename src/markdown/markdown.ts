/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import IRichLanguageConfiguration = monaco.languages.LanguageConfiguration;
import ILanguage = monaco.languages.IMonarchLanguage;

const TOKEN_HEADER_LEAD = 'keyword';
const TOKEN_HEADER = 'keyword';
const TOKEN_EXT_HEADER = 'keyword';
const TOKEN_SEPARATOR = 'meta.separator';
const TOKEN_QUOTE = 'comment';
const TOKEN_LIST = 'keyword';
const TOKEN_BLOCK = 'string';
const TOKEN_BLOCK_CODE = 'variable.source';

const DELIM_ASSIGN = 'delimiter.html';
const ATTRIB_NAME = 'attribute.name.html';
const ATTRIB_VALUE = 'string.html';

function getTag(name: string) {
	return 'tag';
}

export const conf: IRichLanguageConfiguration = {
	comments: {
		blockComment: ['<!--', '-->',]
	},
	brackets: [
		['{', '}'],
		['[', ']'],
		['(', ')']
	],
	autoClosingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '<', close: '>', notIn: ['string'] }
	],
	surroundingPairs: [
		{ open: '(', close: ')' },
		{ open: '[', close: ']' },
		{ open: '`', close: '`' },
	]
};

export const language = <ILanguage>{
	defaultToken: '',
	tokenPostfix: '.md',

	// escape codes
	control: /[\\`*_\[\]{}()#+\-\.!]/,
	noncontrol: /[^\\`*_\[\]{}()#+\-\.!]/,
	escapes: /\\(?:@control)/,

	// escape codes for javascript/CSS strings
	jsescapes: /\\(?:[btnfr\\"']|[0-7][0-7]?|[0-3][0-7]{2})/,

	// non matched elements
	empty: [
		'area', 'base', 'basefont', 'br', 'col', 'frame',
		'hr', 'img', 'input', 'isindex', 'link', 'meta', 'param'
	],

	tokenizer: {
		root: [

			// headers (with #)
			[/^(\s{0,3})(#+)((?:[^\\#]|@escapes)+)((?:#+)?)/, ['white', TOKEN_HEADER_LEAD, TOKEN_HEADER, TOKEN_HEADER]],

			// headers (with =)
			[/^\s*(=+|\-+)\s*$/, TOKEN_EXT_HEADER],

			// headers (with ***)
			[/^\s*((\*[ ]?)+)\s*$/, TOKEN_SEPARATOR],

			// quote
			[/^\s*>+/, TOKEN_QUOTE],

			// list (starting with * or number)
			[/^\s*([\*\-+:]|\d+\.)\s/, TOKEN_LIST],

			// code block (4 spaces indent)
			[/^(\t|[ ]{4})[^ ].*$/, TOKEN_BLOCK],

			// code block (3 tilde)
			[/^\s*~~~\s*((?:\w|[\/\-#])+)?\s*$/, { token: TOKEN_BLOCK, next: '@codeblock' }],

			// github style code blocks (with backticks and language)
			[/^\s*```\s*((?:\w|[\/\-#])+)\s*$/, { token: TOKEN_BLOCK, next: '@codeblockgh', nextEmbedded: '$1' }],

			// github style code blocks (with backticks but no language)
			[/^\s*```\s*$/, { token: TOKEN_BLOCK, next: '@codeblock' }],

			// markup within lines
			{ include: '@linecontent' },
		],

		codeblock: [
			[/^\s*~~~\s*$/, { token: TOKEN_BLOCK, next: '@pop' }],
			[/^\s*```\s*$/, { token: TOKEN_BLOCK, next: '@pop' }],
			[/.*$/, TOKEN_BLOCK_CODE],
		],

		// github style code blocks
		codeblockgh: [
			[/```\s*$/, { token: TOKEN_BLOCK_CODE, next: '@pop', nextEmbedded: '@pop' }],
			[/[^`]+/, TOKEN_BLOCK_CODE],
		],

		linecontent: [

			// escapes
			[/&\w+;/, 'string.escape'],
			[/@escapes/, 'escape'],

			// various markup
			[/\b__([^\\_]|@escapes|_(?!_))+__\b/, 'strong'],
			[/\*\*([^\\*]|@escapes|\*(?!\*))+\*\*/, 'strong'],
			[/\b_[^_]+_\b/, 'emphasis'],
			[/\*([^\\*]|@escapes)+\*/, 'emphasis'],
			[/`([^\\`]|@escapes)+`/, 'variable'],

			// links
			[/\{[^}]+\}/, 'string.target'],
			[/(!?\[)((?:[^\]\\]|@escapes)*)(\]\([^\)]+\))/, ['string.link', '', 'string.link']],
			[/(!?\[)((?:[^\]\\]|@escapes)*)(\])/, 'string.link'],

			// or html
			{ include: 'html' },
		],

		// Note: it is tempting to rather switch to the real HTML mode instead of building our own here
		// but currently there is a limitation in Monarch that prevents us from doing it: The opening
		// '<' would start the HTML mode, however there is no way to jump 1 character back to let the
		// HTML mode also tokenize the opening angle bracket. Thus, even though we could jump to HTML,
		// we cannot correctly tokenize it in that mode yet.
		html: [
			// html tags
			[/<(\w+)\/>/, getTag('$1')],
			[/<(\w+)/, {
				cases: {
					'@empty': { token: getTag('$1'), next: '@tag.$1' },
					'@default': { token: getTag('$1'), next: '@tag.$1' }
				}
			}],
			[/<\/(\w+)\s*>/, { token: getTag('$1') }],

			[/<!--/, 'comment', '@comment']
		],

		comment: [
			[/[^<\-]+/, 'comment.content'],
			[/-->/, 'comment', '@pop'],
			[/<!--/, 'comment.content.invalid'],
			[/[<\-]/, 'comment.content']
		],

		// Almost full HTML tag matching, complete with embedded scripts & styles
		tag: [
			[/[ \t\r\n]+/, 'white'],
			[/(type)(\s*=\s*)(")([^"]+)(")/, [ATTRIB_NAME, DELIM_ASSIGN, ATTRIB_VALUE,
				{ token: ATTRIB_VALUE, switchTo: '@tag.$S2.$4' },
				ATTRIB_VALUE]],
			[/(type)(\s*=\s*)(')([^']+)(')/, [ATTRIB_NAME, DELIM_ASSIGN, ATTRIB_VALUE,
				{ token: ATTRIB_VALUE, switchTo: '@tag.$S2.$4' },
				ATTRIB_VALUE]],
			[/(\w+)(\s*=\s*)("[^"]*"|'[^']*')/, [ATTRIB_NAME, DELIM_ASSIGN, ATTRIB_VALUE]],
			[/\w+/, ATTRIB_NAME],
			[/\/>/, getTag('$S2'), '@pop'],
			[/>/, {
				cases: {
					'$S2==style': { token: getTag('$S2'), switchTo: 'embeddedStyle', nextEmbedded: 'text/css' },
					'$S2==script': {
						cases: {
							'$S3': { token: getTag('$S2'), switchTo: 'embeddedScript', nextEmbedded: '$S3' },
							'@default': { token: getTag('$S2'), switchTo: 'embeddedScript', nextEmbedded: 'text/javascript' }
						}
					},
					'@default': { token: getTag('$S2'), next: '@pop' }
				}
			}],
		],

		embeddedStyle: [
			[/[^<]+/, ''],
			[/<\/style\s*>/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }],
			[/</, '']
		],

		embeddedScript: [
			[/[^<]+/, ''],
			[/<\/script\s*>/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }],
			[/</, '']
		],
	}
};
