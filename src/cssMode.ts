/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { WorkerManager } from './workerManager';
import { CSSWorker } from './cssWorker';
import { LanguageServiceDefaultsImpl } from './monaco.contribution';
import * as languageFeatures from './languageFeatures';

import Promise = monaco.Promise;
import Uri = monaco.Uri;

export function setupMode(defaults: LanguageServiceDefaultsImpl): void {

	const client = new WorkerManager(defaults);

	const worker = (first: Uri, ...more: Uri[]): Promise<CSSWorker> => {
		return client.getLanguageServiceWorker(...[first].concat(more));
	};

	let languageId = defaults.languageId;

	monaco.languages.registerCompletionItemProvider(languageId, new languageFeatures.CompletionAdapter(worker));
	monaco.languages.registerHoverProvider(languageId, new languageFeatures.HoverAdapter(worker));
	monaco.languages.registerDocumentHighlightProvider(languageId, new languageFeatures.DocumentHighlightAdapter(worker));
	monaco.languages.registerDefinitionProvider(languageId, new languageFeatures.DefinitionAdapter(worker));
	monaco.languages.registerReferenceProvider(languageId, new languageFeatures.ReferenceAdapter(worker));
	monaco.languages.registerDocumentSymbolProvider(languageId, new languageFeatures.DocumentSymbolAdapter(worker));
	monaco.languages.registerRenameProvider(languageId, new languageFeatures.RenameAdapter(worker));
	monaco.languages.registerColorProvider(languageId, new languageFeatures.DocumentColorAdapter(worker));
	new languageFeatures.DiagnostcsAdapter(languageId, worker);
}




