/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { registerLanguage } from '../_.contribution';

registerLanguage({
	id: 'st',
	extensions: ['.st', '.iecst', '.iecplc', '.lc3lib'],
	aliases: ['StructuredText', 'scl', 'stl'],
	loader: () => import('./st')
});
