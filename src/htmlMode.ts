/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { WorkerManager } from './workerManager';
import { HTMLWorker } from './htmlWorker';
import { LanguageServiceDefaultsImpl } from './monaco.contribution';
import * as languageFeatures from './languageFeatures';

import Promise = monaco.Promise;
import Uri = monaco.Uri;

export function setupMode(defaults: LanguageServiceDefaultsImpl): void {

	const client = new WorkerManager(defaults);

	const worker: languageFeatures.WorkerAccessor = (...uris: Uri[]): Promise<HTMLWorker> => {
		return client.getLanguageServiceWorker(...uris);
	};

	let languageId = defaults.languageId;

	// all modes
	monaco.languages.registerCompletionItemProvider(languageId, new languageFeatures.CompletionAdapter(worker));
	monaco.languages.registerDocumentHighlightProvider(languageId, new languageFeatures.DocumentHighlightAdapter(worker));
	monaco.languages.registerLinkProvider(languageId, new languageFeatures.DocumentLinkAdapter(worker));
	monaco.languages.registerFoldingRangeProvider(languageId, new languageFeatures.FoldingRangeAdapter(worker));

	// only html
	if (languageId === 'html') {
		monaco.languages.registerDocumentFormattingEditProvider(languageId, new languageFeatures.DocumentFormattingEditProvider(worker));
		monaco.languages.registerDocumentRangeFormattingEditProvider(languageId, new languageFeatures.DocumentRangeFormattingEditProvider(worker));
		new languageFeatures.DiagnosticsAdapter(languageId, worker, defaults);
	}

}
