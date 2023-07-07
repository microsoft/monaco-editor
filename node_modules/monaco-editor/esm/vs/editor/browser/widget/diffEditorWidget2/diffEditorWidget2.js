var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { $, h } from '../../../../base/browser/dom.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { Event } from '../../../../base/common/event.js';
import { autorun, derived, keepAlive, observableValue } from '../../../../base/common/observable.js';
import { autorunWithStore2 } from '../../../../base/common/observableImpl/autorun.js';
import { disposableObservableValue, transaction } from '../../../../base/common/observableImpl/base.js';
import { derivedWithStore } from '../../../../base/common/observableImpl/derived.js';
import './style.css';
import { EditorExtensionsRegistry } from '../../editorExtensions.js';
import { ICodeEditorService } from '../../services/codeEditorService.js';
import { CodeEditorWidget } from '../codeEditorWidget.js';
import { DiffEditorDecorations } from './diffEditorDecorations.js';
import { DiffEditorSash } from './diffEditorSash.js';
import { DiffReview2 } from './diffReview.js';
import { ViewZoneManager } from './lineAlignment.js';
import { MovedBlocksLinesPart } from './movedBlocksLines.js';
import { OverviewRulerPart } from './overviewRulerPart.js';
import { UnchangedRangesFeature } from './unchangedRanges.js';
import { ObservableElementSizeObserver, applyStyle, readHotReloadableExport } from './utils.js';
import { WorkerBasedDocumentDiffProvider } from '../workerBasedDocumentDiffProvider.js';
import { EditorType } from '../../../common/editorCommon.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { DelegatingEditor } from './delegatingEditorImpl.js';
import { DiffEditorEditors } from './diffEditorEditors.js';
import { DiffEditorOptions } from './diffEditorOptions.js';
import { DiffEditorViewModel } from './diffEditorViewModel.js';
export let DiffEditorWidget2 = class DiffEditorWidget2 extends DelegatingEditor {
    constructor(_domElement, options, codeEditorWidgetOptions, _parentContextKeyService, _parentInstantiationService, codeEditorService) {
        var _a;
        super();
        this._domElement = _domElement;
        this._parentContextKeyService = _parentContextKeyService;
        this._parentInstantiationService = _parentInstantiationService;
        this.elements = h('div.monaco-diff-editor.side-by-side', { style: { position: 'relative', height: '100%' } }, [
            h('div.noModificationsOverlay@overlay', { style: { position: 'absolute', height: '100%', visibility: 'hidden', } }, [$('span', {}, 'No Changes')]),
            h('div.editor.original@original', { style: { position: 'absolute', height: '100%' } }),
            h('div.editor.modified@modified', { style: { position: 'absolute', height: '100%' } }),
        ]);
        this._diffModel = this._register(disposableObservableValue('diffModel', undefined));
        this.onDidChangeModel = Event.fromObservableLight(this._diffModel);
        this._contextKeyService = this._register(this._parentContextKeyService.createScoped(this._domElement));
        this._instantiationService = this._parentInstantiationService.createChild(new ServiceCollection([IContextKeyService, this._contextKeyService]));
        this._boundarySashes = observableValue('boundarySashes', undefined);
        this._layoutInfo = derived('modifiedEditorLayoutInfo', (reader) => {
            var _a;
            const width = this._rootSizeObserver.width.read(reader);
            const height = this._rootSizeObserver.height.read(reader);
            const sashLeft = (_a = this._sash.read(reader)) === null || _a === void 0 ? void 0 : _a.sashLeft.read(reader);
            const originalWidth = sashLeft !== null && sashLeft !== void 0 ? sashLeft : Math.max(5, this._editors.original.getLayoutInfo().decorationsLeft);
            this.elements.original.style.width = originalWidth + 'px';
            this.elements.original.style.left = '0px';
            this.elements.modified.style.width = (width - originalWidth) + 'px';
            this.elements.modified.style.left = originalWidth + 'px';
            this._editors.original.layout({ width: originalWidth, height: height });
            this._editors.modified.layout({
                width: width - originalWidth -
                    (this._options.renderOverviewRuler.read(reader) ? OverviewRulerPart.ENTIRE_DIFF_OVERVIEW_WIDTH : 0),
                height
            });
            this._reviewPane.layout(0, width, height);
            return {
                modifiedEditor: this._editors.modified.getLayoutInfo(),
                originalEditor: this._editors.original.getLayoutInfo(),
            };
        });
        this._diffValue = this._diffModel.map((m, r) => m === null || m === void 0 ? void 0 : m.diff.read(r));
        this.onDidUpdateDiff = Event.fromObservableLight(this._diffValue);
        codeEditorService.willCreateDiffEditor();
        this._contextKeyService.createKey('isInDiffEditor', true);
        this._contextKeyService.createKey('diffEditorVersion', 2);
        this._options = new DiffEditorOptions(options);
        this._contextKeyService.createKey(EditorContextKeys.isEmbeddedDiffEditor.key, false);
        const isEmbeddedDiffEditorKey = EditorContextKeys.isEmbeddedDiffEditor.bindTo(this._contextKeyService);
        this._register(autorun('update isEmbeddedDiffEditorKey', reader => {
            isEmbeddedDiffEditorKey.set(this._options.isInEmbeddedEditor.read(reader));
        }));
        this._domElement.appendChild(this.elements.root);
        this._rootSizeObserver = this._register(new ObservableElementSizeObserver(this.elements.root, options.dimension));
        this._rootSizeObserver.setAutomaticLayout((_a = options.automaticLayout) !== null && _a !== void 0 ? _a : false);
        this._editors = this._register(this._instantiationService.createInstance(DiffEditorEditors, this.elements.original, this.elements.modified, this._options, codeEditorWidgetOptions, (i, c, o, o2) => this._createInnerEditor(i, c, o, o2)));
        this._sash = derivedWithStore('sash', (reader, store) => {
            const showSash = this._options.renderSideBySide.read(reader);
            this.elements.root.classList.toggle('side-by-side', showSash);
            if (!showSash) {
                return undefined;
            }
            const result = store.add(new DiffEditorSash(this._options, this.elements.root, {
                height: this._rootSizeObserver.height,
                width: this._rootSizeObserver.width.map((w, reader) => w - (this._options.renderOverviewRuler.read(reader) ? OverviewRulerPart.ENTIRE_DIFF_OVERVIEW_WIDTH : 0)),
            }));
            store.add(autorun('setBoundarySashes', reader => {
                const boundarySashes = this._boundarySashes.read(reader);
                if (boundarySashes) {
                    result.setBoundarySashes(boundarySashes);
                }
            }));
            return result;
        });
        this._register(keepAlive(this._sash, true));
        this._register(autorunWithStore2('UnchangedRangesFeature', (reader, store) => {
            this.unchangedRangesFeature = store.add(new (readHotReloadableExport(UnchangedRangesFeature, reader))(this._editors, this._diffModel, this._options));
        }));
        this._register(autorunWithStore2('DiffEditorDecorations', (reader, store) => {
            store.add(new (readHotReloadableExport(DiffEditorDecorations, reader))(this._editors, this._diffModel, this._options));
        }));
        this._register(this._instantiationService.createInstance(ViewZoneManager, this._editors, this._diffModel, this._options, this, () => this.unchangedRangesFeature.isUpdatingViewZones));
        this._register(autorunWithStore2('OverviewRulerPart', (reader, store) => {
            store.add(this._instantiationService.createInstance(readHotReloadableExport(OverviewRulerPart, reader), this._editors, this.elements.root, this._diffModel, this._rootSizeObserver.width, this._rootSizeObserver.height, this._layoutInfo.map(i => i.modifiedEditor), this._options));
        }));
        this._reviewPane = this._register(this._instantiationService.createInstance(DiffReview2, this));
        this.elements.root.appendChild(this._reviewPane.domNode.domNode);
        this.elements.root.appendChild(this._reviewPane.shadow.domNode);
        this.elements.root.appendChild(this._reviewPane.actionBarContainer.domNode);
        this._createDiffEditorContributions();
        codeEditorService.addDiffEditor(this);
        this._register(keepAlive(this._layoutInfo, true));
        this._register(new MovedBlocksLinesPart(this.elements.root, this._diffModel, this._layoutInfo.map(i => i.originalEditor), this._layoutInfo.map(i => i.modifiedEditor), this._editors));
        this._register(applyStyle(this.elements.overlay, {
            width: this._layoutInfo.map((i, r) => i.originalEditor.width + (this._options.renderSideBySide.read(r) ? 0 : i.modifiedEditor.width)),
            visibility: derived('visibility', reader => {
                var _a, _b;
                return (this._options.collapseUnchangedRegions.read(reader) && ((_b = (_a = this._diffModel.read(reader)) === null || _a === void 0 ? void 0 : _a.diff.read(reader)) === null || _b === void 0 ? void 0 : _b.mappings.length) === 0)
                    ? 'visible' : 'hidden';
            }),
        }));
        this._register(this._editors.original.onDidChangeCursorPosition(e => {
            const m = this._diffModel.get();
            if (!m) {
                return;
            }
            const movedText = m.diff.get().movedTexts.find(m => m.lineRangeMapping.originalRange.contains(e.position.lineNumber));
            m.syncedMovedTexts.set(movedText, undefined);
        }));
        this._register(this._editors.modified.onDidChangeCursorPosition(e => {
            const m = this._diffModel.get();
            if (!m) {
                return;
            }
            const movedText = m.diff.get().movedTexts.find(m => m.lineRangeMapping.modifiedRange.contains(e.position.lineNumber));
            m.syncedMovedTexts.set(movedText, undefined);
        }));
        // Revert change when an arrow is clicked.
        this._register(this._editors.modified.onMouseDown(event => {
            var _a, _b;
            if (!event.event.rightButton && event.target.position && ((_a = event.target.element) === null || _a === void 0 ? void 0 : _a.className.includes('arrow-revert-change'))) {
                const lineNumber = event.target.position.lineNumber;
                const viewZone = event.target;
                const model = this._diffModel.get();
                if (!model) {
                    return;
                }
                const diffs = (_b = model.diff.get()) === null || _b === void 0 ? void 0 : _b.mappings;
                if (!diffs) {
                    return;
                }
                const diff = diffs.find(d => (viewZone === null || viewZone === void 0 ? void 0 : viewZone.detail.afterLineNumber) === d.lineRangeMapping.modifiedRange.startLineNumber - 1 ||
                    d.lineRangeMapping.modifiedRange.startLineNumber === lineNumber);
                if (!diff) {
                    return;
                }
                this.revert(diff.lineRangeMapping);
                event.event.stopPropagation();
            }
        }));
    }
    _createInnerEditor(instantiationService, container, options, editorWidgetOptions) {
        const editor = instantiationService.createInstance(CodeEditorWidget, container, options, editorWidgetOptions);
        return editor;
    }
    _createDiffEditorContributions() {
        const contributions = EditorExtensionsRegistry.getDiffEditorContributions();
        for (const desc of contributions) {
            try {
                this._register(this._instantiationService.createInstance(desc.ctor, this));
            }
            catch (err) {
                onUnexpectedError(err);
            }
        }
    }
    get _targetEditor() { return this._editors.modified; }
    getEditorType() { return EditorType.IDiffEditor; }
    layout(dimension) { this._rootSizeObserver.observe(dimension); }
    hasTextFocus() { return this._editors.original.hasTextFocus() || this._editors.modified.hasTextFocus(); }
    saveViewState() {
        var _a;
        const originalViewState = this._editors.original.saveViewState();
        const modifiedViewState = this._editors.modified.saveViewState();
        return {
            original: originalViewState,
            modified: modifiedViewState,
            modelState: (_a = this._diffModel.get()) === null || _a === void 0 ? void 0 : _a.serializeState(),
        };
    }
    restoreViewState(s) {
        var _a;
        if (s && s.original && s.modified) {
            const diffEditorState = s;
            this._editors.original.restoreViewState(diffEditorState.original);
            this._editors.modified.restoreViewState(diffEditorState.modified);
            if (diffEditorState.modelState) {
                (_a = this._diffModel.get()) === null || _a === void 0 ? void 0 : _a.restoreSerializedState(diffEditorState.modelState);
            }
        }
    }
    createViewModel(model) {
        return new DiffEditorViewModel(model, this._options, 
        // TODO@hediet make diffAlgorithm observable
        this._instantiationService.createInstance(WorkerBasedDocumentDiffProvider, { diffAlgorithm: this._options.diffAlgorithm.get() }));
    }
    getModel() { var _a, _b; return (_b = (_a = this._diffModel.get()) === null || _a === void 0 ? void 0 : _a.model) !== null && _b !== void 0 ? _b : null; }
    setModel(model) {
        const vm = model ? ('model' in model) ? model : this.createViewModel(model) : undefined;
        this._editors.original.setModel(vm ? vm.model.original : null);
        this._editors.modified.setModel(vm ? vm.model.modified : null);
        transaction(tx => {
            this._diffModel.set(vm, tx);
        });
    }
    /**
     * @param changedOptions Only has values for top-level options that have actually changed.
     */
    updateOptions(changedOptions) {
        this._options.updateOptions(changedOptions);
    }
    getContainerDomNode() { return this._domElement; }
    getOriginalEditor() { return this._editors.original; }
    getModifiedEditor() { return this._editors.modified; }
    /**
     * @deprecated Use `this.getDiffComputationResult().changes2` instead.
     */
    getLineChanges() {
        var _a;
        const diffState = (_a = this._diffModel.get()) === null || _a === void 0 ? void 0 : _a.diff.get();
        if (!diffState) {
            return null;
        }
        return toLineChanges(diffState);
    }
    revert(diff) {
        var _a;
        const model = (_a = this._diffModel.get()) === null || _a === void 0 ? void 0 : _a.model;
        if (!model) {
            return;
        }
        const changes = diff.innerChanges
            ? diff.innerChanges.map(c => ({
                range: c.modifiedRange,
                text: model.original.getValueInRange(c.originalRange)
            }))
            : [
                {
                    range: diff.modifiedRange.toExclusiveRange(),
                    text: model.original.getValueInRange(diff.originalRange.toExclusiveRange())
                }
            ];
        this._editors.modified.executeEdits('diffEditor', changes);
    }
    diffReviewNext() { this._reviewPane.next(); }
    diffReviewPrev() { this._reviewPane.prev(); }
};
DiffEditorWidget2 = __decorate([
    __param(3, IContextKeyService),
    __param(4, IInstantiationService),
    __param(5, ICodeEditorService)
], DiffEditorWidget2);
function toLineChanges(state) {
    return state.mappings.map(x => {
        const m = x.lineRangeMapping;
        let originalStartLineNumber;
        let originalEndLineNumber;
        let modifiedStartLineNumber;
        let modifiedEndLineNumber;
        let innerChanges = m.innerChanges;
        if (m.originalRange.isEmpty) {
            // Insertion
            originalStartLineNumber = m.originalRange.startLineNumber - 1;
            originalEndLineNumber = 0;
            innerChanges = undefined;
        }
        else {
            originalStartLineNumber = m.originalRange.startLineNumber;
            originalEndLineNumber = m.originalRange.endLineNumberExclusive - 1;
        }
        if (m.modifiedRange.isEmpty) {
            // Deletion
            modifiedStartLineNumber = m.modifiedRange.startLineNumber - 1;
            modifiedEndLineNumber = 0;
            innerChanges = undefined;
        }
        else {
            modifiedStartLineNumber = m.modifiedRange.startLineNumber;
            modifiedEndLineNumber = m.modifiedRange.endLineNumberExclusive - 1;
        }
        return {
            originalStartLineNumber,
            originalEndLineNumber,
            modifiedStartLineNumber,
            modifiedEndLineNumber,
            charChanges: innerChanges === null || innerChanges === void 0 ? void 0 : innerChanges.map(m => ({
                originalStartLineNumber: m.originalRange.startLineNumber,
                originalStartColumn: m.originalRange.startColumn,
                originalEndLineNumber: m.originalRange.endLineNumber,
                originalEndColumn: m.originalRange.endColumn,
                modifiedStartLineNumber: m.modifiedRange.startLineNumber,
                modifiedStartColumn: m.modifiedRange.startColumn,
                modifiedEndLineNumber: m.modifiedRange.endLineNumber,
                modifiedEndColumn: m.modifiedRange.endColumn,
            }))
        };
    });
}
