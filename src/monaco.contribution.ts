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
	private _modeConfiguration: monaco.languages.json.ModeConfiguration;
	private _languageId: string;

	constructor(languageId: string, diagnosticsOptions: monaco.languages.json.DiagnosticsOptions, modeConfiguration: monaco.languages.json.ModeConfiguration) {
		this._languageId = languageId;
		this.setDiagnosticsOptions(diagnosticsOptions);
		this.setModeConfiguration(modeConfiguration)
	}

	get onDidChange(): IEvent<monaco.languages.json.LanguageServiceDefaults> {
		return this._onDidChange.event;
	}

	get languageId(): string {
		return this._languageId;
	}

	get modeConfiguration(): monaco.languages.json.ModeConfiguration {
		return this._modeConfiguration;
	}

	get diagnosticsOptions(): monaco.languages.json.DiagnosticsOptions {
		return this._diagnosticsOptions;
	}

	setDiagnosticsOptions(options: monaco.languages.json.DiagnosticsOptions): void {
		this._diagnosticsOptions = options || Object.create(null);
		this._onDidChange.fire(this);
	}
	setModeConfiguration(modeConfiguration: monaco.languages.json.ModeConfiguration): void {
		this._modeConfiguration = modeConfiguration || Object.create(null);
		this._onDidChange.fire(this);
	};
}

const diagnosticDefault: monaco.languages.json.DiagnosticsOptions = {
	validate: true,
	allowComments: true,
	schemas: [],
	enableSchemaRequest: false
};

const providersDefault: monaco.languages.json.ModeConfiguration = {
	documentFormattingEdits: true,
	documentRangeFormattingEdits: true,
	completionItems: true,
	hovers: true,
	documentSymbols: true,
	tokens: true,
	colors: true,
	foldingRanges: true,
	diagnostics: true
}

const jsonDefaults = new LanguageServiceDefaultsImpl('json', diagnosticDefault, providersDefault);

// Export API
function createAPI(): typeof monaco.languages.json {
	return {
		jsonDefaults: jsonDefaults
	}
}
monaco.languages.json = createAPI();

// --- Registration to monaco editor ---

function getMode(): Promise<typeof mode> {
	return import('./jsonMode');
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
