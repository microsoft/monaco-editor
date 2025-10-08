/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

registerLanguage({
	id: 'twig',
	extensions: ['.twig'],
	aliases: ['Twig', 'twig'],
	mimetypes: ['text/x-twig'],
	loader: () => import('./twig')
});
