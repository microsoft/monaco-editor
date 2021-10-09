/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('css', [
	// Skip whitespace
	[
		{
			line: '      body',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 6, type: 'tag.css' }
			]
		}
	],

	// CSS rule
	//	body {
	//	  margin: 0;
	//	  padding: 3em 6em;
	//	  font-family: tahoma, arial, sans-serif;
	//	  text-decoration: none !important;
	//	  color: #000
	//	}
	[
		{
			line: 'body {',
			tokens: [
				{ startIndex: 0, type: 'tag.css' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'delimiter.bracket.css' }
			]
		},
		{
			line: '  margin: 0;',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'attribute.name.css' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'attribute.value.number.css' },
				{ startIndex: 11, type: 'delimiter.css' }
			]
		},
		{
			line: '  padding: 3em 6em;',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'attribute.name.css' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'attribute.value.number.css' },
				{ startIndex: 12, type: 'attribute.value.unit.css' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'attribute.value.number.css' },
				{ startIndex: 16, type: 'attribute.value.unit.css' },
				{ startIndex: 18, type: 'delimiter.css' }
			]
		},
		{
			line: '  font-family: tahoma, arial, sans-serif;',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'attribute.name.css' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'attribute.value.css' },
				{ startIndex: 21, type: 'delimiter.css' },
				{ startIndex: 22, type: '' },
				{ startIndex: 23, type: 'attribute.value.css' },
				{ startIndex: 28, type: 'delimiter.css' },
				{ startIndex: 29, type: '' },
				{ startIndex: 30, type: 'attribute.value.css' },
				{ startIndex: 40, type: 'delimiter.css' }
			]
		},
		{
			line: '  text-decoration: none !important;',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'attribute.name.css' },
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'attribute.value.css' },
				{ startIndex: 23, type: '' },
				{ startIndex: 24, type: 'keyword.css' },
				{ startIndex: 34, type: 'delimiter.css' }
			]
		},
		{
			line: '  color: #000',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'attribute.name.css' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'attribute.value.hex.css' }
			]
		},
		{
			line: '  }',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'delimiter.bracket.css' }
			]
		}
	],

	// CSS units and numbers
	[
		{
			line: '* { padding: 3em -9pt -0.5px; }',
			tokens: [
				{ startIndex: 0, type: 'tag.css' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.bracket.css' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'attribute.name.css' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'attribute.value.number.css' },
				{ startIndex: 14, type: 'attribute.value.unit.css' },
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'attribute.value.number.css' },
				{ startIndex: 19, type: 'attribute.value.unit.css' },
				{ startIndex: 21, type: '' },
				{ startIndex: 22, type: 'attribute.value.number.css' },
				{ startIndex: 26, type: 'attribute.value.unit.css' },
				{ startIndex: 28, type: 'delimiter.css' },
				{ startIndex: 29, type: '' },
				{ startIndex: 30, type: 'delimiter.bracket.css' }
			]
		}
	],

	// CSS unfinished unit and numbers
	[
		{
			line: '* { padding: -',
			tokens: [
				{ startIndex: 0, type: 'tag.css' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.bracket.css' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'attribute.name.css' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'delimiter.css' }
			]
		}
	],

	// CSS single line comment
	//	h1 /*comment*/ p  {
	[
		{
			line: 'h1 /*comment*/ p {',
			tokens: [
				{ startIndex: 0, type: 'tag.css' },
				{ startIndex: 2, type: '' },
				{ startIndex: 3, type: 'comment.css' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'tag.css' },
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'delimiter.bracket.css' }
			]
		}
	],

	// CSS multi line comment
	//	h1 /*com
	//  ment*/ p  {
	[
		{
			line: 'h1 /*com',
			tokens: [
				{ startIndex: 0, type: 'tag.css' },
				{ startIndex: 2, type: '' },
				{ startIndex: 3, type: 'comment.css' }
			]
		},
		{
			line: 'ment*/ p',
			tokens: [
				{ startIndex: 0, type: 'comment.css' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'tag.css' }
			]
		}
	],

	// CSS ID rule
	[
		{
			line: '#myID {',
			tokens: [
				{ startIndex: 0, type: 'tag.css' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.bracket.css' }
			]
		}
	],

	// CSS Class rules
	[
		{
			line: '.myID {',
			tokens: [
				{ startIndex: 0, type: 'tag.css' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.bracket.css' }
			]
		}
	],

	// CSS @import etc
	[
		{
			line: '@import url("something.css");',
			tokens: [
				{ startIndex: 0, type: 'keyword.css' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'attribute.value.css' },
				{ startIndex: 11, type: 'delimiter.parenthesis.css' },
				{ startIndex: 12, type: 'string.css' },
				{ startIndex: 27, type: 'delimiter.parenthesis.css' },
				{ startIndex: 28, type: 'delimiter.css' }
			]
		}
	],

	// CSS multi-line string with an escaped newline
	//	body {
	//	content: 'con\
	//  tent';
	[
		{
			line: 'body {',
			tokens: [
				{ startIndex: 0, type: 'tag.css' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'delimiter.bracket.css' }
			]
		},
		{
			line: '  content: "con\\',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'attribute.name.css' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'string.css' }
			]
		},
		{
			line: 'tent";',
			tokens: [
				{ startIndex: 0, type: 'string.css' },
				{ startIndex: 5, type: 'delimiter.css' }
			]
		}
	],

	// CSS empty string value
	//	body {
	//	content: '';
	[
		{
			line: 'body {',
			tokens: [
				{ startIndex: 0, type: 'tag.css' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'delimiter.bracket.css' }
			]
		},
		{
			line: '  content: "";',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'attribute.name.css' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'string.css' },
				{ startIndex: 13, type: 'delimiter.css' }
			]
		}
	],

	// CSS font face
	// @font-face {
	//     font-family: 'Opificio';
	// }
	[
		{
			line: '@font-face {',
			tokens: [
				{ startIndex: 0, type: 'keyword.css' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'delimiter.bracket.css' }
			]
		},
		{
			line: '  font-family: "Opificio";',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'attribute.name.css' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'string.css' },
				{ startIndex: 25, type: 'delimiter.css' }
			]
		}
	],

	// CSS string with escaped quotes
	//	's\"tr'
	[
		{
			line: '"s\\"tr" ',
			tokens: [
				{ startIndex: 0, type: 'string.css' },
				{ startIndex: 7, type: '' }
			]
		}
	],

	// CSS key frame animation syntax
	//@-webkit-keyframes infinite-spinning {
	//	 from {
	//		-webkit-transform: rotate(0deg);
	//	}
	//	to {
	//		-webkit-transform: rotate(360deg);
	//	}
	//}
	[
		{
			line: '@-webkit-keyframes infinite-spinning {',
			tokens: [
				{ startIndex: 0, type: 'keyword.css' },
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'attribute.value.css' },
				{ startIndex: 36, type: '' },
				{ startIndex: 37, type: 'delimiter.bracket.css' }
			]
		},
		{
			line: '  from {',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'attribute.value.css' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'delimiter.bracket.css' }
			]
		},
		{
			line: '  -webkit-transform: rotate(0deg);',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'attribute.name.css' },
				{ startIndex: 20, type: '' },
				{ startIndex: 21, type: 'attribute.value.css' },
				{ startIndex: 28, type: 'attribute.value.number.css' },
				{ startIndex: 29, type: 'attribute.value.unit.css' },
				{ startIndex: 32, type: 'attribute.value.css' },
				{ startIndex: 33, type: 'delimiter.css' }
			]
		},
		{
			line: '	 }',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'delimiter.bracket.css' }
			]
		},
		{
			line: '  to {',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'attribute.value.css' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'delimiter.bracket.css' }
			]
		},
		{
			line: '  -webkit-transform: rotate(360deg);',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'attribute.name.css' },
				{ startIndex: 20, type: '' },
				{ startIndex: 21, type: 'attribute.value.css' },
				{ startIndex: 28, type: 'attribute.value.number.css' },
				{ startIndex: 31, type: 'attribute.value.unit.css' },
				{ startIndex: 34, type: 'attribute.value.css' },
				{ startIndex: 35, type: 'delimiter.css' }
			]
		},
		{
			line: '	 }',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'delimiter.bracket.css' }
			]
		},
		{
			line: '}',
			tokens: [{ startIndex: 0, type: 'delimiter.bracket.css' }]
		}
	],

	// CSS @import related coloring bug 9553
	//		 @import url('something.css');
	//		.rule1{}
	//		.rule2{}
	[
		{
			line: '@import url("something.css");',
			tokens: [
				{ startIndex: 0, type: 'keyword.css' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'attribute.value.css' },
				{ startIndex: 11, type: 'delimiter.parenthesis.css' },
				{ startIndex: 12, type: 'string.css' },
				{ startIndex: 27, type: 'delimiter.parenthesis.css' },
				{ startIndex: 28, type: 'delimiter.css' }
			]
		},
		{
			line: '.rule1{}',
			tokens: [
				{ startIndex: 0, type: 'tag.css' },
				{ startIndex: 6, type: 'delimiter.bracket.css' }
			]
		},
		{
			line: '.rule2{}',
			tokens: [
				{ startIndex: 0, type: 'tag.css' },
				{ startIndex: 6, type: 'delimiter.bracket.css' }
			]
		}
	],

	// Triple quotes - bug #9870
	[
		{
			line: '"""',
			tokens: [{ startIndex: 0, type: 'string.css' }]
		}
	],

	[
		{
			line: '""""',
			tokens: [{ startIndex: 0, type: 'string.css' }]
		}
	],

	[
		{
			line: '"""""',
			tokens: [{ startIndex: 0, type: 'string.css' }]
		}
	],

	// import statement - bug #10308
	//	@import url('something.css');@import url('something.css');
	[
		{
			line: '@import url("something.css");@import url("something.css");',
			tokens: [
				{ startIndex: 0, type: 'keyword.css' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'attribute.value.css' },
				{ startIndex: 11, type: 'delimiter.parenthesis.css' },
				{ startIndex: 12, type: 'string.css' },
				{ startIndex: 27, type: 'delimiter.parenthesis.css' },
				{ startIndex: 28, type: 'delimiter.css' },
				{ startIndex: 29, type: 'keyword.css' },
				{ startIndex: 36, type: '' },
				{ startIndex: 37, type: 'attribute.value.css' },
				{ startIndex: 40, type: 'delimiter.parenthesis.css' },
				{ startIndex: 41, type: 'string.css' },
				{ startIndex: 56, type: 'delimiter.parenthesis.css' },
				{ startIndex: 57, type: 'delimiter.css' }
			]
		}
	],

	// !important - bug #9578
	// .a{background:#f5f9fc !important}.b{font-family:"Helvetica Neue", Helvetica;height:31px;}
	[
		{
			line: '.a{background:#f5f9fc !important}.b{font-family:"Helvetica Neue", Helvetica;height:31px;}',
			tokens: [
				{ startIndex: 0, type: 'tag.css' },
				{ startIndex: 2, type: 'delimiter.bracket.css' },
				{ startIndex: 3, type: 'attribute.name.css' },
				{ startIndex: 14, type: 'attribute.value.hex.css' },
				{ startIndex: 21, type: '' },
				{ startIndex: 22, type: 'keyword.css' },
				{ startIndex: 32, type: 'delimiter.bracket.css' },
				{ startIndex: 33, type: 'tag.css' },
				{ startIndex: 35, type: 'delimiter.bracket.css' },
				{ startIndex: 36, type: 'attribute.name.css' },
				{ startIndex: 48, type: 'string.css' },
				{ startIndex: 64, type: 'delimiter.css' },
				{ startIndex: 65, type: '' },
				{ startIndex: 66, type: 'attribute.value.css' },
				{ startIndex: 75, type: 'delimiter.css' },
				{ startIndex: 76, type: 'attribute.name.css' },
				{ startIndex: 83, type: 'attribute.value.number.css' },
				{ startIndex: 85, type: 'attribute.value.unit.css' },
				{ startIndex: 87, type: 'delimiter.css' },
				{ startIndex: 88, type: 'delimiter.bracket.css' }
			]
		}
	],

	// base64-encoded data uris - bug #9580
	//.even { background: #fff url(data:image/gif;base64,R0lGODlhBgASALMAAOfn5+rq6uvr6+zs7O7u7vHx8fPz8/b29vj4+P39/f///wAAAAAAAAAAAAAAAAAAACwAAAAABgASAAAIMAAVCBxIsKDBgwgTDkzAsKGAhxARSJx4oKJFAxgzFtjIkYDHjwNCigxAsiSAkygDAgA7) repeat-x bottom}
	[
		{
			line: '.even { background: #fff url(data:image/gif;base64,R0lGODlhBgASALMAAOfn5+rq6uvr6+zs7O7u7vHx8fPz8/b29vj4+P39/f///wAAAAAAAAAAAAAAAAAAACwAAAAABgASAAAIMAAVCBxIsKDBgwgTDkzAsKGAhxARSJx4oKJFAxgzFtjIkYDHjwNCigxAsiSAkygDAgA7) repeat-x bottom}',
			tokens: [
				{ startIndex: 0, type: 'tag.css' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.bracket.css' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'attribute.name.css' },
				{ startIndex: 19, type: '' },
				{ startIndex: 20, type: 'attribute.value.hex.css' },
				{ startIndex: 24, type: '' },
				{ startIndex: 25, type: 'attribute.value.css' },
				{ startIndex: 28, type: 'delimiter.parenthesis.css' },
				{ startIndex: 29, type: 'string.css' },
				{ startIndex: 215, type: 'delimiter.parenthesis.css' },
				{ startIndex: 216, type: '' },
				{ startIndex: 217, type: 'attribute.value.css' },
				{ startIndex: 225, type: '' },
				{ startIndex: 226, type: 'attribute.value.css' },
				{ startIndex: 232, type: 'delimiter.bracket.css' }
			]
		}
	],

	// /a colorization is incorrect in url - bug #9581
	//.a{background:url(/a.jpg)}
	[
		{
			line: '.a{background:url(/a.jpg)}',
			tokens: [
				{ startIndex: 0, type: 'tag.css' },
				{ startIndex: 2, type: 'delimiter.bracket.css' },
				{ startIndex: 3, type: 'attribute.name.css' },
				{ startIndex: 14, type: 'attribute.value.css' },
				{ startIndex: 17, type: 'delimiter.parenthesis.css' },
				{ startIndex: 18, type: 'string.css' },
				{ startIndex: 24, type: 'delimiter.parenthesis.css' },
				{ startIndex: 25, type: 'delimiter.bracket.css' }
			]
		}
	],

	// Bracket Matching
	[
		{
			line: 'p{}',
			tokens: [
				{ startIndex: 0, type: 'tag.css' },
				{ startIndex: 1, type: 'delimiter.bracket.css' }
			]
		}
	],

	[
		{
			line: 'p:nth() {}',
			tokens: [
				{ startIndex: 0, type: 'tag.css' },
				{ startIndex: 5, type: '' },
				{ startIndex: 8, type: 'delimiter.bracket.css' }
			]
		}
	],

	[
		{
			line: "@import 'https://example.com/test.css';",
			tokens: [
				{ startIndex: 0, type: 'keyword.css' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'string.css' },
				{ startIndex: 38, type: 'delimiter.css' }
			]
		}
	]
]);
