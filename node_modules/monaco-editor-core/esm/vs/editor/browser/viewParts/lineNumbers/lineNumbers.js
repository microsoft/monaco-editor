/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import './lineNumbers.css';
import * as platform from '../../../../base/common/platform.js';
import { DynamicViewOverlay } from '../../view/dynamicViewOverlay.js';
import { Position } from '../../../common/core/position.js';
import { registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { editorDimmedLineNumber, editorLineNumbers } from '../../../common/core/editorColorRegistry.js';
class LineNumbersOverlay extends DynamicViewOverlay {
    constructor(context) {
        super();
        this._context = context;
        this._readConfig();
        this._lastCursorModelPosition = new Position(1, 1);
        this._renderResult = null;
        this._activeLineNumber = 1;
        this._context.addEventHandler(this);
    }
    _readConfig() {
        const options = this._context.configuration.options;
        this._lineHeight = options.get(64 /* EditorOption.lineHeight */);
        const lineNumbers = options.get(65 /* EditorOption.lineNumbers */);
        this._renderLineNumbers = lineNumbers.renderType;
        this._renderCustomLineNumbers = lineNumbers.renderFn;
        this._renderFinalNewline = options.get(90 /* EditorOption.renderFinalNewline */);
        const layoutInfo = options.get(139 /* EditorOption.layoutInfo */);
        this._lineNumbersLeft = layoutInfo.lineNumbersLeft;
        this._lineNumbersWidth = layoutInfo.lineNumbersWidth;
    }
    dispose() {
        this._context.removeEventHandler(this);
        this._renderResult = null;
        super.dispose();
    }
    // --- begin event handlers
    onConfigurationChanged(e) {
        this._readConfig();
        return true;
    }
    onCursorStateChanged(e) {
        const primaryViewPosition = e.selections[0].getPosition();
        this._lastCursorModelPosition = this._context.viewModel.coordinatesConverter.convertViewPositionToModelPosition(primaryViewPosition);
        let shouldRender = false;
        if (this._activeLineNumber !== primaryViewPosition.lineNumber) {
            this._activeLineNumber = primaryViewPosition.lineNumber;
            shouldRender = true;
        }
        if (this._renderLineNumbers === 2 /* RenderLineNumbersType.Relative */ || this._renderLineNumbers === 3 /* RenderLineNumbersType.Interval */) {
            shouldRender = true;
        }
        return shouldRender;
    }
    onFlushed(e) {
        return true;
    }
    onLinesChanged(e) {
        return true;
    }
    onLinesDeleted(e) {
        return true;
    }
    onLinesInserted(e) {
        return true;
    }
    onScrollChanged(e) {
        return e.scrollTopChanged;
    }
    onZonesChanged(e) {
        return true;
    }
    // --- end event handlers
    _getLineRenderLineNumber(viewLineNumber) {
        const modelPosition = this._context.viewModel.coordinatesConverter.convertViewPositionToModelPosition(new Position(viewLineNumber, 1));
        if (modelPosition.column !== 1) {
            return '';
        }
        const modelLineNumber = modelPosition.lineNumber;
        if (this._renderCustomLineNumbers) {
            return this._renderCustomLineNumbers(modelLineNumber);
        }
        if (this._renderLineNumbers === 2 /* RenderLineNumbersType.Relative */) {
            const diff = Math.abs(this._lastCursorModelPosition.lineNumber - modelLineNumber);
            if (diff === 0) {
                return '<span class="relative-current-line-number">' + modelLineNumber + '</span>';
            }
            return String(diff);
        }
        if (this._renderLineNumbers === 3 /* RenderLineNumbersType.Interval */) {
            if (this._lastCursorModelPosition.lineNumber === modelLineNumber) {
                return String(modelLineNumber);
            }
            if (modelLineNumber % 10 === 0) {
                return String(modelLineNumber);
            }
            return '';
        }
        return String(modelLineNumber);
    }
    prepareRender(ctx) {
        if (this._renderLineNumbers === 0 /* RenderLineNumbersType.Off */) {
            this._renderResult = null;
            return;
        }
        const lineHeightClassName = (platform.isLinux ? (this._lineHeight % 2 === 0 ? ' lh-even' : ' lh-odd') : '');
        const visibleStartLineNumber = ctx.visibleRange.startLineNumber;
        const visibleEndLineNumber = ctx.visibleRange.endLineNumber;
        const lineCount = this._context.viewModel.getLineCount();
        const output = [];
        for (let lineNumber = visibleStartLineNumber; lineNumber <= visibleEndLineNumber; lineNumber++) {
            const lineIndex = lineNumber - visibleStartLineNumber;
            const renderLineNumber = this._getLineRenderLineNumber(lineNumber);
            if (!renderLineNumber) {
                output[lineIndex] = '';
                continue;
            }
            let extraClassName = '';
            if (lineNumber === lineCount && this._context.viewModel.getLineLength(lineNumber) === 0) {
                // this is the last line
                if (this._renderFinalNewline === 'off') {
                    output[lineIndex] = '';
                    continue;
                }
                if (this._renderFinalNewline === 'dimmed') {
                    extraClassName = ' dimmed-line-number';
                }
            }
            if (lineNumber === this._activeLineNumber) {
                extraClassName = ' active-line-number';
            }
            output[lineIndex] = (`<div class="${LineNumbersOverlay.CLASS_NAME}${lineHeightClassName}${extraClassName}" style="left:${this._lineNumbersLeft}px;width:${this._lineNumbersWidth}px;">${renderLineNumber}</div>`);
        }
        this._renderResult = output;
    }
    render(startLineNumber, lineNumber) {
        if (!this._renderResult) {
            return '';
        }
        const lineIndex = lineNumber - startLineNumber;
        if (lineIndex < 0 || lineIndex >= this._renderResult.length) {
            return '';
        }
        return this._renderResult[lineIndex];
    }
}
LineNumbersOverlay.CLASS_NAME = 'line-numbers';
export { LineNumbersOverlay };
registerThemingParticipant((theme, collector) => {
    const editorLineNumbersColor = theme.getColor(editorLineNumbers);
    const editorDimmedLineNumberColor = theme.getColor(editorDimmedLineNumber);
    if (editorDimmedLineNumberColor) {
        collector.addRule(`.monaco-editor .line-numbers.dimmed-line-number { color: ${editorDimmedLineNumberColor}; }`);
    }
    else if (editorLineNumbersColor) {
        collector.addRule(`.monaco-editor .line-numbers.dimmed-line-number { color: ${editorLineNumbersColor.transparent(0.4)}; }`);
    }
});
