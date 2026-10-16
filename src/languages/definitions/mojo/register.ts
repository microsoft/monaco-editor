/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

registerLanguage({
	id: 'mojo',
	// Mojo 1.1.0 requires .mojo even with a shebang, so omit firstLine detection.
	extensions: ['.mojo'],
	aliases: ['Mojo'],
	loader: () => import('./mojo')
});
