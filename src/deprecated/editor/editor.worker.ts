/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * @deprecated.
 * This module is deprecated, but still needed by the webpack plugin.
 * Once the webpack plugin is deprecated, it can be deleted safely.
 */

import { initialize, isWorkerInitialized } from '../../internal/common/initialize';
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
