import * as lsTypes from 'vscode-languageserver-types';
import { languages, editor, CancellationToken } from '../../fillers/monaco-editor-core';
import { toRange } from './CompletionAdapter';
import { WorkerAccessor } from './lspLanguageFeatures';

export interface ILanguageWorkerWithDocumentLinks {
	findDocumentLinks(uri: string): Promise<lsTypes.DocumentLink[]>;
}

export class DocumentLinkAdapter<T extends ILanguageWorkerWithDocumentLinks>
	implements languages.LinkProvider
{
	constructor(private _worker: WorkerAccessor<T>) {}

	public provideLinks(
		model: editor.IReadOnlyModel,
		token: CancellationToken
	): Promise<languages.ILinksList | undefined> {
		const resource = model.uri;

		return this._worker(resource)
			.then((worker) => worker.findDocumentLinks(resource.toString()))
			.then((items) => {
				if (!items) {
					return;
				}
				return {
					links: items.map((item) => ({
						range: toRange(item.range),
						url: item.target
					}))
				};
			});
	}
}
