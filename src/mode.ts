/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import {Language, createTokenizationSupport} from './tokenization';
import {LanguageServiceDefaults, typeScriptDefaults, javaScriptDefaults, LanguageServiceMode} from './typescript';
import {WorkerManager} from './workerManager';
import {TypeScriptWorker} from './worker';
import * as languageFeatures from './languageFeatures';

import Promise = monaco.Promise;
import Uri = monaco.Uri;
import IDisposable = monaco.IDisposable;

export function setupTypeScript(): void {
	setupMode(
		typeScriptDefaults,
		'typescript',
		Language.TypeScript
	);
}

export function setupJavaScript(): void {
	setupMode(
		javaScriptDefaults,
		'javascript',
		Language.EcmaScript5
	);
}

function setupMode(defaults:LanguageServiceDefaults, modeId:string, language:Language): void {

	let disposables: IDisposable[] = [];

	const client = new WorkerManager(defaults);
	disposables.push(client);

	const worker = (first: Uri, ...more: Uri[]): Promise<TypeScriptWorker> => {
		return client.getLanguageServiceWorker(...[first].concat(more));
	};

	disposables.push(monaco.languages.registerCompletionItemProvider(modeId, new languageFeatures.SuggestAdapter(worker)));
	disposables.push(monaco.languages.registerSignatureHelpProvider(modeId, new languageFeatures.SignatureHelpAdapter(worker)));
	disposables.push(monaco.languages.registerHoverProvider(modeId, new languageFeatures.QuickInfoAdapter(worker)));
	disposables.push(monaco.languages.registerDocumentHighlightProvider(modeId, new languageFeatures.OccurrencesAdapter(worker)));
	disposables.push(monaco.languages.registerDefinitionProvider(modeId, new languageFeatures.DefinitionAdapter(worker)));
	disposables.push(monaco.languages.registerReferenceProvider(modeId, new languageFeatures.ReferenceAdapter(worker)));
	disposables.push(monaco.languages.registerDocumentSymbolProvider(modeId, new languageFeatures.OutlineAdapter(worker)));
	disposables.push(monaco.languages.registerDocumentRangeFormattingEditProvider(modeId, new languageFeatures.FormatAdapter(worker)));
	disposables.push(monaco.languages.registerOnTypeFormattingEditProvider(modeId, new languageFeatures.FormatOnTypeAdapter(worker)));
	disposables.push(new languageFeatures.DiagnostcsAdapter(defaults, modeId, worker));
	disposables.push(monaco.languages.setLanguageConfiguration(modeId, richEditConfiguration));
	disposables.push(monaco.languages.setTokensProvider(modeId, createTokenizationSupport(language)));
}

const richEditConfiguration:monaco.languages.IRichLanguageConfiguration = {
	wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,

	comments: {
		lineComment: '//',
		blockComment: ['/*', '*/']
	},

	brackets: [
		['{', '}'],
		['[', ']'],
		['(', ')']
	],

	onEnterRules: [
		{
			// e.g. /** | */
			beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
			afterText: /^\s*\*\/$/,
			action: { indentAction: monaco.languages.IndentAction.IndentOutdent, appendText: ' * ' }
		},
		{
			// e.g. /** ...|
			beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
			action: { indentAction: monaco.languages.IndentAction.None, appendText: ' * ' }
		},
		{
			// e.g.  * ...|
			beforeText: /^(\t|(\ \ ))*\ \*(\ ([^\*]|\*(?!\/))*)?$/,
			action: { indentAction: monaco.languages.IndentAction.None, appendText: '* ' }
		},
		{
			// e.g.  */|
			beforeText: /^(\t|(\ \ ))*\ \*\/\s*$/,
			action: { indentAction: monaco.languages.IndentAction.None, removeText: 1 }
		}
	],

	__electricCharacterSupport: {
		docComment: {scope:'comment.doc', open:'/**', lineStart:' * ', close:' */'}
	},

	autoClosingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"', notIn: ['string'] },
		{ open: '\'', close: '\'', notIn: ['string', 'comment'] },
		{ open: '`', close: '`' }
	]
};


