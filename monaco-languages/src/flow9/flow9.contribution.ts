/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

declare var AMD: any;
declare var require: any;

registerLanguage({
	id: 'flow9',
	extensions: ['.flow'],
	aliases: ['Flow9', 'Flow', 'flow9', 'flow'],
	loader: () => {
		if (AMD) {
			return new Promise((resolve, reject) => {
				require(['vs/basic-languages/flow9/flow9'], resolve, reject);
			});
		} else {
			return import('./flow9');
		}
	}
});
