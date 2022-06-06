/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { WorkerManager } from './workerManager';
import type { JSONWorker } from './jsonWorker';
import { LanguageServiceDefaults } from './monaco.contribution';
import * as languageFeatures from '../common/lspLanguageFeatures';
import { createTokenizationSupport } from './tokenization';
import { Uri, IDisposable, languages, editor } from '../../fillers/monaco-editor-core';

class JSONDiagnosticsAdapter extends languageFeatures.DiagnosticsAdapter<JSONWorker> {
	constructor(
		languageId: string,
		worker: languageFeatures.WorkerAccessor<JSONWorker>,
		defaults: LanguageServiceDefaults
	) {
		super(languageId, worker, defaults.onDidChange);

		this._disposables.push(
			editor.onWillDisposeModel((model) => {
				this._resetSchema(model.uri);
			})
		);
		this._disposables.push(
			editor.onDidChangeModelLanguage((event) => {
				this._resetSchema(event.model.uri);
			})
		);
	}

	private _resetSchema(resource: Uri): void {
		this._worker().then((worker) => {
			worker.resetSchema(resource.toString());
		});
	}
}

export function setupMode(defaults: LanguageServiceDefaults): IDisposable {
	const disposables: IDisposable[] = [];
	const providers: IDisposable[] = [];

	const client = new WorkerManager(defaults);
	disposables.push(client);

	const worker: languageFeatures.WorkerAccessor<JSONWorker> = (
		...uris: Uri[]
	): Promise<JSONWorker> => {
		return client.getLanguageServiceWorker(...uris);
	};

	function registerProviders(): void {
		const { languageId, modeConfiguration } = defaults;

		disposeAll(providers);

		if (modeConfiguration.documentFormattingEdits) {
			providers.push(
				languages.registerDocumentFormattingEditProvider(
					languageId,
					new languageFeatures.DocumentFormattingEditProvider(worker)
				)
			);
		}
		if (modeConfiguration.documentRangeFormattingEdits) {
			providers.push(
				languages.registerDocumentRangeFormattingEditProvider(
					languageId,
					new languageFeatures.DocumentRangeFormattingEditProvider(worker)
				)
			);
		}
		if (modeConfiguration.completionItems) {
			providers.push(
				languages.registerCompletionItemProvider(
					languageId,
					new languageFeatures.CompletionAdapter(worker, [' ', ':', '"'])
				)
			);
		}
		if (modeConfiguration.hovers) {
			providers.push(
				languages.registerHoverProvider(languageId, new languageFeatures.HoverAdapter(worker))
			);
		}
		if (modeConfiguration.documentSymbols) {
			providers.push(
				languages.registerDocumentSymbolProvider(
					languageId,
					new languageFeatures.DocumentSymbolAdapter(worker)
				)
			);
		}
		if (modeConfiguration.tokens) {
			providers.push(languages.setTokensProvider(languageId, createTokenizationSupport(true)));
		}
		if (modeConfiguration.colors) {
			providers.push(
				languages.registerColorProvider(
					languageId,
					new languageFeatures.DocumentColorAdapter(worker)
				)
			);
		}
		if (modeConfiguration.foldingRanges) {
			providers.push(
				languages.registerFoldingRangeProvider(
					languageId,
					new languageFeatures.FoldingRangeAdapter(worker)
				)
			);
		}
		if (modeConfiguration.diagnostics) {
			providers.push(new JSONDiagnosticsAdapter(languageId, worker, defaults));
		}
		if (modeConfiguration.selectionRanges) {
			providers.push(
				languages.registerSelectionRangeProvider(
					languageId,
					new languageFeatures.SelectionRangeAdapter(worker)
				)
			);
		}
	}

	registerProviders();

	disposables.push(languages.setLanguageConfiguration(defaults.languageId, richEditConfiguration));

	let modeConfiguration = defaults.modeConfiguration;
	defaults.onDidChange((newDefaults) => {
		if (newDefaults.modeConfiguration !== modeConfiguration) {
			modeConfiguration = newDefaults.modeConfiguration;
			registerProviders();
		}
	});

	disposables.push(asDisposable(providers));

	return asDisposable(disposables);
}

function asDisposable(disposables: IDisposable[]): IDisposable {
	return { dispose: () => disposeAll(disposables) };
}

function disposeAll(disposables: IDisposable[]) {
	while (disposables.length) {
		disposables.pop()!.dispose();
	}
}

const richEditConfiguration: languages.LanguageConfiguration = {
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

export { WorkerManager } from './workerManager';
export * from '../common/lspLanguageFeatures';
