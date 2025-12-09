/*---------------------------------------------------------------------------------------------
 *  Monaco JSON Interpolation
 *  Standalone add-on for Monaco Editor providing JSON with ${...} variable interpolation
 *--------------------------------------------------------------------------------------------*/

import * as monaco from 'monaco-editor';
import { conf, language } from './tokenizer';

// Re-export types
export * from './types';

// --- Language Registration ---

const LANGUAGE_ID = 'json-interpolation';

let isRegistered = false;
let currentDefaults: LanguageServiceDefaultsImpl | null = null;

/**
 * Register the json-interpolation language with Monaco Editor.
 * This should be called once before creating any editors with this language.
 */
export function register(): LanguageServiceDefaults {
	if (isRegistered && currentDefaults) {
		return currentDefaults;
	}

	// Register the language
	monaco.languages.register({
		id: LANGUAGE_ID,
		extensions: ['.jsonc', '.json5'],
		aliases: ['JSON with Interpolation', 'json-interpolation'],
		mimetypes: ['application/json-interpolation']
	});

	// Set the Monarch tokenizer
	monaco.languages.setMonarchTokensProvider(LANGUAGE_ID, language);

	// Set the language configuration
	monaco.languages.setLanguageConfiguration(LANGUAGE_ID, conf);

	// Create defaults
	currentDefaults = new LanguageServiceDefaultsImpl();

	// Register providers
	registerProviders(currentDefaults);

	isRegistered = true;
	return currentDefaults;
}

/**
 * Get the language service defaults for configuring the language.
 * Automatically registers the language if not already registered.
 */
export function getDefaults(): LanguageServiceDefaults {
	if (!currentDefaults) {
		return register();
	}
	return currentDefaults;
}

// --- Types ---

import type {
	VariableDefinition,
	VariableContextProvider,
	LanguageServiceDefaults,
	DiagnosticsOptions,
	ModeConfiguration
} from './types';

// --- Implementation ---

class LanguageServiceDefaultsImpl implements LanguageServiceDefaults {
	private _onDidChange = new monaco.Emitter<LanguageServiceDefaults>();
	private _diagnosticsOptions: DiagnosticsOptions;
	private _modeConfiguration: ModeConfiguration;
	private _variableContext: VariableContextProvider | null = null;

	constructor() {
		this._diagnosticsOptions = {
			validate: true,
			allowComments: true,
			allowTrailingCommas: true,
			schemas: [],
			schemaValidation: 'warning',
			comments: 'ignore',
			trailingCommas: 'ignore'
		};
		this._modeConfiguration = {
			completionItems: true,
			hovers: true,
			documentSymbols: true,
			tokens: true,
			foldingRanges: true,
			diagnostics: true
		};
	}

	get onDidChange(): monaco.IEvent<LanguageServiceDefaults> {
		return this._onDidChange.event;
	}

	get languageId(): string {
		return LANGUAGE_ID;
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
		this._diagnosticsOptions = options || {};
		this._onDidChange.fire(this);
	}

	setModeConfiguration(modeConfiguration: ModeConfiguration): void {
		this._modeConfiguration = modeConfiguration || {};
		this._onDidChange.fire(this);
	}

	setVariableContext(provider: VariableContextProvider | null): void {
		this._variableContext = provider;
		this._onDidChange.fire(this);
	}
}

// --- Providers ---

function registerProviders(defaults: LanguageServiceDefaultsImpl): void {
	// Variable completion provider
	monaco.languages.registerCompletionItemProvider(LANGUAGE_ID, {
		triggerCharacters: ['$', '{'],

		async provideCompletionItems(
			model: monaco.editor.ITextModel,
			position: monaco.Position
		): Promise<monaco.languages.CompletionList | null> {
			const variableContext = defaults.variableContext;
			if (!variableContext) {
				return null;
			}

			// Check if we're inside an interpolation ${...}
			const textUntilPosition = model.getValueInRange({
				startLineNumber: 1,
				startColumn: 1,
				endLineNumber: position.lineNumber,
				endColumn: position.column
			});

			const lastInterpolationStart = textUntilPosition.lastIndexOf('${');
			if (lastInterpolationStart === -1) {
				return null;
			}

			const afterInterpolationStart = textUntilPosition.substring(lastInterpolationStart);
			if (afterInterpolationStart.includes('}')) {
				return null;
			}

			const variables = await variableContext.getVariables();
			const wordInfo = model.getWordUntilPosition(position);
			const range = {
				startLineNumber: position.lineNumber,
				startColumn: wordInfo.startColumn,
				endLineNumber: position.lineNumber,
				endColumn: wordInfo.endColumn
			};

			const suggestions: monaco.languages.CompletionItem[] = variables.map((variable) => ({
				label: variable.name,
				kind: monaco.languages.CompletionItemKind.Variable,
				detail: variable.detail || variable.type,
				documentation: formatDocumentation(variable),
				insertText: variable.name,
				range: range
			}));

			return { suggestions };
		}
	});

	// Variable hover provider
	monaco.languages.registerHoverProvider(LANGUAGE_ID, {
		async provideHover(
			model: monaco.editor.ITextModel,
			position: monaco.Position
		): Promise<monaco.languages.Hover | null> {
			const variableContext = defaults.variableContext;
			if (!variableContext) {
				return null;
			}

			const line = model.getLineContent(position.lineNumber);
			const offset = position.column - 1;

			// Find interpolation boundaries
			let inInterpolation = false;
			let interpStart = -1;

			for (let i = 0; i < line.length - 1; i++) {
				if (line[i] === '$' && line[i + 1] === '{') {
					if (i < offset) {
						inInterpolation = true;
						interpStart = i + 2;
					}
				} else if (line[i] === '}' && inInterpolation) {
					if (i >= offset) {
						break;
					}
					inInterpolation = false;
				}
			}

			if (!inInterpolation || interpStart === -1) {
				return null;
			}

			const wordInfo = model.getWordAtPosition(position);
			if (!wordInfo) {
				return null;
			}

			const variableName = wordInfo.word;
			const variables = await variableContext.getVariables();
			const variable = variables.find((v) => v.name === variableName);

			if (!variable) {
				return null;
			}

			const contents: monaco.IMarkdownString[] = [];

			if (variable.type) {
				contents.push({
					value: `\`\`\`typescript\n(variable) ${variable.name}: ${variable.type}\n\`\`\``
				});
			} else {
				contents.push({
					value: `\`\`\`typescript\n(variable) ${variable.name}\n\`\`\``
				});
			}

			if (variable.description) {
				contents.push({ value: variable.description });
			}

			if (variable.value !== undefined) {
				contents.push({
					value: `**Current value:**\n\`\`\`json\n${JSON.stringify(variable.value, null, 2)}\n\`\`\``
				});
			}

			return {
				contents,
				range: {
					startLineNumber: position.lineNumber,
					startColumn: wordInfo.startColumn,
					endLineNumber: position.lineNumber,
					endColumn: wordInfo.endColumn
				}
			};
		}
	});

	// Folding range provider (basic JSON-like folding)
	monaco.languages.registerFoldingRangeProvider(LANGUAGE_ID, {
		provideFoldingRanges(
			model: monaco.editor.ITextModel
		): monaco.languages.FoldingRange[] {
			const ranges: monaco.languages.FoldingRange[] = [];
			const stack: { char: string; line: number }[] = [];

			for (let i = 1; i <= model.getLineCount(); i++) {
				const line = model.getLineContent(i);
				for (const char of line) {
					if (char === '{' || char === '[') {
						stack.push({ char, line: i });
					} else if (char === '}' || char === ']') {
						const open = stack.pop();
						if (open && open.line < i) {
							ranges.push({
								start: open.line,
								end: i,
								kind: monaco.languages.FoldingRangeKind.Region
							});
						}
					}
				}
			}

			return ranges;
		}
	});
}

function formatDocumentation(
	variable: VariableDefinition
): string | monaco.IMarkdownString {
	let doc = '';

	if (variable.description) {
		doc += variable.description;
	}

	if (variable.value !== undefined) {
		if (doc) {
			doc += '\n\n';
		}
		doc += `**Current value:** \`${JSON.stringify(variable.value)}\``;
	}

	return doc ? { value: doc } : '';
}

// --- Convenience export ---

export const jsonInterpolation = {
	register,
	getDefaults,
	LANGUAGE_ID
};

export default jsonInterpolation;
