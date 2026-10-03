/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

registerLanguage({
	id: 'latex',
	extensions: ['.tex', '.latex', '.sty', '.cls'],
	aliases: ['LaTeX', 'latex'],
	mimetypes: ['application/x-latex'],
	loader: () => import('./latex')
});
