/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

registerLanguage({
	id: 'c',
	extensions: ['.c', '.h'],
	aliases: ['C', 'c'],
	loader: () => import('./cpp')
});
registerLanguage({
	id: 'cpp',
	extensions: ['.cpp', '.cc', '.cxx', '.hpp', '.hh', '.hxx'],
	aliases: ['C++', 'Cpp', 'cpp'],
	loader: () => import('./cpp')
});
