/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

declare var AMD: any;
declare var require: any;

registerLanguage({
	id: 'pascal',
	extensions: ['.pas', '.p', '.pp'],
	aliases: ['Pascal', 'pas'],
	mimetypes: ['text/x-pascal-source', 'text/x-pascal'],
	loader: () => {
		if (AMD) {
			return new Promise((resolve, reject) => {
				require(['vs/basic-languages/pascal/pascal'], resolve, reject);
			});
		} else {
			return import('./pascal');
		}
	}
});
