/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ModuleConfig } from '../moduleLoader';

/**
 * Configuration for a minimal TypeScript worker with only essential features
 */
export const MINIMAL_CONFIG: ModuleConfig = {
	enableDiagnostics: true,
	enableCompletions: true,
	enableNavigation: false,
	enableFormatting: false,
	enableRefactoring: false,
	enableEmit: false,
	enableInlayHints: false
};

/**
 * Configuration for a TypeScript worker focused on editing features
 */
export const EDITING_CONFIG: ModuleConfig = {
	enableDiagnostics: true,
	enableCompletions: true,
	enableNavigation: true,
	enableFormatting: true,
	enableRefactoring: true,
	enableEmit: false,
	enableInlayHints: true
};

/**
 * Configuration for a TypeScript worker focused on compilation features
 */
export const COMPILATION_CONFIG: ModuleConfig = {
	enableDiagnostics: true,
	enableCompletions: false,
	enableNavigation: false,
	enableFormatting: false,
	enableRefactoring: false,
	enableEmit: true,
	enableInlayHints: false
};

/**
 * Configuration for a full-featured TypeScript worker (default)
 */
export const FULL_CONFIG: ModuleConfig = {
	enableDiagnostics: true,
	enableCompletions: true,
	enableNavigation: true,
	enableFormatting: true,
	enableRefactoring: true,
	enableEmit: true,
	enableInlayHints: true
};

/**
 * Configuration for a TypeScript worker optimized for performance
 * (disables expensive features)
 */
export const PERFORMANCE_CONFIG: ModuleConfig = {
	enableDiagnostics: true,
	enableCompletions: true,
	enableNavigation: false,
	enableFormatting: false,
	enableRefactoring: false,
	enableEmit: false,
	enableInlayHints: false
};
