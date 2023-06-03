/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Uri } from '../../fillers/monaco-editor-core';

export interface WorkerAccessor<T> {
	(...more: Uri[]): Promise<T>;
}

export * from './DiagnosticsAdapter';

export * from './CompletionAdapter';

export * from './HoverAdapter';

export * from './DocumentHighlightAdapter';

export * from './DefinitionAdapter';

export * from './ReferenceAdapter';

export * from './RenameAdapter';

export * from './DocumentSymbolAdapter';

export * from './DocumentLinkAdapter';

export * from './DocumentFormattingEditProvider';

export * from './DocumentColorAdapter';

export * from './FoldingRangeAdapter';

export * from './SelectionRangeAdapter';
