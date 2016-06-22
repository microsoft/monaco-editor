/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import {WorkerManager} from './workerManager';
import {CSSWorker} from './worker';
import {LanguageServiceDefaultsImpl} from './monaco.contribution';
import * as languageFeatures from './languageFeatures';

import Promise = monaco.Promise;
import Uri = monaco.Uri;
import IDisposable = monaco.IDisposable;

export function setupCSS(defaults:LanguageServiceDefaultsImpl): void {
	const cssLanguageConfiguration: monaco.languages.LanguageConfiguration = {
		wordPattern: /(#?-?\d*\.\d\w*%?)|((::|[@#.!:])?[\w-?]+%?)|::|[@#.!:]/g,

		comments: {
			blockComment: ['/*', '*/']
		},

		brackets: [
			['{', '}'],
			['[', ']'],
			['(', ')']
		],

		autoClosingPairs: [
			{ open: '{', close: '}' },
			{ open: '[', close: ']' },
			{ open: '(', close: ')' },
			{ open: '"', close: '"', notIn: ['string'] },
			{ open: '\'', close: '\'', notIn: ['string'] }
		]
	};

	setupMode(
		defaults,
		cssLanguageConfiguration
	);
}

export function setupLESS(defaults:LanguageServiceDefaultsImpl): void {
	const lessLanguageConfiguration: monaco.languages.LanguageConfiguration = {
		wordPattern: /(#?-?\d*\.\d\w*%?)|([@#!.:]?[\w-?]+%?)|[@#!.]/g,
		comments: {
			blockComment: ['/*', '*/'],
			lineComment: '//'
		},
		brackets: [['{','}'], ['[',']'], ['(',')'], ['<','>']],
		autoClosingPairs: [
			{ open: '"', close: '"', notIn: ['string', 'comment'] },
			{ open: '\'', close: '\'', notIn: ['string', 'comment'] },
			{ open: '{', close: '}', notIn: ['string', 'comment'] },
			{ open: '[', close: ']', notIn: ['string', 'comment'] },
			{ open: '(', close: ')', notIn: ['string', 'comment'] },
			{ open: '<', close: '>', notIn: ['string', 'comment'] },
		]
	};

	setupMode(
		defaults,
		lessLanguageConfiguration
	);
}

export function setupSCSS(defaults:LanguageServiceDefaultsImpl): void {
	const scssLanguageConfiguration: monaco.languages.LanguageConfiguration = {
		wordPattern: /(#?-?\d*\.\d\w*%?)|([@#!.:]?[\w-?]+%?)|[@#!.]/g,
		comments: {
			blockComment: ['/*', '*/'],
			lineComment: '//'
		},
		brackets: [['{','}'], ['[',']'], ['(',')'], ['<','>']],
		autoClosingPairs: [
			{ open: '"', close: '"', notIn: ['string', 'comment'] },
			{ open: '\'', close: '\'', notIn: ['string', 'comment'] },
			{ open: '{', close: '}', notIn: ['string', 'comment'] },
			{ open: '[', close: ']', notIn: ['string', 'comment'] },
			{ open: '(', close: ')', notIn: ['string', 'comment'] },
			{ open: '<', close: '>', notIn: ['string', 'comment'] },
		]
	};

	setupMode(
		defaults,
		scssLanguageConfiguration
	);
}

function setupMode(defaults:LanguageServiceDefaultsImpl, languageConfiguration: monaco.languages.LanguageConfiguration): void {

	let disposables: IDisposable[] = [];

	const client = new WorkerManager(defaults);
	disposables.push(client);

	const worker = (first: Uri, ...more: Uri[]): Promise<CSSWorker> => {
		return client.getLanguageServiceWorker(...[first].concat(more));
	};

	let languageId = defaults.languageId;

	disposables.push(monaco.languages.registerCompletionItemProvider(languageId, new languageFeatures.CompletionAdapter(worker)));
	disposables.push(monaco.languages.registerHoverProvider(languageId, new languageFeatures.HoverAdapter(worker)));
	disposables.push(monaco.languages.registerDocumentHighlightProvider(languageId, new languageFeatures.DocumentHighlightAdapter(worker)));
	disposables.push(monaco.languages.registerDefinitionProvider(languageId, new languageFeatures.DefinitionAdapter(worker)));
	disposables.push(monaco.languages.registerReferenceProvider(languageId, new languageFeatures.ReferenceAdapter(worker)));
	disposables.push(monaco.languages.registerDocumentSymbolProvider(languageId, new languageFeatures.DocumentSymbolAdapter(worker)));
	disposables.push(monaco.languages.registerRenameProvider(languageId, new languageFeatures.RenameAdapter(worker)));
	disposables.push(new languageFeatures.DiagnostcsAdapter(languageId, worker));
	disposables.push(monaco.languages.setLanguageConfiguration(languageId, languageConfiguration));
}




