/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ModularTypeScriptWorker, ModuleConfig } from '../moduleLoader';
import { MINIMAL_CONFIG, EDITING_CONFIG, PERFORMANCE_CONFIG } from '../configs/sampleConfigs';

/**
 * Example: Creating a minimal TypeScript worker for basic syntax checking
 */
export function createMinimalWorker(ctx: any, createData: any): ModularTypeScriptWorker {
	return new ModularTypeScriptWorker(ctx, createData, MINIMAL_CONFIG);
}

/**
 * Example: Creating an editing-focused worker for code completion and navigation
 */
export function createEditingWorker(ctx: any, createData: any): ModularTypeScriptWorker {
	return new ModularTypeScriptWorker(ctx, createData, EDITING_CONFIG);
}

/**
 * Example: Creating a performance-optimized worker for large codebases
 */
export function createPerformanceWorker(ctx: any, createData: any): ModularTypeScriptWorker {
	return new ModularTypeScriptWorker(ctx, createData, PERFORMANCE_CONFIG);
}

/**
 * Example: Creating a custom worker configuration
 */
export function createCustomWorker(ctx: any, createData: any): ModularTypeScriptWorker {
	const customConfig: ModuleConfig = {
		enableDiagnostics: true,      // Keep diagnostics for error checking
		enableCompletions: true,      // Keep completions for IntelliSense
		enableNavigation: false,      // Disable navigation to save memory
		enableFormatting: false,      // Disable formatting for performance
		enableRefactoring: false,     // Disable refactoring features
		enableEmit: true,             // Keep emit for compilation
		enableInlayHints: false       // Disable inlay hints for performance
	};

	return new ModularTypeScriptWorker(ctx, createData, customConfig);
}

/**
 * Example: Dynamic module configuration based on environment
 */
export function createEnvironmentAwareWorker(ctx: any, createData: any): ModularTypeScriptWorker {
	const isDevelopment = process.env.NODE_ENV === 'development';
	const isProduction = process.env.NODE_ENV === 'production';

	let config: ModuleConfig;

	if (isDevelopment) {
		// Full features for development
		config = {
			enableDiagnostics: true,
			enableCompletions: true,
			enableNavigation: true,
			enableFormatting: true,
			enableRefactoring: true,
			enableEmit: true,
			enableInlayHints: true
		};
	} else if (isProduction) {
		// Minimal features for production
		config = {
			enableDiagnostics: true,
			enableCompletions: true,
			enableNavigation: false,
			enableFormatting: false,
			enableRefactoring: false,
			enableEmit: false,
			enableInlayHints: false
		};
	} else {
		// Default configuration
		config = EDITING_CONFIG;
	}

	return new ModularTypeScriptWorker(ctx, createData, config);
}

/**
 * Example: Runtime module configuration updates
 */
export function demonstrateRuntimeUpdates(worker: ModularTypeScriptWorker): void {
	console.log('Initial enabled modules:', worker.getEnabledModules());

	// Disable expensive features during heavy operations
	worker.updateModuleConfig({
		enableDiagnostics: true,
		enableCompletions: false,
		enableNavigation: false,
		enableFormatting: false,
		enableRefactoring: false,
		enableEmit: false,
		enableInlayHints: false
	});

	console.log('After disabling expensive features:', worker.getEnabledModules());

	// Re-enable features after heavy operations
	worker.updateModuleConfig(EDITING_CONFIG);

	console.log('After re-enabling features:', worker.getEnabledModules());
}
