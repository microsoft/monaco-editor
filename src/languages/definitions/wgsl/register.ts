/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

registerLanguage({
	id: 'wgsl',
	extensions: ['.wgsl'],
	aliases: ['WebGPU Shading Language', 'WGSL', 'wgsl'],
	loader: () => import('./wgsl')
});
