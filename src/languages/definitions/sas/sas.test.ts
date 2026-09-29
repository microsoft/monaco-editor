/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization(
	'sas',
	[
	[
		{
			line: "data _null_;",
			tokens: [
				{ startIndex: 0, type: 'keyword.sas' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'keyword.sas' },
				{ startIndex: 11, type: 'delimiter.sas' },
			]
		},
		{
			line: "x = 1;",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'operator.sas' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.sas' },
				{ startIndex: 5, type: 'delimiter.sas' },
			]
		},
		{
			line: "x 'dir';",
			tokens: [
				{ startIndex: 0, type: 'keyword.sas' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'string.sas' },
				{ startIndex: 7, type: 'delimiter.sas' },
			]
		},
		{
			line: "if x then output;",
			tokens: [
				{ startIndex: 0, type: 'keyword.sas' },
				{ startIndex: 2, type: '' },
				{ startIndex: 5, type: 'keyword.flow.sas' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'keyword.flow.sas' },
				{ startIndex: 16, type: 'delimiter.sas' },
			]
		},
		{
			line: "run;",
			tokens: [
				{ startIndex: 0, type: 'keyword.sas' },
				{ startIndex: 3, type: 'delimiter.sas' },
			]
		},
	],

	[
		{
			line: "%let lib = work;",
			tokens: [
				{ startIndex: 0, type: 'keyword.flow.sas' },
				{ startIndex: 4, type: '' },
				{ startIndex: 9, type: 'operator.sas' },
				{ startIndex: 10, type: '' },
				{ startIndex: 15, type: 'delimiter.sas' },
			]
		},
		{
			line: "  %put NOTE: hello;",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'keyword.flow.sas' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'keyword.sas' },
				{ startIndex: 11, type: '' },
				{ startIndex: 18, type: 'delimiter.sas' },
			]
		},
		{
			line: "%mend;",
			tokens: [
				{ startIndex: 0, type: 'keyword.flow.sas' },
				{ startIndex: 5, type: 'delimiter.sas' },
			]
		},
	],

	[
		{
			line: "proc sql;",
			tokens: [
				{ startIndex: 0, type: 'keyword.sas' },
				{ startIndex: 8, type: 'delimiter.sas' },
			]
		},
		{
			line: "select name from sashelp.class;",
			tokens: [
				{ startIndex: 0, type: 'keyword.sas' },
				{ startIndex: 6, type: '' },
				{ startIndex: 12, type: 'keyword.sas' },
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'identifier.sas' },
				{ startIndex: 25, type: '' },
				{ startIndex: 30, type: 'delimiter.sas' },
			]
		},
		{
			line: "quit;",
			tokens: [
				{ startIndex: 0, type: 'keyword.sas' },
				{ startIndex: 4, type: 'delimiter.sas' },
			]
		},
	],

	[
		{
			line: "* a statement;",
			tokens: [
				{ startIndex: 0, type: 'comment.sas' },
			]
		},
		{
			line: "/* a block */",
			tokens: [
				{ startIndex: 0, type: 'comment.sas' },
			]
		},
	],

	[
		{
			line: "ods csv file=\"r.csv\" style=styles.min;",
			tokens: [
				{ startIndex: 0, type: 'keyword.sas' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'variable.predefined.sas' },
				{ startIndex: 7, type: '' },
				{ startIndex: 12, type: 'delimiter.sas' },
				{ startIndex: 13, type: 'string.sas' },
				{ startIndex: 20, type: '' },
				{ startIndex: 26, type: 'delimiter.sas' },
				{ startIndex: 27, type: '' },
				{ startIndex: 37, type: 'delimiter.sas' },
			]
		},
	],

	[
		{
			line: "options symbolgen mprint;",
			tokens: [
				{ startIndex: 0, type: 'keyword.sas' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'keyword.sas' },
				{ startIndex: 17, type: '' },
				{ startIndex: 18, type: 'keyword.sas' },
				{ startIndex: 24, type: 'delimiter.sas' },
			]
		},
	],

	[
		{
			line: "proc means data=sashelp.class;",
			tokens: [
				{ startIndex: 0, type: 'keyword.sas' },
				{ startIndex: 4, type: 'white.sas' },
				{ startIndex: 5, type: 'variable.predefined.sas' },
				{ startIndex: 10, type: '' },
				{ startIndex: 15, type: 'operator.sas' },
				{ startIndex: 16, type: 'identifier.sas' },
				{ startIndex: 24, type: '' },
				{ startIndex: 29, type: 'delimiter.sas' },
			]
		},
		{
			line: "  var age;",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'variable.predefined.sas' },
				{ startIndex: 5, type: '' },
				{ startIndex: 9, type: 'delimiter.sas' },
			]
		},
		{
			line: "run;",
			tokens: [
				{ startIndex: 0, type: 'keyword.sas' },
				{ startIndex: 3, type: 'delimiter.sas' },
			]
		},
	],

	[
		{
			line: "data _null_;",
			tokens: [
				{ startIndex: 0, type: 'keyword.sas' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'keyword.sas' },
				{ startIndex: 11, type: 'delimiter.sas' },
			]
		},
		{
			line: "  datalines;",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'keyword.sas' },
				{ startIndex: 11, type: 'string.sas' },
			]
		},
		{
			line: "1 2 3",
			tokens: [
				{ startIndex: 0, type: 'string.sas' },
			]
		},
		{
			line: ";",
			tokens: [
				{ startIndex: 0, type: 'delimiter.sas' },
			]
		},
	]
	]
);
