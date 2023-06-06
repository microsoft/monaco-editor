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
import { coalesce } from '../../../../base/common/arrays.js';
import { createCancelablePromise, raceCancellation } from '../../../../base/common/async.js';
import { VSDataTransfer } from '../../../../base/common/dataTransfer.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { toExternalVSDataTransfer } from '../../../browser/dnd.js';
import { Range } from '../../../common/core/range.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { DraggedTreeItemsIdentifier } from '../../../common/services/treeViewsDnd.js';
import { ITreeViewsDnDService } from '../../../common/services/treeViewsDndService.js';
import { EditorStateCancellationTokenSource } from '../../editorState/browser/editorState.js';
import { InlineProgressManager } from '../../inlineProgress/browser/inlineProgress.js';
import { localize } from '../../../../nls.js';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { LocalSelectionTransfer } from '../../../../platform/dnd/browser/dnd.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { PostEditWidgetManager } from './postEditWidget.js';
export const changeDropTypeCommandId = 'editor.changeDropType';
export const dropWidgetVisibleCtx = new RawContextKey('dropWidgetVisible', false, localize('dropWidgetVisible', "Whether the drop widget is showing"));
export let DropIntoEditorController = class DropIntoEditorController extends Disposable {
    static get(editor) {
        return editor.getContribution(DropIntoEditorController.ID);
    }
    constructor(editor, instantiationService, _languageFeaturesService, _treeViewsDragAndDropService) {
        super();
        this._languageFeaturesService = _languageFeaturesService;
        this._treeViewsDragAndDropService = _treeViewsDragAndDropService;
        this.treeItemsTransfer = LocalSelectionTransfer.getInstance();
        this._dropProgressManager = this._register(instantiationService.createInstance(InlineProgressManager, 'dropIntoEditor', editor));
        this._postDropWidgetManager = this._register(instantiationService.createInstance(PostEditWidgetManager, 'dropIntoEditor', editor, dropWidgetVisibleCtx, { id: changeDropTypeCommandId, label: localize('postDropWidgetTitle', "Show drop options...") }));
        this._register(editor.onDropIntoEditor(e => this.onDropIntoEditor(editor, e.position, e.event)));
    }
    changeDropType() {
        this._postDropWidgetManager.tryShowSelector();
    }
    onDropIntoEditor(editor, position, dragEvent) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!dragEvent.dataTransfer || !editor.hasModel()) {
                return;
            }
            (_a = this._currentOperation) === null || _a === void 0 ? void 0 : _a.cancel();
            editor.focus();
            editor.setPosition(position);
            const p = createCancelablePromise((token) => __awaiter(this, void 0, void 0, function* () {
                const tokenSource = new EditorStateCancellationTokenSource(editor, 1 /* CodeEditorStateFlag.Value */, undefined, token);
                try {
                    const ourDataTransfer = yield this.extractDataTransferData(dragEvent);
                    if (ourDataTransfer.size === 0 || tokenSource.token.isCancellationRequested) {
                        return;
                    }
                    const model = editor.getModel();
                    if (!model) {
                        return;
                    }
                    const providers = this._languageFeaturesService.documentOnDropEditProvider
                        .ordered(model)
                        .filter(provider => {
                        if (!provider.dropMimeTypes) {
                            // Keep all providers that don't specify mime types
                            return true;
                        }
                        return provider.dropMimeTypes.some(mime => ourDataTransfer.matches(mime));
                    });
                    const edits = yield this.getDropEdits(providers, model, position, ourDataTransfer, tokenSource);
                    if (tokenSource.token.isCancellationRequested) {
                        return;
                    }
                    if (edits.length) {
                        const canShowWidget = editor.getOption(34 /* EditorOption.dropIntoEditor */).showDropSelector === 'afterDrop';
                        // Pass in the parent token here as it tracks cancelling the entire drop operation
                        yield this._postDropWidgetManager.applyEditAndShowIfNeeded([Range.fromPositions(position)], { activeEditIndex: 0, allEdits: edits }, canShowWidget, token);
                    }
                }
                finally {
                    tokenSource.dispose();
                    if (this._currentOperation === p) {
                        this._currentOperation = undefined;
                    }
                }
            }));
            this._dropProgressManager.showWhile(position, localize('dropIntoEditorProgress', "Running drop handlers. Click to cancel"), p);
            this._currentOperation = p;
        });
    }
    getDropEdits(providers, model, position, dataTransfer, tokenSource) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield raceCancellation(Promise.all(providers.map(provider => {
                return provider.provideDocumentOnDropEdits(model, position, dataTransfer, tokenSource.token);
            })), tokenSource.token);
            const edits = coalesce(results !== null && results !== void 0 ? results : []);
            edits.sort((a, b) => b.priority - a.priority);
            return edits;
        });
    }
    extractDataTransferData(dragEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!dragEvent.dataTransfer) {
                return new VSDataTransfer();
            }
            const dataTransfer = toExternalVSDataTransfer(dragEvent.dataTransfer);
            if (this.treeItemsTransfer.hasData(DraggedTreeItemsIdentifier.prototype)) {
                const data = this.treeItemsTransfer.getData(DraggedTreeItemsIdentifier.prototype);
                if (Array.isArray(data)) {
                    for (const id of data) {
                        const treeDataTransfer = yield this._treeViewsDragAndDropService.removeDragOperationTransfer(id.identifier);
                        if (treeDataTransfer) {
                            for (const [type, value] of treeDataTransfer) {
                                dataTransfer.replace(type, value);
                            }
                        }
                    }
                }
            }
            return dataTransfer;
        });
    }
};
DropIntoEditorController.ID = 'editor.contrib.dropIntoEditorController';
DropIntoEditorController = __decorate([
    __param(1, IInstantiationService),
    __param(2, ILanguageFeaturesService),
    __param(3, ITreeViewsDnDService)
], DropIntoEditorController);
