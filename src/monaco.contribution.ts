/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as mode from './htmlMode';
import { languages, Emitter, IEvent } from './fillers/monaco-editor-core';

export interface HTMLFormatConfiguration {
	readonly tabSize: number;
	readonly insertSpaces: boolean;
	readonly wrapLineLength: number;
	readonly unformatted: string;
	readonly contentUnformatted: string;
	readonly indentInnerHtml: boolean;
	readonly preserveNewLines: boolean;
	readonly maxPreserveNewLines: number;
	readonly indentHandlebars: boolean;
	readonly endWithNewline: boolean;
	readonly extraLiners: string;
	readonly wrapAttributes:
		| 'auto'
		| 'force'
		| 'force-aligned'
		| 'force-expand-multiline';
}

export interface CompletionConfiguration {
	[provider: string]: boolean;
}

export interface Options {
	/**
	 * If set, comments are tolerated. If set to false, syntax errors will be emitted for comments.
	 */
	readonly format?: HTMLFormatConfiguration;
	/**
	 * A list of known schemas and/or associations of schemas to file names.
	 */
	readonly suggest?: CompletionConfiguration;
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
	readonly links?: boolean;

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

	/**
	 * Defines whether the built-in documentFormattingEdit provider is enabled.
	 */
	readonly documentFormattingEdits?: boolean;

	/**
	 * Defines whether the built-in documentRangeFormattingEdit provider is enabled.
	 */
	readonly documentRangeFormattingEdits?: boolean;
}

export interface LanguageServiceDefaults {
	readonly languageId: string;
	readonly modeConfiguration: ModeConfiguration;
	readonly onDidChange: IEvent<LanguageServiceDefaults>;
	readonly options: Options;
	setOptions(options: Options): void;
}

// --- HTML configuration and defaults ---------

class LanguageServiceDefaultsImpl implements LanguageServiceDefaults {
	private _onDidChange = new Emitter<LanguageServiceDefaults>();
	private _options: Options;
	private _modeConfiguration: ModeConfiguration;
	private _languageId: string;

	constructor(
		languageId: string,
		options: Options,
		modeConfiguration: ModeConfiguration
	) {
		this._languageId = languageId;
		this.setOptions(options);
		this.setModeConfiguration(modeConfiguration);
	}

	get onDidChange(): IEvent<LanguageServiceDefaults> {
		return this._onDidChange.event;
	}

	get languageId(): string {
		return this._languageId;
	}

	get options(): Options {
		return this._options;
	}

	get modeConfiguration(): ModeConfiguration {
		return this._modeConfiguration;
	}

	setOptions(options: Options): void {
		this._options = options || Object.create(null);
		this._onDidChange.fire(this);
	}

	setModeConfiguration(modeConfiguration: ModeConfiguration): void {
		this._modeConfiguration = modeConfiguration || Object.create(null);
		this._onDidChange.fire(this);
	}
}

const formatDefaults: Required<HTMLFormatConfiguration> = {
	tabSize: 4,
	insertSpaces: false,
	wrapLineLength: 120,
	unformatted:
		'default": "a, abbr, acronym, b, bdo, big, br, button, cite, code, dfn, em, i, img, input, kbd, label, map, object, q, samp, select, small, span, strong, sub, sup, textarea, tt, var',
	contentUnformatted: 'pre',
	indentInnerHtml: false,
	preserveNewLines: true,
	maxPreserveNewLines: null,
	indentHandlebars: false,
	endWithNewline: false,
	extraLiners: 'head, body, /html',
	wrapAttributes: 'auto'
};

const htmlOptionsDefault: Required<Options> = {
	format: formatDefaults,
	suggest: { html5: true, angular1: true, ionic: true }
};

const handlebarOptionsDefault: Required<Options> = {
	format: formatDefaults,
	suggest: { html5: true }
};

const razorOptionsDefault: Required<Options> = {
	format: formatDefaults,
	suggest: { html5: true, razor: true }
};

function getConfigurationDefault(
	languageId: string
): Required<ModeConfiguration> {
	return {
		completionItems: true,
		hovers: true,
		documentSymbols: true,
		links: true,
		documentHighlights: true,
		rename: true,
		colors: true,
		foldingRanges: true,
		selectionRanges: true,
		diagnostics: languageId === htmlLanguageId, // turned off for Razor and Handlebar
		documentFormattingEdits: languageId === htmlLanguageId, // turned off for Razor and Handlebar
		documentRangeFormattingEdits: languageId === htmlLanguageId // turned off for Razor and Handlebar
	};
}

const htmlLanguageId = 'html';
const handlebarsLanguageId = 'handlebars';
const razorLanguageId = 'razor';

export const htmlDefaults: LanguageServiceDefaults = new LanguageServiceDefaultsImpl(
	htmlLanguageId,
	htmlOptionsDefault,
	getConfigurationDefault(htmlLanguageId)
);
export const handlebarDefaults: LanguageServiceDefaults = new LanguageServiceDefaultsImpl(
	handlebarsLanguageId,
	handlebarOptionsDefault,
	getConfigurationDefault(handlebarsLanguageId)
);
export const razorDefaults: LanguageServiceDefaults = new LanguageServiceDefaultsImpl(
	razorLanguageId,
	razorOptionsDefault,
	getConfigurationDefault(razorLanguageId)
);

// export to the global based API
(<any>languages).html = { htmlDefaults, razorDefaults, handlebarDefaults };

// --- Registration to monaco editor ---

function getMode(): Promise<typeof mode> {
	return import('./htmlMode');
}

languages.onLanguage(htmlLanguageId, () => {
	getMode().then((mode) => mode.setupMode(htmlDefaults));
});
languages.onLanguage(handlebarsLanguageId, () => {
	getMode().then((mode) => mode.setupMode(handlebarDefaults));
});
languages.onLanguage(razorLanguageId, () => {
	getMode().then((mode) => mode.setupMode(razorDefaults));
});
