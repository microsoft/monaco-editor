/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('bat', [
	// Keywords
	[
		{
			line: '@echo off title Selfhost',
			tokens: [
				{ startIndex: 0, type: 'keyword.bat' },
				{ startIndex: 1, type: 'keyword.echo.bat' },
				{ startIndex: 5, type: '' },
				{ startIndex: 10, type: 'keyword.title.bat' },
				{ startIndex: 15, type: '' }
			]
		}
	],

	// Comments - single line
	[
		{
			line: 'REM',
			tokens: [{ startIndex: 0, type: 'comment.bat' }]
		}
	],

	[
		{
			line: '    REM a comment',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'comment.bat' }
			]
		}
	],

	[
		{
			line: 'REM a comment',
			tokens: [{ startIndex: 0, type: 'comment.bat' }]
		}
	],

	[
		{
			line: 'REMnot a comment',
			tokens: [{ startIndex: 0, type: '' }]
		}
	],

	// number
	[
		{
			line: '0',
			tokens: [{ startIndex: 0, type: 'number.bat' }]
		}
	],

	[
		{
			line: '0.0',
			tokens: [{ startIndex: 0, type: 'number.float.bat' }]
		}
	],

	[
		{
			line: '0x123',
			tokens: [{ startIndex: 0, type: 'number.hex.bat' }]
		}
	],

	[
		{
			line: '23.5',
			tokens: [{ startIndex: 0, type: 'number.float.bat' }]
		}
	],

	[
		{
			line: '23.5e3',
			tokens: [{ startIndex: 0, type: 'number.float.bat' }]
		}
	],

	[
		{
			line: '23.5E3',
			tokens: [{ startIndex: 0, type: 'number.float.bat' }]
		}
	],

	[
		{
			line: '1.72e-3',
			tokens: [{ startIndex: 0, type: 'number.float.bat' }]
		}
	],

	[
		{
			line: '0+0',
			tokens: [
				{ startIndex: 0, type: 'number.bat' },
				{ startIndex: 1, type: 'delimiter.bat' },
				{ startIndex: 2, type: 'number.bat' }
			]
		}
	],

	[
		{
			line: '100+10',
			tokens: [
				{ startIndex: 0, type: 'number.bat' },
				{ startIndex: 3, type: 'delimiter.bat' },
				{ startIndex: 4, type: 'number.bat' }
			]
		}
	],

	[
		{
			line: '0 + 0',
			tokens: [
				{ startIndex: 0, type: 'number.bat' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.bat' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.bat' }
			]
		}
	],

	// Strings
	[
		{
			line: 'set s = "string"',
			tokens: [
				{ startIndex: 0, type: 'keyword.set.bat' },
				{ startIndex: 3, type: '' },
				{ startIndex: 6, type: 'delimiter.bat' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'string.bat' }
			]
		}
	],

	[
		{
			line: '"use strict";',
			tokens: [
				{ startIndex: 0, type: 'string.bat' },
				{ startIndex: 12, type: 'delimiter.bat' }
			]
		}
	],

	// Tags
	[
		{
			line: 'setlocal endlocal',
			tokens: [
				{ startIndex: 0, type: 'keyword.tag-setlocal.bat' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'keyword.tag-setlocal.bat' }
			]
		}
	],

	[
		{
			line: 'setlocal ENDLOCAL',
			tokens: [
				{ startIndex: 0, type: 'keyword.tag-setlocal.bat' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'keyword.tag-setlocal.bat' }
			]
		}
	],

	[
		{
			line: 'SETLOCAL endlocal',
			tokens: [
				{ startIndex: 0, type: 'keyword.tag-setlocal.bat' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'keyword.tag-setlocal.bat' }
			]
		}
	],

	[
		{
			line: 'setlocal setlocal endlocal',
			tokens: [
				{ startIndex: 0, type: 'keyword.tag-setlocal.bat' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'keyword.tag-setlocal.bat' },
				{ startIndex: 17, type: '' },
				{ startIndex: 18, type: 'keyword.tag-setlocal.bat' }
			]
		}
	],

	// Monarch generated
	[
		{
			line: 'rem asdf',
			tokens: [{ startIndex: 0, type: 'comment.bat' }]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: 'REM',
			tokens: [{ startIndex: 0, type: 'comment.bat' }]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: 'REMOVED not a comment really',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 8, type: 'keyword.not.bat' },
				{ startIndex: 11, type: '' }
			]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: 'echo cool',
			tokens: [
				{ startIndex: 0, type: 'keyword.echo.bat' },
				{ startIndex: 4, type: '' }
			]
		},
		{
			line: '@echo off',
			tokens: [
				{ startIndex: 0, type: 'keyword.bat' },
				{ startIndex: 1, type: 'keyword.echo.bat' },
				{ startIndex: 5, type: '' }
			]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: 'setlocAL',
			tokens: [{ startIndex: 0, type: 'keyword.tag-setlocal.bat' }]
		},
		{
			line: '	asdf',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '	asdf',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: 'endLocaL',
			tokens: [{ startIndex: 0, type: 'keyword.tag-setlocal.bat' }]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: 'call',
			tokens: [{ startIndex: 0, type: 'keyword.call.bat' }]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: ':MyLabel',
			tokens: [{ startIndex: 0, type: 'metatag.bat' }]
		},
		{
			line: 'some command',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: '%sdfsdf% ',
			tokens: [
				{ startIndex: 0, type: 'variable.bat' },
				{ startIndex: 8, type: '' }
			]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: 'this is "a string %sdf% asdf"',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 8, type: 'string.bat' },
				{ startIndex: 18, type: 'variable.bat' },
				{ startIndex: 23, type: 'string.bat' }
			]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: '',
			tokens: []
		},
		{
			line: 'FOR %%A IN (1 2 3) DO (',
			tokens: [
				{ startIndex: 0, type: 'keyword.for.bat' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'variable.bat' },
				{ startIndex: 7, type: '' },
				{ startIndex: 11, type: 'delimiter.parenthesis.bat' },
				{ startIndex: 12, type: 'number.bat' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'number.bat' },
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'number.bat' },
				{ startIndex: 17, type: 'delimiter.parenthesis.bat' },
				{ startIndex: 18, type: '' },
				{ startIndex: 22, type: 'delimiter.parenthesis.bat' }
			]
		},
		{
			line: '	SET VAR1=%VAR1%%%A',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'keyword.set.bat' },
				{ startIndex: 4, type: '' },
				{ startIndex: 9, type: 'delimiter.bat' },
				{ startIndex: 10, type: 'variable.bat' }
			]
		},
		{
			line: '	SET VAR2=%VAR2%%%A',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'keyword.set.bat' },
				{ startIndex: 4, type: '' },
				{ startIndex: 9, type: 'delimiter.bat' },
				{ startIndex: 10, type: 'variable.bat' }
			]
		},
		{
			line: "	use 'string %%a asdf asdf'",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 5, type: 'string.bat' },
				{ startIndex: 13, type: 'variable.bat' },
				{ startIndex: 16, type: 'string.bat' }
			]
		},
		{
			line: '	non terminated "string %%aaa sdf',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 16, type: 'string.bat' },
				{ startIndex: 24, type: 'variable.bat' },
				{ startIndex: 29, type: 'string.bat' }
			]
		},
		{
			line: '	this shold NOT BE red',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 12, type: 'keyword.not.bat' },
				{ startIndex: 15, type: '' }
			]
		},
		{
			line: ')',
			tokens: [{ startIndex: 0, type: 'delimiter.parenthesis.bat' }]
		}
	]
]);
