import * as lsTypes from 'vscode-languageserver-types';
import { languages, editor, CancellationToken } from '../../fillers/monaco-editor-core';
import { toRange, toTextEdit, fromRange } from './CompletionAdapter';
import { WorkerAccessor } from './lspLanguageFeatures';

export interface ILanguageWorkerWithDocumentColors {
	findDocumentColors(uri: string): Promise<lsTypes.ColorInformation[]>;
	getColorPresentations(
		uri: string,
		color: lsTypes.Color,
		range: lsTypes.Range
	): Promise<lsTypes.ColorPresentation[]>;
}

export class DocumentColorAdapter<T extends ILanguageWorkerWithDocumentColors>
	implements languages.DocumentColorProvider
{
	constructor(private readonly _worker: WorkerAccessor<T>) {}

	public provideDocumentColors(
		model: editor.IReadOnlyModel,
		token: CancellationToken
	): Promise<languages.IColorInformation[] | undefined> {
		const resource = model.uri;

		return this._worker(resource)
			.then((worker) => worker.findDocumentColors(resource.toString()))
			.then((infos) => {
				if (!infos) {
					return;
				}
				return infos.map((item) => ({
					color: item.color,
					range: toRange(item.range)
				}));
			});
	}

	public provideColorPresentations(
		model: editor.IReadOnlyModel,
		info: languages.IColorInformation,
		token: CancellationToken
	): Promise<languages.IColorPresentation[] | undefined> {
		const resource = model.uri;

		return this._worker(resource)
			.then((worker) =>
				worker.getColorPresentations(resource.toString(), info.color, fromRange(info.range))
			)
			.then((presentations) => {
				if (!presentations) {
					return;
				}
				return presentations.map((presentation) => {
					let item: languages.IColorPresentation = {
						label: presentation.label
					};
					if (presentation.textEdit) {
						item.textEdit = toTextEdit(presentation.textEdit);
					}
					if (presentation.additionalTextEdits) {
						item.additionalTextEdits =
							presentation.additionalTextEdits.map<languages.TextEdit>(toTextEdit);
					}
					return item;
				});
			});
	}
}
