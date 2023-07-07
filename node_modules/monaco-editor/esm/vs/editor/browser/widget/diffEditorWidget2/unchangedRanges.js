/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { $, addDisposableListener, h, reset } from '../../../../base/browser/dom.js';
import { renderLabelWithIcons } from '../../../../base/browser/ui/iconLabel/iconLabels.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { observableFromEvent, transaction } from '../../../../base/common/observable.js';
import { autorun, autorunWithStore2 } from '../../../../base/common/observableImpl/autorun.js';
import { derived, derivedWithStore } from '../../../../base/common/observableImpl/derived.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { isDefined } from '../../../../base/common/types.js';
import { PlaceholderViewZone, ViewZoneOverlayWidget, applyObservableDecorations, applyStyle, applyViewZones } from './utils.js';
import { LineRange } from '../../../common/core/lineRange.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { localize } from '../../../../nls.js';
export class UnchangedRangesFeature extends Disposable {
    get isUpdatingViewZones() { return this._isUpdatingViewZones; }
    constructor(_editors, _diffModel, _options) {
        super();
        this._editors = _editors;
        this._diffModel = _diffModel;
        this._options = _options;
        this._isUpdatingViewZones = false;
        this._register(this._editors.original.onDidChangeCursorPosition(e => {
            if (e.reason === 3 /* CursorChangeReason.Explicit */) {
                const m = this._diffModel.get();
                transaction(tx => {
                    for (const s of this._editors.original.getSelections() || []) {
                        m === null || m === void 0 ? void 0 : m.ensureOriginalLineIsVisible(s.getStartPosition().lineNumber, tx);
                        m === null || m === void 0 ? void 0 : m.ensureOriginalLineIsVisible(s.getEndPosition().lineNumber, tx);
                    }
                });
            }
        }));
        this._register(this._editors.modified.onDidChangeCursorPosition(e => {
            if (e.reason === 3 /* CursorChangeReason.Explicit */) {
                const m = this._diffModel.get();
                transaction(tx => {
                    for (const s of this._editors.modified.getSelections() || []) {
                        m === null || m === void 0 ? void 0 : m.ensureModifiedLineIsVisible(s.getStartPosition().lineNumber, tx);
                        m === null || m === void 0 ? void 0 : m.ensureModifiedLineIsVisible(s.getEndPosition().lineNumber, tx);
                    }
                });
            }
        }));
        const unchangedRegions = this._diffModel.map((m, reader) => { var _a, _b; return ((_a = m === null || m === void 0 ? void 0 : m.diff.read(reader)) === null || _a === void 0 ? void 0 : _a.mappings.length) === 0 ? [] : (_b = m === null || m === void 0 ? void 0 : m.unchangedRegions.read(reader)) !== null && _b !== void 0 ? _b : []; });
        const viewZones = derivedWithStore('view zones', (reader, store) => {
            const origViewZones = [];
            const modViewZones = [];
            const sideBySide = this._options.renderSideBySide.read(reader);
            const curUnchangedRegions = unchangedRegions.read(reader);
            for (const r of curUnchangedRegions) {
                if (r.shouldHideControls(reader)) {
                    continue;
                }
                {
                    const d = derived('hiddenOriginalRangeStart', reader => r.getHiddenOriginalRange(reader).startLineNumber - 1);
                    const origVz = new PlaceholderViewZone(d, 24);
                    origViewZones.push(origVz);
                    store.add(new CollapsedCodeOverlayWidget(this._editors.original, origVz, r, !sideBySide));
                }
                {
                    const d = derived('hiddenModifiedRangeStart', reader => r.getHiddenModifiedRange(reader).startLineNumber - 1);
                    const modViewZone = new PlaceholderViewZone(d, 24);
                    modViewZones.push(modViewZone);
                    store.add(new CollapsedCodeOverlayWidget(this._editors.modified, modViewZone, r, false));
                }
            }
            return { origViewZones, modViewZones, };
        });
        const unchangedLinesDecoration = {
            description: 'unchanged lines',
            className: 'diff-unchanged-lines',
            isWholeLine: true,
        };
        const unchangedLinesDecorationShow = {
            description: 'Fold Unchanged',
            glyphMarginHoverMessage: new MarkdownString(undefined, { isTrusted: true, supportThemeIcons: true }).appendMarkdown(localize('foldUnchanged', 'Fold Unchanged Region')),
            glyphMarginClassName: 'fold-unchanged ' + ThemeIcon.asClassName(Codicon.fold),
            zIndex: 10001,
        };
        this._register(applyObservableDecorations(this._editors.original, derived('decorations', (reader) => {
            const curUnchangedRegions = unchangedRegions.read(reader);
            const result = curUnchangedRegions.map(r => ({
                range: r.originalRange.toInclusiveRange(),
                options: unchangedLinesDecoration,
            }));
            for (const r of curUnchangedRegions) {
                if (r.shouldHideControls(reader)) {
                    result.push({
                        range: Range.fromPositions(new Position(r.originalLineNumber, 1)),
                        options: unchangedLinesDecorationShow
                    });
                }
            }
            return result;
        })));
        this._register(applyObservableDecorations(this._editors.modified, derived('decorations', (reader) => {
            const curUnchangedRegions = unchangedRegions.read(reader);
            const result = curUnchangedRegions.map(r => ({
                range: r.modifiedRange.toInclusiveRange(),
                options: unchangedLinesDecoration,
            }));
            for (const r of curUnchangedRegions) {
                if (r.shouldHideControls(reader)) {
                    result.push({
                        range: LineRange.ofLength(r.modifiedLineNumber, 1).toInclusiveRange(),
                        options: unchangedLinesDecorationShow
                    });
                }
            }
            return result;
        })));
        this._register(applyViewZones(this._editors.original, viewZones.map(v => v.origViewZones), v => this._isUpdatingViewZones = v));
        this._register(applyViewZones(this._editors.modified, viewZones.map(v => v.modViewZones), v => this._isUpdatingViewZones = v));
        this._register(autorunWithStore2('update folded unchanged regions', (reader, store) => {
            const curUnchangedRegions = unchangedRegions.read(reader);
            this._editors.original.setHiddenAreas(curUnchangedRegions.map(r => r.getHiddenOriginalRange(reader).toInclusiveRange()).filter(isDefined));
            this._editors.modified.setHiddenAreas(curUnchangedRegions.map(r => r.getHiddenModifiedRange(reader).toInclusiveRange()).filter(isDefined));
        }));
        this._register(this._editors.modified.onMouseUp(event => {
            var _a;
            if (!event.event.rightButton && event.target.position && ((_a = event.target.element) === null || _a === void 0 ? void 0 : _a.className.includes('fold-unchanged'))) {
                const lineNumber = event.target.position.lineNumber;
                const model = this._diffModel.get();
                if (!model) {
                    return;
                }
                const region = model.unchangedRegions.get().find(r => r.modifiedRange.includes(lineNumber));
                if (!region) {
                    return;
                }
                region.setState(0, 0, undefined);
                event.event.stopPropagation();
                event.event.preventDefault();
            }
        }));
        this._register(this._editors.original.onMouseUp(event => {
            var _a;
            if (!event.event.rightButton && event.target.position && ((_a = event.target.element) === null || _a === void 0 ? void 0 : _a.className.includes('fold-unchanged'))) {
                const lineNumber = event.target.position.lineNumber;
                const model = this._diffModel.get();
                if (!model) {
                    return;
                }
                const region = model.unchangedRegions.get().find(r => r.originalRange.includes(lineNumber));
                if (!region) {
                    return;
                }
                region.setState(0, 0, undefined);
                event.event.stopPropagation();
                event.event.preventDefault();
            }
        }));
    }
}
class CollapsedCodeOverlayWidget extends ViewZoneOverlayWidget {
    constructor(_editor, _viewZone, _unchangedRegion, hide) {
        const root = h('div.diff-hidden-lines-widget');
        super(_editor, _viewZone, root.root);
        this._editor = _editor;
        this._unchangedRegion = _unchangedRegion;
        this.hide = hide;
        this._nodes = h('div.diff-hidden-lines', [
            h('div.top@top', { title: 'Click or drag to show more above' }),
            h('div.center@content', { style: { display: 'flex' } }, [
                h('div@first', { style: { display: 'flex', justifyContent: 'center', alignItems: 'center' } }, [$('a', { title: 'Show all', role: 'button', onclick: () => { this._unchangedRegion.showAll(undefined); } }, ...renderLabelWithIcons('$(unfold)'))]),
                h('div@others', { style: { display: 'flex', justifyContent: 'center', alignItems: 'center' } }),
            ]),
            h('div.bottom@bottom', { title: 'Click or drag to show more below', role: 'button' }),
        ]);
        root.root.appendChild(this._nodes.root);
        const layoutInfo = observableFromEvent(this._editor.onDidLayoutChange, () => this._editor.getLayoutInfo());
        if (!this.hide) {
            this._register(applyStyle(this._nodes.first, { width: layoutInfo.map((l) => l.contentLeft) }));
        }
        else {
            reset(this._nodes.first);
        }
        const editor = this._editor;
        this._register(addDisposableListener(this._nodes.top, 'mousedown', e => {
            if (e.button !== 0) {
                return;
            }
            this._nodes.top.classList.toggle('dragging', true);
            this._nodes.root.classList.toggle('dragging', true);
            e.preventDefault();
            const startTop = e.clientY;
            let didMove = false;
            const cur = this._unchangedRegion.visibleLineCountTop.get();
            this._unchangedRegion.isDragged.set(true, undefined);
            const mouseMoveListener = addDisposableListener(window, 'mousemove', e => {
                const currentTop = e.clientY;
                const delta = currentTop - startTop;
                didMove = didMove || Math.abs(delta) > 2;
                const lineDelta = Math.round(delta / editor.getOption(64 /* EditorOption.lineHeight */));
                const newVal = Math.max(0, Math.min(cur + lineDelta, this._unchangedRegion.getMaxVisibleLineCountTop()));
                this._unchangedRegion.visibleLineCountTop.set(newVal, undefined);
            });
            const mouseUpListener = addDisposableListener(window, 'mouseup', e => {
                if (!didMove) {
                    this._unchangedRegion.showMoreAbove(20, undefined);
                }
                this._nodes.top.classList.toggle('dragging', false);
                this._nodes.root.classList.toggle('dragging', false);
                this._unchangedRegion.isDragged.set(false, undefined);
                mouseMoveListener.dispose();
                mouseUpListener.dispose();
            });
        }));
        this._register(addDisposableListener(this._nodes.bottom, 'mousedown', e => {
            if (e.button !== 0) {
                return;
            }
            this._nodes.bottom.classList.toggle('dragging', true);
            this._nodes.root.classList.toggle('dragging', true);
            e.preventDefault();
            const startTop = e.clientY;
            let didMove = false;
            const cur = this._unchangedRegion.visibleLineCountBottom.get();
            this._unchangedRegion.isDragged.set(true, undefined);
            const mouseMoveListener = addDisposableListener(window, 'mousemove', e => {
                const currentTop = e.clientY;
                const delta = currentTop - startTop;
                didMove = didMove || Math.abs(delta) > 2;
                const lineDelta = Math.round(delta / editor.getOption(64 /* EditorOption.lineHeight */));
                const newVal = Math.max(0, Math.min(cur - lineDelta, this._unchangedRegion.getMaxVisibleLineCountBottom()));
                const top = editor.getTopForLineNumber(this._unchangedRegion.originalRange.endLineNumberExclusive);
                this._unchangedRegion.visibleLineCountBottom.set(newVal, undefined);
                const top2 = editor.getTopForLineNumber(this._unchangedRegion.originalRange.endLineNumberExclusive);
                editor.setScrollTop(editor.getScrollTop() + (top2 - top));
            });
            const mouseUpListener = addDisposableListener(window, 'mouseup', e => {
                this._unchangedRegion.isDragged.set(false, undefined);
                if (!didMove) {
                    const top = editor.getTopForLineNumber(this._unchangedRegion.originalRange.endLineNumberExclusive);
                    this._unchangedRegion.showMoreBelow(20, undefined);
                    const top2 = editor.getTopForLineNumber(this._unchangedRegion.originalRange.endLineNumberExclusive);
                    editor.setScrollTop(editor.getScrollTop() + (top2 - top));
                }
                this._nodes.bottom.classList.toggle('dragging', false);
                this._nodes.root.classList.toggle('dragging', false);
                mouseMoveListener.dispose();
                mouseUpListener.dispose();
            });
        }));
        this._register(autorun('update labels', (reader) => {
            const children = [];
            if (!this.hide && true) {
                const lineCount = _unchangedRegion.getHiddenModifiedRange(reader).length;
                const linesHiddenText = `${lineCount} Hidden Lines`;
                children.push($('span', { title: linesHiddenText }, linesHiddenText));
            }
            // TODO@hediet implement breadcrumbs for collapsed regions
            /*
            if (_unchangedRegion.originalLineNumber === 48) {
                children.push($('span', undefined, '\u00a0|\u00a0'));
                children.push($('span', { title: 'test' }, ...renderLabelWithIcons('$(symbol-class) DiffEditorWidget2')));
            } else if (_unchangedRegion.originalLineNumber === 88) {
                children.push($('span', undefined, '\u00a0|\u00a0'));
                children.push($('span', { title: 'test' }, ...renderLabelWithIcons('$(symbol-constructor) constructor')));
            }
            */
            reset(this._nodes.others, ...children);
        }));
    }
}
