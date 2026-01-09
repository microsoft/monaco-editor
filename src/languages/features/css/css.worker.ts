/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { initialize } from '../../../internal/common/initialize';
import { CSSWorker } from './cssWorker';

self.onmessage = () => {
	// ignore the first message
	initialize((ctx, createData) => {
		return new CSSWorker(ctx, createData);
	});
};
