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
var _a;
import * as dom from '../../../base/browser/dom.js';
import { createFastDomNode } from '../../../base/browser/fastDomNode.js';
import { MOUSE_CURSOR_TEXT_CSS_CLASS_NAME } from '../../../base/browser/ui/mouseCursor/mouseCursor.js';
import { Sash } from '../../../base/browser/ui/sash/sash.js';
import * as assert from '../../../base/common/assert.js';
import { RunOnceScheduler } from '../../../base/common/async.js';
import { Codicon } from '../../../base/common/codicons.js';
import { onUnexpectedError } from '../../../base/common/errors.js';
import { Emitter } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import './media/diffEditor.css';
import { applyFontInfo } from '../config/domFontInfo.js';
import { ElementSizeObserver } from '../config/elementSizeObserver.js';
import { EditorExtensionsRegistry } from '../editorExtensions.js';
import { ICodeEditorService } from '../services/codeEditorService.js';
import { StableEditorScrollState } from '../stableEditorScroll.js';
import { CodeEditorWidget } from './codeEditorWidget.js';
import { DiffReview } from './diffReview.js';
import { InlineDiffMargin } from './inlineDiffMargin.js';
import { WorkerBasedDocumentDiffProvider } from './workerBasedDocumentDiffProvider.js';
import { boolean as validateBooleanOption, clampedInt, EditorFontLigatures, EditorOptions, stringSet as validateStringSetOption } from '../../common/config/editorOptions.js';
import { Position } from '../../common/core/position.js';
import { Range } from '../../common/core/range.js';
import { StringBuilder } from '../../common/core/stringBuilder.js';
import * as editorCommon from '../../common/editorCommon.js';
import { ModelDecorationOptions } from '../../common/model/textModel.js';
import { LineDecoration } from '../../common/viewLayout/lineDecorations.js';
import { RenderLineInput, renderViewLine } from '../../common/viewLayout/viewLineRenderer.js';
import { InlineDecoration, ViewLineRenderingData } from '../../common/viewModel.js';
import { OverviewRulerZone } from '../../common/viewModel/overviewZoneManager.js';
import * as nls from '../../../nls.js';
import { IClipboardService } from '../../../platform/clipboard/common/clipboardService.js';
import { IContextKeyService } from '../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../platform/instantiation/common/serviceCollection.js';
import { INotificationService } from '../../../platform/notification/common/notification.js';
import { IEditorProgressService } from '../../../platform/progress/common/progress.js';
import { defaultInsertColor, defaultRemoveColor, diffDiagonalFill, diffInserted, diffOverviewRulerInserted, diffOverviewRulerRemoved, diffRemoved } from '../../../platform/theme/common/colorRegistry.js';
import { registerIcon } from '../../../platform/theme/common/iconRegistry.js';
import { getThemeTypeSelector, IThemeService, registerThemingParticipant } from '../../../platform/theme/common/themeService.js';
import { ThemeIcon } from '../../../base/common/themables.js';
class VisualEditorState {
    constructor(_contextMenuService, _clipboardService) {
        this._contextMenuService = _contextMenuService;
        this._clipboardService = _clipboardService;
        this._zones = [];
        this._inlineDiffMargins = [];
        this._zonesMap = {};
        this._decorations = [];
    }
    getForeignViewZones(allViewZones) {
        return allViewZones.filter((z) => !this._zonesMap[String(z.id)]);
    }
    clean(editor) {
        // (1) View zones
        if (this._zones.length > 0) {
            editor.changeViewZones((viewChangeAccessor) => {
                for (const zoneId of this._zones) {
                    viewChangeAccessor.removeZone(zoneId);
                }
            });
        }
        this._zones = [];
        this._zonesMap = {};
        // (2) Model decorations
        editor.changeDecorations((changeAccessor) => {
            this._decorations = changeAccessor.deltaDecorations(this._decorations, []);
        });
    }
    apply(editor, overviewRuler, newDecorations, restoreScrollState) {
        const scrollState = restoreScrollState ? StableEditorScrollState.capture(editor) : null;
        // view zones
        editor.changeViewZones((viewChangeAccessor) => {
            var _a;
            for (const zoneId of this._zones) {
                viewChangeAccessor.removeZone(zoneId);
            }
            for (const inlineDiffMargin of this._inlineDiffMargins) {
                inlineDiffMargin.dispose();
            }
            this._zones = [];
            this._zonesMap = {};
            this._inlineDiffMargins = [];
            for (let i = 0, length = newDecorations.zones.length; i < length; i++) {
                const viewZone = newDecorations.zones[i];
                viewZone.suppressMouseDown = true;
                const zoneId = viewChangeAccessor.addZone(viewZone);
                this._zones.push(zoneId);
                this._zonesMap[String(zoneId)] = true;
                if (newDecorations.zones[i].diff && viewZone.marginDomNode) {
                    viewZone.suppressMouseDown = false;
                    if (((_a = newDecorations.zones[i].diff) === null || _a === void 0 ? void 0 : _a.originalModel.getValueLength()) !== 0) {
                        // do not contribute diff margin actions for newly created files
                        this._inlineDiffMargins.push(new InlineDiffMargin(zoneId, viewZone.marginDomNode, editor, newDecorations.zones[i].diff, this._contextMenuService, this._clipboardService));
                    }
                }
            }
        });
        scrollState === null || scrollState === void 0 ? void 0 : scrollState.restore(editor);
        // decorations
        editor.changeDecorations((changeAccessor) => {
            this._decorations = changeAccessor.deltaDecorations(this._decorations, newDecorations.decorations);
        });
        // overview ruler
        overviewRuler === null || overviewRuler === void 0 ? void 0 : overviewRuler.setZones(newDecorations.overviewZones);
    }
}
let DIFF_EDITOR_ID = 0;
const diffInsertIcon = registerIcon('diff-insert', Codicon.add, nls.localize('diffInsertIcon', 'Line decoration for inserts in the diff editor.'));
const diffRemoveIcon = registerIcon('diff-remove', Codicon.remove, nls.localize('diffRemoveIcon', 'Line decoration for removals in the diff editor.'));
const ttPolicy = (_a = window.trustedTypes) === null || _a === void 0 ? void 0 : _a.createPolicy('diffEditorWidget', { createHTML: value => value });
const ariaNavigationTip = nls.localize('diff-aria-navigation-tip', ' use Shift + F7 to navigate changes');
let DiffEditorWidget = class DiffEditorWidget extends Disposable {
    constructor(domElement, options, codeEditorWidgetOptions, clipboardService, contextKeyService, instantiationService, codeEditorService, themeService, notificationService, contextMenuService, _editorProgressService) {
        super();
        this._editorProgressService = _editorProgressService;
        this._onDidDispose = this._register(new Emitter());
        this.onDidDispose = this._onDidDispose.event;
        this._onDidChangeModel = this._register(new Emitter());
        this.onDidChangeModel = this._onDidChangeModel.event;
        this._onDidUpdateDiff = this._register(new Emitter());
        this.onDidUpdateDiff = this._onDidUpdateDiff.event;
        this._onDidContentSizeChange = this._register(new Emitter());
        this._lastOriginalWarning = null;
        this._lastModifiedWarning = null;
        codeEditorService.willCreateDiffEditor();
        this._documentDiffProvider = this._register(instantiationService.createInstance(WorkerBasedDocumentDiffProvider, options));
        this._register(this._documentDiffProvider.onDidChange(e => this._beginUpdateDecorationsSoon()));
        this._codeEditorService = codeEditorService;
        this._contextKeyService = this._register(contextKeyService.createScoped(domElement));
        this._instantiationService = instantiationService.createChild(new ServiceCollection([IContextKeyService, this._contextKeyService]));
        this._contextKeyService.createKey('isInDiffEditor', true);
        this._themeService = themeService;
        this._notificationService = notificationService;
        this._id = (++DIFF_EDITOR_ID);
        this._state = 0 /* editorBrowser.DiffEditorState.Idle */;
        this._updatingDiffProgress = null;
        this._domElement = domElement;
        options = options || {};
        this._options = validateDiffEditorOptions(options, {
            enableSplitViewResizing: true,
            renderSideBySide: true,
            renderMarginRevertIcon: true,
            maxComputationTime: 5000,
            maxFileSize: 50,
            ignoreTrimWhitespace: true,
            renderIndicators: true,
            originalEditable: false,
            diffCodeLens: false,
            renderOverviewRuler: true,
            diffWordWrap: 'inherit',
            diffAlgorithm: 'smart',
        });
        if (typeof options.isInEmbeddedEditor !== 'undefined') {
            this._contextKeyService.createKey('isInEmbeddedDiffEditor', options.isInEmbeddedEditor);
        }
        else {
            this._contextKeyService.createKey('isInEmbeddedDiffEditor', false);
        }
        this._updateDecorationsRunner = this._register(new RunOnceScheduler(() => this._updateDecorations(), 0));
        this._containerDomElement = document.createElement('div');
        this._containerDomElement.className = DiffEditorWidget._getClassName(this._themeService.getColorTheme(), this._options.renderSideBySide);
        this._containerDomElement.style.position = 'relative';
        this._containerDomElement.style.height = '100%';
        this._domElement.appendChild(this._containerDomElement);
        this._overviewViewportDomElement = createFastDomNode(document.createElement('div'));
        this._overviewViewportDomElement.setClassName('diffViewport');
        this._overviewViewportDomElement.setPosition('absolute');
        this._overviewDomElement = document.createElement('div');
        this._overviewDomElement.className = 'diffOverview';
        this._overviewDomElement.style.position = 'absolute';
        this._overviewDomElement.appendChild(this._overviewViewportDomElement.domNode);
        this._register(dom.addStandardDisposableListener(this._overviewDomElement, dom.EventType.POINTER_DOWN, (e) => {
            this._modifiedEditor.delegateVerticalScrollbarPointerDown(e);
        }));
        this._register(dom.addDisposableListener(this._overviewDomElement, dom.EventType.MOUSE_WHEEL, (e) => {
            this._modifiedEditor.delegateScrollFromMouseWheelEvent(e);
        }, { passive: false }));
        if (this._options.renderOverviewRuler) {
            this._containerDomElement.appendChild(this._overviewDomElement);
        }
        // Create left side
        this._originalDomNode = document.createElement('div');
        this._originalDomNode.className = 'editor original';
        this._originalDomNode.style.position = 'absolute';
        this._originalDomNode.style.height = '100%';
        this._containerDomElement.appendChild(this._originalDomNode);
        // Create right side
        this._modifiedDomNode = document.createElement('div');
        this._modifiedDomNode.className = 'editor modified';
        this._modifiedDomNode.style.position = 'absolute';
        this._modifiedDomNode.style.height = '100%';
        this._containerDomElement.appendChild(this._modifiedDomNode);
        this._beginUpdateDecorationsTimeout = -1;
        this._currentlyChangingViewZones = false;
        this._diffComputationToken = 0;
        this._originalEditorState = new VisualEditorState(contextMenuService, clipboardService);
        this._modifiedEditorState = new VisualEditorState(contextMenuService, clipboardService);
        this._isVisible = true;
        this._isHandlingScrollEvent = false;
        this._elementSizeObserver = this._register(new ElementSizeObserver(this._containerDomElement, options.dimension));
        this._register(this._elementSizeObserver.onDidChange(() => this._onDidContainerSizeChanged()));
        if (options.automaticLayout) {
            this._elementSizeObserver.startObserving();
        }
        this._diffComputationResult = null;
        this._originalEditor = this._createLeftHandSideEditor(options, codeEditorWidgetOptions.originalEditor || {});
        this._modifiedEditor = this._createRightHandSideEditor(options, codeEditorWidgetOptions.modifiedEditor || {});
        this._originalOverviewRuler = null;
        this._modifiedOverviewRuler = null;
        this._reviewPane = instantiationService.createInstance(DiffReview, this);
        this._containerDomElement.appendChild(this._reviewPane.domNode.domNode);
        this._containerDomElement.appendChild(this._reviewPane.shadow.domNode);
        this._containerDomElement.appendChild(this._reviewPane.actionBarContainer.domNode);
        if (this._options.renderSideBySide) {
            this._setStrategy(new DiffEditorWidgetSideBySide(this._createDataSource(), this._options.enableSplitViewResizing));
        }
        else {
            this._setStrategy(new DiffEditorWidgetInline(this._createDataSource(), this._options.enableSplitViewResizing));
        }
        this._register(themeService.onDidColorThemeChange(t => {
            if (this._strategy && this._strategy.applyColors(t)) {
                this._updateDecorationsRunner.schedule();
            }
            this._containerDomElement.className = DiffEditorWidget._getClassName(this._themeService.getColorTheme(), this._options.renderSideBySide);
        }));
        const contributions = EditorExtensionsRegistry.getDiffEditorContributions();
        for (const desc of contributions) {
            try {
                this._register(instantiationService.createInstance(desc.ctor, this));
            }
            catch (err) {
                onUnexpectedError(err);
            }
        }
        this._codeEditorService.addDiffEditor(this);
    }
    _setState(newState) {
        if (this._state === newState) {
            return;
        }
        this._state = newState;
        if (this._updatingDiffProgress) {
            this._updatingDiffProgress.done();
            this._updatingDiffProgress = null;
        }
        if (this._state === 1 /* editorBrowser.DiffEditorState.ComputingDiff */) {
            this._updatingDiffProgress = this._editorProgressService.show(true, 1000);
        }
    }
    diffReviewNext() {
        this._reviewPane.next();
    }
    diffReviewPrev() {
        this._reviewPane.prev();
    }
    static _getClassName(theme, renderSideBySide) {
        let result = 'monaco-diff-editor monaco-editor-background ';
        if (renderSideBySide) {
            result += 'side-by-side ';
        }
        result += getThemeTypeSelector(theme.type);
        return result;
    }
    _disposeOverviewRulers() {
        if (this._originalOverviewRuler) {
            this._overviewDomElement.removeChild(this._originalOverviewRuler.getDomNode());
            this._originalOverviewRuler.dispose();
            this._originalOverviewRuler = null;
        }
        if (this._modifiedOverviewRuler) {
            this._overviewDomElement.removeChild(this._modifiedOverviewRuler.getDomNode());
            this._modifiedOverviewRuler.dispose();
            this._modifiedOverviewRuler = null;
        }
    }
    _createOverviewRulers() {
        if (!this._options.renderOverviewRuler) {
            return;
        }
        assert.ok(!this._originalOverviewRuler && !this._modifiedOverviewRuler);
        if (this._originalEditor.hasModel()) {
            this._originalOverviewRuler = this._originalEditor.createOverviewRuler('original diffOverviewRuler');
            this._overviewDomElement.appendChild(this._originalOverviewRuler.getDomNode());
        }
        if (this._modifiedEditor.hasModel()) {
            this._modifiedOverviewRuler = this._modifiedEditor.createOverviewRuler('modified diffOverviewRuler');
            this._overviewDomElement.appendChild(this._modifiedOverviewRuler.getDomNode());
        }
        this._layoutOverviewRulers();
    }
    _createLeftHandSideEditor(options, codeEditorWidgetOptions) {
        const editor = this._createInnerEditor(this._instantiationService, this._originalDomNode, this._adjustOptionsForLeftHandSide(options), codeEditorWidgetOptions);
        this._register(editor.onDidScrollChange((e) => {
            if (this._isHandlingScrollEvent) {
                return;
            }
            if (!e.scrollTopChanged && !e.scrollLeftChanged && !e.scrollHeightChanged) {
                return;
            }
            this._isHandlingScrollEvent = true;
            this._modifiedEditor.setScrollPosition({
                scrollLeft: e.scrollLeft,
                scrollTop: e.scrollTop
            });
            this._isHandlingScrollEvent = false;
            this._layoutOverviewViewport();
        }));
        this._register(editor.onDidChangeViewZones(() => {
            this._onViewZonesChanged();
        }));
        this._register(editor.onDidChangeConfiguration((e) => {
            if (!editor.getModel()) {
                return;
            }
            if (e.hasChanged(48 /* EditorOption.fontInfo */)) {
                this._updateDecorationsRunner.schedule();
            }
            if (e.hasChanged(140 /* EditorOption.wrappingInfo */)) {
                this._updateDecorationsRunner.cancel();
                this._updateDecorations();
            }
        }));
        this._register(editor.onDidChangeHiddenAreas(() => {
            this._updateDecorationsRunner.cancel();
            this._updateDecorations();
        }));
        this._register(editor.onDidChangeModelContent(() => {
            if (this._isVisible) {
                this._beginUpdateDecorationsSoon();
            }
        }));
        const isInDiffLeftEditorKey = this._contextKeyService.createKey('isInDiffLeftEditor', editor.hasWidgetFocus());
        this._register(editor.onDidFocusEditorWidget(() => isInDiffLeftEditorKey.set(true)));
        this._register(editor.onDidBlurEditorWidget(() => isInDiffLeftEditorKey.set(false)));
        this._register(editor.onDidContentSizeChange(e => {
            const width = this._originalEditor.getContentWidth() + this._modifiedEditor.getContentWidth() + DiffEditorWidget.ONE_OVERVIEW_WIDTH;
            const height = Math.max(this._modifiedEditor.getContentHeight(), this._originalEditor.getContentHeight());
            this._onDidContentSizeChange.fire({
                contentHeight: height,
                contentWidth: width,
                contentHeightChanged: e.contentHeightChanged,
                contentWidthChanged: e.contentWidthChanged
            });
        }));
        return editor;
    }
    _createRightHandSideEditor(options, codeEditorWidgetOptions) {
        const editor = this._createInnerEditor(this._instantiationService, this._modifiedDomNode, this._adjustOptionsForRightHandSide(options), codeEditorWidgetOptions);
        this._register(editor.onDidScrollChange((e) => {
            if (this._isHandlingScrollEvent) {
                return;
            }
            if (!e.scrollTopChanged && !e.scrollLeftChanged && !e.scrollHeightChanged) {
                return;
            }
            this._isHandlingScrollEvent = true;
            this._originalEditor.setScrollPosition({
                scrollLeft: e.scrollLeft,
                scrollTop: e.scrollTop
            });
            this._isHandlingScrollEvent = false;
            this._layoutOverviewViewport();
        }));
        this._register(editor.onDidChangeViewZones(() => {
            this._onViewZonesChanged();
        }));
        this._register(editor.onDidChangeConfiguration((e) => {
            if (!editor.getModel()) {
                return;
            }
            if (e.hasChanged(48 /* EditorOption.fontInfo */)) {
                this._updateDecorationsRunner.schedule();
            }
            if (e.hasChanged(140 /* EditorOption.wrappingInfo */)) {
                this._updateDecorationsRunner.cancel();
                this._updateDecorations();
            }
        }));
        this._register(editor.onDidChangeHiddenAreas(() => {
            this._updateDecorationsRunner.cancel();
            this._updateDecorations();
        }));
        this._register(editor.onDidChangeModelContent(() => {
            if (this._isVisible) {
                this._beginUpdateDecorationsSoon();
            }
        }));
        this._register(editor.onDidChangeModelOptions((e) => {
            if (e.tabSize) {
                this._updateDecorationsRunner.schedule();
            }
        }));
        const isInDiffRightEditorKey = this._contextKeyService.createKey('isInDiffRightEditor', editor.hasWidgetFocus());
        this._register(editor.onDidFocusEditorWidget(() => isInDiffRightEditorKey.set(true)));
        this._register(editor.onDidBlurEditorWidget(() => isInDiffRightEditorKey.set(false)));
        this._register(editor.onDidContentSizeChange(e => {
            const width = this._originalEditor.getContentWidth() + this._modifiedEditor.getContentWidth() + DiffEditorWidget.ONE_OVERVIEW_WIDTH;
            const height = Math.max(this._modifiedEditor.getContentHeight(), this._originalEditor.getContentHeight());
            this._onDidContentSizeChange.fire({
                contentHeight: height,
                contentWidth: width,
                contentHeightChanged: e.contentHeightChanged,
                contentWidthChanged: e.contentWidthChanged
            });
        }));
        // Revert change when an arrow is clicked.
        this._register(editor.onMouseDown(event => {
            var _a, _b;
            if (!event.event.rightButton && event.target.position && ((_a = event.target.element) === null || _a === void 0 ? void 0 : _a.className.includes('arrow-revert-change'))) {
                const lineNumber = event.target.position.lineNumber;
                const viewZone = event.target;
                const change = (_b = this._diffComputationResult) === null || _b === void 0 ? void 0 : _b.changes.find(c => 
                // delete change
                (viewZone === null || viewZone === void 0 ? void 0 : viewZone.detail.afterLineNumber) === c.modifiedStartLineNumber ||
                    // other changes
                    (c.modifiedEndLineNumber > 0 && c.modifiedStartLineNumber === lineNumber));
                if (change) {
                    this.revertChange(change);
                }
                event.event.stopPropagation();
                this._updateDecorations();
                return;
            }
        }));
        return editor;
    }
    /**
     * Reverts a change in the modified editor.
     */
    revertChange(change) {
        const editor = this._modifiedEditor;
        const original = this._originalEditor.getModel();
        const modified = this._modifiedEditor.getModel();
        if (!original || !modified || !editor) {
            return;
        }
        const originalRange = change.originalEndLineNumber > 0 ? new Range(change.originalStartLineNumber, 1, change.originalEndLineNumber, original.getLineMaxColumn(change.originalEndLineNumber)) : null;
        const originalContent = originalRange ? original.getValueInRange(originalRange) : null;
        const newRange = change.modifiedEndLineNumber > 0 ? new Range(change.modifiedStartLineNumber, 1, change.modifiedEndLineNumber, modified.getLineMaxColumn(change.modifiedEndLineNumber)) : null;
        const eol = modified.getEOL();
        if (change.originalEndLineNumber === 0 && newRange) {
            // Insert change.
            // To revert: delete the new content and a linebreak (if possible)
            let range = newRange;
            if (change.modifiedStartLineNumber > 1) {
                // Try to include a linebreak from before.
                range = newRange.setStartPosition(change.modifiedStartLineNumber - 1, modified.getLineMaxColumn(change.modifiedStartLineNumber - 1));
            }
            else if (change.modifiedEndLineNumber < modified.getLineCount()) {
                // Try to include the linebreak from after.
                range = newRange.setEndPosition(change.modifiedEndLineNumber + 1, 1);
            }
            editor.executeEdits('diffEditor', [{
                    range,
                    text: '',
                }]);
        }
        else if (change.modifiedEndLineNumber === 0 && originalContent !== null) {
            // Delete change.
            // To revert: insert the old content and a linebreak.
            const insertAt = change.modifiedStartLineNumber < modified.getLineCount() ? new Position(change.modifiedStartLineNumber + 1, 1) : new Position(change.modifiedStartLineNumber, modified.getLineMaxColumn(change.modifiedStartLineNumber));
            editor.executeEdits('diffEditor', [{
                    range: Range.fromPositions(insertAt, insertAt),
                    text: change.modifiedStartLineNumber < modified.getLineCount() ? originalContent + eol : eol + originalContent,
                }]);
        }
        else if (newRange && originalContent !== null) {
            // Modified change.
            editor.executeEdits('diffEditor', [{
                    range: newRange,
                    text: originalContent,
                }]);
        }
    }
    _createInnerEditor(instantiationService, container, options, editorWidgetOptions) {
        return instantiationService.createInstance(CodeEditorWidget, container, options, editorWidgetOptions);
    }
    dispose() {
        this._codeEditorService.removeDiffEditor(this);
        if (this._beginUpdateDecorationsTimeout !== -1) {
            window.clearTimeout(this._beginUpdateDecorationsTimeout);
            this._beginUpdateDecorationsTimeout = -1;
        }
        this._cleanViewZonesAndDecorations();
        if (this._originalOverviewRuler) {
            this._overviewDomElement.removeChild(this._originalOverviewRuler.getDomNode());
            this._originalOverviewRuler.dispose();
        }
        if (this._modifiedOverviewRuler) {
            this._overviewDomElement.removeChild(this._modifiedOverviewRuler.getDomNode());
            this._modifiedOverviewRuler.dispose();
        }
        this._overviewDomElement.removeChild(this._overviewViewportDomElement.domNode);
        if (this._options.renderOverviewRuler) {
            this._containerDomElement.removeChild(this._overviewDomElement);
        }
        this._containerDomElement.removeChild(this._originalDomNode);
        this._originalEditor.dispose();
        this._containerDomElement.removeChild(this._modifiedDomNode);
        this._modifiedEditor.dispose();
        this._strategy.dispose();
        this._containerDomElement.removeChild(this._reviewPane.domNode.domNode);
        this._containerDomElement.removeChild(this._reviewPane.shadow.domNode);
        this._containerDomElement.removeChild(this._reviewPane.actionBarContainer.domNode);
        this._reviewPane.dispose();
        this._domElement.removeChild(this._containerDomElement);
        this._onDidDispose.fire();
        super.dispose();
    }
    //------------ begin IDiffEditor methods
    getId() {
        return this.getEditorType() + ':' + this._id;
    }
    getEditorType() {
        return editorCommon.EditorType.IDiffEditor;
    }
    getLineChanges() {
        if (!this._diffComputationResult) {
            return null;
        }
        return this._diffComputationResult.changes;
    }
    getOriginalEditor() {
        return this._originalEditor;
    }
    getModifiedEditor() {
        return this._modifiedEditor;
    }
    updateOptions(_newOptions) {
        const newOptions = validateDiffEditorOptions(_newOptions, this._options);
        const changed = changedDiffEditorOptions(this._options, newOptions);
        this._options = newOptions;
        const beginUpdateDecorations = (changed.ignoreTrimWhitespace || changed.renderIndicators || changed.renderMarginRevertIcon);
        const beginUpdateDecorationsSoon = (this._isVisible && (changed.maxComputationTime || changed.maxFileSize));
        this._documentDiffProvider.setOptions(newOptions);
        if (beginUpdateDecorations) {
            this._beginUpdateDecorations();
        }
        else if (beginUpdateDecorationsSoon) {
            this._beginUpdateDecorationsSoon();
        }
        this._modifiedEditor.updateOptions(this._adjustOptionsForRightHandSide(_newOptions));
        this._originalEditor.updateOptions(this._adjustOptionsForLeftHandSide(_newOptions));
        // enableSplitViewResizing
        this._strategy.setEnableSplitViewResizing(this._options.enableSplitViewResizing);
        // renderSideBySide
        if (changed.renderSideBySide) {
            if (this._options.renderSideBySide) {
                this._setStrategy(new DiffEditorWidgetSideBySide(this._createDataSource(), this._options.enableSplitViewResizing));
            }
            else {
                this._setStrategy(new DiffEditorWidgetInline(this._createDataSource(), this._options.enableSplitViewResizing));
            }
            // Update class name
            this._containerDomElement.className = DiffEditorWidget._getClassName(this._themeService.getColorTheme(), this._options.renderSideBySide);
        }
        // renderOverviewRuler
        if (changed.renderOverviewRuler) {
            if (this._options.renderOverviewRuler) {
                this._containerDomElement.appendChild(this._overviewDomElement);
            }
            else {
                this._containerDomElement.removeChild(this._overviewDomElement);
            }
        }
    }
    getModel() {
        return {
            original: this._originalEditor.getModel(),
            modified: this._modifiedEditor.getModel()
        };
    }
    setModel(model) {
        // Guard us against partial null model
        if (model && (!model.original || !model.modified)) {
            throw new Error(!model.original ? 'DiffEditorWidget.setModel: Original model is null' : 'DiffEditorWidget.setModel: Modified model is null');
        }
        // Remove all view zones & decorations
        this._cleanViewZonesAndDecorations();
        this._disposeOverviewRulers();
        // Update code editor models
        this._originalEditor.setModel(model ? model.original : null);
        this._modifiedEditor.setModel(model ? model.modified : null);
        this._updateDecorationsRunner.cancel();
        // this.originalEditor.onDidChangeModelOptions
        if (model) {
            this._originalEditor.setScrollTop(0);
            this._modifiedEditor.setScrollTop(0);
        }
        // Disable any diff computations that will come in
        this._diffComputationResult = null;
        this._diffComputationToken++;
        this._setState(0 /* editorBrowser.DiffEditorState.Idle */);
        if (model) {
            this._createOverviewRulers();
            // Begin comparing
            this._beginUpdateDecorations();
        }
        this._layoutOverviewViewport();
        this._onDidChangeModel.fire();
    }
    getContainerDomNode() {
        return this._domElement;
    }
    getVisibleColumnFromPosition(position) {
        return this._modifiedEditor.getVisibleColumnFromPosition(position);
    }
    getPosition() {
        return this._modifiedEditor.getPosition();
    }
    setPosition(position, source = 'api') {
        this._modifiedEditor.setPosition(position, source);
    }
    revealLine(lineNumber, scrollType = 0 /* editorCommon.ScrollType.Smooth */) {
        this._modifiedEditor.revealLine(lineNumber, scrollType);
    }
    revealLineInCenter(lineNumber, scrollType = 0 /* editorCommon.ScrollType.Smooth */) {
        this._modifiedEditor.revealLineInCenter(lineNumber, scrollType);
    }
    revealLineInCenterIfOutsideViewport(lineNumber, scrollType = 0 /* editorCommon.ScrollType.Smooth */) {
        this._modifiedEditor.revealLineInCenterIfOutsideViewport(lineNumber, scrollType);
    }
    revealLineNearTop(lineNumber, scrollType = 0 /* editorCommon.ScrollType.Smooth */) {
        this._modifiedEditor.revealLineNearTop(lineNumber, scrollType);
    }
    revealPosition(position, scrollType = 0 /* editorCommon.ScrollType.Smooth */) {
        this._modifiedEditor.revealPosition(position, scrollType);
    }
    revealPositionInCenter(position, scrollType = 0 /* editorCommon.ScrollType.Smooth */) {
        this._modifiedEditor.revealPositionInCenter(position, scrollType);
    }
    revealPositionInCenterIfOutsideViewport(position, scrollType = 0 /* editorCommon.ScrollType.Smooth */) {
        this._modifiedEditor.revealPositionInCenterIfOutsideViewport(position, scrollType);
    }
    revealPositionNearTop(position, scrollType = 0 /* editorCommon.ScrollType.Smooth */) {
        this._modifiedEditor.revealPositionNearTop(position, scrollType);
    }
    getSelection() {
        return this._modifiedEditor.getSelection();
    }
    getSelections() {
        return this._modifiedEditor.getSelections();
    }
    setSelection(something, source = 'api') {
        this._modifiedEditor.setSelection(something, source);
    }
    setSelections(ranges, source = 'api') {
        this._modifiedEditor.setSelections(ranges, source);
    }
    revealLines(startLineNumber, endLineNumber, scrollType = 0 /* editorCommon.ScrollType.Smooth */) {
        this._modifiedEditor.revealLines(startLineNumber, endLineNumber, scrollType);
    }
    revealLinesInCenter(startLineNumber, endLineNumber, scrollType = 0 /* editorCommon.ScrollType.Smooth */) {
        this._modifiedEditor.revealLinesInCenter(startLineNumber, endLineNumber, scrollType);
    }
    revealLinesInCenterIfOutsideViewport(startLineNumber, endLineNumber, scrollType = 0 /* editorCommon.ScrollType.Smooth */) {
        this._modifiedEditor.revealLinesInCenterIfOutsideViewport(startLineNumber, endLineNumber, scrollType);
    }
    revealLinesNearTop(startLineNumber, endLineNumber, scrollType = 0 /* editorCommon.ScrollType.Smooth */) {
        this._modifiedEditor.revealLinesNearTop(startLineNumber, endLineNumber, scrollType);
    }
    revealRange(range, scrollType = 0 /* editorCommon.ScrollType.Smooth */, revealVerticalInCenter = false, revealHorizontal = true) {
        this._modifiedEditor.revealRange(range, scrollType, revealVerticalInCenter, revealHorizontal);
    }
    revealRangeInCenter(range, scrollType = 0 /* editorCommon.ScrollType.Smooth */) {
        this._modifiedEditor.revealRangeInCenter(range, scrollType);
    }
    revealRangeInCenterIfOutsideViewport(range, scrollType = 0 /* editorCommon.ScrollType.Smooth */) {
        this._modifiedEditor.revealRangeInCenterIfOutsideViewport(range, scrollType);
    }
    revealRangeNearTop(range, scrollType = 0 /* editorCommon.ScrollType.Smooth */) {
        this._modifiedEditor.revealRangeNearTop(range, scrollType);
    }
    revealRangeNearTopIfOutsideViewport(range, scrollType = 0 /* editorCommon.ScrollType.Smooth */) {
        this._modifiedEditor.revealRangeNearTopIfOutsideViewport(range, scrollType);
    }
    revealRangeAtTop(range, scrollType = 0 /* editorCommon.ScrollType.Smooth */) {
        this._modifiedEditor.revealRangeAtTop(range, scrollType);
    }
    getSupportedActions() {
        return this._modifiedEditor.getSupportedActions();
    }
    saveViewState() {
        const originalViewState = this._originalEditor.saveViewState();
        const modifiedViewState = this._modifiedEditor.saveViewState();
        return {
            original: originalViewState,
            modified: modifiedViewState
        };
    }
    restoreViewState(s) {
        if (s && s.original && s.modified) {
            const diffEditorState = s;
            this._originalEditor.restoreViewState(diffEditorState.original);
            this._modifiedEditor.restoreViewState(diffEditorState.modified);
        }
    }
    layout(dimension) {
        this._elementSizeObserver.observe(dimension);
    }
    focus() {
        this._modifiedEditor.focus();
    }
    hasTextFocus() {
        return this._originalEditor.hasTextFocus() || this._modifiedEditor.hasTextFocus();
    }
    trigger(source, handlerId, payload) {
        this._modifiedEditor.trigger(source, handlerId, payload);
    }
    createDecorationsCollection(decorations) {
        return this._modifiedEditor.createDecorationsCollection(decorations);
    }
    changeDecorations(callback) {
        return this._modifiedEditor.changeDecorations(callback);
    }
    //------------ end IDiffEditor methods
    //------------ begin layouting methods
    _onDidContainerSizeChanged() {
        this._doLayout();
    }
    _getReviewHeight() {
        return this._reviewPane.isVisible() ? this._elementSizeObserver.getHeight() : 0;
    }
    _layoutOverviewRulers() {
        if (!this._options.renderOverviewRuler) {
            return;
        }
        if (!this._originalOverviewRuler || !this._modifiedOverviewRuler) {
            return;
        }
        const height = this._elementSizeObserver.getHeight();
        const reviewHeight = this._getReviewHeight();
        const freeSpace = DiffEditorWidget.ENTIRE_DIFF_OVERVIEW_WIDTH - 2 * DiffEditorWidget.ONE_OVERVIEW_WIDTH;
        const layoutInfo = this._modifiedEditor.getLayoutInfo();
        if (layoutInfo) {
            this._originalOverviewRuler.setLayout({
                top: 0,
                width: DiffEditorWidget.ONE_OVERVIEW_WIDTH,
                right: freeSpace + DiffEditorWidget.ONE_OVERVIEW_WIDTH,
                height: (height - reviewHeight)
            });
            this._modifiedOverviewRuler.setLayout({
                top: 0,
                right: 0,
                width: DiffEditorWidget.ONE_OVERVIEW_WIDTH,
                height: (height - reviewHeight)
            });
        }
    }
    //------------ end layouting methods
    _onViewZonesChanged() {
        if (this._currentlyChangingViewZones) {
            return;
        }
        this._updateDecorationsRunner.schedule();
    }
    _beginUpdateDecorationsSoon() {
        // Clear previous timeout if necessary
        if (this._beginUpdateDecorationsTimeout !== -1) {
            window.clearTimeout(this._beginUpdateDecorationsTimeout);
            this._beginUpdateDecorationsTimeout = -1;
        }
        this._beginUpdateDecorationsTimeout = window.setTimeout(() => this._beginUpdateDecorations(), DiffEditorWidget.UPDATE_DIFF_DECORATIONS_DELAY);
    }
    static _equals(a, b) {
        if (!a && !b) {
            return true;
        }
        if (!a || !b) {
            return false;
        }
        return (a.toString() === b.toString());
    }
    _beginUpdateDecorations() {
        if (this._beginUpdateDecorationsTimeout !== -1) {
            // Cancel any pending requests in case this method is called directly
            window.clearTimeout(this._beginUpdateDecorationsTimeout);
            this._beginUpdateDecorationsTimeout = -1;
        }
        const currentOriginalModel = this._originalEditor.getModel();
        const currentModifiedModel = this._modifiedEditor.getModel();
        if (!currentOriginalModel || !currentModifiedModel) {
            return;
        }
        // Prevent old diff requests to come if a new request has been initiated
        // The best method would be to call cancel on the Promise, but this is not
        // yet supported, so using tokens for now.
        this._diffComputationToken++;
        const currentToken = this._diffComputationToken;
        const diffLimit = this._options.maxFileSize * 1024 * 1024; // MB
        const canSyncModelForDiff = (model) => {
            const bufferTextLength = model.getValueLength();
            return (diffLimit === 0 || bufferTextLength <= diffLimit);
        };
        if (!canSyncModelForDiff(currentOriginalModel) || !canSyncModelForDiff(currentModifiedModel)) {
            if (!DiffEditorWidget._equals(currentOriginalModel.uri, this._lastOriginalWarning)
                || !DiffEditorWidget._equals(currentModifiedModel.uri, this._lastModifiedWarning)) {
                this._lastOriginalWarning = currentOriginalModel.uri;
                this._lastModifiedWarning = currentModifiedModel.uri;
                this._notificationService.warn(nls.localize("diff.tooLarge", "Cannot compare files because one file is too large."));
            }
            return;
        }
        this._setState(1 /* editorBrowser.DiffEditorState.ComputingDiff */);
        this._documentDiffProvider.computeDiff(currentOriginalModel, currentModifiedModel, {
            ignoreTrimWhitespace: this._options.ignoreTrimWhitespace,
            maxComputationTimeMs: this._options.maxComputationTime,
        }).then(result => {
            if (currentToken === this._diffComputationToken
                && currentOriginalModel === this._originalEditor.getModel()
                && currentModifiedModel === this._modifiedEditor.getModel()) {
                this._setState(2 /* editorBrowser.DiffEditorState.DiffComputed */);
                this._diffComputationResult = {
                    identical: result.identical,
                    quitEarly: result.quitEarly,
                    changes: result.changes.map(m => {
                        // TODO don't do this translation, but use the diff result directly
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
                    })
                };
                this._updateDecorationsRunner.schedule();
                this._onDidUpdateDiff.fire();
            }
        }, (error) => {
            if (currentToken === this._diffComputationToken
                && currentOriginalModel === this._originalEditor.getModel()
                && currentModifiedModel === this._modifiedEditor.getModel()) {
                this._setState(2 /* editorBrowser.DiffEditorState.DiffComputed */);
                this._diffComputationResult = null;
                this._updateDecorationsRunner.schedule();
            }
        });
    }
    _cleanViewZonesAndDecorations() {
        this._originalEditorState.clean(this._originalEditor);
        this._modifiedEditorState.clean(this._modifiedEditor);
    }
    _updateDecorations() {
        if (!this._originalEditor.getModel() || !this._modifiedEditor.getModel()) {
            return;
        }
        const lineChanges = (this._diffComputationResult ? this._diffComputationResult.changes : []);
        const foreignOriginal = this._originalEditorState.getForeignViewZones(this._originalEditor.getWhitespaces());
        const foreignModified = this._modifiedEditorState.getForeignViewZones(this._modifiedEditor.getWhitespaces());
        const renderMarginRevertIcon = this._options.renderMarginRevertIcon && !this._modifiedEditor.getOption(87 /* EditorOption.readOnly */);
        const diffDecorations = this._strategy.getEditorsDiffDecorations(lineChanges, this._options.ignoreTrimWhitespace, this._options.renderIndicators, renderMarginRevertIcon, foreignOriginal, foreignModified);
        try {
            this._currentlyChangingViewZones = true;
            this._originalEditorState.apply(this._originalEditor, this._originalOverviewRuler, diffDecorations.original, false);
            this._modifiedEditorState.apply(this._modifiedEditor, this._modifiedOverviewRuler, diffDecorations.modified, true);
        }
        finally {
            this._currentlyChangingViewZones = false;
        }
    }
    _adjustOptionsForSubEditor(options) {
        const clonedOptions = Object.assign({}, options);
        clonedOptions.inDiffEditor = true;
        clonedOptions.automaticLayout = false;
        // Clone scrollbar options before changing them
        clonedOptions.scrollbar = Object.assign({}, (clonedOptions.scrollbar || {}));
        clonedOptions.scrollbar.vertical = 'visible';
        clonedOptions.folding = false;
        clonedOptions.codeLens = this._options.diffCodeLens;
        clonedOptions.fixedOverflowWidgets = true;
        // clonedOptions.lineDecorationsWidth = '2ch';
        // Clone minimap options before changing them
        clonedOptions.minimap = Object.assign({}, (clonedOptions.minimap || {}));
        clonedOptions.minimap.enabled = false;
        return clonedOptions;
    }
    _adjustOptionsForLeftHandSide(options) {
        const result = this._adjustOptionsForSubEditor(options);
        if (!this._options.renderSideBySide) {
            // never wrap hidden editor
            result.wordWrapOverride1 = 'off';
            result.wordWrapOverride2 = 'off';
        }
        else {
            result.wordWrapOverride1 = this._options.diffWordWrap;
        }
        if (options.originalAriaLabel) {
            result.ariaLabel = options.originalAriaLabel;
        }
        result.ariaLabel += ariaNavigationTip;
        result.readOnly = !this._options.originalEditable;
        result.dropIntoEditor = { enabled: !result.readOnly };
        result.extraEditorClassName = 'original-in-monaco-diff-editor';
        return Object.assign(Object.assign({}, result), { dimension: {
                height: 0,
                width: 0
            } });
    }
    _adjustOptionsForRightHandSide(options) {
        const result = this._adjustOptionsForSubEditor(options);
        if (options.modifiedAriaLabel) {
            result.ariaLabel = options.modifiedAriaLabel;
        }
        result.ariaLabel += ariaNavigationTip;
        result.wordWrapOverride1 = this._options.diffWordWrap;
        result.revealHorizontalRightPadding = EditorOptions.revealHorizontalRightPadding.defaultValue + DiffEditorWidget.ENTIRE_DIFF_OVERVIEW_WIDTH;
        result.scrollbar.verticalHasArrows = false;
        result.extraEditorClassName = 'modified-in-monaco-diff-editor';
        return Object.assign(Object.assign({}, result), { dimension: {
                height: 0,
                width: 0
            } });
    }
    doLayout() {
        this._elementSizeObserver.observe();
        this._doLayout();
    }
    _doLayout() {
        const width = this._elementSizeObserver.getWidth();
        const height = this._elementSizeObserver.getHeight();
        const reviewHeight = this._getReviewHeight();
        const splitPoint = this._strategy.layout();
        this._originalDomNode.style.width = splitPoint + 'px';
        this._originalDomNode.style.left = '0px';
        this._modifiedDomNode.style.width = (width - splitPoint) + 'px';
        this._modifiedDomNode.style.left = splitPoint + 'px';
        this._overviewDomElement.style.top = '0px';
        this._overviewDomElement.style.height = (height - reviewHeight) + 'px';
        this._overviewDomElement.style.width = DiffEditorWidget.ENTIRE_DIFF_OVERVIEW_WIDTH + 'px';
        this._overviewDomElement.style.left = (width - DiffEditorWidget.ENTIRE_DIFF_OVERVIEW_WIDTH) + 'px';
        this._overviewViewportDomElement.setWidth(DiffEditorWidget.ENTIRE_DIFF_OVERVIEW_WIDTH);
        this._overviewViewportDomElement.setHeight(30);
        this._originalEditor.layout({ width: splitPoint, height: (height - reviewHeight) });
        this._modifiedEditor.layout({ width: width - splitPoint - (this._options.renderOverviewRuler ? DiffEditorWidget.ENTIRE_DIFF_OVERVIEW_WIDTH : 0), height: (height - reviewHeight) });
        if (this._originalOverviewRuler || this._modifiedOverviewRuler) {
            this._layoutOverviewRulers();
        }
        this._reviewPane.layout(height - reviewHeight, width, reviewHeight);
        this._layoutOverviewViewport();
    }
    _layoutOverviewViewport() {
        const layout = this._computeOverviewViewport();
        if (!layout) {
            this._overviewViewportDomElement.setTop(0);
            this._overviewViewportDomElement.setHeight(0);
        }
        else {
            this._overviewViewportDomElement.setTop(layout.top);
            this._overviewViewportDomElement.setHeight(layout.height);
        }
    }
    _computeOverviewViewport() {
        const layoutInfo = this._modifiedEditor.getLayoutInfo();
        if (!layoutInfo) {
            return null;
        }
        const scrollTop = this._modifiedEditor.getScrollTop();
        const scrollHeight = this._modifiedEditor.getScrollHeight();
        const computedAvailableSize = Math.max(0, layoutInfo.height);
        const computedRepresentableSize = Math.max(0, computedAvailableSize - 2 * 0);
        const computedRatio = scrollHeight > 0 ? (computedRepresentableSize / scrollHeight) : 0;
        const computedSliderSize = Math.max(0, Math.floor(layoutInfo.height * computedRatio));
        const computedSliderPosition = Math.floor(scrollTop * computedRatio);
        return {
            height: computedSliderSize,
            top: computedSliderPosition
        };
    }
    _createDataSource() {
        return {
            getWidth: () => {
                return this._elementSizeObserver.getWidth();
            },
            getHeight: () => {
                return (this._elementSizeObserver.getHeight() - this._getReviewHeight());
            },
            getOptions: () => {
                return {
                    renderOverviewRuler: this._options.renderOverviewRuler
                };
            },
            getContainerDomNode: () => {
                return this._containerDomElement;
            },
            relayoutEditors: () => {
                this._doLayout();
            },
            getOriginalEditor: () => {
                return this._originalEditor;
            },
            getModifiedEditor: () => {
                return this._modifiedEditor;
            }
        };
    }
    _setStrategy(newStrategy) {
        var _a;
        (_a = this._strategy) === null || _a === void 0 ? void 0 : _a.dispose();
        this._strategy = newStrategy;
        if (this._boundarySashes) {
            newStrategy.setBoundarySashes(this._boundarySashes);
        }
        newStrategy.applyColors(this._themeService.getColorTheme());
        if (this._diffComputationResult) {
            this._updateDecorations();
        }
        // Just do a layout, the strategy might need it
        this._doLayout();
    }
    _getLineChangeAtOrBeforeLineNumber(lineNumber, startLineNumberExtractor) {
        const lineChanges = (this._diffComputationResult ? this._diffComputationResult.changes : []);
        if (lineChanges.length === 0 || lineNumber < startLineNumberExtractor(lineChanges[0])) {
            // There are no changes or `lineNumber` is before the first change
            return null;
        }
        let min = 0;
        let max = lineChanges.length - 1;
        while (min < max) {
            const mid = Math.floor((min + max) / 2);
            const midStart = startLineNumberExtractor(lineChanges[mid]);
            const midEnd = (mid + 1 <= max ? startLineNumberExtractor(lineChanges[mid + 1]) : 1073741824 /* Constants.MAX_SAFE_SMALL_INTEGER */);
            if (lineNumber < midStart) {
                max = mid - 1;
            }
            else if (lineNumber >= midEnd) {
                min = mid + 1;
            }
            else {
                // HIT!
                min = mid;
                max = mid;
            }
        }
        return lineChanges[min];
    }
    _getEquivalentLineForOriginalLineNumber(lineNumber) {
        const lineChange = this._getLineChangeAtOrBeforeLineNumber(lineNumber, (lineChange) => lineChange.originalStartLineNumber);
        if (!lineChange) {
            return lineNumber;
        }
        const originalEquivalentLineNumber = lineChange.originalStartLineNumber + (lineChange.originalEndLineNumber > 0 ? -1 : 0);
        const modifiedEquivalentLineNumber = lineChange.modifiedStartLineNumber + (lineChange.modifiedEndLineNumber > 0 ? -1 : 0);
        const lineChangeOriginalLength = (lineChange.originalEndLineNumber > 0 ? (lineChange.originalEndLineNumber - lineChange.originalStartLineNumber + 1) : 0);
        const lineChangeModifiedLength = (lineChange.modifiedEndLineNumber > 0 ? (lineChange.modifiedEndLineNumber - lineChange.modifiedStartLineNumber + 1) : 0);
        const delta = lineNumber - originalEquivalentLineNumber;
        if (delta <= lineChangeOriginalLength) {
            return modifiedEquivalentLineNumber + Math.min(delta, lineChangeModifiedLength);
        }
        return modifiedEquivalentLineNumber + lineChangeModifiedLength - lineChangeOriginalLength + delta;
    }
    _getEquivalentLineForModifiedLineNumber(lineNumber) {
        const lineChange = this._getLineChangeAtOrBeforeLineNumber(lineNumber, (lineChange) => lineChange.modifiedStartLineNumber);
        if (!lineChange) {
            return lineNumber;
        }
        const originalEquivalentLineNumber = lineChange.originalStartLineNumber + (lineChange.originalEndLineNumber > 0 ? -1 : 0);
        const modifiedEquivalentLineNumber = lineChange.modifiedStartLineNumber + (lineChange.modifiedEndLineNumber > 0 ? -1 : 0);
        const lineChangeOriginalLength = (lineChange.originalEndLineNumber > 0 ? (lineChange.originalEndLineNumber - lineChange.originalStartLineNumber + 1) : 0);
        const lineChangeModifiedLength = (lineChange.modifiedEndLineNumber > 0 ? (lineChange.modifiedEndLineNumber - lineChange.modifiedStartLineNumber + 1) : 0);
        const delta = lineNumber - modifiedEquivalentLineNumber;
        if (delta <= lineChangeModifiedLength) {
            return originalEquivalentLineNumber + Math.min(delta, lineChangeOriginalLength);
        }
        return originalEquivalentLineNumber + lineChangeOriginalLength - lineChangeModifiedLength + delta;
    }
    getDiffLineInformationForOriginal(lineNumber) {
        if (!this._diffComputationResult) {
            // Cannot answer that which I don't know
            return null;
        }
        return {
            equivalentLineNumber: this._getEquivalentLineForOriginalLineNumber(lineNumber)
        };
    }
    getDiffLineInformationForModified(lineNumber) {
        if (!this._diffComputationResult) {
            // Cannot answer that which I don't know
            return null;
        }
        return {
            equivalentLineNumber: this._getEquivalentLineForModifiedLineNumber(lineNumber)
        };
    }
};
DiffEditorWidget.ONE_OVERVIEW_WIDTH = 15;
DiffEditorWidget.ENTIRE_DIFF_OVERVIEW_WIDTH = 30;
DiffEditorWidget.UPDATE_DIFF_DECORATIONS_DELAY = 200; // ms
DiffEditorWidget = __decorate([
    __param(3, IClipboardService),
    __param(4, IContextKeyService),
    __param(5, IInstantiationService),
    __param(6, ICodeEditorService),
    __param(7, IThemeService),
    __param(8, INotificationService),
    __param(9, IContextMenuService),
    __param(10, IEditorProgressService)
], DiffEditorWidget);
export { DiffEditorWidget };
class DiffEditorWidgetStyle extends Disposable {
    constructor(dataSource) {
        super();
        this._dataSource = dataSource;
        this._insertColor = null;
        this._removeColor = null;
    }
    applyColors(theme) {
        const newInsertColor = theme.getColor(diffOverviewRulerInserted) || (theme.getColor(diffInserted) || defaultInsertColor).transparent(2);
        const newRemoveColor = theme.getColor(diffOverviewRulerRemoved) || (theme.getColor(diffRemoved) || defaultRemoveColor).transparent(2);
        const hasChanges = !newInsertColor.equals(this._insertColor) || !newRemoveColor.equals(this._removeColor);
        this._insertColor = newInsertColor;
        this._removeColor = newRemoveColor;
        return hasChanges;
    }
    getEditorsDiffDecorations(lineChanges, ignoreTrimWhitespace, renderIndicators, renderMarginRevertIcon, originalWhitespaces, modifiedWhitespaces) {
        // Get view zones
        modifiedWhitespaces = modifiedWhitespaces.sort((a, b) => {
            return a.afterLineNumber - b.afterLineNumber;
        });
        originalWhitespaces = originalWhitespaces.sort((a, b) => {
            return a.afterLineNumber - b.afterLineNumber;
        });
        const zones = this._getViewZones(lineChanges, originalWhitespaces, modifiedWhitespaces, renderIndicators);
        // Get decorations & overview ruler zones
        const originalDecorations = this._getOriginalEditorDecorations(zones, lineChanges, ignoreTrimWhitespace, renderIndicators);
        const modifiedDecorations = this._getModifiedEditorDecorations(zones, lineChanges, ignoreTrimWhitespace, renderIndicators, renderMarginRevertIcon);
        return {
            original: {
                decorations: originalDecorations.decorations,
                overviewZones: originalDecorations.overviewZones,
                zones: zones.original
            },
            modified: {
                decorations: modifiedDecorations.decorations,
                overviewZones: modifiedDecorations.overviewZones,
                zones: zones.modified
            }
        };
    }
    setBoundarySashes(_sashes) {
        // To be implemented by subclasses
    }
}
class ForeignViewZonesIterator {
    constructor(source) {
        this._source = source;
        this._index = -1;
        this.current = null;
        this.advance();
    }
    advance() {
        this._index++;
        if (this._index < this._source.length) {
            this.current = this._source[this._index];
        }
        else {
            this.current = null;
        }
    }
}
class ViewZonesComputer {
    constructor(_lineChanges, _originalForeignVZ, _modifiedForeignVZ, _originalEditor, _modifiedEditor) {
        this._lineChanges = _lineChanges;
        this._originalForeignVZ = _originalForeignVZ;
        this._modifiedForeignVZ = _modifiedForeignVZ;
        this._originalEditor = _originalEditor;
        this._modifiedEditor = _modifiedEditor;
    }
    static _getViewLineCount(editor, startLineNumber, endLineNumber) {
        const model = editor.getModel();
        const viewModel = editor._getViewModel();
        if (model && viewModel) {
            const viewRange = getViewRange(model, viewModel, startLineNumber, endLineNumber);
            return (viewRange.endLineNumber - viewRange.startLineNumber + 1);
        }
        return (endLineNumber - startLineNumber + 1);
    }
    getViewZones() {
        const originalLineHeight = this._originalEditor.getOption(64 /* EditorOption.lineHeight */);
        const modifiedLineHeight = this._modifiedEditor.getOption(64 /* EditorOption.lineHeight */);
        const originalHasWrapping = (this._originalEditor.getOption(140 /* EditorOption.wrappingInfo */).wrappingColumn !== -1);
        const modifiedHasWrapping = (this._modifiedEditor.getOption(140 /* EditorOption.wrappingInfo */).wrappingColumn !== -1);
        const hasWrapping = (originalHasWrapping || modifiedHasWrapping);
        const originalModel = this._originalEditor.getModel();
        const originalCoordinatesConverter = this._originalEditor._getViewModel().coordinatesConverter;
        const modifiedCoordinatesConverter = this._modifiedEditor._getViewModel().coordinatesConverter;
        const result = {
            original: [],
            modified: []
        };
        let lineChangeModifiedLength = 0;
        let lineChangeOriginalLength = 0;
        let originalEquivalentLineNumber = 0;
        let modifiedEquivalentLineNumber = 0;
        let originalEndEquivalentLineNumber = 0;
        let modifiedEndEquivalentLineNumber = 0;
        const sortMyViewZones = (a, b) => {
            return a.afterLineNumber - b.afterLineNumber;
        };
        const addAndCombineIfPossible = (destination, item) => {
            if (item.domNode === null && destination.length > 0) {
                const lastItem = destination[destination.length - 1];
                if (lastItem.afterLineNumber === item.afterLineNumber && lastItem.domNode === null) {
                    lastItem.heightInLines += item.heightInLines;
                    return;
                }
            }
            destination.push(item);
        };
        const modifiedForeignVZ = new ForeignViewZonesIterator(this._modifiedForeignVZ);
        const originalForeignVZ = new ForeignViewZonesIterator(this._originalForeignVZ);
        let lastOriginalLineNumber = 1;
        let lastModifiedLineNumber = 1;
        // In order to include foreign view zones after the last line change, the for loop will iterate once more after the end of the `lineChanges` array
        for (let i = 0, length = this._lineChanges.length; i <= length; i++) {
            const lineChange = (i < length ? this._lineChanges[i] : null);
            if (lineChange !== null) {
                originalEquivalentLineNumber = lineChange.originalStartLineNumber + (lineChange.originalEndLineNumber > 0 ? -1 : 0);
                modifiedEquivalentLineNumber = lineChange.modifiedStartLineNumber + (lineChange.modifiedEndLineNumber > 0 ? -1 : 0);
                lineChangeOriginalLength = (lineChange.originalEndLineNumber > 0 ? ViewZonesComputer._getViewLineCount(this._originalEditor, lineChange.originalStartLineNumber, lineChange.originalEndLineNumber) : 0);
                lineChangeModifiedLength = (lineChange.modifiedEndLineNumber > 0 ? ViewZonesComputer._getViewLineCount(this._modifiedEditor, lineChange.modifiedStartLineNumber, lineChange.modifiedEndLineNumber) : 0);
                originalEndEquivalentLineNumber = Math.max(lineChange.originalStartLineNumber, lineChange.originalEndLineNumber);
                modifiedEndEquivalentLineNumber = Math.max(lineChange.modifiedStartLineNumber, lineChange.modifiedEndLineNumber);
            }
            else {
                // Increase to very large value to get the producing tests of foreign view zones running
                originalEquivalentLineNumber += 10000000 + lineChangeOriginalLength;
                modifiedEquivalentLineNumber += 10000000 + lineChangeModifiedLength;
                originalEndEquivalentLineNumber = originalEquivalentLineNumber;
                modifiedEndEquivalentLineNumber = modifiedEquivalentLineNumber;
            }
            // Each step produces view zones, and after producing them, we try to cancel them out, to avoid empty-empty view zone cases
            let stepOriginal = [];
            let stepModified = [];
            // ---------------------------- PRODUCE VIEW ZONES
            // [PRODUCE] View zones due to line mapping differences (equal lines but wrapped differently)
            if (hasWrapping) {
                let count;
                if (lineChange) {
                    if (lineChange.originalEndLineNumber > 0) {
                        count = lineChange.originalStartLineNumber - lastOriginalLineNumber;
                    }
                    else {
                        count = lineChange.modifiedStartLineNumber - lastModifiedLineNumber;
                    }
                }
                else {
                    // `lastOriginalLineNumber` has not been looked at yet
                    count = originalModel.getLineCount() - lastOriginalLineNumber + 1;
                }
                for (let i = 0; i < count; i++) {
                    const originalLineNumber = lastOriginalLineNumber + i;
                    const modifiedLineNumber = lastModifiedLineNumber + i;
                    const originalViewLineCount = originalCoordinatesConverter.getModelLineViewLineCount(originalLineNumber);
                    const modifiedViewLineCount = modifiedCoordinatesConverter.getModelLineViewLineCount(modifiedLineNumber);
                    if (originalViewLineCount < modifiedViewLineCount) {
                        stepOriginal.push({
                            afterLineNumber: originalLineNumber,
                            heightInLines: modifiedViewLineCount - originalViewLineCount,
                            domNode: null,
                            marginDomNode: null
                        });
                    }
                    else if (originalViewLineCount > modifiedViewLineCount) {
                        stepModified.push({
                            afterLineNumber: modifiedLineNumber,
                            heightInLines: originalViewLineCount - modifiedViewLineCount,
                            domNode: null,
                            marginDomNode: null
                        });
                    }
                }
                if (lineChange) {
                    lastOriginalLineNumber = (lineChange.originalEndLineNumber > 0 ? lineChange.originalEndLineNumber : lineChange.originalStartLineNumber) + 1;
                    lastModifiedLineNumber = (lineChange.modifiedEndLineNumber > 0 ? lineChange.modifiedEndLineNumber : lineChange.modifiedStartLineNumber) + 1;
                }
            }
            // [PRODUCE] View zone(s) in original-side due to foreign view zone(s) in modified-side
            while (modifiedForeignVZ.current && modifiedForeignVZ.current.afterLineNumber <= modifiedEndEquivalentLineNumber) {
                let viewZoneLineNumber;
                if (modifiedForeignVZ.current.afterLineNumber <= modifiedEquivalentLineNumber) {
                    viewZoneLineNumber = originalEquivalentLineNumber - modifiedEquivalentLineNumber + modifiedForeignVZ.current.afterLineNumber;
                }
                else {
                    viewZoneLineNumber = originalEndEquivalentLineNumber;
                }
                let marginDomNode = null;
                if (lineChange && lineChange.modifiedStartLineNumber <= modifiedForeignVZ.current.afterLineNumber && modifiedForeignVZ.current.afterLineNumber <= lineChange.modifiedEndLineNumber) {
                    marginDomNode = this._createOriginalMarginDomNodeForModifiedForeignViewZoneInAddedRegion();
                }
                stepOriginal.push({
                    afterLineNumber: viewZoneLineNumber,
                    heightInLines: modifiedForeignVZ.current.height / modifiedLineHeight,
                    domNode: null,
                    marginDomNode: marginDomNode
                });
                modifiedForeignVZ.advance();
            }
            // [PRODUCE] View zone(s) in modified-side due to foreign view zone(s) in original-side
            while (originalForeignVZ.current && originalForeignVZ.current.afterLineNumber <= originalEndEquivalentLineNumber) {
                let viewZoneLineNumber;
                if (originalForeignVZ.current.afterLineNumber <= originalEquivalentLineNumber) {
                    viewZoneLineNumber = modifiedEquivalentLineNumber - originalEquivalentLineNumber + originalForeignVZ.current.afterLineNumber;
                }
                else {
                    viewZoneLineNumber = modifiedEndEquivalentLineNumber;
                }
                stepModified.push({
                    afterLineNumber: viewZoneLineNumber,
                    heightInLines: originalForeignVZ.current.height / originalLineHeight,
                    domNode: null
                });
                originalForeignVZ.advance();
            }
            if (lineChange !== null && isChangeOrInsert(lineChange)) {
                const r = this._produceOriginalFromDiff(lineChange, lineChangeOriginalLength, lineChangeModifiedLength);
                if (r) {
                    stepOriginal.push(r);
                }
            }
            if (lineChange !== null && isChangeOrDelete(lineChange)) {
                const r = this._produceModifiedFromDiff(lineChange, lineChangeOriginalLength, lineChangeModifiedLength);
                if (r) {
                    stepModified.push(r);
                }
            }
            // ---------------------------- END PRODUCE VIEW ZONES
            // ---------------------------- EMIT MINIMAL VIEW ZONES
            // [CANCEL & EMIT] Try to cancel view zones out
            let stepOriginalIndex = 0;
            let stepModifiedIndex = 0;
            stepOriginal = stepOriginal.sort(sortMyViewZones);
            stepModified = stepModified.sort(sortMyViewZones);
            while (stepOriginalIndex < stepOriginal.length && stepModifiedIndex < stepModified.length) {
                const original = stepOriginal[stepOriginalIndex];
                const modified = stepModified[stepModifiedIndex];
                const originalDelta = original.afterLineNumber - originalEquivalentLineNumber;
                const modifiedDelta = modified.afterLineNumber - modifiedEquivalentLineNumber;
                if (originalDelta < modifiedDelta) {
                    addAndCombineIfPossible(result.original, original);
                    stepOriginalIndex++;
                }
                else if (modifiedDelta < originalDelta) {
                    addAndCombineIfPossible(result.modified, modified);
                    stepModifiedIndex++;
                }
                else if (original.shouldNotShrink) {
                    addAndCombineIfPossible(result.original, original);
                    stepOriginalIndex++;
                }
                else if (modified.shouldNotShrink) {
                    addAndCombineIfPossible(result.modified, modified);
                    stepModifiedIndex++;
                }
                else {
                    if (original.heightInLines >= modified.heightInLines) {
                        // modified view zone gets removed
                        original.heightInLines -= modified.heightInLines;
                        stepModifiedIndex++;
                    }
                    else {
                        // original view zone gets removed
                        modified.heightInLines -= original.heightInLines;
                        stepOriginalIndex++;
                    }
                }
            }
            // [EMIT] Remaining original view zones
            while (stepOriginalIndex < stepOriginal.length) {
                addAndCombineIfPossible(result.original, stepOriginal[stepOriginalIndex]);
                stepOriginalIndex++;
            }
            // [EMIT] Remaining modified view zones
            while (stepModifiedIndex < stepModified.length) {
                addAndCombineIfPossible(result.modified, stepModified[stepModifiedIndex]);
                stepModifiedIndex++;
            }
            // ---------------------------- END EMIT MINIMAL VIEW ZONES
        }
        return {
            original: ViewZonesComputer._ensureDomNodes(result.original),
            modified: ViewZonesComputer._ensureDomNodes(result.modified),
        };
    }
    static _ensureDomNodes(zones) {
        return zones.map((z) => {
            if (!z.domNode) {
                z.domNode = createFakeLinesDiv();
            }
            return z;
        });
    }
}
function createDecoration(startLineNumber, startColumn, endLineNumber, endColumn, options) {
    return {
        range: new Range(startLineNumber, startColumn, endLineNumber, endColumn),
        options: options
    };
}
const DECORATIONS = {
    arrowRevertChange: ModelDecorationOptions.register({
        description: 'diff-editor-arrow-revert-change',
        glyphMarginClassName: 'arrow-revert-change ' + ThemeIcon.asClassName(Codicon.arrowRight),
    }),
    charDelete: ModelDecorationOptions.register({
        description: 'diff-editor-char-delete',
        className: 'char-delete'
    }),
    charDeleteWholeLine: ModelDecorationOptions.register({
        description: 'diff-editor-char-delete-whole-line',
        className: 'char-delete',
        isWholeLine: true
    }),
    charInsert: ModelDecorationOptions.register({
        description: 'diff-editor-char-insert',
        className: 'char-insert'
    }),
    charInsertWholeLine: ModelDecorationOptions.register({
        description: 'diff-editor-char-insert-whole-line',
        className: 'char-insert',
        isWholeLine: true
    }),
    lineInsert: ModelDecorationOptions.register({
        description: 'diff-editor-line-insert',
        className: "line-insert" /* DiffEditorLineClasses.Insert */,
        marginClassName: 'gutter-insert',
        isWholeLine: true
    }),
    lineInsertWithSign: ModelDecorationOptions.register({
        description: 'diff-editor-line-insert-with-sign',
        className: "line-insert" /* DiffEditorLineClasses.Insert */,
        linesDecorationsClassName: 'insert-sign ' + ThemeIcon.asClassName(diffInsertIcon),
        marginClassName: 'gutter-insert',
        isWholeLine: true
    }),
    lineDelete: ModelDecorationOptions.register({
        description: 'diff-editor-line-delete',
        className: "line-delete" /* DiffEditorLineClasses.Delete */,
        marginClassName: 'gutter-delete',
        isWholeLine: true
    }),
    lineDeleteWithSign: ModelDecorationOptions.register({
        description: 'diff-editor-line-delete-with-sign',
        className: "line-delete" /* DiffEditorLineClasses.Delete */,
        linesDecorationsClassName: 'delete-sign ' + ThemeIcon.asClassName(diffRemoveIcon),
        marginClassName: 'gutter-delete',
        isWholeLine: true
    }),
    lineDeleteMargin: ModelDecorationOptions.register({
        description: 'diff-editor-line-delete-margin',
        marginClassName: 'gutter-delete',
    })
};
class DiffEditorWidgetSideBySide extends DiffEditorWidgetStyle {
    constructor(dataSource, enableSplitViewResizing) {
        super(dataSource);
        this._disableSash = (enableSplitViewResizing === false);
        this._sashRatio = null;
        this._sashPosition = null;
        this._startSashPosition = null;
        this._sash = this._register(new Sash(this._dataSource.getContainerDomNode(), this, { orientation: 0 /* Orientation.VERTICAL */ }));
        if (this._disableSash) {
            this._sash.state = 0 /* SashState.Disabled */;
        }
        this._sash.onDidStart(() => this._onSashDragStart());
        this._sash.onDidChange((e) => this._onSashDrag(e));
        this._sash.onDidEnd(() => this._onSashDragEnd());
        this._sash.onDidReset(() => this._onSashReset());
    }
    setEnableSplitViewResizing(enableSplitViewResizing) {
        const newDisableSash = (enableSplitViewResizing === false);
        if (this._disableSash !== newDisableSash) {
            this._disableSash = newDisableSash;
            this._sash.state = this._disableSash ? 0 /* SashState.Disabled */ : 3 /* SashState.Enabled */;
        }
    }
    layout(sashRatio = this._sashRatio) {
        const w = this._dataSource.getWidth();
        const contentWidth = w - (this._dataSource.getOptions().renderOverviewRuler ? DiffEditorWidget.ENTIRE_DIFF_OVERVIEW_WIDTH : 0);
        let sashPosition = Math.floor((sashRatio || 0.5) * contentWidth);
        const midPoint = Math.floor(0.5 * contentWidth);
        sashPosition = this._disableSash ? midPoint : sashPosition || midPoint;
        if (contentWidth > DiffEditorWidgetSideBySide.MINIMUM_EDITOR_WIDTH * 2) {
            if (sashPosition < DiffEditorWidgetSideBySide.MINIMUM_EDITOR_WIDTH) {
                sashPosition = DiffEditorWidgetSideBySide.MINIMUM_EDITOR_WIDTH;
            }
            if (sashPosition > contentWidth - DiffEditorWidgetSideBySide.MINIMUM_EDITOR_WIDTH) {
                sashPosition = contentWidth - DiffEditorWidgetSideBySide.MINIMUM_EDITOR_WIDTH;
            }
        }
        else {
            sashPosition = midPoint;
        }
        if (this._sashPosition !== sashPosition) {
            this._sashPosition = sashPosition;
        }
        this._sash.layout();
        return this._sashPosition;
    }
    _onSashDragStart() {
        this._startSashPosition = this._sashPosition;
    }
    _onSashDrag(e) {
        const w = this._dataSource.getWidth();
        const contentWidth = w - (this._dataSource.getOptions().renderOverviewRuler ? DiffEditorWidget.ENTIRE_DIFF_OVERVIEW_WIDTH : 0);
        const sashPosition = this.layout((this._startSashPosition + (e.currentX - e.startX)) / contentWidth);
        this._sashRatio = sashPosition / contentWidth;
        this._dataSource.relayoutEditors();
    }
    _onSashDragEnd() {
        this._sash.layout();
    }
    _onSashReset() {
        this._sashRatio = 0.5;
        this._dataSource.relayoutEditors();
        this._sash.layout();
    }
    getVerticalSashTop(sash) {
        return 0;
    }
    getVerticalSashLeft(sash) {
        return this._sashPosition;
    }
    getVerticalSashHeight(sash) {
        return this._dataSource.getHeight();
    }
    setBoundarySashes(sashes) {
        this._sash.orthogonalEndSash = sashes.bottom;
    }
    _getViewZones(lineChanges, originalForeignVZ, modifiedForeignVZ) {
        const originalEditor = this._dataSource.getOriginalEditor();
        const modifiedEditor = this._dataSource.getModifiedEditor();
        const c = new SideBySideViewZonesComputer(lineChanges, originalForeignVZ, modifiedForeignVZ, originalEditor, modifiedEditor);
        return c.getViewZones();
    }
    _getOriginalEditorDecorations(zones, lineChanges, ignoreTrimWhitespace, renderIndicators) {
        const originalEditor = this._dataSource.getOriginalEditor();
        const overviewZoneColor = String(this._removeColor);
        const result = {
            decorations: [],
            overviewZones: []
        };
        const originalModel = originalEditor.getModel();
        const originalViewModel = originalEditor._getViewModel();
        for (const lineChange of lineChanges) {
            if (isChangeOrDelete(lineChange)) {
                result.decorations.push({
                    range: new Range(lineChange.originalStartLineNumber, 1, lineChange.originalEndLineNumber, 1073741824 /* Constants.MAX_SAFE_SMALL_INTEGER */),
                    options: (renderIndicators ? DECORATIONS.lineDeleteWithSign : DECORATIONS.lineDelete)
                });
                if (!isChangeOrInsert(lineChange) || !lineChange.charChanges) {
                    result.decorations.push(createDecoration(lineChange.originalStartLineNumber, 1, lineChange.originalEndLineNumber, 1073741824 /* Constants.MAX_SAFE_SMALL_INTEGER */, DECORATIONS.charDeleteWholeLine));
                }
                const viewRange = getViewRange(originalModel, originalViewModel, lineChange.originalStartLineNumber, lineChange.originalEndLineNumber);
                result.overviewZones.push(new OverviewRulerZone(viewRange.startLineNumber, viewRange.endLineNumber, /*use endLineNumber*/ 0, overviewZoneColor));
                if (lineChange.charChanges) {
                    for (const charChange of lineChange.charChanges) {
                        if (isCharChangeOrDelete(charChange)) {
                            if (ignoreTrimWhitespace) {
                                for (let lineNumber = charChange.originalStartLineNumber; lineNumber <= charChange.originalEndLineNumber; lineNumber++) {
                                    let startColumn;
                                    let endColumn;
                                    if (lineNumber === charChange.originalStartLineNumber) {
                                        startColumn = charChange.originalStartColumn;
                                    }
                                    else {
                                        startColumn = originalModel.getLineFirstNonWhitespaceColumn(lineNumber);
                                    }
                                    if (lineNumber === charChange.originalEndLineNumber) {
                                        endColumn = charChange.originalEndColumn;
                                    }
                                    else {
                                        endColumn = originalModel.getLineLastNonWhitespaceColumn(lineNumber);
                                    }
                                    result.decorations.push(createDecoration(lineNumber, startColumn, lineNumber, endColumn, DECORATIONS.charDelete));
                                }
                            }
                            else {
                                result.decorations.push(createDecoration(charChange.originalStartLineNumber, charChange.originalStartColumn, charChange.originalEndLineNumber, charChange.originalEndColumn, DECORATIONS.charDelete));
                            }
                        }
                    }
                }
            }
        }
        return result;
    }
    _getModifiedEditorDecorations(zones, lineChanges, ignoreTrimWhitespace, renderIndicators, renderMarginRevertIcon) {
        const modifiedEditor = this._dataSource.getModifiedEditor();
        const overviewZoneColor = String(this._insertColor);
        const result = {
            decorations: [],
            overviewZones: []
        };
        const modifiedModel = modifiedEditor.getModel();
        const modifiedViewModel = modifiedEditor._getViewModel();
        for (const lineChange of lineChanges) {
            // Arrows for reverting changes.
            if (renderMarginRevertIcon) {
                if (lineChange.modifiedEndLineNumber > 0) {
                    result.decorations.push({
                        range: new Range(lineChange.modifiedStartLineNumber, 1, lineChange.modifiedStartLineNumber, 1),
                        options: DECORATIONS.arrowRevertChange
                    });
                }
                else {
                    const viewZone = zones.modified.find(z => z.afterLineNumber === lineChange.modifiedStartLineNumber);
                    if (viewZone) {
                        viewZone.marginDomNode = createViewZoneMarginArrow();
                    }
                }
            }
            if (isChangeOrInsert(lineChange)) {
                result.decorations.push({
                    range: new Range(lineChange.modifiedStartLineNumber, 1, lineChange.modifiedEndLineNumber, 1073741824 /* Constants.MAX_SAFE_SMALL_INTEGER */),
                    options: (renderIndicators ? DECORATIONS.lineInsertWithSign : DECORATIONS.lineInsert)
                });
                if (!isChangeOrDelete(lineChange) || !lineChange.charChanges) {
                    result.decorations.push(createDecoration(lineChange.modifiedStartLineNumber, 1, lineChange.modifiedEndLineNumber, 1073741824 /* Constants.MAX_SAFE_SMALL_INTEGER */, DECORATIONS.charInsertWholeLine));
                }
                const viewRange = getViewRange(modifiedModel, modifiedViewModel, lineChange.modifiedStartLineNumber, lineChange.modifiedEndLineNumber);
                result.overviewZones.push(new OverviewRulerZone(viewRange.startLineNumber, viewRange.endLineNumber, /*use endLineNumber*/ 0, overviewZoneColor));
                if (lineChange.charChanges) {
                    for (const charChange of lineChange.charChanges) {
                        if (isCharChangeOrInsert(charChange)) {
                            if (ignoreTrimWhitespace) {
                                for (let lineNumber = charChange.modifiedStartLineNumber; lineNumber <= charChange.modifiedEndLineNumber; lineNumber++) {
                                    let startColumn;
                                    let endColumn;
                                    if (lineNumber === charChange.modifiedStartLineNumber) {
                                        startColumn = charChange.modifiedStartColumn;
                                    }
                                    else {
                                        startColumn = modifiedModel.getLineFirstNonWhitespaceColumn(lineNumber);
                                    }
                                    if (lineNumber === charChange.modifiedEndLineNumber) {
                                        endColumn = charChange.modifiedEndColumn;
                                    }
                                    else {
                                        endColumn = modifiedModel.getLineLastNonWhitespaceColumn(lineNumber);
                                    }
                                    result.decorations.push(createDecoration(lineNumber, startColumn, lineNumber, endColumn, DECORATIONS.charInsert));
                                }
                            }
                            else {
                                result.decorations.push(createDecoration(charChange.modifiedStartLineNumber, charChange.modifiedStartColumn, charChange.modifiedEndLineNumber, charChange.modifiedEndColumn, DECORATIONS.charInsert));
                            }
                        }
                    }
                }
            }
        }
        return result;
    }
}
DiffEditorWidgetSideBySide.MINIMUM_EDITOR_WIDTH = 100;
class SideBySideViewZonesComputer extends ViewZonesComputer {
    constructor(lineChanges, originalForeignVZ, modifiedForeignVZ, originalEditor, modifiedEditor) {
        super(lineChanges, originalForeignVZ, modifiedForeignVZ, originalEditor, modifiedEditor);
    }
    _createOriginalMarginDomNodeForModifiedForeignViewZoneInAddedRegion() {
        return null;
    }
    _produceOriginalFromDiff(lineChange, lineChangeOriginalLength, lineChangeModifiedLength) {
        if (lineChangeModifiedLength > lineChangeOriginalLength) {
            return {
                afterLineNumber: Math.max(lineChange.originalStartLineNumber, lineChange.originalEndLineNumber),
                heightInLines: (lineChangeModifiedLength - lineChangeOriginalLength),
                domNode: null
            };
        }
        return null;
    }
    _produceModifiedFromDiff(lineChange, lineChangeOriginalLength, lineChangeModifiedLength) {
        if (lineChangeOriginalLength > lineChangeModifiedLength) {
            return {
                afterLineNumber: Math.max(lineChange.modifiedStartLineNumber, lineChange.modifiedEndLineNumber),
                heightInLines: (lineChangeOriginalLength - lineChangeModifiedLength),
                domNode: null
            };
        }
        return null;
    }
}
class DiffEditorWidgetInline extends DiffEditorWidgetStyle {
    constructor(dataSource, enableSplitViewResizing) {
        super(dataSource);
        this._decorationsLeft = dataSource.getOriginalEditor().getLayoutInfo().decorationsLeft;
        this._register(dataSource.getOriginalEditor().onDidLayoutChange((layoutInfo) => {
            if (this._decorationsLeft !== layoutInfo.decorationsLeft) {
                this._decorationsLeft = layoutInfo.decorationsLeft;
                dataSource.relayoutEditors();
            }
        }));
    }
    setEnableSplitViewResizing(enableSplitViewResizing) {
        // Nothing to do..
    }
    _getViewZones(lineChanges, originalForeignVZ, modifiedForeignVZ, renderIndicators) {
        const originalEditor = this._dataSource.getOriginalEditor();
        const modifiedEditor = this._dataSource.getModifiedEditor();
        const computer = new InlineViewZonesComputer(lineChanges, originalForeignVZ, modifiedForeignVZ, originalEditor, modifiedEditor, renderIndicators);
        return computer.getViewZones();
    }
    _getOriginalEditorDecorations(zones, lineChanges, ignoreTrimWhitespace, renderIndicators) {
        const overviewZoneColor = String(this._removeColor);
        const result = {
            decorations: [],
            overviewZones: []
        };
        const originalEditor = this._dataSource.getOriginalEditor();
        const originalModel = originalEditor.getModel();
        const originalViewModel = originalEditor._getViewModel();
        let zoneIndex = 0;
        for (const lineChange of lineChanges) {
            // Add overview zones in the overview ruler
            if (isChangeOrDelete(lineChange)) {
                result.decorations.push({
                    range: new Range(lineChange.originalStartLineNumber, 1, lineChange.originalEndLineNumber, 1073741824 /* Constants.MAX_SAFE_SMALL_INTEGER */),
                    options: DECORATIONS.lineDeleteMargin
                });
                while (zoneIndex < zones.modified.length) {
                    const zone = zones.modified[zoneIndex];
                    if (zone.diff && zone.diff.originalStartLineNumber >= lineChange.originalStartLineNumber) {
                        break;
                    }
                    zoneIndex++;
                }
                let zoneHeightInLines = 0;
                if (zoneIndex < zones.modified.length) {
                    const zone = zones.modified[zoneIndex];
                    if (zone.diff
                        && zone.diff.originalStartLineNumber === lineChange.originalStartLineNumber
                        && zone.diff.originalEndLineNumber === lineChange.originalEndLineNumber
                        && zone.diff.modifiedStartLineNumber === lineChange.modifiedStartLineNumber
                        && zone.diff.modifiedEndLineNumber === lineChange.modifiedEndLineNumber) {
                        zoneHeightInLines = zone.heightInLines;
                    }
                }
                const viewRange = getViewRange(originalModel, originalViewModel, lineChange.originalStartLineNumber, lineChange.originalEndLineNumber);
                result.overviewZones.push(new OverviewRulerZone(viewRange.startLineNumber, viewRange.endLineNumber, zoneHeightInLines, overviewZoneColor));
            }
        }
        return result;
    }
    _getModifiedEditorDecorations(zones, lineChanges, ignoreTrimWhitespace, renderIndicators, renderMarginRevertIcon) {
        const modifiedEditor = this._dataSource.getModifiedEditor();
        const overviewZoneColor = String(this._insertColor);
        const result = {
            decorations: [],
            overviewZones: []
        };
        const modifiedModel = modifiedEditor.getModel();
        const modifiedViewModel = modifiedEditor._getViewModel();
        for (const lineChange of lineChanges) {
            // Add decorations & overview zones
            if (isChangeOrInsert(lineChange)) {
                result.decorations.push({
                    range: new Range(lineChange.modifiedStartLineNumber, 1, lineChange.modifiedEndLineNumber, 1073741824 /* Constants.MAX_SAFE_SMALL_INTEGER */),
                    options: (renderIndicators ? DECORATIONS.lineInsertWithSign : DECORATIONS.lineInsert)
                });
                const viewRange = getViewRange(modifiedModel, modifiedViewModel, lineChange.modifiedStartLineNumber, lineChange.modifiedEndLineNumber);
                result.overviewZones.push(new OverviewRulerZone(viewRange.startLineNumber, viewRange.endLineNumber, /*use endLineNumber*/ 0, overviewZoneColor));
                if (lineChange.charChanges) {
                    for (const charChange of lineChange.charChanges) {
                        if (isCharChangeOrInsert(charChange)) {
                            if (ignoreTrimWhitespace) {
                                for (let lineNumber = charChange.modifiedStartLineNumber; lineNumber <= charChange.modifiedEndLineNumber; lineNumber++) {
                                    let startColumn;
                                    let endColumn;
                                    if (lineNumber === charChange.modifiedStartLineNumber) {
                                        startColumn = charChange.modifiedStartColumn;
                                    }
                                    else {
                                        startColumn = modifiedModel.getLineFirstNonWhitespaceColumn(lineNumber);
                                    }
                                    if (lineNumber === charChange.modifiedEndLineNumber) {
                                        endColumn = charChange.modifiedEndColumn;
                                    }
                                    else {
                                        endColumn = modifiedModel.getLineLastNonWhitespaceColumn(lineNumber);
                                    }
                                    result.decorations.push(createDecoration(lineNumber, startColumn, lineNumber, endColumn, DECORATIONS.charInsert));
                                }
                            }
                            else {
                                result.decorations.push(createDecoration(charChange.modifiedStartLineNumber, charChange.modifiedStartColumn, charChange.modifiedEndLineNumber, charChange.modifiedEndColumn, DECORATIONS.charInsert));
                            }
                        }
                    }
                }
                else {
                    result.decorations.push(createDecoration(lineChange.modifiedStartLineNumber, 1, lineChange.modifiedEndLineNumber, 1073741824 /* Constants.MAX_SAFE_SMALL_INTEGER */, DECORATIONS.charInsertWholeLine));
                }
            }
        }
        return result;
    }
    layout() {
        // An editor should not be smaller than 5px
        return Math.max(5, this._decorationsLeft);
    }
}
class InlineViewZonesComputer extends ViewZonesComputer {
    constructor(lineChanges, originalForeignVZ, modifiedForeignVZ, originalEditor, modifiedEditor, renderIndicators) {
        super(lineChanges, originalForeignVZ, modifiedForeignVZ, originalEditor, modifiedEditor);
        this._originalModel = originalEditor.getModel();
        this._renderIndicators = renderIndicators;
        this._pendingLineChange = [];
        this._pendingViewZones = [];
        this._lineBreaksComputer = this._modifiedEditor._getViewModel().createLineBreaksComputer();
    }
    getViewZones() {
        const result = super.getViewZones();
        this._finalize(result);
        return result;
    }
    _createOriginalMarginDomNodeForModifiedForeignViewZoneInAddedRegion() {
        const result = document.createElement('div');
        result.className = 'inline-added-margin-view-zone';
        return result;
    }
    _produceOriginalFromDiff(lineChange, lineChangeOriginalLength, lineChangeModifiedLength) {
        const marginDomNode = document.createElement('div');
        marginDomNode.className = 'inline-added-margin-view-zone';
        return {
            afterLineNumber: Math.max(lineChange.originalStartLineNumber, lineChange.originalEndLineNumber),
            heightInLines: lineChangeModifiedLength,
            domNode: document.createElement('div'),
            marginDomNode: marginDomNode
        };
    }
    _produceModifiedFromDiff(lineChange, lineChangeOriginalLength, lineChangeModifiedLength) {
        const domNode = document.createElement('div');
        domNode.className = `view-lines line-delete ${MOUSE_CURSOR_TEXT_CSS_CLASS_NAME}`;
        const marginDomNode = document.createElement('div');
        marginDomNode.className = 'inline-deleted-margin-view-zone';
        const viewZone = {
            shouldNotShrink: true,
            afterLineNumber: (lineChange.modifiedEndLineNumber === 0 ? lineChange.modifiedStartLineNumber : lineChange.modifiedStartLineNumber - 1),
            heightInLines: lineChangeOriginalLength,
            minWidthInPx: 0,
            domNode: domNode,
            marginDomNode: marginDomNode,
            diff: {
                originalStartLineNumber: lineChange.originalStartLineNumber,
                originalEndLineNumber: lineChange.originalEndLineNumber,
                modifiedStartLineNumber: lineChange.modifiedStartLineNumber,
                modifiedEndLineNumber: lineChange.modifiedEndLineNumber,
                originalModel: this._originalModel,
                viewLineCounts: null,
            }
        };
        for (let lineNumber = lineChange.originalStartLineNumber; lineNumber <= lineChange.originalEndLineNumber; lineNumber++) {
            this._lineBreaksComputer.addRequest(this._originalModel.getLineContent(lineNumber), null, null);
        }
        this._pendingLineChange.push(lineChange);
        this._pendingViewZones.push(viewZone);
        return viewZone;
    }
    _finalize(result) {
        const modifiedEditorOptions = this._modifiedEditor.getOptions();
        const tabSize = this._modifiedEditor.getModel().getOptions().tabSize;
        const fontInfo = modifiedEditorOptions.get(48 /* EditorOption.fontInfo */);
        const disableMonospaceOptimizations = modifiedEditorOptions.get(31 /* EditorOption.disableMonospaceOptimizations */);
        const typicalHalfwidthCharacterWidth = fontInfo.typicalHalfwidthCharacterWidth;
        const scrollBeyondLastColumn = modifiedEditorOptions.get(99 /* EditorOption.scrollBeyondLastColumn */);
        const mightContainNonBasicASCII = this._originalModel.mightContainNonBasicASCII();
        const mightContainRTL = this._originalModel.mightContainRTL();
        const lineHeight = modifiedEditorOptions.get(64 /* EditorOption.lineHeight */);
        const layoutInfo = modifiedEditorOptions.get(139 /* EditorOption.layoutInfo */);
        const lineDecorationsWidth = layoutInfo.decorationsWidth;
        const stopRenderingLineAfter = modifiedEditorOptions.get(112 /* EditorOption.stopRenderingLineAfter */);
        const renderWhitespace = modifiedEditorOptions.get(94 /* EditorOption.renderWhitespace */);
        const renderControlCharacters = modifiedEditorOptions.get(89 /* EditorOption.renderControlCharacters */);
        const fontLigatures = modifiedEditorOptions.get(49 /* EditorOption.fontLigatures */);
        const lineBreaks = this._lineBreaksComputer.finalize();
        let lineBreakIndex = 0;
        for (let i = 0; i < this._pendingLineChange.length; i++) {
            const lineChange = this._pendingLineChange[i];
            const viewZone = this._pendingViewZones[i];
            const domNode = viewZone.domNode;
            applyFontInfo(domNode, fontInfo);
            const marginDomNode = viewZone.marginDomNode;
            applyFontInfo(marginDomNode, fontInfo);
            const decorations = [];
            if (lineChange.charChanges) {
                for (const charChange of lineChange.charChanges) {
                    if (isCharChangeOrDelete(charChange)) {
                        decorations.push(new InlineDecoration(new Range(charChange.originalStartLineNumber, charChange.originalStartColumn, charChange.originalEndLineNumber, charChange.originalEndColumn), 'char-delete', 0 /* InlineDecorationType.Regular */));
                    }
                }
            }
            const hasCharChanges = (decorations.length > 0);
            const sb = new StringBuilder(10000);
            let maxCharsPerLine = 0;
            let renderedLineCount = 0;
            let viewLineCounts = null;
            for (let lineNumber = lineChange.originalStartLineNumber; lineNumber <= lineChange.originalEndLineNumber; lineNumber++) {
                const lineIndex = lineNumber - lineChange.originalStartLineNumber;
                const lineTokens = this._originalModel.tokenization.getLineTokens(lineNumber);
                const lineContent = lineTokens.getLineContent();
                const lineBreakData = lineBreaks[lineBreakIndex++];
                const actualDecorations = LineDecoration.filter(decorations, lineNumber, 1, lineContent.length + 1);
                if (lineBreakData) {
                    let lastBreakOffset = 0;
                    for (const breakOffset of lineBreakData.breakOffsets) {
                        const viewLineTokens = lineTokens.sliceAndInflate(lastBreakOffset, breakOffset, 0);
                        const viewLineContent = lineContent.substring(lastBreakOffset, breakOffset);
                        maxCharsPerLine = Math.max(maxCharsPerLine, this._renderOriginalLine(renderedLineCount++, viewLineContent, viewLineTokens, LineDecoration.extractWrapped(actualDecorations, lastBreakOffset, breakOffset), hasCharChanges, mightContainNonBasicASCII, mightContainRTL, fontInfo, disableMonospaceOptimizations, lineHeight, lineDecorationsWidth, stopRenderingLineAfter, renderWhitespace, renderControlCharacters, fontLigatures, tabSize, sb, marginDomNode));
                        lastBreakOffset = breakOffset;
                    }
                    if (!viewLineCounts) {
                        viewLineCounts = [];
                    }
                    // make sure all lines before this one have an entry in `viewLineCounts`
                    while (viewLineCounts.length < lineIndex) {
                        viewLineCounts[viewLineCounts.length] = 1;
                    }
                    viewLineCounts[lineIndex] = lineBreakData.breakOffsets.length;
                    viewZone.heightInLines += (lineBreakData.breakOffsets.length - 1);
                    const marginDomNode2 = document.createElement('div');
                    marginDomNode2.className = 'gutter-delete';
                    result.original.push({
                        afterLineNumber: lineNumber,
                        afterColumn: 0,
                        heightInLines: lineBreakData.breakOffsets.length - 1,
                        domNode: createFakeLinesDiv(),
                        marginDomNode: marginDomNode2
                    });
                }
                else {
                    maxCharsPerLine = Math.max(maxCharsPerLine, this._renderOriginalLine(renderedLineCount++, lineContent, lineTokens, actualDecorations, hasCharChanges, mightContainNonBasicASCII, mightContainRTL, fontInfo, disableMonospaceOptimizations, lineHeight, lineDecorationsWidth, stopRenderingLineAfter, renderWhitespace, renderControlCharacters, fontLigatures, tabSize, sb, marginDomNode));
                }
            }
            maxCharsPerLine += scrollBeyondLastColumn;
            const html = sb.build();
            const trustedhtml = ttPolicy ? ttPolicy.createHTML(html) : html;
            domNode.innerHTML = trustedhtml;
            viewZone.minWidthInPx = (maxCharsPerLine * typicalHalfwidthCharacterWidth);
            if (viewLineCounts) {
                // make sure all lines have an entry in `viewLineCounts`
                const cnt = lineChange.originalEndLineNumber - lineChange.originalStartLineNumber;
                while (viewLineCounts.length <= cnt) {
                    viewLineCounts[viewLineCounts.length] = 1;
                }
            }
            viewZone.diff.viewLineCounts = viewLineCounts;
        }
        result.original.sort((a, b) => {
            return a.afterLineNumber - b.afterLineNumber;
        });
    }
    _renderOriginalLine(renderedLineCount, lineContent, lineTokens, decorations, hasCharChanges, mightContainNonBasicASCII, mightContainRTL, fontInfo, disableMonospaceOptimizations, lineHeight, lineDecorationsWidth, stopRenderingLineAfter, renderWhitespace, renderControlCharacters, fontLigatures, tabSize, sb, marginDomNode) {
        sb.appendString('<div class="view-line');
        if (!hasCharChanges) {
            // No char changes
            sb.appendString(' char-delete');
        }
        sb.appendString('" style="top:');
        sb.appendString(String(renderedLineCount * lineHeight));
        sb.appendString('px;width:1000000px;">');
        const isBasicASCII = ViewLineRenderingData.isBasicASCII(lineContent, mightContainNonBasicASCII);
        const containsRTL = ViewLineRenderingData.containsRTL(lineContent, isBasicASCII, mightContainRTL);
        const output = renderViewLine(new RenderLineInput((fontInfo.isMonospace && !disableMonospaceOptimizations), fontInfo.canUseHalfwidthRightwardsArrow, lineContent, false, isBasicASCII, containsRTL, 0, lineTokens, decorations, tabSize, 0, fontInfo.spaceWidth, fontInfo.middotWidth, fontInfo.wsmiddotWidth, stopRenderingLineAfter, renderWhitespace, renderControlCharacters, fontLigatures !== EditorFontLigatures.OFF, null // Send no selections, original line cannot be selected
        ), sb);
        sb.appendString('</div>');
        if (this._renderIndicators) {
            const marginElement = document.createElement('div');
            marginElement.className = `delete-sign ${ThemeIcon.asClassName(diffRemoveIcon)}`;
            marginElement.setAttribute('style', `position:absolute;top:${renderedLineCount * lineHeight}px;width:${lineDecorationsWidth}px;height:${lineHeight}px;right:0;`);
            marginDomNode.appendChild(marginElement);
        }
        return output.characterMapping.getHorizontalOffset(output.characterMapping.length);
    }
}
function validateDiffWordWrap(value, defaultValue) {
    return validateStringSetOption(value, defaultValue, ['off', 'on', 'inherit']);
}
function isChangeOrInsert(lineChange) {
    return lineChange.modifiedEndLineNumber > 0;
}
function isChangeOrDelete(lineChange) {
    return lineChange.originalEndLineNumber > 0;
}
function isCharChangeOrInsert(charChange) {
    if (charChange.modifiedStartLineNumber === charChange.modifiedEndLineNumber) {
        return charChange.modifiedEndColumn - charChange.modifiedStartColumn > 0;
    }
    return charChange.modifiedEndLineNumber - charChange.modifiedStartLineNumber > 0;
}
function isCharChangeOrDelete(charChange) {
    if (charChange.originalStartLineNumber === charChange.originalEndLineNumber) {
        return charChange.originalEndColumn - charChange.originalStartColumn > 0;
    }
    return charChange.originalEndLineNumber - charChange.originalStartLineNumber > 0;
}
function createFakeLinesDiv() {
    const r = document.createElement('div');
    r.className = 'diagonal-fill';
    return r;
}
function createViewZoneMarginArrow() {
    const arrow = document.createElement('div');
    arrow.className = 'arrow-revert-change ' + ThemeIcon.asClassName(Codicon.arrowRight);
    return dom.$('div', {}, arrow);
}
function getViewRange(model, viewModel, startLineNumber, endLineNumber) {
    const lineCount = model.getLineCount();
    startLineNumber = Math.min(lineCount, Math.max(1, startLineNumber));
    endLineNumber = Math.min(lineCount, Math.max(1, endLineNumber));
    return viewModel.coordinatesConverter.convertModelRangeToViewRange(new Range(startLineNumber, model.getLineMinColumn(startLineNumber), endLineNumber, model.getLineMaxColumn(endLineNumber)));
}
function validateDiffEditorOptions(options, defaults) {
    return {
        enableSplitViewResizing: validateBooleanOption(options.enableSplitViewResizing, defaults.enableSplitViewResizing),
        renderSideBySide: validateBooleanOption(options.renderSideBySide, defaults.renderSideBySide),
        renderMarginRevertIcon: validateBooleanOption(options.renderMarginRevertIcon, defaults.renderMarginRevertIcon),
        maxComputationTime: clampedInt(options.maxComputationTime, defaults.maxComputationTime, 0, 1073741824 /* Constants.MAX_SAFE_SMALL_INTEGER */),
        maxFileSize: clampedInt(options.maxFileSize, defaults.maxFileSize, 0, 1073741824 /* Constants.MAX_SAFE_SMALL_INTEGER */),
        ignoreTrimWhitespace: validateBooleanOption(options.ignoreTrimWhitespace, defaults.ignoreTrimWhitespace),
        renderIndicators: validateBooleanOption(options.renderIndicators, defaults.renderIndicators),
        originalEditable: validateBooleanOption(options.originalEditable, defaults.originalEditable),
        diffCodeLens: validateBooleanOption(options.diffCodeLens, defaults.diffCodeLens),
        renderOverviewRuler: validateBooleanOption(options.renderOverviewRuler, defaults.renderOverviewRuler),
        diffWordWrap: validateDiffWordWrap(options.diffWordWrap, defaults.diffWordWrap),
        diffAlgorithm: validateStringSetOption(options.diffAlgorithm, defaults.diffAlgorithm, ['smart', 'experimental']),
    };
}
function changedDiffEditorOptions(a, b) {
    return {
        enableSplitViewResizing: (a.enableSplitViewResizing !== b.enableSplitViewResizing),
        renderSideBySide: (a.renderSideBySide !== b.renderSideBySide),
        renderMarginRevertIcon: (a.renderMarginRevertIcon !== b.renderMarginRevertIcon),
        maxComputationTime: (a.maxComputationTime !== b.maxComputationTime),
        maxFileSize: (a.maxFileSize !== b.maxFileSize),
        ignoreTrimWhitespace: (a.ignoreTrimWhitespace !== b.ignoreTrimWhitespace),
        renderIndicators: (a.renderIndicators !== b.renderIndicators),
        originalEditable: (a.originalEditable !== b.originalEditable),
        diffCodeLens: (a.diffCodeLens !== b.diffCodeLens),
        renderOverviewRuler: (a.renderOverviewRuler !== b.renderOverviewRuler),
        diffWordWrap: (a.diffWordWrap !== b.diffWordWrap),
        diffAlgorithm: (a.diffAlgorithm !== b.diffAlgorithm),
    };
}
registerThemingParticipant((theme, collector) => {
    const diffDiagonalFillColor = theme.getColor(diffDiagonalFill);
    collector.addRule(`
	.monaco-editor .diagonal-fill {
		background-image: linear-gradient(
			-45deg,
			${diffDiagonalFillColor} 12.5%,
			#0000 12.5%, #0000 50%,
			${diffDiagonalFillColor} 50%, ${diffDiagonalFillColor} 62.5%,
			#0000 62.5%, #0000 100%
		);
		background-size: 8px 8px;
	}
	`);
});
