/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

declare var AMD: any;
declare var require: any;

registerLanguage({
	id: 'coffeescript',
	extensions: ['.coffee'],
	aliases: ['CoffeeScript', 'coffeescript', 'coffee'],
	mimetypes: ['text/x-coffeescript', 'text/coffeescript'],
	loader: () => {
		if (AMD) {
			return new Promise((resolve, reject) => {
				require(['vs/basic-languages/coffee/coffee'], resolve, reject);
			});
		} else {
			return import('./coffee');
		}
	}
});
