/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { WorkerManager } from './workerManager';
import type { TypeScriptWorker } from './tsWorker';
import { LanguageServiceDefaults } from './register';
import * as languageFeatures from './languageFeatures';
import { languages, IDisposable, Uri } from '../../../editor';

let javaScriptWorker: (...uris: Uri[]) => Promise<TypeScriptWorker>;
let typeScriptWorker: (...uris: Uri[]) => Promise<TypeScriptWorker>;

export function setupTypeScript(defaults: LanguageServiceDefaults): void {
	typeScriptWorker = setupMode(defaults, 'typescript');
}

export function setupJavaScript(defaults: LanguageServiceDefaults): void {
	javaScriptWorker = setupMode(defaults, 'javascript');
}

export function getJavaScriptWorker(): Promise<(...uris: Uri[]) => Promise<TypeScriptWorker>> {
	return new Promise((resolve, reject) => {
		if (!javaScriptWorker) {
			return reject('JavaScript not registered!');
		}

		resolve(javaScriptWorker);
	});
}

export function getTypeScriptWorker(): Promise<(...uris: Uri[]) => Promise<TypeScriptWorker>> {
	return new Promise((resolve, reject) => {
		if (!typeScriptWorker) {
			return reject('TypeScript not registered!');
		}

		resolve(typeScriptWorker);
	});
}

function setupMode(
	defaults: LanguageServiceDefaults,
	modeId: string
): (...uris: Uri[]) => Promise<TypeScriptWorker> {
	const disposables: IDisposable[] = [];
	const providers: IDisposable[] = [];

	const client = new WorkerManager(modeId, defaults);
	disposables.push(client);

	const worker = (...uris: Uri[]): Promise<TypeScriptWorker> => {
		return client.getLanguageServiceWorker(...uris);
	};

	const libFiles = new languageFeatures.LibFiles(worker);

	function registerProviders(): void {
		const { modeConfiguration } = defaults;

		disposeAll(providers);

		if (modeConfiguration.completionItems) {
			providers.push(
				languages.registerCompletionItemProvider(
					modeId,
					new languageFeatures.SuggestAdapter(worker)
				)
			);
		}
		if (modeConfiguration.signatureHelp) {
			providers.push(
				languages.registerSignatureHelpProvider(
					modeId,
					new languageFeatures.SignatureHelpAdapter(worker)
				)
			);
		}
		if (modeConfiguration.hovers) {
			providers.push(
				languages.registerHoverProvider(modeId, new languageFeatures.QuickInfoAdapter(worker))
			);
		}
		if (modeConfiguration.documentHighlights) {
			providers.push(
				languages.registerDocumentHighlightProvider(
					modeId,
					new languageFeatures.DocumentHighlightAdapter(worker)
				)
			);
		}
		if (modeConfiguration.definitions) {
			providers.push(
				languages.registerDefinitionProvider(
					modeId,
					new languageFeatures.DefinitionAdapter(libFiles, worker)
				)
			);
		}
		if (modeConfiguration.references) {
			providers.push(
				languages.registerReferenceProvider(
					modeId,
					new languageFeatures.ReferenceAdapter(libFiles, worker)
				)
			);
		}
		if (modeConfiguration.documentSymbols) {
			providers.push(
				languages.registerDocumentSymbolProvider(
					modeId,
					new languageFeatures.OutlineAdapter(worker)
				)
			);
		}
		if (modeConfiguration.rename) {
			providers.push(
				languages.registerRenameProvider(
					modeId,
					new languageFeatures.RenameAdapter(libFiles, worker)
				)
			);
		}
		if (modeConfiguration.documentRangeFormattingEdits) {
			providers.push(
				languages.registerDocumentRangeFormattingEditProvider(
					modeId,
					new languageFeatures.FormatAdapter(worker)
				)
			);
		}
		if (modeConfiguration.onTypeFormattingEdits) {
			providers.push(
				languages.registerOnTypeFormattingEditProvider(
					modeId,
					new languageFeatures.FormatOnTypeAdapter(worker)
				)
			);
		}
		if (modeConfiguration.codeActions) {
			providers.push(
				languages.registerCodeActionProvider(modeId, new languageFeatures.CodeActionAdaptor(worker))
			);
		}
		if (modeConfiguration.inlayHints) {
			providers.push(
				languages.registerInlayHintsProvider(modeId, new languageFeatures.InlayHintsAdapter(worker))
			);
		}
		if (modeConfiguration.diagnostics) {
			providers.push(new languageFeatures.DiagnosticsAdapter(libFiles, defaults, modeId, worker));
		}
	}

	registerProviders();

	disposables.push(asDisposable(providers));

	//return asDisposable(disposables);

	return worker;
}

function asDisposable(disposables: IDisposable[]): IDisposable {
	return { dispose: () => disposeAll(disposables) };
}

function disposeAll(disposables: IDisposable[]) {
	while (disposables.length) {
		disposables.pop()!.dispose();
	}
}

export { WorkerManager } from './workerManager';
export * from './languageFeatures';
