/*---------------------------------------------------------------------------------------------
 *  Monaco JSON Interpolation
 *  Standalone add-on for Monaco Editor providing JSON with ${...} variable interpolation
 *  Integrates with Monaco's built-in JSON language service for full functionality
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
			diagnostics: true,
			documentFormattingEdits: true,
			documentRangeFormattingEdits: true,
			selectionRanges: true,
			colors: true
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

// --- Helper to get JSON worker ---

type JSONWorker = {
	doComplete(uri: string, position: { lineNumber: number; column: number }): Promise<monaco.languages.CompletionList | null>;
	doHover(uri: string, position: { line: number; character: number }): Promise<{ contents: { kind: string; value: string }[]; range?: any } | null>;
	doValidation(uri: string): Promise<any[]>;
	format(uri: string, range: any, options: any): Promise<any[]>;
	findDocumentSymbols(uri: string): Promise<any[]>;
	getFoldingRanges(uri: string): Promise<any[]>;
	getSelectionRanges(uri: string, positions: any[]): Promise<any[]>;
	findDocumentColors(uri: string): Promise<any[]>;
	getColorPresentations(uri: string, color: any, range: any): Promise<any[]>;
};

async function getJSONWorker(resource: monaco.Uri): Promise<JSONWorker | null> {
	// Access Monaco's built-in JSON language service
	const json = (monaco.languages as any).json;
	if (!json || !json.getWorker) {
		console.warn('monaco-json-interpolation: JSON language service not available');
		return null;
	}

	try {
		const getWorker = await json.getWorker();
		const worker = await getWorker(resource);
		return worker;
	} catch (e) {
		console.warn('monaco-json-interpolation: Failed to get JSON worker', e);
		return null;
	}
}

// --- Check if position is inside interpolation ---

function isInsideInterpolation(model: monaco.editor.ITextModel, position: monaco.Position): boolean {
	const textUntilPosition = model.getValueInRange({
		startLineNumber: 1,
		startColumn: 1,
		endLineNumber: position.lineNumber,
		endColumn: position.column
	});

	const lastInterpolationStart = textUntilPosition.lastIndexOf('${');
	if (lastInterpolationStart === -1) {
		return false;
	}

	const afterInterpolationStart = textUntilPosition.substring(lastInterpolationStart);
	return !afterInterpolationStart.includes('}');
}

// --- Providers ---

function registerProviders(defaults: LanguageServiceDefaultsImpl): void {
	// Completion provider - combines JSON completions with variable completions
	monaco.languages.registerCompletionItemProvider(LANGUAGE_ID, {
		triggerCharacters: ['"', ':', ' ', '$', '{'],

		async provideCompletionItems(
			model: monaco.editor.ITextModel,
			position: monaco.Position,
			context: monaco.languages.CompletionContext
		): Promise<monaco.languages.CompletionList | null> {
			// Check if we're inside an interpolation
			if (isInsideInterpolation(model, position)) {
				// Provide variable completions
				const variableContext = defaults.variableContext;
				if (variableContext) {
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
				return null;
			}

			// Get JSON completions from the worker
			const worker = await getJSONWorker(model.uri);
			if (!worker) {
				return null;
			}

			try {
				const info = await worker.doComplete(model.uri.toString(), {
					lineNumber: position.lineNumber,
					column: position.column
				});

				if (!info) {
					return null;
				}

				// Convert LSP completions to Monaco completions
				const suggestions: monaco.languages.CompletionItem[] = (info.items || []).map((item: any) => ({
					label: item.label,
					kind: convertCompletionItemKind(item.kind),
					detail: item.detail,
					documentation: item.documentation,
					insertText: item.insertText || item.label,
					insertTextRules: item.insertTextFormat === 2
						? monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
						: undefined,
					range: item.textEdit?.range ? convertRange(item.textEdit.range) : undefined,
					sortText: item.sortText,
					filterText: item.filterText
				}));

				return { suggestions, incomplete: info.isIncomplete || false };
			} catch (e) {
				console.error('JSON completion error:', e);
				return null;
			}
		}
	});

	// Hover provider - combines JSON hover with variable hover
	monaco.languages.registerHoverProvider(LANGUAGE_ID, {
		async provideHover(
			model: monaco.editor.ITextModel,
			position: monaco.Position
		): Promise<monaco.languages.Hover | null> {
			// Check if we're inside an interpolation
			if (isInsideInterpolation(model, position)) {
				const variableContext = defaults.variableContext;
				if (variableContext) {
					const wordInfo = model.getWordAtPosition(position);
					if (wordInfo) {
						const variables = await variableContext.getVariables();
						const variable = variables.find((v) => v.name === wordInfo.word);

						if (variable) {
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
					}
				}
				return null;
			}

			// Get JSON hover from the worker
			const worker = await getJSONWorker(model.uri);
			if (!worker) {
				return null;
			}

			try {
				const info = await worker.doHover(model.uri.toString(), {
					line: position.lineNumber - 1,
					character: position.column - 1
				});

				if (!info) {
					return null;
				}

				const contents: monaco.IMarkdownString[] = info.contents.map((c: any) => {
					if (typeof c === 'string') {
						return { value: c };
					}
					return { value: c.value || '' };
				});

				return {
					contents,
					range: info.range ? convertRange(info.range) : undefined
				};
			} catch (e) {
				console.error('JSON hover error:', e);
				return null;
			}
		}
	});

	// Diagnostics adapter
	setupDiagnostics(defaults);

	// Document formatting provider
	monaco.languages.registerDocumentFormattingEditProvider(LANGUAGE_ID, {
		async provideDocumentFormattingEdits(
			model: monaco.editor.ITextModel,
			options: monaco.languages.FormattingOptions
		): Promise<monaco.languages.TextEdit[] | null> {
			const worker = await getJSONWorker(model.uri);
			if (!worker) {
				return null;
			}

			try {
				const edits = await worker.format(model.uri.toString(), null, {
					tabSize: options.tabSize,
					insertSpaces: options.insertSpaces
				});

				return edits.map((edit: any) => ({
					range: convertRange(edit.range),
					text: edit.newText
				}));
			} catch (e) {
				console.error('JSON formatting error:', e);
				return null;
			}
		}
	});

	// Document range formatting provider
	monaco.languages.registerDocumentRangeFormattingEditProvider(LANGUAGE_ID, {
		async provideDocumentRangeFormattingEdits(
			model: monaco.editor.ITextModel,
			range: monaco.Range,
			options: monaco.languages.FormattingOptions
		): Promise<monaco.languages.TextEdit[] | null> {
			const worker = await getJSONWorker(model.uri);
			if (!worker) {
				return null;
			}

			try {
				const edits = await worker.format(
					model.uri.toString(),
					{
						start: { line: range.startLineNumber - 1, character: range.startColumn - 1 },
						end: { line: range.endLineNumber - 1, character: range.endColumn - 1 }
					},
					{
						tabSize: options.tabSize,
						insertSpaces: options.insertSpaces
					}
				);

				return edits.map((edit: any) => ({
					range: convertRange(edit.range),
					text: edit.newText
				}));
			} catch (e) {
				console.error('JSON range formatting error:', e);
				return null;
			}
		}
	});

	// Document symbols provider
	monaco.languages.registerDocumentSymbolProvider(LANGUAGE_ID, {
		async provideDocumentSymbols(
			model: monaco.editor.ITextModel
		): Promise<monaco.languages.DocumentSymbol[] | null> {
			const worker = await getJSONWorker(model.uri);
			if (!worker) {
				return null;
			}

			try {
				const symbols = await worker.findDocumentSymbols(model.uri.toString());
				return symbols.map(convertSymbol);
			} catch (e) {
				console.error('JSON symbols error:', e);
				return null;
			}
		}
	});

	// Folding range provider
	monaco.languages.registerFoldingRangeProvider(LANGUAGE_ID, {
		async provideFoldingRanges(
			model: monaco.editor.ITextModel
		): Promise<monaco.languages.FoldingRange[] | null> {
			const worker = await getJSONWorker(model.uri);
			if (!worker) {
				return null;
			}

			try {
				const ranges = await worker.getFoldingRanges(model.uri.toString());
				return ranges.map((range: any) => ({
					start: range.startLine + 1,
					end: range.endLine + 1,
					kind: range.kind
				}));
			} catch (e) {
				console.error('JSON folding error:', e);
				return null;
			}
		}
	});

	// Selection range provider
	monaco.languages.registerSelectionRangeProvider(LANGUAGE_ID, {
		async provideSelectionRanges(
			model: monaco.editor.ITextModel,
			positions: monaco.Position[]
		): Promise<monaco.languages.SelectionRange[][] | null> {
			const worker = await getJSONWorker(model.uri);
			if (!worker) {
				return null;
			}

			try {
				const lspPositions = positions.map((p) => ({
					line: p.lineNumber - 1,
					character: p.column - 1
				}));

				const ranges = await worker.getSelectionRanges(model.uri.toString(), lspPositions);
				return ranges.map((rangeList: any) => {
					const result: monaco.languages.SelectionRange[] = [];
					let current = rangeList;
					while (current) {
						result.push({
							range: convertRange(current.range)
						});
						current = current.parent;
					}
					return result;
				});
			} catch (e) {
				console.error('JSON selection range error:', e);
				return null;
			}
		}
	});

	// Color provider
	monaco.languages.registerColorProvider(LANGUAGE_ID, {
		async provideDocumentColors(
			model: monaco.editor.ITextModel
		): Promise<monaco.languages.IColorInformation[] | null> {
			const worker = await getJSONWorker(model.uri);
			if (!worker) {
				return null;
			}

			try {
				const colors = await worker.findDocumentColors(model.uri.toString());
				return colors.map((info: any) => ({
					range: convertRange(info.range),
					color: info.color
				}));
			} catch (e) {
				console.error('JSON colors error:', e);
				return null;
			}
		},

		async provideColorPresentations(
			model: monaco.editor.ITextModel,
			colorInfo: monaco.languages.IColorInformation
		): Promise<monaco.languages.IColorPresentation[] | null> {
			const worker = await getJSONWorker(model.uri);
			if (!worker) {
				return null;
			}

			try {
				const presentations = await worker.getColorPresentations(
					model.uri.toString(),
					colorInfo.color,
					{
						start: {
							line: colorInfo.range.startLineNumber - 1,
							character: colorInfo.range.startColumn - 1
						},
						end: {
							line: colorInfo.range.endLineNumber - 1,
							character: colorInfo.range.endColumn - 1
						}
					}
				);

				return presentations.map((p: any) => ({
					label: p.label,
					textEdit: p.textEdit
						? {
								range: convertRange(p.textEdit.range),
								text: p.textEdit.newText
						  }
						: undefined
				}));
			} catch (e) {
				console.error('JSON color presentations error:', e);
				return null;
			}
		}
	});
}

// --- Diagnostics ---

function setupDiagnostics(defaults: LanguageServiceDefaultsImpl): void {
	const listeners: { [uri: string]: monaco.IDisposable } = {};

	const doValidate = async (model: monaco.editor.ITextModel) => {
		if (model.getLanguageId() !== LANGUAGE_ID) {
			return;
		}

		const worker = await getJSONWorker(model.uri);
		if (!worker) {
			return;
		}

		try {
			const diagnostics = await worker.doValidation(model.uri.toString());

			// Filter out diagnostics that overlap with interpolations
			const text = model.getValue();
			const filteredDiagnostics = diagnostics.filter((diag: any) => {
				const startOffset = model.getOffsetAt({
					lineNumber: diag.range.start.line + 1,
					column: diag.range.start.character + 1
				});
				const endOffset = model.getOffsetAt({
					lineNumber: diag.range.end.line + 1,
					column: diag.range.end.character + 1
				});

				// Check for overlap with interpolations
				const interpolationRegex = /\$\{[^}]*\}/g;
				let match;

				while ((match = interpolationRegex.exec(text)) !== null) {
					const interpStart = match.index;
					const interpEnd = interpStart + match[0].length;

					if (startOffset < interpEnd && endOffset > interpStart) {
						return false;
					}
				}

				return true;
			});

			// Convert to Monaco markers
			const markers: monaco.editor.IMarkerData[] = filteredDiagnostics.map((diag: any) => ({
				severity: convertSeverity(diag.severity),
				startLineNumber: diag.range.start.line + 1,
				startColumn: diag.range.start.character + 1,
				endLineNumber: diag.range.end.line + 1,
				endColumn: diag.range.end.character + 1,
				message: diag.message,
				code: typeof diag.code === 'number' ? String(diag.code) : diag.code
			}));

			monaco.editor.setModelMarkers(model, LANGUAGE_ID, markers);
		} catch (e) {
			console.error('JSON validation error:', e);
		}
	};

	const onModelAdd = (model: monaco.editor.ITextModel) => {
		if (model.getLanguageId() !== LANGUAGE_ID) {
			return;
		}

		let handle: ReturnType<typeof setTimeout>;
		listeners[model.uri.toString()] = model.onDidChangeContent(() => {
			clearTimeout(handle);
			handle = setTimeout(() => doValidate(model), 500);
		});

		doValidate(model);
	};

	const onModelRemoved = (model: monaco.editor.ITextModel) => {
		monaco.editor.setModelMarkers(model, LANGUAGE_ID, []);
		const listener = listeners[model.uri.toString()];
		if (listener) {
			listener.dispose();
			delete listeners[model.uri.toString()];
		}
	};

	monaco.editor.onDidCreateModel(onModelAdd);
	monaco.editor.onWillDisposeModel(onModelRemoved);
	monaco.editor.onDidChangeModelLanguage((event) => {
		onModelRemoved(event.model);
		onModelAdd(event.model);
	});

	// Validate existing models
	monaco.editor.getModels().forEach(onModelAdd);
}

// --- Conversion utilities ---

function convertRange(range: any): monaco.IRange {
	return {
		startLineNumber: range.start.line + 1,
		startColumn: range.start.character + 1,
		endLineNumber: range.end.line + 1,
		endColumn: range.end.character + 1
	};
}

function convertSeverity(severity: number): monaco.MarkerSeverity {
	switch (severity) {
		case 1:
			return monaco.MarkerSeverity.Error;
		case 2:
			return monaco.MarkerSeverity.Warning;
		case 3:
			return monaco.MarkerSeverity.Info;
		case 4:
			return monaco.MarkerSeverity.Hint;
		default:
			return monaco.MarkerSeverity.Error;
	}
}

function convertCompletionItemKind(kind: number): monaco.languages.CompletionItemKind {
	const kindMap: { [key: number]: monaco.languages.CompletionItemKind } = {
		1: monaco.languages.CompletionItemKind.Text,
		2: monaco.languages.CompletionItemKind.Method,
		3: monaco.languages.CompletionItemKind.Function,
		4: monaco.languages.CompletionItemKind.Constructor,
		5: monaco.languages.CompletionItemKind.Field,
		6: monaco.languages.CompletionItemKind.Variable,
		7: monaco.languages.CompletionItemKind.Class,
		8: monaco.languages.CompletionItemKind.Interface,
		9: monaco.languages.CompletionItemKind.Module,
		10: monaco.languages.CompletionItemKind.Property,
		11: monaco.languages.CompletionItemKind.Unit,
		12: monaco.languages.CompletionItemKind.Value,
		13: monaco.languages.CompletionItemKind.Enum,
		14: monaco.languages.CompletionItemKind.Keyword,
		15: monaco.languages.CompletionItemKind.Snippet,
		16: monaco.languages.CompletionItemKind.Color,
		17: monaco.languages.CompletionItemKind.File,
		18: monaco.languages.CompletionItemKind.Reference,
		19: monaco.languages.CompletionItemKind.Folder,
		20: monaco.languages.CompletionItemKind.EnumMember,
		21: monaco.languages.CompletionItemKind.Constant,
		22: monaco.languages.CompletionItemKind.Struct,
		23: monaco.languages.CompletionItemKind.Event,
		24: monaco.languages.CompletionItemKind.Operator,
		25: monaco.languages.CompletionItemKind.TypeParameter
	};
	return kindMap[kind] || monaco.languages.CompletionItemKind.Property;
}

function convertSymbolKind(kind: number): monaco.languages.SymbolKind {
	const kindMap: { [key: number]: monaco.languages.SymbolKind } = {
		1: monaco.languages.SymbolKind.File,
		2: monaco.languages.SymbolKind.Module,
		3: monaco.languages.SymbolKind.Namespace,
		4: monaco.languages.SymbolKind.Package,
		5: monaco.languages.SymbolKind.Class,
		6: monaco.languages.SymbolKind.Method,
		7: monaco.languages.SymbolKind.Property,
		8: monaco.languages.SymbolKind.Field,
		9: monaco.languages.SymbolKind.Constructor,
		10: monaco.languages.SymbolKind.Enum,
		11: monaco.languages.SymbolKind.Interface,
		12: monaco.languages.SymbolKind.Function,
		13: monaco.languages.SymbolKind.Variable,
		14: monaco.languages.SymbolKind.Constant,
		15: monaco.languages.SymbolKind.String,
		16: monaco.languages.SymbolKind.Number,
		17: monaco.languages.SymbolKind.Boolean,
		18: monaco.languages.SymbolKind.Array,
		19: monaco.languages.SymbolKind.Object,
		20: monaco.languages.SymbolKind.Key,
		21: monaco.languages.SymbolKind.Null,
		22: monaco.languages.SymbolKind.EnumMember,
		23: monaco.languages.SymbolKind.Struct,
		24: monaco.languages.SymbolKind.Event,
		25: monaco.languages.SymbolKind.Operator,
		26: monaco.languages.SymbolKind.TypeParameter
	};
	return kindMap[kind] || monaco.languages.SymbolKind.Property;
}

function convertSymbol(symbol: any): monaco.languages.DocumentSymbol {
	return {
		name: symbol.name,
		detail: symbol.detail || '',
		kind: convertSymbolKind(symbol.kind),
		range: convertRange(symbol.range),
		selectionRange: convertRange(symbol.selectionRange),
		children: symbol.children ? symbol.children.map(convertSymbol) : undefined,
		tags: symbol.tags || []
	};
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
