/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

registerLanguage({
	id: 'objective-c',
	extensions: ['.m'],
	aliases: ['Objective-C'],
	loader: () => import('./objective-c')
});
