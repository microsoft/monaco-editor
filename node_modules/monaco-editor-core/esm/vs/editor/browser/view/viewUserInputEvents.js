/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Position } from '../../common/core/position.js';
export class ViewUserInputEvents {
    constructor(coordinatesConverter) {
        this.onKeyDown = null;
        this.onKeyUp = null;
        this.onContextMenu = null;
        this.onMouseMove = null;
        this.onMouseLeave = null;
        this.onMouseDown = null;
        this.onMouseUp = null;
        this.onMouseDrag = null;
        this.onMouseDrop = null;
        this.onMouseDropCanceled = null;
        this.onMouseWheel = null;
        this._coordinatesConverter = coordinatesConverter;
    }
    emitKeyDown(e) {
        var _a;
        (_a = this.onKeyDown) === null || _a === void 0 ? void 0 : _a.call(this, e);
    }
    emitKeyUp(e) {
        var _a;
        (_a = this.onKeyUp) === null || _a === void 0 ? void 0 : _a.call(this, e);
    }
    emitContextMenu(e) {
        var _a;
        (_a = this.onContextMenu) === null || _a === void 0 ? void 0 : _a.call(this, this._convertViewToModelMouseEvent(e));
    }
    emitMouseMove(e) {
        var _a;
        (_a = this.onMouseMove) === null || _a === void 0 ? void 0 : _a.call(this, this._convertViewToModelMouseEvent(e));
    }
    emitMouseLeave(e) {
        var _a;
        (_a = this.onMouseLeave) === null || _a === void 0 ? void 0 : _a.call(this, this._convertViewToModelMouseEvent(e));
    }
    emitMouseDown(e) {
        var _a;
        (_a = this.onMouseDown) === null || _a === void 0 ? void 0 : _a.call(this, this._convertViewToModelMouseEvent(e));
    }
    emitMouseUp(e) {
        var _a;
        (_a = this.onMouseUp) === null || _a === void 0 ? void 0 : _a.call(this, this._convertViewToModelMouseEvent(e));
    }
    emitMouseDrag(e) {
        var _a;
        (_a = this.onMouseDrag) === null || _a === void 0 ? void 0 : _a.call(this, this._convertViewToModelMouseEvent(e));
    }
    emitMouseDrop(e) {
        var _a;
        (_a = this.onMouseDrop) === null || _a === void 0 ? void 0 : _a.call(this, this._convertViewToModelMouseEvent(e));
    }
    emitMouseDropCanceled() {
        var _a;
        (_a = this.onMouseDropCanceled) === null || _a === void 0 ? void 0 : _a.call(this);
    }
    emitMouseWheel(e) {
        var _a;
        (_a = this.onMouseWheel) === null || _a === void 0 ? void 0 : _a.call(this, e);
    }
    _convertViewToModelMouseEvent(e) {
        if (e.target) {
            return {
                event: e.event,
                target: this._convertViewToModelMouseTarget(e.target)
            };
        }
        return e;
    }
    _convertViewToModelMouseTarget(target) {
        return ViewUserInputEvents.convertViewToModelMouseTarget(target, this._coordinatesConverter);
    }
    static convertViewToModelMouseTarget(target, coordinatesConverter) {
        const result = Object.assign({}, target);
        if (result.position) {
            result.position = coordinatesConverter.convertViewPositionToModelPosition(result.position);
        }
        if (result.range) {
            result.range = coordinatesConverter.convertViewRangeToModelRange(result.range);
        }
        if (result.type === 5 /* MouseTargetType.GUTTER_VIEW_ZONE */ || result.type === 8 /* MouseTargetType.CONTENT_VIEW_ZONE */) {
            result.detail = this.convertViewToModelViewZoneData(result.detail, coordinatesConverter);
        }
        return result;
    }
    static convertViewToModelViewZoneData(data, coordinatesConverter) {
        return {
            viewZoneId: data.viewZoneId,
            positionBefore: data.positionBefore ? coordinatesConverter.convertViewPositionToModelPosition(data.positionBefore) : data.positionBefore,
            positionAfter: data.positionAfter ? coordinatesConverter.convertViewPositionToModelPosition(data.positionAfter) : data.positionAfter,
            position: coordinatesConverter.convertViewPositionToModelPosition(data.position),
            afterLineNumber: coordinatesConverter.convertViewPositionToModelPosition(new Position(data.afterLineNumber, 1)).lineNumber,
        };
    }
}
