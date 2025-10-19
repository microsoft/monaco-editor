/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as ts from '../../lib/typescriptServices';
import { fileNameIsLib } from './scriptHost';

export class InlayHintsModule {
	private _languageService: ts.LanguageService;
	private _inlayHintsOptions?: ts.UserPreferences;

	constructor(languageService: ts.LanguageService, inlayHintsOptions?: ts.UserPreferences) {
		this._languageService = languageService;
		this._inlayHintsOptions = inlayHintsOptions;
	}

	async provideInlayHints(
		fileName: string,
		start: number,
		end: number
	): Promise<readonly ts.InlayHint[]> {
		if (fileNameIsLib(fileName)) {
			return [];
		}
		const preferences: ts.UserPreferences = this._inlayHintsOptions ?? {};
		const span: ts.TextSpan = {
			start,
			length: end - start
		};

		try {
			return this._languageService.provideInlayHints(fileName, span, preferences);
		} catch {
			return [];
		}
	}

	updateInlayHintsOptions(options: ts.UserPreferences): void {
		this._inlayHintsOptions = options;
	}
}
