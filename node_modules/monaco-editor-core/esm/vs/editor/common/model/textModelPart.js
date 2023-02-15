/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Disposable } from '../../../base/common/lifecycle.js';
export class TextModelPart extends Disposable {
    constructor() {
        super(...arguments);
        this._isDisposed = false;
    }
    dispose() {
        super.dispose();
        this._isDisposed = true;
    }
    assertNotDisposed() {
        if (this._isDisposed) {
            throw new Error('TextModelPart is disposed!');
        }
    }
}
