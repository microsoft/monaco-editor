/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

declare var AMD: any;
declare var require: any;

registerLanguage({
	id: 'scala',
	extensions: ['.scala', '.sc', '.sbt'],
	aliases: ['Scala', 'scala', 'SBT', 'Sbt', 'sbt', 'Dotty', 'dotty'],
	mimetypes: ['text/x-scala-source', 'text/x-scala', 'text/x-sbt', 'text/x-dotty'],
	loader: () => {
		if (AMD) {
			return new Promise((resolve, reject) => {
				require(['vs/basic-languages/scala/scala'], resolve, reject);
			});
		} else {
			return import('./scala');
		}
	}
});
