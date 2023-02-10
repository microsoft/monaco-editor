import { IEvent, IDisposable } from '../../fillers/monaco-editor-core';
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
export declare const htmlLanguageService: LanguageServiceRegistration;
export declare const htmlDefaults: LanguageServiceDefaults;
export declare const handlebarLanguageService: LanguageServiceRegistration;
export declare const handlebarDefaults: LanguageServiceDefaults;
export declare const razorLanguageService: LanguageServiceRegistration;
export declare const razorDefaults: LanguageServiceDefaults;
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
export declare function registerHTMLLanguageService(languageId: string, options?: Options, modeConfiguration?: ModeConfiguration): LanguageServiceRegistration;
export interface HTMLDataConfiguration {
    /**
     * Defines whether the standard HTML tags and attributes are shown
     */
    readonly useDefaultDataProvider?: boolean;
    /**
     * Provides a set of custom data providers.
     */
    readonly dataProviders?: {
        [providerId: string]: HTMLDataV1;
    };
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
