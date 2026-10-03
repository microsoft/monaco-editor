/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('latex', [
	// Comment
	[
		{
			line: '% This is a comment',
			tokens: [{ startIndex: 0, type: 'comment.latex' }]
		}
	],

	// Known (builtin) command
	[
		{
			line: '\\textbf',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.latex' },
				{ startIndex: 1, type: 'keyword.predefined.latex' }
			]
		}
	],

	// Unknown (non-builtin) command
	[
		{
			line: '\\myCustomCommand',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.latex' },
				{ startIndex: 1, type: 'keyword.latex' }
			]
		}
	],

	// \begin{document}
	[
		{
			line: '\\begin{document}',
			tokens: [
				{ startIndex: 0, type: 'keyword.predefined.latex' },
				{ startIndex: 6, type: 'delimiter.curly.latex' },
				{ startIndex: 7, type: 'tag.latex' },
				{ startIndex: 15, type: 'delimiter.curly.latex' }
			]
		}
	],

	// \end{document}
	[
		{
			line: '\\end{document}',
			tokens: [
				{ startIndex: 0, type: 'keyword.predefined.latex' },
				{ startIndex: 4, type: 'delimiter.curly.latex' },
				{ startIndex: 5, type: 'tag.latex' },
				{ startIndex: 13, type: 'delimiter.curly.latex' }
			]
		}
	],

	// Inline math $x$
	[
		{
			line: '$x$',
			tokens: [
				{ startIndex: 0, type: 'string.math.inline.latex' },
				{ startIndex: 1, type: 'string.math.latex' },
				{ startIndex: 2, type: 'string.math.inline.latex' }
			]
		}
	],

	// Display math $$x$$
	[
		{
			line: '$$x$$',
			tokens: [
				{ startIndex: 0, type: 'string.math.display.latex' },
				{ startIndex: 2, type: 'string.math.latex' },
				{ startIndex: 3, type: 'string.math.display.latex' }
			]
		}
	],

	// Numeric argument #1
	[
		{
			line: '#1',
			tokens: [{ startIndex: 0, type: 'number.arg.latex' }]
		}
	],

	// Dimension with unit
	[
		{
			line: '1.5em',
			tokens: [{ startIndex: 0, type: 'number.len.latex' }]
		}
	],

	// Single-char command \\
	[
		{
			line: '\\\\',
			tokens: [{ startIndex: 0, type: 'keyword.latex' }]
		}
	],

	// Special chars
	[
		{
			line: 'a & b',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'keyword.latex' },
				{ startIndex: 3, type: '' }
			]
		}
	],

	// Internal command with @
	[
		{
			line: '\\@fooBar',
			tokens: [{ startIndex: 0, type: 'keyword.at.latex' }]
		}
	],

	// Additional begin/end environment names
	[
		{
			line: '\\begin{align*}',
			tokens: [
				{ startIndex: 0, type: 'keyword.predefined.latex' },
				{ startIndex: 6, type: 'delimiter.curly.latex' },
				{ startIndex: 7, type: 'tag.latex' },
				{ startIndex: 13, type: 'delimiter.curly.latex' }
			]
		}
	],
	[
		{
			line: '\\end{my-env}',
			tokens: [
				{ startIndex: 0, type: 'keyword.predefined.latex' },
				{ startIndex: 4, type: 'delimiter.curly.latex' },
				{ startIndex: 5, type: 'tag.latex' },
				{ startIndex: 11, type: 'delimiter.curly.latex' }
			]
		}
	],

	// Inline math with operator and number
	[
		{
			line: '$x+1$',
			tokens: [
				{ startIndex: 0, type: 'string.math.inline.latex' },
				{ startIndex: 1, type: 'string.math.latex' },
				{ startIndex: 2, type: 'operator.latex' },
				{ startIndex: 3, type: 'number.latex' },
				{ startIndex: 4, type: 'string.math.inline.latex' }
			]
		}
	],

	// Display math with command and braces
	[
		{
			line: '$$\\frac{1}{2}$$',
			tokens: [
				{ startIndex: 0, type: 'string.math.display.latex' },
				{ startIndex: 2, type: 'keyword.math.latex' },
				{ startIndex: 7, type: 'delimiter.curly.latex' },
				{ startIndex: 8, type: 'number.latex' },
				{ startIndex: 9, type: 'delimiter.curly.latex' },
				{ startIndex: 11, type: 'number.latex' },
				{ startIndex: 12, type: 'delimiter.curly.latex' },
				{ startIndex: 13, type: 'string.math.display.latex' }
			]
		}
	],

	// Escaped special command
	[
		{
			line: '\\$',
			tokens: [{ startIndex: 0, type: 'keyword.latex' }]
		}
	],

	// Additional numeric arg and dimensions
	[
		{
			line: '#9',
			tokens: [{ startIndex: 0, type: 'number.arg.latex' }]
		}
	],
	[
		{
			line: '-2.0 cm',
			tokens: [{ startIndex: 0, type: 'number.len.latex' }]
		}
	],

	// Builtin vs unknown command boundary
	[
		{
			line: '\\Huge',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.latex' },
				{ startIndex: 1, type: 'keyword.predefined.latex' }
			]
		}
	],
	[
		{
			line: '\\textbffoo',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.latex' },
				{ startIndex: 1, type: 'keyword.latex' }
			]
		}
	]
]);
