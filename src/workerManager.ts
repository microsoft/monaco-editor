/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import {LanguageServiceDefaultsImpl} from './monaco.contribution';
import {JSONWorker} from './jsonWorker';

import Promise = monaco.Promise;
import IDisposable = monaco.IDisposable;
import Uri = monaco.Uri;

const STOP_WHEN_IDLE_FOR = 2 * 60 * 1000; // 2min

export class WorkerManager {

	private _defaults: LanguageServiceDefaultsImpl;
	private _idleCheckInterval: number;
	private _lastUsedTime: number;
	private _configChangeListener: IDisposable;

	private _worker: monaco.editor.MonacoWebWorker<JSONWorker>;
	private _client: Promise<JSONWorker>;

	constructor(defaults: LanguageServiceDefaultsImpl) {
		this._defaults = defaults;
		this._worker = null;
		this._idleCheckInterval = setInterval(() => this._checkIfIdle(), 30 * 1000);
		this._lastUsedTime = 0;
		this._configChangeListener = this._defaults.onDidChange(() => this._stopWorker());
	}

	private _stopWorker(): void {
		if (this._worker) {
			this._worker.dispose();
			this._worker = null;
		}
		this._client = null;
	}

	dispose(): void {
		clearInterval(this._idleCheckInterval);
		this._configChangeListener.dispose();
		this._stopWorker();
	}

	private _checkIfIdle(): void {
		if (!this._worker) {
			return;
		}
		let timePassedSinceLastUsed = Date.now() - this._lastUsedTime;
		if (timePassedSinceLastUsed > STOP_WHEN_IDLE_FOR) {
			this._stopWorker();
		}
	}

	private _getClient(): Promise<JSONWorker> {
		this._lastUsedTime = Date.now();

		if (!this._client) {
			this._worker = monaco.editor.createWebWorker<JSONWorker>({

				// module that exports the create() method and returns a `JSONWorker` instance
				moduleId: 'vs/language/json/jsonWorker',

				label: this._defaults.languageId,

				// passed in to the create() method
				createData: {
					languageSettings: this._defaults.diagnosticsOptions,
					languageId: this._defaults.languageId
				}
			});

			this._client = this._worker.getProxy();
		}

		return this._client;
	}

	getLanguageServiceWorker(...resources: Uri[]): Promise<JSONWorker> {
		let _client: JSONWorker;
		return toShallowCancelPromise(
			this._getClient().then((client) => {
				_client = client
			}).then(_ => {
				return this._worker.withSyncedResources(resources)
			}).then(_ => _client)
		);
	}
}

function toShallowCancelPromise<T>(p: Promise<T>): Promise<T> {
	let completeCallback: (value: T) => void;
	let errorCallback: (err: any) => void;

	let r = new Promise<T>((c, e) => {
		completeCallback = c;
		errorCallback = e;
	}, () => { });

	p.then(completeCallback, errorCallback);

	return r;
}
