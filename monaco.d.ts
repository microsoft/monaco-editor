/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/// <reference path="node_modules/monaco-editor-core/monaco.d.ts" />

declare namespace monaco.languages.css {
	export interface Options {
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
		/**
		 * Configures the CSS data types known by the langauge service.
		 */
		readonly data?: CSSDataConfiguration;
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
		readonly modeConfiguration: ModeConfiguration;
		readonly options: Options;
		setOptions(options: Options): void;
		setModeConfiguration(modeConfiguration: ModeConfiguration): void;
		/** @deprecated Use options instead */
		readonly diagnosticsOptions: DiagnosticsOptions;
		/** @deprecated Use setOptions instead */
		setDiagnosticsOptions(options: DiagnosticsOptions): void;
	}
	/** @deprecated Use Options instead */
	export type DiagnosticsOptions = Options;
	export const cssDefaults: LanguageServiceDefaults;
	export const scssDefaults: LanguageServiceDefaults;
	export const lessDefaults: LanguageServiceDefaults;
	export interface CSSDataConfiguration {
		/**
		 * Defines whether the standard CSS properties, at-directives, pseudoClasses and pseudoElements are shown.
		 */
		useDefaultDataProvider?: boolean;
		/**
		 * Provides a set of custom data providers.
		 */
		dataProviders?: {
			[providerId: string]: CSSDataV1;
		};
	}
	/**
	 * Custom CSS properties, at-directives, pseudoClasses and pseudoElements
	 * https://github.com/microsoft/vscode-css-languageservice/blob/main/docs/customData.md
	 */
	export interface CSSDataV1 {
		version: 1 | 1.1;
		properties?: IPropertyData[];
		atDirectives?: IAtDirectiveData[];
		pseudoClasses?: IPseudoClassData[];
		pseudoElements?: IPseudoElementData[];
	}
	export type EntryStatus = 'standard' | 'experimental' | 'nonstandard' | 'obsolete';
	export interface IReference {
		name: string;
		url: string;
	}
	export interface IPropertyData {
		name: string;
		description?: string | MarkupContent;
		browsers?: string[];
		restrictions?: string[];
		status?: EntryStatus;
		syntax?: string;
		values?: IValueData[];
		references?: IReference[];
		relevance?: number;
	}
	export interface IAtDirectiveData {
		name: string;
		description?: string | MarkupContent;
		browsers?: string[];
		status?: EntryStatus;
		references?: IReference[];
	}
	export interface IPseudoClassData {
		name: string;
		description?: string | MarkupContent;
		browsers?: string[];
		status?: EntryStatus;
		references?: IReference[];
	}
	export interface IPseudoElementData {
		name: string;
		description?: string | MarkupContent;
		browsers?: string[];
		status?: EntryStatus;
		references?: IReference[];
	}
	export interface IValueData {
		name: string;
		description?: string | MarkupContent;
		browsers?: string[];
		status?: EntryStatus;
		references?: IReference[];
	}
	export interface MarkupContent {
		kind: MarkupKind;
		value: string;
	}
	export type MarkupKind = 'plaintext' | 'markdown';
}
