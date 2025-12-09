/*---------------------------------------------------------------------------------------------
 *  JSON with Interpolation - Mode Setup
 *  Registers all language providers including variable completion/hover
 *--------------------------------------------------------------------------------------------*/

import { WorkerManager } from '../json/workerManager';
import type { JSONWorker } from '../json/jsonWorker';
import { LanguageServiceDefaults, VariableDefinition } from './monaco.contribution';
import * as languageFeatures from '../common/lspLanguageFeatures';
import { conf, language } from './jsonInterpolation';
import { Uri, IDisposable, languages, editor, Position, CancellationToken } from 'monaco-editor-core';

let worker: languageFeatures.WorkerAccessor<JSONWorker>;

export function getWorker(): Promise<(...uris: Uri[]) => Promise<JSONWorker>> {
	return new Promise((resolve, reject) => {
		if (!worker) {
			return reject('JSON Interpolation not registered!');
		}
		resolve(worker);
	});
}

// --- Custom Diagnostics Adapter that filters out interpolation syntax errors ---

class JSONInterpolationDiagnosticsAdapter implements IDisposable {
	private readonly _disposables: IDisposable[] = [];
	private readonly _listener: { [uri: string]: IDisposable } = Object.create(null);

	constructor(
		private readonly _languageId: string,
		private readonly _worker: languageFeatures.WorkerAccessor<JSONWorker>,
		defaults: LanguageServiceDefaults
	) {
		const onModelAdd = (model: editor.ITextModel): void => {
			const modeId = model.getLanguageId();
			if (modeId !== this._languageId) {
				return;
			}

			let handle: number;
			this._listener[model.uri.toString()] = model.onDidChangeContent(() => {
				window.clearTimeout(handle);
				handle = window.setTimeout(() => this._doValidate(model, modeId), 500);
			});

			this._doValidate(model, modeId);
		};

		const onModelRemoved = (model: editor.ITextModel): void => {
			editor.setModelMarkers(model, this._languageId, []);

			const uriStr = model.uri.toString();
			const listener = this._listener[uriStr];
			if (listener) {
				listener.dispose();
				delete this._listener[uriStr];
			}
		};

		this._disposables.push(editor.onDidCreateModel(onModelAdd));
		this._disposables.push(editor.onWillDisposeModel(onModelRemoved));
		this._disposables.push(
			editor.onDidChangeModelLanguage((event) => {
				onModelRemoved(event.model);
				onModelAdd(event.model);
			})
		);

		this._disposables.push(
			defaults.onDidChange((_) => {
				editor.getModels().forEach((model) => {
					if (model.getLanguageId() === this._languageId) {
						onModelRemoved(model);
						onModelAdd(model);
					}
				});
			})
		);

		this._disposables.push(
			editor.onWillDisposeModel((model) => {
				this._resetSchema(model.uri);
			})
		);

		this._disposables.push(
			editor.onDidChangeModelLanguage((event) => {
				this._resetSchema(event.model.uri);
			})
		);

		this._disposables.push({
			dispose: () => {
				editor.getModels().forEach(onModelRemoved);
				for (const key in this._listener) {
					this._listener[key].dispose();
				}
			}
		});

		editor.getModels().forEach(onModelAdd);
	}

	public dispose(): void {
		this._disposables.forEach((d) => d && d.dispose());
		this._disposables.length = 0;
	}

	private _resetSchema(resource: Uri): void {
		this._worker(resource).then((worker) => {
			worker.resetSchema(resource.toString());
		});
	}

	private _doValidate(model: editor.ITextModel, languageId: string): void {
		this._worker(model.uri)
			.then((worker) => worker.doValidation(model.uri.toString()))
			.then((diagnostics) => {
				// Filter out diagnostics that are inside or related to ${...} interpolations
				const text = model.getValue();
				const filteredDiagnostics = diagnostics.filter((diag) => {
					const startOffset = model.getOffsetAt({
						lineNumber: diag.range.start.line + 1,
						column: diag.range.start.character + 1
					});
					const endOffset = model.getOffsetAt({
						lineNumber: diag.range.end.line + 1,
						column: diag.range.end.character + 1
					});

					// Check if this diagnostic overlaps with any interpolation
					const interpolationRegex = /\$\{[^}]*\}/g;
					let match;

					while ((match = interpolationRegex.exec(text)) !== null) {
						const interpStart = match.index;
						const interpEnd = interpStart + match[0].length;

						// If the diagnostic overlaps with interpolation, filter it out
						if (startOffset < interpEnd && endOffset > interpStart) {
							return false;
						}
					}

					return true;
				});

				// Convert to Monaco markers
				const markers = filteredDiagnostics.map((diag) => ({
					severity: this._convertSeverity(diag.severity),
					startLineNumber: diag.range.start.line + 1,
					startColumn: diag.range.start.character + 1,
					endLineNumber: diag.range.end.line + 1,
					endColumn: diag.range.end.character + 1,
					message: diag.message,
					code: typeof diag.code === 'number' ? String(diag.code) : diag.code
				}));

				if (model.getLanguageId() === languageId) {
					editor.setModelMarkers(model, languageId, markers);
				}
			})
			.catch((err) => {
				console.error(err);
			});
	}

	private _convertSeverity(severity: number | undefined): editor.MarkerSeverity {
		switch (severity) {
			case 1:
				return editor.MarkerSeverity.Error;
			case 2:
				return editor.MarkerSeverity.Warning;
			case 3:
				return editor.MarkerSeverity.Info;
			case 4:
				return editor.MarkerSeverity.Hint;
			default:
				return editor.MarkerSeverity.Error;
		}
	}
}

// --- Variable Completion Provider ---

class VariableCompletionProvider implements languages.CompletionItemProvider {
	triggerCharacters = ['$', '{'];

	constructor(private _defaults: LanguageServiceDefaults) {}

	async provideCompletionItems(
		model: editor.ITextModel,
		position: Position,
		_context: languages.CompletionContext,
		_token: CancellationToken
	): Promise<languages.CompletionList | null> {
		const variableContext = this._defaults.variableContext;
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

		// Find if we're inside an unclosed ${
		const lastInterpolationStart = textUntilPosition.lastIndexOf('${');
		if (lastInterpolationStart === -1) {
			return null;
		}

		const afterInterpolationStart = textUntilPosition.substring(lastInterpolationStart);
		if (afterInterpolationStart.includes('}')) {
			// The interpolation is closed, we're not inside it
			return null;
		}

		// We're inside an interpolation! Get variables
		const variables = await variableContext.getVariables();

		// Get the word being typed after ${
		const wordInfo = model.getWordUntilPosition(position);
		const range = {
			startLineNumber: position.lineNumber,
			startColumn: wordInfo.startColumn,
			endLineNumber: position.lineNumber,
			endColumn: wordInfo.endColumn
		};

		const suggestions: languages.CompletionItem[] = variables.map((variable) => ({
			label: variable.name,
			kind: languages.CompletionItemKind.Variable,
			detail: variable.detail || variable.type,
			documentation: this._formatDocumentation(variable),
			insertText: variable.name,
			range: range
		}));

		return { suggestions };
	}

	private _formatDocumentation(variable: VariableDefinition): string | { value: string } {
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
}

// --- Variable Hover Provider ---

class VariableHoverProvider implements languages.HoverProvider {
	constructor(private _defaults: LanguageServiceDefaults) {}

	async provideHover(
		model: editor.ITextModel,
		position: Position,
		_token: CancellationToken
	): Promise<languages.Hover | null> {
		const variableContext = this._defaults.variableContext;
		if (!variableContext) {
			return null;
		}

		// Check if we're hovering over something inside ${...}
		const line = model.getLineContent(position.lineNumber);
		const offset = position.column - 1;

		// Find interpolation boundaries on this line
		let inInterpolation = false;
		let interpStart = -1;
		let interpEnd = -1;

		for (let i = 0; i < line.length - 1; i++) {
			if (line[i] === '$' && line[i + 1] === '{') {
				if (i < offset) {
					inInterpolation = true;
					interpStart = i + 2; // After ${
				}
			} else if (line[i] === '}' && inInterpolation) {
				if (i >= offset) {
					interpEnd = i;
					break;
				}
				inInterpolation = false;
			}
		}

		if (!inInterpolation || interpStart === -1) {
			return null;
		}

		if (interpEnd === -1) {
			interpEnd = line.length;
		}

		// Get the word at position
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

		const contents: languages.IMarkdownString[] = [];

		// Type signature
		if (variable.type) {
			contents.push({
				value: `\`\`\`typescript\n(variable) ${variable.name}: ${variable.type}\n\`\`\``
			});
		} else {
			contents.push({
				value: `\`\`\`typescript\n(variable) ${variable.name}\n\`\`\``
			});
		}

		// Description
		if (variable.description) {
			contents.push({ value: variable.description });
		}

		// Current value
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

// --- Mode Setup ---

export function setupMode(defaults: LanguageServiceDefaults): IDisposable {
	const disposables: IDisposable[] = [];
	const providers: IDisposable[] = [];

	const client = new WorkerManager(defaults as any); // Reuse JSON worker manager
	disposables.push(client);

	worker = (...uris: Uri[]): Promise<JSONWorker> => {
		return client.getLanguageServiceWorker(...uris);
	};

	function registerProviders(): void {
		const { languageId, modeConfiguration } = defaults;

		disposeAll(providers);

		// Register Monarch tokenizer
		if (modeConfiguration.tokens) {
			providers.push(languages.setMonarchTokensProvider(languageId, language));
		}

		// Register language configuration
		providers.push(languages.setLanguageConfiguration(languageId, conf));

		// JSON language service providers (reusing from json worker)
		if (modeConfiguration.documentFormattingEdits) {
			providers.push(
				languages.registerDocumentFormattingEditProvider(
					languageId,
					new languageFeatures.DocumentFormattingEditProvider(worker)
				)
			);
		}

		if (modeConfiguration.documentRangeFormattingEdits) {
			providers.push(
				languages.registerDocumentRangeFormattingEditProvider(
					languageId,
					new languageFeatures.DocumentRangeFormattingEditProvider(worker)
				)
			);
		}

		if (modeConfiguration.completionItems) {
			// Standard JSON completions
			providers.push(
				languages.registerCompletionItemProvider(
					languageId,
					new languageFeatures.CompletionAdapter(worker, [' ', ':', '"'])
				)
			);

			// Variable completions inside ${...}
			providers.push(
				languages.registerCompletionItemProvider(
					languageId,
					new VariableCompletionProvider(defaults)
				)
			);
		}

		if (modeConfiguration.hovers) {
			// Standard JSON hover
			providers.push(
				languages.registerHoverProvider(languageId, new languageFeatures.HoverAdapter(worker))
			);

			// Variable hover inside ${...}
			providers.push(
				languages.registerHoverProvider(languageId, new VariableHoverProvider(defaults))
			);
		}

		if (modeConfiguration.documentSymbols) {
			providers.push(
				languages.registerDocumentSymbolProvider(
					languageId,
					new languageFeatures.DocumentSymbolAdapter(worker)
				)
			);
		}

		if (modeConfiguration.colors) {
			providers.push(
				languages.registerColorProvider(
					languageId,
					new languageFeatures.DocumentColorAdapter(worker)
				)
			);
		}

		if (modeConfiguration.foldingRanges) {
			providers.push(
				languages.registerFoldingRangeProvider(
					languageId,
					new languageFeatures.FoldingRangeAdapter(worker)
				)
			);
		}

		if (modeConfiguration.diagnostics) {
			providers.push(new JSONInterpolationDiagnosticsAdapter(languageId, worker, defaults));
		}

		if (modeConfiguration.selectionRanges) {
			providers.push(
				languages.registerSelectionRangeProvider(
					languageId,
					new languageFeatures.SelectionRangeAdapter(worker)
				)
			);
		}
	}

	registerProviders();

	let modeConfiguration = defaults.modeConfiguration;
	defaults.onDidChange((newDefaults) => {
		if (newDefaults.modeConfiguration !== modeConfiguration) {
			modeConfiguration = newDefaults.modeConfiguration;
			registerProviders();
		}
	});

	disposables.push(asDisposable(providers));

	return asDisposable(disposables);
}

function asDisposable(disposables: IDisposable[]): IDisposable {
	return { dispose: () => disposeAll(disposables) };
}

function disposeAll(disposables: IDisposable[]) {
	while (disposables.length) {
		disposables.pop()!.dispose();
	}
}
