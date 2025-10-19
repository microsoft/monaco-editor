/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as ts from '../../lib/typescriptServices';
import { fileNameIsLib } from './scriptHost';

export class FormattingModule {
	private _languageService: ts.LanguageService;

	constructor(languageService: ts.LanguageService) {
		this._languageService = languageService;
	}

	async getFormattingEditsForDocument(
		fileName: string,
		options: ts.FormatCodeOptions
	): Promise<ts.TextChange[]> {
		if (fileNameIsLib(fileName)) {
			return [];
		}
		return this._languageService.getFormattingEditsForDocument(fileName, options);
	}

	async getFormattingEditsForRange(
		fileName: string,
		start: number,
		end: number,
		options: ts.FormatCodeOptions
	): Promise<ts.TextChange[]> {
		if (fileNameIsLib(fileName)) {
			return [];
		}
		return this._languageService.getFormattingEditsForRange(fileName, start, end, options);
	}

	async getFormattingEditsAfterKeystroke(
		fileName: string,
		postion: number,
		ch: string,
		options: ts.FormatCodeOptions
	): Promise<ts.TextChange[]> {
		if (fileNameIsLib(fileName)) {
			return [];
		}
		return this._languageService.getFormattingEditsAfterKeystroke(fileName, postion, ch, options);
	}
}
