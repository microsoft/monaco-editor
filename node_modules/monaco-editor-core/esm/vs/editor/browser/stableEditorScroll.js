/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
export class StableEditorScrollState {
    static capture(editor) {
        let visiblePosition = null;
        let visiblePositionScrollDelta = 0;
        if (editor.getScrollTop() !== 0) {
            const visibleRanges = editor.getVisibleRanges();
            if (visibleRanges.length > 0) {
                visiblePosition = visibleRanges[0].getStartPosition();
                const visiblePositionScrollTop = editor.getTopForPosition(visiblePosition.lineNumber, visiblePosition.column);
                visiblePositionScrollDelta = editor.getScrollTop() - visiblePositionScrollTop;
            }
        }
        return new StableEditorScrollState(visiblePosition, visiblePositionScrollDelta, editor.getPosition());
    }
    constructor(_visiblePosition, _visiblePositionScrollDelta, _cursorPosition) {
        this._visiblePosition = _visiblePosition;
        this._visiblePositionScrollDelta = _visiblePositionScrollDelta;
        this._cursorPosition = _cursorPosition;
    }
    restore(editor) {
        if (this._visiblePosition) {
            const visiblePositionScrollTop = editor.getTopForPosition(this._visiblePosition.lineNumber, this._visiblePosition.column);
            editor.setScrollTop(visiblePositionScrollTop + this._visiblePositionScrollDelta);
        }
    }
    restoreRelativeVerticalPositionOfCursor(editor) {
        const currentCursorPosition = editor.getPosition();
        if (!this._cursorPosition || !currentCursorPosition) {
            return;
        }
        const offset = editor.getTopForLineNumber(currentCursorPosition.lineNumber) - editor.getTopForLineNumber(this._cursorPosition.lineNumber);
        editor.setScrollTop(editor.getScrollTop() + offset);
    }
}
