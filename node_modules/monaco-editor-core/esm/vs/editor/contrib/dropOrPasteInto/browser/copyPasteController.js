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
import { addDisposableListener } from '../../../../base/browser/dom.js';
import { coalesce } from '../../../../base/common/arrays.js';
import { createCancelablePromise, raceCancellation } from '../../../../base/common/async.js';
import { UriList, createStringDataTransferItem, matchesMimeType } from '../../../../base/common/dataTransfer.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { Mimes } from '../../../../base/common/mime.js';
import * as platform from '../../../../base/common/platform.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { toExternalVSDataTransfer, toVSDataTransfer } from '../../../browser/dnd.js';
import { IBulkEditService } from '../../../browser/services/bulkEditService.js';
import { Range } from '../../../common/core/range.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { createCombinedWorkspaceEdit } from './edit.js';
import { EditorStateCancellationTokenSource } from '../../editorState/browser/editorState.js';
import { InlineProgressManager } from '../../inlineProgress/browser/inlineProgress.js';
import { localize } from '../../../../nls.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IProgressService } from '../../../../platform/progress/common/progress.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { PostEditWidgetManager } from './postEditWidget.js';
export const changePasteTypeCommandId = 'editor.changePasteType';
export const pasteWidgetVisibleCtx = new RawContextKey('pasteWidgetVisible', false, localize('pasteWidgetVisible', "Whether the paste widget is showing"));
const vscodeClipboardMime = 'application/vnd.code.copyMetadata';
export let CopyPasteController = class CopyPasteController extends Disposable {
    static get(editor) {
        return editor.getContribution(CopyPasteController.ID);
    }
    constructor(editor, instantiationService, _bulkEditService, _clipboardService, _languageFeaturesService, _quickInputService, _progressService) {
        super();
        this._bulkEditService = _bulkEditService;
        this._clipboardService = _clipboardService;
        this._languageFeaturesService = _languageFeaturesService;
        this._quickInputService = _quickInputService;
        this._progressService = _progressService;
        this._editor = editor;
        const container = editor.getContainerDomNode();
        this._register(addDisposableListener(container, 'copy', e => this.handleCopy(e)));
        this._register(addDisposableListener(container, 'cut', e => this.handleCopy(e)));
        this._register(addDisposableListener(container, 'paste', e => this.handlePaste(e), true));
        this._pasteProgressManager = this._register(new InlineProgressManager('pasteIntoEditor', editor, instantiationService));
        this._postPasteWidgetManager = this._register(instantiationService.createInstance(PostEditWidgetManager, 'pasteIntoEditor', editor, pasteWidgetVisibleCtx, { id: changePasteTypeCommandId, label: localize('postPasteWidgetTitle', "Show paste options...") }));
    }
    changePasteType() {
        this._postPasteWidgetManager.tryShowSelector();
    }
    pasteAs(preferredId) {
        this._editor.focus();
        try {
            this._pasteAsActionContext = { preferredId };
            document.execCommand('paste');
        }
        finally {
            this._pasteAsActionContext = undefined;
        }
    }
    isPasteAsEnabled() {
        return this._editor.getOption(82 /* EditorOption.pasteAs */).enabled
            && !this._editor.getOption(88 /* EditorOption.readOnly */);
    }
    handleCopy(e) {
        var _a, _b;
        if (!this._editor.hasTextFocus()) {
            return;
        }
        if (platform.isWeb) {
            // Explicitly clear the web resources clipboard.
            // This is needed because on web, the browser clipboard is faked out using an in-memory store.
            // This means the resources clipboard is not properly updated when copying from the editor.
            this._clipboardService.writeResources([]);
        }
        if (!e.clipboardData || !this.isPasteAsEnabled()) {
            return;
        }
        const model = this._editor.getModel();
        const selections = this._editor.getSelections();
        if (!model || !(selections === null || selections === void 0 ? void 0 : selections.length)) {
            return;
        }
        const enableEmptySelectionClipboard = this._editor.getOption(35 /* EditorOption.emptySelectionClipboard */);
        let ranges = selections;
        const wasFromEmptySelection = selections.length === 1 && selections[0].isEmpty();
        if (wasFromEmptySelection) {
            if (!enableEmptySelectionClipboard) {
                return;
            }
            ranges = [new Range(ranges[0].startLineNumber, 1, ranges[0].startLineNumber, 1 + model.getLineLength(ranges[0].startLineNumber))];
        }
        const toCopy = (_a = this._editor._getViewModel()) === null || _a === void 0 ? void 0 : _a.getPlainTextToCopy(selections, enableEmptySelectionClipboard, platform.isWindows);
        const multicursorText = Array.isArray(toCopy) ? toCopy : null;
        const defaultPastePayload = {
            multicursorText,
            pasteOnNewLine: wasFromEmptySelection,
            mode: null
        };
        const providers = this._languageFeaturesService.documentPasteEditProvider
            .ordered(model)
            .filter(x => !!x.prepareDocumentPaste);
        if (!providers.length) {
            this.setCopyMetadata(e.clipboardData, { defaultPastePayload });
            return;
        }
        const dataTransfer = toVSDataTransfer(e.clipboardData);
        const providerCopyMimeTypes = providers.flatMap(x => { var _a; return (_a = x.copyMimeTypes) !== null && _a !== void 0 ? _a : []; });
        // Save off a handle pointing to data that VS Code maintains.
        const handle = generateUuid();
        this.setCopyMetadata(e.clipboardData, {
            id: handle,
            providerCopyMimeTypes,
            defaultPastePayload
        });
        const promise = createCancelablePromise((token) => __awaiter(this, void 0, void 0, function* () {
            const results = coalesce(yield Promise.all(providers.map((provider) => __awaiter(this, void 0, void 0, function* () {
                try {
                    return yield provider.prepareDocumentPaste(model, ranges, dataTransfer, token);
                }
                catch (err) {
                    console.error(err);
                    return undefined;
                }
            }))));
            // Values from higher priority providers should overwrite values from lower priority ones.
            // Reverse the array to so that the calls to `replace` below will do this
            results.reverse();
            for (const result of results) {
                for (const [mime, value] of result) {
                    dataTransfer.replace(mime, value);
                }
            }
            return dataTransfer;
        }));
        (_b = this._currentCopyOperation) === null || _b === void 0 ? void 0 : _b.dataTransferPromise.cancel();
        this._currentCopyOperation = { handle: handle, dataTransferPromise: promise };
    }
    handlePaste(e) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!e.clipboardData || !this._editor.hasTextFocus()) {
                return;
            }
            (_a = this._currentPasteOperation) === null || _a === void 0 ? void 0 : _a.cancel();
            this._currentPasteOperation = undefined;
            const model = this._editor.getModel();
            const selections = this._editor.getSelections();
            if (!(selections === null || selections === void 0 ? void 0 : selections.length) || !model) {
                return;
            }
            if (!this.isPasteAsEnabled()) {
                return;
            }
            const metadata = this.fetchCopyMetadata(e.clipboardData);
            const dataTransfer = toExternalVSDataTransfer(e.clipboardData);
            dataTransfer.delete(vscodeClipboardMime);
            const allPotentialMimeTypes = [
                ...e.clipboardData.types,
                ...(_b = metadata === null || metadata === void 0 ? void 0 : metadata.providerCopyMimeTypes) !== null && _b !== void 0 ? _b : [],
                // TODO: always adds `uri-list` because this get set if there are resources in the system clipboard.
                // However we can only check the system clipboard async. For this early check, just add it in.
                // We filter providers again once we have the final dataTransfer we will use.
                Mimes.uriList,
            ];
            const allProviders = this._languageFeaturesService.documentPasteEditProvider
                .ordered(model)
                .filter(provider => { var _a; return (_a = provider.pasteMimeTypes) === null || _a === void 0 ? void 0 : _a.some(type => matchesMimeType(type, allPotentialMimeTypes)); });
            if (!allProviders.length) {
                return;
            }
            // Prevent the editor's default paste handler from running.
            // Note that after this point, we are fully responsible for handling paste.
            // If we can't provider a paste for any reason, we need to explicitly delegate pasting back to the editor.
            e.preventDefault();
            e.stopImmediatePropagation();
            if (this._pasteAsActionContext) {
                this.showPasteAsPick(this._pasteAsActionContext.preferredId, allProviders, selections, dataTransfer, metadata);
            }
            else {
                this.doPasteInline(allProviders, selections, dataTransfer, metadata);
            }
        });
    }
    doPasteInline(allProviders, selections, dataTransfer, metadata) {
        const p = createCancelablePromise((token) => __awaiter(this, void 0, void 0, function* () {
            const editor = this._editor;
            if (!editor.hasModel()) {
                return;
            }
            const model = editor.getModel();
            const tokenSource = new EditorStateCancellationTokenSource(editor, 1 /* CodeEditorStateFlag.Value */ | 2 /* CodeEditorStateFlag.Selection */, undefined, token);
            try {
                yield this.mergeInDataFromCopy(dataTransfer, metadata, tokenSource.token);
                if (tokenSource.token.isCancellationRequested) {
                    return;
                }
                // Filter out any providers the don't match the full data transfer we will send them.
                const supportedProviders = allProviders.filter(provider => isSupportedPasteProvider(provider, dataTransfer));
                if (!supportedProviders.length
                    || (supportedProviders.length === 1 && supportedProviders[0].id === 'text') // Only our default text provider is active
                ) {
                    yield this.applyDefaultPasteHandler(dataTransfer, metadata, tokenSource.token);
                    return;
                }
                const providerEdits = yield this.getPasteEdits(supportedProviders, dataTransfer, model, selections, tokenSource.token);
                if (tokenSource.token.isCancellationRequested) {
                    return;
                }
                // If the only edit returned is a text edit, use the default paste handler
                if (providerEdits.length === 1 && providerEdits[0].id === 'text') {
                    yield this.applyDefaultPasteHandler(dataTransfer, metadata, tokenSource.token);
                    return;
                }
                if (providerEdits.length) {
                    const canShowWidget = editor.getOption(82 /* EditorOption.pasteAs */).showPasteSelector === 'afterPaste';
                    return this._postPasteWidgetManager.applyEditAndShowIfNeeded(selections, { activeEditIndex: 0, allEdits: providerEdits }, canShowWidget, tokenSource.token);
                }
                yield this.applyDefaultPasteHandler(dataTransfer, metadata, tokenSource.token);
            }
            finally {
                tokenSource.dispose();
                if (this._currentPasteOperation === p) {
                    this._currentPasteOperation = undefined;
                }
            }
        }));
        this._pasteProgressManager.showWhile(selections[0].getEndPosition(), localize('pasteIntoEditorProgress', "Running paste handlers. Click to cancel"), p);
        this._currentPasteOperation = p;
    }
    showPasteAsPick(preferredId, allProviders, selections, dataTransfer, metadata) {
        const p = createCancelablePromise((token) => __awaiter(this, void 0, void 0, function* () {
            const editor = this._editor;
            if (!editor.hasModel()) {
                return;
            }
            const model = editor.getModel();
            const tokenSource = new EditorStateCancellationTokenSource(editor, 1 /* CodeEditorStateFlag.Value */ | 2 /* CodeEditorStateFlag.Selection */, undefined, token);
            try {
                yield this.mergeInDataFromCopy(dataTransfer, metadata, tokenSource.token);
                if (tokenSource.token.isCancellationRequested) {
                    return;
                }
                // Filter out any providers the don't match the full data transfer we will send them.
                const supportedProviders = allProviders.filter(provider => isSupportedPasteProvider(provider, dataTransfer));
                const providerEdits = yield this.getPasteEdits(supportedProviders, dataTransfer, model, selections, tokenSource.token);
                if (tokenSource.token.isCancellationRequested) {
                    return;
                }
                if (!providerEdits.length) {
                    return;
                }
                let pickedEdit;
                if (typeof preferredId === 'string') {
                    // We are looking for a specific edit
                    pickedEdit = providerEdits.find(edit => edit.id === preferredId);
                }
                else {
                    const selected = yield this._quickInputService.pick(providerEdits.map((edit) => ({
                        label: edit.label,
                        description: edit.id,
                        detail: edit.detail,
                        edit,
                    })), {
                        placeHolder: localize('pasteAsPickerPlaceholder', "Select Paste Action"),
                    });
                    pickedEdit = selected === null || selected === void 0 ? void 0 : selected.edit;
                }
                if (!pickedEdit) {
                    return;
                }
                const combinedWorkspaceEdit = createCombinedWorkspaceEdit(model.uri, selections, pickedEdit);
                yield this._bulkEditService.apply(combinedWorkspaceEdit, { editor: this._editor });
            }
            finally {
                tokenSource.dispose();
                if (this._currentPasteOperation === p) {
                    this._currentPasteOperation = undefined;
                }
            }
        }));
        this._progressService.withProgress({
            location: 10 /* ProgressLocation.Window */,
            title: localize('pasteAsProgress', "Running paste handlers"),
        }, () => p);
    }
    setCopyMetadata(dataTransfer, metadata) {
        dataTransfer.setData(vscodeClipboardMime, JSON.stringify(metadata));
    }
    fetchCopyMetadata(dataTransfer) {
        const rawMetadata = dataTransfer.getData(vscodeClipboardMime);
        if (rawMetadata) {
            try {
                return JSON.parse(rawMetadata);
            }
            catch (_a) {
                return undefined;
            }
        }
        return undefined;
    }
    mergeInDataFromCopy(dataTransfer, metadata, token) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if ((metadata === null || metadata === void 0 ? void 0 : metadata.id) && ((_a = this._currentCopyOperation) === null || _a === void 0 ? void 0 : _a.handle) === metadata.id) {
                const toMergeDataTransfer = yield this._currentCopyOperation.dataTransferPromise;
                if (token.isCancellationRequested) {
                    return;
                }
                for (const [key, value] of toMergeDataTransfer) {
                    dataTransfer.replace(key, value);
                }
            }
            if (!dataTransfer.has(Mimes.uriList)) {
                const resources = yield this._clipboardService.readResources();
                if (token.isCancellationRequested) {
                    return;
                }
                if (resources.length) {
                    dataTransfer.append(Mimes.uriList, createStringDataTransferItem(UriList.create(resources)));
                }
            }
        });
    }
    getPasteEdits(providers, dataTransfer, model, selections, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield raceCancellation(Promise.all(providers.map(provider => {
                var _a;
                try {
                    return (_a = provider.provideDocumentPasteEdits) === null || _a === void 0 ? void 0 : _a.call(provider, model, selections, dataTransfer, token);
                }
                catch (err) {
                    console.error(err);
                    return undefined;
                }
            })).then(coalesce), token);
            result === null || result === void 0 ? void 0 : result.sort((a, b) => b.priority - a.priority);
            return result !== null && result !== void 0 ? result : [];
        });
    }
    applyDefaultPasteHandler(dataTransfer, metadata, token) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const textDataTransfer = (_a = dataTransfer.get(Mimes.text)) !== null && _a !== void 0 ? _a : dataTransfer.get('text');
            if (!textDataTransfer) {
                return;
            }
            const text = yield textDataTransfer.asString();
            if (token.isCancellationRequested) {
                return;
            }
            const payload = {
                text,
                pasteOnNewLine: (_b = metadata === null || metadata === void 0 ? void 0 : metadata.defaultPastePayload.pasteOnNewLine) !== null && _b !== void 0 ? _b : false,
                multicursorText: (_c = metadata === null || metadata === void 0 ? void 0 : metadata.defaultPastePayload.multicursorText) !== null && _c !== void 0 ? _c : null,
                mode: null,
            };
            this._editor.trigger('keyboard', "paste" /* Handler.Paste */, payload);
        });
    }
};
CopyPasteController.ID = 'editor.contrib.copyPasteActionController';
CopyPasteController = __decorate([
    __param(1, IInstantiationService),
    __param(2, IBulkEditService),
    __param(3, IClipboardService),
    __param(4, ILanguageFeaturesService),
    __param(5, IQuickInputService),
    __param(6, IProgressService)
], CopyPasteController);
function isSupportedPasteProvider(provider, dataTransfer) {
    var _a;
    return Boolean((_a = provider.pasteMimeTypes) === null || _a === void 0 ? void 0 : _a.some(type => dataTransfer.matches(type)));
}
