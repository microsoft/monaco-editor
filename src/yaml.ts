import IRichLanguageConfiguration = monaco.languages.LanguageConfiguration;
import ILanguage = monaco.languages.IMonarchLanguage;

export const conf: IRichLanguageConfiguration = {
	comments: {
		lineComment: '#'
	},
	brackets: [['{', '}'], ['[', ']']],
	autoClosingPairs: [
		{ open: '"', close: '"', notIn: ['string', 'comment'] },
		{ open: '\'', close: '\'', notIn: ['string', 'comment'] },
		{ open: '{', close: '}', notIn: ['string', 'comment'] },
		{ open: '[', close: ']', notIn: ['string', 'comment'] }
	]
};

export const language = <ILanguage> {
	defaultToken: '',
	ignoreCase: true,
	tokenPostfix: '.yaml',

	brackets: [
		{ token: 'delimiter.bracket', open: '{', close: '}' },
		{ token: 'delimiter.square', open: '[', close: ']' }
	],

	keywords: ['true', 'false', 'null', '~'],

	// we include these common regular expressions
	escapes: /\\(?:[btnfr\\"']|[0-7][0-7]?|[0-3][0-7]{2})/,

	// The main tokenizer for our languages
	tokenizer: {
		root: [
			{include: '@whitespace'},
			{include: '@comment'},

			// Directive
			[/%[^ ]+.*$/, 'meta.directive'],

			// Document Markers
			[/---/, 'operators.directivesEnd'],
			[/\.{3}/, 'operators.documentEnd'],

			// Block Structure Indicators
			[/[-?:](?= )/, 'operators'],

			{include: '@tagHandle'},
			{include: '@flowCollections'},
			{include: '@blockStyle'},

			// Key of a Key:Value pair
			[/(?:".*?"|'.*?'|.*?)(?=\s*: \S+)/, 'type', '@value'],
			[/(".*?"|'.*?'|.*?)(\s*)(:)(\s*)/, ['type', 'white', 'operators', 'white']],

			// string nodes
			[/.+$/, 'string']
		],

		// Value of a Key:Value pair
		value: [
			{include: '@whitespace'},
			{include: '@comment'},

			// Key:Value separator
			[/:(?= )/, 'operators'],

			{include: '@flowCollections'},
			{include: '@flowScalars'},
			{include: '@blockStyle'},

			[/[&*][^\[\]\{\}, ]+\s*$/, 'namespace', '@pop'], // Anchor copy to ensure it leaves the state with line-break
			{include: '@anchor'},
			{include: '@tagHandle'},

			// Numbers, cannot reuse as these terminate with the end of the line and pop the state
			[/\d{4}-\d\d-\d\d([Tt ]\d\d:\d\d:\d\d(\.\d+)?(( ?[+-]\d\d?(:\d\d)?)|Z)?)?$/, 'number.date', '@pop'],
			[/\d*\.\d+([eE][\-+]?\d+)?$/,   'number.float', '@pop'],
			[/0[xX][0-9a-fA-F]+[lL]?$/,     'number.hex', '@pop'],
			[/0[bB][0-1]+[lL]?$/,           'number.binary', '@pop'],
			[/(0[oO][0-7]+|0[0-7]+)[lL]?$/, 'number.octal', '@pop'],
			[/-?.(inf|NaN)$/,               'number.other', '@pop'],
			[/[+-]?(0|[1-9]\d*)[lL]?$/,     'number', '@pop'],

			// Other value (keyword or string)
			[/.+/, {cases: {'@keywords': { token: 'keyword', next: '@pop' },
											'@default': { token: 'string', next: '@pop' }}}]
		],

		// Flow Collection: Flow Mapping
		object: [
			{include: '@whitespace'},
			{include: '@comment'},

			// Flow Mapping termination
			[/\}/, '@brackets', '@pop'],

			// Flow Mapping delimiter
			[/,/, 'delimiter.comma'],

			// Flow Mapping Key:Value delimiter
			[/:(?= )/, 'operators'],

			// Flow Mapping Key:Value key
			[/(?:".*?"|'.*?'|[^,\{\[]+?)(?=: )/, 'type'],

			// Start Flow Style
			{include: '@flowCollections'},
			{include: '@flowScalars'},

			// Scalar Data types
			{include: '@tagHandle'},
			{include: '@anchor'},
			{include: '@number'},

			// Other value (keyword or string)
			[/[^\},]+/, {cases: {'@keywords': 'keyword',
													'@default': 'string'}}]
		],

		// Flow Collection: Flow Sequence
		array: [
			{include: '@whitespace'},
			{include: '@comment'},

			// Flow Sequence termination
			[/\]/, '@brackets', '@pop'],

			// Flow Sequence delimiter
			[/,/, 'delimiter.comma'],

			// Start Flow Style
			{include: '@flowCollections'},
			{include: '@flowScalars'},

			// Scalar Data types
			{include: '@tagHandle'},
			{include: '@anchor'},
			{include: '@number'},

			// Other value (keyword or string)
			[/[^\],]+/, {cases: {'@keywords': 'keyword',
													'@default': 'string'}}]
		],

		// Flow Scalars (quoted strings)
		string: [
			[/[^\\"']+/, 'string'],
			[/@escapes/, 'string.escape'],
			[/\\./,      'string.escape.invalid'],
			[/["']/,     { cases: { '$#==$S2' : { token: 'string', next: '@pop' },
															'@default': 'string' }} ]
		],

		// First line of a Block Style
		multiString: [
			[/^( +).+$/, 'string', '@multiStringContinued.$1']
		],

		// Further lines of a Block Style
		//   Workaround for indentation detection
		multiStringContinued: [
			[/^( *).+$/, {cases: {'$1==$S2': 'string',
														'@default': {token: '@rematch', next: '@popall'}}}]
		],

		whitespace: [
			[/[ \t\r\n]+/, 'white']
		],

		// Only line comments
		comment: [
			[/#.*$/, 'comment']
		],

		// Start Flow Collections
		flowCollections: [
			[/\[/, '@brackets', '@array'],
			[/\{/, '@brackets', '@object']
		],

		// Start Flow Scalars (quoted strings)
		flowScalars: [
			[/"/,  'string', '@string."' ],
			[/'/,  'string', '@string.\'' ]
		],

		// Start Block Scalar
		blockStyle: [
			[/[>|][0-9]*[+-]?$/, 'operators', '@multiString']
		],

		number: [
			// Date format (does not test validity)
			[/\d{4}-\d\d-\d\d([Tt ]\d\d:\d\d:\d\d(\.\d+)?(( ?[+-]\d\d?(:\d\d)?)|Z)?)?/, 'number.date'],

			[/\d*\.\d+([eE][\-+]?\d+)?/,   'number.float'],
			[/0[xX][0-9a-fA-F]+[lL]?/,     'number.hex'],
			[/0[bB][0-1]+[lL]?/,           'number.binary'],
			[/(0[oO][0-7]+|0[0-7]+)[lL]?/, 'number.octal'],
			[/-?.(inf|NaN)/,               'number.other'],
			[/[+-]?(0|[1-9]\d*)[lL]?/,     'number']
		],

		tagHandle: [
			[/\![^ ]*/, 'tag']
		],

		anchor: [
			[/[&*][^ ]+/, 'namespace']
		]
	}
};
