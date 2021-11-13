/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

declare var AMD: any;
declare var require: any;

registerLanguage({
	id: 'handlebars',
	extensions: ['.handlebars', '.hbs'],
	aliases: ['Handlebars', 'handlebars', 'hbs'],
	mimetypes: ['text/x-handlebars-template'],
	loader: () => {
		if (AMD) {
			return new Promise((resolve, reject) => {
				require(['vs/basic-languages/handlebars/handlebars'], resolve, reject);
			});
		} else {
			return import('./handlebars');
		}
	}
});
