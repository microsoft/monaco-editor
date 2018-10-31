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

    export interface LanguageServiceDefaults {
        readonly onDidChange: IEvent<LanguageServiceDefaults>;
        readonly options: Options;
        setOptions(options: Options): void;
    }

    export var htmlDefaults: LanguageServiceDefaults;
    export var handlebarDefaults: LanguageServiceDefaults;
    export var razorDefaults: LanguageServiceDefaults;
}