/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import * as mode from './cssMode';

import Emitter = monaco.Emitter;
import IEvent = monaco.IEvent;
import IDisposable = monaco.IDisposable;

declare var require: <T>(moduleId: [string], callback: (module: T) => void) => void;

// --- CSS configuration and defaults ---------

export class LanguageServiceDefaultsImpl implements monaco.languages.css.LanguageServiceDefaults {

	private _onDidChange = new Emitter<monaco.languages.css.LanguageServiceDefaults>();
	private _diagnosticsOptions: monaco.languages.css.DiagnosticsOptions;
	private _languageId: string;

	constructor(languageId: string, diagnosticsOptions: monaco.languages.css.DiagnosticsOptions) {
		this._languageId = languageId;
		this.setDiagnosticsOptions(diagnosticsOptions);
	}

	get onDidChange(): IEvent<monaco.languages.css.LanguageServiceDefaults> {
		return this._onDidChange.event;
	}

	get languageId(): string {
		return this._languageId;
	}

	get diagnosticsOptions(): monaco.languages.css.DiagnosticsOptions {
		return this._diagnosticsOptions;
	}

	setDiagnosticsOptions(options: monaco.languages.css.DiagnosticsOptions): void {
		this._diagnosticsOptions = options || Object.create(null);
		this._onDidChange.fire(this);
	}
}

const diagnosticDefault: monaco.languages.css.DiagnosticsOptions = {
	validate: true,
	lint: {
		compatibleVendorPrefixes: 'ignore',
		vendorPrefix: 'warning',
		duplicateProperties: 'warning',
		emptyRules: 'warning',
		importStatement: 'ignore',
		boxModel: 'ignore',
		universalSelector: 'ignore',
		zeroUnits: 'ignore',
		fontFaceProperties: 'warning',
		hexColorLength: 'error',
		argumentsInColorFunction: 'error',
		unknownProperties: 'warning',
		ieHack: 'ignore',
		unknownVendorSpecificProperties: 'ignore',
		propertyIgnoredDueToDisplay: 'warning',
		important: 'ignore',
		float: 'ignore',
		idSelector: 'ignore'
	}
}

const cssDefaults = new LanguageServiceDefaultsImpl('css', diagnosticDefault);
const scssDefaults = new LanguageServiceDefaultsImpl('scss', diagnosticDefault);
const lessDefaults = new LanguageServiceDefaultsImpl('less', diagnosticDefault);


// Export API
function createAPI(): typeof monaco.languages.css {
	return {
		cssDefaults: cssDefaults,
		lessDefaults: lessDefaults,
		scssDefaults: scssDefaults
	}
}
monaco.languages.css = createAPI();

// --- Registration to monaco editor ---

function withMode(callback: (module: typeof mode) => void): void {
	require<typeof mode>(['vs/language/css/cssMode'], callback);
}

monaco.languages.onLanguage('less', () => {
	withMode(mode => mode.setupMode(lessDefaults));
});

monaco.languages.onLanguage('scss', () => {
	withMode(mode => mode.setupMode(scssDefaults));
});

monaco.languages.onLanguage('css', () => {
	withMode(mode => mode.setupMode(cssDefaults));
});
