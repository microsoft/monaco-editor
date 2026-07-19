/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization as actualTestTokenization, ITestItem } from '../test/testRunner';

function testTokenization(_language: string | string[], tests: ITestItem[][]): void {
	tests = tests.map((t) => {
		return t.map((t) => {
			return {
				line: t.line.replace(/\n/g, ' '),
				tokens: t.tokens
			};
		});
	});
	actualTestTokenization(_language, tests);
}

testTokenization('scss', [
	// Nested Rules
	[
		{
			line:
				'#main {\n' +
				'  width: 97%;\n' +
				'  p, div {\n' +
				'    font-size: 2em;\n' +
				'    a { font-weight: bold; }\n' +
				'  }\n' +
				'  pre { font-size: 3em; }\n' +
				'}',
			tokens: [
				{ startIndex: 0, type: 'tag.scss' } /* '#main' */,
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 7, type: '' },
				{ startIndex: 10, type: 'attribute.name.scss' } /* 'width:' */,
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'number.scss' } /* '97%' */,
				{ startIndex: 20, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 21, type: '' },
				{ startIndex: 24, type: 'tag.scss' } /* 'p' */,
				{ startIndex: 25, type: 'delimiter.scss' } /* ',' */,
				{ startIndex: 26, type: '' },
				{ startIndex: 27, type: 'tag.scss' } /* 'div' */,
				{ startIndex: 30, type: '' },
				{ startIndex: 31, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 32, type: '' },
				{
					startIndex: 37,
					type: 'attribute.name.scss'
				} /* 'font-size:' */,
				{ startIndex: 47, type: '' },
				{ startIndex: 48, type: 'number.scss' } /* '2em' */,
				{ startIndex: 51, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 52, type: '' },
				{ startIndex: 57, type: 'tag.scss' } /* 'a' */,
				{ startIndex: 58, type: '' },
				{ startIndex: 59, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 60, type: '' },
				{
					startIndex: 61,
					type: 'attribute.name.scss'
				} /* 'font-weight:' */,
				{ startIndex: 73, type: '' },
				{ startIndex: 74, type: 'attribute.value.scss' } /* 'bold' */,
				{ startIndex: 78, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 79, type: '' },
				{ startIndex: 80, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 81, type: '' },
				{ startIndex: 84, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 85, type: '' },
				{ startIndex: 88, type: 'tag.scss' } /* 'pre' */,
				{ startIndex: 91, type: '' },
				{ startIndex: 92, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 93, type: '' },
				{
					startIndex: 94,
					type: 'attribute.name.scss'
				} /* 'font-size:' */,
				{ startIndex: 104, type: '' },
				{ startIndex: 105, type: 'number.scss' } /* '3em' */,
				{ startIndex: 108, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 109, type: '' },
				{ startIndex: 110, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 111, type: '' },
				{ startIndex: 112, type: 'delimiter.curly.scss' } /* '}' */
			]
		}
	],

	// Parent selector
	[
		{
			line:
				'#main {\n' +
				'  color: black;\n' +
				'  a {\n' +
				'    font-weight: bold;\n' +
				'    &:hover { color: red; }\n' +
				'  }\n' +
				'}',
			tokens: [
				{ startIndex: 0, type: 'tag.scss' } /* '#main' */,
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 7, type: '' },
				{ startIndex: 10, type: 'attribute.name.scss' } /* 'color:' */,
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'attribute.value.scss' } /* 'black' */,
				{ startIndex: 22, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 23, type: '' },
				{ startIndex: 26, type: 'tag.scss' } /* 'a' */,
				{ startIndex: 27, type: '' },
				{ startIndex: 28, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 29, type: '' },
				{
					startIndex: 34,
					type: 'attribute.name.scss'
				} /* 'font-weight:' */,
				{ startIndex: 46, type: '' },
				{ startIndex: 47, type: 'attribute.value.scss' } /* 'bold' */,
				{ startIndex: 51, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 52, type: '' },
				{ startIndex: 57, type: 'tag.scss' } /* '&:hover' */,
				{ startIndex: 64, type: '' },
				{ startIndex: 65, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 66, type: '' },
				{ startIndex: 67, type: 'attribute.name.scss' } /* 'color:' */,
				{ startIndex: 73, type: '' },
				{ startIndex: 74, type: 'attribute.value.scss' } /* 'red' */,
				{ startIndex: 77, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 78, type: '' },
				{ startIndex: 79, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 80, type: '' },
				{ startIndex: 83, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 84, type: '' },
				{ startIndex: 85, type: 'delimiter.curly.scss' } /* '}' */
			]
		}
	],

	// Nested Properties
	[
		{
			line:
				'.funky {\n' +
				'  font: 2px/3px {\n' +
				'    family: fantasy;\n' +
				'    size: 30em;\n' +
				'    weight: bold;\n' +
				'  }\n' +
				'  color: black;\n' +
				'}',
			tokens: [
				{ startIndex: 0, type: 'tag.scss' } /* '.funky' */,
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 8, type: '' },
				{ startIndex: 11, type: 'attribute.name.scss' } /* 'font:' */,
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'number.scss' } /* '2px' */,
				{ startIndex: 20, type: 'operator.scss' } /* '/' */,
				{ startIndex: 21, type: 'number.scss' } /* '3px' */,
				{ startIndex: 24, type: '' },
				{ startIndex: 25, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 26, type: '' },
				{ startIndex: 31, type: 'attribute.name.scss' } /* 'family:' */,
				{ startIndex: 38, type: '' },
				{
					startIndex: 39,
					type: 'attribute.value.scss'
				} /* 'fantasy' */,
				{ startIndex: 46, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 47, type: '' },
				{ startIndex: 52, type: 'attribute.name.scss' } /* 'size:' */,
				{ startIndex: 57, type: '' },
				{ startIndex: 58, type: 'number.scss' } /* '30em' */,
				{ startIndex: 62, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 63, type: '' },
				{ startIndex: 68, type: 'attribute.name.scss' } /* 'weight:' */,
				{ startIndex: 75, type: '' },
				{ startIndex: 76, type: 'attribute.value.scss' } /* 'bold' */,
				{ startIndex: 80, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 81, type: '' },
				{ startIndex: 84, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 85, type: '' },
				{ startIndex: 88, type: 'attribute.name.scss' } /* 'color:' */,
				{ startIndex: 94, type: '' },
				{ startIndex: 95, type: 'attribute.value.scss' } /* 'black' */,
				{ startIndex: 100, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 101, type: '' },
				{ startIndex: 102, type: 'delimiter.curly.scss' } /* '}' */
			]
		}
	],

	// Nesting name conflicts
	[
		{
			line:
				'tr.default {\n' +
				'  foo: { /* properti*/\n' +
				'    foo : 1;\n' +
				'  }\n' +
				'  foo: 1px; /* ru*/\n' +
				'  foo.bar { /* select*/\n' +
				'    foo : 1;\n' +
				'  }\n' +
				'  foo:bar { /* select*/\n' +
				'    foo : 1;\n' +
				'  }\n' +
				'  foo: 1px; /* ru*/\n' +
				'}',
			tokens: [
				{ startIndex: 0, type: 'tag.scss' } /* 'tr.default' */,
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 12, type: '' },
				{ startIndex: 15, type: 'attribute.name.scss' } /* 'foo:' */,
				{ startIndex: 19, type: '' },
				{ startIndex: 20, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 21, type: '' },
				{ startIndex: 22, type: 'comment.scss' } /* '// properties' */,
				{ startIndex: 35, type: '' },
				{ startIndex: 40, type: 'attribute.name.scss' } /* 'foo :' */,
				{ startIndex: 45, type: '' },
				{ startIndex: 46, type: 'number.scss' } /* '1' */,
				{ startIndex: 47, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 48, type: '' },
				{ startIndex: 51, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 52, type: '' },
				{ startIndex: 55, type: 'attribute.name.scss' } /* 'foo:' */,
				{ startIndex: 59, type: '' },
				{ startIndex: 60, type: 'number.scss' } /* '1px' */,
				{ startIndex: 63, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 64, type: '' },
				{ startIndex: 65, type: 'comment.scss' } /* '// rule' */,
				{ startIndex: 72, type: '' },
				{ startIndex: 75, type: 'tag.scss' } /* 'foo.bar' */,
				{ startIndex: 82, type: '' },
				{ startIndex: 83, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 84, type: '' },
				{ startIndex: 85, type: 'comment.scss' } /* '// selector' */,
				{ startIndex: 96, type: '' },
				{ startIndex: 101, type: 'attribute.name.scss' } /* 'foo :' */,
				{ startIndex: 106, type: '' },
				{ startIndex: 107, type: 'number.scss' } /* '1' */,
				{ startIndex: 108, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 109, type: '' },
				{ startIndex: 112, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 113, type: '' },
				{ startIndex: 116, type: 'tag.scss' } /* 'foo:bar' */,
				{ startIndex: 123, type: '' },
				{ startIndex: 124, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 125, type: '' },
				{ startIndex: 126, type: 'comment.scss' } /* '// selector' */,
				{ startIndex: 137, type: '' },
				{ startIndex: 142, type: 'attribute.name.scss' } /* 'foo :' */,
				{ startIndex: 147, type: '' },
				{ startIndex: 148, type: 'number.scss' } /* '1' */,
				{ startIndex: 149, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 150, type: '' },
				{ startIndex: 153, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 154, type: '' },
				{ startIndex: 157, type: 'attribute.name.scss' } /* 'foo:' */,
				{ startIndex: 161, type: '' },
				{ startIndex: 162, type: 'number.scss' } /* '1px' */,
				{ startIndex: 165, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 166, type: '' },
				{ startIndex: 167, type: 'comment.scss' } /* '// rule' */,
				{ startIndex: 174, type: '' },
				{ startIndex: 175, type: 'delimiter.curly.scss' } /* '}' */
			]
		}
	],

	// Missing semicolons
	[
		{
			line:
				'tr.default {\n' +
				'  foo.bar {\n' +
				'    $foo: 1px\n' +
				'  }\n' +
				'  foo: {\n' +
				'    foo : white\n' +
				'  }\n' +
				'  foo.bar1 {\n' +
				'    @extend tr.default\n' +
				'  }\n' +
				'  foo.bar2 {\n' +
				'    @import "compass"\n' +
				'  }\n' +
				'  bar: black\n' +
				'}',
			tokens: [
				{ startIndex: 0, type: 'tag.scss' } /* 'tr.default' */,
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 12, type: '' },
				{ startIndex: 15, type: 'tag.scss' } /* 'foo.bar' */,
				{ startIndex: 22, type: '' },
				{ startIndex: 23, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 24, type: '' },
				{ startIndex: 29, type: 'variable.decl.scss' } /* '$foo:' */,
				{ startIndex: 34, type: '' },
				{ startIndex: 35, type: 'number.scss' } /* '1px' */,
				{ startIndex: 38, type: '' },
				{ startIndex: 41, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 42, type: '' },
				{ startIndex: 45, type: 'attribute.name.scss' } /* 'foo:' */,
				{ startIndex: 49, type: '' },
				{ startIndex: 50, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 51, type: '' },
				{ startIndex: 56, type: 'attribute.name.scss' } /* 'foo :' */,
				{ startIndex: 61, type: '' },
				{ startIndex: 62, type: 'attribute.value.scss' } /* 'white' */,
				{ startIndex: 67, type: '' },
				{ startIndex: 70, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 71, type: '' },
				{ startIndex: 74, type: 'tag.scss' } /* 'foo.bar1' */,
				{ startIndex: 82, type: '' },
				{ startIndex: 83, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 84, type: '' },
				{ startIndex: 89, type: 'keyword.scss' } /* '@extend' */,
				{ startIndex: 96, type: '' },
				{ startIndex: 97, type: 'tag.scss' } /* 'tr.default' */,
				{ startIndex: 107, type: '' },
				{ startIndex: 110, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 111, type: '' },
				{ startIndex: 114, type: 'tag.scss' } /* 'foo.bar2' */,
				{ startIndex: 122, type: '' },
				{ startIndex: 123, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 124, type: '' },
				{ startIndex: 129, type: 'keyword.scss' } /* '@import' */,
				{ startIndex: 136, type: '' },
				{ startIndex: 137, type: 'string.delimiter.scss' } /* '"' */,
				{ startIndex: 138, type: 'string.scss' } /* 'compass' */,
				{ startIndex: 145, type: 'string.delimiter.scss' } /* '"' */,
				{ startIndex: 146, type: '' },
				{ startIndex: 149, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 150, type: '' },
				{ startIndex: 153, type: 'attribute.name.scss' } /* 'bar:' */,
				{ startIndex: 157, type: '' },
				{ startIndex: 158, type: 'attribute.value.scss' } /* 'black' */,
				{ startIndex: 163, type: '' },
				{ startIndex: 164, type: 'delimiter.curly.scss' } /* '}' */
			]
		}
	],

	// Rules without whitespaces
	[
		{
			line: 'legend {foo{a:s}margin-top:0;margin-bottom:#123;margin-top:s(1)}',
			tokens: [
				{ startIndex: 0, type: 'tag.scss' } /* 'legend' */,
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 8, type: 'tag.scss' } /* 'foo' */,
				{ startIndex: 11, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 12, type: 'attribute.name.scss' } /* 'a:' */,
				{ startIndex: 14, type: 'attribute.value.scss' } /* 's' */,
				{ startIndex: 15, type: 'delimiter.curly.scss' } /* '}' */,
				{
					startIndex: 16,
					type: 'attribute.name.scss'
				} /* 'margin-top:' */,
				{ startIndex: 27, type: 'number.scss' } /* '0' */,
				{ startIndex: 28, type: 'delimiter.scss' } /* ';' */,
				{
					startIndex: 29,
					type: 'attribute.name.scss'
				} /* 'margin-bottom:' */,
				{ startIndex: 43, type: 'number.hex.scss' } /* '#123' */,
				{ startIndex: 47, type: 'delimiter.scss' } /* ';' */,
				{
					startIndex: 48,
					type: 'attribute.name.scss'
				} /* 'margin-top:' */,
				{ startIndex: 59, type: 'meta.scss' } /* 's(' */,
				{ startIndex: 61, type: 'number.scss' } /* '1' */,
				{ startIndex: 62, type: 'meta.scss' } /* ')' */,
				{ startIndex: 63, type: 'delimiter.curly.scss' } /* '}' */
			]
		}
	],

	// Extended commentswhitespaces
	[
		{
			line:
				'/* extended comment syntax */\n' +
				'/* This comment is\n' +
				' * several lines long.\n' +
				' * since it uses the CSS comment syntax,\n' +
				' * it will appear in the CSS output. */\n' +
				'body { color: black; }\n' +
				'\n' +
				'/* These comments are only one line long eac*/\n' +
				"/* They won't appear in the CSS outpu*/\n" +
				'/* since they use the single-line comment synta*/\n' +
				'a { color: green; }',
			tokens: [
				{
					startIndex: 0,
					type: 'comment.scss'
				} /* '/* extended comment syntax * /' */,
				{ startIndex: 29, type: '' },
				{
					startIndex: 30,
					type: 'comment.scss'
				} /* '/* This comment is' */,
				{ startIndex: 152, type: '' },
				{ startIndex: 153, type: 'tag.scss' } /* 'body' */,
				{ startIndex: 157, type: '' },
				{ startIndex: 158, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 159, type: '' },
				{ startIndex: 160, type: 'attribute.name.scss' } /* 'color:' */,
				{ startIndex: 166, type: '' },
				{ startIndex: 167, type: 'attribute.value.scss' } /* 'black' */,
				{ startIndex: 172, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 173, type: '' },
				{ startIndex: 174, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 175, type: '' },
				{
					startIndex: 177,
					type: 'comment.scss'
				} /* '// These comments are only one line long each.' */,
				{ startIndex: 223, type: '' },
				{
					startIndex: 224,
					type: 'comment.scss'
				} /* '// They won't appear in the CSS output,' */,
				{ startIndex: 263, type: '' },
				{
					startIndex: 264,
					type: 'comment.scss'
				} /* '// since they use the single-line comment syntax.' */,
				{ startIndex: 313, type: '' },
				{ startIndex: 314, type: 'tag.scss' } /* 'a' */,
				{ startIndex: 315, type: '' },
				{ startIndex: 316, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 317, type: '' },
				{ startIndex: 318, type: 'attribute.name.scss' } /* 'color:' */,
				{ startIndex: 324, type: '' },
				{ startIndex: 325, type: 'attribute.value.scss' } /* 'green' */,
				{ startIndex: 330, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 331, type: '' },
				{ startIndex: 332, type: 'delimiter.curly.scss' } /* '}' */
			]
		}
	],

	// Variable declarations and referenceswhitespaces
	[
		{
			line:
				'$width: 5em;\n' +
				'$width: "Second width?" !default;\n' +
				'#main {\n' +
				'  $localvar: 6em;\n' +
				'  width: $width;\n' +
				'\n' +
				'  $font-size: 12px;\n' +
				'  $line-height: 30px;\n' +
				'  font: #{$font-size}/#{$line-height};\n' +
				'}\n' +
				'$name: foo;\n' +
				'$attr: border;\n' +
				'p.#{$name} {\n' +
				'  #{$attr}-color: blue;\n' +
				'}',
			tokens: [
				{ startIndex: 0, type: 'variable.decl.scss' } /* '$width:' */,
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'number.scss' } /* '5em' */,
				{ startIndex: 11, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'variable.decl.scss' } /* '$width:' */,
				{ startIndex: 20, type: '' },
				{ startIndex: 21, type: 'string.delimiter.scss' } /* '"' */,
				{ startIndex: 22, type: 'string.scss' } /* 'Second width?' */,
				{ startIndex: 35, type: 'string.delimiter.scss' } /* '"' */,
				{ startIndex: 36, type: '' },
				{ startIndex: 37, type: 'literal.scss' } /* '!default' */,
				{ startIndex: 45, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 46, type: '' },
				{ startIndex: 47, type: 'tag.scss' } /* '#main' */,
				{ startIndex: 52, type: '' },
				{ startIndex: 53, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 54, type: '' },
				{
					startIndex: 57,
					type: 'variable.decl.scss'
				} /* '$localvar:' */,
				{ startIndex: 67, type: '' },
				{ startIndex: 68, type: 'number.scss' } /* '6em' */,
				{ startIndex: 71, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 72, type: '' },
				{ startIndex: 75, type: 'attribute.name.scss' } /* 'width:' */,
				{ startIndex: 81, type: '' },
				{ startIndex: 82, type: 'variable.ref.scss' } /* '$width' */,
				{ startIndex: 88, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 89, type: '' },
				{
					startIndex: 93,
					type: 'variable.decl.scss'
				} /* '$font-size:' */,
				{ startIndex: 104, type: '' },
				{ startIndex: 105, type: 'number.scss' } /* '12px' */,
				{ startIndex: 109, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 110, type: '' },
				{
					startIndex: 113,
					type: 'variable.decl.scss'
				} /* '$line-height:' */,
				{ startIndex: 126, type: '' },
				{ startIndex: 127, type: 'number.scss' } /* '30px' */,
				{ startIndex: 131, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 132, type: '' },
				{ startIndex: 135, type: 'attribute.name.scss' } /* 'font:' */,
				{ startIndex: 140, type: '' },
				{ startIndex: 141, type: 'meta.scss' } /* '#{' */,
				{
					startIndex: 143,
					type: 'variable.ref.scss'
				} /* '$font-size' */,
				{ startIndex: 153, type: 'meta.scss' } /* '}' */,
				{ startIndex: 154, type: 'operator.scss' } /* '/' */,
				{ startIndex: 155, type: 'meta.scss' } /* '#{' */,
				{
					startIndex: 157,
					type: 'variable.ref.scss'
				} /* '$line-height' */,
				{ startIndex: 169, type: 'meta.scss' } /* '}' */,
				{ startIndex: 170, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 171, type: '' },
				{ startIndex: 172, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 173, type: '' },
				{ startIndex: 174, type: 'variable.decl.scss' } /* '$name:' */,
				{ startIndex: 180, type: '' },
				{ startIndex: 181, type: 'attribute.value.scss' } /* 'foo' */,
				{ startIndex: 184, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 185, type: '' },
				{ startIndex: 186, type: 'variable.decl.scss' } /* '$attr:' */,
				{ startIndex: 192, type: '' },
				{
					startIndex: 193,
					type: 'attribute.value.scss'
				} /* 'border' */,
				{ startIndex: 199, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 200, type: '' },
				{ startIndex: 201, type: 'tag.scss' } /* 'p.' */,
				{ startIndex: 203, type: 'meta.scss' } /* '#{' */,
				{ startIndex: 205, type: 'variable.ref.scss' } /* '$name' */,
				{ startIndex: 210, type: 'meta.scss' } /* '}' */,
				{ startIndex: 211, type: '' },
				{ startIndex: 212, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 213, type: '' },
				{ startIndex: 216, type: 'meta.scss' } /* '#{' */,
				{ startIndex: 218, type: 'variable.ref.scss' } /* '$attr' */,
				{ startIndex: 223, type: 'meta.scss' } /* '}' */,
				{
					startIndex: 224,
					type: 'attribute.name.scss'
				} /* '-color:' */,
				{ startIndex: 231, type: '' },
				{ startIndex: 232, type: 'attribute.value.scss' } /* 'blue' */,
				{ startIndex: 236, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 237, type: '' },
				{ startIndex: 238, type: 'delimiter.curly.scss' } /* '}' */
			]
		}
	],

	// Variable declaration with whitespaces
	[
		{
			line:
				'/* Set the color of your colum*/\n' +
				'$grid-background-column-color     : rgba(100, 100, 225, 0.25)   !default;',
			tokens: [
				{
					startIndex: 0,
					type: 'comment.scss'
				} /* '// Set the color of your columns' */,
				{ startIndex: 32, type: '' },
				{
					startIndex: 33,
					type: 'variable.decl.scss'
				} /* '$grid-background-column-color     :' */,
				{ startIndex: 68, type: '' },
				{ startIndex: 69, type: 'meta.scss' } /* 'rgba(' */,
				{ startIndex: 74, type: 'number.scss' } /* '100' */,
				{ startIndex: 77, type: 'delimiter.scss' } /* ',' */,
				{ startIndex: 78, type: '' },
				{ startIndex: 79, type: 'number.scss' } /* '100' */,
				{ startIndex: 82, type: 'delimiter.scss' } /* ',' */,
				{ startIndex: 83, type: '' },
				{ startIndex: 84, type: 'number.scss' } /* '225' */,
				{ startIndex: 87, type: 'delimiter.scss' } /* ',' */,
				{ startIndex: 88, type: '' },
				{ startIndex: 89, type: 'number.scss' } /* '0.25' */,
				{ startIndex: 93, type: 'meta.scss' } /* ')' */,
				{ startIndex: 94, type: '' },
				{ startIndex: 97, type: 'literal.scss' } /* '!default' */,
				{ startIndex: 105, type: 'delimiter.scss' } /* ';' */
			]
		}
	],

	// Operationswhitespaces
	[
		{
			line:
				'p {\n' +
				'  width: (1em + 2em) * 3;\n' +
				'  color: #010203 + #040506;\n' +
				'  font-family: sans- + "serif";\n' +
				'  margin: 3px + 4px auto;\n' +
				'  content: "I ate #{5 + 10} pies!";\n' +
				'  color: hsl(0, 100%, 50%);\n' +
				'  color: hsl($hue: 0, $saturation: 100%, $lightness: 50%);\n' +
				'}',
			tokens: [
				{ startIndex: 0, type: 'tag.scss' } /* 'p' */,
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 3, type: '' },
				{ startIndex: 6, type: 'attribute.name.scss' } /* 'width:' */,
				{ startIndex: 12, type: '' },
				{
					startIndex: 13,
					type: 'delimiter.parenthesis.scss'
				} /* '(' */,
				{ startIndex: 14, type: 'number.scss' } /* '1em' */,
				{ startIndex: 17, type: '' },
				{ startIndex: 18, type: 'operator.scss' } /* '+' */,
				{ startIndex: 19, type: '' },
				{ startIndex: 20, type: 'number.scss' } /* '2em' */,
				{
					startIndex: 23,
					type: 'delimiter.parenthesis.scss'
				} /* ')' */,
				{ startIndex: 24, type: '' },
				{ startIndex: 25, type: 'operator.scss' } /* '*' */,
				{ startIndex: 26, type: '' },
				{ startIndex: 27, type: 'number.scss' } /* '3' */,
				{ startIndex: 28, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 29, type: '' },
				{ startIndex: 32, type: 'attribute.name.scss' } /* 'color:' */,
				{ startIndex: 38, type: '' },
				{ startIndex: 39, type: 'number.hex.scss' } /* '#010203' */,
				{ startIndex: 46, type: '' },
				{ startIndex: 47, type: 'operator.scss' } /* '+' */,
				{ startIndex: 48, type: '' },
				{ startIndex: 49, type: 'number.hex.scss' } /* '#040506' */,
				{ startIndex: 56, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 57, type: '' },
				{
					startIndex: 60,
					type: 'attribute.name.scss'
				} /* 'font-family:' */,
				{ startIndex: 72, type: '' },
				{ startIndex: 73, type: 'attribute.value.scss' } /* 'sans-' */,
				{ startIndex: 78, type: '' },
				{ startIndex: 79, type: 'operator.scss' } /* '+' */,
				{ startIndex: 80, type: '' },
				{ startIndex: 81, type: 'string.delimiter.scss' } /* '"' */,
				{ startIndex: 82, type: 'string.scss' } /* 'serif' */,
				{ startIndex: 87, type: 'string.delimiter.scss' } /* '"' */,
				{ startIndex: 88, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 89, type: '' },
				{ startIndex: 92, type: 'attribute.name.scss' } /* 'margin:' */,
				{ startIndex: 99, type: '' },
				{ startIndex: 100, type: 'number.scss' } /* '3px' */,
				{ startIndex: 103, type: '' },
				{ startIndex: 104, type: 'operator.scss' } /* '+' */,
				{ startIndex: 105, type: '' },
				{ startIndex: 106, type: 'number.scss' } /* '4px' */,
				{ startIndex: 109, type: '' },
				{ startIndex: 110, type: 'attribute.value.scss' } /* 'auto' */,
				{ startIndex: 114, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 115, type: '' },
				{
					startIndex: 118,
					type: 'attribute.name.scss'
				} /* 'content:' */,
				{ startIndex: 126, type: '' },
				{ startIndex: 127, type: 'string.delimiter.scss' } /* '"' */,
				{
					startIndex: 128,
					type: 'string.scss'
				} /* 'I ate #{5 + 10} pies!' */,
				{ startIndex: 149, type: 'string.delimiter.scss' } /* '"' */,
				{ startIndex: 150, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 151, type: '' },
				{ startIndex: 154, type: 'attribute.name.scss' } /* 'color:' */,
				{ startIndex: 160, type: '' },
				{ startIndex: 161, type: 'meta.scss' } /* 'hsl(' */,
				{ startIndex: 165, type: 'number.scss' } /* '0' */,
				{ startIndex: 166, type: 'delimiter.scss' } /* ',' */,
				{ startIndex: 167, type: '' },
				{ startIndex: 168, type: 'number.scss' } /* '100%' */,
				{ startIndex: 172, type: 'delimiter.scss' } /* ',' */,
				{ startIndex: 173, type: '' },
				{ startIndex: 174, type: 'number.scss' } /* '50%' */,
				{ startIndex: 177, type: 'meta.scss' } /* ')' */,
				{ startIndex: 178, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 179, type: '' },
				{ startIndex: 182, type: 'attribute.name.scss' } /* 'color:' */,
				{ startIndex: 188, type: '' },
				{ startIndex: 189, type: 'meta.scss' } /* 'hsl(' */,
				{ startIndex: 193, type: 'attribute.name.scss' } /* '$hue:' */,
				{ startIndex: 198, type: '' },
				{ startIndex: 199, type: 'number.scss' } /* '0' */,
				{ startIndex: 200, type: 'delimiter.scss' } /* ',' */,
				{ startIndex: 201, type: '' },
				{
					startIndex: 202,
					type: 'attribute.name.scss'
				} /* '$saturation:' */,
				{ startIndex: 214, type: '' },
				{ startIndex: 215, type: 'number.scss' } /* '100%' */,
				{ startIndex: 219, type: 'delimiter.scss' } /* ',' */,
				{ startIndex: 220, type: '' },
				{
					startIndex: 221,
					type: 'attribute.name.scss'
				} /* '$lightness:' */,
				{ startIndex: 232, type: '' },
				{ startIndex: 233, type: 'number.scss' } /* '50%' */,
				{ startIndex: 236, type: 'meta.scss' } /* ')' */,
				{ startIndex: 237, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 238, type: '' },
				{ startIndex: 239, type: 'delimiter.curly.scss' } /* '}' */
			]
		}
	],

	// Functionwhitespaces
	[
		{
			line:
				'$grid-width: 40px;\n' +
				'$gutter-width: 10px;\n' +
				'@function grid-width($n) {\n' +
				'  @return $n * $grid-width + ($n - 1) * $gutter-width;\n' +
				'}\n' +
				'#sidebar { width: grid-width(5); }',
			tokens: [
				{
					startIndex: 0,
					type: 'variable.decl.scss'
				} /* '$grid-width:' */,
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'number.scss' } /* '40px' */,
				{ startIndex: 17, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 18, type: '' },
				{
					startIndex: 19,
					type: 'variable.decl.scss'
				} /* '$gutter-width:' */,
				{ startIndex: 33, type: '' },
				{ startIndex: 34, type: 'number.scss' } /* '10px' */,
				{ startIndex: 38, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 39, type: '' },
				{ startIndex: 40, type: 'keyword.scss' } /* '@function' */,
				{ startIndex: 49, type: '' },
				{ startIndex: 50, type: 'meta.scss' } /* 'grid-width(' */,
				{ startIndex: 61, type: 'variable.ref.scss' } /* '$n' */,
				{ startIndex: 63, type: 'meta.scss' } /* ')' */,
				{ startIndex: 64, type: '' },
				{ startIndex: 65, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 66, type: '' },
				{ startIndex: 69, type: 'keyword.scss' } /* '@return' */,
				{ startIndex: 76, type: '' },
				{ startIndex: 77, type: 'variable.ref.scss' } /* '$n' */,
				{ startIndex: 79, type: '' },
				{ startIndex: 80, type: 'operator.scss' } /* '*' */,
				{ startIndex: 81, type: '' },
				{
					startIndex: 82,
					type: 'variable.ref.scss'
				} /* '$grid-width' */,
				{ startIndex: 93, type: '' },
				{ startIndex: 94, type: 'operator.scss' } /* '+' */,
				{ startIndex: 95, type: '' },
				{
					startIndex: 96,
					type: 'delimiter.parenthesis.scss'
				} /* '(' */,
				{ startIndex: 97, type: 'variable.ref.scss' } /* '$n' */,
				{ startIndex: 99, type: '' },
				{ startIndex: 100, type: 'operator.scss' } /* '-' */,
				{ startIndex: 101, type: '' },
				{ startIndex: 102, type: 'number.scss' } /* '1' */,
				{
					startIndex: 103,
					type: 'delimiter.parenthesis.scss'
				} /* ')' */,
				{ startIndex: 104, type: '' },
				{ startIndex: 105, type: 'operator.scss' } /* '*' */,
				{ startIndex: 106, type: '' },
				{
					startIndex: 107,
					type: 'variable.ref.scss'
				} /* '$gutter-width' */,
				{ startIndex: 120, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 121, type: '' },
				{ startIndex: 122, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 123, type: '' },
				{ startIndex: 124, type: 'tag.scss' } /* '#sidebar' */,
				{ startIndex: 132, type: '' },
				{ startIndex: 133, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 134, type: '' },
				{ startIndex: 135, type: 'attribute.name.scss' } /* 'width:' */,
				{ startIndex: 141, type: '' },
				{ startIndex: 142, type: 'meta.scss' } /* 'grid-width(' */,
				{ startIndex: 153, type: 'number.scss' } /* '5' */,
				{ startIndex: 154, type: 'meta.scss' } /* ')' */,
				{ startIndex: 155, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 156, type: '' },
				{ startIndex: 157, type: 'delimiter.curly.scss' } /* '}' */
			]
		}
	],

	// Importswhitespaces
	[
		{
			line:
				'@import "foo.scss";\n' +
				'$family: unquote("Droid+Sans");\n' +
				'@import "rounded-corners" url("http://fonts.googleapis.com/css?family=#{$family}");\n' +
				'#main {\n' +
				'  @import "example";\n' +
				'}',
			tokens: [
				{ startIndex: 0, type: 'keyword.scss' } /* '@import' */,
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'string.delimiter.scss' } /* '"' */,
				{ startIndex: 9, type: 'string.scss' } /* 'foo.scss' */,
				{ startIndex: 17, type: 'string.delimiter.scss' } /* '"' */,
				{ startIndex: 18, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 19, type: '' },
				{ startIndex: 20, type: 'variable.decl.scss' } /* '$family:' */,
				{ startIndex: 28, type: '' },
				{ startIndex: 29, type: 'meta.scss' } /* 'unquote(' */,
				{ startIndex: 37, type: 'string.delimiter.scss' } /* '"' */,
				{ startIndex: 38, type: 'string.scss' } /* 'Droid+Sans' */,
				{ startIndex: 48, type: 'string.delimiter.scss' } /* '"' */,
				{ startIndex: 49, type: 'meta.scss' } /* ')' */,
				{ startIndex: 50, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 51, type: '' },
				{ startIndex: 52, type: 'keyword.scss' } /* '@import' */,
				{ startIndex: 59, type: '' },
				{ startIndex: 60, type: 'string.delimiter.scss' } /* '"' */,
				{ startIndex: 61, type: 'string.scss' } /* 'rounded-corners' */,
				{ startIndex: 76, type: 'string.delimiter.scss' } /* '"' */,
				{ startIndex: 77, type: '' },
				{ startIndex: 78, type: 'meta.scss' } /* 'url(' */,
				{ startIndex: 82, type: 'string.delimiter.scss' } /* '"' */,
				{
					startIndex: 83,
					type: 'string.scss'
				} /* 'http://fonts.googleapis.com/css?family=#{$family}' */,
				{ startIndex: 132, type: 'string.delimiter.scss' } /* '"' */,
				{ startIndex: 133, type: 'meta.scss' } /* ')' */,
				{ startIndex: 134, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 135, type: '' },
				{ startIndex: 136, type: 'tag.scss' } /* '#main' */,
				{ startIndex: 141, type: '' },
				{ startIndex: 142, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 143, type: '' },
				{ startIndex: 146, type: 'keyword.scss' } /* '@import' */,
				{ startIndex: 153, type: '' },
				{ startIndex: 154, type: 'string.delimiter.scss' } /* '"' */,
				{ startIndex: 155, type: 'string.scss' } /* 'example' */,
				{ startIndex: 162, type: 'string.delimiter.scss' } /* '"' */,
				{ startIndex: 163, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 164, type: '' },
				{ startIndex: 165, type: 'delimiter.curly.scss' } /* '}' */
			]
		}
	],

	// Mediawhitespaces
	[
		{
			line:
				'.sidebar {\n' +
				'  width: 300px;\n' +
				'  @media screen and (orientation: landscape) {\n' +
				'    width: 500px;\n' +
				'  }\n' +
				'}',
			tokens: [
				{ startIndex: 0, type: 'tag.scss' } /* '.sidebar' */,
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 10, type: '' },
				{ startIndex: 13, type: 'attribute.name.scss' } /* 'width:' */,
				{ startIndex: 19, type: '' },
				{ startIndex: 20, type: 'number.scss' } /* '300px' */,
				{ startIndex: 25, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 26, type: '' },
				{ startIndex: 29, type: 'keyword.flow.scss' } /* '@media' */,
				{ startIndex: 35, type: '' },
				{ startIndex: 36, type: 'attribute.value.scss' } /* 'screen' */,
				{ startIndex: 42, type: '' },
				{ startIndex: 43, type: 'operator.scss' } /* 'and' */,
				{ startIndex: 46, type: '' },
				{
					startIndex: 47,
					type: 'delimiter.parenthesis.scss'
				} /* '(' */,
				{
					startIndex: 48,
					type: 'attribute.value.scss'
				} /* 'orientation' */,
				{ startIndex: 59, type: '' },
				{
					startIndex: 61,
					type: 'attribute.value.scss'
				} /* 'landscape' */,
				{
					startIndex: 70,
					type: 'delimiter.parenthesis.scss'
				} /* ')' */,
				{ startIndex: 71, type: '' },
				{ startIndex: 72, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 73, type: '' },
				{ startIndex: 78, type: 'attribute.name.scss' } /* 'width:' */,
				{ startIndex: 84, type: '' },
				{ startIndex: 85, type: 'number.scss' } /* '500px' */,
				{ startIndex: 90, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 91, type: '' },
				{ startIndex: 94, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 95, type: '' },
				{ startIndex: 96, type: 'delimiter.curly.scss' } /* '}' */
			]
		}
	],

	// Extendwhitespaces
	[
		{
			line:
				'.error {\n' +
				'  border: 1px #f00;\n' +
				'  background-color: #fdd;\n' +
				'}\n' +
				'.seriousError {\n' +
				'  @extend .error;\n' +
				'  border-width: 3px;\n' +
				'}\n' +
				'#context a%extreme {\n' +
				'  color: blue;\n' +
				'  font-weight: bold;\n' +
				'  font-size: 2em;\n' +
				'}\n' +
				'.notice {\n' +
				'  @extend %extreme !optional;\n' +
				'}',
			tokens: [
				{ startIndex: 0, type: 'tag.scss' } /* '.error' */,
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 8, type: '' },
				{ startIndex: 11, type: 'attribute.name.scss' } /* 'border:' */,
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'number.scss' } /* '1px' */,
				{ startIndex: 22, type: '' },
				{ startIndex: 23, type: 'number.hex.scss' } /* '#f00' */,
				{ startIndex: 27, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 28, type: '' },
				{
					startIndex: 31,
					type: 'attribute.name.scss'
				} /* 'background-color:' */,
				{ startIndex: 48, type: '' },
				{ startIndex: 49, type: 'number.hex.scss' } /* '#fdd' */,
				{ startIndex: 53, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 54, type: '' },
				{ startIndex: 55, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 56, type: '' },
				{ startIndex: 57, type: 'tag.scss' } /* '.seriousError' */,
				{ startIndex: 70, type: '' },
				{ startIndex: 71, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 72, type: '' },
				{ startIndex: 75, type: 'keyword.scss' } /* '@extend' */,
				{ startIndex: 82, type: '' },
				{ startIndex: 83, type: 'tag.scss' } /* '.error' */,
				{ startIndex: 89, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 90, type: '' },
				{
					startIndex: 93,
					type: 'attribute.name.scss'
				} /* 'border-width:' */,
				{ startIndex: 106, type: '' },
				{ startIndex: 107, type: 'number.scss' } /* '3px' */,
				{ startIndex: 110, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 111, type: '' },
				{ startIndex: 112, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 113, type: '' },
				{ startIndex: 114, type: 'tag.scss' } /* '#context' */,
				{ startIndex: 122, type: '' },
				{ startIndex: 123, type: 'tag.scss' } /* 'a%extreme' */,
				{ startIndex: 132, type: '' },
				{ startIndex: 133, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 134, type: '' },
				{ startIndex: 137, type: 'attribute.name.scss' } /* 'color:' */,
				{ startIndex: 143, type: '' },
				{ startIndex: 144, type: 'attribute.value.scss' } /* 'blue' */,
				{ startIndex: 148, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 149, type: '' },
				{
					startIndex: 152,
					type: 'attribute.name.scss'
				} /* 'font-weight:' */,
				{ startIndex: 164, type: '' },
				{ startIndex: 165, type: 'attribute.value.scss' } /* 'bold' */,
				{ startIndex: 169, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 170, type: '' },
				{
					startIndex: 173,
					type: 'attribute.name.scss'
				} /* 'font-size:' */,
				{ startIndex: 183, type: '' },
				{ startIndex: 184, type: 'number.scss' } /* '2em' */,
				{ startIndex: 187, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 188, type: '' },
				{ startIndex: 189, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 190, type: '' },
				{ startIndex: 191, type: 'tag.scss' } /* '.notice' */,
				{ startIndex: 198, type: '' },
				{ startIndex: 199, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 200, type: '' },
				{ startIndex: 203, type: 'keyword.scss' } /* '@extend' */,
				{ startIndex: 210, type: '' },
				{ startIndex: 211, type: 'tag.scss' } /* '%extreme' */,
				{ startIndex: 219, type: '' },
				{ startIndex: 220, type: 'literal.scss' } /* '!optional' */,
				{ startIndex: 229, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 230, type: '' },
				{ startIndex: 231, type: 'delimiter.curly.scss' } /* '}' */
			]
		}
	],

	// @debug and @warnwhitespaces
	[
		{
			line:
				'@debug 10em + 12em;\n' +
				'@mixin adjust-location($x, $y) {\n' +
				'  @if unitless($x) {\n' +
				'    @warn "Assuming #{$x} to be in pixels";\n' +
				'    $x: 1px * $x;\n' +
				'  }\n' +
				'  @if unitless($y) {\n' +
				'    @warn "Assuming #{$y} to be in pixels";\n' +
				'    $y: 1px * $y;\n' +
				'  }\n' +
				'  position: relative; left: $x; top: $y;\n' +
				'}',
			tokens: [
				{ startIndex: 0, type: 'keyword.scss' } /* '@debug' */,
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'number.scss' } /* '10em' */,
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'operator.scss' } /* '+' */,
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'number.scss' } /* '12em' */,
				{ startIndex: 18, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 19, type: '' },
				{ startIndex: 20, type: 'keyword.scss' } /* '@mixin' */,
				{ startIndex: 26, type: '' },
				{ startIndex: 27, type: 'meta.scss' } /* 'adjust-location(' */,
				{ startIndex: 43, type: 'variable.ref.scss' } /* '$x' */,
				{ startIndex: 45, type: 'delimiter.scss' } /* ',' */,
				{ startIndex: 46, type: '' },
				{ startIndex: 47, type: 'variable.ref.scss' } /* '$y' */,
				{ startIndex: 49, type: 'meta.scss' } /* ')' */,
				{ startIndex: 50, type: '' },
				{ startIndex: 51, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 52, type: '' },
				{ startIndex: 55, type: 'keyword.flow.scss' } /* '@if' */,
				{ startIndex: 58, type: '' },
				{ startIndex: 59, type: 'meta.scss' } /* 'unitless(' */,
				{ startIndex: 68, type: 'variable.ref.scss' } /* '$x' */,
				{ startIndex: 70, type: 'meta.scss' } /* ')' */,
				{ startIndex: 71, type: '' },
				{ startIndex: 72, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 73, type: '' },
				{ startIndex: 78, type: 'keyword.scss' } /* '@warn' */,
				{ startIndex: 83, type: '' },
				{ startIndex: 84, type: 'string.delimiter.scss' } /* '"' */,
				{
					startIndex: 85,
					type: 'string.scss'
				} /* 'Assuming #{$x} to be in pixels' */,
				{ startIndex: 115, type: 'string.delimiter.scss' } /* '"' */,
				{ startIndex: 116, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 117, type: '' },
				{ startIndex: 122, type: 'variable.decl.scss' } /* '$x:' */,
				{ startIndex: 125, type: '' },
				{ startIndex: 126, type: 'number.scss' } /* '1px' */,
				{ startIndex: 129, type: '' },
				{ startIndex: 130, type: 'operator.scss' } /* '*' */,
				{ startIndex: 131, type: '' },
				{ startIndex: 132, type: 'variable.ref.scss' } /* '$x' */,
				{ startIndex: 134, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 135, type: '' },
				{ startIndex: 138, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 139, type: '' },
				{ startIndex: 142, type: 'keyword.flow.scss' } /* '@if' */,
				{ startIndex: 145, type: '' },
				{ startIndex: 146, type: 'meta.scss' } /* 'unitless(' */,
				{ startIndex: 155, type: 'variable.ref.scss' } /* '$y' */,
				{ startIndex: 157, type: 'meta.scss' } /* ')' */,
				{ startIndex: 158, type: '' },
				{ startIndex: 159, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 160, type: '' },
				{ startIndex: 165, type: 'keyword.scss' } /* '@warn' */,
				{ startIndex: 170, type: '' },
				{ startIndex: 171, type: 'string.delimiter.scss' } /* '"' */,
				{
					startIndex: 172,
					type: 'string.scss'
				} /* 'Assuming #{$y} to be in pixels' */,
				{ startIndex: 202, type: 'string.delimiter.scss' } /* '"' */,
				{ startIndex: 203, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 204, type: '' },
				{ startIndex: 209, type: 'variable.decl.scss' } /* '$y:' */,
				{ startIndex: 212, type: '' },
				{ startIndex: 213, type: 'number.scss' } /* '1px' */,
				{ startIndex: 216, type: '' },
				{ startIndex: 217, type: 'operator.scss' } /* '*' */,
				{ startIndex: 218, type: '' },
				{ startIndex: 219, type: 'variable.ref.scss' } /* '$y' */,
				{ startIndex: 221, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 222, type: '' },
				{ startIndex: 225, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 226, type: '' },
				{
					startIndex: 229,
					type: 'attribute.name.scss'
				} /* 'position:' */,
				{ startIndex: 238, type: '' },
				{
					startIndex: 239,
					type: 'attribute.value.scss'
				} /* 'relative' */,
				{ startIndex: 247, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 248, type: '' },
				{ startIndex: 249, type: 'attribute.name.scss' } /* 'left:' */,
				{ startIndex: 254, type: '' },
				{ startIndex: 255, type: 'variable.ref.scss' } /* '$x' */,
				{ startIndex: 257, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 258, type: '' },
				{ startIndex: 259, type: 'attribute.name.scss' } /* 'top:' */,
				{ startIndex: 263, type: '' },
				{ startIndex: 264, type: 'variable.ref.scss' } /* '$y' */,
				{ startIndex: 266, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 267, type: '' },
				{ startIndex: 268, type: 'delimiter.curly.scss' } /* '}' */
			]
		}
	],

	// if statementwhitespaces
	[
		{
			line:
				'p {\n' +
				'  @if 1 + 1 == 2 { border: 1px solid;  }\n' +
				'  @if 5 < 3      { border: 2px dotted; }\n' +
				'  @if null       { border: 3px double; }\n' +
				'}',
			tokens: [
				{ startIndex: 0, type: 'tag.scss' } /* 'p' */,
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 3, type: '' },
				{ startIndex: 6, type: 'keyword.flow.scss' } /* '@if' */,
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'number.scss' } /* '1' */,
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'operator.scss' } /* '+' */,
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'number.scss' } /* '1' */,
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'operator.scss' } /* '==' */,
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'number.scss' } /* '2' */,
				{ startIndex: 20, type: '' },
				{ startIndex: 21, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 22, type: '' },
				{ startIndex: 23, type: 'attribute.name.scss' } /* 'border:' */,
				{ startIndex: 30, type: '' },
				{ startIndex: 31, type: 'number.scss' } /* '1px' */,
				{ startIndex: 34, type: '' },
				{ startIndex: 35, type: 'attribute.value.scss' } /* 'solid' */,
				{ startIndex: 40, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 41, type: '' },
				{ startIndex: 43, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 44, type: '' },
				{ startIndex: 47, type: 'keyword.flow.scss' } /* '@if' */,
				{ startIndex: 50, type: '' },
				{ startIndex: 51, type: 'number.scss' } /* '5' */,
				{ startIndex: 52, type: '' },
				{ startIndex: 53, type: 'operator.scss' } /* '<' */,
				{ startIndex: 54, type: '' },
				{ startIndex: 55, type: 'number.scss' } /* '3' */,
				{ startIndex: 56, type: '' },
				{ startIndex: 62, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 63, type: '' },
				{ startIndex: 64, type: 'attribute.name.scss' } /* 'border:' */,
				{ startIndex: 71, type: '' },
				{ startIndex: 72, type: 'number.scss' } /* '2px' */,
				{ startIndex: 75, type: '' },
				{ startIndex: 76, type: 'attribute.value.scss' } /* 'dotted' */,
				{ startIndex: 82, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 83, type: '' },
				{ startIndex: 84, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 85, type: '' },
				{ startIndex: 88, type: 'keyword.flow.scss' } /* '@if' */,
				{ startIndex: 91, type: '' },
				{ startIndex: 92, type: 'attribute.value.scss' } /* 'null' */,
				{ startIndex: 96, type: '' },
				{ startIndex: 103, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 104, type: '' },
				{
					startIndex: 105,
					type: 'attribute.name.scss'
				} /* 'border:' */,
				{ startIndex: 112, type: '' },
				{ startIndex: 113, type: 'number.scss' } /* '3px' */,
				{ startIndex: 116, type: '' },
				{
					startIndex: 117,
					type: 'attribute.value.scss'
				} /* 'double' */,
				{ startIndex: 123, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 124, type: '' },
				{ startIndex: 125, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 126, type: '' },
				{ startIndex: 127, type: 'delimiter.curly.scss' } /* '}' */
			]
		}
	],

	// if-else statementwhitespaces
	[
		{
			line:
				'$type: monster;\n' +
				'p {\n' +
				'  @if $type == ocean {\n' +
				'    color: blue;\n' +
				'  } @else if $type == matador {\n' +
				'    color: red;\n' +
				'  } @else {\n' +
				'    color: black;\n' +
				'  }\n' +
				'}',
			tokens: [
				{ startIndex: 0, type: 'variable.decl.scss' } /* '$type:' */,
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'attribute.value.scss' } /* 'monster' */,
				{ startIndex: 14, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'tag.scss' } /* 'p' */,
				{ startIndex: 17, type: '' },
				{ startIndex: 18, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 19, type: '' },
				{ startIndex: 22, type: 'keyword.flow.scss' } /* '@if' */,
				{ startIndex: 25, type: '' },
				{ startIndex: 26, type: 'variable.ref.scss' } /* '$type' */,
				{ startIndex: 31, type: '' },
				{ startIndex: 32, type: 'operator.scss' } /* '==' */,
				{ startIndex: 34, type: '' },
				{ startIndex: 35, type: 'attribute.value.scss' } /* 'ocean' */,
				{ startIndex: 40, type: '' },
				{ startIndex: 41, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 42, type: '' },
				{ startIndex: 47, type: 'attribute.name.scss' } /* 'color:' */,
				{ startIndex: 53, type: '' },
				{ startIndex: 54, type: 'attribute.value.scss' } /* 'blue' */,
				{ startIndex: 58, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 59, type: '' },
				{ startIndex: 62, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 63, type: '' },
				{ startIndex: 64, type: 'keyword.flow.scss' } /* '@else' */,
				{ startIndex: 69, type: '' },
				{ startIndex: 70, type: 'keyword.flow.scss' } /* 'if' */,
				{ startIndex: 72, type: '' },
				{ startIndex: 73, type: 'variable.ref.scss' } /* '$type' */,
				{ startIndex: 78, type: '' },
				{ startIndex: 79, type: 'operator.scss' } /* '==' */,
				{ startIndex: 81, type: '' },
				{
					startIndex: 82,
					type: 'attribute.value.scss'
				} /* 'matador' */,
				{ startIndex: 89, type: '' },
				{ startIndex: 90, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 91, type: '' },
				{ startIndex: 96, type: 'attribute.name.scss' } /* 'color:' */,
				{ startIndex: 102, type: '' },
				{ startIndex: 103, type: 'attribute.value.scss' } /* 'red' */,
				{ startIndex: 106, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 107, type: '' },
				{ startIndex: 110, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 111, type: '' },
				{ startIndex: 112, type: 'keyword.flow.scss' } /* '@else' */,
				{ startIndex: 117, type: '' },
				{ startIndex: 118, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 119, type: '' },
				{ startIndex: 124, type: 'attribute.name.scss' } /* 'color:' */,
				{ startIndex: 130, type: '' },
				{ startIndex: 131, type: 'attribute.value.scss' } /* 'black' */,
				{ startIndex: 136, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 137, type: '' },
				{ startIndex: 140, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 141, type: '' },
				{ startIndex: 142, type: 'delimiter.curly.scss' } /* '}' */
			]
		}
	],

	// for statementwhitespaces
	[
		{
			line: '@for $i from 1 through 3 {\n' + '  .item-#{$i} { width: 2em * $i; }\n' + '}',
			tokens: [
				{ startIndex: 0, type: 'keyword.flow.scss' } /* '@for' */,
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'variable.ref.scss' } /* '$i' */,
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'keyword.flow.scss' } /* 'from' */,
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'number.scss' } /* '1' */,
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'keyword.flow.scss' } /* 'through' */,
				{ startIndex: 22, type: '' },
				{ startIndex: 23, type: 'number.scss' } /* '3' */,
				{ startIndex: 24, type: '' },
				{ startIndex: 25, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 26, type: '' },
				{ startIndex: 29, type: 'tag.scss' } /* '.item-' */,
				{ startIndex: 35, type: 'meta.scss' } /* '#{' */,
				{ startIndex: 37, type: 'variable.ref.scss' } /* '$i' */,
				{ startIndex: 39, type: 'meta.scss' } /* '}' */,
				{ startIndex: 40, type: '' },
				{ startIndex: 41, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 42, type: '' },
				{ startIndex: 43, type: 'attribute.name.scss' } /* 'width:' */,
				{ startIndex: 49, type: '' },
				{ startIndex: 50, type: 'number.scss' } /* '2em' */,
				{ startIndex: 53, type: '' },
				{ startIndex: 54, type: 'operator.scss' } /* '*' */,
				{ startIndex: 55, type: '' },
				{ startIndex: 56, type: 'variable.ref.scss' } /* '$i' */,
				{ startIndex: 58, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 59, type: '' },
				{ startIndex: 60, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 61, type: '' },
				{ startIndex: 62, type: 'delimiter.curly.scss' } /* '}' */
			]
		}
	],

	// each statementwhitespaces
	[
		{
			line:
				'@each $animal in puma, sea-slug, egret, salamander {\n' +
				'  .#{$animal}-icon {\n' +
				"    background-image: url('/images/#{$animal}.png');\n" +
				'  }\n' +
				'}',
			tokens: [
				{ startIndex: 0, type: 'keyword.flow.scss' } /* '@each' */,
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'variable.ref.scss' } /* '$animal' */,
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'keyword.flow.scss' } /* 'in' */,
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'attribute.value.scss' } /* 'puma' */,
				{ startIndex: 21, type: 'operator.scss' } /* ',' */,
				{ startIndex: 22, type: '' },
				{
					startIndex: 23,
					type: 'attribute.value.scss'
				} /* 'sea-slug' */,
				{ startIndex: 31, type: 'operator.scss' } /* ',' */,
				{ startIndex: 32, type: '' },
				{ startIndex: 33, type: 'attribute.value.scss' } /* 'egret' */,
				{ startIndex: 38, type: 'operator.scss' } /* ',' */,
				{ startIndex: 39, type: '' },
				{
					startIndex: 40,
					type: 'attribute.value.scss'
				} /* 'salamander' */,
				{ startIndex: 50, type: '' },
				{ startIndex: 51, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 52, type: '' },
				{ startIndex: 55, type: 'tag.scss' } /* '.' */,
				{ startIndex: 56, type: 'meta.scss' } /* '#{' */,
				{ startIndex: 58, type: 'variable.ref.scss' } /* '$animal' */,
				{ startIndex: 65, type: 'meta.scss' } /* '}' */,
				{ startIndex: 66, type: 'tag.scss' } /* '-icon' */,
				{ startIndex: 71, type: '' },
				{ startIndex: 72, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 73, type: '' },
				{
					startIndex: 78,
					type: 'attribute.name.scss'
				} /* 'background-image:' */,
				{ startIndex: 95, type: '' },
				{ startIndex: 96, type: 'meta.scss' } /* 'url(' */,
				{ startIndex: 100, type: 'string.delimiter.scss' } /* ''' */,
				{
					startIndex: 101,
					type: 'string.scss'
				} /* '/images/#{$animal}.png' */,
				{ startIndex: 123, type: 'string.delimiter.scss' } /* ''' */,
				{ startIndex: 124, type: 'meta.scss' } /* ')' */,
				{ startIndex: 125, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 126, type: '' },
				{ startIndex: 129, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 130, type: '' },
				{ startIndex: 131, type: 'delimiter.curly.scss' } /* '}' */
			]
		}
	],

	// while statementwhitespaces
	[
		{
			line:
				'$i: 6;\n' +
				'@while $i > 0 {\n' +
				'  .item-#{$i} { width: 2em * $i; }\n' +
				'  $i: $i - 2;\n' +
				'}',
			tokens: [
				{ startIndex: 0, type: 'variable.decl.scss' } /* '$i:' */,
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.scss' } /* '6' */,
				{ startIndex: 5, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'keyword.flow.scss' } /* '@while' */,
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'variable.ref.scss' } /* '$i' */,
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'operator.scss' } /* '>' */,
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'number.scss' } /* '0' */,
				{ startIndex: 20, type: '' },
				{ startIndex: 21, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 22, type: '' },
				{ startIndex: 25, type: 'tag.scss' } /* '.item-' */,
				{ startIndex: 31, type: 'meta.scss' } /* '#{' */,
				{ startIndex: 33, type: 'variable.ref.scss' } /* '$i' */,
				{ startIndex: 35, type: 'meta.scss' } /* '}' */,
				{ startIndex: 36, type: '' },
				{ startIndex: 37, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 38, type: '' },
				{ startIndex: 39, type: 'attribute.name.scss' } /* 'width:' */,
				{ startIndex: 45, type: '' },
				{ startIndex: 46, type: 'number.scss' } /* '2em' */,
				{ startIndex: 49, type: '' },
				{ startIndex: 50, type: 'operator.scss' } /* '*' */,
				{ startIndex: 51, type: '' },
				{ startIndex: 52, type: 'variable.ref.scss' } /* '$i' */,
				{ startIndex: 54, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 55, type: '' },
				{ startIndex: 56, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 57, type: '' },
				{ startIndex: 60, type: 'variable.decl.scss' } /* '$i:' */,
				{ startIndex: 63, type: '' },
				{ startIndex: 64, type: 'variable.ref.scss' } /* '$i' */,
				{ startIndex: 66, type: '' },
				{ startIndex: 67, type: 'operator.scss' } /* '-' */,
				{ startIndex: 68, type: '' },
				{ startIndex: 69, type: 'number.scss' } /* '2' */,
				{ startIndex: 70, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 71, type: '' },
				{ startIndex: 72, type: 'delimiter.curly.scss' } /* '}' */
			]
		}
	],

	// Function with control statements nestedwhitespaces
	[
		{
			line:
				'@function foo($total, $a) {\n' +
				'  @for $i from 0 to $total {\n' +
				'    @if (unit($a) == "%") and ($i == ($total - 1)) {\n' +
				'      $z: 100%;\n' +
				"      @return '1';\n" +
				'    }\n' +
				'  }\n' +
				'  @return $grid;\n' +
				'}',
			tokens: [
				{ startIndex: 0, type: 'keyword.scss' } /* '@function' */,
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'meta.scss' } /* 'foo(' */,
				{ startIndex: 14, type: 'variable.ref.scss' } /* '$total' */,
				{ startIndex: 20, type: 'delimiter.scss' } /* ',' */,
				{ startIndex: 21, type: '' },
				{ startIndex: 22, type: 'variable.ref.scss' } /* '$a' */,
				{ startIndex: 24, type: 'meta.scss' } /* ')' */,
				{ startIndex: 25, type: '' },
				{ startIndex: 26, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 27, type: '' },
				{ startIndex: 30, type: 'keyword.flow.scss' } /* '@for' */,
				{ startIndex: 34, type: '' },
				{ startIndex: 35, type: 'variable.ref.scss' } /* '$i' */,
				{ startIndex: 37, type: '' },
				{ startIndex: 38, type: 'keyword.flow.scss' } /* 'from' */,
				{ startIndex: 42, type: '' },
				{ startIndex: 43, type: 'number.scss' } /* '0' */,
				{ startIndex: 44, type: '' },
				{ startIndex: 45, type: 'keyword.flow.scss' } /* 'to' */,
				{ startIndex: 47, type: '' },
				{ startIndex: 48, type: 'variable.ref.scss' } /* '$total' */,
				{ startIndex: 54, type: '' },
				{ startIndex: 55, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 56, type: '' },
				{ startIndex: 61, type: 'keyword.flow.scss' } /* '@if' */,
				{ startIndex: 64, type: '' },
				{
					startIndex: 65,
					type: 'delimiter.parenthesis.scss'
				} /* '(' */,
				{ startIndex: 66, type: 'meta.scss' } /* 'unit(' */,
				{ startIndex: 71, type: 'variable.ref.scss' } /* '$a' */,
				{ startIndex: 73, type: 'meta.scss' } /* ')' */,
				{ startIndex: 74, type: '' },
				{ startIndex: 75, type: 'operator.scss' } /* '==' */,
				{ startIndex: 77, type: '' },
				{ startIndex: 78, type: 'string.delimiter.scss' } /* '"' */,
				{ startIndex: 79, type: 'string.scss' } /* '%' */,
				{ startIndex: 80, type: 'string.delimiter.scss' } /* '"' */,
				{
					startIndex: 81,
					type: 'delimiter.parenthesis.scss'
				} /* ')' */,
				{ startIndex: 82, type: '' },
				{ startIndex: 83, type: 'operator.scss' } /* 'and' */,
				{ startIndex: 86, type: '' },
				{
					startIndex: 87,
					type: 'delimiter.parenthesis.scss'
				} /* '(' */,
				{ startIndex: 88, type: 'variable.ref.scss' } /* '$i' */,
				{ startIndex: 90, type: '' },
				{ startIndex: 91, type: 'operator.scss' } /* '==' */,
				{ startIndex: 93, type: '' },
				{
					startIndex: 94,
					type: 'delimiter.parenthesis.scss'
				} /* '(' */,
				{ startIndex: 95, type: 'variable.ref.scss' } /* '$total' */,
				{ startIndex: 101, type: '' },
				{ startIndex: 102, type: 'operator.scss' } /* '-' */,
				{ startIndex: 103, type: '' },
				{ startIndex: 104, type: 'number.scss' } /* '1' */,
				{
					startIndex: 105,
					type: 'delimiter.parenthesis.scss'
				} /* ')' */,
				{ startIndex: 107, type: '' },
				{ startIndex: 108, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 109, type: '' },
				{ startIndex: 116, type: 'variable.decl.scss' } /* '$z:' */,
				{ startIndex: 119, type: '' },
				{ startIndex: 120, type: 'number.scss' } /* '100%' */,
				{ startIndex: 124, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 125, type: '' },
				{ startIndex: 132, type: 'keyword.scss' } /* '@return' */,
				{ startIndex: 139, type: '' },
				{ startIndex: 140, type: 'string.delimiter.scss' } /* ''' */,
				{ startIndex: 141, type: 'string.scss' } /* '1' */,
				{ startIndex: 142, type: 'string.delimiter.scss' } /* ''' */,
				{ startIndex: 143, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 144, type: '' },
				{ startIndex: 149, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 150, type: '' },
				{ startIndex: 153, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 154, type: '' },
				{ startIndex: 157, type: 'keyword.scss' } /* '@return' */,
				{ startIndex: 164, type: '' },
				{ startIndex: 165, type: 'variable.ref.scss' } /* '$grid' */,
				{ startIndex: 170, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 171, type: '' },
				{ startIndex: 172, type: 'delimiter.curly.scss' } /* '}' */
			]
		}
	],

	// @mixin simplewhitespaces
	[
		{
			line:
				'@mixin large-text {\n' +
				'  font: {\n' +
				'    family: Arial;\n' +
				'    size: 20px;\n' +
				'    weight: bold;\n' +
				'  }\n' +
				'  color: #ff0000;\n' +
				'}\n' +
				'.page-title {\n' +
				'  @include large-text;\n' +
				'  padding: 4px;\n' +
				'}',
			tokens: [
				{ startIndex: 0, type: 'keyword.scss' } /* '@mixin' */,
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'meta.scss' } /* 'large-text' */,
				{ startIndex: 17, type: '' },
				{ startIndex: 18, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 19, type: '' },
				{ startIndex: 22, type: 'attribute.name.scss' } /* 'font:' */,
				{ startIndex: 27, type: '' },
				{ startIndex: 28, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 29, type: '' },
				{ startIndex: 34, type: 'attribute.name.scss' } /* 'family:' */,
				{ startIndex: 41, type: '' },
				{ startIndex: 42, type: 'attribute.value.scss' } /* 'Arial' */,
				{ startIndex: 47, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 48, type: '' },
				{ startIndex: 53, type: 'attribute.name.scss' } /* 'size:' */,
				{ startIndex: 58, type: '' },
				{ startIndex: 59, type: 'number.scss' } /* '20px' */,
				{ startIndex: 63, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 64, type: '' },
				{ startIndex: 69, type: 'attribute.name.scss' } /* 'weight:' */,
				{ startIndex: 76, type: '' },
				{ startIndex: 77, type: 'attribute.value.scss' } /* 'bold' */,
				{ startIndex: 81, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 82, type: '' },
				{ startIndex: 85, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 86, type: '' },
				{ startIndex: 89, type: 'attribute.name.scss' } /* 'color:' */,
				{ startIndex: 95, type: '' },
				{ startIndex: 96, type: 'number.hex.scss' } /* '#ff0000' */,
				{ startIndex: 103, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 104, type: '' },
				{ startIndex: 105, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 106, type: '' },
				{ startIndex: 107, type: 'tag.scss' } /* '.page-title' */,
				{ startIndex: 118, type: '' },
				{ startIndex: 119, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 120, type: '' },
				{ startIndex: 123, type: 'keyword.scss' } /* '@include' */,
				{ startIndex: 131, type: '' },
				{ startIndex: 132, type: 'meta.scss' } /* 'large-text' */,
				{ startIndex: 142, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 143, type: '' },
				{
					startIndex: 146,
					type: 'attribute.name.scss'
				} /* 'padding:' */,
				{ startIndex: 154, type: '' },
				{ startIndex: 155, type: 'number.scss' } /* '4px' */,
				{ startIndex: 158, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 159, type: '' },
				{ startIndex: 160, type: 'delimiter.curly.scss' } /* '}' */
			]
		}
	],

	// @mixin with parameterswhitespaces
	[
		{
			line:
				'@mixin sexy-border($color, $width: 1in) {\n' +
				'  border: {\n' +
				'    color: $color;\n' +
				'    width: $width;\n' +
				'    style: dashed;\n' +
				'  }\n' +
				'}\n' +
				'p { @include sexy-border(blue); }',
			tokens: [
				{ startIndex: 0, type: 'keyword.scss' } /* '@mixin' */,
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'meta.scss' } /* 'sexy-border(' */,
				{ startIndex: 19, type: 'variable.ref.scss' } /* '$color' */,
				{ startIndex: 25, type: 'delimiter.scss' } /* ',' */,
				{ startIndex: 26, type: '' },
				{ startIndex: 27, type: 'variable.decl.scss' } /* '$width:' */,
				{ startIndex: 34, type: '' },
				{ startIndex: 35, type: 'number.scss' } /* '1in' */,
				{ startIndex: 38, type: 'meta.scss' } /* ')' */,
				{ startIndex: 39, type: '' },
				{ startIndex: 40, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 41, type: '' },
				{ startIndex: 44, type: 'attribute.name.scss' } /* 'border:' */,
				{ startIndex: 51, type: '' },
				{ startIndex: 52, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 53, type: '' },
				{ startIndex: 58, type: 'attribute.name.scss' } /* 'color:' */,
				{ startIndex: 64, type: '' },
				{ startIndex: 65, type: 'variable.ref.scss' } /* '$color' */,
				{ startIndex: 71, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 72, type: '' },
				{ startIndex: 77, type: 'attribute.name.scss' } /* 'width:' */,
				{ startIndex: 83, type: '' },
				{ startIndex: 84, type: 'variable.ref.scss' } /* '$width' */,
				{ startIndex: 90, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 91, type: '' },
				{ startIndex: 96, type: 'attribute.name.scss' } /* 'style:' */,
				{ startIndex: 102, type: '' },
				{
					startIndex: 103,
					type: 'attribute.value.scss'
				} /* 'dashed' */,
				{ startIndex: 109, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 110, type: '' },
				{ startIndex: 113, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 114, type: '' },
				{ startIndex: 115, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 116, type: '' },
				{ startIndex: 117, type: 'tag.scss' } /* 'p' */,
				{ startIndex: 118, type: '' },
				{ startIndex: 119, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 120, type: '' },
				{ startIndex: 121, type: 'keyword.scss' } /* '@include' */,
				{ startIndex: 129, type: '' },
				{ startIndex: 130, type: 'meta.scss' } /* 'sexy-border(' */,
				{ startIndex: 142, type: 'attribute.value.scss' } /* 'blue' */,
				{ startIndex: 146, type: 'meta.scss' } /* ')' */,
				{ startIndex: 147, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 148, type: '' },
				{ startIndex: 149, type: 'delimiter.curly.scss' } /* '}' */
			]
		}
	],

	// @mixin with varargswhitespaces
	[
		{
			line:
				'@mixin box-shadow($shadows...) {\n' +
				'  -moz-box-shadow: $shadows;\n' +
				'  -webkit-box-shadow: $shadows;\n' +
				'  box-shadow: $shadows;\n' +
				'}\n' +
				'.shadows {\n' +
				'  @include box-shadow(0px 4px 5px #666, 2px 6px 10px #999);\n' +
				'}',
			tokens: [
				{ startIndex: 0, type: 'keyword.scss' } /* '@mixin' */,
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'meta.scss' } /* 'box-shadow(' */,
				{ startIndex: 18, type: 'variable.ref.scss' } /* '$shadows' */,
				{ startIndex: 26, type: 'operator.scss' } /* '...' */,
				{ startIndex: 29, type: 'meta.scss' } /* ')' */,
				{ startIndex: 30, type: '' },
				{ startIndex: 31, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 32, type: '' },
				{
					startIndex: 35,
					type: 'attribute.name.scss'
				} /* '-moz-box-shadow:' */,
				{ startIndex: 51, type: '' },
				{ startIndex: 52, type: 'variable.ref.scss' } /* '$shadows' */,
				{ startIndex: 60, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 61, type: '' },
				{
					startIndex: 64,
					type: 'attribute.name.scss'
				} /* '-webkit-box-shadow:' */,
				{ startIndex: 83, type: '' },
				{ startIndex: 84, type: 'variable.ref.scss' } /* '$shadows' */,
				{ startIndex: 92, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 93, type: '' },
				{
					startIndex: 96,
					type: 'attribute.name.scss'
				} /* 'box-shadow:' */,
				{ startIndex: 107, type: '' },
				{ startIndex: 108, type: 'variable.ref.scss' } /* '$shadows' */,
				{ startIndex: 116, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 117, type: '' },
				{ startIndex: 118, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 119, type: '' },
				{ startIndex: 120, type: 'tag.scss' } /* '.shadows' */,
				{ startIndex: 128, type: '' },
				{ startIndex: 129, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 130, type: '' },
				{ startIndex: 133, type: 'keyword.scss' } /* '@include' */,
				{ startIndex: 141, type: '' },
				{ startIndex: 142, type: 'meta.scss' } /* 'box-shadow(' */,
				{ startIndex: 153, type: 'number.scss' } /* '0px' */,
				{ startIndex: 156, type: '' },
				{ startIndex: 157, type: 'number.scss' } /* '4px' */,
				{ startIndex: 160, type: '' },
				{ startIndex: 161, type: 'number.scss' } /* '5px' */,
				{ startIndex: 164, type: '' },
				{ startIndex: 165, type: 'number.hex.scss' } /* '#666' */,
				{ startIndex: 169, type: 'delimiter.scss' } /* ',' */,
				{ startIndex: 170, type: '' },
				{ startIndex: 171, type: 'number.scss' } /* '2px' */,
				{ startIndex: 174, type: '' },
				{ startIndex: 175, type: 'number.scss' } /* '6px' */,
				{ startIndex: 178, type: '' },
				{ startIndex: 179, type: 'number.scss' } /* '10px' */,
				{ startIndex: 183, type: '' },
				{ startIndex: 184, type: 'number.hex.scss' } /* '#999' */,
				{ startIndex: 188, type: 'meta.scss' } /* ')' */,
				{ startIndex: 189, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 190, type: '' },
				{ startIndex: 191, type: 'delimiter.curly.scss' } /* '}' */
			]
		}
	],

	// @include with varargswhitespaces
	[
		{
			line:
				'@mixin colors($text, $background, $border) {\n' +
				'  color: $text;\n' +
				'  background-color: $background;\n' +
				'  border-color: $border;\n' +
				'}\n' +
				'$values: #ff0000, #00ff00, #0000ff;\n' +
				'.primary {\n' +
				'  @include colors($values...);\n' +
				'}',
			tokens: [
				{ startIndex: 0, type: 'keyword.scss' } /* '@mixin' */,
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'meta.scss' } /* 'colors(' */,
				{ startIndex: 14, type: 'variable.ref.scss' } /* '$text' */,
				{ startIndex: 19, type: 'delimiter.scss' } /* ',' */,
				{ startIndex: 20, type: '' },
				{
					startIndex: 21,
					type: 'variable.ref.scss'
				} /* '$background' */,
				{ startIndex: 32, type: 'delimiter.scss' } /* ',' */,
				{ startIndex: 33, type: '' },
				{ startIndex: 34, type: 'variable.ref.scss' } /* '$border' */,
				{ startIndex: 41, type: 'meta.scss' } /* ')' */,
				{ startIndex: 42, type: '' },
				{ startIndex: 43, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 44, type: '' },
				{ startIndex: 47, type: 'attribute.name.scss' } /* 'color:' */,
				{ startIndex: 53, type: '' },
				{ startIndex: 54, type: 'variable.ref.scss' } /* '$text' */,
				{ startIndex: 59, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 60, type: '' },
				{
					startIndex: 63,
					type: 'attribute.name.scss'
				} /* 'background-color:' */,
				{ startIndex: 80, type: '' },
				{
					startIndex: 81,
					type: 'variable.ref.scss'
				} /* '$background' */,
				{ startIndex: 92, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 93, type: '' },
				{
					startIndex: 96,
					type: 'attribute.name.scss'
				} /* 'border-color:' */,
				{ startIndex: 109, type: '' },
				{ startIndex: 110, type: 'variable.ref.scss' } /* '$border' */,
				{ startIndex: 117, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 118, type: '' },
				{ startIndex: 119, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 120, type: '' },
				{
					startIndex: 121,
					type: 'variable.decl.scss'
				} /* '$values:' */,
				{ startIndex: 129, type: '' },
				{ startIndex: 130, type: 'number.hex.scss' } /* '#ff0000' */,
				{ startIndex: 137, type: 'operator.scss' } /* ',' */,
				{ startIndex: 138, type: '' },
				{ startIndex: 139, type: 'number.hex.scss' } /* '#00ff00' */,
				{ startIndex: 146, type: 'operator.scss' } /* ',' */,
				{ startIndex: 147, type: '' },
				{ startIndex: 148, type: 'number.hex.scss' } /* '#0000ff' */,
				{ startIndex: 155, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 156, type: '' },
				{ startIndex: 157, type: 'tag.scss' } /* '.primary' */,
				{ startIndex: 165, type: '' },
				{ startIndex: 166, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 167, type: '' },
				{ startIndex: 170, type: 'keyword.scss' } /* '@include' */,
				{ startIndex: 178, type: '' },
				{ startIndex: 179, type: 'meta.scss' } /* 'colors(' */,
				{ startIndex: 186, type: 'variable.ref.scss' } /* '$values' */,
				{ startIndex: 193, type: 'operator.scss' } /* '...' */,
				{ startIndex: 196, type: 'meta.scss' } /* ')' */,
				{ startIndex: 197, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 198, type: '' },
				{ startIndex: 199, type: 'delimiter.curly.scss' } /* '}' */
			]
		}
	],
	// @include with bodywhitespaces
	[
		{
			line:
				'@mixin apply-to-ie6-only {\n' +
				'  * html {\n' +
				'    @content;\n' +
				'  }\n' +
				'}\n' +
				'@include apply-to-ie6-only {\n' +
				'  #logo {\n' +
				'    background-image: url(/logo.gif);\n' +
				'  }\n' +
				'}',
			tokens: [
				{ startIndex: 0, type: 'keyword.scss' } /* '@mixin' */,
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'meta.scss' } /* 'apply-to-ie6-only' */,
				{ startIndex: 24, type: '' },
				{ startIndex: 25, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 26, type: '' },
				{ startIndex: 29, type: 'tag.scss' } /* '*' */,
				{ startIndex: 30, type: '' },
				{ startIndex: 31, type: 'tag.scss' } /* 'html' */,
				{ startIndex: 35, type: '' },
				{ startIndex: 36, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 37, type: '' },
				{ startIndex: 42, type: 'keyword.scss' } /* '@content' */,
				{ startIndex: 50, type: '' },
				{ startIndex: 54, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 55, type: '' },
				{ startIndex: 56, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 57, type: '' },
				{ startIndex: 58, type: 'keyword.scss' } /* '@include' */,
				{ startIndex: 66, type: '' },
				{ startIndex: 67, type: 'meta.scss' } /* 'apply-to-ie6-only' */,
				{ startIndex: 84, type: '' },
				{ startIndex: 85, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 86, type: '' },
				{ startIndex: 89, type: 'tag.scss' } /* '#logo' */,
				{ startIndex: 94, type: '' },
				{ startIndex: 95, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 96, type: '' },
				{
					startIndex: 101,
					type: 'attribute.name.scss'
				} /* 'background-image:' */,
				{ startIndex: 118, type: '' },
				{ startIndex: 119, type: 'meta.scss' } /* 'url(' */,
				{ startIndex: 123, type: 'string.scss' } /* '/logo.gif' */,
				{ startIndex: 132, type: 'meta.scss' } /* ')' */,
				{ startIndex: 133, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 134, type: '' },
				{ startIndex: 137, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 138, type: '' },
				{ startIndex: 139, type: 'delimiter.curly.scss' } /* '}' */
			]
		}
	],

	// CSS charsetwhitespaces
	[
		{
			line: '@charset "UTF-8";',
			tokens: [
				{ startIndex: 0, type: 'keyword.scss' } /* '@charset' */,
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'string.delimiter.scss' } /* '"' */,
				{ startIndex: 10, type: 'string.scss' } /* 'UTF-8' */,
				{ startIndex: 15, type: 'string.delimiter.scss' } /* '"' */,
				{ startIndex: 16, type: 'delimiter.scss' } /* ';' */
			]
		}
	],

	// CSS attributeswhitespaces
	[
		{
			line: '[rel="external"]::after {\n' + "    content: 's';\n" + '}',
			tokens: [
				{ startIndex: 0, type: 'delimiter.bracket.scss' } /* '[' */,
				{ startIndex: 1, type: 'attribute.value.scss' } /* 'rel' */,
				{ startIndex: 4, type: 'operator.scss' } /* '=' */,
				{ startIndex: 5, type: 'string.delimiter.scss' } /* '"' */,
				{ startIndex: 6, type: 'string.scss' } /* 'external' */,
				{ startIndex: 14, type: 'string.delimiter.scss' } /* '"' */,
				{ startIndex: 15, type: 'delimiter.bracket.scss' } /* ']' */,
				{ startIndex: 16, type: 'tag.scss' } /* '::after' */,
				{ startIndex: 23, type: '' },
				{ startIndex: 24, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 25, type: '' },
				{
					startIndex: 30,
					type: 'attribute.name.scss'
				} /* 'content:' */,
				{ startIndex: 38, type: '' },
				{ startIndex: 39, type: 'string.delimiter.scss' } /* ''' */,
				{ startIndex: 40, type: 'string.scss' } /* 's' */,
				{ startIndex: 41, type: 'string.delimiter.scss' } /* ''' */,
				{ startIndex: 42, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 43, type: '' },
				{ startIndex: 44, type: 'delimiter.curly.scss' } /* '}' */
			]
		}
	],

	// CSS @pagewhitespaces
	[
		{
			line: '@page :left {\n' + '  margin-left: 4cm;\n' + '  margin-right: 3cm;\n' + '}',
			tokens: [
				{ startIndex: 0, type: 'keyword.scss' } /* '@page' */,
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'tag.scss' } /* ':left' */,
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 13, type: '' },
				{
					startIndex: 16,
					type: 'attribute.name.scss'
				} /* 'margin-left:' */,
				{ startIndex: 28, type: '' },
				{ startIndex: 29, type: 'number.scss' } /* '4cm' */,
				{ startIndex: 32, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 33, type: '' },
				{
					startIndex: 36,
					type: 'attribute.name.scss'
				} /* 'margin-right:' */,
				{ startIndex: 49, type: '' },
				{ startIndex: 50, type: 'number.scss' } /* '3cm' */,
				{ startIndex: 53, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 54, type: '' },
				{ startIndex: 55, type: 'delimiter.curly.scss' } /* '}' */
			]
		}
	],

	// Extend with interpolation variablewhitespaces
	[
		{
			line:
				'@mixin error($a: false) {\n' +
				'  @extend .#{$a};\n' +
				'  @extend ##{$a};\n' +
				'}\n' +
				'#bar {a: 1px;}\n' +
				'.bar {b: 1px;}\n' +
				'foo {\n' +
				"  @include error('bar');   \n" +
				'}',
			tokens: [
				{ startIndex: 0, type: 'keyword.scss' } /* '@mixin' */,
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'meta.scss' } /* 'error(' */,
				{ startIndex: 13, type: 'variable.decl.scss' } /* '$a:' */,
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'attribute.value.scss' } /* 'false' */,
				{ startIndex: 22, type: 'meta.scss' } /* ')' */,
				{ startIndex: 23, type: '' },
				{ startIndex: 24, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 25, type: '' },
				{ startIndex: 28, type: 'keyword.scss' } /* '@extend' */,
				{ startIndex: 35, type: '' },
				{ startIndex: 36, type: 'tag.scss' } /* '.' */,
				{ startIndex: 37, type: 'meta.scss' } /* '#{' */,
				{ startIndex: 39, type: 'variable.ref.scss' } /* '$a' */,
				{ startIndex: 41, type: 'meta.scss' } /* '}' */,
				{ startIndex: 42, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 43, type: '' },
				{ startIndex: 46, type: 'keyword.scss' } /* '@extend' */,
				{ startIndex: 53, type: '' },
				{ startIndex: 54, type: 'tag.scss' } /* '#' */,
				{ startIndex: 55, type: 'meta.scss' } /* '#{' */,
				{ startIndex: 57, type: 'variable.ref.scss' } /* '$a' */,
				{ startIndex: 59, type: 'meta.scss' } /* '}' */,
				{ startIndex: 60, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 61, type: '' },
				{ startIndex: 62, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 63, type: '' },
				{ startIndex: 64, type: 'tag.scss' } /* '#bar' */,
				{ startIndex: 68, type: '' },
				{ startIndex: 69, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 70, type: 'attribute.name.scss' } /* 'a:' */,
				{ startIndex: 72, type: '' },
				{ startIndex: 73, type: 'number.scss' } /* '1px' */,
				{ startIndex: 76, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 77, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 78, type: '' },
				{ startIndex: 79, type: 'tag.scss' } /* '.bar' */,
				{ startIndex: 83, type: '' },
				{ startIndex: 84, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 85, type: 'attribute.name.scss' } /* 'b:' */,
				{ startIndex: 87, type: '' },
				{ startIndex: 88, type: 'number.scss' } /* '1px' */,
				{ startIndex: 91, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 92, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 93, type: '' },
				{ startIndex: 94, type: 'tag.scss' } /* 'foo' */,
				{ startIndex: 97, type: '' },
				{ startIndex: 98, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 99, type: '' },
				{ startIndex: 102, type: 'keyword.scss' } /* '@include' */,
				{ startIndex: 110, type: '' },
				{ startIndex: 111, type: 'meta.scss' } /* 'error(' */,
				{ startIndex: 117, type: 'string.delimiter.scss' } /* ''' */,
				{ startIndex: 118, type: 'string.scss' } /* 'bar' */,
				{ startIndex: 121, type: 'string.delimiter.scss' } /* ''' */,
				{ startIndex: 122, type: 'meta.scss' } /* ')' */,
				{ startIndex: 123, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 124, type: '' },
				{ startIndex: 128, type: 'delimiter.curly.scss' } /* '}' */
			]
		}
	],

	// @font-facewhitespaces
	[
		{
			line: "@font-face { font-family: Delicious; src: url('Delicious-Roman.otf'); } ",
			tokens: [
				{ startIndex: 0, type: 'keyword.scss' } /* '@font-face' */,
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 12, type: '' },
				{
					startIndex: 13,
					type: 'attribute.name.scss'
				} /* 'font-family:' */,
				{ startIndex: 25, type: '' },
				{
					startIndex: 26,
					type: 'attribute.value.scss'
				} /* 'Delicious' */,
				{ startIndex: 35, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 36, type: '' },
				{ startIndex: 37, type: 'attribute.name.scss' } /* 'src:' */,
				{ startIndex: 41, type: '' },
				{ startIndex: 42, type: 'meta.scss' } /* 'url(' */,
				{ startIndex: 46, type: 'string.delimiter.scss' } /* ''' */,
				{
					startIndex: 47,
					type: 'string.scss'
				} /* 'Delicious-Roman.otf' */,
				{ startIndex: 66, type: 'string.delimiter.scss' } /* ''' */,
				{ startIndex: 67, type: 'meta.scss' } /* ')' */,
				{ startIndex: 68, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 69, type: '' },
				{ startIndex: 70, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 71, type: '' }
			]
		}
	],

	// Keyframeswhitespaces
	[
		{
			line:
				'@-webkit-keyframes NAME-YOUR-ANIMATION {\n' +
				'  0%   { opacity: 0; }\n' +
				'  100% { opacity: 1; }\n' +
				'}\n' +
				'@-moz-keyframes NAME-YOUR-ANIMATION {\n' +
				'  0%   { opacity: 0; }\n' +
				'  100% { opacity: 1; }\n' +
				'}\n' +
				'@-o-keyframes NAME-YOUR-ANIMATION {\n' +
				'  0%   { opacity: 0; }\n' +
				'  100% { opacity: 1; }\n' +
				'}\n' +
				'@keyframes NAME-YOUR-ANIMATION {\n' +
				'  0%   { opacity: 0; }\n' +
				'  100% { opacity: 1; }\n' +
				'}',
			tokens: [
				{
					startIndex: 0,
					type: 'keyword.scss'
				} /* '@-webkit-keyframes' */,
				{ startIndex: 18, type: '' },
				{
					startIndex: 19,
					type: 'meta.scss'
				} /* 'NAME-YOUR-ANIMATION' */,
				{ startIndex: 38, type: '' },
				{ startIndex: 39, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 40, type: '' },
				{ startIndex: 43, type: 'number.scss' } /* '0%' */,
				{ startIndex: 45, type: '' },
				{ startIndex: 48, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 49, type: '' },
				{
					startIndex: 50,
					type: 'attribute.name.scss'
				} /* 'opacity:' */,
				{ startIndex: 58, type: '' },
				{ startIndex: 59, type: 'number.scss' } /* '0' */,
				{ startIndex: 60, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 61, type: '' },
				{ startIndex: 62, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 63, type: '' },
				{ startIndex: 66, type: 'number.scss' } /* '100%' */,
				{ startIndex: 70, type: '' },
				{ startIndex: 71, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 72, type: '' },
				{
					startIndex: 73,
					type: 'attribute.name.scss'
				} /* 'opacity:' */,
				{ startIndex: 81, type: '' },
				{ startIndex: 82, type: 'number.scss' } /* '1' */,
				{ startIndex: 83, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 84, type: '' },
				{ startIndex: 85, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 86, type: '' },
				{ startIndex: 87, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 88, type: '' },
				{
					startIndex: 89,
					type: 'keyword.scss'
				} /* '@-moz-keyframes' */,
				{ startIndex: 104, type: '' },
				{
					startIndex: 105,
					type: 'meta.scss'
				} /* 'NAME-YOUR-ANIMATION' */,
				{ startIndex: 124, type: '' },
				{ startIndex: 125, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 126, type: '' },
				{ startIndex: 129, type: 'number.scss' } /* '0%' */,
				{ startIndex: 131, type: '' },
				{ startIndex: 134, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 135, type: '' },
				{
					startIndex: 136,
					type: 'attribute.name.scss'
				} /* 'opacity:' */,
				{ startIndex: 144, type: '' },
				{ startIndex: 145, type: 'number.scss' } /* '0' */,
				{ startIndex: 146, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 147, type: '' },
				{ startIndex: 148, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 149, type: '' },
				{ startIndex: 152, type: 'number.scss' } /* '100%' */,
				{ startIndex: 156, type: '' },
				{ startIndex: 157, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 158, type: '' },
				{
					startIndex: 159,
					type: 'attribute.name.scss'
				} /* 'opacity:' */,
				{ startIndex: 167, type: '' },
				{ startIndex: 168, type: 'number.scss' } /* '1' */,
				{ startIndex: 169, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 170, type: '' },
				{ startIndex: 171, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 172, type: '' },
				{ startIndex: 173, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 174, type: '' },
				{ startIndex: 175, type: 'keyword.scss' } /* '@-o-keyframes' */,
				{ startIndex: 188, type: '' },
				{
					startIndex: 189,
					type: 'meta.scss'
				} /* 'NAME-YOUR-ANIMATION' */,
				{ startIndex: 208, type: '' },
				{ startIndex: 209, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 210, type: '' },
				{ startIndex: 213, type: 'number.scss' } /* '0%' */,
				{ startIndex: 215, type: '' },
				{ startIndex: 218, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 219, type: '' },
				{
					startIndex: 220,
					type: 'attribute.name.scss'
				} /* 'opacity:' */,
				{ startIndex: 228, type: '' },
				{ startIndex: 229, type: 'number.scss' } /* '0' */,
				{ startIndex: 230, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 231, type: '' },
				{ startIndex: 232, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 233, type: '' },
				{ startIndex: 236, type: 'number.scss' } /* '100%' */,
				{ startIndex: 240, type: '' },
				{ startIndex: 241, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 242, type: '' },
				{
					startIndex: 243,
					type: 'attribute.name.scss'
				} /* 'opacity:' */,
				{ startIndex: 251, type: '' },
				{ startIndex: 252, type: 'number.scss' } /* '1' */,
				{ startIndex: 253, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 254, type: '' },
				{ startIndex: 255, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 256, type: '' },
				{ startIndex: 257, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 258, type: '' },
				{ startIndex: 259, type: 'keyword.scss' } /* '@keyframes' */,
				{ startIndex: 269, type: '' },
				{
					startIndex: 270,
					type: 'meta.scss'
				} /* 'NAME-YOUR-ANIMATION' */,
				{ startIndex: 289, type: '' },
				{ startIndex: 290, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 291, type: '' },
				{ startIndex: 294, type: 'number.scss' } /* '0%' */,
				{ startIndex: 296, type: '' },
				{ startIndex: 299, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 300, type: '' },
				{
					startIndex: 301,
					type: 'attribute.name.scss'
				} /* 'opacity:' */,
				{ startIndex: 309, type: '' },
				{ startIndex: 310, type: 'number.scss' } /* '0' */,
				{ startIndex: 311, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 312, type: '' },
				{ startIndex: 313, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 314, type: '' },
				{ startIndex: 317, type: 'number.scss' } /* '100%' */,
				{ startIndex: 321, type: '' },
				{ startIndex: 322, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 323, type: '' },
				{
					startIndex: 324,
					type: 'attribute.name.scss'
				} /* 'opacity:' */,
				{ startIndex: 332, type: '' },
				{ startIndex: 333, type: 'number.scss' } /* '1' */,
				{ startIndex: 334, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 335, type: '' },
				{ startIndex: 336, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 337, type: '' },
				{ startIndex: 338, type: 'delimiter.curly.scss' } /* '}' */
			]
		}
	],

	// String escapingwhitespaces
	[
		{
			line:
				"[data-icon='test-1']:before {\n" +
				"  content:'\\\\';\n" +
				'}\n' +
				'/* a comment */\n' +
				"$var1: '\\'';\n" +
				'$var2: "\\"";\n' +
				'/* another comment */',
			tokens: [
				{ startIndex: 0, type: 'delimiter.bracket.scss' } /* '[' */,
				{
					startIndex: 1,
					type: 'attribute.value.scss'
				} /* 'data-icon' */,
				{ startIndex: 10, type: 'operator.scss' } /* '=' */,
				{ startIndex: 11, type: 'string.delimiter.scss' } /* ''' */,
				{ startIndex: 12, type: 'string.scss' } /* 'test-1' */,
				{ startIndex: 18, type: 'string.delimiter.scss' } /* ''' */,
				{ startIndex: 19, type: 'delimiter.bracket.scss' } /* ']' */,
				{ startIndex: 20, type: 'tag.scss' } /* ':before' */,
				{ startIndex: 27, type: '' },
				{ startIndex: 28, type: 'delimiter.curly.scss' } /* '{' */,
				{ startIndex: 29, type: '' },
				{
					startIndex: 32,
					type: 'attribute.name.scss'
				} /* 'content:' */,
				{ startIndex: 40, type: 'string.delimiter.scss' } /* ''' */,
				{ startIndex: 41, type: 'string.scss' } /* '\\' */,
				{ startIndex: 43, type: 'string.delimiter.scss' } /* ''' */,
				{ startIndex: 44, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 45, type: '' },
				{ startIndex: 46, type: 'delimiter.curly.scss' } /* '}' */,
				{ startIndex: 47, type: '' },
				{
					startIndex: 48,
					type: 'comment.scss'
				} /* '/* a comment * /' */,
				{ startIndex: 63, type: '' },
				{ startIndex: 64, type: 'variable.decl.scss' } /* '$var1:' */,
				{ startIndex: 70, type: '' },
				{ startIndex: 71, type: 'string.delimiter.scss' } /* ''' */,
				{ startIndex: 72, type: 'string.scss' } /* '\'' */,
				{ startIndex: 74, type: 'string.delimiter.scss' } /* ''' */,
				{ startIndex: 75, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 76, type: '' },
				{ startIndex: 77, type: 'variable.decl.scss' } /* '$var2:' */,
				{ startIndex: 83, type: '' },
				{ startIndex: 84, type: 'string.delimiter.scss' } /* '"' */,
				{ startIndex: 85, type: 'string.scss' } /* '\"' */,
				{ startIndex: 87, type: 'string.delimiter.scss' } /* '"' */,
				{ startIndex: 88, type: 'delimiter.scss' } /* ';' */,
				{ startIndex: 89, type: '' },
				{
					startIndex: 90,
					type: 'comment.scss'
				} /* '/* another comment * /' */
			]
		}
	]
]);
