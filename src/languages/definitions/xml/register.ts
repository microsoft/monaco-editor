/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

registerLanguage({
	id: 'xml',
	extensions: [
		'.xml',
		'.xsd',
		'.dtd',
		'.ascx',
		'.csproj',
		'.config',
		'.props',
		'.targets',
		'.wxi',
		'.wxl',
		'.wxs',
		'.xaml',
		'.svg',
		'.svgz',
		'.opf',
		'.xslt',
		'.xsl'
	],
	firstLine: '(\\<\\?xml.*)|(\\<svg)|(\\<\\!doctype\\s+svg)',
	aliases: ['XML', 'xml'],
	mimetypes: ['text/xml', 'application/xml', 'application/xaml+xml', 'application/xml-dtd'],
	loader: () => import('./xml')
});
