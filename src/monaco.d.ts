/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module monaco.languages.json {
    export interface DiagnosticsOptions {
        /**
         * If set, the validator will return syntax errors.
         */
        validate?: boolean;
        /**
         * If set, comments are toleranted. If not set, a syntax error is emmited for comments.
         */
        allowComments?: boolean;
        /**
         * A list of known schemas and/or associations of schemas to file names.
         */
        schemas?: {
            /**
             * The URI of the schema, which is also the identifier of the schema.
             */
            uri: string;
            /**
             * A list of file names that are associated to the schema. The '*' wildcard can be used. For example '*.schema.json', 'package.json'
             */
            fileMatch?: string[];
            /**
             * The schema for the given URI.
             */
            schema?: any;
        }[];
    }

    export interface LanguageServiceDefaults {
        onDidChange: IEvent<LanguageServiceDefaults>;
        diagnosticsOptions: DiagnosticsOptions;
        setDiagnosticsOptions(options: DiagnosticsOptions): void;
    }

    export var jsonDefaults: LanguageServiceDefaults;
}