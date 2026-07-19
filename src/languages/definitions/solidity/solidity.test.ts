/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('sol', [
	// Keywords
	[
		{
			line: 'pragma solidity ^0.4.0;',
			tokens: [
				{ startIndex: 0, type: 'keyword.pragma.sol' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'keyword.solidity.sol' },
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'delimiter.sol' },
				{ startIndex: 17, type: 'number.float.sol' },
				{ startIndex: 22, type: 'delimiter.sol' }
			]
		}
	],

	[
		{
			line: 'contract Ballot {',
			tokens: [
				{ startIndex: 0, type: 'keyword.contract.sol' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.sol' },
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'delimiter.curly.sol' }
			]
		}
	],

	[
		{
			line: 'struct Voter {',
			tokens: [
				{ startIndex: 0, type: 'keyword.struct.sol' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'identifier.sol' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'delimiter.curly.sol' }
			]
		}
	],

	[
		{
			line: 'address chairperson;',
			tokens: [
				{ startIndex: 0, type: 'keyword.address.sol' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.sol' },
				{ startIndex: 19, type: 'delimiter.sol' }
			]
		}
	],

	[
		{
			line: 'int weight;',
			tokens: [
				{ startIndex: 0, type: 'keyword.int.sol' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.sol' },
				{ startIndex: 10, type: 'delimiter.sol' }
			]
		}
	],

	[
		{
			line: 'mapping(address => Voter) voters;',
			tokens: [
				{ startIndex: 0, type: 'keyword.mapping.sol' },
				{ startIndex: 7, type: 'delimiter.parenthesis.sol' },
				{ startIndex: 8, type: 'keyword.address.sol' },
				{ startIndex: 15, type: '' },
				{ startIndex: 19, type: 'identifier.sol' },
				{ startIndex: 24, type: 'delimiter.parenthesis.sol' },
				{ startIndex: 25, type: '' },
				{ startIndex: 26, type: 'identifier.sol' },
				{ startIndex: 32, type: 'delimiter.sol' }
			]
		}
	],

	[
		{
			line: 'function Ballot(uint8 _numProposals) {',
			tokens: [
				{ startIndex: 0, type: 'keyword.function.sol' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.sol' },
				{ startIndex: 15, type: 'delimiter.parenthesis.sol' },
				{ startIndex: 16, type: 'keyword.uint8.sol' },
				{ startIndex: 21, type: '' },
				{ startIndex: 22, type: 'identifier.sol' },
				{ startIndex: 35, type: 'delimiter.parenthesis.sol' },
				{ startIndex: 36, type: '' },
				{ startIndex: 37, type: 'delimiter.curly.sol' }
			]
		}
	],

	// Comments - single line
	[
		{
			line: '//',
			tokens: [{ startIndex: 0, type: 'comment.sol' }]
		}
	],

	[
		{
			line: '    // a comment',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'comment.sol' }
			]
		}
	],

	[
		{
			line: '// a comment',
			tokens: [{ startIndex: 0, type: 'comment.sol' }]
		}
	],

	[
		{
			line: '//sticky comment',
			tokens: [{ startIndex: 0, type: 'comment.sol' }]
		}
	],

	[
		{
			line: '/almost a comment',
			tokens: [
				{ startIndex: 0, type: 'delimiter.sol' },
				{ startIndex: 1, type: 'identifier.sol' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.sol' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'identifier.sol' }
			]
		}
	],

	[
		{
			line: '/* //*/ a',
			tokens: [
				{ startIndex: 0, type: 'comment.sol' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.sol' }
			]
		}
	],

	[
		{
			line: '1 / 2; /* comment',
			tokens: [
				{ startIndex: 0, type: 'number.sol' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.sol' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.sol' },
				{ startIndex: 5, type: 'delimiter.sol' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'comment.sol' }
			]
		}
	],

	[
		{
			line: 'int x = 1; // my comment // is a nice one',
			tokens: [
				{ startIndex: 0, type: 'keyword.int.sol' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.sol' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.sol' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'number.sol' },
				{ startIndex: 9, type: 'delimiter.sol' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'comment.sol' }
			]
		}
	],

	// Comments - range comment, single line
	[
		{
			line: '/* a simple comment */',
			tokens: [{ startIndex: 0, type: 'comment.sol' }]
		}
	],

	[
		{
			line: 'int x = /* a simple comment */ 1;',
			tokens: [
				{ startIndex: 0, type: 'keyword.int.sol' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.sol' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.sol' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'comment.sol' },
				{ startIndex: 30, type: '' },
				{ startIndex: 31, type: 'number.sol' },
				{ startIndex: 32, type: 'delimiter.sol' }
			]
		}
	],

	[
		{
			line: 'int x = /* comment */ 1; */',
			tokens: [
				{ startIndex: 0, type: 'keyword.int.sol' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.sol' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.sol' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'comment.sol' },
				{ startIndex: 21, type: '' },
				{ startIndex: 22, type: 'number.sol' },
				{ startIndex: 23, type: 'delimiter.sol' },
				{ startIndex: 24, type: '' }
			]
		}
	],

	[
		{
			line: 'x = /**/;',
			tokens: [
				{ startIndex: 0, type: 'identifier.sol' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.sol' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'comment.sol' },
				{ startIndex: 8, type: 'delimiter.sol' }
			]
		}
	],

	[
		{
			line: 'x = /*/;',
			tokens: [
				{ startIndex: 0, type: 'identifier.sol' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.sol' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'comment.sol' }
			]
		}
	]
]);
