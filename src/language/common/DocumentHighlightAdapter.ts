import * as lsTypes from 'vscode-languageserver-types';
import { languages, editor, Position, CancellationToken } from '../../fillers/monaco-editor-core';
import { fromPosition, toRange } from './CompletionAdapter';
import { WorkerAccessor } from './lspLanguageFeatures';

export interface ILanguageWorkerWithDocumentHighlights {
	findDocumentHighlights(
		uri: string,
		position: lsTypes.Position
	): Promise<lsTypes.DocumentHighlight[]>;
}

export class DocumentHighlightAdapter<T extends ILanguageWorkerWithDocumentHighlights>
	implements languages.DocumentHighlightProvider
{
	constructor(private readonly _worker: WorkerAccessor<T>) {}

	public provideDocumentHighlights(
		model: editor.IReadOnlyModel,
		position: Position,
		token: CancellationToken
	): Promise<languages.DocumentHighlight[] | undefined> {
		const resource = model.uri;

		return this._worker(resource)
			.then((worker) => worker.findDocumentHighlights(resource.toString(), fromPosition(position)))
			.then((entries) => {
				if (!entries) {
					return;
				}
				return entries.map((entry) => {
					return <languages.DocumentHighlight>{
						range: toRange(entry.range),
						kind: toDocumentHighlightKind(entry.kind)
					};
				});
			});
	}
}

function toDocumentHighlightKind(
	kind: lsTypes.DocumentHighlightKind | undefined
): languages.DocumentHighlightKind {
	switch (kind) {
		case lsTypes.DocumentHighlightKind.Read:
			return languages.DocumentHighlightKind.Read;
		case lsTypes.DocumentHighlightKind.Write:
			return languages.DocumentHighlightKind.Write;
		case lsTypes.DocumentHighlightKind.Text:
			return languages.DocumentHighlightKind.Text;
	}
	return languages.DocumentHighlightKind.Text;
}
