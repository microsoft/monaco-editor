/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { initialize, isWorkerInitialized } from '../common/initialize';
import * as worker from 'monaco-editor-core/esm/vs/editor/editor.worker.start';

// This is to preserve previous behavior.
self.onmessage = () => {
	if (!isWorkerInitialized()) {
		worker.start(() => {
			return {};
		});
	} else {
		// this is handled because the worker is already initialized
	}
};

export { initialize };
