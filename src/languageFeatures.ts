/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import {
	Diagnostic,
	DiagnosticRelatedInformation,
	LanguageServiceDefaults,
	typescriptDefaults
} from './monaco.contribution';
import type * as ts from './lib/typescriptServices';
import type { TypeScriptWorker } from './tsWorker';
import { libFileSet } from './lib/lib.index';
import {
	editor,
	languages,
	Uri,
	Position,
	Range,
	CancellationToken,
	IDisposable,
	IRange,
	MarkerTag,
	MarkerSeverity
} from './fillers/monaco-editor-core';

//#region utils copied from typescript to prevent loading the entire typescriptServices ---

enum IndentStyle {
	None = 0,
	Block = 1,
	Smart = 2
}

export function flattenDiagnosticMessageText(
	diag: string | ts.DiagnosticMessageChain | undefined,
	newLine: string,
	indent = 0
): string {
	if (typeof diag === 'string') {
		return diag;
	} else if (diag === undefined) {
		return '';
	}
	let result = '';
	if (indent) {
		result += newLine;

		for (let i = 0; i < indent; i++) {
			result += '  ';
		}
	}
	result += diag.messageText;
	indent++;
	if (diag.next) {
		for (const kid of diag.next) {
			result += flattenDiagnosticMessageText(kid, newLine, indent);
		}
	}
	return result;
}

function displayPartsToString(displayParts: ts.SymbolDisplayPart[] | undefined): string {
	if (displayParts) {
		return displayParts.map((displayPart) => displayPart.text).join('');
	}
	return '';
}

//#endregion

export abstract class Adapter {
	constructor(protected _worker: (...uris: Uri[]) => Promise<TypeScriptWorker>) {}

	// protected _positionToOffset(model: editor.ITextModel, position: monaco.IPosition): number {
	// 	return model.getOffsetAt(position);
	// }

	// protected _offsetToPosition(model: editor.ITextModel, offset: number): monaco.IPosition {
	// 	return model.getPositionAt(offset);
	// }

	protected _textSpanToRange(model: editor.ITextModel, span: ts.TextSpan): IRange {
		let p1 = model.getPositionAt(span.start);
		let p2 = model.getPositionAt(span.start + span.length);
		let { lineNumber: startLineNumber, column: startColumn } = p1;
		let { lineNumber: endLineNumber, column: endColumn } = p2;
		return { startLineNumber, startColumn, endLineNumber, endColumn };
	}
}

// --- lib files

export class LibFiles {
	private _libFiles: Record<string, string>;
	private _hasFetchedLibFiles: boolean;
	private _fetchLibFilesPromise: Promise<void> | null;

	constructor(private readonly _worker: (...uris: Uri[]) => Promise<TypeScriptWorker>) {
		this._libFiles = {};
		this._hasFetchedLibFiles = false;
		this._fetchLibFilesPromise = null;
	}

	public isLibFile(uri: Uri | null): boolean {
		if (!uri) {
			return false;
		}
		if (uri.path.indexOf('/lib.') === 0) {
			return !!libFileSet[uri.path.slice(1)];
		}
		return false;
	}

	public getOrCreateModel(uri: Uri): editor.ITextModel | null {
		const model = editor.getModel(uri);
		if (model) {
			return model;
		}
		if (this.isLibFile(uri) && this._hasFetchedLibFiles) {
			return editor.createModel(this._libFiles[uri.path.slice(1)], 'typescript', uri);
		}
		return null;
	}

	private _containsLibFile(uris: (Uri | null)[]): boolean {
		for (let uri of uris) {
			if (this.isLibFile(uri)) {
				return true;
			}
		}
		return false;
	}

	public async fetchLibFilesIfNecessary(uris: (Uri | null)[]): Promise<void> {
		if (!this._containsLibFile(uris)) {
			// no lib files necessary
			return;
		}
		await this._fetchLibFiles();
	}

	private _fetchLibFiles(): Promise<void> {
		if (!this._fetchLibFilesPromise) {
			this._fetchLibFilesPromise = this._worker()
				.then((w) => w.getLibFiles())
				.then((libFiles) => {
					this._hasFetchedLibFiles = true;
					this._libFiles = libFiles;
				});
		}
		return this._fetchLibFilesPromise;
	}
}

// --- diagnostics --- ---

enum DiagnosticCategory {
	Warning = 0,
	Error = 1,
	Suggestion = 2,
	Message = 3
}

/**
 * temporary interface until the editor API exposes
 * `IModel.isAttachedToEditor` and `IModel.onDidChangeAttached`
 */
interface IInternalEditorModel extends editor.IModel {
	onDidChangeAttached(listener: () => void): IDisposable;
	isAttachedToEditor(): boolean;
}

export class DiagnosticsAdapter extends Adapter {
	private _disposables: IDisposable[] = [];
	private _listener: { [uri: string]: IDisposable } = Object.create(null);

	constructor(
		private readonly _libFiles: LibFiles,
		private _defaults: LanguageServiceDefaults,
		private _selector: string,
		worker: (...uris: Uri[]) => Promise<TypeScriptWorker>
	) {
		super(worker);

		const onModelAdd = (model: IInternalEditorModel): void => {
			if (model.getModeId() !== _selector) {
				return;
			}

			const maybeValidate = () => {
				const { onlyVisible } = this._defaults.getDiagnosticsOptions();
				if (onlyVisible) {
					if (model.isAttachedToEditor()) {
						this._doValidate(model);
					}
				} else {
					this._doValidate(model);
				}
			};

			let handle: number;
			const changeSubscription = model.onDidChangeContent(() => {
				clearTimeout(handle);
				handle = setTimeout(maybeValidate, 500);
			});

			const visibleSubscription = model.onDidChangeAttached(() => {
				const { onlyVisible } = this._defaults.getDiagnosticsOptions();
				if (onlyVisible) {
					if (model.isAttachedToEditor()) {
						// this model is now attached to an editor
						// => compute diagnostics
						maybeValidate();
					} else {
						// this model is no longer attached to an editor
						// => clear existing diagnostics
						editor.setModelMarkers(model, this._selector, []);
					}
				}
			});

			this._listener[model.uri.toString()] = {
				dispose() {
					changeSubscription.dispose();
					visibleSubscription.dispose();
					clearTimeout(handle);
				}
			};

			maybeValidate();
		};

		const onModelRemoved = (model: editor.IModel): void => {
			editor.setModelMarkers(model, this._selector, []);
			const key = model.uri.toString();
			if (this._listener[key]) {
				this._listener[key].dispose();
				delete this._listener[key];
			}
		};

		this._disposables.push(editor.onDidCreateModel((model) => onModelAdd(<IInternalEditorModel>model)));
		this._disposables.push(editor.onWillDisposeModel(onModelRemoved));
		this._disposables.push(
			editor.onDidChangeModelLanguage((event) => {
				onModelRemoved(event.model);
				onModelAdd(<IInternalEditorModel>event.model);
			})
		);

		this._disposables.push({
			dispose() {
				for (const model of editor.getModels()) {
					onModelRemoved(model);
				}
			}
		});

		const recomputeDiagostics = () => {
			// redo diagnostics when options change
			for (const model of editor.getModels()) {
				onModelRemoved(model);
				onModelAdd(<IInternalEditorModel>model);
			}
		};
		this._disposables.push(this._defaults.onDidChange(recomputeDiagostics));
		this._disposables.push(this._defaults.onDidExtraLibsChange(recomputeDiagostics));

		editor.getModels().forEach((model) => onModelAdd(<IInternalEditorModel>model));
	}

	public dispose(): void {
		this._disposables.forEach((d) => d && d.dispose());
		this._disposables = [];
	}

	private async _doValidate(model: editor.ITextModel): Promise<void> {
		const worker = await this._worker(model.uri);

		if (model.isDisposed()) {
			// model was disposed in the meantime
			return;
		}

		const promises: Promise<Diagnostic[]>[] = [];
		const {
			noSyntaxValidation,
			noSemanticValidation,
			noSuggestionDiagnostics
		} = this._defaults.getDiagnosticsOptions();
		if (!noSyntaxValidation) {
			promises.push(worker.getSyntacticDiagnostics(model.uri.toString()));
		}
		if (!noSemanticValidation) {
			promises.push(worker.getSemanticDiagnostics(model.uri.toString()));
		}
		if (!noSuggestionDiagnostics) {
			promises.push(worker.getSuggestionDiagnostics(model.uri.toString()));
		}

		const allDiagnostics = await Promise.all(promises);

		if (!allDiagnostics || model.isDisposed()) {
			// model was disposed in the meantime
			return;
		}

		const diagnostics = allDiagnostics
			.reduce((p, c) => c.concat(p), [])
			.filter(
				(d) =>
					(this._defaults.getDiagnosticsOptions().diagnosticCodesToIgnore || []).indexOf(d.code) ===
					-1
			);

		// Fetch lib files if necessary
		const relatedUris = diagnostics
			.map((d) => d.relatedInformation || [])
			.reduce((p, c) => c.concat(p), [])
			.map((relatedInformation) =>
				relatedInformation.file ? Uri.parse(relatedInformation.file.fileName) : null
			);

		await this._libFiles.fetchLibFilesIfNecessary(relatedUris);

		if (model.isDisposed()) {
			// model was disposed in the meantime
			return;
		}

		editor.setModelMarkers(
			model,
			this._selector,
			diagnostics.map((d) => this._convertDiagnostics(model, d))
		);
	}

	private _convertDiagnostics(model: editor.ITextModel, diag: Diagnostic): editor.IMarkerData {
		const diagStart = diag.start || 0;
		const diagLength = diag.length || 1;
		const { lineNumber: startLineNumber, column: startColumn } = model.getPositionAt(diagStart);
		const { lineNumber: endLineNumber, column: endColumn } = model.getPositionAt(
			diagStart + diagLength
		);

		const tags: MarkerTag[] = [];
		if (diag.reportsUnnecessary) {
			tags.push(MarkerTag.Unnecessary);
		}
		if (diag.reportsDeprecated) {
			tags.push(MarkerTag.Deprecated);
		}

		return {
			severity: this._tsDiagnosticCategoryToMarkerSeverity(diag.category),
			startLineNumber,
			startColumn,
			endLineNumber,
			endColumn,
			message: flattenDiagnosticMessageText(diag.messageText, '\n'),
			code: diag.code.toString(),
			tags,
			relatedInformation: this._convertRelatedInformation(model, diag.relatedInformation)
		};
	}

	private _convertRelatedInformation(
		model: editor.ITextModel,
		relatedInformation?: DiagnosticRelatedInformation[]
	): editor.IRelatedInformation[] {
		if (!relatedInformation) {
			return [];
		}

		const result: editor.IRelatedInformation[] = [];
		relatedInformation.forEach((info) => {
			let relatedResource: editor.ITextModel | null = model;
			if (info.file) {
				const relatedResourceUri = Uri.parse(info.file.fileName);
				relatedResource = this._libFiles.getOrCreateModel(relatedResourceUri);
			}

			if (!relatedResource) {
				return;
			}
			const infoStart = info.start || 0;
			const infoLength = info.length || 1;
			const { lineNumber: startLineNumber, column: startColumn } = relatedResource.getPositionAt(
				infoStart
			);
			const { lineNumber: endLineNumber, column: endColumn } = relatedResource.getPositionAt(
				infoStart + infoLength
			);

			result.push({
				resource: relatedResource.uri,
				startLineNumber,
				startColumn,
				endLineNumber,
				endColumn,
				message: flattenDiagnosticMessageText(info.messageText, '\n')
			});
		});
		return result;
	}

	private _tsDiagnosticCategoryToMarkerSeverity(category: ts.DiagnosticCategory): MarkerSeverity {
		switch (category) {
			case DiagnosticCategory.Error:
				return MarkerSeverity.Error;
			case DiagnosticCategory.Message:
				return MarkerSeverity.Info;
			case DiagnosticCategory.Warning:
				return MarkerSeverity.Warning;
			case DiagnosticCategory.Suggestion:
				return MarkerSeverity.Hint;
		}
		return MarkerSeverity.Info;
	}
}

// --- suggest ------

interface MyCompletionItem extends languages.CompletionItem {
	label: string;
	uri: Uri;
	position: Position;
	offset: number;
}

export class SuggestAdapter extends Adapter implements languages.CompletionItemProvider {
	public get triggerCharacters(): string[] {
		return ['.'];
	}

	public async provideCompletionItems(
		model: editor.ITextModel,
		position: Position,
		_context: languages.CompletionContext,
		token: CancellationToken
	): Promise<languages.CompletionList | undefined> {
		const wordInfo = model.getWordUntilPosition(position);
		const wordRange = new Range(
			position.lineNumber,
			wordInfo.startColumn,
			position.lineNumber,
			wordInfo.endColumn
		);
		const resource = model.uri;
		const offset = model.getOffsetAt(position);

		const worker = await this._worker(resource);

		if (model.isDisposed()) {
			return;
		}

		const info = await worker.getCompletionsAtPosition(resource.toString(), offset);

		if (!info || model.isDisposed()) {
			return;
		}

		const suggestions: MyCompletionItem[] = info.entries.map((entry) => {
			let range = wordRange;
			if (entry.replacementSpan) {
				const p1 = model.getPositionAt(entry.replacementSpan.start);
				const p2 = model.getPositionAt(entry.replacementSpan.start + entry.replacementSpan.length);
				range = new Range(p1.lineNumber, p1.column, p2.lineNumber, p2.column);
			}

			const tags: languages.CompletionItemTag[] = [];
			if (entry.kindModifiers?.indexOf('deprecated') !== -1) {
				tags.push(languages.CompletionItemTag.Deprecated);
			}

			return {
				uri: resource,
				position: position,
				offset: offset,
				range: range,
				label: entry.name,
				insertText: entry.name,
				sortText: entry.sortText,
				kind: SuggestAdapter.convertKind(entry.kind),
				tags
			};
		});

		return {
			suggestions
		};
	}

	public async resolveCompletionItem(
		item: languages.CompletionItem,
		token: CancellationToken
	): Promise<languages.CompletionItem> {
		const myItem = <MyCompletionItem>item;
		const resource = myItem.uri;
		const position = myItem.position;
		const offset = myItem.offset;

		const worker = await this._worker(resource);
		const details = await worker.getCompletionEntryDetails(
			resource.toString(),
			offset,
			myItem.label
		);
		if (!details) {
			return myItem;
		}
		return <MyCompletionItem>{
			uri: resource,
			position: position,
			label: details.name,
			kind: SuggestAdapter.convertKind(details.kind),
			detail: displayPartsToString(details.displayParts),
			documentation: {
				value: SuggestAdapter.createDocumentationString(details)
			}
		};
	}

	private static convertKind(kind: string): languages.CompletionItemKind {
		switch (kind) {
			case Kind.primitiveType:
			case Kind.keyword:
				return languages.CompletionItemKind.Keyword;
			case Kind.variable:
			case Kind.localVariable:
				return languages.CompletionItemKind.Variable;
			case Kind.memberVariable:
			case Kind.memberGetAccessor:
			case Kind.memberSetAccessor:
				return languages.CompletionItemKind.Field;
			case Kind.function:
			case Kind.memberFunction:
			case Kind.constructSignature:
			case Kind.callSignature:
			case Kind.indexSignature:
				return languages.CompletionItemKind.Function;
			case Kind.enum:
				return languages.CompletionItemKind.Enum;
			case Kind.module:
				return languages.CompletionItemKind.Module;
			case Kind.class:
				return languages.CompletionItemKind.Class;
			case Kind.interface:
				return languages.CompletionItemKind.Interface;
			case Kind.warning:
				return languages.CompletionItemKind.File;
		}

		return languages.CompletionItemKind.Property;
	}

	private static createDocumentationString(details: ts.CompletionEntryDetails): string {
		let documentationString = displayPartsToString(details.documentation);
		if (details.tags) {
			for (const tag of details.tags) {
				documentationString += `\n\n${tagToString(tag)}`;
			}
		}
		return documentationString;
	}
}

function tagToString(tag: ts.JSDocTagInfo): string {
	let tagLabel = `*@${tag.name}*`;
	if (tag.name === 'param' && tag.text) {
		const [paramName, ...rest] = tag.text;
		tagLabel += `\`${paramName.text}\``;
		if (rest.length > 0) tagLabel += ` — ${rest.map(r => r.text).join(' ')}`;
	} else if (Array.isArray(tag.text)) {
		tagLabel += ` — ${tag.text.map(r => r.text).join(' ')}`;
	} else if (tag.text) {
		tagLabel += ` — ${tag.text}`;
	}
	return tagLabel;
}

export class SignatureHelpAdapter extends Adapter implements languages.SignatureHelpProvider {
	public signatureHelpTriggerCharacters = ['(', ','];

	private static _toSignatureHelpTriggerReason(
		context: languages.SignatureHelpContext
	): ts.SignatureHelpTriggerReason {
		switch (context.triggerKind) {
			case languages.SignatureHelpTriggerKind.TriggerCharacter:
				if (context.triggerCharacter) {
					if (context.isRetrigger) {
						return { kind: 'retrigger', triggerCharacter: context.triggerCharacter as any };
					} else {
						return { kind: 'characterTyped', triggerCharacter: context.triggerCharacter as any };
					}
				} else {
					return { kind: 'invoked' };
				}

			case languages.SignatureHelpTriggerKind.ContentChange:
				return context.isRetrigger ? { kind: 'retrigger' } : { kind: 'invoked' };

			case languages.SignatureHelpTriggerKind.Invoke:
			default:
				return { kind: 'invoked' };
		}
	}

	public async provideSignatureHelp(
		model: editor.ITextModel,
		position: Position,
		token: CancellationToken,
		context: languages.SignatureHelpContext
	): Promise<languages.SignatureHelpResult | undefined> {
		const resource = model.uri;
		const offset = model.getOffsetAt(position);
		const worker = await this._worker(resource);

		if (model.isDisposed()) {
			return;
		}

		const info = await worker.getSignatureHelpItems(resource.toString(), offset, {
			triggerReason: SignatureHelpAdapter._toSignatureHelpTriggerReason(context)
		});

		if (!info || model.isDisposed()) {
			return;
		}

		const ret: languages.SignatureHelp = {
			activeSignature: info.selectedItemIndex,
			activeParameter: info.argumentIndex,
			signatures: []
		};

		info.items.forEach((item) => {
			const signature: languages.SignatureInformation = {
				label: '',
				parameters: []
			};

			signature.documentation = {
				value: displayPartsToString(item.documentation)
			};
			signature.label += displayPartsToString(item.prefixDisplayParts);
			item.parameters.forEach((p, i, a) => {
				const label = displayPartsToString(p.displayParts);
				const parameter: languages.ParameterInformation = {
					label: label,
					documentation: {
						value: displayPartsToString(p.documentation)
					}
				};
				signature.label += label;
				signature.parameters.push(parameter);
				if (i < a.length - 1) {
					signature.label += displayPartsToString(item.separatorDisplayParts);
				}
			});
			signature.label += displayPartsToString(item.suffixDisplayParts);
			ret.signatures.push(signature);
		});

		return {
			value: ret,
			dispose() {}
		};
	}
}

// --- hover ------

export class QuickInfoAdapter extends Adapter implements languages.HoverProvider {
	public async provideHover(
		model: editor.ITextModel,
		position: Position,
		token: CancellationToken
	): Promise<languages.Hover | undefined> {
		const resource = model.uri;
		const offset = model.getOffsetAt(position);
		const worker = await this._worker(resource);

		if (model.isDisposed()) {
			return;
		}

		const info = await worker.getQuickInfoAtPosition(resource.toString(), offset);

		if (!info || model.isDisposed()) {
			return;
		}

		const documentation = displayPartsToString(info.documentation);
		const tags = info.tags ? info.tags.map((tag) => tagToString(tag)).join('  \n\n') : '';
		const contents = displayPartsToString(info.displayParts);
		return {
			range: this._textSpanToRange(model, info.textSpan),
			contents: [
				{
					value: '```typescript\n' + contents + '\n```\n'
				},
				{
					value: documentation + (tags ? '\n\n' + tags : '')
				}
			]
		};
	}
}

// --- occurrences ------

export class OccurrencesAdapter extends Adapter implements languages.DocumentHighlightProvider {
	public async provideDocumentHighlights(
		model: editor.ITextModel,
		position: Position,
		token: CancellationToken
	): Promise<languages.DocumentHighlight[] | undefined> {
		const resource = model.uri;
		const offset = model.getOffsetAt(position);
		const worker = await this._worker(resource);

		if (model.isDisposed()) {
			return;
		}

		const entries = await worker.getOccurrencesAtPosition(resource.toString(), offset);

		if (!entries || model.isDisposed()) {
			return;
		}

		return entries.map((entry) => {
			return <languages.DocumentHighlight>{
				range: this._textSpanToRange(model, entry.textSpan),
				kind: entry.isWriteAccess
					? languages.DocumentHighlightKind.Write
					: languages.DocumentHighlightKind.Text
			};
		});
	}
}

// --- definition ------

export class DefinitionAdapter extends Adapter {
	constructor(
		private readonly _libFiles: LibFiles,
		worker: (...uris: Uri[]) => Promise<TypeScriptWorker>
	) {
		super(worker);
	}

	public async provideDefinition(
		model: editor.ITextModel,
		position: Position,
		token: CancellationToken
	): Promise<languages.Definition | undefined> {
		const resource = model.uri;
		const offset = model.getOffsetAt(position);
		const worker = await this._worker(resource);

		if (model.isDisposed()) {
			return;
		}

		const entries = await worker.getDefinitionAtPosition(resource.toString(), offset);

		if (!entries || model.isDisposed()) {
			return;
		}

		// Fetch lib files if necessary
		await this._libFiles.fetchLibFilesIfNecessary(
			entries.map((entry) => Uri.parse(entry.fileName))
		);

		if (model.isDisposed()) {
			return;
		}

		const result: languages.Location[] = [];
		for (let entry of entries) {
			const uri = Uri.parse(entry.fileName);
			const refModel = this._libFiles.getOrCreateModel(uri);
			if (refModel) {
				result.push({
					uri: uri,
					range: this._textSpanToRange(refModel, entry.textSpan)
				});
			} else {
				const matchedLibFile = typescriptDefaults.getExtraLibs()[entry.fileName]
				if (matchedLibFile) {
					const libModel = editor.createModel(matchedLibFile.content, 'typescript', uri);
					return {
						uri: uri,
						range: this._textSpanToRange(libModel, entry.textSpan)
					}
				}


			}
		}
		return result;
	}
}

// --- references ------

export class ReferenceAdapter extends Adapter implements languages.ReferenceProvider {
	constructor(
		private readonly _libFiles: LibFiles,
		worker: (...uris: Uri[]) => Promise<TypeScriptWorker>
	) {
		super(worker);
	}

	public async provideReferences(
		model: editor.ITextModel,
		position: Position,
		context: languages.ReferenceContext,
		token: CancellationToken
	): Promise<languages.Location[] | undefined> {
		const resource = model.uri;
		const offset = model.getOffsetAt(position);
		const worker = await this._worker(resource);

		if (model.isDisposed()) {
			return;
		}

		const entries = await worker.getReferencesAtPosition(resource.toString(), offset);

		if (!entries || model.isDisposed()) {
			return;
		}

		// Fetch lib files if necessary
		await this._libFiles.fetchLibFilesIfNecessary(
			entries.map((entry) => Uri.parse(entry.fileName))
		);

		if (model.isDisposed()) {
			return;
		}

		const result: languages.Location[] = [];
		for (let entry of entries) {
			const uri = Uri.parse(entry.fileName);
			const refModel = this._libFiles.getOrCreateModel(uri);
			if (refModel) {
				result.push({
					uri: uri,
					range: this._textSpanToRange(refModel, entry.textSpan)
				});
			}
		}
		return result;
	}
}

// --- outline ------

export class OutlineAdapter extends Adapter implements languages.DocumentSymbolProvider {
	public async provideDocumentSymbols(
		model: editor.ITextModel,
		token: CancellationToken
	): Promise<languages.DocumentSymbol[] | undefined> {
		const resource = model.uri;
		const worker = await this._worker(resource);

		if (model.isDisposed()) {
			return;
		}

		const items = await worker.getNavigationBarItems(resource.toString());

		if (!items || model.isDisposed()) {
			return;
		}

		const convert = (
			bucket: languages.DocumentSymbol[],
			item: ts.NavigationBarItem,
			containerLabel?: string
		): void => {
			let result: languages.DocumentSymbol = {
				name: item.text,
				detail: '',
				kind: <languages.SymbolKind>(outlineTypeTable[item.kind] || languages.SymbolKind.Variable),
				range: this._textSpanToRange(model, item.spans[0]),
				selectionRange: this._textSpanToRange(model, item.spans[0]),
				tags: [],
			};

			if (containerLabel) result.containerName = containerLabel;

			if (item.childItems && item.childItems.length > 0) {
				for (let child of item.childItems) {
					convert(bucket, child, result.name);
				}
			}

			bucket.push(result);
		};

		let result: languages.DocumentSymbol[] = [];
		items.forEach((item) => convert(result, item));
		return result;
	}
}

export class Kind {
	public static unknown: string = '';
	public static keyword: string = 'keyword';
	public static script: string = 'script';
	public static module: string = 'module';
	public static class: string = 'class';
	public static interface: string = 'interface';
	public static type: string = 'type';
	public static enum: string = 'enum';
	public static variable: string = 'var';
	public static localVariable: string = 'local var';
	public static function: string = 'function';
	public static localFunction: string = 'local function';
	public static memberFunction: string = 'method';
	public static memberGetAccessor: string = 'getter';
	public static memberSetAccessor: string = 'setter';
	public static memberVariable: string = 'property';
	public static constructorImplementation: string = 'constructor';
	public static callSignature: string = 'call';
	public static indexSignature: string = 'index';
	public static constructSignature: string = 'construct';
	public static parameter: string = 'parameter';
	public static typeParameter: string = 'type parameter';
	public static primitiveType: string = 'primitive type';
	public static label: string = 'label';
	public static alias: string = 'alias';
	public static const: string = 'const';
	public static let: string = 'let';
	public static warning: string = 'warning';
}

let outlineTypeTable: {
	[kind: string]: languages.SymbolKind;
} = Object.create(null);
outlineTypeTable[Kind.module] = languages.SymbolKind.Module;
outlineTypeTable[Kind.class] = languages.SymbolKind.Class;
outlineTypeTable[Kind.enum] = languages.SymbolKind.Enum;
outlineTypeTable[Kind.interface] = languages.SymbolKind.Interface;
outlineTypeTable[Kind.memberFunction] = languages.SymbolKind.Method;
outlineTypeTable[Kind.memberVariable] = languages.SymbolKind.Property;
outlineTypeTable[Kind.memberGetAccessor] = languages.SymbolKind.Property;
outlineTypeTable[Kind.memberSetAccessor] = languages.SymbolKind.Property;
outlineTypeTable[Kind.variable] = languages.SymbolKind.Variable;
outlineTypeTable[Kind.const] = languages.SymbolKind.Variable;
outlineTypeTable[Kind.localVariable] = languages.SymbolKind.Variable;
outlineTypeTable[Kind.variable] = languages.SymbolKind.Variable;
outlineTypeTable[Kind.function] = languages.SymbolKind.Function;
outlineTypeTable[Kind.localFunction] = languages.SymbolKind.Function;

// --- formatting ----

export abstract class FormatHelper extends Adapter {
	protected static _convertOptions(options: languages.FormattingOptions): ts.FormatCodeOptions {
		return {
			ConvertTabsToSpaces: options.insertSpaces,
			TabSize: options.tabSize,
			IndentSize: options.tabSize,
			IndentStyle: IndentStyle.Smart,
			NewLineCharacter: '\n',
			InsertSpaceAfterCommaDelimiter: true,
			InsertSpaceAfterSemicolonInForStatements: true,
			InsertSpaceBeforeAndAfterBinaryOperators: true,
			InsertSpaceAfterKeywordsInControlFlowStatements: true,
			InsertSpaceAfterFunctionKeywordForAnonymousFunctions: true,
			InsertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis: false,
			InsertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets: false,
			InsertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces: false,
			PlaceOpenBraceOnNewLineForControlBlocks: false,
			PlaceOpenBraceOnNewLineForFunctions: false
		};
	}

	protected _convertTextChanges(
		model: editor.ITextModel,
		change: ts.TextChange
	): languages.TextEdit {
		return {
			text: change.newText,
			range: this._textSpanToRange(model, change.span)
		};
	}
}

export class FormatAdapter
	extends FormatHelper
	implements languages.DocumentRangeFormattingEditProvider {
	public async provideDocumentRangeFormattingEdits(
		model: editor.ITextModel,
		range: Range,
		options: languages.FormattingOptions,
		token: CancellationToken
	): Promise<languages.TextEdit[] | undefined> {
		const resource = model.uri;
		const startOffset = model.getOffsetAt({
			lineNumber: range.startLineNumber,
			column: range.startColumn
		});
		const endOffset = model.getOffsetAt({
			lineNumber: range.endLineNumber,
			column: range.endColumn
		});
		const worker = await this._worker(resource);

		if (model.isDisposed()) {
			return;
		}

		const edits = await worker.getFormattingEditsForRange(
			resource.toString(),
			startOffset,
			endOffset,
			FormatHelper._convertOptions(options)
		);

		if (!edits || model.isDisposed()) {
			return;
		}

		return edits.map((edit) => this._convertTextChanges(model, edit));
	}
}

export class FormatOnTypeAdapter
	extends FormatHelper
	implements languages.OnTypeFormattingEditProvider {
	get autoFormatTriggerCharacters() {
		return [';', '}', '\n'];
	}

	public async provideOnTypeFormattingEdits(
		model: editor.ITextModel,
		position: Position,
		ch: string,
		options: languages.FormattingOptions,
		token: CancellationToken
	): Promise<languages.TextEdit[] | undefined> {
		const resource = model.uri;
		const offset = model.getOffsetAt(position);
		const worker = await this._worker(resource);

		if (model.isDisposed()) {
			return;
		}

		const edits = await worker.getFormattingEditsAfterKeystroke(
			resource.toString(),
			offset,
			ch,
			FormatHelper._convertOptions(options)
		);

		if (!edits || model.isDisposed()) {
			return;
		}

		return edits.map((edit) => this._convertTextChanges(model, edit));
	}
}

// --- code actions ------

export class CodeActionAdaptor extends FormatHelper implements languages.CodeActionProvider {
	public async provideCodeActions(
		model: editor.ITextModel,
		range: Range,
		context: languages.CodeActionContext,
		token: CancellationToken
	): Promise<languages.CodeActionList | undefined> {
		const resource = model.uri;
		const start = model.getOffsetAt({
			lineNumber: range.startLineNumber,
			column: range.startColumn
		});
		const end = model.getOffsetAt({
			lineNumber: range.endLineNumber,
			column: range.endColumn
		});
		const formatOptions = FormatHelper._convertOptions(model.getOptions());
		const errorCodes = context.markers
			.filter((m) => m.code)
			.map((m) => m.code)
			.map(Number);
		const worker = await this._worker(resource);

		if (model.isDisposed()) {
			return;
		}

		const codeFixes = await worker.getCodeFixesAtPosition(
			resource.toString(),
			start,
			end,
			errorCodes,
			formatOptions
		);

		if (!codeFixes || model.isDisposed()) {
			return { actions: [], dispose: () => {} };
		}

		const actions = codeFixes
			.filter((fix) => {
				// Removes any 'make a new file'-type code fix
				return fix.changes.filter((change) => change.isNewFile).length === 0;
			})
			.map((fix) => {
				return this._tsCodeFixActionToMonacoCodeAction(model, context, fix);
			});

		return {
			actions: actions,
			dispose: () => {}
		};
	}

	private _tsCodeFixActionToMonacoCodeAction(
		model: editor.ITextModel,
		context: languages.CodeActionContext,
		codeFix: ts.CodeFixAction
	): languages.CodeAction {
		const edits: languages.WorkspaceTextEdit[] = [];
		for (const change of codeFix.changes) {
			for (const textChange of change.textChanges) {
				edits.push({
					resource: model.uri,
					edit: {
						range: this._textSpanToRange(model, textChange.span),
						text: textChange.newText
					}
				});
			}
		}

		const action: languages.CodeAction = {
			title: codeFix.description,
			edit: { edits: edits },
			diagnostics: context.markers,
			kind: 'quickfix'
		};

		return action;
	}
}
// --- rename ----

export class RenameAdapter extends Adapter implements languages.RenameProvider {
	public async provideRenameEdits(
		model: editor.ITextModel,
		position: Position,
		newName: string,
		token: CancellationToken
	): Promise<(languages.WorkspaceEdit & languages.Rejection) | undefined> {
		const resource = model.uri;
		const fileName = resource.toString();
		const offset = model.getOffsetAt(position);
		const worker = await this._worker(resource);

		if (model.isDisposed()) {
			return;
		}

		const renameInfo = await worker.getRenameInfo(fileName, offset, {
			allowRenameOfImportPath: false
		});
		if (renameInfo.canRename === false) {
			// use explicit comparison so that the discriminated union gets resolved properly
			return {
				edits: [],
				rejectReason: renameInfo.localizedErrorMessage
			};
		}
		if (renameInfo.fileToRename !== undefined) {
			throw new Error('Renaming files is not supported.');
		}

		const renameLocations = await worker.findRenameLocations(
			fileName,
			offset,
			/*strings*/ false,
			/*comments*/ false,
			/*prefixAndSuffix*/ false
		);

		if (!renameLocations || model.isDisposed()) {
			return;
		}

		const edits: languages.WorkspaceTextEdit[] = [];
		for (const renameLocation of renameLocations) {
			const resource = Uri.parse(renameLocation.fileName);
			const model = editor.getModel(resource);
			if (model) {
				edits.push({
					resource,
					edit: {
						range: this._textSpanToRange(model, renameLocation.textSpan),
						text: newName
					}
				});
			} else {
				throw new Error(`Unknown URI ${resource}.`);
			}
		}

		return { edits };
	}
}

// --- inlay hints ----

export class InlayHintsAdapter extends Adapter implements languages.InlayHintsProvider {
	public async provideInlayHints(
		model: editor.ITextModel,
		range: Range,
		token: CancellationToken
	): Promise<languages.InlayHint[]> {
		const resource = model.uri;
		const fileName = resource.toString();
		const start = model.getOffsetAt({
			lineNumber: range.startLineNumber,
			column: range.startColumn
		});
		const end = model.getOffsetAt({
			lineNumber: range.endLineNumber,
			column: range.endColumn
		});
		const worker = await this._worker(resource);
		if (model.isDisposed()) {
			return [];
		}

		const hints = await worker.provideInlayHints(fileName, start, end);

		return hints.map(hint => {
			return {
				...hint,
				position: model.getPositionAt(hint.position),
				kind: this._convertHintKind(hint.kind)
			}
		})
	}

	private _convertHintKind (kind?: ts.InlayHintKind) {
		switch (kind) {
			case "Parameter":
				return languages.InlayHintKind.Parameter;
			case "Type":
				return languages.InlayHintKind.Type;
			default:
				return languages.InlayHintKind.Other;
		}
	}
}