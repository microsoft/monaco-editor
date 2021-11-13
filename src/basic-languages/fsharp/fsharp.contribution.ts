/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

declare var AMD: any;
declare var require: any;

registerLanguage({
	id: 'fsharp',
	extensions: ['.fs', '.fsi', '.ml', '.mli', '.fsx', '.fsscript'],
	aliases: ['F#', 'FSharp', 'fsharp'],
	loader: () => {
		if (AMD) {
			return new Promise((resolve, reject) => {
				require(['vs/basic-languages/fsharp/fsharp'], resolve, reject);
			});
		} else {
			return import('./fsharp');
		}
	}
});
