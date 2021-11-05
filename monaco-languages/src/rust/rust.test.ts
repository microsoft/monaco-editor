/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('rust', [
	// String
	[
		{
			line: 'let a = "This is a string"',
			tokens: [
				{ startIndex: 0, type: 'keyword.rust' },
				{ startIndex: 3, type: 'white.rust' },
				{ startIndex: 4, type: 'identifier.rust' },
				{ startIndex: 5, type: 'white.rust' },
				{ startIndex: 6, type: 'operator.rust' },
				{ startIndex: 7, type: 'white.rust' },
				{ startIndex: 8, type: 'string.quote.rust' },
				{ startIndex: 9, type: 'string.rust' },
				{ startIndex: 25, type: 'string.quote.rust' }
			]
		}
	],
	// Raw String
	[
		{
			line: 'r"This is a raw string" ',
			tokens: [
				{ startIndex: 0, type: 'string.quote.rust' },
				{ startIndex: 2, type: 'string.rust' },
				{ startIndex: 22, type: 'string.quote.rust' },
				{ startIndex: 23, type: 'white.rust' }
			]
		}
	],
	[
		{
			line: 'r#"This is a raw string"# ',
			tokens: [
				{ startIndex: 0, type: 'string.quote.rust' },
				{ startIndex: 3, type: 'string.rust' },
				{ startIndex: 23, type: 'string.quote.rust' },
				{ startIndex: 25, type: 'white.rust' }
			]
		}
	],
	[
		{
			line: 'r##"This is a# raw string"## ',
			tokens: [
				{ startIndex: 0, type: 'string.quote.rust' },
				{ startIndex: 4, type: 'string.rust' },
				{ startIndex: 25, type: 'string.quote.rust' },
				{ startIndex: 28, type: 'white.rust' }
			]
		}
	],
	[
		{
			line: 'r###"This is multi-line',
			tokens: [
				{ startIndex: 0, type: 'string.quote.rust' },
				{ startIndex: 5, type: 'string.rust' }
			]
		},
		{
			line: 'raw "##string"### ',
			tokens: [
				{ startIndex: 0, type: 'string.rust' },
				{ startIndex: 13, type: 'string.quote.rust' },
				{ startIndex: 17, type: 'white.rust' }
			]
		}
	],
	// Byte literal
	[
		{
			line: "let a = 'c'",
			tokens: [
				{ startIndex: 0, type: 'keyword.rust' },
				{ startIndex: 3, type: 'white.rust' },
				{ startIndex: 4, type: 'identifier.rust' },
				{ startIndex: 5, type: 'white.rust' },
				{ startIndex: 6, type: 'operator.rust' },
				{ startIndex: 7, type: 'white.rust' },
				{ startIndex: 8, type: 'string.byteliteral.rust' }
			]
		}
	],
	[
		{
			line: "'\\\"'",
			tokens: [{ startIndex: 0, type: 'string.byteliteral.rust' }]
		}
	],
	[
		{
			line: "'\\0'",
			tokens: [{ startIndex: 0, type: 'string.byteliteral.rust' }]
		}
	],
	// Comment
	[
		{
			line: '// This is a comment',
			tokens: [{ startIndex: 0, type: 'comment.rust' }]
		}
	],
	// Block Comment
	[
		{
			line: '/* This is a block comment */',
			tokens: [{ startIndex: 0, type: 'comment.rust' }]
		}
	],
	[
		{
			line: '/* This is a block comment // with a comment */',
			tokens: [{ startIndex: 0, type: 'comment.rust' }]
		}
	],
	// Lifetime Annotation
	[
		{
			line: 'static NAME: &\'static str = "John"',
			tokens: [
				{ startIndex: 0, type: 'keyword.rust' },
				{ startIndex: 6, type: 'white.rust' },
				{ startIndex: 7, type: 'identifier.rust' },
				{ startIndex: 11, type: 'operator.rust' },
				{ startIndex: 12, type: 'white.rust' },
				{ startIndex: 13, type: 'operator.rust' },
				{ startIndex: 14, type: 'identifier.rust' },
				{ startIndex: 21, type: 'white.rust' },
				{ startIndex: 22, type: 'keyword.type.rust' },
				{ startIndex: 25, type: 'white.rust' },
				{ startIndex: 26, type: 'operator.rust' },
				{ startIndex: 27, type: 'white.rust' },
				{ startIndex: 28, type: 'string.quote.rust' },
				{ startIndex: 29, type: 'string.rust' },
				{ startIndex: 33, type: 'string.quote.rust' }
			]
		}
	],
	// Type Keywords
	[
		{
			line: 'let logical: bool = true',
			tokens: [
				{ startIndex: 0, type: 'keyword.rust' },
				{ startIndex: 3, type: 'white.rust' },
				{ startIndex: 4, type: 'identifier.rust' },
				{ startIndex: 11, type: 'operator.rust' },
				{ startIndex: 12, type: 'white.rust' },
				{ startIndex: 13, type: 'keyword.type.rust' },
				{ startIndex: 17, type: 'white.rust' },
				{ startIndex: 18, type: 'operator.rust' },
				{ startIndex: 19, type: 'white.rust' },
				{ startIndex: 20, type: 'keyword.rust' }
			]
		}
	],
	// Numbers
	// Integer
	[
		{
			line: '1000_000_00u32',
			tokens: [{ startIndex: 0, type: 'number.rust' }]
		}
	],
	// Float
	[
		{
			line: '1.0f32',
			tokens: [{ startIndex: 0, type: 'number.rust' }]
		}
	],
	// Hex
	[
		{
			line: '0xFA_01i32',
			tokens: [{ startIndex: 0, type: 'number.rust' }]
		}
	],
	// Exponent
	[
		{
			line: '1.0E-8234987_f64',
			tokens: [{ startIndex: 0, type: 'number.rust' }]
		}
	],
	// Binary
	[
		{
			line: '0b0_1u8',
			tokens: [{ startIndex: 0, type: 'number.rust' }]
		}
	],
	// Octal
	[
		{
			line: '0o0000_0010u64',
			tokens: [{ startIndex: 0, type: 'number.rust' }]
		}
	]
]);
