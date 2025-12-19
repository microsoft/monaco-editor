/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

registerLanguage({
	id: 'scss',
	extensions: ['.scss'],
	aliases: ['Sass', 'sass', 'scss'],
	mimetypes: ['text/x-scss', 'text/scss'],
	loader: () => import('./scss')
});
