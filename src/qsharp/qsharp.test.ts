/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('qsharp', [
	// Generated from sample: https://github.com/microsoft/Quantum/blob/main/samples/azure-quantum/parallel-qrng/ParallelQrng.ipynb
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
			line: 'open Microsoft.Quantum.Measurement;',
			tokens: [
				{ startIndex: 0, type: 'keyword.open.qsharp' },
				{ startIndex: 4, type: 'white.qsharp' },
				{ startIndex: 5, type: 'namespace.qsharp' },
				{ startIndex: 14, type: 'delimiter.qsharp' },
				{ startIndex: 15, type: 'namespace.qsharp' },
				{ startIndex: 22, type: 'delimiter.qsharp' },
				{ startIndex: 23, type: 'namespace.qsharp' },
				{ startIndex: 34, type: 'delimiter.qsharp' }
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
			line: '	// superposition state, such that when we measure,',
			tokens: [
				{ startIndex: 0, type: 'white.qsharp' },
				{ startIndex: 1, type: 'comment.qsharp' }
			]
		},
		{
			line: '	// all bitstrings occur with equal probability.',
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
			line: '		// Set qubits in superposition.',
			tokens: [
				{ startIndex: 0, type: 'white.qsharp' },
				{ startIndex: 2, type: 'comment.qsharp' }
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
			line: '',
			tokens: []
		},
		{
			line: '		// Measure all qubits and return.',
			tokens: [
				{ startIndex: 0, type: 'white.qsharp' },
				{ startIndex: 2, type: 'comment.qsharp' }
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
		}
	]
]);
