/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LanguageServiceDefaults } from './register';
import type { TypeScriptWorker } from './tsWorker';
import { editor, Uri, IDisposable } from '../../../editor';
import { createWebWorker } from '../../../internal/common/workers';

export class WorkerManager {
	private _configChangeListener: IDisposable;
	private _updateExtraLibsToken: number;
	private _extraLibsChangeListener: IDisposable;

	private _worker: editor.MonacoWebWorker<TypeScriptWorker> | null;
	private _client: Promise<TypeScriptWorker> | null;

	constructor(
		private readonly _modeId: string,
		private readonly _defaults: LanguageServiceDefaults
	) {
		this._worker = null;
		this._client = null;
		this._configChangeListener = this._defaults.onDidChange(() => this._stopWorker());
		this._updateExtraLibsToken = 0;
		this._extraLibsChangeListener = this._defaults.onDidExtraLibsChange(() =>
			this._updateExtraLibs()
		);
	}

	dispose(): void {
		this._configChangeListener.dispose();
		this._extraLibsChangeListener.dispose();
		this._stopWorker();
	}

	private _stopWorker(): void {
		if (this._worker) {
			this._worker.dispose();
			this._worker = null;
		}
		this._client = null;
	}

	private async _updateExtraLibs(): Promise<void> {
		if (!this._worker) {
			return;
		}
		const myToken = ++this._updateExtraLibsToken;
		const proxy = await this._worker.getProxy();
		if (this._updateExtraLibsToken !== myToken) {
			// avoid multiple calls
			return;
		}
		proxy.updateExtraLibs(this._defaults.getExtraLibs());
	}

	private _getClient(): Promise<TypeScriptWorker> {
		if (!this._client) {
			this._client = (async () => {
				this._worker = createWebWorker<TypeScriptWorker>({
					// module that exports the create() method and returns a `TypeScriptWorker` instance
					moduleId: 'vs/language/typescript/tsWorker',
					createWorker: () => new Worker(new URL('./ts.worker?esm', import.meta.url), { type: 'module' }),

					label: this._modeId,

					keepIdleModels: true,

					// passed in to the create() method
					createData: {
						compilerOptions: this._defaults.getCompilerOptions(),
						extraLibs: this._defaults.getExtraLibs(),
						customWorkerPath: this._defaults.workerOptions.customWorkerPath,
						inlayHintsOptions: this._defaults.inlayHintsOptions
					}
				});

				if (this._defaults.getEagerModelSync()) {
					return await this._worker.withSyncedResources(
						editor
							.getModels()
							.filter((model) => model.getLanguageId() === this._modeId)
							.map((model) => model.uri)
					);
				}

				return await this._worker.getProxy();
			})();
		}

		return this._client;
	}

	async getLanguageServiceWorker(...resources: Uri[]): Promise<TypeScriptWorker> {
		const client = await this._getClient();
		if (this._worker) {
			await this._worker.withSyncedResources(resources);
		}
		return client;
	}
}
