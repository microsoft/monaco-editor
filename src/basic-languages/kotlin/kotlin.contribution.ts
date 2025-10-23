/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

registerLanguage({
	id: 'kotlin',
	extensions: ['.kt', '.kts'],
	aliases: ['Kotlin', 'kotlin'],
	mimetypes: ['text/x-kotlin-source', 'text/x-kotlin'],
	loader: () => import('./kotlin')
});
