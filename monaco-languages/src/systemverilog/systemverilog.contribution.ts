/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

declare var AMD: any;
declare var require: any;

registerLanguage({
	id: 'systemverilog',
	extensions: ['.sv', '.svh'],
	aliases: ['SV', 'sv', 'SystemVerilog', 'systemverilog'],
	loader: () => {
		if (AMD) {
			return new Promise((resolve, reject) => {
				require(['vs/basic-languages/systemverilog/systemverilog'], resolve, reject);
			});
		} else {
			return import('./systemverilog');
		}
	}
});

registerLanguage({
	id: 'verilog',
	extensions: ['.v', '.vh'],
	aliases: ['V', 'v', 'Verilog', 'verilog'],
	loader: () => {
		if (AMD) {
			return new Promise((resolve, reject) => {
				require(['vs/basic-languages/systemverilog/systemverilog'], resolve, reject);
			});
		} else {
			return import('./systemverilog');
		}
	}
});
