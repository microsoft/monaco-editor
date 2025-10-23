/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

registerLanguage({
	id: 'apex',
	extensions: ['.cls'],
	aliases: ['Apex', 'apex'],
	mimetypes: ['text/x-apex-source', 'text/x-apex'],
	loader: () => import('./apex')
});
