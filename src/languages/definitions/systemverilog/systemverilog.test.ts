/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('systemverilog', [
	// Keywords
	[
		{
			line: 'module mux2to1 (input wire a, b, sel, output logic y);',
			tokens: [
				{ startIndex: 0, type: 'keyword.module.sv' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'identifier.sv' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 16, type: 'keyword.input.sv' },
				{ startIndex: 21, type: '' },
				{ startIndex: 22, type: 'keyword.wire.sv' },
				{ startIndex: 26, type: '' },
				{ startIndex: 27, type: 'identifier.sv' },
				{ startIndex: 28, type: 'delimiter.sv' },
				{ startIndex: 29, type: '' },
				{ startIndex: 30, type: 'identifier.sv' },
				{ startIndex: 31, type: 'delimiter.sv' },
				{ startIndex: 32, type: '' },
				{ startIndex: 33, type: 'identifier.sv' },
				{ startIndex: 36, type: 'delimiter.sv' },
				{ startIndex: 37, type: '' },
				{ startIndex: 38, type: 'keyword.output.sv' },
				{ startIndex: 44, type: '' },
				{ startIndex: 45, type: 'keyword.logic.sv' },
				{ startIndex: 50, type: '' },
				{ startIndex: 51, type: 'identifier.sv' },
				{ startIndex: 52, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 53, type: 'delimiter.sv' }
			]
		}
	],
	[
		{
			line: 'a !== b',
			tokens: [
				{ startIndex: 0, type: 'identifier.sv' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.sv' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'identifier.sv' }
			]
		}
	],
	[
		{
			line: '!n',
			tokens: [
				{ startIndex: 0, type: 'delimiter.sv' },
				{ startIndex: 1, type: 'identifier.sv' }
			]
		}
	],
	[
		{
			line: 'assign r = c + i;',
			tokens: [
				{ startIndex: 0, type: 'keyword.assign.sv' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'identifier.sv' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'delimiter.sv' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'identifier.sv' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'delimiter.sv' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'identifier.sv' },
				{ startIndex: 16, type: 'delimiter.sv' }
			]
		}
	],
	[
		{
			line: 'assert(req1 || req2)',
			tokens: [
				{ startIndex: 0, type: 'keyword.assert.sv' },
				{ startIndex: 6, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 7, type: 'identifier.sv' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'delimiter.sv' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'identifier.sv' },
				{ startIndex: 19, type: 'delimiter.parenthesis.sv' }
			]
		}
	],
	[
		{
			line: 'assign enable = set & interrupt;',
			tokens: [
				{ startIndex: 0, type: 'keyword.assign.sv' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'identifier.sv' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'delimiter.sv' },
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'identifier.sv' },
				{ startIndex: 19, type: '' },
				{ startIndex: 20, type: 'delimiter.sv' },
				{ startIndex: 21, type: '' },
				{ startIndex: 22, type: 'identifier.sv' },
				{ startIndex: 31, type: 'delimiter.sv' }
			]
		}
	],
	[
		{
			line: 'arrayB[i][j+:2] == arrayA[k][m-:2]',
			tokens: [
				{ startIndex: 0, type: 'identifier.sv' },
				{ startIndex: 6, type: 'delimiter.square.sv' },
				{ startIndex: 7, type: 'identifier.sv' },
				{ startIndex: 8, type: 'delimiter.square.sv' },
				{ startIndex: 10, type: 'identifier.sv' },
				{ startIndex: 11, type: 'delimiter.sv' },
				{ startIndex: 13, type: 'number.sv' },
				{ startIndex: 14, type: 'delimiter.square.sv' },
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'delimiter.sv' },
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'identifier.sv' },
				{ startIndex: 25, type: 'delimiter.square.sv' },
				{ startIndex: 26, type: 'identifier.sv' },
				{ startIndex: 27, type: 'delimiter.square.sv' },
				{ startIndex: 29, type: 'identifier.sv' },
				{ startIndex: 30, type: 'delimiter.sv' },
				{ startIndex: 32, type: 'number.sv' },
				{ startIndex: 33, type: 'delimiter.square.sv' }
			]
		}
	],
	[
		{
			line: 'assert property (@(clk) go ##1 get[*2] |-> !stop throughout put[->2]);',
			tokens: [
				{ startIndex: 0, type: 'keyword.assert.sv' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'keyword.property.sv' },
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 17, type: '' },
				{ startIndex: 18, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 19, type: 'identifier.sv' },
				{ startIndex: 22, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 23, type: '' },
				{ startIndex: 24, type: 'identifier.sv' },
				{ startIndex: 26, type: '' },
				{ startIndex: 29, type: 'number.sv' },
				{ startIndex: 30, type: '' },
				{ startIndex: 31, type: 'identifier.sv' },
				{ startIndex: 34, type: 'delimiter.square.sv' },
				{ startIndex: 35, type: 'delimiter.sv' },
				{ startIndex: 36, type: 'number.sv' },
				{ startIndex: 37, type: 'delimiter.square.sv' },
				{ startIndex: 38, type: '' },
				{ startIndex: 39, type: 'delimiter.sv' },
				{ startIndex: 42, type: '' },
				{ startIndex: 43, type: 'delimiter.sv' },
				{ startIndex: 44, type: 'identifier.sv' },
				{ startIndex: 48, type: '' },
				{ startIndex: 49, type: 'keyword.throughout.sv' },
				{ startIndex: 59, type: '' },
				{ startIndex: 60, type: 'identifier.sv' },
				{ startIndex: 63, type: 'delimiter.square.sv' },
				{ startIndex: 64, type: 'delimiter.sv' },
				{ startIndex: 66, type: 'number.sv' },
				{ startIndex: 67, type: 'delimiter.square.sv' },
				{ startIndex: 68, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 69, type: 'delimiter.sv' }
			]
		}
	],
	[
		{
			line: 'always_ff @(posedge clk) gnt <= req & avail;',
			tokens: [
				{ startIndex: 0, type: 'keyword.always-ff.sv' },
				{ startIndex: 9, type: '' },
				{ startIndex: 11, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 12, type: 'keyword.posedge.sv' },
				{ startIndex: 19, type: '' },
				{ startIndex: 20, type: 'identifier.sv' },
				{ startIndex: 23, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 24, type: '' },
				{ startIndex: 25, type: 'identifier.sv' },
				{ startIndex: 28, type: '' },
				{ startIndex: 29, type: 'delimiter.sv' },
				{ startIndex: 31, type: '' },
				{ startIndex: 32, type: 'identifier.sv' },
				{ startIndex: 35, type: '' },
				{ startIndex: 36, type: 'delimiter.sv' },
				{ startIndex: 37, type: '' },
				{ startIndex: 38, type: 'identifier.sv' },
				{ startIndex: 43, type: 'delimiter.sv' }
			]
		}
	],
	[
		{
			line: 'parameter type t_3 = int;',
			tokens: [
				{ startIndex: 0, type: 'keyword.parameter.sv' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'keyword.type.sv' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'identifier.sv' },
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'delimiter.sv' },
				{ startIndex: 20, type: '' },
				{ startIndex: 21, type: 'keyword.int.sv' },
				{ startIndex: 24, type: 'delimiter.sv' }
			]
		}
	],
	[
		{
			line: 'typedef union packed {',
			tokens: [
				{ startIndex: 0, type: 'keyword.typedef.sv' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'keyword.union.sv' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'keyword.packed.sv' },
				{ startIndex: 20, type: '' },
				{ startIndex: 21, type: 'delimiter.curly.sv' }
			]
		}
	],
	[
		{
			line: "a = 8'hFF;",
			tokens: [
				{ startIndex: 0, type: 'identifier.sv' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.sv' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.hex.sv' },
				{ startIndex: 9, type: 'delimiter.sv' }
			]
		}
	],
	[
		{
			line: "a = 2'b01;",
			tokens: [
				{ startIndex: 0, type: 'identifier.sv' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.sv' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.binary.sv' },
				{ startIndex: 9, type: 'delimiter.sv' }
			]
		}
	],
	[
		{
			line: "a = 6'o654;",
			tokens: [
				{ startIndex: 0, type: 'identifier.sv' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.sv' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.octal.sv' },
				{ startIndex: 10, type: 'delimiter.sv' }
			]
		}
	],
	[
		{
			line: "a = 8'd98;",
			tokens: [
				{ startIndex: 0, type: 'identifier.sv' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.sv' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.sv' },
				{ startIndex: 9, type: 'delimiter.sv' }
			]
		}
	],
	[
		{
			line: "10'bxxxx_zxxxx",
			tokens: [{ startIndex: 0, type: 'number.binary.sv' }]
		}
	],
	[
		{
			line: "1'H?z",
			tokens: [{ startIndex: 0, type: 'number.hex.sv' }]
		}
	],
	[
		{
			line: '64E435456',
			tokens: [{ startIndex: 0, type: 'number.float.sv' }]
		}
	],
	[
		{
			line: '64.4e3445',
			tokens: [{ startIndex: 0, type: 'number.float.sv' }]
		}
	],
	[
		{
			line: "if( my_var[3:0] == 4'b0101)",
			tokens: [
				{ startIndex: 0, type: 'keyword.if.sv' },
				{ startIndex: 2, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.sv' },
				{ startIndex: 10, type: 'delimiter.square.sv' },
				{ startIndex: 11, type: 'number.sv' },
				{ startIndex: 12, type: 'delimiter.sv' },
				{ startIndex: 13, type: 'number.sv' },
				{ startIndex: 14, type: 'delimiter.square.sv' },
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'delimiter.sv' },
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'number.binary.sv' },
				{ startIndex: 26, type: 'delimiter.parenthesis.sv' }
			]
		}
	],
	[
		{
			line: 'typedef enum int {FAST_SIM = 0, RANDOM = 1, NOMINAL = 2, START_UP = 3} clock_plan_e;',
			tokens: [
				{ startIndex: 0, type: 'keyword.typedef.sv' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'keyword.enum.sv' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'keyword.int.sv' },
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'delimiter.curly.sv' },
				{ startIndex: 18, type: 'identifier.sv' },
				{ startIndex: 26, type: '' },
				{ startIndex: 27, type: 'delimiter.sv' },
				{ startIndex: 28, type: '' },
				{ startIndex: 29, type: 'number.sv' },
				{ startIndex: 30, type: 'delimiter.sv' },
				{ startIndex: 31, type: '' },
				{ startIndex: 32, type: 'identifier.sv' },
				{ startIndex: 38, type: '' },
				{ startIndex: 39, type: 'delimiter.sv' },
				{ startIndex: 40, type: '' },
				{ startIndex: 41, type: 'number.sv' },
				{ startIndex: 42, type: 'delimiter.sv' },
				{ startIndex: 43, type: '' },
				{ startIndex: 44, type: 'identifier.sv' },
				{ startIndex: 51, type: '' },
				{ startIndex: 52, type: 'delimiter.sv' },
				{ startIndex: 53, type: '' },
				{ startIndex: 54, type: 'number.sv' },
				{ startIndex: 55, type: 'delimiter.sv' },
				{ startIndex: 56, type: '' },
				{ startIndex: 57, type: 'identifier.sv' },
				{ startIndex: 65, type: '' },
				{ startIndex: 66, type: 'delimiter.sv' },
				{ startIndex: 67, type: '' },
				{ startIndex: 68, type: 'number.sv' },
				{ startIndex: 69, type: 'delimiter.curly.sv' },
				{ startIndex: 70, type: '' },
				{ startIndex: 71, type: 'identifier.sv' },
				{ startIndex: 83, type: 'delimiter.sv' }
			]
		}
	],
	[
		{
			line: "if( my_var[31:0] === 32'h2aB0_113C )",
			tokens: [
				{ startIndex: 0, type: 'keyword.if.sv' },
				{ startIndex: 2, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.sv' },
				{ startIndex: 10, type: 'delimiter.square.sv' },
				{ startIndex: 11, type: 'number.sv' },
				{ startIndex: 13, type: 'delimiter.sv' },
				{ startIndex: 14, type: 'number.sv' },
				{ startIndex: 15, type: 'delimiter.square.sv' },
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'delimiter.sv' },
				{ startIndex: 20, type: '' },
				{ startIndex: 21, type: 'number.hex.sv' },
				{ startIndex: 34, type: '' },
				{ startIndex: 35, type: 'delimiter.parenthesis.sv' }
			]
		}
	],
	// Include tests
	[
		{
			line: '`include"tb_test.sv"',
			tokens: [
				{ startIndex: 0, type: 'keyword.directive.include.sv' },
				{ startIndex: 8, type: 'string.include.identifier.sv' }
			]
		}
	],
	[
		{
			line: '`include "path/to/my/file.sv"',
			tokens: [
				{ startIndex: 0, type: 'keyword.directive.include.sv' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'string.include.identifier.sv' }
			]
		}
	],
	[
		{
			line: '`include                      "file.sv"',
			tokens: [
				{ startIndex: 0, type: 'keyword.directive.include.sv' },
				{ startIndex: 8, type: '' },
				{ startIndex: 30, type: 'string.include.identifier.sv' }
			]
		}
	],
	[
		{
			line: '   `include "file.sv"',
			tokens: [
				{ startIndex: 0, type: 'keyword.directive.include.sv' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'string.include.identifier.sv' }
			]
		}
	],
	[
		{
			line: '   `include     "file.sv"',
			tokens: [
				{ startIndex: 0, type: 'keyword.directive.include.sv' },
				{ startIndex: 11, type: '' },
				{ startIndex: 16, type: 'string.include.identifier.sv' }
			]
		}
	],
	[
		{
			line: '`include<tb_test.sv>',
			tokens: [
				{ startIndex: 0, type: 'keyword.directive.include.sv' },
				{ startIndex: 8, type: 'string.include.identifier.sv' }
			]
		}
	],
	[
		{
			line: '`include <path/to/my/file.sv>',
			tokens: [
				{ startIndex: 0, type: 'keyword.directive.include.sv' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'string.include.identifier.sv' }
			]
		}
	],
	// Preprocessor Directives
	[
		{
			line: '`__FILE__',
			tokens: [{ startIndex: 0, type: 'keyword.sv' }]
		}
	],
	[
		{
			line: '      `begin_keywords',
			tokens: [{ startIndex: 0, type: 'keyword.sv' }]
		}
	],
	[
		{
			line: '`define wordsize 8',
			tokens: [
				{ startIndex: 0, type: 'keyword.sv' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.sv' },
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'number.sv' }
			]
		}
	],
	[
		{
			line: '    `define variable',
			tokens: [
				{ startIndex: 0, type: 'keyword.sv' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'identifier.sv' }
			]
		}
	],
	[
		{
			line: '`      else',
			tokens: [{ startIndex: 0, type: 'keyword.sv' }]
		}
	],
	[
		{
			line: '`timescale 1ns/1ps',
			tokens: [
				{ startIndex: 0, type: 'keyword.sv' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'number.sv' },
				{ startIndex: 14, type: 'delimiter.sv' },
				{ startIndex: 15, type: 'number.sv' }
			]
		}
	],
	[
		{
			line: '`timescale 1 ns / 1 ps',
			tokens: [
				{ startIndex: 0, type: 'keyword.sv' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'number.sv' },
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'delimiter.sv' },
				{ startIndex: 17, type: '' },
				{ startIndex: 18, type: 'number.sv' }
			]
		}
	],
	[
		{
			line: '`MACRO (1, 2, 3)',
			tokens: [
				{ startIndex: 0, type: 'keyword.sv' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 8, type: 'number.sv' },
				{ startIndex: 9, type: 'delimiter.sv' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'number.sv' },
				{ startIndex: 12, type: 'delimiter.sv' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'number.sv' },
				{ startIndex: 15, type: 'delimiter.parenthesis.sv' }
			]
		}
	],
	[
		{
			line: '`ifdef wow',
			tokens: [
				{ startIndex: 0, type: 'keyword.sv' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'identifier.sv' }
			]
		}
	],
	[
		{
			line: '`ifndef AGENT',
			tokens: [
				{ startIndex: 0, type: 'keyword.sv' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.sv' }
			]
		}
	],
	[
		{
			line: '`endif // AGENT',
			tokens: [
				{ startIndex: 0, type: 'keyword.sv' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'comment.sv' }
			]
		}
	],
	[
		{
			line: '`pragma protect encoding=(enctype="raw")',
			tokens: [
				{ startIndex: 0, type: 'keyword.sv' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.sv' },
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'identifier.sv' },
				{ startIndex: 24, type: 'delimiter.sv' },
				{ startIndex: 25, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 26, type: 'identifier.sv' },
				{ startIndex: 33, type: 'delimiter.sv' },
				{ startIndex: 34, type: 'string.sv' },
				{ startIndex: 39, type: 'delimiter.parenthesis.sv' }
			]
		}
	],
	[
		{
			line: '`undef macro_name',
			tokens: [
				{ startIndex: 0, type: 'keyword.sv' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'identifier.sv' }
			]
		}
	],
	[
		{
			line: '`celldefine    ',
			tokens: [
				{ startIndex: 0, type: 'keyword.sv' },
				{ startIndex: 11, type: '' }
			]
		}
	],
	[
		{
			line: '`default_nettype none',
			tokens: [
				{ startIndex: 0, type: 'keyword.sv' },
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'identifier.sv' }
			]
		}
	],
	// Strings
	[
		{
			line: 'pdisplay ("display msg");',
			tokens: [
				{ startIndex: 0, type: 'identifier.sv' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 10, type: 'string.sv' },
				{ startIndex: 23, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 24, type: 'delimiter.sv' }
			]
		}
	],
	[
		{
			line: '"multi\\n line\\n string"',
			tokens: [
				{ startIndex: 0, type: 'string.sv' },
				{ startIndex: 6, type: 'string.escape.sv' },
				{ startIndex: 8, type: 'string.sv' },
				{ startIndex: 13, type: 'string.escape.sv' },
				{ startIndex: 15, type: 'string.sv' }
			]
		}
	],
	[
		{
			line: 'pdisplay ("%s : %d\\n", c.name, c );',
			tokens: [
				{ startIndex: 0, type: 'identifier.sv' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 10, type: 'string.sv' },
				{ startIndex: 18, type: 'string.escape.sv' },
				{ startIndex: 20, type: 'string.sv' },
				{ startIndex: 21, type: 'delimiter.sv' },
				{ startIndex: 22, type: '' },
				{ startIndex: 23, type: 'identifier.sv' },
				{ startIndex: 29, type: 'delimiter.sv' },
				{ startIndex: 30, type: '' },
				{ startIndex: 31, type: 'identifier.sv' },
				{ startIndex: 32, type: '' },
				{ startIndex: 33, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 34, type: 'delimiter.sv' }
			]
		}
	],
	[
		{
			line: '"Valid escapes \\b \\f \\v"',
			tokens: [
				{ startIndex: 0, type: 'string.sv' },
				{ startIndex: 15, type: 'string.escape.invalid.sv' },
				{ startIndex: 17, type: 'string.sv' },
				{ startIndex: 18, type: 'string.escape.sv' },
				{ startIndex: 20, type: 'string.sv' },
				{ startIndex: 21, type: 'string.escape.sv' },
				{ startIndex: 23, type: 'string.sv' }
			]
		}
	],
	[
		{
			line: '"Valid escapes \\o \\j \\z"',
			tokens: [
				{ startIndex: 0, type: 'string.sv' },
				{ startIndex: 15, type: 'string.escape.invalid.sv' },
				{ startIndex: 17, type: 'string.sv' },
				{ startIndex: 18, type: 'string.escape.invalid.sv' },
				{ startIndex: 20, type: 'string.sv' },
				{ startIndex: 21, type: 'string.escape.invalid.sv' },
				{ startIndex: 23, type: 'string.sv' }
			]
		}
	],
	[
		{
			line: 'bit [8*12:1] stringvar = "Hello world\\n";',
			tokens: [
				{ startIndex: 0, type: 'keyword.bit.sv' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'delimiter.square.sv' },
				{ startIndex: 5, type: 'number.sv' },
				{ startIndex: 6, type: 'delimiter.sv' },
				{ startIndex: 7, type: 'number.sv' },
				{ startIndex: 9, type: 'delimiter.sv' },
				{ startIndex: 10, type: 'number.sv' },
				{ startIndex: 11, type: 'delimiter.square.sv' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'identifier.sv' },
				{ startIndex: 22, type: '' },
				{ startIndex: 23, type: 'delimiter.sv' },
				{ startIndex: 24, type: '' },
				{ startIndex: 25, type: 'string.sv' },
				{ startIndex: 37, type: 'string.escape.sv' },
				{ startIndex: 39, type: 'string.sv' },
				{ startIndex: 40, type: 'delimiter.sv' }
			]
		}
	],
	// Comments
	[
		{
			line: '//',
			tokens: [{ startIndex: 0, type: 'comment.sv' }]
		}
	],
	[
		{
			line: '    // a comment',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'comment.sv' }
			]
		}
	],
	[
		{
			line: '// a comment',
			tokens: [{ startIndex: 0, type: 'comment.sv' }]
		}
	],
	[
		{
			line: '//sticky comment',
			tokens: [{ startIndex: 0, type: 'comment.sv' }]
		}
	],
	[
		{
			line: '/* //*/ a',
			tokens: [
				{ startIndex: 0, type: 'comment.sv' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.sv' }
			]
		}
	],
	[
		{
			line: '1 / 2; /* comment',
			tokens: [
				{ startIndex: 0, type: 'number.sv' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.sv' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.sv' },
				{ startIndex: 5, type: 'delimiter.sv' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'comment.sv' }
			]
		}
	],
	[
		{
			line: 'int x = 1; // COMMENT // COMMENT COMMENT',
			tokens: [
				{ startIndex: 0, type: 'keyword.int.sv' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.sv' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.sv' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'number.sv' },
				{ startIndex: 9, type: 'delimiter.sv' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'comment.sv' }
			]
		}
	],
	// Comments - range comment, single line
	[
		{
			line: '/* a simple comment */',
			tokens: [{ startIndex: 0, type: 'comment.sv' }]
		}
	],
	[
		{
			line: 'int x = /* a simple comment */ 1;',
			tokens: [
				{ startIndex: 0, type: 'keyword.int.sv' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.sv' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.sv' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'comment.sv' },
				{ startIndex: 30, type: '' },
				{ startIndex: 31, type: 'number.sv' },
				{ startIndex: 32, type: 'delimiter.sv' }
			]
		}
	],
	[
		{
			line: 'logic x = /* comment */ 1; */',
			tokens: [
				{ startIndex: 0, type: 'keyword.logic.sv' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'identifier.sv' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'delimiter.sv' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'comment.sv' },
				{ startIndex: 23, type: '' },
				{ startIndex: 24, type: 'number.sv' },
				{ startIndex: 25, type: 'delimiter.sv' },
				{ startIndex: 26, type: '' }
			]
		}
	],
	[
		{
			line: 'x = /**/;',
			tokens: [
				{ startIndex: 0, type: 'identifier.sv' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.sv' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'comment.sv' },
				{ startIndex: 8, type: 'delimiter.sv' }
			]
		}
	],
	// Doxygen Comments
	[
		{
			line: '//! @param',
			tokens: [{ startIndex: 0, type: 'comment.sv' }]
		}
	],
	[
		{
			line: '//!< @param',
			tokens: [{ startIndex: 0, type: 'comment.sv' }]
		}
	],
	// Multiline Comments
	[
		{
			line: '/* temp_byte = data[0:7]; \\n m_buffer.push_back(temp_byte) */',
			tokens: [{ startIndex: 0, type: 'comment.sv' }]
		}
	],
	[
		{
			line: '/* a = b; \\n b = c; \\n c = d */',
			tokens: [{ startIndex: 0, type: 'comment.sv' }]
		}
	],
	// Numbers
	[
		{
			line: "wire a = 12'hx123456;",
			tokens: [
				{ startIndex: 0, type: 'keyword.wire.sv' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'identifier.sv' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'delimiter.sv' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'number.hex.sv' },
				{ startIndex: 20, type: 'delimiter.sv' }
			]
		}
	],
	[
		{
			line: "  wire ab = 'h e17fF;",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'keyword.wire.sv' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'identifier.sv' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'delimiter.sv' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'number.hex.sv' },
				{ startIndex: 20, type: 'delimiter.sv' }
			]
		}
	],
	[
		{
			line: "wire sn = 5 'D 3;",
			tokens: [
				{ startIndex: 0, type: 'keyword.wire.sv' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'identifier.sv' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'delimiter.sv' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'number.sv' },
				{ startIndex: 16, type: 'delimiter.sv' }
			]
		}
	],
	[
		{
			line: "wire dc = 5 'she;",
			tokens: [
				{ startIndex: 0, type: 'keyword.wire.sv' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'identifier.sv' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'delimiter.sv' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'number.hex.sv' },
				{ startIndex: 16, type: 'delimiter.sv' }
			]
		}
	],
	[
		{
			line: '  assign value = 256.12_7563_e-22;',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'keyword.assign.sv' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.sv' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'delimiter.sv' },
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'number.float.sv' },
				{ startIndex: 33, type: 'delimiter.sv' }
			]
		}
	],
	[
		{
			line: "input #1step my_wire='1",
			tokens: [
				{ startIndex: 0, type: 'keyword.input.sv' },
				{ startIndex: 5, type: '' },
				{ startIndex: 7, type: 'number.sv' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'identifier.sv' },
				{ startIndex: 20, type: 'delimiter.sv' },
				{ startIndex: 21, type: 'number.sv' }
			]
		}
	],
	// Module instances (and things that look like them)
	[
		{
			line: " my_checker #(0, 1) instance (clk, 'b1, en);",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'identifier.sv' },
				{ startIndex: 11, type: '' },
				{ startIndex: 13, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 14, type: 'number.sv' },
				{ startIndex: 15, type: 'delimiter.sv' },
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'number.sv' },
				{ startIndex: 18, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 19, type: '' },
				{ startIndex: 20, type: 'type.sv' },
				{ startIndex: 28, type: '' },
				{ startIndex: 29, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 30, type: 'identifier.sv' },
				{ startIndex: 33, type: 'delimiter.sv' },
				{ startIndex: 34, type: '' },
				{ startIndex: 35, type: 'number.binary.sv' },
				{ startIndex: 38, type: 'delimiter.sv' },
				{ startIndex: 39, type: '' },
				{ startIndex: 40, type: 'identifier.sv' },
				{ startIndex: 42, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 43, type: 'delimiter.sv' }
			]
		}
	],
	[
		{
			line: 'and #(.p1("string"), .p2(int)) u5 (i,o);',
			tokens: [
				{ startIndex: 0, type: 'keyword.and.sv' },
				{ startIndex: 3, type: '' },
				{ startIndex: 5, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'identifier.sv' },
				{ startIndex: 9, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 10, type: 'string.sv' },
				{ startIndex: 18, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 19, type: 'delimiter.sv' },
				{ startIndex: 20, type: '' },
				{ startIndex: 22, type: 'identifier.sv' },
				{ startIndex: 24, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 25, type: 'keyword.int.sv' },
				{ startIndex: 28, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 30, type: '' },
				{ startIndex: 31, type: 'type.sv' },
				{ startIndex: 33, type: '' },
				{ startIndex: 34, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 35, type: 'identifier.sv' },
				{ startIndex: 36, type: 'delimiter.sv' },
				{ startIndex: 37, type: 'identifier.sv' },
				{ startIndex: 38, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 39, type: 'delimiter.sv' }
			]
		}
	],
	[
		{
			line: '  mod #(\\n		/* comment */	) inst ();',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'identifier.sv' },
				{ startIndex: 5, type: '' },
				{ startIndex: 7, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.sv' },
				{ startIndex: 10, type: '' },
				{ startIndex: 12, type: 'comment.sv' },
				{ startIndex: 25, type: '' },
				{ startIndex: 26, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 27, type: '' },
				{ startIndex: 28, type: 'type.sv' },
				{ startIndex: 32, type: '' },
				{ startIndex: 33, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 35, type: 'delimiter.sv' }
			]
		}
	],
	[
		{
			line: "m_t myStructs[1:0] = '{'{1, 1.0}, '{2, 2.0}};",
			tokens: [
				{ startIndex: 0, type: 'identifier.sv' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.sv' },
				{ startIndex: 13, type: 'delimiter.square.sv' },
				{ startIndex: 14, type: 'number.sv' },
				{ startIndex: 15, type: 'delimiter.sv' },
				{ startIndex: 16, type: 'number.sv' },
				{ startIndex: 17, type: 'delimiter.square.sv' },
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'delimiter.sv' },
				{ startIndex: 20, type: '' },
				{ startIndex: 22, type: 'delimiter.curly.sv' },
				{ startIndex: 23, type: '' },
				{ startIndex: 24, type: 'delimiter.curly.sv' },
				{ startIndex: 25, type: 'number.sv' },
				{ startIndex: 26, type: 'delimiter.sv' },
				{ startIndex: 27, type: '' },
				{ startIndex: 28, type: 'number.float.sv' },
				{ startIndex: 31, type: 'delimiter.curly.sv' },
				{ startIndex: 32, type: 'delimiter.sv' },
				{ startIndex: 33, type: '' },
				{ startIndex: 35, type: 'delimiter.curly.sv' },
				{ startIndex: 36, type: 'number.sv' },
				{ startIndex: 37, type: 'delimiter.sv' },
				{ startIndex: 38, type: '' },
				{ startIndex: 39, type: 'number.float.sv' },
				{ startIndex: 42, type: 'delimiter.curly.sv' },
				{ startIndex: 44, type: 'delimiter.sv' }
			]
		}
	],
	[
		{
			line: '    sig_a ##1 sig_b ##10 sig_c ##1 done;',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'identifier.sv' },
				{ startIndex: 9, type: '' },
				{ startIndex: 12, type: 'number.sv' },
				{ startIndex: 15, type: 'identifier.sv' },
				{ startIndex: 19, type: '' },
				{ startIndex: 22, type: 'number.sv' },
				{ startIndex: 26, type: 'identifier.sv' },
				{ startIndex: 30, type: '' },
				{ startIndex: 33, type: 'number.sv' },
				{ startIndex: 34, type: '' },
				{ startIndex: 35, type: 'identifier.sv' },
				{ startIndex: 39, type: 'delimiter.sv' }
			]
		}
	],
	[
		{
			line: 'addr[32:10] = $urandom( 254 ); // my comment',
			tokens: [
				{ startIndex: 0, type: 'identifier.sv' },
				{ startIndex: 4, type: 'delimiter.square.sv' },
				{ startIndex: 5, type: 'number.sv' },
				{ startIndex: 7, type: 'delimiter.sv' },
				{ startIndex: 8, type: 'number.sv' },
				{ startIndex: 10, type: 'delimiter.square.sv' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'delimiter.sv' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'variable.predefined.sv' },
				{ startIndex: 22, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 23, type: '' },
				{ startIndex: 24, type: 'number.sv' },
				{ startIndex: 27, type: '' },
				{ startIndex: 28, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 29, type: 'delimiter.sv' },
				{ startIndex: 30, type: '' },
				{ startIndex: 31, type: 'comment.sv' }
			]
		}
	],
	[
		{
			line: '  my_struct instA, instB;',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'identifier.sv' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'identifier.sv' },
				{ startIndex: 17, type: 'delimiter.sv' },
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'identifier.sv' },
				{ startIndex: 24, type: 'delimiter.sv' }
			]
		}
	],
	[
		{
			line: 'myMod #(.PARAM($bits({mySignal[4:0]}))) inst (.*);',
			tokens: [
				{ startIndex: 0, type: 'identifier.sv' },
				{ startIndex: 5, type: '' },
				{ startIndex: 7, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.sv' },
				{ startIndex: 14, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 15, type: 'variable.predefined.sv' },
				{ startIndex: 20, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 21, type: '' },
				{ startIndex: 22, type: 'identifier.sv' },
				{ startIndex: 30, type: '' },
				{ startIndex: 31, type: 'number.sv' },
				{ startIndex: 32, type: '' },
				{ startIndex: 33, type: 'number.sv' },
				{ startIndex: 34, type: '' },
				{ startIndex: 36, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 39, type: '' },
				{ startIndex: 40, type: 'type.sv' },
				{ startIndex: 44, type: '' },
				{ startIndex: 45, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 46, type: '' },
				{ startIndex: 48, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 49, type: 'delimiter.sv' }
			]
		}
	],
	// table
	[
		{
			line: 'table',
			tokens: [{ startIndex: 0, type: 'keyword.table.sv' }]
		},
		{
			line: '  //  clk  d    q    q+',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'comment.sv' }
			]
		},
		{
			line: '  r  ?  0 : ? : - ;',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'variable.predefined.sv' },
				{ startIndex: 3, type: '' },
				{ startIndex: 5, type: 'variable.predefined.sv' },
				{ startIndex: 6, type: '' },
				{ startIndex: 8, type: 'variable.predefined.sv' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'delimiter.sv' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'variable.predefined.sv' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'delimiter.sv' },
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'variable.predefined.sv' },
				{ startIndex: 17, type: '' },
				{ startIndex: 18, type: 'delimiter.sv' }
			]
		},
		{
			line: '  0 x (01) : 0 : 1; // Comment ',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'variable.predefined.sv' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'variable.predefined.sv' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 7, type: 'variable.predefined.sv' },
				{ startIndex: 9, type: 'delimiter.parenthesis.sv' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'delimiter.sv' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'variable.predefined.sv' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'delimiter.sv' },
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'variable.predefined.sv' },
				{ startIndex: 18, type: 'delimiter.sv' },
				{ startIndex: 19, type: '' },
				{ startIndex: 20, type: 'comment.sv' }
			]
		},
		{
			line: '0 0 1 : 0 : 1 ;',
			tokens: [
				{ startIndex: 0, type: 'variable.predefined.sv' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'variable.predefined.sv' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'variable.predefined.sv' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.sv' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'variable.predefined.sv' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'delimiter.sv' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'variable.predefined.sv' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'delimiter.sv' }
			]
		},
		{
			line: 'endtable',
			tokens: [{ startIndex: 0, type: 'keyword.endtable.sv' }]
		}
	]
]);
