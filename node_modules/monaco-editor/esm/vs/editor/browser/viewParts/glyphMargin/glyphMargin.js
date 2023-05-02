/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import './glyphMargin.css';
import { DynamicViewOverlay } from '../../view/dynamicViewOverlay.js';
export class DecorationToRender {
    constructor(startLineNumber, endLineNumber, className, zIndex, decorationLane) {
        this._decorationToRenderBrand = undefined;
        this.startLineNumber = +startLineNumber;
        this.endLineNumber = +endLineNumber;
        this.className = String(className);
        this.zIndex = zIndex !== null && zIndex !== void 0 ? zIndex : 0;
        this.decorationLane = decorationLane !== null && decorationLane !== void 0 ? decorationLane : 1;
    }
}
export class RenderedDecoration {
    constructor(className, zIndex) {
        this.className = className;
        this.zIndex = zIndex;
    }
}
export class LineRenderedDecorations {
    constructor() {
        this.lanes = [];
    }
    add(lane, decoration) {
        while (lane >= this.lanes.length) {
            this.lanes.push([]);
        }
        this.lanes[lane].push(decoration);
    }
    getLaneDecorations(laneIndex) {
        if (laneIndex < this.lanes.length) {
            return this.lanes[laneIndex];
        }
        return [];
    }
    isEmpty() {
        for (const lane of this.lanes) {
            if (lane.length > 0) {
                return false;
            }
        }
        return true;
    }
}
export class DedupOverlay extends DynamicViewOverlay {
    _render(visibleStartLineNumber, visibleEndLineNumber, decorations, decorationLaneCount) {
        const output = [];
        for (let lineNumber = visibleStartLineNumber; lineNumber <= visibleEndLineNumber; lineNumber++) {
            const lineIndex = lineNumber - visibleStartLineNumber;
            output[lineIndex] = new LineRenderedDecorations();
        }
        if (decorations.length === 0) {
            return output;
        }
        decorations.sort((a, b) => {
            if (a.className === b.className) {
                if (a.startLineNumber === b.startLineNumber) {
                    return a.endLineNumber - b.endLineNumber;
                }
                return a.startLineNumber - b.startLineNumber;
            }
            return (a.className < b.className ? -1 : 1);
        });
        let prevClassName = null;
        let prevEndLineIndex = 0;
        for (let i = 0, len = decorations.length; i < len; i++) {
            const d = decorations[i];
            const className = d.className;
            const zIndex = d.zIndex;
            let startLineIndex = Math.max(d.startLineNumber, visibleStartLineNumber) - visibleStartLineNumber;
            const endLineIndex = Math.min(d.endLineNumber, visibleEndLineNumber) - visibleStartLineNumber;
            const lane = Math.min(d.decorationLane, decorationLaneCount);
            if (prevClassName === className) {
                startLineIndex = Math.max(prevEndLineIndex + 1, startLineIndex);
                prevEndLineIndex = Math.max(prevEndLineIndex, endLineIndex);
            }
            else {
                prevClassName = className;
                prevEndLineIndex = endLineIndex;
            }
            for (let i = startLineIndex; i <= prevEndLineIndex; i++) {
                output[i].add(lane, new RenderedDecoration(className, zIndex));
            }
        }
        return output;
    }
}
export class GlyphMarginOverlay extends DedupOverlay {
    constructor(context) {
        super();
        this._context = context;
        const options = this._context.configuration.options;
        const layoutInfo = options.get(139 /* EditorOption.layoutInfo */);
        this._lineHeight = options.get(64 /* EditorOption.lineHeight */);
        this._glyphMargin = options.get(55 /* EditorOption.glyphMargin */);
        this._glyphMarginLeft = layoutInfo.glyphMarginLeft;
        this._glyphMarginWidth = layoutInfo.glyphMarginWidth;
        this._glyphMarginDecorationLaneCount = layoutInfo.glyphMarginDecorationLaneCount;
        this._renderResult = null;
        this._context.addEventHandler(this);
    }
    dispose() {
        this._context.removeEventHandler(this);
        this._renderResult = null;
        super.dispose();
    }
    // --- begin event handlers
    onConfigurationChanged(e) {
        const options = this._context.configuration.options;
        const layoutInfo = options.get(139 /* EditorOption.layoutInfo */);
        this._lineHeight = options.get(64 /* EditorOption.lineHeight */);
        this._glyphMargin = options.get(55 /* EditorOption.glyphMargin */);
        this._glyphMarginLeft = layoutInfo.glyphMarginLeft;
        this._glyphMarginWidth = layoutInfo.glyphMarginWidth;
        this._glyphMarginDecorationLaneCount = layoutInfo.glyphMarginDecorationLaneCount;
        return true;
    }
    onDecorationsChanged(e) {
        return true;
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
    _getDecorations(ctx) {
        var _a;
        const decorations = ctx.getDecorationsInViewport();
        const r = [];
        let rLen = 0;
        for (let i = 0, len = decorations.length; i < len; i++) {
            const d = decorations[i];
            const glyphMarginClassName = d.options.glyphMarginClassName;
            const zIndex = d.options.zIndex;
            const lane = (_a = d.options.glyphMargin) === null || _a === void 0 ? void 0 : _a.position;
            if (glyphMarginClassName) {
                r[rLen++] = new DecorationToRender(d.range.startLineNumber, d.range.endLineNumber, glyphMarginClassName, zIndex, lane);
            }
        }
        return r;
    }
    prepareRender(ctx) {
        if (!this._glyphMargin) {
            this._renderResult = null;
            return;
        }
        const visibleStartLineNumber = ctx.visibleRange.startLineNumber;
        const visibleEndLineNumber = ctx.visibleRange.endLineNumber;
        const decorationsToRender = this._getDecorations(ctx);
        const toRender = this._render(visibleStartLineNumber, visibleEndLineNumber, decorationsToRender, this._glyphMarginDecorationLaneCount);
        const lineHeight = this._lineHeight.toString();
        const width = (Math.round(this._glyphMarginWidth / this._glyphMarginDecorationLaneCount)).toString();
        const common = '" style="width:' + width + 'px' + ';height:' + lineHeight + 'px;';
        const output = [];
        for (let lineNumber = visibleStartLineNumber; lineNumber <= visibleEndLineNumber; lineNumber++) {
            const lineIndex = lineNumber - visibleStartLineNumber;
            const renderInfo = toRender[lineIndex];
            if (renderInfo.isEmpty()) {
                output[lineIndex] = '';
            }
            else {
                let css = '';
                for (let lane = 1; lane <= this._glyphMarginDecorationLaneCount; lane += 1) {
                    const decorations = renderInfo.getLaneDecorations(lane);
                    if (decorations.length === 0) {
                        continue;
                    }
                    decorations.sort((a, b) => b.zIndex - a.zIndex);
                    // Render winning decorations with the same zIndex together
                    const winningDecoration = decorations[0];
                    const winningDecorationClassNames = [winningDecoration.className];
                    for (let i = 1; i < decorations.length; i += 1) {
                        const decoration = decorations[i];
                        if (decoration.zIndex !== winningDecoration.zIndex) {
                            break;
                        }
                        winningDecorationClassNames.push(decoration.className);
                    }
                    const left = (this._glyphMarginLeft + (lane - 1) * this._lineHeight).toString();
                    css += ('<div class="cgmr codicon '
                        + winningDecorationClassNames.join(' ') // TODO@joyceerhl Implement overflow for remaining decorations
                        + common
                        + 'left:' + left + 'px;"></div>');
                }
                output[lineIndex] = css;
            }
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
