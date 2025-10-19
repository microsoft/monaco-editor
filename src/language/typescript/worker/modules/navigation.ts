/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as ts from '../../lib/typescriptServices';
import { fileNameIsLib } from './scriptHost';

export class NavigationModule {
	private _languageService: ts.LanguageService;

	constructor(languageService: ts.LanguageService) {
		this._languageService = languageService;
	}

	async getQuickInfoAtPosition(
		fileName: string,
		position: number
	): Promise<ts.QuickInfo | undefined> {
		if (fileNameIsLib(fileName)) {
			return undefined;
		}
		return this._languageService.getQuickInfoAtPosition(fileName, position);
	}

	async getDocumentHighlights(
		fileName: string,
		position: number,
		filesToSearch: string[]
	): Promise<ReadonlyArray<ts.DocumentHighlights> | undefined> {
		if (fileNameIsLib(fileName)) {
			return undefined;
		}
		return this._languageService.getDocumentHighlights(fileName, position, filesToSearch);
	}

	async getDefinitionAtPosition(
		fileName: string,
		position: number
	): Promise<ReadonlyArray<ts.DefinitionInfo> | undefined> {
		if (fileNameIsLib(fileName)) {
			return undefined;
		}
		return this._languageService.getDefinitionAtPosition(fileName, position);
	}

	async getReferencesAtPosition(
		fileName: string,
		position: number
	): Promise<ts.ReferenceEntry[] | undefined> {
		if (fileNameIsLib(fileName)) {
			return undefined;
		}
		return this._languageService.getReferencesAtPosition(fileName, position);
	}

	async getNavigationTree(fileName: string): Promise<ts.NavigationTree | undefined> {
		if (fileNameIsLib(fileName)) {
			return undefined;
		}
		return this._languageService.getNavigationTree(fileName);
	}
}
