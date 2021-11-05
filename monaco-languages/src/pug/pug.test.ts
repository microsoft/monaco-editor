/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('pug', [
	// Tags [Pug]
	[
		{
			line: 'p 5',
			tokens: [
				{ startIndex: 0, type: 'tag.pug' },
				{ startIndex: 1, type: '' }
			]
		}
	],

	[
		{
			line: 'div#container.stuff',
			tokens: [
				{ startIndex: 0, type: 'tag.pug' },
				{ startIndex: 3, type: 'tag.id.pug' },
				{ startIndex: 13, type: 'tag.class.pug' }
			]
		}
	],

	[
		{
			line: 'div.container#stuff',
			tokens: [
				{ startIndex: 0, type: 'tag.pug' },
				{ startIndex: 3, type: 'tag.class.pug' },
				{ startIndex: 13, type: 'tag.id.pug' }
			]
		}
	],

	[
		{
			line: 'div.container#stuff .container',
			tokens: [
				{ startIndex: 0, type: 'tag.pug' },
				{ startIndex: 3, type: 'tag.class.pug' },
				{ startIndex: 13, type: 'tag.id.pug' },
				{ startIndex: 19, type: '' }
			]
		}
	],

	[
		{
			line: '#tag-id-1',
			tokens: [{ startIndex: 0, type: 'tag.id.pug' }]
		}
	],

	[
		{
			line: '.tag-id-1',
			tokens: [{ startIndex: 0, type: 'tag.class.pug' }]
		}
	],

	// Attributes - Single Line [Pug]
	[
		{
			line: 'input(type="checkbox")',
			tokens: [
				{ startIndex: 0, type: 'tag.pug' },
				{ startIndex: 5, type: 'delimiter.parenthesis.pug' },
				{ startIndex: 6, type: 'attribute.name.pug' },
				{ startIndex: 10, type: 'delimiter.pug' },
				{ startIndex: 11, type: 'attribute.value.pug' },
				{ startIndex: 21, type: 'delimiter.parenthesis.pug' }
			]
		}
	],

	[
		{
			line: 'input (type="checkbox")',
			tokens: [
				{ startIndex: 0, type: 'tag.pug' },
				{ startIndex: 5, type: '' }
			]
		}
	],

	[
		{
			line: 'input(type="checkbox",name="agreement",checked)',
			tokens: [
				{ startIndex: 0, type: 'tag.pug' },
				{ startIndex: 5, type: 'delimiter.parenthesis.pug' },
				{ startIndex: 6, type: 'attribute.name.pug' },
				{ startIndex: 10, type: 'delimiter.pug' },
				{ startIndex: 11, type: 'attribute.value.pug' },
				{ startIndex: 21, type: 'attribute.delimiter.pug' },
				{ startIndex: 22, type: 'attribute.name.pug' },
				{ startIndex: 26, type: 'delimiter.pug' },
				{ startIndex: 27, type: 'attribute.value.pug' },
				{ startIndex: 38, type: 'attribute.delimiter.pug' },
				{ startIndex: 39, type: 'attribute.name.pug' },
				{ startIndex: 46, type: 'delimiter.parenthesis.pug' }
			]
		}
	],

	[
		{
			line: 'input(type="checkbox"',
			tokens: [
				{ startIndex: 0, type: 'tag.pug' },
				{ startIndex: 5, type: 'delimiter.parenthesis.pug' },
				{ startIndex: 6, type: 'attribute.name.pug' },
				{ startIndex: 10, type: 'delimiter.pug' },
				{ startIndex: 11, type: 'attribute.value.pug' }
			]
		},
		{
			line: 'name="agreement"',
			tokens: [
				{ startIndex: 0, type: 'attribute.name.pug' },
				{ startIndex: 4, type: 'delimiter.pug' },
				{ startIndex: 5, type: 'attribute.value.pug' }
			]
		},
		{
			line: 'checked)',
			tokens: [
				{ startIndex: 0, type: 'attribute.name.pug' },
				{ startIndex: 7, type: 'delimiter.parenthesis.pug' }
			]
		},
		{
			line: 'body',
			tokens: [{ startIndex: 0, type: 'tag.pug' }]
		}
	],

	// Attributes - MultiLine [Pug]
	[
		{
			line: 'input(type="checkbox"',
			tokens: [
				{ startIndex: 0, type: 'tag.pug' },
				{ startIndex: 5, type: 'delimiter.parenthesis.pug' },
				{ startIndex: 6, type: 'attribute.name.pug' },
				{ startIndex: 10, type: 'delimiter.pug' },
				{ startIndex: 11, type: 'attribute.value.pug' }
			]
		},
		{
			line: 'disabled',
			tokens: [{ startIndex: 0, type: 'attribute.name.pug' }]
		},
		{
			line: 'checked)',
			tokens: [
				{ startIndex: 0, type: 'attribute.name.pug' },
				{ startIndex: 7, type: 'delimiter.parenthesis.pug' }
			]
		},
		{
			line: 'body',
			tokens: [{ startIndex: 0, type: 'tag.pug' }]
		}
	],

	// Interpolation [Pug]
	[
		{
			line: 'p print #{count} lines',
			tokens: [
				{ startIndex: 0, type: 'tag.pug' },
				{ startIndex: 1, type: '' },
				{ startIndex: 8, type: 'interpolation.delimiter.pug' },
				{ startIndex: 10, type: 'interpolation.pug' },
				{ startIndex: 15, type: 'interpolation.delimiter.pug' },
				{ startIndex: 16, type: '' }
			]
		}
	],

	[
		{
			line: 'p print "#{count}" lines',
			tokens: [
				{ startIndex: 0, type: 'tag.pug' },
				{ startIndex: 1, type: '' },
				{ startIndex: 9, type: 'interpolation.delimiter.pug' },
				{ startIndex: 11, type: 'interpolation.pug' },
				{ startIndex: 16, type: 'interpolation.delimiter.pug' },
				{ startIndex: 17, type: '' }
			]
		}
	],

	[
		{
			line: '{ key: 123 }',
			tokens: [
				{ startIndex: 0, type: 'delimiter.curly.pug' },
				{ startIndex: 1, type: '' },
				{ startIndex: 5, type: 'delimiter.pug' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'number.pug' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'delimiter.curly.pug' }
			]
		}
	],

	// Comments - Single Line [Pug]
	[
		{
			line: '// html#id1.class1',
			tokens: [{ startIndex: 0, type: 'comment.pug' }]
		}
	],

	[
		{
			line: 'body hello // not a comment 123',
			tokens: [
				{ startIndex: 0, type: 'tag.pug' },
				{ startIndex: 4, type: '' }
			]
		}
	],

	// Comments - MultiLine [Pug]
	[
		{
			line: '//',
			tokens: [{ startIndex: 0, type: 'comment.pug' }]
		},
		{
			line: '    should be a comment',
			tokens: [{ startIndex: 0, type: 'comment.pug' }]
		},
		{
			line: '    should still be a comment',
			tokens: [{ startIndex: 0, type: 'comment.pug' }]
		},
		{
			line: 'div should not be a comment',
			tokens: [
				{ startIndex: 0, type: 'tag.pug' },
				{ startIndex: 3, type: '' }
			]
		}
	],

	// Code [Pug]
	[
		{
			line: '- var a = 1',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'keyword.var.pug' },
				{ startIndex: 5, type: '' },
				{ startIndex: 8, type: 'delimiter.pug' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'number.pug' }
			]
		}
	],

	[
		{
			line: 'each item in items',
			tokens: [
				{ startIndex: 0, type: 'keyword.each.pug' },
				{ startIndex: 4, type: '' },
				{ startIndex: 10, type: 'keyword.in.pug' },
				{ startIndex: 12, type: '' }
			]
		}
	],

	[
		{
			line: '- var html = "<script></script>"',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'keyword.var.pug' },
				{ startIndex: 5, type: '' },
				{ startIndex: 11, type: 'delimiter.pug' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'string.pug' }
			]
		}
	],

	// Generated from sample
	[
		{
			line: 'doctype 5',
			tokens: [
				{ startIndex: 0, type: 'keyword.doctype.pug' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'number.pug' }
			]
		},
		{
			line: 'html(lang="en")',
			tokens: [
				{ startIndex: 0, type: 'tag.pug' },
				{ startIndex: 4, type: 'delimiter.parenthesis.pug' },
				{ startIndex: 5, type: 'attribute.name.pug' },
				{ startIndex: 9, type: 'delimiter.pug' },
				{ startIndex: 10, type: 'attribute.value.pug' },
				{ startIndex: 14, type: 'delimiter.parenthesis.pug' }
			]
		},
		{
			line: '    head',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'tag.pug' }
			]
		},
		{
			line: '        title= pageTitle',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 8, type: 'tag.pug' },
				{ startIndex: 13, type: '' }
			]
		},
		{
			line: "        script(type='text/javascript')",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 8, type: 'tag.pug' },
				{ startIndex: 14, type: 'delimiter.parenthesis.pug' },
				{ startIndex: 15, type: 'attribute.name.pug' },
				{ startIndex: 19, type: 'delimiter.pug' },
				{ startIndex: 20, type: 'attribute.value.pug' },
				{ startIndex: 37, type: 'delimiter.parenthesis.pug' }
			]
		},
		{
			line: '            if (foo) {',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 12, type: 'keyword.if.pug' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'delimiter.parenthesis.pug' },
				{ startIndex: 16, type: '' },
				{ startIndex: 19, type: 'delimiter.parenthesis.pug' },
				{ startIndex: 20, type: '' },
				{ startIndex: 21, type: 'delimiter.curly.pug' }
			]
		},
		{
			line: '                bar()',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 19, type: 'delimiter.parenthesis.pug' }
			]
		},
		{
			line: '            }',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 12, type: 'delimiter.curly.pug' }
			]
		},
		{
			line: '    body',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'tag.pug' }
			]
		},
		{
			line: '        // Disclaimer: You will need to turn insertSpaces to true in order for the',
			tokens: [{ startIndex: 0, type: 'comment.pug' }]
		},
		{
			line: '         syntax highlighting to kick in properly (especially for comments)',
			tokens: [{ startIndex: 0, type: 'comment.pug' }]
		},
		{
			line: '            Enjoy :)',
			tokens: [{ startIndex: 0, type: 'comment.pug' }]
		},
		{
			line: '        h1 Pug - node template engine if in',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 8, type: 'tag.pug' },
				{ startIndex: 10, type: '' }
			]
		},
		{
			line: '        p.',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 8, type: 'tag.pug' },
				{ startIndex: 9, type: 'delimiter.pug' }
			]
		},
		{
			line: '          text ',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '            text',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '          #container',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '         #container',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '        #container',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 8, type: 'tag.id.pug' }
			]
		},
		{
			line: '          if youAreUsingPug',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 10, type: 'keyword.if.pug' },
				{ startIndex: 12, type: '' }
			]
		},
		{
			line: '            p You are amazing',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 12, type: 'tag.pug' },
				{ startIndex: 13, type: '' }
			]
		},
		{
			line: '          else',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 10, type: 'keyword.else.pug' }
			]
		},
		{
			line: '            p Get on it!',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 12, type: 'tag.pug' },
				{ startIndex: 13, type: '' }
			]
		},
		{
			line: '     p Text can be included in a number of different ways.',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 5, type: 'tag.pug' },
				{ startIndex: 6, type: '' }
			]
		}
	]
]);
