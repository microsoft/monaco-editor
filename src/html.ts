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
		blockComment: ['<!--', '-->']
	},

	brackets: [
		['<!--', '-->'],
		['<', '>'],
	],

	__electricCharacterSupport: {
		embeddedElectricCharacters: ['*', '}', ']', ')']
	},

	autoClosingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"' },
		{ open: '\'', close: '\'' }
	],

	surroundingPairs: [
		{ open: '"', close: '"' },
		{ open: '\'', close: '\'' }
	],

	onEnterRules: [
		{
			beforeText: new RegExp(`<(?!(?:${EMPTY_ELEMENTS.join('|')}))([_:\\w][_:\\w-.\\d]*)([^/>]*(?!/)>)[^<]*$`, 'i'),
			afterText: /^<\/([_:\w][_:\w-.\d]*)\s*>$/i,
			action: { indentAction: _monaco.languages.IndentAction.IndentOutdent }
		},
		{
			beforeText: new RegExp(`<(?!(?:${EMPTY_ELEMENTS.join('|')}))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$`, 'i'),
			action: { indentAction: _monaco.languages.IndentAction.Indent }
		}
	],
};

export const htmlTokenTypes = {
	DELIM_START: 'start.delimiter.tag',
	DELIM_END: 'end.delimiter.tag',
	DELIM_COMMENT: 'comment',
	getTag: (name: string) => {
		return 'tag';
	}
};

export var language = <ILanguage> {
	defaultToken: '',
	tokenPostfix: '.html',
	ignoreCase: true,

	// The main tokenizer for our languages
	tokenizer: {
		root: [
			[/<!DOCTYPE/, 'metatag', '@doctype'],
			[/<!--/, 'comment', '@comment'],
			[/(<)(\w+)(\/>)/, [htmlTokenTypes.DELIM_START, 'tag', htmlTokenTypes.DELIM_END]],
			[/(<)(script)/, [htmlTokenTypes.DELIM_START, { token: 'tag', next: '@script'} ]],
			[/(<)(style)/, [htmlTokenTypes.DELIM_START, { token: 'tag', next: '@style'} ]],
			[/(<)([:\w]+)/, [htmlTokenTypes.DELIM_START, { token: 'tag', next: '@otherTag'} ]],
			[/(<\/)(\w+)/, [htmlTokenTypes.DELIM_START, { token: 'tag', next: '@otherTag' }]],
			[/</, htmlTokenTypes.DELIM_START],
			[/[^<]+/], // text
		],

		doctype: [
			[/[^>]+/, 'metatag.content' ],
			[/>/, 'metatag', '@pop' ],
		],

		comment: [
			[/-->/, 'comment', '@pop'],
			[/[^-]+/, 'comment.content'],
			[/./, 'comment.content']
		],

		otherTag: [
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
			[/type/, 'attribute.name', '@scriptAfterType'],
			[/"([^"]*)"/, 'attribute.value'],
			[/'([^']*)'/, 'attribute.value'],
			[/[\w\-]+/, 'attribute.name'],
			[/=/, 'delimiter'],
			[/>/, { token: htmlTokenTypes.DELIM_END, next: '@scriptEmbedded', nextEmbedded: 'text/javascript'} ],
			[/[ \t\r\n]+/], // whitespace
			[/(<\/)(script\s*)(>)/, [ htmlTokenTypes.DELIM_START, 'tag', { token: htmlTokenTypes.DELIM_END, next: '@pop' } ]]
		],

		// After <script ... type
		scriptAfterType: [
			[/=/,'delimiter', '@scriptAfterTypeEquals'],
			[/[ \t\r\n]+/], // whitespace
			[/<\/script\s*>/, { token: '@rematch', next: '@pop' }]
		],

		// After <script ... type =
		scriptAfterTypeEquals: [
			[/"([^"]*)"/, { token: 'attribute.value', switchTo: '@scriptWithCustomType.$1' } ],
			[/'([^']*)'/, { token: 'attribute.value', switchTo: '@scriptWithCustomType.$1' } ],
			[/[ \t\r\n]+/], // whitespace
			[/<\/script\s*>/, { token: '@rematch', next: '@pop' }]
		],

		// After <script ... type = $S2
		scriptWithCustomType: [
			[/>/, { token: htmlTokenTypes.DELIM_END, next: '@scriptEmbedded.$S2', nextEmbedded: '$S2'}],
			[/"([^"]*)"/, 'attribute.value'],
			[/'([^']*)'/, 'attribute.value'],
			[/[\w\-]+/, 'attribute.name'],
			[/=/, 'delimiter'],
			[/[ \t\r\n]+/], // whitespace
			[/<\/script\s*>/, { token: '@rematch', next: '@pop' }]
		],

		scriptEmbedded: [
			[/<\/script/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }]
		],

		// -- END <script> tags handling


		// -- BEGIN <style> tags handling

		// After <style
		style: [
			[/type/, 'attribute.name', '@styleAfterType'],
			[/"([^"]*)"/, 'attribute.value'],
			[/'([^']*)'/, 'attribute.value'],
			[/[\w\-]+/, 'attribute.name'],
			[/=/, 'delimiter'],
			[/>/, { token: htmlTokenTypes.DELIM_END, next: '@styleEmbedded', nextEmbedded: 'text/css'} ],
			[/[ \t\r\n]+/], // whitespace
			[/(<\/)(style\s*)(>)/, [htmlTokenTypes.DELIM_START, 'tag', { token: htmlTokenTypes.DELIM_END, next: '@pop' } ]]
		],

		// After <style ... type
		styleAfterType: [
			[/=/,'delimiter', '@styleAfterTypeEquals'],
			[/[ \t\r\n]+/], // whitespace
			[/<\/style\s*>/, { token: '@rematch', next: '@pop' }]
		],

		// After <style ... type =
		styleAfterTypeEquals: [
			[/"([^"]*)"/, { token: 'attribute.value', switchTo: '@styleWithCustomType.$1' } ],
			[/'([^']*)'/, { token: 'attribute.value', switchTo: '@styleWithCustomType.$1' } ],
			[/[ \t\r\n]+/], // whitespace
			[/<\/style\s*>/, { token: '@rematch', next: '@pop' }]
		],

		// After <style ... type = $S2
		styleWithCustomType: [
			[/>/, { token: htmlTokenTypes.DELIM_END, next: '@styleEmbedded.$S2', nextEmbedded: '$S2'}],
			[/"([^"]*)"/, 'attribute.value'],
			[/'([^']*)'/, 'attribute.value'],
			[/[\w\-]+/, 'attribute.name'],
			[/=/, 'delimiter'],
			[/[ \t\r\n]+/], // whitespace
			[/<\/style\s*>/, { token: '@rematch', next: '@pop' }]
		],

		styleEmbedded: [
			[/<\/style/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }]
		],

	// -- END <style> tags handling
	},
};

// TESTED WITH:

// <!DOCTYPE html>
// <html>
// <head>
//   <title>Monarch Workbench</title>
//   <meta http-equiv="X-UA-Compatible" content="IE=edge" />
//   <!----
//   -- -- -- a comment -- -- --
//   ---->
//   <style bah="bah">
//     body { font-family: Consolas; } /* nice */
//   </style>
// </head
// >
// a = "asd"
// <body>
//   <br/>
//   <div
//   class
//   =
//   "test"
//   >
//     <script>
//       function() {
//         alert("hi </ script>"); // javascript
//       };
//     </script>
//     <script
// 	bah="asdfg"
// 	type="text/css"
// 	>
//   .bar { text-decoration: underline; }
//     </script>
//   </div>
// </body>
// </html>
