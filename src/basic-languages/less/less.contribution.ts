/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

registerLanguage({
	id: 'less',
	extensions: ['.less'],
	aliases: ['Less', 'less'],
	mimetypes: ['text/x-less', 'text/less'],
	loader: () => import('./less')
});
