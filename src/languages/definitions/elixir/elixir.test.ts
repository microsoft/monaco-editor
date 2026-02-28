/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('elixir', [
	// Keywords - module definition
	[
		{
			line: 'defmodule Foo do end',
			tokens: [
				{ startIndex: 0, type: 'keyword.declaration.elixir' },
				{ startIndex: 9, type: 'white.elixir' },
				{ startIndex: 10, type: 'type.identifier.elixir' },
				{ startIndex: 13, type: 'white.elixir' },
				{ startIndex: 14, type: 'keyword.elixir' },
				{ startIndex: 16, type: 'white.elixir' },
				{ startIndex: 17, type: 'keyword.elixir' }
			]
		}
	],
	// Keywords - function definition
	[
		{
			line: 'def foo(x) do end',
			tokens: [
				{ startIndex: 0, type: 'keyword.declaration.elixir' },
				{ startIndex: 3, type: 'white.elixir' },
				{ startIndex: 4, type: 'function.elixir' },
				{ startIndex: 7, type: 'delimiter.parenthesis.elixir' },
				{ startIndex: 8, type: 'identifier.elixir' },
				{ startIndex: 9, type: 'delimiter.parenthesis.elixir' },
				{ startIndex: 10, type: 'white.elixir' },
				{ startIndex: 11, type: 'keyword.elixir' },
				{ startIndex: 13, type: 'white.elixir' },
				{ startIndex: 14, type: 'keyword.elixir' }
			]
		}
	],
	// Keywords - macro
	[
		{
			line: 'defmacro mac(name) do quote do def unquote(name)() do nil end end end',
			tokens: [
				{ startIndex: 0, type: 'keyword.declaration.elixir' },
				{ startIndex: 8, type: 'white.elixir' },
				{ startIndex: 9, type: 'function.elixir' },
				{ startIndex: 12, type: 'delimiter.parenthesis.elixir' },
				{ startIndex: 13, type: 'identifier.elixir' },
				{ startIndex: 17, type: 'delimiter.parenthesis.elixir' },
				{ startIndex: 18, type: 'white.elixir' },
				{ startIndex: 19, type: 'keyword.elixir' },
				{ startIndex: 21, type: 'white.elixir' },
				{ startIndex: 22, type: 'keyword.elixir' },
				{ startIndex: 27, type: 'white.elixir' },
				{ startIndex: 28, type: 'keyword.elixir' },
				{ startIndex: 30, type: 'white.elixir' },
				{ startIndex: 31, type: 'keyword.declaration.elixir' },
				{ startIndex: 34, type: 'white.elixir' },
				{ startIndex: 35, type: 'keyword.elixir' },
				{ startIndex: 42, type: 'delimiter.parenthesis.elixir' },
				{ startIndex: 43, type: 'identifier.elixir' },
				{ startIndex: 47, type: 'delimiter.parenthesis.elixir' },
				{ startIndex: 50, type: 'white.elixir' },
				{ startIndex: 51, type: 'keyword.elixir' },
				{ startIndex: 53, type: 'white.elixir' },
				{ startIndex: 54, type: 'constant.language.elixir' },
				{ startIndex: 57, type: 'white.elixir' },
				{ startIndex: 58, type: 'keyword.elixir' },
				{ startIndex: 61, type: 'white.elixir' },
				{ startIndex: 62, type: 'keyword.elixir' },
				{ startIndex: 65, type: 'white.elixir' },
				{ startIndex: 66, type: 'keyword.elixir' }
			]
		}
	],
	// Comments
	[
		{
			line: 'nil # comment',
			tokens: [
				{ startIndex: 0, type: 'constant.language.elixir' },
				{ startIndex: 3, type: 'white.elixir' },
				{ startIndex: 4, type: 'comment.punctuation.elixir' },
				{ startIndex: 5, type: 'comment.elixir' }
			]
		}
	],
	// Keyword list shorthand
	[
		{
			line: '["key": value]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.elixir' },
				{ startIndex: 1, type: 'constant.delimiter.elixir' },
				{ startIndex: 2, type: 'constant.elixir' },
				{ startIndex: 5, type: 'constant.delimiter.elixir' },
				{ startIndex: 7, type: 'white.elixir' },
				{ startIndex: 8, type: 'identifier.elixir' },
				{ startIndex: 13, type: 'delimiter.square.elixir' }
			]
		}
	],
	// Numbers
	[
		{
			line: '[1,1.23,1.23e-10,0xab,0o171,0b01001]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.elixir' },
				{ startIndex: 1, type: 'number.elixir' },
				{ startIndex: 2, type: 'punctuation.elixir' },
				{ startIndex: 3, type: 'number.float.elixir' },
				{ startIndex: 7, type: 'punctuation.elixir' },
				{ startIndex: 8, type: 'number.float.elixir' },
				{ startIndex: 16, type: 'punctuation.elixir' },
				{ startIndex: 17, type: 'number.hex.elixir' },
				{ startIndex: 21, type: 'punctuation.elixir' },
				{ startIndex: 22, type: 'number.octal.elixir' },
				{ startIndex: 27, type: 'punctuation.elixir' },
				{ startIndex: 28, type: 'number.binary.elixir' },
				{ startIndex: 35, type: 'delimiter.square.elixir' }
			]
		}
	],
	// Unused bindings
	[
		{
			line: 'def foo(_x) do _y = 1 end',
			tokens: [
				{ startIndex: 0, type: 'keyword.declaration.elixir' },
				{ startIndex: 3, type: 'white.elixir' },
				{ startIndex: 4, type: 'function.elixir' },
				{ startIndex: 7, type: 'delimiter.parenthesis.elixir' },
				{ startIndex: 8, type: 'comment.unused.elixir' },
				{ startIndex: 10, type: 'delimiter.parenthesis.elixir' },
				{ startIndex: 11, type: 'white.elixir' },
				{ startIndex: 12, type: 'keyword.elixir' },
				{ startIndex: 14, type: 'white.elixir' },
				{ startIndex: 15, type: 'comment.unused.elixir' },
				{ startIndex: 17, type: 'white.elixir' },
				{ startIndex: 18, type: 'operator.elixir' },
				{ startIndex: 19, type: 'white.elixir' },
				{ startIndex: 20, type: 'number.elixir' },
				{ startIndex: 21, type: 'white.elixir' },
				{ startIndex: 22, type: 'keyword.elixir' }
			]
		}
	],
	// Function calls
	[
		{
			line: 'foo(x)',
			tokens: [
				{ startIndex: 0, type: 'function.call.elixir' },
				{ startIndex: 3, type: 'delimiter.parenthesis.elixir' },
				{ startIndex: 4, type: 'identifier.elixir' },
				{ startIndex: 5, type: 'delimiter.parenthesis.elixir' }
			]
		}
	],
	[
		{
			line: 'foo.()',
			tokens: [
				{ startIndex: 0, type: 'function.call.elixir' },
				{ startIndex: 3, type: 'operator.elixir' },
				{ startIndex: 4, type: 'delimiter.parenthesis.elixir' }
			]
		}
	],
	[
		{
			line: 'Mod.foo()',
			tokens: [
				{ startIndex: 0, type: 'type.identifier.elixir' },
				{ startIndex: 3, type: 'operator.elixir' },
				{ startIndex: 4, type: 'function.call.elixir' },
				{ startIndex: 7, type: 'delimiter.parenthesis.elixir' }
			]
		}
	],
	// Function call (Erlang module)
	[
		{
			line: ':mo.foo()',
			tokens: [
				{ startIndex: 0, type: 'constant.punctuation.elixir' },
				{ startIndex: 1, type: 'constant.elixir' },
				{ startIndex: 3, type: 'operator.elixir' },
				{ startIndex: 4, type: 'function.call.elixir' },
				{ startIndex: 7, type: 'delimiter.parenthesis.elixir' }
			]
		}
	],
	// Function call (pipe)
	[
		{
			line: '1 |> abs()',
			tokens: [
				{ startIndex: 0, type: 'number.elixir' },
				{ startIndex: 1, type: 'white.elixir' },
				{ startIndex: 2, type: 'operator.elixir' },
				{ startIndex: 4, type: 'white.elixir' },
				{ startIndex: 5, type: 'function.call.elixir' },
				{ startIndex: 8, type: 'delimiter.parenthesis.elixir' }
			]
		}
	],
	// Function reference
	[
		{
			line: '&max(&1,&2)',
			tokens: [
				{ startIndex: 0, type: 'operator.elixir' },
				{ startIndex: 1, type: 'function.call.elixir' },
				{ startIndex: 4, type: 'delimiter.parenthesis.elixir' },
				{ startIndex: 5, type: 'operator.elixir' },
				{ startIndex: 7, type: 'punctuation.elixir' },
				{ startIndex: 8, type: 'operator.elixir' },
				{ startIndex: 10, type: 'delimiter.parenthesis.elixir' }
			]
		}
	],
	// Strings
	[
		{
			line: '"foo"',
			tokens: [
				{ startIndex: 0, type: 'string.delimiter.elixir' },
				{ startIndex: 1, type: 'string.elixir' },
				{ startIndex: 4, type: 'string.delimiter.elixir' }
			]
		}
	],
	[
		{
			line: '"foo \\u0065\\u0301 #{1}"',
			tokens: [
				{ startIndex: 0, type: 'string.delimiter.elixir' },
				{ startIndex: 1, type: 'string.elixir' },
				{ startIndex: 5, type: 'constant.character.escape.elixir' },
				{ startIndex: 17, type: 'string.elixir' },
				{ startIndex: 18, type: 'delimiter.bracket.embed.elixir' },
				{ startIndex: 20, type: 'number.elixir' },
				{ startIndex: 21, type: 'delimiter.bracket.embed.elixir' },
				{ startIndex: 22, type: 'string.delimiter.elixir' }
			]
		}
	],
	[
		{
			line: '"""heredoc"""',
			tokens: [
				{ startIndex: 0, type: 'string.delimiter.elixir' },
				{ startIndex: 3, type: 'string.elixir' },
				{ startIndex: 10, type: 'string.delimiter.elixir' }
			]
		}
	],
	// Atom strings
	[
		{
			line: ':"atom"',
			tokens: [
				{ startIndex: 0, type: 'constant.delimiter.elixir' },
				{ startIndex: 2, type: 'constant.elixir' },
				{ startIndex: 6, type: 'constant.delimiter.elixir' }
			]
		}
	],
	// Sigils (string)
	[
		{
			line: '~s{foo}',
			tokens: [
				{ startIndex: 0, type: 'string.delimiter.elixir' },
				{ startIndex: 3, type: 'string.elixir' },
				{ startIndex: 6, type: 'string.delimiter.elixir' }
			]
		}
	],
	// Sigils (regexp)
	[
		{
			line: '~r/foo/',
			tokens: [
				{ startIndex: 0, type: 'regexp.delimiter.elixir' },
				{ startIndex: 3, type: 'regexp.elixir' },
				{ startIndex: 6, type: 'regexp.delimiter.elixir' }
			]
		}
	],
	// Sigils (other)
	[
		{
			line: '~D/foo/',
			tokens: [
				{ startIndex: 0, type: 'sigil.delimiter.elixir' },
				{ startIndex: 3, type: 'sigil.elixir' },
				{ startIndex: 6, type: 'sigil.delimiter.elixir' }
			]
		}
	],
	// Sigils (multi-letter uppercase)
	[
		{
			line: '~DX/foo/',
			tokens: [
				{ startIndex: 0, type: 'sigil.delimiter.elixir' },
				{ startIndex: 4, type: 'sigil.elixir' },
				{ startIndex: 7, type: 'sigil.delimiter.elixir' }
			]
		}
	],
	// Sigils (no interpolation)
	[
		{
			line: '~W/foo#{1}/',
			tokens: [
				{ startIndex: 0, type: 'sigil.delimiter.elixir' },
				{ startIndex: 3, type: 'sigil.elixir' },
				{ startIndex: 10, type: 'sigil.delimiter.elixir' }
			]
		}
	],
	// Sigils (multi-letter uppercase no interpolation)
	[
		{
			line: '~WW/foo#{1}/',
			tokens: [
				{ startIndex: 0, type: 'sigil.delimiter.elixir' },
				{ startIndex: 4, type: 'sigil.elixir' },
				{ startIndex: 11, type: 'sigil.delimiter.elixir' }
			]
		}
	],
	// Sigils (modifiers)
	[
		{
			line: '~X/custom/az09',
			tokens: [
				{ startIndex: 0, type: 'sigil.delimiter.elixir' },
				{ startIndex: 3, type: 'sigil.elixir' },
				{ startIndex: 9, type: 'sigil.delimiter.elixir' }
			]
		}
	],
	// Sigils (multi-letter uppercase with modifiers)
	[
		{
			line: '~DX/custom/az09',
			tokens: [
				{ startIndex: 0, type: 'sigil.delimiter.elixir' },
				{ startIndex: 4, type: 'sigil.elixir' },
				{ startIndex: 10, type: 'sigil.delimiter.elixir' }
			]
		}
	],
	// Module attributes
	[
		{
			line: '@attr 1',
			tokens: [
				{ startIndex: 0, type: 'variable.elixir' },
				{ startIndex: 5, type: 'white.elixir' },
				{ startIndex: 6, type: 'number.elixir' }
			]
		}
	],
	// Module attributes (docs)
	[
		{
			line: '@doc "foo"',
			tokens: [{ startIndex: 0, type: 'comment.block.documentation.elixir' }]
		}
	],
	// Operator definition
	[
		{
			line: 'def a ~> b, do: max(a,b)',
			tokens: [
				{ startIndex: 0, type: 'keyword.declaration.elixir' },
				{ startIndex: 3, type: 'white.elixir' },
				{ startIndex: 4, type: 'identifier.elixir' },
				{ startIndex: 5, type: 'white.elixir' },
				{ startIndex: 6, type: 'operator.elixir' },
				{ startIndex: 8, type: 'white.elixir' },
				{ startIndex: 9, type: 'identifier.elixir' },
				{ startIndex: 10, type: 'punctuation.elixir' },
				{ startIndex: 11, type: 'white.elixir' },
				{ startIndex: 12, type: 'constant.elixir' },
				{ startIndex: 14, type: 'constant.punctuation.elixir' },
				{ startIndex: 15, type: 'white.elixir' },
				{ startIndex: 16, type: 'function.call.elixir' },
				{ startIndex: 19, type: 'delimiter.parenthesis.elixir' },
				{ startIndex: 20, type: 'identifier.elixir' },
				{ startIndex: 21, type: 'punctuation.elixir' },
				{ startIndex: 22, type: 'identifier.elixir' },
				{ startIndex: 23, type: 'delimiter.parenthesis.elixir' }
			]
		}
	],
	// Constants
	[
		{
			line: '[true,false,nil]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.square.elixir' },
				{ startIndex: 1, type: 'constant.language.elixir' },
				{ startIndex: 5, type: 'punctuation.elixir' },
				{ startIndex: 6, type: 'constant.language.elixir' },
				{ startIndex: 11, type: 'punctuation.elixir' },
				{ startIndex: 12, type: 'constant.language.elixir' },
				{ startIndex: 15, type: 'delimiter.square.elixir' }
			]
		}
	],
	// Bitstrings
	[
		{
			line: '<<height::32-integer, width::32-integer, data::binary>>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.angle.special.elixir' },
				{ startIndex: 2, type: 'identifier.elixir' },
				{ startIndex: 8, type: 'operator.elixir' },
				{ startIndex: 10, type: 'number.elixir' },
				{ startIndex: 12, type: 'operator.elixir' },
				{ startIndex: 13, type: 'identifier.elixir' },
				{ startIndex: 20, type: 'punctuation.elixir' },
				{ startIndex: 21, type: 'white.elixir' },
				{ startIndex: 22, type: 'identifier.elixir' },
				{ startIndex: 27, type: 'operator.elixir' },
				{ startIndex: 29, type: 'number.elixir' },
				{ startIndex: 31, type: 'operator.elixir' },
				{ startIndex: 32, type: 'identifier.elixir' },
				{ startIndex: 39, type: 'punctuation.elixir' },
				{ startIndex: 40, type: 'white.elixir' },
				{ startIndex: 41, type: 'identifier.elixir' },
				{ startIndex: 45, type: 'operator.elixir' },
				{ startIndex: 47, type: 'identifier.elixir' },
				{ startIndex: 53, type: 'delimiter.angle.special.elixir' }
			]
		}
	]
]);
