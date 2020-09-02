/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import IRichLanguageConfiguration = monaco.languages.LanguageConfiguration;
import ILanguage = monaco.languages.IMonarchLanguage;

export const conf: IRichLanguageConfiguration = {
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
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"', notIn: ['string'] },
		{ open: "'", close: "'", notIn: ['string', 'comment'] }
	],
	surroundingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"' },
		{ open: "'", close: "'" }
	]
};

export const language = <ILanguage>{
	defaultToken: '',
	tokenPostfix: '.tf',

	keywords: [
		'var',
		'local',
		'module',
		'data',
		'path',
		'terraform',
		'resource',
		'provider',
		'variable',
		'output',
		'locals',
		'any',
		'string',
		'number',
		'bool',
		'abs',
		'ceil',
		'floor',
		'log',
		'max',
		'min',
		'pow',
		'signum',
		'chomp',
		'format',
		'formatlist',
		'indent',
		'join',
		'lower',
		'regex',
		'regexall',
		'replace',
		'split',
		'strrev',
		'substr',
		'title',
		'trimspace',
		'upper',
		'chunklist',
		'coalesce',
		'coalescelist',
		'compact',
		'concat',
		'contains',
		'distinct',
		'element',
		'flatten',
		'index',
		'keys',
		'length',
		'list',
		'lookup',
		'map',
		'matchkeys',
		'merge',
		'range',
		'reverse',
		'setintersection',
		'setproduct',
		'setunion',
		'slice',
		'sort',
		'transpose',
		'values',
		'zipmap',
		'base64decode',
		'base64encode',
		'base64gzip',
		'csvdecode',
		'jsondecode',
		'jsonencode',
		'urlencode',
		'yamldecode',
		'yamlencode',
		'abspath',
		'dirname',
		'pathexpand',
		'basename',
		'file',
		'fileexists',
		'fileset',
		'filebase64',
		'templatefile',
		'formatdate',
		'timeadd',
		'timestamp',
		'base64sha256',
		'base64sha512',
		'bcrypt',
		'filebase64sha256',
		'filebase64sha512',
		'filemd5',
		'filemd1',
		'filesha256',
		'filesha512',
		'md5',
		'rsadecrypt',
		'sha1',
		'sha256',
		'sha512',
		'uuid',
		'uuidv5',
		'cidrhost',
		'cidrnetmask',
		'cidrsubnet',
		'tobool',
		'tolist',
		'tomap',
		'tonumber',
		'toset',
		'tostring',
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

	// we include these common regular expressions
	symbols: /[=><!~?:&|+\-*\/\^%]+/,
	escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
	variable: /\${?[\w]+}?/,

	// The main tokenizer for our languages
	tokenizer: {
		root: [
			// identifiers and keywords
			[
				/[a-zA-Z_]\w*/,
				{
					cases: {
						'@keywords': { token: 'keyword.$0' },
						'@default': 'identifier'
					}
				}
			],

			// whitespace
			{ include: '@whitespace' },

			// delimiters and operators
			[/[{}()\[\]]/, '@brackets'],
			[/[<>](?!@symbols)/, '@brackets'],
			[
				/@symbols/,
				{
					cases: {
						'@operators': 'delimiter',
						'@default': ''
					}
				}
			],

			// numbers
			[/\d*\d+[eE]([\-+]?\d+)?/, 'number.float'],
			[/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
			[/\d[\d']*/, 'number'],
			[/\d/, 'number'],

			// delimiter: after number because of .\d floats
			[/[;,.]/, 'delimiter'],

			// strings
			[/"([^"\\]|\\.)*$/, 'string.invalid'], // non-teminated string
			[/"/, 'string', '@string']
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
			[/[^\\"]+/, 'string'],
			[/@escapes/, 'string.escape'],
			[/\\./, 'string.escape.invalid'],
			[/"/, 'string', '@pop']
		]
	}
};
