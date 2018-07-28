/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import * as mode from './jsonMode';

import Emitter = monaco.Emitter;
import IEvent = monaco.IEvent;
import IDisposable = monaco.IDisposable;

// --- JSON configuration and defaults ---------

export class LanguageServiceDefaultsImpl implements monaco.languages.json.LanguageServiceDefaults {

	private _onDidChange = new Emitter<monaco.languages.json.LanguageServiceDefaults>();
	private _diagnosticsOptions: monaco.languages.json.DiagnosticsOptions;
	private _languageId: string;

	constructor(languageId: string, diagnosticsOptions: monaco.languages.json.DiagnosticsOptions) {
		this._languageId = languageId;
		this.setDiagnosticsOptions(diagnosticsOptions);
	}

	get onDidChange(): IEvent<monaco.languages.json.LanguageServiceDefaults> {
		return this._onDidChange.event;
	}

	get languageId(): string {
		return this._languageId;
	}

	get diagnosticsOptions(): monaco.languages.json.DiagnosticsOptions {
		return this._diagnosticsOptions;
	}

	setDiagnosticsOptions(options: monaco.languages.json.DiagnosticsOptions): void {
		this._diagnosticsOptions = options || Object.create(null);
		this._onDidChange.fire(this);
	}
}

const diagnosticDefault: monaco.languages.json.DiagnosticsOptions = {
	validate: true,
	allowComments: true,
	schemas: [],
    enableSchemaRequest: false
};

const jsonDefaults = new LanguageServiceDefaultsImpl('json', diagnosticDefault);


// Export API
function createAPI(): typeof monaco.languages.json {
	return {
		jsonDefaults: jsonDefaults,
	}
}
monaco.languages.json = createAPI();

// --- Registration to monaco editor ---

function getMode(): monaco.Promise<typeof mode> {
	return monaco.Promise.wrap(import('./jsonMode'))
}

monaco.languages.register({
	id: 'json',
	extensions: ['.json', '.bowerrc', '.jshintrc', '.jscsrc', '.eslintrc', '.babelrc'],
	aliases: ['JSON', 'json'],
	mimetypes: ['application/json'],
});
monaco.languages.onLanguage('json', () => {
	getMode().then(mode => mode.setupMode(jsonDefaults));
});
