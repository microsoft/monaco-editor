/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { languages } from '../../../editor';

const EMPTY_ELEMENTS: string[] = [
	'area',
	'base',
	'br',
	'col',
	'embed',
	'hr',
	'img',
	'input',
	'keygen',
	'link',
	'menuitem',
	'meta',
	'param',
	'source',
	'track',
	'wbr'
];

function returnToRazorHost(token: string): languages.IMonarchLanguageAction {
	return {
		cases: {
			'$S2==embedded': {
				token,
				switchTo: '@$S3.$S4',
				nextEmbedded: '$S4'
			},
			'@default': { token, switchTo: '@$S3.$S4' }
		}
	};
}

const rematchToRazorHost = returnToRazorHost('@rematch');
const resumeRazorHost = returnToRazorHost('');
const completeControlToRazorHost = returnToRazorHost('delimiter.cs');

export const conf: languages.LanguageConfiguration = {
	wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\$\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\s]+)/g,

	comments: {
		blockComment: ['<!--', '-->']
	},

	brackets: [
		['<!--', '-->'],
		['<', '>'],
		['{', '}'],
		['(', ')']
	],

	autoClosingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"' },
		{ open: "'", close: "'" }
	],

	surroundingPairs: [
		{ open: '"', close: '"' },
		{ open: "'", close: "'" },
		{ open: '<', close: '>' }
	],

	onEnterRules: [
		{
			beforeText: new RegExp(
				`<(?!(?:${EMPTY_ELEMENTS.join('|')}))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$`,
				'i'
			),
			afterText: /^<\/(\w[\w\d]*)\s*>$/i,
			action: {
				indentAction: languages.IndentAction.IndentOutdent
			}
		},
		{
			beforeText: new RegExp(
				`<(?!(?:${EMPTY_ELEMENTS.join('|')}))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$`,
				'i'
			),
			action: { indentAction: languages.IndentAction.Indent }
		}
	]
};

export const language = <languages.IMonarchLanguage>{
	defaultToken: '',
	tokenPostfix: '',
	// ignoreCase: true,

	// The main tokenizer for our languages
	tokenizer: {
		root: [
			[/@@@@/], // text
			[/@[^@]/, { token: '@rematch', switchTo: '@razorInSimpleState.root' }],
			[/<!DOCTYPE/, 'metatag.html', '@doctype'],
			[/<!--/, 'comment.html', '@comment'],
			[/(<)([\w\-]+)(\/>)/, ['delimiter.html', 'tag.html', 'delimiter.html']],
			[/(<)(script)/, ['delimiter.html', { token: 'tag.html', next: '@script' }]],
			[/(<)(style)/, ['delimiter.html', { token: 'tag.html', next: '@style' }]],
			[/(<)([:\w\-]+)/, ['delimiter.html', { token: 'tag.html', next: '@otherTag' }]],
			[/(<\/)([\w\-]+)/, ['delimiter.html', { token: 'tag.html', next: '@otherTag' }]],
			[/</, 'delimiter.html'],
			[/[ \t\r\n]+/], // whitespace
			[/[^<@]+/] // text
		],

		doctype: [
			[/@[^@]/, { token: '@rematch', switchTo: '@razorInSimpleState.comment' }],
			[/[^>]+/, 'metatag.content.html'],
			[/>/, 'metatag.html', '@pop']
		],

		comment: [
			[/@[^@]/, { token: '@rematch', switchTo: '@razorInSimpleState.comment' }],
			[/-->/, 'comment.html', '@pop'],
			[/[^-]+/, 'comment.content.html'],
			[/./, 'comment.content.html']
		],

		otherTag: [
			[/@razorDirectiveAttribute/, 'attribute.name'],
			[/@[^@]/, { token: '@rematch', switchTo: '@razorInSimpleState.otherTag' }],
			[/\/?>/, 'delimiter.html', '@pop'],
			[/"([^"]*)"/, 'attribute.value'],
			[/'([^']*)'/, 'attribute.value'],
			[/[\w\-]+/, 'attribute.name'],
			[/=/, 'delimiter'],
			[/[ \t\r\n]+/] // whitespace
		],

		// -- BEGIN <script> tags handling

		// After <script
		script: [
			[/@[^@]/, { token: '@rematch', switchTo: '@razorInSimpleState.script' }],
			[/type/, 'attribute.name', '@scriptAfterType'],
			[/"([^"]*)"/, 'attribute.value'],
			[/'([^']*)'/, 'attribute.value'],
			[/[\w\-]+/, 'attribute.name'],
			[/=/, 'delimiter'],
			[
				/>/,
				{
					token: 'delimiter.html',
					next: '@scriptEmbedded.text/javascript',
					nextEmbedded: 'text/javascript'
				}
			],
			[/[ \t\r\n]+/], // whitespace
			[
				/(<\/)(script\s*)(>)/,
				['delimiter.html', 'tag.html', { token: 'delimiter.html', next: '@pop' }]
			]
		],

		// After <script ... type
		scriptAfterType: [
			[
				/@[^@]/,
				{
					token: '@rematch',
					switchTo: '@razorInSimpleState.scriptAfterType'
				}
			],
			[/=/, 'delimiter', '@scriptAfterTypeEquals'],
			[
				/>/,
				{
					token: 'delimiter.html',
					next: '@scriptEmbedded.text/javascript',
					nextEmbedded: 'text/javascript'
				}
			], // cover invalid e.g. <script type>
			[/[ \t\r\n]+/], // whitespace
			[/<\/script\s*>/, { token: '@rematch', next: '@pop' }]
		],

		// After <script ... type =
		scriptAfterTypeEquals: [
			[
				/@[^@]/,
				{
					token: '@rematch',
					switchTo: '@razorInSimpleState.scriptAfterTypeEquals'
				}
			],
			[
				/"([^"]*)"/,
				{
					token: 'attribute.value',
					switchTo: '@scriptWithCustomType.$1'
				}
			],
			[
				/'([^']*)'/,
				{
					token: 'attribute.value',
					switchTo: '@scriptWithCustomType.$1'
				}
			],
			[
				/>/,
				{
					token: 'delimiter.html',
					next: '@scriptEmbedded.text/javascript',
					nextEmbedded: 'text/javascript'
				}
			], // cover invalid e.g. <script type=>
			[/[ \t\r\n]+/], // whitespace
			[/<\/script\s*>/, { token: '@rematch', next: '@pop' }]
		],

		// After <script ... type = $S2
		scriptWithCustomType: [
			[
				/@[^@]/,
				{
					token: '@rematch',
					switchTo: '@razorInSimpleState.scriptWithCustomType.$S2'
				}
			],
			[
				/>/,
				{
					token: 'delimiter.html',
					next: '@scriptEmbedded.$S2',
					nextEmbedded: '$S2'
				}
			],
			[/"([^"]*)"/, 'attribute.value'],
			[/'([^']*)'/, 'attribute.value'],
			[/[\w\-]+/, 'attribute.name'],
			[/=/, 'delimiter'],
			[/[ \t\r\n]+/], // whitespace
			[/<\/script\s*>/, { token: '@rematch', next: '@pop' }]
		],

		scriptEmbedded: [
			[
				/@[^@]/,
				{
					token: '@rematch',
					switchTo: '@razorInEmbeddedState.scriptEmbedded.$S2',
					nextEmbedded: '@pop'
				}
			],
			[/<\/script/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }]
		],

		// -- END <script> tags handling

		// -- BEGIN <style> tags handling

		// After <style
		style: [
			[/@[^@]/, { token: '@rematch', switchTo: '@razorInSimpleState.style' }],
			[/type/, 'attribute.name', '@styleAfterType'],
			[/"([^"]*)"/, 'attribute.value'],
			[/'([^']*)'/, 'attribute.value'],
			[/[\w\-]+/, 'attribute.name'],
			[/=/, 'delimiter'],
			[
				/>/,
				{
					token: 'delimiter.html',
					next: '@styleEmbedded.text/css',
					nextEmbedded: 'text/css'
				}
			],
			[/[ \t\r\n]+/], // whitespace
			[
				/(<\/)(style\s*)(>)/,
				['delimiter.html', 'tag.html', { token: 'delimiter.html', next: '@pop' }]
			]
		],

		// After <style ... type
		styleAfterType: [
			[
				/@[^@]/,
				{
					token: '@rematch',
					switchTo: '@razorInSimpleState.styleAfterType'
				}
			],
			[/=/, 'delimiter', '@styleAfterTypeEquals'],
			[
				/>/,
				{
					token: 'delimiter.html',
					next: '@styleEmbedded.text/css',
					nextEmbedded: 'text/css'
				}
			], // cover invalid e.g. <style type>
			[/[ \t\r\n]+/], // whitespace
			[/<\/style\s*>/, { token: '@rematch', next: '@pop' }]
		],

		// After <style ... type =
		styleAfterTypeEquals: [
			[
				/@[^@]/,
				{
					token: '@rematch',
					switchTo: '@razorInSimpleState.styleAfterTypeEquals'
				}
			],
			[
				/"([^"]*)"/,
				{
					token: 'attribute.value',
					switchTo: '@styleWithCustomType.$1'
				}
			],
			[
				/'([^']*)'/,
				{
					token: 'attribute.value',
					switchTo: '@styleWithCustomType.$1'
				}
			],
			[
				/>/,
				{
					token: 'delimiter.html',
					next: '@styleEmbedded.text/css',
					nextEmbedded: 'text/css'
				}
			], // cover invalid e.g. <style type=>
			[/[ \t\r\n]+/], // whitespace
			[/<\/style\s*>/, { token: '@rematch', next: '@pop' }]
		],

		// After <style ... type = $S2
		styleWithCustomType: [
			[
				/@[^@]/,
				{
					token: '@rematch',
					switchTo: '@razorInSimpleState.styleWithCustomType.$S2'
				}
			],
			[
				/>/,
				{
					token: 'delimiter.html',
					next: '@styleEmbedded.$S2',
					nextEmbedded: '$S2'
				}
			],
			[/"([^"]*)"/, 'attribute.value'],
			[/'([^']*)'/, 'attribute.value'],
			[/[\w\-]+/, 'attribute.name'],
			[/=/, 'delimiter'],
			[/[ \t\r\n]+/], // whitespace
			[/<\/style\s*>/, { token: '@rematch', next: '@pop' }]
		],

		styleEmbedded: [
			[
				/@[^@]/,
				{
					token: '@rematch',
					switchTo: '@razorInEmbeddedState.styleEmbedded.$S2',
					nextEmbedded: '@pop'
				}
			],
			[/<\/style/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }]
		],

		// -- END <style> tags handling

		razorInSimpleState: [
			[/@\*/, 'comment.cs', '@razorBlockCommentTopLevel'],
			[
				/(@)(await)(\s+)(foreach|using)\b(?=\s*\()/,
				[
					'metatag.cs',
					'keyword.cs',
					'',
					{
						token: 'keyword.cs',
						switchTo: '@razorControlDirective.simple.$S2.$S3'
					}
				]
			],
			[
				/(@)(using)\b(?=\s*\()/,
				[
					'metatag.cs',
					{
						token: 'keyword.cs',
						switchTo: '@razorControlDirective.simple.$S2.$S3'
					}
				]
			],
			[
				/(@)(@razorControlDirectives)\b/,
				[
					'metatag.cs',
					{
						token: 'keyword.cs',
						switchTo: '@razorControlDirective.simple.$S2.$S3'
					}
				]
			],
			[
				/(@)(@razorBlockDirectives)\b/,
				[
					'metatag.cs',
					{
						token: 'keyword.cs',
						switchTo: '@razorBlockDirective.simple.$S2.$S3'
					}
				]
			],
			[
				/(@)(section)\b/,
				[
					'metatag.cs',
					{
						token: 'keyword.cs',
						switchTo: '@razorSectionDirective.simple.$S2.$S3'
					}
				]
			],
			[
				/(@)(@razorLineDirectives)\b/,
				[
					'metatag.cs',
					{
						token: 'keyword.cs',
						switchTo: '@razorDirectiveLine.simple.$S2.$S3'
					}
				]
			],
			[/@[{(]/, 'metatag.cs', '@razorRootTopLevel'],
			[/(@)(\s*[\w]+)/, ['metatag.cs', { token: 'identifier.cs', switchTo: '@$S2.$S3' }]],
			[/[})]/, { token: 'metatag.cs', switchTo: '@$S2.$S3' }],
			[/\*@/, { token: 'comment.cs', switchTo: '@$S2.$S3' }]
		],

		razorInEmbeddedState: [
			[/@\*/, 'comment.cs', '@razorBlockCommentTopLevel'],
			[
				/(@)(await)(\s+)(foreach|using)\b(?=\s*\()/,
				[
					'metatag.cs',
					'keyword.cs',
					'',
					{
						token: 'keyword.cs',
						switchTo: '@razorControlDirective.embedded.$S2.$S3'
					}
				]
			],
			[
				/(@)(using)\b(?=\s*\()/,
				[
					'metatag.cs',
					{
						token: 'keyword.cs',
						switchTo: '@razorControlDirective.embedded.$S2.$S3'
					}
				]
			],
			[
				/(@)(@razorControlDirectives)\b/,
				[
					'metatag.cs',
					{
						token: 'keyword.cs',
						switchTo: '@razorControlDirective.embedded.$S2.$S3'
					}
				]
			],
			[
				/(@)(@razorBlockDirectives)\b/,
				[
					'metatag.cs',
					{
						token: 'keyword.cs',
						switchTo: '@razorBlockDirective.embedded.$S2.$S3'
					}
				]
			],
			[
				/(@)(section)\b/,
				[
					'metatag.cs',
					{
						token: 'keyword.cs',
						switchTo: '@razorSectionDirective.embedded.$S2.$S3'
					}
				]
			],
			[
				/(@)(@razorLineDirectives)\b/,
				[
					'metatag.cs',
					{
						token: 'keyword.cs',
						switchTo: '@razorDirectiveLine.embedded.$S2.$S3'
					}
				]
			],
			[/@[{(]/, 'metatag.cs', '@razorRootTopLevel'],
			[
				/(@)(\s*[\w]+)/,
				[
					'metatag.cs',
					{
						token: 'identifier.cs',
						switchTo: '@$S2.$S3',
						nextEmbedded: '$S3'
					}
				]
			],
			[
				/[})]/,
				{
					token: 'metatag.cs',
					switchTo: '@$S2.$S3',
					nextEmbedded: '$S3'
				}
			],
			[
				/\*@/,
				{
					token: 'comment.cs',
					switchTo: '@$S2.$S3',
					nextEmbedded: '$S3'
				}
			]
		],

		razorBlockDirective: [
			[/[ \t\r\n]+/],
			[
				/\{/,
				{
					token: 'delimiter.bracket.cs',
					switchTo: '@razorCodeBlockTopLevel.$S2.$S3.$S4'
				}
			],
			[/./, rematchToRazorHost]
		],

		razorControlDirective: [
			[/[ \t\r\n]+/],
			[
				/\(/,
				{
					token: 'delimiter.parenthesis.cs',
					switchTo: '@razorControlParenTopLevel.$S2.$S3.$S4'
				}
			],
			[
				/\{/,
				{
					token: 'delimiter.bracket.cs',
					switchTo: '@razorCodeBlockTopLevel.$S2.$S3.$S4'
				}
			],
			[/./, rematchToRazorHost]
		],

		razorSectionDirective: [
			[/[ \t\r\n]+/],
			[
				/[a-zA-Z_]\w*/,
				{
					token: 'identifier.cs',
					switchTo: '@razorBlockDirective.$S2.$S3.$S4'
				}
			],
			[/./, rematchToRazorHost]
		],

		razorDirectiveLine: [
			[/^/, resumeRazorHost],
			[/\(/, 'delimiter.parenthesis.cs', '@razorParenthesis'],
			[/\[/, 'delimiter.array.cs', '@razorBracket'],
			{ include: 'razorCommon' }
		],

		razorControlParenTopLevel: [
			[/\(/, 'delimiter.parenthesis.cs', '@razorParenthesis'],
			[/\[/, 'delimiter.array.cs', '@razorBracket'],
			[/\{/, 'delimiter.bracket.cs', '@razorCodeBlock'],
			[
				/\)/,
				{
					token: 'delimiter.parenthesis.cs',
					switchTo: '@razorControlAfter.$S2.$S3.$S4'
				}
			],
			{ include: 'razorCommon' }
		],

		razorControlAfter: [
			[/[ \t\r\n]+/],
			[
				/\{/,
				{
					token: 'delimiter.bracket.cs',
					switchTo: '@razorCodeBlockTopLevel.$S2.$S3.$S4'
				}
			],
			[
				/when\b/,
				{
					token: 'keyword.cs',
					switchTo: '@razorControlDirective.$S2.$S3.$S4'
				}
			],
			[/;/, completeControlToRazorHost],
			[/./, rematchToRazorHost]
		],

		razorCodeBlockTopLevel: [
			[/\{/, 'delimiter.bracket.cs', '@razorCodeBlock'],
			[/\(/, 'delimiter.parenthesis.cs', '@razorParenthesis'],
			[/\[/, 'delimiter.array.cs', '@razorBracket'],
			[
				/\}/,
				{
					token: 'delimiter.bracket.cs',
					switchTo: '@razorAfterCodeBlock.$S2.$S3.$S4'
				}
			],
			{ include: 'razorCommon' }
		],

		razorAfterCodeBlock: [
			[/[ \t\r\n]+/],
			[
				/(else)(\s+)(if)\b/,
				[
					'keyword.cs',
					'',
					{
						token: 'keyword.cs',
						switchTo: '@razorControlDirective.$S2.$S3.$S4'
					}
				]
			],
			[
				/(catch|while)\b/,
				{
					token: 'keyword.cs',
					switchTo: '@razorControlDirective.$S2.$S3.$S4'
				}
			],
			[
				/(else|finally)\b/,
				{
					token: 'keyword.cs',
					switchTo: '@razorBlockDirective.$S2.$S3.$S4'
				}
			],
			[/./, rematchToRazorHost]
		],

		razorCodeBlock: [
			[/\{/, 'delimiter.bracket.cs', '@push'],
			[/\}/, 'delimiter.bracket.cs', '@pop'],
			[/\(/, 'delimiter.parenthesis.cs', '@razorParenthesis'],
			[/\[/, 'delimiter.array.cs', '@razorBracket'],
			{ include: 'razorCommon' }
		],

		razorParenthesis: [
			[/\(/, 'delimiter.parenthesis.cs', '@push'],
			[/\)/, 'delimiter.parenthesis.cs', '@pop'],
			[/\{/, 'delimiter.bracket.cs', '@razorCodeBlock'],
			[/\[/, 'delimiter.array.cs', '@razorBracket'],
			{ include: 'razorCommon' }
		],

		razorBracket: [
			[/\[/, 'delimiter.array.cs', '@push'],
			[/\]/, 'delimiter.array.cs', '@pop'],
			[/\{/, 'delimiter.bracket.cs', '@razorCodeBlock'],
			[/\(/, 'delimiter.parenthesis.cs', '@razorParenthesis'],
			{ include: 'razorCommon' }
		],

		razorBlockCommentTopLevel: [
			[/\*@/, '@rematch', '@pop'],
			[/[^*]+/, 'comment.cs'],
			[/./, 'comment.cs']
		],

		razorBlockComment: [
			[/\*@/, 'comment.cs', '@pop'],
			[/[^*]+/, 'comment.cs'],
			[/./, 'comment.cs']
		],

		razorRootTopLevel: [
			[/\{/, 'delimiter.bracket.cs', '@razorRoot'],
			[/\(/, 'delimiter.parenthesis.cs', '@razorRoot'],
			[/\[/, 'delimiter.array.cs', '@razorBracket'],
			[/[})]/, '@rematch', '@pop'],
			{ include: 'razorCommon' }
		],

		razorRoot: [
			[/\{/, 'delimiter.bracket.cs', '@razorRoot'],
			[/\(/, 'delimiter.parenthesis.cs', '@razorRoot'],
			[/\[/, 'delimiter.array.cs', '@razorBracket'],
			[/\}/, 'delimiter.bracket.cs', '@pop'],
			[/\)/, 'delimiter.parenthesis.cs', '@pop'],
			{ include: 'razorCommon' }
		],

		razorCommon: [
			[/(@:)(.*$)/, ['metatag.cs', '']],
			[/@\*/, 'comment.cs', '@razorBlockComment'],
			[/\/\/.*$/, 'comment.cs'],
			[/\/\*/, 'comment.cs', '@razorCSharpComment'],
			[/\$*"""/, 'string.cs', '@razorRawString'],
			[/\$\@"/, 'string.cs', '@razorVerbatimString'],
			[/@\$"/, 'string.cs', '@razorVerbatimString'],
			[/@"/, 'string.cs', '@razorVerbatimString'],
			[/\$?"([^"\\]|\\.)*$/, 'string.invalid.cs'],
			[/\$"/, 'string.cs', '@razorString'],
			[/"/, 'string.cs', '@razorString'],
			[/'([^'\\]|\\.)*'/, 'string.cs'],
			[
				/@?[a-zA-Z_]\w*/,
				{
					cases: {
						'@razorKeywords': { token: 'keyword.cs' },
						'@default': 'identifier.cs'
					}
				}
			],

			[/[ \t\r\n]+/],

			[/(<\/)([\w\-]+)(>)/, ['delimiter.html', 'tag.html', 'delimiter.html']],
			[
				/(<)(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)\b/i,
				['delimiter.html', { token: 'tag.html', next: '@razorMarkupVoidTag' }]
			],
			[/(<)([a-zA-Z][\w:.-]*)/, ['delimiter.html', { token: 'tag.html', next: '@razorMarkupTag' }]],

			[/0[xX][0-9a-fA-F_]+[uUlL]*/, 'number.hex.cs'],
			[/0[bB][01_]+[uUlL]*/, 'number.binary.cs'],
			[/\d[\d_]*\.\d[\d_]*([eE][\-+]?\d[\d_]*)?[fFdDmM]?/, 'number.float.cs'],
			[/\d[\d_]*([eE][\-+]?\d[\d_]*)[fFdDmM]?/, 'number.float.cs'],
			[/\d[\d_]*[uUlLfFdDmM]*/, 'number.cs'],

			[/[\+\-\*\%\&\|\^\~\!\=\<\>\/\?\;\:\.\,]/, 'delimiter.cs']
		],

		razorCSharpComment: [
			[/[^\/*]+/, 'comment.cs'],
			[/\*\//, 'comment.cs', '@pop'],
			[/[\/*]/, 'comment.cs']
		],

		razorString: [
			[/[^\\"]+/, 'string.cs'],
			[/@escapes/, 'string.escape.cs'],
			[/\\./, 'string.escape.invalid.cs'],
			[/"/, 'string.cs', '@pop']
		],

		razorVerbatimString: [
			[/[^"]+/, 'string.cs'],
			[/""/, 'string.escape.cs'],
			[/"/, 'string.cs', '@pop']
		],

		razorRawString: [
			[/[^"]+/, 'string.cs'],
			[/"""/, 'string.cs', '@pop'],
			[/"/, 'string.cs']
		],

		razorMarkupTag: [
			[/@razorDirectiveAttribute/, 'attribute.name'],
			[/@[^@]/, { token: '@rematch', switchTo: '@razorInSimpleState.razorMarkupTag' }],
			[/\/>/, 'delimiter.html', '@pop'],
			[/>/, { token: 'delimiter.html', switchTo: '@razorMarkupContent' }],
			[/"([^"]*)"/, 'attribute.value'],
			[/'([^']*)'/, 'attribute.value'],
			[/[:\w.-]+/, 'attribute.name'],
			[/=/, 'delimiter'],
			[/[ \t\r\n]+/]
		],

		razorMarkupVoidTag: [
			[/@razorDirectiveAttribute/, 'attribute.name'],
			[/@[^@]/, { token: '@rematch', switchTo: '@razorInSimpleState.razorMarkupVoidTag' }],
			[/\/?>/, 'delimiter.html', '@pop'],
			[/"([^"]*)"/, 'attribute.value'],
			[/'([^']*)'/, 'attribute.value'],
			[/[:\w.-]+/, 'attribute.name'],
			[/=/, 'delimiter'],
			[/[ \t\r\n]+/]
		],

		razorMarkupContent: [
			[/@\*/, 'comment.cs', '@razorBlockComment'],
			[/@[^@]/, { token: '@rematch', switchTo: '@razorInSimpleState.razorMarkupContent' }],
			[/<!--/, 'comment.html', '@razorMarkupComment'],
			[
				/(<\/)([a-zA-Z][\w:.-]*)(\s*)(>)/,
				['delimiter.html', 'tag.html', '', { token: 'delimiter.html', next: '@pop' }]
			],
			[
				/(<)(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)\b/i,
				['delimiter.html', { token: 'tag.html', next: '@razorMarkupVoidTag' }]
			],
			[/(<)([a-zA-Z][\w:.-]*)/, ['delimiter.html', { token: 'tag.html', next: '@razorMarkupTag' }]],
			[/</, 'delimiter.html'],
			[/[^<@]+/]
		],

		razorMarkupComment: [
			[/-->/, 'comment.html', '@pop'],
			[/[^-]+/, 'comment.content.html'],
			[/./, 'comment.content.html']
		]
	},

	razorBlockDirectives: /(?:code|do|else|finally|functions|try)/,

	razorControlDirectives: /(?:catch|for|foreach|if|lock|switch|while)/,

	razorLineDirectives:
		/(?:addTagHelper|attribute|implements|inherits|inject|layout|model|namespace|page|preservewhitespace|removeTagHelper|rendermode|tagHelperPrefix|typeparam|using)/,

	razorDirectiveAttribute:
		/@(?:attributes|bind(?:-[\w-]+)?(?::[\w-]+)?|formname|key|on[a-zA-Z_]\w*(?::[\w-]+)?|ref|rendermode)\b/,

	razorKeywords: [
		'abstract',
		'add',
		'alias',
		'and',
		'as',
		'ascending',
		'async',
		'await',
		'base',
		'bool',
		'break',
		'by',
		'byte',
		'case',
		'catch',
		'char',
		'checked',
		'class',
		'const',
		'continue',
		'decimal',
		'default',
		'delegate',
		'do',
		'double',
		'descending',
		'dynamic',
		'equals',
		'explicit',
		'event',
		'extern',
		'else',
		'enum',
		'false',
		'file',
		'finally',
		'fixed',
		'float',
		'for',
		'foreach',
		'from',
		'get',
		'global',
		'goto',
		'group',
		'if',
		'implicit',
		'in',
		'init',
		'int',
		'interface',
		'internal',
		'into',
		'is',
		'join',
		'let',
		'lock',
		'long',
		'managed',
		'nameof',
		'new',
		'nint',
		'not',
		'notnull',
		'null',
		'nuint',
		'namespace',
		'object',
		'on',
		'operator',
		'or',
		'out',
		'override',
		'orderby',
		'params',
		'partial',
		'private',
		'protected',
		'public',
		'readonly',
		'record',
		'ref',
		'remove',
		'required',
		'return',
		'scoped',
		'set',
		'switch',
		'struct',
		'sbyte',
		'sealed',
		'short',
		'sizeof',
		'stackalloc',
		'static',
		'string',
		'select',
		'this',
		'throw',
		'true',
		'try',
		'typeof',
		'uint',
		'ulong',
		'unchecked',
		'unmanaged',
		'unsafe',
		'ushort',
		'using',
		'value',
		'var',
		'virtual',
		'volatile',
		'void',
		'when',
		'while',
		'where',
		'with',
		'yield',
		'model',
		'inject' // Razor specific
	],

	escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/
};
