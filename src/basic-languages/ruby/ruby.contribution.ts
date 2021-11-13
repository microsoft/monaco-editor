/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

declare var AMD: any;
declare var require: any;

registerLanguage({
	id: 'ruby',
	extensions: ['.rb', '.rbx', '.rjs', '.gemspec', '.pp'],
	filenames: ['rakefile', 'Gemfile'],
	aliases: ['Ruby', 'rb'],
	loader: () => {
		if (AMD) {
			return new Promise((resolve, reject) => {
				require(['vs/basic-languages/ruby/ruby'], resolve, reject);
			});
		} else {
			return import('./ruby');
		}
	}
});
