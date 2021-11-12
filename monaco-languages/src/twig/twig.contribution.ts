/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

declare var AMD: any;
declare var require: any;

registerLanguage({
	id: 'twig',
	extensions: ['.twig'],
	aliases: ['Twig', 'twig'],
	mimetypes: ['text/x-twig'],
	loader: () => {
		if (AMD) {
			return new Promise((resolve, reject) => {
				require(['vs/basic-languages/twig/twig'], resolve, reject);
			});
		} else {
			return import('./twig');
		}
	}
});
