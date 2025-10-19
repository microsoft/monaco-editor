/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as ts from '../../lib/typescriptServices';
import { fileNameIsLib } from './scriptHost';

export class RefactoringModule {
	private _languageService: ts.LanguageService;

	constructor(languageService: ts.LanguageService) {
		this._languageService = languageService;
	}

	async findRenameLocations(
		fileName: string,
		position: number,
		findInStrings: boolean,
		findInComments: boolean,
		providePrefixAndSuffixTextForRename: boolean
	): Promise<readonly ts.RenameLocation[] | undefined> {
		if (fileNameIsLib(fileName)) {
			return undefined;
		}
		return this._languageService.findRenameLocations(
			fileName,
			position,
			findInStrings,
			findInComments,
			providePrefixAndSuffixTextForRename
		);
	}

	async getRenameInfo(
		fileName: string,
		position: number,
		options: ts.RenameInfoOptions
	): Promise<ts.RenameInfo> {
		if (fileNameIsLib(fileName)) {
			return { canRename: false, localizedErrorMessage: 'Cannot rename in lib file' };
		}
		return this._languageService.getRenameInfo(fileName, position, options);
	}

	async getCodeFixesAtPosition(
		fileName: string,
		start: number,
		end: number,
		errorCodes: number[],
		formatOptions: ts.FormatCodeOptions
	): Promise<ReadonlyArray<ts.CodeFixAction>> {
		if (fileNameIsLib(fileName)) {
			return [];
		}
		const preferences = {};
		try {
			return this._languageService.getCodeFixesAtPosition(
				fileName,
				start,
				end,
				errorCodes,
				formatOptions,
				preferences
			);
		} catch {
			return [];
		}
	}
}
