/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DataTransfers } from '../../../../base/browser/dnd.js';
import { addDisposableListener } from '../../../../base/browser/dom.js';
import { createCancelablePromise, raceCancellation } from '../../../../base/common/async.js';
import { createStringDataTransferItem, UriList } from '../../../../base/common/dataTransfer.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { Mimes } from '../../../../base/common/mime.js';
import { Schemas } from '../../../../base/common/network.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { toVSDataTransfer } from '../../../browser/dnd.js';
import { IBulkEditService, ResourceTextEdit } from '../../../browser/services/bulkEditService.js';
import { Range } from '../../../common/core/range.js';
import { Selection } from '../../../common/core/selection.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { EditorStateCancellationTokenSource } from '../../editorState/browser/editorState.js';
import { SnippetParser } from '../../snippet/browser/snippetParser.js';
import { localize } from '../../../../nls.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IProgressService } from '../../../../platform/progress/common/progress.js';
const vscodeClipboardMime = 'application/vnd.code.copyMetadata';
let CopyPasteController = class CopyPasteController extends Disposable {
    constructor(editor, _bulkEditService, _clipboardService, _configurationService, _languageFeaturesService, _progressService) {
        super();
        this._bulkEditService = _bulkEditService;
        this._clipboardService = _clipboardService;
        this._configurationService = _configurationService;
        this._languageFeaturesService = _languageFeaturesService;
        this._progressService = _progressService;
        this._editor = editor;
        const container = editor.getContainerDomNode();
        this._register(addDisposableListener(container, 'copy', e => this.handleCopy(e)));
        this._register(addDisposableListener(container, 'cut', e => this.handleCopy(e)));
        this._register(addDisposableListener(container, 'paste', e => this.handlePaste(e), true));
    }
    arePasteActionsEnabled(model) {
        if (this._configurationService.getValue('editor.experimental.pasteActions.enabled', { resource: model.uri })) {
            return true;
        }
        // TODO: This check is only here to support enabling `ipynb.pasteImagesAsAttachments.enabled` by default
        return model.uri.scheme === Schemas.vscodeNotebookCell;
    }
    handleCopy(e) {
        var _a;
        if (!e.clipboardData || !this._editor.hasTextFocus()) {
            return;
        }
        const model = this._editor.getModel();
        const selections = this._editor.getSelections();
        if (!model || !(selections === null || selections === void 0 ? void 0 : selections.length)) {
            return;
        }
        if (!this.arePasteActionsEnabled(model)) {
            return;
        }
        const ranges = [...selections];
        const primarySelection = selections[0];
        const wasFromEmptySelection = primarySelection.isEmpty();
        if (wasFromEmptySelection) {
            if (!this._editor.getOption(35 /* EditorOption.emptySelectionClipboard */)) {
                return;
            }
            ranges[0] = new Range(primarySelection.startLineNumber, 0, primarySelection.startLineNumber, model.getLineLength(primarySelection.startLineNumber));
        }
        const providers = this._languageFeaturesService.documentPasteEditProvider.ordered(model).filter(x => !!x.prepareDocumentPaste);
        if (!providers.length) {
            this.setCopyMetadata(e.clipboardData, { wasFromEmptySelection });
            return;
        }
        const dataTransfer = toVSDataTransfer(e.clipboardData);
        // Save off a handle pointing to data that VS Code maintains.
        const handle = generateUuid();
        this.setCopyMetadata(e.clipboardData, {
            id: handle,
            wasFromEmptySelection,
        });
        const promise = createCancelablePromise((token) => __awaiter(this, void 0, void 0, function* () {
            const results = yield Promise.all(providers.map(provider => {
                return provider.prepareDocumentPaste(model, ranges, dataTransfer, token);
            }));
            for (const result of results) {
                result === null || result === void 0 ? void 0 : result.forEach((value, key) => {
                    dataTransfer.replace(key, value);
                });
            }
            return dataTransfer;
        }));
        (_a = this._currentClipboardItem) === null || _a === void 0 ? void 0 : _a.dataTransferPromise.cancel();
        this._currentClipboardItem = { handle: handle, dataTransferPromise: promise };
    }
    setCopyMetadata(dataTransfer, metadata) {
        dataTransfer.setData(vscodeClipboardMime, JSON.stringify(metadata));
    }
    handlePaste(e) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            if (!e.clipboardData || !this._editor.hasTextFocus()) {
                return;
            }
            const selections = this._editor.getSelections();
            if (!(selections === null || selections === void 0 ? void 0 : selections.length) || !this._editor.hasModel()) {
                return;
            }
            const model = this._editor.getModel();
            if (!this.arePasteActionsEnabled(model)) {
                return;
            }
            let metadata;
            const rawMetadata = (_a = e.clipboardData) === null || _a === void 0 ? void 0 : _a.getData(vscodeClipboardMime);
            if (rawMetadata && typeof rawMetadata === 'string') {
                metadata = JSON.parse(rawMetadata);
            }
            const providers = this._languageFeaturesService.documentPasteEditProvider.ordered(model);
            if (!providers.length) {
                return;
            }
            e.preventDefault();
            e.stopImmediatePropagation();
            const tokenSource = new EditorStateCancellationTokenSource(this._editor, 1 /* CodeEditorStateFlag.Value */ | 2 /* CodeEditorStateFlag.Selection */);
            try {
                const dataTransfer = toVSDataTransfer(e.clipboardData);
                if ((metadata === null || metadata === void 0 ? void 0 : metadata.id) && ((_b = this._currentClipboardItem) === null || _b === void 0 ? void 0 : _b.handle) === metadata.id) {
                    const toMergeDataTransfer = yield this._currentClipboardItem.dataTransferPromise;
                    if (tokenSource.token.isCancellationRequested) {
                        return;
                    }
                    toMergeDataTransfer.forEach((value, key) => {
                        dataTransfer.replace(key, value);
                    });
                }
                if (!dataTransfer.has(Mimes.uriList)) {
                    const resources = yield this._clipboardService.readResources();
                    if (tokenSource.token.isCancellationRequested) {
                        return;
                    }
                    if (resources.length) {
                        dataTransfer.append(Mimes.uriList, createStringDataTransferItem(UriList.create(resources)));
                    }
                }
                dataTransfer.delete(vscodeClipboardMime);
                const providerEdit = yield this._progressService.withProgress({
                    location: 15 /* ProgressLocation.Notification */,
                    delay: 750,
                    title: localize('pasteProgressTitle', "Running paste handlers..."),
                    cancellable: true,
                }, () => {
                    return this.getProviderPasteEdit(providers, dataTransfer, model, selections, tokenSource.token);
                }, () => {
                    return tokenSource.cancel();
                });
                if (tokenSource.token.isCancellationRequested) {
                    return;
                }
                if (providerEdit) {
                    const snippet = typeof providerEdit.insertText === 'string' ? SnippetParser.escape(providerEdit.insertText) : providerEdit.insertText.snippet;
                    const combinedWorkspaceEdit = {
                        edits: [
                            new ResourceTextEdit(model.uri, {
                                range: Selection.liftSelection(this._editor.getSelection()),
                                text: snippet,
                                insertAsSnippet: true,
                            }),
                            ...((_d = (_c = providerEdit.additionalEdit) === null || _c === void 0 ? void 0 : _c.edits) !== null && _d !== void 0 ? _d : [])
                        ]
                    };
                    yield this._bulkEditService.apply(combinedWorkspaceEdit, { editor: this._editor });
                    return;
                }
                yield this.applyDefaultPasteHandler(dataTransfer, metadata, tokenSource.token);
            }
            finally {
                tokenSource.dispose();
            }
        });
    }
    getProviderPasteEdit(providers, dataTransfer, model, selections, token) {
        return raceCancellation((() => __awaiter(this, void 0, void 0, function* () {
            for (const provider of providers) {
                if (token.isCancellationRequested) {
                    return;
                }
                if (!isSupportedProvider(provider, dataTransfer)) {
                    continue;
                }
                const edit = yield provider.provideDocumentPasteEdits(model, selections, dataTransfer, token);
                if (edit) {
                    return edit;
                }
            }
            return undefined;
        }))(), token);
    }
    applyDefaultPasteHandler(dataTransfer, metadata, token) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const textDataTransfer = (_a = dataTransfer.get(Mimes.text)) !== null && _a !== void 0 ? _a : dataTransfer.get('text');
            if (!textDataTransfer) {
                return;
            }
            const text = yield textDataTransfer.asString();
            if (token.isCancellationRequested) {
                return;
            }
            this._editor.trigger('keyboard', "paste" /* Handler.Paste */, {
                text: text,
                pasteOnNewLine: metadata === null || metadata === void 0 ? void 0 : metadata.wasFromEmptySelection,
                multicursorText: null
            });
        });
    }
};
CopyPasteController.ID = 'editor.contrib.copyPasteActionController';
CopyPasteController = __decorate([
    __param(1, IBulkEditService),
    __param(2, IClipboardService),
    __param(3, IConfigurationService),
    __param(4, ILanguageFeaturesService),
    __param(5, IProgressService)
], CopyPasteController);
export { CopyPasteController };
function isSupportedProvider(provider, dataTransfer) {
    return provider.pasteMimeTypes.some(type => {
        if (type.toLowerCase() === DataTransfers.FILES.toLowerCase()) {
            return [...dataTransfer.values()].some(item => item.asFile());
        }
        return dataTransfer.has(type);
    });
}
