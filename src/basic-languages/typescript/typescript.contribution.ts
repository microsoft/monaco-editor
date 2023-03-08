/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

declare var AMD: any;
declare var require: any;

registerLanguage({
	id: 'typescript',
	extensions: ['.ts', '.tsx', '.cts', '.mts'],
	aliases: ['TypeScript', 'ts', 'typescript'],
	mimetypes: ['text/typescript'],
	loader: (): Promise<any> => {
		if (AMD) {
			return new Promise((resolve, reject) => {
				require(['vs/basic-languages/typescript/typescript'], resolve, reject);
			});
		} else {
			return import('./typescript');
		}
	}
});
