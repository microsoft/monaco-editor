/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('msdax', [
	// Comments
	[
		{
			line: '// a comment',
			tokens: [{ startIndex: 0, type: 'comment.msdax' }]
		}
	],

	[
		{
			line: '-almost a comment',
			tokens: [
				{ startIndex: 0, type: 'operator.msdax' },
				{ startIndex: 1, type: 'identifier.msdax' },
				{ startIndex: 7, type: 'white.msdax' },
				{ startIndex: 8, type: 'identifier.msdax' },
				{ startIndex: 9, type: 'white.msdax' },
				{ startIndex: 10, type: 'identifier.msdax' }
			]
		}
	],

	[
		{
			line: '/* a full line comment */',
			tokens: [
				{ startIndex: 0, type: 'comment.quote.msdax' },
				{ startIndex: 2, type: 'comment.msdax' },
				{ startIndex: 23, type: 'comment.quote.msdax' }
			]
		}
	],

	[
		{
			line: '/* /// *** /// */',
			tokens: [
				{ startIndex: 0, type: 'comment.quote.msdax' },
				{ startIndex: 2, type: 'comment.msdax' },
				{ startIndex: 15, type: 'comment.quote.msdax' }
			]
		}
	],

	[
		{
			line: 'define measure x = /* a simple comment */ 1;',
			tokens: [
				{ startIndex: 0, type: 'keyword.msdax' },
				{ startIndex: 6, type: 'white.msdax' },
				{ startIndex: 7, type: 'keyword.msdax' },
				{ startIndex: 14, type: 'white.msdax' },
				{ startIndex: 15, type: 'identifier.msdax' },
				{ startIndex: 16, type: 'white.msdax' },
				{ startIndex: 17, type: 'operator.msdax' },
				{ startIndex: 18, type: 'white.msdax' },
				{ startIndex: 19, type: 'comment.quote.msdax' },
				{ startIndex: 21, type: 'comment.msdax' },
				{ startIndex: 39, type: 'comment.quote.msdax' },
				{ startIndex: 41, type: 'white.msdax' },
				{ startIndex: 42, type: 'number.msdax' },
				{ startIndex: 43, type: 'delimiter.msdax' }
			]
		}
	],

	// Numbers
	[
		{
			line: '123',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '-123',
			tokens: [
				{ startIndex: 0, type: 'operator.msdax' },
				{ startIndex: 1, type: 'number.msdax' }
			]
		}
	],

	[
		{
			line: '0xaBc123',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '0XaBc123',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '0x',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '0x0',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '0xAB_CD',
			tokens: [
				{ startIndex: 0, type: 'number.msdax' },
				{ startIndex: 4, type: 'identifier.msdax' }
			]
		}
	],

	[
		{
			line: '.',
			tokens: [{ startIndex: 0, type: 'delimiter.msdax' }]
		}
	],

	[
		{
			line: '123',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '123.5678',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '0.99',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '.99',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '99.',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '0.',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '.0',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '1E-2',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '1E+2',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '1E2',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '0.1E2',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '1.E2',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	[
		{
			line: '.1E2',
			tokens: [{ startIndex: 0, type: 'number.msdax' }]
		}
	],

	// Identifiers
	[
		{
			line: '_abc01',
			tokens: [{ startIndex: 0, type: 'identifier.msdax' }]
		}
	],

	[
		{
			line: 'abc01',
			tokens: [{ startIndex: 0, type: 'identifier.msdax' }]
		}
	],

	[
		{
			line: 'evaluate filter',
			tokens: [
				{ startIndex: 0, type: 'keyword.msdax' },
				{ startIndex: 8, type: 'white.msdax' },
				{ startIndex: 9, type: 'keyword.function.msdax' }
			]
		}
	],

	[
		{
			line: '[abc[[ 321 ]] xyz]',
			tokens: [
				{ startIndex: 0, type: 'identifier.quote.msdax' },
				{ startIndex: 1, type: 'identifier.msdax' },
				{ startIndex: 17, type: 'identifier.quote.msdax' }
			]
		}
	],

	[
		{
			line: '[abc',
			tokens: [
				{ startIndex: 0, type: 'identifier.quote.msdax' },
				{ startIndex: 1, type: 'identifier.msdax' }
			]
		}
	],

	[
		{
			line: "define measure 'abc'[def]",
			tokens: [
				{ startIndex: 0, type: 'keyword.msdax' },
				{ startIndex: 6, type: 'white.msdax' },
				{ startIndex: 7, type: 'keyword.msdax' },
				{ startIndex: 14, type: 'white.msdax' },
				{ startIndex: 15, type: 'identifier.quote.msdax' },
				{ startIndex: 16, type: 'identifier.msdax' },
				{ startIndex: 19, type: 'identifier.quote.msdax' },
				{ startIndex: 21, type: 'identifier.msdax' },
				{ startIndex: 24, type: 'identifier.quote.msdax' }
			]
		}
	],

	[
		{
			line: 'int',
			tokens: [{ startIndex: 0, type: 'keyword.function.msdax' }]
		}
	],

	[
		{
			line: '[int]',
			tokens: [
				{ startIndex: 0, type: 'identifier.quote.msdax' },
				{ startIndex: 1, type: 'identifier.msdax' },
				{ startIndex: 4, type: 'identifier.quote.msdax' }
			]
		}
	],

	// Strings
	[
		{
			line: '"abc"" 321 "" xyz"',
			tokens: [{ startIndex: 0, type: 'string.msdax' }]
		}
	],

	[
		{
			line: 'define var x="a string"',
			tokens: [
				{ startIndex: 0, type: 'keyword.msdax' },
				{ startIndex: 6, type: 'white.msdax' },
				{ startIndex: 7, type: 'keyword.msdax' },
				{ startIndex: 10, type: 'white.msdax' },
				{ startIndex: 11, type: 'identifier.msdax' },
				{ startIndex: 12, type: 'operator.msdax' },
				{ startIndex: 13, type: 'string.msdax' }
			]
		}
	],

	[
		{
			line: '"a "" string with quotes"',
			tokens: [{ startIndex: 0, type: 'string.msdax' }]
		}
	],

	[
		{
			line: '"a // string with comment"',
			tokens: [{ startIndex: 0, type: 'string.msdax' }]
		}
	],

	[
		{
			line: 'N"a unicode string"',
			tokens: [{ startIndex: 0, type: 'string.msdax' }]
		}
	],

	[
		{
			line: '"a endless string',
			tokens: [{ startIndex: 0, type: 'string.msdax' }]
		}
	],

	// Operators
	[
		{
			line: 'define var x=1+3',
			tokens: [
				{ startIndex: 0, type: 'keyword.msdax' },
				{ startIndex: 6, type: 'white.msdax' },
				{ startIndex: 7, type: 'keyword.msdax' },
				{ startIndex: 10, type: 'white.msdax' },
				{ startIndex: 11, type: 'identifier.msdax' },
				{ startIndex: 12, type: 'operator.msdax' },
				{ startIndex: 13, type: 'number.msdax' },
				{ startIndex: 14, type: 'operator.msdax' },
				{ startIndex: 15, type: 'number.msdax' }
			]
		}
	],

	[
		{
			line: 'define var x=1^+abc',
			tokens: [
				{ startIndex: 0, type: 'keyword.msdax' },
				{ startIndex: 6, type: 'white.msdax' },
				{ startIndex: 7, type: 'keyword.msdax' },
				{ startIndex: 10, type: 'white.msdax' },
				{ startIndex: 11, type: 'identifier.msdax' },
				{ startIndex: 12, type: 'operator.msdax' },
				{ startIndex: 13, type: 'number.msdax' },
				{ startIndex: 14, type: 'operator.msdax' },
				{ startIndex: 16, type: 'identifier.msdax' }
			]
		}
	],

	// Logical operators && and ||
	[
		{
			// [Column] references tokenize as identifier.quote, () merges when adjacent
			line: 'IF(Logic[Condition] && "a" = "b", TRUE(), FALSE())',
			tokens: [
				{ startIndex: 0, type: 'keyword.function.msdax' },
				{ startIndex: 2, type: 'delimiter.parenthesis.msdax' },
				{ startIndex: 3, type: 'identifier.msdax' },
				{ startIndex: 8, type: 'identifier.quote.msdax' },
				{ startIndex: 9, type: 'identifier.msdax' },
				{ startIndex: 18, type: 'identifier.quote.msdax' },
				{ startIndex: 19, type: 'white.msdax' },
				{ startIndex: 20, type: 'operator.msdax' },
				{ startIndex: 22, type: 'white.msdax' },
				{ startIndex: 23, type: 'string.msdax' },
				{ startIndex: 26, type: 'white.msdax' },
				{ startIndex: 27, type: 'operator.msdax' },
				{ startIndex: 28, type: 'white.msdax' },
				{ startIndex: 29, type: 'string.msdax' },
				{ startIndex: 32, type: 'delimiter.msdax' },
				{ startIndex: 33, type: 'white.msdax' },
				{ startIndex: 34, type: 'keyword.function.msdax' },
				{ startIndex: 38, type: 'delimiter.parenthesis.msdax' }, // () merged
				{ startIndex: 40, type: 'delimiter.msdax' },
				{ startIndex: 41, type: 'white.msdax' },
				{ startIndex: 42, type: 'keyword.function.msdax' },
				{ startIndex: 47, type: 'delimiter.parenthesis.msdax' } // ()) all merged
			]
		}
	],

	[
		{
			line: 'Sales[Amount] || Products[Qty]',
			tokens: [
				{ startIndex: 0, type: 'identifier.msdax' },
				{ startIndex: 5, type: 'identifier.quote.msdax' },
				{ startIndex: 6, type: 'identifier.msdax' },
				{ startIndex: 12, type: 'identifier.quote.msdax' },
				{ startIndex: 13, type: 'white.msdax' },
				{ startIndex: 14, type: 'operator.msdax' },
				{ startIndex: 16, type: 'white.msdax' },
				{ startIndex: 17, type: 'identifier.msdax' },
				{ startIndex: 25, type: 'identifier.quote.msdax' },
				{ startIndex: 26, type: 'identifier.msdax' },
				{ startIndex: 29, type: 'identifier.quote.msdax' }
			]
		}
	],

	// Realistic queries and expressions
	[
		{
			line: "EVALUATE 'Products' ORDER BY [Product Id] DESC",
			tokens: [
				{ startIndex: 0, type: 'keyword.msdax' },
				{ startIndex: 8, type: 'white.msdax' },
				{ startIndex: 9, type: 'identifier.quote.msdax' },
				{ startIndex: 10, type: 'identifier.msdax' },
				{ startIndex: 18, type: 'identifier.quote.msdax' },
				{ startIndex: 19, type: 'white.msdax' },
				{ startIndex: 20, type: 'keyword.msdax' },
				{ startIndex: 25, type: 'white.msdax' },
				{ startIndex: 26, type: 'keyword.msdax' },
				{ startIndex: 28, type: 'white.msdax' },
				{ startIndex: 29, type: 'identifier.quote.msdax' },
				{ startIndex: 30, type: 'identifier.msdax' },
				{ startIndex: 40, type: 'identifier.quote.msdax' },
				{ startIndex: 41, type: 'white.msdax' },
				{ startIndex: 42, type: 'keyword.msdax' }
			]
		}
	],

	[
		{
			// DATATABLE is a function (datatable-function-dax), emitted as keyword.function.
			line: 'DATATABLE("Price", STRING, {{"Low"},{"Medium"}})',
			tokens: [
				{ startIndex: 0, type: 'keyword.function.msdax' },
				{ startIndex: 9, type: 'delimiter.parenthesis.msdax' },
				{ startIndex: 10, type: 'string.msdax' },
				{ startIndex: 17, type: 'delimiter.msdax' },
				{ startIndex: 18, type: 'white.msdax' },
				{ startIndex: 19, type: 'keyword.msdax' },
				{ startIndex: 25, type: 'delimiter.msdax' },
				{ startIndex: 26, type: 'white.msdax' },
				{ startIndex: 27, type: 'delimiter.brackets.msdax' },
				{ startIndex: 29, type: 'string.msdax' },
				{ startIndex: 34, type: 'delimiter.brackets.msdax' },
				{ startIndex: 35, type: 'delimiter.msdax' },
				{ startIndex: 36, type: 'delimiter.brackets.msdax' },
				{ startIndex: 37, type: 'string.msdax' },
				{ startIndex: 45, type: 'delimiter.brackets.msdax' },
				{ startIndex: 47, type: 'delimiter.parenthesis.msdax' }
			]
		}
	],

	// New DAX functions
	[
		{
			// REMOVEFILTERS = 13 chars (0-12), ( at 13
			// Note: Product matches PRODUCT function (ignoreCase:true), Color is identifier
			line: 'REMOVEFILTERS(Product[Color])',
			tokens: [
				{ startIndex: 0, type: 'keyword.function.msdax' },
				{ startIndex: 13, type: 'delimiter.parenthesis.msdax' },
				{ startIndex: 14, type: 'keyword.function.msdax' },
				{ startIndex: 21, type: 'identifier.quote.msdax' },
				{ startIndex: 22, type: 'identifier.msdax' },
				{ startIndex: 27, type: 'identifier.quote.msdax' },
				{ startIndex: 28, type: 'delimiter.parenthesis.msdax' }
			]
		}
	],

	[
		{
			// SELECTEDVALUE = 13 chars, Category = 8 chars
			// Product matches PRODUCT function (ignoreCase:true)
			line: 'SELECTEDVALUE(Product[Category], "All")',
			tokens: [
				{ startIndex: 0, type: 'keyword.function.msdax' },
				{ startIndex: 13, type: 'delimiter.parenthesis.msdax' },
				{ startIndex: 14, type: 'keyword.function.msdax' },
				{ startIndex: 21, type: 'identifier.quote.msdax' },
				{ startIndex: 22, type: 'identifier.msdax' },
				{ startIndex: 30, type: 'identifier.quote.msdax' },
				{ startIndex: 31, type: 'delimiter.msdax' },
				{ startIndex: 32, type: 'white.msdax' },
				{ startIndex: 33, type: 'string.msdax' },
				{ startIndex: 38, type: 'delimiter.parenthesis.msdax' }
			]
		}
	],

	[
		{
			// ALLCROSSFILTERED = 16 chars
			line: 'ALLCROSSFILTERED(Orders)',
			tokens: [
				{ startIndex: 0, type: 'keyword.function.msdax' },
				{ startIndex: 16, type: 'delimiter.parenthesis.msdax' },
				{ startIndex: 17, type: 'identifier.msdax' },
				{ startIndex: 23, type: 'delimiter.parenthesis.msdax' }
			]
		}
	],

	[
		{
			// KEEPFILTERS = 11 chars, Products = 8 chars
			line: 'KEEPFILTERS(Products[Color] = "Red")',
			tokens: [
				{ startIndex: 0, type: 'keyword.function.msdax' },
				{ startIndex: 11, type: 'delimiter.parenthesis.msdax' },
				{ startIndex: 12, type: 'identifier.msdax' },
				{ startIndex: 20, type: 'identifier.quote.msdax' },
				{ startIndex: 21, type: 'identifier.msdax' },
				{ startIndex: 26, type: 'identifier.quote.msdax' },
				{ startIndex: 27, type: 'white.msdax' },
				{ startIndex: 28, type: 'operator.msdax' },
				{ startIndex: 29, type: 'white.msdax' },
				{ startIndex: 30, type: 'string.msdax' },
				{ startIndex: 35, type: 'delimiter.parenthesis.msdax' }
			]
		}
	],

	// DEFINE with VAR/RETURN
	[
		{
			// DEFINE(6) MEASURE(7-13) Sales(15-19) [Total](20-26) = VAR x = SUM(Sales[Amount]) RETURN x + 1
			line: 'DEFINE MEASURE Sales[Total] = VAR x = SUM(Sales[Amount]) RETURN x + 1',
			tokens: [
				{ startIndex: 0, type: 'keyword.msdax' },
				{ startIndex: 6, type: 'white.msdax' },
				{ startIndex: 7, type: 'keyword.msdax' },
				{ startIndex: 14, type: 'white.msdax' },
				{ startIndex: 15, type: 'identifier.msdax' },
				{ startIndex: 20, type: 'identifier.quote.msdax' },
				{ startIndex: 21, type: 'identifier.msdax' },
				{ startIndex: 26, type: 'identifier.quote.msdax' },
				{ startIndex: 27, type: 'white.msdax' },
				{ startIndex: 28, type: 'operator.msdax' },
				{ startIndex: 29, type: 'white.msdax' },
				{ startIndex: 30, type: 'keyword.msdax' },
				{ startIndex: 33, type: 'white.msdax' },
				{ startIndex: 34, type: 'identifier.msdax' },
				{ startIndex: 35, type: 'white.msdax' },
				{ startIndex: 36, type: 'operator.msdax' },
				{ startIndex: 37, type: 'white.msdax' },
				{ startIndex: 38, type: 'keyword.function.msdax' },
				{ startIndex: 41, type: 'delimiter.parenthesis.msdax' },
				{ startIndex: 42, type: 'identifier.msdax' },
				{ startIndex: 47, type: 'identifier.quote.msdax' },
				{ startIndex: 48, type: 'identifier.msdax' },
				{ startIndex: 54, type: 'identifier.quote.msdax' },
				{ startIndex: 55, type: 'delimiter.parenthesis.msdax' },
				{ startIndex: 56, type: 'white.msdax' },
				{ startIndex: 57, type: 'keyword.msdax' },
				{ startIndex: 63, type: 'white.msdax' },
				{ startIndex: 64, type: 'identifier.msdax' },
				{ startIndex: 65, type: 'white.msdax' },
				{ startIndex: 66, type: 'operator.msdax' },
				{ startIndex: 67, type: 'white.msdax' },
				{ startIndex: 68, type: 'number.msdax' }
			]
		}
	],

	// COLUMN, TABLE and EXPRESSION keywords
	[
		{
			line: 'COLUMN',
			tokens: [{ startIndex: 0, type: 'keyword.msdax' }]
		}
	],

	[
		{
			line: 'TABLE',
			tokens: [{ startIndex: 0, type: 'keyword.msdax' }]
		}
	],

	[
		{
			line: 'EXPRESSION',
			tokens: [{ startIndex: 0, type: 'keyword.msdax' }]
		}
	],

	// Window functions — WINDOW(6) 1(7) ,(8) ABS(10-12) ,(13) 0(15) ,(16) PARTITIONBY(18-28) (Product[Category])(29-47) ORDERBY(50-56) (Date[Day], ASC)(57-72)
	[
		{
			line: 'WINDOW(1, ABS, 0, PARTITIONBY(Product[Category]), ORDERBY(Date[Day], ASC))',
			tokens: [
				{ startIndex: 0, type: 'keyword.function.msdax' },
				{ startIndex: 6, type: 'delimiter.parenthesis.msdax' },
				{ startIndex: 7, type: 'number.msdax' },
				{ startIndex: 8, type: 'delimiter.msdax' },
				{ startIndex: 9, type: 'white.msdax' },
				{ startIndex: 10, type: 'keyword.function.msdax' },
				{ startIndex: 13, type: 'delimiter.msdax' },
				{ startIndex: 14, type: 'white.msdax' },
				{ startIndex: 15, type: 'number.msdax' },
				{ startIndex: 16, type: 'delimiter.msdax' },
				{ startIndex: 17, type: 'white.msdax' },
				{ startIndex: 18, type: 'keyword.function.msdax' },
				{ startIndex: 29, type: 'delimiter.parenthesis.msdax' },
				{ startIndex: 30, type: 'keyword.function.msdax' }, // Product matches PRODUCT function
				{ startIndex: 37, type: 'identifier.quote.msdax' },
				{ startIndex: 38, type: 'identifier.msdax' },
				{ startIndex: 46, type: 'identifier.quote.msdax' },
				{ startIndex: 47, type: 'delimiter.parenthesis.msdax' },
				{ startIndex: 48, type: 'delimiter.msdax' },
				{ startIndex: 49, type: 'white.msdax' },
				{ startIndex: 50, type: 'keyword.function.msdax' },
				{ startIndex: 57, type: 'delimiter.parenthesis.msdax' },
				{ startIndex: 58, type: 'keyword.function.msdax' }, // Date matches DATE function
				{ startIndex: 62, type: 'identifier.quote.msdax' },
				{ startIndex: 63, type: 'identifier.msdax' },
				{ startIndex: 66, type: 'identifier.quote.msdax' },
				{ startIndex: 67, type: 'delimiter.msdax' },
				{ startIndex: 68, type: 'white.msdax' },
				{ startIndex: 69, type: 'keyword.msdax' },
				{ startIndex: 72, type: 'delimiter.parenthesis.msdax' } // )) merged
			]
		}
	],

	// Multi-char operators (dax-operator-reference): == <> <= >= != && ||
	[
		{
			// [a] == 1
			line: '[a] == 1',
			tokens: [
				{ startIndex: 0, type: 'identifier.quote.msdax' },
				{ startIndex: 1, type: 'identifier.msdax' },
				{ startIndex: 2, type: 'identifier.quote.msdax' },
				{ startIndex: 3, type: 'white.msdax' },
				{ startIndex: 4, type: 'operator.msdax' }, // ==
				{ startIndex: 6, type: 'white.msdax' },
				{ startIndex: 7, type: 'number.msdax' }
			]
		}
	],

	[
		{
			line: '1 <> 2',
			tokens: [
				{ startIndex: 0, type: 'number.msdax' },
				{ startIndex: 1, type: 'white.msdax' },
				{ startIndex: 2, type: 'operator.msdax' }, // <>
				{ startIndex: 4, type: 'white.msdax' },
				{ startIndex: 5, type: 'number.msdax' }
			]
		}
	],

	[
		{
			line: '1 <= 2',
			tokens: [
				{ startIndex: 0, type: 'number.msdax' },
				{ startIndex: 1, type: 'white.msdax' },
				{ startIndex: 2, type: 'operator.msdax' }, // <=
				{ startIndex: 4, type: 'white.msdax' },
				{ startIndex: 5, type: 'number.msdax' }
			]
		}
	],

	[
		{
			line: '1 >= 2',
			tokens: [
				{ startIndex: 0, type: 'number.msdax' },
				{ startIndex: 1, type: 'white.msdax' },
				{ startIndex: 2, type: 'operator.msdax' }, // >=
				{ startIndex: 4, type: 'white.msdax' },
				{ startIndex: 5, type: 'number.msdax' }
			]
		}
	],

	// DAX datetime literal dt"..." (dax-syntax-reference)
	[
		{
			line: 'dt"2015-12-31"',
			tokens: [{ startIndex: 0, type: 'string.msdax' }]
		}
	],

	[
		{
			line: 'FILTER(Sales, [OrderDate] > dt"2015-1-9T02:30:00")',
			tokens: [
				{ startIndex: 0, type: 'keyword.function.msdax' }, // FILTER
				{ startIndex: 6, type: 'delimiter.parenthesis.msdax' },
				{ startIndex: 7, type: 'identifier.msdax' }, // Sales
				{ startIndex: 12, type: 'delimiter.msdax' },
				{ startIndex: 13, type: 'white.msdax' },
				{ startIndex: 14, type: 'identifier.quote.msdax' },
				{ startIndex: 15, type: 'identifier.msdax' },
				{ startIndex: 24, type: 'identifier.quote.msdax' },
				{ startIndex: 25, type: 'white.msdax' },
				{ startIndex: 26, type: 'operator.msdax' }, // >
				{ startIndex: 27, type: 'white.msdax' },
				{ startIndex: 28, type: 'string.msdax' }, // dt"..."
				{ startIndex: 49, type: 'delimiter.parenthesis.msdax' }
			]
		}
	],

	// Dotted function names tokenize as a single keyword.function
	[
		{
			line: 'PERCENTILE.EXC(Sales[Amount], 0.9)',
			tokens: [
				{ startIndex: 0, type: 'keyword.function.msdax' }, // PERCENTILE.EXC
				{ startIndex: 14, type: 'delimiter.parenthesis.msdax' },
				{ startIndex: 15, type: 'identifier.msdax' }, // Sales
				{ startIndex: 20, type: 'identifier.quote.msdax' },
				{ startIndex: 21, type: 'identifier.msdax' },
				{ startIndex: 27, type: 'identifier.quote.msdax' },
				{ startIndex: 28, type: 'delimiter.msdax' },
				{ startIndex: 29, type: 'white.msdax' },
				{ startIndex: 30, type: 'number.msdax' }, // 0.9
				{ startIndex: 33, type: 'delimiter.parenthesis.msdax' }
			]
		}
	],

	[
		{
			line: 'STDEV.P(Sales[Amount])',
			tokens: [
				{ startIndex: 0, type: 'keyword.function.msdax' }, // STDEV.P
				{ startIndex: 7, type: 'delimiter.parenthesis.msdax' },
				{ startIndex: 8, type: 'identifier.msdax' },
				{ startIndex: 13, type: 'identifier.quote.msdax' },
				{ startIndex: 14, type: 'identifier.msdax' },
				{ startIndex: 20, type: 'identifier.quote.msdax' },
				{ startIndex: 21, type: 'delimiter.parenthesis.msdax' }
			]
		}
	],

	[
		{
			// Three-segment dotted name (INFO.VIEW.MEASURES). `()` merges in output.
			line: 'EVALUATE INFO.VIEW.MEASURES()',
			tokens: [
				{ startIndex: 0, type: 'keyword.msdax' },
				{ startIndex: 8, type: 'white.msdax' },
				{ startIndex: 9, type: 'keyword.function.msdax' }, // INFO.VIEW.MEASURES
				{ startIndex: 27, type: 'delimiter.parenthesis.msdax' }
			]
		}
	],

	// Newly covered DAX functions (spot-check per category)
	[
		{
			line: 'COALESCE([a], 0)',
			tokens: [
				{ startIndex: 0, type: 'keyword.function.msdax' }, // COALESCE
				{ startIndex: 8, type: 'delimiter.parenthesis.msdax' },
				{ startIndex: 9, type: 'identifier.quote.msdax' },
				{ startIndex: 10, type: 'identifier.msdax' },
				{ startIndex: 11, type: 'identifier.quote.msdax' },
				{ startIndex: 12, type: 'delimiter.msdax' },
				{ startIndex: 13, type: 'white.msdax' },
				{ startIndex: 14, type: 'number.msdax' },
				{ startIndex: 15, type: 'delimiter.parenthesis.msdax' }
			]
		}
	],

	[
		{
			// BITAND from Logical (logical-functions-dax)
			line: 'BITAND(13, 11)',
			tokens: [
				{ startIndex: 0, type: 'keyword.function.msdax' },
				{ startIndex: 6, type: 'delimiter.parenthesis.msdax' },
				{ startIndex: 7, type: 'number.msdax' },
				{ startIndex: 9, type: 'delimiter.msdax' },
				{ startIndex: 10, type: 'white.msdax' },
				{ startIndex: 11, type: 'number.msdax' },
				{ startIndex: 13, type: 'delimiter.parenthesis.msdax' }
			]
		}
	],

	[
		{
			// COMBINEVALUES from Text
			line: 'COMBINEVALUES(",", [a], [b])',
			tokens: [
				{ startIndex: 0, type: 'keyword.function.msdax' },
				{ startIndex: 13, type: 'delimiter.parenthesis.msdax' },
				{ startIndex: 14, type: 'string.msdax' },
				{ startIndex: 17, type: 'delimiter.msdax' },
				{ startIndex: 18, type: 'white.msdax' },
				{ startIndex: 19, type: 'identifier.quote.msdax' },
				{ startIndex: 20, type: 'identifier.msdax' },
				{ startIndex: 21, type: 'identifier.quote.msdax' },
				{ startIndex: 22, type: 'delimiter.msdax' },
				{ startIndex: 23, type: 'white.msdax' },
				{ startIndex: 24, type: 'identifier.quote.msdax' },
				{ startIndex: 25, type: 'identifier.msdax' },
				{ startIndex: 26, type: 'identifier.quote.msdax' },
				{ startIndex: 27, type: 'delimiter.parenthesis.msdax' }
			]
		}
	],

	[
		{
			// SELECTEDMEASURE (Information / calculation groups). `()` merges.
			line: 'SELECTEDMEASURE()',
			tokens: [
				{ startIndex: 0, type: 'keyword.function.msdax' },
				{ startIndex: 15, type: 'delimiter.parenthesis.msdax' }
			]
		}
	],

	[
		{
			// UTCNOW / UTCTODAY / QUARTER from Date & time. Trailing parens merge.
			line: 'QUARTER(UTCTODAY())',
			tokens: [
				{ startIndex: 0, type: 'keyword.function.msdax' },
				{ startIndex: 7, type: 'delimiter.parenthesis.msdax' },
				{ startIndex: 8, type: 'keyword.function.msdax' },
				{ startIndex: 16, type: 'delimiter.parenthesis.msdax' }
			]
		}
	],

	[
		{
			// TOCSV and TOJSON from Other
			line: 'TOCSV(Sales, 10)',
			tokens: [
				{ startIndex: 0, type: 'keyword.function.msdax' },
				{ startIndex: 5, type: 'delimiter.parenthesis.msdax' },
				{ startIndex: 6, type: 'identifier.msdax' },
				{ startIndex: 11, type: 'delimiter.msdax' },
				{ startIndex: 12, type: 'white.msdax' },
				{ startIndex: 13, type: 'number.msdax' },
				{ startIndex: 15, type: 'delimiter.parenthesis.msdax' }
			]
		}
	],

	[
		{
			// DATESWTD (week-to-date; previously missing alongside DATESMTD/QTD/YTD)
			line: 'DATESWTD(Date[Date])',
			tokens: [
				{ startIndex: 0, type: 'keyword.function.msdax' },
				{ startIndex: 8, type: 'delimiter.parenthesis.msdax' },
				{ startIndex: 9, type: 'keyword.function.msdax' }, // Date matches DATE
				{ startIndex: 13, type: 'identifier.quote.msdax' },
				{ startIndex: 14, type: 'identifier.msdax' },
				{ startIndex: 18, type: 'identifier.quote.msdax' },
				{ startIndex: 19, type: 'delimiter.parenthesis.msdax' }
			]
		}
	],

	// DEFINE FUNCTION user-defined function (function-statement-dax).
	// Note: `=>` is tokenized as two adjacent `operator` tokens that merge in output.
	[
		{
			line: 'DEFINE FUNCTION MyAdd = (x, y) => x + y',
			tokens: [
				{ startIndex: 0, type: 'keyword.msdax' }, // DEFINE
				{ startIndex: 6, type: 'white.msdax' },
				{ startIndex: 7, type: 'keyword.msdax' }, // FUNCTION
				{ startIndex: 15, type: 'white.msdax' },
				{ startIndex: 16, type: 'identifier.msdax' }, // MyAdd
				{ startIndex: 21, type: 'white.msdax' },
				{ startIndex: 22, type: 'operator.msdax' }, // =
				{ startIndex: 23, type: 'white.msdax' },
				{ startIndex: 24, type: 'delimiter.parenthesis.msdax' },
				{ startIndex: 25, type: 'identifier.msdax' },
				{ startIndex: 26, type: 'delimiter.msdax' },
				{ startIndex: 27, type: 'white.msdax' },
				{ startIndex: 28, type: 'identifier.msdax' },
				{ startIndex: 29, type: 'delimiter.parenthesis.msdax' },
				{ startIndex: 30, type: 'white.msdax' },
				{ startIndex: 31, type: 'operator.msdax' }, // => (merged)
				{ startIndex: 33, type: 'white.msdax' },
				{ startIndex: 34, type: 'identifier.msdax' },
				{ startIndex: 35, type: 'white.msdax' },
				{ startIndex: 36, type: 'operator.msdax' }, // +
				{ startIndex: 37, type: 'white.msdax' },
				{ startIndex: 38, type: 'identifier.msdax' }
			]
		}
	],

	// DEFINE TABLE ... WITH VISUAL SHAPE (virtual-table-statement-dax)
	[
		{
			line: 'DEFINE TABLE T = {1} WITH VISUAL SHAPE',
			tokens: [
				{ startIndex: 0, type: 'keyword.msdax' }, // DEFINE
				{ startIndex: 6, type: 'white.msdax' },
				{ startIndex: 7, type: 'keyword.msdax' }, // TABLE
				{ startIndex: 12, type: 'white.msdax' },
				{ startIndex: 13, type: 'identifier.msdax' }, // T
				{ startIndex: 14, type: 'white.msdax' },
				{ startIndex: 15, type: 'operator.msdax' },
				{ startIndex: 16, type: 'white.msdax' },
				{ startIndex: 17, type: 'delimiter.brackets.msdax' },
				{ startIndex: 18, type: 'number.msdax' },
				{ startIndex: 19, type: 'delimiter.brackets.msdax' },
				{ startIndex: 20, type: 'white.msdax' },
				{ startIndex: 21, type: 'keyword.msdax' }, // WITH
				{ startIndex: 25, type: 'white.msdax' },
				{ startIndex: 26, type: 'keyword.msdax' }, // VISUAL
				{ startIndex: 32, type: 'white.msdax' },
				{ startIndex: 33, type: 'keyword.msdax' } // SHAPE
			]
		}
	]
]);
