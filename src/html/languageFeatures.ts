/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { HTMLWorker } from './htmlWorker';
import { Uri } from '../fillers/monaco-editor-core';
import {
	CompletionAdapter,
	HoverAdapter,
	DocumentHighlightAdapter,
	RenameAdapter,
	DocumentSymbolAdapter,
	DocumentLinkAdapter,
	DocumentFormattingEditProvider,
	DocumentRangeFormattingEditProvider,
	FoldingRangeAdapter,
	SelectionRangeAdapter
} from '../common/lspLanguageFeatures';

export interface WorkerAccessor {
	(...more: Uri[]): Promise<HTMLWorker>;
}

export class HTMLCompletionAdapter extends CompletionAdapter<HTMLWorker> {
	constructor(worker: WorkerAccessor) {
		super(worker, ['.', ':', '<', '"', '=', '/']);
	}
}

export class HTMLHoverAdapter extends HoverAdapter<HTMLWorker> {}

export class HTMLDocumentHighlightAdapter extends DocumentHighlightAdapter<HTMLWorker> {}

export class HTMLRenameAdapter extends RenameAdapter<HTMLWorker> {}

export class HTMLDocumentSymbolAdapter extends DocumentSymbolAdapter<HTMLWorker> {}

export class HTMLDocumentLinkAdapter extends DocumentLinkAdapter<HTMLWorker> {}

export class HTMLDocumentFormattingEditProvider extends DocumentFormattingEditProvider<HTMLWorker> {}

export class HTMLDocumentRangeFormattingEditProvider extends DocumentRangeFormattingEditProvider<HTMLWorker> {}

export class HTMLFoldingRangeAdapter extends FoldingRangeAdapter<HTMLWorker> {}

export class HTMLSelectionRangeAdapter extends SelectionRangeAdapter<HTMLWorker> {}
