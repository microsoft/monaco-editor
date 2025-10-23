/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

registerLanguage({
	id: 'yaml',
	extensions: ['.yaml', '.yml'],
	aliases: ['YAML', 'yaml', 'YML', 'yml'],
	mimetypes: ['application/x-yaml', 'text/x-yaml'],
	loader: () => import('./yaml')
});
