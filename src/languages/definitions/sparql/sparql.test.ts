/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('sparql', [
	// Comments
	[
		{
			line: '# a comment',
			tokens: [{ startIndex: 0, type: 'comment.rq' }]
		}
	],

	[
		{
			line: '##sticky # comment',
			tokens: [{ startIndex: 0, type: 'comment.rq' }]
		}
	],

	[
		{
			line: '"lex"^^<https://test/ns#not-a-comment>',
			tokens: [
				{ startIndex: 0, type: 'string.sql.rq' },
				{ startIndex: 5, type: 'operator.sql.rq' },
				{ startIndex: 7, type: 'tag.rq' }
			]
		}
	],

	// strings
	[
		{
			line: '(?x ns:p "abc")',
			tokens: [
				{ startIndex: 0, type: 'delimiter.parenthesis.rq' },
				{ startIndex: 1, type: 'identifier.rq' },
				{ startIndex: 3, type: 'white.rq' },
				{ startIndex: 4, type: 'tag.rq' },
				{ startIndex: 8, type: 'white.rq' },
				{ startIndex: 9, type: 'string.sql.rq' },
				{ startIndex: 14, type: 'delimiter.parenthesis.rq' }
			]
		}
	],

	[
		{
			line: "'escaped single-quote: \\', normal double-quote: \"'",
			tokens: [
				{ startIndex: 0, type: 'string.sql.rq' },
				{ startIndex: 23, type: 'string.escape.rq' },
				{ startIndex: 25, type: 'string.sql.rq' }
			]
		}
	],

	[
		{
			line: '("escaped \\" and \\\' and also not escaped \'.")',
			tokens: [
				{ startIndex: 0, type: 'delimiter.parenthesis.rq' },
				{ startIndex: 1, type: 'string.sql.rq' },
				{ startIndex: 10, type: 'string.escape.rq' },
				{ startIndex: 12, type: 'string.sql.rq' },
				{ startIndex: 17, type: 'string.escape.rq' },
				{ startIndex: 19, type: 'string.sql.rq' },
				{ startIndex: 44, type: 'delimiter.parenthesis.rq' }
			]
		}
	],

	[
		{
			line: "'Invalid single string",
			tokens: [{ startIndex: 0, type: 'string.invalid.rq' }]
		}
	],

	[
		{
			line: '"Invalid double string',
			tokens: [{ startIndex: 0, type: 'string.invalid.rq' }]
		}
	],

	// identifiers, builtinFunctions and keywords
	[
		{
			line: 'PREFIX a: <http://www.w3.org/2000/10/annotation-ns#>',
			tokens: [
				{ startIndex: 0, type: 'keyword.rq' },
				{ startIndex: 6, type: 'white.rq' },
				{ startIndex: 7, type: 'tag.rq' },
				{ startIndex: 9, type: 'white.rq' },
				{ startIndex: 10, type: 'tag.rq' }
			]
		}
	],

	[
		{
			line: 'SELECT DISTINCT ?name ?nick',
			tokens: [
				{ startIndex: 0, type: 'keyword.rq' },
				{ startIndex: 6, type: 'white.rq' },
				{ startIndex: 7, type: 'keyword.rq' },
				{ startIndex: 15, type: 'white.rq' },
				{ startIndex: 16, type: 'identifier.rq' },
				{ startIndex: 21, type: 'white.rq' },
				{ startIndex: 22, type: 'identifier.rq' }
			]
		}
	],

	[
		{
			line: '(BGP [triple ?x foaf:nick ?nick])',
			tokens: [
				{ startIndex: 0, type: 'delimiter.parenthesis.rq' },
				{ startIndex: 1, type: 'identifier.rq' },
				{ startIndex: 4, type: 'white.rq' },
				{ startIndex: 5, type: 'delimiter.square.rq' },
				{ startIndex: 6, type: 'identifier.rq' },
				{ startIndex: 12, type: 'white.rq' },
				{ startIndex: 13, type: 'identifier.rq' },
				{ startIndex: 15, type: 'white.rq' },
				{ startIndex: 16, type: 'tag.rq' },
				{ startIndex: 25, type: 'white.rq' },
				{ startIndex: 26, type: 'identifier.rq' },
				{ startIndex: 31, type: 'delimiter.square.rq' },
				{ startIndex: 32, type: 'delimiter.parenthesis.rq' }
			]
		}
	],

	[
		{
			line: 'SELECT*{ GRAPH :g1 { ?x } }',
			tokens: [
				{ startIndex: 0, type: 'keyword.rq' },
				{ startIndex: 6, type: 'operator.sql.rq' },
				{ startIndex: 7, type: 'delimiter.curly.rq' },
				{ startIndex: 8, type: 'white.rq' },
				{ startIndex: 9, type: 'keyword.rq' },
				{ startIndex: 14, type: 'white.rq' },
				{ startIndex: 15, type: 'tag.rq' },
				{ startIndex: 18, type: 'white.rq' },
				{ startIndex: 19, type: 'delimiter.curly.rq' },
				{ startIndex: 20, type: 'white.rq' },
				{ startIndex: 21, type: 'identifier.rq' },
				{ startIndex: 23, type: 'white.rq' },
				{ startIndex: 24, type: 'delimiter.curly.rq' },
				{ startIndex: 25, type: 'white.rq' },
				{ startIndex: 26, type: 'delimiter.curly.rq' }
			]
		}
	],

	[
		{
			line: 'FILTER isBlank(?c)',
			tokens: [
				{ startIndex: 0, type: 'keyword.rq' },
				{ startIndex: 6, type: 'white.rq' },
				{ startIndex: 7, type: 'predefined.sql.rq' },
				{ startIndex: 14, type: 'delimiter.parenthesis.rq' },
				{ startIndex: 15, type: 'identifier.rq' },
				{ startIndex: 17, type: 'delimiter.parenthesis.rq' }
			]
		}
	],

	[
		{
			line: '"text"@en',
			tokens: [
				{ startIndex: 0, type: 'string.sql.rq' },
				{ startIndex: 6, type: 'metatag.html.rq' }
			]
		}
	]
]);
