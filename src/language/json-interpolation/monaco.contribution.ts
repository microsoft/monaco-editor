/*---------------------------------------------------------------------------------------------
 *  JSON with Interpolation - Monaco Contribution
 *  Registers the language and provides configuration APIs
 *--------------------------------------------------------------------------------------------*/

import { Emitter, IEvent, languages } from 'monaco-editor-core';

// Re-export types from json language service that are still useful
export type {
	ASTNode,
	JSONDocument,
	JSONSchema,
	JSONSchemaRef,
	MatchingSchema
} from '../json/monaco.contribution';

// --- Variable Context Types ---

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

// --- Configuration Options ---

export interface DiagnosticsOptions {
	/**
	 * If set, the validator will be enabled and perform syntax and schema based validation
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
	 * A list of known schemas and/or associations of schemas to file names
	 */
	readonly schemas?: {
		readonly uri: string;
		readonly fileMatch?: string[];
		readonly schema?: unknown;
	}[];

	/**
	 * If set, the schema service would load schema content on-demand
	 */
	readonly enableSchemaRequest?: boolean;

	/**
	 * The severity of problems from schema validation
	 */
	readonly schemaValidation?: SeverityLevel;

	/**
	 * The severity of problems from schema request failures
	 */
	readonly schemaRequest?: SeverityLevel;

	/**
	 * The severity of trailing commas
	 */
	readonly trailingCommas?: SeverityLevel;

	/**
	 * The severity of comments
	 */
	readonly comments?: SeverityLevel;
}

export type SeverityLevel = 'error' | 'warning' | 'ignore';

export interface ModeConfiguration {
	/**
	 * Defines whether the built-in documentFormattingEdit provider is enabled
	 */
	readonly documentFormattingEdits?: boolean;

	/**
	 * Defines whether the built-in documentRangeFormattingEdit provider is enabled
	 */
	readonly documentRangeFormattingEdits?: boolean;

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
	 * Defines whether the built-in color provider is enabled
	 */
	readonly colors?: boolean;

	/**
	 * Defines whether the built-in foldingRange provider is enabled
	 */
	readonly foldingRanges?: boolean;

	/**
	 * Defines whether the built-in diagnostic provider is enabled
	 */
	readonly diagnostics?: boolean;

	/**
	 * Defines whether the built-in selection range provider is enabled
	 */
	readonly selectionRanges?: boolean;
}

// --- Language Service Defaults ---

export interface LanguageServiceDefaults {
	readonly languageId: string;
	readonly onDidChange: IEvent<LanguageServiceDefaults>;
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

class LanguageServiceDefaultsImpl implements LanguageServiceDefaults {
	private _onDidChange = new Emitter<LanguageServiceDefaults>();
	private _diagnosticsOptions!: DiagnosticsOptions;
	private _modeConfiguration!: ModeConfiguration;
	private _variableContext: VariableContextProvider | null = null;
	private _languageId: string;

	constructor(
		languageId: string,
		diagnosticsOptions: DiagnosticsOptions,
		modeConfiguration: ModeConfiguration
	) {
		this._languageId = languageId;
		this.setDiagnosticsOptions(diagnosticsOptions);
		this.setModeConfiguration(modeConfiguration);
	}

	get onDidChange(): IEvent<LanguageServiceDefaults> {
		return this._onDidChange.event;
	}

	get languageId(): string {
		return this._languageId;
	}

	get modeConfiguration(): ModeConfiguration {
		return this._modeConfiguration;
	}

	get diagnosticsOptions(): DiagnosticsOptions {
		return this._diagnosticsOptions;
	}

	get variableContext(): VariableContextProvider | null {
		return this._variableContext;
	}

	setDiagnosticsOptions(options: DiagnosticsOptions): void {
		this._diagnosticsOptions = options || Object.create(null);
		this._onDidChange.fire(this);
	}

	setModeConfiguration(modeConfiguration: ModeConfiguration): void {
		this._modeConfiguration = modeConfiguration || Object.create(null);
		this._onDidChange.fire(this);
	}

	setVariableContext(provider: VariableContextProvider | null): void {
		this._variableContext = provider;
		this._onDidChange.fire(this);
	}
}

// --- Defaults ---

const diagnosticDefault: Required<DiagnosticsOptions> = {
	validate: true,
	allowComments: true,
	allowTrailingCommas: true,
	schemas: [],
	enableSchemaRequest: false,
	schemaRequest: 'warning',
	schemaValidation: 'warning',
	comments: 'ignore', // Allow comments by default for this variant
	trailingCommas: 'ignore' // Allow trailing commas by default
};

const modeConfigurationDefault: Required<ModeConfiguration> = {
	documentFormattingEdits: true,
	documentRangeFormattingEdits: true,
	completionItems: true,
	hovers: true,
	documentSymbols: true,
	tokens: true,
	colors: true,
	foldingRanges: true,
	diagnostics: true,
	selectionRanges: true
};

// --- Exports ---

export const jsonInterpolationDefaults: LanguageServiceDefaults = new LanguageServiceDefaultsImpl(
	'json-interpolation',
	diagnosticDefault,
	modeConfigurationDefault
);

// --- Language Registration ---

let modePromise: Promise<typeof import('./jsonInterpolationMode')> | null = null;

function getMode(): Promise<typeof import('./jsonInterpolationMode')> {
	if (!modePromise) {
		modePromise = import('./jsonInterpolationMode');
	}
	return modePromise;
}

languages.register({
	id: 'json-interpolation',
	extensions: ['.jsonc', '.json5'],
	aliases: ['JSON with Interpolation', 'json-interpolation'],
	mimetypes: ['application/json-interpolation']
});

languages.onLanguage('json-interpolation', async () => {
	const mode = await getMode();
	mode.setupMode(jsonInterpolationDefaults);
});
