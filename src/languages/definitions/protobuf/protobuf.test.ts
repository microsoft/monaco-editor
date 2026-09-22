/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* To generate an initial baseline from a .proto file, uncomment:

import { readFileSync } from 'fs';

const lines = readFileSync('/home/tochi/code/scratches/proto2_advanced.proto', {
	encoding: 'utf-8'
}).split(/\r?\n/);

testTokenization('protobuf', [
	lines.map((line) => ({
		line,
		tokens: []
	}))
]);
*/

import { testTokenization } from '../test/testRunner';

testTokenization('proto', [
	// proto3 example file: https://developers.google.com/protocol-buffers/docs/reference/proto3-spec#proto_file
	[
		{
			line: 'syntax = "proto3";',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 6, type: 'white.proto' },
				{ startIndex: 7, type: 'operators.proto' },
				{ startIndex: 8, type: 'white.proto' },
				{ startIndex: 9, type: 'string.quote.proto' },
				{ startIndex: 10, type: 'string.proto' },
				{ startIndex: 16, type: 'string.quote.proto' },
				{ startIndex: 17, type: 'delimiter.proto' }
			]
		},
		{
			line: 'import public "other.proto";',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 6, type: 'white.proto' },
				{ startIndex: 7, type: 'keyword.proto' },
				{ startIndex: 13, type: 'white.proto' },
				{ startIndex: 14, type: 'string.quote.proto' },
				{ startIndex: 15, type: 'string.proto' },
				{ startIndex: 26, type: 'string.quote.proto' },
				{ startIndex: 27, type: 'delimiter.proto' }
			]
		},
		{
			line: 'option java_package = "com.example.foo";',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 6, type: 'white.proto' },
				{ startIndex: 7, type: 'annotation.proto' },
				{ startIndex: 19, type: 'white.proto' },
				{ startIndex: 20, type: 'operator.proto' },
				{ startIndex: 21, type: 'white.proto' },
				{ startIndex: 22, type: 'string.quote.proto' },
				{ startIndex: 23, type: 'string.proto' },
				{ startIndex: 38, type: 'string.quote.proto' },
				{ startIndex: 39, type: 'delimiter.proto' }
			]
		},
		{
			line: 'enum EnumAllowingAlias {',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 4, type: 'white.proto' },
				{ startIndex: 5, type: 'type.identifier.proto' },
				{ startIndex: 22, type: 'white.proto' },
				{ startIndex: 23, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '  option allow_alias = true;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 8, type: 'white.proto' },
				{ startIndex: 9, type: 'annotation.proto' },
				{ startIndex: 20, type: 'white.proto' },
				{ startIndex: 21, type: 'operator.proto' },
				{ startIndex: 22, type: 'white.proto' },
				{ startIndex: 23, type: 'keyword.constant.proto' },
				{ startIndex: 27, type: 'delimiter.proto' }
			]
		},
		{
			line: '  UNKNOWN = 0;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'identifier.proto' },
				{ startIndex: 9, type: 'white.proto' },
				{ startIndex: 10, type: 'operators.proto' },
				{ startIndex: 11, type: 'white.proto' },
				{ startIndex: 12, type: 'number.octal.proto' },
				{ startIndex: 13, type: 'delimiter.proto' }
			]
		},
		{
			line: '  STARTED = 1;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'identifier.proto' },
				{ startIndex: 9, type: 'white.proto' },
				{ startIndex: 10, type: 'operators.proto' },
				{ startIndex: 11, type: 'white.proto' },
				{ startIndex: 12, type: 'number.proto' },
				{ startIndex: 13, type: 'delimiter.proto' }
			]
		},
		{
			line: '  RUNNING = 2 [(custom_option) = "hello world"];',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'identifier.proto' },
				{ startIndex: 9, type: 'white.proto' },
				{ startIndex: 10, type: 'operators.proto' },
				{ startIndex: 11, type: 'white.proto' },
				{ startIndex: 12, type: 'number.proto' },
				{ startIndex: 13, type: 'white.proto' },
				{ startIndex: 14, type: 'delimiter.square.proto' },
				{ startIndex: 15, type: 'annotation.proto' },
				{ startIndex: 30, type: 'white.proto' },
				{ startIndex: 31, type: 'operator.proto' },
				{ startIndex: 32, type: 'white.proto' },
				{ startIndex: 33, type: 'string.quote.proto' },
				{ startIndex: 34, type: 'string.proto' },
				{ startIndex: 45, type: 'string.quote.proto' },
				{ startIndex: 46, type: 'delimiter.square.proto' },
				{ startIndex: 47, type: 'delimiter.proto' }
			]
		},
		{ line: '}', tokens: [{ startIndex: 0, type: 'delimiter.curly.proto' }] },
		{
			line: 'message Outer {',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 7, type: 'white.proto' },
				{ startIndex: 8, type: 'type.identifier.proto' },
				{ startIndex: 13, type: 'white.proto' },
				{ startIndex: 14, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '  option (my_option).a = true;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 8, type: 'white.proto' },
				{ startIndex: 9, type: 'annotation.proto' },
				{ startIndex: 22, type: 'white.proto' },
				{ startIndex: 23, type: 'operator.proto' },
				{ startIndex: 24, type: 'white.proto' },
				{ startIndex: 25, type: 'keyword.constant.proto' },
				{ startIndex: 29, type: 'delimiter.proto' }
			]
		},
		{
			line: '  message Inner {   // Level 2',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 9, type: 'white.proto' },
				{ startIndex: 10, type: 'type.identifier.proto' },
				{ startIndex: 15, type: 'white.proto' },
				{ startIndex: 16, type: 'delimiter.curly.proto' },
				{ startIndex: 17, type: 'white.proto' },
				{ startIndex: 20, type: 'comment.proto' }
			]
		},
		{
			line: '    int64 ival = 1;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 4, type: 'keyword.proto' },
				{ startIndex: 9, type: 'white.proto' },
				{ startIndex: 10, type: 'identifier.proto' },
				{ startIndex: 14, type: 'white.proto' },
				{ startIndex: 15, type: 'delimiter.proto' },
				{ startIndex: 16, type: 'white.proto' },
				{ startIndex: 17, type: 'number.proto' },
				{ startIndex: 18, type: 'delimiter.proto' }
			]
		},
		{
			line: '  }',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '  repeated Inner inner_message = 2;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'type.identifier.proto' },
				{ startIndex: 16, type: 'white.proto' },
				{ startIndex: 17, type: 'identifier.proto' },
				{ startIndex: 30, type: 'white.proto' },
				{ startIndex: 31, type: 'delimiter.proto' },
				{ startIndex: 32, type: 'white.proto' },
				{ startIndex: 33, type: 'number.proto' },
				{ startIndex: 34, type: 'delimiter.proto' }
			]
		},
		{
			line: '  EnumAllowingAlias enum_field =3;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'type.identifier.proto' },
				{ startIndex: 19, type: 'white.proto' },
				{ startIndex: 20, type: 'identifier.proto' },
				{ startIndex: 30, type: 'white.proto' },
				{ startIndex: 31, type: 'delimiter.proto' },
				{ startIndex: 32, type: 'number.proto' },
				{ startIndex: 33, type: 'delimiter.proto' }
			]
		},
		{
			line: '  map<int32, string> my_map = 4;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 5, type: 'delimiter.angle.proto' },
				{ startIndex: 6, type: 'keyword.proto' },
				{ startIndex: 11, type: 'delimiter.proto' },
				{ startIndex: 12, type: 'white.proto' },
				{ startIndex: 13, type: 'keyword.proto' },
				{ startIndex: 19, type: 'delimiter.angle.proto' },
				{ startIndex: 20, type: 'white.proto' },
				{ startIndex: 21, type: 'identifier.proto' },
				{ startIndex: 27, type: 'white.proto' },
				{ startIndex: 28, type: 'operators.proto' },
				{ startIndex: 29, type: 'white.proto' },
				{ startIndex: 30, type: 'number.proto' },
				{ startIndex: 31, type: 'delimiter.proto' }
			]
		},
		{ line: '}', tokens: [{ startIndex: 0, type: 'delimiter.curly.proto' }] }
	],
	// proto2 example file: https://developers.google.com/protocol-buffers/docs/reference/proto2-spec#proto_file
	[
		{
			line: 'syntax = "proto2";',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 6, type: 'white.proto' },
				{ startIndex: 7, type: 'operators.proto' },
				{ startIndex: 8, type: 'white.proto' },
				{ startIndex: 9, type: 'string.quote.proto' },
				{ startIndex: 10, type: 'string.proto' },
				{ startIndex: 16, type: 'string.quote.proto' },
				{ startIndex: 17, type: 'delimiter.proto' }
			]
		},
		{
			line: 'import public "other.proto";',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 6, type: 'white.proto' },
				{ startIndex: 7, type: 'keyword.proto' },
				{ startIndex: 13, type: 'white.proto' },
				{ startIndex: 14, type: 'string.quote.proto' },
				{ startIndex: 15, type: 'string.proto' },
				{ startIndex: 26, type: 'string.quote.proto' },
				{ startIndex: 27, type: 'delimiter.proto' }
			]
		},
		{
			line: 'option java_package = "com.example.foo";',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 6, type: 'white.proto' },
				{ startIndex: 7, type: 'annotation.proto' },
				{ startIndex: 19, type: 'white.proto' },
				{ startIndex: 20, type: 'operator.proto' },
				{ startIndex: 21, type: 'white.proto' },
				{ startIndex: 22, type: 'string.quote.proto' },
				{ startIndex: 23, type: 'string.proto' },
				{ startIndex: 38, type: 'string.quote.proto' },
				{ startIndex: 39, type: 'delimiter.proto' }
			]
		},
		{
			line: 'enum EnumAllowingAlias {',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 4, type: 'white.proto' },
				{ startIndex: 5, type: 'type.identifier.proto' },
				{ startIndex: 22, type: 'white.proto' },
				{ startIndex: 23, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '  option allow_alias = true;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 8, type: 'white.proto' },
				{ startIndex: 9, type: 'annotation.proto' },
				{ startIndex: 20, type: 'white.proto' },
				{ startIndex: 21, type: 'operator.proto' },
				{ startIndex: 22, type: 'white.proto' },
				{ startIndex: 23, type: 'keyword.constant.proto' },
				{ startIndex: 27, type: 'delimiter.proto' }
			]
		},
		{
			line: '  UNKNOWN = 0;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'identifier.proto' },
				{ startIndex: 9, type: 'white.proto' },
				{ startIndex: 10, type: 'operators.proto' },
				{ startIndex: 11, type: 'white.proto' },
				{ startIndex: 12, type: 'number.octal.proto' },
				{ startIndex: 13, type: 'delimiter.proto' }
			]
		},
		{
			line: '  STARTED = 1;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'identifier.proto' },
				{ startIndex: 9, type: 'white.proto' },
				{ startIndex: 10, type: 'operators.proto' },
				{ startIndex: 11, type: 'white.proto' },
				{ startIndex: 12, type: 'number.proto' },
				{ startIndex: 13, type: 'delimiter.proto' }
			]
		},
		{
			line: '  RUNNING = 2 [(custom_option) = "hello world"];',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'identifier.proto' },
				{ startIndex: 9, type: 'white.proto' },
				{ startIndex: 10, type: 'operators.proto' },
				{ startIndex: 11, type: 'white.proto' },
				{ startIndex: 12, type: 'number.proto' },
				{ startIndex: 13, type: 'white.proto' },
				{ startIndex: 14, type: 'delimiter.square.proto' },
				{ startIndex: 15, type: 'annotation.proto' },
				{ startIndex: 30, type: 'white.proto' },
				{ startIndex: 31, type: 'operator.proto' },
				{ startIndex: 32, type: 'white.proto' },
				{ startIndex: 33, type: 'string.quote.proto' },
				{ startIndex: 34, type: 'string.proto' },
				{ startIndex: 45, type: 'string.quote.proto' },
				{ startIndex: 46, type: 'delimiter.square.proto' },
				{ startIndex: 47, type: 'delimiter.proto' }
			]
		},
		{ line: '}', tokens: [{ startIndex: 0, type: 'delimiter.curly.proto' }] },
		{
			line: 'message Outer {',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 7, type: 'white.proto' },
				{ startIndex: 8, type: 'type.identifier.proto' },
				{ startIndex: 13, type: 'white.proto' },
				{ startIndex: 14, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '  option (my_option).a = true;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 8, type: 'white.proto' },
				{ startIndex: 9, type: 'annotation.proto' },
				{ startIndex: 22, type: 'white.proto' },
				{ startIndex: 23, type: 'operator.proto' },
				{ startIndex: 24, type: 'white.proto' },
				{ startIndex: 25, type: 'keyword.constant.proto' },
				{ startIndex: 29, type: 'delimiter.proto' }
			]
		},
		{
			line: '  message Inner {   // Level 2',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 9, type: 'white.proto' },
				{ startIndex: 10, type: 'type.identifier.proto' },
				{ startIndex: 15, type: 'white.proto' },
				{ startIndex: 16, type: 'delimiter.curly.proto' },
				{ startIndex: 17, type: 'white.proto' },
				{ startIndex: 20, type: 'comment.proto' }
			]
		},
		{
			line: '    required int64 ival = 1;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 4, type: 'keyword.proto' },
				{ startIndex: 12, type: 'white.proto' },
				{ startIndex: 13, type: 'keyword.proto' },
				{ startIndex: 18, type: 'white.proto' },
				{ startIndex: 19, type: 'identifier.proto' },
				{ startIndex: 23, type: 'white.proto' },
				{ startIndex: 24, type: 'delimiter.proto' },
				{ startIndex: 25, type: 'white.proto' },
				{ startIndex: 26, type: 'number.proto' },
				{ startIndex: 27, type: 'delimiter.proto' }
			]
		},
		{
			line: '  }',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '  repeated Inner inner_message = 2;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'type.identifier.proto' },
				{ startIndex: 16, type: 'white.proto' },
				{ startIndex: 17, type: 'identifier.proto' },
				{ startIndex: 30, type: 'white.proto' },
				{ startIndex: 31, type: 'delimiter.proto' },
				{ startIndex: 32, type: 'white.proto' },
				{ startIndex: 33, type: 'number.proto' },
				{ startIndex: 34, type: 'delimiter.proto' }
			]
		},
		{
			line: '  optional EnumAllowingAlias enum_field = 3;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'type.identifier.proto' },
				{ startIndex: 28, type: 'white.proto' },
				{ startIndex: 29, type: 'identifier.proto' },
				{ startIndex: 39, type: 'white.proto' },
				{ startIndex: 40, type: 'delimiter.proto' },
				{ startIndex: 41, type: 'white.proto' },
				{ startIndex: 42, type: 'number.proto' },
				{ startIndex: 43, type: 'delimiter.proto' }
			]
		},
		{
			line: '  map<int32, string> my_map = 4;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 5, type: 'delimiter.angle.proto' },
				{ startIndex: 6, type: 'keyword.proto' },
				{ startIndex: 11, type: 'delimiter.proto' },
				{ startIndex: 12, type: 'white.proto' },
				{ startIndex: 13, type: 'keyword.proto' },
				{ startIndex: 19, type: 'delimiter.angle.proto' },
				{ startIndex: 20, type: 'white.proto' },
				{ startIndex: 21, type: 'identifier.proto' },
				{ startIndex: 27, type: 'white.proto' },
				{ startIndex: 28, type: 'operators.proto' },
				{ startIndex: 29, type: 'white.proto' },
				{ startIndex: 30, type: 'number.proto' },
				{ startIndex: 31, type: 'delimiter.proto' }
			]
		},
		{
			line: '  extensions 20 to 30;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 12, type: 'white.proto' },
				{ startIndex: 13, type: 'number.proto' },
				{ startIndex: 15, type: 'white.proto' },
				{ startIndex: 16, type: 'keyword.proto' },
				{ startIndex: 18, type: 'white.proto' },
				{ startIndex: 19, type: 'number.proto' },
				{ startIndex: 21, type: 'delimiter.proto' }
			]
		},
		{ line: '}', tokens: [{ startIndex: 0, type: 'delimiter.curly.proto' }] },
		{
			line: 'message Foo {',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 7, type: 'white.proto' },
				{ startIndex: 8, type: 'type.identifier.proto' },
				{ startIndex: 11, type: 'white.proto' },
				{ startIndex: 12, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '  optional group GroupMessage {',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'keyword.proto' },
				{ startIndex: 16, type: 'white.proto' },
				{ startIndex: 17, type: 'identifier.proto' },
				{ startIndex: 29, type: 'white.proto' },
				{ startIndex: 30, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '    optional a = 1;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 4, type: 'keyword.proto' },
				{ startIndex: 12, type: 'white.proto' },
				{ startIndex: 13, type: 'identifier.proto' },
				{ startIndex: 14, type: 'white.proto' },
				{ startIndex: 15, type: 'delimiter.proto' },
				{ startIndex: 16, type: 'white.proto' },
				{ startIndex: 17, type: 'number.proto' },
				{ startIndex: 18, type: 'delimiter.proto' }
			]
		},
		{
			line: '  }',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'delimiter.curly.proto' }
			]
		},
		{ line: '}', tokens: [{ startIndex: 0, type: 'delimiter.curly.proto' }] }
	],
	// proto3 edge cases
	[
		{
			line: 'syntax = "proto3";',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 6, type: 'white.proto' },
				{ startIndex: 7, type: 'operators.proto' },
				{ startIndex: 8, type: 'white.proto' },
				{ startIndex: 9, type: 'string.quote.proto' },
				{ startIndex: 10, type: 'string.proto' },
				{ startIndex: 16, type: 'string.quote.proto' },
				{ startIndex: 17, type: 'delimiter.proto' }
			]
		},
		{ line: '', tokens: [] },
		{
			line: 'package foo . /**/  bar;',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 7, type: 'white.proto' },
				{ startIndex: 8, type: 'identifier.proto' },
				{ startIndex: 11, type: 'white.proto' },
				{ startIndex: 12, type: 'delimiter.proto' },
				{ startIndex: 13, type: 'white.proto' },
				{ startIndex: 14, type: 'comment.proto' },
				{ startIndex: 18, type: 'white.proto' },
				{ startIndex: 20, type: 'identifier.proto' },
				{ startIndex: 23, type: 'delimiter.proto' }
			]
		},
		{ line: '', tokens: [] },
		{
			line: 'import public "options.proto";',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 6, type: 'white.proto' },
				{ startIndex: 7, type: 'keyword.proto' },
				{ startIndex: 13, type: 'white.proto' },
				{ startIndex: 14, type: 'string.quote.proto' },
				{ startIndex: 15, type: 'string.proto' },
				{ startIndex: 28, type: 'string.quote.proto' },
				{ startIndex: 29, type: 'delimiter.proto' }
			]
		},
		{ line: '', tokens: [] },
		{
			line: 'option java_package = "com.example.foo";',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 6, type: 'white.proto' },
				{ startIndex: 7, type: 'annotation.proto' },
				{ startIndex: 19, type: 'white.proto' },
				{ startIndex: 20, type: 'operator.proto' },
				{ startIndex: 21, type: 'white.proto' },
				{ startIndex: 22, type: 'string.quote.proto' },
				{ startIndex: 23, type: 'string.proto' },
				{ startIndex: 38, type: 'string.quote.proto' },
				{ startIndex: 39, type: 'delimiter.proto' }
			]
		},
		{ line: '', tokens: [] },
		{
			line: 'message Foo {',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 7, type: 'white.proto' },
				{ startIndex: 8, type: 'type.identifier.proto' },
				{ startIndex: 11, type: 'white.proto' },
				{ startIndex: 12, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '  foo.bar.Bar nested_message = 2;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'type.identifier.proto' },
				{ startIndex: 13, type: 'white.proto' },
				{ startIndex: 14, type: 'identifier.proto' },
				{ startIndex: 28, type: 'white.proto' },
				{ startIndex: 29, type: 'delimiter.proto' },
				{ startIndex: 30, type: 'white.proto' },
				{ startIndex: 31, type: 'number.proto' },
				{ startIndex: 32, type: 'delimiter.proto' }
			]
		},
		{
			line: '  repeated int32 samples = 3 [packed=true];',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'keyword.proto' },
				{ startIndex: 16, type: 'white.proto' },
				{ startIndex: 17, type: 'identifier.proto' },
				{ startIndex: 24, type: 'white.proto' },
				{ startIndex: 25, type: 'delimiter.proto' },
				{ startIndex: 26, type: 'white.proto' },
				{ startIndex: 27, type: 'number.proto' },
				{ startIndex: 28, type: 'white.proto' },
				{ startIndex: 29, type: 'delimiter.square.proto' },
				{ startIndex: 30, type: 'annotation.proto' },
				{ startIndex: 36, type: 'operator.proto' },
				{ startIndex: 37, type: 'keyword.constant.proto' },
				{ startIndex: 41, type: 'delimiter.square.proto' },
				{ startIndex: 42, type: 'delimiter.proto' }
			]
		},
		{
			line: '  oneof foo {',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 7, type: 'white.proto' },
				{ startIndex: 8, type: 'identifier.proto' },
				{ startIndex: 11, type: 'white.proto' },
				{ startIndex: 12, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '    string name = 4;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 4, type: 'keyword.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'identifier.proto' },
				{ startIndex: 15, type: 'white.proto' },
				{ startIndex: 16, type: 'delimiter.proto' },
				{ startIndex: 17, type: 'white.proto' },
				{ startIndex: 18, type: 'number.proto' },
				{ startIndex: 19, type: 'delimiter.proto' }
			]
		},
		{
			line: '    Bar sub_message = 92;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 4, type: 'type.identifier.proto' },
				{ startIndex: 7, type: 'white.proto' },
				{ startIndex: 8, type: 'identifier.proto' },
				{ startIndex: 19, type: 'white.proto' },
				{ startIndex: 20, type: 'delimiter.proto' },
				{ startIndex: 21, type: 'white.proto' },
				{ startIndex: 22, type: 'number.proto' },
				{ startIndex: 24, type: 'delimiter.proto' }
			]
		},
		{
			line: '  }',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '  reserved 5, 15, 203 to 30;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'number.proto' },
				{ startIndex: 12, type: 'delimiter.proto' },
				{ startIndex: 13, type: 'white.proto' },
				{ startIndex: 14, type: 'number.proto' },
				{ startIndex: 16, type: 'delimiter.proto' },
				{ startIndex: 17, type: 'white.proto' },
				{ startIndex: 18, type: 'number.proto' },
				{ startIndex: 21, type: 'white.proto' },
				{ startIndex: 22, type: 'keyword.proto' },
				{ startIndex: 24, type: 'white.proto' },
				{ startIndex: 25, type: 'number.proto' },
				{ startIndex: 27, type: 'delimiter.proto' }
			]
		},
		{
			line: '  reserved "$46_ _$%$%\\"bar" "baz";',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'string.quote.proto' },
				{ startIndex: 12, type: 'string.proto' },
				{ startIndex: 22, type: 'string.escape.invalid.proto' },
				{ startIndex: 24, type: 'string.proto' },
				{ startIndex: 27, type: 'string.quote.proto' },
				{ startIndex: 28, type: 'white.proto' },
				{ startIndex: 29, type: 'string.quote.proto' },
				{ startIndex: 30, type: 'string.proto' },
				{ startIndex: 33, type: 'string.quote.proto' },
				{ startIndex: 34, type: 'delimiter.proto' }
			]
		},
		{
			line: '  reserved 100 to max ;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'number.proto' },
				{ startIndex: 14, type: 'white.proto' },
				{ startIndex: 15, type: 'keyword.proto' },
				{ startIndex: 17, type: 'white.proto' },
				{ startIndex: 18, type: 'keyword.proto' },
				{ startIndex: 21, type: 'white.proto' },
				{ startIndex: 22, type: 'delimiter.proto' }
			]
		},
		{
			line: '  string baz = 10;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 8, type: 'white.proto' },
				{ startIndex: 9, type: 'identifier.proto' },
				{ startIndex: 12, type: 'white.proto' },
				{ startIndex: 13, type: 'delimiter.proto' },
				{ startIndex: 14, type: 'white.proto' },
				{ startIndex: 15, type: 'number.proto' },
				{ startIndex: 17, type: 'delimiter.proto' }
			]
		},
		{ line: '}', tokens: [{ startIndex: 0, type: 'delimiter.curly.proto' }] },
		{ line: '', tokens: [] },
		{ line: 'message', tokens: [{ startIndex: 0, type: 'keyword.proto' }] },
		{
			line: 'map {}',
			tokens: [
				{ startIndex: 0, type: 'type.identifier.proto' },
				{ startIndex: 3, type: 'white.proto' },
				{ startIndex: 4, type: 'delimiter.curly.proto' }
			]
		},
		{ line: '', tokens: [] },
		{
			line: 'message Bar {',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 7, type: 'white.proto' },
				{ startIndex: 8, type: 'type.identifier.proto' },
				{ startIndex: 11, type: 'white.proto' },
				{ startIndex: 12, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '  int32 x = 1;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 7, type: 'white.proto' },
				{ startIndex: 8, type: 'identifier.proto' },
				{ startIndex: 9, type: 'white.proto' },
				{ startIndex: 10, type: 'delimiter.proto' },
				{ startIndex: 11, type: 'white.proto' },
				{ startIndex: 12, type: 'number.proto' },
				{ startIndex: 13, type: 'delimiter.proto' }
			]
		},
		{ line: '}', tokens: [{ startIndex: 0, type: 'delimiter.curly.proto' }] },
		{ line: '', tokens: [] },
		{
			line: 'message int32 {}',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 7, type: 'white.proto' },
				{ startIndex: 8, type: 'type.identifier.proto' },
				{ startIndex: 13, type: 'white.proto' },
				{ startIndex: 14, type: 'delimiter.curly.proto' }
			]
		},
		{ line: '', tokens: [] },
		{
			line: 'enum EnumAllowingAlias {',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 4, type: 'white.proto' },
				{ startIndex: 5, type: 'type.identifier.proto' },
				{ startIndex: 22, type: 'white.proto' },
				{ startIndex: 23, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '  option allow_alias = true;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 8, type: 'white.proto' },
				{ startIndex: 9, type: 'annotation.proto' },
				{ startIndex: 20, type: 'white.proto' },
				{ startIndex: 21, type: 'operator.proto' },
				{ startIndex: 22, type: 'white.proto' },
				{ startIndex: 23, type: 'keyword.constant.proto' },
				{ startIndex: 27, type: 'delimiter.proto' }
			]
		},
		{
			line: '  uNkNoWN2 = 0;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'identifier.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'operators.proto' },
				{ startIndex: 12, type: 'white.proto' },
				{ startIndex: 13, type: 'number.octal.proto' },
				{ startIndex: 14, type: 'delimiter.proto' }
			]
		},
		{
			line: '  ENUM_ALLOWING_ALIAS_UNKNOWN = 0;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'identifier.proto' },
				{ startIndex: 29, type: 'white.proto' },
				{ startIndex: 30, type: 'operators.proto' },
				{ startIndex: 31, type: 'white.proto' },
				{ startIndex: 32, type: 'number.octal.proto' },
				{ startIndex: 33, type: 'delimiter.proto' }
			]
		},
		{
			line: '  STARTED = 1;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'identifier.proto' },
				{ startIndex: 9, type: 'white.proto' },
				{ startIndex: 10, type: 'operators.proto' },
				{ startIndex: 11, type: 'white.proto' },
				{ startIndex: 12, type: 'number.proto' },
				{ startIndex: 13, type: 'delimiter.proto' }
			]
		},
		{
			line: "  running = 2 [( /***/ custom_option) = 'hello world'];",
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'identifier.proto' },
				{ startIndex: 9, type: 'white.proto' },
				{ startIndex: 10, type: 'operators.proto' },
				{ startIndex: 11, type: 'white.proto' },
				{ startIndex: 12, type: 'number.proto' },
				{ startIndex: 13, type: 'white.proto' },
				{ startIndex: 14, type: 'delimiter.square.proto' },
				{ startIndex: 15, type: 'annotation.brackets.proto' },
				{ startIndex: 16, type: 'white.proto' },
				{ startIndex: 17, type: 'comment.proto' },
				{ startIndex: 22, type: 'white.proto' },
				{ startIndex: 23, type: 'annotation.proto' },
				{ startIndex: 36, type: 'annotation.brackets.proto' },
				{ startIndex: 37, type: 'white.proto' },
				{ startIndex: 38, type: 'operator.proto' },
				{ startIndex: 39, type: 'white.proto' },
				{ startIndex: 40, type: 'string.quote.proto' },
				{ startIndex: 41, type: 'string.proto' },
				{ startIndex: 52, type: 'string.quote.proto' },
				{ startIndex: 53, type: 'delimiter.square.proto' },
				{ startIndex: 54, type: 'delimiter.proto' }
			]
		},
		{ line: '}', tokens: [{ startIndex: 0, type: 'delimiter.curly.proto' }] },
		{ line: '', tokens: [] },
		{
			line: 'message Outer {',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 7, type: 'white.proto' },
				{ startIndex: 8, type: 'type.identifier.proto' },
				{ startIndex: 13, type: 'white.proto' },
				{ startIndex: 14, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '  option (my_option).a= true;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 8, type: 'white.proto' },
				{ startIndex: 9, type: 'annotation.proto' },
				{ startIndex: 22, type: 'operator.proto' },
				{ startIndex: 23, type: 'white.proto' },
				{ startIndex: 24, type: 'keyword.constant.proto' },
				{ startIndex: 28, type: 'delimiter.proto' }
			]
		},
		{
			line: '  message Inner {   // Level 2',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 9, type: 'white.proto' },
				{ startIndex: 10, type: 'type.identifier.proto' },
				{ startIndex: 15, type: 'white.proto' },
				{ startIndex: 16, type: 'delimiter.curly.proto' },
				{ startIndex: 17, type: 'white.proto' },
				{ startIndex: 20, type: 'comment.proto' }
			]
		},
		{
			line: '    int64 ival = 1;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 4, type: 'keyword.proto' },
				{ startIndex: 9, type: 'white.proto' },
				{ startIndex: 10, type: 'identifier.proto' },
				{ startIndex: 14, type: 'white.proto' },
				{ startIndex: 15, type: 'delimiter.proto' },
				{ startIndex: 16, type: 'white.proto' },
				{ startIndex: 17, type: 'number.proto' },
				{ startIndex: 18, type: 'delimiter.proto' }
			]
		},
		{
			line: '  }',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '  repeated Inner inner_message = 2;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'type.identifier.proto' },
				{ startIndex: 16, type: 'white.proto' },
				{ startIndex: 17, type: 'identifier.proto' },
				{ startIndex: 30, type: 'white.proto' },
				{ startIndex: 31, type: 'delimiter.proto' },
				{ startIndex: 32, type: 'white.proto' },
				{ startIndex: 33, type: 'number.proto' },
				{ startIndex: 34, type: 'delimiter.proto' }
			]
		},
		{
			line: '  foo .bar',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'type.identifier.proto' }
			]
		},
		{
			line: '   /**/ .EnumAllowingAlias enum_field =3;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 3, type: 'comment.proto' },
				{ startIndex: 7, type: 'white.proto' },
				{ startIndex: 8, type: 'type.identifier.proto' },
				{ startIndex: 26, type: 'white.proto' },
				{ startIndex: 27, type: 'identifier.proto' },
				{ startIndex: 37, type: 'white.proto' },
				{ startIndex: 38, type: 'delimiter.proto' },
				{ startIndex: 39, type: 'number.proto' },
				{ startIndex: 40, type: 'delimiter.proto' }
			]
		},
		{
			line: '  map my_map = 4;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'type.identifier.proto' },
				{ startIndex: 5, type: 'white.proto' },
				{ startIndex: 6, type: 'identifier.proto' },
				{ startIndex: 12, type: 'white.proto' },
				{ startIndex: 13, type: 'delimiter.proto' },
				{ startIndex: 14, type: 'white.proto' },
				{ startIndex: 15, type: 'number.proto' },
				{ startIndex: 16, type: 'delimiter.proto' }
			]
		},
		{ line: '}', tokens: [{ startIndex: 0, type: 'delimiter.curly.proto' }] },
		{ line: '', tokens: [] },
		{
			line: 'message message {',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 7, type: 'white.proto' },
				{ startIndex: 8, type: 'type.identifier.proto' },
				{ startIndex: 15, type: 'white.proto' },
				{ startIndex: 16, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '  repeated Foo enum = 1;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'type.identifier.proto' },
				{ startIndex: 14, type: 'white.proto' },
				{ startIndex: 15, type: 'identifier.proto' },
				{ startIndex: 19, type: 'white.proto' },
				{ startIndex: 20, type: 'delimiter.proto' },
				{ startIndex: 21, type: 'white.proto' },
				{ startIndex: 22, type: 'number.proto' },
				{ startIndex: 23, type: 'delimiter.proto' }
			]
		},
		{
			line: '  Foo int32 = 2;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'type.identifier.proto' },
				{ startIndex: 5, type: 'white.proto' },
				{ startIndex: 6, type: 'identifier.proto' },
				{ startIndex: 11, type: 'white.proto' },
				{ startIndex: 12, type: 'delimiter.proto' },
				{ startIndex: 13, type: 'white.proto' },
				{ startIndex: 14, type: 'number.proto' },
				{ startIndex: 15, type: 'delimiter.proto' }
			]
		},
		{
			line: '  service x = 3;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'type.identifier.proto' },
				{ startIndex: 9, type: 'white.proto' },
				{ startIndex: 10, type: 'identifier.proto' },
				{ startIndex: 11, type: 'white.proto' },
				{ startIndex: 12, type: 'delimiter.proto' },
				{ startIndex: 13, type: 'white.proto' },
				{ startIndex: 14, type: 'number.proto' },
				{ startIndex: 15, type: 'delimiter.proto' }
			]
		},
		{ line: '}', tokens: [{ startIndex: 0, type: 'delimiter.curly.proto' }] },
		{ line: '', tokens: [] },
		{
			line: 'message service {}',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 7, type: 'white.proto' },
				{ startIndex: 8, type: 'type.identifier.proto' },
				{ startIndex: 15, type: 'white.proto' },
				{ startIndex: 16, type: 'delimiter.curly.proto' }
			]
		},
		{ line: '', tokens: [] },
		{
			line: '/** SearchService does nothing and returns the string "foo"',
			tokens: [{ startIndex: 0, type: 'comment.proto' }]
		},
		{ line: '*/', tokens: [{ startIndex: 0, type: 'comment.proto' }] },
		{
			line: 'service SearchService {',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 7, type: 'white.proto' },
				{ startIndex: 8, type: 'identifier.proto' },
				{ startIndex: 21, type: 'white.proto' },
				{ startIndex: 22, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '  rpc Search (stream SearchRequest) returns (SearchResponse) {',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 5, type: 'white.proto' },
				{ startIndex: 6, type: 'identifier.proto' },
				{ startIndex: 12, type: 'white.proto' },
				{ startIndex: 13, type: 'delimiter.parenthesis.proto' },
				{ startIndex: 14, type: 'keyword.proto' },
				{ startIndex: 20, type: 'white.proto' },
				{ startIndex: 21, type: 'type.identifier.proto' },
				{ startIndex: 34, type: 'delimiter.parenthesis.proto' },
				{ startIndex: 35, type: 'white.proto' },
				{ startIndex: 36, type: 'keyword.proto' },
				{ startIndex: 43, type: 'white.proto' },
				{ startIndex: 44, type: 'delimiter.parenthesis.proto' },
				{ startIndex: 45, type: 'type.identifier.proto' },
				{ startIndex: 59, type: 'delimiter.parenthesis.proto' },
				{ startIndex: 60, type: 'white.proto' },
				{ startIndex: 61, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '    option (method_option) = {',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 4, type: 'keyword.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'annotation.proto' },
				{ startIndex: 26, type: 'white.proto' },
				{ startIndex: 27, type: 'operator.proto' },
				{ startIndex: 28, type: 'white.proto' },
				{ startIndex: 29, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '      method_id: 2;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 6, type: 'identifier.proto' },
				{ startIndex: 15, type: 'delimiter.proto' },
				{ startIndex: 16, type: 'white.proto' },
				{ startIndex: 17, type: 'number.proto' },
				{ startIndex: 18, type: 'delimiter.proto' }
			]
		},
		{
			line: '      method_name: "hello";',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 6, type: 'identifier.proto' },
				{ startIndex: 17, type: 'delimiter.proto' },
				{ startIndex: 18, type: 'white.proto' },
				{ startIndex: 19, type: 'string.quote.proto' },
				{ startIndex: 20, type: 'string.proto' },
				{ startIndex: 25, type: 'string.quote.proto' },
				{ startIndex: 26, type: 'delimiter.proto' }
			]
		},
		{
			line: '      method_sla: 9.807E+4;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 6, type: 'identifier.proto' },
				{ startIndex: 16, type: 'delimiter.proto' },
				{ startIndex: 17, type: 'white.proto' },
				{ startIndex: 18, type: 'number.proto' },
				{ startIndex: 19, type: 'number.float.proto' },
				{ startIndex: 26, type: 'delimiter.proto' }
			]
		},
		{
			line: '    };',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 4, type: 'delimiter.curly.proto' },
				{ startIndex: 5, type: 'delimiter.proto' }
			]
		},
		{
			line: '  };',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'delimiter.curly.proto' },
				{ startIndex: 3, type: 'delimiter.proto' }
			]
		},
		{ line: '}', tokens: [{ startIndex: 0, type: 'delimiter.curly.proto' }] },
		{ line: '', tokens: [] },
		{
			line: 'message SearchRequest {};',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 7, type: 'white.proto' },
				{ startIndex: 8, type: 'type.identifier.proto' },
				{ startIndex: 21, type: 'white.proto' },
				{ startIndex: 22, type: 'delimiter.curly.proto' },
				{ startIndex: 24, type: 'delimiter.proto' }
			]
		},
		{
			line: 'message SearchResponse {',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 7, type: 'white.proto' },
				{ startIndex: 8, type: 'type.identifier.proto' },
				{ startIndex: 22, type: 'white.proto' },
				{ startIndex: 23, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '  string response = 1;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 8, type: 'white.proto' },
				{ startIndex: 9, type: 'identifier.proto' },
				{ startIndex: 17, type: 'white.proto' },
				{ startIndex: 18, type: 'delimiter.proto' },
				{ startIndex: 19, type: 'white.proto' },
				{ startIndex: 20, type: 'number.proto' },
				{ startIndex: 21, type: 'delimiter.proto' }
			]
		},
		{
			line: '};',
			tokens: [
				{ startIndex: 0, type: 'delimiter.curly.proto' },
				{ startIndex: 1, type: 'delimiter.proto' }
			]
		}
	],
	// proto2 edge cases
	[
		{
			line: 'syntax = "proto2";',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 6, type: 'white.proto' },
				{ startIndex: 7, type: 'operators.proto' },
				{ startIndex: 8, type: 'white.proto' },
				{ startIndex: 9, type: 'string.quote.proto' },
				{ startIndex: 10, type: 'string.proto' },
				{ startIndex: 16, type: 'string.quote.proto' },
				{ startIndex: 17, type: 'delimiter.proto' }
			]
		},
		{ line: '', tokens: [] },
		{
			line: 'package foo . /**/  bar;',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 7, type: 'white.proto' },
				{ startIndex: 8, type: 'identifier.proto' },
				{ startIndex: 11, type: 'white.proto' },
				{ startIndex: 12, type: 'delimiter.proto' },
				{ startIndex: 13, type: 'white.proto' },
				{ startIndex: 14, type: 'comment.proto' },
				{ startIndex: 18, type: 'white.proto' },
				{ startIndex: 20, type: 'identifier.proto' },
				{ startIndex: 23, type: 'delimiter.proto' }
			]
		},
		{ line: '', tokens: [] },
		{
			line: 'import public "options.proto";',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 6, type: 'white.proto' },
				{ startIndex: 7, type: 'keyword.proto' },
				{ startIndex: 13, type: 'white.proto' },
				{ startIndex: 14, type: 'string.quote.proto' },
				{ startIndex: 15, type: 'string.proto' },
				{ startIndex: 28, type: 'string.quote.proto' },
				{ startIndex: 29, type: 'delimiter.proto' }
			]
		},
		{ line: '', tokens: [] },
		{
			line: 'option java_package = "com.example.foo";',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 6, type: 'white.proto' },
				{ startIndex: 7, type: 'annotation.proto' },
				{ startIndex: 19, type: 'white.proto' },
				{ startIndex: 20, type: 'operator.proto' },
				{ startIndex: 21, type: 'white.proto' },
				{ startIndex: 22, type: 'string.quote.proto' },
				{ startIndex: 23, type: 'string.proto' },
				{ startIndex: 38, type: 'string.quote.proto' },
				{ startIndex: 39, type: 'delimiter.proto' }
			]
		},
		{ line: '', tokens: [] },
		{
			line: 'message Foo {',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 7, type: 'white.proto' },
				{ startIndex: 8, type: 'type.identifier.proto' },
				{ startIndex: 11, type: 'white.proto' },
				{ startIndex: 12, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '  required foo.bar.Bar nested_message = 2;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'type.identifier.proto' },
				{ startIndex: 22, type: 'white.proto' },
				{ startIndex: 23, type: 'identifier.proto' },
				{ startIndex: 37, type: 'white.proto' },
				{ startIndex: 38, type: 'delimiter.proto' },
				{ startIndex: 39, type: 'white.proto' },
				{ startIndex: 40, type: 'number.proto' },
				{ startIndex: 41, type: 'delimiter.proto' }
			]
		},
		{
			line: '  repeated int32 samples = 3 [packed=true];',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'keyword.proto' },
				{ startIndex: 16, type: 'white.proto' },
				{ startIndex: 17, type: 'identifier.proto' },
				{ startIndex: 24, type: 'white.proto' },
				{ startIndex: 25, type: 'delimiter.proto' },
				{ startIndex: 26, type: 'white.proto' },
				{ startIndex: 27, type: 'number.proto' },
				{ startIndex: 28, type: 'white.proto' },
				{ startIndex: 29, type: 'delimiter.square.proto' },
				{ startIndex: 30, type: 'annotation.proto' },
				{ startIndex: 36, type: 'operator.proto' },
				{ startIndex: 37, type: 'keyword.constant.proto' },
				{ startIndex: 41, type: 'delimiter.square.proto' },
				{ startIndex: 42, type: 'delimiter.proto' }
			]
		},
		{
			line: '  oneof foo {',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 7, type: 'white.proto' },
				{ startIndex: 8, type: 'identifier.proto' },
				{ startIndex: 11, type: 'white.proto' },
				{ startIndex: 12, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '    string name = 4;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 4, type: 'keyword.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'identifier.proto' },
				{ startIndex: 15, type: 'white.proto' },
				{ startIndex: 16, type: 'delimiter.proto' },
				{ startIndex: 17, type: 'white.proto' },
				{ startIndex: 18, type: 'number.proto' },
				{ startIndex: 19, type: 'delimiter.proto' }
			]
		},
		{
			line: '    Bar sub_message = 6;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 4, type: 'type.identifier.proto' },
				{ startIndex: 7, type: 'white.proto' },
				{ startIndex: 8, type: 'identifier.proto' },
				{ startIndex: 19, type: 'white.proto' },
				{ startIndex: 20, type: 'delimiter.proto' },
				{ startIndex: 21, type: 'white.proto' },
				{ startIndex: 22, type: 'number.proto' },
				{ startIndex: 23, type: 'delimiter.proto' }
			]
		},
		{
			line: '  }',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '  reserved 5, 15, 20 to 30;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'number.proto' },
				{ startIndex: 12, type: 'delimiter.proto' },
				{ startIndex: 13, type: 'white.proto' },
				{ startIndex: 14, type: 'number.proto' },
				{ startIndex: 16, type: 'delimiter.proto' },
				{ startIndex: 17, type: 'white.proto' },
				{ startIndex: 18, type: 'number.proto' },
				{ startIndex: 20, type: 'white.proto' },
				{ startIndex: 21, type: 'keyword.proto' },
				{ startIndex: 23, type: 'white.proto' },
				{ startIndex: 24, type: 'number.proto' },
				{ startIndex: 26, type: 'delimiter.proto' }
			]
		},
		{
			line: '  reserved \'bar\' "baz";',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'string.quote.proto' },
				{ startIndex: 12, type: 'string.proto' },
				{ startIndex: 15, type: 'string.quote.proto' },
				{ startIndex: 16, type: 'white.proto' },
				{ startIndex: 17, type: 'string.quote.proto' },
				{ startIndex: 18, type: 'string.proto' },
				{ startIndex: 21, type: 'string.quote.proto' },
				{ startIndex: 22, type: 'delimiter.proto' }
			]
		},
		{
			line: '  extensions 50 to 99;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 12, type: 'white.proto' },
				{ startIndex: 13, type: 'number.proto' },
				{ startIndex: 15, type: 'white.proto' },
				{ startIndex: 16, type: 'keyword.proto' },
				{ startIndex: 18, type: 'white.proto' },
				{ startIndex: 19, type: 'number.proto' },
				{ startIndex: 21, type: 'delimiter.proto' }
			]
		},
		{
			line: '  reserved 100 to max ;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'number.proto' },
				{ startIndex: 14, type: 'white.proto' },
				{ startIndex: 15, type: 'keyword.proto' },
				{ startIndex: 17, type: 'white.proto' },
				{ startIndex: 18, type: 'keyword.proto' },
				{ startIndex: 21, type: 'white.proto' },
				{ startIndex: 22, type: 'delimiter.proto' }
			]
		},
		{
			line: '  optional string baz = 10;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'keyword.proto' },
				{ startIndex: 17, type: 'white.proto' },
				{ startIndex: 18, type: 'identifier.proto' },
				{ startIndex: 21, type: 'white.proto' },
				{ startIndex: 22, type: 'delimiter.proto' },
				{ startIndex: 23, type: 'white.proto' },
				{ startIndex: 24, type: 'number.proto' },
				{ startIndex: 26, type: 'delimiter.proto' }
			]
		},
		{
			line: '  repeated group Result = 1 {',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'keyword.proto' },
				{ startIndex: 16, type: 'white.proto' },
				{ startIndex: 17, type: 'identifier.proto' },
				{ startIndex: 23, type: 'white.proto' },
				{ startIndex: 24, type: 'operator.proto' },
				{ startIndex: 25, type: 'white.proto' },
				{ startIndex: 26, type: 'number.proto' },
				{ startIndex: 27, type: 'white.proto' },
				{ startIndex: 28, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '    required string url = 2;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 4, type: 'keyword.proto' },
				{ startIndex: 12, type: 'white.proto' },
				{ startIndex: 13, type: 'keyword.proto' },
				{ startIndex: 19, type: 'white.proto' },
				{ startIndex: 20, type: 'identifier.proto' },
				{ startIndex: 23, type: 'white.proto' },
				{ startIndex: 24, type: 'delimiter.proto' },
				{ startIndex: 25, type: 'white.proto' },
				{ startIndex: 26, type: 'number.proto' },
				{ startIndex: 27, type: 'delimiter.proto' }
			]
		},
		{
			line: '    optional string title = 3;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 4, type: 'keyword.proto' },
				{ startIndex: 12, type: 'white.proto' },
				{ startIndex: 13, type: 'keyword.proto' },
				{ startIndex: 19, type: 'white.proto' },
				{ startIndex: 20, type: 'identifier.proto' },
				{ startIndex: 25, type: 'white.proto' },
				{ startIndex: 26, type: 'delimiter.proto' },
				{ startIndex: 27, type: 'white.proto' },
				{ startIndex: 28, type: 'number.proto' },
				{ startIndex: 29, type: 'delimiter.proto' }
			]
		},
		{
			line: '    repeated string snippets = 4;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 4, type: 'keyword.proto' },
				{ startIndex: 12, type: 'white.proto' },
				{ startIndex: 13, type: 'keyword.proto' },
				{ startIndex: 19, type: 'white.proto' },
				{ startIndex: 20, type: 'identifier.proto' },
				{ startIndex: 28, type: 'white.proto' },
				{ startIndex: 29, type: 'delimiter.proto' },
				{ startIndex: 30, type: 'white.proto' },
				{ startIndex: 31, type: 'number.proto' },
				{ startIndex: 32, type: 'delimiter.proto' }
			]
		},
		{
			line: '  }',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'delimiter.curly.proto' }
			]
		},
		{ line: '}', tokens: [{ startIndex: 0, type: 'delimiter.curly.proto' }] },
		{ line: '', tokens: [] },
		{
			line: 'extend Foo {',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 6, type: 'white.proto' },
				{ startIndex: 7, type: 'type.identifier.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '  optional int32 bar = 50;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'keyword.proto' },
				{ startIndex: 16, type: 'white.proto' },
				{ startIndex: 17, type: 'identifier.proto' },
				{ startIndex: 20, type: 'white.proto' },
				{ startIndex: 21, type: 'delimiter.proto' },
				{ startIndex: 22, type: 'white.proto' },
				{ startIndex: 23, type: 'number.proto' },
				{ startIndex: 25, type: 'delimiter.proto' }
			]
		},
		{
			line: '  repeated group More = 51 {',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'keyword.proto' },
				{ startIndex: 16, type: 'white.proto' },
				{ startIndex: 17, type: 'identifier.proto' },
				{ startIndex: 21, type: 'white.proto' },
				{ startIndex: 22, type: 'operator.proto' },
				{ startIndex: 23, type: 'white.proto' },
				{ startIndex: 24, type: 'number.proto' },
				{ startIndex: 26, type: 'white.proto' },
				{ startIndex: 27, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '    required string url = 2;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 4, type: 'keyword.proto' },
				{ startIndex: 12, type: 'white.proto' },
				{ startIndex: 13, type: 'keyword.proto' },
				{ startIndex: 19, type: 'white.proto' },
				{ startIndex: 20, type: 'identifier.proto' },
				{ startIndex: 23, type: 'white.proto' },
				{ startIndex: 24, type: 'delimiter.proto' },
				{ startIndex: 25, type: 'white.proto' },
				{ startIndex: 26, type: 'number.proto' },
				{ startIndex: 27, type: 'delimiter.proto' }
			]
		},
		{
			line: '  }',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'delimiter.curly.proto' }
			]
		},
		{ line: '}', tokens: [{ startIndex: 0, type: 'delimiter.curly.proto' }] },
		{ line: '', tokens: [] },
		{ line: 'message', tokens: [{ startIndex: 0, type: 'keyword.proto' }] },
		{
			line: 'map {}',
			tokens: [
				{ startIndex: 0, type: 'type.identifier.proto' },
				{ startIndex: 3, type: 'white.proto' },
				{ startIndex: 4, type: 'delimiter.curly.proto' }
			]
		},
		{ line: '', tokens: [] },
		{
			line: 'message Bar {',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 7, type: 'white.proto' },
				{ startIndex: 8, type: 'type.identifier.proto' },
				{ startIndex: 11, type: 'white.proto' },
				{ startIndex: 12, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '  optional int32 x = 1;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'keyword.proto' },
				{ startIndex: 16, type: 'white.proto' },
				{ startIndex: 17, type: 'identifier.proto' },
				{ startIndex: 18, type: 'white.proto' },
				{ startIndex: 19, type: 'delimiter.proto' },
				{ startIndex: 20, type: 'white.proto' },
				{ startIndex: 21, type: 'number.proto' },
				{ startIndex: 22, type: 'delimiter.proto' }
			]
		},
		{ line: '}', tokens: [{ startIndex: 0, type: 'delimiter.curly.proto' }] },
		{ line: '', tokens: [] },
		{
			line: 'message int32 {}',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 7, type: 'white.proto' },
				{ startIndex: 8, type: 'type.identifier.proto' },
				{ startIndex: 13, type: 'white.proto' },
				{ startIndex: 14, type: 'delimiter.curly.proto' }
			]
		},
		{ line: '', tokens: [] },
		{
			line: 'enum EnumAllowingAlias {',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 4, type: 'white.proto' },
				{ startIndex: 5, type: 'type.identifier.proto' },
				{ startIndex: 22, type: 'white.proto' },
				{ startIndex: 23, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '  option allow_alias = true;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 8, type: 'white.proto' },
				{ startIndex: 9, type: 'annotation.proto' },
				{ startIndex: 20, type: 'white.proto' },
				{ startIndex: 21, type: 'operator.proto' },
				{ startIndex: 22, type: 'white.proto' },
				{ startIndex: 23, type: 'keyword.constant.proto' },
				{ startIndex: 27, type: 'delimiter.proto' }
			]
		},
		{
			line: '  uNkNoWN2 = 0;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'identifier.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'operators.proto' },
				{ startIndex: 12, type: 'white.proto' },
				{ startIndex: 13, type: 'number.octal.proto' },
				{ startIndex: 14, type: 'delimiter.proto' }
			]
		},
		{
			line: '  ENUM_ALLOWING_ALIAS_UNKNOWN = 0;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'identifier.proto' },
				{ startIndex: 29, type: 'white.proto' },
				{ startIndex: 30, type: 'operators.proto' },
				{ startIndex: 31, type: 'white.proto' },
				{ startIndex: 32, type: 'number.octal.proto' },
				{ startIndex: 33, type: 'delimiter.proto' }
			]
		},
		{
			line: '  STARTED = 1;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'identifier.proto' },
				{ startIndex: 9, type: 'white.proto' },
				{ startIndex: 10, type: 'operators.proto' },
				{ startIndex: 11, type: 'white.proto' },
				{ startIndex: 12, type: 'number.proto' },
				{ startIndex: 13, type: 'delimiter.proto' }
			]
		},
		{
			line: "  running = 2 [( /***/ custom_option) = 'hello world'];",
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'identifier.proto' },
				{ startIndex: 9, type: 'white.proto' },
				{ startIndex: 10, type: 'operators.proto' },
				{ startIndex: 11, type: 'white.proto' },
				{ startIndex: 12, type: 'number.proto' },
				{ startIndex: 13, type: 'white.proto' },
				{ startIndex: 14, type: 'delimiter.square.proto' },
				{ startIndex: 15, type: 'annotation.brackets.proto' },
				{ startIndex: 16, type: 'white.proto' },
				{ startIndex: 17, type: 'comment.proto' },
				{ startIndex: 22, type: 'white.proto' },
				{ startIndex: 23, type: 'annotation.proto' },
				{ startIndex: 36, type: 'annotation.brackets.proto' },
				{ startIndex: 37, type: 'white.proto' },
				{ startIndex: 38, type: 'operator.proto' },
				{ startIndex: 39, type: 'white.proto' },
				{ startIndex: 40, type: 'string.quote.proto' },
				{ startIndex: 41, type: 'string.proto' },
				{ startIndex: 52, type: 'string.quote.proto' },
				{ startIndex: 53, type: 'delimiter.square.proto' },
				{ startIndex: 54, type: 'delimiter.proto' }
			]
		},
		{ line: '}', tokens: [{ startIndex: 0, type: 'delimiter.curly.proto' }] },
		{ line: '', tokens: [] },
		{
			line: 'message Outer {',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 7, type: 'white.proto' },
				{ startIndex: 8, type: 'type.identifier.proto' },
				{ startIndex: 13, type: 'white.proto' },
				{ startIndex: 14, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '  option (my_option).a= true;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 8, type: 'white.proto' },
				{ startIndex: 9, type: 'annotation.proto' },
				{ startIndex: 22, type: 'operator.proto' },
				{ startIndex: 23, type: 'white.proto' },
				{ startIndex: 24, type: 'keyword.constant.proto' },
				{ startIndex: 28, type: 'delimiter.proto' }
			]
		},
		{
			line: '  message Inner {   // Level 2',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 9, type: 'white.proto' },
				{ startIndex: 10, type: 'type.identifier.proto' },
				{ startIndex: 15, type: 'white.proto' },
				{ startIndex: 16, type: 'delimiter.curly.proto' },
				{ startIndex: 17, type: 'white.proto' },
				{ startIndex: 20, type: 'comment.proto' }
			]
		},
		{
			line: '    required int64 ival = 1;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 4, type: 'keyword.proto' },
				{ startIndex: 12, type: 'white.proto' },
				{ startIndex: 13, type: 'keyword.proto' },
				{ startIndex: 18, type: 'white.proto' },
				{ startIndex: 19, type: 'identifier.proto' },
				{ startIndex: 23, type: 'white.proto' },
				{ startIndex: 24, type: 'delimiter.proto' },
				{ startIndex: 25, type: 'white.proto' },
				{ startIndex: 26, type: 'number.proto' },
				{ startIndex: 27, type: 'delimiter.proto' }
			]
		},
		{
			line: '  }',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '  repeated Inner inner_message = 2;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'type.identifier.proto' },
				{ startIndex: 16, type: 'white.proto' },
				{ startIndex: 17, type: 'identifier.proto' },
				{ startIndex: 30, type: 'white.proto' },
				{ startIndex: 31, type: 'delimiter.proto' },
				{ startIndex: 32, type: 'white.proto' },
				{ startIndex: 33, type: 'number.proto' },
				{ startIndex: 34, type: 'delimiter.proto' }
			]
		},
		{
			line: '  optional foo .bar',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'type.identifier.proto' }
			]
		},
		{
			line: '   /**/ .EnumAllowingAlias enum_field =3;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 3, type: 'comment.proto' },
				{ startIndex: 7, type: 'white.proto' },
				{ startIndex: 8, type: 'type.identifier.proto' },
				{ startIndex: 26, type: 'white.proto' },
				{ startIndex: 27, type: 'identifier.proto' },
				{ startIndex: 37, type: 'white.proto' },
				{ startIndex: 38, type: 'delimiter.proto' },
				{ startIndex: 39, type: 'number.proto' },
				{ startIndex: 40, type: 'delimiter.proto' }
			]
		},
		{
			line: '  optional map my_map = 4;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'type.identifier.proto' },
				{ startIndex: 14, type: 'white.proto' },
				{ startIndex: 15, type: 'identifier.proto' },
				{ startIndex: 21, type: 'white.proto' },
				{ startIndex: 22, type: 'delimiter.proto' },
				{ startIndex: 23, type: 'white.proto' },
				{ startIndex: 24, type: 'number.proto' },
				{ startIndex: 25, type: 'delimiter.proto' }
			]
		},
		{ line: '}', tokens: [{ startIndex: 0, type: 'delimiter.curly.proto' }] },
		{ line: '', tokens: [] },
		{
			line: 'message message {',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 7, type: 'white.proto' },
				{ startIndex: 8, type: 'type.identifier.proto' },
				{ startIndex: 15, type: 'white.proto' },
				{ startIndex: 16, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '  repeated Foo enum = 1;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'type.identifier.proto' },
				{ startIndex: 14, type: 'white.proto' },
				{ startIndex: 15, type: 'identifier.proto' },
				{ startIndex: 19, type: 'white.proto' },
				{ startIndex: 20, type: 'delimiter.proto' },
				{ startIndex: 21, type: 'white.proto' },
				{ startIndex: 22, type: 'number.proto' },
				{ startIndex: 23, type: 'delimiter.proto' }
			]
		},
		{
			line: '  optional Foo int32 = 2;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'type.identifier.proto' },
				{ startIndex: 14, type: 'white.proto' },
				{ startIndex: 15, type: 'identifier.proto' },
				{ startIndex: 20, type: 'white.proto' },
				{ startIndex: 21, type: 'delimiter.proto' },
				{ startIndex: 22, type: 'white.proto' },
				{ startIndex: 23, type: 'number.proto' },
				{ startIndex: 24, type: 'delimiter.proto' }
			]
		},
		{
			line: '  optional service x = 3;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'type.identifier.proto' },
				{ startIndex: 18, type: 'white.proto' },
				{ startIndex: 19, type: 'identifier.proto' },
				{ startIndex: 20, type: 'white.proto' },
				{ startIndex: 21, type: 'delimiter.proto' },
				{ startIndex: 22, type: 'white.proto' },
				{ startIndex: 23, type: 'number.proto' },
				{ startIndex: 24, type: 'delimiter.proto' }
			]
		},
		{ line: '}', tokens: [{ startIndex: 0, type: 'delimiter.curly.proto' }] },
		{ line: '', tokens: [] },
		{
			line: 'message service {}',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 7, type: 'white.proto' },
				{ startIndex: 8, type: 'type.identifier.proto' },
				{ startIndex: 15, type: 'white.proto' },
				{ startIndex: 16, type: 'delimiter.curly.proto' }
			]
		},
		{ line: '', tokens: [] },
		{
			line: '/** SearchService does nothing and returns the string "foo"',
			tokens: [{ startIndex: 0, type: 'comment.proto' }]
		},
		{ line: '*/', tokens: [{ startIndex: 0, type: 'comment.proto' }] },
		{
			line: 'service SearchService {',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 7, type: 'white.proto' },
				{ startIndex: 8, type: 'identifier.proto' },
				{ startIndex: 21, type: 'white.proto' },
				{ startIndex: 22, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '  rpc Search (SearchRequest) returns (SearchResponse) {',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 5, type: 'white.proto' },
				{ startIndex: 6, type: 'identifier.proto' },
				{ startIndex: 12, type: 'white.proto' },
				{ startIndex: 13, type: 'delimiter.parenthesis.proto' },
				{ startIndex: 14, type: 'type.identifier.proto' },
				{ startIndex: 27, type: 'delimiter.parenthesis.proto' },
				{ startIndex: 28, type: 'white.proto' },
				{ startIndex: 29, type: 'keyword.proto' },
				{ startIndex: 36, type: 'white.proto' },
				{ startIndex: 37, type: 'delimiter.parenthesis.proto' },
				{ startIndex: 38, type: 'type.identifier.proto' },
				{ startIndex: 52, type: 'delimiter.parenthesis.proto' },
				{ startIndex: 53, type: 'white.proto' },
				{ startIndex: 54, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '    option (method_option) = {',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 4, type: 'keyword.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'annotation.proto' },
				{ startIndex: 26, type: 'white.proto' },
				{ startIndex: 27, type: 'operator.proto' },
				{ startIndex: 28, type: 'white.proto' },
				{ startIndex: 29, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '      method_id: 2;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 6, type: 'identifier.proto' },
				{ startIndex: 15, type: 'delimiter.proto' },
				{ startIndex: 16, type: 'white.proto' },
				{ startIndex: 17, type: 'number.proto' },
				{ startIndex: 18, type: 'delimiter.proto' }
			]
		},
		{
			line: '      method_name: "hello";',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 6, type: 'identifier.proto' },
				{ startIndex: 17, type: 'delimiter.proto' },
				{ startIndex: 18, type: 'white.proto' },
				{ startIndex: 19, type: 'string.quote.proto' },
				{ startIndex: 20, type: 'string.proto' },
				{ startIndex: 25, type: 'string.quote.proto' },
				{ startIndex: 26, type: 'delimiter.proto' }
			]
		},
		{
			line: '      method_sla: 9.807E+4;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 6, type: 'identifier.proto' },
				{ startIndex: 16, type: 'delimiter.proto' },
				{ startIndex: 17, type: 'white.proto' },
				{ startIndex: 18, type: 'number.proto' },
				{ startIndex: 19, type: 'number.float.proto' },
				{ startIndex: 26, type: 'delimiter.proto' }
			]
		},
		{
			line: '    };',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 4, type: 'delimiter.curly.proto' },
				{ startIndex: 5, type: 'delimiter.proto' }
			]
		},
		{
			line: '  };',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'delimiter.curly.proto' },
				{ startIndex: 3, type: 'delimiter.proto' }
			]
		},
		{ line: '}', tokens: [{ startIndex: 0, type: 'delimiter.curly.proto' }] },
		{ line: '', tokens: [] },
		{
			line: 'message SearchRequest {};',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 7, type: 'white.proto' },
				{ startIndex: 8, type: 'type.identifier.proto' },
				{ startIndex: 21, type: 'white.proto' },
				{ startIndex: 22, type: 'delimiter.curly.proto' },
				{ startIndex: 24, type: 'delimiter.proto' }
			]
		},
		{
			line: 'message SearchResponse {',
			tokens: [
				{ startIndex: 0, type: 'keyword.proto' },
				{ startIndex: 7, type: 'white.proto' },
				{ startIndex: 8, type: 'type.identifier.proto' },
				{ startIndex: 22, type: 'white.proto' },
				{ startIndex: 23, type: 'delimiter.curly.proto' }
			]
		},
		{
			line: '  optional string response = 1;',
			tokens: [
				{ startIndex: 0, type: 'white.proto' },
				{ startIndex: 2, type: 'keyword.proto' },
				{ startIndex: 10, type: 'white.proto' },
				{ startIndex: 11, type: 'keyword.proto' },
				{ startIndex: 17, type: 'white.proto' },
				{ startIndex: 18, type: 'identifier.proto' },
				{ startIndex: 26, type: 'white.proto' },
				{ startIndex: 27, type: 'delimiter.proto' },
				{ startIndex: 28, type: 'white.proto' },
				{ startIndex: 29, type: 'number.proto' },
				{ startIndex: 30, type: 'delimiter.proto' }
			]
		},
		{
			line: '};',
			tokens: [
				{ startIndex: 0, type: 'delimiter.curly.proto' },
				{ startIndex: 1, type: 'delimiter.proto' }
			]
		}
	]
]);
