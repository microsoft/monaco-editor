/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('qsharp', [
	[
		{
			line: 'open Microsoft.Quantum.Arrays;',
			tokens: [
				{ startIndex: 0, type: 'keyword.open.qsharp' },
				{ startIndex: 4, type: 'white.qsharp' },
				{ startIndex: 5, type: 'namespace.qsharp' },
				{ startIndex: 14, type: 'delimiter.qsharp' },
				{ startIndex: 15, type: 'namespace.qsharp' },
				{ startIndex: 22, type: 'delimiter.qsharp' },
				{ startIndex: 23, type: 'namespace.qsharp' },
				{ startIndex: 29, type: 'delimiter.qsharp' }
			]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: 'operation SampleRandomNumber(nQubits : Int) : Result[] {',
			tokens: [
				{ startIndex: 0, type: 'keyword.qsharp' },
				{ startIndex: 9, type: 'white.qsharp' },
				{ startIndex: 10, type: 'identifier.qsharp' },
				{ startIndex: 28, type: 'delimiter.parenthesis.qsharp' },
				{ startIndex: 29, type: 'identifier.qsharp' },
				{ startIndex: 36, type: 'white.qsharp' },
				{ startIndex: 37, type: 'operator.qsharp' },
				{ startIndex: 38, type: 'white.qsharp' },
				{ startIndex: 39, type: 'type.qsharp' },
				{ startIndex: 42, type: 'delimiter.parenthesis.qsharp' },
				{ startIndex: 43, type: 'white.qsharp' },
				{ startIndex: 44, type: 'operator.qsharp' },
				{ startIndex: 45, type: 'white.qsharp' },
				{ startIndex: 46, type: 'type.qsharp' },
				{ startIndex: 52, type: 'delimiter.square.qsharp' },
				{ startIndex: 54, type: 'white.qsharp' },
				{ startIndex: 55, type: 'delimiter.curly.qsharp' }
			]
		},
		{
			line: '	// We prepare a register of qubits in a uniform',
			tokens: [
				{ startIndex: 0, type: 'white.qsharp' },
				{ startIndex: 1, type: 'comment.qsharp' }
			]
		},
		{
			line: '	use register = Qubit[nQubits] {',
			tokens: [
				{ startIndex: 0, type: 'white.qsharp' },
				{ startIndex: 1, type: 'keyword.qsharp' },
				{ startIndex: 4, type: 'white.qsharp' },
				{ startIndex: 5, type: 'identifier.qsharp' },
				{ startIndex: 13, type: 'white.qsharp' },
				{ startIndex: 14, type: 'operator.qsharp' },
				{ startIndex: 15, type: 'white.qsharp' },
				{ startIndex: 16, type: 'type.qsharp' },
				{ startIndex: 21, type: 'delimiter.square.qsharp' },
				{ startIndex: 22, type: 'identifier.qsharp' },
				{ startIndex: 29, type: 'delimiter.square.qsharp' },
				{ startIndex: 30, type: 'white.qsharp' },
				{ startIndex: 31, type: 'delimiter.curly.qsharp' }
			]
		},
		{
			line: '		ApplyToEachA(H, register);',
			tokens: [
				{ startIndex: 0, type: 'white.qsharp' },
				{ startIndex: 2, type: 'identifier.qsharp' },
				{ startIndex: 14, type: 'delimiter.parenthesis.qsharp' },
				{ startIndex: 15, type: 'keyword.qsharp' },
				{ startIndex: 16, type: 'delimiter.qsharp' },
				{ startIndex: 17, type: 'white.qsharp' },
				{ startIndex: 18, type: 'identifier.qsharp' },
				{ startIndex: 26, type: 'delimiter.parenthesis.qsharp' },
				{ startIndex: 27, type: 'delimiter.qsharp' }
			]
		},
		{
			line: '		return ForEach(MResetZ, register);',
			tokens: [
				{ startIndex: 0, type: 'white.qsharp' },
				{ startIndex: 2, type: 'keyword.qsharp' },
				{ startIndex: 8, type: 'white.qsharp' },
				{ startIndex: 9, type: 'identifier.qsharp' },
				{ startIndex: 16, type: 'delimiter.parenthesis.qsharp' },
				{ startIndex: 17, type: 'identifier.qsharp' },
				{ startIndex: 24, type: 'delimiter.qsharp' },
				{ startIndex: 25, type: 'white.qsharp' },
				{ startIndex: 26, type: 'identifier.qsharp' },
				{ startIndex: 34, type: 'delimiter.parenthesis.qsharp' },
				{ startIndex: 35, type: 'delimiter.qsharp' }
			]
		},
		{
			line: '	}',
			tokens: [
				{ startIndex: 0, type: 'white.qsharp' },
				{ startIndex: 1, type: 'delimiter.curly.qsharp' }
			]
		},
		{
			line: '}',
			tokens: [{ startIndex: 0, type: 'delimiter.curly.qsharp' }]
		},
		{
			line: 'struct Foo { First : Int, Second : Int }',
			tokens: [
				{ startIndex: 0, type: 'keyword.qsharp' },
				{ startIndex: 6, type: 'white.qsharp' },
				{ startIndex: 7, type: 'identifier.qsharp' },
				{ startIndex: 10, type: 'white.qsharp' },
				{ startIndex: 11, type: 'delimiter.curly.qsharp' },
				{ startIndex: 12, type: 'white.qsharp' },
				{ startIndex: 13, type: 'identifier.qsharp' },
				{ startIndex: 18, type: 'white.qsharp' },
				{ startIndex: 19, type: 'operator.qsharp' },
				{ startIndex: 20, type: 'white.qsharp' },
				{ startIndex: 21, type: 'type.qsharp' },
				{ startIndex: 24, type: 'delimiter.qsharp' },
				{ startIndex: 25, type: 'white.qsharp' },
				{ startIndex: 26, type: 'identifier.qsharp' },
				{ startIndex: 32, type: 'white.qsharp' },
				{ startIndex: 33, type: 'operator.qsharp' },
				{ startIndex: 34, type: 'white.qsharp' },
				{ startIndex: 35, type: 'type.qsharp' },
				{ startIndex: 38, type: 'white.qsharp' },
				{ startIndex: 39, type: 'delimiter.curly.qsharp' }
			]
		},
		{
			line: 'Foo.First',
			tokens: [
				{ startIndex: 0, type: 'identifier.qsharp' },
				{ startIndex: 3, type: 'operator.qsharp' },
				{ startIndex: 4, type: 'identifier.qsharp' }
			]
		},
		{
			line: 'import Microsoft.Quantum.Math, Microsoft.Quantum.Diagnostics.*;',
			tokens: [
				{ startIndex: 0, type: 'keyword.import.qsharp' },
				{ startIndex: 6, type: 'white.qsharp' },
				{ startIndex: 7, type: 'namespace.qsharp' },
				{ startIndex: 16, type: 'delimiter.qsharp' },
				{ startIndex: 17, type: 'namespace.qsharp' },
				{ startIndex: 24, type: 'delimiter.qsharp' },
				{ startIndex: 25, type: 'identifier.qsharp' },
				{ startIndex: 29, type: 'delimiter.qsharp' },
				{ startIndex: 30, type: 'white.qsharp' },
				{ startIndex: 31, type: 'namespace.qsharp' },
				{ startIndex: 40, type: 'delimiter.qsharp' },
				{ startIndex: 41, type: 'namespace.qsharp' },
				{ startIndex: 48, type: 'delimiter.qsharp' },
				{ startIndex: 49, type: 'namespace.qsharp' },
				{ startIndex: 60, type: 'delimiter.qsharp' },
				{ startIndex: 61, type: 'wildcard.qsharp' },
				{ startIndex: 62, type: 'delimiter.qsharp' }
			]
		},
		{
			line: 'export A, B, C;',
			tokens: [
				{ startIndex: 0, type: 'keyword.qsharp' },
				{ startIndex: 6, type: 'white.qsharp' },
				{ startIndex: 7, type: 'identifier.qsharp' },
				{ startIndex: 8, type: 'delimiter.qsharp' },
				{ startIndex: 9, type: 'white.qsharp' },
				{ startIndex: 10, type: 'identifier.qsharp' },
				{ startIndex: 11, type: 'delimiter.qsharp' },
				{ startIndex: 12, type: 'white.qsharp' },
				{ startIndex: 13, type: 'identifier.qsharp' },
				{ startIndex: 14, type: 'delimiter.qsharp' }
			]
		}
	]
]);
