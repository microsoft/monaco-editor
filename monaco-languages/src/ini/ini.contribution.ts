/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

registerLanguage({
	id: 'ini',
	extensions: ['.ini', '.properties', '.gitconfig'],
	filenames: ['config', '.gitattributes', '.gitconfig', '.editorconfig'],
	aliases: ['Ini', 'ini'],
	loader: () => import('./ini')
});
