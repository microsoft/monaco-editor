/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('ocaml', [
	// Comment
	[
		{
			line: '(** documentation *)',
			tokens: [
				{ startIndex: 0, type: 'comment.doc.ocaml' },
			]
		}
	],
	[
		{
			line: ' (* comment (* nested comment *) *) ',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'comment.ocaml' },
				{ startIndex: 35, type: '' }
			]
		}
	],
	[
		{
			line: ' (* comment (* nested comment *)',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'comment.ocaml' }
			]
		},
		{
			line: 'multiline comment',
			tokens: [
				{ startIndex: 0, type: 'comment.ocaml' }
			]
		},
		{
			line: ' *)',
			tokens: [
				{ startIndex: 0, type: 'comment.ocaml' }
			]
		},
	],
	// Integer
	// String
	[
		{
			line: 'let a = "This is a string"',
			tokens: [
				{ startIndex: 0, type: 'keyword.ocaml' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.ocaml' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'operator.ocaml' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'string.quote.ocaml' },
				{ startIndex: 9, type: 'string.ocaml' },
				{ startIndex: 25, type: 'string.quote.ocaml' }
			]
		}
	],
]);
