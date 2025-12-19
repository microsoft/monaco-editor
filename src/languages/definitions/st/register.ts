/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

registerLanguage({
	id: 'st',
	extensions: ['.st', '.iecst', '.iecplc', '.lc3lib', '.TcPOU', '.TcDUT', '.TcGVL', '.TcIO'],
	aliases: ['StructuredText', 'scl', 'stl'],
	loader: () => import('./st')
});
