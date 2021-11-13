/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

declare var AMD: any;
declare var require: any;

registerLanguage({
	id: 'java',
	extensions: ['.java', '.jav'],
	aliases: ['Java', 'java'],
	mimetypes: ['text/x-java-source', 'text/x-java'],
	loader: () => {
		if (AMD) {
			return new Promise((resolve, reject) => {
				require(['vs/basic-languages/java/java'], resolve, reject);
			});
		} else {
			return import('./java');
		}
	}
});
