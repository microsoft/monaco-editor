/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { editor, Uri } from 'monaco-editor-core';
import { LanguageServiceDefaults } from './monaco.contribution';
import { ModularWorkerManager, ModularWorkerOptions } from './workerManager.modular';
import { ModuleConfig, MINIMAL_CONFIG, EDITING_CONFIG, FULL_CONFIG } from './worker/configs/sampleConfigs';

/**
 * Example: Setting up a modular TypeScript worker for Monaco Editor
 */
export class ModularTypeScriptSetup {
	private _workerManager: ModularWorkerManager;
	private _defaults: LanguageServiceDefaults;

	constructor(modeId: string, defaults: LanguageServiceDefaults) {
		this._defaults = defaults;

		// Initialize with modular worker enabled
		const options: ModularWorkerOptions = {
			useModularWorker: true,
			moduleConfig: EDITING_CONFIG // Start with editing-focused configuration
		};

		this._workerManager = new ModularWorkerManager(modeId, defaults, options);
	}

	/**
	 * Get the TypeScript worker for language services
	 */
	async getWorker(...resources: Uri[]): Promise<any> {
		return await this._workerManager.getLanguageServiceWorker(...resources);
	}

	/**
	 * Switch to minimal configuration for performance
	 */
	switchToMinimalMode(): void {
		this._workerManager.updateModuleConfig(MINIMAL_CONFIG);
	}

	/**
	 * Switch to editing configuration for full editing features
	 */
	switchToEditingMode(): void {
		this._workerManager.updateModuleConfig(EDITING_CONFIG);
	}

	/**
	 * Switch to full configuration for all features
	 */
	switchToFullMode(): void {
		this._workerManager.updateModuleConfig(FULL_CONFIG);
	}

	/**
	 * Create a custom configuration based on user preferences
	 */
	setCustomConfiguration(config: ModuleConfig): void {
		this._workerManager.updateModuleConfig(config);
	}

	/**
	 * Get current worker options
	 */
	getWorkerOptions(): ModularWorkerOptions {
		return this._workerManager.getOptions();
	}

	/**
	 * Dispose of the worker manager
	 */
	dispose(): void {
		this._workerManager.dispose();
	}
}

/**
 * Example: Usage in a Monaco Editor setup
 */
export function setupModularTypeScript(defaults: LanguageServiceDefaults): ModularTypeScriptSetup {
	const setup = new ModularTypeScriptSetup('typescript', defaults);

	// Example: Switch to minimal mode for large files
	const largeFileThreshold = 10000; // lines

	// You could add logic here to automatically switch configurations
	// based on file size, user preferences, etc.

	return setup;
}

/**
 * Example: Dynamic configuration based on file characteristics
 */
export function createAdaptiveConfiguration(fileSize: number, isLargeCodebase: boolean): ModuleConfig {
	if (fileSize > 10000 || isLargeCodebase) {
		// Use minimal configuration for large files/codebases
		return {
			enableDiagnostics: true,
			enableCompletions: true,
			enableNavigation: false,
			enableFormatting: false,
			enableRefactoring: false,
			enableEmit: false,
			enableInlayHints: false
		};
	} else {
		// Use full configuration for smaller files
		return FULL_CONFIG;
	}
}

/**
 * Example: User preference-based configuration
 */
export interface UserPreferences {
	enableDiagnostics: boolean;
	enableCompletions: boolean;
	enableNavigation: boolean;
	enableFormatting: boolean;
	enableRefactoring: boolean;
	enableEmit: boolean;
	enableInlayHints: boolean;
	performanceMode: boolean;
}

export function createUserPreferenceConfiguration(prefs: UserPreferences): ModuleConfig {
	if (prefs.performanceMode) {
		return {
			enableDiagnostics: prefs.enableDiagnostics,
			enableCompletions: prefs.enableCompletions,
			enableNavigation: false,
			enableFormatting: false,
			enableRefactoring: false,
			enableEmit: false,
			enableInlayHints: false
		};
	}

	return {
		enableDiagnostics: prefs.enableDiagnostics,
		enableCompletions: prefs.enableCompletions,
		enableNavigation: prefs.enableNavigation,
		enableFormatting: prefs.enableFormatting,
		enableRefactoring: prefs.enableRefactoring,
		enableEmit: prefs.enableEmit,
		enableInlayHints: prefs.enableInlayHints
	};
}
