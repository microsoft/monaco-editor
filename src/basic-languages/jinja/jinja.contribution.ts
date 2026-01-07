/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

declare var AMD: any;
declare var require: any;

registerLanguage({
	id: 'jinja',
	extensions: ['.jinja', '.j2'],
	aliases: ['Jinja', 'Jinja2', 'jinja'],
	mimetypes: ['text/jinja', 'text/x-jinja-template'],
	loader: () => {
		if (AMD) {
			return new Promise((resolve, reject) => {
				require(['vs/basic-languages/jinja/jinja'], resolve, reject);
			});
		} else {
			return import('./jinja');
		}
	}
});
