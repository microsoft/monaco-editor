/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('tcl', [
	// Definitions
	[
		{
			line: 'set var 1',
			tokens: [
				{ startIndex: 0, type: 'keyword.flow.tcl' }, // `set`
				{ startIndex: 3, type: 'source.tcl' }, // ` `
				{ startIndex: 4, type: 'type.tcl' }, // `var`
				{ startIndex: 7, type: 'white.tcl' }, // ` `
				{ startIndex: 8, type: 'number.tcl' } // `1`
			]
		}
	],

	[
		{
			line: 'proc func {a b} {}',
			tokens: [
				{ startIndex: 0, type: 'keyword.flow.tcl' }, // `proc`
				{ startIndex: 4, type: 'source.tcl' }, // ` `
				{ startIndex: 5, type: 'type.tcl' }, // `func`
				{ startIndex: 9, type: 'white.tcl' }, // ` `
				{ startIndex: 10, type: 'delimiter.curly.tcl' }, // `{`
				{ startIndex: 11, type: 'operator.scss.tcl' }, // `a`
				{ startIndex: 12, type: 'white.tcl' }, // ` `
				{ startIndex: 13, type: 'operator.scss.tcl' }, // `b`
				{ startIndex: 14, type: 'delimiter.curly.tcl' }, // `}`
				{ startIndex: 15, type: 'white.tcl' }, // ` `
				{ startIndex: 16, type: 'delimiter.curly.tcl' } // `{}`
			]
		}
	],

	// Keywords
	[
		{
			line: 'if 1 return',
			tokens: [
				{ startIndex: 0, type: 'keyword.tcl' },
				{ startIndex: 2, type: 'white.tcl' },
				{ startIndex: 3, type: 'number.tcl' },
				{ startIndex: 4, type: 'white.tcl' },
				{ startIndex: 5, type: 'keyword.tcl' }
			]
		}
	],

	// Variables
	[
		{
			line: '$var1 $::var2 $$var3 ${var 4} $::{var 5}',
			tokens: [
				{ startIndex: 0, type: 'type.identifier.tcl' },
				{ startIndex: 5, type: 'white.tcl' },
				{ startIndex: 6, type: 'type.identifier.tcl' },
				{ startIndex: 13, type: 'white.tcl' },
				{ startIndex: 14, type: 'type.identifier.tcl' },
				{ startIndex: 20, type: 'white.tcl' },
				{ startIndex: 21, type: 'identifier.tcl' },
				{ startIndex: 23, type: 'type.identifier.tcl' },
				{ startIndex: 28, type: 'identifier.tcl' },
				{ startIndex: 29, type: 'white.tcl' },
				{ startIndex: 30, type: 'identifier.tcl' },
				{ startIndex: 34, type: 'type.identifier.tcl' },
				{ startIndex: 39, type: 'identifier.tcl' }
			]
		}
	],

	// Function and variable string interpolation
	[
		{
			line: 'puts "$var1 + ${var 2} = [expr $var1 + ${var 2}]"',
			tokens: [
				{ startIndex: 0, type: 'variable.tcl' },
				{ startIndex: 4, type: 'white.tcl' },
				{ startIndex: 5, type: 'string.quote.tcl' },
				{ startIndex: 6, type: 'type.identifier.tcl' },
				{ startIndex: 11, type: 'string.tcl' },
				{ startIndex: 14, type: 'identifier.tcl' },
				{ startIndex: 16, type: 'type.identifier.tcl' },
				{ startIndex: 21, type: 'identifier.tcl' },
				{ startIndex: 22, type: 'string.tcl' },
				{ startIndex: 25, type: 'delimiter.square.tcl' },
				{ startIndex: 26, type: 'keyword.tcl' },
				{ startIndex: 30, type: 'white.tcl' },
				{ startIndex: 31, type: 'type.identifier.tcl' },
				{ startIndex: 36, type: 'white.tcl' },
				{ startIndex: 37, type: 'operator.tcl' },
				{ startIndex: 38, type: 'white.tcl' },
				{ startIndex: 39, type: 'identifier.tcl' },
				{ startIndex: 41, type: 'type.identifier.tcl' },
				{ startIndex: 46, type: 'identifier.tcl' },
				{ startIndex: 47, type: 'delimiter.square.tcl' },
				{ startIndex: 48, type: 'string.quote.tcl' }
			]
		}
	]
]);
