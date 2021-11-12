/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

declare var AMD: any;
declare var require: any;

registerLanguage({
	id: 'graphql',
	extensions: ['.graphql', '.gql'],
	aliases: ['GraphQL', 'graphql', 'gql'],
	mimetypes: ['application/graphql'],
	loader: () => {
		if (AMD) {
			return new Promise((resolve, reject) => {
				require(['vs/basic-languages/graphql/graphql'], resolve, reject);
			});
		} else {
			return import('./graphql');
		}
	}
});
