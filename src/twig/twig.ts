/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import IRichLanguageConfiguration = monaco.languages.LanguageConfiguration;
import ILanguage = monaco.languages.IMonarchLanguage;

export const conf: IRichLanguageConfiguration = {
	wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\$\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\s]+)/g,

	comments: {
		blockComment: ['{#', '#}'],
	},

	brackets: [
		['{#', '#}'],
		['{%', '%}'],
		['{{', '}}'],
		['(', ')'],
		['[', ']'],
	],

	autoClosingPairs: [
		{ open: '{# ', close: ' #}' },
		{ open: '{% ', close: ' %}' },
		{ open: '{{ ', close: ' }}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"' },
		{ open: '\'', close: '\'' },
	],

	surroundingPairs: [
		{ open: '"', close: '"' },
		{ open: '\'', close: '\'' },
	],
}

export const language = <ILanguage>{
	defaultToken: 'invalid',
	tokenPostfix: '',

	keywords: [
		// (opening) tags
		'apply', 'autoescape', 'block', 'deprecated', 'do', 'embed', 'extends',
		'flush', 'for', 'from', 'if', 'import', 'include', 'macro', 'sandbox',
		'set', 'use', 'verbatim', 'with',
		// closing tags
		'endapply', 'endautoescape', 'endblock', 'endembed', 'endfor', 'endif',
		'endmacro', 'endsandbox', 'endset', 'endwith',
	],

	tokenizer: {
		root: [
			[/{#/, 'comment.twig', '@commentState'],
			[/{%[-~]?/, 'delimiter.twig', '@blockState'],
			[/{{[-~]?/, 'delimiter.twig', '@variableState'],
		],

		/**
		 * Comment Tag Handling
		 */
		commentState: [
			[/#}/, 'comment.twig', '@pop'],
			[/./, 'comment.twig'],
		],

		/**
		 * Block Tag Handling
		 */
		blockState: [
			[/[-~]?%}/, 'delimiter.twig', '@pop'],
			// whitespace
			[/\s+/],
			// verbatim
			// Unlike other blocks, verbatim ehas its own state
			// transition to ensure we mark its contents as strings.
			[/(verbatim)(\s*)([-~]?%})/, [
				'keyword.twig',
				'',
				{ token: 'delimiter.twig', next: '@rawDataState' },
			]],
			{ include: 'expression' }
		],

		rawDataState: [
			// endverbatim
			[/({%[-~]?)(\s*)(endverbatim)(\s*)([-~]?%})/, [
				'delimiter.twig',
				'',
				'keyword.twig',
				'',
				{ token: 'delimiter.twig', next: '@popall' },
			]],
			[/./, 'string.twig'],
		],

		/**
		 * Variable Tag Handling
		 */
		variableState: [
			[/[-~]?}}/, 'delimiter.twig', '@pop'],
			{ include: 'expression' },
		],

		stringState: [
			// closing double quoted string
			[/"/, 'string.twig', '@pop'],
			// interpolation start
			[/#{\s*/, 'string.twig', '@interpolationState'],
			// string part
			[/[^#"\\]*(?:(?:\\.|#(?!\{))[^#"\\]*)*/, 'string.twig'],
		],

		interpolationState: [
			// interpolation end
			[/}/, 'string.twig', '@pop'],
			{ include: 'expression' },
		],

		/**
		 * Expression Handling
		 */
		expression: [
			// whitespace
			[/\s+/],
			// operators - math
			[/\+|-|\/{1,2}|%|\*{1,2}/, 'operators.twig'],
			// operators - logic
			[/(and|or|not|b-and|b-xor|b-or)(\s+)/, ['operators.twig', '']],
			// operators - comparison (symbols)
			[/==|!=|<|>|>=|<=/, 'operators.twig'],
			// operators - comparison (words)
			[/(starts with|ends with|matches)(\s+)/, ['operators.twig', '']],
			// operators - containment
			[/(in)(\s+)/, ['operators.twig', '']],
			// operators - test
			[/(is)(\s+)/, ['operators.twig', '']],
			// operators - misc
			[/\||~|:|\.{1,2}|\?{1,2}/, 'operators.twig'],
			// names
			[/[^\W\d][\w]*/, {
				cases: {
					'@keywords': 'keyword.twig',
					'@default': 'variable.twig'
				}
			}],
			// numbers
			[/\d+(\.\d+)?/, 'number.twig'],
			// punctuation
			[/\(|\)|\[|\]|{|}|,/, 'delimiter.twig'],
			// strings
			[/"([^#"\\]*(?:\\.[^#"\\]*)*)"|\'([^\'\\]*(?:\\.[^\'\\]*)*)\'/, 'string.twig'],
			// opening double quoted string
			[/"/, 'string.twig', '@stringState'],

			// misc syntactic constructs
			// These are not operators per se, but for the purposes of lexical analysis we
			// can treat them as such.
			// arrow functions
			[/=>/, 'operators.twig'],
			// assignment
			[/=/, 'operators.twig'],
		],
	}
};
