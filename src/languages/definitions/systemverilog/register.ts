/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

registerLanguage({
	id: 'systemverilog',
	extensions: ['.sv', '.svh'],
	aliases: ['SV', 'sv', 'SystemVerilog', 'systemverilog'],
	loader: () => import('./systemverilog')
});

registerLanguage({
	id: 'verilog',
	extensions: ['.v', '.vh'],
	aliases: ['V', 'v', 'Verilog', 'verilog'],
	loader: () => import('./systemverilog')
});
