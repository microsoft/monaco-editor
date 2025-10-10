import * as monaco from 'monaco-editor-core';
import { api, capabilities, Position, Range, TextDocumentContentChangeEvent, TextDocumentIdentifier } from '../../src/types';
import { Disposable } from '../utils';
import { ITextModelBridge } from './ITextModelBridge';
import { ILspCapabilitiesRegistry } from './LspCapabilitiesRegistry';

export class TextDocumentSynchronizer extends Disposable implements ITextModelBridge {
    private readonly _managedModels = new Map<monaco.editor.ITextModel, ManagedModel>();
    private readonly _managedModelsReverse = new Map</* uri */ string, monaco.editor.ITextModel>();

    private _started = false;

    constructor(
        private readonly _server: typeof api.TServerInterface,
        private readonly _capabilities: ILspCapabilitiesRegistry,
    ) {
        super();

        this._register(this._capabilities.addStaticClientCapabilities({
            textDocument: {
                synchronization: {
                    dynamicRegistration: true,
                    willSave: false,
                    willSaveWaitUntil: false,
                    didSave: false,
                }
            }
        }));

        this._register(_capabilities.registerCapabilityHandler(capabilities.textDocumentDidChange, true, e => {
            if (this._started) {
                return {
                    dispose: () => {
                    }
                }
            }
            this._started = true;
            this._register(monaco.editor.onDidCreateModel(m => {
                this._getOrCreateManagedModel(m);
            }));
            for (const m of monaco.editor.getModels()) {
                this._getOrCreateManagedModel(m);
            }
            return {
                dispose: () => {
                }
            }
        }));
    }

    private _getOrCreateManagedModel(m: monaco.editor.ITextModel) {
        if (!this._started) {
            throw new Error('Not started');
        }

        const uriStr = m.uri.toString(true).toLowerCase();
        let mm = this._managedModels.get(m);
        if (!mm) {
            mm = new ManagedModel(m, this._server);
            this._managedModels.set(m, mm);
            this._managedModelsReverse.set(uriStr, m);
        }
        m.onWillDispose(() => {
            mm!.dispose();
            this._managedModels.delete(m);
            this._managedModelsReverse.delete(uriStr);
        });
        return mm;
    }

    translateBack(textDocument: TextDocumentIdentifier, position: Position): { textModel: monaco.editor.ITextModel; position: monaco.Position; } {
        const uri = textDocument.uri.toLowerCase();
        const textModel = this._managedModelsReverse.get(uri);
        if (!textModel) {
            throw new Error(`No text model for uri ${uri}`);
        }
        const monacoPosition = new monaco.Position(position.line + 1, position.character + 1);
        return { textModel, position: monacoPosition };
    }

    translateBackRange(textDocument: TextDocumentIdentifier, range: Range): { textModel: monaco.editor.ITextModel; range: monaco.Range; } {
        const uri = textDocument.uri.toLowerCase();
        const textModel = this._managedModelsReverse.get(uri);
        if (!textModel) {
            throw new Error(`No text model for uri ${uri}`);
        }
        const monacoRange = new monaco.Range(
            range.start.line + 1,
            range.start.character + 1,
            range.end.line + 1,
            range.end.character + 1
        );
        return { textModel, range: monacoRange };
    }

    translate(textModel: monaco.editor.ITextModel, monacoPos: monaco.Position): { textDocument: TextDocumentIdentifier; position: Position; } {
        return {
            textDocument: {
                uri: textModel.uri.toString(true),
            },
            position: {
                line: monacoPos.lineNumber - 1,
                character: monacoPos.column - 1,
            }
        };
    }

    translateRange(textModel: monaco.editor.ITextModel, monacoRange: monaco.Range): Range {
        return {
            start: {
                line: monacoRange.startLineNumber - 1,
                character: monacoRange.startColumn - 1,
            },
            end: {
                line: monacoRange.endLineNumber - 1,
                character: monacoRange.endColumn - 1,
            }
        };
    }
}

class ManagedModel extends Disposable {
    constructor(
        private readonly _textModel: monaco.editor.ITextModel,
        private readonly _api: typeof api.TServerInterface
    ) {
        super();

        const uri = _textModel.uri.toString(true).toLowerCase();

        this._api.textDocumentDidOpen({
            textDocument: {
                languageId: _textModel.getLanguageId(),
                uri: uri,
                version: _textModel.getVersionId(),
                text: _textModel.getValue(),
            }
        });

        this._register(_textModel.onDidChangeContent(e => {
            const contentChanges = e.changes.map(c => toLspTextDocumentContentChangeEvent(c));

            this._api.textDocumentDidChange({
                textDocument: {
                    uri: uri,
                    version: _textModel.getVersionId(),
                },
                contentChanges: contentChanges
            });
        }));

        this._register({
            dispose: () => {
                this._api.textDocumentDidClose({
                    textDocument: {
                        uri: uri,
                    }
                });
            }
        });
    }
}

function toLspTextDocumentContentChangeEvent(change: monaco.editor.IModelContentChange): TextDocumentContentChangeEvent {
    return {
        range: toLspRange(change.range),
        rangeLength: change.rangeLength,
        text: change.text,
    };
}

function toLspRange(range: monaco.IRange): Range {
    return {
        start: {
            line: range.startLineNumber - 1,
            character: range.startColumn - 1,
        },
        end: {
            line: range.endLineNumber - 1,
            character: range.endColumn - 1,
        }
    };
}