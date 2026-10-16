/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

// Fresh examples informed by the pinned parser tests listed in AGENTS.md.
// Each inner array is a separate snippet; lines within it share tokenizer state.
testTokenization('mojo', [
	// parseDecorators(): indentation, stacking, arguments and ordinary @ operators.
	[
		{
			line: '    @decorator$slot',
			tokens: [
				{ startIndex: 0, type: 'white.mojo' },
				{ startIndex: 4, type: 'tag.mojo' }
			]
		}
	],
	[
		{
			line: '@inline("fast")',
			tokens: [
				{ startIndex: 0, type: 'tag.mojo' },
				{ startIndex: 7, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 8, type: 'string.mojo' },
				{ startIndex: 14, type: 'delimiter.parenthesis.mojo' }
			]
		},
		{ line: '@static', tokens: [{ startIndex: 0, type: 'tag.mojo' }] },
		{
			line: 'def f():',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 5, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 7, type: 'delimiter.mojo' }
			]
		},
		{
			line: '    where',
			tokens: [
				{ startIndex: 0, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' }
			]
		}
	],
	[
		{
			line: 'left @ right',
			tokens: [
				{ startIndex: 0, type: 'identifier.mojo' },
				{ startIndex: 4, type: 'white.mojo' },
				{ startIndex: 5, type: 'operator.mojo' },
				{ startIndex: 6, type: 'white.mojo' },
				{ startIndex: 7, type: 'identifier.mojo' }
			]
		}
	],
	// Malformed decorator expressions retain lexical categories and recover.
	[
		{ line: '@', tokens: [{ startIndex: 0, type: 'operator.mojo' }] },
		{
			line: '@42',
			tokens: [
				{ startIndex: 0, type: 'operator.mojo' },
				{ startIndex: 1, type: 'number.mojo' }
			]
		},
		{
			line: '@note extra',
			tokens: [
				{ startIndex: 0, type: 'tag.mojo' },
				{ startIndex: 5, type: 'white.mojo' },
				{ startIndex: 6, type: 'identifier.mojo' }
			]
		},
		{ line: 'where', tokens: [{ startIndex: 0, type: 'identifier.mojo' }] }
	],
	// parseDefFnStmt(): normal, async, diagnosed fn, keyword and escaped names.
	[
		{
			line: 'async def f():',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 5, type: 'white.mojo' },
				{ startIndex: 6, type: 'keyword.mojo' },
				{ startIndex: 9, type: 'white.mojo' },
				{ startIndex: 10, type: 'identifier.mojo' },
				{ startIndex: 11, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 13, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'fn f(imm x):',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 2, type: 'white.mojo' },
				{ startIndex: 3, type: 'identifier.mojo' },
				{ startIndex: 4, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 5, type: 'keyword.mojo' },
				{ startIndex: 8, type: 'white.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 10, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 11, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: '    def class(imm x):',
			tokens: [
				{ startIndex: 0, type: 'white.mojo' },
				{ startIndex: 4, type: 'keyword.mojo' },
				{ startIndex: 7, type: 'white.mojo' },
				{ startIndex: 8, type: 'keyword.mojo' },
				{ startIndex: 13, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 14, type: 'keyword.mojo' },
				{ startIndex: 17, type: 'white.mojo' },
				{ startIndex: 18, type: 'identifier.mojo' },
				{ startIndex: 19, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 20, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'def `🚀`(imm x):',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 9, type: 'keyword.mojo' },
				{ startIndex: 12, type: 'white.mojo' },
				{ startIndex: 13, type: 'identifier.mojo' },
				{ startIndex: 14, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 15, type: 'delimiter.mojo' }
			]
		}
	],
	// Type-declaration dispatch: shared header context ends at the body colon.
	[
		{
			line: 'struct Box where True:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 6, type: 'white.mojo' },
				{ startIndex: 7, type: 'identifier.mojo' },
				{ startIndex: 10, type: 'white.mojo' },
				{ startIndex: 11, type: 'keyword.mojo' },
				{ startIndex: 16, type: 'white.mojo' },
				{ startIndex: 17, type: 'keyword.mojo' },
				{ startIndex: 21, type: 'delimiter.mojo' }
			]
		},
		{
			line: '    where',
			tokens: [
				{ startIndex: 0, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' }
			]
		}
	],
	[
		{
			line: 'trait Readable:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 5, type: 'white.mojo' },
				{ startIndex: 6, type: 'identifier.mojo' },
				{ startIndex: 14, type: 'delimiter.mojo' }
			]
		},
		{
			line: '    def read():',
			tokens: [
				{ startIndex: 0, type: 'white.mojo' },
				{ startIndex: 4, type: 'keyword.mojo' },
				{ startIndex: 7, type: 'white.mojo' },
				{ startIndex: 8, type: 'identifier.mojo' },
				{ startIndex: 12, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 14, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: '__extension Box where True:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 11, type: 'white.mojo' },
				{ startIndex: 12, type: 'identifier.mojo' },
				{ startIndex: 15, type: 'white.mojo' },
				{ startIndex: 16, type: 'keyword.mojo' },
				{ startIndex: 21, type: 'white.mojo' },
				{ startIndex: 22, type: 'keyword.mojo' },
				{ startIndex: 26, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'class Old:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 5, type: 'white.mojo' },
				{ startIndex: 6, type: 'identifier.mojo' },
				{ startIndex: 9, type: 'delimiter.mojo' }
			]
		},
		{
			line: '    where',
			tokens: [
				{ startIndex: 0, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' }
			]
		}
	],
	// Declaration prefixes must respect identifier boundaries, including $.
	[
		{
			line: 'struct$Box where',
			tokens: [
				{ startIndex: 0, type: 'identifier.mojo' },
				{ startIndex: 10, type: 'white.mojo' },
				{ startIndex: 11, type: 'identifier.mojo' }
			]
		},
		{
			line: 'comptimeX where',
			tokens: [
				{ startIndex: 0, type: 'identifier.mojo' },
				{ startIndex: 9, type: 'white.mojo' },
				{ startIndex: 10, type: 'identifier.mojo' }
			]
		},
		{
			line: 'def$slot(imm)',
			tokens: [
				{ startIndex: 0, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 12, type: 'delimiter.parenthesis.mojo' }
			]
		}
	],
	// parseComptimeCompoundStmt(): aliases and control-flow dispatch diverge.
	// statements/comptime_assert.mojo: assertion expressions and optional messages.
	[
		{
			line: 'comptime assert ready, "ok"',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 8, type: 'white.mojo' },
				{ startIndex: 9, type: 'keyword.mojo' },
				{ startIndex: 15, type: 'white.mojo' },
				{ startIndex: 16, type: 'identifier.mojo' },
				{ startIndex: 21, type: 'delimiter.mojo' },
				{ startIndex: 22, type: 'white.mojo' },
				{ startIndex: 23, type: 'string.mojo' }
			]
		}
	],
	[
		{
			line: 'comptime A where True = where',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 8, type: 'white.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 10, type: 'white.mojo' },
				{ startIndex: 11, type: 'keyword.mojo' },
				{ startIndex: 16, type: 'white.mojo' },
				{ startIndex: 17, type: 'keyword.mojo' },
				{ startIndex: 21, type: 'white.mojo' },
				{ startIndex: 22, type: 'operator.mojo' },
				{ startIndex: 23, type: 'white.mojo' },
				{ startIndex: 24, type: 'identifier.mojo' }
			]
		}
	],
	[
		{
			line: 'comptime A: Int = 2',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 8, type: 'white.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 10, type: 'delimiter.mojo' },
				{ startIndex: 11, type: 'white.mojo' },
				{ startIndex: 12, type: 'identifier.mojo' },
				{ startIndex: 15, type: 'white.mojo' },
				{ startIndex: 16, type: 'operator.mojo' },
				{ startIndex: 17, type: 'white.mojo' },
				{ startIndex: 18, type: 'number.mojo' }
			]
		}
	],
	[
		{
			line: 'comptime if where:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 8, type: 'white.mojo' },
				{ startIndex: 9, type: 'keyword.mojo' },
				{ startIndex: 11, type: 'white.mojo' },
				{ startIndex: 12, type: 'identifier.mojo' },
				{ startIndex: 17, type: 'delimiter.mojo' }
			]
		},
		{
			line: '    where',
			tokens: [
				{ startIndex: 0, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' }
			]
		},
		{
			line: 'elif where:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 4, type: 'white.mojo' },
				{ startIndex: 5, type: 'identifier.mojo' },
				{ startIndex: 10, type: 'delimiter.mojo' }
			]
		},
		{
			line: 'else:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 4, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'comptime for where in items:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 8, type: 'white.mojo' },
				{ startIndex: 9, type: 'keyword.mojo' },
				{ startIndex: 12, type: 'white.mojo' },
				{ startIndex: 13, type: 'identifier.mojo' },
				{ startIndex: 18, type: 'white.mojo' },
				{ startIndex: 19, type: 'keyword.mojo' },
				{ startIndex: 21, type: 'white.mojo' },
				{ startIndex: 22, type: 'identifier.mojo' },
				{ startIndex: 27, type: 'delimiter.mojo' }
			]
		}
	],
	// elif/else after comptime are permissive editor recovery exits.
	[
		{
			line: 'comptime elif where:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 8, type: 'white.mojo' },
				{ startIndex: 9, type: 'keyword.mojo' },
				{ startIndex: 13, type: 'white.mojo' },
				{ startIndex: 14, type: 'identifier.mojo' },
				{ startIndex: 19, type: 'delimiter.mojo' }
			]
		},
		{
			line: 'comptime else:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 8, type: 'white.mojo' },
				{ startIndex: 9, type: 'keyword.mojo' },
				{ startIndex: 13, type: 'delimiter.mojo' }
			]
		}
	],
	// Same-indent statements end a header even after trailing whitespace.
	[
		{
			line: 'def take()   ',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 10, type: 'white.mojo' }
			]
		},
		{
			line: 'where=8',
			tokens: [
				{ startIndex: 0, type: 'identifier.mojo' },
				{ startIndex: 5, type: 'operator.mojo' },
				{ startIndex: 6, type: 'number.mojo' }
			]
		}
	],
	// Comment-only and blank lines do not discard an indented continuation.
	[
		{
			line: 'def take[n:Int]()',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.square.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 10, type: 'delimiter.mojo' },
				{ startIndex: 11, type: 'identifier.mojo' },
				{ startIndex: 14, type: 'delimiter.square.mojo' },
				{ startIndex: 15, type: 'delimiter.parenthesis.mojo' }
			]
		},
		{
			line: '    # ignored',
			tokens: [
				{ startIndex: 0, type: 'white.mojo' },
				{ startIndex: 4, type: 'comment.mojo' }
			]
		},
		{ line: '', tokens: [] },
		{
			line: '    ->where',
			tokens: [
				{ startIndex: 0, type: 'white.mojo' },
				{ startIndex: 4, type: 'operator.mojo' },
				{ startIndex: 6, type: 'identifier.mojo' }
			]
		},
		{
			line: '    where True:',
			tokens: [
				{ startIndex: 0, type: 'white.mojo' },
				{ startIndex: 4, type: 'keyword.mojo' },
				{ startIndex: 9, type: 'white.mojo' },
				{ startIndex: 10, type: 'keyword.mojo' },
				{ startIndex: 14, type: 'delimiter.mojo' }
			]
		},
		{
			line: '    imm',
			tokens: [
				{ startIndex: 0, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' }
			]
		}
	],
	// Explicit continuation permits an otherwise dedented header tail.
	[
		{
			line: 'def take() \\',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 10, type: 'white.mojo' },
				{ startIndex: 11, type: 'delimiter.mojo' }
			]
		},
		{
			line: 'where True:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 5, type: 'white.mojo' },
				{ startIndex: 6, type: 'keyword.mojo' },
				{ startIndex: 10, type: 'delimiter.mojo' }
			]
		},
		{
			line: '    where',
			tokens: [
				{ startIndex: 0, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' }
			]
		}
	],
	[
		{
			line: 'def take \\',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'white.mojo' },
				{ startIndex: 9, type: 'delimiter.mojo' }
			]
		},
		{
			line: '(mut item:Int):',
			tokens: [
				{ startIndex: 0, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 1, type: 'keyword.mojo' },
				{ startIndex: 4, type: 'white.mojo' },
				{ startIndex: 5, type: 'identifier.mojo' },
				{ startIndex: 9, type: 'delimiter.mojo' },
				{ startIndex: 10, type: 'identifier.mojo' },
				{ startIndex: 13, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 14, type: 'delimiter.mojo' }
			]
		}
	],
	// Type and alias headers also continue; their indentation baseline is retained.
	[
		{
			line: '    struct Box',
			tokens: [
				{ startIndex: 0, type: 'white.mojo' },
				{ startIndex: 4, type: 'keyword.mojo' },
				{ startIndex: 10, type: 'white.mojo' },
				{ startIndex: 11, type: 'identifier.mojo' }
			]
		},
		{
			line: '        where True:',
			tokens: [
				{ startIndex: 0, type: 'white.mojo' },
				{ startIndex: 8, type: 'keyword.mojo' },
				{ startIndex: 13, type: 'white.mojo' },
				{ startIndex: 14, type: 'keyword.mojo' },
				{ startIndex: 18, type: 'delimiter.mojo' }
			]
		},
		{
			line: '        where',
			tokens: [
				{ startIndex: 0, type: 'white.mojo' },
				{ startIndex: 8, type: 'identifier.mojo' }
			]
		}
	],
	[
		{
			line: '\ttrait T',
			tokens: [
				{ startIndex: 0, type: 'white.mojo' },
				{ startIndex: 1, type: 'keyword.mojo' },
				{ startIndex: 6, type: 'white.mojo' },
				{ startIndex: 7, type: 'identifier.mojo' }
			]
		},
		{
			line: '\t\twhere True:',
			tokens: [
				{ startIndex: 0, type: 'white.mojo' },
				{ startIndex: 2, type: 'keyword.mojo' },
				{ startIndex: 7, type: 'white.mojo' },
				{ startIndex: 8, type: 'keyword.mojo' },
				{ startIndex: 12, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'comptime A \\  ',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 8, type: 'white.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 10, type: 'white.mojo' },
				{ startIndex: 11, type: 'delimiter.mojo' }
			]
		},
		{
			line: 'where True = 1',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 5, type: 'white.mojo' },
				{ startIndex: 6, type: 'keyword.mojo' },
				{ startIndex: 10, type: 'white.mojo' },
				{ startIndex: 11, type: 'operator.mojo' },
				{ startIndex: 12, type: 'white.mojo' },
				{ startIndex: 13, type: 'number.mojo' }
			]
		},
		{
			line: '    where',
			tokens: [
				{ startIndex: 0, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' }
			]
		}
	],
	// Incomplete headers recover at same/less indentation and before a new header.
	[
		{
			line: '    def f()',
			tokens: [
				{ startIndex: 0, type: 'white.mojo' },
				{ startIndex: 4, type: 'keyword.mojo' },
				{ startIndex: 7, type: 'white.mojo' },
				{ startIndex: 8, type: 'identifier.mojo' },
				{ startIndex: 9, type: 'delimiter.parenthesis.mojo' }
			]
		},
		{
			line: '    where',
			tokens: [
				{ startIndex: 0, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' }
			]
		},
		{ line: 'where', tokens: [{ startIndex: 0, type: 'identifier.mojo' }] },
		{
			line: 'def g() where True:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 5, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 7, type: 'white.mojo' },
				{ startIndex: 8, type: 'keyword.mojo' },
				{ startIndex: 13, type: 'white.mojo' },
				{ startIndex: 14, type: 'keyword.mojo' },
				{ startIndex: 18, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{ line: 'struct', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] },
		{ line: 'where', tokens: [{ startIndex: 0, type: 'identifier.mojo' }] },
		{ line: 'comptime', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] },
		{ line: 'where', tokens: [{ startIndex: 0, type: 'identifier.mojo' }] },
		{ line: 'def', tokens: [{ startIndex: 0, type: 'keyword.mojo' }] },
		{ line: 'imm', tokens: [{ startIndex: 0, type: 'identifier.mojo' }] }
	],
	[
		{
			line: 'struct Box',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 6, type: 'white.mojo' },
				{ startIndex: 7, type: 'identifier.mojo' }
			]
		},
		{ line: '# comment at column zero', tokens: [{ startIndex: 0, type: 'comment.mojo' }] },
		{ line: '  ', tokens: [{ startIndex: 0, type: 'white.mojo' }] },
		{ line: 'where', tokens: [{ startIndex: 0, type: 'identifier.mojo' }] }
	],
	// Header terminators and lexical subcontexts must return to ordinary names.
	[
		{
			line: 'comptime A = t"{where}"',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 8, type: 'white.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 10, type: 'white.mojo' },
				{ startIndex: 11, type: 'operator.mojo' },
				{ startIndex: 12, type: 'white.mojo' },
				{ startIndex: 13, type: 'string.mojo' },
				{ startIndex: 15, type: 'delimiter.curly.mojo' },
				{ startIndex: 16, type: 'identifier.mojo' },
				{ startIndex: 21, type: 'delimiter.curly.mojo' },
				{ startIndex: 22, type: 'string.mojo' }
			]
		},
		{
			line: '    where',
			tokens: [
				{ startIndex: 0, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' }
			]
		}
	],
	[
		{
			line: 'struct Box[T="where"] where True:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 6, type: 'white.mojo' },
				{ startIndex: 7, type: 'identifier.mojo' },
				{ startIndex: 10, type: 'delimiter.square.mojo' },
				{ startIndex: 11, type: 'identifier.mojo' },
				{ startIndex: 12, type: 'operator.mojo' },
				{ startIndex: 13, type: 'string.mojo' },
				{ startIndex: 20, type: 'delimiter.square.mojo' },
				{ startIndex: 21, type: 'white.mojo' },
				{ startIndex: 22, type: 'keyword.mojo' },
				{ startIndex: 27, type: 'white.mojo' },
				{ startIndex: 28, type: 'keyword.mojo' },
				{ startIndex: 32, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'comptime A; where',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 8, type: 'white.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 10, type: 'delimiter.mojo' },
				{ startIndex: 11, type: 'white.mojo' },
				{ startIndex: 12, type: 'identifier.mojo' }
			]
		}
	]
]);
