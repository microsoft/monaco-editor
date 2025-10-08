/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { conf as tsConf, language as tsLanguage } from '../typescript/typescript';
import type { languages } from 'monaco-editor-core';

export const conf: languages.LanguageConfiguration = tsConf;

export const language = <languages.IMonarchLanguage>{
	// Set defaultToken to invalid to see what you do not tokenize yet
	defaultToken: 'invalid',
	tokenPostfix: '.js',

	keywords: [
		'break',
		'case',
		'catch',
		'class',
		'continue',
		'const',
		'constructor',
		'debugger',
		'default',
		'delete',
		'do',
		'else',
		'export',
		'extends',
		'false',
		'finally',
		'for',
		'from',
		'function',
		'get',
		'if',
		'import',
		'in',
		'instanceof',
		'let',
		'new',
		'null',
		'return',
		'set',
		'static',
		'super',
		'switch',
		'symbol',
		'this',
		'throw',
		'true',
		'try',
		'typeof',
		'undefined',
		'var',
		'void',
		'while',
		'with',
		'yield',
		'async',
		'await',
		'of'
	],
	typeKeywords: [],

	operators: tsLanguage.operators,
	symbols: tsLanguage.symbols,
	escapes: tsLanguage.escapes,
	digits: tsLanguage.digits,
	octaldigits: tsLanguage.octaldigits,
	binarydigits: tsLanguage.binarydigits,
	hexdigits: tsLanguage.hexdigits,
	regexpctl: tsLanguage.regexpctl,
	regexpesc: tsLanguage.regexpesc,
	tokenizer: tsLanguage.tokenizer
};
