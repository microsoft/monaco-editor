/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

declare var AMD: any;
declare var require: any;

registerLanguage({
	id: 'r',
	extensions: ['.r', '.rhistory', '.rmd', '.rprofile', '.rt'],
	aliases: ['R', 'r'],
	loader: () => {
		if (AMD) {
			return new Promise((resolve, reject) => {
				require(['vs/basic-languages/r/r'], resolve, reject);
			});
		} else {
			return import('./r');
		}
	}
});
