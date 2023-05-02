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
import { addExternalEditorsDropData, toVSDataTransfer } from '../../../browser/dnd.js';
import { EditorCommand, registerEditorCommand, registerEditorContribution } from '../../../browser/editorExtensions.js';
import { IBulkEditService, ResourceTextEdit } from '../../../browser/services/bulkEditService.js';
import { Range } from '../../../common/core/range.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { DraggedTreeItemsIdentifier } from '../../../common/services/treeViewsDnd.js';
import { ITreeViewsDnDService } from '../../../common/services/treeViewsDndService.js';
import { PostDropWidgetManager, changeDropTypeCommandId, dropWidgetVisibleCtx } from './postDropWidget.js';
import { EditorStateCancellationTokenSource } from '../../editorState/browser/editorState.js';
import { InlineProgressManager } from '../../inlineProgress/browser/inlineProgress.js';
import { SnippetParser } from '../../snippet/browser/snippetParser.js';
import { localize } from '../../../../nls.js';
import { LocalSelectionTransfer } from '../../../../platform/dnd/browser/dnd.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { registerDefaultDropProviders } from './defaultOnDropProviders.js';
export let DropIntoEditorController = class DropIntoEditorController extends Disposable {
    static get(editor) {
        return editor.getContribution(DropIntoEditorController.ID);
    }
    constructor(editor, instantiationService, workspaceContextService, _bulkEditService, _languageFeaturesService, _treeViewsDragAndDropService) {
        super();
        this._bulkEditService = _bulkEditService;
        this._languageFeaturesService = _languageFeaturesService;
        this._treeViewsDragAndDropService = _treeViewsDragAndDropService;
        this.operationIdPool = 0;
        this.treeItemsTransfer = LocalSelectionTransfer.getInstance();
        this._dropProgressManager = this._register(instantiationService.createInstance(InlineProgressManager, 'dropIntoEditor', editor));
        this._postDropWidgetManager = this._register(instantiationService.createInstance(PostDropWidgetManager, editor));
        this._register(editor.onDropIntoEditor(e => this.onDropIntoEditor(editor, e.position, e.event)));
        registerDefaultDropProviders(this._languageFeaturesService, workspaceContextService);
    }
    changeDropType() {
        this._postDropWidgetManager.changeExistingDropType();
    }
    onDropIntoEditor(editor, position, dragEvent) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!dragEvent.dataTransfer || !editor.hasModel()) {
                return;
            }
            (_a = this._currentOperation) === null || _a === void 0 ? void 0 : _a.promise.cancel();
            this._dropProgressManager.clear();
            editor.focus();
            editor.setPosition(position);
            const operationId = this.operationIdPool++;
            const p = createCancelablePromise((token) => __awaiter(this, void 0, void 0, function* () {
                var _b;
                const tokenSource = new EditorStateCancellationTokenSource(editor, 1 /* CodeEditorStateFlag.Value */, undefined, token);
                this._dropProgressManager.setAtPosition(position, localize('dropIntoEditorProgress', "Running drop handlers. Click to cancel"), {
                    cancel: () => tokenSource.cancel()
                });
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
                    const possibleDropEdits = yield raceCancellation(Promise.all(providers.map(provider => {
                        return provider.provideDocumentOnDropEdits(model, position, ourDataTransfer, tokenSource.token);
                    })), tokenSource.token);
                    if (tokenSource.token.isCancellationRequested) {
                        return;
                    }
                    if (possibleDropEdits) {
                        // Pass in the parent token here as it tracks cancelling the entire drop operation.
                        yield this.applyDropResult(editor, position, 0, coalesce(possibleDropEdits), token);
                    }
                }
                finally {
                    tokenSource.dispose();
                    if (((_b = this._currentOperation) === null || _b === void 0 ? void 0 : _b.id) === operationId) {
                        this._dropProgressManager.clear();
                        this._currentOperation = undefined;
                    }
                }
            }));
            this._currentOperation = { id: operationId, promise: p };
        });
    }
    extractDataTransferData(dragEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!dragEvent.dataTransfer) {
                return new VSDataTransfer();
            }
            const dataTransfer = toVSDataTransfer(dragEvent.dataTransfer);
            addExternalEditorsDropData(dataTransfer, dragEvent);
            if (this.treeItemsTransfer.hasData(DraggedTreeItemsIdentifier.prototype)) {
                const data = this.treeItemsTransfer.getData(DraggedTreeItemsIdentifier.prototype);
                if (Array.isArray(data)) {
                    for (const id of data) {
                        const treeDataTransfer = yield this._treeViewsDragAndDropService.removeDragOperationTransfer(id.identifier);
                        if (treeDataTransfer) {
                            for (const [type, value] of treeDataTransfer.entries()) {
                                dataTransfer.replace(type, value);
                            }
                        }
                    }
                }
            }
            return dataTransfer;
        });
    }
    applyDropResult(editor, position, selectedEditIndex, allEdits, token) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const model = editor.getModel();
            if (!model) {
                return;
            }
            const edit = allEdits[selectedEditIndex];
            if (!edit) {
                return;
            }
            const snippet = typeof edit.insertText === 'string' ? SnippetParser.escape(edit.insertText) : edit.insertText.snippet;
            const combinedWorkspaceEdit = {
                edits: [
                    new ResourceTextEdit(model.uri, {
                        range: Range.fromPositions(position),
                        text: snippet,
                        insertAsSnippet: true,
                    }),
                    ...((_b = (_a = edit.additionalEdit) === null || _a === void 0 ? void 0 : _a.edits) !== null && _b !== void 0 ? _b : [])
                ]
            };
            // Use a decoration to track edits around the cursor
            const editTrackingDecoration = model.deltaDecorations([], [{
                    range: Range.fromPositions(position),
                    options: { description: 'drop-line-suffix', stickiness: 0 /* TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges */ }
                }]);
            const editResult = yield this._bulkEditService.apply(combinedWorkspaceEdit, { editor, token });
            const editRange = model.getDecorationRange(editTrackingDecoration[0]);
            model.deltaDecorations(editTrackingDecoration, []);
            if (editResult.isApplied && allEdits.length > 1) {
                const options = editor.getOptions().get(34 /* EditorOption.dropIntoEditor */);
                if (options.showDropSelector === 'afterDrop') {
                    this._postDropWidgetManager.show(editRange !== null && editRange !== void 0 ? editRange : Range.fromPositions(position), {
                        activeEditIndex: selectedEditIndex,
                        allEdits: allEdits,
                    }, (newEditIndex) => __awaiter(this, void 0, void 0, function* () {
                        yield model.undo();
                        this.applyDropResult(editor, position, newEditIndex, allEdits, token);
                    }));
                }
            }
        });
    }
};
DropIntoEditorController.ID = 'editor.contrib.dropIntoEditorController';
DropIntoEditorController = __decorate([
    __param(1, IInstantiationService),
    __param(2, IWorkspaceContextService),
    __param(3, IBulkEditService),
    __param(4, ILanguageFeaturesService),
    __param(5, ITreeViewsDnDService)
], DropIntoEditorController);
registerEditorContribution(DropIntoEditorController.ID, DropIntoEditorController, 2 /* EditorContributionInstantiation.BeforeFirstInteraction */);
registerEditorCommand(new class extends EditorCommand {
    constructor() {
        super({
            id: changeDropTypeCommandId,
            precondition: dropWidgetVisibleCtx,
            kbOpts: {
                weight: 100 /* KeybindingWeight.EditorContrib */,
                primary: 2048 /* KeyMod.CtrlCmd */ | 89 /* KeyCode.Period */,
            }
        });
    }
    runEditorCommand(_accessor, editor, _args) {
        var _a;
        (_a = DropIntoEditorController.get(editor)) === null || _a === void 0 ? void 0 : _a.changeDropType();
    }
});
