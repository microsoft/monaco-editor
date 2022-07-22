/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

declare var AMD: any;
declare var require: any;

registerLanguage({
	id: 'cypher',
	extensions: ['.cypher', '.cyp'],
	aliases: ['Cypher', 'OpenCypher'],
	loader: () => {
		if (AMD) {
			return new Promise((resolve, reject) => {
				require(['vs/basic-languages/cypher/cypher'], resolve, reject);
			});
		} else {
			return import('./cypher');
		}
	}
});
