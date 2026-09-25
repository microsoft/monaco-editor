/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { languages } from '../../../editor';

export const conf: languages.LanguageConfiguration = {
	brackets: [
		['{', '}'],
		['[', ']'],
		['(', ')']
	],
	autoClosingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' }
	],
	surroundingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' }
	],
	comments: {
		lineComment: '%'
	}
};

export const language = <languages.IMonarchLanguage>{
	defaultToken: '',
	tokenPostfix: '.mathjax',

	// Greek letters (lowercase, uppercase, variants) and Hebrew letters
	greekLetters: [
		'alpha',
		'beta',
		'chi',
		'delta',
		'epsilon',
		'eta',
		'gamma',
		'iota',
		'kappa',
		'lambda',
		'mu',
		'nu',
		'omega',
		'phi',
		'pi',
		'psi',
		'rho',
		'sigma',
		'tau',
		'theta',
		'upsilon',
		'xi',
		'zeta',
		'Delta',
		'Gamma',
		'Lambda',
		'Omega',
		'Phi',
		'Pi',
		'Psi',
		'Sigma',
		'Theta',
		'Upsilon',
		'Xi',
		// variants
		'varepsilon',
		'varphi',
		'varpi',
		'varrho',
		'varsigma',
		'vartheta',
		'varkappa',
		'digamma',
		// Hebrew
		'aleph',
		'beth',
		'gimel',
		'daleth'
	],

	// Named math functions (rendered upright)
	mathFunctions: [
		'arccos',
		'arcsin',
		'arctan',
		'cos',
		'cosh',
		'cot',
		'coth',
		'csc',
		'deg',
		'det',
		'dim',
		'exp',
		'gcd',
		'hom',
		'inf',
		'ker',
		'lg',
		'lim',
		'liminf',
		'limsup',
		'ln',
		'log',
		'max',
		'min',
		'Pr',
		'sec',
		'sin',
		'sinh',
		'sup',
		'tan',
		'tanh',
		'arg'
	],

	// Structural/large operators
	mathOperators: [
		'frac',
		'sqrt',
		'sum',
		'prod',
		'coprod',
		'int',
		'iint',
		'iiint',
		'iiiint',
		'oint',
		'partial',
		'nabla',
		'bigcap',
		'bigcup',
		'biguplus',
		'bigoplus',
		'bigotimes',
		'bigodot',
		'bigvee',
		'bigwedge',
		'bigsqcup'
	],

	// Relational symbols
	mathRelations: [
		'leq',
		'geq',
		'neq',
		'approx',
		'equiv',
		'cong',
		'sim',
		'simeq',
		'propto',
		'subset',
		'supset',
		'subseteq',
		'supseteq',
		'sqsubset',
		'sqsubseteq',
		'sqsupset',
		'sqsupseteq',
		'in',
		'notin',
		'ni',
		'prec',
		'succ',
		'preceq',
		'succeq',
		'll',
		'gg',
		'perp',
		'mid',
		'parallel',
		'vdash',
		'dashv',
		'models',
		'bowtie',
		'smile',
		'frown',
		'asymp',
		'doteq',
		'approxeq',
		'thicksim',
		'triangleq',
		'therefore',
		'because'
	],

	// Math mode accents and decorations
	mathAccents: [
		'bar',
		'hat',
		'tilde',
		'dot',
		'ddot',
		'vec',
		'acute',
		'grave',
		'breve',
		'check',
		'widehat',
		'widetilde',
		'overline',
		'underline',
		'overbrace',
		'underbrace',
		'overrightarrow',
		'overleftarrow',
		'Bar',
		'Hat',
		'Tilde',
		'Dot',
		'Ddot',
		'Vec',
		'Acute',
		'Grave',
		'Breve',
		'Check'
	],

	// Arrow symbols
	mathArrows: [
		'leftarrow',
		'rightarrow',
		'Rightarrow',
		'leftrightarrow',
		'Leftarrow',
		'ReRightarrow',
		'Leftrightarrow',
		'longleftarrow',
		'longrightarrow',
		'longleftrightarrow',
		'Longleftarrow',
		'Longrightarrow',
		'Longleftrightarrow',
		'uparrow',
		'downarrow',
		'updownarrow',
		'Uparrow',
		'Downarrow',
		'Updownarrow',
		'mapsto',
		'longmapsto',
		'nearrow',
		'searrow',
		'swarrow',
		'nwarrow',
		'hookleftarrow',
		'hookrightarrow',
		'leftharpoonup',
		'leftharpoondown',
		'rightharpoonup',
		'rightharpoondown',
		'rightleftharpoons',
		'leftrightharpoons',
		'curvearrowleft',
		'curvearrowright',
		'to',
		'gets',
		'implies',
		'iff'
	],

	// Delimiter sizing and math style commands
	mathSizing: [
		'left',
		'right',
		'big',
		'Big',
		'bigg',
		'Bigg',
		'bigl',
		'bigr',
		'bigm',
		'displaystyle',
		'textstyle',
		'scriptstyle',
		'scriptscriptstyle'
	],

	// Named delimiter symbols
	mathDelimiters: [
		'langle',
		'rangle',
		'lfloor',
		'rfloor',
		'lceil',
		'rceil',
		'lbrace',
		'rbrace',
		'vert',
		'Vert',
		'llcorner',
		'lrcorner',
		'ulcorner',
		'urcorner'
	],

	// Font/style commands
	mathFonts: [
		'mathrm',
		'mathbf',
		'mathit',
		'mathsf',
		'mathtt',
		'mathcal',
		'mathfrak',
		'mathbb',
		'mathscr',
		'text',
		'textrm',
		'textit',
		'textbf'
	],

	// Spacing commands
	mathSpacing: [
		'quad',
		'qquad',
		'hspace',
		'mspace',
		'mkern',
		'thinspace',
		'negthinspace'
	],

	// Miscellaneous math symbols
	mathSymbols: [
		'infty',
		'emptyset',
		'varnothing',
		'prime',
		'backprime',
		'cdot',
		'times',
		'div',
		'pm',
		'mp',
		'circ',
		'bullet',
		'star',
		'ast',
		'dagger',
		'ddagger',
		'oplus',
		'ominus',
		'otimes',
		'oslash',
		'odot',
		'diamond',
		'wr',
		'amalg',
		'cap',
		'cup',
		'setminus',
		'land',
		'lor',
		'neg',
		'forall',
		'exists',
		'nexists',
		'ldots',
		'cdots',
		'vdots',
		'ddots',
		'hbar',
		'hslash',
		'ell',
		'wp',
		'Re',
		'Im',
		'angle',
		'measuredangle',
		'triangle',
		'surd',
		'clubsuit',
		'diamondsuit',
		'heartsuit',
		'spadesuit',
		'eth',
		'sharp',
		'flat',
		'natural',
		'top',
		'bot',
		'complement'
	],

	tokenizer: {
		root: [
			// Whitespace and comments
			{ include: '@whitespace' },

			// Double backslash (line break in math)
			[/\\\\/, 'keyword'],

			// Named commands — check against each category in priority order
			[
				/(\\)((?:arc(?:cos|sin|tan)|(?:cos|sin|tan|sec|csc|cot)h?|limsup|liminf|lim|log|ln|lg|exp|max|min|sup|inf|det|deg|dim|gcd|ker|hom|arg|Pr))(?![a-zA-Z])/,
				['keyword.control', 'support.function']
			],
			[
				/(\\)((?:iiiint|iiint|iint|oint|int|frac|sqrt|sum|prod|coprod|partial|nabla|bigsqcup|biguplus|bigotimes|bigodot|bigoplus|bigwedge|bigvee|bigcup|bigcap))(?![a-zA-Z])/,
				['keyword.control', 'keyword.operator']
			],
			[
				/(\\)((?:sqsubseteq|sqsupseteq|sqsubset|sqsupset|subseteq|supseteq|subset|supset|approxeq|thicksim|triangleq|therefore|because|parallel|preceq|succeq|propto|approx|models|dashv|vdash|bowtie|notin|equiv|simeq|asymp|doteq|frown|smile|prec|succ|geq|leq|neq|cong|sim|mid|gg|ll|ni|in))(?![a-zA-Z])/,
				['keyword.control', 'keyword.relation']
			],
			[
				/(\\)((?:overleftarrow|overrightarrow|underbrace|overbrace|underline|overline|widetilde|widehat|breve|check|grave|acute|tilde|ddot|dot|vec|bar|hat|Bar|Hat|Tilde|Dot|Ddot|Vec|Acute|Grave|Breve|Check))(?![a-zA-Z])/,
				['keyword.control', 'keyword.accent']
			],
			[
				/(\\)((?:longleftrightarrow|longrightarrow|longleftarrow|Longleftrightarrow|Longrightarrow|Longleftarrow|leftrightharpoons|rightleftharpoons|leftharpoondown|rightharpoondown|leftharpoonup|rightharpoonup|curvearrowright|curvearrowleft|hookrightarrow|hookleftarrow|Leftrightarrow|leftrightarrow|updownarrow|Updownarrow|longmapsto|Rightarrow|Leftarrow|rightarrow|leftarrow|Downarrow|downarrow|searrow|nearrow|swarrow|nwarrow|mapsto|Uparrow|uparrow|implies|gets|iff|to))(?![a-zA-Z])/,
				['keyword.control', 'keyword.arrow']
			],
			[
				/(\\)((?:scriptscriptstyle|displaystyle|scriptstyle|textstyle|bigg|Bigg|bigl|bigr|bigm|Big|big|left|right))(?![a-zA-Z])/,
				['keyword.control', 'keyword.sizing']
			],
			[
				/(\\)((?:llcorner|lrcorner|ulcorner|urcorner|langle|rangle|lfloor|rfloor|lceil|rceil|lbrace|rbrace|Vert|vert))(?![a-zA-Z])/,
				['keyword.control', 'keyword.delimiter']
			],
			[
				/(\\)((?:mathrm|mathbf|mathit|mathsf|mathtt|mathcal|mathfrak|mathscr|mathbb|textrm|textit|textbf|text))(?![a-zA-Z])/,
				[{ token: 'keyword.control' }, { token: 'keyword.font', next: '@mathFontArg' }]
			],
			[
				/(\\)((?:negthinspace|thinspace|qquad|quad|hspace|mspace|mkern))(?![a-zA-Z])/,
				['keyword.control', 'keyword.spacing']
			],
			[
				/(\\)((?:measuredangle|complement|varnothing|backprime|clubsuit|diamondsuit|heartsuit|spadesuit|nexists|diamond|dagger|ddagger|bullet|setminus|natural|ldots|cdots|vdots|ddots|hslash|angle|surd|sharp|flat|times|infty|prime|exists|forall|amalg|emptyset|ominus|otimes|oslash|oplus|odot|hbar|cdot|land|neg|div|lor|ast|cup|cap|bot|top|ell|eth|wr|Im|Re|wp|pm|mp|star|circ))(?![a-zA-Z])/,
				['keyword.control', 'constant.symbol']
			],
			[
				/(\\)((?:varepsilon|varkappa|varsigma|vartheta|digamma|varpi|varrho|varphi|Upsilon|upsilon|daleth|aleph|alpha|delta|gamma|kappa|sigma|theta|omega|Delta|Gamma|iota|Lambda|Omega|Sigma|Theta|Upsilon|lambda|beta|gimel|beth|eta|zeta|chi|phi|rho|tau|mu|nu|pi|xi|Phi|Psi|Xi|Pi))(?![a-zA-Z])/,
				['keyword.control', 'constant.greek']
			],

			// Catch-all named command
			[/(\\)([a-zA-Z]+)/, ['keyword.control', 'keyword']],

			// Single-char commands: \ + non-letter
			[/\\[^a-zA-Z]/, 'keyword'],

			// Brackets
			[/[{}()\[\]]/, '@brackets'],

			// Sub/superscript, alignment
			[/[_^&]/, 'keyword.operator'],

			// Standard operators
			[/[+\-/*=<>!,;|]/, 'operator'],

			// Numbers
			[/\d+(\.\d+)?/, 'number'],

			// Single-letter math variables
			[/[a-zA-Z]/, 'variable'],
		],

		whitespace: [
			[/[ \t\r\n]+/, ''],
			[/%.*$/, 'comment'],
		],

		// Captures the argument to font commands like \text{...} as plain text
		mathFontArg: [
			[/\s+/, ''],
			[/\{/, { token: 'delimiter.curly', next: '@mathFontArgContent' }],
			['', '', '@pop'],
		],

		mathFontArgContent: [
			[/[^{}]+/, 'string'],
			[/\{/, { token: 'delimiter.curly', next: '@mathFontArgContent' }],
			[/\}/, { token: 'delimiter.curly', next: '@pop' }],
		],
	}
};
