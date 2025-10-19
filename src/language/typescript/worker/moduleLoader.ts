/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as ts from '../lib/typescriptServices';
import { IExtraLibs, TypeScriptWorker as ITypeScriptWorker } from '../monaco.contribution';
import { worker } from 'monaco-editor-core';
import { ScriptHost } from './modules/scriptHost';
import { DiagnosticsModule } from './modules/diagnostics';
import { CompletionsModule } from './modules/completions';
import { NavigationModule } from './modules/navigation';
import { FormattingModule } from './modules/formatting';
import { RefactoringModule } from './modules/refactoring';
import { EmitModule } from './modules/emit';
import { InlayHintsModule } from './modules/inlayHints';

export interface ICreateData {
	compilerOptions: ts.CompilerOptions;
	extraLibs: IExtraLibs;
	customWorkerPath?: string;
	inlayHintsOptions?: ts.UserPreferences;
}

export interface ModuleConfig {
	enableDiagnostics?: boolean;
	enableCompletions?: boolean;
	enableNavigation?: boolean;
	enableFormatting?: boolean;
	enableRefactoring?: boolean;
	enableEmit?: boolean;
	enableInlayHints?: boolean;
}

export class ModularTypeScriptWorker implements ts.LanguageServiceHost, ITypeScriptWorker {
	private _scriptHost: ScriptHost;
	private _languageService: ts.LanguageService;
	private _modules: Map<string, any> = new Map();
	private _config: ModuleConfig;

	constructor(ctx: worker.IWorkerContext, createData: ICreateData, config: ModuleConfig = {}) {
		// Default configuration - enable all modules
		this._config = {
			enableDiagnostics: true,
			enableCompletions: true,
			enableNavigation: true,
			enableFormatting: true,
			enableRefactoring: true,
			enableEmit: true,
			enableInlayHints: true,
			...config
		};

		this._scriptHost = new ScriptHost(ctx, createData.extraLibs, createData.compilerOptions);
		this._languageService = ts.createLanguageService(this);

		this._initializeModules();
	}

	private _initializeModules(): void {
		if (this._config.enableDiagnostics) {
			this._modules.set('diagnostics', new DiagnosticsModule(this._languageService));
		}
		if (this._config.enableCompletions) {
			this._modules.set('completions', new CompletionsModule(this._languageService));
		}
		if (this._config.enableNavigation) {
			this._modules.set('navigation', new NavigationModule(this._languageService));
		}
		if (this._config.enableFormatting) {
			this._modules.set('formatting', new FormattingModule(this._languageService));
		}
		if (this._config.enableRefactoring) {
			this._modules.set('refactoring', new RefactoringModule(this._languageService));
		}
		if (this._config.enableEmit) {
			this._modules.set('emit', new EmitModule(this._languageService));
		}
		if (this._config.enableInlayHints) {
			this._modules.set('inlayHints', new InlayHintsModule(this._languageService, this._scriptHost._inlayHintsOptions));
		}
	}

	// ScriptHost delegation
	getCompilationSettings(): ts.CompilerOptions {
		return this._scriptHost.getCompilationSettings();
	}

	getLanguageService(): ts.LanguageService {
		return this._languageService;
	}

	getExtraLibs(): IExtraLibs {
		return this._scriptHost.getExtraLibs();
	}

	getScriptFileNames(): string[] {
		return this._scriptHost.getScriptFileNames();
	}

	getScriptVersion(fileName: string): string {
		return this._scriptHost.getScriptVersion(fileName);
	}

	async getScriptText(fileName: string): Promise<string | undefined> {
		return this._scriptHost.getScriptText(fileName);
	}

	getScriptSnapshot(fileName: string): ts.IScriptSnapshot | undefined {
		return this._scriptHost.getScriptSnapshot(fileName);
	}

	getScriptKind?(fileName: string): ts.ScriptKind {
		return this._scriptHost.getScriptKind?.(fileName);
	}

	getCurrentDirectory(): string {
		return this._scriptHost.getCurrentDirectory();
	}

	getDefaultLibFileName(options: ts.CompilerOptions): string {
		return this._scriptHost.getDefaultLibFileName(options);
	}

	isDefaultLibFileName(fileName: string): boolean {
		return this._scriptHost.isDefaultLibFileName(fileName);
	}

	readFile(path: string): string | undefined {
		return this._scriptHost.readFile(path);
	}

	fileExists(path: string): boolean {
		return this._scriptHost.fileExists(path);
	}

	async getLibFiles(): Promise<Record<string, string>> {
		return this._scriptHost.getLibFiles();
	}

	// Module delegation methods
	async getSyntacticDiagnostics(fileName: string) {
		const module = this._modules.get('diagnostics');
		return module ? module.getSyntacticDiagnostics(fileName) : [];
	}

	async getSemanticDiagnostics(fileName: string) {
		const module = this._modules.get('diagnostics');
		return module ? module.getSemanticDiagnostics(fileName) : [];
	}

	async getSuggestionDiagnostics(fileName: string) {
		const module = this._modules.get('diagnostics');
		return module ? module.getSuggestionDiagnostics(fileName) : [];
	}

	async getCompilerOptionsDiagnostics(fileName: string) {
		const module = this._modules.get('diagnostics');
		return module ? module.getCompilerOptionsDiagnostics(fileName) : [];
	}

	async getCompletionsAtPosition(fileName: string, position: number) {
		const module = this._modules.get('completions');
		return module ? module.getCompletionsAtPosition(fileName, position) : undefined;
	}

	async getCompletionEntryDetails(fileName: string, position: number, entry: string) {
		const module = this._modules.get('completions');
		return module ? module.getCompletionEntryDetails(fileName, position, entry) : undefined;
	}

	async getSignatureHelpItems(fileName: string, position: number, options: ts.SignatureHelpItemsOptions | undefined) {
		const module = this._modules.get('completions');
		return module ? module.getSignatureHelpItems(fileName, position, options) : undefined;
	}

	async getQuickInfoAtPosition(fileName: string, position: number) {
		const module = this._modules.get('navigation');
		return module ? module.getQuickInfoAtPosition(fileName, position) : undefined;
	}

	async getDocumentHighlights(fileName: string, position: number, filesToSearch: string[]) {
		const module = this._modules.get('navigation');
		return module ? module.getDocumentHighlights(fileName, position, filesToSearch) : undefined;
	}

	async getDefinitionAtPosition(fileName: string, position: number) {
		const module = this._modules.get('navigation');
		return module ? module.getDefinitionAtPosition(fileName, position) : undefined;
	}

	async getReferencesAtPosition(fileName: string, position: number) {
		const module = this._modules.get('navigation');
		return module ? module.getReferencesAtPosition(fileName, position) : undefined;
	}

	async getNavigationTree(fileName: string) {
		const module = this._modules.get('navigation');
		return module ? module.getNavigationTree(fileName) : undefined;
	}

	async getFormattingEditsForDocument(fileName: string, options: ts.FormatCodeOptions) {
		const module = this._modules.get('formatting');
		return module ? module.getFormattingEditsForDocument(fileName, options) : [];
	}

	async getFormattingEditsForRange(fileName: string, start: number, end: number, options: ts.FormatCodeOptions) {
		const module = this._modules.get('formatting');
		return module ? module.getFormattingEditsForRange(fileName, start, end, options) : [];
	}

	async getFormattingEditsAfterKeystroke(fileName: string, postion: number, ch: string, options: ts.FormatCodeOptions) {
		const module = this._modules.get('formatting');
		return module ? module.getFormattingEditsAfterKeystroke(fileName, postion, ch, options) : [];
	}

	async findRenameLocations(fileName: string, position: number, findInStrings: boolean, findInComments: boolean, providePrefixAndSuffixTextForRename: boolean) {
		const module = this._modules.get('refactoring');
		return module ? module.findRenameLocations(fileName, position, findInStrings, findInComments, providePrefixAndSuffixTextForRename) : undefined;
	}

	async getRenameInfo(fileName: string, position: number, options: ts.RenameInfoOptions) {
		const module = this._modules.get('refactoring');
		return module ? module.getRenameInfo(fileName, position, options) : { canRename: false, localizedErrorMessage: 'Module not available' };
	}

	async getCodeFixesAtPosition(fileName: string, start: number, end: number, errorCodes: number[], formatOptions: ts.FormatCodeOptions) {
		const module = this._modules.get('refactoring');
		return module ? module.getCodeFixesAtPosition(fileName, start, end, errorCodes, formatOptions) : [];
	}

	async getEmitOutput(fileName: string, emitOnlyDtsFiles?: boolean, forceDtsEmit?: boolean) {
		const module = this._modules.get('emit');
		return module ? module.getEmitOutput(fileName, emitOnlyDtsFiles, forceDtsEmit) : { outputFiles: [], emitSkipped: true };
	}

	async provideInlayHints(fileName: string, start: number, end: number) {
		const module = this._modules.get('inlayHints');
		return module ? module.provideInlayHints(fileName, start, end) : [];
	}

	async updateExtraLibs(extraLibs: IExtraLibs): Promise<void> {
		this._scriptHost.updateExtraLibs(extraLibs);
	}

	// Module management methods
	getModule<T>(name: string): T | undefined {
		return this._modules.get(name);
	}

	hasModule(name: string): boolean {
		return this._modules.has(name);
	}

	getEnabledModules(): string[] {
		return Array.from(this._modules.keys());
	}

	updateModuleConfig(config: Partial<ModuleConfig>): void {
		this._config = { ...this._config, ...config };
		// Reinitialize modules with new config
		this._modules.clear();
		this._initializeModules();
	}
}
