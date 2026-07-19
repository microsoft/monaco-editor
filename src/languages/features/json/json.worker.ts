/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as worker from '../../../internal/common/initialize';
import { JSONWorker } from './jsonWorker';

self.onmessage = () => {
	// ignore the first message
	worker.initialize((ctx, createData) => {
		return new JSONWorker(ctx, createData);
	});
};
