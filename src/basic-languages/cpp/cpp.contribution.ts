/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

declare var AMD: any;
declare var require: any;

registerLanguage({
	id: 'c',
	extensions: ['.c', '.h'],
	aliases: ['C', 'c'],
	loader: () => {
		if (AMD) {
			return new Promise((resolve, reject) => {
				require(['vs/basic-languages/cpp/cpp'], resolve, reject);
			});
		} else {
			return import('./cpp');
		}
	}
});
registerLanguage({
	id: 'cpp',
	extensions: ['.cpp', '.cc', '.cxx', '.hpp', '.hh', '.hxx'],
	aliases: ['C++', 'Cpp', 'cpp'],
	loader: () => {
		if (AMD) {
			return new Promise((resolve, reject) => {
				require(['vs/basic-languages/cpp/cpp'], resolve, reject);
			});
		} else {
			return import('./cpp');
		}
	}
});
