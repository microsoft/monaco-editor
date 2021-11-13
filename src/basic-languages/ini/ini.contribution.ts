/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

declare var AMD: any;
declare var require: any;

registerLanguage({
	id: 'ini',
	extensions: ['.ini', '.properties', '.gitconfig'],
	filenames: ['config', '.gitattributes', '.gitconfig', '.editorconfig'],
	aliases: ['Ini', 'ini'],
	loader: () => {
		if (AMD) {
			return new Promise((resolve, reject) => {
				require(['vs/basic-languages/ini/ini'], resolve, reject);
			});
		} else {
			return import('./ini');
		}
	}
});
