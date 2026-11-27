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
		{ open: '(', close: ')' },
		{ open: '$', close: '$' }
	],
	surroundingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '$', close: '$' }
	],
	comments: {
		lineComment: '%'
	}
};

export const language = <languages.IMonarchLanguage>{
	defaultToken: '',
	tokenPostfix: '.latex',

	// Built-in LaTeX commands (from madoko latex.json)
	builtins: [
		'addcontentsline',
		'addtocontents',
		'addtocounter',
		'address',
		'addtolength',
		'addvspace',
		'alph',
		'appendix',
		'arabic',
		'author',
		'backslash',
		'baselineskip',
		'baselinestretch',
		'bf',
		'bibitem',
		'bigskipamount',
		'bigskip',
		'boldmath',
		'boldsymbol',
		'cal',
		'caption',
		'cdots',
		'centering',
		'chapter',
		'circle',
		'cite',
		'cleardoublepage',
		'clearpage',
		'cline',
		'closing',
		'color',
		'copyright',
		'dashbox',
		'date',
		'ddots',
		'documentclass',
		'dotfill',
		'em',
		'emph',
		'ensuremath',
		'epigraph',
		'euro',
		'fbox',
		'flushbottom',
		'fnsymbol',
		'footnote',
		'footnotemark',
		'footnotesize',
		'footnotetext',
		'frac',
		'frame',
		'framebox',
		'frenchspacing',
		'hfill',
		'hline',
		'href',
		'hrulefill',
		'hspace',
		'huge',
		'Huge',
		'hyphenation',
		'include',
		'includegraphics',
		'includeonly',
		'indent',
		'input',
		'it',
		'item',
		'kill',
		'label',
		'large',
		'Large',
		'LARGE',
		'LaTeX',
		'LaTeXe',
		'ldots',
		'left',
		'lefteqn',
		'line',
		'linebreak',
		'linethickness',
		'linewidth',
		'listoffigures',
		'listoftables',
		'location',
		'makebox',
		'maketitle',
		'markboth',
		'mathcal',
		'mathop',
		'mbox',
		'medskip',
		'multicolumn',
		'multiput',
		'newcommand',
		'newcolumntype',
		'newcounter',
		'newenvironment',
		'newfont',
		'newlength',
		'newline',
		'newpage',
		'newsavebox',
		'newtheorem',
		'nocite',
		'noindent',
		'nolinebreak',
		'nonfrenchspacing',
		'normalsize',
		'nopagebreak',
		'not',
		'onecolumn',
		'opening',
		'oval',
		'overbrace',
		'overline',
		'pagebreak',
		'pagenumbering',
		'pageref',
		'pagestyle',
		'par',
		'paragraph',
		'parbox',
		'parindent',
		'parskip',
		'part',
		'protect',
		'providecommand',
		'put',
		'raggedbottom',
		'raggedleft',
		'raggedright',
		'raisebox',
		'ref',
		'renewcommand',
		'right',
		'rm',
		'roman',
		'rule',
		'savebox',
		'sbox',
		'sc',
		'scriptsize',
		'section',
		'setcounter',
		'setlength',
		'settowidth',
		'sf',
		'shortstack',
		'signature',
		'sl',
		'slash',
		'small',
		'smallskip',
		'sout',
		'space',
		'sqrt',
		'stackrel',
		'stepcounter',
		'subparagraph',
		'subsection',
		'subsubsection',
		'tableofcontents',
		'telephone',
		'TeX',
		'textbf',
		'textcolor',
		'textit',
		'textmd',
		'textnormal',
		'textrm',
		'textsc',
		'textsf',
		'textsl',
		'texttt',
		'textup',
		'textwidth',
		'textheight',
		'thanks',
		'thispagestyle',
		'tiny',
		'title',
		'today',
		'tt',
		'twocolumn',
		'typeout',
		'typein',
		'uline',
		'underbrace',
		'underline',
		'unitlength',
		'usebox',
		'usecounter',
		'uwave',
		'value',
		'vbox',
		'vcenter',
		'vdots',
		'vector',
		'verb',
		'vfill',
		'vline',
		'vphantom',
		'vspace',
		'RequirePackage',
		'NeedsTeXFormat',
		'usepackage',
		'documentstyle',
		'def',
		'edef',
		'defcommand',
		'if',
		'ifdim',
		'ifnum',
		'ifx',
		'fi',
		'else',
		'begingroup',
		'endgroup',
		'definecolor',
		'textcolor',
		'eifstrequal', 'eeifstrequal'
	],

	tokenizer: {
		root: [
			// Whitespace and comments
			{ include: '@whitespace' },

			// Display math $$...$$ — must come before inline math $
			[/\$\$/, { token: 'string.math.display', next: '@displayMath' }],

			// Inline math $...$
			[/\$/, { token: 'string.math.inline', next: '@inlineMath' }],

			// \begin{envname}
			[/\\begin(?=\s*\{)/, { token: 'keyword.predefined', next: '@envNameBegin' }],

			// \end{envname}
			[/\\end(?=\s*\{)/, { token: 'keyword.predefined', next: '@envNameEnd' }],

			// \@letters (package/class internal commands)
			[/\\@[a-zA-Z@]+/, 'keyword.at'],

			// Named commands: split backslash and name into separate tokens
			// so we can check the name against the builtins list
			[
				/(\\)([a-zA-Z]+)/,
				[
					'keyword.control',
					{
						cases: {
							'@builtins': 'keyword.predefined',
							'@default': 'keyword'
						}
					}
				]
			],

			// Single-character commands: \ followed by non-letter (e.g. \\ \$ \% \& \{ \})
			[/\\[^a-zA-Z@]/, 'keyword'],

			// Numeric arguments #1, #2, ...
			[/#[0-9]/, 'number.arg'],

			// Dimensions with LaTeX units
			[/[+-]?\d+(\.\d+)?\s*(em|ex|pt|pc|sp|cm|mm|in)\b/, 'number.len'],

			// Brackets
			[/[{}()\[\]]/, '@brackets'],

			// Special LaTeX characters
			[/[&~_^]/, 'keyword'],
		],

		whitespace: [
			[/[ \t\r\n]+/, ''],
			[/%.*$/, 'comment'],
		],

		// After \begin — captures {envname}
		envNameBegin: [
			[/\s+/, ''],
			[/\{/, 'delimiter.curly'],
			[/[\w@*\-]+/, 'tag'],
			[/\}/, { token: 'delimiter.curly', next: '@pop' }],
			['', '', '@pop'],
		],

		// After \end — captures {envname}
		envNameEnd: [
			[/\s+/, ''],
			[/\{/, 'delimiter.curly'],
			[/[\w@*\-]+/, 'tag'],
			[/\}/, { token: 'delimiter.curly', next: '@pop' }],
			['', '', '@pop'],
		],

		// Inside $...$
		inlineMath: [
			[/\$/, { token: 'string.math.inline', next: '@pop' }],
			{ include: '@mathContent' },
		],

		// Inside $$...$$
		displayMath: [
			[/\$\$/, { token: 'string.math.display', next: '@pop' }],
			{ include: '@mathContent' },
		],

		// Shared math content
		mathContent: [
			{ include: '@whitespace' },
			[/\\[a-zA-Z]+/, 'keyword.math'],
			[/\\[^a-zA-Z]/, 'keyword.math'],
			[/[{}()\[\]]/, '@brackets'],
			[/[+\-*/=<>!,;|]/, 'operator'],
			[/\d+(\.\d+)?/, 'number'],
			[/[^\\$\s+\-*/=<>!,;|{}()\[\]]+/, 'string.math'],
		],
	}
};
