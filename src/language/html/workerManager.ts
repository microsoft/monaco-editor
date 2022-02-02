/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LanguageServiceDefaults } from './monaco.contribution';
import type { HTMLWorker } from './htmlWorker';
import { Uri, IDisposable, editor } from '../../fillers/monaco-editor-core';

const STOP_WHEN_IDLE_FOR = 2 * 60 * 1000; // 2min

export class WorkerManager {
	private _defaults: LanguageServiceDefaults;
	private _idleCheckInterval: number;
	private _lastUsedTime: number;
	private _configChangeListener: IDisposable;

	private _worker: editor.MonacoWebWorker<HTMLWorker> | null;
	private _client: Promise<HTMLWorker> | null;

	constructor(defaults: LanguageServiceDefaults) {
		this._defaults = defaults;
		this._worker = null;
		this._client = null;
		this._idleCheckInterval = window.setInterval(() => this._checkIfIdle(), 30 * 1000);
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

	private _getClient(): Promise<HTMLWorker> {
		this._lastUsedTime = Date.now();

		if (!this._client) {
			this._worker = editor.createWebWorker<HTMLWorker>({
				// module that exports the create() method and returns a `HTMLWorker` instance
				moduleId: 'vs/language/html/htmlWorker',

				// passed in to the create() method
				createData: {
					languageSettings: this._defaults.options,
					languageId: this._defaults.languageId
				},

				label: this._defaults.languageId
			});

			this._client = <Promise<HTMLWorker>>this._worker.getProxy();
		}

		return this._client;
	}

	getLanguageServiceWorker(...resources: Uri[]): Promise<HTMLWorker> {
		let _client: HTMLWorker;
		return this._getClient()
			.then((client) => {
				_client = client;
			})
			.then((_) => {
				if (this._worker) {
					return this._worker.withSyncedResources(resources);
				}
			})
			.then((_) => _client);
	}
}
