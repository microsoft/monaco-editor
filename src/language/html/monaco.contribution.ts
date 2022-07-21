/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as mode from './htmlMode';
import { languages, Emitter, IEvent, IDisposable } from '../../fillers/monaco-editor-core';

export interface HTMLFormatConfiguration {
	readonly tabSize: number;
	readonly insertSpaces: boolean;
	readonly wrapLineLength: number;
	readonly unformatted: string;
	readonly contentUnformatted: string;
	readonly indentInnerHtml: boolean;
	readonly preserveNewLines: boolean;
	readonly maxPreserveNewLines: number | undefined;
	readonly indentHandlebars: boolean;
	readonly endWithNewline: boolean;
	readonly extraLiners: string;
	readonly wrapAttributes: 'auto' | 'force' | 'force-aligned' | 'force-expand-multiline';
}

export interface CompletionConfiguration {
	readonly [providerId: string]: boolean;
}

export interface Options {
	/**
	 * Settings for the HTML formatter.
	 */
	readonly format?: HTMLFormatConfiguration;
	/**
	 * Code completion settings.
	 */
	readonly suggest?: CompletionConfiguration;
	/**
	 * Configures the HTML data types known by the HTML langauge service.
	 */
	readonly data?: HTMLDataConfiguration;
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
	setModeConfiguration(modeConfiguration: ModeConfiguration): void;
}
// --- HTML configuration and defaults ---------

class LanguageServiceDefaultsImpl implements LanguageServiceDefaults {
	private _onDidChange = new Emitter<LanguageServiceDefaults>();
	private _options!: Options;
	private _modeConfiguration!: ModeConfiguration;
	private _languageId: string;

	constructor(languageId: string, options: Options, modeConfiguration: ModeConfiguration) {
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
	maxPreserveNewLines: undefined,
	indentHandlebars: false,
	endWithNewline: false,
	extraLiners: 'head, body, /html',
	wrapAttributes: 'auto'
};

const optionsDefault: Required<Options> = {
	format: formatDefaults,
	suggest: {},
	data: { useDefaultDataProvider: true }
};

function getConfigurationDefault(languageId: string): Required<ModeConfiguration> {
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

export const htmlLanguageService = registerHTMLLanguageService(
	htmlLanguageId,
	optionsDefault,
	getConfigurationDefault(htmlLanguageId)
);
export const htmlDefaults = htmlLanguageService.defaults;

export const handlebarLanguageService = registerHTMLLanguageService(
	handlebarsLanguageId,
	optionsDefault,
	getConfigurationDefault(handlebarsLanguageId)
);
export const handlebarDefaults = handlebarLanguageService.defaults;

export const razorLanguageService = registerHTMLLanguageService(
	razorLanguageId,
	optionsDefault,
	getConfigurationDefault(razorLanguageId)
);
export const razorDefaults = razorLanguageService.defaults;

// export to the global based API
(<any>languages).html = {
	htmlDefaults,
	razorDefaults,
	handlebarDefaults,
	htmlLanguageService,
	handlebarLanguageService,
	razorLanguageService,
	registerHTMLLanguageService
};

// --- Registration to monaco editor ---

declare var AMD: any;
declare var require: any;

function getMode(): Promise<typeof mode> {
	if (AMD) {
		return new Promise((resolve, reject) => {
			require(['vs/language/html/htmlMode'], resolve, reject);
		});
	} else {
		return import('./htmlMode');
	}
}

export interface LanguageServiceRegistration extends IDisposable {
	readonly defaults: LanguageServiceDefaults;
}

/**
 * Registers a new HTML language service for the languageId.
 * Note: 'html', 'handlebar' and 'razor' are registered by default.
 *
 * Use this method to register additional language ids with a HTML service.
 * The language server has to be registered before an editor model is opened.
 */
export function registerHTMLLanguageService(
	languageId: string,
	options: Options = optionsDefault,
	modeConfiguration: ModeConfiguration = getConfigurationDefault(languageId)
): LanguageServiceRegistration {
	const defaults = new LanguageServiceDefaultsImpl(languageId, options, modeConfiguration);
	let mode: IDisposable | undefined;

	// delay the initalization of the mode until the language is accessed the first time
	const onLanguageListener = languages.onLanguage(languageId, async () => {
		mode = (await getMode()).setupMode(defaults);
	});
	return {
		defaults,
		dispose() {
			onLanguageListener.dispose();
			mode?.dispose();
			mode = undefined;
		}
	};
}

export interface HTMLDataConfiguration {
	/**
	 * Defines whether the standard HTML tags and attributes are shown
	 */
	readonly useDefaultDataProvider?: boolean;
	/**
	 * Provides a set of custom data providers.
	 */
	readonly dataProviders?: { [providerId: string]: HTMLDataV1 };
}

/**
 * Custom HTML tags attributes and attribute values
 * https://github.com/microsoft/vscode-html-languageservice/blob/main/docs/customData.md
 */
export interface HTMLDataV1 {
	readonly version: 1 | 1.1;
	readonly tags?: ITagData[];
	readonly globalAttributes?: IAttributeData[];
	readonly valueSets?: IValueSet[];
}

export interface IReference {
	readonly name: string;
	readonly url: string;
}
export interface ITagData {
	readonly name: string;
	readonly description?: string | MarkupContent;
	readonly attributes: IAttributeData[];
	readonly references?: IReference[];
}
export interface IAttributeData {
	readonly name: string;
	readonly description?: string | MarkupContent;
	readonly valueSet?: string;
	readonly values?: IValueData[];
	readonly references?: IReference[];
}
export interface IValueData {
	readonly name: string;
	readonly description?: string | MarkupContent;
	readonly references?: IReference[];
}
export interface IValueSet {
	readonly name: string;
	readonly values: IValueData[];
}
export interface MarkupContent {
	readonly kind: MarkupKind;
	readonly value: string;
}
export declare type MarkupKind = 'plaintext' | 'markdown';
