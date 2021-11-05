/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

/**
 * HTML Tests
 */
testTokenization(
	['twig', 'css', 'javascript'],
	[
		// Open Start Tag #1'
		[
			{
				line: '<abc',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' }
				]
			}
		],

		// Open Start Tag #2
		[
			{
				line: '<input',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' }
				]
			}
		],

		// Open Start Tag with Invalid Tag
		[
			{
				line: '< abc',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: '' }
				]
			}
		],

		// Open Start Tag #3
		[
			{
				line: '< abc>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: '' }
				]
			}
		],

		// Open Start Tag #4
		[
			{
				line: 'i <len;',
				tokens: [
					{ startIndex: 0, type: '' },
					{ startIndex: 2, type: 'delimiter.html' },
					{ startIndex: 3, type: 'tag.html' },
					{ startIndex: 6, type: '' }
				]
			}
		],

		// Open Start Tag #5
		[
			{
				line: '<',
				tokens: [{ startIndex: 0, type: 'delimiter.html' }]
			}
		],

		// Open End Tag
		[
			{
				line: '</a',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 2, type: 'tag.html' }
				]
			}
		],

		// Complete Start Tag
		[
			{
				line: '<abc>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 4, type: 'delimiter.html' }
				]
			}
		],

		// Complete Start Tag with Whitespace
		[
			{
				line: '<abc >',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 4, type: '' },
					{ startIndex: 5, type: 'delimiter.html' }
				]
			}
		],

		// bug 9809 - Complete Start Tag with Namespaceprefix
		[
			{
				line: '<foo:bar>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 8, type: 'delimiter.html' }
				]
			}
		],

		// Complete End Tag
		[
			{
				line: '</abc>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 2, type: 'tag.html' },
					{ startIndex: 5, type: 'delimiter.html' }
				]
			}
		],

		// Complete End Tag with Whitespace
		[
			{
				line: '</abc  >',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 2, type: 'tag.html' },
					{ startIndex: 5, type: '' },
					{ startIndex: 7, type: 'delimiter.html' }
				]
			}
		],

		// Empty Tag
		[
			{
				line: '<abc />',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 4, type: '' },
					{ startIndex: 5, type: 'delimiter.html' }
				]
			}
		],

		// Embedded Content #1
		[
			{
				line: '<script type="text/javascript">var i= 10;</script>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 7, type: '' },
					{ startIndex: 8, type: 'attribute.name.html' },
					{ startIndex: 12, type: 'delimiter.html' },
					{ startIndex: 13, type: 'attribute.value.html' },
					{ startIndex: 30, type: 'delimiter.html' },
					{ startIndex: 31, type: 'keyword.js' },
					{ startIndex: 34, type: '' },
					{ startIndex: 35, type: 'identifier.js' },
					{ startIndex: 36, type: 'delimiter.js' },
					{ startIndex: 37, type: '' },
					{ startIndex: 38, type: 'number.js' },
					{ startIndex: 40, type: 'delimiter.js' },
					{ startIndex: 41, type: 'delimiter.html' },
					{ startIndex: 43, type: 'tag.html' },
					{ startIndex: 49, type: 'delimiter.html' }
				]
			}
		],

		// Embedded Content #2
		[
			{
				line: '<script type="text/javascript">',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 7, type: '' },
					{ startIndex: 8, type: 'attribute.name.html' },
					{ startIndex: 12, type: 'delimiter.html' },
					{ startIndex: 13, type: 'attribute.value.html' },
					{ startIndex: 30, type: 'delimiter.html' }
				]
			},
			{
				line: 'var i= 10;',
				tokens: [
					{ startIndex: 0, type: 'keyword.js' },
					{ startIndex: 3, type: '' },
					{ startIndex: 4, type: 'identifier.js' },
					{ startIndex: 5, type: 'delimiter.js' },
					{ startIndex: 6, type: '' },
					{ startIndex: 7, type: 'number.js' },
					{ startIndex: 9, type: 'delimiter.js' }
				]
			},
			{
				line: '</script>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 2, type: 'tag.html' },
					{ startIndex: 8, type: 'delimiter.html' }
				]
			}
		],

		// Embedded Content #3
		[
			{
				line: '<script type="text/javascript">var i= 10;',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 7, type: '' },
					{ startIndex: 8, type: 'attribute.name.html' },
					{ startIndex: 12, type: 'delimiter.html' },
					{ startIndex: 13, type: 'attribute.value.html' },
					{ startIndex: 30, type: 'delimiter.html' },
					{ startIndex: 31, type: 'keyword.js' },
					{ startIndex: 34, type: '' },
					{ startIndex: 35, type: 'identifier.js' },
					{ startIndex: 36, type: 'delimiter.js' },
					{ startIndex: 37, type: '' },
					{ startIndex: 38, type: 'number.js' },
					{ startIndex: 40, type: 'delimiter.js' }
				]
			},
			{
				line: '</script>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 2, type: 'tag.html' },
					{ startIndex: 8, type: 'delimiter.html' }
				]
			}
		],

		// Embedded Content #4
		[
			{
				line: '<script type="text/javascript">',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 7, type: '' },
					{ startIndex: 8, type: 'attribute.name.html' },
					{ startIndex: 12, type: 'delimiter.html' },
					{ startIndex: 13, type: 'attribute.value.html' },
					{ startIndex: 30, type: 'delimiter.html' }
				]
			},
			{
				line: 'var i= 10;</script>',
				tokens: [
					{ startIndex: 0, type: 'keyword.js' },
					{ startIndex: 3, type: '' },
					{ startIndex: 4, type: 'identifier.js' },
					{ startIndex: 5, type: 'delimiter.js' },
					{ startIndex: 6, type: '' },
					{ startIndex: 7, type: 'number.js' },
					{ startIndex: 9, type: 'delimiter.js' },
					{ startIndex: 10, type: 'delimiter.html' },
					{ startIndex: 12, type: 'tag.html' },
					{ startIndex: 18, type: 'delimiter.html' }
				]
			}
		],

		// Embedded Content #5
		[
			{
				line: '<script type="text/plain">a',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 7, type: '' },
					{ startIndex: 8, type: 'attribute.name.html' },
					{ startIndex: 12, type: 'delimiter.html' },
					{ startIndex: 13, type: 'attribute.value.html' },
					{ startIndex: 25, type: 'delimiter.html' },
					{ startIndex: 26, type: '' }
				]
			},
			{
				line: '<a</script>',
				tokens: [
					{ startIndex: 0, type: '' },
					{ startIndex: 2, type: 'delimiter.html' },
					{ startIndex: 4, type: 'tag.html' },
					{ startIndex: 10, type: 'delimiter.html' }
				]
			}
		],

		// Embedded Content #6
		[
			{
				line: '<script>a</script><script>b</script>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 7, type: 'delimiter.html' },
					{ startIndex: 8, type: 'identifier.js' },
					{ startIndex: 9, type: 'delimiter.html' },
					{ startIndex: 11, type: 'tag.html' },
					{ startIndex: 17, type: 'delimiter.html' },
					// { startIndex:18, type: 'delimiter.html' },
					{ startIndex: 19, type: 'tag.html' },
					{ startIndex: 25, type: 'delimiter.html' },
					{ startIndex: 26, type: 'identifier.js' },
					{ startIndex: 27, type: 'delimiter.html' },
					{ startIndex: 29, type: 'tag.html' },
					{ startIndex: 35, type: 'delimiter.html' }
				]
			}
		],

		// Embedded Content #7
		[
			{
				line: '<script type="text/javascript"></script>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 7, type: '' },
					{ startIndex: 8, type: 'attribute.name.html' },
					{ startIndex: 12, type: 'delimiter.html' },
					{ startIndex: 13, type: 'attribute.value.html' },
					{ startIndex: 30, type: 'delimiter.html' },
					// { startIndex:31, type: 'delimiter.html' },
					{ startIndex: 33, type: 'tag.html' },
					{ startIndex: 39, type: 'delimiter.html' }
				]
			}
		],

		// Embedded Content #8
		[
			{
				line: '<script>var i= 10;</script>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 7, type: 'delimiter.html' },
					{ startIndex: 8, type: 'keyword.js' },
					{ startIndex: 11, type: '' },
					{ startIndex: 12, type: 'identifier.js' },
					{ startIndex: 13, type: 'delimiter.js' },
					{ startIndex: 14, type: '' },
					{ startIndex: 15, type: 'number.js' },
					{ startIndex: 17, type: 'delimiter.js' },
					{ startIndex: 18, type: 'delimiter.html' },
					{ startIndex: 20, type: 'tag.html' },
					{ startIndex: 26, type: 'delimiter.html' }
				]
			}
		],

		// Embedded Content #9
		[
			{
				line: '<script type="text/javascript" src="main.js"></script>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 7, type: '' },
					{ startIndex: 8, type: 'attribute.name.html' },
					{ startIndex: 12, type: 'delimiter.html' },
					{ startIndex: 13, type: 'attribute.value.html' },
					{ startIndex: 30, type: '' },
					{ startIndex: 31, type: 'attribute.name.html' },
					{ startIndex: 34, type: 'delimiter.html' },
					{ startIndex: 35, type: 'attribute.value.html' },
					{ startIndex: 44, type: 'delimiter.html' },
					// { startIndex:45, type: 'delimiter.html' },
					{ startIndex: 47, type: 'tag.html' },
					{ startIndex: 53, type: 'delimiter.html' }
				]
			}
		],

		// Tag with Attribute
		[
			{
				line: '<abc foo="bar">',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 4, type: '' },
					{ startIndex: 5, type: 'attribute.name.html' },
					{ startIndex: 8, type: 'delimiter.html' },
					{ startIndex: 9, type: 'attribute.value.html' },
					{ startIndex: 14, type: 'delimiter.html' }
				]
			}
		],

		// Tag with Empty Attribute Value
		[
			{
				line: "<abc foo='bar'>",
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 4, type: '' },
					{ startIndex: 5, type: 'attribute.name.html' },
					{ startIndex: 8, type: 'delimiter.html' },
					{ startIndex: 9, type: 'attribute.value.html' },
					{ startIndex: 14, type: 'delimiter.html' }
				]
			}
		],

		// Tag with empty attributes
		[
			{
				line: '<abc foo="">',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 4, type: '' },
					{ startIndex: 5, type: 'attribute.name.html' },
					{ startIndex: 8, type: 'delimiter.html' },
					{ startIndex: 9, type: 'attribute.value.html' },
					{ startIndex: 11, type: 'delimiter.html' }
				]
			}
		],

		// Tag with Attributes
		[
			{
				line: '<abc foo="bar" bar=\'foo\'>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 4, type: '' },
					{ startIndex: 5, type: 'attribute.name.html' },
					{ startIndex: 8, type: 'delimiter.html' },
					{ startIndex: 9, type: 'attribute.value.html' },
					{ startIndex: 14, type: '' },
					{ startIndex: 15, type: 'attribute.name.html' },
					{ startIndex: 18, type: 'delimiter.html' },
					{ startIndex: 19, type: 'attribute.value.html' },
					{ startIndex: 24, type: 'delimiter.html' }
				]
			}
		],

		// Tag with Attributes, no quotes
		[
			{
				line: '<abc foo=bar bar=help-me>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 4, type: '' },
					{ startIndex: 5, type: 'attribute.name.html' },
					{ startIndex: 8, type: 'delimiter.html' },
					{ startIndex: 9, type: 'attribute.name.html' }, // slightly incorrect
					{ startIndex: 12, type: '' },
					{ startIndex: 13, type: 'attribute.name.html' },
					{ startIndex: 16, type: 'delimiter.html' },
					{ startIndex: 17, type: 'attribute.name.html' }, // slightly incorrect
					{ startIndex: 24, type: 'delimiter.html' }
				]
			}
		],

		// Tag with Attribute And Whitespace
		[
			{
				line: '<abc foo=  "bar">',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 4, type: '' },
					{ startIndex: 5, type: 'attribute.name.html' },
					{ startIndex: 8, type: 'delimiter.html' },
					{ startIndex: 9, type: '' },
					{ startIndex: 11, type: 'attribute.value.html' },
					{ startIndex: 16, type: 'delimiter.html' }
				]
			}
		],

		// Tag with Attribute And Whitespace #2
		[
			{
				line: '<abc foo = "bar">',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 4, type: '' },
					{ startIndex: 5, type: 'attribute.name.html' },
					{ startIndex: 8, type: '' },
					{ startIndex: 9, type: 'delimiter.html' },
					{ startIndex: 10, type: '' },
					{ startIndex: 11, type: 'attribute.value.html' },
					{ startIndex: 16, type: 'delimiter.html' }
				]
			}
		],

		// Tag with Name-Only-Attribute #1
		[
			{
				line: '<abc foo>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 4, type: '' },
					{ startIndex: 5, type: 'attribute.name.html' },
					{ startIndex: 8, type: 'delimiter.html' }
				]
			}
		],

		// Tag with Name-Only-Attribute #2
		[
			{
				line: '<abc foo bar>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 4, type: '' },
					{ startIndex: 5, type: 'attribute.name.html' },
					{ startIndex: 8, type: '' },
					{ startIndex: 9, type: 'attribute.name.html' },
					{ startIndex: 12, type: 'delimiter.html' }
				]
			}
		],

		// Tag with Interesting Attribute Name
		[
			{
				line: '<abc foo!@#="bar">',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 4, type: '' },
					{ startIndex: 5, type: 'attribute.name.html' },
					{ startIndex: 8, type: '' },
					{ startIndex: 11, type: 'delimiter.html' },
					{ startIndex: 12, type: 'attribute.value.html' },
					{ startIndex: 17, type: 'delimiter.html' }
				]
			}
		],

		// Tag with Angular Attribute Name
		[
			{
				line: '<abc #myinput (click)="bar" [value]="someProperty" *ngIf="someCondition">',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 4, type: '' },
					{ startIndex: 6, type: 'attribute.name.html' },
					{ startIndex: 13, type: '' },
					{ startIndex: 15, type: 'attribute.name.html' },
					{ startIndex: 20, type: '' },
					{ startIndex: 21, type: 'delimiter.html' },
					{ startIndex: 22, type: 'attribute.value.html' },
					{ startIndex: 27, type: '' },
					{ startIndex: 29, type: 'attribute.name.html' },
					{ startIndex: 34, type: '' },
					{ startIndex: 35, type: 'delimiter.html' },
					{ startIndex: 36, type: 'attribute.value.html' },
					{ startIndex: 50, type: '' },
					{ startIndex: 52, type: 'attribute.name.html' },
					{ startIndex: 56, type: 'delimiter.html' },
					{ startIndex: 57, type: 'attribute.value.html' },
					{ startIndex: 72, type: 'delimiter.html' }
				]
			}
		],

		// Tag with Invalid Attribute Value
		[
			{
				line: '<abc foo=">',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 4, type: '' },
					{ startIndex: 5, type: 'attribute.name.html' },
					{ startIndex: 8, type: 'delimiter.html' },
					{ startIndex: 9, type: '' },
					{ startIndex: 10, type: 'delimiter.html' }
				]
			}
		],

		// Simple Comment 1
		[
			{
				line: '<!--a-->',
				tokens: [
					{ startIndex: 0, type: 'comment.html' },
					{ startIndex: 4, type: 'comment.content.html' },
					{ startIndex: 5, type: 'comment.html' }
				]
			}
		],

		// Simple Comment 2
		[
			{
				line: '<!--a>foo bar</a -->',
				tokens: [
					{ startIndex: 0, type: 'comment.html' },
					{ startIndex: 4, type: 'comment.content.html' },
					{ startIndex: 17, type: 'comment.html' }
				]
			}
		],

		// Multiline Comment
		[
			{
				line: '<!--a>',
				tokens: [
					{ startIndex: 0, type: 'comment.html' },
					{ startIndex: 4, type: 'comment.content.html' }
				]
			},
			{
				line: 'foo ',
				tokens: [{ startIndex: 0, type: 'comment.content.html' }]
			},
			{
				line: 'bar</a -->',
				tokens: [
					{ startIndex: 0, type: 'comment.content.html' },
					{ startIndex: 7, type: 'comment.html' }
				]
			}
		],

		// Simple Doctype
		[
			{
				line: '<!DOCTYPE a>',
				tokens: [
					{ startIndex: 0, type: 'metatag.html' },
					{ startIndex: 9, type: 'metatag.content.html' },
					{ startIndex: 11, type: 'metatag.html' }
				]
			}
		],

		// Simple Doctype #2
		[
			{
				line: '<!doctype a>',
				tokens: [
					{ startIndex: 0, type: 'metatag.html' },
					{ startIndex: 9, type: 'metatag.content.html' },
					{ startIndex: 11, type: 'metatag.html' }
				]
			}
		],

		// Simple Doctype #4
		[
			{
				line: '<!DOCTYPE a',
				tokens: [
					{ startIndex: 0, type: 'metatag.html' },
					{ startIndex: 9, type: 'metatag.content.html' }
				]
			},
			{
				line: '"foo" \'bar\'>',
				tokens: [
					{ startIndex: 0, type: 'metatag.content.html' },
					{ startIndex: 11, type: 'metatag.html' }
				]
			}
		],

		// PR #14
		[
			{
				line: '<asdf:bar>asd</asdf:bar>',
				tokens: [
					{ startIndex: 0, type: 'delimiter.html' },
					{ startIndex: 1, type: 'tag.html' },
					{ startIndex: 9, type: 'delimiter.html' },
					{ startIndex: 10, type: '' },
					{ startIndex: 13, type: 'delimiter.html' },
					{ startIndex: 15, type: 'tag.html' },
					{ startIndex: 23, type: 'delimiter.html' }
				]
			}
		]
	]
);

/**
 * Twig Tests
 */
testTokenization(
	['twig'],
	[
		/**
		 * Comments
		 */
		[
			{
				line: '{# Hello World! #}',
				tokens: [{ startIndex: 0, type: 'comment.twig' }]
			}
		],
		[
			{
				line: '{#Hello World!#}',
				tokens: [{ startIndex: 0, type: 'comment.twig' }]
			}
		],

		/**
		 * Variables Tags
		 */
		// Whitespace
		[
			{
				line: '{{}}',
				tokens: [{ startIndex: 0, type: 'delimiter.twig' }]
			}
		],
		[
			{
				line: '{{ }}',
				tokens: [
					{ startIndex: 0, type: 'delimiter.twig' },
					{ startIndex: 2, type: '' },
					{ startIndex: 3, type: 'delimiter.twig' }
				]
			}
		],
		// Numbers
		[
			{
				line: '{{1}}',
				tokens: [
					{ startIndex: 0, type: 'delimiter.twig' },
					{ startIndex: 2, type: 'number.twig' },
					{ startIndex: 3, type: 'delimiter.twig' }
				]
			}
		],
		[
			{
				line: '{{ 1 }}',
				tokens: [
					{ startIndex: 0, type: 'delimiter.twig' },
					{ startIndex: 2, type: '' },
					{ startIndex: 3, type: 'number.twig' },
					{ startIndex: 4, type: '' },
					{ startIndex: 5, type: 'delimiter.twig' }
				]
			}
		],
		[
			{
				line: '{{ 1 }}',
				tokens: [
					{ startIndex: 0, type: 'delimiter.twig' },
					{ startIndex: 2, type: '' },
					{ startIndex: 3, type: 'number.twig' },
					{ startIndex: 4, type: '' },
					{ startIndex: 5, type: 'delimiter.twig' }
				]
			}
		],
		[
			{
				line: '{{ 1.1 }}',
				tokens: [
					{ startIndex: 0, type: 'delimiter.twig' },
					{ startIndex: 2, type: '' },
					{ startIndex: 3, type: 'number.twig' },
					{ startIndex: 6, type: '' },
					{ startIndex: 7, type: 'delimiter.twig' }
				]
			}
		],
		// Strings
		[
			{
				line: "{{ 'hi' }}",
				tokens: [
					{ startIndex: 0, type: 'delimiter.twig' },
					{ startIndex: 2, type: '' },
					{ startIndex: 3, type: 'string.twig' },
					{ startIndex: 7, type: '' },
					{ startIndex: 8, type: 'delimiter.twig' }
				]
			}
		],
		[
			{
				line: '{{ "hi" }}',
				tokens: [
					{ startIndex: 0, type: 'delimiter.twig' },
					{ startIndex: 2, type: '' },
					{ startIndex: 3, type: 'string.twig' },
					{ startIndex: 7, type: '' },
					{ startIndex: 8, type: 'delimiter.twig' }
				]
			}
		],
		[
			{
				line: '{{ "hi #{1}" }}',
				tokens: [
					{ startIndex: 0, type: 'delimiter.twig' },
					{ startIndex: 2, type: '' },
					{ startIndex: 3, type: 'string.twig' },
					{ startIndex: 9, type: 'number.twig' },
					{ startIndex: 10, type: 'string.twig' },
					{ startIndex: 12, type: '' },
					{ startIndex: 13, type: 'delimiter.twig' }
				]
			}
		],
		// Variables and functions
		[
			{
				line: '{{ foo }}',
				tokens: [
					{ startIndex: 0, type: 'delimiter.twig' },
					{ startIndex: 2, type: '' },
					{ startIndex: 3, type: 'variable.twig' },
					{ startIndex: 6, type: '' },
					{ startIndex: 7, type: 'delimiter.twig' }
				]
			}
		],
		[
			{
				line: '{{ foo(42) }}',
				tokens: [
					{ startIndex: 0, type: 'delimiter.twig' },
					{ startIndex: 2, type: '' },
					{ startIndex: 3, type: 'variable.twig' },
					{ startIndex: 6, type: 'delimiter.twig' },
					{ startIndex: 7, type: 'number.twig' },
					{ startIndex: 9, type: 'delimiter.twig' },
					{ startIndex: 10, type: '' },
					{ startIndex: 11, type: 'delimiter.twig' }
				]
			}
		],
		// Operators
		[
			{
				line: '{{ 1 + 2 - 3 / 4 // 5 % 6 * 7 ** 8 }}',
				tokens: [
					{ startIndex: 0, type: 'delimiter.twig' },
					{ startIndex: 2, type: '' },
					{ startIndex: 3, type: 'number.twig' },
					{ startIndex: 4, type: '' },
					{ startIndex: 5, type: 'operators.twig' },
					{ startIndex: 6, type: '' },
					{ startIndex: 7, type: 'number.twig' },
					{ startIndex: 8, type: '' },
					{ startIndex: 9, type: 'operators.twig' },
					{ startIndex: 10, type: '' },
					{ startIndex: 11, type: 'number.twig' },
					{ startIndex: 12, type: '' },
					{ startIndex: 13, type: 'operators.twig' },
					{ startIndex: 14, type: '' },
					{ startIndex: 15, type: 'number.twig' },
					{ startIndex: 16, type: '' },
					{ startIndex: 17, type: 'operators.twig' },
					{ startIndex: 19, type: '' },
					{ startIndex: 20, type: 'number.twig' },
					{ startIndex: 21, type: '' },
					{ startIndex: 22, type: 'operators.twig' },
					{ startIndex: 23, type: '' },
					{ startIndex: 24, type: 'number.twig' },
					{ startIndex: 25, type: '' },
					{ startIndex: 26, type: 'operators.twig' },
					{ startIndex: 27, type: '' },
					{ startIndex: 28, type: 'number.twig' },
					{ startIndex: 29, type: '' },
					{ startIndex: 30, type: 'operators.twig' },
					{ startIndex: 32, type: '' },
					{ startIndex: 33, type: 'number.twig' },
					{ startIndex: 34, type: '' },
					{ startIndex: 35, type: 'delimiter.twig' }
				]
			}
		],
		[
			{
				line: '{{ true and false or true and not false }}',
				tokens: [
					{ startIndex: 0, type: 'delimiter.twig' },
					{ startIndex: 2, type: '' },
					{ startIndex: 3, type: 'keyword.twig' },
					{ startIndex: 7, type: '' },
					{ startIndex: 8, type: 'operators.twig' },
					{ startIndex: 11, type: '' },
					{ startIndex: 12, type: 'keyword.twig' },
					{ startIndex: 17, type: '' },
					{ startIndex: 18, type: 'operators.twig' },
					{ startIndex: 20, type: '' },
					{ startIndex: 21, type: 'keyword.twig' },
					{ startIndex: 25, type: '' },
					{ startIndex: 26, type: 'operators.twig' },
					{ startIndex: 29, type: '' },
					{ startIndex: 30, type: 'operators.twig' },
					{ startIndex: 33, type: '' },
					{ startIndex: 34, type: 'keyword.twig' },
					{ startIndex: 39, type: '' },
					{ startIndex: 40, type: 'delimiter.twig' }
				]
			}
		],

		/**
		 * Block Tags
		 */
		[
			{
				line: '{%%}',
				tokens: [{ startIndex: 0, type: 'delimiter.twig' }]
			}
		],
		[
			{
				line: '{% %}',
				tokens: [
					{ startIndex: 0, type: 'delimiter.twig' },
					{ startIndex: 2, type: '' },
					{ startIndex: 3, type: 'delimiter.twig' }
				]
			}
		],
		[
			{
				line: '{% for item in navigation %}',
				tokens: [
					{ startIndex: 0, type: 'delimiter.twig' },
					{ startIndex: 2, type: '' },
					{ startIndex: 3, type: 'keyword.twig' },
					{ startIndex: 6, type: '' },
					{ startIndex: 7, type: 'variable.twig' },
					{ startIndex: 11, type: '' },
					{ startIndex: 12, type: 'operators.twig' },
					{ startIndex: 14, type: '' },
					{ startIndex: 15, type: 'variable.twig' },
					{ startIndex: 25, type: '' },
					{ startIndex: 26, type: 'delimiter.twig' }
				]
			}
		],
		[
			{
				line: '{% verbatim %}',
				tokens: [
					{ startIndex: 0, type: 'delimiter.twig' },
					{ startIndex: 2, type: '' },
					{ startIndex: 3, type: 'keyword.twig' },
					{ startIndex: 11, type: '' },
					{ startIndex: 12, type: 'delimiter.twig' }
				]
			}
		],
		[
			{
				line: '{% verbatim %}raw data{% endverbatim %}',
				tokens: [
					{ startIndex: 0, type: 'delimiter.twig' },
					{ startIndex: 2, type: '' },
					{ startIndex: 3, type: 'keyword.twig' },
					{ startIndex: 11, type: '' },
					{ startIndex: 12, type: 'delimiter.twig' },
					{ startIndex: 14, type: 'string.twig' },
					{ startIndex: 22, type: 'delimiter.twig' },
					{ startIndex: 24, type: '' },
					{ startIndex: 25, type: 'keyword.twig' },
					{ startIndex: 36, type: '' },
					{ startIndex: 37, type: 'delimiter.twig' }
				]
			}
		]
	]
);
