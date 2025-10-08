/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { languages } from 'monaco-editor-core';

export const conf: languages.LanguageConfiguration = {
	wordPattern:
		/(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,

	comments: {
		lineComment: '//',
		blockComment: ['/*', '*/']
	},

	brackets: [
		['{', '}'],
		['[', ']'],
		['(', ')']
	],

	autoClosingPairs: [
		{ open: '{', close: '}', notIn: ['string'] },
		{ open: '[', close: ']', notIn: ['string'] },
		{ open: '(', close: ')', notIn: ['string'] },
		{ open: '"', close: '"', notIn: ['string'] },
		{ open: "'", close: "'", notIn: ['string', 'comment'] }
	],

	folding: {
		markers: {
			start: new RegExp('^\\s*(#|//)region\\b'),
			end: new RegExp('^\\s*(#|//)endregion\\b')
		}
	}
};

export const language = <languages.IMonarchLanguage>{
	defaultToken: '',
	tokenPostfix: '',
	// ignoreCase: true,

	// The main tokenizer for our languages
	tokenizer: {
		root: [
			[/<\?((php)|=)?/, { token: '@rematch', switchTo: '@phpInSimpleState.root' }],
			[/<!DOCTYPE/, 'metatag.html', '@doctype'],
			[/<!--/, 'comment.html', '@comment'],
			[/(<)(\w+)(\/>)/, ['delimiter.html', 'tag.html', 'delimiter.html']],
			[/(<)(script)/, ['delimiter.html', { token: 'tag.html', next: '@script' }]],
			[/(<)(style)/, ['delimiter.html', { token: 'tag.html', next: '@style' }]],
			[/(<)([:\w]+)/, ['delimiter.html', { token: 'tag.html', next: '@otherTag' }]],
			[/(<\/)(\w+)/, ['delimiter.html', { token: 'tag.html', next: '@otherTag' }]],
			[/</, 'delimiter.html'],
			[/[^<]+/] // text
		],

		doctype: [
			[/<\?((php)|=)?/, { token: '@rematch', switchTo: '@phpInSimpleState.comment' }],
			[/[^>]+/, 'metatag.content.html'],
			[/>/, 'metatag.html', '@pop']
		],

		comment: [
			[/<\?((php)|=)?/, { token: '@rematch', switchTo: '@phpInSimpleState.comment' }],
			[/-->/, 'comment.html', '@pop'],
			[/[^-]+/, 'comment.content.html'],
			[/./, 'comment.content.html']
		],

		otherTag: [
			[/<\?((php)|=)?/, { token: '@rematch', switchTo: '@phpInSimpleState.otherTag' }],
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
			[/<\?((php)|=)?/, { token: '@rematch', switchTo: '@phpInSimpleState.script' }],
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
				/<\?((php)|=)?/,
				{
					token: '@rematch',
					switchTo: '@phpInSimpleState.scriptAfterType'
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
				/<\?((php)|=)?/,
				{
					token: '@rematch',
					switchTo: '@phpInSimpleState.scriptAfterTypeEquals'
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
				/<\?((php)|=)?/,
				{
					token: '@rematch',
					switchTo: '@phpInSimpleState.scriptWithCustomType.$S2'
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
				/<\?((php)|=)?/,
				{
					token: '@rematch',
					switchTo: '@phpInEmbeddedState.scriptEmbedded.$S2',
					nextEmbedded: '@pop'
				}
			],
			[/<\/script/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }]
		],

		// -- END <script> tags handling

		// -- BEGIN <style> tags handling

		// After <style
		style: [
			[/<\?((php)|=)?/, { token: '@rematch', switchTo: '@phpInSimpleState.style' }],
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
				/<\?((php)|=)?/,
				{
					token: '@rematch',
					switchTo: '@phpInSimpleState.styleAfterType'
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
				/<\?((php)|=)?/,
				{
					token: '@rematch',
					switchTo: '@phpInSimpleState.styleAfterTypeEquals'
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
				/<\?((php)|=)?/,
				{
					token: '@rematch',
					switchTo: '@phpInSimpleState.styleWithCustomType.$S2'
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
				/<\?((php)|=)?/,
				{
					token: '@rematch',
					switchTo: '@phpInEmbeddedState.styleEmbedded.$S2',
					nextEmbedded: '@pop'
				}
			],
			[/<\/style/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }]
		],

		// -- END <style> tags handling

		phpInSimpleState: [
			[/<\?((php)|=)?/, 'metatag.php'],
			[/\?>/, { token: 'metatag.php', switchTo: '@$S2.$S3' }],
			{ include: 'phpRoot' }
		],

		phpInEmbeddedState: [
			[/<\?((php)|=)?/, 'metatag.php'],
			[
				/\?>/,
				{
					token: 'metatag.php',
					switchTo: '@$S2.$S3',
					nextEmbedded: '$S3'
				}
			],
			{ include: 'phpRoot' }
		],

		phpRoot: [
			[
				/[a-zA-Z_]\w*/,
				{
					cases: {
						'@phpKeywords': { token: 'keyword.php' },
						'@phpCompileTimeConstants': { token: 'constant.php' },
						'@default': 'identifier.php'
					}
				}
			],
			[
				/[$a-zA-Z_]\w*/,
				{
					cases: {
						'@phpPreDefinedVariables': {
							token: 'variable.predefined.php'
						},
						'@default': 'variable.php'
					}
				}
			],

			// brackets
			[/[{}]/, 'delimiter.bracket.php'],
			[/[\[\]]/, 'delimiter.array.php'],
			[/[()]/, 'delimiter.parenthesis.php'],

			// whitespace
			[/[ \t\r\n]+/],

			// comments
			[/(#|\/\/)$/, 'comment.php'],
			[/(#|\/\/)/, 'comment.php', '@phpLineComment'],

			// block comments
			[/\/\*/, 'comment.php', '@phpComment'],

			// strings
			[/"/, 'string.php', '@phpDoubleQuoteString'],
			[/'/, 'string.php', '@phpSingleQuoteString'],

			// delimiters
			[/[\+\-\*\%\&\|\^\~\!\=\<\>\/\?\;\:\.\,\@]/, 'delimiter.php'],

			// numbers
			[/\d*\d+[eE]([\-+]?\d+)?/, 'number.float.php'],
			[/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float.php'],
			[/0[xX][0-9a-fA-F']*[0-9a-fA-F]/, 'number.hex.php'],
			[/0[0-7']*[0-7]/, 'number.octal.php'],
			[/0[bB][0-1']*[0-1]/, 'number.binary.php'],
			[/\d[\d']*/, 'number.php'],
			[/\d/, 'number.php']
		],

		phpComment: [
			[/\*\//, 'comment.php', '@pop'],
			[/[^*]+/, 'comment.php'],
			[/./, 'comment.php']
		],

		phpLineComment: [
			[/\?>/, { token: '@rematch', next: '@pop' }],
			[/.$/, 'comment.php', '@pop'],
			[/[^?]+$/, 'comment.php', '@pop'],
			[/[^?]+/, 'comment.php'],
			[/./, 'comment.php']
		],

		phpDoubleQuoteString: [
			[/[^\\"]+/, 'string.php'],
			[/@escapes/, 'string.escape.php'],
			[/\\./, 'string.escape.invalid.php'],
			[/"/, 'string.php', '@pop']
		],

		phpSingleQuoteString: [
			[/[^\\']+/, 'string.php'],
			[/@escapes/, 'string.escape.php'],
			[/\\./, 'string.escape.invalid.php'],
			[/'/, 'string.php', '@pop']
		]
	},

	phpKeywords: [
		'abstract',
		'and',
		'array',
		'as',
		'break',
		'callable',
		'case',
		'catch',
		'cfunction',
		'class',
		'clone',
		'const',
		'continue',
		'declare',
		'default',
		'do',
		'else',
		'elseif',
		'enddeclare',
		'endfor',
		'endforeach',
		'endif',
		'endswitch',
		'endwhile',
		'extends',
		'false',
		'final',
		'for',
		'foreach',
		'function',
		'global',
		'goto',
		'if',
		'implements',
		'interface',
		'instanceof',
		'insteadof',
		'namespace',
		'new',
		'null',
		'object',
		'old_function',
		'or',
		'private',
		'protected',
		'public',
		'resource',
		'static',
		'switch',
		'throw',
		'trait',
		'try',
		'true',
		'use',
		'var',
		'while',
		'xor',
		'die',
		'echo',
		'empty',
		'exit',
		'eval',
		'include',
		'include_once',
		'isset',
		'list',
		'require',
		'require_once',
		'return',
		'print',
		'unset',
		'yield',
		'__construct'
	],

	phpCompileTimeConstants: [
		'__CLASS__',
		'__DIR__',
		'__FILE__',
		'__LINE__',
		'__NAMESPACE__',
		'__METHOD__',
		'__FUNCTION__',
		'__TRAIT__'
	],

	phpPreDefinedVariables: [
		'$GLOBALS',
		'$_SERVER',
		'$_GET',
		'$_POST',
		'$_FILES',
		'$_REQUEST',
		'$_SESSION',
		'$_ENV',
		'$_COOKIE',
		'$php_errormsg',
		'$HTTP_RAW_POST_DATA',
		'$http_response_header',
		'$argc',
		'$argv'
	],

	escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/
};

// TESTED WITH

// <style type="text/css" >
//   .boo { background: blue;
//   <?=''?>
//   }
//   .boo { background: blue;  <?=''?>  }
// </style>
// <!--

// <?= '' ?>

// -->
// <?php
// // The next line contains a syntax error:
// __construct
// if () {
// 	return "The parser recovers from this type of syntax error";
// }
// ?>
// <html>
// <head>
// 	<title <?=''?>>Example page</title>
//   <style <?=''?>>
//     .boo { background: blue; <?=''?> }
//   </style>
// </head>

// <body>

// <script <?=''?> type<?=''?>=<?=''?>"text/javascript"<?=''?>>
// 	// Some PHP embedded inside JS
// 	// Generated <?=date('l, F jS, Y')?>

// 	var server_token = <?=rand(5, 10000)?>
// 	if (typeof server_token === 'number') {
// 		alert('token: ' + server_token);
// 	}
// </script>

// <div>
// Hello
// <? if (isset($user)) { ?>
// 	<b><?=$user?></b>
// <? } else { ?>
// 	<i>guest</i>
// <? } ?>
// !
// </div>

// <?php

// 	/* Example PHP file
// 	multiline comment
// 	*/

//  # Another single line comment

// 	$cards = array("ah", "ac", "ad", "as",
// 		"2h", "2c", "2d", "2s",
// 		"3h", "3c", "3d", "3s",
// 		"4h", "4c", "4d", "4s",
// 		"5h", "5c", "5d", "5s",
// 		"6h", "6c", "6d", "6s",
// 		"7h", "7c", "7d", "7s",
// 		"8h", "8c", "8d", "8s",
// 		"9h", "9c", "9d", "9s",
// 		"th", "tc", "td", "ts",
// 		"jh", "jc", "jd", "js",
// 		"qh", "qc", "qd", "qs",
// 		"kh", "kc", "kd", "ks");

// 	srand(time());

// 	for($i = 0; $i < 52; $i++) {
// 		$count = count($cards);
// 		$random = (rand()%$count);

// 		if($cards[$random] == "") {
// 			$i--;
// 		} else {
// 			$deck[] = $cards[$random];
// 			$cards[$random] = "";
// 		}
// 	}
// $_GET
// __CLASS__

// 	srand(time());
// 	$starting_point = (rand()%51);
// 	print("Starting point for cut cards is: $starting_point<p>");

// 	// display shuffled cards (EXAMPLE ONLY)
// 	for ($index = 0; $index < 52; $index++) {
// 		if ($starting_point == 52) { $starting_point = 0; }
// 		print("Uncut Point: <strong>$deck[$index]</strong> ");
// 		print("Starting Point: <strong>$deck[$starting_point]</strong><br>");
// 		$starting_point++;
// 	}
// ?>

// </body>
// </html>
