/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import './currentLineHighlight.css';
import { DynamicViewOverlay } from '../../view/dynamicViewOverlay.js';
import { editorLineHighlight, editorLineHighlightBorder } from '../../../common/core/editorColorRegistry.js';
import * as arrays from '../../../../base/common/arrays.js';
import { registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { Selection } from '../../../common/core/selection.js';
import { isHighContrast } from '../../../../platform/theme/common/theme.js';
export class AbstractLineHighlightOverlay extends DynamicViewOverlay {
    constructor(context) {
        super();
        this._context = context;
        const options = this._context.configuration.options;
        const layoutInfo = options.get(138 /* EditorOption.layoutInfo */);
        this._lineHeight = options.get(63 /* EditorOption.lineHeight */);
        this._renderLineHighlight = options.get(90 /* EditorOption.renderLineHighlight */);
        this._renderLineHighlightOnlyWhenFocus = options.get(91 /* EditorOption.renderLineHighlightOnlyWhenFocus */);
        this._contentLeft = layoutInfo.contentLeft;
        this._contentWidth = layoutInfo.contentWidth;
        this._selectionIsEmpty = true;
        this._focused = false;
        this._cursorLineNumbers = [1];
        this._selections = [new Selection(1, 1, 1, 1)];
        this._renderData = null;
        this._context.addEventHandler(this);
    }
    dispose() {
        this._context.removeEventHandler(this);
        super.dispose();
    }
    _readFromSelections() {
        let hasChanged = false;
        const cursorsLineNumbers = this._selections.map(s => s.positionLineNumber);
        cursorsLineNumbers.sort((a, b) => a - b);
        if (!arrays.equals(this._cursorLineNumbers, cursorsLineNumbers)) {
            this._cursorLineNumbers = cursorsLineNumbers;
            hasChanged = true;
        }
        const selectionIsEmpty = this._selections.every(s => s.isEmpty());
        if (this._selectionIsEmpty !== selectionIsEmpty) {
            this._selectionIsEmpty = selectionIsEmpty;
            hasChanged = true;
        }
        return hasChanged;
    }
    // --- begin event handlers
    onThemeChanged(e) {
        return this._readFromSelections();
    }
    onConfigurationChanged(e) {
        const options = this._context.configuration.options;
        const layoutInfo = options.get(138 /* EditorOption.layoutInfo */);
        this._lineHeight = options.get(63 /* EditorOption.lineHeight */);
        this._renderLineHighlight = options.get(90 /* EditorOption.renderLineHighlight */);
        this._renderLineHighlightOnlyWhenFocus = options.get(91 /* EditorOption.renderLineHighlightOnlyWhenFocus */);
        this._contentLeft = layoutInfo.contentLeft;
        this._contentWidth = layoutInfo.contentWidth;
        return true;
    }
    onCursorStateChanged(e) {
        this._selections = e.selections;
        return this._readFromSelections();
    }
    onFlushed(e) {
        return true;
    }
    onLinesDeleted(e) {
        return true;
    }
    onLinesInserted(e) {
        return true;
    }
    onScrollChanged(e) {
        return e.scrollWidthChanged || e.scrollTopChanged;
    }
    onZonesChanged(e) {
        return true;
    }
    onFocusChanged(e) {
        if (!this._renderLineHighlightOnlyWhenFocus) {
            return false;
        }
        this._focused = e.isFocused;
        return true;
    }
    // --- end event handlers
    prepareRender(ctx) {
        if (!this._shouldRenderThis()) {
            this._renderData = null;
            return;
        }
        const renderedLine = this._renderOne(ctx);
        const visibleStartLineNumber = ctx.visibleRange.startLineNumber;
        const visibleEndLineNumber = ctx.visibleRange.endLineNumber;
        const len = this._cursorLineNumbers.length;
        let index = 0;
        const renderData = [];
        for (let lineNumber = visibleStartLineNumber; lineNumber <= visibleEndLineNumber; lineNumber++) {
            const lineIndex = lineNumber - visibleStartLineNumber;
            while (index < len && this._cursorLineNumbers[index] < lineNumber) {
                index++;
            }
            if (index < len && this._cursorLineNumbers[index] === lineNumber) {
                renderData[lineIndex] = renderedLine;
            }
            else {
                renderData[lineIndex] = '';
            }
        }
        this._renderData = renderData;
    }
    render(startLineNumber, lineNumber) {
        if (!this._renderData) {
            return '';
        }
        const lineIndex = lineNumber - startLineNumber;
        if (lineIndex >= this._renderData.length) {
            return '';
        }
        return this._renderData[lineIndex];
    }
    _shouldRenderInMargin() {
        return ((this._renderLineHighlight === 'gutter' || this._renderLineHighlight === 'all')
            && (!this._renderLineHighlightOnlyWhenFocus || this._focused));
    }
    _shouldRenderInContent() {
        return ((this._renderLineHighlight === 'line' || this._renderLineHighlight === 'all')
            && this._selectionIsEmpty
            && (!this._renderLineHighlightOnlyWhenFocus || this._focused));
    }
}
export class CurrentLineHighlightOverlay extends AbstractLineHighlightOverlay {
    _renderOne(ctx) {
        const className = 'current-line' + (this._shouldRenderOther() ? ' current-line-both' : '');
        return `<div class="${className}" style="width:${Math.max(ctx.scrollWidth, this._contentWidth)}px; height:${this._lineHeight}px;"></div>`;
    }
    _shouldRenderThis() {
        return this._shouldRenderInContent();
    }
    _shouldRenderOther() {
        return this._shouldRenderInMargin();
    }
}
export class CurrentLineMarginHighlightOverlay extends AbstractLineHighlightOverlay {
    _renderOne(ctx) {
        const className = 'current-line' + (this._shouldRenderInMargin() ? ' current-line-margin' : '') + (this._shouldRenderOther() ? ' current-line-margin-both' : '');
        return `<div class="${className}" style="width:${this._contentLeft}px; height:${this._lineHeight}px;"></div>`;
    }
    _shouldRenderThis() {
        return true;
    }
    _shouldRenderOther() {
        return this._shouldRenderInContent();
    }
}
registerThemingParticipant((theme, collector) => {
    const lineHighlight = theme.getColor(editorLineHighlight);
    if (lineHighlight) {
        collector.addRule(`.monaco-editor .view-overlays .current-line { background-color: ${lineHighlight}; }`);
        collector.addRule(`.monaco-editor .margin-view-overlays .current-line-margin { background-color: ${lineHighlight}; border: none; }`);
    }
    if (!lineHighlight || lineHighlight.isTransparent() || theme.defines(editorLineHighlightBorder)) {
        const lineHighlightBorder = theme.getColor(editorLineHighlightBorder);
        if (lineHighlightBorder) {
            collector.addRule(`.monaco-editor .view-overlays .current-line { border: 2px solid ${lineHighlightBorder}; }`);
            collector.addRule(`.monaco-editor .margin-view-overlays .current-line-margin { border: 2px solid ${lineHighlightBorder}; }`);
            if (isHighContrast(theme.type)) {
                collector.addRule(`.monaco-editor .view-overlays .current-line { border-width: 1px; }`);
                collector.addRule(`.monaco-editor .margin-view-overlays .current-line-margin { border-width: 1px; }`);
            }
        }
    }
});
