/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module monaco.languages.json {
    export interface DiagnosticsOptions {
        /**
         * If set, the validator will be enabled and perform syntax validation as well as schema based validation.
         */
        readonly validate?: boolean;
        /**
         * If set, comments are tolerated. If set to false, syntax errors will be emmited for comments.
         */
        readonly allowComments?: boolean;
        /**
         * A list of known schemas and/or associations of schemas to file names.
         */
        readonly schemas?: {
            /**
             * The URI of the schema, which is also the identifier of the schema.
             */
            readonly uri: string;
            /**
             * A list of file names that are associated to the schema. The '*' wildcard can be used. For example '*.schema.json', 'package.json'
             */
            readonly fileMatch?: string[];
            /**
             * The schema for the given URI.
             */
            readonly schema?: any;
        }[];
    }

    export interface LanguageServiceDefaults {
        readonly onDidChange: IEvent<LanguageServiceDefaults>;
        readonly diagnosticsOptions: DiagnosticsOptions;
        setDiagnosticsOptions(options: DiagnosticsOptions): void;
    }

    export var jsonDefaults: LanguageServiceDefaults;
}