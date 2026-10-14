/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

// Fresh examples and migrated expectations for the pinned upstream references in AGENTS.md.
testTokenization('mojo', [
	// ParsedArgument::parse(), parseArgOrParamList(): contextual conventions.
	[
		{
			line: 'def take(var item: Int):',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 9, type: 'keyword.mojo' },
				{ startIndex: 12, type: 'white.mojo' },
				{ startIndex: 13, type: 'identifier.mojo' },
				{ startIndex: 17, type: 'delimiter.mojo' },
				{ startIndex: 18, type: 'white.mojo' },
				{ startIndex: 19, type: 'identifier.mojo' },
				{ startIndex: 22, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 23, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'def take(ref item: Int):',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 9, type: 'keyword.mojo' },
				{ startIndex: 12, type: 'white.mojo' },
				{ startIndex: 13, type: 'identifier.mojo' },
				{ startIndex: 17, type: 'delimiter.mojo' },
				{ startIndex: 18, type: 'white.mojo' },
				{ startIndex: 19, type: 'identifier.mojo' },
				{ startIndex: 22, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 23, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'def take(out item: Int):',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 9, type: 'keyword.mojo' },
				{ startIndex: 12, type: 'white.mojo' },
				{ startIndex: 13, type: 'identifier.mojo' },
				{ startIndex: 17, type: 'delimiter.mojo' },
				{ startIndex: 18, type: 'white.mojo' },
				{ startIndex: 19, type: 'identifier.mojo' },
				{ startIndex: 22, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 23, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'def take(mut item: Int):',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 9, type: 'keyword.mojo' },
				{ startIndex: 12, type: 'white.mojo' },
				{ startIndex: 13, type: 'identifier.mojo' },
				{ startIndex: 17, type: 'delimiter.mojo' },
				{ startIndex: 18, type: 'white.mojo' },
				{ startIndex: 19, type: 'identifier.mojo' },
				{ startIndex: 22, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 23, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'def take(imm item: Int):',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 9, type: 'keyword.mojo' },
				{ startIndex: 12, type: 'white.mojo' },
				{ startIndex: 13, type: 'identifier.mojo' },
				{ startIndex: 17, type: 'delimiter.mojo' },
				{ startIndex: 18, type: 'white.mojo' },
				{ startIndex: 19, type: 'identifier.mojo' },
				{ startIndex: 22, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 23, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'def take(read item: Int):',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 9, type: 'keyword.mojo' },
				{ startIndex: 13, type: 'white.mojo' },
				{ startIndex: 14, type: 'identifier.mojo' },
				{ startIndex: 18, type: 'delimiter.mojo' },
				{ startIndex: 19, type: 'white.mojo' },
				{ startIndex: 20, type: 'identifier.mojo' },
				{ startIndex: 23, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 24, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'def take(deinit item: Int):',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 9, type: 'keyword.mojo' },
				{ startIndex: 15, type: 'white.mojo' },
				{ startIndex: 16, type: 'identifier.mojo' },
				{ startIndex: 20, type: 'delimiter.mojo' },
				{ startIndex: 21, type: 'white.mojo' },
				{ startIndex: 22, type: 'identifier.mojo' },
				{ startIndex: 25, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 26, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'def take(`out` item: Int):',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 9, type: 'keyword.mojo' },
				{ startIndex: 14, type: 'white.mojo' },
				{ startIndex: 15, type: 'identifier.mojo' },
				{ startIndex: 19, type: 'delimiter.mojo' },
				{ startIndex: 20, type: 'white.mojo' },
				{ startIndex: 21, type: 'identifier.mojo' },
				{ startIndex: 24, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 25, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'def take(`mut` item: Int):',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 9, type: 'keyword.mojo' },
				{ startIndex: 14, type: 'white.mojo' },
				{ startIndex: 15, type: 'identifier.mojo' },
				{ startIndex: 19, type: 'delimiter.mojo' },
				{ startIndex: 20, type: 'white.mojo' },
				{ startIndex: 21, type: 'identifier.mojo' },
				{ startIndex: 24, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 25, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'def take(`imm` item: Int):',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 9, type: 'keyword.mojo' },
				{ startIndex: 14, type: 'white.mojo' },
				{ startIndex: 15, type: 'identifier.mojo' },
				{ startIndex: 19, type: 'delimiter.mojo' },
				{ startIndex: 20, type: 'white.mojo' },
				{ startIndex: 21, type: 'identifier.mojo' },
				{ startIndex: 24, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 25, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'def take(`read` item: Int):',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 9, type: 'keyword.mojo' },
				{ startIndex: 15, type: 'white.mojo' },
				{ startIndex: 16, type: 'identifier.mojo' },
				{ startIndex: 20, type: 'delimiter.mojo' },
				{ startIndex: 21, type: 'white.mojo' },
				{ startIndex: 22, type: 'identifier.mojo' },
				{ startIndex: 25, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 26, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'def take(`deinit` item: Int):',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 9, type: 'keyword.mojo' },
				{ startIndex: 17, type: 'white.mojo' },
				{ startIndex: 18, type: 'identifier.mojo' },
				{ startIndex: 22, type: 'delimiter.mojo' },
				{ startIndex: 23, type: 'white.mojo' },
				{ startIndex: 24, type: 'identifier.mojo' },
				{ startIndex: 27, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 28, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'def take(`var`:Int):',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 14, type: 'delimiter.mojo' },
				{ startIndex: 15, type: 'identifier.mojo' },
				{ startIndex: 18, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 19, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'def take(`ref`:Int):',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 14, type: 'delimiter.mojo' },
				{ startIndex: 15, type: 'identifier.mojo' },
				{ startIndex: 18, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 19, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'def take(`imm`value:Int):',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 9, type: 'keyword.mojo' },
				{ startIndex: 14, type: 'identifier.mojo' },
				{ startIndex: 19, type: 'delimiter.mojo' },
				{ startIndex: 20, type: 'identifier.mojo' },
				{ startIndex: 23, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 24, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'def take(mut *items:Int,out[_] result:Int):',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 9, type: 'keyword.mojo' },
				{ startIndex: 12, type: 'white.mojo' },
				{ startIndex: 13, type: 'operator.mojo' },
				{ startIndex: 14, type: 'identifier.mojo' },
				{ startIndex: 19, type: 'delimiter.mojo' },
				{ startIndex: 20, type: 'identifier.mojo' },
				{ startIndex: 23, type: 'delimiter.mojo' },
				{ startIndex: 24, type: 'keyword.mojo' },
				{ startIndex: 27, type: 'delimiter.square.mojo' },
				{ startIndex: 28, type: 'keyword.mojo' },
				{ startIndex: 29, type: 'delimiter.square.mojo' },
				{ startIndex: 30, type: 'white.mojo' },
				{ startIndex: 31, type: 'identifier.mojo' },
				{ startIndex: 37, type: 'delimiter.mojo' },
				{ startIndex: 38, type: 'identifier.mojo' },
				{ startIndex: 41, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 42, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'def take(imm mut:Int):',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 9, type: 'keyword.mojo' },
				{ startIndex: 12, type: 'white.mojo' },
				{ startIndex: 13, type: 'identifier.mojo' },
				{ startIndex: 16, type: 'delimiter.mojo' },
				{ startIndex: 17, type: 'identifier.mojo' },
				{ startIndex: 20, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 21, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'def take(item:Int=obj.mut if ready else 8):',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 13, type: 'delimiter.mojo' },
				{ startIndex: 14, type: 'identifier.mojo' },
				{ startIndex: 17, type: 'operator.mojo' },
				{ startIndex: 18, type: 'identifier.mojo' },
				{ startIndex: 21, type: 'delimiter.mojo' },
				{ startIndex: 22, type: 'identifier.mojo' },
				{ startIndex: 25, type: 'white.mojo' },
				{ startIndex: 26, type: 'keyword.mojo' },
				{ startIndex: 28, type: 'white.mojo' },
				{ startIndex: 29, type: 'identifier.mojo' },
				{ startIndex: 34, type: 'white.mojo' },
				{ startIndex: 35, type: 'keyword.mojo' },
				{ startIndex: 39, type: 'white.mojo' },
				{ startIndex: 40, type: 'number.mojo' },
				{ startIndex: 41, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 42, type: 'delimiter.mojo' }
			]
		}
	],
	// ParsedConstraint::parse(), trailing constraints and ordinary soft names.
	[
		{
			line: 'def take() `where` `where`:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 10, type: 'white.mojo' },
				{ startIndex: 11, type: 'keyword.mojo' },
				{ startIndex: 18, type: 'white.mojo' },
				{ startIndex: 19, type: 'identifier.mojo' },
				{ startIndex: 26, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'def take[n:Int]() where where() and not where:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.square.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 10, type: 'delimiter.mojo' },
				{ startIndex: 11, type: 'identifier.mojo' },
				{ startIndex: 14, type: 'delimiter.square.mojo' },
				{ startIndex: 15, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 17, type: 'white.mojo' },
				{ startIndex: 18, type: 'keyword.mojo' },
				{ startIndex: 23, type: 'white.mojo' },
				{ startIndex: 24, type: 'identifier.mojo' },
				{ startIndex: 29, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 31, type: 'white.mojo' },
				{ startIndex: 32, type: 'keyword.mojo' },
				{ startIndex: 35, type: 'white.mojo' },
				{ startIndex: 36, type: 'keyword.mojo' },
				{ startIndex: 39, type: 'white.mojo' },
				{ startIndex: 40, type: 'identifier.mojo' },
				{ startIndex: 45, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'comptime Alias[n:Int] where n>0 where n<9=where',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 8, type: 'white.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 14, type: 'delimiter.square.mojo' },
				{ startIndex: 15, type: 'identifier.mojo' },
				{ startIndex: 16, type: 'delimiter.mojo' },
				{ startIndex: 17, type: 'identifier.mojo' },
				{ startIndex: 20, type: 'delimiter.square.mojo' },
				{ startIndex: 21, type: 'white.mojo' },
				{ startIndex: 22, type: 'keyword.mojo' },
				{ startIndex: 27, type: 'white.mojo' },
				{ startIndex: 28, type: 'identifier.mojo' },
				{ startIndex: 29, type: 'operator.mojo' },
				{ startIndex: 30, type: 'number.mojo' },
				{ startIndex: 31, type: 'white.mojo' },
				{ startIndex: 32, type: 'keyword.mojo' },
				{ startIndex: 37, type: 'white.mojo' },
				{ startIndex: 38, type: 'identifier.mojo' },
				{ startIndex: 39, type: 'operator.mojo' },
				{ startIndex: 40, type: 'number.mojo' },
				{ startIndex: 41, type: 'operator.mojo' },
				{ startIndex: 42, type: 'identifier.mojo' }
			]
		}
	],
	[
		{
			line: 'def take[imm:Int]():',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.square.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 12, type: 'delimiter.mojo' },
				{ startIndex: 13, type: 'identifier.mojo' },
				{ startIndex: 16, type: 'delimiter.square.mojo' },
				{ startIndex: 17, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 19, type: 'delimiter.mojo' }
			]
		}
	],
	// ParsedCaptureList::parseCaptureList(): named and default captures.
	[
		{
			line: 'def inner(){var}:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 9, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 11, type: 'delimiter.curly.mojo' },
				{ startIndex: 12, type: 'keyword.mojo' },
				{ startIndex: 15, type: 'delimiter.curly.mojo' },
				{ startIndex: 16, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'def inner(){mut}:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 9, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 11, type: 'delimiter.curly.mojo' },
				{ startIndex: 12, type: 'keyword.mojo' },
				{ startIndex: 15, type: 'delimiter.curly.mojo' },
				{ startIndex: 16, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'def inner(){imm}:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 9, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 11, type: 'delimiter.curly.mojo' },
				{ startIndex: 12, type: 'keyword.mojo' },
				{ startIndex: 15, type: 'delimiter.curly.mojo' },
				{ startIndex: 16, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'def inner(){read}:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 9, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 11, type: 'delimiter.curly.mojo' },
				{ startIndex: 12, type: 'keyword.mojo' },
				{ startIndex: 16, type: 'delimiter.curly.mojo' },
				{ startIndex: 17, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'def inner(){ref}:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 9, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 11, type: 'delimiter.curly.mojo' },
				{ startIndex: 12, type: 'keyword.mojo' },
				{ startIndex: 15, type: 'delimiter.curly.mojo' },
				{ startIndex: 16, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'def inner(){`mut`}:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 9, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 11, type: 'delimiter.curly.mojo' },
				{ startIndex: 12, type: 'keyword.mojo' },
				{ startIndex: 17, type: 'delimiter.curly.mojo' },
				{ startIndex: 18, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'def inner(){`imm`}:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 9, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 11, type: 'delimiter.curly.mojo' },
				{ startIndex: 12, type: 'keyword.mojo' },
				{ startIndex: 17, type: 'delimiter.curly.mojo' },
				{ startIndex: 18, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'def inner(){`read`}:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 9, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 11, type: 'delimiter.curly.mojo' },
				{ startIndex: 12, type: 'keyword.mojo' },
				{ startIndex: 18, type: 'delimiter.curly.mojo' },
				{ startIndex: 19, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'def inner(){var imm,mut item}:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 9, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 11, type: 'delimiter.curly.mojo' },
				{ startIndex: 12, type: 'keyword.mojo' },
				{ startIndex: 15, type: 'white.mojo' },
				{ startIndex: 16, type: 'identifier.mojo' },
				{ startIndex: 19, type: 'delimiter.mojo' },
				{ startIndex: 20, type: 'keyword.mojo' },
				{ startIndex: 23, type: 'white.mojo' },
				{ startIndex: 24, type: 'identifier.mojo' },
				{ startIndex: 28, type: 'delimiter.curly.mojo' },
				{ startIndex: 29, type: 'delimiter.mojo' }
			]
		}
	],
	// parseArgumentListAndEffects(): all recognized effect spellings in source order.
	[
		{
			line: 'comptime Callable=def() raises -> Int',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 8, type: 'white.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 17, type: 'operator.mojo' },
				{ startIndex: 18, type: 'keyword.mojo' },
				{ startIndex: 21, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 23, type: 'white.mojo' },
				{ startIndex: 24, type: 'keyword.mojo' },
				{ startIndex: 30, type: 'white.mojo' },
				{ startIndex: 31, type: 'operator.mojo' },
				{ startIndex: 33, type: 'white.mojo' },
				{ startIndex: 34, type: 'identifier.mojo' }
			]
		}
	],
	[
		{
			line: 'comptime Callable=def() capturing -> Int',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 8, type: 'white.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 17, type: 'operator.mojo' },
				{ startIndex: 18, type: 'keyword.mojo' },
				{ startIndex: 21, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 23, type: 'white.mojo' },
				{ startIndex: 24, type: 'keyword.mojo' },
				{ startIndex: 33, type: 'white.mojo' },
				{ startIndex: 34, type: 'operator.mojo' },
				{ startIndex: 36, type: 'white.mojo' },
				{ startIndex: 37, type: 'identifier.mojo' }
			]
		}
	],
	[
		{
			line: 'comptime Callable=def() escaping -> Int',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 8, type: 'white.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 17, type: 'operator.mojo' },
				{ startIndex: 18, type: 'keyword.mojo' },
				{ startIndex: 21, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 23, type: 'white.mojo' },
				{ startIndex: 24, type: 'keyword.mojo' },
				{ startIndex: 32, type: 'white.mojo' },
				{ startIndex: 33, type: 'operator.mojo' },
				{ startIndex: 35, type: 'white.mojo' },
				{ startIndex: 36, type: 'identifier.mojo' }
			]
		}
	],
	[
		{
			line: 'comptime Callable=def() thin -> Int',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 8, type: 'white.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 17, type: 'operator.mojo' },
				{ startIndex: 18, type: 'keyword.mojo' },
				{ startIndex: 21, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 23, type: 'white.mojo' },
				{ startIndex: 24, type: 'keyword.mojo' },
				{ startIndex: 28, type: 'white.mojo' },
				{ startIndex: 29, type: 'operator.mojo' },
				{ startIndex: 31, type: 'white.mojo' },
				{ startIndex: 32, type: 'identifier.mojo' }
			]
		}
	],
	[
		{
			line: 'comptime Callable=def() register_passable -> Int',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 8, type: 'white.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 17, type: 'operator.mojo' },
				{ startIndex: 18, type: 'keyword.mojo' },
				{ startIndex: 21, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 23, type: 'white.mojo' },
				{ startIndex: 24, type: 'keyword.mojo' },
				{ startIndex: 41, type: 'white.mojo' },
				{ startIndex: 42, type: 'operator.mojo' },
				{ startIndex: 44, type: 'white.mojo' },
				{ startIndex: 45, type: 'identifier.mojo' }
			]
		}
	],
	[
		{
			line: 'comptime Callable=def() abi -> Int',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 8, type: 'white.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 17, type: 'operator.mojo' },
				{ startIndex: 18, type: 'keyword.mojo' },
				{ startIndex: 21, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 23, type: 'white.mojo' },
				{ startIndex: 24, type: 'keyword.mojo' },
				{ startIndex: 27, type: 'white.mojo' },
				{ startIndex: 28, type: 'operator.mojo' },
				{ startIndex: 30, type: 'white.mojo' },
				{ startIndex: 31, type: 'identifier.mojo' }
			]
		}
	],
	[
		{
			line: 'comptime Callable=def() __param_trait__ -> Int',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 8, type: 'white.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 17, type: 'operator.mojo' },
				{ startIndex: 18, type: 'keyword.mojo' },
				{ startIndex: 21, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 23, type: 'white.mojo' },
				{ startIndex: 24, type: 'keyword.mojo' },
				{ startIndex: 39, type: 'white.mojo' },
				{ startIndex: 40, type: 'operator.mojo' },
				{ startIndex: 42, type: 'white.mojo' },
				{ startIndex: 43, type: 'identifier.mojo' }
			]
		}
	],
	[
		{
			line: 'comptime Callable=def() `raises` -> Int',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 8, type: 'white.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 17, type: 'operator.mojo' },
				{ startIndex: 18, type: 'keyword.mojo' },
				{ startIndex: 21, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 23, type: 'white.mojo' },
				{ startIndex: 24, type: 'keyword.mojo' },
				{ startIndex: 32, type: 'white.mojo' },
				{ startIndex: 33, type: 'operator.mojo' },
				{ startIndex: 35, type: 'white.mojo' },
				{ startIndex: 36, type: 'identifier.mojo' }
			]
		}
	],
	[
		{
			line: 'comptime Callable=def() `capturing` -> Int',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 8, type: 'white.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 17, type: 'operator.mojo' },
				{ startIndex: 18, type: 'keyword.mojo' },
				{ startIndex: 21, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 23, type: 'white.mojo' },
				{ startIndex: 24, type: 'keyword.mojo' },
				{ startIndex: 35, type: 'white.mojo' },
				{ startIndex: 36, type: 'operator.mojo' },
				{ startIndex: 38, type: 'white.mojo' },
				{ startIndex: 39, type: 'identifier.mojo' }
			]
		}
	],
	[
		{
			line: 'comptime Callable=def() `thin` -> Int',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 8, type: 'white.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 17, type: 'operator.mojo' },
				{ startIndex: 18, type: 'keyword.mojo' },
				{ startIndex: 21, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 23, type: 'white.mojo' },
				{ startIndex: 24, type: 'keyword.mojo' },
				{ startIndex: 30, type: 'white.mojo' },
				{ startIndex: 31, type: 'operator.mojo' },
				{ startIndex: 33, type: 'white.mojo' },
				{ startIndex: 34, type: 'identifier.mojo' }
			]
		}
	],
	[
		{
			line: 'comptime Callable=def() `abi` -> Int',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 8, type: 'white.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 17, type: 'operator.mojo' },
				{ startIndex: 18, type: 'keyword.mojo' },
				{ startIndex: 21, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 23, type: 'white.mojo' },
				{ startIndex: 24, type: 'keyword.mojo' },
				{ startIndex: 29, type: 'white.mojo' },
				{ startIndex: 30, type: 'operator.mojo' },
				{ startIndex: 32, type: 'white.mojo' },
				{ startIndex: 33, type: 'identifier.mojo' }
			]
		}
	],
	[
		{
			line: 'def take() raises mod.where abi("Mojo"):',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 10, type: 'white.mojo' },
				{ startIndex: 11, type: 'keyword.mojo' },
				{ startIndex: 17, type: 'white.mojo' },
				{ startIndex: 18, type: 'identifier.mojo' },
				{ startIndex: 21, type: 'delimiter.mojo' },
				{ startIndex: 22, type: 'identifier.mojo' },
				{ startIndex: 27, type: 'white.mojo' },
				{ startIndex: 28, type: 'keyword.mojo' },
				{ startIndex: 31, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 32, type: 'string.mojo' },
				{ startIndex: 38, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 39, type: 'delimiter.mojo' }
			]
		}
	],
	// parseResultIfPresent(): effect names are ordinary identifiers in a type.
	[
		{
			line: 'def make()->raises:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 10, type: 'operator.mojo' },
				{ startIndex: 12, type: 'identifier.mojo' },
				{ startIndex: 18, type: 'delimiter.mojo' }
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
	[
		{
			line: 'def make()->where:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 10, type: 'operator.mojo' },
				{ startIndex: 12, type: 'identifier.mojo' },
				{ startIndex: 17, type: 'delimiter.mojo' }
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
	[
		{
			line: 'def make()->capturing:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 10, type: 'operator.mojo' },
				{ startIndex: 12, type: 'identifier.mojo' },
				{ startIndex: 21, type: 'delimiter.mojo' }
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
	[
		{
			line: 'def make()->thin:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 10, type: 'operator.mojo' },
				{ startIndex: 12, type: 'identifier.mojo' },
				{ startIndex: 16, type: 'delimiter.mojo' }
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
	[
		{
			line: 'def make()->abi:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 10, type: 'operator.mojo' },
				{ startIndex: 12, type: 'identifier.mojo' },
				{ startIndex: 15, type: 'delimiter.mojo' }
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
	[
		{
			line: 'def make()->`where`:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 10, type: 'operator.mojo' },
				{ startIndex: 12, type: 'identifier.mojo' },
				{ startIndex: 19, type: 'delimiter.mojo' }
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
	[
		{
			line: 'def make()->`raises`:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 10, type: 'operator.mojo' },
				{ startIndex: 12, type: 'identifier.mojo' },
				{ startIndex: 20, type: 'delimiter.mojo' }
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
	[
		{
			line: 'def make()->Other&where:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 10, type: 'operator.mojo' },
				{ startIndex: 12, type: 'identifier.mojo' },
				{ startIndex: 17, type: 'operator.mojo' },
				{ startIndex: 18, type: 'identifier.mojo' },
				{ startIndex: 23, type: 'delimiter.mojo' }
			]
		}
	],
	// parseFunctionType(), parseLambda(): nested callable boundaries and captures.
	[
		{
			line: 'def apply(f:def(Int) thin->Int,mut item:Int):',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 9, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 10, type: 'identifier.mojo' },
				{ startIndex: 11, type: 'delimiter.mojo' },
				{ startIndex: 12, type: 'keyword.mojo' },
				{ startIndex: 15, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 16, type: 'identifier.mojo' },
				{ startIndex: 19, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 20, type: 'white.mojo' },
				{ startIndex: 21, type: 'keyword.mojo' },
				{ startIndex: 25, type: 'operator.mojo' },
				{ startIndex: 27, type: 'identifier.mojo' },
				{ startIndex: 30, type: 'delimiter.mojo' },
				{ startIndex: 31, type: 'keyword.mojo' },
				{ startIndex: 34, type: 'white.mojo' },
				{ startIndex: 35, type: 'identifier.mojo' },
				{ startIndex: 39, type: 'delimiter.mojo' },
				{ startIndex: 40, type: 'identifier.mojo' },
				{ startIndex: 43, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 44, type: 'delimiter.mojo' }
			]
		},
		{
			line: '    mut',
			tokens: [
				{ startIndex: 0, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' }
			]
		}
	],
	[
		{
			line: 'lambda(imm item:Int){mut}->Int:item',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 6, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 7, type: 'keyword.mojo' },
				{ startIndex: 10, type: 'white.mojo' },
				{ startIndex: 11, type: 'identifier.mojo' },
				{ startIndex: 15, type: 'delimiter.mojo' },
				{ startIndex: 16, type: 'identifier.mojo' },
				{ startIndex: 19, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 20, type: 'delimiter.curly.mojo' },
				{ startIndex: 21, type: 'keyword.mojo' },
				{ startIndex: 24, type: 'delimiter.curly.mojo' },
				{ startIndex: 25, type: 'operator.mojo' },
				{ startIndex: 27, type: 'identifier.mojo' },
				{ startIndex: 30, type: 'delimiter.mojo' },
				{ startIndex: 31, type: 'identifier.mojo' }
			]
		}
	],
	// Soft conventions remain names in parameters, unlike argument conventions.
	[
		{
			line: 'def f[mut:Int,out:Int,read:Int,deinit:Int]():',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 5, type: 'delimiter.square.mojo' },
				{ startIndex: 6, type: 'identifier.mojo' },
				{ startIndex: 9, type: 'delimiter.mojo' },
				{ startIndex: 10, type: 'identifier.mojo' },
				{ startIndex: 13, type: 'delimiter.mojo' },
				{ startIndex: 14, type: 'identifier.mojo' },
				{ startIndex: 17, type: 'delimiter.mojo' },
				{ startIndex: 18, type: 'identifier.mojo' },
				{ startIndex: 21, type: 'delimiter.mojo' },
				{ startIndex: 22, type: 'identifier.mojo' },
				{ startIndex: 26, type: 'delimiter.mojo' },
				{ startIndex: 27, type: 'identifier.mojo' },
				{ startIndex: 30, type: 'delimiter.mojo' },
				{ startIndex: 31, type: 'identifier.mojo' },
				{ startIndex: 37, type: 'delimiter.mojo' },
				{ startIndex: 38, type: 'identifier.mojo' },
				{ startIndex: 41, type: 'delimiter.square.mojo' },
				{ startIndex: 42, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 44, type: 'delimiter.mojo' }
			]
		}
	],
	// Argument markers, inferred/variadic parameters and defaults (parameters.mojo).
	[
		{
			line: 'def f(a:Int,/,*,b:Int=2):',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 5, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 6, type: 'identifier.mojo' },
				{ startIndex: 7, type: 'delimiter.mojo' },
				{ startIndex: 8, type: 'identifier.mojo' },
				{ startIndex: 11, type: 'delimiter.mojo' },
				{ startIndex: 12, type: 'operator.mojo' },
				{ startIndex: 13, type: 'delimiter.mojo' },
				{ startIndex: 14, type: 'operator.mojo' },
				{ startIndex: 15, type: 'delimiter.mojo' },
				{ startIndex: 16, type: 'identifier.mojo' },
				{ startIndex: 17, type: 'delimiter.mojo' },
				{ startIndex: 18, type: 'identifier.mojo' },
				{ startIndex: 21, type: 'operator.mojo' },
				{ startIndex: 22, type: 'number.mojo' },
				{ startIndex: 23, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 24, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'def f[n:Int=2,//,*xs:Int]():',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 5, type: 'delimiter.square.mojo' },
				{ startIndex: 6, type: 'identifier.mojo' },
				{ startIndex: 7, type: 'delimiter.mojo' },
				{ startIndex: 8, type: 'identifier.mojo' },
				{ startIndex: 11, type: 'operator.mojo' },
				{ startIndex: 12, type: 'number.mojo' },
				{ startIndex: 13, type: 'delimiter.mojo' },
				{ startIndex: 14, type: 'operator.mojo' },
				{ startIndex: 16, type: 'delimiter.mojo' },
				{ startIndex: 17, type: 'operator.mojo' },
				{ startIndex: 18, type: 'identifier.mojo' },
				{ startIndex: 20, type: 'delimiter.mojo' },
				{ startIndex: 21, type: 'identifier.mojo' },
				{ startIndex: 24, type: 'delimiter.square.mojo' },
				{ startIndex: 25, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 27, type: 'delimiter.mojo' }
			]
		}
	],
	// Keyword packs retain their convention (decls/variadic_kwargs.mojo).
	[
		{
			line: 'def f(var **kw:Int):',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 5, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 6, type: 'keyword.mojo' },
				{ startIndex: 9, type: 'white.mojo' },
				{ startIndex: 10, type: 'operator.mojo' },
				{ startIndex: 12, type: 'identifier.mojo' },
				{ startIndex: 14, type: 'delimiter.mojo' },
				{ startIndex: 15, type: 'identifier.mojo' },
				{ startIndex: 18, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 19, type: 'delimiter.mojo' }
			]
		}
	],
	// Origins are expressions; convention spellings in default calls are identifiers.
	[
		{
			line: 'def f(ref[o] x:T):',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 5, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 6, type: 'keyword.mojo' },
				{ startIndex: 9, type: 'delimiter.square.mojo' },
				{ startIndex: 10, type: 'identifier.mojo' },
				{ startIndex: 11, type: 'delimiter.square.mojo' },
				{ startIndex: 12, type: 'white.mojo' },
				{ startIndex: 13, type: 'identifier.mojo' },
				{ startIndex: 14, type: 'delimiter.mojo' },
				{ startIndex: 15, type: 'identifier.mojo' },
				{ startIndex: 16, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 17, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'def f(x:T=make(imm,mut)):',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 5, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 6, type: 'identifier.mojo' },
				{ startIndex: 7, type: 'delimiter.mojo' },
				{ startIndex: 8, type: 'identifier.mojo' },
				{ startIndex: 9, type: 'operator.mojo' },
				{ startIndex: 10, type: 'identifier.mojo' },
				{ startIndex: 14, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 15, type: 'identifier.mojo' },
				{ startIndex: 18, type: 'delimiter.mojo' },
				{ startIndex: 19, type: 'identifier.mojo' },
				{ startIndex: 22, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 24, type: 'delimiter.mojo' }
			]
		}
	],
	// Parameter names and defaults may use where; trailing clauses accept message pairs.
	[
		{
			line: 'def f[where:Int=where]():',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 5, type: 'delimiter.square.mojo' },
				{ startIndex: 6, type: 'identifier.mojo' },
				{ startIndex: 11, type: 'delimiter.mojo' },
				{ startIndex: 12, type: 'identifier.mojo' },
				{ startIndex: 15, type: 'operator.mojo' },
				{ startIndex: 16, type: 'identifier.mojo' },
				{ startIndex: 21, type: 'delimiter.square.mojo' },
				{ startIndex: 22, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 24, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'def f[n:Int]() where (n>0,"🚀"):',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 5, type: 'delimiter.square.mojo' },
				{ startIndex: 6, type: 'identifier.mojo' },
				{ startIndex: 7, type: 'delimiter.mojo' },
				{ startIndex: 8, type: 'identifier.mojo' },
				{ startIndex: 11, type: 'delimiter.square.mojo' },
				{ startIndex: 12, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 14, type: 'white.mojo' },
				{ startIndex: 15, type: 'keyword.mojo' },
				{ startIndex: 20, type: 'white.mojo' },
				{ startIndex: 21, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 22, type: 'identifier.mojo' },
				{ startIndex: 23, type: 'operator.mojo' },
				{ startIndex: 24, type: 'number.mojo' },
				{ startIndex: 25, type: 'delimiter.mojo' },
				{ startIndex: 26, type: 'string.mojo' },
				{ startIndex: 30, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 31, type: 'delimiter.mojo' }
			]
		}
	],
	// Capture-list move markers, a default plus overrides, and trailing commas.
	[
		{
			line: 'def f(){var^,imm x,mut y,ref z}:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 5, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 7, type: 'delimiter.curly.mojo' },
				{ startIndex: 8, type: 'keyword.mojo' },
				{ startIndex: 11, type: 'operator.mojo' },
				{ startIndex: 12, type: 'delimiter.mojo' },
				{ startIndex: 13, type: 'keyword.mojo' },
				{ startIndex: 16, type: 'white.mojo' },
				{ startIndex: 17, type: 'identifier.mojo' },
				{ startIndex: 18, type: 'delimiter.mojo' },
				{ startIndex: 19, type: 'keyword.mojo' },
				{ startIndex: 22, type: 'white.mojo' },
				{ startIndex: 23, type: 'identifier.mojo' },
				{ startIndex: 24, type: 'delimiter.mojo' },
				{ startIndex: 25, type: 'keyword.mojo' },
				{ startIndex: 28, type: 'white.mojo' },
				{ startIndex: 29, type: 'identifier.mojo' },
				{ startIndex: 30, type: 'delimiter.curly.mojo' },
				{ startIndex: 31, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'def f(){x^,var y^,}:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 5, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 7, type: 'delimiter.curly.mojo' },
				{ startIndex: 8, type: 'identifier.mojo' },
				{ startIndex: 9, type: 'operator.mojo' },
				{ startIndex: 10, type: 'delimiter.mojo' },
				{ startIndex: 11, type: 'keyword.mojo' },
				{ startIndex: 14, type: 'white.mojo' },
				{ startIndex: 15, type: 'identifier.mojo' },
				{ startIndex: 16, type: 'operator.mojo' },
				{ startIndex: 17, type: 'delimiter.mojo' },
				{ startIndex: 18, type: 'delimiter.curly.mojo' },
				{ startIndex: 19, type: 'delimiter.mojo' }
			]
		}
	],
	// Duplicate captures remain tokenized; compiler diagnostics are outside this suite.
	[
		{
			line: 'def f(){imm x,mut x}:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 5, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 7, type: 'delimiter.curly.mojo' },
				{ startIndex: 8, type: 'keyword.mojo' },
				{ startIndex: 11, type: 'white.mojo' },
				{ startIndex: 12, type: 'identifier.mojo' },
				{ startIndex: 13, type: 'delimiter.mojo' },
				{ startIndex: 14, type: 'keyword.mojo' },
				{ startIndex: 17, type: 'white.mojo' },
				{ startIndex: 18, type: 'identifier.mojo' },
				{ startIndex: 19, type: 'delimiter.curly.mojo' },
				{ startIndex: 20, type: 'delimiter.mojo' }
			]
		}
	],
	// A thrown primary expression ends before subsequent effects and captures.
	[
		{
			line: 'def f() raises (A|B) capturing {imm x}->T:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 5, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 7, type: 'white.mojo' },
				{ startIndex: 8, type: 'keyword.mojo' },
				{ startIndex: 14, type: 'white.mojo' },
				{ startIndex: 15, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 16, type: 'identifier.mojo' },
				{ startIndex: 17, type: 'operator.mojo' },
				{ startIndex: 18, type: 'identifier.mojo' },
				{ startIndex: 19, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 20, type: 'white.mojo' },
				{ startIndex: 21, type: 'keyword.mojo' },
				{ startIndex: 30, type: 'white.mojo' },
				{ startIndex: 31, type: 'delimiter.curly.mojo' },
				{ startIndex: 32, type: 'keyword.mojo' },
				{ startIndex: 35, type: 'white.mojo' },
				{ startIndex: 36, type: 'identifier.mojo' },
				{ startIndex: 37, type: 'delimiter.curly.mojo' },
				{ startIndex: 38, type: 'operator.mojo' },
				{ startIndex: 40, type: 'identifier.mojo' },
				{ startIndex: 41, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'def f() raises Self.Error abi("Mojo"):',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 5, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 7, type: 'white.mojo' },
				{ startIndex: 8, type: 'keyword.mojo' },
				{ startIndex: 14, type: 'white.mojo' },
				{ startIndex: 15, type: 'keyword.mojo' },
				{ startIndex: 19, type: 'delimiter.mojo' },
				{ startIndex: 20, type: 'identifier.mojo' },
				{ startIndex: 25, type: 'white.mojo' },
				{ startIndex: 26, type: 'keyword.mojo' },
				{ startIndex: 29, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 30, type: 'string.mojo' },
				{ startIndex: 36, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 37, type: 'delimiter.mojo' }
			]
		}
	],
	// Duplicate effects and C ABI spellings are recognized independently of validity.
	[
		{
			line: 'def f() raises raises:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 5, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 7, type: 'white.mojo' },
				{ startIndex: 8, type: 'keyword.mojo' },
				{ startIndex: 14, type: 'white.mojo' },
				{ startIndex: 15, type: 'keyword.mojo' },
				{ startIndex: 21, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'comptime F=def(Int) thin abi("C")->Int',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 8, type: 'white.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 10, type: 'operator.mojo' },
				{ startIndex: 11, type: 'keyword.mojo' },
				{ startIndex: 14, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 15, type: 'identifier.mojo' },
				{ startIndex: 18, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 19, type: 'white.mojo' },
				{ startIndex: 20, type: 'keyword.mojo' },
				{ startIndex: 24, type: 'white.mojo' },
				{ startIndex: 25, type: 'keyword.mojo' },
				{ startIndex: 28, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 29, type: 'string.mojo' },
				{ startIndex: 32, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 33, type: 'operator.mojo' },
				{ startIndex: 35, type: 'identifier.mojo' }
			]
		}
	],
	// Reference results and parenthesized callable results (parseResultIfPresent).
	[
		{
			line: 'def f()->ref[o] T:',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 5, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 7, type: 'operator.mojo' },
				{ startIndex: 9, type: 'keyword.mojo' },
				{ startIndex: 12, type: 'delimiter.square.mojo' },
				{ startIndex: 13, type: 'identifier.mojo' },
				{ startIndex: 14, type: 'delimiter.square.mojo' },
				{ startIndex: 15, type: 'white.mojo' },
				{ startIndex: 16, type: 'identifier.mojo' },
				{ startIndex: 17, type: 'delimiter.mojo' }
			]
		}
	],
	[
		{
			line: 'def f()->(def(Int) thin->Int):',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 5, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 7, type: 'operator.mojo' },
				{ startIndex: 9, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 10, type: 'keyword.mojo' },
				{ startIndex: 13, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 14, type: 'identifier.mojo' },
				{ startIndex: 17, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 18, type: 'white.mojo' },
				{ startIndex: 19, type: 'keyword.mojo' },
				{ startIndex: 23, type: 'operator.mojo' },
				{ startIndex: 25, type: 'identifier.mojo' },
				{ startIndex: 28, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 29, type: 'delimiter.mojo' }
			]
		}
	],
	// Thin generic function types own their trailing constraints (decls/fn_type_where.mojo).
	[
		{
			line: 'comptime F=def[n:Int](Int) thin->None where n>0',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 8, type: 'white.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 10, type: 'operator.mojo' },
				{ startIndex: 11, type: 'keyword.mojo' },
				{ startIndex: 14, type: 'delimiter.square.mojo' },
				{ startIndex: 15, type: 'identifier.mojo' },
				{ startIndex: 16, type: 'delimiter.mojo' },
				{ startIndex: 17, type: 'identifier.mojo' },
				{ startIndex: 20, type: 'delimiter.square.mojo' },
				{ startIndex: 21, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 22, type: 'identifier.mojo' },
				{ startIndex: 25, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 26, type: 'white.mojo' },
				{ startIndex: 27, type: 'keyword.mojo' },
				{ startIndex: 31, type: 'operator.mojo' },
				{ startIndex: 33, type: 'keyword.mojo' },
				{ startIndex: 37, type: 'white.mojo' },
				{ startIndex: 38, type: 'keyword.mojo' },
				{ startIndex: 43, type: 'white.mojo' },
				{ startIndex: 44, type: 'identifier.mojo' },
				{ startIndex: 45, type: 'operator.mojo' },
				{ startIndex: 46, type: 'number.mojo' }
			]
		}
	],
	// Keep the combined parameter/convention/effect/capture/result lambda intact.
	[
		{
			line: 'lambda[n:Int](var x:Int) raises {mut y}->Int:x+n+y',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 6, type: 'delimiter.square.mojo' },
				{ startIndex: 7, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 12, type: 'delimiter.square.mojo' },
				{ startIndex: 13, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 14, type: 'keyword.mojo' },
				{ startIndex: 17, type: 'white.mojo' },
				{ startIndex: 18, type: 'identifier.mojo' },
				{ startIndex: 19, type: 'delimiter.mojo' },
				{ startIndex: 20, type: 'identifier.mojo' },
				{ startIndex: 23, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 24, type: 'white.mojo' },
				{ startIndex: 25, type: 'keyword.mojo' },
				{ startIndex: 31, type: 'white.mojo' },
				{ startIndex: 32, type: 'delimiter.curly.mojo' },
				{ startIndex: 33, type: 'keyword.mojo' },
				{ startIndex: 36, type: 'white.mojo' },
				{ startIndex: 37, type: 'identifier.mojo' },
				{ startIndex: 38, type: 'delimiter.curly.mojo' },
				{ startIndex: 39, type: 'operator.mojo' },
				{ startIndex: 41, type: 'identifier.mojo' },
				{ startIndex: 44, type: 'delimiter.mojo' },
				{ startIndex: 45, type: 'identifier.mojo' },
				{ startIndex: 46, type: 'operator.mojo' },
				{ startIndex: 47, type: 'identifier.mojo' },
				{ startIndex: 48, type: 'operator.mojo' },
				{ startIndex: 49, type: 'identifier.mojo' }
			]
		}
	],
	[
		{
			line: 'lambda(var **kw:Int){}:None',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 6, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 7, type: 'keyword.mojo' },
				{ startIndex: 10, type: 'white.mojo' },
				{ startIndex: 11, type: 'operator.mojo' },
				{ startIndex: 13, type: 'identifier.mojo' },
				{ startIndex: 15, type: 'delimiter.mojo' },
				{ startIndex: 16, type: 'identifier.mojo' },
				{ startIndex: 19, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 20, type: 'delimiter.curly.mojo' },
				{ startIndex: 22, type: 'delimiter.mojo' },
				{ startIndex: 23, type: 'keyword.mojo' }
			]
		}
	],
	[
		{
			line: 'lambda: imm',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 6, type: 'delimiter.mojo' },
				{ startIndex: 7, type: 'white.mojo' },
				{ startIndex: 8, type: 'identifier.mojo' }
			]
		}
	],
	[
		{
			line: 'lambda {var x^,}:x',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 6, type: 'white.mojo' },
				{ startIndex: 7, type: 'delimiter.curly.mojo' },
				{ startIndex: 8, type: 'keyword.mojo' },
				{ startIndex: 11, type: 'white.mojo' },
				{ startIndex: 12, type: 'identifier.mojo' },
				{ startIndex: 13, type: 'operator.mojo' },
				{ startIndex: 14, type: 'delimiter.mojo' },
				{ startIndex: 15, type: 'delimiter.curly.mojo' },
				{ startIndex: 16, type: 'delimiter.mojo' },
				{ startIndex: 17, type: 'identifier.mojo' }
			]
		}
	],
	[
		{
			line: 'lambda(x:Int):lambda(y:Int):x+y',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 6, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 7, type: 'identifier.mojo' },
				{ startIndex: 8, type: 'delimiter.mojo' },
				{ startIndex: 9, type: 'identifier.mojo' },
				{ startIndex: 12, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 13, type: 'delimiter.mojo' },
				{ startIndex: 14, type: 'keyword.mojo' },
				{ startIndex: 20, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 21, type: 'identifier.mojo' },
				{ startIndex: 22, type: 'delimiter.mojo' },
				{ startIndex: 23, type: 'identifier.mojo' },
				{ startIndex: 26, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 27, type: 'delimiter.mojo' },
				{ startIndex: 28, type: 'identifier.mojo' },
				{ startIndex: 29, type: 'operator.mojo' },
				{ startIndex: 30, type: 'identifier.mojo' }
			]
		}
	],
	// An unfinished lambda argument list keeps conventions on the following line.
	[
		{
			line: 'lambda(imm x:Int,',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 6, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 7, type: 'keyword.mojo' },
				{ startIndex: 10, type: 'white.mojo' },
				{ startIndex: 11, type: 'identifier.mojo' },
				{ startIndex: 12, type: 'delimiter.mojo' },
				{ startIndex: 13, type: 'identifier.mojo' },
				{ startIndex: 16, type: 'delimiter.mojo' }
			]
		},
		{
			line: 'mut y:Int):x+y',
			tokens: [
				{ startIndex: 0, type: 'keyword.mojo' },
				{ startIndex: 3, type: 'white.mojo' },
				{ startIndex: 4, type: 'identifier.mojo' },
				{ startIndex: 5, type: 'delimiter.mojo' },
				{ startIndex: 6, type: 'identifier.mojo' },
				{ startIndex: 9, type: 'delimiter.parenthesis.mojo' },
				{ startIndex: 10, type: 'delimiter.mojo' },
				{ startIndex: 11, type: 'identifier.mojo' },
				{ startIndex: 12, type: 'operator.mojo' },
				{ startIndex: 13, type: 'identifier.mojo' }
			]
		}
	]
]);
