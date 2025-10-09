import * as monaco from 'monaco-editor-core';
import { Position, Range, TextDocumentIdentifier } from '../../src/types';

export interface ITextModelBridge {
	translate(
		textModel: monaco.editor.ITextModel,
		monacoPos: monaco.Position
	): {
		textDocument: TextDocumentIdentifier;
		position: Position;
	};

	translateRange(textModel: monaco.editor.ITextModel, monacoRange: monaco.Range): Range;

	translateBack(
		textDocument: TextDocumentIdentifier,
		position: Position
	): {
		textModel: monaco.editor.ITextModel;
		position: monaco.Position;
	};

	translateBackRange(
		textDocument: TextDocumentIdentifier,
		range: Range
	): {
		textModel: monaco.editor.ITextModel;
		range: monaco.Range;
	};
}

export function assertTargetTextModel<T extends { textModel: monaco.editor.ITextModel }>(
	input: T,
	expectedTextModel: monaco.editor.ITextModel
): T {
	if (input.textModel !== expectedTextModel) {
		throw new Error(`Expected text model to be ${expectedTextModel}, but got ${input.textModel}`);
	}
	return input;
}
