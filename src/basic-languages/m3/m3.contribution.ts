/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

registerLanguage({
	id: 'm3',
	extensions: ['.m3', '.i3', '.mg', '.ig'],
	aliases: ['Modula-3', 'Modula3', 'modula3', 'm3'],
	loader: () => import('./m3')
});
