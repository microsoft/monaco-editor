/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as ts from '../../lib/typescriptServices';
import { fileNameIsLib } from './scriptHost';

export class CompletionsModule {
	private _languageService: ts.LanguageService;

	constructor(languageService: ts.LanguageService) {
		this._languageService = languageService;
	}

	async getCompletionsAtPosition(
		fileName: string,
		position: number
	): Promise<ts.CompletionInfo | undefined> {
		if (fileNameIsLib(fileName)) {
			return undefined;
		}
		return this._languageService.getCompletionsAtPosition(fileName, position, undefined);
	}

	async getCompletionEntryDetails(
		fileName: string,
		position: number,
		entry: string
	): Promise<ts.CompletionEntryDetails | undefined> {
		return this._languageService.getCompletionEntryDetails(
			fileName,
			position,
			entry,
			undefined,
			undefined,
			undefined,
			undefined
		);
	}

	async getSignatureHelpItems(
		fileName: string,
		position: number,
		options: ts.SignatureHelpItemsOptions | undefined
	): Promise<ts.SignatureHelpItems | undefined> {
		if (fileNameIsLib(fileName)) {
			return undefined;
		}
		return this._languageService.getSignatureHelpItems(fileName, position, options);
	}
}
