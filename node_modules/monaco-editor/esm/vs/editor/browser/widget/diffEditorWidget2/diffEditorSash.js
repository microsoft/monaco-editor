/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Sash } from '../../../../base/browser/ui/sash/sash.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { autorun, derived, observableValue } from '../../../../base/common/observable.js';
export class DiffEditorSash extends Disposable {
    constructor(_options, _domNode, _dimensions) {
        super();
        this._options = _options;
        this._domNode = _domNode;
        this._dimensions = _dimensions;
        this._sashRatio = observableValue('sashRatio', undefined);
        this.sashLeft = derived('sashLeft', reader => {
            var _a;
            const ratio = (_a = this._sashRatio.read(reader)) !== null && _a !== void 0 ? _a : this._options.splitViewDefaultRatio.read(reader);
            return this._computeSashLeft(ratio, reader);
        });
        this._sash = this._register(new Sash(this._domNode, {
            getVerticalSashTop: (_sash) => 0,
            getVerticalSashLeft: (_sash) => this.sashLeft.get(),
            getVerticalSashHeight: (_sash) => this._dimensions.height.get(),
        }, { orientation: 0 /* Orientation.VERTICAL */ }));
        this._startSashPosition = undefined;
        this._register(this._sash.onDidStart(() => {
            this._startSashPosition = this.sashLeft.get();
        }));
        this._register(this._sash.onDidChange((e) => {
            const contentWidth = this._dimensions.width.get();
            const sashPosition = this._computeSashLeft((this._startSashPosition + (e.currentX - e.startX)) / contentWidth, undefined);
            this._sashRatio.set(sashPosition / contentWidth, undefined);
        }));
        this._register(this._sash.onDidEnd(() => this._sash.layout()));
        this._register(this._sash.onDidReset(() => this._sashRatio.set(undefined, undefined)));
        this._register(autorun('update sash layout', (reader) => {
            const enabled = this._options.enableSplitViewResizing.read(reader);
            this._sash.state = enabled ? 3 /* SashState.Enabled */ : 0 /* SashState.Disabled */;
            this.sashLeft.read(reader);
            this._sash.layout();
        }));
    }
    setBoundarySashes(sashes) {
        this._sash.orthogonalEndSash = sashes.bottom;
    }
    _computeSashLeft(desiredRatio, reader) {
        const contentWidth = this._dimensions.width.read(reader);
        const midPoint = Math.floor(this._options.splitViewDefaultRatio.read(reader) * contentWidth);
        const sashLeft = this._options.enableSplitViewResizing.read(reader) ? Math.floor(desiredRatio * contentWidth) : midPoint;
        const MINIMUM_EDITOR_WIDTH = 100;
        if (contentWidth <= MINIMUM_EDITOR_WIDTH * 2) {
            return midPoint;
        }
        if (sashLeft < MINIMUM_EDITOR_WIDTH) {
            return MINIMUM_EDITOR_WIDTH;
        }
        if (sashLeft > contentWidth - MINIMUM_EDITOR_WIDTH) {
            return contentWidth - MINIMUM_EDITOR_WIDTH;
        }
        return sashLeft;
    }
}
