/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Emitter } from './event.js';
export class IMEImpl {
    constructor() {
        this._onDidChange = new Emitter();
        this.onDidChange = this._onDidChange.event;
        this._enabled = true;
    }
    get enabled() {
        return this._enabled;
    }
    /**
     * Enable IME
     */
    enable() {
        this._enabled = true;
        this._onDidChange.fire();
    }
    /**
     * Disable IME
     */
    disable() {
        this._enabled = false;
        this._onDidChange.fire();
    }
}
export const IME = new IMEImpl();
