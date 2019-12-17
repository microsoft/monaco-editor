/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { WorkerManager } from './workerManager';
import { HTMLWorker } from './htmlWorker';
import { LanguageServiceDefaultsImpl } from './monaco.contribution';
import * as languageFeatures from './languageFeatures';

import Uri = monaco.Uri;

export function setupMode(defaults: LanguageServiceDefaultsImpl): void {

	const client = new WorkerManager(defaults);

	const worker: languageFeatures.WorkerAccessor = (...uris: Uri[]): Promise<HTMLWorker> => {
		return client.getLanguageServiceWorker(...uris);
	};

	let languageId = defaults.languageId;

	// all modes
	monaco.languages.registerCompletionItemProvider(languageId, new languageFeatures.CompletionAdapter(worker));
	monaco.languages.registerHoverProvider(languageId, new languageFeatures.HoverAdapter(worker));

	monaco.languages.registerDocumentHighlightProvider(languageId, new languageFeatures.DocumentHighlightAdapter(worker));
	monaco.languages.registerLinkProvider(languageId, new languageFeatures.DocumentLinkAdapter(worker));
	monaco.languages.registerFoldingRangeProvider(languageId, new languageFeatures.FoldingRangeAdapter(worker));
	monaco.languages.registerDocumentSymbolProvider(languageId, new languageFeatures.DocumentSymbolAdapter(worker));
	monaco.languages.registerSelectionRangeProvider(languageId, new languageFeatures.SelectionRangeAdapter(worker));
	monaco.languages.registerRenameProvider(languageId, new languageFeatures.RenameAdapter(worker));

	// only html
	if (languageId === 'html') {
		monaco.languages.registerDocumentFormattingEditProvider(languageId, new languageFeatures.DocumentFormattingEditProvider(worker));
		monaco.languages.registerDocumentRangeFormattingEditProvider(languageId, new languageFeatures.DocumentRangeFormattingEditProvider(worker));
		new languageFeatures.DiagnosticsAdapter(languageId, worker, defaults);
	}

}
