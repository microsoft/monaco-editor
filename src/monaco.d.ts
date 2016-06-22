/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
declare module monaco.languages.css {
    export interface DiagnosticsOptions {
        validate?: boolean;
        lint?: {
			compatibleVendorPrefixes?: 'ignore' | 'warning' | 'error',
			vendorPrefix?: 'ignore' | 'warning' | 'error',
			duplicateProperties?: 'ignore' | 'warning' | 'error',
			emptyRules?: 'ignore' | 'warning' | 'error',
			importStatement?: 'ignore' | 'warning' | 'error',
			boxModel?: 'ignore' | 'warning' | 'error',
			universalSelector?: 'ignore' | 'warning' | 'error',
			zeroUnits?: 'ignore' | 'warning' | 'error',
			fontFaceProperties?: 'ignore' | 'warning' | 'error',
			hexColorLength?: 'ignore' | 'warning' | 'error',
			argumentsInColorFunction?: 'ignore' | 'warning' | 'error',
			unknownProperties?: 'ignore' | 'warning' | 'error',
			ieHack?: 'ignore' | 'warning' | 'error',
			unknownVendorSpecificProperties?: 'ignore' | 'warning' | 'error',
			propertyIgnoredDueToDisplay?: 'ignore' | 'warning' | 'error',
			important?: 'ignore' | 'warning' | 'error',
			float?: 'ignore' | 'warning' | 'error',
			idSelector?: 'ignore' | 'warning' | 'error'
		}
    }

    export interface LanguageServiceDefaults {
        onDidChange: IEvent<LanguageServiceDefaults>;
        diagnosticsOptions: DiagnosticsOptions;
        setDiagnosticsOptions(options: DiagnosticsOptions): void;
    }

    export var cssDefaults: LanguageServiceDefaults;
    export var lessDefaults: LanguageServiceDefaults;
	export var scssDefaults: LanguageServiceDefaults;
}