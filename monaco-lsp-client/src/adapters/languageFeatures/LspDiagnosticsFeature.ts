import * as monaco from 'monaco-editor-core';
import { api, capabilities, Diagnostic, DiagnosticRegistrationOptions, DocumentDiagnosticReport, PublishDiagnosticsParams } from '../../../src/types';
import { Disposable, DisposableStore } from '../../utils';
import { LspConnection } from '../LspConnection';
import { lspDiagnosticTagToMonacoMarkerTag, matchesDocumentSelector, toDiagnosticMarker } from './common';

export class LspDiagnosticsFeature extends Disposable {
	private readonly _diagnosticsMarkerOwner = 'lsp';
	private readonly _pullDiagnosticProviders = new Map<monaco.editor.ITextModel, ModelDiagnosticProvider>();

	constructor(
		private readonly _connection: LspConnection,
	) {
		super();

		this._register(this._connection.capabilities.addStaticClientCapabilities({
			textDocument: {
				publishDiagnostics: {
					relatedInformation: true,
					tagSupport: {
						valueSet: [...lspDiagnosticTagToMonacoMarkerTag.keys()],
					},
					versionSupport: true,
					codeDescriptionSupport: true,
					dataSupport: true,
				},
				diagnostic: {
					dynamicRegistration: true,
					relatedDocumentSupport: true,
				}
			}
		}));

		debugger;
		this._register(this._connection.connection.registerNotificationHandler(
			api.client.textDocumentPublishDiagnostics,
			(params) => this._handlePublishDiagnostics(params)
		));

		this._register(this._connection.capabilities.registerCapabilityHandler(
			capabilities.textDocumentDiagnostic,
			true,
			(capability) => {
				const disposables = new DisposableStore();
				for (const model of monaco.editor.getModels()) {
					this._addPullDiagnosticProvider(model, capability, disposables);
				}
				disposables.add(monaco.editor.onDidCreateModel(model => {
					this._addPullDiagnosticProvider(model, capability, disposables);
				}));
				return disposables;
			}
		));
	}

	private _addPullDiagnosticProvider(
		model: monaco.editor.ITextModel,
		capability: DiagnosticRegistrationOptions,
		disposables: DisposableStore
	): void {
		// Check if model matches the document selector
		const languageId = model.getLanguageId();

		if (!matchesDocumentSelector(model, capability.documentSelector)) {
			return;
		}

		const provider = new ModelDiagnosticProvider(
			model,
			this._connection,
			this._diagnosticsMarkerOwner,
			capability
		);

		this._pullDiagnosticProviders.set(model, provider);
		disposables.add(provider);

		disposables.add(model.onWillDispose(() => {
			this._pullDiagnosticProviders.delete(model);
		}));
	}

	private _handlePublishDiagnostics(params: PublishDiagnosticsParams): void {
		const uri = params.uri;

		try {
			const translated = this._connection.bridge.translateBack({ uri }, { line: 0, character: 0 });
			const model = translated.textModel;

			if (!model || model.isDisposed()) {
				return;
			}

			const markers = params.diagnostics.map(diagnostic =>
				toDiagnosticMarker(diagnostic)
			);

			monaco.editor.setModelMarkers(model, this._diagnosticsMarkerOwner, markers);
		} catch (error) {
			// Model not found or already disposed - this is normal when files are closed
			console.debug(`Could not set diagnostics for ${uri}:`, error);
		}
	}
}

/**
 * Manages pull diagnostics for a single text model
 */
class ModelDiagnosticProvider extends Disposable {
	private _updateHandle: number | undefined;
	private _previousResultId: string | undefined;

	constructor(
		private readonly _model: monaco.editor.ITextModel,
		private readonly _connection: LspConnection,
		private readonly _markerOwner: string,
		private readonly _capability: DiagnosticRegistrationOptions,
	) {
		super();
		this._register(this._model.onDidChangeContent(() => {
			this._scheduleDiagnosticUpdate();
		}));
		this._scheduleDiagnosticUpdate();
	}

	private _scheduleDiagnosticUpdate(): void {
		if (this._updateHandle !== undefined) {
			clearTimeout(this._updateHandle);
		}

		this._updateHandle = window.setTimeout(() => {
			this._updateHandle = undefined;
			this._requestDiagnostics();
		}, 500);
	}

	private async _requestDiagnostics(): Promise<void> {
		if (this._model.isDisposed()) {
			return;
		}

		try {
			const translated = this._connection.bridge.translate(this._model, new monaco.Position(1, 1));

			const result = await this._connection.server.textDocumentDiagnostic({
				textDocument: translated.textDocument,
				identifier: this._capability.identifier,
				previousResultId: this._previousResultId,
			});

			if (this._model.isDisposed()) {
				return;
			}

			this._handleDiagnosticReport(result);
		} catch (error) {
			console.error('Error requesting diagnostics:', error);
		}
	}

	private _handleDiagnosticReport(report: DocumentDiagnosticReport): void {
		if (report.kind === 'full') {
			// Full diagnostic report
			this._previousResultId = report.resultId;

			const markers = report.items.map(diagnostic => toDiagnosticMarker(diagnostic));
			monaco.editor.setModelMarkers(this._model, this._markerOwner, markers);

			// Handle related documents if present
			if ('relatedDocuments' in report && report.relatedDocuments) {
				this._handleRelatedDocuments(report.relatedDocuments);
			}
		} else if (report.kind === 'unchanged') {
			// Unchanged report - diagnostics are still valid
			this._previousResultId = report.resultId;
			// No need to update markers
		}
	}

	private _handleRelatedDocuments(relatedDocuments: { [key: string]: any }): void {
		for (const [uri, report] of Object.entries(relatedDocuments)) {
			try {
				const translated = this._connection.bridge.translateBack({ uri }, { line: 0, character: 0 });
				const model = translated.textModel;

				if (!model || model.isDisposed()) {
					continue;
				}

				if (report.kind === 'full') {
					const markers = report.items.map((diagnostic: Diagnostic) => toDiagnosticMarker(diagnostic));
					monaco.editor.setModelMarkers(model, this._markerOwner, markers);
				}
			} catch (error) {
				// Model not found - this is normal
				console.debug(`Could not set related diagnostics for ${uri}:`, error);
			}
		}
	}

	override dispose(): void {
		if (this._updateHandle !== undefined) {
			clearTimeout(this._updateHandle);
			this._updateHandle = undefined;
		}
		super.dispose();
	}
}
