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
import { $ } from '../../../../base/browser/dom.js';
import { ArrayQueue } from '../../../../base/common/arrays.js';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { derived, observableFromEvent, observableValue } from '../../../../base/common/observable.js';
import { autorun, autorunWithStore2 } from '../../../../base/common/observableImpl/autorun.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { assertIsDefined } from '../../../../base/common/types.js';
import { applyFontInfo } from '../../config/domFontInfo.js';
import { StableEditorScrollState } from '../../stableEditorScroll.js';
import { diffDeleteDecoration, diffRemoveIcon } from './decorations.js';
import { DiffMapping } from './diffEditorViewModel.js';
import { InlineDiffDeletedCodeMargin } from './inlineDiffDeletedCodeMargin.js';
import { LineSource, RenderOptions, renderLines } from './renderLines.js';
import { animatedObservable, joinCombine } from './utils.js';
import { LineRange } from '../../../common/core/lineRange.js';
import { Position } from '../../../common/core/position.js';
import { InlineDecoration } from '../../../common/viewModel.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
/**
 * Ensures both editors have the same height by aligning unchanged lines.
 * In inline view mode, inserts viewzones to show deleted code from the original text model in the modified code editor.
 * Synchronizes scrolling.
 */
export let ViewZoneManager = class ViewZoneManager extends Disposable {
    constructor(_editors, _diffModel, _options, _diffEditorWidget, _canIgnoreViewZoneUpdateEvent, _clipboardService, _contextMenuService) {
        super();
        this._editors = _editors;
        this._diffModel = _diffModel;
        this._options = _options;
        this._diffEditorWidget = _diffEditorWidget;
        this._canIgnoreViewZoneUpdateEvent = _canIgnoreViewZoneUpdateEvent;
        this._clipboardService = _clipboardService;
        this._contextMenuService = _contextMenuService;
        this._originalTopPadding = observableValue('originalTopPadding', 0);
        this._originalScrollOffset = observableValue('originalScrollOffset', 0);
        this._originalScrollOffsetAnimated = animatedObservable(this._originalScrollOffset, this._store);
        this._modifiedTopPadding = observableValue('modifiedTopPadding', 0);
        this._modifiedScrollOffset = observableValue('modifiedScrollOffset', 0);
        this._modifiedScrollOffsetAnimated = animatedObservable(this._modifiedScrollOffset, this._store);
        let isChangingViewZones = false;
        const state = observableValue('state', 0);
        const updateImmediately = this._register(new RunOnceScheduler(() => {
            state.set(state.get() + 1, undefined);
        }, 0));
        this._register(this._editors.original.onDidChangeViewZones((args) => { if (!isChangingViewZones && !this._canIgnoreViewZoneUpdateEvent()) {
            updateImmediately.schedule();
        } }));
        this._register(this._editors.modified.onDidChangeViewZones((args) => { if (!isChangingViewZones && !this._canIgnoreViewZoneUpdateEvent()) {
            updateImmediately.schedule();
        } }));
        this._register(this._editors.original.onDidChangeConfiguration((args) => { if (args.hasChanged(142 /* EditorOption.wrappingInfo */)) {
            updateImmediately.schedule();
        } }));
        this._register(this._editors.modified.onDidChangeConfiguration((args) => { if (args.hasChanged(142 /* EditorOption.wrappingInfo */)) {
            updateImmediately.schedule();
        } }));
        const originalModelTokenizationCompleted = this._diffModel.map(m => m ? observableFromEvent(m.model.original.onDidChangeTokens, () => m.model.original.tokenization.backgroundTokenizationState === 2 /* BackgroundTokenizationState.Completed */) : undefined).map((m, reader) => m === null || m === void 0 ? void 0 : m.read(reader));
        const alignmentViewZoneIdsOrig = new Set();
        const alignmentViewZoneIdsMod = new Set();
        const alignments = derived('alignments', (reader) => {
            const diffModel = this._diffModel.read(reader);
            const diff = diffModel === null || diffModel === void 0 ? void 0 : diffModel.diff.read(reader);
            if (!diffModel || !diff) {
                return null;
            }
            state.read(reader);
            return computeRangeAlignment(this._editors.original, this._editors.modified, diff.mappings, alignmentViewZoneIdsOrig, alignmentViewZoneIdsMod);
        });
        const alignmentsSyncedMovedText = derived('alignments', (reader) => {
            var _a;
            const syncedMovedText = (_a = this._diffModel.read(reader)) === null || _a === void 0 ? void 0 : _a.syncedMovedTexts.read(reader);
            if (!syncedMovedText) {
                return null;
            }
            state.read(reader);
            const mappings = syncedMovedText.changes.map(c => new DiffMapping(c));
            // TODO dont include alignments outside syncedMovedText
            return computeRangeAlignment(this._editors.original, this._editors.modified, mappings, alignmentViewZoneIdsOrig, alignmentViewZoneIdsMod);
        });
        function createFakeLinesDiv() {
            const r = document.createElement('div');
            r.className = 'diagonal-fill';
            return r;
        }
        const alignmentViewZonesDisposables = this._register(new DisposableStore());
        const alignmentViewZones = derived('alignment viewzones', (reader) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            alignmentViewZonesDisposables.clear();
            const alignmentsVal = alignments.read(reader) || [];
            const origViewZones = [];
            const modViewZones = [];
            const modifiedTopPaddingVal = this._modifiedTopPadding.read(reader);
            if (modifiedTopPaddingVal > 0) {
                modViewZones.push({
                    afterLineNumber: 0,
                    domNode: document.createElement('div'),
                    heightInPx: modifiedTopPaddingVal,
                    showInHiddenAreas: true,
                });
            }
            const originalTopPaddingVal = this._originalTopPadding.read(reader);
            if (originalTopPaddingVal > 0) {
                origViewZones.push({
                    afterLineNumber: 0,
                    domNode: document.createElement('div'),
                    heightInPx: originalTopPaddingVal,
                    showInHiddenAreas: true,
                });
            }
            const renderSideBySide = this._options.renderSideBySide.read(reader);
            const deletedCodeLineBreaksComputer = !renderSideBySide ? (_a = this._editors.modified._getViewModel()) === null || _a === void 0 ? void 0 : _a.createLineBreaksComputer() : undefined;
            if (deletedCodeLineBreaksComputer) {
                for (const a of alignmentsVal) {
                    if (a.diff) {
                        for (let i = a.originalRange.startLineNumber; i < a.originalRange.endLineNumberExclusive; i++) {
                            deletedCodeLineBreaksComputer === null || deletedCodeLineBreaksComputer === void 0 ? void 0 : deletedCodeLineBreaksComputer.addRequest(this._editors.original.getModel().getLineContent(i), null, null);
                        }
                    }
                }
            }
            const lineBreakData = (_b = deletedCodeLineBreaksComputer === null || deletedCodeLineBreaksComputer === void 0 ? void 0 : deletedCodeLineBreaksComputer.finalize()) !== null && _b !== void 0 ? _b : [];
            let lineBreakDataIdx = 0;
            const modLineHeight = this._editors.modified.getOption(64 /* EditorOption.lineHeight */);
            const syncedMovedText = (_c = this._diffModel.read(reader)) === null || _c === void 0 ? void 0 : _c.syncedMovedTexts.read(reader);
            const mightContainNonBasicASCII = (_e = (_d = this._editors.original.getModel()) === null || _d === void 0 ? void 0 : _d.mightContainNonBasicASCII()) !== null && _e !== void 0 ? _e : false;
            const mightContainRTL = (_g = (_f = this._editors.original.getModel()) === null || _f === void 0 ? void 0 : _f.mightContainRTL()) !== null && _g !== void 0 ? _g : false;
            const renderOptions = RenderOptions.fromEditor(this._editors.modified);
            for (const a of alignmentsVal) {
                if (a.diff && !renderSideBySide) {
                    if (!a.originalRange.isEmpty) {
                        originalModelTokenizationCompleted.read(reader); // Update view-zones once tokenization completes
                        const deletedCodeDomNode = document.createElement('div');
                        deletedCodeDomNode.classList.add('view-lines', 'line-delete', 'monaco-mouse-cursor-text');
                        const source = new LineSource(a.originalRange.mapToLineArray(l => this._editors.original.getModel().tokenization.getLineTokens(l)), a.originalRange.mapToLineArray(_ => lineBreakData[lineBreakDataIdx++]), mightContainNonBasicASCII, mightContainRTL);
                        const decorations = [];
                        for (const i of a.diff.innerChanges || []) {
                            decorations.push(new InlineDecoration(i.originalRange.delta(-(a.diff.originalRange.startLineNumber - 1)), diffDeleteDecoration.className, 0 /* InlineDecorationType.Regular */));
                        }
                        const result = renderLines(source, renderOptions, decorations, deletedCodeDomNode);
                        const marginDomNode = document.createElement('div');
                        marginDomNode.className = 'inline-deleted-margin-view-zone';
                        applyFontInfo(marginDomNode, renderOptions.fontInfo);
                        if (this._options.renderIndicators.read(reader)) {
                            for (let i = 0; i < result.heightInLines; i++) {
                                const marginElement = document.createElement('div');
                                marginElement.className = `delete-sign ${ThemeIcon.asClassName(diffRemoveIcon)}`;
                                marginElement.setAttribute('style', `position:absolute;top:${i * modLineHeight}px;width:${renderOptions.lineDecorationsWidth}px;height:${modLineHeight}px;right:0;`);
                                marginDomNode.appendChild(marginElement);
                            }
                        }
                        let zoneId = undefined;
                        alignmentViewZonesDisposables.add(new InlineDiffDeletedCodeMargin(() => assertIsDefined(zoneId), marginDomNode, this._editors.modified, a.diff, this._diffEditorWidget, result.viewLineCounts, this._editors.original.getModel(), this._contextMenuService, this._clipboardService));
                        for (let i = 0; i < result.viewLineCounts.length; i++) {
                            const count = result.viewLineCounts[i];
                            // Account for wrapped lines in the (collapsed) original editor (which doesn't wrap lines).
                            if (count > 1) {
                                origViewZones.push({
                                    afterLineNumber: a.originalRange.startLineNumber + i,
                                    domNode: createFakeLinesDiv(),
                                    heightInPx: (count - 1) * modLineHeight,
                                    showInHiddenAreas: true,
                                });
                            }
                        }
                        modViewZones.push({
                            afterLineNumber: a.modifiedRange.startLineNumber - 1,
                            domNode: deletedCodeDomNode,
                            heightInPx: result.heightInLines * modLineHeight,
                            minWidthInPx: result.minWidthInPx,
                            marginDomNode,
                            setZoneId(id) { zoneId = id; },
                            showInHiddenAreas: true,
                        });
                    }
                    const marginDomNode = document.createElement('div');
                    marginDomNode.className = 'gutter-delete';
                    origViewZones.push({
                        afterLineNumber: a.originalRange.endLineNumberExclusive - 1,
                        domNode: createFakeLinesDiv(),
                        heightInPx: a.modifiedHeightInPx,
                        marginDomNode,
                        showInHiddenAreas: true,
                    });
                }
                else {
                    const delta = a.modifiedHeightInPx - a.originalHeightInPx;
                    if (delta > 0) {
                        if (syncedMovedText === null || syncedMovedText === void 0 ? void 0 : syncedMovedText.lineRangeMapping.originalRange.contains(a.originalRange.endLineNumberExclusive - 1)) {
                            continue;
                        }
                        origViewZones.push({
                            afterLineNumber: a.originalRange.endLineNumberExclusive - 1,
                            domNode: createFakeLinesDiv(),
                            heightInPx: delta,
                            showInHiddenAreas: true,
                        });
                    }
                    else {
                        if (syncedMovedText === null || syncedMovedText === void 0 ? void 0 : syncedMovedText.lineRangeMapping.modifiedRange.contains(a.modifiedRange.endLineNumberExclusive - 1)) {
                            continue;
                        }
                        function createViewZoneMarginArrow() {
                            const arrow = document.createElement('div');
                            arrow.className = 'arrow-revert-change ' + ThemeIcon.asClassName(Codicon.arrowRight);
                            return $('div', {}, arrow);
                        }
                        let marginDomNode = undefined;
                        if (a.diff && a.diff.modifiedRange.isEmpty && this._options.shouldRenderRevertArrows.read(reader)) {
                            marginDomNode = createViewZoneMarginArrow();
                        }
                        modViewZones.push({
                            afterLineNumber: a.modifiedRange.endLineNumberExclusive - 1,
                            domNode: createFakeLinesDiv(),
                            heightInPx: -delta,
                            marginDomNode,
                            showInHiddenAreas: true,
                        });
                    }
                }
            }
            for (const a of (_h = alignmentsSyncedMovedText.read(reader)) !== null && _h !== void 0 ? _h : []) {
                if (!(syncedMovedText === null || syncedMovedText === void 0 ? void 0 : syncedMovedText.lineRangeMapping.originalRange.intersect(a.originalRange))
                    && !(syncedMovedText === null || syncedMovedText === void 0 ? void 0 : syncedMovedText.lineRangeMapping.modifiedRange.intersect(a.modifiedRange))) {
                    // ignore unrelated alignments outside the synced moved text
                    continue;
                }
                const delta = a.modifiedHeightInPx - a.originalHeightInPx;
                if (delta > 0) {
                    origViewZones.push({
                        afterLineNumber: a.originalRange.endLineNumberExclusive - 1,
                        domNode: createFakeLinesDiv(),
                        heightInPx: delta,
                        showInHiddenAreas: true,
                    });
                }
                else {
                    modViewZones.push({
                        afterLineNumber: a.modifiedRange.endLineNumberExclusive - 1,
                        domNode: createFakeLinesDiv(),
                        heightInPx: -delta,
                        showInHiddenAreas: true,
                    });
                }
            }
            return { orig: origViewZones, mod: modViewZones };
        });
        this._register(autorunWithStore2('alignment viewzones', (reader) => {
            const scrollState = StableEditorScrollState.capture(this._editors.modified);
            const alignmentViewZones_ = alignmentViewZones.read(reader);
            isChangingViewZones = true;
            this._editors.original.changeViewZones((aOrig) => {
                for (const id of alignmentViewZoneIdsOrig) {
                    aOrig.removeZone(id);
                }
                alignmentViewZoneIdsOrig.clear();
                for (const z of alignmentViewZones_.orig) {
                    const id = aOrig.addZone(z);
                    if (z.setZoneId) {
                        z.setZoneId(id);
                    }
                    alignmentViewZoneIdsOrig.add(id);
                }
            });
            this._editors.modified.changeViewZones(aMod => {
                for (const id of alignmentViewZoneIdsMod) {
                    aMod.removeZone(id);
                }
                alignmentViewZoneIdsMod.clear();
                for (const z of alignmentViewZones_.mod) {
                    const id = aMod.addZone(z);
                    if (z.setZoneId) {
                        z.setZoneId(id);
                    }
                    alignmentViewZoneIdsMod.add(id);
                }
            });
            isChangingViewZones = false;
            scrollState.restore(this._editors.modified);
        }));
        let ignoreChange = false;
        this._register(this._editors.original.onDidScrollChange(e => {
            if (e.scrollLeftChanged && !ignoreChange) {
                ignoreChange = true;
                this._editors.modified.setScrollLeft(e.scrollLeft);
                ignoreChange = false;
            }
        }));
        this._register(this._editors.modified.onDidScrollChange(e => {
            if (e.scrollLeftChanged && !ignoreChange) {
                ignoreChange = true;
                this._editors.original.setScrollLeft(e.scrollLeft);
                ignoreChange = false;
            }
        }));
        this._originalScrollTop = observableFromEvent(this._editors.original.onDidScrollChange, () => this._editors.original.getScrollTop());
        this._modifiedScrollTop = observableFromEvent(this._editors.modified.onDidScrollChange, () => this._editors.modified.getScrollTop());
        // origExtraHeight + origOffset - origScrollTop = modExtraHeight + modOffset - modScrollTop
        // origScrollTop = origExtraHeight + origOffset - modExtraHeight - modOffset + modScrollTop
        // modScrollTop = modExtraHeight + modOffset - origExtraHeight - origOffset + origScrollTop
        // origOffset - modOffset = heightOfLines(1..Y) - heightOfLines(1..X)
        // origScrollTop >= 0, modScrollTop >= 0
        this._register(autorun('update scroll modified', (reader) => {
            const newScrollTopModified = this._originalScrollTop.read(reader)
                - (this._originalScrollOffsetAnimated.get() - this._modifiedScrollOffsetAnimated.read(reader))
                - (this._originalTopPadding.get() - this._modifiedTopPadding.read(reader));
            if (newScrollTopModified !== this._editors.modified.getScrollTop()) {
                this._editors.modified.setScrollTop(newScrollTopModified, 1 /* ScrollType.Immediate */);
            }
        }));
        this._register(autorun('update scroll original', (reader) => {
            const newScrollTopOriginal = this._modifiedScrollTop.read(reader)
                - (this._modifiedScrollOffsetAnimated.get() - this._originalScrollOffsetAnimated.read(reader))
                - (this._modifiedTopPadding.get() - this._originalTopPadding.read(reader));
            if (newScrollTopOriginal !== this._editors.original.getScrollTop()) {
                this._editors.original.setScrollTop(newScrollTopOriginal, 1 /* ScrollType.Immediate */);
            }
        }));
        this._register(autorun('update', reader => {
            var _a;
            const m = (_a = this._diffModel.read(reader)) === null || _a === void 0 ? void 0 : _a.syncedMovedTexts.read(reader);
            let deltaOrigToMod = 0;
            if (m) {
                const trueTopOriginal = this._editors.original.getTopForLineNumber(m.lineRangeMapping.originalRange.startLineNumber, true) - this._originalTopPadding.get();
                const trueTopModified = this._editors.modified.getTopForLineNumber(m.lineRangeMapping.modifiedRange.startLineNumber, true) - this._modifiedTopPadding.get();
                deltaOrigToMod = trueTopModified - trueTopOriginal;
            }
            if (deltaOrigToMod > 0) {
                this._modifiedTopPadding.set(0, undefined);
                this._originalTopPadding.set(deltaOrigToMod, undefined);
            }
            else if (deltaOrigToMod < 0) {
                this._modifiedTopPadding.set(-deltaOrigToMod, undefined);
                this._originalTopPadding.set(0, undefined);
            }
            else {
                setTimeout(() => {
                    this._modifiedTopPadding.set(0, undefined);
                    this._originalTopPadding.set(0, undefined);
                }, 400);
            }
            if (this._editors.modified.hasTextFocus()) {
                this._originalScrollOffset.set(this._modifiedScrollOffset.get() - deltaOrigToMod, undefined, true);
            }
            else {
                this._modifiedScrollOffset.set(this._originalScrollOffset.get() + deltaOrigToMod, undefined, true);
            }
        }));
    }
};
ViewZoneManager = __decorate([
    __param(5, IClipboardService),
    __param(6, IContextMenuService)
], ViewZoneManager);
function computeRangeAlignment(originalEditor, modifiedEditor, diffs, originalEditorAlignmentViewZones, modifiedEditorAlignmentViewZones) {
    var _a, _b, _c, _d;
    const originalLineHeightOverrides = new ArrayQueue(getAdditionalLineHeights(originalEditor, originalEditorAlignmentViewZones));
    const modifiedLineHeightOverrides = new ArrayQueue(getAdditionalLineHeights(modifiedEditor, modifiedEditorAlignmentViewZones));
    const origLineHeight = originalEditor.getOption(64 /* EditorOption.lineHeight */);
    const modLineHeight = modifiedEditor.getOption(64 /* EditorOption.lineHeight */);
    const result = [];
    let lastOriginalLineNumber = 0;
    let lastModifiedLineNumber = 0;
    function handleAlignmentsOutsideOfDiffs(untilOriginalLineNumberExclusive, untilModifiedLineNumberExclusive) {
        while (true) {
            let origNext = originalLineHeightOverrides.peek();
            let modNext = modifiedLineHeightOverrides.peek();
            if (origNext && origNext.lineNumber >= untilOriginalLineNumberExclusive) {
                origNext = undefined;
            }
            if (modNext && modNext.lineNumber >= untilModifiedLineNumberExclusive) {
                modNext = undefined;
            }
            if (!origNext && !modNext) {
                break;
            }
            const distOrig = origNext ? origNext.lineNumber - lastOriginalLineNumber : Number.MAX_VALUE;
            const distNext = modNext ? modNext.lineNumber - lastModifiedLineNumber : Number.MAX_VALUE;
            if (distOrig < distNext) {
                originalLineHeightOverrides.dequeue();
                modNext = {
                    lineNumber: origNext.lineNumber - lastOriginalLineNumber + lastModifiedLineNumber,
                    heightInPx: 0,
                };
            }
            else if (distOrig > distNext) {
                modifiedLineHeightOverrides.dequeue();
                origNext = {
                    lineNumber: modNext.lineNumber - lastModifiedLineNumber + lastOriginalLineNumber,
                    heightInPx: 0,
                };
            }
            else {
                originalLineHeightOverrides.dequeue();
                modifiedLineHeightOverrides.dequeue();
            }
            result.push({
                originalRange: LineRange.ofLength(origNext.lineNumber, 1),
                modifiedRange: LineRange.ofLength(modNext.lineNumber, 1),
                originalHeightInPx: origLineHeight + origNext.heightInPx,
                modifiedHeightInPx: modLineHeight + modNext.heightInPx,
                diff: undefined,
            });
        }
    }
    for (const m of diffs) {
        const c = m.lineRangeMapping;
        handleAlignmentsOutsideOfDiffs(c.originalRange.startLineNumber, c.modifiedRange.startLineNumber);
        const originalAdditionalHeight = (_b = (_a = originalLineHeightOverrides
            .takeWhile(v => v.lineNumber < c.originalRange.endLineNumberExclusive)) === null || _a === void 0 ? void 0 : _a.reduce((p, c) => p + c.heightInPx, 0)) !== null && _b !== void 0 ? _b : 0;
        const modifiedAdditionalHeight = (_d = (_c = modifiedLineHeightOverrides
            .takeWhile(v => v.lineNumber < c.modifiedRange.endLineNumberExclusive)) === null || _c === void 0 ? void 0 : _c.reduce((p, c) => p + c.heightInPx, 0)) !== null && _d !== void 0 ? _d : 0;
        result.push({
            originalRange: c.originalRange,
            modifiedRange: c.modifiedRange,
            originalHeightInPx: c.originalRange.length * origLineHeight + originalAdditionalHeight,
            modifiedHeightInPx: c.modifiedRange.length * modLineHeight + modifiedAdditionalHeight,
            diff: m.lineRangeMapping,
        });
        lastOriginalLineNumber = c.originalRange.endLineNumberExclusive;
        lastModifiedLineNumber = c.modifiedRange.endLineNumberExclusive;
    }
    handleAlignmentsOutsideOfDiffs(Number.MAX_VALUE, Number.MAX_VALUE);
    return result;
}
function getAdditionalLineHeights(editor, viewZonesToIgnore) {
    const viewZoneHeights = [];
    const wrappingZoneHeights = [];
    const hasWrapping = editor.getOption(142 /* EditorOption.wrappingInfo */).wrappingColumn !== -1;
    const coordinatesConverter = editor._getViewModel().coordinatesConverter;
    const editorLineHeight = editor.getOption(64 /* EditorOption.lineHeight */);
    if (hasWrapping) {
        for (let i = 1; i <= editor.getModel().getLineCount(); i++) {
            const lineCount = coordinatesConverter.getModelLineViewLineCount(i);
            if (lineCount > 1) {
                wrappingZoneHeights.push({ lineNumber: i, heightInPx: editorLineHeight * (lineCount - 1) });
            }
        }
    }
    for (const w of editor.getWhitespaces()) {
        if (viewZonesToIgnore.has(w.id)) {
            continue;
        }
        const modelLineNumber = w.afterLineNumber === 0 ? 0 : coordinatesConverter.convertViewPositionToModelPosition(new Position(w.afterLineNumber, 1)).lineNumber;
        viewZoneHeights.push({ lineNumber: modelLineNumber, heightInPx: w.height });
    }
    const result = joinCombine(viewZoneHeights, wrappingZoneHeights, v => v.lineNumber, (v1, v2) => ({ lineNumber: v1.lineNumber, heightInPx: v1.heightInPx + v2.heightInPx }));
    return result;
}
