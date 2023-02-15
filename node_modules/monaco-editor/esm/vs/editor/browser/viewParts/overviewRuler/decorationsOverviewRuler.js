/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { createFastDomNode } from '../../../../base/browser/fastDomNode.js';
import { Color } from '../../../../base/common/color.js';
import { ViewPart } from '../../view/viewPart.js';
import { Position } from '../../../common/core/position.js';
import { TokenizationRegistry } from '../../../common/languages.js';
import { editorCursorForeground, editorOverviewRulerBorder, editorOverviewRulerBackground } from '../../../common/core/editorColorRegistry.js';
import { OverviewRulerDecorationsGroup } from '../../../common/viewModel.js';
class Settings {
    constructor(config, theme) {
        const options = config.options;
        this.lineHeight = options.get(63 /* EditorOption.lineHeight */);
        this.pixelRatio = options.get(136 /* EditorOption.pixelRatio */);
        this.overviewRulerLanes = options.get(79 /* EditorOption.overviewRulerLanes */);
        this.renderBorder = options.get(78 /* EditorOption.overviewRulerBorder */);
        const borderColor = theme.getColor(editorOverviewRulerBorder);
        this.borderColor = borderColor ? borderColor.toString() : null;
        this.hideCursor = options.get(56 /* EditorOption.hideCursorInOverviewRuler */);
        const cursorColor = theme.getColor(editorCursorForeground);
        this.cursorColor = cursorColor ? cursorColor.transparent(0.7).toString() : null;
        this.themeType = theme.type;
        const minimapOpts = options.get(69 /* EditorOption.minimap */);
        const minimapEnabled = minimapOpts.enabled;
        const minimapSide = minimapOpts.side;
        const themeColor = theme.getColor(editorOverviewRulerBackground);
        const defaultBackground = TokenizationRegistry.getDefaultBackground();
        if (themeColor) {
            this.backgroundColor = themeColor;
        }
        else if (minimapEnabled && minimapSide === 'right') {
            this.backgroundColor = defaultBackground;
        }
        else {
            this.backgroundColor = null;
        }
        const layoutInfo = options.get(138 /* EditorOption.layoutInfo */);
        const position = layoutInfo.overviewRuler;
        this.top = position.top;
        this.right = position.right;
        this.domWidth = position.width;
        this.domHeight = position.height;
        if (this.overviewRulerLanes === 0) {
            // overview ruler is off
            this.canvasWidth = 0;
            this.canvasHeight = 0;
        }
        else {
            this.canvasWidth = (this.domWidth * this.pixelRatio) | 0;
            this.canvasHeight = (this.domHeight * this.pixelRatio) | 0;
        }
        const [x, w] = this._initLanes(1, this.canvasWidth, this.overviewRulerLanes);
        this.x = x;
        this.w = w;
    }
    _initLanes(canvasLeftOffset, canvasWidth, laneCount) {
        const remainingWidth = canvasWidth - canvasLeftOffset;
        if (laneCount >= 3) {
            const leftWidth = Math.floor(remainingWidth / 3);
            const rightWidth = Math.floor(remainingWidth / 3);
            const centerWidth = remainingWidth - leftWidth - rightWidth;
            const leftOffset = canvasLeftOffset;
            const centerOffset = leftOffset + leftWidth;
            const rightOffset = leftOffset + leftWidth + centerWidth;
            return [
                [
                    0,
                    leftOffset,
                    centerOffset,
                    leftOffset,
                    rightOffset,
                    leftOffset,
                    centerOffset,
                    leftOffset, // Left | Center | Right
                ], [
                    0,
                    leftWidth,
                    centerWidth,
                    leftWidth + centerWidth,
                    rightWidth,
                    leftWidth + centerWidth + rightWidth,
                    centerWidth + rightWidth,
                    leftWidth + centerWidth + rightWidth, // Left | Center | Right
                ]
            ];
        }
        else if (laneCount === 2) {
            const leftWidth = Math.floor(remainingWidth / 2);
            const rightWidth = remainingWidth - leftWidth;
            const leftOffset = canvasLeftOffset;
            const rightOffset = leftOffset + leftWidth;
            return [
                [
                    0,
                    leftOffset,
                    leftOffset,
                    leftOffset,
                    rightOffset,
                    leftOffset,
                    leftOffset,
                    leftOffset, // Left | Center | Right
                ], [
                    0,
                    leftWidth,
                    leftWidth,
                    leftWidth,
                    rightWidth,
                    leftWidth + rightWidth,
                    leftWidth + rightWidth,
                    leftWidth + rightWidth, // Left | Center | Right
                ]
            ];
        }
        else {
            const offset = canvasLeftOffset;
            const width = remainingWidth;
            return [
                [
                    0,
                    offset,
                    offset,
                    offset,
                    offset,
                    offset,
                    offset,
                    offset, // Left | Center | Right
                ], [
                    0,
                    width,
                    width,
                    width,
                    width,
                    width,
                    width,
                    width, // Left | Center | Right
                ]
            ];
        }
    }
    equals(other) {
        return (this.lineHeight === other.lineHeight
            && this.pixelRatio === other.pixelRatio
            && this.overviewRulerLanes === other.overviewRulerLanes
            && this.renderBorder === other.renderBorder
            && this.borderColor === other.borderColor
            && this.hideCursor === other.hideCursor
            && this.cursorColor === other.cursorColor
            && this.themeType === other.themeType
            && Color.equals(this.backgroundColor, other.backgroundColor)
            && this.top === other.top
            && this.right === other.right
            && this.domWidth === other.domWidth
            && this.domHeight === other.domHeight
            && this.canvasWidth === other.canvasWidth
            && this.canvasHeight === other.canvasHeight);
    }
}
export class DecorationsOverviewRuler extends ViewPart {
    constructor(context) {
        super(context);
        this._domNode = createFastDomNode(document.createElement('canvas'));
        this._domNode.setClassName('decorationsOverviewRuler');
        this._domNode.setPosition('absolute');
        this._domNode.setLayerHinting(true);
        this._domNode.setContain('strict');
        this._domNode.setAttribute('aria-hidden', 'true');
        this._updateSettings(false);
        this._tokensColorTrackerListener = TokenizationRegistry.onDidChange((e) => {
            if (e.changedColorMap) {
                this._updateSettings(true);
            }
        });
        this._cursorPositions = [];
    }
    dispose() {
        super.dispose();
        this._tokensColorTrackerListener.dispose();
    }
    _updateSettings(renderNow) {
        const newSettings = new Settings(this._context.configuration, this._context.theme);
        if (this._settings && this._settings.equals(newSettings)) {
            // nothing to do
            return false;
        }
        this._settings = newSettings;
        this._domNode.setTop(this._settings.top);
        this._domNode.setRight(this._settings.right);
        this._domNode.setWidth(this._settings.domWidth);
        this._domNode.setHeight(this._settings.domHeight);
        this._domNode.domNode.width = this._settings.canvasWidth;
        this._domNode.domNode.height = this._settings.canvasHeight;
        if (renderNow) {
            this._render();
        }
        return true;
    }
    // ---- begin view event handlers
    onConfigurationChanged(e) {
        return this._updateSettings(false);
    }
    onCursorStateChanged(e) {
        this._cursorPositions = [];
        for (let i = 0, len = e.selections.length; i < len; i++) {
            this._cursorPositions[i] = e.selections[i].getPosition();
        }
        this._cursorPositions.sort(Position.compare);
        return true;
    }
    onDecorationsChanged(e) {
        if (e.affectsOverviewRuler) {
            return true;
        }
        return false;
    }
    onFlushed(e) {
        return true;
    }
    onScrollChanged(e) {
        return e.scrollHeightChanged;
    }
    onZonesChanged(e) {
        return true;
    }
    onThemeChanged(e) {
        return this._updateSettings(false);
    }
    // ---- end view event handlers
    getDomNode() {
        return this._domNode.domNode;
    }
    prepareRender(ctx) {
        // Nothing to read
    }
    render(editorCtx) {
        this._render();
    }
    _render() {
        const backgroundColor = this._settings.backgroundColor;
        if (this._settings.overviewRulerLanes === 0) {
            // overview ruler is off
            this._domNode.setBackgroundColor(backgroundColor ? Color.Format.CSS.formatHexA(backgroundColor) : '');
            this._domNode.setDisplay('none');
            return;
        }
        this._domNode.setDisplay('block');
        const canvasWidth = this._settings.canvasWidth;
        const canvasHeight = this._settings.canvasHeight;
        const lineHeight = this._settings.lineHeight;
        const viewLayout = this._context.viewLayout;
        const outerHeight = this._context.viewLayout.getScrollHeight();
        const heightRatio = canvasHeight / outerHeight;
        const decorations = this._context.viewModel.getAllOverviewRulerDecorations(this._context.theme);
        const minDecorationHeight = (6 /* Constants.MIN_DECORATION_HEIGHT */ * this._settings.pixelRatio) | 0;
        const halfMinDecorationHeight = (minDecorationHeight / 2) | 0;
        const canvasCtx = this._domNode.domNode.getContext('2d');
        if (backgroundColor) {
            if (backgroundColor.isOpaque()) {
                // We have a background color which is opaque, we can just paint the entire surface with it
                canvasCtx.fillStyle = Color.Format.CSS.formatHexA(backgroundColor);
                canvasCtx.fillRect(0, 0, canvasWidth, canvasHeight);
            }
            else {
                // We have a background color which is transparent, we need to first clear the surface and
                // then fill it
                canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
                canvasCtx.fillStyle = Color.Format.CSS.formatHexA(backgroundColor);
                canvasCtx.fillRect(0, 0, canvasWidth, canvasHeight);
            }
        }
        else {
            // We don't have a background color
            canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
        }
        const x = this._settings.x;
        const w = this._settings.w;
        decorations.sort(OverviewRulerDecorationsGroup.cmp);
        for (const decorationGroup of decorations) {
            const color = decorationGroup.color;
            const decorationGroupData = decorationGroup.data;
            canvasCtx.fillStyle = color;
            let prevLane = 0;
            let prevY1 = 0;
            let prevY2 = 0;
            for (let i = 0, len = decorationGroupData.length / 3; i < len; i++) {
                const lane = decorationGroupData[3 * i];
                const startLineNumber = decorationGroupData[3 * i + 1];
                const endLineNumber = decorationGroupData[3 * i + 2];
                let y1 = (viewLayout.getVerticalOffsetForLineNumber(startLineNumber) * heightRatio) | 0;
                let y2 = ((viewLayout.getVerticalOffsetForLineNumber(endLineNumber) + lineHeight) * heightRatio) | 0;
                const height = y2 - y1;
                if (height < minDecorationHeight) {
                    let yCenter = ((y1 + y2) / 2) | 0;
                    if (yCenter < halfMinDecorationHeight) {
                        yCenter = halfMinDecorationHeight;
                    }
                    else if (yCenter + halfMinDecorationHeight > canvasHeight) {
                        yCenter = canvasHeight - halfMinDecorationHeight;
                    }
                    y1 = yCenter - halfMinDecorationHeight;
                    y2 = yCenter + halfMinDecorationHeight;
                }
                if (y1 > prevY2 + 1 || lane !== prevLane) {
                    // flush prev
                    if (i !== 0) {
                        canvasCtx.fillRect(x[prevLane], prevY1, w[prevLane], prevY2 - prevY1);
                    }
                    prevLane = lane;
                    prevY1 = y1;
                    prevY2 = y2;
                }
                else {
                    // merge into prev
                    if (y2 > prevY2) {
                        prevY2 = y2;
                    }
                }
            }
            canvasCtx.fillRect(x[prevLane], prevY1, w[prevLane], prevY2 - prevY1);
        }
        // Draw cursors
        if (!this._settings.hideCursor && this._settings.cursorColor) {
            const cursorHeight = (2 * this._settings.pixelRatio) | 0;
            const halfCursorHeight = (cursorHeight / 2) | 0;
            const cursorX = this._settings.x[7 /* OverviewRulerLane.Full */];
            const cursorW = this._settings.w[7 /* OverviewRulerLane.Full */];
            canvasCtx.fillStyle = this._settings.cursorColor;
            let prevY1 = -100;
            let prevY2 = -100;
            for (let i = 0, len = this._cursorPositions.length; i < len; i++) {
                const cursor = this._cursorPositions[i];
                let yCenter = (viewLayout.getVerticalOffsetForLineNumber(cursor.lineNumber) * heightRatio) | 0;
                if (yCenter < halfCursorHeight) {
                    yCenter = halfCursorHeight;
                }
                else if (yCenter + halfCursorHeight > canvasHeight) {
                    yCenter = canvasHeight - halfCursorHeight;
                }
                const y1 = yCenter - halfCursorHeight;
                const y2 = y1 + cursorHeight;
                if (y1 > prevY2 + 1) {
                    // flush prev
                    if (i !== 0) {
                        canvasCtx.fillRect(cursorX, prevY1, cursorW, prevY2 - prevY1);
                    }
                    prevY1 = y1;
                    prevY2 = y2;
                }
                else {
                    // merge into prev
                    if (y2 > prevY2) {
                        prevY2 = y2;
                    }
                }
            }
            canvasCtx.fillRect(cursorX, prevY1, cursorW, prevY2 - prevY1);
        }
        if (this._settings.renderBorder && this._settings.borderColor && this._settings.overviewRulerLanes > 0) {
            canvasCtx.beginPath();
            canvasCtx.lineWidth = 1;
            canvasCtx.strokeStyle = this._settings.borderColor;
            canvasCtx.moveTo(0, 0);
            canvasCtx.lineTo(0, canvasHeight);
            canvasCtx.stroke();
            canvasCtx.moveTo(0, 0);
            canvasCtx.lineTo(canvasWidth, 0);
            canvasCtx.stroke();
        }
    }
}
