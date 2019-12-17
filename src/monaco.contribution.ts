/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import * as mode from './cssMode';

import Emitter = monaco.Emitter;
import IEvent = monaco.IEvent;

// --- CSS configuration and defaults ---------

export class LanguageServiceDefaultsImpl implements monaco.languages.css.LanguageServiceDefaults {

	private _onDidChange = new Emitter<monaco.languages.css.LanguageServiceDefaults>();
	private _diagnosticsOptions: monaco.languages.css.DiagnosticsOptions;
	private _modeConfiguration: monaco.languages.css.ModeConfiguration;
	private _languageId: string;

	constructor(languageId: string, diagnosticsOptions: monaco.languages.css.DiagnosticsOptions, modeConfiguration: monaco.languages.css.ModeConfiguration) {
		this._languageId = languageId;
		this.setDiagnosticsOptions(diagnosticsOptions);
		this.setModeConfiguration(modeConfiguration);
	}

	get onDidChange(): IEvent<monaco.languages.css.LanguageServiceDefaults> {
		return this._onDidChange.event;
	}

	get languageId(): string {
		return this._languageId;
	}

	get modeConfiguration(): monaco.languages.css.ModeConfiguration {
		return this._modeConfiguration;
	}

	get diagnosticsOptions(): monaco.languages.css.DiagnosticsOptions {
		return this._diagnosticsOptions;
	}

	setDiagnosticsOptions(options: monaco.languages.css.DiagnosticsOptions): void {
		this._diagnosticsOptions = options || Object.create(null);
		this._onDidChange.fire(this);
	}

	setModeConfiguration(modeConfiguration: monaco.languages.css.ModeConfiguration): void {
		this._modeConfiguration = modeConfiguration || Object.create(null);
		this._onDidChange.fire(this);
	};
}

export interface ModeConfiguration {
	/**
	 * Defines whether the built-in documentFormattingEdit provider is enabled.
	 */
	readonly documentFormattingEdits?: boolean;

	/**
	 * Defines whether the built-in documentRangeFormattingEdit provider is enabled.
	 */
	readonly documentRangeFormattingEdits?: boolean;

	/**
	 * Defines whether the built-in completionItemProvider is enabled.
	 */
	readonly completionItems?: boolean;

	/**
	 * Defines whether the built-in hoverProvider is enabled.
	 */
	readonly hovers?: boolean;

	/**
	 * Defines whether the built-in documentSymbolProvider is enabled.
	 */
	readonly documentSymbols?: boolean;

	/**
	 * Defines whether the built-in tokens provider is enabled.
	 */
	readonly tokens?: boolean;

	/**
	 * Defines whether the built-in color provider is enabled.
	 */
	readonly colors?: boolean;

	/**
	 * Defines whether the built-in foldingRange provider is enabled.
	 */
	readonly foldingRanges?: boolean;

	/**
	 * Defines whether the built-in diagnostic provider is enabled.
	 */
	readonly diagnostics?: boolean;

	/**
	 * Defines whether the built-in selection range provider is enabled.
	 */
	readonly selectionRanges?: boolean;

}

const diagnosticDefault: Required<monaco.languages.css.DiagnosticsOptions> = {
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

const modeConfigurationDefault: Required<monaco.languages.css.ModeConfiguration> = {
	completionItems: true,
	hovers: true,
	documentSymbols: true,
	definitions: true,
	references: true,
	documentHighlights: true,
	rename: true,
	colors: true,
	foldingRanges: true,
	diagnostics: true,
	selectionRanges: true
}

const cssDefaults = new LanguageServiceDefaultsImpl('css', diagnosticDefault, modeConfigurationDefault);
const scssDefaults = new LanguageServiceDefaultsImpl('scss', diagnosticDefault, modeConfigurationDefault);
const lessDefaults = new LanguageServiceDefaultsImpl('less', diagnosticDefault, modeConfigurationDefault);


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

function getMode(): Promise<typeof mode> {
	return import('./cssMode');
}

monaco.languages.onLanguage('less', () => {
	getMode().then(mode => mode.setupMode(lessDefaults));
});

monaco.languages.onLanguage('scss', () => {
	getMode().then(mode => mode.setupMode(scssDefaults));
});

monaco.languages.onLanguage('css', () => {
	getMode().then(mode => mode.setupMode(cssDefaults));
});
