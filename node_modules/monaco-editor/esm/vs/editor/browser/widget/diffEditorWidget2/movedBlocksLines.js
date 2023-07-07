/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Disposable } from '../../../../base/common/lifecycle.js';
import { autorun, observableFromEvent, observableSignalFromEvent } from '../../../../base/common/observable.js';
export class MovedBlocksLinesPart extends Disposable {
    constructor(_rootElement, _diffModel, _originalEditorLayoutInfo, _modifiedEditorLayoutInfo, _editors) {
        super();
        this._rootElement = _rootElement;
        this._diffModel = _diffModel;
        this._originalEditorLayoutInfo = _originalEditorLayoutInfo;
        this._modifiedEditorLayoutInfo = _modifiedEditorLayoutInfo;
        this._editors = _editors;
        const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        element.setAttribute('class', 'moved-blocks-lines');
        this._rootElement.appendChild(element);
        this._register(autorun('update', (reader) => {
            const info = this._originalEditorLayoutInfo.read(reader);
            const info2 = this._modifiedEditorLayoutInfo.read(reader);
            if (!info || !info2) {
                return;
            }
            element.style.left = `${info.width - info.verticalScrollbarWidth}px`;
            element.style.height = `${info.height}px`;
            element.style.width = `${info.verticalScrollbarWidth + info.contentLeft - MovedBlocksLinesPart.movedCodeBlockPadding}px`;
        }));
        const originalScrollTop = observableFromEvent(this._editors.original.onDidScrollChange, () => this._editors.original.getScrollTop());
        const modifiedScrollTop = observableFromEvent(this._editors.modified.onDidScrollChange, () => this._editors.modified.getScrollTop());
        const viewZonesChanged = observableSignalFromEvent('onDidChangeViewZones', this._editors.modified.onDidChangeViewZones);
        this._register(autorun('update', (reader) => {
            var _a, _b;
            element.replaceChildren();
            viewZonesChanged.read(reader);
            const info = this._originalEditorLayoutInfo.read(reader);
            const info2 = this._modifiedEditorLayoutInfo.read(reader);
            if (!info || !info2) {
                return;
            }
            const width = info.verticalScrollbarWidth + info.contentLeft - MovedBlocksLinesPart.movedCodeBlockPadding;
            const moves = (_b = (_a = this._diffModel.read(reader)) === null || _a === void 0 ? void 0 : _a.diff.read(reader)) === null || _b === void 0 ? void 0 : _b.movedTexts;
            if (!moves) {
                return;
            }
            let idx = 0;
            for (const m of moves) {
                function computeLineStart(range, editor) {
                    const t1 = editor.getTopForLineNumber(range.startLineNumber);
                    const t2 = editor.getTopForLineNumber(range.endLineNumberExclusive);
                    return (t1 + t2) / 2;
                }
                const start = computeLineStart(m.lineRangeMapping.originalRange, this._editors.original);
                const startOffset = originalScrollTop.read(reader);
                const end = computeLineStart(m.lineRangeMapping.modifiedRange, this._editors.modified);
                const endOffset = modifiedScrollTop.read(reader);
                const top = start - startOffset;
                const bottom = end - endOffset;
                const center = (width / 2) - moves.length * 5 + idx * 10;
                idx++;
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', `M ${0} ${top} L ${center} ${top} L ${center} ${bottom} L ${width} ${bottom}`);
                path.setAttribute('fill', 'none');
                element.appendChild(path);
            }
        }));
    }
}
MovedBlocksLinesPart.movedCodeBlockPadding = 4;
