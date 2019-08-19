/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { WorkerManager } from './workerManager';
import { JSONWorker } from './jsonWorker';
import { LanguageServiceDefaultsImpl } from './monaco.contribution';
import * as languageFeatures from './languageFeatures';
import { createTokenizationSupport } from './tokenization';

import Uri = monaco.Uri;
import IDisposable = monaco.IDisposable;

export function setupMode(defaults: LanguageServiceDefaultsImpl): void {

	const disposables: IDisposable[] = [];
	let formattingDisposables: IDisposable[] = []

	const client = new WorkerManager(defaults);
	disposables.push(client);

	const worker: languageFeatures.WorkerAccessor = (...uris: Uri[]): Promise<JSONWorker> => {
		return client.getLanguageServiceWorker(...uris);
	};

	const {languageId, capabilities} = defaults;

	function registerFormattingDisposables() {
		formattingDisposables.push(monaco.languages.registerDocumentFormattingEditProvider(languageId, new languageFeatures.DocumentFormattingEditProvider(worker)));
		formattingDisposables.push(monaco.languages.registerDocumentRangeFormattingEditProvider(languageId, new languageFeatures.DocumentRangeFormattingEditProvider(worker)));
	}

	if (!capabilities.disableDefaultFormatter) {
		registerFormattingDisposables()
	}

	disposables.push(monaco.languages.registerCompletionItemProvider(languageId, new languageFeatures.CompletionAdapter(worker)));
	disposables.push(monaco.languages.registerHoverProvider(languageId, new languageFeatures.HoverAdapter(worker)));
	disposables.push(monaco.languages.registerDocumentSymbolProvider(languageId, new languageFeatures.DocumentSymbolAdapter(worker)));
	disposables.push(new languageFeatures.DiagnosticsAdapter(languageId, worker, defaults));
	disposables.push(monaco.languages.setTokensProvider(languageId, createTokenizationSupport(true)));
	disposables.push(monaco.languages.setLanguageConfiguration(languageId, richEditConfiguration));
	disposables.push(monaco.languages.registerColorProvider(languageId, new languageFeatures.DocumentColorAdapter(worker)));
	disposables.push(monaco.languages.registerFoldingRangeProvider(languageId, new languageFeatures.FoldingRangeAdapter(worker)));

	defaults.onDidChange((newDefaults) => {
		const {capabilities} = newDefaults;
		const formattingDisabled = formattingDisposables.length === 0;
		if (formattingDisabled != capabilities.disableDefaultFormatter) {
			if (capabilities.disableDefaultFormatter) {
				formattingDisposables.forEach(d => d.dispose())
				formattingDisposables = [];
			} else {
				registerFormattingDisposables();
			}
		}
	})
}


const richEditConfiguration: monaco.languages.LanguageConfiguration = {
	wordPattern: /(-?\d*\.\d\w*)|([^\[\{\]\}\:\"\,\s]+)/g,

	comments: {
		lineComment: '//',
		blockComment: ['/*', '*/']
	},

	brackets: [
		['{', '}'],
		['[', ']']
	],

	autoClosingPairs: [
		{ open: '{', close: '}', notIn: ['string'] },
		{ open: '[', close: ']', notIn: ['string'] },
		{ open: '"', close: '"', notIn: ['string'] }
	]
};

