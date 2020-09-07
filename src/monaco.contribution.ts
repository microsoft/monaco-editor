/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as mode from './cssMode';
import { languages, Emitter, IEvent } from './fillers/monaco-editor-core';

export interface DiagnosticsOptions {
	readonly validate?: boolean;
	readonly lint?: {
		readonly compatibleVendorPrefixes?: 'ignore' | 'warning' | 'error';
		readonly vendorPrefix?: 'ignore' | 'warning' | 'error';
		readonly duplicateProperties?: 'ignore' | 'warning' | 'error';
		readonly emptyRules?: 'ignore' | 'warning' | 'error';
		readonly importStatement?: 'ignore' | 'warning' | 'error';
		readonly boxModel?: 'ignore' | 'warning' | 'error';
		readonly universalSelector?: 'ignore' | 'warning' | 'error';
		readonly zeroUnits?: 'ignore' | 'warning' | 'error';
		readonly fontFaceProperties?: 'ignore' | 'warning' | 'error';
		readonly hexColorLength?: 'ignore' | 'warning' | 'error';
		readonly argumentsInColorFunction?: 'ignore' | 'warning' | 'error';
		readonly unknownProperties?: 'ignore' | 'warning' | 'error';
		readonly ieHack?: 'ignore' | 'warning' | 'error';
		readonly unknownVendorSpecificProperties?: 'ignore' | 'warning' | 'error';
		readonly propertyIgnoredDueToDisplay?: 'ignore' | 'warning' | 'error';
		readonly important?: 'ignore' | 'warning' | 'error';
		readonly float?: 'ignore' | 'warning' | 'error';
		readonly idSelector?: 'ignore' | 'warning' | 'error';
	};
}

export interface ModeConfiguration {
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
	 * Defines whether the built-in definitions provider is enabled.
	 */
	readonly definitions?: boolean;

	/**
	 * Defines whether the built-in references provider is enabled.
	 */
	readonly references?: boolean;

	/**
	 * Defines whether the built-in references provider is enabled.
	 */
	readonly documentHighlights?: boolean;

	/**
	 * Defines whether the built-in rename provider is enabled.
	 */
	readonly rename?: boolean;

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

export interface LanguageServiceDefaults {
	readonly languageId: string;
	readonly onDidChange: IEvent<LanguageServiceDefaults>;
	readonly diagnosticsOptions: DiagnosticsOptions;
	readonly modeConfiguration: ModeConfiguration;
	setDiagnosticsOptions(options: DiagnosticsOptions): void;
	setModeConfiguration(modeConfiguration: ModeConfiguration): void;
}

// --- CSS configuration and defaults ---------

class LanguageServiceDefaultsImpl implements LanguageServiceDefaults {
	private _onDidChange = new Emitter<LanguageServiceDefaults>();
	private _diagnosticsOptions: DiagnosticsOptions;
	private _modeConfiguration: ModeConfiguration;
	private _languageId: string;

	constructor(
		languageId: string,
		diagnosticsOptions: DiagnosticsOptions,
		modeConfiguration: ModeConfiguration
	) {
		this._languageId = languageId;
		this.setDiagnosticsOptions(diagnosticsOptions);
		this.setModeConfiguration(modeConfiguration);
	}

	get onDidChange(): IEvent<LanguageServiceDefaults> {
		return this._onDidChange.event;
	}

	get languageId(): string {
		return this._languageId;
	}

	get modeConfiguration(): ModeConfiguration {
		return this._modeConfiguration;
	}

	get diagnosticsOptions(): DiagnosticsOptions {
		return this._diagnosticsOptions;
	}

	setDiagnosticsOptions(options: DiagnosticsOptions): void {
		this._diagnosticsOptions = options || Object.create(null);
		this._onDidChange.fire(this);
	}

	setModeConfiguration(modeConfiguration: ModeConfiguration): void {
		this._modeConfiguration = modeConfiguration || Object.create(null);
		this._onDidChange.fire(this);
	}
}

const diagnosticDefault: Required<DiagnosticsOptions> = {
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
};

const modeConfigurationDefault: Required<ModeConfiguration> = {
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
};

export const cssDefaults: LanguageServiceDefaults = new LanguageServiceDefaultsImpl(
	'css',
	diagnosticDefault,
	modeConfigurationDefault
);
export const scssDefaults: LanguageServiceDefaults = new LanguageServiceDefaultsImpl(
	'scss',
	diagnosticDefault,
	modeConfigurationDefault
);
export const lessDefaults: LanguageServiceDefaults = new LanguageServiceDefaultsImpl(
	'less',
	diagnosticDefault,
	modeConfigurationDefault
);

// export to the global based API
(<any>languages).json = { cssDefaults, lessDefaults, scssDefaults };

// --- Registration to monaco editor ---

function getMode(): Promise<typeof mode> {
	return import('./cssMode');
}

languages.onLanguage('less', () => {
	getMode().then((mode) => mode.setupMode(lessDefaults));
});

languages.onLanguage('scss', () => {
	getMode().then((mode) => mode.setupMode(scssDefaults));
});

languages.onLanguage('css', () => {
	getMode().then((mode) => mode.setupMode(cssDefaults));
});
