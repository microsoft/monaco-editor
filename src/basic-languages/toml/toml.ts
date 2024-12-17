import { languages } from '../../fillers/monaco-editor-core';

export const conf: languages.LanguageConfiguration = {
	comments: {
		lineComment: '#'
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
		{ open: '"', close: '"' },
		{ open: "'", close: "'" }
	],
	folding: {
		offSide: true
	},
	onEnterRules: [
		{
			beforeText: /[\{\[]\s*$/,
			action: {
				indentAction: languages.IndentAction.Indent
			}
		}
	]
};
export const language: languages.IMonarchLanguage = {
	tokenPostfix: '.toml',
	brackets: [
		{ token: 'delimiter.bracket', open: '{', close: '}' },
		{ token: 'delimiter.square', open: '[', close: ']' }
	],

	// https://toml.io/en/v1.0.0#integer
	// 0, +0, -0 are valid, otherwise leading 0 is not allowed
	// _ needs to have at least one digit on each side
	numberInteger: /[+-]?(0|[1-9](_?[0-9])*)/,
	numberOctal: /0o[0-7](_?[0-7])*/,
	numberHex: /0x[0-9a-fA-F](_?[0-9a-fA-F])*/,
	numberBinary: /0b[01](_?[01])*/,

	floatFractionPart: /\.[0-9](_?[0-9])*/,
	// exponent can include leading zeros
	floatExponentPart: /[eE][+-]?[0-9](_?[0-9])*/,

	// RFC 3339 data times
	date: /\d{4}-\d\d-\d\d/,
	time: /\d\d:\d\d:\d\d(\.\d+)?/,
	offset: /[+-]\d\d:\d\d/,

	// https://toml.io/en/v1.0.0#string
	escapes: /\\([btnfr"\\]|u[0-9a-fA-F]{4}|U[0-9a-fA-F]{8})/,
	identifier: /([\w-]+)/,
	// Characters that can start an identifier chain for key or table name
	identChainStart: /([\w-"'])/,
	// Characters that can start a value
	// - '"' and ' for strings
	// - t/f for booleans
	// - +-, 0-9 for numbers
	// - i/n for special numbers
	// - [ for arrays, { for tables
	valueStart: /(["'tf0-9+\-in\[\{])/,

	tokenizer: {
		root: [
			{ include: '@comment' },
			{ include: '@whitespace' },
			// key value pair
			[/@identChainStart/, '@rematch', '@kvpair'],

			// table
			[/\[/, '@brackets', '@table'],

			// *invalid* value without a key, still parse
			// the value so it doesn't become a key and mess up
			// further parsing
			[/=/, 'delimiter', '@value']
		],
		comment: [[/#.*$/, 'comment']],
		whitespace: [[/[ \t\r\n]+/, 'white']],

		// Parsing a key value pair
		kvpair: [
			{ include: '@whitespace' },
			{ include: '@comment' },
			[/@identChainStart/, '@rematch', '@identChain.variable'],
			// switch to value, so we pop back to root when
			// it's done
			[
				/=/,
				{
					token: 'delimiter',
					switchTo: '@value'
				}
			],
			[/./, '@rematch', '@pop']
		],

		// Parsing a key identifier
		...createIdentChainStates('variable'),

		// Parsing a top level [table]
		table: [
			{ include: '@whitespace' },
			{ include: '@comment' },
			// increase nesting
			[/\[/, '@brackets', '@table'],
			[/@identChainStart/, '@rematch', '@identChain.type'],
			[/\]/, '@brackets', '@pop']
		],

		// Table name identifier
		...createIdentChainStates('type'),

		// A top level value (in a kvpair)
		value: [
			{ include: '@whitespace' },
			{ include: '@comment' },
			{ include: '@value.cases' },
			// not valid value
			[/./, '@rematch', '@pop']
		],

		'value.string.singleQuoted': createSingleLineLiteralStringState('string.literal'),
		'value.string.doubleQuoted': createSingleLineStringState('string'),
		'value.string.multi.doubleQuoted': [
			// anything not a quote or \ (escape char) is part of the string
			[/[^"\\]+/, 'string.multi'],

			// for more compatibility with themes, escape token classes are the same everywhere
			[/@escapes/, 'constant.character.escape'],
			// end of line continuation
			[/\\$/, `constant.character.escape`],
			// invalid escape sequence
			[/\\./, `constant.character.escape.invalid`],

			// the spec doesn't explicitly mention 3 or more quotes
			// are invalid, but it mentions 1 or 2 quotes are valid inside
			// multiline, so here we assume the rule is the same as literal multiline
			[/"""(""|")?/, 'string.multi', '@pop'],

			// not terminated by single "
			[/"/, 'string.multi']
		],
		'value.string.multi.singleQuoted': [
			// anything not ' is part of the string
			[/[^']+/, 'string.literal.multi'],
			// 3-5 ' ends the string
			[/'''(''|')?/, 'string.literal.multi', '@pop'],

			// not terminated by single '
			[/'/, 'string.literal.multi']
		],

		// Arrays
		'value.array': [
			{ include: '@whitespace' },
			{ include: '@comment' },
			// closing the array
			[/\]/, '@brackets', '@pop'],
			// seprator
			[/,/, 'delimiter'],
			// values in the array
			[/@valueStart/, '@rematch', '@value.array.entry'],

			// invalid syntax, skip until , or ]
			[/.+(?=[,\]])/, 'source']
		],

		// One entry in the array
		'value.array.entry': [
			{ include: '@whitespace' },
			{ include: '@comment' },
			// values in the array - pops if matches
			{ include: '@value.cases' },
			// invalid syntax, skip until , or ]
			[/.+(?=[,\]])/, 'source', '@pop'],
			// unterminated array, just give up
			// and skip one character
			[/./, 'source', '@pop']
		],

		// Inline-tables
		'value.inlinetable': [
			{ include: '@whitespace' },
			{ include: '@comment' },
			// closing the table
			[/\}/, '@brackets', '@pop'],
			// seprator
			[/,/, 'delimiter'],
			// key-value pairs in the table
			[/@identChainStart/, '@rematch', '@value.inlinetable.entry'],

			// *invalid* value without a key, still parse
			// the value so it doesn't become a key and mess up
			// further parsing
			[/=/, 'delimiter', '@value.inlinetable.value'],

			// *invalid* value without key or =
			[/@valueStart/, '@rematch', '@value.inlinetable.value'],
			// invalid syntax, skip until , or }
			[/.+(?=[,\}])/, 'source', '@pop']
		],

		// One entry (key-value pair) in the inline table
		'value.inlinetable.entry': [
			{ include: '@whitespace' },
			{ include: '@comment' },

			// key
			[/@identChainStart/, '@rematch', '@identChain.variable'],
			// = value
			[
				/=/,
				{
					token: 'delimiter',
					switchTo: '@value.inlinetable.value'
				}
			],
			// invalid syntax, skip until , or }
			[/.+(?=[,\}])/, 'source', '@pop']
		],

		// One value entry in the inline table
		'value.inlinetable.value': [
			{ include: '@whitespace' },
			{ include: '@comment' },
			// values in the table - pops back to inlinetable if matches
			{ include: '@value.cases' },
			// invalid syntax, skip until , or }
			[/.+(?=[,\}])/, 'source', '@pop'],
			// unterminated table, just give up
			// and skip one character
			[/./, 'source', '@pop']
		],

		'value.cases': [
			// basic (double quote) strings
			[
				/"""/,
				{
					token: 'string.multi',
					switchTo: '@value.string.multi.doubleQuoted'
				}
			],
			[/"(\\.|[^"])*$/, 'string.invalid'], // unterminated
			[
				/"/,
				{
					token: 'string',
					switchTo: '@value.string.doubleQuoted'
				}
			],

			// literal (single quote) strings
			[
				/'''/,
				{
					token: 'string.literal.multi',
					switchTo: '@value.string.multi.singleQuoted'
				}
			],
			[/'[^']*$/, 'string.literal.invalid'], // unterminated
			[
				/'/,
				{
					token: 'string.literal',
					switchTo: '@value.string.singleQuoted'
				}
			],

			// boolean
			[/(true|false)/, 'constant.language.boolean', '@pop'],

			// arrays
			[
				/\[/,
				{
					token: '@brackets',
					switchTo: '@value.array'
				}
			],

			// inline tables
			[
				/\{/,
				{
					token: '@brackets',
					switchTo: '@value.inlinetable'
				}
			],

			// integer type
			// require integer to be not followed by invalid tokens,
			// so it can run before the other types (since it's more common),
			// and not clash with other types
			// - 0-9 for integers with leading 0
			// - _ for separators (otherwise 123_456.789 would accept 123)
			// - oxb for hex, octal, binary
			// - \. and eE for floats
			// - '-' and ':' for date and time
			[/@numberInteger(?![0-9_oxbeE\.:-])/, 'number', '@pop'],

			// float
			[
				/@numberInteger(@floatFractionPart@floatExponentPart?|@floatExponentPart)/,
				'number.float',
				'@pop'
			],

			// integer types
			[/@numberOctal/, 'number.octal', '@pop'],
			[/@numberHex/, 'number.hex', '@pop'],
			[/@numberBinary/, 'number.binary', '@pop'],

			// special float
			[/[+-]?inf/, 'number.inf', '@pop'],
			[/[+-]?nan/, 'number.nan', '@pop'],

			// Date Time (offset and local)
			[/@date[Tt ]@time(@offset|Z)?/, 'number.datetime', '@pop'],
			[/@date/, 'number.date', '@pop'],
			[/@time/, 'number.time', '@pop']
		]
	}
};

type State = languages.IMonarchLanguageRule[];

/**
 * Create states for parsing a TOML identifier chain,
 * like `key`, `key.subkey`, `key."foo.bar"`, etc.,
 * using the given token class.
 */
function createIdentChainStates(tokenClass: string): Record<string, State> {
	const singleQuotedState = `identChain.${tokenClass}.singleQuoted`;
	const singleQuoteClass = `${tokenClass}.string.literal`;
	const doubleQuotedState = `identChain.${tokenClass}.doubleQuoted`;
	const doubleQuoteClass = `${tokenClass}.string`;
	return {
		[`identChain.${tokenClass}`]: [
			{ include: '@whitespace' },
			{ include: '@comment' },

			[/@identifier/, tokenClass],
			[/\./, 'delimiter'],

			// string literal
			[/'[^']*$/, `${tokenClass}.invalid`], // unterminated
			[
				/'/,
				{
					token: singleQuoteClass,
					next: `@${singleQuotedState}`
				}
			],

			// string
			[/"(\\.|[^"])*$/, `${tokenClass}.invalid`], // unterminated
			[
				/"/,
				{
					token: doubleQuoteClass,
					next: `@${doubleQuotedState}`
				}
			],

			// end of identifier chain
			[/./, '@rematch', '@pop']
		],
		[singleQuotedState]: createSingleLineLiteralStringState(singleQuoteClass),
		[doubleQuotedState]: createSingleLineStringState(doubleQuoteClass)
	};
}

/**
 * Create a state for parsing a single line literal string
 * (i.e a 'single quoted string') using the given token class.
 */
function createSingleLineLiteralStringState(tokenClass: string): State {
	return [
		// anything not a single quote
		[/[^']+/, tokenClass],
		// end of string
		[/'/, tokenClass, '@pop']
	];
}

/**
 * Create a state for parsing a single line string
 * (i.e a "double quoted string") using the given token class.
 */
function createSingleLineStringState(tokenClass: string): State {
	return [
		// anything not a quote or \ (escape char) is part of the string
		[/[^"\\]+/, tokenClass],

		// for more compatibility with themes, escape token classes are the same everywhere
		[/@escapes/, 'constant.character.escape'],
		// invalid escape sequence
		[/\\./, `constant.character.escape.invalid`],

		// end of string
		[/"/, tokenClass, '@pop']
	];
}
