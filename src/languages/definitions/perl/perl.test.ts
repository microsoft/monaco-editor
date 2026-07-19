/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('perl', [
	// Keywords
	[
		{
			line: 'if $msg',
			tokens: [
				{ startIndex: 0, type: 'keyword.perl' },
				{ startIndex: 2, type: 'white.perl' },
				{ startIndex: 3, type: 'variable.perl' }
			]
		}
	],

	// Builtins
	[
		{
			line: 'log $ARGV',
			tokens: [
				{ startIndex: 0, type: 'type.identifier.perl' },
				{ startIndex: 3, type: 'white.perl' },
				{ startIndex: 4, type: 'variable.predefined.perl' }
			]
		}
	],

	// Shebang
	[
		{
			line: '#!/bin/env perl',
			tokens: [{ startIndex: 0, type: 'metatag.perl' }]
		}
	],

	// Comments - single line
	[
		{
			line: '#',
			tokens: [{ startIndex: 0, type: 'comment.perl' }]
		}
	],

	[
		{
			line: '    # a comment',
			tokens: [
				{ startIndex: 0, type: 'white.perl' },
				{ startIndex: 4, type: 'comment.perl' }
			]
		}
	],

	[
		{
			line: '# a comment',
			tokens: [{ startIndex: 0, type: 'comment.perl' }]
		}
	],

	// number
	[
		{
			line: '0',
			tokens: [{ startIndex: 0, type: 'number.perl' }]
		}
	],

	[
		{
			line: '0.0',
			tokens: [{ startIndex: 0, type: 'number.float.perl' }]
		}
	],

	[
		{
			line: '0x123',
			tokens: [{ startIndex: 0, type: 'number.hex.perl' }]
		}
	],

	[
		{
			line: '23.5',
			tokens: [{ startIndex: 0, type: 'number.float.perl' }]
		}
	],

	[
		{
			line: '23.5e3',
			tokens: [{ startIndex: 0, type: 'number.float.perl' }]
		}
	],

	[
		{
			line: '23.5E3',
			tokens: [{ startIndex: 0, type: 'number.float.perl' }]
		}
	],

	[
		{
			line: '1.72e-3',
			tokens: [{ startIndex: 0, type: 'number.float.perl' }]
		}
	],

	[
		{
			line: '0+0',
			tokens: [
				{ startIndex: 0, type: 'number.perl' },
				{ startIndex: 1, type: 'operators.perl' },
				{ startIndex: 2, type: 'number.perl' }
			]
		}
	],

	[
		{
			line: '100+10',
			tokens: [
				{ startIndex: 0, type: 'number.perl' },
				{ startIndex: 3, type: 'operators.perl' },
				{ startIndex: 4, type: 'number.perl' }
			]
		}
	],

	[
		{
			line: '0 + 0',
			tokens: [
				{ startIndex: 0, type: 'number.perl' },
				{ startIndex: 1, type: 'white.perl' },
				{ startIndex: 2, type: 'operators.perl' },
				{ startIndex: 3, type: 'white.perl' },
				{ startIndex: 4, type: 'number.perl' }
			]
		}
	],

	// Strings

	// Double quoted string
	[
		{
			line: '"string"',
			tokens: [{ startIndex: 0, type: 'string.perl' }]
		}
	],

	[
		{
			line: '"test $foo"',
			tokens: [
				{ startIndex: 0, type: 'string.perl' },
				{ startIndex: 6, type: 'variable.perl' },
				{ startIndex: 10, type: 'string.perl' }
			]
		}
	],

	[
		{
			line: '"test',
			tokens: [{ startIndex: 0, type: 'string.perl' }]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: 'string $foo string2"',
			tokens: [
				{ startIndex: 0, type: 'string.perl' },
				{ startIndex: 7, type: 'variable.perl' },
				{ startIndex: 11, type: 'string.perl' }
			]
		}
	],

	[
		{
			line: '"string\\t"',
			tokens: [
				{ startIndex: 0, type: 'string.perl' },
				{
					startIndex: 7,
					type: 'string.escape.perl'
				},
				{ startIndex: 9, type: 'string.perl' }
			]
		}
	],

	// Single quoted string
	[
		{
			line: "'string'",
			tokens: [{ startIndex: 0, type: 'string.perl' }]
		}
	],

	[
		{
			line: "'test $foo'",
			tokens: [{ startIndex: 0, type: 'string.perl' }]
		}
	],

	[
		{
			line: "'test",
			tokens: [{ startIndex: 0, type: 'string.perl' }]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: "string $foo string2'",
			tokens: [{ startIndex: 0, type: 'string.perl' }]
		}
	],

	[
		{
			line: "'string\\t'",
			tokens: [{ startIndex: 0, type: 'string.perl' }]
		}
	],

	[
		{
			line: "'string\\'string2'",
			tokens: [
				{ startIndex: 0, type: 'string.perl' },
				{
					startIndex: 7,
					type: 'string.escape.perl'
				},
				{ startIndex: 9, type: 'string.perl' }
			]
		}
	],

	// Variables
	[
		{
			line: '$msg $_ $1',
			tokens: [
				{ startIndex: 0, type: 'variable.perl' },
				{ startIndex: 4, type: 'white.perl' },
				{ startIndex: 5, type: 'variable.predefined.perl' },
				{ startIndex: 7, type: 'white.perl' },
				{ startIndex: 8, type: 'variable.perl' }
			]
		}
	],

	[
		{
			line: '@array1 @array2',
			tokens: [
				{ startIndex: 0, type: 'variable.perl' },
				{ startIndex: 7, type: 'white.perl' },
				{
					startIndex: 8,
					type: 'variable.perl'
				}
			]
		}
	],

	[
		{
			line: '%var1 %var2',
			tokens: [
				{ startIndex: 0, type: 'variable.perl' },
				{
					startIndex: 5,
					type: 'white.perl'
				},
				{
					startIndex: 6,
					type: 'variable.perl'
				}
			]
		}
	],

	// RegExp
	[
		{
			line: '/abc/',
			tokens: [{ startIndex: 0, type: 'regexp.perl' }]
		}
	],

	[
		{
			line: 'm/abc/',
			tokens: [
				{ startIndex: 0, type: 'regexp.delim.perl' },
				{ startIndex: 2, type: 'regexp.perl' },
				{ startIndex: 5, type: 'regexp.delim.perl' }
			]
		}
	],

	[
		{
			line: 'm/[abc]+/e',
			tokens: [
				{ startIndex: 0, type: 'regexp.delim.perl' },
				{ startIndex: 2, type: 'regexp.perl' },
				{ startIndex: 8, type: 'regexp.delim.perl' },
				{ startIndex: 9, type: 'regexp.modifier.perl' }
			]
		}
	],

	// Operators
	[
		{
			line: '$a + $b',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.perl' },
				{
					startIndex: 2,
					type: 'white.perl'
				},
				{
					startIndex: 3,
					type: 'operators.perl'
				},
				{ startIndex: 4, type: 'white.perl' },
				{ startIndex: 5, type: 'variable.predefined.perl' }
			]
		}
	],

	// Embedded Doc
	[
		{
			line: '=begin',
			tokens: [
				{
					startIndex: 0,
					type: 'comment.doc.perl'
				}
			]
		},
		{
			line: 'this is my doc',
			tokens: [
				{
					startIndex: 0,
					type: 'comment.doc.perl'
				}
			]
		},
		{
			line: '=cut',
			tokens: [{ startIndex: 0, type: 'type.identifier.perl' }]
		}
	],

	// Here Doc
	[
		{
			line: '<< HTML',
			tokens: [{ startIndex: 0, type: 'string.heredoc.delimiter.perl' }]
		},
		{
			line: 'test here doc',
			tokens: [
				{
					startIndex: 0,
					type: 'string.heredoc.perl'
				}
			]
		},
		{
			line: 'HTML',
			tokens: [{ startIndex: 0, type: 'string.heredoc.delimiter.perl' }]
		},
		{
			line: 'my $msg',
			tokens: [
				{ startIndex: 0, type: 'type.identifier.perl' },
				{
					startIndex: 2,
					type: 'white.perl'
				},
				{ startIndex: 3, type: 'variable.perl' }
			]
		}
	],

	[
		{
			line: '<<"HTML"',
			tokens: [{ startIndex: 0, type: 'string.heredoc.delimiter.perl' }]
		},
		{
			line: 'test here doc',
			tokens: [
				{
					startIndex: 0,
					type: 'string.heredoc.perl'
				}
			]
		},
		{
			line: 'HTML',
			tokens: [{ startIndex: 0, type: 'string.heredoc.delimiter.perl' }]
		},
		{
			line: 'my $msg',
			tokens: [
				{ startIndex: 0, type: 'type.identifier.perl' },
				{
					startIndex: 2,
					type: 'white.perl'
				},
				{ startIndex: 3, type: 'variable.perl' }
			]
		}
	],

	// Quoted constructs
	[
		{
			line: "m!can't!",
			tokens: [
				{ startIndex: 0, type: 'regexp.delim.perl' },
				{ startIndex: 2, type: 'regexp.perl' },
				{ startIndex: 7, type: 'regexp.delim.perl' }
			]
		}
	],

	[
		{
			line: 'q XfooX',
			tokens: [
				{ startIndex: 0, type: 'string.delim.perl' },
				{ startIndex: 3, type: 'string.perl' },
				{ startIndex: 6, type: 'string.delim.perl' }
			]
		}
	],

	[
		{
			line: 'qq(test $foo)',
			tokens: [
				{ startIndex: 0, type: 'string.delim.perl' },
				{ startIndex: 3, type: 'string.perl' },
				{ startIndex: 8, type: 'variable.perl' },
				{ startIndex: 12, type: 'string.delim.perl' }
			]
		}
	]
]);
