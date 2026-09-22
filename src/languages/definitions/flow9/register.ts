/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

registerLanguage({
	id: 'flow9',
	extensions: ['.flow'],
	aliases: ['Flow9', 'Flow', 'flow9', 'flow'],
	loader: () => import('./flow9')
});
