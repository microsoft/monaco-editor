/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

declare var AMD: any;
declare var require: any;

registerLanguage({
	id: 'elixir',
	extensions: ['.ex', '.exs'],
	aliases: ['Elixir', 'elixir', 'ex'],
	loader: () => {
		if (AMD) {
			return new Promise((resolve, reject) => {
				require(['vs/basic-languages/elixir/elixir'], resolve, reject);
			});
		} else {
			return import('./elixir');
		}
	}
});
