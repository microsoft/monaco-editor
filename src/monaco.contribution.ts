/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import * as mode from './mode';

declare var require:<T>(moduleId:[string], callback:(module:T)=>void)=>void;

function withMode(callback:(module:typeof mode)=>void): void {
	require<typeof mode>(['vs/language/typescript/src/mode'], callback);
}

monaco.languages.register({
	id: 'typescript',
	extensions: ['.ts'],
	aliases: ['TypeScript', 'ts', 'typescript'],
	mimetypes: ['text/typescript']
});
monaco.languages.onLanguage('typescript', () => {
	withMode((mode) => mode.setupTypeScript());
});

monaco.languages.register({
	id: 'javascript',
	extensions: ['.js', '.es6'],
	firstLine: '^#!.*\\bnode',
	filenames: ['jakefile'],
	aliases: ['JavaScript', 'javascript', 'js'],
	mimetypes: ['text/javascript'],
});
monaco.languages.onLanguage('javascript', () => {
	withMode((mode) => mode.setupJavaScript());
});
