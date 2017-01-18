/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import IRichLanguageConfiguration = monaco.languages.LanguageConfiguration;
import ILanguage = monaco.languages.IMonarchLanguage;

// Allow for running under nodejs/requirejs in tests
var _monaco: typeof monaco = (typeof monaco === 'undefined' ? (<any>self).monaco : monaco);

const EMPTY_ELEMENTS:string[] = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr'];

export var conf:IRichLanguageConfiguration = {
	wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\$\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\s]+)/g,

	comments: {
		blockComment: ['{{!--', '--}}']
	},

	brackets: [
		['<!--', '-->'],
		['{{', '}}'],
		['<', '>'],
		['{', '}'],
		['(', ')']
	],

	autoClosingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"' },
		{ open: '\'', close: '\'' }
	],

	surroundingPairs: [
		{ open: '<', close: '>' },
		{ open: '"', close: '"' },
		{ open: '\'', close: '\'' }
	],

	onEnterRules: [
		{
			beforeText: new RegExp(`<(?!(?:${EMPTY_ELEMENTS.join('|')}))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$`, 'i'),
			afterText: /^<\/(\w[\w\d]*)\s*>$/i,
			action: { indentAction: _monaco.languages.IndentAction.IndentOutdent }
		},
		{
			beforeText: new RegExp(`<(?!(?:${EMPTY_ELEMENTS.join('|')}))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$`, 'i'),
			action: { indentAction: _monaco.languages.IndentAction.Indent }
		}
	],
}

export const htmlTokenTypes = {
	DELIM_START: 'delimiter.html',
	DELIM_END: 'delimiter.html',
	DELIM_COMMENT: 'comment.html',
	COMMENT: 'comment.content.html',
	getTag: (name: string) => {
		return 'tag.html';
	}
};

export var language = <ILanguage> {
	defaultToken: '',
	tokenPostfix: '',
	// ignoreCase: true,

	// The main tokenizer for our languages
	tokenizer: {
		root: [
			[/\{\{/, { token: '@rematch', switchTo: '@handlebarsInSimpleState.root' }],
			[/<!DOCTYPE/, 'metatag.html', '@doctype'],
			[/<!--/, 'comment.html', '@comment'],
			[/(<)(\w+)(\/>)/, [htmlTokenTypes.DELIM_START, 'tag.html', htmlTokenTypes.DELIM_END]],
			[/(<)(script)/, [htmlTokenTypes.DELIM_START, { token: 'tag.html', next: '@script'} ]],
			[/(<)(style)/, [htmlTokenTypes.DELIM_START, { token: 'tag.html', next: '@style'} ]],
			[/(<)([:\w]+)/, [htmlTokenTypes.DELIM_START, { token: 'tag.html', next: '@otherTag'} ]],
			[/(<\/)(\w+)/, [htmlTokenTypes.DELIM_START, { token: 'tag.html', next: '@otherTag' }]],
			[/</, htmlTokenTypes.DELIM_START],
			[/\{/, htmlTokenTypes.DELIM_START],
			[/[^<{]+/] // text
		],

		doctype: [
			[/\{\{/, { token: '@rematch', switchTo: '@handlebarsInSimpleState.comment' }],
			[/[^>]+/, 'metatag.content.html' ],
			[/>/, 'metatag.html', '@pop' ],
		],

		comment: [
			[/\{\{/, { token: '@rematch', switchTo: '@handlebarsInSimpleState.comment' }],
			[/-->/, 'comment.html', '@pop'],
			[/[^-]+/, 'comment.content.html'],
			[/./, 'comment.content.html']
		],

		otherTag: [
			[/\{\{/, { token: '@rematch', switchTo: '@handlebarsInSimpleState.otherTag' }],
			[/\/?>/, htmlTokenTypes.DELIM_END, '@pop'],
			[/"([^"]*)"/, 'attribute.value'],
			[/'([^']*)'/, 'attribute.value'],
			[/[\w\-]+/, 'attribute.name'],
			[/=/, 'delimiter'],
			[/[ \t\r\n]+/], // whitespace
		],

		// -- BEGIN <script> tags handling

		// After <script
		script: [
			[/\{\{/, { token: '@rematch', switchTo: '@handlebarsInSimpleState.script' }],
			[/type/, 'attribute.name', '@scriptAfterType'],
			[/"([^"]*)"/, 'attribute.value'],
			[/'([^']*)'/, 'attribute.value'],
			[/[\w\-]+/, 'attribute.name'],
			[/=/, 'delimiter'],
			[/>/, { token: htmlTokenTypes.DELIM_END, next: '@scriptEmbedded.text/javascript', nextEmbedded: 'text/javascript'} ],
			[/[ \t\r\n]+/], // whitespace
			[/(<\/)(script\s*)(>)/, [ htmlTokenTypes.DELIM_START, 'tag.html', { token: htmlTokenTypes.DELIM_END, next: '@pop' } ]]
		],

		// After <script ... type
		scriptAfterType: [
			[/\{\{/, { token: '@rematch', switchTo: '@handlebarsInSimpleState.scriptAfterType' }],
			[/=/,'delimiter', '@scriptAfterTypeEquals'],
			[/[ \t\r\n]+/], // whitespace
			[/<\/script\s*>/, { token: '@rematch', next: '@pop' }]
		],

		// After <script ... type =
		scriptAfterTypeEquals: [
			[/\{\{/, { token: '@rematch', switchTo: '@handlebarsInSimpleState.scriptAfterTypeEquals' }],
			[/"([^"]*)"/, { token: 'attribute.value', switchTo: '@scriptWithCustomType.$1' } ],
			[/'([^']*)'/, { token: 'attribute.value', switchTo: '@scriptWithCustomType.$1' } ],
			[/[ \t\r\n]+/], // whitespace
			[/<\/script\s*>/, { token: '@rematch', next: '@pop' }]
		],

		// After <script ... type = $S2
		scriptWithCustomType: [
			[/\{\{/, { token: '@rematch', switchTo: '@handlebarsInSimpleState.scriptWithCustomType.$S2' }],
			[/>/, { token: htmlTokenTypes.DELIM_END, next: '@scriptEmbedded.$S2', nextEmbedded: '$S2'}],
			[/"([^"]*)"/, 'attribute.value'],
			[/'([^']*)'/, 'attribute.value'],
			[/[\w\-]+/, 'attribute.name'],
			[/=/, 'delimiter'],
			[/[ \t\r\n]+/], // whitespace
			[/<\/script\s*>/, { token: '@rematch', next: '@pop' }]
		],

		scriptEmbedded: [
			[/\{\{/, { token: '@rematch', switchTo: '@handlebarsInEmbeddedState.scriptEmbedded.$S2', nextEmbedded: '@pop' }],
			[/<\/script/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }]
		],

		// -- END <script> tags handling


		// -- BEGIN <style> tags handling

		// After <style
		style: [
			[/\{\{/, { token: '@rematch', switchTo: '@handlebarsInSimpleState.style' }],
			[/type/, 'attribute.name', '@styleAfterType'],
			[/"([^"]*)"/, 'attribute.value'],
			[/'([^']*)'/, 'attribute.value'],
			[/[\w\-]+/, 'attribute.name'],
			[/=/, 'delimiter'],
			[/>/, { token: htmlTokenTypes.DELIM_END, next: '@styleEmbedded.text/css', nextEmbedded: 'text/css'} ],
			[/[ \t\r\n]+/], // whitespace
			[/(<\/)(style\s*)(>)/, [htmlTokenTypes.DELIM_START, 'tag.html', { token: htmlTokenTypes.DELIM_END, next: '@pop' } ]]
		],

		// After <style ... type
		styleAfterType: [
			[/\{\{/, { token: '@rematch', switchTo: '@handlebarsInSimpleState.styleAfterType' }],
			[/=/,'delimiter', '@styleAfterTypeEquals'],
			[/[ \t\r\n]+/], // whitespace
			[/<\/style\s*>/, { token: '@rematch', next: '@pop' }]
		],

		// After <style ... type =
		styleAfterTypeEquals: [
			[/\{\{/, { token: '@rematch', switchTo: '@handlebarsInSimpleState.styleAfterTypeEquals' }],
			[/"([^"]*)"/, { token: 'attribute.value', switchTo: '@styleWithCustomType.$1' } ],
			[/'([^']*)'/, { token: 'attribute.value', switchTo: '@styleWithCustomType.$1' } ],
			[/[ \t\r\n]+/], // whitespace
			[/<\/style\s*>/, { token: '@rematch', next: '@pop' }]
		],

		// After <style ... type = $S2
		styleWithCustomType: [
			[/\{\{/, { token: '@rematch', switchTo: '@handlebarsInSimpleState.styleWithCustomType.$S2' }],
			[/>/, { token: htmlTokenTypes.DELIM_END, next: '@styleEmbedded.$S2', nextEmbedded: '$S2'}],
			[/"([^"]*)"/, 'attribute.value'],
			[/'([^']*)'/, 'attribute.value'],
			[/[\w\-]+/, 'attribute.name'],
			[/=/, 'delimiter'],
			[/[ \t\r\n]+/], // whitespace
			[/<\/style\s*>/, { token: '@rematch', next: '@pop' }]
		],

		styleEmbedded: [
			[/\{\{/, { token: '@rematch', switchTo: '@handlebarsInEmbeddedState.styleEmbedded.$S2', nextEmbedded: '@pop' }],
			[/<\/style/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }]
		],

		// -- END <style> tags handling


		handlebarsInSimpleState: [
			[/\{\{\{?/, 'delimiter.handlebars'],
			[/\}\}\}?/, { token: 'delimiter.handlebars', switchTo: '@$S2.$S3' }],
			{ include: 'handlebarsRoot' }
		],

		handlebarsInEmbeddedState: [
			[/\{\{\{?/, 'delimiter.handlebars'],
			[/\}\}\}?/, { token: 'delimiter.handlebars', switchTo: '@$S2.$S3', nextEmbedded: '$S3' }],
			{ include: 'handlebarsRoot' }
		],

		handlebarsRoot: [
			[/[#/][^\s}]+/, 'keyword.helper.handlebars'],
			[/else\b/, 'keyword.helper.handlebars'],
			[/[\s]+/],
			[/[^}]/, 'variable.parameter.handlebars'],
		],
	},
};