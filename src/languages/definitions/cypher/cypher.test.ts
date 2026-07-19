/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('cypher', [
	// Comments
	[
		{
			line: '// Single line comment',
			tokens: [{ startIndex: 0, type: 'comment.cypher' }]
		}
	],
	[
		{
			line: 'MATCH /* comment part */ xyz',
			tokens: [
				{ startIndex: 0, type: 'keyword.cypher' },
				{ startIndex: 5, type: 'white.cypher' },
				{ startIndex: 6, type: 'comment.cypher' },
				{ startIndex: 24, type: 'white.cypher' },
				{ startIndex: 25, type: 'identifier.cypher' }
			]
		}
	],
	[
		{
			line: '/* multi line comment',
			tokens: [{ startIndex: 0, type: 'comment.cypher' }]
		},
		{
			line: 'comment continues MATCH // not done yet',
			tokens: [{ startIndex: 0, type: 'comment.cypher' }]
		},
		{
			line: 'comment ends */ MATCH',
			tokens: [
				{ startIndex: 0, type: 'comment.cypher' },
				{ startIndex: 15, type: 'white.cypher' },
				{ startIndex: 16, type: 'keyword.cypher' }
			]
		}
	],

	// Numbers: A decimal (integer or float) literal:
	[
		{
			line: '13',
			tokens: [{ startIndex: 0, type: 'number.cypher' }]
		}
	],
	[
		{
			line: '-40000',
			tokens: [{ startIndex: 0, type: 'number.cypher' }]
		}
	],
	[
		{
			line: '3.14',
			tokens: [{ startIndex: 0, type: 'number.float.cypher' }]
		}
	],
	[
		{
			line: '.314',
			tokens: [{ startIndex: 0, type: 'number.float.cypher' }]
		}
	],
	[
		{
			line: '-.314',
			tokens: [{ startIndex: 0, type: 'number.float.cypher' }]
		}
	],
	[
		{
			line: '6.022E23',
			tokens: [{ startIndex: 0, type: 'number.float.cypher' }]
		}
	],
	[
		{
			line: '-6.022e23',
			tokens: [{ startIndex: 0, type: 'number.float.cypher' }]
		}
	],
	[
		{
			line: '12E10',
			tokens: [{ startIndex: 0, type: 'number.float.cypher' }]
		}
	],
	[
		{
			line: '12e10',
			tokens: [{ startIndex: 0, type: 'number.float.cypher' }]
		}
	],
	[
		{
			line: '12e-10',
			tokens: [{ startIndex: 0, type: 'number.float.cypher' }]
		}
	],
	[
		{
			line: '12E-10',
			tokens: [{ startIndex: 0, type: 'number.float.cypher' }]
		}
	],

	// Numbers: A hexadecimal integer literal (starting with 0x)
	[
		{
			line: '0x13af',
			tokens: [{ startIndex: 0, type: 'number.hex.cypher' }]
		}
	],
	[
		{
			line: '0xFC3A9',
			tokens: [{ startIndex: 0, type: 'number.hex.cypher' }]
		}
	],
	[
		{
			line: '-0x66eff',
			tokens: [{ startIndex: 0, type: 'number.hex.cypher' }]
		}
	],

	// Numbers: An octal integer literal (starting with 0)
	[
		{
			line: '01372',
			tokens: [{ startIndex: 0, type: 'number.octal.cypher' }]
		}
	],
	[
		{
			line: '02127',
			tokens: [{ startIndex: 0, type: 'number.octal.cypher' }]
		}
	],
	[
		{
			line: '-05671',
			tokens: [{ startIndex: 0, type: 'number.octal.cypher' }]
		}
	],

	// Strings: A String literal ('', ""), escaped and non-escaped
	[
		{
			line: '"two \'words\'"',
			tokens: [{ startIndex: 0, type: 'string.cypher' }]
		}
	],
	[
		{
			line: '"two \\"words\\""',
			tokens: [{ startIndex: 0, type: 'string.cypher' }]
		}
	],
	[
		{
			line: '\'two "words"\'',
			tokens: [{ startIndex: 0, type: 'string.cypher' }]
		}
	],
	[
		{
			line: "'two \\'words\\''",
			tokens: [{ startIndex: 0, type: 'string.cypher' }]
		}
	],

	// Identifiers wrapped with backtick (``)
	[
		{
			line: '`variable`',
			tokens: [{ startIndex: 0, type: 'identifier.escape.cypher' }]
		}
	],
	[
		{
			line: '`A variable with weird stuff in it[]!`',
			tokens: [{ startIndex: 0, type: 'identifier.escape.cypher' }]
		}
	],
	[
		{
			line: '`Escaped \\`variable\\``',
			tokens: [{ startIndex: 0, type: 'identifier.escape.cypher' }]
		}
	],

	// Operators
	[
		{
			line: '1+2',
			tokens: [
				{ startIndex: 0, type: 'number.cypher' },
				{ startIndex: 1, type: 'delimiter.cypher' },
				{ startIndex: 2, type: 'number.cypher' }
			]
		}
	],
	[
		{
			line: '1++2',
			tokens: [
				{ startIndex: 0, type: 'number.cypher' },
				{ startIndex: 1, type: '' },
				{ startIndex: 3, type: 'number.cypher' }
			]
		}
	],

	// Builtin literals: A boolean literal (true | false)
	[
		{
			line: 'true',
			tokens: [{ startIndex: 0, type: 'predefined.literal.cypher' }]
		}
	],
	[
		{
			line: 'false',
			tokens: [{ startIndex: 0, type: 'predefined.literal.cypher' }]
		}
	],
	[
		{
			line: 'TRUE',
			tokens: [{ startIndex: 0, type: 'predefined.literal.cypher' }]
		}
	],
	[
		{
			line: 'FALSE',
			tokens: [{ startIndex: 0, type: 'predefined.literal.cypher' }]
		}
	],

	// Builtin literals: A null literal
	[
		{
			line: 'null',
			tokens: [{ startIndex: 0, type: 'predefined.literal.cypher' }]
		}
	],
	[
		{
			line: 'NULL',
			tokens: [{ startIndex: 0, type: 'predefined.literal.cypher' }]
		}
	],

	// Builtin functions
	[
		{
			line: 'properties(node)',
			tokens: [
				{ startIndex: 0, type: 'predefined.function.cypher' },
				{ startIndex: 10, type: 'delimiter.parenthesis.cypher' },
				{ startIndex: 11, type: 'identifier.cypher' },
				{ startIndex: 15, type: 'delimiter.parenthesis.cypher' }
			]
		}
	],
	[
		{
			line: 'left(right("Hello Cypher"))',
			tokens: [
				{ startIndex: 0, type: 'predefined.function.cypher' },
				{ startIndex: 4, type: 'delimiter.parenthesis.cypher' },
				{ startIndex: 5, type: 'predefined.function.cypher' },
				{ startIndex: 10, type: 'delimiter.parenthesis.cypher' },
				{ startIndex: 11, type: 'string.cypher' },
				{ startIndex: 25, type: 'delimiter.parenthesis.cypher' }
			]
		}
	],

	// Keywords
	[
		{
			line: 'MATCH (n) RETURN n',
			tokens: [
				{ startIndex: 0, type: 'keyword.cypher' },
				{ startIndex: 5, type: 'white.cypher' },
				{ startIndex: 6, type: 'delimiter.parenthesis.cypher' },
				{ startIndex: 7, type: 'identifier.cypher' },
				{ startIndex: 8, type: 'delimiter.parenthesis.cypher' },
				{ startIndex: 9, type: 'white.cypher' },
				{ startIndex: 10, type: 'keyword.cypher' },
				{ startIndex: 16, type: 'white.cypher' },
				{ startIndex: 17, type: 'identifier.cypher' }
			]
		}
	],

	// Labels on nodes and relationships
	[
		{
			line: '(n:NodeLabel1)-[:RelationshipType]->(:NodeLabel2:NodeLabel3)',
			tokens: [
				{ startIndex: 0, type: 'delimiter.parenthesis.cypher' },
				{ startIndex: 1, type: 'identifier.cypher' },
				{ startIndex: 2, type: 'type.identifier.cypher' },
				{ startIndex: 13, type: 'delimiter.parenthesis.cypher' },
				{ startIndex: 14, type: 'delimiter.cypher' },
				{ startIndex: 15, type: 'delimiter.bracket.cypher' },
				{ startIndex: 16, type: 'type.identifier.cypher' },
				{ startIndex: 33, type: 'delimiter.bracket.cypher' },
				{ startIndex: 34, type: 'delimiter.cypher' },
				{ startIndex: 36, type: 'delimiter.parenthesis.cypher' },
				{ startIndex: 37, type: 'type.identifier.cypher' },
				{ startIndex: 59, type: 'delimiter.parenthesis.cypher' }
			]
		}
	]
]);
