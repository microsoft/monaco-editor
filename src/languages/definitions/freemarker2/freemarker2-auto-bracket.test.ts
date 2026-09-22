/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('freemarker2.tag-auto.interpolation-bracket', [
	// Plain text
	[
		{
			line: 'abc123./]})>',
			tokens: [{ startIndex: 0, type: 'source.freemarker2' }]
		},
		// HTML comment is not FreeMarker comment
		{
			line: '<!-- NO A FREEMARKER COMMENT -->',
			tokens: [{ startIndex: 0, type: 'source.freemarker2' }]
		}
	],

	// Auto mode: bracket directive sets bracket mode
	[
		{
			line: '[#attempt]<#attempt>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 10, type: 'source.freemarker2' }
			]
		}
	],
	// Auto mode: angle directive sets angle mode
	[
		{
			line: '<#attempt>[#attempt]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 9, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 10, type: 'source.freemarker2' }
			]
		}
	],
	// Auto mode: invalid directive sets mode
	[
		{
			line: '[#foobar]<#foobar>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 8, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 9, type: 'source.freemarker2' }
			]
		}
	],
	// Auto mode: angle tag comment sets mode
	[
		{
			line: '<#-- asd -->',
			tokens: [{ startIndex: 0, type: 'comment.freemarker2' }]
		},
		{
			line: '[#-- asd --]',
			tokens: [{ startIndex: 0, type: 'source.freemarker2' }]
		},
		{
			line: '[#if true]B[/#if]',
			tokens: [{ startIndex: 0, type: 'source.freemarker2' }]
		},
		{
			line: '<#if true>A</#if>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'keyword.true.freemarker2' },
				{ startIndex: 9, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 10, type: 'source.freemarker2' },
				{ startIndex: 11, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 12, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 14, type: 'tag.freemarker2' },
				{ startIndex: 16, type: 'delimiter.angle.freemarker2.directive' }
			]
		}
	],
	// Auto mode: bracket tag comment sets mode
	[
		{
			line: '[#-- asd --]',
			tokens: [{ startIndex: 0, type: 'comment.freemarker2' }]
		},
		{
			line: '<#-- asd -->',
			tokens: [{ startIndex: 0, type: 'source.freemarker2' }]
		},
		{
			line: '<#if true>A</#if>',
			tokens: [{ startIndex: 0, type: 'source.freemarker2' }]
		},
		{
			line: '[#if true]B[/#if]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'keyword.true.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 10, type: 'source.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 12, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 14, type: 'tag.freemarker2' },
				{ startIndex: 16, type: 'delimiter.square.freemarker2.directive' }
			]
		}
	],
	// Auto mode: angle unified call sets mode
	[
		{
			line: '<@join/>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 6, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 7, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '[@join/]',
			tokens: [{ startIndex: 0, type: 'source.freemarker2' }]
		},
		{
			line: '[#if true]B[/#if]',
			tokens: [{ startIndex: 0, type: 'source.freemarker2' }]
		},
		{
			line: '<#if true>A</#if>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'keyword.true.freemarker2' },
				{ startIndex: 9, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 10, type: 'source.freemarker2' },
				{ startIndex: 11, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 12, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 14, type: 'tag.freemarker2' },
				{ startIndex: 16, type: 'delimiter.angle.freemarker2.directive' }
			]
		}
	],
	// Auto mode: bracket unified call sets mode
	[
		{
			line: '[@join/]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 6, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 7, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '<@join/>',
			tokens: [{ startIndex: 0, type: 'source.freemarker2' }]
		},
		{
			line: '<#if true>A</#if>',
			tokens: [{ startIndex: 0, type: 'source.freemarker2' }]
		},
		{
			line: '[#if true]B[/#if]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'keyword.true.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 10, type: 'source.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 12, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 14, type: 'tag.freemarker2' },
				{ startIndex: 16, type: 'delimiter.square.freemarker2.directive' }
			]
		}
	],
	// Auto mode: bracket expression comment does not set tag syntax mode
	[
		{
			line: '[=[!-- asd --]0]<#if true></#if>[#if]',
			tokens: [
				{
					startIndex: 0,
					type: 'delimiter.square.freemarker2.interpolation'
				},
				{
					startIndex: 1,
					type: 'delimiter.interpolation.freemarker2'
				},
				{
					startIndex: 2,
					type: 'comment.freemarker2'
				},
				{
					startIndex: 14,
					type: 'number.freemarker2'
				},
				{
					startIndex: 15,
					type: 'delimiter.square.freemarker2.interpolation'
				},
				{
					startIndex: 16,
					type: 'delimiter.angle.freemarker2.directive'
				},
				{
					startIndex: 17,
					type: 'delimiter.directive.freemarker2'
				},
				{
					startIndex: 18,
					type: 'tag.freemarker2'
				},
				{
					startIndex: 20,
					type: ''
				},
				{
					startIndex: 21,
					type: 'keyword.true.freemarker2'
				},
				{
					startIndex: 25,
					type: 'delimiter.angle.freemarker2.directive'
				},
				{
					startIndex: 27,
					type: 'delimiter.directive.freemarker2'
				},
				{
					startIndex: 29,
					type: 'tag.freemarker2'
				},
				{
					startIndex: 31,
					type: 'delimiter.angle.freemarker2.directive'
				},
				{
					startIndex: 32,
					type: 'source.freemarker2'
				}
			]
		}
	],
	// Auto mode: angle expression comment does not set tag syntax mode
	[
		{
			line: '[=<!-- asd -->0][#if true][/#if]<#if>',
			tokens: [
				{
					startIndex: 0,
					type: 'delimiter.square.freemarker2.interpolation'
				},
				{
					startIndex: 1,
					type: 'delimiter.interpolation.freemarker2'
				},
				{
					startIndex: 2,
					type: 'comment.freemarker2'
				},
				{
					startIndex: 14,
					type: 'number.freemarker2'
				},
				{
					startIndex: 15,
					type: 'delimiter.square.freemarker2.interpolation'
				},
				{
					startIndex: 16,
					type: 'delimiter.square.freemarker2.directive'
				},
				{
					startIndex: 17,
					type: 'delimiter.directive.freemarker2'
				},
				{
					startIndex: 18,
					type: 'tag.freemarker2'
				},
				{
					startIndex: 20,
					type: ''
				},
				{
					startIndex: 21,
					type: 'keyword.true.freemarker2'
				},
				{
					startIndex: 25,
					type: 'delimiter.square.freemarker2.directive'
				},
				{
					startIndex: 27,
					type: 'delimiter.directive.freemarker2'
				},
				{
					startIndex: 29,
					type: 'tag.freemarker2'
				},
				{
					startIndex: 31,
					type: 'delimiter.square.freemarker2.directive'
				},
				{
					startIndex: 32,
					type: 'source.freemarker2'
				}
			]
		}
	],

	// Block comment (terse) (angle)
	[
		{
			line: 'x<#--a',
			tokens: [
				{ startIndex: 0, type: 'source.freemarker2' },
				{ startIndex: 1, type: 'comment.freemarker2' }
			]
		},
		{
			line: 'b <#if></#if></#comment><#noparse>',
			tokens: [{ startIndex: 0, type: 'comment.freemarker2' }]
		},
		{
			line: 'c-->y',
			tokens: [
				{ startIndex: 0, type: 'comment.freemarker2' },
				{ startIndex: 4, type: 'source.freemarker2' }
			]
		}
	],
	// Block comment (terse) (bracket)
	[
		{
			line: 'x[#--a',
			tokens: [
				{ startIndex: 0, type: 'source.freemarker2' },
				{ startIndex: 1, type: 'comment.freemarker2' }
			]
		},
		{
			line: 'b',
			tokens: [{ startIndex: 0, type: 'comment.freemarker2' }]
		},
		{
			line: 'c--]y',
			tokens: [
				{ startIndex: 0, type: 'comment.freemarker2' },
				{ startIndex: 4, type: 'source.freemarker2' }
			]
		}
	],
	// Block comment (tag) (angle)
	[
		{
			line: 'x<#comment>a',
			tokens: [
				{ startIndex: 0, type: 'source.freemarker2' },
				{ startIndex: 1, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 2, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 10, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 11, type: 'comment.freemarker2' }
			]
		},
		{
			line: 'b',
			tokens: [{ startIndex: 0, type: 'comment.freemarker2' }]
		},
		{
			line: 'c</#comment>y',
			tokens: [
				{ startIndex: 0, type: 'comment.freemarker2' },
				{ startIndex: 1, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 2, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 4, type: 'tag.freemarker2' },
				{ startIndex: 11, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 12, type: 'source.freemarker2' }
			]
		}
	],

	// Block comment (tag) (bracket)
	[
		{
			line: 'x[#comment]a',
			tokens: [
				{ startIndex: 0, type: 'source.freemarker2' },
				{ startIndex: 1, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 2, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 10, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 11, type: 'comment.freemarker2' }
			]
		},
		{
			line: 'b',
			tokens: [{ startIndex: 0, type: 'comment.freemarker2' }]
		},
		{
			line: 'c[/#comment]y',
			tokens: [
				{ startIndex: 0, type: 'comment.freemarker2' },
				{ startIndex: 1, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 2, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 4, type: 'tag.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 12, type: 'source.freemarker2' }
			]
		}
	],

	// Expression comments
	[
		// Angle syntax (no spaces)
		{
			line: '[=2+<!-- comment -->3]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'number.freemarker2' },
				{ startIndex: 3, type: 'operators.freemarker2' },
				{ startIndex: 4, type: 'comment.freemarker2' },
				{ startIndex: 20, type: 'number.freemarker2' },
				{ startIndex: 21, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		// Angle syntax (spaces)
		{
			line: '[=2+ <!-- comment --> 3]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'number.freemarker2' },
				{ startIndex: 3, type: 'operators.freemarker2' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'comment.freemarker2' },
				{ startIndex: 21, type: '' },
				{ startIndex: 22, type: 'number.freemarker2' },
				{ startIndex: 23, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		// Bracket syntax (no spaces)
		{
			line: '[=2+[!-- comment --]3]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'number.freemarker2' },
				{ startIndex: 3, type: 'operators.freemarker2' },
				{ startIndex: 4, type: 'comment.freemarker2' },
				{ startIndex: 20, type: 'number.freemarker2' },
				{ startIndex: 21, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=[[!-- comment --]3]]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'delimiter.square.freemarker2' },
				{ startIndex: 3, type: 'comment.freemarker2' },
				{ startIndex: 19, type: 'number.freemarker2' },
				{ startIndex: 20, type: 'delimiter.square.freemarker2' },
				{ startIndex: 21, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		// Bracket syntax (spaces)
		{
			line: '[=2+ [!-- comment --] 3]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'number.freemarker2' },
				{ startIndex: 3, type: 'operators.freemarker2' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'comment.freemarker2' },
				{ startIndex: 21, type: '' },
				{ startIndex: 22, type: 'number.freemarker2' },
				{ startIndex: 23, type: 'delimiter.square.freemarker2.interpolation' }
			]
		}
	],

	// noparse (ignores everything until the matching closing tag)
	[
		{
			line: 'x<#noparse>a',
			tokens: [
				{ startIndex: 0, type: 'source.freemarker2' },
				{ startIndex: 1, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 2, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 10, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 11, type: 'source.freemarker2' }
			]
		},
		{
			line: 'b <#if></#if> </#noParse> <!-- ... -->',
			tokens: [{ startIndex: 0, type: 'source.freemarker2' }]
		},
		{
			line: 'c</#noparse>y',
			tokens: [
				{ startIndex: 0, type: 'source.freemarker2' },
				{ startIndex: 1, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 2, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 4, type: 'tag.freemarker2' },
				{ startIndex: 11, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 12, type: 'source.freemarker2' }
			]
		}
	],

	// noParse (ignores everything until the matching closing tag)
	[
		{
			line: 'x<#noParse>a',
			tokens: [
				{ startIndex: 0, type: 'source.freemarker2' },
				{ startIndex: 1, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 2, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 10, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 11, type: 'source.freemarker2' }
			]
		},
		{
			line: 'b <#if></#if> </#noparse> <!-- ... -->',
			tokens: [{ startIndex: 0, type: 'source.freemarker2' }]
		},
		{
			line: 'c</#noParse>y',
			tokens: [
				{ startIndex: 0, type: 'source.freemarker2' },
				{ startIndex: 1, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 2, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 4, type: 'tag.freemarker2' },
				{ startIndex: 11, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 12, type: 'source.freemarker2' }
			]
		}
	],

	// Closing angle bracket treatment
	[
		// Comparison operator when inside an interpolation
		{
			line: '[=1>2]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'number.freemarker2' },
				{ startIndex: 3, type: 'operators.freemarker2' },
				{ startIndex: 4, type: 'number.freemarker2' },
				{ startIndex: 5, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=1>=2]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'number.freemarker2' },
				{ startIndex: 3, type: 'operators.freemarker2' },
				{ startIndex: 5, type: 'number.freemarker2' },
				{ startIndex: 6, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		// Directive end tag when inside a directive
		{
			line: '<#if 1>2</#if>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'number.freemarker2' },
				{ startIndex: 6, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 7, type: 'source.freemarker2' },
				{ startIndex: 8, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 9, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 11, type: 'tag.freemarker2' },
				{ startIndex: 13, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		// Normal comparison operator when inside parentheses within a directive
		// Only considers parentheses, not other brackets
		{
			line: '<#if (1>2)></#if>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 6, type: 'number.freemarker2' },
				{ startIndex: 7, type: 'operators.freemarker2' },
				{ startIndex: 8, type: 'number.freemarker2' },
				{ startIndex: 9, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 10, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 12, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 14, type: 'tag.freemarker2' },
				{ startIndex: 16, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#if (1>=2)></#if>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 6, type: 'number.freemarker2' },
				{ startIndex: 7, type: 'operators.freemarker2' },
				{ startIndex: 9, type: 'number.freemarker2' },
				{ startIndex: 10, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 11, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 13, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 15, type: 'tag.freemarker2' },
				{ startIndex: 17, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#if [1>2]></#if>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'delimiter.square.freemarker2' },
				{ startIndex: 6, type: 'number.freemarker2' },
				{ startIndex: 7, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 8, type: 'source.freemarker2' },
				{ startIndex: 11, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 12, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 14, type: 'tag.freemarker2' },
				{ startIndex: 16, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#if [(1>2)]></#if>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'delimiter.square.freemarker2' },
				{ startIndex: 6, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 7, type: 'number.freemarker2' },
				{ startIndex: 8, type: 'operators.freemarker2' },
				{ startIndex: 9, type: 'number.freemarker2' },
				{ startIndex: 10, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2' },
				{ startIndex: 12, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 14, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 16, type: 'tag.freemarker2' },
				{ startIndex: 18, type: 'delimiter.angle.freemarker2.directive' }
			]
		}
	],

	// Mismatched closing bracket / parenthesis does not end expression mode
	[
		// Interpolation
		{
			line: '[=)1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 3, type: 'number.freemarker2' },
				{ startIndex: 4, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=}1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'delimiter.curly.freemarker2' },
				{ startIndex: 3, type: 'number.freemarker2' },
				{ startIndex: 4, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=>1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'operators.freemarker2' },
				{ startIndex: 3, type: 'number.freemarker2' },
				{ startIndex: 4, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		// // Directive
		{
			line: '<#if )1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 6, type: 'number.freemarker2' },
				{ startIndex: 7, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#if ]1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'delimiter.square.freemarker2' },
				{ startIndex: 6, type: 'number.freemarker2' },
				{ startIndex: 7, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#if }1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'delimiter.curly.freemarker2' },
				{ startIndex: 6, type: 'number.freemarker2' },
				{ startIndex: 7, type: 'delimiter.angle.freemarker2.directive' }
			]
		}
	],

	// Boolean literals
	[
		{
			line: '[=false]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'keyword.false.freemarker2' },
				{ startIndex: 7, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=true]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'keyword.true.freemarker2' },
				{ startIndex: 6, type: 'delimiter.square.freemarker2.interpolation' }
			]
		}
	],

	// Number literals
	[
		{
			line: '[=123]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'number.freemarker2' },
				{ startIndex: 5, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=123.456]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'number.float.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2.interpolation' }
			]
		}
	],

	// Interpolated string literals (single quote)
	[
		// Empty string
		{
			line: "[='']",
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'string.freemarker2' },
				{ startIndex: 4, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		// Literal content
		{
			line: "[='abc']",
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'string.freemarker2' },
				{ startIndex: 7, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		// Escaped characters (named)
		{
			line: "[='\\n\\t\\r\\f\\b\\g\\l\\a\\\\\\'\\{\\=']",
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'string.freemarker2' },
				{ startIndex: 3, type: 'string.escape.freemarker2' },
				{ startIndex: 27, type: 'string.freemarker2' },
				{ startIndex: 28, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		// Escaped characters (unicode, 1-4 hex digits)
		{
			line: "[='\\x1\\x11\\x111\\x1111\\x11111']",
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'string.freemarker2' },
				{ startIndex: 3, type: 'string.escape.freemarker2' },
				{ startIndex: 27, type: 'string.freemarker2' },
				{ startIndex: 29, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		// String interpolation (unsupported, not possible with Monarch?)
		{
			// this evaluates to "ab0cd" and contains three interpolations
			line: "[='a[=\\'b[=\\\\\\'[=0]\\\\\\']c\\'}d']",
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'string.freemarker2' },
				{ startIndex: 6, type: 'string.escape.freemarker2' },
				{ startIndex: 8, type: 'string.freemarker2' },
				{ startIndex: 11, type: 'string.escape.freemarker2' },
				{ startIndex: 15, type: 'string.freemarker2' },
				{ startIndex: 19, type: 'string.escape.freemarker2' },
				{ startIndex: 23, type: 'string.freemarker2' },
				{ startIndex: 25, type: 'string.escape.freemarker2' },
				{ startIndex: 27, type: 'string.freemarker2' },
				{ startIndex: 30, type: 'delimiter.square.freemarker2.interpolation' }
			]
		}
	],
	// Interpolated string literals (double quote)
	[
		// Empty string
		{
			line: '[=""]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'string.freemarker2' },
				{ startIndex: 4, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		// Literal content
		{
			line: '[="abc"]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'string.freemarker2' },
				{ startIndex: 7, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		// Escaped characters (named)
		{
			line: '[="\\n\\t\\r\\f\\b\\g\\l\\a\\\\\\\'\\{\\="]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'string.freemarker2' },
				{ startIndex: 3, type: 'string.escape.freemarker2' },
				{ startIndex: 27, type: 'string.freemarker2' },
				{ startIndex: 28, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		// Escaped characters (unicode, 1-4 hex digits)
		{
			line: '[="\\x1\\x11\\x111\\x1111\\x11111"]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'string.freemarker2' },
				{ startIndex: 3, type: 'string.escape.freemarker2' },
				{ startIndex: 27, type: 'string.freemarker2' },
				{ startIndex: 29, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		// String interpolation (unsupported, not possible with Monarch?)
		{
			// this evaluates to "ab0cd" and contains three interpolations
			line: '[="a[=\\"b[=\\\\\\"[=0}\\\\\\"]c\\"]d"]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'string.freemarker2' },
				{ startIndex: 6, type: 'string.escape.freemarker2' },
				{ startIndex: 8, type: 'string.freemarker2' },
				{ startIndex: 11, type: 'string.escape.freemarker2' },
				{ startIndex: 15, type: 'string.freemarker2' },
				{ startIndex: 19, type: 'string.escape.freemarker2' },
				{ startIndex: 23, type: 'string.freemarker2' },
				{ startIndex: 25, type: 'string.escape.freemarker2' },
				{ startIndex: 27, type: 'string.freemarker2' },
				{ startIndex: 30, type: 'delimiter.square.freemarker2.interpolation' }
			]
		}
	],

	// Raw string literals (single quote)
	[
		// Empty string
		{
			line: "[=r'']",
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'keyword.freemarker2' },
				{ startIndex: 3, type: 'string.raw.freemarker2' },
				{ startIndex: 5, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		// Literal content
		{
			line: "[=r'abc']",
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'keyword.freemarker2' },
				{ startIndex: 3, type: 'string.raw.freemarker2' },
				{ startIndex: 8, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		// Raw string can contain anything other than the opening quote mark
		{
			line: "[=r'\"\\n\\x1']",
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'keyword.freemarker2' },
				{ startIndex: 3, type: 'string.raw.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2.interpolation' }
			]
		}
	],

	// Raw string literals (double quote)
	[
		// Empty string
		{
			line: '[=r""]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'keyword.freemarker2' },
				{ startIndex: 3, type: 'string.raw.freemarker2' },
				{ startIndex: 5, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		// Literal content
		{
			line: '[=r"abc"]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'keyword.freemarker2' },
				{ startIndex: 3, type: 'string.raw.freemarker2' },
				{ startIndex: 8, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		// Raw string can contain anything other than the opening quote mark
		{
			line: '[=r"\'\\n\\x1"]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'keyword.freemarker2' },
				{ startIndex: 3, type: 'string.raw.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2.interpolation' }
			]
		}
	],

	// Boolean operators
	[
		{
			line: '[=!false]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'operators.freemarker2' },
				{ startIndex: 3, type: 'keyword.false.freemarker2' },
				{ startIndex: 8, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=false&true]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'keyword.false.freemarker2' },
				{ startIndex: 7, type: 'operators.freemarker2' },
				{ startIndex: 8, type: 'keyword.true.freemarker2' },
				{ startIndex: 12, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=false&&true]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'keyword.false.freemarker2' },
				{ startIndex: 7, type: 'operators.freemarker2' },
				{ startIndex: 9, type: 'keyword.true.freemarker2' },
				{ startIndex: 13, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=false&amp;&amp;true]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'keyword.false.freemarker2' },
				{ startIndex: 7, type: 'operators.freemarker2' },
				{ startIndex: 17, type: 'keyword.true.freemarker2' },
				{ startIndex: 21, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=false\\andtrue]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'keyword.false.freemarker2' },
				{ startIndex: 7, type: 'operators.freemarker2' },
				{ startIndex: 11, type: 'keyword.true.freemarker2' },
				{ startIndex: 15, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=false|true]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'keyword.false.freemarker2' },
				{ startIndex: 7, type: 'operators.freemarker2' },
				{ startIndex: 8, type: 'keyword.true.freemarker2' },
				{ startIndex: 12, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=false||true]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'keyword.false.freemarker2' },
				{ startIndex: 7, type: 'operators.freemarker2' },
				{ startIndex: 9, type: 'keyword.true.freemarker2' },
				{ startIndex: 13, type: 'delimiter.square.freemarker2.interpolation' }
			]
		}
	],

	// Sequence literals
	[
		// range (inclusive)
		{
			line: '[=(1..3)]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 3, type: 'number.freemarker2' },
				{ startIndex: 4, type: 'operators.freemarker2' },
				{ startIndex: 6, type: 'number.freemarker2' },
				{ startIndex: 7, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 8, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		// range (exclusive)
		{
			line: '[=(1..<3)]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 3, type: 'number.freemarker2' },
				{ startIndex: 4, type: 'operators.freemarker2' },
				{ startIndex: 7, type: 'number.freemarker2' },
				{ startIndex: 8, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		// range (exclusive) (alternative form)
		{
			line: '[=(1..!3)]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 3, type: 'number.freemarker2' },
				{ startIndex: 4, type: 'operators.freemarker2' },
				{ startIndex: 7, type: 'number.freemarker2' },
				{ startIndex: 8, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		// range (length-limited)
		{
			line: '[=(1..*3)]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 3, type: 'number.freemarker2' },
				{ startIndex: 4, type: 'operators.freemarker2' },
				{ startIndex: 7, type: 'number.freemarker2' },
				{ startIndex: 8, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		// range (right-unbounded)
		{
			line: '[=(1..)]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 3, type: 'number.freemarker2' },
				{ startIndex: 4, type: 'operators.freemarker2' },
				{ startIndex: 6, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 7, type: 'delimiter.square.freemarker2.interpolation' }
			]
		}
	],

	// List literals
	[
		// Can be used in directives
		{
			line: '<#assign s=[1,2]>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.freemarker2' },
				{ startIndex: 10, type: 'operators.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2' },
				{ startIndex: 12, type: 'number.freemarker2' },
				{ startIndex: 13, type: 'delimiter.freemarker2' },
				{ startIndex: 14, type: 'number.freemarker2' },
				{ startIndex: 15, type: 'delimiter.square.freemarker2' },
				{ startIndex: 16, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		// Can be used in interpolations
		{
			line: '[=[1,2]]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'delimiter.square.freemarker2' },
				{ startIndex: 3, type: 'number.freemarker2' },
				{ startIndex: 4, type: 'delimiter.freemarker2' },
				{ startIndex: 5, type: 'number.freemarker2' },
				{ startIndex: 6, type: 'delimiter.square.freemarker2' },
				{ startIndex: 7, type: 'delimiter.square.freemarker2.interpolation' }
			]
		}
	],

	// Hash literals
	[
		// Can be used in directives
		{
			line: '<#assign s={"foo":9}>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.freemarker2' },
				{ startIndex: 10, type: 'operators.freemarker2' },
				{ startIndex: 11, type: 'delimiter.curly.freemarker2' },
				{ startIndex: 12, type: 'string.freemarker2' },
				{ startIndex: 17, type: 'delimiter.freemarker2' },
				{ startIndex: 18, type: 'number.freemarker2' },
				{ startIndex: 19, type: 'delimiter.curly.freemarker2' },
				{ startIndex: 20, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		// Can be used in interpolations
		{
			line: '[={"foo":9}.foo+4]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'delimiter.curly.freemarker2' },
				{ startIndex: 3, type: 'string.freemarker2' },
				{ startIndex: 8, type: 'delimiter.freemarker2' },
				{ startIndex: 9, type: 'number.freemarker2' },
				{ startIndex: 10, type: 'delimiter.curly.freemarker2' },
				{ startIndex: 11, type: 'delimiter.freemarker2' },
				{ startIndex: 12, type: 'identifier.freemarker2' },
				{ startIndex: 15, type: 'operators.freemarker2' },
				{ startIndex: 16, type: 'number.freemarker2' },
				{ startIndex: 17, type: 'delimiter.square.freemarker2.interpolation' }
			]
		}
	],

	// Comparison operators
	[
		{
			line: '[=a=b]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: 'operators.freemarker2' },
				{ startIndex: 4, type: 'identifier.freemarker2' },
				{ startIndex: 5, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=a==b]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: 'operators.freemarker2' },
				{ startIndex: 5, type: 'identifier.freemarker2' },
				{ startIndex: 6, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=a!=b]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: 'operators.freemarker2' },
				{ startIndex: 5, type: 'identifier.freemarker2' },
				{ startIndex: 6, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=a<b]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: 'operators.freemarker2' },
				{ startIndex: 4, type: 'identifier.freemarker2' },
				{ startIndex: 5, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=a lt b]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'operators.freemarker2' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'identifier.freemarker2' },
				{ startIndex: 8, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=a \\lt b]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'operators.freemarker2' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=a &lt; b]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'operators.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.freemarker2' },
				{ startIndex: 10, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=a<=b]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: 'operators.freemarker2' },
				{ startIndex: 5, type: 'identifier.freemarker2' },
				{ startIndex: 6, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=a \\lte b]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'operators.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.freemarker2' },
				{ startIndex: 10, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=a &lt;= b]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'operators.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'identifier.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=a>b]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: 'operators.freemarker2' },
				{ startIndex: 4, type: 'identifier.freemarker2' },
				{ startIndex: 5, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=a gt b]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'operators.freemarker2' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'identifier.freemarker2' },
				{ startIndex: 8, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=a \\gt b]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'operators.freemarker2' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=a &gt; b]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'operators.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.freemarker2' },
				{ startIndex: 10, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=a>=b]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: 'operators.freemarker2' },
				{ startIndex: 5, type: 'identifier.freemarker2' },
				{ startIndex: 6, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=a \\gte b]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'operators.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.freemarker2' },
				{ startIndex: 10, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=a &gt;= b]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'operators.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'identifier.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2.interpolation' }
			]
		}
	],
	// Assignment operators
	[
		{
			line: '<#assign a+=2>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.freemarker2' },
				{ startIndex: 10, type: 'operators.freemarker2' },
				{ startIndex: 12, type: 'number.freemarker2' },
				{ startIndex: 13, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#assign a-=2>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.freemarker2' },
				{ startIndex: 10, type: 'operators.freemarker2' },
				{ startIndex: 12, type: 'number.freemarker2' },
				{ startIndex: 13, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#assign a*=2>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.freemarker2' },
				{ startIndex: 10, type: 'operators.freemarker2' },
				{ startIndex: 12, type: 'number.freemarker2' },
				{ startIndex: 13, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#assign a/=2>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.freemarker2' },
				{ startIndex: 10, type: 'operators.freemarker2' },
				{ startIndex: 12, type: 'number.freemarker2' },
				{ startIndex: 13, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#assign a%=2>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.freemarker2' },
				{ startIndex: 10, type: 'operators.freemarker2' },
				{ startIndex: 12, type: 'number.freemarker2' },
				{ startIndex: 13, type: 'delimiter.angle.freemarker2.directive' }
			]
		}
	],

	// Increment operators
	[
		{
			line: '<#assign a++>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.freemarker2' },
				{ startIndex: 10, type: 'operators.freemarker2' },
				{ startIndex: 12, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#assign a-->',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.freemarker2' },
				{ startIndex: 10, type: 'operators.freemarker2' },
				{ startIndex: 12, type: 'delimiter.angle.freemarker2.directive' }
			]
		}
	],

	// Numerical operators
	[
		{
			line: '[=a+b]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: 'operators.freemarker2' },
				{ startIndex: 4, type: 'identifier.freemarker2' },
				{ startIndex: 5, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=a-b]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: 'operators.freemarker2' },
				{ startIndex: 4, type: 'identifier.freemarker2' },
				{ startIndex: 5, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=a*b]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: 'operators.freemarker2' },
				{ startIndex: 4, type: 'identifier.freemarker2' },
				{ startIndex: 5, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=a/b]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: 'operators.freemarker2' },
				{ startIndex: 4, type: 'identifier.freemarker2' },
				{ startIndex: 5, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=a%b]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: 'operators.freemarker2' },
				{ startIndex: 4, type: 'identifier.freemarker2' },
				{ startIndex: 5, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		// Not an operator, only used to index hashes
		// But still tokenized as 2 <TIMES> operators
		{
			line: '[=a**b]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: 'operators.freemarker2' },
				{ startIndex: 5, type: 'identifier.freemarker2' },
				{ startIndex: 6, type: 'delimiter.square.freemarker2.interpolation' }
			]
		}
	],

	// Missing value test operator
	[
		{
			line: '[=a??]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: 'operators.freemarker2' },
				{ startIndex: 5, type: 'delimiter.square.freemarker2.interpolation' }
			]
		}
	],

	// Lambdas
	[
		// Single argument without parentheses
		{
			line: '[=a?map(x->x*2)]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: 'operators.freemarker2' },
				{ startIndex: 4, type: 'identifier.freemarker2' },
				{ startIndex: 7, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 8, type: 'identifier.freemarker2' },
				{ startIndex: 9, type: 'meta.arrow.freemarker2' },
				{ startIndex: 11, type: 'identifier.freemarker2' },
				{ startIndex: 12, type: 'operators.freemarker2' },
				{ startIndex: 13, type: 'number.freemarker2' },
				{ startIndex: 14, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 15, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		// Alternative arrow representation
		{
			line: '[=a?map(x-&gt;x*2)]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: 'operators.freemarker2' },
				{ startIndex: 4, type: 'identifier.freemarker2' },
				{ startIndex: 7, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 8, type: 'identifier.freemarker2' },
				{ startIndex: 9, type: 'meta.arrow.freemarker2' },
				{ startIndex: 14, type: 'identifier.freemarker2' },
				{ startIndex: 15, type: 'operators.freemarker2' },
				{ startIndex: 16, type: 'number.freemarker2' },
				{ startIndex: 17, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 18, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		// Single argument with parentheses
		{
			line: '[=a?map((x)->x*2)]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: 'operators.freemarker2' },
				{ startIndex: 4, type: 'identifier.freemarker2' },
				{ startIndex: 7, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 9, type: 'identifier.freemarker2' },
				{ startIndex: 10, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 11, type: 'meta.arrow.freemarker2' },
				{ startIndex: 13, type: 'identifier.freemarker2' },
				{ startIndex: 14, type: 'operators.freemarker2' },
				{ startIndex: 15, type: 'number.freemarker2' },
				{ startIndex: 16, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 17, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		// Multiple arguments with parentheses
		{
			line: '[=a?map((x,y)->x*2)]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: 'operators.freemarker2' },
				{ startIndex: 4, type: 'identifier.freemarker2' },
				{ startIndex: 7, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 9, type: 'identifier.freemarker2' },
				{ startIndex: 10, type: 'delimiter.freemarker2' },
				{ startIndex: 11, type: 'identifier.freemarker2' },
				{ startIndex: 12, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 13, type: 'meta.arrow.freemarker2' },
				{ startIndex: 15, type: 'identifier.freemarker2' },
				{ startIndex: 16, type: 'operators.freemarker2' },
				{ startIndex: 17, type: 'number.freemarker2' },
				{ startIndex: 18, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 19, type: 'delimiter.square.freemarker2.interpolation' }
			]
		}
	],

	// Built-ins
	[
		{
			line: '[=x?length?string]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: 'operators.freemarker2' },
				{ startIndex: 4, type: 'identifier.freemarker2' },
				{ startIndex: 10, type: 'operators.freemarker2' },
				{ startIndex: 11, type: 'identifier.freemarker2' },
				{ startIndex: 17, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=x?string.currency]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: 'operators.freemarker2' },
				{ startIndex: 4, type: 'identifier.freemarker2' },
				{ startIndex: 10, type: 'delimiter.freemarker2' },
				{ startIndex: 11, type: 'identifier.freemarker2' },
				{ startIndex: 19, type: 'delimiter.square.freemarker2.interpolation' }
			]
		}
	],

	// Directives
	[
		// List
		{
			line: '<#list users as user></#list>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'identifier.freemarker2' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'keyword.as.freemarker2' },
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'identifier.freemarker2' },
				{ startIndex: 20, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 22, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 24, type: 'tag.freemarker2' },
				{ startIndex: 28, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		// Unknown directive
		{
			line: '<#foobar>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 8, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		// Directives with no expressions allowed, no closing slash
		{
			line: '<#attempt>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 9, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#attempt 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'number.freemarker2' },
				{ startIndex: 11, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#attempt />',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 11, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#recover>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 9, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#recover 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'number.freemarker2' },
				{ startIndex: 11, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#recover />',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 11, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#sep>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 5, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#sep 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'number.freemarker2' },
				{ startIndex: 7, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#sep />',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 7, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#autoesc>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 9, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#autoesc 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'number.freemarker2' },
				{ startIndex: 11, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#autoesc />',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 11, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#autoEsc>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 9, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#autoEsc 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'number.freemarker2' },
				{ startIndex: 11, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#autoEsc />',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 11, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#noautoesc>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 11, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#noautoesc 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'number.freemarker2' },
				{ startIndex: 13, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#noautoesc />',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 13, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#noAutoEsc>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 11, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#noAutoEsc 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'number.freemarker2' },
				{ startIndex: 13, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#noAutoEsc />',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 13, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#compress>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 10, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#compress 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'number.freemarker2' },
				{ startIndex: 12, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#compress />',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 12, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#default>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 9, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#default 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'number.freemarker2' },
				{ startIndex: 11, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#default />',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 11, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#noescape>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 10, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#noescape 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'number.freemarker2' },
				{ startIndex: 12, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#noescape />',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 12, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#noEscape>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 10, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#noEscape 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'number.freemarker2' },
				{ startIndex: 12, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#noEscape />',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 12, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		// Directives with no expressions allowed, closing slash allowed
		{
			line: '<#else>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 6, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#else/>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 6, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 7, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#else 1/>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'number.freemarker2' },
				{ startIndex: 8, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 9, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#break>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 7, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#break/>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 7, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 8, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#break 1/>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'number.freemarker2' },
				{ startIndex: 9, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 10, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#continue>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 10, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#continue/>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 10, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 11, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#continue 1/>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'number.freemarker2' },
				{ startIndex: 12, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 13, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#return>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#return/>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 9, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#stop>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 6, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#stop/>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 6, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 7, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#flush>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 7, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#flush/>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 7, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 8, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#flush 1/>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'number.freemarker2' },
				{ startIndex: 9, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 10, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#t>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 3, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#t/>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 3, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 4, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#t 1/>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.freemarker2' },
				{ startIndex: 5, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 6, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#lt>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#lt/>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 5, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#lt 1/>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'number.freemarker2' },
				{ startIndex: 6, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 7, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#rt>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#rt/>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 5, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#rt 1/>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'number.freemarker2' },
				{ startIndex: 6, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 7, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#lt>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#nt>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#nt/>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 5, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#nt 1/>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'number.freemarker2' },
				{ startIndex: 6, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 7, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#nested>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#nested/>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 9, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#recurse>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 9, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#recurse/>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 9, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 10, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#fallback>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 10, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#fallback/>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 10, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 11, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#fallback 1/>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'number.freemarker2' },
				{ startIndex: 12, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 13, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#ftl>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 5, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#ftl/>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 5, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 6, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		// Directives that allow expressions
		{
			line: '<#if 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'number.freemarker2' },
				{ startIndex: 6, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#elseif 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'number.freemarker2' },
				{ startIndex: 10, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#elseIf 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'number.freemarker2' },
				{ startIndex: 10, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#list 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'number.freemarker2' },
				{ startIndex: 8, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#foreach 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'number.freemarker2' },
				{ startIndex: 11, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#forEach 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'number.freemarker2' },
				{ startIndex: 11, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#switch 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'number.freemarker2' },
				{ startIndex: 10, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#case 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'number.freemarker2' },
				{ startIndex: 8, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#assign 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'number.freemarker2' },
				{ startIndex: 10, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#global 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'number.freemarker2' },
				{ startIndex: 10, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#local 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'number.freemarker2' },
				{ startIndex: 9, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#include 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'number.freemarker2' },
				{ startIndex: 11, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#import 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'number.freemarker2' },
				{ startIndex: 10, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#function 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'number.freemarker2' },
				{ startIndex: 12, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#macro 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'number.freemarker2' },
				{ startIndex: 9, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#transform 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'number.freemarker2' },
				{ startIndex: 13, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#visit 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'number.freemarker2' },
				{ startIndex: 9, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#stop 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'number.freemarker2' },
				{ startIndex: 8, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#return 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'number.freemarker2' },
				{ startIndex: 10, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#call 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'number.freemarker2' },
				{ startIndex: 8, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#setting 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'number.freemarker2' },
				{ startIndex: 11, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#outputformat 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'number.freemarker2' },
				{ startIndex: 16, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#outputFormat 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'number.freemarker2' },
				{ startIndex: 16, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#nested 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'number.freemarker2' },
				{ startIndex: 10, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#recurse 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'number.freemarker2' },
				{ startIndex: 11, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#escape 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'number.freemarker2' },
				{ startIndex: 10, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#ftl 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'number.freemarker2' },
				{ startIndex: 7, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<#items 1>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'number.freemarker2' },
				{ startIndex: 9, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		// Closable tags
		{
			line: '</#if>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 5, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '</#list>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 7, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '</#sep>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 6, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '</#recover>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 10, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '</#attempt>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 10, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '</#foreach>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 10, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '</#forEach>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 10, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '</#local>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 8, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '</#global>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 9, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '</#assign>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 9, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '</#function>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 11, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '</#macro>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 8, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '</#outputformat>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 15, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '</#outputFormat>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 15, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '</#autoesc>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 10, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '</#autoEsc>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 10, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '</#noautoesc>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 12, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '</#noAutoEsc>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 12, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '</#compress>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 11, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '</#transform>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 12, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '</#switch>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 9, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '</#escape>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 9, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '</#noescape>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 11, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '</#noEscape>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 11, type: 'delimiter.angle.freemarker2.directive' }
			]
		}
	],

	// Macro definitions
	[
		// No argument
		{
			line: '<#macro x></#macro>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.freemarker2' },
				{ startIndex: 9, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 11, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 13, type: 'tag.freemarker2' },
				{ startIndex: 18, type: 'delimiter.angle.freemarker2.directive' }
			]
		},

		// With arguments
		{
			line: '<#macro x a1 a2></#macro>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'identifier.freemarker2' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'identifier.freemarker2' },
				{ startIndex: 15, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 17, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 19, type: 'tag.freemarker2' },
				{ startIndex: 24, type: 'delimiter.angle.freemarker2.directive' }
			]
		},

		// Catch all parameter
		{
			line: '<#macro x foo...></#macro>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'identifier.freemarker2' },
				{ startIndex: 13, type: 'operators.freemarker2' },
				{ startIndex: 16, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 18, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 20, type: 'tag.freemarker2' },
				{ startIndex: 25, type: 'delimiter.angle.freemarker2.directive' }
			]
		}
	],

	// Macro calls
	[
		// Without content
		{
			line: '<@foo/>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 5, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 6, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		// With content and named ending tag
		{
			line: '<@foo>aaa</@foo>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 5, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 6, type: 'source.freemarker2' },
				{ startIndex: 9, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 10, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 12, type: 'tag.freemarker2' },
				{ startIndex: 15, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		// With content and unnamed ending tag
		{
			line: '<@foo>aaa</@>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 5, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 6, type: 'source.freemarker2' },
				{ startIndex: 9, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 10, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 12, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		// Special highlighting when the expression to call consists
		// solely of an identifier.
		{
			line: '<@foo>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 5, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<@foo >',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<@foo/>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 5, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 6, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		{
			line: '<@foo />',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 7, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		// Normal highlighting when the expression to call
		// is an expression.
		{
			line: '<@foo()/>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 5, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 7, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 8, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		// Positional parameters
		{
			line: '<@join [1] ":"/>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'delimiter.square.freemarker2' },
				{ startIndex: 8, type: 'number.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'string.freemarker2' },
				{ startIndex: 14, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 15, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		// Named parameters
		{
			line: '<@join arr=[1] sep=":"/>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'identifier.freemarker2' },
				{ startIndex: 10, type: 'operators.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2' },
				{ startIndex: 12, type: 'number.freemarker2' },
				{ startIndex: 13, type: 'delimiter.square.freemarker2' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'identifier.freemarker2' },
				{ startIndex: 18, type: 'operators.freemarker2' },
				{ startIndex: 19, type: 'string.freemarker2' },
				{ startIndex: 22, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 23, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		// ! should not end macro parameters
		{
			line: '<@join arr=[1]! sep=":"/>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'identifier.freemarker2' },
				{ startIndex: 10, type: 'operators.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2' },
				{ startIndex: 12, type: 'number.freemarker2' },
				{ startIndex: 13, type: 'delimiter.square.freemarker2' },
				{ startIndex: 14, type: 'operators.freemarker2' },
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'identifier.freemarker2' },
				{ startIndex: 19, type: 'operators.freemarker2' },
				{ startIndex: 20, type: 'string.freemarker2' },
				{ startIndex: 23, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 24, type: 'delimiter.angle.freemarker2.directive' }
			]
		},
		// repeat
		{
			line: '<@repeat count=4 ; c, halfc, last></@repeat>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.freemarker2' },
				{ startIndex: 14, type: 'operators.freemarker2' },
				{ startIndex: 15, type: 'number.freemarker2' },
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'delimiter.freemarker2' },
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'identifier.freemarker2' },
				{ startIndex: 20, type: 'delimiter.freemarker2' },
				{ startIndex: 21, type: '' },
				{ startIndex: 22, type: 'identifier.freemarker2' },
				{ startIndex: 27, type: 'delimiter.freemarker2' },
				{ startIndex: 28, type: '' },
				{ startIndex: 29, type: 'identifier.freemarker2' },
				{ startIndex: 33, type: 'delimiter.angle.freemarker2.directive' },
				{ startIndex: 35, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 37, type: 'tag.freemarker2' },
				{ startIndex: 43, type: 'delimiter.angle.freemarker2.directive' }
			]
		}
	],

	// Hash keys
	[
		// Normal hash keys (dot notation)
		{
			line: '[=a.a]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: 'delimiter.freemarker2' },
				{ startIndex: 4, type: 'identifier.freemarker2' },
				{ startIndex: 5, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		// Normal hash keys (square bracket notation)
		{
			line: '[=a["a"]]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: 'delimiter.square.freemarker2' },
				{ startIndex: 4, type: 'string.freemarker2' },
				{ startIndex: 7, type: 'delimiter.square.freemarker2' },
				{ startIndex: 8, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		// Special hash keys (dot notation, these are usually operators / keywords)
		{
			line: '[=a.*]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: 'delimiter.freemarker2' },
				{ startIndex: 4, type: 'identifier.freemarker2' },
				{ startIndex: 5, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=a.**]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: 'delimiter.freemarker2' },
				{ startIndex: 4, type: 'identifier.freemarker2' },
				{ startIndex: 6, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=a.false]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: 'delimiter.freemarker2' },
				{ startIndex: 4, type: 'identifier.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=a.true]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: 'delimiter.freemarker2' },
				{ startIndex: 4, type: 'identifier.freemarker2' },
				{ startIndex: 8, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=a.in]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: 'delimiter.freemarker2' },
				{ startIndex: 4, type: 'identifier.freemarker2' },
				{ startIndex: 6, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=a.as]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: 'delimiter.freemarker2' },
				{ startIndex: 4, type: 'identifier.freemarker2' },
				{ startIndex: 6, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=a.using]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: 'delimiter.freemarker2' },
				{ startIndex: 4, type: 'identifier.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		// Spaces are allowed
		{
			line: '[=a  .  **]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: '' },
				{ startIndex: 5, type: 'delimiter.freemarker2' },
				{ startIndex: 6, type: '' },
				{ startIndex: 8, type: 'identifier.freemarker2' },
				{ startIndex: 10, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		// *** is not a valid key name
		{
			line: '[=a.***]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: 'delimiter.freemarker2' },
				{ startIndex: 4, type: 'identifier.freemarker2' },
				{ startIndex: 6, type: 'operators.freemarker2' },
				{ startIndex: 7, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		// Special hash keys (square bracket notation)
		{
			line: '[=a["**"]]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 3, type: 'delimiter.square.freemarker2' },
				{ startIndex: 4, type: 'string.freemarker2' },
				{ startIndex: 8, type: 'delimiter.square.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2.interpolation' }
			]
		}
	],

	// noparse (ignores everything until the matching closing tag)
	[
		{
			line: 'x[#noparse]a',
			tokens: [
				{ startIndex: 0, type: 'source.freemarker2' },
				{ startIndex: 1, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 2, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 10, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 11, type: 'source.freemarker2' }
			]
		},
		{
			line: 'b [#if][/#if] [/#noParse] [!-- ... --]',
			tokens: [{ startIndex: 0, type: 'source.freemarker2' }]
		},
		{
			line: 'c[/#noparse]y',
			tokens: [
				{ startIndex: 0, type: 'source.freemarker2' },
				{ startIndex: 1, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 2, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 4, type: 'tag.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 12, type: 'source.freemarker2' }
			]
		}
	],

	// noParse (ignores everything until the matching closing tag)
	[
		{
			line: 'x[#noParse]a',
			tokens: [
				{ startIndex: 0, type: 'source.freemarker2' },
				{ startIndex: 1, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 2, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 10, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 11, type: 'source.freemarker2' }
			]
		},
		{
			line: 'b [#if][/#if] [/#noparse] [!-- ... --]',
			tokens: [{ startIndex: 0, type: 'source.freemarker2' }]
		},
		{
			line: 'c[/#noParse]y',
			tokens: [
				{ startIndex: 0, type: 'source.freemarker2' },
				{ startIndex: 1, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 2, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 4, type: 'tag.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 12, type: 'source.freemarker2' }
			]
		}
	],

	// Closing angle bracket treatment
	[
		// Comparison operator when inside an interpolation
		{
			line: '[=1>2]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'number.freemarker2' },
				{ startIndex: 3, type: 'operators.freemarker2' },
				{ startIndex: 4, type: 'number.freemarker2' },
				{ startIndex: 5, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=1>=2]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'number.freemarker2' },
				{ startIndex: 3, type: 'operators.freemarker2' },
				{ startIndex: 5, type: 'number.freemarker2' },
				{ startIndex: 6, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		// Normal comparison operator within a directive
		{
			line: '[#if 1>2][/#if]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'number.freemarker2' },
				{ startIndex: 6, type: 'operators.freemarker2' },
				{ startIndex: 7, type: 'number.freemarker2' },
				{ startIndex: 8, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 10, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 12, type: 'tag.freemarker2' },
				{ startIndex: 14, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#if (1>2)][/#if]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 6, type: 'number.freemarker2' },
				{ startIndex: 7, type: 'operators.freemarker2' },
				{ startIndex: 8, type: 'number.freemarker2' },
				{ startIndex: 9, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 10, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 12, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 14, type: 'tag.freemarker2' },
				{ startIndex: 16, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#if (1>=2)][/#if]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 6, type: 'number.freemarker2' },
				{ startIndex: 7, type: 'operators.freemarker2' },
				{ startIndex: 9, type: 'number.freemarker2' },
				{ startIndex: 10, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 13, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 15, type: 'tag.freemarker2' },
				{ startIndex: 17, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#if [1>2]][/#if]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'delimiter.square.freemarker2' },
				{ startIndex: 6, type: 'number.freemarker2' },
				{ startIndex: 7, type: 'operators.freemarker2' },
				{ startIndex: 8, type: 'number.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2' },
				{ startIndex: 10, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 12, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 14, type: 'tag.freemarker2' },
				{ startIndex: 16, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#if [(1>2)]][/#if]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'delimiter.square.freemarker2' },
				{ startIndex: 6, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 7, type: 'number.freemarker2' },
				{ startIndex: 8, type: 'operators.freemarker2' },
				{ startIndex: 9, type: 'number.freemarker2' },
				{ startIndex: 10, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2' },
				{ startIndex: 12, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 14, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 16, type: 'tag.freemarker2' },
				{ startIndex: 18, type: 'delimiter.square.freemarker2.directive' }
			]
		}
	],

	// Mismatched closing bracket / parenthesis does not end expression mode
	[
		// Interpolation
		{
			line: '[=)1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 3, type: 'number.freemarker2' },
				{ startIndex: 4, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=}1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'delimiter.curly.freemarker2' },
				{ startIndex: 3, type: 'number.freemarker2' },
				{ startIndex: 4, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		{
			line: '[=>1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'operators.freemarker2' },
				{ startIndex: 3, type: 'number.freemarker2' },
				{ startIndex: 4, type: 'delimiter.square.freemarker2.interpolation' }
			]
		},
		// Directive
		{
			line: '[#if )1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 6, type: 'number.freemarker2' },
				{ startIndex: 7, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#if }1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'delimiter.curly.freemarker2' },
				{ startIndex: 6, type: 'number.freemarker2' },
				{ startIndex: 7, type: 'delimiter.square.freemarker2.directive' }
			]
		}
	],
	// List literals
	[
		// Can be used in directives
		{
			line: '[#assign s=[1,2]]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.freemarker2' },
				{ startIndex: 10, type: 'operators.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2' },
				{ startIndex: 12, type: 'number.freemarker2' },
				{ startIndex: 13, type: 'delimiter.freemarker2' },
				{ startIndex: 14, type: 'number.freemarker2' },
				{ startIndex: 15, type: 'delimiter.square.freemarker2' },
				{ startIndex: 16, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		// Can be used in interpolations
		{
			line: '[=[1,2]]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'delimiter.square.freemarker2' },
				{ startIndex: 3, type: 'number.freemarker2' },
				{ startIndex: 4, type: 'delimiter.freemarker2' },
				{ startIndex: 5, type: 'number.freemarker2' },
				{ startIndex: 6, type: 'delimiter.square.freemarker2' },
				{ startIndex: 7, type: 'delimiter.square.freemarker2.interpolation' }
			]
		}
	],

	// Hash literals
	[
		// Can be used in directives
		{
			line: '[#assign s={"foo":9}]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.freemarker2' },
				{ startIndex: 10, type: 'operators.freemarker2' },
				{ startIndex: 11, type: 'delimiter.curly.freemarker2' },
				{ startIndex: 12, type: 'string.freemarker2' },
				{ startIndex: 17, type: 'delimiter.freemarker2' },
				{ startIndex: 18, type: 'number.freemarker2' },
				{ startIndex: 19, type: 'delimiter.curly.freemarker2' },
				{ startIndex: 20, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		// Can be used in interpolations
		{
			line: '[={"foo":9}.foo+4]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.interpolation' },
				{ startIndex: 1, type: 'delimiter.interpolation.freemarker2' },
				{ startIndex: 2, type: 'delimiter.curly.freemarker2' },
				{ startIndex: 3, type: 'string.freemarker2' },
				{ startIndex: 8, type: 'delimiter.freemarker2' },
				{ startIndex: 9, type: 'number.freemarker2' },
				{ startIndex: 10, type: 'delimiter.curly.freemarker2' },
				{ startIndex: 11, type: 'delimiter.freemarker2' },
				{ startIndex: 12, type: 'identifier.freemarker2' },
				{ startIndex: 15, type: 'operators.freemarker2' },
				{ startIndex: 16, type: 'number.freemarker2' },
				{ startIndex: 17, type: 'delimiter.square.freemarker2.interpolation' }
			]
		}
	],
	// Assignment operators
	[
		{
			line: '[#assign a+=2]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.freemarker2' },
				{ startIndex: 10, type: 'operators.freemarker2' },
				{ startIndex: 12, type: 'number.freemarker2' },
				{ startIndex: 13, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#assign a-=2]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.freemarker2' },
				{ startIndex: 10, type: 'operators.freemarker2' },
				{ startIndex: 12, type: 'number.freemarker2' },
				{ startIndex: 13, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#assign a*=2]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.freemarker2' },
				{ startIndex: 10, type: 'operators.freemarker2' },
				{ startIndex: 12, type: 'number.freemarker2' },
				{ startIndex: 13, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#assign a/=2]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.freemarker2' },
				{ startIndex: 10, type: 'operators.freemarker2' },
				{ startIndex: 12, type: 'number.freemarker2' },
				{ startIndex: 13, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#assign a%=2]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.freemarker2' },
				{ startIndex: 10, type: 'operators.freemarker2' },
				{ startIndex: 12, type: 'number.freemarker2' },
				{ startIndex: 13, type: 'delimiter.square.freemarker2.directive' }
			]
		}
	],

	// Increment operators
	[
		{
			line: '[#assign a++]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.freemarker2' },
				{ startIndex: 10, type: 'operators.freemarker2' },
				{ startIndex: 12, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#assign a--]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.freemarker2' },
				{ startIndex: 10, type: 'operators.freemarker2' },
				{ startIndex: 12, type: 'delimiter.square.freemarker2.directive' }
			]
		}
	],
	// Directives
	[
		// List
		{
			line: '[#list users as user][/#list]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'identifier.freemarker2' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'keyword.as.freemarker2' },
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'identifier.freemarker2' },
				{ startIndex: 20, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 22, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 24, type: 'tag.freemarker2' },
				{ startIndex: 28, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		// Unknown directive
		{
			line: '[#foobar]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 8, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		// Directives with no expressions allowed, no closing slash
		{
			line: '[#attempt]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#attempt 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'number.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#attempt /]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#recover]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#recover 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'number.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#recover /]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#sep]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 5, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#sep 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'number.freemarker2' },
				{ startIndex: 7, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#sep /]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 7, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#autoesc]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#autoesc 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'number.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#autoesc /]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#autoEsc]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#autoEsc 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'number.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#autoEsc /]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#noautoesc]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#noautoesc 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'number.freemarker2' },
				{ startIndex: 13, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#noautoesc /]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 13, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#noAutoEsc]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#noAutoEsc 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'number.freemarker2' },
				{ startIndex: 13, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#noAutoEsc /]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 13, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#compress]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 10, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#compress 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'number.freemarker2' },
				{ startIndex: 12, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#compress /]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 12, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#default]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#default 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'number.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#default /]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#noescape]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 10, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#noescape 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'number.freemarker2' },
				{ startIndex: 12, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#noescape /]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 12, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#noEscape]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 10, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#noEscape 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'number.freemarker2' },
				{ startIndex: 12, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#noEscape /]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 12, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		// Directives with no expressions allowed, closing slash allowed
		{
			line: '[#else]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 6, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#else/]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 6, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 7, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#else 1/]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'number.freemarker2' },
				{ startIndex: 8, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#break]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 7, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#break/]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 7, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 8, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#break 1/]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'number.freemarker2' },
				{ startIndex: 9, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 10, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#continue]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 10, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#continue/]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 10, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#continue 1/]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'number.freemarker2' },
				{ startIndex: 12, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 13, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#return]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#return/]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#stop]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 6, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#stop/]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 6, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 7, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#flush]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 7, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#flush/]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 7, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 8, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#flush 1/]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'number.freemarker2' },
				{ startIndex: 9, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 10, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#t]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 3, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#t/]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 3, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 4, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#t 1/]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.freemarker2' },
				{ startIndex: 5, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 6, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#lt]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#lt/]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 5, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#lt 1/]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'number.freemarker2' },
				{ startIndex: 6, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 7, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#rt]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#rt/]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 5, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#rt 1/]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'number.freemarker2' },
				{ startIndex: 6, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 7, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#lt]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#nt]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#nt/]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 5, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#nt 1/]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'number.freemarker2' },
				{ startIndex: 6, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 7, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#nested]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#nested/]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#recurse]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#recurse/]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 9, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 10, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#fallback]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 10, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#fallback/]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 10, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#fallback 1/]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.invalid.freemarker2' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'number.freemarker2' },
				{ startIndex: 12, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 13, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#ftl]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 5, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#ftl/]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 5, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 6, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		// Directives that allow expressions
		{
			line: '[#if 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'number.freemarker2' },
				{ startIndex: 6, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#elseif 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'number.freemarker2' },
				{ startIndex: 10, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#elseIf 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'number.freemarker2' },
				{ startIndex: 10, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#list 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'number.freemarker2' },
				{ startIndex: 8, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#foreach 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'number.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#forEach 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'number.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#switch 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'number.freemarker2' },
				{ startIndex: 10, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#case 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'number.freemarker2' },
				{ startIndex: 8, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#assign 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'number.freemarker2' },
				{ startIndex: 10, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#global 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'number.freemarker2' },
				{ startIndex: 10, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#local 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'number.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#include 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'number.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#import 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'number.freemarker2' },
				{ startIndex: 10, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#function 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'number.freemarker2' },
				{ startIndex: 12, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#macro 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'number.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#transform 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'number.freemarker2' },
				{ startIndex: 13, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#visit 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'number.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#stop 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'number.freemarker2' },
				{ startIndex: 8, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#return 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'number.freemarker2' },
				{ startIndex: 10, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#call 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'number.freemarker2' },
				{ startIndex: 8, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#setting 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'number.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#outputformat 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'number.freemarker2' },
				{ startIndex: 16, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#outputFormat 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'number.freemarker2' },
				{ startIndex: 16, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#nested 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'number.freemarker2' },
				{ startIndex: 10, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#recurse 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'number.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#escape 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'number.freemarker2' },
				{ startIndex: 10, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#ftl 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'number.freemarker2' },
				{ startIndex: 7, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[#items 1]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'number.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		// Closable tags
		{
			line: '[/#if]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 5, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[/#list]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 7, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[/#sep]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 6, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[/#recover]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 10, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[/#attempt]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 10, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[/#foreach]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 10, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[/#forEach]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 10, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[/#local]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 8, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[/#global]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[/#assign]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[/#function]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[/#macro]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 8, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[/#outputformat]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 15, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[/#outputFormat]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 15, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[/#autoesc]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 10, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[/#autoEsc]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 10, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[/#noautoesc]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 12, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[/#noAutoEsc]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 12, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[/#compress]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[/#transform]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 12, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[/#switch]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[/#escape]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[/#noescape]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[/#noEscape]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 3, type: 'tag.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2.directive' }
			]
		}
	],

	// Macro definitions
	[
		// No argument
		{
			line: '[#macro x][/#macro]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 11, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 13, type: 'tag.freemarker2' },
				{ startIndex: 18, type: 'delimiter.square.freemarker2.directive' }
			]
		},

		// With arguments
		{
			line: '[#macro x a1 a2][/#macro]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'identifier.freemarker2' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'identifier.freemarker2' },
				{ startIndex: 15, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 17, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 19, type: 'tag.freemarker2' },
				{ startIndex: 24, type: 'delimiter.square.freemarker2.directive' }
			]
		},

		// Catch all parameter
		{
			line: '[#macro x foo...][/#macro]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.freemarker2' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'identifier.freemarker2' },
				{ startIndex: 13, type: 'operators.freemarker2' },
				{ startIndex: 16, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 18, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 20, type: 'tag.freemarker2' },
				{ startIndex: 25, type: 'delimiter.square.freemarker2.directive' }
			]
		}
	],

	// Macro calls
	[
		// Without content
		{
			line: '[@foo/]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 5, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 6, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		// With content and named ending tag
		{
			line: '[@foo]aaa[/@foo]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 5, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 6, type: 'source.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 10, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 12, type: 'tag.freemarker2' },
				{ startIndex: 15, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		// With content and unnamed ending tag
		{
			line: '[@foo]aaa[/@]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 5, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 6, type: 'source.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 10, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 12, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		// Special highlighting when the expression to call consists
		// solely of an identifier.
		{
			line: '[@foo]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 5, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[@foo ]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[@foo/]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 5, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 6, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		{
			line: '[@foo /]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 7, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		// Normal highlighting when the expression to call
		// is an expression.
		{
			line: '[@foo()/]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'identifier.freemarker2' },
				{ startIndex: 5, type: 'delimiter.parenthesis.freemarker2' },
				{ startIndex: 7, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 8, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		// Positional parameters
		{
			line: '[@join [1] ":"/]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'delimiter.square.freemarker2' },
				{ startIndex: 8, type: 'number.freemarker2' },
				{ startIndex: 9, type: 'delimiter.square.freemarker2' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'string.freemarker2' },
				{ startIndex: 14, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 15, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		// Named parameters
		{
			line: '[@join arr=[1] sep=":"/]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'identifier.freemarker2' },
				{ startIndex: 10, type: 'operators.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2' },
				{ startIndex: 12, type: 'number.freemarker2' },
				{ startIndex: 13, type: 'delimiter.square.freemarker2' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'identifier.freemarker2' },
				{ startIndex: 18, type: 'operators.freemarker2' },
				{ startIndex: 19, type: 'string.freemarker2' },
				{ startIndex: 22, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 23, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		// ! should not end macro parameters
		{
			line: '[@join arr=[1]! sep=":"/]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'identifier.freemarker2' },
				{ startIndex: 10, type: 'operators.freemarker2' },
				{ startIndex: 11, type: 'delimiter.square.freemarker2' },
				{ startIndex: 12, type: 'number.freemarker2' },
				{ startIndex: 13, type: 'delimiter.square.freemarker2' },
				{ startIndex: 14, type: 'operators.freemarker2' },
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'identifier.freemarker2' },
				{ startIndex: 19, type: 'operators.freemarker2' },
				{ startIndex: 20, type: 'string.freemarker2' },
				{ startIndex: 23, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 24, type: 'delimiter.square.freemarker2.directive' }
			]
		},
		// repeat
		{
			line: '[@repeat count=4 ; c, halfc, last][/@repeat]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 1, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 2, type: 'tag.freemarker2' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.freemarker2' },
				{ startIndex: 14, type: 'operators.freemarker2' },
				{ startIndex: 15, type: 'number.freemarker2' },
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'delimiter.freemarker2' },
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'identifier.freemarker2' },
				{ startIndex: 20, type: 'delimiter.freemarker2' },
				{ startIndex: 21, type: '' },
				{ startIndex: 22, type: 'identifier.freemarker2' },
				{ startIndex: 27, type: 'delimiter.freemarker2' },
				{ startIndex: 28, type: '' },
				{ startIndex: 29, type: 'identifier.freemarker2' },
				{ startIndex: 33, type: 'delimiter.square.freemarker2.directive' },
				{ startIndex: 35, type: 'delimiter.directive.freemarker2' },
				{ startIndex: 37, type: 'tag.freemarker2' },
				{ startIndex: 43, type: 'delimiter.square.freemarker2.directive' }
			]
		}
	]
]);
