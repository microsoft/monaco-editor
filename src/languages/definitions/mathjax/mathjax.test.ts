/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('mathjax', [

	// --- Comments ---
	[
		{
			line: '% a comment',
			tokens: [{ startIndex: 0, type: 'comment.mathjax' }]
		}
	],
	[
		{
			line: 'x % inline comment',
			tokens: [
				{ startIndex: 0, type: 'variable.mathjax' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'comment.mathjax' }
			]
		}
	],

	// --- Numbers ---
	[
		{
			line: '42',
			tokens: [{ startIndex: 0, type: 'number.mathjax' }]
		}
	],
	[
		{
			line: '3.14',
			tokens: [{ startIndex: 0, type: 'number.mathjax' }]
		}
	],
	[
		{
			line: '0.5',
			tokens: [{ startIndex: 0, type: 'number.mathjax' }]
		}
	],

	// --- Variables (single letters) ---
	[
		{
			line: 'x',
			tokens: [{ startIndex: 0, type: 'variable.mathjax' }]
		}
	],
	[
		{
			line: 'n',
			tokens: [{ startIndex: 0, type: 'variable.mathjax' }]
		}
	],

	// --- Operators ---
	[
		{
			line: 'a + b',
			tokens: [
				{ startIndex: 0, type: 'variable.mathjax' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'operator.mathjax' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'variable.mathjax' }
			]
		}
	],
	[
		{
			line: 'f = g',
			tokens: [
				{ startIndex: 0, type: 'variable.mathjax' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'operator.mathjax' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'variable.mathjax' }
			]
		}
	],

	// --- Superscript and subscript ---
	[
		{
			line: 'x^2',
			tokens: [
				{ startIndex: 0, type: 'variable.mathjax' },
				{ startIndex: 1, type: 'keyword.operator.mathjax' },
				{ startIndex: 2, type: 'number.mathjax' }
			]
		}
	],
	[
		{
			line: 'a_n',
			tokens: [
				{ startIndex: 0, type: 'variable.mathjax' },
				{ startIndex: 1, type: 'keyword.operator.mathjax' },
				{ startIndex: 2, type: 'variable.mathjax' }
			]
		}
	],
	[
		{
			line: 'x_{n+1}',
			tokens: [
				{ startIndex: 0, type: 'variable.mathjax' },
				{ startIndex: 1, type: 'keyword.operator.mathjax' },
				{ startIndex: 2, type: 'delimiter.curly.mathjax' },
				{ startIndex: 3, type: 'variable.mathjax' },
				{ startIndex: 4, type: 'operator.mathjax' },
				{ startIndex: 5, type: 'number.mathjax' },
				{ startIndex: 6, type: 'delimiter.curly.mathjax' }
			]
		}
	],
	[
		{
			line: '\\beta_2',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'constant.greek.mathjax' },
				{ startIndex: 5, type: 'keyword.operator.mathjax' },
				{ startIndex: 6, type: 'number.mathjax' }
			]
		}
	],

	// --- Alignment operator ---
	[
		{
			line: 'a & b',
			tokens: [
				{ startIndex: 0, type: 'variable.mathjax' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'keyword.operator.mathjax' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'variable.mathjax' }
			]
		}
	],

	// --- Brackets ---
	[
		{
			line: '(a + b)',
			tokens: [
				{ startIndex: 0, type: 'delimiter.parenthesis.mathjax' },
				{ startIndex: 1, type: 'variable.mathjax' },
				{ startIndex: 2, type: '' },
				{ startIndex: 3, type: 'operator.mathjax' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'variable.mathjax' },
				{ startIndex: 6, type: 'delimiter.parenthesis.mathjax' }
			]
		}
	],
	[
		{
			line: '{a}',
			tokens: [
				{ startIndex: 0, type: 'delimiter.curly.mathjax' },
				{ startIndex: 1, type: 'variable.mathjax' },
				{ startIndex: 2, type: 'delimiter.curly.mathjax' }
			]
		}
	],

	// --- Double backslash (line break) ---
	[
		{
			line: '\\\\',
			tokens: [{ startIndex: 0, type: 'keyword.mathjax' }]
		}
	],

	// --- Single-char commands ---
	[
		{
			line: '\\,',
			tokens: [{ startIndex: 0, type: 'keyword.mathjax' }]
		}
	],
	[
		{
			line: '\\!',
			tokens: [{ startIndex: 0, type: 'keyword.mathjax' }]
		}
	],
	[
		{
			line: '\\{',
			tokens: [{ startIndex: 0, type: 'keyword.mathjax' }]
		}
	],

	// --- Greek letters ---
	[
		{
			line: '\\alpha',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'constant.greek.mathjax' }
			]
		}
	],
	[
		{
			line: '\\Omega',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'constant.greek.mathjax' }
			]
		}
	],
	[
		{
			line: '\\varepsilon',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'constant.greek.mathjax' }
			]
		}
	],
	[
		{
			// Hebrew letter
			line: '\\aleph',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'constant.greek.mathjax' }
			]
		}
	],

	// --- Math functions ---
	[
		{
			line: '\\sin',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'support.function.mathjax' }
			]
		}
	],
	[
		{
			line: '\\arctan',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'support.function.mathjax' }
			]
		}
	],
	[
		{
			line: '\\lim',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'support.function.mathjax' }
			]
		}
	],
	[
		{
			line: '\\limsup',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'support.function.mathjax' }
			]
		}
	],
	[
		{
			line: '\\gcd',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'support.function.mathjax' }
			]
		}
	],

	// --- Math operators (structural/large) ---
	[
		{
			line: '\\frac',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.operator.mathjax' }
			]
		}
	],
	[
		{
			line: '\\sqrt',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.operator.mathjax' }
			]
		}
	],
	[
		{
			line: '\\int',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.operator.mathjax' }
			]
		}
	],
	[
		{
			line: '\\sum',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.operator.mathjax' }
			]
		}
	],
	[
		{
			line: '\\bigcup',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.operator.mathjax' }
			]
		}
	],
	[
		{
			line: '\\partial',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.operator.mathjax' }
			]
		}
	],

	// --- Relations ---
	[
		{
			line: '\\leq',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.relation.mathjax' }
			]
		}
	],
	[
		{
			line: '\\subseteq',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.relation.mathjax' }
			]
		}
	],
	[
		{
			line: '\\in',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.relation.mathjax' }
			]
		}
	],
	[
		{
			line: '\\therefore',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.relation.mathjax' }
			]
		}
	],

	// --- Accents ---
	[
		{
			line: '\\hat',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.accent.mathjax' }
			]
		}
	],
	[
		{
			line: '\\vec',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.accent.mathjax' }
			]
		}
	],
	[
		{
			line: '\\overbrace',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.accent.mathjax' }
			]
		}
	],
	[
		{
			// Capitalized accent variant
			line: '\\Hat',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.accent.mathjax' }
			]
		}
	],

	// --- Arrows ---
	[
		{
			line: '\\rightarrow',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.arrow.mathjax' }
			]
		}
	],
	[
		{
			line: '\\Leftrightarrow',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.arrow.mathjax' }
			]
		}
	],
	[
		{
			line: '\\mapsto',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.arrow.mathjax' }
			]
		}
	],
	[
		{
			line: '\\implies',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.arrow.mathjax' }
			]
		}
	],
	[
		{
			line: '\\iff',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.arrow.mathjax' }
			]
		}
	],

	// --- Sizing / style ---
	[
		{
			line: '\\left',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.sizing.mathjax' }
			]
		}
	],
	[
		{
			line: '\\displaystyle',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.sizing.mathjax' }
			]
		}
	],
	[
		{
			line: '\\bigg',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.sizing.mathjax' }
			]
		}
	],

	// --- Named delimiters ---
	[
		{
			line: '\\langle',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.delimiter.mathjax' }
			]
		}
	],
	[
		{
			line: '\\rfloor',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.delimiter.mathjax' }
			]
		}
	],
	[
		{
			line: '\\Vert',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.delimiter.mathjax' }
			]
		}
	],

	// --- Spacing ---
	[
		{
			line: '\\quad',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.spacing.mathjax' }
			]
		}
	],
	[
		{
			line: '\\qquad',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.spacing.mathjax' }
			]
		}
	],

	// --- Font commands + argument ---
	[
		{
			line: '\\text{hello}',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.font.mathjax' },
				{ startIndex: 5, type: 'delimiter.curly.mathjax' },
				{ startIndex: 6, type: 'string.mathjax' },
				{ startIndex: 11, type: 'delimiter.curly.mathjax' }
			]
		}
	],
	[
		{
			line: '\\mathbb{R}',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.font.mathjax' },
				{ startIndex: 7, type: 'delimiter.curly.mathjax' },
				{ startIndex: 8, type: 'string.mathjax' },
				{ startIndex: 9, type: 'delimiter.curly.mathjax' }
			]
		}
	],
	[
		{
			// Nested braces inside font argument
			line: '\\text{f(x)}',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.font.mathjax' },
				{ startIndex: 5, type: 'delimiter.curly.mathjax' },
				{ startIndex: 6, type: 'string.mathjax' },
				{ startIndex: 10, type: 'delimiter.curly.mathjax' }
			]
		}
	],

	// --- Misc symbols ---
	[
		{
			line: '\\infty',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'constant.symbol.mathjax' }
			]
		}
	],
	[
		{
			line: '\\forall',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'constant.symbol.mathjax' }
			]
		}
	],
	[
		{
			line: '\\cdot',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'constant.symbol.mathjax' }
			]
		}
	],
	[
		{
			line: '\\oplus',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'constant.symbol.mathjax' }
			]
		}
	],
	[
		{
			line: '\\ldots',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'constant.symbol.mathjax' }
			]
		}
	],

	// --- Unknown/catch-all command ---
	[
		{
			line: '\\myCustomMacro',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.mathjax' }
			]
		}
	],

	// --- Prefix ambiguity: \in vs \infty vs \int ---
	[
		{
			// \int must not match as \in + t
			line: '\\int',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.operator.mathjax' }
			]
		}
	],
	[
		{
			// \infty must not match as \in + fy
			line: '\\infty',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'constant.symbol.mathjax' }
			]
		}
	],
	[
		{
			// \lim must not swallow \limsup or \liminf
			line: '\\limsup',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'support.function.mathjax' }
			]
		}
	],
	[
		{
			// \subset must not shadow \subseteq
			line: '\\subseteq',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.relation.mathjax' }
			]
		}
	],

	// --- Multi-token expression: quadratic formula ---
	[
		{
			line: 'x = \\frac{-b}{2a}',
			tokens: [
				{ startIndex: 0, type: 'variable.mathjax' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'operator.mathjax' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'keyword.control.mathjax' },
				{ startIndex: 5, type: 'keyword.operator.mathjax' },
				{ startIndex: 9, type: 'delimiter.curly.mathjax' },
				{ startIndex: 10, type: 'operator.mathjax' },
				{ startIndex: 11, type: 'variable.mathjax' },
				{ startIndex: 12, type: 'delimiter.curly.mathjax' },
				{ startIndex: 14, type: 'number.mathjax' },
				{ startIndex: 15, type: 'variable.mathjax' },
				{ startIndex: 16, type: 'delimiter.curly.mathjax' }
			]
		}
	],

	// --- Multi-token expression: integral ---
	// \int_0^1 f(x)\, dx
	// 01234567890123456789
	[
		{
			line: '\\int_0^1 f(x)\\, dx',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },        // \
				{ startIndex: 1, type: 'keyword.operator.mathjax' },        // int
				{ startIndex: 5, type: 'number.mathjax' },                  // 0 (_4 merged into int token by Monarch)
				{ startIndex: 6, type: 'keyword.operator.mathjax' },        // ^
				{ startIndex: 7, type: 'number.mathjax' },                  // 1
				{ startIndex: 8, type: '' },                                // (space)
				{ startIndex: 9, type: 'variable.mathjax' },                // f
				{ startIndex: 10, type: 'delimiter.parenthesis.mathjax' },  // (
				{ startIndex: 11, type: 'variable.mathjax' },               // x
				{ startIndex: 12, type: 'delimiter.parenthesis.mathjax' },  // )
				{ startIndex: 13, type: 'keyword.mathjax' },                // \,
				{ startIndex: 15, type: '' },                               // (space)
				{ startIndex: 16, type: 'variable.mathjax' }                // dx (merged)
			]
		}
	],

	// --- Multi-line: sum across two lines ---
	// \sum_{n=0}^{\infty}
	// 0123456789012345678 9
	[
		{
			line: '\\sum_{n=0}^{\\infty}',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },        // \
				{ startIndex: 1, type: 'keyword.operator.mathjax' },        // sum
				{ startIndex: 5, type: 'delimiter.curly.mathjax' },         // { (_4 merged by Monarch)
				{ startIndex: 6, type: 'variable.mathjax' },                // n
				{ startIndex: 7, type: 'operator.mathjax' },                // =
				{ startIndex: 8, type: 'number.mathjax' },                  // 0
				{ startIndex: 9, type: 'delimiter.curly.mathjax' },         // }
				{ startIndex: 10, type: 'keyword.operator.mathjax' },       // ^
				{ startIndex: 11, type: 'delimiter.curly.mathjax' },        // {
				{ startIndex: 12, type: 'keyword.control.mathjax' },        // \
				{ startIndex: 13, type: 'constant.symbol.mathjax' },        // infty
				{ startIndex: 18, type: 'delimiter.curly.mathjax' }         // }
			]
		},
		{
			// \frac{1}{n^2}
			// 0123456789012 3
			line: '\\frac{1}{n^2}',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },        // \
				{ startIndex: 1, type: 'keyword.operator.mathjax' },        // frac
				{ startIndex: 5, type: 'delimiter.curly.mathjax' },         // {
				{ startIndex: 6, type: 'number.mathjax' },                  // 1
				{ startIndex: 7, type: 'delimiter.curly.mathjax' },         // }
				{ startIndex: 9, type: 'variable.mathjax' },                // n ({ at 8 merged into })
				{ startIndex: 10, type: 'keyword.operator.mathjax' },       // ^
				{ startIndex: 11, type: 'number.mathjax' },                 // 2
				{ startIndex: 12, type: 'delimiter.curly.mathjax' }         // }
			]
		}
	],

	// --- \left \right with delimiter ---
	[
		{
			line: '\\left( x \\right)',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.sizing.mathjax' },
				{ startIndex: 5, type: 'delimiter.parenthesis.mathjax' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'variable.mathjax' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'keyword.control.mathjax' },
				{ startIndex: 10, type: 'keyword.sizing.mathjax' },
				{ startIndex: 15, type: 'delimiter.parenthesis.mathjax' }
			]
		}
	],

	// --- \text{} state does not persist across expressions ---
	[
		{
			line: '\\text{for all} x',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.mathjax' },
				{ startIndex: 1, type: 'keyword.font.mathjax' },
				{ startIndex: 5, type: 'delimiter.curly.mathjax' },
				{ startIndex: 6, type: 'string.mathjax' },
				{ startIndex: 13, type: 'delimiter.curly.mathjax' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'variable.mathjax' }
			]
		}
	],
]);
