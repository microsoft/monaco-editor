/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { LanguageServiceDefaultsImpl } from './monaco.contribution';
import * as ts from './lib/typescriptServices';
import { TypeScriptWorker } from './tsWorker';
import { libFileSet } from "./lib/lib.index"

import Uri = monaco.Uri;
import Position = monaco.Position;
import Range = monaco.Range;
import CancellationToken = monaco.CancellationToken;
import IDisposable = monaco.IDisposable;

//#region utils copied from typescript to prevent loading the entire typescriptServices ---

enum IndentStyle {
	None = 0,
	Block = 1,
	Smart = 2
}

export function flattenDiagnosticMessageText(diag: string | ts.DiagnosticMessageChain | undefined, newLine: string, indent = 0): string {
	if (typeof diag === "string") {
		return diag;
	}
	else if (diag === undefined) {
		return "";
	}
	let result = "";
	if (indent) {
		result += newLine;

		for (let i = 0; i < indent; i++) {
			result += "  ";
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
		return displayParts.map((displayPart) => displayPart.text).join("");
	}
	return "";
}

//#endregion

export abstract class Adapter {

	constructor(protected _worker: (...uris: Uri[]) => Promise<TypeScriptWorker>) {
	}

	// protected _positionToOffset(model: monaco.editor.ITextModel, position: monaco.IPosition): number {
	// 	return model.getOffsetAt(position);
	// }

	// protected _offsetToPosition(model: monaco.editor.ITextModel, offset: number): monaco.IPosition {
	// 	return model.getPositionAt(offset);
	// }

	protected _textSpanToRange(model: monaco.editor.ITextModel, span: ts.TextSpan): monaco.IRange {
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

	constructor(
		private readonly _worker: (...uris: Uri[]) => Promise<TypeScriptWorker>
	) {
		this._libFiles = {};
		this._hasFetchedLibFiles = false;
		this._fetchLibFilesPromise = null;
	}

	public isLibFile(uri: Uri | null): boolean {
		if (!uri) {
			return false;
		}
		if (uri.path.indexOf("/lib.") === 0) {
			return !!libFileSet[uri.path.slice(1)];
		}
		return false;
	}

	public getOrCreateModel(uri: Uri): monaco.editor.ITextModel | null {
		const model = monaco.editor.getModel(uri);
		if (model) {
			return model;
		}
		if (this.isLibFile(uri) && this._hasFetchedLibFiles) {
			return monaco.editor.createModel(this._libFiles[uri.path.slice(1)], "javascript", uri);
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
			this._fetchLibFilesPromise = (
				this._worker()
					.then(w => w.getLibFiles())
					.then((libFiles) => {
						this._hasFetchedLibFiles = true;
						this._libFiles = libFiles;
					})
			);
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

export class DiagnosticsAdapter extends Adapter {

	private _disposables: IDisposable[] = [];
	private _listener: { [uri: string]: IDisposable } = Object.create(null);

	constructor(
		private readonly _libFiles: LibFiles,
		private _defaults: LanguageServiceDefaultsImpl,
		private _selector: string,
		worker: (...uris: Uri[]) => Promise<TypeScriptWorker>
	) {
		super(worker);

		const onModelAdd = (model: monaco.editor.IModel): void => {
			if (model.getModeId() !== _selector) {
				return;
			}

			let handle: number;
			const changeSubscription = model.onDidChangeContent(() => {
				clearTimeout(handle);
				handle = setTimeout(() => this._doValidate(model), 500);
			});

			this._listener[model.uri.toString()] = {
				dispose() {
					changeSubscription.dispose();
					clearTimeout(handle);
				}
			};

			this._doValidate(model);
		};

		const onModelRemoved = (model: monaco.editor.IModel): void => {
			monaco.editor.setModelMarkers(model, this._selector, []);
			const key = model.uri.toString();
			if (this._listener[key]) {
				this._listener[key].dispose();
				delete this._listener[key];
			}
		};

		this._disposables.push(monaco.editor.onDidCreateModel(onModelAdd));
		this._disposables.push(monaco.editor.onWillDisposeModel(onModelRemoved));
		this._disposables.push(monaco.editor.onDidChangeModelLanguage(event => {
			onModelRemoved(event.model);
			onModelAdd(event.model);
		}));

		this._disposables.push({
			dispose() {
				for (const model of monaco.editor.getModels()) {
					onModelRemoved(model);
				}
			}
		});

		const recomputeDiagostics = () => {
			// redo diagnostics when options change
			for (const model of monaco.editor.getModels()) {
				onModelRemoved(model);
				onModelAdd(model);
			}
		};
		this._disposables.push(this._defaults.onDidChange(recomputeDiagostics));
		this._disposables.push(this._defaults.onDidExtraLibsChange(recomputeDiagostics));

		monaco.editor.getModels().forEach(onModelAdd);
	}

	public dispose(): void {
		this._disposables.forEach(d => d && d.dispose());
		this._disposables = [];
	}

	private async _doValidate(model: monaco.editor.ITextModel): Promise<void> {
		const worker = await this._worker(model.uri);

		if (model.isDisposed()) {
			// model was disposed in the meantime
			return;
		}

		const promises: Promise<ts.Diagnostic[]>[] = [];
		const { noSyntaxValidation, noSemanticValidation, noSuggestionDiagnostics } = this._defaults.getDiagnosticsOptions();
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
			.filter(d => (this._defaults.getDiagnosticsOptions().diagnosticCodesToIgnore || []).indexOf(d.code) === -1);

		// Fetch lib files if necessary
		const relatedUris = diagnostics
			.map(d => d.relatedInformation || [])
			.reduce((p, c) => c.concat(p), [])
			.map(relatedInformation => relatedInformation.file ? monaco.Uri.parse(relatedInformation.file.fileName) : null);

		await this._libFiles.fetchLibFilesIfNecessary(relatedUris);

		if (model.isDisposed()) {
			// model was disposed in the meantime
			return;
		}

		monaco.editor.setModelMarkers(model, this._selector, diagnostics.map(d => this._convertDiagnostics(model, d)));
	}

	private _convertDiagnostics(model: monaco.editor.ITextModel, diag: ts.Diagnostic): monaco.editor.IMarkerData {
		const diagStart = diag.start || 0;
		const diagLength = diag.length || 1;
		const { lineNumber: startLineNumber, column: startColumn } = model.getPositionAt(diagStart);
		const { lineNumber: endLineNumber, column: endColumn } = model.getPositionAt(diagStart + diagLength);

		return {
			severity: this._tsDiagnosticCategoryToMarkerSeverity(diag.category),
			startLineNumber,
			startColumn,
			endLineNumber,
			endColumn,
			message: flattenDiagnosticMessageText(diag.messageText, '\n'),
			code: diag.code.toString(),
			tags: diag.reportsUnnecessary ? [monaco.MarkerTag.Unnecessary] : [],
			relatedInformation: this._convertRelatedInformation(model, diag.relatedInformation),
		};
	}

	private _convertRelatedInformation(model: monaco.editor.ITextModel, relatedInformation?: ts.DiagnosticRelatedInformation[]): monaco.editor.IRelatedInformation[] | undefined {
		if (!relatedInformation) {
			return;
		}

		const result: monaco.editor.IRelatedInformation[] = [];
		relatedInformation.forEach((info) => {
			let relatedResource: monaco.editor.ITextModel | null = model;
			if (info.file) {
				const relatedResourceUri = monaco.Uri.parse(info.file.fileName);
				relatedResource = this._libFiles.getOrCreateModel(relatedResourceUri);
			}

			if (!relatedResource) {
				return;
			}
			const infoStart = info.start || 0;
			const infoLength = info.length || 1;
			const { lineNumber: startLineNumber, column: startColumn } = relatedResource.getPositionAt(infoStart);
			const { lineNumber: endLineNumber, column: endColumn } = relatedResource.getPositionAt(infoStart + infoLength);

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

	private _tsDiagnosticCategoryToMarkerSeverity(category: ts.DiagnosticCategory): monaco.MarkerSeverity {
		switch (category) {
			case DiagnosticCategory.Error: return monaco.MarkerSeverity.Error
			case DiagnosticCategory.Message: return monaco.MarkerSeverity.Info
			case DiagnosticCategory.Warning: return monaco.MarkerSeverity.Warning
			case DiagnosticCategory.Suggestion: return monaco.MarkerSeverity.Hint
		}
		return monaco.MarkerSeverity.Info;
	}
}

// --- suggest ------

interface MyCompletionItem extends monaco.languages.CompletionItem {
	label: string;
	uri: Uri;
	position: Position;
}

export class SuggestAdapter extends Adapter implements monaco.languages.CompletionItemProvider {

	public get triggerCharacters(): string[] {
		return ['.'];
	}

	public async provideCompletionItems(model: monaco.editor.ITextModel, position: Position, _context: monaco.languages.CompletionContext, token: CancellationToken): Promise<monaco.languages.CompletionList | undefined> {
		const wordInfo = model.getWordUntilPosition(position);
		const wordRange = new Range(position.lineNumber, wordInfo.startColumn, position.lineNumber, wordInfo.endColumn);
		const resource = model.uri;
		const offset = model.getOffsetAt(position);

		const worker = await this._worker(resource);
		const info = await worker.getCompletionsAtPosition(resource.toString(), offset);

		if (!info || model.isDisposed()) {
			return;
		}

		const suggestions: MyCompletionItem[] = info.entries.map(entry => {
			let range = wordRange;
			if (entry.replacementSpan) {
				const p1 = model.getPositionAt(entry.replacementSpan.start);
				const p2 = model.getPositionAt(entry.replacementSpan.start + entry.replacementSpan.length);
				range = new Range(p1.lineNumber, p1.column, p2.lineNumber, p2.column);
			}

			return {
				uri: resource,
				position: position,
				range: range,
				label: entry.name,
				insertText: entry.name,
				sortText: entry.sortText,
				kind: SuggestAdapter.convertKind(entry.kind)
			};
		});

		return {
			suggestions
		};
	}

	public async resolveCompletionItem(model: monaco.editor.ITextModel, _position: Position, item: monaco.languages.CompletionItem, token: CancellationToken): Promise<monaco.languages.CompletionItem> {
		const myItem = <MyCompletionItem>item;
		const resource = myItem.uri;
		const position = myItem.position;
		const offset = model.getOffsetAt(position);

		const worker = await this._worker(resource);
		const details = await worker.getCompletionEntryDetails(resource.toString(), offset, myItem.label);
		if (!details || model.isDisposed()) {
			return myItem;
		}
		return <MyCompletionItem>{
			uri: resource,
			position: position,
			label: details.name,
			kind: SuggestAdapter.convertKind(details.kind),
			detail: displayPartsToString(details.displayParts),
			documentation: {
				value: displayPartsToString(details.documentation)
			}
		};
	}

	private static convertKind(kind: string): monaco.languages.CompletionItemKind {
		switch (kind) {
			case Kind.primitiveType:
			case Kind.keyword:
				return monaco.languages.CompletionItemKind.Keyword;
			case Kind.variable:
			case Kind.localVariable:
				return monaco.languages.CompletionItemKind.Variable;
			case Kind.memberVariable:
			case Kind.memberGetAccessor:
			case Kind.memberSetAccessor:
				return monaco.languages.CompletionItemKind.Field;
			case Kind.function:
			case Kind.memberFunction:
			case Kind.constructSignature:
			case Kind.callSignature:
			case Kind.indexSignature:
				return monaco.languages.CompletionItemKind.Function;
			case Kind.enum:
				return monaco.languages.CompletionItemKind.Enum;
			case Kind.module:
				return monaco.languages.CompletionItemKind.Module;
			case Kind.class:
				return monaco.languages.CompletionItemKind.Class;
			case Kind.interface:
				return monaco.languages.CompletionItemKind.Interface;
			case Kind.warning:
				return monaco.languages.CompletionItemKind.File;
		}

		return monaco.languages.CompletionItemKind.Property;
	}
}

export class SignatureHelpAdapter extends Adapter implements monaco.languages.SignatureHelpProvider {

	public signatureHelpTriggerCharacters = ['(', ','];

	public async provideSignatureHelp(model: monaco.editor.ITextModel, position: Position, token: CancellationToken): Promise<monaco.languages.SignatureHelpResult | undefined> {
		const resource = model.uri;
		const offset = model.getOffsetAt(position);
		const worker = await this._worker(resource);
		const info = await worker.getSignatureHelpItems(resource.toString(), offset);

		if (!info || model.isDisposed()) {
			return;
		}

		const ret: monaco.languages.SignatureHelp = {
			activeSignature: info.selectedItemIndex,
			activeParameter: info.argumentIndex,
			signatures: []
		};

		info.items.forEach(item => {

			const signature: monaco.languages.SignatureInformation = {
				label: '',
				parameters: []
			};

			signature.documentation = {
				value: displayPartsToString(item.documentation)
			};
			signature.label += displayPartsToString(item.prefixDisplayParts);
			item.parameters.forEach((p, i, a) => {
				const label = displayPartsToString(p.displayParts);
				const parameter: monaco.languages.ParameterInformation = {
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
			dispose() { }
		};
	}
}

// --- hover ------

export class QuickInfoAdapter extends Adapter implements monaco.languages.HoverProvider {

	public async provideHover(model: monaco.editor.ITextModel, position: Position, token: CancellationToken): Promise<monaco.languages.Hover | undefined> {
		const resource = model.uri;
		const offset = model.getOffsetAt(position);
		const worker = await this._worker(resource);
		const info = await worker.getQuickInfoAtPosition(resource.toString(), offset);

		if (!info || model.isDisposed()) {
			return;
		}

		const documentation = displayPartsToString(info.documentation);
		const tags = info.tags ? info.tags.map(tag => {
			const label = `*@${tag.name}*`;
			if (!tag.text) {
				return label;
			}
			return label + (tag.text.match(/\r\n|\n/g) ? ' \n' + tag.text : ` - ${tag.text}`);
		}).join('  \n\n') : '';
		const contents = displayPartsToString(info.displayParts);
		return {
			range: this._textSpanToRange(model, info.textSpan),
			contents: [{
				value: '```js\n' + contents + '\n```\n'
			}, {
				value: documentation + (tags ? '\n\n' + tags : '')
			}]
		};
	}
}

// --- occurrences ------

export class OccurrencesAdapter extends Adapter implements monaco.languages.DocumentHighlightProvider {

	public async provideDocumentHighlights(model: monaco.editor.ITextModel, position: Position, token: CancellationToken): Promise<monaco.languages.DocumentHighlight[] | undefined> {
		const resource = model.uri;
		const offset = model.getOffsetAt(position)
		const worker = await this._worker(resource);
		const entries = await worker.getOccurrencesAtPosition(resource.toString(), offset);

		if (!entries || model.isDisposed()) {
			return;
		}

		return entries.map(entry => {
			return <monaco.languages.DocumentHighlight>{
				range: this._textSpanToRange(model, entry.textSpan),
				kind: entry.isWriteAccess ? monaco.languages.DocumentHighlightKind.Write : monaco.languages.DocumentHighlightKind.Text
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

	public async provideDefinition(model: monaco.editor.ITextModel, position: Position, token: CancellationToken): Promise<monaco.languages.Definition | undefined> {
		const resource = model.uri;
		const offset = model.getOffsetAt(position);
		const worker = await this._worker(resource);
		const entries = await worker.getDefinitionAtPosition(resource.toString(), offset);

		if (!entries || model.isDisposed()) {
			return;
		}

		// Fetch lib files if necessary
		await this._libFiles.fetchLibFilesIfNecessary(entries.map(entry => Uri.parse(entry.fileName)));

		if (model.isDisposed()) {
			return;
		}

		const result: monaco.languages.Location[] = [];
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

// --- references ------

export class ReferenceAdapter extends Adapter implements monaco.languages.ReferenceProvider {

	constructor(
		private readonly _libFiles: LibFiles,
		worker: (...uris: Uri[]) => Promise<TypeScriptWorker>
	) {
		super(worker);
	}

	public async provideReferences(model: monaco.editor.ITextModel, position: Position, context: monaco.languages.ReferenceContext, token: CancellationToken): Promise<monaco.languages.Location[] | undefined> {
		const resource = model.uri;
		const offset = model.getOffsetAt(position);
		const worker = await this._worker(resource);
		const entries = await worker.getReferencesAtPosition(resource.toString(), offset);

		if (!entries || model.isDisposed()) {
			return;
		}

		// Fetch lib files if necessary
		await this._libFiles.fetchLibFilesIfNecessary(entries.map(entry => Uri.parse(entry.fileName)));

		if (model.isDisposed()) {
			return;
		}

		const result: monaco.languages.Location[] = [];
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

export class OutlineAdapter extends Adapter implements monaco.languages.DocumentSymbolProvider {

	public async provideDocumentSymbols(model: monaco.editor.ITextModel, token: CancellationToken): Promise<monaco.languages.DocumentSymbol[] | undefined> {
		const resource = model.uri;
		const worker = await this._worker(resource);
		const items = await worker.getNavigationBarItems(resource.toString());

		if (!items || model.isDisposed()) {
			return;
		}

		const convert = (bucket: monaco.languages.DocumentSymbol[], item: ts.NavigationBarItem, containerLabel?: string): void => {
			let result: monaco.languages.DocumentSymbol = {
				name: item.text,
				detail: '',
				kind: <monaco.languages.SymbolKind>(outlineTypeTable[item.kind] || monaco.languages.SymbolKind.Variable),
				range: this._textSpanToRange(model, item.spans[0]),
				selectionRange: this._textSpanToRange(model, item.spans[0]),
				tags: [],
				containerName: containerLabel
			};

			if (item.childItems && item.childItems.length > 0) {
				for (let child of item.childItems) {
					convert(bucket, child, result.name);
				}
			}

			bucket.push(result);
		}

		let result: monaco.languages.DocumentSymbol[] = [];
		items.forEach(item => convert(result, item));
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

let outlineTypeTable: { [kind: string]: monaco.languages.SymbolKind } = Object.create(null);
outlineTypeTable[Kind.module] = monaco.languages.SymbolKind.Module;
outlineTypeTable[Kind.class] = monaco.languages.SymbolKind.Class;
outlineTypeTable[Kind.enum] = monaco.languages.SymbolKind.Enum;
outlineTypeTable[Kind.interface] = monaco.languages.SymbolKind.Interface;
outlineTypeTable[Kind.memberFunction] = monaco.languages.SymbolKind.Method;
outlineTypeTable[Kind.memberVariable] = monaco.languages.SymbolKind.Property;
outlineTypeTable[Kind.memberGetAccessor] = monaco.languages.SymbolKind.Property;
outlineTypeTable[Kind.memberSetAccessor] = monaco.languages.SymbolKind.Property;
outlineTypeTable[Kind.variable] = monaco.languages.SymbolKind.Variable;
outlineTypeTable[Kind.const] = monaco.languages.SymbolKind.Variable;
outlineTypeTable[Kind.localVariable] = monaco.languages.SymbolKind.Variable;
outlineTypeTable[Kind.variable] = monaco.languages.SymbolKind.Variable;
outlineTypeTable[Kind.function] = monaco.languages.SymbolKind.Function;
outlineTypeTable[Kind.localFunction] = monaco.languages.SymbolKind.Function;

// --- formatting ----

export abstract class FormatHelper extends Adapter {
	protected static _convertOptions(options: monaco.languages.FormattingOptions): ts.FormatCodeOptions {
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

	protected _convertTextChanges(model: monaco.editor.ITextModel, change: ts.TextChange): monaco.languages.TextEdit {
		return {
			text: change.newText,
			range: this._textSpanToRange(model, change.span)
		};
	}
}

export class FormatAdapter extends FormatHelper implements monaco.languages.DocumentRangeFormattingEditProvider {

	public async provideDocumentRangeFormattingEdits(model: monaco.editor.ITextModel, range: Range, options: monaco.languages.FormattingOptions, token: CancellationToken): Promise<monaco.languages.TextEdit[] | undefined> {
		const resource = model.uri;
		const startOffset = model.getOffsetAt({ lineNumber: range.startLineNumber, column: range.startColumn });
		const endOffset = model.getOffsetAt({ lineNumber: range.endLineNumber, column: range.endColumn });
		const worker = await this._worker(resource);
		const edits = await worker.getFormattingEditsForRange(resource.toString(), startOffset, endOffset, FormatHelper._convertOptions(options));

		if (!edits || model.isDisposed()) {
			return;
		}

		return edits.map(edit => this._convertTextChanges(model, edit));
	}
}

export class FormatOnTypeAdapter extends FormatHelper implements monaco.languages.OnTypeFormattingEditProvider {

	get autoFormatTriggerCharacters() {
		return [';', '}', '\n'];
	}

	public async provideOnTypeFormattingEdits(model: monaco.editor.ITextModel, position: Position, ch: string, options: monaco.languages.FormattingOptions, token: CancellationToken): Promise<monaco.languages.TextEdit[] | undefined> {
		const resource = model.uri;
		const offset = model.getOffsetAt(position);
		const worker = await this._worker(resource);
		const edits = await worker.getFormattingEditsAfterKeystroke(resource.toString(), offset, ch, FormatHelper._convertOptions(options));

		if (!edits || model.isDisposed()) {
			return;
		}

		return edits.map(edit => this._convertTextChanges(model, edit));
	}
}

// --- code actions ------

export class CodeActionAdaptor extends FormatHelper implements monaco.languages.CodeActionProvider {

	public async provideCodeActions(model: monaco.editor.ITextModel, range: Range, context: monaco.languages.CodeActionContext, token: CancellationToken): Promise<monaco.languages.CodeActionList> {
		const resource = model.uri;
		const start = model.getOffsetAt({ lineNumber: range.startLineNumber, column: range.startColumn });
		const end = model.getOffsetAt({ lineNumber: range.endLineNumber, column: range.endColumn });
		const formatOptions = FormatHelper._convertOptions(model.getOptions());
		const errorCodes = context.markers.filter(m => m.code).map(m => m.code).map(Number);
		const worker = await this._worker(resource);
		const codeFixes = await worker.getCodeFixesAtPosition(resource.toString(), start, end, errorCodes, formatOptions);

		if (!codeFixes || model.isDisposed()) {
			return { actions: [], dispose: () => { } };
		}

		const actions = codeFixes.filter(fix => {
			// Removes any 'make a new file'-type code fix
			return fix.changes.filter(change => change.isNewFile).length === 0;
		}).map(fix => {
			return this._tsCodeFixActionToMonacoCodeAction(model, context, fix);
		});

		return {
			actions: actions,
			dispose: () => { }
		};
	}


	private _tsCodeFixActionToMonacoCodeAction(model: monaco.editor.ITextModel, context: monaco.languages.CodeActionContext, codeFix: ts.CodeFixAction): monaco.languages.CodeAction {
		const edits: monaco.languages.WorkspaceTextEdit[] = [];
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

		const action: monaco.languages.CodeAction = {
			title: codeFix.description,
			edit: { edits: edits },
			diagnostics: context.markers,
			kind: "quickfix"
		};

		return action;
	}
}
// --- rename ----

export class RenameAdapter extends Adapter implements monaco.languages.RenameProvider {

	public async provideRenameEdits(model: monaco.editor.ITextModel, position: Position, newName: string, token: CancellationToken): Promise<monaco.languages.WorkspaceEdit & monaco.languages.Rejection | undefined> {
		const resource = model.uri;
		const fileName = resource.toString();
		const offset = model.getOffsetAt(position);
		const worker = await this._worker(resource);

		const renameInfo = await worker.getRenameInfo(fileName, offset, { allowRenameOfImportPath: false });
		if (renameInfo.canRename === false) { // use explicit comparison so that the discriminated union gets resolved properly
			return {
				edits: [],
				rejectReason: renameInfo.localizedErrorMessage
			};
		}
		if (renameInfo.fileToRename !== undefined) {
			throw new Error("Renaming files is not supported.");
		}

		const renameLocations = await worker.findRenameLocations(fileName, offset, /*strings*/ false, /*comments*/ false, /*prefixAndSuffix*/ false);

		if (!renameLocations || model.isDisposed()) {
			return;
		}

		const edits: monaco.languages.WorkspaceTextEdit[] = [];
		for (const renameLocation of renameLocations) {
			edits.push({
				resource: monaco.Uri.parse(renameLocation.fileName),
				edit: {
					range: this._textSpanToRange(model, renameLocation.textSpan),
					text: newName
				}
			});
		}

		return { edits };
	}
}
