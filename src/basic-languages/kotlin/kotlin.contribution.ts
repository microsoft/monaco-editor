/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

declare var AMD: any;
declare var require: any;

registerLanguage({
	id: 'kotlin',
	extensions: ['.kt', '.kts'],
	aliases: ['Kotlin', 'kotlin'],
	mimetypes: ['text/x-kotlin-source', 'text/x-kotlin'],
	loader: () => {
		if (AMD) {
			return new Promise((resolve, reject) => {
				require(['vs/basic-languages/kotlin/kotlin'], resolve, reject);
			});
		} else {
			return import('./kotlin');
		}
	}
});
