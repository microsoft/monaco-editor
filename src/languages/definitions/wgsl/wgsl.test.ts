/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation, Google LLC. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization, ITestItem } from '../test/testRunner';

const cases: ITestItem[][] = [
	// address space
	[
		{
			line: 'alias a=ptr<function,i32>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 7, type: 'operator.wgsl' },
				{ startIndex: 8, type: 'variable.predefined.wgsl' },
				{ startIndex: 11, type: 'operator.wgsl' },
				{ startIndex: 12, type: 'variable.predefined.wgsl' },
				{ startIndex: 20, type: 'delimiter.wgsl' },
				{ startIndex: 21, type: 'variable.predefined.wgsl' },
				{ startIndex: 24, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias b=ptr<private,i32>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 7, type: 'operator.wgsl' },
				{ startIndex: 8, type: 'variable.predefined.wgsl' },
				{ startIndex: 11, type: 'operator.wgsl' },
				{ startIndex: 12, type: 'variable.predefined.wgsl' },
				{ startIndex: 19, type: 'delimiter.wgsl' },
				{ startIndex: 20, type: 'variable.predefined.wgsl' },
				{ startIndex: 23, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias c=ptr<workgroup,i32>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 7, type: 'operator.wgsl' },
				{ startIndex: 8, type: 'variable.predefined.wgsl' },
				{ startIndex: 11, type: 'operator.wgsl' },
				{ startIndex: 12, type: 'variable.predefined.wgsl' },
				{ startIndex: 21, type: 'delimiter.wgsl' },
				{ startIndex: 22, type: 'variable.predefined.wgsl' },
				{ startIndex: 25, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias d=ptr<uniform,i32>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 7, type: 'operator.wgsl' },
				{ startIndex: 8, type: 'variable.predefined.wgsl' },
				{ startIndex: 11, type: 'operator.wgsl' },
				{ startIndex: 12, type: 'variable.predefined.wgsl' },
				{ startIndex: 19, type: 'delimiter.wgsl' },
				{ startIndex: 20, type: 'variable.predefined.wgsl' },
				{ startIndex: 23, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias e=ptr<storage,i32>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 7, type: 'operator.wgsl' },
				{ startIndex: 8, type: 'variable.predefined.wgsl' },
				{ startIndex: 11, type: 'operator.wgsl' },
				{ startIndex: 12, type: 'variable.predefined.wgsl' },
				{ startIndex: 19, type: 'delimiter.wgsl' },
				{ startIndex: 20, type: 'variable.predefined.wgsl' },
				{ startIndex: 23, type: 'delimiter.wgsl' }
			]
		}
	],
	// attribute
	[
		{
			line: '@id(0) override x:i32 = 1;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 3, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 4, type: 'number.wgsl' },
				{ startIndex: 5, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 6, type: 'white.wgsl' },
				{ startIndex: 7, type: 'keyword.wgsl' },
				{ startIndex: 15, type: 'white.wgsl' },
				{ startIndex: 16, type: 'identifier.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' },
				{ startIndex: 18, type: 'variable.predefined.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'operator.wgsl' },
				{ startIndex: 23, type: 'white.wgsl' },
				{ startIndex: 24, type: 'number.wgsl' },
				{ startIndex: 25, type: 'delimiter.wgsl' }
			]
		},
		{
			line: '@ id(1) override y:i32 = 2;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 1, type: 'white.wgsl' },
				{ startIndex: 2, type: 'annotation.wgsl' },
				{ startIndex: 4, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 5, type: 'number.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'white.wgsl' },
				{ startIndex: 8, type: 'keyword.wgsl' },
				{ startIndex: 16, type: 'white.wgsl' },
				{ startIndex: 17, type: 'identifier.wgsl' },
				{ startIndex: 18, type: 'delimiter.wgsl' },
				{ startIndex: 19, type: 'variable.predefined.wgsl' },
				{ startIndex: 22, type: 'white.wgsl' },
				{ startIndex: 23, type: 'operator.wgsl' },
				{ startIndex: 24, type: 'white.wgsl' },
				{ startIndex: 25, type: 'number.wgsl' },
				{ startIndex: 26, type: 'delimiter.wgsl' }
			]
		},
		{
			line: '@//comment',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 1, type: 'comment.wgsl' }
			]
		},
		{
			line: 'id(1) override z:i32 = 3;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 2, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 3, type: 'number.wgsl' },
				{ startIndex: 4, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'keyword.wgsl' },
				{ startIndex: 14, type: 'white.wgsl' },
				{ startIndex: 15, type: 'identifier.wgsl' },
				{ startIndex: 16, type: 'delimiter.wgsl' },
				{ startIndex: 17, type: 'variable.predefined.wgsl' },
				{ startIndex: 20, type: 'white.wgsl' },
				{ startIndex: 21, type: 'operator.wgsl' },
				{ startIndex: 22, type: 'white.wgsl' },
				{ startIndex: 23, type: 'number.wgsl' },
				{ startIndex: 24, type: 'delimiter.wgsl' }
			]
		},
		{
			line: '@must_use fn foo() -> i32 { return 32; }',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'keyword.wgsl' },
				{ startIndex: 12, type: 'white.wgsl' },
				{ startIndex: 13, type: 'identifier.wgsl' },
				{ startIndex: 16, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 18, type: 'white.wgsl' },
				{ startIndex: 19, type: 'operator.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'variable.predefined.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'delimiter.curly.wgsl' },
				{ startIndex: 27, type: 'white.wgsl' },
				{ startIndex: 28, type: 'keyword.wgsl' },
				{ startIndex: 34, type: 'white.wgsl' },
				{ startIndex: 35, type: 'number.wgsl' },
				{ startIndex: 37, type: 'delimiter.wgsl' },
				{ startIndex: 38, type: 'white.wgsl' },
				{ startIndex: 39, type: 'delimiter.curly.wgsl' }
			]
		}
	],
	// block comment
	[
		{
			line: ' /**/',
			tokens: [
				{ startIndex: 0, type: 'white.wgsl' },
				{ startIndex: 1, type: 'comment.wgsl' }
			]
		},
		{
			line: ' /*block with newline',
			tokens: [
				{ startIndex: 0, type: 'white.wgsl' },
				{ startIndex: 1, type: 'comment.wgsl' }
			]
		},
		{ line: '  */', tokens: [{ startIndex: 0, type: 'comment.wgsl' }] },
		{
			line: ' /*block with line',
			tokens: [
				{ startIndex: 0, type: 'white.wgsl' },
				{ startIndex: 1, type: 'comment.wgsl' }
			]
		},
		{ line: ' ending comment//  */', tokens: [{ startIndex: 0, type: 'comment.wgsl' }] },
		{
			line: ' /* nested /*',
			tokens: [
				{ startIndex: 0, type: 'white.wgsl' },
				{ startIndex: 1, type: 'comment.wgsl' }
			]
		},
		{ line: '  */', tokens: [{ startIndex: 0, type: 'comment.wgsl' }] },
		{ line: '  */', tokens: [{ startIndex: 0, type: 'comment.wgsl' }] }
	],
	// bool types
	[
		{
			line: 'alias boolean=bool;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 13, type: 'operator.wgsl' },
				{ startIndex: 14, type: 'variable.predefined.wgsl' },
				{ startIndex: 18, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias bvec2=vec2<bool>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 11, type: 'operator.wgsl' },
				{ startIndex: 12, type: 'variable.predefined.wgsl' },
				{ startIndex: 16, type: 'operator.wgsl' },
				{ startIndex: 17, type: 'variable.predefined.wgsl' },
				{ startIndex: 21, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias bvec3=vec3<bool>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 11, type: 'operator.wgsl' },
				{ startIndex: 12, type: 'variable.predefined.wgsl' },
				{ startIndex: 16, type: 'operator.wgsl' },
				{ startIndex: 17, type: 'variable.predefined.wgsl' },
				{ startIndex: 21, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias bvec4=vec4<bool>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 11, type: 'operator.wgsl' },
				{ startIndex: 12, type: 'variable.predefined.wgsl' },
				{ startIndex: 16, type: 'operator.wgsl' },
				{ startIndex: 17, type: 'variable.predefined.wgsl' },
				{ startIndex: 21, type: 'delimiter.wgsl' }
			]
		}
	],
	// brackets
	[
		{
			line: 'const one = array(1)[0];',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'operator.wgsl' },
				{ startIndex: 11, type: 'white.wgsl' },
				{ startIndex: 12, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 18, type: 'number.wgsl' },
				{ startIndex: 19, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 20, type: 'delimiter.square.wgsl' },
				{ startIndex: 21, type: 'number.wgsl' },
				{ startIndex: 22, type: 'delimiter.square.wgsl' },
				{ startIndex: 23, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'fn none() {}',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 2, type: 'white.wgsl' },
				{ startIndex: 3, type: 'identifier.wgsl' },
				{ startIndex: 7, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'delimiter.curly.wgsl' }
			]
		}
	],
	// const numbers
	[
		{
			line: 'const a = 0;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 7, type: 'white.wgsl' },
				{ startIndex: 8, type: 'operator.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'number.wgsl' },
				{ startIndex: 11, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const au = 0u;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'number.wgsl' },
				{ startIndex: 13, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const ai = 0i;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'number.wgsl' },
				{ startIndex: 13, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const b = 12345;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 7, type: 'white.wgsl' },
				{ startIndex: 8, type: 'operator.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'number.wgsl' },
				{ startIndex: 15, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const bu = 12345u;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'number.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const bi= 12345i;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'operator.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'number.wgsl' },
				{ startIndex: 16, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const c = 0x0;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 7, type: 'white.wgsl' },
				{ startIndex: 8, type: 'operator.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'number.hex.wgsl' },
				{ startIndex: 13, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const cu = 0x0u;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'number.hex.wgsl' },
				{ startIndex: 15, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const ci = 0x0i;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'number.hex.wgsl' },
				{ startIndex: 15, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const d = 0x12345;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 7, type: 'white.wgsl' },
				{ startIndex: 8, type: 'operator.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'number.hex.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const di = 0x12345i;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'number.hex.wgsl' },
				{ startIndex: 19, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const du = 0x12345u;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'number.hex.wgsl' },
				{ startIndex: 19, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const eh = 0h;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'number.float.wgsl' },
				{ startIndex: 13, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const ef = 0f;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'number.float.wgsl' },
				{ startIndex: 13, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const f = 1.;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 7, type: 'white.wgsl' },
				{ startIndex: 8, type: 'operator.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'number.float.wgsl' },
				{ startIndex: 12, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const fh = 1.h;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'number.float.wgsl' },
				{ startIndex: 14, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const ff = 1.f;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'number.float.wgsl' },
				{ startIndex: 14, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const g = .1;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 7, type: 'white.wgsl' },
				{ startIndex: 8, type: 'operator.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'number.float.wgsl' },
				{ startIndex: 12, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const gh = .1h;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'number.float.wgsl' },
				{ startIndex: 14, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const gf = .1f;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'number.float.wgsl' },
				{ startIndex: 14, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const g = 1e1;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 7, type: 'white.wgsl' },
				{ startIndex: 8, type: 'operator.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'number.float.wgsl' },
				{ startIndex: 13, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const gh = 1e1h;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'number.float.wgsl' },
				{ startIndex: 15, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const gf = 1e1f;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'number.float.wgsl' },
				{ startIndex: 15, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const h = 1e+1;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 7, type: 'white.wgsl' },
				{ startIndex: 8, type: 'operator.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'number.float.wgsl' },
				{ startIndex: 14, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const hh = 1e+1h;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'number.float.wgsl' },
				{ startIndex: 16, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const hf = 1e+1f;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'number.float.wgsl' },
				{ startIndex: 16, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const i = 1e-1;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 7, type: 'white.wgsl' },
				{ startIndex: 8, type: 'operator.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'number.float.wgsl' },
				{ startIndex: 14, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const ih = 1e-1h;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'number.float.wgsl' },
				{ startIndex: 16, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const if = 1e-1f;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'keyword.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'number.float.wgsl' },
				{ startIndex: 16, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const j = 1.0e+1;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 7, type: 'white.wgsl' },
				{ startIndex: 8, type: 'operator.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'number.float.wgsl' },
				{ startIndex: 16, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const jh = 1.0e+1h;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'number.float.wgsl' },
				{ startIndex: 18, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const jf= 1.0e+1f;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'operator.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'number.float.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const k = 1.0e-1;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 7, type: 'white.wgsl' },
				{ startIndex: 8, type: 'operator.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'number.float.wgsl' },
				{ startIndex: 16, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const kh = 1.0e-1h;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'number.float.wgsl' },
				{ startIndex: 18, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const kf= 1.0e-1f;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'operator.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'number.float.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const l = 0x1p1;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 7, type: 'white.wgsl' },
				{ startIndex: 8, type: 'operator.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'number.hex.wgsl' },
				{ startIndex: 15, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const lh = 0x1p1h;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'number.hex.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const lf = 0x1p1f;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'number.hex.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const m = 0x1p+1;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 7, type: 'white.wgsl' },
				{ startIndex: 8, type: 'operator.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'number.hex.wgsl' },
				{ startIndex: 16, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const mh = 0x1p+1h;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'number.hex.wgsl' },
				{ startIndex: 18, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const mf = 0x1p+1f;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'number.hex.wgsl' },
				{ startIndex: 18, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const n = 0x1p-1;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 7, type: 'white.wgsl' },
				{ startIndex: 8, type: 'operator.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'number.hex.wgsl' },
				{ startIndex: 16, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const nh = 0x1p-1h;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'number.hex.wgsl' },
				{ startIndex: 18, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const nf = 0x1p-1f;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'number.hex.wgsl' },
				{ startIndex: 18, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const oo = 0x1.p1;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'number.hex.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const ooh = 0x1.p1h;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'operator.wgsl' },
				{ startIndex: 11, type: 'white.wgsl' },
				{ startIndex: 12, type: 'number.hex.wgsl' },
				{ startIndex: 19, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const oof = 0x1.p1f;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'operator.wgsl' },
				{ startIndex: 11, type: 'white.wgsl' },
				{ startIndex: 12, type: 'number.hex.wgsl' },
				{ startIndex: 19, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const p = 0x.1p1;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 7, type: 'white.wgsl' },
				{ startIndex: 8, type: 'operator.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'number.hex.wgsl' },
				{ startIndex: 16, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const ph = 0x.1p1h;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'number.hex.wgsl' },
				{ startIndex: 18, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const pf = 0x.1p1f;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'number.hex.wgsl' },
				{ startIndex: 18, type: 'delimiter.wgsl' }
			]
		}
	],
	// depth texture
	[
		{
			line: '@group(0) @binding(1) var texture_depth_2d;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 42, type: 'delimiter.wgsl' }
			]
		},
		{
			line: '@group(0) @binding(2) var texture_depth_2d_array;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 48, type: 'delimiter.wgsl' }
			]
		},
		{
			line: '@group(0) @binding(4) var texture_depth_cube;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 44, type: 'delimiter.wgsl' }
			]
		},
		{
			line: '@group(0) @binding(5) var texture_depth_cube_array;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 50, type: 'delimiter.wgsl' }
			]
		},
		{
			line: '@group(0) @binding(5) var texture_depth_multisampled_2d;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 55, type: 'delimiter.wgsl' }
			]
		}
	],
	// directive
	[
		{
			line: 'enable f16;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 6, type: 'white.wgsl' },
				{ startIndex: 7, type: 'meta.content.wgsl' },
				{ startIndex: 10, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'requires v1;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'meta.content.wgsl' },
				{ startIndex: 11, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'diagnostic(error,derivative_uniformity);',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 10, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 11, type: 'meta.content.wgsl' },
				{ startIndex: 16, type: 'delimiter.wgsl' },
				{ startIndex: 17, type: 'meta.content.wgsl' },
				{ startIndex: 38, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 39, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'diagnostic(warning,derivative_uniformity);',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 10, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 11, type: 'meta.content.wgsl' },
				{ startIndex: 18, type: 'delimiter.wgsl' },
				{ startIndex: 19, type: 'meta.content.wgsl' },
				{ startIndex: 40, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 41, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'diagnostic(off,derivative_uniformity);',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 10, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 11, type: 'meta.content.wgsl' },
				{ startIndex: 14, type: 'delimiter.wgsl' },
				{ startIndex: 15, type: 'meta.content.wgsl' },
				{ startIndex: 36, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 37, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'diagnostic(info,derivative_uniformity);',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 10, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 11, type: 'meta.content.wgsl' },
				{ startIndex: 15, type: 'delimiter.wgsl' },
				{ startIndex: 16, type: 'meta.content.wgsl' },
				{ startIndex: 37, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 38, type: 'delimiter.wgsl' }
			]
		},
		{ line: '', tokens: [] },
		{
			line: '@diagnostic(off,derviative_uniformity) fn main() {}',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 11, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 12, type: 'identifier.wgsl' },
				{ startIndex: 15, type: 'delimiter.wgsl' },
				{ startIndex: 16, type: 'identifier.wgsl' },
				{ startIndex: 37, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 38, type: 'white.wgsl' },
				{ startIndex: 39, type: 'keyword.wgsl' },
				{ startIndex: 41, type: 'white.wgsl' },
				{ startIndex: 42, type: 'identifier.wgsl' },
				{ startIndex: 46, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 48, type: 'white.wgsl' },
				{ startIndex: 49, type: 'delimiter.curly.wgsl' }
			]
		}
	],
	// external texture
	[
		{
			line: '@group(0) @binding(5) var texture_external;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 42, type: 'delimiter.wgsl' }
			]
		}
	],
	// keywords
	[
		{ line: 'alias', tokens: [{ startIndex: 0, type: 'keyword.wgsl' }] },
		{ line: 'break', tokens: [{ startIndex: 0, type: 'keyword.wgsl' }] },
		{ line: 'case', tokens: [{ startIndex: 0, type: 'keyword.wgsl' }] },
		{ line: 'const', tokens: [{ startIndex: 0, type: 'keyword.wgsl' }] },
		{ line: 'const_assert', tokens: [{ startIndex: 0, type: 'keyword.wgsl' }] },
		{ line: 'continue', tokens: [{ startIndex: 0, type: 'keyword.wgsl' }] },
		{ line: 'continuing', tokens: [{ startIndex: 0, type: 'keyword.wgsl' }] },
		{ line: 'default', tokens: [{ startIndex: 0, type: 'keyword.wgsl' }] },
		{ line: 'diagnostic', tokens: [{ startIndex: 0, type: 'keyword.wgsl' }] },
		{ line: 'discard', tokens: [{ startIndex: 0, type: 'meta.content.wgsl' }] },
		{ line: 'else', tokens: [{ startIndex: 0, type: 'meta.content.wgsl' }] },
		{ line: 'enable', tokens: [{ startIndex: 0, type: 'meta.content.wgsl' }] },
		{ line: 'false', tokens: [{ startIndex: 0, type: 'meta.content.wgsl' }] },
		{ line: 'fn', tokens: [{ startIndex: 0, type: 'meta.content.wgsl' }] },
		{ line: 'for', tokens: [{ startIndex: 0, type: 'meta.content.wgsl' }] },
		{ line: 'if', tokens: [{ startIndex: 0, type: 'meta.content.wgsl' }] },
		{ line: 'let', tokens: [{ startIndex: 0, type: 'meta.content.wgsl' }] },
		{ line: 'loop', tokens: [{ startIndex: 0, type: 'meta.content.wgsl' }] },
		{ line: 'override', tokens: [{ startIndex: 0, type: 'meta.content.wgsl' }] },
		{ line: 'requires', tokens: [{ startIndex: 0, type: 'meta.content.wgsl' }] },
		{ line: 'return', tokens: [{ startIndex: 0, type: 'meta.content.wgsl' }] },
		{ line: 'struct', tokens: [{ startIndex: 0, type: 'meta.content.wgsl' }] },
		{ line: 'switch', tokens: [{ startIndex: 0, type: 'meta.content.wgsl' }] },
		{ line: 'true', tokens: [{ startIndex: 0, type: 'meta.content.wgsl' }] },
		{ line: 'var', tokens: [{ startIndex: 0, type: 'meta.content.wgsl' }] },
		{ line: 'while', tokens: [{ startIndex: 0, type: 'meta.content.wgsl' }] }
	],
	// line comment
	[
		{
			line: '  // this is a line-ending comment',
			tokens: [
				{ startIndex: 0, type: 'white.wgsl' },
				{ startIndex: 2, type: 'comment.wgsl' }
			]
		},
		{
			line: ' //* embed a bock comment start, after a space',
			tokens: [
				{ startIndex: 0, type: 'white.wgsl' },
				{ startIndex: 1, type: 'comment.wgsl' }
			]
		},
		{
			line: '// /* embed a bock comment start, v2',
			tokens: [{ startIndex: 0, type: 'comment.wgsl' }]
		}
	],
	// multisampled texture
	[
		{
			line: '@group(0) @binding(5) var texture_multisampled_2d<f32>;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 49, type: 'operator.wgsl' },
				{ startIndex: 50, type: 'variable.predefined.wgsl' },
				{ startIndex: 53, type: 'delimiter.wgsl' }
			]
		}
	],
	// numeric types
	[
		{
			line: 'enable f16;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 6, type: 'white.wgsl' },
				{ startIndex: 7, type: 'meta.content.wgsl' },
				{ startIndex: 10, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias int=i32;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'variable.predefined.wgsl' },
				{ startIndex: 13, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias uint=u32;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 10, type: 'operator.wgsl' },
				{ startIndex: 11, type: 'variable.predefined.wgsl' },
				{ startIndex: 14, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias float=f32;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 11, type: 'operator.wgsl' },
				{ startIndex: 12, type: 'variable.predefined.wgsl' },
				{ startIndex: 15, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias half=f16;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 10, type: 'operator.wgsl' },
				{ startIndex: 11, type: 'variable.predefined.wgsl' },
				{ startIndex: 14, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias ivec2=vec2i;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 11, type: 'operator.wgsl' },
				{ startIndex: 12, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias uvec2=vec2u;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 11, type: 'operator.wgsl' },
				{ startIndex: 12, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias vec2=vec2f;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'variable.predefined.wgsl' },
				{ startIndex: 10, type: 'operator.wgsl' },
				{ startIndex: 11, type: 'variable.predefined.wgsl' },
				{ startIndex: 16, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias ivec3=vec3i;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 11, type: 'operator.wgsl' },
				{ startIndex: 12, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias uvec3=vec3u;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 11, type: 'operator.wgsl' },
				{ startIndex: 12, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias vec3=vec3f;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'variable.predefined.wgsl' },
				{ startIndex: 10, type: 'operator.wgsl' },
				{ startIndex: 11, type: 'variable.predefined.wgsl' },
				{ startIndex: 16, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias ivec4=vec4i;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 11, type: 'operator.wgsl' },
				{ startIndex: 12, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias uvec4=vec4u;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 11, type: 'operator.wgsl' },
				{ startIndex: 12, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias ivec2_=vec2<i32>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 12, type: 'operator.wgsl' },
				{ startIndex: 13, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'operator.wgsl' },
				{ startIndex: 18, type: 'variable.predefined.wgsl' },
				{ startIndex: 21, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias uvec2_=vec2<u32>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 12, type: 'operator.wgsl' },
				{ startIndex: 13, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'operator.wgsl' },
				{ startIndex: 18, type: 'variable.predefined.wgsl' },
				{ startIndex: 21, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias vec2_=vec2<f32>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 11, type: 'operator.wgsl' },
				{ startIndex: 12, type: 'variable.predefined.wgsl' },
				{ startIndex: 16, type: 'operator.wgsl' },
				{ startIndex: 17, type: 'variable.predefined.wgsl' },
				{ startIndex: 20, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias ivec3_=vec3<i32>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 12, type: 'operator.wgsl' },
				{ startIndex: 13, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'operator.wgsl' },
				{ startIndex: 18, type: 'variable.predefined.wgsl' },
				{ startIndex: 21, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias uvec3_=vec3<u32>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 12, type: 'operator.wgsl' },
				{ startIndex: 13, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'operator.wgsl' },
				{ startIndex: 18, type: 'variable.predefined.wgsl' },
				{ startIndex: 21, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias vec3_=vec3<f32>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 11, type: 'operator.wgsl' },
				{ startIndex: 12, type: 'variable.predefined.wgsl' },
				{ startIndex: 16, type: 'operator.wgsl' },
				{ startIndex: 17, type: 'variable.predefined.wgsl' },
				{ startIndex: 20, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias ivec4_=vec4<i32>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 12, type: 'operator.wgsl' },
				{ startIndex: 13, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'operator.wgsl' },
				{ startIndex: 18, type: 'variable.predefined.wgsl' },
				{ startIndex: 21, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias uvec4_=vec4<u32>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 12, type: 'operator.wgsl' },
				{ startIndex: 13, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'operator.wgsl' },
				{ startIndex: 18, type: 'variable.predefined.wgsl' },
				{ startIndex: 21, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias vec4_=vec4<f32>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 11, type: 'operator.wgsl' },
				{ startIndex: 12, type: 'variable.predefined.wgsl' },
				{ startIndex: 16, type: 'operator.wgsl' },
				{ startIndex: 17, type: 'variable.predefined.wgsl' },
				{ startIndex: 20, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias hvec2=vec2h;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 11, type: 'operator.wgsl' },
				{ startIndex: 12, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias hvec3=vec3h;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 11, type: 'operator.wgsl' },
				{ startIndex: 12, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias hvec4=vec4h;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 11, type: 'operator.wgsl' },
				{ startIndex: 12, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias hvec4_=vec4<f16>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 12, type: 'operator.wgsl' },
				{ startIndex: 13, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'operator.wgsl' },
				{ startIndex: 18, type: 'variable.predefined.wgsl' },
				{ startIndex: 21, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias m22=mat2x2f;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias m23=mat2x3f;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias m24=mat2x4f;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias m32=mat3x2f;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias m33=mat3x3f;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias m34=mat3x4f;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias m42=mat4x2f;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias m43=mat4x3f;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias m44=mat4x4f;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias m22_=mat2x2<f32>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 10, type: 'operator.wgsl' },
				{ startIndex: 11, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'operator.wgsl' },
				{ startIndex: 18, type: 'variable.predefined.wgsl' },
				{ startIndex: 21, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias m23_=mat2x3<f32>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 10, type: 'operator.wgsl' },
				{ startIndex: 11, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'operator.wgsl' },
				{ startIndex: 18, type: 'variable.predefined.wgsl' },
				{ startIndex: 21, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias m24_=mat2x4<f32>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 10, type: 'operator.wgsl' },
				{ startIndex: 11, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'operator.wgsl' },
				{ startIndex: 18, type: 'variable.predefined.wgsl' },
				{ startIndex: 21, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias m32_=mat3x2<f32>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 10, type: 'operator.wgsl' },
				{ startIndex: 11, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'operator.wgsl' },
				{ startIndex: 18, type: 'variable.predefined.wgsl' },
				{ startIndex: 21, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias m33_=mat3x3<f32>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 10, type: 'operator.wgsl' },
				{ startIndex: 11, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'operator.wgsl' },
				{ startIndex: 18, type: 'variable.predefined.wgsl' },
				{ startIndex: 21, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias m34_=mat3x4<f32>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 10, type: 'operator.wgsl' },
				{ startIndex: 11, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'operator.wgsl' },
				{ startIndex: 18, type: 'variable.predefined.wgsl' },
				{ startIndex: 21, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias m42_=mat4x2<f32>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 10, type: 'operator.wgsl' },
				{ startIndex: 11, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'operator.wgsl' },
				{ startIndex: 18, type: 'variable.predefined.wgsl' },
				{ startIndex: 21, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias m43_=mat4x3<f32>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 10, type: 'operator.wgsl' },
				{ startIndex: 11, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'operator.wgsl' },
				{ startIndex: 18, type: 'variable.predefined.wgsl' },
				{ startIndex: 21, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias m44_=mat4x4<f32>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 10, type: 'operator.wgsl' },
				{ startIndex: 11, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'operator.wgsl' },
				{ startIndex: 18, type: 'variable.predefined.wgsl' },
				{ startIndex: 21, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias m22=mat2x2h;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias m23=mat2x3h;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias h24=mat2x4h;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias h32=mat3x2h;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias h33=mat3x3h;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias h34=mat3x4h;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias h42=mat4x2h;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias h43=mat4x3h;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias h44=mat4x4h;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias h22_=mat2x2<f16>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 10, type: 'operator.wgsl' },
				{ startIndex: 11, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'operator.wgsl' },
				{ startIndex: 18, type: 'variable.predefined.wgsl' },
				{ startIndex: 21, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias h23_=mat2x3<f16>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 10, type: 'operator.wgsl' },
				{ startIndex: 11, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'operator.wgsl' },
				{ startIndex: 18, type: 'variable.predefined.wgsl' },
				{ startIndex: 21, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias h24_=mat2x4<f16>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 10, type: 'operator.wgsl' },
				{ startIndex: 11, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'operator.wgsl' },
				{ startIndex: 18, type: 'variable.predefined.wgsl' },
				{ startIndex: 21, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias h32_=mat3x2<f16>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 10, type: 'operator.wgsl' },
				{ startIndex: 11, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'operator.wgsl' },
				{ startIndex: 18, type: 'variable.predefined.wgsl' },
				{ startIndex: 21, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias h33_=mat3x3<f16>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 10, type: 'operator.wgsl' },
				{ startIndex: 11, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'operator.wgsl' },
				{ startIndex: 18, type: 'variable.predefined.wgsl' },
				{ startIndex: 21, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias h34_=mat3x4<f16>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 10, type: 'operator.wgsl' },
				{ startIndex: 11, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'operator.wgsl' },
				{ startIndex: 18, type: 'variable.predefined.wgsl' },
				{ startIndex: 21, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias h42_=mat4x2<f16>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 10, type: 'operator.wgsl' },
				{ startIndex: 11, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'operator.wgsl' },
				{ startIndex: 18, type: 'variable.predefined.wgsl' },
				{ startIndex: 21, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias h43_=mat4x3<f16>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 10, type: 'operator.wgsl' },
				{ startIndex: 11, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'operator.wgsl' },
				{ startIndex: 18, type: 'variable.predefined.wgsl' },
				{ startIndex: 21, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias h44_=mat4x4<f16>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 10, type: 'operator.wgsl' },
				{ startIndex: 11, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'operator.wgsl' },
				{ startIndex: 18, type: 'variable.predefined.wgsl' },
				{ startIndex: 21, type: 'delimiter.wgsl' }
			]
		}
	],
	// operators
	[
		{
			line: 'const add = 0+1;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'operator.wgsl' },
				{ startIndex: 11, type: 'white.wgsl' },
				{ startIndex: 12, type: 'number.wgsl' },
				{ startIndex: 13, type: 'operator.wgsl' },
				{ startIndex: 14, type: 'number.wgsl' },
				{ startIndex: 15, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const sub = 0-1;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'operator.wgsl' },
				{ startIndex: 11, type: 'white.wgsl' },
				{ startIndex: 12, type: 'number.wgsl' },
				{ startIndex: 13, type: 'operator.wgsl' },
				{ startIndex: 14, type: 'number.wgsl' },
				{ startIndex: 15, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const mult = 1*0;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'operator.wgsl' },
				{ startIndex: 12, type: 'white.wgsl' },
				{ startIndex: 13, type: 'number.wgsl' },
				{ startIndex: 14, type: 'operator.wgsl' },
				{ startIndex: 15, type: 'number.wgsl' },
				{ startIndex: 16, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const div = 1/0;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'operator.wgsl' },
				{ startIndex: 11, type: 'white.wgsl' },
				{ startIndex: 12, type: 'number.wgsl' },
				{ startIndex: 13, type: 'operator.wgsl' },
				{ startIndex: 14, type: 'number.wgsl' },
				{ startIndex: 15, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const rem = 2%1;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'operator.wgsl' },
				{ startIndex: 11, type: 'white.wgsl' },
				{ startIndex: 12, type: 'number.wgsl' },
				{ startIndex: 13, type: 'operator.wgsl' },
				{ startIndex: 14, type: 'number.wgsl' },
				{ startIndex: 15, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const xor = 1^2;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'operator.wgsl' },
				{ startIndex: 11, type: 'white.wgsl' },
				{ startIndex: 12, type: 'number.wgsl' },
				{ startIndex: 13, type: 'delimiter.wgsl' },
				{ startIndex: 14, type: 'number.wgsl' },
				{ startIndex: 15, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const or = 1|2;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'operator.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'number.wgsl' },
				{ startIndex: 12, type: 'operator.wgsl' },
				{ startIndex: 13, type: 'number.wgsl' },
				{ startIndex: 14, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const not = !false;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'operator.wgsl' },
				{ startIndex: 11, type: 'white.wgsl' },
				{ startIndex: 12, type: 'delimiter.wgsl' },
				{ startIndex: 13, type: 'variable.predefined.wgsl' },
				{ startIndex: 18, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const complement = ~1u;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 16, type: 'white.wgsl' },
				{ startIndex: 17, type: 'operator.wgsl' },
				{ startIndex: 18, type: 'white.wgsl' },
				{ startIndex: 19, type: 'delimiter.wgsl' },
				{ startIndex: 20, type: 'number.wgsl' },
				{ startIndex: 22, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const less = 1<0;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'operator.wgsl' },
				{ startIndex: 12, type: 'white.wgsl' },
				{ startIndex: 13, type: 'number.wgsl' },
				{ startIndex: 14, type: 'operator.wgsl' },
				{ startIndex: 15, type: 'number.wgsl' },
				{ startIndex: 16, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const lesseq = 1<=0;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 12, type: 'white.wgsl' },
				{ startIndex: 13, type: 'operator.wgsl' },
				{ startIndex: 14, type: 'white.wgsl' },
				{ startIndex: 15, type: 'number.wgsl' },
				{ startIndex: 16, type: 'operator.wgsl' },
				{ startIndex: 18, type: 'number.wgsl' },
				{ startIndex: 19, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const equal = 1==2;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 11, type: 'white.wgsl' },
				{ startIndex: 12, type: 'operator.wgsl' },
				{ startIndex: 13, type: 'white.wgsl' },
				{ startIndex: 14, type: 'number.wgsl' },
				{ startIndex: 15, type: 'operator.wgsl' },
				{ startIndex: 17, type: 'number.wgsl' },
				{ startIndex: 18, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const greater = 1>2;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 13, type: 'white.wgsl' },
				{ startIndex: 14, type: 'operator.wgsl' },
				{ startIndex: 15, type: 'white.wgsl' },
				{ startIndex: 16, type: 'number.wgsl' },
				{ startIndex: 17, type: 'operator.wgsl' },
				{ startIndex: 18, type: 'number.wgsl' },
				{ startIndex: 19, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const greatereq = 1>=2;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 15, type: 'white.wgsl' },
				{ startIndex: 16, type: 'operator.wgsl' },
				{ startIndex: 17, type: 'white.wgsl' },
				{ startIndex: 18, type: 'number.wgsl' },
				{ startIndex: 19, type: 'operator.wgsl' },
				{ startIndex: 21, type: 'number.wgsl' },
				{ startIndex: 22, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const noteq = 1!=2;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 11, type: 'white.wgsl' },
				{ startIndex: 12, type: 'operator.wgsl' },
				{ startIndex: 13, type: 'white.wgsl' },
				{ startIndex: 14, type: 'number.wgsl' },
				{ startIndex: 15, type: 'operator.wgsl' },
				{ startIndex: 17, type: 'number.wgsl' },
				{ startIndex: 18, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const leftshift = 1<<2;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 15, type: 'white.wgsl' },
				{ startIndex: 16, type: 'operator.wgsl' },
				{ startIndex: 17, type: 'white.wgsl' },
				{ startIndex: 18, type: 'number.wgsl' },
				{ startIndex: 19, type: 'operator.wgsl' },
				{ startIndex: 21, type: 'number.wgsl' },
				{ startIndex: 22, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'const rightshift = 2>>1;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 16, type: 'white.wgsl' },
				{ startIndex: 17, type: 'operator.wgsl' },
				{ startIndex: 18, type: 'white.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'operator.wgsl' },
				{ startIndex: 22, type: 'number.wgsl' },
				{ startIndex: 23, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'fn arith() -> i32 {',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 2, type: 'white.wgsl' },
				{ startIndex: 3, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'operator.wgsl' },
				{ startIndex: 13, type: 'white.wgsl' },
				{ startIndex: 14, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'white.wgsl' },
				{ startIndex: 18, type: 'delimiter.curly.wgsl' }
			]
		},
		{
			line: 'var a: i32;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 3, type: 'white.wgsl' },
				{ startIndex: 4, type: 'identifier.wgsl' },
				{ startIndex: 5, type: 'delimiter.wgsl' },
				{ startIndex: 6, type: 'white.wgsl' },
				{ startIndex: 7, type: 'variable.predefined.wgsl' },
				{ startIndex: 10, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'a += 1;',
			tokens: [
				{ startIndex: 0, type: 'identifier.wgsl' },
				{ startIndex: 1, type: 'white.wgsl' },
				{ startIndex: 2, type: 'operator.wgsl' },
				{ startIndex: 4, type: 'white.wgsl' },
				{ startIndex: 5, type: 'number.wgsl' },
				{ startIndex: 6, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'a -= 1;',
			tokens: [
				{ startIndex: 0, type: 'identifier.wgsl' },
				{ startIndex: 1, type: 'white.wgsl' },
				{ startIndex: 2, type: 'operator.wgsl' },
				{ startIndex: 4, type: 'white.wgsl' },
				{ startIndex: 5, type: 'number.wgsl' },
				{ startIndex: 6, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'a *= 1;',
			tokens: [
				{ startIndex: 0, type: 'identifier.wgsl' },
				{ startIndex: 1, type: 'white.wgsl' },
				{ startIndex: 2, type: 'operator.wgsl' },
				{ startIndex: 4, type: 'white.wgsl' },
				{ startIndex: 5, type: 'number.wgsl' },
				{ startIndex: 6, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'a /= 1;',
			tokens: [
				{ startIndex: 0, type: 'identifier.wgsl' },
				{ startIndex: 1, type: 'white.wgsl' },
				{ startIndex: 2, type: 'operator.wgsl' },
				{ startIndex: 4, type: 'white.wgsl' },
				{ startIndex: 5, type: 'number.wgsl' },
				{ startIndex: 6, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'a %= 2;',
			tokens: [
				{ startIndex: 0, type: 'identifier.wgsl' },
				{ startIndex: 1, type: 'white.wgsl' },
				{ startIndex: 2, type: 'operator.wgsl' },
				{ startIndex: 4, type: 'white.wgsl' },
				{ startIndex: 5, type: 'number.wgsl' },
				{ startIndex: 6, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'a ^= 2;',
			tokens: [
				{ startIndex: 0, type: 'identifier.wgsl' },
				{ startIndex: 1, type: 'white.wgsl' },
				{ startIndex: 2, type: 'operator.wgsl' },
				{ startIndex: 4, type: 'white.wgsl' },
				{ startIndex: 5, type: 'number.wgsl' },
				{ startIndex: 6, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'a &= 2;',
			tokens: [
				{ startIndex: 0, type: 'identifier.wgsl' },
				{ startIndex: 1, type: 'white.wgsl' },
				{ startIndex: 2, type: 'operator.wgsl' },
				{ startIndex: 4, type: 'white.wgsl' },
				{ startIndex: 5, type: 'number.wgsl' },
				{ startIndex: 6, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'a |= 2;',
			tokens: [
				{ startIndex: 0, type: 'identifier.wgsl' },
				{ startIndex: 1, type: 'white.wgsl' },
				{ startIndex: 2, type: 'operator.wgsl' },
				{ startIndex: 4, type: 'white.wgsl' },
				{ startIndex: 5, type: 'number.wgsl' },
				{ startIndex: 6, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'a <<= 1;',
			tokens: [
				{ startIndex: 0, type: 'identifier.wgsl' },
				{ startIndex: 1, type: 'white.wgsl' },
				{ startIndex: 2, type: 'operator.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'number.wgsl' },
				{ startIndex: 7, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'a >>= 1;',
			tokens: [
				{ startIndex: 0, type: 'identifier.wgsl' },
				{ startIndex: 1, type: 'white.wgsl' },
				{ startIndex: 2, type: 'operator.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'number.wgsl' },
				{ startIndex: 7, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'a++;',
			tokens: [
				{ startIndex: 0, type: 'identifier.wgsl' },
				{ startIndex: 1, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'a--;',
			tokens: [
				{ startIndex: 0, type: 'identifier.wgsl' },
				{ startIndex: 1, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'let b = true&&false;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 3, type: 'white.wgsl' },
				{ startIndex: 4, type: 'identifier.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'operator.wgsl' },
				{ startIndex: 7, type: 'white.wgsl' },
				{ startIndex: 8, type: 'variable.predefined.wgsl' },
				{ startIndex: 12, type: 'operator.wgsl' },
				{ startIndex: 14, type: 'variable.predefined.wgsl' },
				{ startIndex: 19, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'let c = true||false;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 3, type: 'white.wgsl' },
				{ startIndex: 4, type: 'identifier.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'operator.wgsl' },
				{ startIndex: 7, type: 'white.wgsl' },
				{ startIndex: 8, type: 'variable.predefined.wgsl' },
				{ startIndex: 12, type: 'operator.wgsl' },
				{ startIndex: 14, type: 'variable.predefined.wgsl' },
				{ startIndex: 19, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'return a;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 6, type: 'white.wgsl' },
				{ startIndex: 7, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'delimiter.wgsl' }
			]
		},
		{ line: '}', tokens: [{ startIndex: 0, type: 'delimiter.curly.wgsl' }] }
	],
	// predeclared
	[
		{
			line: 'read write read_write',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.wgsl' },
				{ startIndex: 4, type: 'white.wgsl' },
				{ startIndex: 5, type: 'variable.predefined.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'variable.predefined.wgsl' }
			]
		},
		{
			line: 'function private workgroup uniform storage',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'variable.predefined.wgsl' },
				{ startIndex: 16, type: 'white.wgsl' },
				{ startIndex: 17, type: 'variable.predefined.wgsl' },
				{ startIndex: 26, type: 'white.wgsl' },
				{ startIndex: 27, type: 'variable.predefined.wgsl' },
				{ startIndex: 34, type: 'white.wgsl' },
				{ startIndex: 35, type: 'variable.predefined.wgsl' }
			]
		},
		{
			line: 'perspective linear flat',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.wgsl' },
				{ startIndex: 11, type: 'white.wgsl' },
				{ startIndex: 12, type: 'variable.predefined.wgsl' },
				{ startIndex: 18, type: 'white.wgsl' },
				{ startIndex: 19, type: 'variable.predefined.wgsl' }
			]
		},
		{
			line: 'center centroid sample',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.wgsl' },
				{ startIndex: 6, type: 'white.wgsl' },
				{ startIndex: 7, type: 'variable.predefined.wgsl' },
				{ startIndex: 15, type: 'white.wgsl' },
				{ startIndex: 16, type: 'variable.predefined.wgsl' }
			]
		},
		{
			line: 'vertex_index instance_index position front_facing frag_depth',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.wgsl' },
				{ startIndex: 12, type: 'white.wgsl' },
				{ startIndex: 13, type: 'variable.predefined.wgsl' },
				{ startIndex: 27, type: 'white.wgsl' },
				{ startIndex: 28, type: 'variable.predefined.wgsl' },
				{ startIndex: 36, type: 'white.wgsl' },
				{ startIndex: 37, type: 'variable.predefined.wgsl' },
				{ startIndex: 49, type: 'white.wgsl' },
				{ startIndex: 50, type: 'variable.predefined.wgsl' }
			]
		},
		{
			line: 'local_invocation_id local_invocation_index',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.wgsl' },
				{ startIndex: 19, type: 'white.wgsl' },
				{ startIndex: 20, type: 'variable.predefined.wgsl' }
			]
		},
		{
			line: 'global_invocation_id workgroup_id num_workgroups',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.wgsl' },
				{ startIndex: 20, type: 'white.wgsl' },
				{ startIndex: 21, type: 'variable.predefined.wgsl' },
				{ startIndex: 33, type: 'white.wgsl' },
				{ startIndex: 34, type: 'variable.predefined.wgsl' }
			]
		},
		{
			line: 'sample_index sample_mask',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.wgsl' },
				{ startIndex: 12, type: 'white.wgsl' },
				{ startIndex: 13, type: 'variable.predefined.wgsl' }
			]
		},
		{ line: 'rgba8unorm', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'rgba8snorm', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'rgba8uint', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'rgba8sint', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'rgba16uint', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'rgba16sint', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'rgba16float', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'r32uint', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'r32sint', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'r32float', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'rg32uint', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'rg32sint', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'rg32float', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'rgba32uint', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'rgba32sint', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'rgba32float', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'bgra8unorm', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: '', tokens: [] },
		{ line: 'bool', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'f16', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'f32', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'i32', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{
			line: 'sampler sampler_comparison',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.wgsl' },
				{ startIndex: 7, type: 'white.wgsl' },
				{ startIndex: 8, type: 'variable.predefined.wgsl' }
			]
		},
		{
			line: 'texture_depth_2d',
			tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }]
		},
		{
			line: 'texture_depth_2d_array',
			tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }]
		},
		{
			line: 'texture_depth_cube',
			tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }]
		},
		{
			line: 'texture_depth_cube_array',
			tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }]
		},
		{
			line: 'texture_depth_multisampled_2d',
			tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }]
		},
		{
			line: 'texture_external',
			tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }]
		},
		{
			line: 'texture_external',
			tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }]
		},
		{ line: 'u32', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: '', tokens: [] },
		{ line: 'array', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'atomic', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'mat2x2', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'mat2x3', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'mat2x4', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'mat3x2', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'mat3x3', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'mat3x4', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'mat4x2', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'mat4x3', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'mat4x4', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'ptr', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'texture_1d', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'texture_2d', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{
			line: 'texture_2d_array',
			tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }]
		},
		{ line: 'texture_3d', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'texture_cube', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{
			line: 'texture_cube_array',
			tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }]
		},
		{
			line: 'texture_multisampled_2d',
			tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }]
		},
		{
			line: 'texture_storage_1d',
			tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }]
		},
		{
			line: 'texture_storage_2d',
			tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }]
		},
		{
			line: 'texture_storage_2d_array',
			tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }]
		},
		{
			line: 'texture_storage_3d',
			tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }]
		},
		{ line: 'vec2', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'vec3', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: 'vec4', tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }] },
		{ line: '', tokens: [] },
		{
			line: 'vec2i vec3i vec4i',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'variable.predefined.wgsl' },
				{ startIndex: 11, type: 'white.wgsl' },
				{ startIndex: 12, type: 'variable.predefined.wgsl' }
			]
		},
		{
			line: 'vec2u vec3u vec4u',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'variable.predefined.wgsl' },
				{ startIndex: 11, type: 'white.wgsl' },
				{ startIndex: 12, type: 'variable.predefined.wgsl' }
			]
		},
		{
			line: 'vec2f vec3f vec4f',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'variable.predefined.wgsl' },
				{ startIndex: 11, type: 'white.wgsl' },
				{ startIndex: 12, type: 'variable.predefined.wgsl' }
			]
		},
		{
			line: 'vec2h vec3h vec4h',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'variable.predefined.wgsl' },
				{ startIndex: 11, type: 'white.wgsl' },
				{ startIndex: 12, type: 'variable.predefined.wgsl' }
			]
		},
		{
			line: 'mat2x2f mat2x3f mat2x4f',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.wgsl' },
				{ startIndex: 7, type: 'white.wgsl' },
				{ startIndex: 8, type: 'variable.predefined.wgsl' },
				{ startIndex: 15, type: 'white.wgsl' },
				{ startIndex: 16, type: 'variable.predefined.wgsl' }
			]
		},
		{
			line: 'mat3x2f mat3x3f mat3x4f',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.wgsl' },
				{ startIndex: 7, type: 'white.wgsl' },
				{ startIndex: 8, type: 'variable.predefined.wgsl' },
				{ startIndex: 15, type: 'white.wgsl' },
				{ startIndex: 16, type: 'variable.predefined.wgsl' }
			]
		},
		{
			line: 'mat4x2f mat4x3f mat4x4f',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.wgsl' },
				{ startIndex: 7, type: 'white.wgsl' },
				{ startIndex: 8, type: 'variable.predefined.wgsl' },
				{ startIndex: 15, type: 'white.wgsl' },
				{ startIndex: 16, type: 'variable.predefined.wgsl' }
			]
		},
		{
			line: 'mat2x2h mat2x3h mat2x4h',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.wgsl' },
				{ startIndex: 7, type: 'white.wgsl' },
				{ startIndex: 8, type: 'variable.predefined.wgsl' },
				{ startIndex: 15, type: 'white.wgsl' },
				{ startIndex: 16, type: 'variable.predefined.wgsl' }
			]
		},
		{
			line: 'mat3x2h mat3x3h mat3x4h',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.wgsl' },
				{ startIndex: 7, type: 'white.wgsl' },
				{ startIndex: 8, type: 'variable.predefined.wgsl' },
				{ startIndex: 15, type: 'white.wgsl' },
				{ startIndex: 16, type: 'variable.predefined.wgsl' }
			]
		},
		{
			line: 'mat4x2h mat4x3h mat4x4h',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.wgsl' },
				{ startIndex: 7, type: 'white.wgsl' },
				{ startIndex: 8, type: 'variable.predefined.wgsl' },
				{ startIndex: 15, type: 'white.wgsl' },
				{ startIndex: 16, type: 'variable.predefined.wgsl' }
			]
		},
		{ line: '', tokens: [] },
		{
			line: 'bitcast all any select arrayLength abs acos acosh asin asinh atan atanh atan2',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.wgsl' },
				{ startIndex: 7, type: 'white.wgsl' },
				{ startIndex: 8, type: 'variable.predefined.wgsl' },
				{ startIndex: 11, type: 'white.wgsl' },
				{ startIndex: 12, type: 'variable.predefined.wgsl' },
				{ startIndex: 15, type: 'white.wgsl' },
				{ startIndex: 16, type: 'variable.predefined.wgsl' },
				{ startIndex: 22, type: 'white.wgsl' },
				{ startIndex: 23, type: 'variable.predefined.wgsl' },
				{ startIndex: 34, type: 'white.wgsl' },
				{ startIndex: 35, type: 'variable.predefined.wgsl' },
				{ startIndex: 38, type: 'white.wgsl' },
				{ startIndex: 39, type: 'variable.predefined.wgsl' },
				{ startIndex: 43, type: 'white.wgsl' },
				{ startIndex: 44, type: 'variable.predefined.wgsl' },
				{ startIndex: 49, type: 'white.wgsl' },
				{ startIndex: 50, type: 'variable.predefined.wgsl' },
				{ startIndex: 54, type: 'white.wgsl' },
				{ startIndex: 55, type: 'variable.predefined.wgsl' },
				{ startIndex: 60, type: 'white.wgsl' },
				{ startIndex: 61, type: 'variable.predefined.wgsl' },
				{ startIndex: 65, type: 'white.wgsl' },
				{ startIndex: 66, type: 'variable.predefined.wgsl' },
				{ startIndex: 71, type: 'white.wgsl' },
				{ startIndex: 72, type: 'variable.predefined.wgsl' }
			]
		},
		{
			line: 'ceil clamp cos cosh countLeadingZeros countOneBits countTrailingZeros cross',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.wgsl' },
				{ startIndex: 4, type: 'white.wgsl' },
				{ startIndex: 5, type: 'variable.predefined.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'variable.predefined.wgsl' },
				{ startIndex: 14, type: 'white.wgsl' },
				{ startIndex: 15, type: 'variable.predefined.wgsl' },
				{ startIndex: 19, type: 'white.wgsl' },
				{ startIndex: 20, type: 'variable.predefined.wgsl' },
				{ startIndex: 37, type: 'white.wgsl' },
				{ startIndex: 38, type: 'variable.predefined.wgsl' },
				{ startIndex: 50, type: 'white.wgsl' },
				{ startIndex: 51, type: 'variable.predefined.wgsl' },
				{ startIndex: 69, type: 'white.wgsl' },
				{ startIndex: 70, type: 'variable.predefined.wgsl' }
			]
		},
		{
			line: 'degrees determinant distance dot exp exp2 extractBits faceForward firstLeadingBit',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.wgsl' },
				{ startIndex: 7, type: 'white.wgsl' },
				{ startIndex: 8, type: 'variable.predefined.wgsl' },
				{ startIndex: 19, type: 'white.wgsl' },
				{ startIndex: 20, type: 'variable.predefined.wgsl' },
				{ startIndex: 28, type: 'white.wgsl' },
				{ startIndex: 29, type: 'variable.predefined.wgsl' },
				{ startIndex: 32, type: 'white.wgsl' },
				{ startIndex: 33, type: 'variable.predefined.wgsl' },
				{ startIndex: 36, type: 'white.wgsl' },
				{ startIndex: 37, type: 'variable.predefined.wgsl' },
				{ startIndex: 41, type: 'white.wgsl' },
				{ startIndex: 42, type: 'variable.predefined.wgsl' },
				{ startIndex: 53, type: 'white.wgsl' },
				{ startIndex: 54, type: 'variable.predefined.wgsl' },
				{ startIndex: 65, type: 'white.wgsl' },
				{ startIndex: 66, type: 'variable.predefined.wgsl' }
			]
		},
		{
			line: 'firstTrailingBit floor fma fract frexp inverseBits inverseSqrt ldexp length',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.wgsl' },
				{ startIndex: 16, type: 'white.wgsl' },
				{ startIndex: 17, type: 'variable.predefined.wgsl' },
				{ startIndex: 22, type: 'white.wgsl' },
				{ startIndex: 23, type: 'variable.predefined.wgsl' },
				{ startIndex: 26, type: 'white.wgsl' },
				{ startIndex: 27, type: 'variable.predefined.wgsl' },
				{ startIndex: 32, type: 'white.wgsl' },
				{ startIndex: 33, type: 'variable.predefined.wgsl' },
				{ startIndex: 38, type: 'white.wgsl' },
				{ startIndex: 39, type: 'variable.predefined.wgsl' },
				{ startIndex: 50, type: 'white.wgsl' },
				{ startIndex: 51, type: 'variable.predefined.wgsl' },
				{ startIndex: 62, type: 'white.wgsl' },
				{ startIndex: 63, type: 'variable.predefined.wgsl' },
				{ startIndex: 68, type: 'white.wgsl' },
				{ startIndex: 69, type: 'variable.predefined.wgsl' }
			]
		},
		{
			line: 'log log2 max min mix modf normalize pow quantizeToF16 radians reflect refract',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.wgsl' },
				{ startIndex: 3, type: 'white.wgsl' },
				{ startIndex: 4, type: 'variable.predefined.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'variable.predefined.wgsl' },
				{ startIndex: 12, type: 'white.wgsl' },
				{ startIndex: 13, type: 'variable.predefined.wgsl' },
				{ startIndex: 16, type: 'white.wgsl' },
				{ startIndex: 17, type: 'variable.predefined.wgsl' },
				{ startIndex: 20, type: 'white.wgsl' },
				{ startIndex: 21, type: 'variable.predefined.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 35, type: 'white.wgsl' },
				{ startIndex: 36, type: 'variable.predefined.wgsl' },
				{ startIndex: 39, type: 'white.wgsl' },
				{ startIndex: 40, type: 'variable.predefined.wgsl' },
				{ startIndex: 53, type: 'white.wgsl' },
				{ startIndex: 54, type: 'variable.predefined.wgsl' },
				{ startIndex: 61, type: 'white.wgsl' },
				{ startIndex: 62, type: 'variable.predefined.wgsl' },
				{ startIndex: 69, type: 'white.wgsl' },
				{ startIndex: 70, type: 'variable.predefined.wgsl' }
			]
		},
		{
			line: 'reverseBits round saturate sign sin sinh smoothstep sqrt step tan tanh transpose',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.wgsl' },
				{ startIndex: 11, type: 'white.wgsl' },
				{ startIndex: 12, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'white.wgsl' },
				{ startIndex: 18, type: 'variable.predefined.wgsl' },
				{ startIndex: 26, type: 'white.wgsl' },
				{ startIndex: 27, type: 'variable.predefined.wgsl' },
				{ startIndex: 31, type: 'white.wgsl' },
				{ startIndex: 32, type: 'variable.predefined.wgsl' },
				{ startIndex: 35, type: 'white.wgsl' },
				{ startIndex: 36, type: 'variable.predefined.wgsl' },
				{ startIndex: 40, type: 'white.wgsl' },
				{ startIndex: 41, type: 'variable.predefined.wgsl' },
				{ startIndex: 51, type: 'white.wgsl' },
				{ startIndex: 52, type: 'variable.predefined.wgsl' },
				{ startIndex: 56, type: 'white.wgsl' },
				{ startIndex: 57, type: 'variable.predefined.wgsl' },
				{ startIndex: 61, type: 'white.wgsl' },
				{ startIndex: 62, type: 'variable.predefined.wgsl' },
				{ startIndex: 65, type: 'white.wgsl' },
				{ startIndex: 66, type: 'variable.predefined.wgsl' },
				{ startIndex: 70, type: 'white.wgsl' },
				{ startIndex: 71, type: 'variable.predefined.wgsl' }
			]
		},
		{
			line: 'trunc dpdx dpdxCoarse dpdxFine dpdy dpdyCoarse dpdyFine fwidth fwidthCoarse fwidthFine',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'variable.predefined.wgsl' },
				{ startIndex: 10, type: 'white.wgsl' },
				{ startIndex: 11, type: 'variable.predefined.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'variable.predefined.wgsl' },
				{ startIndex: 30, type: 'white.wgsl' },
				{ startIndex: 31, type: 'variable.predefined.wgsl' },
				{ startIndex: 35, type: 'white.wgsl' },
				{ startIndex: 36, type: 'variable.predefined.wgsl' },
				{ startIndex: 46, type: 'white.wgsl' },
				{ startIndex: 47, type: 'variable.predefined.wgsl' },
				{ startIndex: 55, type: 'white.wgsl' },
				{ startIndex: 56, type: 'variable.predefined.wgsl' },
				{ startIndex: 62, type: 'white.wgsl' },
				{ startIndex: 63, type: 'variable.predefined.wgsl' },
				{ startIndex: 75, type: 'white.wgsl' },
				{ startIndex: 76, type: 'variable.predefined.wgsl' }
			]
		},
		{
			line: 'textureDimensions textureGather textureGatherCompare textureLoad textureNumLayers',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'white.wgsl' },
				{ startIndex: 18, type: 'variable.predefined.wgsl' },
				{ startIndex: 31, type: 'white.wgsl' },
				{ startIndex: 32, type: 'variable.predefined.wgsl' },
				{ startIndex: 52, type: 'white.wgsl' },
				{ startIndex: 53, type: 'variable.predefined.wgsl' },
				{ startIndex: 64, type: 'white.wgsl' },
				{ startIndex: 65, type: 'variable.predefined.wgsl' }
			]
		},
		{
			line: 'textureNumLevels textureNumSamples textureSample textureSampleBias textureSampleCompare',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.wgsl' },
				{ startIndex: 16, type: 'white.wgsl' },
				{ startIndex: 17, type: 'variable.predefined.wgsl' },
				{ startIndex: 34, type: 'white.wgsl' },
				{ startIndex: 35, type: 'variable.predefined.wgsl' },
				{ startIndex: 48, type: 'white.wgsl' },
				{ startIndex: 49, type: 'variable.predefined.wgsl' },
				{ startIndex: 66, type: 'white.wgsl' },
				{ startIndex: 67, type: 'variable.predefined.wgsl' }
			]
		},
		{
			line: 'textureSampleCompareLevel textureSampleGrad textureSampleLevel textureSampleBaseClampToEdge',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 43, type: 'white.wgsl' },
				{ startIndex: 44, type: 'variable.predefined.wgsl' },
				{ startIndex: 62, type: 'white.wgsl' },
				{ startIndex: 63, type: 'variable.predefined.wgsl' }
			]
		},
		{
			line: 'textureStore atomicLoad atomicStore atomicAdd atomicSub atomicMax atomicMin',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.wgsl' },
				{ startIndex: 12, type: 'white.wgsl' },
				{ startIndex: 13, type: 'variable.predefined.wgsl' },
				{ startIndex: 23, type: 'white.wgsl' },
				{ startIndex: 24, type: 'variable.predefined.wgsl' },
				{ startIndex: 35, type: 'white.wgsl' },
				{ startIndex: 36, type: 'variable.predefined.wgsl' },
				{ startIndex: 45, type: 'white.wgsl' },
				{ startIndex: 46, type: 'variable.predefined.wgsl' },
				{ startIndex: 55, type: 'white.wgsl' },
				{ startIndex: 56, type: 'variable.predefined.wgsl' },
				{ startIndex: 65, type: 'white.wgsl' },
				{ startIndex: 66, type: 'variable.predefined.wgsl' }
			]
		},
		{
			line: 'atomicAnd atomicOr atomicXor atomicExchange atomicCompareExchangeWeak pack4x8snorm',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'variable.predefined.wgsl' },
				{ startIndex: 18, type: 'white.wgsl' },
				{ startIndex: 19, type: 'variable.predefined.wgsl' },
				{ startIndex: 28, type: 'white.wgsl' },
				{ startIndex: 29, type: 'variable.predefined.wgsl' },
				{ startIndex: 43, type: 'white.wgsl' },
				{ startIndex: 44, type: 'variable.predefined.wgsl' },
				{ startIndex: 69, type: 'white.wgsl' },
				{ startIndex: 70, type: 'variable.predefined.wgsl' }
			]
		},
		{
			line: 'pack4x8unorm pack2x16snorm pack2x16unorm pack2x16float unpack4x8snorm unpack4x8unorm',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.wgsl' },
				{ startIndex: 12, type: 'white.wgsl' },
				{ startIndex: 13, type: 'variable.predefined.wgsl' },
				{ startIndex: 26, type: 'white.wgsl' },
				{ startIndex: 27, type: 'variable.predefined.wgsl' },
				{ startIndex: 40, type: 'white.wgsl' },
				{ startIndex: 41, type: 'variable.predefined.wgsl' },
				{ startIndex: 54, type: 'white.wgsl' },
				{ startIndex: 55, type: 'variable.predefined.wgsl' },
				{ startIndex: 69, type: 'white.wgsl' },
				{ startIndex: 70, type: 'variable.predefined.wgsl' }
			]
		},
		{
			line: 'unpack2x16snorm unpack2x16unorm unpack2x16float storageBarrier workgroupBarrier',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.wgsl' },
				{ startIndex: 15, type: 'white.wgsl' },
				{ startIndex: 16, type: 'variable.predefined.wgsl' },
				{ startIndex: 31, type: 'white.wgsl' },
				{ startIndex: 32, type: 'variable.predefined.wgsl' },
				{ startIndex: 47, type: 'white.wgsl' },
				{ startIndex: 48, type: 'variable.predefined.wgsl' },
				{ startIndex: 62, type: 'white.wgsl' },
				{ startIndex: 63, type: 'variable.predefined.wgsl' }
			]
		},
		{
			line: 'workgroupUniformLoad',
			tokens: [{ startIndex: 0, type: 'variable.predefined.wgsl' }]
		}
	],
	// reserved
	[
		{ line: 'NULL', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'Self', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'abstract', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'active', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'alignas', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'alignof', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'as', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'asm', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'asm_fragment', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'async', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'attribute', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'auto', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'await', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'become', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'binding_array', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'cast', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'catch', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'class', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'co_await', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'co_return', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'co_yield', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'coherent', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'column_major', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'common', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'compile', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'compile_fragment', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'concept', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'const_cast', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'consteval', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'constexpr', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'constinit', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'crate', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'debugger', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'decltype', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'delete', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'demote', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'demote_to_helper', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'do', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'dynamic_cast', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'enum', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'explicit', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'export', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'extends', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'extern', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'external', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'fallthrough', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'filter', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'final', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'finally', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'friend', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'from', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'fxgroup', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'get', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'goto', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'groupshared', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'highp', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'impl', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'implements', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'import', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'inline', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'instanceof', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'interface', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'layout', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'lowp', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'macro', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'macro_rules', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'match', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'mediump', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'meta', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'mod', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'module', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'move', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'mut', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'mutable', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'namespace', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'new', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'nil', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'noexcept', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'noinline', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'nointerpolation', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'noperspective', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'null', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'nullptr', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'of', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'operator', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'package', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'packoffset', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'partition', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'pass', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'patch', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'pixelfragment', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'precise', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'precision', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'premerge', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'priv', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'protected', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'pub', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'public', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'readonly', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'ref', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'regardless', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'register', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'reinterpret_cast', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'require', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'resource', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'restrict', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'self', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'set', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'shared', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'sizeof', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'smooth', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'snorm', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'static', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'static_assert', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'static_cast', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'std', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'subroutine', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'super', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'target', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'template', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'this', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'thread_local', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'throw', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'trait', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'try', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'type', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'typedef', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'typeid', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'typename', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'typeof', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'union', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'unless', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'unorm', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'unsafe', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'unsized', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'use', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'using', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'varying', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'virtual', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'volatile', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'wgsl', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'where', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'with', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'writeonly', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] },
		{ line: 'yield', tokens: [{ startIndex: 0, type: 'invalid.wgsl' }] }
	],
	// sampled texture
	[
		{
			line: '@group(0) @binding(0) var texture_1d<f32>;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 36, type: 'operator.wgsl' },
				{ startIndex: 37, type: 'variable.predefined.wgsl' },
				{ startIndex: 40, type: 'delimiter.wgsl' }
			]
		},
		{
			line: '@group(0) @binding(1) var texture_2d<f32>;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 36, type: 'operator.wgsl' },
				{ startIndex: 37, type: 'variable.predefined.wgsl' },
				{ startIndex: 40, type: 'delimiter.wgsl' }
			]
		},
		{
			line: '@group(0) @binding(2) var texture_2d_array<f32>;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 42, type: 'operator.wgsl' },
				{ startIndex: 43, type: 'variable.predefined.wgsl' },
				{ startIndex: 46, type: 'delimiter.wgsl' }
			]
		},
		{
			line: '@group(0) @binding(3) var texture_3d<f32>;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 36, type: 'operator.wgsl' },
				{ startIndex: 37, type: 'variable.predefined.wgsl' },
				{ startIndex: 40, type: 'delimiter.wgsl' }
			]
		},
		{
			line: '@group(0) @binding(4) var texture_cube<f32>;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 38, type: 'operator.wgsl' },
				{ startIndex: 39, type: 'variable.predefined.wgsl' },
				{ startIndex: 42, type: 'delimiter.wgsl' }
			]
		},
		{
			line: '@group(0) @binding(5) var texture_cube_array<f32>;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 44, type: 'operator.wgsl' },
				{ startIndex: 45, type: 'variable.predefined.wgsl' },
				{ startIndex: 48, type: 'delimiter.wgsl' }
			]
		}
	],
	// storage texture
	[
		{
			line: '@group(0) @binding(0) var texture_storage_1d<rgba8unorm,write>;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 44, type: 'operator.wgsl' },
				{ startIndex: 45, type: 'variable.predefined.wgsl' },
				{ startIndex: 55, type: 'delimiter.wgsl' },
				{ startIndex: 56, type: 'variable.predefined.wgsl' },
				{ startIndex: 61, type: 'delimiter.wgsl' }
			]
		},
		{
			line: '@group(0) @binding(1) var texture_storage_2d<rgba8unorm,write>;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 44, type: 'operator.wgsl' },
				{ startIndex: 45, type: 'variable.predefined.wgsl' },
				{ startIndex: 55, type: 'delimiter.wgsl' },
				{ startIndex: 56, type: 'variable.predefined.wgsl' },
				{ startIndex: 61, type: 'delimiter.wgsl' }
			]
		},
		{
			line: '@group(0) @binding(2) var texture_storage_2d_array<rgba8unorm,write>;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 50, type: 'operator.wgsl' },
				{ startIndex: 51, type: 'variable.predefined.wgsl' },
				{ startIndex: 61, type: 'delimiter.wgsl' },
				{ startIndex: 62, type: 'variable.predefined.wgsl' },
				{ startIndex: 67, type: 'delimiter.wgsl' }
			]
		},
		{
			line: '@group(0) @binding(3) var texture_storage_3d<rgba8unorm,write>;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 44, type: 'operator.wgsl' },
				{ startIndex: 45, type: 'variable.predefined.wgsl' },
				{ startIndex: 55, type: 'delimiter.wgsl' },
				{ startIndex: 56, type: 'variable.predefined.wgsl' },
				{ startIndex: 61, type: 'delimiter.wgsl' }
			]
		}
	],
	// texel formats
	[
		{
			line: '@group(0) @binding(0) var texture_storage_2d<rgba8unorm,write>;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 44, type: 'operator.wgsl' },
				{ startIndex: 45, type: 'variable.predefined.wgsl' },
				{ startIndex: 55, type: 'delimiter.wgsl' },
				{ startIndex: 56, type: 'variable.predefined.wgsl' },
				{ startIndex: 61, type: 'delimiter.wgsl' }
			]
		},
		{
			line: '@group(0) @binding(1) var texture_storage_2d<rgba8snorm,write>;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 44, type: 'operator.wgsl' },
				{ startIndex: 45, type: 'variable.predefined.wgsl' },
				{ startIndex: 55, type: 'delimiter.wgsl' },
				{ startIndex: 56, type: 'variable.predefined.wgsl' },
				{ startIndex: 61, type: 'delimiter.wgsl' }
			]
		},
		{
			line: '@group(0) @binding(2) var texture_storage_2d<rgba8uint,write>;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 44, type: 'operator.wgsl' },
				{ startIndex: 45, type: 'variable.predefined.wgsl' },
				{ startIndex: 54, type: 'delimiter.wgsl' },
				{ startIndex: 55, type: 'variable.predefined.wgsl' },
				{ startIndex: 60, type: 'delimiter.wgsl' }
			]
		},
		{
			line: '@group(0) @binding(3) var texture_storage_2d<rgba8sint,write>;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 44, type: 'operator.wgsl' },
				{ startIndex: 45, type: 'variable.predefined.wgsl' },
				{ startIndex: 54, type: 'delimiter.wgsl' },
				{ startIndex: 55, type: 'variable.predefined.wgsl' },
				{ startIndex: 60, type: 'delimiter.wgsl' }
			]
		},
		{
			line: '@group(0) @binding(4) var texture_storage_2d<rgba16uint,write>;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 44, type: 'operator.wgsl' },
				{ startIndex: 45, type: 'variable.predefined.wgsl' },
				{ startIndex: 55, type: 'delimiter.wgsl' },
				{ startIndex: 56, type: 'variable.predefined.wgsl' },
				{ startIndex: 61, type: 'delimiter.wgsl' }
			]
		},
		{
			line: '@group(0) @binding(5) var texture_storage_2d<rgba16sint,write>;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 44, type: 'operator.wgsl' },
				{ startIndex: 45, type: 'variable.predefined.wgsl' },
				{ startIndex: 55, type: 'delimiter.wgsl' },
				{ startIndex: 56, type: 'variable.predefined.wgsl' },
				{ startIndex: 61, type: 'delimiter.wgsl' }
			]
		},
		{
			line: '@group(0) @binding(6) var texture_storage_2d<rgba16float,write>;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 44, type: 'operator.wgsl' },
				{ startIndex: 45, type: 'variable.predefined.wgsl' },
				{ startIndex: 56, type: 'delimiter.wgsl' },
				{ startIndex: 57, type: 'variable.predefined.wgsl' },
				{ startIndex: 62, type: 'delimiter.wgsl' }
			]
		},
		{
			line: '@group(0) @binding(7) var texture_storage_2d<r32uint,write>;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 44, type: 'operator.wgsl' },
				{ startIndex: 45, type: 'variable.predefined.wgsl' },
				{ startIndex: 52, type: 'delimiter.wgsl' },
				{ startIndex: 53, type: 'variable.predefined.wgsl' },
				{ startIndex: 58, type: 'delimiter.wgsl' }
			]
		},
		{
			line: '@group(0) @binding(8) var texture_storage_2d<r32sint,write>;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 44, type: 'operator.wgsl' },
				{ startIndex: 45, type: 'variable.predefined.wgsl' },
				{ startIndex: 52, type: 'delimiter.wgsl' },
				{ startIndex: 53, type: 'variable.predefined.wgsl' },
				{ startIndex: 58, type: 'delimiter.wgsl' }
			]
		},
		{
			line: '@group(0) @binding(9) var texture_storage_2d<r32float,write>;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 44, type: 'operator.wgsl' },
				{ startIndex: 45, type: 'variable.predefined.wgsl' },
				{ startIndex: 53, type: 'delimiter.wgsl' },
				{ startIndex: 54, type: 'variable.predefined.wgsl' },
				{ startIndex: 59, type: 'delimiter.wgsl' }
			]
		},
		{
			line: '@group(1) @binding(0) var texture_storage_2d<rg32uint,write>;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 44, type: 'operator.wgsl' },
				{ startIndex: 45, type: 'variable.predefined.wgsl' },
				{ startIndex: 53, type: 'delimiter.wgsl' },
				{ startIndex: 54, type: 'variable.predefined.wgsl' },
				{ startIndex: 59, type: 'delimiter.wgsl' }
			]
		},
		{
			line: '@group(1) @binding(1) var texture_storage_2d<rg32sint,write>;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 44, type: 'operator.wgsl' },
				{ startIndex: 45, type: 'variable.predefined.wgsl' },
				{ startIndex: 53, type: 'delimiter.wgsl' },
				{ startIndex: 54, type: 'variable.predefined.wgsl' },
				{ startIndex: 59, type: 'delimiter.wgsl' }
			]
		},
		{
			line: '@group(1) @binding(2) var texture_storage_2d<rg32float,write>;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 44, type: 'operator.wgsl' },
				{ startIndex: 45, type: 'variable.predefined.wgsl' },
				{ startIndex: 54, type: 'delimiter.wgsl' },
				{ startIndex: 55, type: 'variable.predefined.wgsl' },
				{ startIndex: 60, type: 'delimiter.wgsl' }
			]
		},
		{
			line: '@group(1) @binding(3) var texture_storage_2d<rgba32uint,write>;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 44, type: 'operator.wgsl' },
				{ startIndex: 45, type: 'variable.predefined.wgsl' },
				{ startIndex: 55, type: 'delimiter.wgsl' },
				{ startIndex: 56, type: 'variable.predefined.wgsl' },
				{ startIndex: 61, type: 'delimiter.wgsl' }
			]
		},
		{
			line: '@group(1) @binding(4) var texture_storage_2d<rgba32sint,write>;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 44, type: 'operator.wgsl' },
				{ startIndex: 45, type: 'variable.predefined.wgsl' },
				{ startIndex: 55, type: 'delimiter.wgsl' },
				{ startIndex: 56, type: 'variable.predefined.wgsl' },
				{ startIndex: 61, type: 'delimiter.wgsl' }
			]
		},
		{
			line: '@group(1) @binding(5) var texture_storage_2d<rgba32float,write>;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 44, type: 'operator.wgsl' },
				{ startIndex: 45, type: 'variable.predefined.wgsl' },
				{ startIndex: 56, type: 'delimiter.wgsl' },
				{ startIndex: 57, type: 'variable.predefined.wgsl' },
				{ startIndex: 62, type: 'delimiter.wgsl' }
			]
		},
		{
			line: '@group(1) @binding(6) var texture_storage_2d<bgra8unorm,write>;',
			tokens: [
				{ startIndex: 0, type: 'annotation.wgsl' },
				{ startIndex: 6, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 7, type: 'number.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'white.wgsl' },
				{ startIndex: 10, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'keyword.wgsl' },
				{ startIndex: 25, type: 'white.wgsl' },
				{ startIndex: 26, type: 'variable.predefined.wgsl' },
				{ startIndex: 44, type: 'operator.wgsl' },
				{ startIndex: 45, type: 'variable.predefined.wgsl' },
				{ startIndex: 55, type: 'delimiter.wgsl' },
				{ startIndex: 56, type: 'variable.predefined.wgsl' },
				{ startIndex: 61, type: 'delimiter.wgsl' }
			]
		}
	],
	// tiny render
	[
		{ line: '@vertex', tokens: [{ startIndex: 0, type: 'annotation.wgsl' }] },
		{
			line: 'fn vmain(@location(0) v: vec4<f32>) -> @builtin(position) vec4f {',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 2, type: 'white.wgsl' },
				{ startIndex: 3, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'annotation.wgsl' },
				{ startIndex: 18, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 19, type: 'number.wgsl' },
				{ startIndex: 20, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 21, type: 'white.wgsl' },
				{ startIndex: 22, type: 'identifier.wgsl' },
				{ startIndex: 23, type: 'delimiter.wgsl' },
				{ startIndex: 24, type: 'white.wgsl' },
				{ startIndex: 25, type: 'variable.predefined.wgsl' },
				{ startIndex: 29, type: 'operator.wgsl' },
				{ startIndex: 30, type: 'variable.predefined.wgsl' },
				{ startIndex: 33, type: 'operator.wgsl' },
				{ startIndex: 34, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 35, type: 'white.wgsl' },
				{ startIndex: 36, type: 'operator.wgsl' },
				{ startIndex: 38, type: 'white.wgsl' },
				{ startIndex: 39, type: 'annotation.wgsl' },
				{ startIndex: 47, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 48, type: 'variable.predefined.wgsl' },
				{ startIndex: 56, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 57, type: 'white.wgsl' },
				{ startIndex: 58, type: 'variable.predefined.wgsl' },
				{ startIndex: 63, type: 'white.wgsl' },
				{ startIndex: 64, type: 'delimiter.curly.wgsl' }
			]
		},
		{
			line: '  return v;',
			tokens: [
				{ startIndex: 0, type: 'white.wgsl' },
				{ startIndex: 2, type: 'keyword.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'identifier.wgsl' },
				{ startIndex: 10, type: 'delimiter.wgsl' }
			]
		},
		{ line: '}', tokens: [{ startIndex: 0, type: 'delimiter.curly.wgsl' }] },
		{ line: '', tokens: [] },
		{ line: '@fragment', tokens: [{ startIndex: 0, type: 'annotation.wgsl' }] },
		{
			line: 'fn fmain(@builtin(position) pos: vec4f) -> @location(0) vec4f {',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 2, type: 'white.wgsl' },
				{ startIndex: 3, type: 'identifier.wgsl' },
				{ startIndex: 8, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 9, type: 'annotation.wgsl' },
				{ startIndex: 17, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 18, type: 'variable.predefined.wgsl' },
				{ startIndex: 26, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 27, type: 'white.wgsl' },
				{ startIndex: 28, type: 'identifier.wgsl' },
				{ startIndex: 31, type: 'delimiter.wgsl' },
				{ startIndex: 32, type: 'white.wgsl' },
				{ startIndex: 33, type: 'variable.predefined.wgsl' },
				{ startIndex: 38, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 39, type: 'white.wgsl' },
				{ startIndex: 40, type: 'operator.wgsl' },
				{ startIndex: 42, type: 'white.wgsl' },
				{ startIndex: 43, type: 'annotation.wgsl' },
				{ startIndex: 52, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 53, type: 'number.wgsl' },
				{ startIndex: 54, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 55, type: 'white.wgsl' },
				{ startIndex: 56, type: 'variable.predefined.wgsl' },
				{ startIndex: 61, type: 'white.wgsl' },
				{ startIndex: 62, type: 'delimiter.curly.wgsl' }
			]
		},
		{
			line: '  return vec4f(0.25,0.25,1.0,1.0);',
			tokens: [
				{ startIndex: 0, type: 'white.wgsl' },
				{ startIndex: 2, type: 'keyword.wgsl' },
				{ startIndex: 8, type: 'white.wgsl' },
				{ startIndex: 9, type: 'variable.predefined.wgsl' },
				{ startIndex: 14, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 15, type: 'number.float.wgsl' },
				{ startIndex: 19, type: 'delimiter.wgsl' },
				{ startIndex: 20, type: 'number.float.wgsl' },
				{ startIndex: 24, type: 'delimiter.wgsl' },
				{ startIndex: 25, type: 'number.float.wgsl' },
				{ startIndex: 28, type: 'delimiter.wgsl' },
				{ startIndex: 29, type: 'number.float.wgsl' },
				{ startIndex: 32, type: 'delimiter.parenthesis.wgsl' },
				{ startIndex: 33, type: 'delimiter.wgsl' }
			]
		},
		{ line: '}', tokens: [{ startIndex: 0, type: 'delimiter.curly.wgsl' }] }
	],
	// type generators
	[
		{
			line: '// Test predeclared type generators, other than vector, matrix, and texture.',
			tokens: [{ startIndex: 0, type: 'comment.wgsl' }]
		},
		{
			line: 'alias a=array<f32>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 7, type: 'operator.wgsl' },
				{ startIndex: 8, type: 'variable.predefined.wgsl' },
				{ startIndex: 13, type: 'operator.wgsl' },
				{ startIndex: 14, type: 'variable.predefined.wgsl' },
				{ startIndex: 17, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias b=atomic<i32>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 7, type: 'operator.wgsl' },
				{ startIndex: 8, type: 'variable.predefined.wgsl' },
				{ startIndex: 14, type: 'operator.wgsl' },
				{ startIndex: 15, type: 'variable.predefined.wgsl' },
				{ startIndex: 18, type: 'delimiter.wgsl' }
			]
		},
		{
			line: 'alias c=ptr<function,i32>;',
			tokens: [
				{ startIndex: 0, type: 'keyword.wgsl' },
				{ startIndex: 5, type: 'white.wgsl' },
				{ startIndex: 6, type: 'identifier.wgsl' },
				{ startIndex: 7, type: 'operator.wgsl' },
				{ startIndex: 8, type: 'variable.predefined.wgsl' },
				{ startIndex: 11, type: 'operator.wgsl' },
				{ startIndex: 12, type: 'variable.predefined.wgsl' },
				{ startIndex: 20, type: 'delimiter.wgsl' },
				{ startIndex: 21, type: 'variable.predefined.wgsl' },
				{ startIndex: 24, type: 'delimiter.wgsl' }
			]
		}
	]
];
testTokenization('wgsl', cases);
