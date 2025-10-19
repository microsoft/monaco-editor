/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LanguageServiceDefaults } from './monaco.contribution';
import type { TypeScriptWorker } from './tsWorker';
import { ModularTypeScriptWorker, ModuleConfig } from './worker/moduleLoader';
import { editor, Uri, IDisposable } from 'monaco-editor-core';
import { createWebWorker } from '../../common/workers';

export interface ModularWorkerOptions {
	moduleConfig?: ModuleConfig;
	useModularWorker?: boolean;
}

export class ModularWorkerManager {
	private _configChangeListener: IDisposable;
	private _updateExtraLibsToken: number;
	private _extraLibsChangeListener: IDisposable;

	private _worker: editor.MonacoWebWorker<TypeScriptWorker | ModularTypeScriptWorker> | null;
	private _client: Promise<TypeScriptWorker | ModularTypeScriptWorker> | null;
	private _options: ModularWorkerOptions;

	constructor(
		private readonly _modeId: string,
		private readonly _defaults: LanguageServiceDefaults,
		options: ModularWorkerOptions = {}
	) {
		this._options = {
			useModularWorker: false,
			...options
		};
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

		this._updateExtraLibsToken++;
		const myUpdateExtraLibsToken = this._updateExtraLibsToken;
		const proxy = await this._worker.getProxy();

		if (myUpdateExtraLibsToken !== this._updateExtraLibsToken) {
			// stop, there has been a new request
			return;
		}

		proxy.updateExtraLibs(this._defaults.getExtraLibs());
	}

	private _getClient(): Promise<TypeScriptWorker | ModularTypeScriptWorker> {
		if (!this._client) {
			this._client = (async () => {
				const workerModuleId = this._options.useModularWorker
					? 'vs/language/typescript/tsWorker.modular'
					: 'vs/language/typescript/tsWorker';

				this._worker = createWebWorker<TypeScriptWorker | ModularTypeScriptWorker>({
					// module that exports the create() method and returns a `TypeScriptWorker` instance
					moduleId: workerModuleId,
					createWorker: () => new Worker(
						new URL(
							this._options.useModularWorker ? './ts.worker.modular' : './ts.worker',
							import.meta.url
						),
						{ type: 'module' }
					),

					label: this._modeId,

					keepIdleModels: true,

					// passed in to the create() method
					createData: {
						compilerOptions: this._defaults.getCompilerOptions(),
						extraLibs: this._defaults.getExtraLibs(),
						customWorkerPath: this._defaults.workerOptions.customWorkerPath,
						inlayHintsOptions: this._defaults.inlayHintsOptions,
						...(this._options.useModularWorker && this._options.moduleConfig && {
							moduleConfig: this._options.moduleConfig
						})
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

	async getLanguageServiceWorker(...resources: Uri[]): Promise<TypeScriptWorker | ModularTypeScriptWorker> {
		const client = await this._getClient();
		if (this._worker) {
			await this._worker.withSyncedResources(resources);
		}
		return client;
	}

	/**
	 * Updates the module configuration for modular workers
	 */
	updateModuleConfig(moduleConfig: ModuleConfig): void {
		if (this._options.useModularWorker) {
			this._options.moduleConfig = moduleConfig;
			// Restart worker with new configuration
			this._stopWorker();
		}
	}

	/**
	 * Switches between modular and traditional worker
	 */
	setUseModularWorker(useModular: boolean): void {
		if (this._options.useModularWorker !== useModular) {
			this._options.useModularWorker = useModular;
			// Restart worker with new type
			this._stopWorker();
		}
	}

	/**
	 * Gets the current worker options
	 */
	getOptions(): ModularWorkerOptions {
		return { ...this._options };
	}
}
