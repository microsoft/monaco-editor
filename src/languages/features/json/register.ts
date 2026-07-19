/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as mode from './jsonMode';
import { Emitter, IEvent, languages, Uri } from '../../../editor';

// ---- JSON service types ----
export interface BaseASTNode {
	readonly type: 'object' | 'array' | 'property' | 'string' | 'number' | 'boolean' | 'null';
	readonly parent?: ASTNode;
	readonly offset: number;
	readonly length: number;
	readonly children?: ASTNode[];
	readonly value?: string | boolean | number | null;
}
export interface ObjectASTNode extends BaseASTNode {
	readonly type: 'object';
	readonly properties: PropertyASTNode[];
	readonly children: ASTNode[];
}
export interface PropertyASTNode extends BaseASTNode {
	readonly type: 'property';
	readonly keyNode: StringASTNode;
	readonly valueNode?: ASTNode;
	readonly colonOffset?: number;
	readonly children: ASTNode[];
}
export interface ArrayASTNode extends BaseASTNode {
	readonly type: 'array';
	readonly items: ASTNode[];
	readonly children: ASTNode[];
}
export interface StringASTNode extends BaseASTNode {
	readonly type: 'string';
	readonly value: string;
}
export interface NumberASTNode extends BaseASTNode {
	readonly type: 'number';
	readonly value: number;
	readonly isInteger: boolean;
}
export interface BooleanASTNode extends BaseASTNode {
	readonly type: 'boolean';
	readonly value: boolean;
}
export interface NullASTNode extends BaseASTNode {
	readonly type: 'null';
	readonly value: null;
}

export type ASTNode =
	| ObjectASTNode
	| PropertyASTNode
	| ArrayASTNode
	| StringASTNode
	| NumberASTNode
	| BooleanASTNode
	| NullASTNode;

export type JSONDocument = {
	root: ASTNode | undefined;
	getNodeFromOffset(offset: number, includeRightBound?: boolean): ASTNode | undefined;
};

export type JSONSchemaRef = JSONSchema | boolean;

export interface JSONSchemaMap {
	[name: string]: JSONSchemaRef;
}

export interface JSONSchema {
	id?: string;
	$id?: string;
	$schema?: string;
	type?: string | string[];
	title?: string;
	default?: any;
	definitions?: {
		[name: string]: JSONSchema;
	};
	description?: string;
	properties?: JSONSchemaMap;
	patternProperties?: JSONSchemaMap;
	additionalProperties?: boolean | JSONSchemaRef;
	minProperties?: number;
	maxProperties?: number;
	dependencies?:
	| JSONSchemaMap
	| {
		[prop: string]: string[];
	};
	items?: JSONSchemaRef | JSONSchemaRef[];
	minItems?: number;
	maxItems?: number;
	uniqueItems?: boolean;
	additionalItems?: boolean | JSONSchemaRef;
	pattern?: string;
	minLength?: number;
	maxLength?: number;
	minimum?: number;
	maximum?: number;
	exclusiveMinimum?: boolean | number;
	exclusiveMaximum?: boolean | number;
	multipleOf?: number;
	required?: string[];
	$ref?: string;
	anyOf?: JSONSchemaRef[];
	allOf?: JSONSchemaRef[];
	oneOf?: JSONSchemaRef[];
	not?: JSONSchemaRef;
	enum?: any[];
	format?: string;
	const?: any;
	contains?: JSONSchemaRef;
	propertyNames?: JSONSchemaRef;
	examples?: any[];
	$comment?: string;
	if?: JSONSchemaRef;
	then?: JSONSchemaRef;
	else?: JSONSchemaRef;
	defaultSnippets?: {
		label?: string;
		description?: string;
		markdownDescription?: string;
		body?: any;
		bodyText?: string;
	}[];
	errorMessage?: string;
	patternErrorMessage?: string;
	deprecationMessage?: string;
	enumDescriptions?: string[];
	markdownEnumDescriptions?: string[];
	markdownDescription?: string;
	doNotSuggest?: boolean;
	suggestSortText?: string;
	allowComments?: boolean;
	allowTrailingCommas?: boolean;
}

export interface MatchingSchema {
	node: ASTNode;
	schema: JSONSchema;
}

// --- JSON configuration and defaults ---------
export interface DiagnosticsOptions {
	/**
	 * If set, the validator will be enabled and perform syntax and schema based validation,
	 * unless `DiagnosticsOptions.schemaValidation` is set to `ignore`.
	 */
	readonly validate?: boolean;
	/**
	 * If set, comments are tolerated. If set to false, syntax errors will be emitted for comments.
	 * `DiagnosticsOptions.allowComments` will override this setting.
	 */
	readonly allowComments?: boolean;
	/**
	 * A list of known schemas and/or associations of schemas to file names.
	 */
	readonly schemas?: {
		/**
		 * The URI of the schema, which is also the identifier of the schema.
		 */
		readonly uri: string;
		/**
		 * A list of glob patterns that describe for which file URIs the JSON schema will be used.
		 * '*' and '**' wildcards are supported. Exclusion patterns start with '!'.
		 * For example '*.schema.json', 'package.json', '!foo*.schema.json', 'foo/**\/BADRESP.json'.
		 * A match succeeds when there is at least one pattern matching and last matching pattern does not start with '!'.
		 */
		readonly fileMatch?: string[];
		/**
		 * The schema for the given URI.
		 */
		readonly schema?: any;
	}[];
	/**
	 *  If set, the schema service would load schema content on-demand with 'fetch' if available
	 */
	readonly enableSchemaRequest?: boolean;
	/**
	 * The severity of problems from schema validation. If set to 'ignore', schema validation will be skipped. If not set, 'warning' is used.
	 */
	readonly schemaValidation?: SeverityLevel;
	/**
	 * The severity of problems that occurred when resolving and loading schemas. If set to 'ignore', schema resolving problems are not reported. If not set, 'warning' is used.
	 */
	readonly schemaRequest?: SeverityLevel;
	/**
	 * The severity of reported trailing commas. If not set, trailing commas will be reported as errors.
	 */
	readonly trailingCommas?: SeverityLevel;
	/**
	 * The severity of reported comments. If not set, 'DiagnosticsOptions.allowComments' defines whether comments are ignored or reported as errors.
	 */
	readonly comments?: SeverityLevel;
}

export declare type SeverityLevel = 'error' | 'warning' | 'ignore';

export interface ModeConfiguration {
	/**
	 * Defines whether the built-in documentFormattingEdit provider is enabled.
	 */
	readonly documentFormattingEdits?: boolean;

	/**
	 * Defines whether the built-in documentRangeFormattingEdit provider is enabled.
	 */
	readonly documentRangeFormattingEdits?: boolean;

	/**
	 * Defines whether the built-in completionItemProvider is enabled.
	 */
	readonly completionItems?: boolean;

	/**
	 * Defines whether the built-in hoverProvider is enabled.
	 */
	readonly hovers?: boolean;

	/**
	 * Defines whether the built-in documentSymbolProvider is enabled.
	 */
	readonly documentSymbols?: boolean;

	/**
	 * Defines whether the built-in tokens provider is enabled.
	 */
	readonly tokens?: boolean;

	/**
	 * Defines whether the built-in color provider is enabled.
	 */
	readonly colors?: boolean;

	/**
	 * Defines whether the built-in foldingRange provider is enabled.
	 */
	readonly foldingRanges?: boolean;

	/**
	 * Defines whether the built-in diagnostic provider is enabled.
	 */
	readonly diagnostics?: boolean;

	/**
	 * Defines whether the built-in selection range provider is enabled.
	 */
	readonly selectionRanges?: boolean;
}

export interface LanguageServiceDefaults {
	readonly languageId: string;
	readonly onDidChange: IEvent<LanguageServiceDefaults>;
	readonly diagnosticsOptions: DiagnosticsOptions;
	readonly modeConfiguration: ModeConfiguration;
	setDiagnosticsOptions(options: DiagnosticsOptions): void;
	setModeConfiguration(modeConfiguration: ModeConfiguration): void;
}

class LanguageServiceDefaultsImpl implements LanguageServiceDefaults {
	private _onDidChange = new Emitter<LanguageServiceDefaults>();
	private _diagnosticsOptions!: DiagnosticsOptions;
	private _modeConfiguration!: ModeConfiguration;
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

	setDiagnosticsOptions(options: DiagnosticsOptions): void {
		this._diagnosticsOptions = options || Object.create(null);
		this._onDidChange.fire(this);
	}

	setModeConfiguration(modeConfiguration: ModeConfiguration): void {
		this._modeConfiguration = modeConfiguration || Object.create(null);
		this._onDidChange.fire(this);
	}
}

const diagnosticDefault: Required<DiagnosticsOptions> = {
	validate: true,
	allowComments: true,
	schemas: [],
	enableSchemaRequest: false,
	schemaRequest: 'warning',
	schemaValidation: 'warning',
	comments: 'error',
	trailingCommas: 'error'
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

export const jsonDefaults: LanguageServiceDefaults = new LanguageServiceDefaultsImpl(
	'json',
	diagnosticDefault,
	modeConfigurationDefault
);

export interface IJSONWorker {
	parseJSONDocument(uri: string): Promise<JSONDocument | null>;
	getMatchingSchemas(uri: string): Promise<MatchingSchema[]>;
}

export const getWorker = (): Promise<(...uris: Uri[]) => Promise<IJSONWorker>> =>
	getMode().then((mode) => mode.getWorker());

// --- Registration to monaco editor ---

function getMode(): Promise<typeof mode> {
	return import('./jsonMode');
}

languages.register({
	id: 'json',
	extensions: ['.json', '.bowerrc', '.jshintrc', '.jscsrc', '.eslintrc', '.babelrc', '.har'],
	aliases: ['JSON', 'json'],
	mimetypes: ['application/json']
});

languages.onLanguage('json', () => {
	getMode().then((mode) => mode.setupMode(jsonDefaults));
});
