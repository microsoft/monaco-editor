/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

registerLanguage({
	id: 'coffeescript',
	extensions: ['.coffee'],
	aliases: ['CoffeeScript', 'coffeescript', 'coffee'],
	mimetypes: ['text/x-coffeescript', 'text/coffeescript'],
	loader: () => import('./coffee')
});
