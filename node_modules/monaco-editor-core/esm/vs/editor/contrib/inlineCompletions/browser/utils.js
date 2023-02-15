/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Range } from '../../../common/core/range.js';
export function createDisposableRef(object, disposable) {
    return {
        object,
        dispose: () => disposable === null || disposable === void 0 ? void 0 : disposable.dispose(),
    };
}
export function applyEdits(text, edits) {
    const transformer = new PositionOffsetTransformer(text);
    const offsetEdits = edits.map(e => {
        const range = Range.lift(e.range);
        return ({
            startOffset: transformer.getOffset(range.getStartPosition()),
            endOffset: transformer.getOffset(range.getEndPosition()),
            text: e.text
        });
    });
    offsetEdits.sort((a, b) => b.startOffset - a.startOffset);
    for (const edit of offsetEdits) {
        text = text.substring(0, edit.startOffset) + edit.text + text.substring(edit.endOffset);
    }
    return text;
}
class PositionOffsetTransformer {
    constructor(text) {
        this.lineStartOffsetByLineIdx = [];
        this.lineStartOffsetByLineIdx.push(0);
        for (let i = 0; i < text.length; i++) {
            if (text.charAt(i) === '\n') {
                this.lineStartOffsetByLineIdx.push(i + 1);
            }
        }
    }
    getOffset(position) {
        return this.lineStartOffsetByLineIdx[position.lineNumber - 1] + position.column - 1;
    }
}
const array = [];
export function getReadonlyEmptyArray() {
    return array;
}
