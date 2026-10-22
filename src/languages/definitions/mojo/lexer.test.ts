/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

// Independently authored lexical examples; upstream references and exclusions are in AGENTS.md.
testTokenization('mojo', [
	// lexToken(): horizontal/vertical whitespace and editor line-continuation recovery.
	[{ line: ' \t\0\f\v', tokens: [{ startIndex: 0, type: 'white.mojo' }] }],
	[{ line: '\u00a0', tokens: [{ startIndex: 0, type: 'invalid.mojo' }] }],
	[
		{
			line: '6 \\',
			tokens: [
				{ startIndex: 0, type: 'number.mojo' },
				{ startIndex: 1, type: 'white.mojo' },
				{ startIndex: 2, type: 'delimiter.mojo' }
			]
		},
		{
			line: '+3',
			tokens: [
				{ startIndex: 0, type: 'operator.mojo' },
				{ startIndex: 1, type: 'number.mojo' }
			]
		}
	],
	[
		{
			line: '6 \\ \t',
			tokens: [
				{ startIndex: 0, type: 'number.mojo' },
				{ startIndex: 1, type: 'white.mojo' },
				{ startIndex: 2, type: 'delimiter.mojo' }
			]
		},
		{
			line: '+3',
			tokens: [
				{ startIndex: 0, type: 'operator.mojo' },
				{ startIndex: 1, type: 'number.mojo' }
			]
		}
	],
	[
		{
			line: '\\next',
			tokens: [
				{ startIndex: 0, type: 'invalid.mojo' },
				{ startIndex: 1, type: 'identifier.mojo' }
			]
		}
	],
	[{ line: '!', tokens: [{ startIndex: 0, type: 'invalid.mojo' }] }],

	// Punctuation in TokenKinds.def order. Individual fixtures cover each spelling.
	[{ line: '%', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: '&', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: '()', tokens: [{ startIndex: 0, type: 'delimiter.parenthesis.mojo' }] }],
	[{ line: '*', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: '+', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: ',', tokens: [{ startIndex: 0, type: 'delimiter.mojo' }] }],
	[{ line: '-', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: '.', tokens: [{ startIndex: 0, type: 'delimiter.mojo' }] }],
	[{ line: '/', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: ':', tokens: [{ startIndex: 0, type: 'delimiter.mojo' }] }],
	[{ line: ';', tokens: [{ startIndex: 0, type: 'delimiter.mojo' }] }],
	[{ line: '<', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: '=', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: '>', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: '@', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: '[]', tokens: [{ startIndex: 0, type: 'delimiter.square.mojo' }] }],
	[{ line: '^', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: '{}', tokens: [{ startIndex: 0, type: 'delimiter.curly.mojo' }] }],
	[{ line: '|', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: '~', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: '!=', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: '%=', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: '&=', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: '**', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: '*=', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: '+=', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: '-=', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: '->', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: '//', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: '/=', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: ':=', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: '<<', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: '<=', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: '<>', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: '==', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: '>=', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: '>>', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: '@=', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: '^=', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: '|=', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: '**=', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: '...', tokens: [{ startIndex: 0, type: 'delimiter.mojo' }] }],
	[{ line: '//=', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: '<<=', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[{ line: '>>=', tokens: [{ startIndex: 0, type: 'operator.mojo' }] }],
	[
		{
			line: '()[]{}',
			tokens: [
				{ startIndex: 0, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 2, type: 'delimiter.square.mojo' },
				{ startIndex: 4, type: 'delimiter.curly.mojo' }
			]
		}
	],
	[
		{
			line: '... .5',
			tokens: [
				{ startIndex: 0, type: 'delimiter.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'number.float.mojo' }
			]
		}
	],

	// lexIdentifierOrKeyword(): production keywords, independent of grammar tables.
	[{ line: '_', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'and', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'as', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'assert', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'async', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'await', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'break', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'case', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'class', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'comptime', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'continue', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'def', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'del', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'elif', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'else', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'except', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'fn', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'False', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'finally', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'for', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'from', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'global', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'if', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'import', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'in', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'is', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'lambda', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'match', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'None', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'nonlocal', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'not', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'or', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'pass', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'raise', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'ref', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'return', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'Self', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'struct', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'trait', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'True', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'try', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'var', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'while', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'with', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'yield', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: '__extension', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: '__generator_type', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: '__get_address_as_uninit_lvalue', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: '__get_mvalue_as_litref', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: '__get_litref_as_mvalue', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: '__get_address_as_owned_value', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: '__mlir_region', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'origin_of', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'type_of', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'conforms_to', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: '__functions_in_module', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: '__get_current_function_name', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: '__struct_field_ref', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: '__is_run_in_comptime_interpreter', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: '__match', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }],
	[{ line: 'record_8', tokens: [{ startIndex: 0, type: 'identifier.mojo' }] }],
	[{ line: 'item$slot', tokens: [{ startIndex: 0, type: 'identifier.mojo' }] }],
	[{ line: 'def$slot', tokens: [{ startIndex: 0, type: 'identifier.mojo' }] }],
	[{ line: 'self', tokens: [{ startIndex: 0, type: 'identifier.mojo' }] }],
	[{ line: 'true', tokens: [{ startIndex: 0, type: 'identifier.mojo' }] }],
	[{ line: 'none', tokens: [{ startIndex: 0, type: 'identifier.mojo' }] }],
	[{ line: 'where', tokens: [{ startIndex: 0, type: 'identifier.mojo' }] }],
	[{ line: 'imm', tokens: [{ startIndex: 0, type: 'identifier.mojo' }] }],
	[{ line: '__async', tokens: [{ startIndex: 0, type: 'identifier.mojo' }] }],
	[{ line: '__await', tokens: [{ startIndex: 0, type: 'identifier.mojo' }] }],
	[{ line: '__enum', tokens: [{ startIndex: 0, type: 'identifier.mojo' }] }],
	[{ line: '__mojo_crash', tokens: [{ startIndex: 0, type: 'identifier.mojo' }] }],
	[{ line: '_slot', tokens: [{ startIndex: 0, type: 'identifier.mojo' }] }],
	[{ line: 'False0', tokens: [{ startIndex: 0, type: 'identifier.mojo' }] }],
	[
		{
			line: '$slot',
			tokens: [
				{ startIndex: 0, type: 'invalid.mojo' },
				{ startIndex: 1, type: 'identifier.mojo' }
			]
		}
	],
	[
		{
			line: 'πname',
			tokens: [
				{ startIndex: 0, type: 'invalid.mojo' },
				{ startIndex: 1, type: 'identifier.mojo' }
			]
		}
	],

	// lexBacktickIdentifier(): verbatim names, non-BMP offsets and unfinished recovery.
	[{ line: '`while`', tokens: [{ startIndex: 0, type: 'identifier.mojo' }] }],
	[{ line: '`field.name`', tokens: [{ startIndex: 0, type: 'identifier.mojo' }] }],
	[{ line: '`δείγμα`', tokens: [{ startIndex: 0, type: 'identifier.mojo' }] }],
	[{ line: '`two names`', tokens: [{ startIndex: 0, type: 'identifier.mojo' }] }],
	[{ line: '`$`', tokens: [{ startIndex: 0, type: 'identifier.mojo' }] }],
	[{ line: '`!`', tokens: [{ startIndex: 0, type: 'identifier.mojo' }] }],
	[{ line: '`7 : index`', tokens: [{ startIndex: 0, type: 'identifier.mojo' }] }],
	[
		{
			line: '`🚀`+2',
			tokens: [
				{ startIndex: 0, type: 'identifier.mojo' },
				{ startIndex: 4, type: 'operator.mojo' },
				{ startIndex: 5, type: 'number.mojo' }
			]
		}
	],
	[{ line: '``', tokens: [{ startIndex: 0, type: 'invalid.mojo' }] }],
	[
		{ line: '`partial', tokens: [{ startIndex: 0, type: 'invalid.mojo' }] },
		{ line: 'True', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }
	],
	[
		{
			line: '`bad\fTrue',
			tokens: [
				{ startIndex: 0, type: 'invalid.mojo' },
				{ startIndex: 4, type: 'white.mojo' },
				{ startIndex: 5, type: 'keyword.mojo' }
			]
		}
	],
	[
		{
			line: '`bad\vFalse',
			tokens: [
				{ startIndex: 0, type: 'invalid.mojo' },
				{ startIndex: 4, type: 'white.mojo' },
				{ startIndex: 5, type: 'keyword.mojo' }
			]
		}
	],

	// skipComment(): comment content is opaque, including NUL and trailing backslashes.
	[{ line: '#!/usr/bin/env mojo', tokens: [{ startIndex: 0, type: 'comment.mojo' }] }],
	[
		{
			line: '# sample\fTrue',
			tokens: [
				{ startIndex: 0, type: 'comment.mojo' },
				{ startIndex: 8, type: 'white.mojo' },
				{ startIndex: 9, type: 'keyword.mojo' }
			]
		}
	],
	[
		{
			line: '# sample\vFalse',
			tokens: [
				{ startIndex: 0, type: 'comment.mojo' },
				{ startIndex: 8, type: 'white.mojo' },
				{ startIndex: 9, type: 'keyword.mojo' }
			]
		}
	],
	[
		{ line: '# note 🚀', tokens: [{ startIndex: 0, type: 'comment.mojo' }] },
		{ line: 'False', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }
	],
	[
		{
			line: '3#\0not "code"',
			tokens: [
				{ startIndex: 0, type: 'number.mojo' },
				{ startIndex: 1, type: 'comment.mojo' }
			]
		}
	],
	[
		{ line: '# ignored \\', tokens: [{ startIndex: 0, type: 'comment.mojo' }] },
		{ line: 'True', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] }
	],

	// lexInteger(): prefix case, permissive underscores, signs and malformed prefixes.
	[{ line: '0b0', tokens: [{ startIndex: 0, type: 'number.binary.mojo' }] }],
	[{ line: '0B_110__', tokens: [{ startIndex: 0, type: 'number.binary.mojo' }] }],
	[{ line: '0b___', tokens: [{ startIndex: 0, type: 'number.invalid.mojo' }] }],
	[{ line: '0o6', tokens: [{ startIndex: 0, type: 'number.octal.mojo' }] }],
	[{ line: '0O_654__', tokens: [{ startIndex: 0, type: 'number.octal.mojo' }] }],
	[{ line: '0o_', tokens: [{ startIndex: 0, type: 'number.invalid.mojo' }] }],
	[{ line: '0xa', tokens: [{ startIndex: 0, type: 'number.hex.mojo' }] }],
	[{ line: '0X_beef__', tokens: [{ startIndex: 0, type: 'number.hex.mojo' }] }],
	[{ line: '0x', tokens: [{ startIndex: 0, type: 'number.invalid.mojo' }] }],
	[{ line: '0', tokens: [{ startIndex: 0, type: 'number.mojo' }] }],
	[{ line: '00__0_', tokens: [{ startIndex: 0, type: 'number.mojo' }] }],
	[{ line: '6__8_', tokens: [{ startIndex: 0, type: 'number.mojo' }] }],
	[{ line: '1357', tokens: [{ startIndex: 0, type: 'number.mojo' }] }],
	[{ line: '0678', tokens: [{ startIndex: 0, type: 'number.invalid.mojo' }] }],
	[
		{
			line: '-6',
			tokens: [
				{ startIndex: 0, type: 'operator.mojo' },
				{ startIndex: 1, type: 'number.mojo' }
			]
		}
	],
	[
		{
			line: '0b102',
			tokens: [
				{ startIndex: 0, type: 'number.binary.mojo' },
				{ startIndex: 4, type: 'number.mojo' }
			]
		}
	],
	[
		{
			line: '0o78',
			tokens: [
				{ startIndex: 0, type: 'number.octal.mojo' },
				{ startIndex: 3, type: 'number.mojo' }
			]
		}
	],
	[
		{
			line: '0x2G',
			tokens: [
				{ startIndex: 0, type: 'number.hex.mojo' },
				{ startIndex: 3, type: 'identifier.mojo' }
			]
		}
	],
	[
		{
			line: '23name',
			tokens: [
				{ startIndex: 0, type: 'number.mojo' },
				{ startIndex: 2, type: 'identifier.mojo' }
			]
		}
	],

	// lexFloat(): point/exponent forms and lexical error boundaries, not numeric values.
	[{ line: '.625', tokens: [{ startIndex: 0, type: 'number.float.mojo' }] }],
	[{ line: '6.', tokens: [{ startIndex: 0, type: 'number.float.mojo' }] }],
	[{ line: '6.125', tokens: [{ startIndex: 0, type: 'number.float.mojo' }] }],
	[{ line: '6_000.0_75', tokens: [{ startIndex: 0, type: 'number.float.mojo' }] }],
	[{ line: '6e3', tokens: [{ startIndex: 0, type: 'number.float.mojo' }] }],
	[{ line: '6E+3', tokens: [{ startIndex: 0, type: 'number.float.mojo' }] }],
	[{ line: '6.2e-4', tokens: [{ startIndex: 0, type: 'number.float.mojo' }] }],
	[
		{
			line: '-0.0',
			tokens: [
				{ startIndex: 0, type: 'operator.mojo' },
				{ startIndex: 1, type: 'number.float.mojo' }
			]
		}
	],
	[{ line: '4e-323', tokens: [{ startIndex: 0, type: 'number.float.mojo' }] }],
	[{ line: '0.125', tokens: [{ startIndex: 0, type: 'number.float.mojo' }] }],
	[{ line: '00.125', tokens: [{ startIndex: 0, type: 'number.float.mojo' }] }],
	[{ line: '6e', tokens: [{ startIndex: 0, type: 'number.invalid.mojo' }] }],
	[{ line: '6e+', tokens: [{ startIndex: 0, type: 'number.invalid.mojo' }] }],
	[{ line: '6.125e-', tokens: [{ startIndex: 0, type: 'number.invalid.mojo' }] }],
	[
		{
			line: '6e+*',
			tokens: [
				{ startIndex: 0, type: 'number.invalid.mojo' },
				{ startIndex: 3, type: 'operator.mojo' }
			]
		}
	],
	[
		{
			line: '6e*',
			tokens: [
				{ startIndex: 0, type: 'number.invalid.mojo' },
				{ startIndex: 2, type: 'operator.mojo' }
			]
		}
	],
	[
		{
			line: '6._e',
			tokens: [
				{ startIndex: 0, type: 'number.float.mojo' },
				{ startIndex: 2, type: 'identifier.mojo' }
			]
		}
	],
	[
		{
			line: '0678.125',
			tokens: [
				{ startIndex: 0, type: 'number.invalid.mojo' },
				{ startIndex: 4, type: 'number.float.mojo' }
			]
		}
	],
	[
		{
			line: '00_7.125',
			tokens: [
				{ startIndex: 0, type: 'number.mojo' },
				{ startIndex: 3, type: 'number.float.mojo' }
			]
		}
	],
	[{ line: '.6E-2__', tokens: [{ startIndex: 0, type: 'number.float.mojo' }] }],
	[{ line: '6.e+2', tokens: [{ startIndex: 0, type: 'number.float.mojo' }] }],
	[
		{
			line: '6e_2',
			tokens: [
				{ startIndex: 0, type: 'number.invalid.mojo' },
				{ startIndex: 2, type: 'identifier.mojo' }
			]
		}
	],
	[
		{
			line: '2.5tail',
			tokens: [
				{ startIndex: 0, type: 'number.float.mojo' },
				{ startIndex: 3, type: 'identifier.mojo' }
			]
		}
	],
	[{ line: '2..5', tokens: [{ startIndex: 0, type: 'number.float.mojo' }] }]
]);
