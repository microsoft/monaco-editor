/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Internal modules of monaco-editor-core that have no type definitions.

declare module 'monaco-editor-core/esm/vs/platform/markdown/browser/markdownRenderer' {
	export class MarkdownRendererService {
		constructor(openerService: unknown);
		render(markdown: unknown, options?: unknown, outElement?: unknown): unknown;
	}
}

declare module 'monaco-editor-core/esm/vs/editor/browser/widget/codeEditor/codeEditorWidget' {
	export class CodeEditorWidget {
		updateOptions(newOptions: unknown): void;
		getRawOptions(): unknown;
	}
}
