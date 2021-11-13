/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

declare var AMD: any;
declare var require: any;

registerLanguage({
	id: 'apex',
	extensions: ['.cls'],
	aliases: ['Apex', 'apex'],
	mimetypes: ['text/x-apex-source', 'text/x-apex'],
	loader: () => {
		if (AMD) {
			return new Promise((resolve, reject) => {
				require(['vs/basic-languages/apex/apex'], resolve, reject);
			});
		} else {
			return import('./apex');
		}
	}
});
