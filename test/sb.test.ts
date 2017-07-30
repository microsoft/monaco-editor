/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { testTokenization } from './testRunner';

testTokenization('sb', [

	// Comments - single line
	[{
		line: '\'',
		tokens: [
			{ startIndex: 0, type: 'comment.sb' }
		]
	}],

	[{
		line: '    \' a comment',
		tokens: [
			{ startIndex: 0, type: '' },
			{ startIndex: 4, type: 'comment.sb' }
		]
	}],

	[{
		line: '\' a comment',
		tokens: [
			{ startIndex: 0, type: 'comment.sb' }
		]
	}],

	[{
		line: '\'sticky comment',
		tokens: [
			{ startIndex: 0, type: 'comment.sb' }
		]
	}],

	[{
		line: '1 \' 2< \' comment',
		tokens: [
			{ startIndex: 0, type: 'number.sb' },
			{ startIndex: 1, type: '' },
			{ startIndex: 2, type: 'comment.sb' }
		]
	}],

	[{
		line: 'x = 1 \' my comment \'\' is a nice one',
		tokens: [
			{ startIndex: 0, type: 'identifier.sb' },
			{ startIndex: 1, type: '' },
			{ startIndex: 2, type: 'delimiter.sb' },
			{ startIndex: 3, type: '' },
			{ startIndex: 4, type: 'number.sb' },
			{ startIndex: 5, type: '' },
			{ startIndex: 6, type: 'comment.sb' }
		]
	}],

	// Numbers
	[{
		line: '0',
		tokens: [
			{ startIndex: 0, type: 'number.sb' }
		]
	}],

	[{
		line: '0.0',
		tokens: [
			{ startIndex: 0, type: 'number.float.sb' }
		]
	}],

	[{
		line: '23.5',
		tokens: [
			{ startIndex: 0, type: 'number.float.sb' }
		]
	}],

	[{
		line: '1 -0',
		tokens: [
			{ startIndex: 0, type: 'number.sb' },
			{ startIndex: 1, type: '' },
			{ startIndex: 2, type: 'delimiter.sb' },
			{ startIndex: 3, type: 'number.sb' }
		]
	}],

	[{
		line: '100+10',
		tokens: [
			{ startIndex: 0, type: 'number.sb' },
			{ startIndex: 3, type: 'delimiter.sb' },
			{ startIndex: 4, type: 'number.sb' }
		]
	}],

	[{
		line: '0 + 0',
		tokens: [
			{ startIndex: 0, type: 'number.sb' },
			{ startIndex: 1, type: '' },
			{ startIndex: 2, type: 'delimiter.sb' },
			{ startIndex: 3, type: '' },
			{ startIndex: 4, type: 'number.sb' }
		]
	}],

	// Keywords
	[{
		line: 'Sub Foo',
		tokens: [
			{ startIndex: 0, type: 'keyword.tag-sub.sb' },
			{ startIndex: 3, type: '' },
			{ startIndex: 4, type: 'identifier.sb' }
		]
	}],

	// Strings
	[{
		line: 's = "string"',
		tokens: [
			{ startIndex: 0, type: 'identifier.sb' },
			{ startIndex: 1, type: '' },
			{ startIndex: 2, type: 'delimiter.sb' },
			{ startIndex: 3, type: '' },
			{ startIndex: 4, type: 'string.sb' }
		]
	}],

	[{
		line: '"use strict";',
		tokens: [
			{ startIndex: 0, type: 'string.sb' },
			{ startIndex: 12, type: '' }
		]
	}],

	// Tags
	[{
		line: 'sub ToString',
		tokens: [
			{ startIndex: 0, type: 'keyword.tag-sub.sb' },
			{ startIndex: 3, type: '' },
			{ startIndex: 4, type: 'identifier.sb' }
		]
	}],

	[{
		line: 'While For If Sub EndWhile EndFor EndIf endsub',
		tokens: [
			{ startIndex: 0, type: 'keyword.tag-while.sb' },
			{ startIndex: 5, type: '' },
			{ startIndex: 6, type: 'keyword.tag-for.sb' },
			{ startIndex: 9, type: '' },
			{ startIndex: 10, type: 'keyword.tag-if.sb' },
			{ startIndex: 12, type: '' },
			{ startIndex: 13, type: 'keyword.tag-sub.sb' },
			{ startIndex: 16, type: '' },
			{ startIndex: 17, type: 'keyword.tag-while.sb' },
			{ startIndex: 25, type: '' },
			{ startIndex: 26, type: 'keyword.tag-for.sb' },
			{ startIndex: 32, type: '' },
			{ startIndex: 33, type: 'keyword.tag-if.sb' },
			{ startIndex: 38, type: '' },
			{ startIndex: 39, type: 'keyword.tag-sub.sb' }
		]
	}],

	[{
		line: 'While while WHILE WHile whiLe',
		tokens: [
			{ startIndex: 0, type: 'keyword.tag-while.sb' },
			{ startIndex: 5, type: '' },
			{ startIndex: 6, type: 'keyword.tag-while.sb' },
			{ startIndex: 11, type: '' },
			{ startIndex: 12, type: 'keyword.tag-while.sb' },
			{ startIndex: 17, type: '' },
			{ startIndex: 18, type: 'keyword.tag-while.sb' },
			{ startIndex: 23, type: '' },
			{ startIndex: 24, type: 'keyword.tag-while.sb' }
		]
	}],

	[{
		line: 'If b(i) = col Then',
		tokens: [
			{ startIndex: 0, type: 'keyword.tag-if.sb' },
			{ startIndex: 2, type: '' },
			{ startIndex: 3, type: 'identifier.sb' },
			{ startIndex: 4, type: 'delimiter.parenthesis.sb' },
			{ startIndex: 5, type: 'identifier.sb' },
			{ startIndex: 6, type: 'delimiter.parenthesis.sb' },
			{ startIndex: 7, type: '' },
			{ startIndex: 8, type: 'delimiter.sb' },
			{ startIndex: 9, type: '' },
			{ startIndex: 10, type: 'identifier.sb' },
			{ startIndex: 13, type: '' },
			{ startIndex: 14, type: 'keyword.then.sb' }
		]
	}],

	[{
		line: 'For i = 0 To 10 Step 2 DoStuff EndFor',
		tokens: [
			{ startIndex: 0, type: 'keyword.tag-for.sb' },
			{ startIndex: 3, type: '' },
			{ startIndex: 4, type: 'identifier.sb' },
			{ startIndex: 5, type: '' },
			{ startIndex: 6, type: 'delimiter.sb' },
			{ startIndex: 7, type: '' },
			{ startIndex: 8, type: 'number.sb' },
			{ startIndex: 9, type: '' },
			{ startIndex: 10, type: 'keyword.to.sb' },
			{ startIndex: 12, type: '' },
			{ startIndex: 13, type: 'number.sb' },
			{ startIndex: 15, type: '' },
			{ startIndex: 16, type: 'keyword.step.sb' },
			{ startIndex: 20, type: '' },
			{ startIndex: 21, type: 'number.sb' },
			{ startIndex: 22, type: '' },
			{ startIndex: 23, type: 'identifier.sb' },
			{ startIndex: 30, type: '' },
			{ startIndex: 31, type: 'keyword.tag-for.sb' }
		]
	}],

	[{
		line: 'For stuff EndFor',
		tokens: [
			{ startIndex: 0, type: 'keyword.tag-for.sb' },
			{ startIndex: 3, type: '' },
			{ startIndex: 4, type: 'identifier.sb' },
			{ startIndex: 9, type: '' },
			{ startIndex: 10, type: 'keyword.tag-for.sb' },
		]
	}],

	[{
		line: 'for stuff endfor',
		tokens: [
			{ startIndex: 0, type: 'keyword.tag-for.sb' },
			{ startIndex: 3, type: '' },
			{ startIndex: 4, type: 'identifier.sb' },
			{ startIndex: 9, type: '' },
			{ startIndex: 10, type: 'keyword.tag-for.sb' },
		]
	}]
]);
