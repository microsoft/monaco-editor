/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { languages } from 'monaco-editor-core';

export const conf: languages.LanguageConfiguration = {
	comments: {
		lineComment: '#',
		blockComment: ['/*', '*/']
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
		{ open: '"', close: '"', notIn: ['string'] }
	],
	surroundingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"' }
	]
};

export const language = <languages.IMonarchLanguage>{
	defaultToken: '',
	tokenPostfix: '.hcl',

	keywords: [
		'var',
		'local',
		'path',
		'for_each',
		'any',
		'string',
		'number',
		'bool',
		'true',
		'false',
		'null',
		'if ',
		'else ',
		'endif ',
		'for ',
		'in',
		'endfor'
	],

	operators: [
		'=',
		'>=',
		'<=',
		'==',
		'!=',
		'+',
		'-',
		'*',
		'/',
		'%',
		'&&',
		'||',
		'!',
		'<',
		'>',
		'?',
		'...',
		':'
	],

	symbols: /[=><!~?:&|+\-*\/\^%]+/,
	escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
	terraformFunctions:
		/(abs|ceil|floor|log|max|min|pow|signum|chomp|format|formatlist|indent|join|lower|regex|regexall|replace|split|strrev|substr|title|trimspace|upper|chunklist|coalesce|coalescelist|compact|concat|contains|distinct|element|flatten|index|keys|length|list|lookup|map|matchkeys|merge|range|reverse|setintersection|setproduct|setunion|slice|sort|transpose|values|zipmap|base64decode|base64encode|base64gzip|csvdecode|jsondecode|jsonencode|urlencode|yamldecode|yamlencode|abspath|dirname|pathexpand|basename|file|fileexists|fileset|filebase64|templatefile|formatdate|timeadd|timestamp|base64sha256|base64sha512|bcrypt|filebase64sha256|filebase64sha512|filemd5|filemd1|filesha256|filesha512|md5|rsadecrypt|sha1|sha256|sha512|uuid|uuidv5|cidrhost|cidrnetmask|cidrsubnet|tobool|tolist|tomap|tonumber|toset|tostring)/,
	terraformMainBlocks: /(module|data|terraform|resource|provider|variable|output|locals)/,
	tokenizer: {
		root: [
			// highlight main blocks
			[
				/^@terraformMainBlocks([ \t]*)([\w-]+|"[\w-]+"|)([ \t]*)([\w-]+|"[\w-]+"|)([ \t]*)(\{)/,
				['type', '', 'string', '', 'string', '', '@brackets']
			],
			// highlight all the remaining blocks
			[
				/(\w+[ \t]+)([ \t]*)([\w-]+|"[\w-]+"|)([ \t]*)([\w-]+|"[\w-]+"|)([ \t]*)(\{)/,
				['identifier', '', 'string', '', 'string', '', '@brackets']
			],
			// highlight block
			[
				/(\w+[ \t]+)([ \t]*)([\w-]+|"[\w-]+"|)([ \t]*)([\w-]+|"[\w-]+"|)(=)(\{)/,
				['identifier', '', 'string', '', 'operator', '', '@brackets']
			],
			// terraform general highlight - shared with expressions
			{ include: '@terraform' }
		],
		terraform: [
			// highlight terraform functions
			[/@terraformFunctions(\()/, ['type', '@brackets']],
			// all other words are variables or keywords
			[
				/[a-zA-Z_]\w*-*/, // must work with variables such as foo-bar and also with negative numbers
				{
					cases: {
						'@keywords': { token: 'keyword.$0' },
						'@default': 'variable'
					}
				}
			],
			{ include: '@whitespace' },
			{ include: '@heredoc' },
			// delimiters and operators
			[/[{}()\[\]]/, '@brackets'],
			[/[<>](?!@symbols)/, '@brackets'],
			[
				/@symbols/,
				{
					cases: {
						'@operators': 'operator',
						'@default': ''
					}
				}
			],
			// numbers
			[/\d*\d+[eE]([\-+]?\d+)?/, 'number.float'],
			[/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
			[/\d[\d']*/, 'number'],
			[/\d/, 'number'],
			[/[;,.]/, 'delimiter'], // delimiter: after number because of .\d floats
			// strings
			[/"/, 'string', '@string'], // this will include expressions
			[/'/, 'invalid']
		],
		heredoc: [
			[/<<[-]*\s*["]?([\w\-]+)["]?/, { token: 'string.heredoc.delimiter', next: '@heredocBody.$1' }]
		],
		heredocBody: [
			[
				/([\w\-]+)$/,
				{
					cases: {
						'$1==$S2': [
							{
								token: 'string.heredoc.delimiter',
								next: '@popall'
							}
						],
						'@default': 'string.heredoc'
					}
				}
			],
			[/./, 'string.heredoc']
		],
		whitespace: [
			[/[ \t\r\n]+/, ''],
			[/\/\*/, 'comment', '@comment'],
			[/\/\/.*$/, 'comment'],
			[/#.*$/, 'comment']
		],
		comment: [
			[/[^\/*]+/, 'comment'],
			[/\*\//, 'comment', '@pop'],
			[/[\/*]/, 'comment']
		],
		string: [
			[/\$\{/, { token: 'delimiter', next: '@stringExpression' }],
			[/[^\\"\$]+/, 'string'],
			[/@escapes/, 'string.escape'],
			[/\\./, 'string.escape.invalid'],
			[/"/, 'string', '@popall']
		],
		stringInsideExpression: [
			[/[^\\"]+/, 'string'],
			[/@escapes/, 'string.escape'],
			[/\\./, 'string.escape.invalid'],
			[/"/, 'string', '@pop']
		],
		stringExpression: [
			[/\}/, { token: 'delimiter', next: '@pop' }],
			[/"/, 'string', '@stringInsideExpression'],
			{ include: '@terraform' }
		]
	}
};
