/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { testTokenization } from '../test/testRunner';

testTokenization('scala', [
	[{
		line: '//',
		tokens: [
			{startIndex: 0, type: 'comment.scala'}
		]
	}],

	[{
		line: '    // a comment',
		tokens: [
			{startIndex: 0, type: 'white.scala'},
			{startIndex: 4, type: 'comment.scala'}
		]
	}],

	[{
		line: 'var a = 1',
		tokens: [
			{startIndex: 0, type: 'keyword.scala'},
			{startIndex: 3, type: 'white.scala'},
			{startIndex: 4, type: 'variable.scala'},
			{startIndex: 5, type: 'white.scala'},
			{startIndex: 6, type: 'operator.scala'},
			{startIndex: 7, type: 'white.scala'},
			{startIndex: 8, type: 'number.scala'}
		]
	}]
]);
