/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { testTokenization } from '../test/testRunner';

testTokenization('powerquery', [
	// Comments
	[{
		line: '// a comment',
		tokens: [
			{ startIndex: 0, type: 'comment.pq' }
		]
	}],
]);
