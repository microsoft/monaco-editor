/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { testTokenization } from '../test/testRunner';

testTokenization('powerquery', [
	// Comments
	[{
		line: '// a comment',
		tokens: [
			{ startIndex: 0, type: 'comment.pq' }
		]
	}],

	[{
		line: '    // a comment */',
		tokens: [
			{ startIndex: 0, type: 'white.pq' },
			{ startIndex: 4, type: 'comment.pq' }
		]
	}],

	[{
		line: '// a comment',
		tokens: [
			{ startIndex: 0, type: 'comment.pq' }
		]
	}],

	[{
		line: '// /* #A */',
		tokens: [
			{ startIndex: 0, type: 'comment.pq' }
		]
	}],

	[{
		line: '/*ABCD12$!()\\u000D%%%%%*/',
		tokens: [
			{ startIndex: 0, type: 'comment.pq' }
		]
	}],

	[{
		line: '42 /* + 45 */ /*',
		tokens: [
			{ startIndex: 0, type: 'number.pq' },
			{ startIndex: 2, type: 'white.pq' },
			{ startIndex: 3, type: 'comment.pq' },
			{ startIndex: 13, type: 'white.pq' },
			{ startIndex: 14, type: 'comment.pq' }
		]
	}],

	[{
		line: '/* //*/ a',
		tokens: [
			{ startIndex: 0, type: 'comment.pq' },
			{ startIndex: 7, type: 'white.pq' },
			{ startIndex: 8, type: 'identifier.pq' }
		]
	}],

	[{
		line: '1 / 2; /* comment',
		tokens: [
			{ startIndex: 0, type: 'number.pq' },
			{ startIndex: 1, type: 'white.pq' },
			{ startIndex: 2, type: 'operator.pq' },
			{ startIndex: 3, type: 'white.pq' },
			{ startIndex: 4, type: 'number.pq' },
			{ startIndex: 5, type: 'delimiter.pq' },
			{ startIndex: 6, type: 'white.pq' },
			{ startIndex: 7, type: 'comment.pq' }
		]
	}],

	// Escaped Identifiers
	[{
		line: '#"Change Types"',
		tokens: [
			{ startIndex: 0, type: 'identifier.pq' }
		]
	}],

	[{
		line: '#"A  B" = 1+2,',
		tokens: [
			{ startIndex: 0, type: 'identifier.pq' },
			{ startIndex: 7, type: 'white.pq' },
			{ startIndex: 8, type: 'operator.pq' },
			{ startIndex: 9, type: 'white.pq' },
			{ startIndex: 10, type: 'number.pq' },
			{ startIndex: 11, type: 'operator.pq' },
			{ startIndex: 12, type: 'number.pq' },
			{ startIndex: 13, type: 'delimiter.pq' },
		]
	}],

	[{
		line: 'a = #"escap ed"+ 1',
		tokens: [
			{ startIndex: 0, type: 'identifier.pq' },
			{ startIndex: 1, type: 'white.pq' },
			{ startIndex: 2, type: 'operator.pq' },
			{ startIndex: 3, type: 'white.pq' },
			{ startIndex: 4, type: 'identifier.pq' },
			{ startIndex: 15, type: 'operator.pq' },
			{ startIndex: 16, type: 'white.pq' },
			{ startIndex: 17, type: 'number.pq' }
		]
	}],

	// Number formats
	[{
		line: '5 / 1.2e+2 + 0x1234abc',
		tokens: [
			{ startIndex: 0, type: 'number.pq' },
			{ startIndex: 1, type: 'white.pq' },
			{ startIndex: 2, type: 'operator.pq' },
			{ startIndex: 3, type: 'white.pq' },
			{ startIndex: 4, type: 'number.float.pq' },
			{ startIndex: 10, type: 'white.pq' },
			{ startIndex: 11, type: 'operator.pq' },
			{ startIndex: 12, type: 'white.pq'},
			{ startIndex: 13, type: 'number.hex.pq'}
		]
	}],

	[{
		line: '0xb *(.2)',
		tokens: [
			{ startIndex: 0, type: 'number.hex.pq' },
			{ startIndex: 3, type: 'white.pq' },
			{ startIndex: 4, type: 'operator.pq' },
			{ startIndex: 5, type: 'delimiter.parenthesis.pq' },
			{ startIndex: 6, type: 'number.float.pq' },
			{ startIndex: 8, type: 'delimiter.parenthesis.pq' }
		]
	}],

	[{
		line: '1.23e34+1.2e-2-.3e2',
		tokens: [
			{ startIndex: 0, type: 'number.float.pq' },
			{ startIndex: 7, type: 'operator.pq' },
			{ startIndex: 8, type: 'number.float.pq' },
			{ startIndex: 14, type: 'operator.pq' },
			{ startIndex: 15, type: 'number.float.pq' }
		]
	}],

	// strings
	[{
		line: '  "string"',
		tokens: [
			{ startIndex: 0, type: 'white.pq' },
			{ startIndex: 2, type: 'string.pq' }
		]
	}],

	[{
		line: '"string" & "another"',
		tokens: [
			{ startIndex: 0, type: 'string.pq' },
			{ startIndex: 8, type: 'white.pq' },
			{ startIndex: 9, type: 'operator.pq' },
			{ startIndex: 10, type: 'white.pq' },
			{ startIndex: 11, type: 'string.pq' }
		]
	}],

	[{
		line: '"with  ""escaped "" \'text',
		tokens: [
			{ startIndex: 0, type: 'string.pq' },
			{ startIndex: 7, type: 'string.escape.pq' },
			{ startIndex: 9, type: 'string.pq' },
			{ startIndex: 17, type: 'string.escape.pq' },
			{ startIndex: 19, type: 'string.pq' }
		]
	}],

	// keywords and identifiers
	[{
		line: 'And as Each each _',
		tokens: [
			{ startIndex: 0, type: 'identifier.pq' },
			{ startIndex: 3, type: 'white.pq' },
			{ startIndex: 4, type: 'keyword.pq' },
			{ startIndex: 6, type: 'white.pq' },
			{ startIndex: 7, type: 'identifier.pq' },
			{ startIndex: 11, type: 'white.pq' },
			{ startIndex: 12, type: 'keyword.pq' },
			{ startIndex: 16, type: 'white.pq' },
			{ startIndex: 17, type: 'identifier.pq' }
		]
	}],

	[{
		line: '  #table({})',
		tokens: [
			{ startIndex: 0, type: 'white.pq' },
			{ startIndex: 2, type: 'keyword.pq' },
			{ startIndex: 8, type: "delimiter.parenthesis.pq" },
			{ startIndex: 9, type: "delimiter.brackets.pq" },
			{ startIndex: 11, type: "delimiter.parenthesis.pq" }
		]
	}],

	[{
		line: 'param as number',
		tokens: [
			{ startIndex: 0, type: 'identifier.pq' },
			{ startIndex: 5, type: 'white.pq' },
			{ startIndex: 6, type: 'keyword.pq' },
			{ startIndex: 8, type: 'white.pq' },
			{ startIndex: 9, type: 'keyword.type.pq' }
		]
	}],
]);
