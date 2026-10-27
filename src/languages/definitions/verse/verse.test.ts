/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('verse', [
	// Line comments
	[
		{
			line: '# a line comment',
			tokens: [{ startIndex: 0, type: 'comment.verse' }]
		}
	],
	[
		{
			line: 'X := 1 # trailing comment',
			tokens: [
				{ startIndex: 0, type: 'identifier.verse' },
				{ startIndex: 1, type: 'white.verse' },
				{ startIndex: 2, type: 'operator.verse' },
				{ startIndex: 4, type: 'white.verse' },
				{ startIndex: 5, type: 'number.verse' },
				{ startIndex: 6, type: 'white.verse' },
				{ startIndex: 7, type: 'comment.verse' }
			]
		}
	],
	// Block comments, which nest and may sit inside an expression
	[
		{
			line: '<# block #> X',
			tokens: [
				{ startIndex: 0, type: 'comment.verse' },
				{ startIndex: 11, type: 'white.verse' },
				{ startIndex: 12, type: 'identifier.verse' }
			]
		}
	],
	[
		{
			line: '<# outer <# inner #> still outer #> X',
			tokens: [
				{ startIndex: 0, type: 'comment.verse' },
				{ startIndex: 35, type: 'white.verse' },
				{ startIndex: 36, type: 'identifier.verse' }
			]
		}
	],
	[
		{
			line: '<# a block comment',
			tokens: [{ startIndex: 0, type: 'comment.verse' }]
		},
		{
			line: '   that spans lines #> X := 1',
			tokens: [
				{ startIndex: 0, type: 'comment.verse' },
				{ startIndex: 22, type: 'white.verse' },
				{ startIndex: 23, type: 'identifier.verse' },
				{ startIndex: 24, type: 'white.verse' },
				{ startIndex: 25, type: 'operator.verse' },
				{ startIndex: 27, type: 'white.verse' },
				{ startIndex: 28, type: 'number.verse' }
			]
		}
	],
	[
		{
			line: '<# a <#> b #> X',
			tokens: [
				{ startIndex: 0, type: 'comment.verse' },
				{ startIndex: 13, type: 'white.verse' },
				{ startIndex: 14, type: 'identifier.verse' }
			]
		}
	],
	[
		{
			line: 'Total := Base<#tax#>+Tax',
			tokens: [
				{ startIndex: 0, type: 'identifier.verse' },
				{ startIndex: 5, type: 'white.verse' },
				{ startIndex: 6, type: 'operator.verse' },
				{ startIndex: 8, type: 'white.verse' },
				{ startIndex: 9, type: 'identifier.verse' },
				{ startIndex: 13, type: 'comment.verse' },
				{ startIndex: 20, type: 'operator.verse' },
				{ startIndex: 21, type: 'identifier.verse' }
			]
		}
	],
	// Indented comments: the lines indented under `<#>` are comments
	[
		{
			line: '<#>',
			tokens: [{ startIndex: 0, type: 'comment.verse' }]
		},
		{
			line: '    indented comment',
			tokens: [{ startIndex: 0, type: 'comment.verse' }]
		},
		{
			line: '    still comment',
			tokens: [{ startIndex: 0, type: 'comment.verse' }]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: '    after a blank line',
			tokens: [{ startIndex: 0, type: 'comment.verse' }]
		},
		{
			line: 'X := 1',
			tokens: [
				{ startIndex: 0, type: 'identifier.verse' },
				{ startIndex: 1, type: 'white.verse' },
				{ startIndex: 2, type: 'operator.verse' },
				{ startIndex: 4, type: 'white.verse' },
				{ startIndex: 5, type: 'number.verse' }
			]
		}
	],
	[
		{
			line: 'F():void =',
			tokens: [
				{ startIndex: 0, type: 'identifier.verse' },
				{ startIndex: 1, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 3, type: 'operator.verse' },
				{ startIndex: 4, type: 'keyword.type.verse' },
				{ startIndex: 8, type: 'white.verse' },
				{ startIndex: 9, type: 'operator.verse' }
			]
		},
		{
			line: '    <#> A note',
			tokens: [
				{ startIndex: 0, type: 'white.verse' },
				{ startIndex: 4, type: 'comment.verse' }
			]
		},
		{
			line: '        that continues here',
			tokens: [{ startIndex: 0, type: 'comment.verse' }]
		},
		{
			line: '    Print("done")',
			tokens: [
				{ startIndex: 0, type: 'white.verse' },
				{ startIndex: 4, type: 'identifier.verse' },
				{ startIndex: 9, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 10, type: 'string.verse' },
				{ startIndex: 16, type: 'delimiter.parenthesis.verse' }
			]
		}
	],
	[
		{
			line: 'G():void =',
			tokens: [
				{ startIndex: 0, type: 'identifier.verse' },
				{ startIndex: 1, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 3, type: 'operator.verse' },
				{ startIndex: 4, type: 'keyword.type.verse' },
				{ startIndex: 8, type: 'white.verse' },
				{ startIndex: 9, type: 'operator.verse' }
			]
		},
		{
			line: '\t<#> tab note',
			tokens: [
				{ startIndex: 0, type: 'white.verse' },
				{ startIndex: 1, type: 'comment.verse' }
			]
		},
		{
			line: '\t\tmore',
			tokens: [{ startIndex: 0, type: 'comment.verse' }]
		},
		{
			line: '\tY := 2',
			tokens: [
				{ startIndex: 0, type: 'white.verse' },
				{ startIndex: 1, type: 'identifier.verse' },
				{ startIndex: 2, type: 'white.verse' },
				{ startIndex: 3, type: 'operator.verse' },
				{ startIndex: 5, type: 'white.verse' },
				{ startIndex: 6, type: 'number.verse' }
			]
		}
	],
	[
		{
			line: '<#> first',
			tokens: [{ startIndex: 0, type: 'comment.verse' }]
		},
		{
			line: '    a',
			tokens: [{ startIndex: 0, type: 'comment.verse' }]
		},
		{
			line: '<#> second',
			tokens: [{ startIndex: 0, type: 'comment.verse' }]
		},
		{
			line: '    b',
			tokens: [{ startIndex: 0, type: 'comment.verse' }]
		},
		{
			line: 'Z := 3',
			tokens: [
				{ startIndex: 0, type: 'identifier.verse' },
				{ startIndex: 1, type: 'white.verse' },
				{ startIndex: 2, type: 'operator.verse' },
				{ startIndex: 4, type: 'white.verse' },
				{ startIndex: 5, type: 'number.verse' }
			]
		}
	],
	[
		{
			line: 'X := 1 <#> rest of line',
			tokens: [
				{ startIndex: 0, type: 'identifier.verse' },
				{ startIndex: 1, type: 'white.verse' },
				{ startIndex: 2, type: 'operator.verse' },
				{ startIndex: 4, type: 'white.verse' },
				{ startIndex: 5, type: 'number.verse' },
				{ startIndex: 6, type: 'white.verse' },
				{ startIndex: 7, type: 'comment.verse' }
			]
		}
	],
	// Strings, escapes and interpolation
	[
		{
			line: 'Greeting := "Hello, {Name}!"',
			tokens: [
				{ startIndex: 0, type: 'identifier.verse' },
				{ startIndex: 8, type: 'white.verse' },
				{ startIndex: 9, type: 'operator.verse' },
				{ startIndex: 11, type: 'white.verse' },
				{ startIndex: 12, type: 'string.verse' },
				{ startIndex: 20, type: 'delimiter.bracket.verse' },
				{ startIndex: 21, type: 'identifier.verse' },
				{ startIndex: 25, type: 'delimiter.bracket.verse' },
				{ startIndex: 26, type: 'string.verse' }
			]
		}
	],
	[
		{
			line: 'Escaped := "a\\nb\\{c\\}\\<d\\>"',
			tokens: [
				{ startIndex: 0, type: 'identifier.verse' },
				{ startIndex: 7, type: 'white.verse' },
				{ startIndex: 8, type: 'operator.verse' },
				{ startIndex: 10, type: 'white.verse' },
				{ startIndex: 11, type: 'string.verse' },
				{ startIndex: 13, type: 'string.escape.verse' },
				{ startIndex: 15, type: 'string.verse' },
				{ startIndex: 16, type: 'string.escape.verse' },
				{ startIndex: 18, type: 'string.verse' },
				{ startIndex: 19, type: 'string.escape.verse' },
				{ startIndex: 23, type: 'string.verse' },
				{ startIndex: 24, type: 'string.escape.verse' },
				{ startIndex: 26, type: 'string.verse' }
			]
		}
	],
	[
		{
			line: 'Label := "{array{1, 2}.Length} items"',
			tokens: [
				{ startIndex: 0, type: 'identifier.verse' },
				{ startIndex: 5, type: 'white.verse' },
				{ startIndex: 6, type: 'operator.verse' },
				{ startIndex: 8, type: 'white.verse' },
				{ startIndex: 9, type: 'string.verse' },
				{ startIndex: 10, type: 'delimiter.bracket.verse' },
				{ startIndex: 11, type: 'keyword.verse' },
				{ startIndex: 16, type: 'delimiter.curly.verse' },
				{ startIndex: 17, type: 'number.verse' },
				{ startIndex: 18, type: 'delimiter.verse' },
				{ startIndex: 19, type: 'white.verse' },
				{ startIndex: 20, type: 'number.verse' },
				{ startIndex: 21, type: 'delimiter.curly.verse' },
				{ startIndex: 22, type: 'delimiter.verse' },
				{ startIndex: 23, type: 'identifier.verse' },
				{ startIndex: 29, type: 'delimiter.bracket.verse' },
				{ startIndex: 30, type: 'string.verse' }
			]
		}
	],
	[
		{
			line: 'Line := "Say {Quote("hi")} now"',
			tokens: [
				{ startIndex: 0, type: 'identifier.verse' },
				{ startIndex: 4, type: 'white.verse' },
				{ startIndex: 5, type: 'operator.verse' },
				{ startIndex: 7, type: 'white.verse' },
				{ startIndex: 8, type: 'string.verse' },
				{ startIndex: 13, type: 'delimiter.bracket.verse' },
				{ startIndex: 14, type: 'identifier.verse' },
				{ startIndex: 19, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 20, type: 'string.verse' },
				{ startIndex: 24, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 25, type: 'delimiter.bracket.verse' },
				{ startIndex: 26, type: 'string.verse' }
			]
		}
	],
	[
		{
			line: 'Left := "{Count <# n #>} left"',
			tokens: [
				{ startIndex: 0, type: 'identifier.verse' },
				{ startIndex: 4, type: 'white.verse' },
				{ startIndex: 5, type: 'operator.verse' },
				{ startIndex: 7, type: 'white.verse' },
				{ startIndex: 8, type: 'string.verse' },
				{ startIndex: 9, type: 'delimiter.bracket.verse' },
				{ startIndex: 10, type: 'identifier.verse' },
				{ startIndex: 15, type: 'white.verse' },
				{ startIndex: 16, type: 'comment.verse' },
				{ startIndex: 23, type: 'delimiter.bracket.verse' },
				{ startIndex: 24, type: 'string.verse' }
			]
		}
	],
	[
		{
			line: 'Long := "first {',
			tokens: [
				{ startIndex: 0, type: 'identifier.verse' },
				{ startIndex: 4, type: 'white.verse' },
				{ startIndex: 5, type: 'operator.verse' },
				{ startIndex: 7, type: 'white.verse' },
				{ startIndex: 8, type: 'string.verse' },
				{ startIndex: 15, type: 'delimiter.bracket.verse' }
			]
		},
		{
			line: '}second"',
			tokens: [
				{ startIndex: 0, type: 'delimiter.bracket.verse' },
				{ startIndex: 1, type: 'string.verse' }
			]
		}
	],
	// A block comment inside a string is a comment
	[
		{
			line: 'Text := "ab<#comment#>cd"',
			tokens: [
				{ startIndex: 0, type: 'identifier.verse' },
				{ startIndex: 4, type: 'white.verse' },
				{ startIndex: 5, type: 'operator.verse' },
				{ startIndex: 7, type: 'white.verse' },
				{ startIndex: 8, type: 'string.verse' },
				{ startIndex: 11, type: 'comment.verse' },
				{ startIndex: 22, type: 'string.verse' }
			]
		}
	],
	[
		{
			line: 'Hash := "a\\<#b"',
			tokens: [
				{ startIndex: 0, type: 'identifier.verse' },
				{ startIndex: 4, type: 'white.verse' },
				{ startIndex: 5, type: 'operator.verse' },
				{ startIndex: 7, type: 'white.verse' },
				{ startIndex: 8, type: 'string.verse' },
				{ startIndex: 10, type: 'string.escape.verse' },
				{ startIndex: 12, type: 'string.verse' }
			]
		}
	],
	// Invalid escapes and unterminated strings
	[
		{
			line: 'Bad := "\\q"',
			tokens: [
				{ startIndex: 0, type: 'identifier.verse' },
				{ startIndex: 3, type: 'white.verse' },
				{ startIndex: 4, type: 'operator.verse' },
				{ startIndex: 6, type: 'white.verse' },
				{ startIndex: 7, type: 'string.verse' },
				{ startIndex: 8, type: 'string.escape.invalid.verse' },
				{ startIndex: 10, type: 'string.verse' }
			]
		}
	],
	[
		{
			line: 'Open := "unterminated',
			tokens: [
				{ startIndex: 0, type: 'identifier.verse' },
				{ startIndex: 4, type: 'white.verse' },
				{ startIndex: 5, type: 'operator.verse' },
				{ startIndex: 7, type: 'white.verse' },
				{ startIndex: 8, type: 'string.invalid.verse' }
			]
		},
		{
			line: 'X := 1',
			tokens: [
				{ startIndex: 0, type: 'identifier.verse' },
				{ startIndex: 1, type: 'white.verse' },
				{ startIndex: 2, type: 'operator.verse' },
				{ startIndex: 4, type: 'white.verse' },
				{ startIndex: 5, type: 'number.verse' }
			]
		}
	],
	// Characters
	[
		{
			line: "Letters := array{'a', '\\n', 0o61}",
			tokens: [
				{ startIndex: 0, type: 'identifier.verse' },
				{ startIndex: 7, type: 'white.verse' },
				{ startIndex: 8, type: 'operator.verse' },
				{ startIndex: 10, type: 'white.verse' },
				{ startIndex: 11, type: 'keyword.verse' },
				{ startIndex: 16, type: 'delimiter.curly.verse' },
				{ startIndex: 17, type: 'string.verse' },
				{ startIndex: 20, type: 'delimiter.verse' },
				{ startIndex: 21, type: 'white.verse' },
				{ startIndex: 22, type: 'string.verse' },
				{ startIndex: 23, type: 'string.escape.verse' },
				{ startIndex: 25, type: 'string.verse' },
				{ startIndex: 26, type: 'delimiter.verse' },
				{ startIndex: 27, type: 'white.verse' },
				{ startIndex: 28, type: 'string.verse' },
				{ startIndex: 32, type: 'delimiter.curly.verse' }
			]
		}
	],
	[
		{
			line: "Emoji := array{'😀', 0u1F600}",
			tokens: [
				{ startIndex: 0, type: 'identifier.verse' },
				{ startIndex: 5, type: 'white.verse' },
				{ startIndex: 6, type: 'operator.verse' },
				{ startIndex: 8, type: 'white.verse' },
				{ startIndex: 9, type: 'keyword.verse' },
				{ startIndex: 14, type: 'delimiter.curly.verse' },
				{ startIndex: 15, type: 'string.verse' },
				{ startIndex: 19, type: 'delimiter.verse' },
				{ startIndex: 20, type: 'white.verse' },
				{ startIndex: 21, type: 'string.verse' },
				{ startIndex: 28, type: 'delimiter.curly.verse' }
			]
		}
	],
	[
		{
			line: "Bad := 'ab'",
			tokens: [
				{ startIndex: 0, type: 'identifier.verse' },
				{ startIndex: 3, type: 'white.verse' },
				{ startIndex: 4, type: 'operator.verse' },
				{ startIndex: 6, type: 'white.verse' },
				{ startIndex: 7, type: 'string.invalid.verse' },
				{ startIndex: 8, type: 'identifier.verse' },
				{ startIndex: 10, type: 'string.invalid.verse' }
			]
		}
	],
	// Numbers
	[
		{
			line: 'Ints := array{42, 0xFF, 0123}',
			tokens: [
				{ startIndex: 0, type: 'identifier.verse' },
				{ startIndex: 4, type: 'white.verse' },
				{ startIndex: 5, type: 'operator.verse' },
				{ startIndex: 7, type: 'white.verse' },
				{ startIndex: 8, type: 'keyword.verse' },
				{ startIndex: 13, type: 'delimiter.curly.verse' },
				{ startIndex: 14, type: 'number.verse' },
				{ startIndex: 16, type: 'delimiter.verse' },
				{ startIndex: 17, type: 'white.verse' },
				{ startIndex: 18, type: 'number.hex.verse' },
				{ startIndex: 22, type: 'delimiter.verse' },
				{ startIndex: 23, type: 'white.verse' },
				{ startIndex: 24, type: 'number.verse' },
				{ startIndex: 28, type: 'delimiter.curly.verse' }
			]
		}
	],
	[
		{
			line: 'Floats := array{3.14, 1.0e10, 2.5E-3, 12.34f64}',
			tokens: [
				{ startIndex: 0, type: 'identifier.verse' },
				{ startIndex: 6, type: 'white.verse' },
				{ startIndex: 7, type: 'operator.verse' },
				{ startIndex: 9, type: 'white.verse' },
				{ startIndex: 10, type: 'keyword.verse' },
				{ startIndex: 15, type: 'delimiter.curly.verse' },
				{ startIndex: 16, type: 'number.float.verse' },
				{ startIndex: 20, type: 'delimiter.verse' },
				{ startIndex: 21, type: 'white.verse' },
				{ startIndex: 22, type: 'number.float.verse' },
				{ startIndex: 28, type: 'delimiter.verse' },
				{ startIndex: 29, type: 'white.verse' },
				{ startIndex: 30, type: 'number.float.verse' },
				{ startIndex: 36, type: 'delimiter.verse' },
				{ startIndex: 37, type: 'white.verse' },
				{ startIndex: 38, type: 'number.float.verse' },
				{ startIndex: 46, type: 'delimiter.curly.verse' }
			]
		}
	],
	[
		{
			line: 'for (I := 0..9):',
			tokens: [
				{ startIndex: 0, type: 'keyword.verse' },
				{ startIndex: 3, type: 'white.verse' },
				{ startIndex: 4, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 5, type: 'identifier.verse' },
				{ startIndex: 6, type: 'white.verse' },
				{ startIndex: 7, type: 'operator.verse' },
				{ startIndex: 9, type: 'white.verse' },
				{ startIndex: 10, type: 'number.verse' },
				{ startIndex: 11, type: 'operator.verse' },
				{ startIndex: 13, type: 'number.verse' },
				{ startIndex: 14, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 15, type: 'operator.verse' }
			]
		},
		{
			line: '    Print("{I}")',
			tokens: [
				{ startIndex: 0, type: 'white.verse' },
				{ startIndex: 4, type: 'identifier.verse' },
				{ startIndex: 9, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 10, type: 'string.verse' },
				{ startIndex: 11, type: 'delimiter.bracket.verse' },
				{ startIndex: 12, type: 'identifier.verse' },
				{ startIndex: 13, type: 'delimiter.bracket.verse' },
				{ startIndex: 14, type: 'string.verse' },
				{ startIndex: 15, type: 'delimiter.parenthesis.verse' }
			]
		}
	],
	// Specifiers next to identifiers
	[
		{
			line: 'Spend<public>(Amount:int)<transacts><decides>:void = set Coins -= Amount',
			tokens: [
				{ startIndex: 0, type: 'identifier.verse' },
				{ startIndex: 5, type: 'annotation.verse' },
				{ startIndex: 13, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 14, type: 'identifier.verse' },
				{ startIndex: 20, type: 'operator.verse' },
				{ startIndex: 21, type: 'keyword.type.verse' },
				{ startIndex: 24, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 25, type: 'annotation.verse' },
				{ startIndex: 45, type: 'operator.verse' },
				{ startIndex: 46, type: 'keyword.type.verse' },
				{ startIndex: 50, type: 'white.verse' },
				{ startIndex: 51, type: 'operator.verse' },
				{ startIndex: 52, type: 'white.verse' },
				{ startIndex: 53, type: 'keyword.verse' },
				{ startIndex: 56, type: 'white.verse' },
				{ startIndex: 57, type: 'identifier.verse' },
				{ startIndex: 62, type: 'white.verse' },
				{ startIndex: 63, type: 'operator.verse' },
				{ startIndex: 65, type: 'white.verse' },
				{ startIndex: 66, type: 'identifier.verse' }
			]
		}
	],
	[
		{
			line: 'wallet<public> := class<concrete>(collector):',
			tokens: [
				{ startIndex: 0, type: 'identifier.verse' },
				{ startIndex: 6, type: 'annotation.verse' },
				{ startIndex: 14, type: 'white.verse' },
				{ startIndex: 15, type: 'operator.verse' },
				{ startIndex: 17, type: 'white.verse' },
				{ startIndex: 18, type: 'keyword.verse' },
				{ startIndex: 23, type: 'annotation.verse' },
				{ startIndex: 33, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 34, type: 'identifier.verse' },
				{ startIndex: 43, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 44, type: 'operator.verse' }
			]
		}
	],
	[
		{
			line: 'var<private> Score<public>:int = 0',
			tokens: [
				{ startIndex: 0, type: 'keyword.verse' },
				{ startIndex: 3, type: 'annotation.verse' },
				{ startIndex: 12, type: 'white.verse' },
				{ startIndex: 13, type: 'identifier.verse' },
				{ startIndex: 18, type: 'annotation.verse' },
				{ startIndex: 26, type: 'operator.verse' },
				{ startIndex: 27, type: 'keyword.type.verse' },
				{ startIndex: 30, type: 'white.verse' },
				{ startIndex: 31, type: 'operator.verse' },
				{ startIndex: 32, type: 'white.verse' },
				{ startIndex: 33, type: 'number.verse' }
			]
		}
	],
	[
		{
			line: 'Helper<scoped{/MyProject/Core}>():void = {}',
			tokens: [
				{ startIndex: 0, type: 'identifier.verse' },
				{ startIndex: 6, type: 'annotation.verse' },
				{ startIndex: 31, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 33, type: 'operator.verse' },
				{ startIndex: 34, type: 'keyword.type.verse' },
				{ startIndex: 38, type: 'white.verse' },
				{ startIndex: 39, type: 'operator.verse' },
				{ startIndex: 40, type: 'white.verse' },
				{ startIndex: 41, type: 'delimiter.curly.verse' }
			]
		}
	],
	[
		{
			line: 'var Health<getter(GetHealth)><setter(SetHealth)>:int = external{}',
			tokens: [
				{ startIndex: 0, type: 'keyword.verse' },
				{ startIndex: 3, type: 'white.verse' },
				{ startIndex: 4, type: 'identifier.verse' },
				{ startIndex: 10, type: 'annotation.verse' },
				{ startIndex: 48, type: 'operator.verse' },
				{ startIndex: 49, type: 'keyword.type.verse' },
				{ startIndex: 52, type: 'white.verse' },
				{ startIndex: 53, type: 'operator.verse' },
				{ startIndex: 54, type: 'white.verse' },
				{ startIndex: 55, type: 'keyword.verse' },
				{ startIndex: 63, type: 'delimiter.curly.verse' }
			]
		}
	],
	[
		{
			line: 'Msg<localizes>:message = "Hello"',
			tokens: [
				{ startIndex: 0, type: 'identifier.verse' },
				{ startIndex: 3, type: 'annotation.verse' },
				{ startIndex: 14, type: 'operator.verse' },
				{ startIndex: 15, type: 'identifier.verse' },
				{ startIndex: 22, type: 'white.verse' },
				{ startIndex: 23, type: 'operator.verse' },
				{ startIndex: 24, type: 'white.verse' },
				{ startIndex: 25, type: 'string.verse' }
			]
		}
	],
	// Comparisons are not specifiers
	[
		{
			line: 'if (A<B, B>C, A <> C, A <= B, B >= A):',
			tokens: [
				{ startIndex: 0, type: 'keyword.verse' },
				{ startIndex: 2, type: 'white.verse' },
				{ startIndex: 3, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 4, type: 'identifier.verse' },
				{ startIndex: 5, type: 'operator.verse' },
				{ startIndex: 6, type: 'identifier.verse' },
				{ startIndex: 7, type: 'delimiter.verse' },
				{ startIndex: 8, type: 'white.verse' },
				{ startIndex: 9, type: 'identifier.verse' },
				{ startIndex: 10, type: 'operator.verse' },
				{ startIndex: 11, type: 'identifier.verse' },
				{ startIndex: 12, type: 'delimiter.verse' },
				{ startIndex: 13, type: 'white.verse' },
				{ startIndex: 14, type: 'identifier.verse' },
				{ startIndex: 15, type: 'white.verse' },
				{ startIndex: 16, type: 'operator.verse' },
				{ startIndex: 18, type: 'white.verse' },
				{ startIndex: 19, type: 'identifier.verse' },
				{ startIndex: 20, type: 'delimiter.verse' },
				{ startIndex: 21, type: 'white.verse' },
				{ startIndex: 22, type: 'identifier.verse' },
				{ startIndex: 23, type: 'white.verse' },
				{ startIndex: 24, type: 'operator.verse' },
				{ startIndex: 26, type: 'white.verse' },
				{ startIndex: 27, type: 'identifier.verse' },
				{ startIndex: 28, type: 'delimiter.verse' },
				{ startIndex: 29, type: 'white.verse' },
				{ startIndex: 30, type: 'identifier.verse' },
				{ startIndex: 31, type: 'white.verse' },
				{ startIndex: 32, type: 'operator.verse' },
				{ startIndex: 34, type: 'white.verse' },
				{ startIndex: 35, type: 'identifier.verse' },
				{ startIndex: 36, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 37, type: 'operator.verse' }
			]
		},
		{
			line: '    Print("ordered")',
			tokens: [
				{ startIndex: 0, type: 'white.verse' },
				{ startIndex: 4, type: 'identifier.verse' },
				{ startIndex: 9, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 10, type: 'string.verse' },
				{ startIndex: 19, type: 'delimiter.parenthesis.verse' }
			]
		}
	],
	// Attributes
	[
		{
			line: '@editable Button:button_device = button_device{}',
			tokens: [
				{ startIndex: 0, type: 'annotation.verse' },
				{ startIndex: 9, type: 'white.verse' },
				{ startIndex: 10, type: 'identifier.verse' },
				{ startIndex: 16, type: 'operator.verse' },
				{ startIndex: 17, type: 'identifier.verse' },
				{ startIndex: 30, type: 'white.verse' },
				{ startIndex: 31, type: 'operator.verse' },
				{ startIndex: 32, type: 'white.verse' },
				{ startIndex: 33, type: 'identifier.verse' },
				{ startIndex: 46, type: 'delimiter.curly.verse' }
			]
		}
	],
	[
		{
			line: '@editable_number(int){MinValue := option{1}}',
			tokens: [
				{ startIndex: 0, type: 'annotation.verse' },
				{ startIndex: 16, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 17, type: 'keyword.type.verse' },
				{ startIndex: 20, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 21, type: 'delimiter.curly.verse' },
				{ startIndex: 22, type: 'identifier.verse' },
				{ startIndex: 30, type: 'white.verse' },
				{ startIndex: 31, type: 'operator.verse' },
				{ startIndex: 33, type: 'white.verse' },
				{ startIndex: 34, type: 'keyword.type.verse' },
				{ startIndex: 40, type: 'delimiter.curly.verse' },
				{ startIndex: 41, type: 'number.verse' },
				{ startIndex: 42, type: 'delimiter.curly.verse' }
			]
		},
		{
			line: 'var Health:int = 0',
			tokens: [
				{ startIndex: 0, type: 'keyword.verse' },
				{ startIndex: 3, type: 'white.verse' },
				{ startIndex: 4, type: 'identifier.verse' },
				{ startIndex: 10, type: 'operator.verse' },
				{ startIndex: 11, type: 'keyword.type.verse' },
				{ startIndex: 14, type: 'white.verse' },
				{ startIndex: 15, type: 'operator.verse' },
				{ startIndex: 16, type: 'white.verse' },
				{ startIndex: 17, type: 'number.verse' }
			]
		}
	],
	// Keywords, types and operators
	[
		{
			line: 'if (Player := player[Agent]) then Self.Count else 0',
			tokens: [
				{ startIndex: 0, type: 'keyword.verse' },
				{ startIndex: 2, type: 'white.verse' },
				{ startIndex: 3, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 4, type: 'identifier.verse' },
				{ startIndex: 10, type: 'white.verse' },
				{ startIndex: 11, type: 'operator.verse' },
				{ startIndex: 13, type: 'white.verse' },
				{ startIndex: 14, type: 'identifier.verse' },
				{ startIndex: 20, type: 'delimiter.square.verse' },
				{ startIndex: 21, type: 'identifier.verse' },
				{ startIndex: 26, type: 'delimiter.square.verse' },
				{ startIndex: 27, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 28, type: 'white.verse' },
				{ startIndex: 29, type: 'keyword.verse' },
				{ startIndex: 33, type: 'white.verse' },
				{ startIndex: 34, type: 'keyword.verse' },
				{ startIndex: 38, type: 'delimiter.verse' },
				{ startIndex: 39, type: 'identifier.verse' },
				{ startIndex: 44, type: 'white.verse' },
				{ startIndex: 45, type: 'keyword.verse' },
				{ startIndex: 49, type: 'white.verse' },
				{ startIndex: 50, type: 'number.verse' }
			]
		}
	],
	[
		{
			line: 'if (not Done? and (Count > 0 or Forced?)):',
			tokens: [
				{ startIndex: 0, type: 'keyword.verse' },
				{ startIndex: 2, type: 'white.verse' },
				{ startIndex: 3, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 4, type: 'keyword.verse' },
				{ startIndex: 7, type: 'white.verse' },
				{ startIndex: 8, type: 'identifier.verse' },
				{ startIndex: 12, type: 'operator.verse' },
				{ startIndex: 13, type: 'white.verse' },
				{ startIndex: 14, type: 'keyword.verse' },
				{ startIndex: 17, type: 'white.verse' },
				{ startIndex: 18, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 19, type: 'identifier.verse' },
				{ startIndex: 24, type: 'white.verse' },
				{ startIndex: 25, type: 'operator.verse' },
				{ startIndex: 26, type: 'white.verse' },
				{ startIndex: 27, type: 'number.verse' },
				{ startIndex: 28, type: 'white.verse' },
				{ startIndex: 29, type: 'keyword.verse' },
				{ startIndex: 31, type: 'white.verse' },
				{ startIndex: 32, type: 'identifier.verse' },
				{ startIndex: 38, type: 'operator.verse' },
				{ startIndex: 39, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 41, type: 'operator.verse' }
			]
		},
		{
			line: '    Start()',
			tokens: [
				{ startIndex: 0, type: 'white.verse' },
				{ startIndex: 4, type: 'identifier.verse' },
				{ startIndex: 9, type: 'delimiter.parenthesis.verse' }
			]
		}
	],
	[
		{
			line: 'case (Kind):',
			tokens: [
				{ startIndex: 0, type: 'keyword.verse' },
				{ startIndex: 4, type: 'white.verse' },
				{ startIndex: 5, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 6, type: 'identifier.verse' },
				{ startIndex: 10, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 11, type: 'operator.verse' }
			]
		},
		{
			line: '    coin_kind.Gold => 10',
			tokens: [
				{ startIndex: 0, type: 'white.verse' },
				{ startIndex: 4, type: 'identifier.verse' },
				{ startIndex: 13, type: 'delimiter.verse' },
				{ startIndex: 14, type: 'identifier.verse' },
				{ startIndex: 18, type: 'white.verse' },
				{ startIndex: 19, type: 'operator.verse' },
				{ startIndex: 21, type: 'white.verse' },
				{ startIndex: 22, type: 'number.verse' }
			]
		},
		{
			line: '    _ => 1',
			tokens: [
				{ startIndex: 0, type: 'white.verse' },
				{ startIndex: 4, type: 'identifier.verse' },
				{ startIndex: 5, type: 'white.verse' },
				{ startIndex: 6, type: 'operator.verse' },
				{ startIndex: 8, type: 'white.verse' },
				{ startIndex: 9, type: 'number.verse' }
			]
		}
	],
	[
		{
			line: 'Lookup(M:[string]int, K:string)<computes>:?int = option{M[K]}',
			tokens: [
				{ startIndex: 0, type: 'identifier.verse' },
				{ startIndex: 6, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 7, type: 'identifier.verse' },
				{ startIndex: 8, type: 'operator.verse' },
				{ startIndex: 9, type: 'delimiter.square.verse' },
				{ startIndex: 10, type: 'keyword.type.verse' },
				{ startIndex: 16, type: 'delimiter.square.verse' },
				{ startIndex: 17, type: 'keyword.type.verse' },
				{ startIndex: 20, type: 'delimiter.verse' },
				{ startIndex: 21, type: 'white.verse' },
				{ startIndex: 22, type: 'identifier.verse' },
				{ startIndex: 23, type: 'operator.verse' },
				{ startIndex: 24, type: 'keyword.type.verse' },
				{ startIndex: 30, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 31, type: 'annotation.verse' },
				{ startIndex: 41, type: 'operator.verse' },
				{ startIndex: 43, type: 'keyword.type.verse' },
				{ startIndex: 46, type: 'white.verse' },
				{ startIndex: 47, type: 'operator.verse' },
				{ startIndex: 48, type: 'white.verse' },
				{ startIndex: 49, type: 'keyword.type.verse' },
				{ startIndex: 55, type: 'delimiter.curly.verse' },
				{ startIndex: 56, type: 'identifier.verse' },
				{ startIndex: 57, type: 'delimiter.square.verse' },
				{ startIndex: 58, type: 'identifier.verse' },
				{ startIndex: 59, type: 'delimiter.square.verse' },
				{ startIndex: 60, type: 'delimiter.curly.verse' }
			]
		}
	],
	[
		{
			line: 'var Scores:weak_map(player, int) = map{}',
			tokens: [
				{ startIndex: 0, type: 'keyword.verse' },
				{ startIndex: 3, type: 'white.verse' },
				{ startIndex: 4, type: 'identifier.verse' },
				{ startIndex: 10, type: 'operator.verse' },
				{ startIndex: 11, type: 'keyword.type.verse' },
				{ startIndex: 19, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 20, type: 'identifier.verse' },
				{ startIndex: 26, type: 'delimiter.verse' },
				{ startIndex: 27, type: 'white.verse' },
				{ startIndex: 28, type: 'keyword.type.verse' },
				{ startIndex: 31, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 32, type: 'white.verse' },
				{ startIndex: 33, type: 'operator.verse' },
				{ startIndex: 34, type: 'white.verse' },
				{ startIndex: 35, type: 'keyword.verse' },
				{ startIndex: 38, type: 'delimiter.curly.verse' }
			]
		}
	],
	[
		{
			line: 'set Total += 1; set Total -= 1; set Scale *= 2.0; set Scale /= 2.0',
			tokens: [
				{ startIndex: 0, type: 'keyword.verse' },
				{ startIndex: 3, type: 'white.verse' },
				{ startIndex: 4, type: 'identifier.verse' },
				{ startIndex: 9, type: 'white.verse' },
				{ startIndex: 10, type: 'operator.verse' },
				{ startIndex: 12, type: 'white.verse' },
				{ startIndex: 13, type: 'number.verse' },
				{ startIndex: 14, type: 'delimiter.verse' },
				{ startIndex: 15, type: 'white.verse' },
				{ startIndex: 16, type: 'keyword.verse' },
				{ startIndex: 19, type: 'white.verse' },
				{ startIndex: 20, type: 'identifier.verse' },
				{ startIndex: 25, type: 'white.verse' },
				{ startIndex: 26, type: 'operator.verse' },
				{ startIndex: 28, type: 'white.verse' },
				{ startIndex: 29, type: 'number.verse' },
				{ startIndex: 30, type: 'delimiter.verse' },
				{ startIndex: 31, type: 'white.verse' },
				{ startIndex: 32, type: 'keyword.verse' },
				{ startIndex: 35, type: 'white.verse' },
				{ startIndex: 36, type: 'identifier.verse' },
				{ startIndex: 41, type: 'white.verse' },
				{ startIndex: 42, type: 'operator.verse' },
				{ startIndex: 44, type: 'white.verse' },
				{ startIndex: 45, type: 'number.float.verse' },
				{ startIndex: 48, type: 'delimiter.verse' },
				{ startIndex: 49, type: 'white.verse' },
				{ startIndex: 50, type: 'keyword.verse' },
				{ startIndex: 53, type: 'white.verse' },
				{ startIndex: 54, type: 'identifier.verse' },
				{ startIndex: 59, type: 'white.verse' },
				{ startIndex: 60, type: 'operator.verse' },
				{ startIndex: 62, type: 'white.verse' },
				{ startIndex: 63, type: 'number.float.verse' }
			]
		}
	],
	[
		{
			line: 'Indexes := for (Index -> Item : Items) { Index }',
			tokens: [
				{ startIndex: 0, type: 'identifier.verse' },
				{ startIndex: 7, type: 'white.verse' },
				{ startIndex: 8, type: 'operator.verse' },
				{ startIndex: 10, type: 'white.verse' },
				{ startIndex: 11, type: 'keyword.verse' },
				{ startIndex: 14, type: 'white.verse' },
				{ startIndex: 15, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 16, type: 'identifier.verse' },
				{ startIndex: 21, type: 'white.verse' },
				{ startIndex: 22, type: 'operator.verse' },
				{ startIndex: 24, type: 'white.verse' },
				{ startIndex: 25, type: 'identifier.verse' },
				{ startIndex: 29, type: 'white.verse' },
				{ startIndex: 30, type: 'operator.verse' },
				{ startIndex: 31, type: 'white.verse' },
				{ startIndex: 32, type: 'identifier.verse' },
				{ startIndex: 37, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 38, type: 'white.verse' },
				{ startIndex: 39, type: 'delimiter.curly.verse' },
				{ startIndex: 40, type: 'white.verse' },
				{ startIndex: 41, type: 'identifier.verse' },
				{ startIndex: 46, type: 'white.verse' },
				{ startIndex: 47, type: 'delimiter.curly.verse' }
			]
		}
	],
	[
		{
			line: 'Half := Total / 2.0',
			tokens: [
				{ startIndex: 0, type: 'identifier.verse' },
				{ startIndex: 4, type: 'white.verse' },
				{ startIndex: 5, type: 'operator.verse' },
				{ startIndex: 7, type: 'white.verse' },
				{ startIndex: 8, type: 'identifier.verse' },
				{ startIndex: 13, type: 'white.verse' },
				{ startIndex: 14, type: 'operator.verse' },
				{ startIndex: 15, type: 'white.verse' },
				{ startIndex: 16, type: 'number.float.verse' }
			]
		}
	],
	[
		{
			line: 'race:',
			tokens: [
				{ startIndex: 0, type: 'keyword.verse' },
				{ startIndex: 4, type: 'operator.verse' }
			]
		},
		{
			line: '    Sleep(1.0)',
			tokens: [
				{ startIndex: 0, type: 'white.verse' },
				{ startIndex: 4, type: 'identifier.verse' },
				{ startIndex: 9, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 10, type: 'number.float.verse' },
				{ startIndex: 13, type: 'delimiter.parenthesis.verse' }
			]
		},
		{
			line: '    WaitForWinner()',
			tokens: [
				{ startIndex: 0, type: 'white.verse' },
				{ startIndex: 4, type: 'identifier.verse' },
				{ startIndex: 17, type: 'delimiter.parenthesis.verse' }
			]
		}
	],
	[
		{
			line: 'spawn{ CountDown(3) }',
			tokens: [
				{ startIndex: 0, type: 'keyword.verse' },
				{ startIndex: 5, type: 'delimiter.curly.verse' },
				{ startIndex: 6, type: 'white.verse' },
				{ startIndex: 7, type: 'identifier.verse' },
				{ startIndex: 16, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 17, type: 'number.verse' },
				{ startIndex: 18, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 19, type: 'white.verse' },
				{ startIndex: 20, type: 'delimiter.curly.verse' }
			]
		}
	],
	[
		{
			line: 'block:',
			tokens: [
				{ startIndex: 0, type: 'keyword.verse' },
				{ startIndex: 5, type: 'operator.verse' }
			]
		},
		{
			line: '    defer:',
			tokens: [
				{ startIndex: 0, type: 'white.verse' },
				{ startIndex: 4, type: 'keyword.verse' },
				{ startIndex: 9, type: 'operator.verse' }
			]
		},
		{
			line: '        Print("bye")',
			tokens: [
				{ startIndex: 0, type: 'white.verse' },
				{ startIndex: 8, type: 'identifier.verse' },
				{ startIndex: 13, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 14, type: 'string.verse' },
				{ startIndex: 19, type: 'delimiter.parenthesis.verse' }
			]
		}
	],
	// Paths
	[
		{
			line: 'using { /Verse.org/Simulation }',
			tokens: [
				{ startIndex: 0, type: 'keyword.verse' },
				{ startIndex: 5, type: 'white.verse' },
				{ startIndex: 6, type: 'delimiter.curly.verse' },
				{ startIndex: 7, type: 'white.verse' },
				{ startIndex: 8, type: 'constant.path.verse' },
				{ startIndex: 29, type: 'white.verse' },
				{ startIndex: 30, type: 'delimiter.curly.verse' }
			]
		}
	],
	[
		{
			line: 'using { Models.PlayerData } # a module of this project',
			tokens: [
				{ startIndex: 0, type: 'keyword.verse' },
				{ startIndex: 5, type: 'white.verse' },
				{ startIndex: 6, type: 'delimiter.curly.verse' },
				{ startIndex: 7, type: 'white.verse' },
				{ startIndex: 8, type: 'constant.path.verse' },
				{ startIndex: 25, type: 'white.verse' },
				{ startIndex: 26, type: 'delimiter.curly.verse' },
				{ startIndex: 27, type: 'white.verse' },
				{ startIndex: 28, type: 'comment.verse' }
			]
		}
	],
	[
		{
			line: 'using { /user@example.com/MyModule }',
			tokens: [
				{ startIndex: 0, type: 'keyword.verse' },
				{ startIndex: 5, type: 'white.verse' },
				{ startIndex: 6, type: 'delimiter.curly.verse' },
				{ startIndex: 7, type: 'white.verse' },
				{ startIndex: 8, type: 'constant.path.verse' },
				{ startIndex: 34, type: 'white.verse' },
				{ startIndex: 35, type: 'delimiter.curly.verse' }
			]
		}
	],
	[
		{
			line: 'Rand := import(/Verse.org/Random)',
			tokens: [
				{ startIndex: 0, type: 'identifier.verse' },
				{ startIndex: 4, type: 'white.verse' },
				{ startIndex: 5, type: 'operator.verse' },
				{ startIndex: 7, type: 'white.verse' },
				{ startIndex: 8, type: 'keyword.verse' },
				{ startIndex: 14, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 15, type: 'constant.path.verse' },
				{ startIndex: 32, type: 'delimiter.parenthesis.verse' }
			]
		}
	],
	[
		{
			line: 'N := (/Verse.org/Random:)GetRandomInt(1, 6)',
			tokens: [
				{ startIndex: 0, type: 'identifier.verse' },
				{ startIndex: 1, type: 'white.verse' },
				{ startIndex: 2, type: 'operator.verse' },
				{ startIndex: 4, type: 'white.verse' },
				{ startIndex: 5, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 6, type: 'constant.path.verse' },
				{ startIndex: 23, type: 'operator.verse' },
				{ startIndex: 24, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 25, type: 'identifier.verse' },
				{ startIndex: 37, type: 'delimiter.parenthesis.verse' },
				{ startIndex: 38, type: 'number.verse' },
				{ startIndex: 39, type: 'delimiter.verse' },
				{ startIndex: 40, type: 'white.verse' },
				{ startIndex: 41, type: 'number.verse' },
				{ startIndex: 42, type: 'delimiter.parenthesis.verse' }
			]
		}
	]
]);
