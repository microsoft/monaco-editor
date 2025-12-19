/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

// freemarker.tag-square.interpolation-dollar is the default
// According the docs tag-auto will be the default for version 2.4+, but that
// hasn't event been released yet.
registerLanguage({
	id: 'freemarker2',
	extensions: ['.ftl', '.ftlh', '.ftlx'],
	aliases: ['FreeMarker2', 'Apache FreeMarker2'],
	loader: () => {
		return import('./freemarker2').then((m) => m.TagAutoInterpolationDollar);
	}
});

registerLanguage({
	id: 'freemarker2.tag-angle.interpolation-dollar',
	aliases: ['FreeMarker2 (Angle/Dollar)', 'Apache FreeMarker2 (Angle/Dollar)'],
	loader: () => {
		return import('./freemarker2').then((m) => m.TagAngleInterpolationDollar);
	}
});

registerLanguage({
	id: 'freemarker2.tag-bracket.interpolation-dollar',
	aliases: ['FreeMarker2 (Bracket/Dollar)', 'Apache FreeMarker2 (Bracket/Dollar)'],
	loader: () => {
		return import('./freemarker2').then((m) => m.TagBracketInterpolationDollar);
	}
});

registerLanguage({
	id: 'freemarker2.tag-angle.interpolation-bracket',
	aliases: ['FreeMarker2 (Angle/Bracket)', 'Apache FreeMarker2 (Angle/Bracket)'],
	loader: () => {
		return import('./freemarker2').then((m) => m.TagAngleInterpolationBracket);
	}
});

registerLanguage({
	id: 'freemarker2.tag-bracket.interpolation-bracket',
	aliases: ['FreeMarker2 (Bracket/Bracket)', 'Apache FreeMarker2 (Bracket/Bracket)'],
	loader: () => {
		return import('./freemarker2').then((m) => m.TagBracketInterpolationBracket);
	}
});

registerLanguage({
	id: 'freemarker2.tag-auto.interpolation-dollar',
	aliases: ['FreeMarker2 (Auto/Dollar)', 'Apache FreeMarker2 (Auto/Dollar)'],
	loader: () => {
		return import('./freemarker2').then((m) => m.TagAutoInterpolationDollar);
	}
});

registerLanguage({
	id: 'freemarker2.tag-auto.interpolation-bracket',
	aliases: ['FreeMarker2 (Auto/Bracket)', 'Apache FreeMarker2 (Auto/Bracket)'],
	loader: () => {
		return import('./freemarker2').then((m) => m.TagAutoInterpolationBracket);
	}
});
