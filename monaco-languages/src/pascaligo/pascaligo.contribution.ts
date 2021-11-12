/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

declare var AMD: any;
declare var require: any;

registerLanguage({
	id: 'pascaligo',
	extensions: ['.ligo'],
	aliases: ['Pascaligo', 'ligo'],
	loader: () => {
		if (AMD) {
			return new Promise((resolve, reject) => {
				require(['vs/basic-languages/pascaligo/pascaligo'], resolve, reject);
			});
		} else {
			return import('./pascaligo');
		}
	}
});
