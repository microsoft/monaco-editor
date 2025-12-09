/*---------------------------------------------------------------------------------------------
 *  Monaco JSON Interpolation - Type Definitions
 *--------------------------------------------------------------------------------------------*/

import type * as monaco from 'monaco-editor';

/**
 * Represents a variable that can be used in interpolation
 */
export interface VariableDefinition {
	/**
	 * The name of the variable (without $ prefix)
	 */
	readonly name: string;

	/**
	 * The type of the variable for display purposes
	 */
	readonly type?: string;

	/**
	 * Description shown in hover and completion
	 */
	readonly description?: string;

	/**
	 * The current value of the variable (for hover preview)
	 */
	readonly value?: unknown;

	/**
	 * Optional detail text shown in completion item
	 */
	readonly detail?: string;
}

/**
 * Context provider for interpolation variables
 */
export interface VariableContextProvider {
	/**
	 * Get all available variables
	 */
	getVariables(): VariableDefinition[] | Promise<VariableDefinition[]>;

	/**
	 * Resolve a variable by name (optional, for nested property access)
	 */
	resolveVariable?(name: string): unknown | Promise<unknown>;
}

/**
 * Diagnostics configuration options
 */
export interface DiagnosticsOptions {
	/**
	 * If set, the validator will be enabled
	 */
	readonly validate?: boolean;

	/**
	 * If set, comments are tolerated
	 */
	readonly allowComments?: boolean;

	/**
	 * If set, trailing commas are tolerated
	 */
	readonly allowTrailingCommas?: boolean;

	/**
	 * A list of known schemas
	 */
	readonly schemas?: {
		readonly uri: string;
		readonly fileMatch?: string[];
		readonly schema?: unknown;
	}[];

	/**
	 * The severity of problems from schema validation
	 */
	readonly schemaValidation?: 'error' | 'warning' | 'ignore';

	/**
	 * The severity of trailing commas
	 */
	readonly trailingCommas?: 'error' | 'warning' | 'ignore';

	/**
	 * The severity of comments
	 */
	readonly comments?: 'error' | 'warning' | 'ignore';
}

/**
 * Mode configuration options
 */
export interface ModeConfiguration {
	/**
	 * Defines whether the built-in completionItemProvider is enabled
	 */
	readonly completionItems?: boolean;

	/**
	 * Defines whether the built-in hoverProvider is enabled
	 */
	readonly hovers?: boolean;

	/**
	 * Defines whether the built-in documentSymbolProvider is enabled
	 */
	readonly documentSymbols?: boolean;

	/**
	 * Defines whether the built-in tokens provider is enabled
	 */
	readonly tokens?: boolean;

	/**
	 * Defines whether the built-in foldingRange provider is enabled
	 */
	readonly foldingRanges?: boolean;

	/**
	 * Defines whether the built-in diagnostic provider is enabled
	 */
	readonly diagnostics?: boolean;
}

/**
 * Language service configuration defaults
 */
export interface LanguageServiceDefaults {
	readonly languageId: string;
	readonly onDidChange: monaco.IEvent<LanguageServiceDefaults>;
	readonly diagnosticsOptions: DiagnosticsOptions;
	readonly modeConfiguration: ModeConfiguration;
	readonly variableContext: VariableContextProvider | null;

	setDiagnosticsOptions(options: DiagnosticsOptions): void;
	setModeConfiguration(modeConfiguration: ModeConfiguration): void;

	/**
	 * Set the variable context provider for interpolation completions and hover
	 */
	setVariableContext(provider: VariableContextProvider | null): void;
}
