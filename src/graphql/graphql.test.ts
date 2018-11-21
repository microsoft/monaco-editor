/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { testTokenization } from '../test/testRunner';

testTokenization('graphql', [
	// Keywords
	[{
		line: 'scalar Date',
		tokens: [
			{ startIndex: 0, type: 'keyword.gql' },
			{ startIndex: 6, type: '' },
			{ startIndex: 7, type: 'type.identifier.gql' },
		]
	}],

	// Root schema definition
	[{
		line: 'schema { query: Query }',
		tokens: [
			{ startIndex: 0, type: "keyword.gql" },
			{ startIndex: 6, type: "" },
			{ startIndex: 7, type: "delimiter.curly.gql" },
			{ startIndex: 8, type: "" },
			{ startIndex: 9, type: "keyword.gql" }, // this should be identifier!
			{ startIndex: 14, type: "delimiter.gql" },
			{ startIndex: 15, type: "" },
			{ startIndex: 16, type: "type.identifier.gql" },
			{ startIndex: 21, type: "" },
			{ startIndex: 22, type: "delimiter.curly.gql" },
		]
	}],

	// Comments - single line

	// Comments - range comment, single line

]);
