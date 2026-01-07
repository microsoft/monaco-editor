/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { languages } from '../../fillers/monaco-editor-core';

// Language Configuration for Jinja
export const conf: languages.LanguageConfiguration = {
	comments: {
		blockComment: ['{#', '#}']
	},
	brackets: [
		['{%', '%}'],
		['{{', '}}'],
		['{#', '#}'],
		['(', ')'],
		['[', ']'],
		['{', '}']
		// Note: Whitespace control variants like {%-, -%} are part of the token, not separate brackets
	],
	autoClosingPairs: [
		{ open: '{#', close: ' #}' },
		{ open: '{%', close: ' %}' },
		{ open: '{{', close: ' }}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '{', close: '}' },
		{ open: '"', close: '"', notIn: ['string', 'comment'] },
		{ open: "'", close: "'", notIn: ['string', 'comment'] }
		// Whitespace control pairs might be tricky here, stick to standard for reliable auto-closing
	],
	surroundingPairs: [
		{ open: '"', close: '"' },
		{ open: "'", close: "'" },
		{ open: '(', close: ')' },
		{ open: '[', close: ']' },
		{ open: '{', close: '}' },
		{ open: '{%', close: '%}' },
		{ open: '{{', close: '}}' },
		{ open: '{#', close: '#}' }
	],
	// Add folding markers based on TextMate grammar
	folding: {
		markers: {
			start: new RegExp('^\\s*({%\\s*(block|filter|for|if|macro|raw))'), // Matches start tags
			end: new RegExp('^\\s*({%\\s*(endblock|endfilter|endfor|endif|endmacro|endraw)\\s*%})') // Matches end tags
		}
	},
	indentationRules: {
		increaseIndentPattern: new RegExp(
			'^\\s*({%\\s*(block|filter|for|if|macro|raw|with|autoescape)\\b(?!.*\\b(endblock|endfilter|endfor|endif|endmacro|endraw|endwith|endautoescape))[^%]*%})'
		),
		decreaseIndentPattern: new RegExp(
			'^\\s*({%\\s*(elif|else|endblock|endfilter|endfor|endif|endmacro|endraw|endwith|endautoescape)\\b.*?%})'
		)
	}
};

// Monarch Tokenizer Definition for Jinja
export const language = <languages.IMonarchLanguage>{
	defaultToken: '', // Default to no specific token, avoid 'invalid' spam
	tokenPostfix: '.jinja',

	keywords: [
		// Control Structures
		'if',
		'endif',
		'for',
		'endfor',
		'block',
		'endblock',
		'extends',
		'include',
		'import',
		'from',
		'as',
		'recursive',
		'macro',
		'endmacro',
		'call',
		'endcall',
		'filter',
		'endfilter',
		'set',
		'endset',
		'raw',
		'endraw',
		'with',
		'endwith',
		'autoescape',
		'endautoescape',
		// Jinja specific keywords often used within tags
		'scoped',
		'required',
		'ignore',
		'missing',
		'context', // Modifiers for include/import/block
		'trimmed',
		'notrimmed',
		'pluralize', // i18n extension
		'continue',
		'break', // loop controls extension
		'do', // do extension
		// Expressions/Logic
		'and',
		'or',
		'not',
		'in',
		'is',
		'else',
		'elif'
		// Note: true, false, none, loop, super, self, varargs, kwargs are handled in tokenizer
	],

	operators: [
		'+',
		'-',
		'*',
		'**',
		'/',
		'//',
		'%', // Arithmetic
		'==',
		'<=',
		'>=',
		'<',
		'>',
		'!=', // Comparison
		'=', // Assignment
		'|', // Filter pipe
		'~' // Concatenation
		// 'and', 'or', 'not', 'in', 'is' are keywords but act as operators
	],

	// Symbols used for operators, delimiters etc. - simplified as specific tokens are better
	symbols: /[=><!~?&|+\-*/^%]+/,

	// Common Jinja constants and special variables
	constants: ['true', 'false', 'none', 'True', 'False', 'None'], // Allow title case for compatibility
	specialVars: ['loop', 'super', 'self', 'varargs', 'kwargs', 'caller'], // Added caller

	// Modified escapes regex (removed \\, \", \')
	escapes: /\\(?:[abfnrtv]|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8}|N\{[a-zA-Z ]+\})/,

	tokenizer: {
		root: [
			// Match Jinja delimiters first
			// Comments: {# ... #}
			[/\{#-+/, { token: 'comment.block', bracket: '@open', next: '@comment' }], // With whitespace control
			[/\{#/, { token: 'comment.block', bracket: '@open', next: '@comment' }], // Standard

			// Variables: {{ ... }}
			[/\{\{-+/, { token: 'delimiter.variable', bracket: '@open', next: '@variable' }], // With whitespace control
			[/\{\{/, { token: 'delimiter.variable', bracket: '@open', next: '@variable' }], // Standard

			// Blocks: {% ... %}
			// Raw block needs to be matched first to prevent inner content parsing
			[
				/(\{%\s*)(raw)(\s*%\})/,
				['delimiter.tag', 'keyword.control', { token: 'delimiter.tag', next: '@rawblock' }]
			],
			[
				/(\{%-?\s*)(raw)(\s*-?%\})/,
				['delimiter.tag', 'keyword.control', { token: 'delimiter.tag', next: '@rawblock' }]
			], // With whitespace control

			[/\{%-+/, { token: 'delimiter.tag', bracket: '@open', next: '@block' }], // With whitespace control
			[/\{%/, { token: 'delimiter.tag', bracket: '@open', next: '@block' }], // Standard

			// Anything else is treated as plain text/HTML until a delimiter is found
			[/[^\{]+/, ''],
			[/\{/, ''] // Match stray opening braces that aren't part of a delimiter
		],

		comment: [
			[/-?#\}/, { token: 'comment.block', bracket: '@close', next: '@pop' }], // Match closing delimiter with optional whitespace control
			[/[^#\}]+/, 'comment.block'], // Content inside comment
			[/#|\}/, 'comment.block'] // Consume '#' or '}' within comment (e.g., nested comments - though Jinja doesn't support true nesting)
		],

		variable: [
			[/-?\}\}/, { token: 'delimiter.variable', bracket: '@close', next: '@pop' }], // Match closing delimiter with optional whitespace control
			{ include: '@expressionInside' }
		],

		block: [
			[/-?%\}/, { token: 'delimiter.tag', bracket: '@close', next: '@pop' }], // Match closing delimiter with optional whitespace control
			{ include: '@expressionInside' }
		],

		// Simplified raw block handling: consumes everything until endraw
		rawblock: [
			[
				/(\{%-?\s*)(endraw)(\s*-?%\})/,
				['delimiter.tag', 'keyword.control', { token: 'delimiter.tag', next: '@pop' }]
			],
			[/[^{%]+/, 'comment.block.raw'], // Any character not part of start delimiter
			[/\{%?/, 'comment.block.raw'] // Consume parts of delimiters if not endraw
		],

		expressionInside: [
			// Match keywords, constants, and special variables
			[
				/\b[a-zA-Z_]\w*\b/,
				{
					cases: {
						'@keywords': 'keyword.control',
						'@constants': 'constant.language',
						'@specialVars': 'variable.language',
						'@default': 'variable.other'
					}
				}
			],

			// Numbers (allow underscore separators like in TextMate, though less common in Jinja)
			[/\d+(_\d+)*(\.\d+)?([eE][+\-]?\d+)?/, 'number'],

			// Strings
			[/"/, { token: 'string.quote.double', bracket: '@open', next: '@string_double' }], // Start double-quoted string
			[/'/, { token: 'string.quote.single', bracket: '@open', next: '@string_single' }], // Start single-quoted string

			// Operators and Symbols
			// Specific rule for filter pipe - pushes to a state to identify the filter name
			[/\|(?=\s*[a-zA-Z_])/, { token: 'operators.filter', next: '@filterName' }],
			[
				/@symbols/,
				{
					cases: {
						'@operators': 'keyword.operator',
						'@default': 'delimiter' // Treat other symbols as delimiters (e.g., ~)
					}
				}
			],

			// Delimiters: . : , ( ) [ ] { } (pipe handled separately)
			[/\./, 'delimiter.accessor'], // Dot for attribute access
			[/[?:,()\[\]{}]/, 'delimiter'], // Other delimiters

			// Whitespace
			[/\s+/, 'white']
		],

		string_double: [
			[/\\\\/, 'constant.character.escape'], // 1. Explicit \\
			[/\\"/, 'constant.character.escape'], // 2. Explicit \"
			[/@escapes/, 'constant.character.escape'], // 3. Other known escapes (modified regex)
			[/\\./, 'string.escape.invalid'], // 4. Invalid escapes
			[/[^\\"]+/, 'string'], // 5. Regular string content
			[/"/, { token: 'string.quote.double', bracket: '@close', next: '@pop' }] // 6. Closing quote
		],

		string_single: [
			[/\\\\/, 'constant.character.escape'], // 1. Explicit \\
			[/\\'/, 'constant.character.escape'], // 2. Explicit \'
			[/@escapes/, 'constant.character.escape'], // 3. Other known escapes (modified regex)
			[/\\./, 'string.escape.invalid'], // 4. Invalid escapes
			[/[^\\']+/, 'string'], // 5. Regular string content
			[/'/, { token: 'string.quote.single', bracket: '@close', next: '@pop' }] // 6. Closing quote
		],

		// State to capture the filter name after a pipe
		filterName: [
			[/\s+/, 'white'], // Eat whitespace before the name
			[/[a-zA-Z_]\w*/, { token: 'variable.other.filter', next: '@pop' }], // Filter name itself
			['', { token: '', next: '@pop' }] // If anything else follows pipe (like another pipe or delimiter), just pop
		]
	}
};
