/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module monaco.languages.html {
    export interface HTMLFormatConfiguration {
        tabSize: number;
        insertSpaces: boolean;
        wrapLineLength: number;
        unformatted: string;
        indentInnerHtml: boolean;
        preserveNewLines: boolean;
        maxPreserveNewLines: number;
        indentHandlebars: boolean;
        endWithNewline: boolean;
        extraLiners: string;
    }

    export interface CompletionConfiguration {
        [provider: string]: boolean;
    }

    export interface Options {
        /**
         * If set, comments are tolerated. If set to false, syntax errors will be emmited for comments.
         */
        format?: HTMLFormatConfiguration;
        /**
         * A list of known schemas and/or associations of schemas to file names.
         */
        suggest?: CompletionConfiguration;
    }

    export interface LanguageServiceDefaults {
        onDidChange: IEvent<LanguageServiceDefaults>;
        options: Options;
        setOptions(options: Options): void;
    }

    export var htmlDefaults: LanguageServiceDefaults;
    export var handlebarDefaults: LanguageServiceDefaults;
    export var razorDefaults: LanguageServiceDefaults;
}