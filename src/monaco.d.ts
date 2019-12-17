/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module monaco.languages.html {
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
		readonly wrapAttributes: 'auto' | 'force' | 'force-aligned' | 'force-expand-multiline';
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
		readonly onDidChange: IEvent<LanguageServiceDefaults>;
		readonly options: Options;
		setOptions(options: Options): void;
	}

	export var htmlDefaults: LanguageServiceDefaults;
	export var handlebarDefaults: LanguageServiceDefaults;
	export var razorDefaults: LanguageServiceDefaults;
}