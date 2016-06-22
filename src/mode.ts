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
		'css',
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
		'less',
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
		'scss',
		scssLanguageConfiguration
	);
}

function setupMode(defaults:LanguageServiceDefaultsImpl, modeId:string, languageConfiguration: monaco.languages.LanguageConfiguration): void {

	let disposables: IDisposable[] = [];

	const client = new WorkerManager(defaults);
	disposables.push(client);

	const worker = (first: Uri, ...more: Uri[]): Promise<CSSWorker> => {
		return client.getLanguageServiceWorker(...[first].concat(more));
	};

	disposables.push(monaco.languages.registerCompletionItemProvider(modeId, new languageFeatures.CompletionAdapter(worker)));
	disposables.push(monaco.languages.registerHoverProvider(modeId, new languageFeatures.HoverAdapter(worker)));
	disposables.push(monaco.languages.registerDocumentHighlightProvider(modeId, new languageFeatures.DocumentHighlightAdapter(worker)));
	disposables.push(monaco.languages.registerDefinitionProvider(modeId, new languageFeatures.DefinitionAdapter(worker)));
	disposables.push(monaco.languages.registerReferenceProvider(modeId, new languageFeatures.ReferenceAdapter(worker)));
	disposables.push(monaco.languages.registerDocumentSymbolProvider(modeId, new languageFeatures.DocumentSymbolAdapter(worker)));
	disposables.push(monaco.languages.registerRenameProvider(modeId, new languageFeatures.RenameAdapter(worker)));
	disposables.push(new languageFeatures.DiagnostcsAdapter(defaults, modeId, worker));
	disposables.push(monaco.languages.setLanguageConfiguration(modeId, languageConfiguration));
}




