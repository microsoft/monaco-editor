/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LanguageServiceDefaults } from './register';
import type { CSSWorker } from './cssWorker';
import { editor, IDisposable, Uri } from '../../../editor';
import { createWebWorker } from '../../../internal/common/workers';

const STOP_WHEN_IDLE_FOR = 2 * 60 * 1000; // 2min

export class WorkerManager {
	private _defaults: LanguageServiceDefaults;
	private _idleCheckInterval: number;
	private _lastUsedTime: number;
	private _configChangeListener: IDisposable;

	private _worker: editor.MonacoWebWorker<CSSWorker> | null;
	private _client: Promise<CSSWorker> | null;

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

	private _getClient(): Promise<CSSWorker> {
		this._lastUsedTime = Date.now();

		if (!this._client) {
			this._worker = createWebWorker<CSSWorker>({
				// module that exports the create() method and returns a `CSSWorker` instance
				moduleId: 'vs/language/css/cssWorker',
				createWorker: () => new Worker(new URL('./css.worker?esm', import.meta.url), { type: 'module' }),
				label: this._defaults.languageId,

				// passed in to the create() method
				createData: {
					options: this._defaults.options,
					languageId: this._defaults.languageId
				}
			});

			this._client = <Promise<CSSWorker>>(<any>this._worker.getProxy());
		}

		return this._client;
	}

	getLanguageServiceWorker(...resources: Uri[]): Promise<CSSWorker> {
		let _client: CSSWorker;
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
